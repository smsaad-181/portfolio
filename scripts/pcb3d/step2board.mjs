// STEP → GLB for the portfolio's interactive board viewer.
// Usage: node step2board.mjs <input.step> <output.glb> <bom.md|-> <top2d.png|-> <bottom2d.png|-> <tools-dir> <sharp-project-dir>
//
// Every placed part is its own node, named by its reference designator
// (EasyEDA names STEP products "REF~footprint~…"), with its BOM line in node
// extras. The bare board carries the real top/bottom 2D layout as texture.
// Because EasyEDA's STEP export has almost no colours, every part gets
// realistic materials from its type (see part-looks.mjs): its pieces and
// triangles are sorted into body / leads / plates / markings / module PCB /
// display face, the way the Clock documentation's 3D model looks.
import { readFileSync, writeFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { classifyPart, footprintBody, LOOKS, linear, segmentSvg } from "./part-looks.mjs";

const [input, output, bomPath, topPath, botPath, toolsDir, sharpDir, renderPath = "-"] = process.argv.slice(2);
const req = createRequire(path.join(toolsDir, "package.json"));
const occtFactory = req("occt-import-js");
const { Document, NodeIO } = req("@gltf-transform/core");
const { dedup, weld, simplify, quantize, prune } = req("@gltf-transform/functions");
const { KHRMeshQuantization } = req("@gltf-transform/extensions");
const { MeshoptSimplifier } = req("meshoptimizer");
const sharp = createRequire(path.join(sharpDir, "package.json"))("sharp");

// ── BOM: designator → line ────────────────────────────────────────────────
const bom = new Map();
if (bomPath && bomPath !== "-") {
  const lines = readFileSync(bomPath, "utf8").split(/\r?\n/).filter((l) => l.startsWith("|"));
  const head = lines[0].split("|").map((s) => s.trim());
  const col = (n) => head.indexOf(n);
  const clean = (s) => (s ?? "").replace(/[（(][^)）]*[　-鿿][^)）]*[)）]/g, "").trim();
  for (const l of lines.slice(2)) {
    const c = l.split("|").map((s) => s.trim());
    const line = {
      name: clean(c[col("Comment")]), value: clean(c[col("Value")]), footprint: clean(c[col("Footprint")]),
      mpn: clean(c[col("Manufacturer Part")]), maker: clean(c[col("Manufacturer")]),
    };
    for (const ref of (c[col("Designator")] ?? "").split(/[,\s]+/).filter(Boolean)) bom.set(ref, line);
  }
}

// ── STEP ──────────────────────────────────────────────────────────────────
const t0 = Date.now();
const occt = await occtFactory();
const result = occt.ReadStepFile(new Uint8Array(readFileSync(input)), {
  linearUnit: "millimeter", linearDeflectionType: "bounding_box_ratio", linearDeflection: 0.002, angularDeflection: 0.6,
});
if (!result.success) throw new Error("STEP read failed: " + input);
function findModel(n) {
  if ((n.children ?? []).some((c) => /^Board(~|$)/.test(c.name ?? ""))) return n;
  for (const c of n.children ?? []) { const f = findModel(c); if (f) return f; }
  return null;
}
const model = findModel(result.root);
if (!model) throw new Error("No EasyEDA Board node in " + input);
const meshesOf = (n) => [...(n.meshes ?? []), ...(n.children ?? []).flatMap(meshesOf)];
const boardNode = model.children.find((c) => /^Board(~|$)/.test(c.name));
const bmin = [Infinity, Infinity, Infinity], bmax = [-Infinity, -Infinity, -Infinity];
for (const mi of meshesOf(boardNode)) {
  const p = result.meshes[mi].attributes.position.array;
  for (let i = 0; i < p.length; i++) { const k = i % 3; if (p[i] < bmin[k]) bmin[k] = p[i]; if (p[i] > bmax[k]) bmax[k] = p[i]; }
}
const bw = bmax[0] - bmin[0], bh = bmax[1] - bmin[1], zMid = (bmin[2] + bmax[2]) / 2;

