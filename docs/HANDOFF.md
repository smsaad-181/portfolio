# Handoff — start here

Short state of the project for the next work session. **Read this first**
instead of re-exploring the codebase. Updated at the end of every finished
task (newest entry on top of the log). Public repo: no secrets, emails or
private links in this file.

**Last updated:** 2026-11-26 · **Last commit:** see `git log -1`

---

## 1. Where things stand

| | |
|---|---|
| Live site | https://smsaad-181.github.io/portfolio/ (deploys on every push to `main`, ~3–5 min) |
| Local | `npm run build:site` → `npm run preview` → http://localhost:4321/portfolio/ |
| Plan | `docs/PLAN-v2.md` — Phases 0–6 done; **Phase 7 (launch QA) open** |
| CI | `.github/workflows/deploy.yml` — all gates green (no CMS since 26 Nov) |
| Checks | `npm run check` 0/0/0 · `check:links` 0 broken · `check:drafts` clean · `audit:pages` 0 issues (92 loads) |

**Recently finished (Nov 21–26):**
- Resume page = Saad's own CV PDF (26 Nov): the page copies his LaTeX CV (`D:\CV\CV\main.tex`) word for word and in the same layout (real Bitstream Charter font, photo, references; all 970 words wrap as in the PDF); "Download PDF" is his exact PDF. All text lives in the `resume` singleton (`src/content/resume/cv.json`). Verified by text, visual and QA agents.
- 8-point feedback round: Home redesign (focus chips, stats, "What I do", experience timeline), Skills page, Blog section (3 drafts), aligned project cards with version stacks.
- Fingerprint V1.1 3D board rebuilt correctly.
- Site-wide circuit-trace canvas background (`CircuitField.astro`) — owner wants it small and dim.
- Animations: scroll reveal, count-up, card tilt + spotlight, timeline line-draw.
- Branded page-to-page transition (`PageTransition.astro`), ~1 s.
- UI/motion polish from Vercel web-design-guidelines + Emil Kowalski audits; "Pause animations" toggle in the footer; contact form per-field errors + unsaved guard; `?status=` filter in the URL.

## 2. Open tasks

