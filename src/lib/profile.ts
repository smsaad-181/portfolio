/**
 * Profile helpers — one typed loader for the singleton profile entry, plus
 * the CV download (which only exists once the PDF has been uploaded).
 */
import { getEntry, type CollectionEntry } from "astro:content";
import { assetUrl, publicFileExists } from "./urls";

export type Profile = CollectionEntry<"profile">;

/** Loads src/content/profile/saad.json, failing the build loudly if it's missing. */
export async function getProfile(): Promise<Profile> {
  const profile = await getEntry("profile", "saad");
  if (!profile) {
    throw new Error("Missing profile entry: src/content/profile/saad.json");
  }
  return profile;
}

/**
 * Base-prefixed URL of the CV PDF, or `null` if the file isn't in public/
 * yet — callers then show "CV available on request" instead of a 404 link.
 */
export function getResumeUrl(profile: Profile): string | null {
  return publicFileExists(profile.data.resume) ? assetUrl(profile.data.resume) : null;
}