// ── glTF document + materials ─────────────────────────────────────────────
const doc = new Document();
const buffer = doc.createBuffer();
const matCache = new Map();
function namedMaterial(name) {
  if (matCache.has(name)) return matCache.get(name);
  const m = linear(name);
  const mat = doc.createMaterial(name).setBaseColorFactor([...m.color, m.alpha ?? 1]).setMetallicFactor(m.metallic).setRoughnessFactor(m.roughness);
  if (m.alpha && m.alpha < 1) mat.setAlphaMode("BLEND");
  if (m.glow) mat.setEmissiveFactor(m.color.map((v) => v * m.glow));
  matCache.set(name, mat);
  return mat;
}
async function texture(file, name) {
  if (!file || file === "-") return null;
  const meta = await sharp(file).metadata();
  let img = sharp(file).resize({ width: 2048, withoutEnlargement: true });
  // Some projects exported the 2D layout and the 3D render with different
  // solder-mask colours; recolour the mask so the 3D board matches the render
  // shown on the same page. Copper, gold pads and white silkscreen are kept.
  if (maskTarget) {
    const src = await maskColour(file);
    const dh = src ? Math.min(Math.abs(src.h - maskTarget.h), 360 - Math.abs(src.h - maskTarget.h)) : 0;
    if (dh > 30) {
      const { data, info } = await img.removeAlpha().raw().toBuffer({ resolveWithObject: true });
      for (let i = 0; i < data.length; i += 3) {
        const [h, s, v] = rgb2hsv(data[i], data[i + 1], data[i + 2]);
        const d = Math.min(Math.abs(h - src.h), 360 - Math.abs(h - src.h));
        if (d < 40 && s > 0.2) {
          const [r, g, b] = hsv2rgb(maskTarget.h, Math.min(1, s * maskTarget.s / src.s), Math.min(1, v * maskTarget.v / src.v));
          data[i] = r; data[i + 1] = g; data[i + 2] = b;
        }
      }
      img = sharp(data, { raw: { width: info.width, height: info.height, channels: 3 } });
      recoloured.push(`${name} ${src.h}°→${maskTarget.h}°`);
    }
  }
  const jpg = await img.jpeg({ quality: 84, mozjpeg: true }).toBuffer();
  const { dominant } = await sharp(jpg).resize(256).stats();
  return { tex: doc.createTexture(name).setImage(jpg).setMimeType("image/jpeg"), aspect: meta.width / meta.height, dominant };
}
function rgb2hsv(R, G, B) {
  const r = R / 255, g = G / 255, b = B / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0;
  if (d) h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [(h * 60 + 360) % 360, mx ? d / mx : 0, mx];
}
function hsv2rgb(h, s, v) {
  const f = (n) => { const k = (n + h / 60) % 6; return Math.round(255 * (v - v * s * Math.max(0, Math.min(k, 4 - k, 1)))); };
  return [f(5), f(3), f(1)];
}
// Median hue/saturation/value of the dominant saturated colour (the solder mask).
async function maskColour(file) {
  const { data } = await sharp(file).resize(240, 240, { fit: "inside" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const bins = Array.from({ length: 36 }, () => []);
  for (let i = 0; i < data.length; i += 3) {
    const hsv = rgb2hsv(data[i], data[i + 1], data[i + 2]);
    if (hsv[1] >= 0.35 && hsv[2] >= 0.2 && hsv[2] <= 0.85) bins[Math.floor(hsv[0] / 10)].push(hsv); // solder mask is never this bright (relays, LEDs are)
  }
  const best = bins.reduce((a, b) => (b.length > a.length ? b : a));
  if (best.length < 50) return null;
  const med = (k) => best.map((x) => x[k]).sort((a, b) => a - b)[best.length >> 1];
  return { h: Math.round(med(0)), s: med(1), v: med(2) };
}
const recoloured = [];
const maskTarget = renderPath && renderPath !== "-" ? await maskColour(renderPath) : null;
const texTop = await texture(topPath, "top"), texBot = await texture(botPath, "bottom");
const faceTextures = new Map();
async function faceMaterial(digits) {
  if (faceTextures.has(digits)) return faceTextures.get(digits);
  const png = await sharp(Buffer.from(segmentSvg(digits))).png().toBuffer();
  const tex = doc.createTexture(`segments-${digits}`).setImage(png).setMimeType("image/png");
  const mat = doc.createMaterial(`display-face-${digits}`).setBaseColorTexture(tex).setEmissiveTexture(tex)
    .setEmissiveFactor([0.75, 0.75, 0.75]).setRoughnessFactor(0.3).setMetallicFactor(0);
  const out = { mat, aspect: (240 * digits) / 340 };
  faceTextures.set(digits, out);
  return out;
}

const root = doc.createNode("pcb").setScale([0.001, 0.001, 0.001]).setRotation([-Math.SQRT1_2, 0, 0, Math.SQRT1_2]);
doc.createScene("scene").addChild(root);
let triangles = 0;

// ── bare board ────────────────────────────────────────────────────────────
function addBoardMesh(parent, m) {
  const pos = new Float32Array(m.attributes.position.array);
  const nrm = m.attributes.normal ? new Float32Array(m.attributes.normal.array) : null;
  const idx = new Uint32Array(m.index.array);
  triangles += idx.length / 3;
  const mesh = doc.createMesh("Board");
  const posAcc = doc.createAccessor().setType("VEC3").setArray(pos).setBuffer(buffer);
  const nrmAcc = nrm ? doc.createAccessor().setType("VEC3").setArray(nrm).setBuffer(buffer) : null;
  const top = [], bot = [], edge = [];
  for (let t = 0; t < idx.length / 3; t++) {
    const z = triNormal(pos, idx, t)[2];
    (z > 0.5 ? top : z < -0.5 ? bot : edge).push(t);
  }
  const nV = pos.length / 3, uvTop = new Float32Array(nV * 2), uvBot = new Float32Array(nV * 2);
  for (let i = 0; i < nV; i++) {
    const u = (pos[3 * i] - bmin[0]) / bw, v = (bmax[1] - pos[3 * i + 1]) / bh;
    uvTop[2 * i] = u; uvTop[2 * i + 1] = v; uvBot[2 * i] = 1 - u; uvBot[2 * i + 1] = v;
  }
  const dom = texTop?.dominant;
  const edgeCol = dom ? [dom.r, dom.g, dom.b].map((v) => Math.pow(v / 255, 2.2) * 0.8) : [0.03, 0.2, 0.06];
  const edgeMat = doc.createMaterial("board-edge").setBaseColorFactor([...edgeCol, 1]).setRoughnessFactor(0.6).setMetallicFactor(0);
  const texMat = (t, name) => doc.createMaterial(name).setBaseColorTexture(t.tex).setRoughnessFactor(0.62).setMetallicFactor(0.05);
  const prim = (tris, mat, uv) => {
    if (!tris.length) return;
    const p = doc.createPrimitive().setAttribute("POSITION", posAcc).setIndices(indexAcc(idx, tris)).setMaterial(mat);
    if (nrmAcc) p.setAttribute("NORMAL", nrmAcc);
    if (uv) p.setAttribute("TEXCOORD_0", doc.createAccessor().setType("VEC2").setArray(uv).setBuffer(buffer));
    mesh.addPrimitive(p);
  };
  prim(top, texTop ? texMat(texTop, "board-top") : edgeMat, texTop ? uvTop : null);
  prim(bot, texBot ? texMat(texBot, "board-bottom") : edgeMat, texBot ? uvBot : null);
  prim(edge, edgeMat);
  parent.addChild(doc.createNode("Board-mesh").setMesh(mesh));
}
function triNormal(pos, idx, t) {
  const a = idx[3 * t] * 3, b = idx[3 * t + 1] * 3, c = idx[3 * t + 2] * 3;
  const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2];
  const vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1], vz = pos[c + 2] - pos[a + 2];
  const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, L = Math.hypot(nx, ny, nz) || 1;
  return [nx / L, ny / L, nz / L, L / 2];
}
function indexAcc(idx, tris) {
  const sub = new Uint32Array(tris.length * 3);
  tris.forEach((t, i) => { sub[i * 3] = idx[t * 3]; sub[i * 3 + 1] = idx[t * 3 + 1]; sub[i * 3 + 2] = idx[t * 3 + 2]; });
  return doc.createAccessor().setType("SCALAR").setArray(sub).setBuffer(buffer);
}

