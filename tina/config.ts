/**
 * tina/config.ts
 *
 * Mirrors src/content.config.ts exactly — same collections, same field
 * names, same file paths. Tina writes content into src/content/* and
 * Astro's content collections read from the same files. They must never
 * drift apart.
 *
 * Architecture note: this uses form-based editing backed by Tina Cloud
 * (the static /admin bundle calls Tina Cloud's hosted API to commit
 * changes directly to main). Live visual editing is NOT used — it
 * requires server-side rendering, which GitHub Pages cannot provide.
 * See .kiro/steering/tech.md for the full rationale.
 */
import { defineConfig, type Collection } from "tinacms";

// ─── Shared field definitions ────────────────────────────────────────────────

const imageFields = (label: string) => [
  {
    type: "image" as const,
    name: "src",
    label: `${label} Image`,
    required: true,
  },
  {
    type: "string" as const,
    name: "alt",
    label: `${label} Alt Text`,
    required: true,
    description: "Describe the image for screen readers (required for accessibility).",
  },
];

// ─── Profile (singleton) ─────────────────────────────────────────────────────

const profileCollection: Collection = {
  name: "profile",
  label: "Profile",
  path: "src/content/profile",
  format: "json" as const,
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
    filename: {
      readonly: true,
      slugify: () => "saad",
    },
  },
  fields: [
    { type: "string" as const, name: "name", label: "Name", required: true },
    { type: "string" as const, name: "title", label: "Title", required: true },
    { type: "string" as const, name: "location", label: "Location", required: true },
    {
      type: "string" as const,
      name: "email",
      label: "Email",
      required: true,
    },
    {
      type: "string" as const,
      name: "summary",
      label: "Summary",
      required: true,
      ui: { component: "textarea" as const },
    },
    {
      type: "object" as const,
      name: "avatar",
      label: "Avatar",
      fields: imageFields("Avatar"),
    },
    {
      type: "object" as const,
      name: "socialLinks",
      label: "Social Links",
      fields: [
        { type: "string" as const, name: "github", label: "GitHub URL" },
        { type: "string" as const, name: "linkedin", label: "LinkedIn URL" },
        { type: "string" as const, name: "oshwlab", label: "OSHWLab URL" },
      ],
    },
    {
      type: "image" as const,
      name: "resume",
      label: "Resume PDF",
      required: true,
      description: "Upload the current CV as a PDF. Path stored as public/resume/…",
    },
    {
      type: "object" as const,
      name: "stats",
      label: "Hero stats",
      list: true,
      description:
        "Up to 4 proof numbers shown under your name on the home page, e.g. 6 / boards designed. Leave empty to hide the row. Use real numbers only.",
      ui: {
        itemProps: (item: { value?: string; label?: string }) => ({
          label: item?.value && item?.label ? `${item.value} ${item.label}` : "New stat",
        }),
      },
      fields: [
        { type: "string" as const, name: "value", label: "Number", required: true },
        { type: "string" as const, name: "label", label: "Label", required: true },
      ],
    },
  ],
};

// ─── Experience ───────────────────────────────────────────────────────────────

const experienceCollection: Collection = {
  name: "experience",
  label: "Experience",
  path: "src/content/experience",
  format: "json" as const,
  fields: [
    { type: "string" as const, name: "company", label: "Company", required: true },
    { type: "string" as const, name: "role", label: "Role / Title", required: true },
    {
      type: "datetime" as const,
      name: "startDate",
      label: "Start Date",
      required: true,
      ui: { dateFormat: "YYYY-MM-DD" },
    },
    {
      type: "boolean" as const,
      name: "current",
      label: "Currently here?",
      required: true,
    },
    {
      type: "datetime" as const,
      name: "endDate",
      label: "End Date",
      description: "Leave blank if current = true.",
      ui: { dateFormat: "YYYY-MM-DD" },
    },
    {
      type: "string" as const,
      name: "bullets",
      label: "Responsibilities & Achievements",
      list: true,
      ui: { component: "list" as const },
    },
    {
      type: "string" as const,
      name: "tags",
      label: "Tags / Technologies",
      list: true,
      description: "Free-text tags. Add any new technology without changing the schema.",
    },
  ],
};

// ─── Education ────────────────────────────────────────────────────────────────

const educationCollection: Collection = {
  name: "education",
  label: "Education",
  path: "src/content/education",
  format: "json" as const,
  fields: [
    { type: "string" as const, name: "degree", label: "Degree", required: true },
    { type: "string" as const, name: "institute", label: "Institute", required: true },
    { type: "string" as const, name: "group", label: "Group / Department", required: true },
    { type: "number" as const, name: "year", label: "Graduation Year", required: true },
    { type: "string" as const, name: "result", label: "Result / GPA", required: true },
  ],
};

// ─── Certifications ───────────────────────────────────────────────────────────

const certificationsCollection: Collection = {
  name: "certifications",
  label: "Certifications & Training",
  path: "src/content/certifications",
  format: "json" as const,
  fields: [
    { type: "string" as const, name: "name", label: "Certification Name", required: true },
    { type: "string" as const, name: "issuer", label: "Issuing Body" },
    { type: "number" as const, name: "year", label: "Year" },
  ],
};

// ─── Skills ───────────────────────────────────────────────────────────────────

