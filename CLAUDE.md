# Sultan Mahmud (Saad) — Portfolio

Hiring-facing portfolio for a **Hardware Engineer** (PCB design, embedded
firmware, IoT — ESP32, LoRaWAN, Modbus, MQTT). Visitors are recruiters and
hiring managers. Every page must be accurate, fast, and accessible.

- **Current plan:** `docs/PLAN-v2.md` — work **one phase at a time**; a phase is
  done only when its acceptance criteria pass, with evidence.
- **Spec:** `docs/spec/` (requirements, design, tasks).
- **Full rationale:** `.kiro/steering/*.md`. `.kiro/` belongs to Kiro — read it,
  never edit it.

## Stack & commands

Astro 7 (`output: "static"`, content collections in `src/content.config.ts`) ·
TinaCMS 3 on Tina Cloud (form-based `/admin`) · GitHub Actions → GitHub Pages ·
TypeScript strict · npm · Node ≥ 22.23.4 (`.nvmrc`).

| Command | What it does |
|---|---|
| `npm run dev` | Tina + Astro dev server → http://localhost:4321/portfolio/ (CMS at `/portfolio/admin/`) |
| `npm run build` | `tinacms build && astro build` → `dist/`. Needs Tina Cloud credentials in `.env` (CI has them as secrets) |
| `npm run build:site` | Site only (`astro build`) — use locally until Tina Cloud is set up. Don't use `tinacms build --local`: its server never exits |
| `npm run check` | `astro check` type-check (CI runs this; must be 0 errors, 0 warnings) |
| `npm run check:links` | After a build: every internal href/src in `dist/` resolves under `/portfolio` |
| `npm run check:drafts` | After a build: no `draft: true` project appears in `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm run audit:pages` | With `preview` running: every page × dark/light × 1440/375 px in Edge — console errors, failed requests, axe AA contrast. Must be 0 |

Credentials: root `.env` (copy `.env.example`). Every `.env*` except the
template is git-ignored — verify with `git check-ignore .env` before any commit.

## Hard constraints (do not change without re-reading `.kiro/steering/tech.md`)

- `astro.config.mjs`: `site: "https://smsaad-181.github.io"`, `base: "/portfolio"`,
  `output: "static"`, `trailingSlash: "always"`.
- **Never** `output: "server"` or an SSR adapter. GitHub Pages is static-only,
  so Tina's live visual editing is out. Form-based `/admin` only.
- Tina Cloud, not the self-hosted Tina data layer. Keep `src/content/*` schemas
  free of Tina-specific APIs (Keystatic is the documented fallback).
- `src/pages/404.astro` must exist (GitHub Pages fallback).

## Rules

### Links & routing
- Every internal link and asset must respect `base` — never hard-code
  `/projects/foo`. These bugs only appear after deploy.
- Build URLs through the base-aware helpers in `src/lib/urls.ts`
  (`projectUrl(entry)`, `pageUrl(path)`) — *added in Phase 1*. Project slugs
  never include the file extension (`/projects/home-automation-v2/`).
- Canonical URLs come from `Astro.site` + base, never from the request host.
- Exactly one `<h1>` per page. Titles: `"{Page} · Sultan Mahmud"`; Home is
  `"Sultan Mahmud — Hardware Engineer"`.

### Content model
- `src/content.config.ts` (zod) and `tina/config.ts` must target **the same
  files with the same field names**. Change both in the same turn, every time.
- List projects only through `getPublishedProjects()` /
  `getFeaturedProjects()` in `src/lib/projects.ts`. `draft: true` must never
  reach `dist/`.
- Tags and skill categories are free text, stored lowercase. Display them via
  `formatTag()` (acronym map: IoT, PCB, ESP32, I²C, UART, EasyEDA …) — *added in
  Phase 4*. Never naively title-case ("Iot", "Esp32" are bugs).
- Required: `title`, `slug`, and `alt` on every image. Link fields are
  validated as URLs. A bad CMS save should fail the build loudly.

### Facts — never invent
- Use only `.claude/skills/portfolio-content-seed/references/` and existing
  content. No made-up numbers, part numbers, dates, metrics or outcomes.
- Mark anything unknown `TODO(saad)` (in content) and keep incomplete projects
  `draft: true`. Saad confirms facts in `docs/FACT-CHECK.md` (Phase 4).

### Images & design
- Project photos/schematics: Astro `<Image />` only, never raw `<img>`, with
  meaningful alt text. Put optimisable images in `src/assets/`
  (`profile/portrait.*`, `projects/<slug>/`).
- Never show placeholder or admin text to the public ("upload via /admin",
  "if the link is broken…"). Hide the element instead.
- Visual identity is **Saad's choice (20 Nov 2026), overriding the plan's
  copper direction**: deep violet-black, pink → violet → blue gradient,
  flowing line-art hero with his cut-out portrait, "Hello, I'm" + gradient
  name + role pill. Fonts: Rubik (text), JetBrains Mono (labels), Mr Dafoe
  (signature logo only). Don't redesign away from it without asking him.
- WCAG AA contrast in **both** themes. No hard-coded colours outside
  `src/styles/tokens.css` (exceptions: the OG image generator and the SVG
  favicon, which keep their own copy of the values).
- Respect `prefers-reduced-motion`.

### Secrets & deploy
- Never commit secrets. `TINA_PUBLIC_CLIENT_ID` / `TINA_TOKEN` come from env
  locally and from GitHub secrets `TINA_CLIENT_ID` / `TINA_TOKEN` in CI.
- Node version pinned identically in `package.json` `engines`, `.nvmrc` and
  `deploy.yml`.
- CI must fail and not deploy on any check/build error. Saad does these
  manually: create the GitHub repo, set Pages source to "GitHub Actions",
  register Tina Cloud, add secrets — always call them out, never assume them.

## Agents & skills

| Use | When |
|---|---|
| `qa-reviewer` agent | Before calling a phase/task done; after routing, schema or deploy changes |
| `content-modeler` agent | Editing `src/content.config.ts`, `tina/config.ts`, or seeding content |
| `tina-integrator` agent | Tina setup, `/admin` build, Tina Cloud wiring |
| `deployment-engineer` agent | `deploy.yml`, `astro.config.mjs` deploy settings, failed deploys |
| `portfolio-content-seed` skill | Any time you write facts about Saad or his projects |

## Workflow

1. Read the current phase in `docs/PLAN-v2.md` before starting.
2. Make the change; keep it scoped to the phase.
3. Verify: `npx astro check`, build, and the phase's own checks.
4. Open the changed page in the local browser for Saad and give the URL.
5. Report each acceptance criterion as pass/fail with evidence; list what Saad
   must provide or do manually.
