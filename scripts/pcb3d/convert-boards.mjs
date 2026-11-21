// Re-convert every board in pcbfacts/manifest.json with step2board.mjs
// (per-part nodes + BOM extras + 2D layout textures), 3 at a time.
// Usage: node convert-boards.mjs <project-dir>
import { readFileSync, mkdirSync } from "node:fs";
import { execFile } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const [projectDir, ...only] = process.argv.slice(2);
const manifest = JSON.parse(readFileSync(path.join(here, "pcbfacts", "manifest.json"), "utf8"));
const jobs = [];
for (const p of manifest) for (const b of p.boards) {
  if (!b.step) continue;
  if (only.length && !only.includes(`${p.slug}${b.key ? "/" + b.key : ""}`)) continue;
  const img = (k) => (b.images?.[k]?.from ? path.join("D:/SAAD/PCB", b.images[k].from) : "-");
  jobs.push({ name: `${p.slug}${b.key ? "/" + b.key : ""}`, args: [b.step, path.join(projectDir, "public", b.glb), b.bomMd ?? "-", img("top2d"), img("bottom2d")], render: img("render3d") });
}
const failed = [];
async function run(job) {
  mkdirSync(path.dirname(job.args[1]), { recursive: true });
  return new Promise((ok) => execFile(process.execPath,
    ["--max-old-space-size=6144", path.join(here, "step2board.mjs"), ...job.args, path.join(here, "pcbtools"), projectDir, job.render],
    { timeout: 20 * 60 * 1000, maxBuffer: 64 * 1024 * 1024 },
    (err, stdout, stderr) => {
      if (err) { failed.push(job.name); console.log(`FAILED ${job.name}: ${String(stderr || err.message).split("\n").slice(-3).join(" ")}`); }
      else console.log(`${job.name}: ${stdout.trim().split("\n").pop()}`);
      ok();
    }));
}
const queue = [...jobs];
await Promise.all([1, 2].map(async () => { while (queue.length) await run(queue.shift()); }));
console.log(`\nDONE: ${jobs.length - failed.length}/${jobs.length} converted${failed.length ? "; failed: " + failed.join(", ") : ""}`);
