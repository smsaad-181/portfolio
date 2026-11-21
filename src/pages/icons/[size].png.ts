/**
 * PNG icons rendered from public/favicon.svg at build time:
 * 32 px (browser tab fallback), 180 px (Apple touch icon), 192/512 px
 * (web manifest). The SVG keeps its own colours by design (CLAUDE.md).
 * The 180 px icon is flattened onto the site background because iOS
 * shows transparency as black.
 */
import type { APIRoute, GetStaticPaths } from "astro";
import { readFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

export const prerender = true;

export const getStaticPaths = (() => [32, 180, 192, 512].map((size) => ({ params: { size: String(size) } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const size = Number(params.size);
  const svg = readFileSync(path.join(process.cwd(), "public", "favicon.svg"));
  let img = sharp(svg, { density: Math.max(72, Math.round((size / 32) * 72)) }).resize(size, size);
  if (size === 180) img = img.flatten({ background: "#0b0614" }); // = --bg-base (dark)
  const png = await img.png({ compressionLevel: 9 }).toBuffer();
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
