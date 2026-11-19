# Dependency security status

Last reviewed: 20 Nov 2026 (`npm audit`, Node 22.23.5).

## History

| Date | Change | Advisories |
|---|---|---|
| 20 Nov 2026 | Starting point (Astro 5.18, TinaCMS 2, Tina CLI 1) | 57 — 8 critical, 32 high |
| 20 Nov 2026 | `npm audit fix` (non-breaking) | 47 — 7 critical, 23 high |
| 20 Nov 2026 | Astro 7.4, TinaCMS 3.15, Tina CLI 4.0, sharp 0.35.5 | 16 — 0 critical, 8 high |
| 20 Nov 2026 | `overrides` for qs, postcss-selector-parser, katex | 10 — 0 critical, 8 high (zod via Tina), 2 moderate (Altair) |

## Accepted for now (no fix available upstream)

| Package | Severity | Why it remains | Exposure |
|---|---|---|---|
| `zod` 3.25.x inside TinaCMS (`@tinacms/schema-tools`, `@tinacms/graphql`, `@tinacms/mdx`, `@tinacms/app`) — GHSA-mrhx-c7xc-m3w5 | high (counted once per Tina package) | Fixed only in zod ≥ 4.6.6. Tina 3.15 is built on zod 3; forcing zod 4 into it would break the CMS. | Memory exhaustion when validating oversized input. Runs at build time on our own content and inside the CMS editor for authenticated edits. The public site is static HTML and never runs zod. |
| `altair-static` / `altair-express-middleware` inside `@tinacms/cli` — GHSA-752m-7p75-49gf | moderate | Fix needs Altair 8 (major); it is pinned by the Tina CLI. | Only the local GraphQL playground served by `tinacms dev` on localhost. Never deployed. |

**Action:** re-run `npm audit` whenever TinaCMS releases; when a version built
on zod ≥ 4.6.6 ships, upgrade and delete the matching row above.

## Rules

- Never run `npm audit fix --force` here — for these advisories it proposes
  downgrading TinaCMS to 1.x.
- Patched versions inside the same major go in `package.json` → `overrides`.
- Secrets live only in the git-ignored root `.env` and in GitHub Actions
  secrets — see `CLAUDE.md` → "Secrets & deploy".
