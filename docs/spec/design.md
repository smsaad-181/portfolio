# Design Document

Full architectural rationale lives in `.kiro/steering/` — this document is
the implementation-facing summary. Read `tech.md`, `content-model.md`,
`structure.md`, `design-guidelines.md`, and `deployment-cicd.md` before
implementing.

## Architecture overview

```
┌─────────────┐   commits content    ┌──────────────────┐
│  Tina Cloud  │──────as files───────▶│  GitHub repo      │
│ (auth + API) │                       │  (main branch)     │
└─────────────┘                       └────────┬───────────┘
      ▲                                          │ push
      │ Saad edits via /admin (static bundle)    ▼
      │                                 ┌──────────────────┐
      │                                 │ GitHub Actions    │
      │                                 │ build+deploy      │
      │                                 └────────┬───────────┘
      │                                          ▼
      │                                 ┌──────────────────┐
      └─────────────────────────────────│  GitHub Pages     │
                                         │ (static site)      │
                                         └──────────────────┘
```

Key point: there is no application server anywhere in this diagram after
build time. The `/admin` bundle deployed to GitHub Pages is itself static —
it calls out to Tina Cloud's hosted API for auth and commits, not to
anything we host.

## Components

- **Astro static site** — pages/layouts/components per `structure.md`.
- **Content collections** (`src/content/config.ts`) — zod schemas per
  `content-model.md`, single source of truth for what "valid content" means.
  The Astro build fails if Tina-saved content violates these schemas — this
  is the intended safety net (Requirement 2.4).
- **Tina schema** (`tina/config.ts`) — mirrors the content collections
  exactly, targeting the same file paths, so the CMS and the typed content
  layer never drift apart.
- **GitHub Actions workflow** — per `deployment-cicd.md`.

## Data flow for a content edit
1. Saad opens `/admin` (deployed alongside the static site), authenticates
   via Tina Cloud (GitHub OAuth).
2. Saad edits a form-driven view of, say, `src/content/projects/foo.mdx`.
3. On save, Tina Cloud commits the updated file directly to `main`.
4. GitHub Actions' push trigger fires, rebuilds, redeploys.
5. Astro's content collection schema validates the file during the build; a
   missing required field fails the build instead of shipping broken content.

## Page-level design

- `/` — hero, short bio pulled from `profile`, featured projects (filtered
  by `featured: true`, sorted by `order`), skill highlights, resume CTA.
- `/about` — full bio + timeline built from `experience` and `education`
  collections + `certifications`.
- `/projects` — grid of all non-draft projects; client-side filter UI by
  `tags` and `status`.
- `/projects/[slug]` — one page per project via `getStaticPaths()` over the
  `projects` collection, excluding `draft: true` entries.
- `/contact` — static links + a static-form-service embed or `mailto:`.
- `/resume` — links directly to the current PDF in `public/resume/`.
- `404.astro` — required for GitHub Pages fallback behavior.

## Draft filtering (Requirement 2.3)
Implement as a single shared helper (e.g. `getPublishedProjects()`) used by
every page/query that lists projects, rather than repeating the
`draft !== true` filter inline in multiple places — this avoids a future page
accidentally leaking draft content because someone forgot the filter.

## SEO/perf
- `@astrojs/sitemap` integration, base-path aware.
- `robots.txt` in `public/`.
- Per-page meta/OpenGraph tags sourced from `profile` + per-project
  `summary`/`coverImage`.
- All images through Astro's `<Image />` component (Requirement 6.1,
  `design-guidelines.md`).

## Testing/validation approach
- Content schema validation IS the primary content test (fails the build on
  bad data — no separate test suite needed for content correctness).
- Verify the `base: '/portfolio'` path is correct by testing the actual
  deployed GitHub Pages URL after the first real deploy, not just local dev
  (`astro dev` does not reproduce base-path bugs the same way production
  does).
- Manual Lighthouse audit pass before considering the site "launched"
  (Requirement 6.2).
