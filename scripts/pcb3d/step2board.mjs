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

const [input, output, bomPath, topPath, botPath, toolsDir, sharpDir, renderPath = "-", pnpPath = "-"] = process.argv.slice(2);
const req = createRequire(path.join(toolsDir, "package.json"));
const occtFactory = req("occt-import-js");
const { Document, NodeIO } = req("@gltf-transform/core");
const { dedup, weld, simplify, meshopt, prune } = req("@gltf-transform/functions");
const { KHRMeshQuantization, EXTMeshoptCompression, EXTTextureWebP } = req("@gltf-transform/extensions");
const { MeshoptSimplifier, MeshoptEncoder } = req("meshoptimizer");
const ExcelJS = req("exceljs");
import { existsSync as exists } from "node:fs";
import { fileURLToPath } from "node:url";
// Per-board corrections Saad confirmed (e.g. LED colours from the silkscreen).
const overridesFile = path.join(path.dirname(fileURLToPath(import.meta.url)), "overrides.json");
const overridesAll = exists(overridesFile) ? JSON.parse(readFileSync(overridesFile, "utf8")) : {};
const overrides = Object.entries(overridesAll).find(([k]) => output.replace(/\\/g, "/").endsWith(k))?.[1] ?? {};
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
  let meta = await sharp(file).metadata();
  let srcImg = file;
  // Some 2D exports put the board inside a wide black margin. Crop it when the
  // cropped area has the board's shape (and the margin is more than a sliver).
  {
    const { info } = await sharp(file).trim({ threshold: 12 }).toBuffer({ resolveWithObject: true });
    const area = (info.width * info.height) / (meta.width * meta.height);
    if (area < 0.9 && Math.abs(info.width / info.height / (bw / bh) - 1) < 0.02) {
      srcImg = await sharp(file).trim({ threshold: 12 }).png().toBuffer();
      meta = await sharp(srcImg).metadata();
      recoloured.push(`${name} margin cropped`);
    }
  }
  let img = sharp(srcImg).resize({ width: 3072, withoutEnlargement: true });
  // Some projects exported the 2D layout and the 3D render with different
  // solder-mask colours; recolour the mask so the 3D board matches the render
  // shown on the same page. Copper, gold pads and white silkscreen are kept.
  if (maskTarget) {
    const src = await maskColour(srcImg);
    const dh = src ? Math.min(Math.abs(src.h - maskTarget.h), 360 - Math.abs(src.h - maskTarget.h)) : 0;
    if (dh > 30) {
      const { data, info } = await img.removeAlpha().raw().toBuffer({ resolveWithObject: true });
      for (let i = 0; i < data.length; i += 3) {
        const [h, s, v] = rgb2hsv(data[i], data[i + 1], data[i + 2]);
        const d = Math.min(Math.abs(h - src.h), 360 - Math.abs(h - src.h));
        if (d < 25 && s > 0.2 && Math.abs(s - src.s) < 0.3) {
          const [r, g, b] = hsv2rgb(maskTarget.h, Math.min(1, s * maskTarget.s / src.s), Math.min(1, v * maskTarget.v / src.v));
          data[i] = r; data[i + 1] = g; data[i + 2] = b;
        }
      }
      img = sharp(data, { raw: { width: info.width, height: info.height, channels: 3 } });
      recoloured.push(`${name} ${src.h}°→${maskTarget.h}°`);
    }
  }
  const webp = await img.webp({ quality: 84 }).toBuffer();
  const { dominant } = await sharp(webp).resize(256).stats();
  return { tex: doc.createTexture(name).setImage(webp).setMimeType("image/webp"), aspect: meta.width / meta.height, dominant };
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
let renderRaw = null;
if (renderPath && renderPath !== "-") {
  const { data, info } = await sharp(renderPath).resize({ width: 1600 }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  renderRaw = { data, w: info.width, h: info.height };
}
// Dominant colour of the render inside a board-coordinate box (mm), optionally only its outer ring.
function sampleRender(lo, hi, ringInner = 0) {
  if (!renderRaw) return null;
  const { data, w, h } = renderRaw;
  const px = (x) => Math.round(((x - bmin[0]) / bw) * (w - 1)), py = (y) => Math.round(((bmax[1] - y) / bh) * (h - 1));
  const x0 = Math.max(0, px(lo[0])), x1 = Math.min(w - 1, px(hi[0])), y0 = Math.max(0, py(hi[1])), y1 = Math.min(h - 1, py(lo[1]));
  if (x1 - x0 < 3 || y1 - y0 < 3) return null;
  const cxp = (x0 + x1) / 2, cyp = (y0 + y1) / 2, ix = ((x1 - x0) / 2) * ringInner, iy = ((y1 - y0) / 2) * ringInner;
  const bins = new Map();
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    if (ringInner && Math.abs(x - cxp) < ix && Math.abs(y - cyp) < iy) continue;
    const i = (y * w + x) * 3, r = data[i], g = data[i + 1], b = data[i + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    if (mx > 225 && mx - mn < 30) continue;                 // white silkscreen / labels
    const k = (r >> 5) * 64 + (g >> 5) * 8 + (b >> 5);
    const e = bins.get(k) ?? { n: 0, r: 0, g: 0, b: 0 };
    e.n++; e.r += r; e.g += g; e.b += b; bins.set(k, e);
  }
  const best = [...bins.values()].sort((a, b) => b.n - a.n)[0];
  if (!best || best.n < 12) return null;
  return [best.r / best.n, best.g / best.n, best.b / best.n].map((v) => Math.pow(v / 255, 2.2));
}
function colourMaterial(rgb, fallback) {
  if (!rgb) return namedMaterial(fallback);
  const key = "pcb-" + rgb.map((v) => v.toFixed(3)).join("-");
  if (!matCache.has(key)) matCache.set(key, doc.createMaterial(key).setBaseColorFactor([...rgb, 1]).setMetallicFactor(0).setRoughnessFactor(0.55));
  return matCache.get(key);
}

// ── Pick & Place: rotation per designator (for parts EasyEDA exported without a model) ──
const pnp = new Map(), pnpLayer = new Map(), pnpMid = new Map();
if (pnpPath && pnpPath !== "-") {
  try {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(pnpPath);
    const ws = wb.worksheets[0];
    const head = ws.getRow(1).values.map((v) => String(v ?? "").trim());
    const cRef = head.indexOf("Designator"), cRot = head.indexOf("Rotation"), cLayer = head.indexOf("Layer"), cX = head.indexOf("Mid X"), cY = head.indexOf("Mid Y");
    const mm = (v) => parseFloat(String(v?.result ?? v ?? "").replace(/mm$/i, ""));
    ws.eachRow((r, i) => {
      if (i <= 1) return;
      const layer = cLayer > 0 ? String(r.getCell(cLayer).value ?? "").trim().toUpperCase() : "";
      pnpLayer.set(String(r.getCell(cRef).value).trim(), layer.startsWith("B") ? "bottom" : layer.startsWith("T") ? "top" : null);
      pnp.set(String(r.getCell(cRef).value).trim(), parseFloat(r.getCell(cRot).value) || 0);
      if (cX > 0 && cY > 0) pnpMid.set(String(r.getCell(cRef).value).trim(), [mm(r.getCell(cX).value), mm(r.getCell(cY).value)]);
    });
  } catch (e) { console.error("P&P read failed:", e.message); }
}
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
  const edgeCol = dom ? [dom.r, dom.g, dom.b].map((v) => Math.pow(v / 255, 2.2) * 0.8)
    : m.color ? m.color.map((v) => Math.pow(v, 2.2)) : [0.03, 0.2, 0.06];          // STEP's solder-mask colour
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

  // Modules with their own PCB (dev boards, OLED/TFT, sensor breakouts, GPS):
  // the PCB colour comes from EasyEDA's render (outer ring of the module's
  // footprint); the PCB layer is found from its large flat underside.
  const MODULES = new Set(["devboard", "devboardBlue", "oled", "tft", "module", "gps"]);
  let pcbMat = null, pcbBand = null, devPieces = null;
  if (MODULES.has(type)) {
    pcbMat = colourMaterial(sampleRender(plo, phi, 0.72), look.low);
    const bins = new Map();
    for (const { pos, idx } of meshes) for (let t = 0; t < idx.length / 3; t++) {
      const [nx, ny, nz0, area] = triNormal(pos, idx, t);
      if (nz0 * (top ? 1 : -1) > -0.95) continue;               // downward-facing in the part's frame
      const zc = (pos[idx[3 * t] * 3 + 2] + pos[idx[3 * t + 1] * 3 + 2] + pos[idx[3 * t + 2] * 3 + 2]) / 3;
      const hb = Math.round(H(zc) * 10);
      if (hb < 0) continue;
      bins.set(hb, (bins.get(hb) ?? 0) + area);
    }
    const best = [...bins.entries()].sort((a, b) => b[1] - a[1])[0];
    if (best) pcbBand = [best[0] / 10 - 0.08, best[0] / 10 + 1.75];
    if (type.startsWith("devboard") && allPieces.length > 3) {
      // Separate pieces: PCB, RF module, header strips, USB, small parts.
      const flat = allPieces.filter((p) => p.ds[0] < 2.2).sort((a, b) => b.ds[1] * b.ds[2] - a.ds[1] * a.ds[2]);
      devPieces = new Map();
      if (flat[0]) devPieces.set(flat[0], "pcb");
      for (const p of allPieces) {
        if (devPieces.has(p)) continue;
        const [a, b, c] = p.ds;
        if (a >= 2.4 && a <= 3.6 && Math.abs(b - 18) < 1.5 && Math.abs(c - 25.5) < 1.5) devPieces.set(p, "rf");
        else if (a <= 2.8 && c >= 10 && b >= 7) devPieces.set(p, "headerBody");
        else if (b >= 6.5 && b <= 8 && c >= 7 && c <= 10 && a >= 2.5 && a <= 4.8) devPieces.set(p, "usb");
      }
    }
  }

  const inner = (c) => Math.abs(c[0] - (plo[0] + phi[0]) / 2) < (phi[0] - plo[0]) * 0.36 && Math.abs(c[1] - (plo[1] + phi[1]) / 2) < (phi[1] - plo[1]) * 0.36;
  for (const { pos, idx, pc, m } of meshes) {
    const regions = new Map(); // material name → tris
    const faceTris = [];
    const add = (name, t) => { if (!regions.has(name)) regions.set(name, []); regions.get(name).push(t); }; // name: material name or material
    for (let t = 0; t < idx.length / 3; t++) {
      const p = pc.out.get(pc.triPiece[t]);
      const v = [0, 1, 2].map((j) => idx[3 * t + j] * 3);
      const c = [0, 1, 2].map((k) => (pos[v[0] + k] + pos[v[1] + k] + pos[v[2] + k]) / 3);
      const h = H(c[2]);
      const nz = triNormal(pos, idx, t)[2] * (top ? 1 : -1);
      const isLargest = p === largest;
      const [d0, d1, d2] = p.ds;
      let region;
      const dev = devPieces?.get(p);
      if (dev && !(d0 < 0.02 && d2 < 4)) {
        if (dev === "pcb") { add(pcbMat, t); continue; }
        if (dev === "rf") { add(h - Math.min(H(p.lo[2]), H(p.hi[2])) < 0.85 ? "pcbDark" : "shield", t); continue; }  // module PCB under its shield
        if (dev === "headerBody") { add("plastic", t); continue; }
        if (dev === "usb") { add("steel", t); continue; }
      }
      if (devPieces && !dev && !(d0 < 0.75 && d1 < 1.6) && !(d2 > 3 * d1 && d1 < 1.6) && h >= -0.05) { add("plastic", t); continue; }
      if (pcbBand && !devPieces && MODULES.has(type) && h >= -0.05 && !(d0 < 0.75 && d1 < 1.6 && !isLargest)) {
        if (h >= pcbBand[0] && h <= pcbBand[1] && Math.abs(nz) < 0.95 || (h >= pcbBand[0] && h <= pcbBand[0] + 0.2 && nz < -0.9) || (Math.abs(h - (pcbBand[0] + 1.67)) < 0.15 && nz > 0.9 && !inner(c))) { add(pcbMat, t); continue; }
        if (h < pcbBand[0]) { add(type === "devboardBlue" || type === "devboard" ? "plastic" : (look.second ?? "plastic"), t); continue; }
      }
      if (d0 < 0.02 && d2 < 4 && allPieces.length > 1) region = CHIP.has(type) ? "body" : "mark";
      else if (h < -0.05) region = "lead";                                              // through the board
      else if (!isLargest && p.vol < 0.5 * largest.vol && ((d0 < 0.75 && d1 < 1.6) || (d2 > 3 * d1 && d1 < 1.6))) region = "lead"; // pins, wires
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
      const prim = doc.createPrimitive().setAttribute("POSITION", posAcc).setIndices(indexAcc(idx, tris)).setMaterial(typeof name === "string" ? namedMaterial(name) : name);
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
// Some exports (EasyEDA Standard) name every placement of a footprint with the
// group's first designator (sixteen 0603 parts all called "R6"). Each placement
// stays its own part; without Pick & Place we cannot tell which is which, so
// the label lists the BOM designators that share the footprint instead.
const children = model.children.filter((c) => c !== boardNode && meshesOf(c).length);
const refCount = new Map();
for (const c of children) { const r = (c.name ?? "").split("~")[0].trim() || "part"; refCount.set(r, (refCount.get(r) ?? 0) + 1); }
const byRef = new Map(), dupGroups = [];
const seenDup = new Map();
for (const c of children) {
  const [ref0, footprint = ""] = (c.name ?? "").split("~");
  const ref = ref0.trim() || "part";
  let key = ref, group = null;
  if (refCount.get(ref) > 1) {
    const k = (seenDup.get(ref) ?? 0) + 1; seenDup.set(ref, k);
    key = `${ref}·${k}`;
    const fpBom = bom.get(ref)?.footprint;
    const refs = fpBom ? [...bom.entries()].filter(([, l]) => l.footprint === fpBom).map(([r]) => r) : [ref];
    group = { refs, footprint: fpBom ?? footprint };
    if (k === 1) dupGroups.push(`${ref}×${refCount.get(ref)}`);
  }
  byRef.set(key, { meshes: meshesOf(c), footprint, baseRef: ref, group });
}
// EasyEDA exports a 0.76 mm cube when a part has no 3D model. Replace it with a
// body of the part's datasheet / footprint size, oriented by Pick & Place.
const SIZES = [
  [/RELAY-TH_SRD|SRD-\d+VDC/i, [19.0, 15.5, 15.3]],           // Songle SRD-xxVDC-SL-C datasheet
  [/_H(\d+(?:\.\d+)?)/i, null],
];
const synthesized = [];
// Fit x_step = sx*x_pnp + tx, y_step = sy*y_pnp + ty from parts present in both.
const stepCentre = (mis) => { const lo = [1e9, 1e9], hi = [-1e9, -1e9]; for (const mi of mis) { const p = result.meshes[mi].attributes.position.array; for (let i = 0; i < p.length; i += 3) for (let k = 0; k < 2; k++) { if (p[i + k] < lo[k]) lo[k] = p[i + k]; if (p[i + k] > hi[k]) hi[k] = p[i + k]; } } return { c: [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2], size: Math.max(hi[0] - lo[0], hi[1] - lo[1]) }; };
let pnpFit = null;
{
  const pairs = [...byRef].filter(([r]) => pnpMid.has(r)).map(([r, e]) => [pnpMid.get(r), stepCentre(e.meshes)]).filter(([, sc]) => sc.size > 1);
  if (pairs.length >= 4) {
    for (const sx of [1, -1]) for (const sy of [1, -1]) {
      const med = (a) => a.sort((x, y) => x - y)[a.length >> 1];
      const tx = med(pairs.map(([p, sc]) => sc.c[0] - sx * p[0])), ty = med(pairs.map(([p, sc]) => sc.c[1] - sy * p[1]));
      const err = med(pairs.map(([p, sc]) => Math.hypot(sc.c[0] - (sx * p[0] + tx), sc.c[1] - (sy * p[1] + ty))));
      if (!pnpFit || err < pnpFit.err) pnpFit = { sx, sy, tx, ty, err };
    }
    if (pnpFit.err > 1.5) pnpFit = null;                    // layouts disagree: don't trust P&P positions
  }
}
// Outline of a part's body in the render: flood-fill similar colour from the centre.
function renderOutline(cx, cy, maxHalf) {
  if (!renderRaw) return null;
  const { data, w, h } = renderRaw;
  const px = (x) => Math.round(((x - bmin[0]) / bw) * (w - 1)), py = (y) => Math.round(((bmax[1] - y) / bh) * (h - 1));
  const x0 = px(cx), y0 = py(cy), rad = Math.ceil((maxHalf / bw) * w);
  const at = (x, y) => (y * w + x) * 3;
  const ref = [0, 1, 2].map((k) => { let sum = 0, n = 0; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { sum += data[at(x0 + dx, y0 + dy) + k]; n++; } return sum / n; });
  const seen = new Uint8Array(w * h), stack = [[x0, y0]];
  let lo = [x0, y0], hi = [x0, y0], n = 0;
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= w || y >= h || Math.abs(x - x0) > rad || Math.abs(y - y0) > rad || seen[y * w + x]) continue;
    seen[y * w + x] = 1;
    const i = at(x, y);
    if (Math.hypot(data[i] - ref[0], data[i + 1] - ref[1], data[i + 2] - ref[2]) > 60) continue;
    n++; lo = [Math.min(lo[0], x), Math.min(lo[1], y)]; hi = [Math.max(hi[0], x), Math.max(hi[1], y)];
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  if (n < 30) return null;
  const mmX = (x) => bmin[0] + (x / (w - 1)) * bw, mmY = (y) => bmax[1] - (y / (h - 1)) * bh;
  return { c: [(mmX(lo[0]) + mmX(hi[0])) / 2, (mmY(lo[1]) + mmY(hi[1])) / 2], d: [mmX(hi[0]) - mmX(lo[0]), mmY(lo[1]) - mmY(hi[1])], colour: ref.map((v) => Math.pow(v / 255, 2.2)) };
}
for (const [ref, entry] of byRef) {
  let lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9];
  for (const mi of entry.meshes) { const p = result.meshes[mi].attributes.position.array; for (let i = 0; i < p.length; i++) { const k = i % 3; if (p[i] < lo[k]) lo[k] = p[i]; if (p[i] > hi[k]) hi[k] = p[i]; } }
  if (Math.max(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]) > 1.0) continue;
  const fpName = entry.footprint, line = bom.get(ref);
  const key = fpName + " " + (line?.name ?? "") + " " + (line?.mpn ?? "");
  let dims = SIZES[0][0].test(key) ? SIZES[0][1] : null;
  if (!dims) {
    const fb = footprintBody(fpName);
    if (!fb) continue;
    const hm = fpName.match(/_H(\d+(?:\.\d+)?)/i);
    // Typical package heights when the footprint name gives none.
    const pkgH = /SOT-23|SOT-323|SC-70|SOD-323/i.test(fpName) ? 1.1 : /SOT-89|SOT-223|SOIC|SOP|SOD-123/i.test(fpName) ? 1.6
      : /QFN|DFN|VSON|WSON/i.test(fpName) ? 0.9 : /^(R|C|L)d{4}|0402|0603|0805|1206/i.test(fpName) ? 0.6 : 3.0;
    dims = [fb.long, fb.short, hm ? parseFloat(hm[1]) : pkgH];
  }
  const rot = ((pnp.get(ref) ?? 0) % 180 + 180) % 180;
  let [dx, dy] = Math.abs(rot - 90) < 1 ? [dims[1], dims[0]] : [dims[0], dims[1]];
  let cx = (lo[0] + hi[0]) / 2, cy = (lo[1] + hi[1]) / 2, how = "placeholder position";
  // EasyEDA puts the placeholder at the footprint origin, not the body centre:
  // use the Pick & Place centre, then the body's outline in the render.
  const pm = pnpMid.get(ref);
  if (pm && pnpFit) { cx = pnpFit.sx * pm[0] + pnpFit.tx; cy = pnpFit.sy * pm[1] + pnpFit.ty; how = "Pick & Place"; }
  const outline = renderOutline(cx, cy, Math.max(dims[0], dims[1]) * 0.75);
  let bodyColour = null;
  if (outline) {
    const fitsA = Math.abs(outline.d[0] - dx) / dx < 0.3 && Math.abs(outline.d[1] - dy) / dy < 0.3;
    const fitsB = Math.abs(outline.d[0] - dy) / dy < 0.3 && Math.abs(outline.d[1] - dx) / dx < 0.3;
    if (fitsA || fitsB) {
      cx = outline.c[0]; cy = outline.c[1]; how += " + render outline"; bodyColour = outline.colour;
      if (fitsB && !fitsA) [dx, dy] = [dy, dx];
    }
  }
  const zMidPart = (lo[2] + hi[2]) / 2, onTop = zMidPart >= zMid;
  const z0 = onTop ? bmax[2] : bmin[2], z1 = onTop ? bmax[2] + dims[2] : bmin[2] - dims[2];
  const X = [cx - dx / 2, cx + dx / 2], Y = [cy - dy / 2, cy + dy / 2], Z = [z0, z1];
  const pos = [], index = [];
  const quad = (a, b, c, d) => { const n = pos.length / 3; pos.push(...a, ...b, ...c, ...d); index.push(n, n + 1, n + 2, n, n + 2, n + 3); };
  const P = (i, j, k) => [X[i], Y[j], Z[k]];
  const up = onTop ? 1 : 0, dn = 1 - up;
  quad(P(0, 0, up), P(1, 0, up), P(1, 1, up), P(0, 1, up));       // top
  quad(P(0, 1, dn), P(1, 1, dn), P(1, 0, dn), P(0, 0, dn));       // bottom
  quad(P(0, 0, dn), P(1, 0, dn), P(1, 0, up), P(0, 0, up));       // sides
  quad(P(1, 0, dn), P(1, 1, dn), P(1, 1, up), P(1, 0, up));
  quad(P(1, 1, dn), P(0, 1, dn), P(0, 1, up), P(1, 1, up));
  quad(P(0, 1, dn), P(0, 0, dn), P(0, 0, up), P(0, 1, up));
  if (!onTop) for (let i = 0; i < index.length; i += 3) [index[i + 1], index[i + 2]] = [index[i + 2], index[i + 1]];
  result.meshes.push({ name: ref, color: null, attributes: { position: { array: pos } }, index: { array: index }, brep_faces: [] });
  entry.meshes = [result.meshes.length - 1];
  entry.synthetic = true;
  entry.bodyColour = bodyColour;
  synthesized.push(`${ref} ${dims.join("×")} mm at ${how}`);
}
const types = {};
let missingBom = [];
for (const [ref, { meshes: mis, footprint }] of byRef) {
  const label = byRef.get(ref).group ? `${byRef.get(ref).group.footprint} part` : ref;
  let zlo = Infinity, zhi = -Infinity;
  for (const mi of mis) { const p = result.meshes[mi].attributes.position.array; for (let i = 2; i < p.length; i += 3) { if (p[i] < zlo) zlo = p[i]; if (p[i] > zhi) zhi = p[i]; } }
  const above = Math.max(0, zhi - zMid), below = Math.max(0, zMid - zlo);
  // Which side? Pick & Place says it directly. Otherwise compare surface area:
  // through-hole legs can stick out further than the body, but have little area.
  let side = pnpLayer.get(ref);
  if (!side) {
    let aUp = 0, aDown = 0;
    for (const mi of mis) {
      const m = result.meshes[mi], p = m.attributes.position.array, ix = m.index.array;
      for (let t = 0; t < ix.length / 3; t++) {
        const [, , , area] = triNormal(p, ix, t);
        const zc = (p[ix[3 * t] * 3 + 2] + p[ix[3 * t + 1] * 3 + 2] + p[ix[3 * t + 2] * 3 + 2]) / 3;
        if (zc > bmax[2]) aUp += area; else if (zc < bmin[2]) aDown += area;
      }
    }
    side = aDown > aUp ? "bottom" : "top";
  }
  const entryR = byRef.get(ref), baseRef = entryR.baseRef ?? ref, group = entryR.group;
  const line = group ? { footprint: group.footprint, name: `one of ${group.refs.join(", ")}` } : bom.get(baseRef);
  if (!bom.get(baseRef) && bom.size) missingBom.push(baseRef);
  const cls = classifyPart(baseRef, group ? bom.get(baseRef) : line, footprint);
  const ov = overrides[baseRef];
  if (ov?.material) cls.o = { ...cls.o, body: ov.material };
  types[cls.type] = (types[cls.type] ?? 0) + 1;
  const node = doc.createNode(ref).setExtras({ ref: label === ref ? ref : `${label} ${ref.split("·")[1]}`, side, h: +Math.max(above, below).toFixed(2), kind: cls.type, ...(line ? { bom: line } : {}), ...(byRef.get(ref).synthetic ? { synthetic: true } : {}), ...(ov?.note ? { note: ov.note } : {}) });
  root.addChild(node);
  await addPart(node, ref, mis, { cls, side, footprint });
}
root.setExtras({ boardMm: [bw, bh, bmax[2] - bmin[2]].map((v) => +v.toFixed(2)), parts: byRef.size });