const skillsCollection: Collection = {
  name: "skills",
  label: "Skills",
  path: "src/content/skills",
  format: "json" as const,
  fields: [
    { type: "string" as const, name: "name", label: "Skill Name", required: true },
    {
      type: "string" as const,
      name: "category",
      label: "Category",
      required: true,
      description:
        "Free text, lowercase. e.g. 'programming', 'protocols', 'iot & communication'. " +
        "The UI groups by whatever categories exist — no code change needed for a new category.",
    },
    {
      type: "number" as const,
      name: "proficiency",
      label: "Proficiency (1–5)",
      description: "Optional. 1 = beginner, 5 = expert.",
    },
  ],
};

// ─── Projects ─────────────────────────────────────────────────────────────────

const projectsCollection: Collection = {
  name: "projects",
  label: "Projects",
  path: "src/content/projects",
  format: "mdx" as const,
  fields: [
    {
      type: "string" as const,
      name: "title",
      label: "Title",
      required: true,
      isTitle: true,
    },
    {
      type: "string" as const,
      name: "summary",
      label: "Summary",
      required: true,
      description: "One-sentence description shown on project cards.",
      ui: { component: "textarea" as const },
    },
    {
      type: "object" as const,
      name: "coverImage",
      label: "Cover Image",
      required: true,
      fields: imageFields("Cover"),
    },
    {
      type: "object" as const,
      name: "gallery",
      label: "Gallery",
      list: true,
      fields: [
        ...imageFields("Gallery item"),
        {
          type: "string" as const,
          name: "kind",
          label: "Kind",
          options: ["render", "pcb", "2d", "schematic", "photo", "screenshot"],
        },
        { type: "string" as const, name: "caption", label: "Caption" },
      ],
    },
    {
      type: "object" as const,
      name: "models",
      label: "3D models",
      list: true,
      description: "Interactive 3D boards (GLB converted from the STEP file), one per board.",
      fields: [
        { type: "string" as const, name: "label", label: "Board name", required: true },
        { type: "string" as const, name: "src", label: "GLB path (e.g. /models/<slug>/board.glb)", required: true },
        { type: "image" as const, name: "poster", label: "Poster image (shown while loading)" },
      ],
    },
    {
      type: "object" as const,
      name: "specs",
      label: "Key specs",
      list: true,
      description: "Shown in the project header, e.g. MCU / ESP32-WROOM-32E.",
      fields: [
        { type: "string" as const, name: "label", label: "Label", required: true },
        { type: "string" as const, name: "value", label: "Value", required: true },
      ],
    },
    {
      type: "string" as const,
      name: "tags",
      label: "Tags",
      list: true,
      description:
        "Free text array. e.g. 'ESP32', 'PCB Design', 'MQTT'. " +
        "Add any new tag without a code or schema change.",
    },
    {
      type: "string" as const,
      name: "status",
      label: "Status",
      required: true,
      options: ["completed", "in-progress", "prototype"],
    },
    {
      type: "string" as const,
      name: "role",
      label: "Your Role",
      description: "e.g. 'Hardware & Firmware Engineer'",
    },
    {
      type: "datetime" as const,
      name: "dateCompleted",
      label: "Date Completed",
      ui: { dateFormat: "YYYY-MM-DD" },
    },
    {
      type: "object" as const,
      name: "links",
      label: "External Links",
      fields: [
        { type: "string" as const, name: "github", label: "GitHub URL" },
        { type: "string" as const, name: "oshwlab", label: "OSHWLab URL" },
        { type: "string" as const, name: "liveDemo", label: "Live Demo URL" },
      ],
    },
    {
      type: "boolean" as const,
      name: "featured",
      label: "Featured on Homepage?",
    },
    {
      type: "number" as const,
      name: "order",
      label: "Homepage Order",
      description: "Lower number = shown first. Only applies if Featured = true.",
    },
    {
      type: "boolean" as const,
      name: "draft",
      label: "Draft (hide from site)",
      description:
        "When true, this project is excluded from all public pages. " +
        "Set to false when ready to publish.",
    },
    {
      type: "rich-text" as const,
      name: "body",
      label: "Write-up",
      isBody: true,
      description:
        "Full project write-up in MDX. Sections: Objective → Key Components → " +
        "Features → Hardware Design (optional) → Outcome.",
    },
  ],
};

// ─── Export config ────────────────────────────────────────────────────────────

export default defineConfig({
  // Tina Cloud credentials — supplied via environment variables in CI,
  // and via .env locally. Never hardcoded here.
  // Set TINA_PUBLIC_CLIENT_ID and TINA_TOKEN in:
  //   • local: .env file (copy from .env.example)
  //   • CI: GitHub Actions secrets TINA_CLIENT_ID / TINA_TOKEN
  clientId: process.env.TINA_PUBLIC_CLIENT_ID ?? "",
  token: process.env.TINA_TOKEN ?? "",
  // Git branch Tina Cloud reads and commits to. GitHub Actions provides
  // GITHUB_REF_NAME; everywhere else the site is edited on main.
  branch: process.env.GITHUB_REF_NAME || process.env.HEAD || "main",

  build: {
    // outputFolder: the /admin bundle lands inside Astro's public/
    // so it gets included in the static build output without any extra config.
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    // Tina Cloud's media manager commits uploaded files into public/images/.
    // Astro's <Image /> component then optimises them at build time.
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      projectsCollection,
      profileCollection,
      experienceCollection,
      educationCollection,
      certificationsCollection,
      skillsCollection,
    ],
  },
});