// ── parts ─────────────────────────────────────────────────────────────────
// Connected pieces of one mesh (vertices merged by position).
function pieces(pos, idx) {
  const nV = pos.length / 3, key = new Map(), canon = new Int32Array(nV);
  for (let i = 0; i < nV; i++) {
    const k = `${Math.round(pos[3 * i] * 500)},${Math.round(pos[3 * i + 1] * 500)},${Math.round(pos[3 * i + 2] * 500)}`;
    if (!key.has(k)) key.set(k, key.size);
    canon[i] = key.get(k);
  }
  const par = Int32Array.from({ length: key.size }, (_, i) => i);
  const find = (x) => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
  for (let t = 0; t < idx.length; t += 3) {
    const a = find(canon[idx[t]]), b = find(canon[idx[t + 1]]); if (a !== b) par[b] = a;
    const c = find(canon[idx[t + 2]]), a2 = find(a); if (c !== a2) par[c] = a2;
  }
  const out = new Map(), triPiece = new Int32Array(idx.length / 3);
  for (let t = 0; t < idx.length / 3; t++) {
    const r = find(canon[idx[3 * t]]);
    if (!out.has(r)) out.set(r, { lo: [1e9, 1e9, 1e9], hi: [-1e9, -1e9, -1e9] });
    const o = out.get(r);
    for (let j = 0; j < 3; j++) { const v = idx[3 * t + j] * 3; for (let k = 0; k < 3; k++) { const x = pos[v + k]; if (x < o.lo[k]) o.lo[k] = x; if (x > o.hi[k]) o.hi[k] = x; } }
    triPiece[t] = r;
  }
  return { out, triPiece };
}

