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
import { isValidDate } from "./lib/dates";

// ─── Shared helpers ────────────────────────────────────────────────────────

const urlSchema = z.url({ error: "Must be a valid URL" });

/** Tina saves a cleared optional field as "" (text and number fields alike):
 * treat that as "not set" so emptying a field in /admin never breaks the build. */
const blankable = <T extends z.ZodType>(schema: T) =>
  z.preprocess((v) => (v === "" || v === null ? undefined : v), schema.optional());

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
      github: blankable(urlSchema),
      linkedin: blankable(urlSchema),
      oshwlab: blankable(urlSchema),
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

// "YYYY", "YYYY-MM" or "YYYY-MM-DD" — a year-only date is shown as the year.
const dateString = z.string().refine(isValidDate, { error: "Use a real date: YYYY, YYYY-MM or YYYY-MM-DD" });

const experience = defineCollection({
  loader: jsonFolder("experience"),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    startDate: dateString, // e.g. "2025-01-14", or "2021" when only the year is known
    current: z.boolean(),
    endDate: blankable(dateString), // only set when current === false
    // Responsibilities (verb + what), at most 6 per role.
    bullets: z.array(z.string().min(1)).max(6),
    // Results, shown under "Achievements" on the resume.
    achievements: z.array(z.string().min(1)).max(4).default([]),
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
    startYear: blankable(z.number().int()), // resume shows "2018 – 2023"
    year: z.number().int(), // year finished
    result: z.string(),
  }),
});

// ─── certifications ─────────────────────────────────────────────────────────

const certifications = defineCollection({
  loader: jsonFolder("certifications"),
  schema: z.object({
    name: z.string(),
    issuer: z.string().optional(),
    year: blankable(z.number().int()),
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
    // Several board revisions in one project: one card each on the project page.
    // `model` is the label of the matching entry in `models` (opens it in 3D).
    versions: z
      .array(
        z.object({
          label: z.string().min(1),
          summary: z.string().min(1),
          highlights: z.array(z.string().min(1)).max(6).default([]),
          image: imageSchema.optional(),
          model: z.string().optional(),
        })
      )
      .default([]),
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
    order: z.number().int().default(0), // lower = first on Projects; Home shows the first 6
    draft: z.boolean().default(false), // draft: true → excluded from build
  }),
});

// ─── blog ──────────────────────────────────────────────────────────────────
// Engineering write-ups. Facts follow the same rule as projects: only from
// the project docs/READMEs or Saad. New posts start as draft: true and are
// published by Saad (drafts show only in local dev, never in dist/).
// /admin creates them with draft: true (tina/config.ts defaultItem).

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(1), // one or two sentences for cards and meta description
    date: z.coerce.date(), // publish date (Tina stores an ISO string)
    tags: z.array(z.string()).default([]), // lowercase, shown via formatTag()
    coverImage: imageSchema.optional(),
    // Slug of a related project (file name without .mdx), e.g. "lora-gps-tracker".
    project: z.string().optional(),
    draft: z.boolean().default(false), // draft: true → only in local dev, never built
  }),
});

// ─── resume (singleton) ─────────────────────────────────────────────────────
// The parts of Saad's CV that live nowhere else on the site. The resume page
// combines this with profile, experience, education and certifications.
// Never put a phone number or referees' contact details here (public repo).

const resume = defineCollection({
  loader: jsonFolder("resume"),
  schema: z.object({
    name: z.string().min(1), // full name as on the CV, e.g. "Sultan Mahmud Saad"
    summary: z.string().min(1), // "Professional summary"
    projects: z
      .array(
        z.object({
          title: z.string().min(1),
          note: z.string().optional(), // right-hand label: employer or scope
          tech: z.string().optional(), // "Technologies: …" line
          bullets: z.array(z.string().min(1)).max(4).default([]),
          objective: z.string().optional(),
          use: z.string().optional(), // "Real-world use"
          // Slug of the project page to link (file name without .mdx).
          project: z.string().optional(),
          ongoing: z.boolean().default(false), // listed under "Ongoing projects"
        })
      )
      .default([]),
    // CV skill rows, e.g. { label: "Protocols", items: "UART, SPI, I²C" }.
    skills: z.array(z.object({ label: z.string().min(1), items: z.string().min(1) })).default([]),
    activities: z.array(z.string().min(1)).default([]),
    references: z.string().optional(), // e.g. "Available on request."
  }),
});

export const collections = {
  profile,
  resume,
  experience,
  education,
  certifications,
  skills,
  projects,
  blog,
};
