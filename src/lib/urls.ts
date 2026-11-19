/**
 * Base-aware URL helpers — the ONLY way to build internal links and asset
 * paths (see CLAUDE.md → "Links & routing").
 *
 * The site is served under `base: "/portfolio"` with `trailingSlash: "always"`,
 * so a hard-coded "/projects/foo" works in no environment: it 404s locally
 * and in production. Route every internal href/src through these helpers.
 */
import { existsSync } from "node:fs";
import path from "node:path";
import type { CollectionEntry } from "astro:content";

/** "/portfolio" — BASE_URL without its trailing slash. */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

/** Splits "/path?query#hash" into the path and the suffix. */
function splitSuffix(input: string): [string, string] {
  const i = input.search(/[?#]/);
  return i === -1 ? [input, ""] : [input.slice(0, i), input.slice(i)];
}

/**
 * Page URL under the base, always with a trailing slash.
 * pageUrl("/") → "/portfolio/", pageUrl("projects?tag=iot") → "/portfolio/projects/?tag=iot"
 */
export function pageUrl(pagePath = "/"): string {
  const [p, suffix] = splitSuffix(pagePath);
  const trimmed = p.replace(/^\/+|\/+$/g, "");
  return `${BASE}/${trimmed ? `${trimmed}/` : ""}${suffix}`;
}

/**
 * Static file URL under the base (no trailing slash).
 * assetUrl("/images/og-default.png") → "/portfolio/images/og-default.png"
 */
export function assetUrl(filePath: string): string {
  return `${BASE}/${filePath.replace(/^\/+/, "")}`;
}

/** Absolute URL on the production site, from a base-prefixed path. */
export function absoluteUrl(basePath: string): string {
  return new URL(basePath, import.meta.env.SITE).href;
}

/**
 * A project's URL slug. With the glob loader the entry id is already the
 * file name without extension; the replace is a guard so a ".mdx" can never
 * reach a URL again.
 */
export function projectSlug(entry: CollectionEntry<"projects">): string {
  return entry.id.replace(/\.mdx?$/, "");
}

/** "/portfolio/projects/home-automation-v2/" */
export function projectUrl(entry: CollectionEntry<"projects">): string {
  return pageUrl(`/projects/${projectSlug(entry)}/`);
}

/**
 * True if `public/<filePath>` exists at build time. Used to hide images and
 * downloads that haven't been uploaded yet instead of shipping a 404.
 * (Builds and the dev server run from the project root.)
 */
export function publicFileExists(filePath: string | undefined): filePath is string {
  if (!filePath || /^[a-z]+:/i.test(filePath)) return false;
  return existsSync(path.join(process.cwd(), "public", filePath.replace(/^\/+/, "")));
}
