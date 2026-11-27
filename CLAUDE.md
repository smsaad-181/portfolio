# Sultan Mahmud (Saad) — Portfolio

Hiring-facing portfolio for a **Hardware Engineer** (PCB design, embedded
firmware, IoT — ESP32, LoRaWAN, Modbus, MQTT). Visitors are recruiters and
hiring managers. Every page must be accurate, fast, and accessible.

- **Start here:** `docs/HANDOFF.md` — current state, open tasks, gotchas. Read it
  first instead of re-exploring; update it (and push) after every finished task.
- **Current plan:** `docs/PLAN-v2.md` — work **one phase at a time**; a phase is
  done only when its acceptance criteria pass, with evidence.
- **Spec:** `docs/spec/` (requirements, design, tasks).
- **Full rationale:** `.kiro/steering/*.md`. `.kiro/` belongs to Kiro — read it,
  never edit it.

## Stack & commands

Astro 7 (`output: "static"`, content collections in `src/content.config.ts`) ·
no CMS — content is files in `src/content/` · GitHub Actions → GitHub Pages ·
TypeScript strict · npm · Node ≥ 22.23.4 (`.nvmrc`).

| Command | What it does |
|---|---|
| `npm run dev` | Astro dev server → http://localhost:4321/portfolio/ |
| `npm run build` / `build:site` | `astro build` → `dist/` (same command; CI uses `build:site`) |
| `npm run check` | `astro check` type-check (CI runs this; must be 0 errors, 0 warnings) |
| `npm run check:links` | After a build: every internal href/src in `dist/` resolves under `/portfolio` |
| `npm run check:drafts` | After a build: no `draft: true` project appears in `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm run cv:import -- "<path>\Sultan_Mahmud_Saad_CV.pdf"` | Publishes Saad's own CV PDF (LaTeX, `D:\CV\CV`) byte for byte as the site's download (`public/resume/sultan-mahmud-cv.pdf`) and stamps "Last updated". Then update `src/content/resume/cv.json` to the same text — the `/resume/` page copies the PDF word for word |
| `npm run audit:pages` | With `preview` running: every page × dark/light × 1440/375 px in Edge — console errors, failed requests, every axe WCAG 2.1 A/AA rule (incl. contrast). Must be 0 |

Credentials: root `.env` (copy `.env.example`). Every `.env*` except the
template is git-ignored — verify with `git check-ignore .env` before any commit.

## Hard constraints (do not change without re-reading `.kiro/steering/tech.md`)

- `astro.config.mjs`: `site: "https://smsaad-181.github.io"`, `base: "/portfolio"`,
  `output: "static"`, `trailingSlash: "always"`.
- **Never** `output: "server"` or an SSR adapter. GitHub Pages is static-only.
- **No CMS** (Saad, 26 Nov 2026): TinaCMS was removed — he didn't want a Tina
  Cloud account; content changes go through Claude or GitHub. The Tina parts of
  `.kiro/` and `docs/spec/` are superseded. To bring a CMS back, restore
  `tina/` from git history (`git checkout 55900ea -- tina`), its npm packages
  and its CI step.
- `src/pages/404.astro` must exist (GitHub Pages fallback).

## Rules

### Links & routing
- Every internal link and asset must respect `base` — never hard-code
  `/projects/foo`. These bugs only appear after deploy.
- Build URLs through the base-aware helpers in `src/lib/urls.ts`
  (`projectUrl(entry)`, `pageUrl(path)`) — *added in Phase 1*. Project slugs
  never include the file extension (`/projects/home-automation-v2/`).
- Canonical URLs come from `Astro.site` + base, never from the request host.
- Exactly one `<h1>` per page. Titles: `"{Page} · Sultan Mahmud Saad"`; Home is
  `"Sultan Mahmud Saad — Embedded Engineer & PCB Designer"` (Saad, 26 Nov 2026).

