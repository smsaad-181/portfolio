/**
 * Default Open Graph image — generated at build time as a 1200×630 PNG and
 * served at /portfolio/images/og-default.png. Social crawlers (LinkedIn, X,
 * WhatsApp) don't accept SVG, so the SVG below is rasterised with sharp.
 *
 * Content comes from the profile entry — edit src/content/profile/saad.json, not here.
 * Colours mirror src/styles/tokens.css (dark theme) — keep them in sync.
 */
import type { APIRoute } from "astro";
import sharp from "sharp";
import { getProfile } from "../../lib/profile";

export const prerender = true;

const WIDTH = 1200;
const HEIGHT = 630;

function escapeXml(s: string): string {
  return s.replace(/[<>&"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

export const GET: APIRoute = async () => {
  const { data } = await getProfile();
  const accent = "#ff5a8a"; // = --accent (dark) in tokens.css

  // Faint 24-px engineering grid (matches --grid-size)
  const grid: string[] = [];
  for (let x = 0; x <= WIDTH; x += 24) grid.push(`<line x1="${x}" y1="0" x2="${x}" y2="${HEIGHT}"/>`);
  for (let y = 0; y <= HEIGHT; y += 24) grid.push(`<line x1="0" y1="${y}" x2="${WIDTH}" y2="${y}"/>`);

  const sans = "DejaVu Sans, Segoe UI, Arial, sans-serif";
  const mono = "DejaVu Sans Mono, Consolas, Menlo, monospace";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="100%" height="100%" fill="#0b0614"/>
  <g stroke="#ffffff" stroke-opacity="0.04" stroke-width="1">${grid.join("")}</g>
  <rect x="80" y="150" width="6" height="250" fill="${accent}"/>
  <text x="116" y="196" font-family="${mono}" font-size="26" fill="${accent}" letter-spacing="4">// ${escapeXml(data.title.toUpperCase())}</text>
  <text x="112" y="300" font-family="${sans}" font-size="88" font-weight="700" fill="#f1eaf9">${escapeXml(data.name)}</text>
  <text x="116" y="372" font-family="${sans}" font-size="34" fill="#b3a6c6">PCB design · Embedded firmware · IoT products</text>
  <text x="116" y="540" font-family="${mono}" font-size="24" fill="#8a7ca0">smsaad-181.github.io/portfolio · ${escapeXml(data.location)}</text>
</svg>`;

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
