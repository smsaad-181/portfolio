# Sultan Mahmud (Saad) — Astro Portfolio: Technical Build Plan

**Owner:** Sultan Mahmud (Saad) — Hardware Engineer, Southern IoT Limited
**Repo:** https://github.com/smsaad-181/portfolio.git
**Stack:** Astro (static) + Tina CMS (Git-backed CMS) + GitHub Actions → GitHub Pages
**Author of plan:** Prepared for handoff to Kiro (AI dev agent) as an implementation spec.

---

## 0. Critical Architecture Decision (read this first)

Tina CMS has two editing modes, and this choice affects everything downstream:

| Mode | How it works | Needs a server? | Works on GitHub Pages? |
|---|---|---|---|
| **Live visual editing** (click-to-edit on the rendered page) | Astro runs in `output: 'server'` mode; an on-demand `/tina-island` route re-fetches content live | **Yes** (SSR adapter — Vercel/Netlify/Node) | ❌ No — GitHub Pages is static-only, it cannot run server routes |
| **Form-based admin editing** (`/admin`, structured forms, no live click-to-edit) | A statically-built admin app talks to the Tina content API and commits directly to your GitHub repo | No — the admin app itself is static; only the *content API* (Tina Cloud) needs a backend | ✅ Yes |

**Decision: use form-based admin editing backed by Tina Cloud's free tier** (not self-hosted Tina Data Layer).

Why:
- GitHub Pages cannot run the SSR functions self-hosting Tina's data layer requires (Vercel/Netlify Functions + a database + auth provider). Self-hosting would force you off GitHub Pages onto Vercel/Netlify/Cloudflare for hosting.
- Tina Cloud's free tier supports up to 2 users, GitHub-based auth, and commits go **directly to your GitHub repo as real files** (Markdown/JSON/MDX) — so there's no vendor lock-in on content, only on the editing backend/auth layer. You can always self-host later if you outgrow it.
- You lose real-time click-to-edit-on-the-live-page, but you keep a clean `/admin` dashboard with live preview, image uploads, rich text, and full schema-driven forms — which is what you actually need for a portfolio you'll update occasionally.

**Fallback noted for Kiro:** if Tina Cloud's terms or free tier ever become unworkable, the same content-collection architecture below works unchanged with **Keystatic** (zero backend, git-based, no external service at all) as a drop-in CMS replacement. Don't build this fallback now — just don't couple the Astro content layer tightly to Tina-specific APIs, so swapping stays cheap.

---

## 1. Goals

1. Fast, accessible, static portfolio site reflecting Saad's hardware/embedded/IoT engineering work.
2. Fully editable after launch via Tina CMS admin UI — **no code changes needed** to add projects, update skills, or edit bio text.
3. Push to `main` → GitHub Actions builds → auto-deploys to GitHub Pages. Zero manual deploy steps ever again.
4. Designed to grow: new project categories, new skill tags, blog/notes section later, resume PDF versioning — without schema rewrites.
5. Good Lighthouse scores (perf/SEO/accessibility) since this is a hiring-facing asset.

## 2. Non-goals (explicitly out of scope for v1)

- Live visual click-to-edit (see §0).
- Multi-language / i18n.
- User comments, contact form backend (use a static-friendly third-party form endpoint, e.g. Formspree/Getform, or a `mailto:` link).
- CMS multi-user roles beyond Saad (Tina Cloud free tier = 2 users, plenty of headroom).

---

## 3. Content Inventory (extracted from CV + known project history)

Use this to seed initial content. Items marked **[NEEDS INPUT]** have no detail available from uploads — Saad fills these in via Tina after launch.

### 3.1 Profile / About
- Name: Sultan Mahmud (goes by "Saad")
- Title: Hardware Engineer
- Location: Dhaka, Bangladesh (Uttara)
- Email: [CV email — not published]
- Summary: hardware engineer focused on PCB design, embedded systems, and IoT product development
- Links: LinkedIn, GitHub, OSHWLab (get exact URLs from Saad)

### 3.2 Experience
- **Assistant Officer, Southern IoT Limited** — Jan 14, 2025–Present
  - Circuit/schematic design, PCB design, sensor integration, embedded debugging, hardware documentation
  - LoRaWAN, gateways, Raspberry Pi Pico for IoT
  - Node-RED for IoT data visualization/control
  - Protocols: I²C, SPI, UART, Modbus, MQTT
  - Additional: Jacquard machine control/racking board observation
  - Hardware expertise: temperature/humidity/gas/laser/fingerprint/RFID sensors; motor drivers (A4988, L298N); power regulation circuits
  - Notable internal project: three-phase voltage indicator

