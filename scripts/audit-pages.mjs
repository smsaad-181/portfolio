#!/usr/bin/env node
/**
 * audit-pages.mjs — open every built page in a real browser, in dark and
 * light theme at 1440 px and 375 px, and report:
 *   • console errors / uncaught exceptions
 *   • failed requests (HTTP ≥ 400 or network failure)
 *   • axe-core WCAG 2 AA colour-contrast violations
 *   • every other axe-core WCAG 2.1 A/AA violation (Phase 6: must be 0)
 *
 * Usage:
 *   npm run build:site && npm run preview      (in one terminal)
 *   npm run audit:pages                        (in another)
 *   AUDIT_URL=http://localhost:4321/portfolio/ BROWSER_CHANNEL=msedge|chrome
 *
 * Uses playwright-core with an installed browser (Edge by default — no
 * browser download). Exit code 1 on any console error, failed request,
 * contrast or other axe violation.
 */
import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const BASE_URL = (process.env.AUDIT_URL ?? "http://localhost:4321/portfolio/").replace(/\/?$/, "/");
const CHANNEL = process.env.BROWSER_CHANNEL ?? "msedge";
const AXE_PATH = require.resolve("axe-core/axe.min.js");

/** Page paths relative to the base, from dist/ (Tina admin excluded). */
function pagePaths() {
  const out = [];
  (function walk(dir) {
    for (const name of readdirSync(dir)) {
      const full = path.join(dir, name);
      if (full === path.join(dist, "admin")) continue;
      if (statSync(full).isDirectory()) walk(full);
      else if (name === "index.html") {
        out.push(path.relative(dist, dir).split(path.sep).join("/"));
      }
    }
  })(dist);
  return out.map((p) => (p ? `${p}/` : "")).sort();
}

const pages = [...pagePaths(), "this-page-does-not-exist/"]; // last one exercises 404.html
const themes = ["dark", "light"];
const viewports = [
  { name: "1440", width: 1440, height: 900 },
  { name: "375", width: 375, height: 812 },
];

const browser = await chromium.launch({ channel: CHANNEL, headless: true });
const problems = [];
const otherViolations = new Map(); // rule id → { help, pages:Set }
let runs = 0;

for (const theme of themes) {
  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      reducedMotion: "reduce",
    });
    await context.addInitScript((t) => {
      try { localStorage.setItem("theme", t); } catch {}
    }, theme);

    for (const p of pages) {
      const url = BASE_URL + p;
      const label = `[${theme} ${vp.name}] /${p}`;
      const page = await context.newPage();
      const expect404 = p.startsWith("this-page-does-not-exist");

      page.on("console", (msg) => {
        if (msg.type() !== "error") return;
        // The deliberate visit to a missing page logs its own (correct) 404.
        if (expect404 && /status of 404/.test(msg.text()) && msg.location().url === url) return;
        problems.push({ label, kind: "console", detail: msg.text() });
      });
      page.on("pageerror", (err) => problems.push({ label, kind: "exception", detail: err.message }));
      page.on("requestfailed", (req) =>
        problems.push({ label, kind: "request failed", detail: `${req.url()} (${req.failure()?.errorText})` })
      );
      page.on("response", (res) => {
        const isMainDoc = res.request().isNavigationRequest() && res.url() === url;
        if (res.status() >= 400 && !(expect404 && isMainDoc)) {
          problems.push({ label, kind: `HTTP ${res.status()}`, detail: res.url() });
        }
      });

      await page.goto(url, { waitUntil: "networkidle" });

      // The page must never scroll sideways (phones especially).
      const overflow = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const sw = document.documentElement.scrollWidth;
        return sw > vw ? `${sw}px content in a ${vw}px viewport` : null;
      });
      if (overflow) problems.push({ label, kind: "horizontal overflow", detail: overflow });

      await page.addScriptTag({ path: AXE_PATH });
      const result = await page.evaluate(async () => {
        // @ts-ignore — injected global
        const r = await window.axe.run(document, {
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
        });
        return r.violations.map((v) => ({
          id: v.id,
          help: v.help,
          nodes: v.nodes.map((n) => ({ target: n.target.join(" "), summary: n.failureSummary ?? "" })),
        }));
      });

      for (const v of result) {
        if (v.id === "color-contrast") {
          for (const n of v.nodes) {
            const ratio = n.summary.match(/contrast of ([\d.]+)/)?.[1];
            problems.push({ label, kind: "contrast", detail: `${n.target}${ratio ? ` (${ratio}:1)` : ""}` });
          }
        } else {
          const entry = otherViolations.get(v.id) ?? { help: v.help, pages: new Set() };
          entry.pages.add(`/${p}`);
          otherViolations.set(v.id, entry);
        }
      }
      runs++;
      await page.close();
    }
    await context.close();
  }
}
await browser.close();

console.log(`Audited ${pages.length} pages × ${themes.length} themes × ${viewports.length} viewports = ${runs} page loads\n`);

if (otherViolations.size) {
  console.error("✗ axe violations:");
  for (const [id, v] of otherViolations) console.error(`  • ${id}: ${v.help} — ${[...v.pages].join(", ")}`);
  console.log("");
}

if (problems.length || otherViolations.size) {
  const byKind = Object.groupBy(problems, (x) => x.kind);
  for (const [kind, list] of Object.entries(byKind)) {
    console.error(`✗ ${kind}: ${list.length}`);
    const seen = new Set();
    for (const x of list) {
      const key = `${x.label} ${x.detail}`;
      if (seen.has(key)) continue;
      seen.add(key);
      console.error(`    ${x.label}  ${x.detail}`);
    }
  }
  process.exit(1);
}
console.log("✓ audit:pages — 0 console errors, 0 failed requests, 0 axe violations (WCAG 2.1 A/AA, incl. contrast)");
