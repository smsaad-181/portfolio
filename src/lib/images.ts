/**
 * Build-time image helpers for files in public/ (the site's image folder).
 * Reads real pixel dimensions so <Image /> gets correct width/height and
 * nothing is stretched or shifts layout while loading.
 */
import path from "node:path";
import sharp from "sharp";
import { publicFileExists } from "./urls";

const cache = new Map<string, { width: number; height: number } | null>();

/** Width/height of public/<filePath>, or null if the file isn't there. */
export async function publicImageSize(filePath: string): Promise<{ width: number; height: number } | null> {
  if (cache.has(filePath)) return cache.get(filePath) ?? null;
  let size: { width: number; height: number } | null = null;
  if (publicFileExists(filePath)) {
    const meta = await sharp(path.join(process.cwd(), "public", filePath.replace(/^\/+/, ""))).metadata();
    if (meta.width && meta.height) size = { width: meta.width, height: meta.height };
  }
  cache.set(filePath, size);
  return size;
}
