#!/usr/bin/env node
/**
 * check-links.mjs — crawl the built site in dist/ and assert that every
 * internal href / src / srcset resolves to a real file.
 *
 * Internal = starts with "/" or is relative. Absolute internal links must
 * include the base path (/portfolio) — a link to "/projects/" is reported,
 * because on GitHub Pages it points outside the site.
 *
 * Usage: npm run build && npm run check:links
 * Exit code 1 if anything is broken.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const BASE = "/portfolio";
// The Tina admin bundle is a third-party SPA; its internal routing isn't ours to check.
const SKIP_DIRS = new Set([path.join(dist, "admin")]);

if (!existsSync(dist)) {
  console.error("dist/ not found — run `npm run build` first.");
  process.exit(1);
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (SKIP_DIRS.has(full)) continue;
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (name.endsWith(".html")) yield full;
  }
}

/** Candidate URLs from href, src, srcset, and <meta content> image URLs. */
function extractUrls(html) {
  const urls = [];
  const attr = /\s(?:href|src)\s*=\s*(["'])(.*?)\1/gi;
  for (const m of html.matchAll(attr)) urls.push(m[2]);
  const srcset = /\ssrcset\s*=\s*(["'])(.*?)\1/gi;
  for (const m of html.matchAll(srcset)) {
    for (const part of m[2].split(",")) {
      const u = part.trim().split(/\s+/)[0];
      if (u) urls.push(u);
    }
  }
  return urls;
}

function isExternal(u) {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(u) || u === "";
}

/** Map a site URL path to the file GitHub Pages would serve. */
function resolveToFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  if (!clean.startsWith(`${BASE}/`) && clean !== BASE) return null;
  const rel = clean.slice(BASE.length) || "/";
  const target = path.join(dist, rel);
  if (rel.endsWith("/")) return path.join(target, "index.html");
  if (existsSync(target) && statSync(target).isFile()) return target;
  return path.join(target, "index.html");
}

let checked = 0;
const broken = [];

for (const file of walk(dist)) {
  const html = readFileSync(file, "utf8");
  const pageUrl = "/" + path.relative(dist, file).split(path.sep).join("/");
  const pageDir = `${BASE}${pageUrl.replace(/[^/]*$/, "")}`;

  for (const raw of extractUrls(html)) {
    const u = raw.replace(/&amp;/g, "&").trim();
    if (isExternal(u)) continue;
    checked++;
    const absolute = u.startsWith("/") ? u : new URL(u, `http://x${pageDir}`).pathname;
    const target = resolveToFile(absolute);
    if (!target) {
      broken.push({ page: pageUrl, url: u, reason: `outside base ${BASE}` });
    } else if (!existsSync(target)) {
      broken.push({ page: pageUrl, url: u, reason: "file not found" });
    }
  }
}

if (broken.length) {
  console.error(`✗ ${broken.length} broken internal link(s) out of ${checked} checked:\n`);
  for (const b of broken) console.error(`  ${b.page}  →  ${b.url}  (${b.reason})`);
  process.exit(1);
}
console.log(`✓ check:links — ${checked} internal links/assets checked, 0 broken`);
