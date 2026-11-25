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
      description: "Your own CV PDF, published byte for byte. Upload the new PDF here (or run npm run cv:import) and update Resume (CV) to the same text.",
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
    {
      type: "object" as const,
      name: "about",
      label: "About me (home page)",
      list: true,
      description: "Up to 6 short cards on the home page, e.g. Currently learning / Embedded systems, ROS and IoT protocols.",
      ui: {
        itemProps: (item: { label?: string }) => ({ label: item?.label || "New card" }),
      },
      fields: [
        { type: "string" as const, name: "label", label: "Heading", required: true },
        { type: "string" as const, name: "value", label: "Text", required: true },
      ],
    },
    {
      type: "string" as const,
      name: "bio",
      label: "About bio (paragraphs)",
      list: true,
      ui: { component: "list" as const },
      description: "Up to 4 short paragraphs for the About page: who you are, what you build, what you're looking for.",
    },
    {
      type: "string" as const,
      name: "availability",
      label: "Availability line",
      description: "e.g. Open to hardware / embedded roles · Dhaka or remote. Leave empty to hide.",
    },
  ],
};

// ─── Resume (singleton) ───────────────────────────────────────────────────────
// Saad's CV word for word, as in his own PDF (the "Download PDF"). Email,
// LinkedIn, GitHub and location come from Profile. Text may mark bold with
// **double asterisks**. Public site: the phone and referees are shown as in
// the PDF (Saad's choice, 25 Nov 2026).

const cvItemLabel = (key: string, fallback: string) => (item: Record<string, string | undefined>) => ({
  label: item?.[key] || fallback,
});

