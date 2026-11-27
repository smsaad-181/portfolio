# Design system — "Midnight Lab" (27 Nov 2026)

Saad's identity, made premium: same deep violet-black, pink → violet → blue
gradient, Rubik + JetBrains Mono + Mr Dafoe logo — used with restraint, like
the best engineer portfolios (Brittany Chiang, Maxime Heckel, Greg Davill,
Josh Comeau, Olivier Larose; research 27 Nov). Every value comes from
`src/styles/tokens.css`; no hex/rgb anywhere else.

## 1. Principles
1. **The work is the hero.** Board renders, the 3D viewer and real facts carry
   the page; decoration stays quiet.
2. **One accent.** Flat `--accent` (pink) for links, focus, active states and
   small labels. The **gradient appears in only a few places**: the hero name,
   the hero photo ring, the primary button, the active-nav underline and thin
   top rules on feature cards. Never on body text, borders of every card, or
   backgrounds of sections.
3. **Two type roles.** Rubik for content; JetBrains Mono, uppercase, tracked,
   12 px, only for metadata (section labels, dates, specs, counts).
4. **Big jumps, few weights.** 400 body, 500 UI, 600–700 headings. Sizes:
   hero name 60 px → H1 44 px → H2 32 px → H3 20 px → body 16–18 px → label 12 px.
5. **Calm motion.** Motion lives in the hero (line-art drift, photo orbit).
   Elsewhere: reveal on scroll (fade + 12 px), 150–200 ms hover colour/border/
   2 px lift. No 3D tilt. Everything off under `prefers-reduced-motion`.
6. **Consistent rhythm.** One container (1200 px), sections 96 px apart
   (64 px on phones), text columns ≤ 38rem, card grids with 24 px gaps.

## 2. Tokens (tokens.css)
- Type: `--fs-12 14 16 18 20 22 24 28 32 44 60`, `--lh-body 1.65`, `--lh-heading 1.15`,
  `--tracking-label 0.1em`, `--tracking-tight -0.02em`.
- Surfaces: `--bg-base` < `--bg-surface` (cards) < `--bg-elevated` (chips,
  insets). Borders: `--border` (cards), `--border-subtle` (dividers/hairlines).
- Shadows: `--shadow-sm` (cards at rest: none in dark), `--shadow-md`
  (floating: menus, hero cards), `--button-shadow` (primary hover only).
- Radius: `--radius-sm 6`, `--radius-md 10`, `--radius-lg 16` (cards), pill.

## 3. Components (global.css unless noted)
- **Page header** (`.page-head`): `.section-label` + H1 `.page-title`
  (44 px/700, tight tracking) + lead `.page-lead` (18 px, `--text-secondary`,
  ≤ 38rem). Same top padding on every inner page (64 px).
- **Section heading** (`SectionHeading.astro`): label + H2 32 px/700 + optional
  description 16 px secondary ≤ 38rem; 32 px below.
- **Card** (`.card`): `--bg-surface`, 1 px `--border`, `--radius-lg`, padding
  24 px; hover (mouse only): border `--accent` at 45 %, translateY(-2px).
- **Feature card** (`.card--feature`): card + 2 px gradient top rule.
- **Chip/tag** (`TagChip`): mono 12 px, `--bg-elevated`, radius-sm, no border colour games.
- **Buttons**: `.btn--primary` (gradient, the only gradient fill),
  `.btn--secondary` (outline), `.btn--ghost` (text + arrow). 48 px tall.
- **Text link with arrow** (`.link-arrow`): 14 px/600, `--accent`, arrow moves 3 px on hover.
- **Metadata row** (`.meta-row`): mono 14 px items separated by `·`, content keeps its own casing (EasyEDA, IoT); a wrapped line never starts with a dot.
- **Data table** (`.data-table`): hairline rows (`--border-subtle`), mono 12 px
  header, 16 px cells, row hover `--bg-elevated`.
- **Prose** (project write-ups): 17 px/1.7, ≤ 38rem, H2 = Rubik 24 px/700
  `--text-primary` (no pink mono), H3 18 px/600.

## 4. Page patterns
- **Home**: hero (done 27 Nov) → about (2-col: text + facts cards) → what I do
  (3 cards) → selected work (featured cards) → experience timeline → CV CTA.
- **Projects**: page header → featured (first 4 by `order`) as large cards →
  "All projects" **index table** (Project · Board/MCU · Tags · Versions · →),
  phone: stacked rows.
- **Project page (case study)**: breadcrumb → H1 + one-line summary +
  meta-row (role · versions · EDA) + tags → hero render/spec card → sections
  with consistent H2s → 3D viewer → dashboards → prev/next.
- **About**: page header with photo circle (graduation photo) → bio →
  experience timeline → education / certifications → toolbox link.
- **Skills / Contact / 404 / Resume frame**: page header pattern + cards.

## 5. Don'ts
No new colours outside tokens · no gradient text except the hero name · no invented facts or numbers · no placeholder text ·
the `/resume/` sheet (`.cv`) stays an exact copy of Saad's PDF · keep every
`aria-*`, heading order (one h1), base-aware URLs (`pageUrl`, `projectUrl`).
