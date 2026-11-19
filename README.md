# Sultan Mahmud — Portfolio

Static portfolio site for Sultan Mahmud ("Saad"), a Hardware Engineer specialising in PCB design, embedded systems, and IoT product development.

**Live site:** https://smsaad-181.github.io/portfolio/
**CMS admin:** https://smsaad-181.github.io/portfolio/admin/

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Astro 5 (`output: static`) |
| CMS | Tina CMS + Tina Cloud (form-based `/admin`) |
| Hosting | GitHub Pages (project site at `/portfolio`) |
| CI/CD | GitHub Actions → `actions/deploy-pages` |
| Language | TypeScript (strict mode) |

---

## One-time setup (manual steps Kiro cannot do)

### 1. GitHub Pages source

In the GitHub repo:

> **Settings → Pages → Build and deployment → Source → GitHub Actions**

Not "Deploy from a branch" — that will not work with this workflow.

### 2. Tina Cloud account

1. Go to [app.tina.io](https://app.tina.io) and sign in with your GitHub account.
2. Click **Add project** and select the `smsaad-181/portfolio` repository.
3. From the project settings, copy:
   - **Client ID** (starts with a UUID-like string)
   - **Read-only token**

### 3. GitHub Actions secrets

In the GitHub repo:

> **Settings → Secrets and variables → Actions → New repository secret**

Add two secrets:

| Secret name | Value |
|------------|-------|
| `TINA_CLIENT_ID` | The Client ID from Tina Cloud |
| `TINA_TOKEN` | The read-only token from Tina Cloud |

### 4. Verify social links and profile URLs

The seeded `src/content/profile/saad.json` uses placeholder URLs for GitHub, LinkedIn, and OSHWLab. **Verify these are correct before the first deploy:**

```json
"socialLinks": {
  "github": "https://github.com/smsaad-181",
  "linkedin": "https://linkedin.com/in/sultan-mahmud-saad",
  "oshwlab": "https://oshwlab.com/smsaad181"
}
```

Update via the CMS `/admin` → Profile, or edit the file directly.

### 5. Upload resume PDF

Upload your CV as a PDF via `/admin` → Profile → Resume PDF field. Or drop the file into `public/resume/` and update the `resume` field in `src/content/profile/saad.json` to match the filename.

### 6. Add project cover images

The 6 fully-written projects reference cover images at paths like:
```
src/content/projects/home-automation-v2.mdx
  coverImage.src: ../../public/images/projects/home-automation-v2/cover.jpg
```

Either:
- **Via CMS:** log into `/admin` → Projects, open each project, and upload a cover image using the image field.
- **Manually:** drop images into `public/images/projects/<slug>/cover.jpg` and commit.

### 7. OG default image

`public/images/og-default.svg` is provided as a source file.
Export it to `public/images/og-default.png` (1200×630 px) before launch — Twitter/X does not render SVG OG images. Any image editor or `inkscape --export-png` works.

### 8. Complete draft projects

7 projects are seeded as `draft: true` stubs. After the first successful deploy, log into `/admin` → Projects and fill in the details for each:

- Acqua Node V1.2
- ESP32 IoT Vehicle Motion Analyzer
- ESP32 MLX90640 IR Thermal Camera
- ESP32 Standalone Board
- Fingerprint V1.1
- Fingerprint V1.2
- IoT Activity Tracker

Set `draft: false` once a project is ready to publish. Each save triggers a deploy automatically.

---

## Local development

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in Tina credentials (or leave blank for local-only mode)
cp .env.example .env

# 3. Start dev server (Tina + Astro together)
npm run dev
```

The dev server starts at `http://localhost:4321/portfolio/`.
The local Tina admin is at `http://localhost:4321/portfolio/admin/`.

> **Note:** In local dev, Tina runs in "local" mode (reads/writes files directly on disk, no Tina Cloud auth required). Cloud auth only applies on the deployed site.

---

## Build

```bash
npm run build
# Equivalent to: tinacms build && astro check && astro build
```

Output goes to `dist/`. The CI workflow runs this exact sequence as three separate steps so Tina schema errors are easy to distinguish from Astro build errors in the Actions log.

---

## Content editing (after launch)

1. Go to `https://smsaad-181.github.io/portfolio/admin/`
2. Log in with your GitHub account (via Tina Cloud OAuth)
3. Edit any collection (Projects, Profile, Skills, Experience, etc.)
4. Click **Save** — Tina commits the change directly to `main`
5. GitHub Actions triggers automatically, rebuilds, and redeploys (~2 min)

**No local dev tools needed to update content.**

---

## Post-launch: Lighthouse audit

After the first successful deploy, run a Lighthouse audit:

1. Open `https://smsaad-181.github.io/portfolio/` in Chrome
2. DevTools → Lighthouse → Desktop + Mobile → Analyze page load
3. Target: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95, Best Practices ≥ 95

Common issues to check:
- Missing project cover images (will fail LCP)
- Missing OG PNG (social sharing)
- All project `alt` text is descriptive (checked at build time by Zod schema)

---

## Adding new content types (future)

To add a blog/notes section:
1. Add a new collection to `src/content.config.ts` (follow the `projects` pattern)
2. Mirror it in `tina/config.ts` (same fields, same path)
3. Create a `src/pages/notes/` directory with `index.astro` and `[slug].astro`

No schema migration required — the free-text tag/category pattern means new tags and categories are addable without code changes.

---

## Project structure

```
portfolio/
├── .github/workflows/deploy.yml   # CI/CD: build + deploy on push to main
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── images/                    # Project photos, OG image
│   └── resume/                    # CV PDF (Tina-managed)
├── src/
│   ├── components/                # Nav, Footer, ProjectCard, StatusBadge, TagChip, …
│   ├── content/                   # All content files (JSON + MDX)
│   │   ├── config.ts              # Zod schemas — single source of truth
│   │   ├── profile/saad.json
│   │   ├── experience/
│   │   ├── education/
│   │   ├── certifications/
│   │   ├── skills/
│   │   └── projects/              # 14 MDX files (6 published, 7 drafts, 1 in-progress)
│   ├── layouts/BaseLayout.astro   # Global <head>, nav, footer
│   ├── lib/projects.ts            # getPublishedProjects() — draft filter helper
│   ├── pages/                     # /, /about, /projects, /contact, /resume, /404
│   └── styles/global.css          # CSS custom properties, dark theme
├── tina/config.ts                 # Tina CMS schema (mirrors src/content.config.ts)
├── astro.config.mjs
└── package.json
```
