# Dependency security status

Last reviewed: 26 Nov 2026 (`npm audit`, Node 22.23.5) — **0 vulnerabilities**.

## History

| Date | Change | Advisories |
|---|---|---|
| 20 Nov 2026 | Starting point (Astro 5.18, TinaCMS 2, Tina CLI 1) | 57 — 8 critical, 32 high |
| 20 Nov 2026 | `npm audit fix` (non-breaking) | 47 — 7 critical, 23 high |
| 20 Nov 2026 | Astro 7.4, TinaCMS 3.15, Tina CLI 4.0, sharp 0.35.5 | 16 — 0 critical, 8 high |
| 20 Nov 2026 | `overrides` for qs, postcss-selector-parser, katex | 10 — 0 critical, 8 high (zod via Tina), 2 moderate (Altair) |
| 26 Nov 2026 | TinaCMS and the Tina CLI removed (Saad chose no CMS); the three `overrides` (only used by Tina's packages) dropped | **0** |

## Accepted for now

None. The last 10 advisories (zod 3 inside TinaCMS, Altair inside the Tina
CLI) left with Tina itself.

## Rules

- Run `npm audit` after adding or upgrading a dependency; CI blocks on any
  critical advisory (`npm audit --audit-level=critical`).
- Never run `npm audit fix --force` without reading what it changes — it can
  propose major-version downgrades.
- Patched versions inside the same major go in `package.json` → `overrides`.
- Secrets live only in the git-ignored root `.env` and in GitHub Actions
  secrets — see `CLAUDE.md` → "Secrets & deploy".
