/**
 * Shared project query helpers.
 *
 * Every page that lists projects MUST use getPublishedProjects() rather than
 * querying the collection directly. This guarantees draft filtering is applied
 * consistently and no future page accidentally leaks draft content.
 *
 * See design.md § "Draft filtering".
 */
import { getCollection, type CollectionEntry } from "astro:content";

export type ProjectEntry = CollectionEntry<"projects">;

/**
 * Returns all non-draft projects, sorted by `order` ascending then title.
 * This is the single source of truth for "what projects are visible" across
 * the entire site.
 */
export async function getPublishedProjects(): Promise<ProjectEntry[]> {
  const all = await getCollection("projects", ({ data }) => !data.draft);
  return all.sort((a, b) => {
    if (a.data.order !== b.data.order) return a.data.order - b.data.order;
    return a.data.title.localeCompare(b.data.title);
  });
}

/**
 * Returns featured projects (featured: true), sorted by `order`.
 * Used on the homepage hero section.
 */
/**
 * Ids (slugs) of every project file, drafts included. Only for validating a
 * slug typed in /admin (e.g. the resume's project links) — never for listing.
 */
export async function getAllProjectIds(): Promise<Set<string>> {
  return new Set((await getCollection("projects")).map((p) => p.id));
}

export async function getFeaturedProjects(): Promise<ProjectEntry[]> {
  const published = await getPublishedProjects();
  return published.filter((p) => p.data.featured);
}

/**
 * Returns the unique set of tags across all published projects.
 * Tags are normalised to lowercase for de-duplication; display-case is
 * handled at the component level (TagChip).
 */
export async function getAllTags(): Promise<string[]> {
  const projects = await getPublishedProjects();
  const tagSet = new Set<string>();
  for (const p of projects) {
    for (const tag of p.data.tags) {
      tagSet.add(tag.toLowerCase());
    }
  }
  return Array.from(tagSet).sort();
}