const CHIP = new Set(["chipR", "chipC", "chipL"]);
const LOWSPLIT = { rfModule: 0.9, gps: 1.0, module: 1.2, devboard: 1.7, devboardBlue: 1.7, capElecSmd: 0.6, crystal: 0.5, usb: 0 };

async function addPart(node, ref, meshIdx, info) {
  const { type, o: over, digits } = info.cls;
  const look = { ...LOOKS[type], ...over };
  const top = info.side === "top";
  const H = (z) => (top ? z - bmax[2] : bmin[2] - z);             // height above the board surface on the part's side
  const fpBody = footprintBody(info.footprint);

  // Collect pieces over all meshes of this part.
  const meshes = meshIdx.map((mi) => {
    const m = result.meshes[mi];
    const pos = new Float32Array(m.attributes.position.array), idx = new Uint32Array(m.index.array);
    const pc = pieces(pos, idx);
    return { m, pos, idx, pc };
  });
  const allPieces = meshes.flatMap((x) => [...x.pc.out.values()]);
  for (const p of allPieces) { p.d = p.hi.map((h, k) => h - p.lo[k]); p.ds = [...p.d].sort((a, b) => a - b); p.vol = p.d[0] * p.d[1] * p.d[2]; }
  const largest = allPieces.reduce((a, b) => (b.vol > a.vol ? b : a));
  const plo = [0, 1, 2].map((k) => Math.min(...allPieces.map((p) => p.lo[k]))), phi = [0, 1, 2].map((k) => Math.max(...allPieces.map((p) => p.hi[k])));
  const cx = (largest.lo[0] + largest.hi[0]) / 2, cy = (largest.lo[1] + largest.hi[1]) / 2;
  const longX = largest.d[0] >= largest.d[1];
  const hTop = Math.max(H(plo[2]), H(phi[2]));
  const minH = Math.min(H(plo[2]), H(phi[2]));

  // Body footprint box (TH parts whose footprint names the body size).
  const box = fpBody && !CHIP.has(type) ? {
    hx: (longX ? fpBody.long : fpBody.short) / 2 + 0.3, hy: (longX ? fpBody.short : fpBody.long) / 2 + 0.3,
  } : null;
  const inBox = (x, y) => !box || (Math.abs(x - cx) <= box.hx && Math.abs(y - cy) <= box.hy);

  // Body bottom: lowest height at which the part's cross-section is still wide
  // (legs are thin). Only meaningful when the part reaches down to the board.
  let bodyBottom = -Infinity;
  if (!CHIP.has(type) && minH < 0.3 && !LOWSPLIT[type]) {
    const step = 0.2, nS = Math.max(1, Math.ceil(hTop / step)), per = new Float64Array(nS + 1);
    for (const { pos, idx } of meshes) {
      for (let t = 0; t < idx.length / 3; t++) {
        const v = [0, 1, 2].map((j) => idx[3 * t + j] * 3);
        const hs = v.map((a) => H(pos[a + 2]));
        const cxT = (pos[v[0]] + pos[v[1]] + pos[v[2]]) / 3, cyT = (pos[v[0] + 1] + pos[v[1] + 1] + pos[v[2] + 1]) / 3;
        if (!inBox(cxT, cyT)) continue;
        const lo = Math.min(...hs), hi = Math.max(...hs);
        for (let s = Math.max(0, Math.ceil(lo / step)); s <= Math.min(nS, Math.floor(hi / step)); s++) {
          const h = s * step, P = [];
          for (let e = 0; e < 3; e++) {
            const i = e, j = (e + 1) % 3, hi_ = hs[i], hj = hs[j];
            if ((hi_ - h) * (hj - h) < 0) { const f = (h - hi_) / (hj - hi_); P.push([pos[v[i]] + f * (pos[v[j]] - pos[v[i]]), pos[v[i] + 1] + f * (pos[v[j] + 1] - pos[v[i] + 1])]); }
          }
          if (P.length === 2) per[s] += Math.hypot(P[0][0] - P[1][0], P[0][1] - P[1][1]);
        }
      }
    }
    const max = Math.max(...per);
    let s = nS;
    while (s > 0 && per[s] < 0.45 * max) s--;                // skip the very top cap
    let miss = 0;
    for (; s >= 0; s--) { if (per[s] < 0.4 * max) { if (++miss >= 2) break; } else miss = 0; }
    bodyBottom = Math.max(0, (s + 2) * 0.2 - 0.1);
    if (bodyBottom > hTop * 0.8) bodyBottom = -Infinity;         // nothing sensible found
  }

  const lowCut = LOWSPLIT[type] != null ? minH + LOWSPLIT[type] : null;
  const face = type === "display7" ? await faceMaterial(digits) : null;

  for (const { pos, idx, pc, m } of meshes) {
    const regions = new Map(); // material name → tris
    const faceTris = [];
    const add = (name, t) => { if (!regions.has(name)) regions.set(name, []); regions.get(name).push(t); };
    for (let t = 0; t < idx.length / 3; t++) {
      const p = pc.out.get(pc.triPiece[t]);
      const v = [0, 1, 2].map((j) => idx[3 * t + j] * 3);
      const c = [0, 1, 2].map((k) => (pos[v[0] + k] + pos[v[1] + k] + pos[v[2] + k]) / 3);
      const h = H(c[2]);
      const nz = triNormal(pos, idx, t)[2] * (top ? 1 : -1);
      const isLargest = p === largest;
      const [d0, d1, d2] = p.ds;
      let region;
      if (d0 < 0.02 && d2 < 4 && allPieces.length > 1) region = CHIP.has(type) ? "body" : "mark";
      else if (h < -0.05) region = "lead";                                              // through the board
      else if (!isLargest && ((d0 < 0.75 && d1 < 1.6) || (d2 > 3 * d1 && d1 < 1.6))) region = "lead"; // pins, wires
      else if (!isLargest && d0 < 0.4 && !CHIP.has(type)) region = "plate";               // sheet metal
      else if (CHIP.has(type) || type === "ledSmd") {
        const along = longX ? (c[0] - cx) / (largest.d[0] || 1) : (c[1] - cy) / (largest.d[1] || 1);
        if (type === "ledSmd") region = h > hTop * 0.55 ? "body" : Math.abs(along) > 0.3 ? "lead" : "low";
        else region = Math.abs(along) > 0.3 ? "lead" : "body";
      } else if (face && nz > 0.9 && h > hTop - 0.35) { faceTris.push(t); continue; }
      else if (box && !inBox(c[0], c[1])) region = "lead";
      else if (h < bodyBottom) region = "lead";
      else if (lowCut != null && h < lowCut && type !== "usb") region = "low";
      else if (type === "usb" && !isLargest) region = "low";
      else if (!isLargest && look.second) region = "second";
      else region = "body";
      add(look[region] ?? (region === "mark" ? "marking" : region === "lead" ? "tin" : region === "plate" ? (look.lead ?? "tin") : look.body), t);
    }

    const mesh = doc.createMesh(ref);
    const posAcc = doc.createAccessor().setType("VEC3").setArray(pos).setBuffer(buffer);
    const nrm = m.attributes.normal ? doc.createAccessor().setType("VEC3").setArray(new Float32Array(m.attributes.normal.array)).setBuffer(buffer) : null;
    for (const [name, tris] of regions) {
      const prim = doc.createPrimitive().setAttribute("POSITION", posAcc).setIndices(indexAcc(idx, tris)).setMaterial(namedMaterial(name));
      if (nrm) prim.setAttribute("NORMAL", nrm);
      mesh.addPrimitive(prim);
    }
    if (faceTris.length) {
      // Map the display's top face onto the segment image; digits stand along the longer side for 1 digit.
      const wAlongX = face.aspect < 1 ? !longX : longX;
      const nV = pos.length / 3, uv = new Float32Array(nV * 2);
      const [x0, x1, y0, y1] = [largest.lo[0], largest.hi[0], largest.lo[1], largest.hi[1]];
      for (let i = 0; i < nV; i++) {
        const x = pos[3 * i], y = pos[3 * i + 1];
        let u = wAlongX ? (x - x0) / (x1 - x0) : (y - y0) / (y1 - y0);
        const v = wAlongX ? (y1 - y) / (y1 - y0) : (x1 - x) / (x1 - x0);
        if (!top) u = 1 - u;
        uv[2 * i] = Math.min(1, Math.max(0, u)); uv[2 * i + 1] = Math.min(1, Math.max(0, v));
      }
      const prim = doc.createPrimitive().setAttribute("POSITION", posAcc).setIndices(indexAcc(idx, faceTris)).setMaterial(face.mat)
        .setAttribute("TEXCOORD_0", doc.createAccessor().setType("VEC2").setArray(uv).setBuffer(buffer));
      if (nrm) prim.setAttribute("NORMAL", nrm);
      mesh.addPrimitive(prim);
    }
    triangles += idx.length / 3;
    node.addChild(doc.createNode(ref + "-mesh").setMesh(mesh));
  }
}

