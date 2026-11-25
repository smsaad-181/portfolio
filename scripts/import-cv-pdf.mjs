#!/usr/bin/env node
/**
 * import-cv-pdf.mjs — publish Saad's own CV PDF (made in LaTeX, D:\CV\CV)
 * as the site's "Download PDF", byte for byte, and stamp "Last updated" on
 * the resume page with the PDF's date.
 *
 *   npm run cv:import -- "D:\CV\CV\Sultan_Mahmud_Saad_CV.pdf"
 *
 * The resume page itself is built from src/content/resume/cv.json — update
 * it to the same text (from main.tex) whenever the CV changes, then compare
 * the page with the PDF. The PDF is public: everything in it goes online.
 */
import { copyFileSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const src = process.argv[2];
if (!src) {
  console.error('Usage: npm run cv:import -- "<path to CV.pdf>"');
  process.exit(1);
}
const bytes = readFileSync(src);
if (bytes.subarray(0, 5).toString("latin1") !== "%PDF-") {
  console.error(`✗ ${src} is not a PDF`);
  process.exit(1);
}

// Destination = the profile's resume field (what every Download button links
// to). It must stay a .pdf inside public/.
const resumeField = JSON.parse(readFileSync("src/content/profile/saad.json", "utf8")).resume;
const out = path.resolve("public", resumeField.replace(/^\/+/, ""));
if (!out.startsWith(path.resolve("public") + path.sep) || path.extname(out).toLowerCase() !== ".pdf") {
  console.error(`✗ profile.resume must be a .pdf path inside public/ (got "${resumeField}")`);
  process.exit(1);
}
mkdirSync(path.dirname(out), { recursive: true });
copyFileSync(src, out);

// The PDF's own date, in local time (Dhaka), as YYYY-MM-DD.
const updated = statSync(src).mtime.toLocaleDateString("en-CA");
writeFileSync("src/data/resume.json", JSON.stringify({ updated }, null, 2) + "\n");

console.log(`✓ ${src} → ${path.relative(process.cwd(), out)} — ${(bytes.length / 1024).toFixed(0)} KB, byte for byte, last updated ${updated}`);
console.log("  Now make src/content/resume/cv.json match the PDF's text, then build.");
