/**
 * Content collections (Astro 6+ Content Layer API).
 *
 * Each collection reads files from src/content/<name>/ through the glob
 * loader. Entry ids are the file names without extension
 * ("home-automation-v2", "saad"), so URLs never contain ".mdx".
 *
 * tina/config.ts targets the SAME folders with the SAME field names —
 * change both together (CLAUDE.md → "Content model").
 */
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// ─── Shared helpers ────────────────────────────────────────────────────────

const urlSchema = z.url({ error: "Must be a valid URL" });

/** All JSON files in one content folder; id = file name without extension. */
const jsonFolder = (name: string) => glob({ pattern: "*.json", base: `./src/content/${name}` });

// coverImage / gallery images are stored as plain strings (public/ paths).
// Tina Cloud's media manager commits uploaded files into public/images/ and
// stores the path as a string — e.g. "/images/projects/home-automation/cover.jpg".
const imageSchema = z.object({
  src: z.string().min(1, { error: "Image path is required" }),
  alt: z.string().min(1, { error: "Image alt text is required for accessibility" }),
});

// ─── profile (singleton) ────────────────────────────────────────────────────

const profile = defineCollection({
  loader: jsonFolder("profile"),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    location: z.string(),
    email: z.email(),
    summary: z.string(),
    avatar: imageSchema,
    socialLinks: z.object({
      github: urlSchema.optional(),
      linkedin: urlSchema.optional(),
      oshwlab: urlSchema.optional(),
    }),
    resume: z.string(), // path to the PDF in public/resume/
    // Hero proof stats, e.g. { value: "6", label: "boards designed" }.
    // Optional: the row stays hidden until Saad enters real numbers.
    stats: z
      .array(z.object({ value: z.string().min(1), label: z.string().min(1) }))
      .max(4)
      .optional(),
    // Home "About me" cards, e.g. { label: "Currently learning", value: "…" }.
    about: z
      .array(z.object({ label: z.string().min(1), value: z.string().min(1) }))
      .max(6)
      .optional(),
    // About page bio: who I am / what I build / what I'm looking for.
    bio: z.array(z.string().min(1)).max(4).optional(),
    // e.g. "Open to hardware / embedded roles · Dhaka or remote"
    availability: z.string().optional(), // empty = hidden
  }),
});

// ─── experience ─────────────────────────────────────────────────────────────

const experience = defineCollection({
  loader: jsonFolder("experience"),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    startDate: z.string(), // ISO date string e.g. "2025-01-14"
    current: z.boolean(),
    endDate: z.string().optional(), // only set when current === false
    // Impact bullets (verb + what + result), at most 6 per role.
    bullets: z.array(z.string().min(1)).max(6),
    tags: z.array(z.string()),
  }),
});

// ─── education ──────────────────────────────────────────────────────────────

const education = defineCollection({
  loader: jsonFolder("education"),
  schema: z.object({
    degree: z.string(),
    institute: z.string(),
    group: z.string(),
    year: z.number().int(),
    result: z.string(),
  }),
});

// ─── certifications ─────────────────────────────────────────────────────────

const certifications = defineCollection({
  loader: jsonFolder("certifications"),
  schema: z.object({
    name: z.string(),
    issuer: z.string().optional(),
    year: z.number().int().optional(),
  }),
});

// ─── skills ─────────────────────────────────────────────────────────────────

const skills = defineCollection({
  loader: jsonFolder("skills"),
  schema: z.object({
    name: z.string(),
    // free text — group in UI by whatever categories exist at render time;
    // don't hardcode a category list (content-model.md requirement)
    category: z.string(),
    // Shown in the compact "key tools" row on the home page.
    home: z.boolean().default(false),
    // Words that mark a project as using this skill (tags, specs, write-up).
    // Defaults to the skill name; [] = don't count projects (e.g. "C").
    aliases: z.array(z.string().min(1)).optional(),
  }),
});

// ─── projects ────────────────────────────────────────────────────────────────

const projects = defineCollection({
  // MDX write-ups — rich text + inline images. Files starting with "_" are ignored.
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string().min(1, { error: "Project title is required" }),
    // The URL slug is the entry id (file name without extension).
    summary: z.string(),
    coverImage: imageSchema,
    // Images, each with a kind + caption. The project page shows "render"
    // images under "Board renders" and "dashboard" images under "Outcome".
    gallery: z
      .array(
        imageSchema.extend({
          kind: z.enum(["render", "pcb", "2d", "schematic", "photo", "screenshot", "dashboard"]).default("photo"),
          caption: z.string().optional(),
        })
      )
      .default([]),
    // Interactive 3D boards (GLB converted from the STEP file), one per board.
    models: z
      .array(
        z.object({
          label: z.string().min(1),
          src: z.string().min(1), // e.g. /models/<slug>/board.glb (public/)
          poster: z.string().optional(), // still image shown while the model loads
        })
      )
      .default([]),
    // Key specs for the page header: { label: "MCU", value: "ESP32-WROOM-32E" }.
    specs: z.array(z.object({ label: z.string().min(1), value: z.string().min(1) })).default([]),
    tags: z.array(z.string()).default([]),
    status: z.enum(["completed", "in-progress", "prototype"]),
    role: z.string().optional(),
    dateCompleted: z.string().optional(), // ISO date string
    links: z
      .object({
        github: urlSchema.optional(),
        oshwlab: urlSchema.optional(),
        liveDemo: urlSchema.optional(),
      })
      .default({}),
    featured: z.boolean().default(false),
    order: z.number().int().default(0), // lower = higher on homepage
    draft: z.boolean().default(false), // draft: true → excluded from build
  }),
});

export const collections = {
  profile,
  experience,
  education,
  certifications,
  skills,
  projects,
};