### 3.3 Education
- B.Sc. Engineering, EEE — Gono Bishwabidyalay — 2022 — CGPA 3.59/4.00
- HSC, Science — Rangpur Police Line School and College — 2017 — GPA 5.00/5.00
- SSC, Science — Birganj Govt. Pilot High School — 2015 — GPA 5.00/5.00

### 3.4 Certifications / Training
- IPS training
- IOSH MS (Institution of Occupational Health & Safety)
- EOSH (Environmental Occupational Health & Safety)
- Fire Safety training

### 3.5 Skills (group into categories for the UI)
- **Programming:** C++, Python (basic)
- **PCB/EDA & 3D:** EasyEDA, Proteus, Fusion 360
- **IoT & Communication:** LoRaWAN, MQTT, Arduino, ESP32, Raspberry Pi Pico
- **Protocols:** I²C, SPI, UART, Modbus, MQTT
- **Automation/Integration:** Node-RED, Modbus, Serial Communication
- **Tools:** MS Word/PowerPoint/Excel
- Skill schema should support **arbitrary future additions** (see §4.2 — don't hardcode a fixed enum).

### 3.6 Projects (seed list — mix of known-detail and needs-input)

| Project | Detail available? | Notes to seed |
|---|---|---|
| Home Automation V2 (6-channel ESP32-WROOM-32) | ✅ Rich detail from history | Dark-sidebar web dashboard, NTP sync, NOAA solar calc (Dhaka coords), 20-rule automation engine w/ 4 trigger types stored in NVS, CH340C TX/RX bug fix |
| DIY ATmega328P Digital Clock | ✅ | DS1307 RTC, 4-digit 7-segment display, I2C debugging, ghosting fix, brightness balancing, drift compensation |
| DIY Arduino Component Tester | ✅ | SSD1306 OLED, fixed color-zone rendering |
| Simon Memory Game | ✅ | ESP32, LEDs, buttons, buzzer, OLED |
| TTL-to-RS485 Converter | ✅ | SN75HVD08D + 74HC04D, EasyEDA, reviewed/fixed AMS1117 cap sizing + reverse-protection diode voltage drop |
| ESP32-S3 Water Monitoring System | ✅ | HC-SR04, relay, RGB LED, HLK-PM01; fixed WiFi failure from 5V pull-ups / unprotected 5V ECHO line |
| Acqua Node V1.2 | **[NEEDS INPUT]** | Likely related/successor to water monitoring — confirm with Saad |
| ESP32 IoT Vehicle Motion Analyzer (MPU6050 + LIS3MDL) | **[NEEDS INPUT]** | Title implies IMU + magnetometer motion/orientation sensing |
| ESP32 MLX90640 IR Thermal Camera | **[NEEDS INPUT]** | Title implies thermal imaging module |
| ESP32 Standalone Board | **[NEEDS INPUT]** | |
| Fingerprint V1.1 / V1.2 | **[NEEDS INPUT]** | Two versions — likely a fingerprint access/security board revision |
| IoT Activity Tracker (Accelerometer/Gyroscope) | **[NEEDS INPUT]** | |
| DWIN DGUS + DHT11 (ESP32 MicroPython) | ✅ (unresolved) | Mark status: `in-progress`, note UART framing/ASCII formatting issue |
| 4→6-channel Relay Home Automation evolution | ✅ | GPIO2 strapping conflict resolution, optoisolator isolation, auto-reset circuit — could be folded into Home Automation project history/changelog instead of a separate entry |

**Action item for Kiro/Saad:** for each `[NEEDS INPUT]` project, when populated, capture: one-line summary, problem/motivation, key components (BOM highlights), your role, protocols used, challenges + how solved, images/schematics, links (OSHWLab, GitHub), status (`completed` / `in-progress` / `prototype`).

---

## 4. Information Architecture & Content Model

### 4.1 Site pages
- `/` — Home: hero, short bio, featured projects (3–4), skill highlights, CTA to resume/contact
- `/about` — Full bio, timeline (education + experience), certifications
- `/projects` — Filterable grid (filter by tag: ESP32, PCB Design, IoT, Sensors, etc.; filter by status)
- `/projects/[slug]` — Project detail page
- `/experience` — Optional, or fold into `/about`
- `/contact` — Contact links + static-friendly form (Formspree-style) or mailto
- `/resume` — Downloadable PDF (also linked from nav) — Tina-managed file upload so Saad can swap the CV anytime without redeploying code
- `404.astro` — required for GitHub Pages SPA-less static routing
- *(future, not v1)* `/notes` or `/blog` — technical write-ups; model content collection now so adding this later is just a new collection + page, no refactor

### 4.2 Content Collections (Astro `src/content/config.ts`, mirrored in `tina/config.ts`)

Design principle: **skills and tags are free-text/array fields, not fixed enums**, since Saad said he'll keep adding skills — a hardcoded dropdown would require code changes every time.

```
collections:
  profile          (singleton — name, title, location, summary, avatar, social links, resume file)
  experience[]      (company, role, startDate, endDate|null "Present", bullets[], tags[])
  education[]       (degree, institute, group, year, result)
  certifications[]  (name, issuer, year?)
  skills[]          (name, category: string [free text w/ autocomplete suggestions], proficiency?: enum 1-5 optional)
  projects[]        (
    title, slug, summary, description (rich text/MDX),
    coverImage, gallery[],
    tags[] (free text array — e.g. "ESP32", "PCB Design", "MQTT"),
    status: enum [completed, in-progress, prototype],
    role, dateCompleted,
    links: { github?, oshwlab?, liveDemo? },
    featured: boolean,
    bom/keyComponents[]? (optional structured list),
    order: number (for manual featured ordering)
  )
```

Key corner cases baked into the schema:
- `endDate` nullable + a `current: boolean` flag for the Southern IoT role so "Present" renders correctly and updates automatically without editing text every time.
- `tags` on both experience and projects use the **same free-text tag field type** so a future "browse by tag across everything" page is possible without a data migration.
- `featured` + `order` fields so the homepage's "featured projects" is CMS-controlled, not hardcoded in a component.
- `draft: boolean` field (default `false`) on `projects` — lets Saad save an in-progress project in Tina without it appearing live; build step filters `draft === true` out of production output.
- Rich text body uses Tina's MDX support so Saad can embed images inline within a project write-up, not just a flat description string.

---

## 5. Design Direction

- Dark-first UI (consistent with the dashboard aesthetic already used in the Home Automation V2 dashboard — dark sidebar, accent color).
- Typography: one technical/monospace accent font for code/specs, one clean sans for body — reinforces "hardware engineer" identity without being a generic template look.
- Project cards show: cover image, title, 2–3 tag chips, status badge (completed/in-progress/prototype).
- Use Astro's `<Image />` component for automatic optimization/responsive images — critical since project photos (PCB shots, schematics) will be the heaviest assets.
- Respect `frontend-design` best practices for spacing/hierarchy rather than default template look — avoid generic "AI portfolio" appearance.

---

## 6. Repo Structure

```
portfolio/
├── .github/workflows/deploy.yml
├── public/
│   ├── resume/ (Saad's CV PDF, Tina-managed)
│   └── favicon, etc.
├── src/
│   ├── content/
│   │   ├── config.ts          # Astro content collection schemas (zod)
│   │   ├── profile/
│   │   ├── experience/
│   │   ├── education/
│   │   ├── certifications/
│   │   ├── skills/
│   │   └── projects/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── projects/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── contact.astro
│   │   └── 404.astro
│   └── styles/
├── tina/
│   └── config.ts               # Tina schema — mirrors src/content/config.ts
├── astro.config.mjs
├── package.json
└── README.md
```

---

## 7. Astro Configuration Corner Cases

- **`site` and `base` config are critical.** Repo is `smsaad-181/portfolio`, **not** `smsaad-181.github.io` — so it deploys to `https://smsaad-181.github.io/portfolio/`, not the domain root.
  - `astro.config.mjs` must set:
    ```js
    export default defineConfig({
      site: 'https://smsaad-181.github.io',
      base: '/portfolio',
      output: 'static',
    })
    ```
  - Every internal link/asset reference must respect `base` — use Astro's built-in `base`-aware routing (`astro:content` links, `<a href={import.meta.env.BASE_URL + '...'}>` or relative links) rather than hardcoded absolute paths, or links will 404 on Pages.
  - If Saad later buys a custom domain, this changes: `base` goes away, a `public/CNAME` file gets added, and `site` becomes the custom domain — flag this as a documented one-time migration step, not something to build now.
- **Trailing slashes:** set `trailingSlash: 'always'` or `'never'` explicitly and be consistent — GitHub Pages' static file server behaves differently than a Node dev server here and mismatches cause 404s on nested routes in production only (a classic "works locally, breaks in prod" bug).
- **404 page required** — GitHub Pages needs an actual `404.html` at the deployed root for its fallback behavior; Astro's static build outputs `404.astro` → `404.html` automatically, just confirm it lands at `dist/404.html` (not nested under `/portfolio/`).

---

## 8. Tina CMS Setup

1. `npx tinacms init` in the existing Astro project (or scaffold from `tina-astro-starter` if starting fresh — recommend scaffolding fresh given a clean content-collection architecture matters more than starter boilerplate).
2. Framework prompt → choose "Other" (Tina's Astro integration is not the Next.js-style deep integration; it runs the static-admin pattern).
3. Content location → point Tina's schema at `src/content/*` so **Astro content collections and Tina's admin edit the exact same files** — this is the piece that keeps content-collection type safety (`astro:content` + zod) and the CMS in sync. Do not let Tina write to a separate content directory.
4. Register a free Tina Cloud project (github.com login), get `TINA_CLIENT_ID` and a read-only token.
5. Build step: `tinacms build` generates a static `/admin` bundle as part of the Astro build — this ships alongside the site to GitHub Pages, so `https://smsaad-181.github.io/portfolio/admin/index.html` is the editing dashboard. Auth happens via Tina Cloud (GitHub OAuth), not a self-hosted auth layer.
6. **Media/image uploads:** Tina Cloud's default media manager can commit uploaded images straight into `public/` in the repo. Corner case to flag: this makes the git repo grow over time and every image commit triggers a full CI rebuild — acceptable for a portfolio's scale, but Kiro should configure the Actions workflow (§9) to be fast/cheap regardless.
7. **Draft/preview workflow:** Tina Cloud's free tier doesn't include branch-based preview deploys. Practical workaround baked into the schema: the `draft: boolean` field (§4.2) + a build-time filter is the "poor man's preview" — draft content never reaches the public build, full stop, until Saad flips it to `false` and pushes.

---

## 9. GitHub Actions — CI/CD to GitHub Pages

Use the **official `actions/deploy-pages`** flow (not `peaceiris/actions-gh-pages`, which is the older third-party approach) — it's GitHub's supported first-party mechanism and avoids managing a separate `gh-pages` branch.

`.github/workflows/deploy.yml` — key requirements to encode:

- Trigger: `on: push: branches: [main]` (this covers both Saad's manual pushes *and* Tina Cloud's commits, since Tina commits land on `main` the same way).
- Permissions block: `contents: read`, `pages: write`, `id-token: write` (required for `deploy-pages`).
- Concurrency group set to `"pages"` with `cancel-in-progress: true` — so if Saad or Tina pushes twice quickly (e.g., saving a Tina edit, then immediately saving another), the older in-flight build doesn't race the newer one to deploy.
- Steps: checkout → setup Node (pin an LTS version, e.g. 20 or 22) → install deps (cache `node_modules`/pnpm store for speed) → `npm run build` (which must also run `tinacms build` first as a `prebuild` script so the `/admin` bundle is included) → upload artifact via `actions/upload-pages-artifact` pointed at `dist/` → deploy via `actions/deploy-pages`.
- Required repo secrets: `TINA_CLIENT_ID`, `TINA_TOKEN` (or `TINA_SEARCH_TOKEN` if search is enabled) — set in GitHub repo Settings → Secrets, referenced as env vars in the build step.
- Repo settings: Settings → Pages → Source = "GitHub Actions" (not "Deploy from a branch") — this must be set once manually; Kiro should note this as a manual one-time step it cannot automate via code.
- Fail the build (don't deploy) if `astro build` errors — Astro's content collection zod schemas will already throw a build error if Tina-saved content is missing a required field, which is a nice built-in safety net against a bad CMS edit breaking the live site silently.

---

## 10. Corner Cases & Pitfalls Checklist (for Kiro to explicitly handle)

- [ ] `base: '/portfolio'` path correctness across all links, images, sitemap, RSS, and the Tina `/admin` route itself.
- [ ] Trailing slash consistency (`trailingSlash` config matches how links are written).
- [ ] `404.html` present at the correct deployed path.
- [ ] Tina Cloud commits and manual `git push` commits both trigger the same, idempotent CI pipeline — no special-casing needed, but concurrency control (above) prevents race conditions.
- [ ] `draft: true` content never appears in production build output — verify with a build-time test/assertion, not just visually.
- [ ] Zod schemas in `src/content/config.ts` mark truly-required fields as required (e.g., `title`, `slug`) so a malformed Tina save fails the build loudly instead of shipping a broken page.
- [ ] Free-text `tags` and `skills.category` fields don't silently create duplicate near-identical tags (e.g., "esp32" vs "ESP32") — normalize casing at render time (e.g., lowercase + display-format) rather than trusting free text input verbatim.
- [ ] Image weight: enforce `<Image />` (not raw `<img>`) everywhere project photos/schematics appear, so uploads from Tina still get optimized at build time regardless of the source file size.
- [ ] Sitemap (`@astrojs/sitemap`) and `robots.txt` generated automatically, respecting `base`.
- [ ] Resume PDF is a **binary file field** in Tina (not embedded as text) — stored under `public/resume/`, linked from `/resume` and nav; old versions naturally kept in git history for rollback.
- [ ] Accessibility: alt text is a **required** field on every image reference in the schema (cover image, gallery images) — don't let Tina save without it.
- [ ] Contact method: since there's no server, use a static-form service (Formspree/Getform/Web3Forms) or a plain `mailto:` — document the choice and its free-tier limits.
- [ ] Node version pinned identically in `package.json` engines field and the Actions workflow, to avoid "works on my machine" build drift.
- [ ] `.env` / secrets never committed — `.env.example` checked in instead, real values only in GitHub Actions secrets and Saad's local `.env`.
- [ ] Lockfile (`package-lock.json` or `pnpm-lock.yaml`) committed and CI uses `npm ci` / `pnpm install --frozen-lockfile`, not a loose install, so deploys are reproducible.
- [ ] Broken external links (OSHWLab/GitHub/LinkedIn) — add these as plain URL fields validated as URLs at the schema level, not free text, to prevent typos shipping silently.

---

## 11. Implementation Phases (sequence for Kiro)

1. **Scaffold** — `npm create astro@latest`, set up TypeScript strict mode, install `@astrojs/sitemap`.
2. **Content model** — build `src/content/config.ts` per §4.2, seed with the inventory in §3 as real Markdown/MDX files (including placeholder stubs with `draft: true` for the `[NEEDS INPUT]` projects).
3. **Layouts & pages** — build the page set in §4.1 against the seeded content, mobile-first, dark theme per §5.
4. **Tina integration** — per §8; verify `/admin` works locally in Tina's local dev mode before touching Tina Cloud.
5. **Tina Cloud connection** — register project, wire env vars, verify a real edit-and-commit round-trip locally against the real GitHub repo on a test branch first.
6. **GitHub Actions workflow** — per §9; do a first manual push to confirm the Pages deploy pipeline end-to-end before connecting Tina Cloud commits.
7. **SEO/perf pass** — sitemap, meta tags/OpenGraph per page, Lighthouse audit, image optimization audit.
8. **Corner-case checklist** — walk §10 explicitly, item by item.
9. **Content population** — Saad fills in all `[NEEDS INPUT]` projects via the live `/admin` (this is the real-world test that the CMS workflow actually works end-to-end).
10. **Launch** — confirm GitHub repo Settings → Pages → Source = GitHub Actions; do a final full-pipeline dry run (push → Action → live URL).

---

## 12. Ongoing Update Workflow (what Saad's day-2 experience looks like)

- **Add a new project:** log into `/admin` → "Projects" → new entry → fill fields, upload images, save. Tina commits to `main` → Actions builds → live in a few minutes. No local dev environment needed for this.
- **Add a new skill:** `/admin` → "Skills" → new entry, free-text category — no code/schema change required, ever, as long as it fits the existing field types.
- **Update CV:** `/admin` → "Profile" → replace resume file field → save.
- **Occasional code changes** (new page type, new component): still done locally via normal git workflow, same Actions pipeline picks it up on push to `main`.