await MeshoptSimplifier.ready;
await MeshoptEncoder.ready;
doc.createExtension(EXTTextureWebP).setRequired(true);
await doc.transform(
  dedup(), weld(),
  simplify({ simplifier: MeshoptSimplifier, ratio: 0.55, error: 0.0004 }),   // gentler: fewer facets on small round parts
  prune({ keepLeaves: false, keepExtras: true }),
  meshopt({ encoder: MeshoptEncoder, level: "medium" }),                      // quantize + EXT_meshopt_compression
);
const io = new NodeIO().registerExtensions([KHRMeshQuantization, EXTMeshoptCompression, EXTTextureWebP]).registerDependencies({ "meshopt.encoder": MeshoptEncoder });
writeFileSync(output, await io.writeBinary(doc));
const mb = (b) => (b / 1048576).toFixed(1) + " MB";
const aspect = bw / bh;
const texNote = texTop ? ` tex ${Math.abs(texTop.aspect / aspect - 1) > 0.02 ? "⚠ MISMATCH" : "ok"}` : " no texture";
console.log(`${path.basename(input)}: ${byRef.size} parts, ${triangles} tris,${texNote} → ${mb(statSync(output).size)} in ${((Date.now() - t0) / 1000).toFixed(1)} s · ${Object.entries(types).map(([k, v]) => `${k}:${v}`).join(" ")}${missingBom.length ? ` · not in BOM: ${missingBom.join(" ")}` : ""}${recoloured.length ? ` · mask recoloured: ${recoloured.join(", ")}` : ""}${synthesized.length ? ` · built from datasheet: ${synthesized.join(", ")}` : ""}${dupGroups.length ? ` · duplicate names split: ${dupGroups.join(" ")}` : ""}`);
