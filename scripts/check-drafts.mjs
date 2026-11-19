#!/usr/bin/env node
/**
 * check-drafts.mjs — assert that no `draft: true` project leaks into the
 * production build. Checks dist/ for each draft's title and URL slug (the
 * Tina admin bundle in dist/admin/ is excluded — it legitimately lists all
 * content for editing).
 *
 * Usage: npm run build && npm run check:drafts
 * Exit code 1 if any draft is found in the build output.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const projectsDir = path.join(root, "src", "content", "projects");
const skip = path.join(dist, "admin");

if (!existsSync(dist)) {
  console.error("dist/ not found — run `npm run build` first.");
  process.exit(1);
}

/** Minimal frontmatter reader for the two fields we need. */
function readFrontmatter(file) {
  const src = readFileSync(file, "utf8");
  const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
  const field = (name) =>
    fm.match(new RegExp(`^${name}:\\s*(.+)$`, "m"))?.[1].trim().replace(/^["']|["']$/g, "");
  return { title: field("title"), draft: field("draft") === "true" };
}

const drafts = readdirSync(projectsDir)
  .filter((f) => /\.mdx?$/.test(f))
  .map((f) => ({ slug: f.replace(/\.mdx?$/, ""), ...readFrontmatter(path.join(projectsDir, f)) }))
  .filter((p) => p.draft);

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (full === skip) continue;
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (/\.(html|xml|json|txt)$/.test(name)) yield full;
  }
}

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"');

const leaks = [];
for (const file of walk(dist)) {
  const text = decode(readFileSync(file, "utf8"));
  for (const d of drafts) {
    if (d.title && text.includes(d.title)) leaks.push({ file, draft: d.slug, match: `title "${d.title}"` });
    if (text.includes(`/projects/${d.slug}/`)) leaks.push({ file, draft: d.slug, match: "URL" });
  }
}
for (const d of drafts) {
  if (existsSync(path.join(dist, "projects", d.slug))) {
    leaks.push({ file: `dist/projects/${d.slug}/`, draft: d.slug, match: "page generated" });
  }
}

if (leaks.length) {
  console.error(`✗ ${leaks.length} draft leak(s) in dist/:\n`);
  for (const l of leaks) console.error(`  ${path.relative(root, l.file)}  ←  ${l.draft} (${l.match})`);
  process.exit(1);
}
console.log(`✓ check:drafts — ${drafts.length} draft project(s), none found in dist/`);
