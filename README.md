# Sultan Mahmud — Portfolio

Static portfolio for Sultan Mahmud ("Saad"), a Hardware Engineer working on PCB
design, embedded firmware and IoT (ESP32, LoRaWAN, Modbus, MQTT).

**Live site:** https://smsaad-181.github.io/portfolio/
**CMS admin:** https://smsaad-181.github.io/portfolio/admin/ (after Tina Cloud setup)

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Astro 7 (`output: "static"`, content collections) |
| CMS | TinaCMS 3 + Tina Cloud (form-based `/admin`) |
| Hosting | GitHub Pages, project site under `/portfolio` |
| CI/CD | GitHub Actions → `actions/deploy-pages` |
| 3D boards | three.js viewer; GLBs converted from each project's STEP (one node per part, BOM data, 2D layout texture) |
| Language | TypeScript (strict) · Node 22 (`.nvmrc`) |

## Local development

```bash
npm install
cp .env.example .env      # Tina credentials go here; never commit .env
npm run dev               # http://localhost:4321/portfolio/  (CMS: /portfolio/admin/)
```

| Command | What it does |
|---|---|
| `npm run build` | `tinacms build && astro build` → `dist/` (needs Tina Cloud credentials) |
| `npm run build:site` | Site only (`astro build`), for local use without Tina Cloud |
| `npm run check` | `astro check` type-check, must be 0 errors / 0 warnings |
| `npm run check:links` | After a build: every internal link resolves under `/portfolio` |
| `npm run check:drafts` | After a build: no `draft: true` project reaches `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm run cv:pdf` | With the dev server running: export the resume page to the CV PDF (A4) |
| `npm run audit:pages` | With `preview` running: every page × both themes × 1440/375 px — console errors, failed requests, AA contrast |

## One-time setup (manual)

1. **GitHub Pages:** Settings → Pages → Source → **GitHub Actions** (done).
2. **Tina Cloud:** sign in at [app.tina.io](https://app.tina.io), add the
   `smsaad-181/portfolio` project, copy the **Client ID** and **read-only token**
   into `.env`.
3. **GitHub secrets:** add `TINA_CLIENT_ID` and `TINA_TOKEN`
   (Settings → Secrets and variables → Actions). Until these exist the deploy
   workflow stops at the Tina build step and the live site is not updated.
4. **CV:** generated from the resume page with `npm run cv:pdf` (re-run after content changes).
5. **Contact form:** get a Web3Forms access key (web3forms.com), put it in `.env` as
   `PUBLIC_WEB3FORMS_KEY` and add GitHub secret `WEB3FORMS_KEY`. Without it the form stays hidden.
6. **Social links:** verified on 21 Nov 2026 (LinkedIn, GitHub, OSHWLab in `src/content/profile/saad.json`).

## Content

- Projects: `src/content/projects/*.mdx`. Images in
  `public/images/projects/<slug>/`, 3D boards in `public/models/<slug>/`.
- Profile, experience, education, certifications, skills: JSON in `src/content/`.
- Schemas: `src/content.config.ts` (zod), mirrored in `tina/config.ts`. Change both together.
- Facts must come from `.claude/skills/portfolio-content-seed/references/`;
  open questions are tracked in `docs/FACT-CHECK.md`.

After Tina Cloud is set up, edits saved in `/admin` commit to `main` and
GitHub Actions redeploys automatically.

## Docs

- `docs/PLAN-v2.md`: current implementation plan (phase by phase)
- `docs/spec/`: requirements, design and tasks
- `docs/SECURITY.md`: dependency advisories and accepted risks
- `docs/FACT-CHECK.md`: claims for Saad to confirm
- `CLAUDE.md`: project rules
