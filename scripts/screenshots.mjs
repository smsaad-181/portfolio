#!/usr/bin/env node
/**
 * screenshots.mjs — full-page screenshots of every built page at 375, 768
 * and 1440 px, in dark and light theme, for design review.
 *
 * Usage:
 *   npm run build:site && npm run preview      (one terminal)
 *   npm run screenshots                        (another)
 *   AUDIT_URL=http://localhost:4321/portfolio/ BROWSER_CHANNEL=msedge|chrome
 *
 * Output: docs/screenshots/<theme>-<width>/<page>.png (git-ignored).
 */
import { mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const outDir = path.join(root, "docs", "screenshots");
const BASE_URL = (process.env.AUDIT_URL ?? "http://localhost:4321/portfolio/").replace(/\/?$/, "/");
const CHANNEL = process.env.BROWSER_CHANNEL ?? "msedge";

function pagePaths() {
  const out = [];
  (function walk(dir) {
    for (const name of readdirSync(dir)) {
      const full = path.join(dir, name);
      if (full === path.join(dist, "admin")) continue;
      if (statSync(full).isDirectory()) walk(full);
      else if (name === "index.html") out.push(path.relative(dist, dir).split(path.sep).join("/"));
    }
  })(dist);
  return [...out.map((p) => (p ? `${p}/` : "")).sort(), "this-page-does-not-exist/"];
}

const widths = [375, 768, 1440];
const themes = ["dark", "light"];
const browser = await chromium.launch({ channel: CHANNEL, headless: true });
let count = 0;

for (const theme of themes) {
  for (const width of widths) {
    const dir = path.join(outDir, `${theme}-${width}`);
    mkdirSync(dir, { recursive: true });
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    await context.addInitScript((t) => {
      try { localStorage.setItem("theme", t); } catch {}
    }, theme);
    for (const p of pagePaths()) {
      const page = await context.newPage();
      await page.goto(BASE_URL + p, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const name = (p.replace(/\/$/, "").replace(/\//g, "__") || "home") + ".png";
      await page.screenshot({ path: path.join(dir, name), fullPage: true });
      await page.close();
      count++;
    }
    await context.close();
  }
}
await browser.close();
console.log(`✓ screenshots — ${count} images in ${path.relative(root, outDir)}/`);