### Content model
- `src/content.config.ts` (zod) is the single source of truth for every
  collection's fields. Content is edited as files in `src/content/`.
- List projects only through `getPublishedProjects()` /
  `getFeaturedProjects()` in `src/lib/projects.ts`. `draft: true` must never
  reach `dist/`.
- Tags and skill categories are free text, stored lowercase. Display them via
  `formatTag()` (acronym map: IoT, PCB, ESP32, I²C, UART, EasyEDA …) — *added in
  Phase 4*. Never naively title-case ("Iot", "Esp32" are bugs).
- Required: `title`, `slug`, and `alt` on every image. Link fields are
  validated as URLs. A bad content edit should fail the build loudly.

### Facts — never invent
- Use only `.claude/skills/portfolio-content-seed/references/` and existing
  content. No made-up numbers, part numbers, dates, metrics or outcomes.
- Mark anything unknown `TODO(saad)` (in content) and keep incomplete projects
  `draft: true`. Saad confirms facts in `docs/FACT-CHECK.md` (Phase 4).

### Images & design
- Project photos/schematics: Astro `<Image />` only, never raw `<img>`, with
  meaningful alt text. Put optimisable images in `src/assets/`
  (`profile/hero-photo.jpg`, `profile/cv-photo.jpg`, `projects/<slug>/`).
- Never show placeholder or admin text to the public ("upload via /admin",
  "if the link is broken…"). Hide the element instead.
- Visual identity is **Saad's choice (20 Nov 2026), overriding the plan's
  copper direction**: deep violet-black, pink → violet → blue gradient,
  flowing line-art hero with his photo in a gradient ring (27 Nov), "Hello, I'm" + gradient
  name + role pill. Fonts: Rubik (text), JetBrains Mono (labels), Mr Dafoe
  (signature logo only); Bitstream Charter only on the resume sheet, to
  match his LaTeX CV (`src/styles/charter.css`, free licence in
  `src/assets/fonts/charter/LICENSE.txt`). Don't redesign away from it
  without asking him. The premium refinement (27 Nov) is in `docs/DESIGN-SYSTEM.md`.
- WCAG AA contrast in **both** themes. No hard-coded colours outside
  `src/styles/tokens.css` (exceptions: the OG image generator and the SVG
  favicon, which keep their own copy of the values, and skill logos, which keep
  their official brand colours from Simple Icons — `src/lib/brand-logos.ts`).
- Respect `prefers-reduced-motion`.

### Secrets & deploy
- Never commit secrets. Keys (e.g. `PUBLIC_WEB3FORMS_KEY`) come from `.env`
  locally and from GitHub secrets in CI (`WEB3FORMS_KEY`).
- Node version pinned identically in `package.json` `engines`, `.nvmrc` and
  `deploy.yml`.
- CI must fail and not deploy on any check/build error. Saad does these
  manually: create the GitHub repo, set Pages source to "GitHub Actions",
  add secrets — always call them out, never assume them.

## Agents & skills

| Use | When |
|---|---|
| `qa-reviewer` agent | Before calling a phase/task done; after routing, schema or deploy changes |
| `content-modeler` agent | Editing `src/content.config.ts` or seeding content |
| `deployment-engineer` agent | `deploy.yml`, `astro.config.mjs` deploy settings, failed deploys |
| `portfolio-content-seed` skill | Any time you write facts about Saad or his projects |

## Workflow

1. Read the current phase in `docs/PLAN-v2.md` before starting.
2. Make the change; keep it scoped to the phase.
3. Verify: `npx astro check`, build, and the phase's own checks.
4. Open the changed page in the local browser for Saad and give the URL.
5. Report each acceptance criterion as pass/fail with evidence; list what Saad
   must provide or do manually.
6. Update `docs/HANDOFF.md` (state, open tasks, a one-line log entry with the
   commit) and push it with the work. No secrets, emails or private links in it.
