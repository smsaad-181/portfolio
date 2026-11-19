---
inclusion: always
---

# Deployment & CI/CD

## GitHub Pages
- Repo: `smsaad-181/portfolio` → deploys to
  `https://smsaad-181.github.io/portfolio/` (a project site, not a
  `<user>.github.io` root site) — see `tech.md` for the required
  `site`/`base` config this implies.
- **One manual step Kiro cannot do:** in the GitHub repo, Settings → Pages →
  Source must be set to **"GitHub Actions"** (not "Deploy from a branch").
  Call this out explicitly to Saad as a manual action item; do not assume it
  is already set.
- A real `404.html` must land at the deployed root path so GitHub Pages'
  static fallback works.

## GitHub Actions workflow (`.github/workflows/deploy.yml`)
Use the official first-party flow: `actions/checkout` →
`actions/setup-node` → install deps (`npm ci`) → build (must run
`tinacms build` as part of/before the Astro build so the `/admin` bundle
ships with the rest of the static site) → `actions/upload-pages-artifact`
pointed at `dist/` → `actions/deploy-pages`.

Required:
- `permissions: { contents: read, pages: write, id-token: write }`.
- `concurrency: { group: "pages", cancel-in-progress: true }` — Tina Cloud
  commits and Saad's manual pushes can both land on `main` in quick
  succession; without this, an older in-flight build can race a newer one to
  deploy.
- Trigger on `push` to `main` — this covers both Saad's manual pushes and
  Tina Cloud's content commits without any special-casing.
- Node version pinned identically in `package.json` `engines` and in the
  workflow's `setup-node` step, to avoid version drift between local dev and
  CI.
- Repo secrets required: `TINA_CLIENT_ID`, `TINA_TOKEN` — referenced as env
  vars in the build step. These must be set in GitHub Settings → Secrets and
  variables → Actions by Saad (Kiro cannot create secrets).
- The build must fail loudly (and not deploy) on a schema validation error —
  this is a deliberate safety net so a bad Tina edit can't silently break the
  live site.

## Tina Cloud (manual account setup — Saad's responsibility, not Kiro's)
1. Sign up at tina.io with GitHub login, register `smsaad-181/portfolio`.
2. Get `TINA_CLIENT_ID` and a read-only token.
3. Add both as GitHub Actions secrets (see above).
Kiro should scaffold everything needed to consume these env vars, but cannot
create the Tina Cloud account or the GitHub secrets itself — flag these as
explicit setup steps for Saad in the README / final summary.
