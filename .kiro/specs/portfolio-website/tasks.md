# Implementation Plan

Read `requirements.md` and `design.md` (and all of `.kiro/steering/`) before
starting. Use `.kiro/skills/portfolio-content-seed/` when seeding real
content in Task 9 — don't load it earlier, it's on-demand reference material,
not architectural context.

- [ ] 1. Scaffold Astro project into the existing folder structure
  - Initialize Astro with TypeScript strict mode into this repo (folders
    already exist per `structure.md` — do not restructure)
  - Install `@astrojs/sitemap`
  - Configure `astro.config.mjs` exactly per `tech.md` (`site`, `base`,
    `output: 'static'`, `trailingSlash`)
  - _Requirements: 1.4_

- [ ] 2. Define content collections
  - Write `src/content/config.ts` per `content-model.md` (all six
    collections, required-field enforcement, URL validation on link fields)
  - _Requirements: 2.3, 2.4, 3.2, 6.1_

- [ ] 3. Seed initial content
  - Create real Markdown/MDX files for `profile`, `experience`, `education`,
    `certifications`, and `skills` using
    `.kiro/skills/portfolio-content-seed/references/cv-data.md`
  - Create project entries using
    `.kiro/skills/portfolio-content-seed/references/projects-inventory.md`;
    for projects marked `[NEEDS INPUT]` in that file, create a stub entry
    with `draft: true` rather than inventing details
  - _Requirements: 2.3, 7.2_

- [ ] 4. Build layouts and shared components
  - Base layout (dark theme per `design-guidelines.md`), nav, footer,
    `ProjectCard`, status badge, tag chip component
  - _Requirements: 3.1, 6.1_

- [ ] 5. Build pages
  - `/`, `/about`, `/projects` (with tag/status filter), `/projects/[slug]`,
    `/contact`, `/resume`, `404.astro`
  - Implement a single shared `getPublishedProjects()` helper and use it
    everywhere projects are listed (see design.md "Draft filtering")
  - _Requirements: 2.3, 3.1, 3.2, 3.3, 4.2, 5.1, 6.3_

- [ ] 6. Integrate Tina CMS
  - `tinacms init`, framework = "Other"
  - Write `tina/config.ts` mirroring `src/content/config.ts` exactly, same
    file paths
  - Verify `/admin` works in Tina's local dev mode before connecting Tina
    Cloud
  - _Requirements: 2.1, 2.2_

- [ ] 7. Wire up GitHub Actions deploy workflow
  - Write `.github/workflows/deploy.yml` per `deployment-cicd.md` (a
    skeleton already exists in this repo — finalize build/env steps)
  - Confirm `TINA_CLIENT_ID`/`TINA_TOKEN` are read from repo secrets, not
    hardcoded
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 8. SEO & performance pass
  - Sitemap, robots.txt, per-page meta/OG tags, confirm all images use
    `<Image />`
  - _Requirements: 6.1, 6.2_

- [ ] 9. Populate remaining content via live `/admin`
  - After first successful deploy, fill in every `[NEEDS INPUT]` /
    `draft: true` project through the real Tina Cloud-backed admin — this is
    also the end-to-end test that the CMS workflow actually works
  - _Requirements: 2.1, 2.2, 2.5_

- [ ] 10. Launch checklist
  - Confirm GitHub repo Settings → Pages → Source = "GitHub Actions" (manual,
    Saad-only step — verify, don't assume)
  - Full pipeline dry run: push → Actions run → live URL, check every
    internal link/asset against the `/portfolio` base path
  - Lighthouse audit
  - _Requirements: 1.4, 6.2_
