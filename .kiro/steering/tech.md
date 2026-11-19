---
inclusion: always
---

# Tech Stack & Architecture Decisions

## Stack
- **Framework:** Astro, `output: 'static'`. Do not switch to `output: 'server'`
  or add an SSR adapter — see "Critical constraint" below.
- **CMS:** Tina CMS, using **Tina Cloud** (free tier) as the content API/auth
  backend — NOT the self-hosted Tina Data Layer.
- **Hosting:** GitHub Pages, project site at
  `https://smsaad-181.github.io/portfolio/` (repo is `smsaad-181/portfolio`,
  not a `<user>.github.io` root repo).
- **CI/CD:** GitHub Actions, official `actions/deploy-pages` flow (not
  `peaceiris/actions-gh-pages`).
- **Package manager:** npm (use `npm ci` in CI for reproducible installs).
- **Language:** TypeScript, strict mode, for Astro components and content
  collection schemas (zod).

## Critical constraint: why Tina Cloud, not self-hosted Tina

Tina has two editing modes:

1. **Live visual editing** (click-to-edit on the rendered page) requires Astro
   `output: 'server'` plus an SSR adapter, because the editor re-fetches
   content through an on-demand `/tina-island` route. **GitHub Pages cannot
   run server routes** — it only serves static files. This mode is
   incompatible with the hosting choice and must not be used.
2. **Form-based admin editing** (`/admin`, structured forms) is a statically
   built admin bundle that talks to a content API and commits directly to
   GitHub. Only the content API needs a backend — and that's what Tina Cloud
   provides, for free, without us hosting anything ourselves.

**Decision: use mode 2, backed by Tina Cloud.** This is non-negotiable for this
hosting setup unless the hosting platform changes.

If Tina Cloud ever becomes unworkable, **Keystatic** (zero backend, fully
git-based) is a compatible fallback for the same content-collection
architecture — do not build this now, just don't couple `src/content/*`
schemas to Tina-specific APIs, so a swap stays cheap later.

## Astro config requirements (do not deviate)
```js
// astro.config.mjs
export default defineConfig({
  site: 'https://smsaad-181.github.io',
  base: '/portfolio',
  output: 'static',
  trailingSlash: 'always', // pick one value and be consistent everywhere
});
```
- Every internal link and asset path must respect `base`. Do not hardcode
  absolute paths like `/projects/foo` — use Astro's base-aware link helpers or
  relative links, or links will 404 in production (this bug will NOT show up
  in local dev, only after deploy — treat it as a required check, not an
  afterthought).
- A `404.astro` page is required at the project root of `src/pages/` so
  GitHub Pages has a working fallback page.
- If a custom domain is added later: remove `base`, add `public/CNAME`, and
  update `site` — this is a documented future migration, not part of v1.

## Content collections ↔ Tina schema
Tina's schema (`tina/config.ts`) must point at the exact same files Astro's
content collections (`src/content/config.ts`) read — both read/write
`src/content/*`. Never let Tina write to a separate content directory; this
is what keeps CMS edits and Astro's typed content collections in sync.

## Media
Tina Cloud's media manager commits uploaded images into `public/` in the repo.
Always render project/gallery images through Astro's `<Image />` component
(never a raw `<img>`), so uploads get optimized at build time regardless of
source file size.