const resumeCollection: Collection = {
  name: "resume",
  label: "Resume (CV)",
  path: "src/content/resume",
  format: "json" as const,
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
    filename: {
      readonly: true,
      slugify: () => "cv",
    },
  },
  fields: [
    {
      type: "string" as const,
      name: "name",
      label: "Name on the CV",
      required: true,
      description: "Full name as on your CV. The rest of the site uses the Profile name.",
    },
    { type: "string" as const, name: "phone", label: "Phone", description: "Shown in the CV header (public)." },
    {
      type: "string" as const,
      name: "summary",
      label: "Professional summary",
      required: true,
      ui: { component: "textarea" as const },
    },
    {
      type: "object" as const,
      name: "education",
      label: "Education",
      list: true,
      ui: { itemProps: cvItemLabel("school", "New entry") },
      fields: [
        { type: "string" as const, name: "school", label: "School / University", required: true },
        { type: "string" as const, name: "dates", label: "Dates", required: true, description: "As printed, e.g. 2018 – 2023." },
        { type: "string" as const, name: "degree", label: "Degree line", required: true, description: "The whole italic line, e.g. Bachelor of Science (B.Sc.) in …, CGPA: 3.59/4.00" },
        { type: "string" as const, name: "location", label: "Location" },
      ],
    },
    {
      type: "object" as const,
      name: "experience",
      label: "Work experience",
      list: true,
      ui: { itemProps: cvItemLabel("org", "New job") },
      fields: [
        { type: "string" as const, name: "org", label: "Company", required: true },
        { type: "string" as const, name: "dates", label: "Dates", required: true, description: "As printed, e.g. January 2025 – Present." },
        { type: "string" as const, name: "role", label: "Role", required: true },
        { type: "string" as const, name: "location", label: "Location" },
        { type: "string" as const, name: "responsibilities", label: "Responsibilities", list: true, ui: { component: "list" as const } },
        { type: "string" as const, name: "achievements", label: "Achievements", list: true, ui: { component: "list" as const }, description: "Mark bold words with **double asterisks**." },
      ],
    },
    {
      type: "object" as const,
      name: "projects",
      label: "Projects",
      list: true,
      description: "Tick \"Ongoing\" to list a project under Ongoing projects.",
      ui: { itemProps: cvItemLabel("title", "New project") },
      fields: [
        { type: "string" as const, name: "title", label: "Title", required: true },
        { type: "string" as const, name: "note", label: "Right-hand label", description: "Employer or scope, e.g. SouthernIoT or Schematic, PCB and Firmware." },
        { type: "string" as const, name: "tech", label: "Technologies", description: "Comma-separated, e.g. ESP32, MQTT, EasyEDA." },
        { type: "string" as const, name: "bullets", label: "Bullets", list: true, ui: { component: "list" as const }, description: "e.g. **Objective:** deliver …" },
        { type: "string" as const, name: "project", label: "Project page to link", description: "Optional. File name of the project without .mdx, e.g. lora-gps-tracker." },
        { type: "boolean" as const, name: "ongoing", label: "Ongoing" },
      ],
    },
    {
      type: "object" as const,
      name: "skills",
      label: "Technical skills",
      list: true,
      ui: { itemProps: cvItemLabel("label", "New row") },
      fields: [
        { type: "string" as const, name: "label", label: "Group", required: true },
        { type: "string" as const, name: "items", label: "Skills", required: true, description: "Comma-separated." },
      ],
    },
    {
      type: "string" as const,
      name: "training",
      label: "Training courses",
      list: true,
      ui: { component: "list" as const },
    },
    {
      type: "string" as const,
      name: "activities",
      label: "Extracurricular activities",
      list: true,
      ui: { component: "list" as const },
    },
    {
      type: "object" as const,
      name: "references",
      label: "References",
      list: true,
      description: "Shown publicly, as in your PDF. Ask referees before adding their email or phone.",
      ui: { itemProps: cvItemLabel("name", "New referee") },
      fields: [
        { type: "string" as const, name: "name", label: "Name", required: true },
        { type: "string" as const, name: "title", label: "Title" },
        { type: "string" as const, name: "org", label: "Organisation" },
        { type: "string" as const, name: "email", label: "Email" },
        { type: "string" as const, name: "phone", label: "Phone" },
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
    // Plain text, not a date picker: "2021" (year only) must stay "2021".
    {
      type: "string" as const,
      name: "startDate",
      label: "Start Date",
      required: true,
      description: "YYYY-MM-DD, YYYY-MM, or just YYYY when only the year is known (shown as the year).",
    },
    {
      type: "boolean" as const,
      name: "current",
      label: "Currently here?",
      required: true,
    },
    {
      type: "string" as const,
      name: "endDate",
      label: "End Date",
      description: "Leave blank if current = true. Same format as the start date.",
    },
    {
      type: "string" as const,
      name: "bullets",
      label: "Responsibilities",
      list: true,
      ui: { component: "list" as const },
      description: "At most 6. Start with a verb.",
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
        "Lowercase. One of: hardware & pcb, embedded & firmware, protocols, iot & platforms, tools. " +
        "A new category shows up as its own group automatically.",
    },
    {
      type: "boolean" as const,
      name: "home",
      label: "Show in the home page's key tools row",
    },
    {
      type: "string" as const,
      name: "aliases",
      label: "Words that mark a project as using it",
      list: true,
      description: "Lowercase, e.g. esp32 or node-red. Matched in project tags and spec values; used to order skills within a group. Leave empty to match the skill name.",
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
          options: ["render", "pcb", "2d", "schematic", "photo", "screenshot", "dashboard"],
          description: "Shown on the project page: render → Board renders, dashboard → Outcome. Other kinds are kept but not displayed.",
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
      name: "versions",
      label: "Versions (board revisions)",
      list: true,
      description: "Only for projects with several boards. One card each on the project page; Model = the label of the matching 3D model.",
      ui: { itemProps: (item: { label?: string }) => ({ label: item?.label || "New version" }) },
      fields: [
        { type: "string" as const, name: "label", label: "Name", required: true },
        { type: "string" as const, name: "summary", label: "One-line summary", required: true },
        { type: "string" as const, name: "highlights", label: "What's different (max 6)", list: true },
        {
          type: "object" as const,
          name: "image",
          label: "Image",
          fields: [
            { type: "image" as const, name: "src", label: "Image", required: true },
            { type: "string" as const, name: "alt", label: "Alt text", required: true },
          ],
        },
        { type: "string" as const, name: "model", label: "3D model label" },
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
        { type: "string" as const, name: "github", label: "GitHub URL", description: "Not shown on the project page (the repositories are private)." },
        { type: "string" as const, name: "oshwlab", label: "OSHWLab URL" },
        { type: "string" as const, name: "liveDemo", label: "Live Demo URL" },
      ],
    },
    {
      type: "boolean" as const,
      name: "featured",
      label: "Featured (not used at the moment)",
      description: "Kept for later. Home shows the first 6 projects by Order below.",
    },
    {
      type: "number" as const,
      name: "order",
      label: "Order",
      description: "Lower number = shown first, on Projects and Home (Home shows the first 6).",
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

// ─── Blog ────────────────────────────────────────────────────────────────────

const blogCollection: Collection = {
  name: "blog",
  label: "Blog",
  path: "src/content/blog",
  format: "mdx" as const,
  // New posts start hidden; Saad unticks Draft to publish.
  defaultItem: () => ({ draft: true, date: new Date().toISOString() }),
  fields: [
    { type: "string" as const, name: "title", label: "Title", required: true, isTitle: true },
    {
      type: "string" as const,
      name: "summary",
      label: "Summary",
      required: true,
      description: "One or two sentences, shown on the blog list and in search results.",
      ui: { component: "textarea" as const },
    },
    { type: "datetime" as const, name: "date", label: "Publish date", required: true },
    {
      type: "string" as const,
      name: "tags",
      label: "Tags",
      list: true,
      description: "Lowercase (esp32, lora, pcb design). Displayed with the right capitals automatically.",
    },
    { type: "object" as const, name: "coverImage", label: "Cover Image (optional)", fields: imageFields("Cover") },
    {
      type: "string" as const,
      name: "project",
      label: "Related project slug",
      description: "Optional. The project file name without .mdx, e.g. lora-gps-tracker.",
    },
    {
      type: "boolean" as const,
      name: "draft",
      label: "Draft (hide from site)",
      description: "Drafts are only visible on the local dev server. Untick to publish.",
    },
    { type: "rich-text" as const, name: "body", label: "Post", isBody: true },
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
    // GitHub Pages serves the site under /portfolio/ (astro.config.mjs
    // `base`), so /admin lives at /portfolio/admin/ and loads its files there.
    basePath: "portfolio",
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
      resumeCollection,
      experienceCollection,
      educationCollection,
      certificationsCollection,
      skillsCollection,
      blogCollection,
    ],
  },
});