**Waiting on Saad (manual):**
1. **Purge old commits** that still contain a private email (GitHub keeps old SHAs after a history rewrite). Saad deletes the repo in Settings and says "deleted" → recreate `smsaad-181/portfolio`, push `main`, make public, `gh api -X POST repos/smsaad-181/portfolio/pages -f build_type=workflow`, confirm deploy and that old SHAs 404.
2. ~~Tina Cloud~~ — **dropped 26 Nov:** Saad chose to remove TinaCMS (no account needed). Content changes go through Claude (or GitHub's web editor). Restore from git history if ever wanted (`git checkout 55900ea -- tina`).
3. **Web3Forms key** → secret `WEB3FORMS_KEY` (contact form only renders with it).
4. Review/publish the 3 blog drafts (`src/content/blog/*.mdx`), answer `docs/FACT-CHECK.md` (incl. the new About bio line from 25 Nov), headshot, build/test photos.
5. Check share previews (LinkedIn Post Inspector).

**Open for Claude (not started / optional):**
- Phase 7: run `qa-reviewer` against the live site (see PLAN-v2 Phase 7).
- Low-priority review leftovers: BoardViewer keyboard pan + `?board=` in URL; theme-color meta follows the toggle; preload the Mr Dafoe font; box-shadow hovers → opacity of a pseudo-element.
- Home Lighthouse back above 95 (last single run 92 at 2× CPU).
- Resume look: done (26 Nov) — real Bitstream Charter (Butterick's free WOFF2 package) replaced Charis SIL; "+" now matches. Measured against the PDF: 0 of 970 words wrap differently, spacing within 0.5 px, name width within 1 px, print = same 3 pages. Measuring scripts (pdf.js render, line dump, `breaks`/`gaps` compare) were in the session scratchpad; recreate if the CV changes a lot.
- Saad (optional): his PDF embeds the photo's camera metadata (Canon EOS 50D, Photoshop, 2023 date — no location). To drop it: strip `photo.jpg` (e.g. `exiftool -all= photo.jpg`), recompile in Overleaf, `npm run cv:import`.
- Resume QA nits (25 Nov): training courses show in file-name order, not the CV's (IPS, IOSH, EOSH, Fire); certifications have no `order` field.

## 3. Know before you start (saves time)

- **Rules:** `CLAUDE.md` (constraints, agents, workflow). Never edit `.kiro/`. Colours only in `src/styles/tokens.css`. Content = files in `src/content/` (no CMS). Never invent facts.
- **Key files:** layout `src/layouts/BaseLayout.astro` (head script: theme, `reveal-on`, `tilt-on`, `motion-paused`, `pt-enter`/`pt-arrived`) · transition `src/components/PageTransition.astro` · background `src/components/CircuitField.astro` · motion tokens `--ease-out`/`--ease-drawer` in `tokens.css` · 3D pipeline `scripts/pcb3d/` (tools in git-ignored `scripts/pcb3d/pcbtools/`, one board at a time, `node --max-old-space-size=3000`).
- **Local-only skills** (not in git, listed in `.git/info/exclude`): `.claude/skills/web-design-guidelines/`, `.claude/skills/emil-*/`. Reinstall from `github.com/vercel-labs/agent-skills` and `github.com/emilkowalski/skills` on a new machine.
- **Tool quirks:** the Edit/Write tools decode `<` / ` ` → write such strings from a script with `String.fromCharCode(...)` and verify with `od -c`. Bash heredocs/one-liners break on apostrophes → write scripts to the scratchpad. Use `set -o pipefail` before outward-facing commands. Stage files **by name** (a locked `src/pages/404.astro.tmp.*` file exists; it's excluded and harmless — delete after a reboot).
- **Ports stuck after stopping a background server:** `netstat -ano | grep 4321` → `taskkill //PID <pid> //T //F`.
- **CV facts:** the newest CV (25 Nov) is summarised in `.claude/skills/portfolio-content-seed/references/cv-data.md`. Full name "Sultan Mahmud Saad" on the resume only. Saad chose to publish his phone and referees exactly as in his PDF — keep them only in `cv.json`. Experience dates may be year-only (`"2021"`) — format them with `formatMonthYear()` in `src/lib/dates.ts`, never `new Date().toLocaleDateString` directly.
- **CV update flow:** Saad edits `D:\CV\CV\main.tex` (Overleaf/LaTeX) → `npm run cv:import -- "D:\CV\CV\Sultan_Mahmud_Saad_CV.pdf"` (byte-for-byte copy + date) → make `src/content/resume/cv.json` match `main.tex` word for word (`--` → "–", `\textbf{x}` → `**x**`) → build → verify text and look against the PDF. No LaTeX is installed here, so the PDF can't be rebuilt locally. CV text renders through `CvText.astro` (bold + no breaks at hyphens, like LaTeX).
- **Audit the contact form** by building once with a dummy `PUBLIC_WEB3FORMS_KEY=00000000-0000-0000-0000-000000000000`, then rebuild normally.

## 4. Session log (newest first)

- **2026-11-26** — TinaCMS removed at Saad's request (he didn't want a Tina Cloud account): `tina/`, Tina packages, CI step, `/admin` bits, footer credit and the `tina-integrator` agent are gone; `npm audit` now 0 vulnerabilities. (`1ed1e37`, deployed)

- **2026-11-26** — Resume sheet now uses real Bitstream Charter (self-hosted, licence included); `@fontsource/charis-sil` removed; name small caps and word spacing tuned so every line wraps as in the PDF. (`62c5ac5`, deployed)

- **2026-11-26** — Resume page now copies Saad's own CV PDF exactly (text, layout, photo, phone, references — his choice); download = his exact PDF via `cv:import` (`cv:pdf` removed). Experience `achievements` / education `startYear` dropped again (CV text lives in `cv.json`). Verified by text, visual and QA agents. (`8858f2d`, deployed; live PDF byte-identical)
- **2026-11-25** — Resume page and PDF rebuilt from Saad's new CV; new `resume` singleton (Astro + Tina, lock regenerated), experience `achievements`, year-only dates, education `startYear`; About bio updated to SouthernIoT / B.Sc. 2023. QA fixes: absolute links in the PDF (+ `cv:pdf` now fails on localhost links), blank CMS fields no longer break the build, impossible dates rejected. (`1e02c3d`, deployed)

- **2026-11-24** — README trimmed to intro + live/CMS links only (setup and commands live in `CLAUDE.md`).
- **2026-11-24** — Installed Vercel + Emil skills locally; fixed all high/medium findings (commit `f49a09b`); QA caught and fixed a stuck-cover bug (transition + "Leave page?"). my-skills repo updated with these lessons. Added this handoff file.
- **2026-11-23** — Branded page transition (`e0a09d9`), card tilt / timeline draw (`e5a0f1a`), CI skips Tina build without secrets (`c42d2f0`) → site live.
- **2026-11-22** — Circuit background (`05227eb`), audit fix (`c5dfa7a`).
- **2026-11-21** — Feedback round (`714c78a`), Fingerprint V1.1 3D (`0c1ff17`).
