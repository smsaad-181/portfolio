/**
 * Skills helpers — grouping in a fixed reading order. The per-skill project
 * match below is kept for ordering within a group (most-used first); the
 * site no longer displays "used in N projects" (Saad, 21 Nov 2026).
 *
 * A project uses a skill when one of the skill's aliases (default: its name)
 * appears as a whole word in the project's tags or spec values. The write-up
 * is not scanned: passing mentions ("USB-to-UART bridge", "UART header")
 * would overcount.
 * Only published projects count (getPublishedProjects).
 */
import { getCollection, type CollectionEntry } from "astro:content";
import { getPublishedProjects, type ProjectEntry } from "./projects";
import { formatTag } from "./tags";

export type SkillEntry = CollectionEntry<"skills">;

/** Category order from the plan; any new category the CMS adds goes last. */
const ORDER = ["hardware & pcb", "embedded & firmware", "protocols", "iot & platforms", "tools"];

/** Display names (categories are stored lowercase). */
export const CATEGORY_LABEL: Record<string, string> = {
  "hardware & pcb": "Hardware & PCB",
  "embedded & firmware": "Embedded & Firmware",
  protocols: "Protocols",
  "iot & platforms": "IoT & Platforms",
  tools: "Tools",
};

const norm = (s: string) => s.toLowerCase().replace(/²/g, "2");
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function projectText(p: ProjectEntry): string {
  return norm([...p.data.tags, ...p.data.specs.map((s) => s.value)].join(" \n "));
}

export interface SkillWithUse {
  skill: SkillEntry;
  projects: ProjectEntry[];
}

export interface SkillGroup {
  category: string;
  label: string;
  skills: SkillWithUse[];
}

export async function getSkillGroups(): Promise<SkillGroup[]> {
  const [skills, projects] = await Promise.all([getCollection("skills"), getPublishedProjects()]);
  const texts = projects.map((p) => ({ p, text: projectText(p) }));
  const withUse: SkillWithUse[] = skills.map((skill) => {
    const aliases = (skill.data.aliases ?? [skill.data.name]).map(norm);
    const used = aliases.length
      ? texts.filter(({ text }) => aliases.some((a) => new RegExp(`(^|[^a-z0-9])${escape(a)}($|[^a-z0-9])`).test(text))).map(({ p }) => p)
      : [];
    return { skill, projects: used };
  });
  const cat = (s: SkillWithUse) => s.skill.data.category.trim().toLowerCase();
  const cats = [...new Set(withUse.map(cat))].sort((a, b) => {
    const ia = ORDER.indexOf(a), ib = ORDER.indexOf(b);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b);
  });
  return cats.map((category) => ({
    category,
    label: CATEGORY_LABEL[category] ?? formatTag(category),
    skills: withUse
      .filter((s) => cat(s) === category)
      .sort((a, b) => b.projects.length - a.projects.length || a.skill.data.name.localeCompare(b.skill.data.name)),
  }));
}

/** Skills flagged for the home page's compact row, most-used first. */
export async function getHomeSkills(): Promise<SkillWithUse[]> {
  return (await getSkillGroups()).flatMap((g) => g.skills).filter((s) => s.skill.data.home).sort((a, b) => b.projects.length - a.projects.length);
}
