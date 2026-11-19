---
inclusion: always
---

# Content Model (Astro Content Collections + Tina Schema)

Design principle: **skills and tags are free-text/array fields, not fixed
enums.** Saad will keep adding skills and project tags over time; a hardcoded
dropdown would require a code change every time, which defeats the point of
using a CMS.

## Collections

### `profile` (singleton)
name, title, location, summary (rich text), avatar (image, required alt),
socialLinks (github, linkedin, oshwlab — validated as URLs), resume (file,
required).

### `experience[]`
company, role, startDate, `current: boolean` (drives "Present" label instead
of a hand-typed end date string), endDate (nullable, only used if
`current === false`), bullets[] (string array), tags[] (free text).

### `education[]`
degree, institute, group, year, result.

### `certifications[]`
name, issuer (optional), year (optional).

### `skills[]`
name, category (free text — group in UI by whatever categories exist, don't
hardcode a category list), proficiency (optional enum 1–5).

### `projects[]`
title, slug (required, unique), summary, description (rich text / MDX —
supports inline images within the write-up, not just a flat string),
coverImage (image, **required alt text**), gallery[] (images, required alt
text each), tags[] (free text array, e.g. "ESP32", "PCB Design", "MQTT"),
status (enum: `completed` | `in-progress` | `prototype`), role, dateCompleted,
links (github?, oshwlab?, liveDemo? — each validated as a URL, not free text),
featured (boolean), order (number — controls manual ordering of featured
projects on the homepage), draft (boolean, default `false`), bomHighlights[]
(optional structured list of key components).

## Required corner-case behaviors
- `draft: true` projects must never appear in the production build output.
  Enforce this as a build-time filter, and add a test/assertion for it — not
  just a visual check.
- Zod schema marks `title`, `slug`, `coverImage`, and each image's `alt` as
  **required** — a malformed Tina save should fail the Astro build loudly
  (via the content collection schema) rather than ship a broken or
  inaccessible page.
- `tags` and `skills.category` are free text. Normalize casing at render
  time (e.g., always lowercase internally, title-case for display) so
  "esp32" and "ESP32" don't become two different tags in the UI.
- `links.*` fields are validated as URLs at the schema level, not accepted as
  arbitrary strings, to catch typos before they ship.
- Tina's schema (`tina/config.ts`) must target the exact same file paths as
  `src/content/config.ts` — see `tech.md`.

## Seed data
Use `.kiro/skills/portfolio-content-seed/` (an on-demand skill, not always
loaded) for the actual CV facts and known project details to seed this
content on first build. Don't duplicate that data into this always-on
steering file.
