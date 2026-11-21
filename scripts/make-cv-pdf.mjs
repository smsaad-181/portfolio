#!/usr/bin/env node
/**
 * make-cv-pdf.mjs — export the /resume/ page to public/resume/sultan-mahmud-cv.pdf
 * (A4, print stylesheet) and record today's date in src/data/resume.json
 * ("Last updated" on the page). Run it with the DEV server running (`npm run dev`):
 * the date it stamps must hot-reload into the page before the export. A static
 * `npm run preview` build would still show the previous date. Then rebuild:
 *
 *   npm run cv:pdf                       # default http://localhost:4321/portfolio/resume/
 *   CV_URL=http://localhost:4330/portfolio/resume/ npm run cv:pdf
 *   BROWSER_CHANNEL=chrome npm run cv:pdf  # default msedge
 */
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const url = process.env.CV_URL ?? "http://localhost:4321/portfolio/resume/";
// Output path = the profile's resume field (what the site links to).
const out = path.join("public", JSON.parse(readFileSync("src/content/profile/saad.json", "utf8")).resume.replace(/^\/+/, ""));
const today = new Date().toISOString().slice(0, 10);

// Stamp the date first so the exported page already shows it (dev server hot-reloads).
writeFileSync("src/data/resume.json", JSON.stringify({ updated: today }, null, 2) + "\n");

const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL ?? "msedge", headless: true });
const page = await browser.newPage();
await page.addInitScript(() => { try { localStorage.setItem("theme", "light"); } catch {} });
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(1500); // let the dev server pick up the new date
await page.reload({ waitUntil: "networkidle" });
await page.emulateMedia({ media: "print" });
mkdirSync(path.dirname(out), { recursive: true });
const pdf = await page.pdf({ path: out, format: "A4", printBackground: true, preferCSSPageSize: true });
await browser.close();

const pages = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
console.log(`✓ ${out} — ${pages} A4 page(s), ${(pdf.length / 1024).toFixed(0)} KB, last updated ${today}`);
if (pages > 2) {
  console.error("✗ The CV is longer than 2 pages — shorten the content.");
  process.exit(1);
}
