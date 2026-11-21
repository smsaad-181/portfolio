/**
 * Blog query helpers — list posts ONLY through these (same rule as projects).
 *
 * Drafts are visible on the local dev server (so Saad can read them before
 * publishing, marked "Draft") and never in a production build: `draft: true`
 * must not reach dist/ (checked by scripts/check-drafts.mjs).
 */
import { getCollection, type CollectionEntry } from "astro:content";
import { pageUrl } from "./urls";

export type PostEntry = CollectionEntry<"blog">;

/** Published posts, newest first (plus drafts in local dev only). */
export async function getPublishedPosts(): Promise<PostEntry[]> {
  const showDrafts = import.meta.env.DEV;
  const posts = await getCollection("blog", ({ data }) => showDrafts || !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.data.title.localeCompare(b.data.title));
}

/** Base-aware post URL: /portfolio/blog/<slug>/ (no file extension). */
export function postUrl(post: PostEntry): string {
  return pageUrl(`/blog/${post.id.replace(/\.(md|mdx)$/, "")}/`);
}

/** "21 Nov 2026" */
export function formatPostDate(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

/** Rough reading time from the raw body (≈ 200 words per minute). */
export function readingMinutes(post: PostEntry): number {
  const words = (post.body ?? "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