const boardGltf = doc.createNode("Board").setExtras({ board: true, size: [bw, bh, bmax[2] - bmin[2]].map((v) => +v.toFixed(2)) });
root.addChild(boardGltf);
for (const mi of meshesOf(boardNode)) addBoardMesh(boardGltf, result.meshes[mi]);

// Group STEP children by designator first (a ref can appear more than once).
const byRef = new Map();
for (const c of model.children) {
  if (c === boardNode) continue;
  const mis = meshesOf(c);
  if (!mis.length) continue;
  const [ref0, footprint = ""] = (c.name ?? "").split("~");
  const ref = ref0.trim() || "part";
  if (!byRef.has(ref)) byRef.set(ref, { meshes: [], footprint });
  byRef.get(ref).meshes.push(...mis);
}
const types = {};
let missingBom = [];
for (const [ref, { meshes: mis, footprint }] of byRef) {
  let zlo = Infinity, zhi = -Infinity;
  for (const mi of mis) { const p = result.meshes[mi].attributes.position.array; for (let i = 2; i < p.length; i += 3) { if (p[i] < zlo) zlo = p[i]; if (p[i] > zhi) zhi = p[i]; } }
  const above = Math.max(0, zhi - zMid), below = Math.max(0, zMid - zlo);
  const side = below > above ? "bottom" : "top";
  const line = bom.get(ref);
  if (!line && bom.size) missingBom.push(ref);
  const cls = classifyPart(ref, line, footprint);
  types[cls.type] = (types[cls.type] ?? 0) + 1;
  const node = doc.createNode(ref).setExtras({ ref, side, h: +Math.max(above, below).toFixed(2), kind: cls.type, ...(line ? { bom: line } : {}) });
  root.addChild(node);
  await addPart(node, ref, mis, { cls, side, footprint });
}
root.setExtras({ boardMm: [bw, bh, bmax[2] - bmin[2]].map((v) => +v.toFixed(2)), parts: byRef.size });

await MeshoptSimplifier.ready;
doc.createExtension(KHRMeshQuantization).setRequired(true);
await doc.transform(dedup(), weld(), simplify({ simplifier: MeshoptSimplifier, ratio: 0.35, error: 0.0008 }), quantize(), prune({ keepLeaves: false, keepExtras: true }));
const io = new NodeIO().registerExtensions([KHRMeshQuantization]);
writeFileSync(output, await io.writeBinary(doc));
const mb = (b) => (b / 1048576).toFixed(1) + " MB";
const aspect = bw / bh;
const texNote = texTop ? ` tex ${Math.abs(texTop.aspect / aspect - 1) > 0.02 ? "⚠ MISMATCH" : "ok"}` : " no texture";
console.log(`${path.basename(input)}: ${byRef.size} parts, ${triangles} tris,${texNote} → ${mb(statSync(output).size)} in ${((Date.now() - t0) / 1000).toFixed(1)} s · ${Object.entries(types).map(([k, v]) => `${k}:${v}`).join(" ")}${missingBom.length ? ` · not in BOM: ${missingBom.join(" ")}` : ""}${recoloured.length ? ` · mask recoloured: ${recoloured.join(", ")}` : ""}`);
