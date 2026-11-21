/**
 * Per-project Open Graph image — /portfolio/images/og/<slug>.png (1200×630),
 * generated at build time: project title + name/role on the left, the
 * project's cover render on the right. PNG because social crawlers
 * (LinkedIn, X, WhatsApp) don't accept SVG or WebP reliably.
 *
 * Colours mirror src/styles/tokens.css (dark theme) — the OG generator keeps
 * its own copy by design (see CLAUDE.md "Images & design").
 */
import type { APIRoute, GetStaticPaths } from "astro";
import path from "node:path";
import sharp from "sharp";
import { getPublishedProjects } from "../../../lib/projects";
import { getProfile } from "../../../lib/profile";
import { projectSlug, publicFileExists } from "../../../lib/urls";

export const prerender = true;

export const getStaticPaths = (async () => {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({ params: { slug: projectSlug(project) }, props: { project } }));
}) satisfies GetStaticPaths;

const W = 1200, H = 630;
const esc = (s: string) => s.replace(/[<>&"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** Greedy word wrap for the SVG title (no text measuring in SVG). */
function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > maxChars && line) { lines.push(line); line = w; } else line = (line + " " + w).trim();
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = kept[maxLines - 1]!.replace(/\s*\S*$/, "") + "…";
    return kept;
  }
  return lines;
}

export const GET: APIRoute = async ({ props }) => {
  const { project } = props as { project: Awaited<ReturnType<typeof getPublishedProjects>>[number] };
  const { data: profile } = await getProfile();
  const { data } = project;
  const accent = "#ff5a8a", violet = "#7b5cff", bg = "#0b0614", text = "#f1eaf9", muted = "#b3a6c6";
  const sans = "DejaVu Sans, Segoe UI, Arial, sans-serif";
  const mono = "DejaVu Sans Mono, Consolas, Menlo, monospace";

  const lines = wrap(data.title, 22, 3);
  const titleSize = lines.length >= 3 ? 52 : 60;
  const titleY = 250;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="78%" cy="45%" r="45%"><stop offset="0%" stop-color="${violet}" stop-opacity="0.35"/><stop offset="100%" stop-color="${bg}" stop-opacity="0"/></radialGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${accent}"/><stop offset="100%" stop-color="${violet}"/></linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="${bg}"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <rect x="70" y="110" width="6" height="${120 + lines.length * (titleSize + 10)}" rx="3" fill="url(#bar)"/>
  <text x="104" y="150" font-family="${mono}" font-size="24" fill="${accent}" letter-spacing="3">// PCB PROJECT</text>
  ${lines.map((l, i) => `<text x="100" y="${titleY + i * (titleSize + 10)}" font-family="${sans}" font-size="${titleSize}" font-weight="700" fill="${text}">${esc(l)}</text>`).join("\n  ")}
  <text x="104" y="${titleY + lines.length * (titleSize + 10) + 30}" font-family="${sans}" font-size="28" fill="${muted}">${esc(profile.name)} · ${esc(profile.title)}</text>
  <text x="104" y="570" font-family="${mono}" font-size="22" fill="#8a7ca0">smsaad-181.github.io/portfolio</text>
</svg>`;

  const layers: { input: Buffer; left: number; top: number }[] = [];
  if (publicFileExists(data.coverImage.src)) {
    const render = await sharp(path.join(process.cwd(), "public", data.coverImage.src.replace(/^\/+/, "")))
      .resize({ width: 470, height: 470, fit: "inside" })
      .png()
      .toBuffer();
    const m = await sharp(render).metadata();
    layers.push({ input: render, left: Math.round(930 - (m.width ?? 470) / 2), top: Math.round(315 - (m.height ?? 470) / 2) });
  }
  const png = await sharp(Buffer.from(svg)).composite(layers).png({ compressionLevel: 9 }).toBuffer();
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
