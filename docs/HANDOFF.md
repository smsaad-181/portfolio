# Handoff — start here

Short state of the project for the next work session. **Read this first**
instead of re-exploring the codebase. Updated at the end of every finished
task (newest entry on top of the log). Public repo: no secrets, emails or
private links in this file.

**Last updated:** 2026-11-25 · **Last commit:** see `git log -1`

---

## 1. Where things stand

| | |
|---|---|
| Live site | https://smsaad-181.github.io/portfolio/ (deploys on every push to `main`, ~3–5 min) |
| Local | `npm run build:site` → `npm run preview` → http://localhost:4321/portfolio/ |
| Plan | `docs/PLAN-v2.md` — Phases 0–6 done; **Phase 7 (launch QA) open** |
| CI | `.github/workflows/deploy.yml` — all gates green; Tina admin build is **skipped** until Tina secrets exist |
| Checks | `npm run check` 0/0/0 · `check:links` 0 broken · `check:drafts` clean · `audit:pages` 0 issues (92 loads) |

**Recently finished (Nov 21–25):**
- Resume page rebuilt from Saad's new CV (25 Nov): CV order, Responsibilities/Achievements, work + ongoing projects, CV skill rows, training, activities. CV-only parts live in the `resume` singleton (`src/content/resume/cv.json`, "Resume (CV)" in /admin). PDF regenerated: 2 pages with ~5 mm to spare.
- 8-point feedback round: Home redesign (focus chips, stats, "What I do", experience timeline), Skills page, Blog section (3 drafts), aligned project cards with version stacks.
- Fingerprint V1.1 3D board rebuilt correctly.
- Site-wide circuit-trace canvas background (`CircuitField.astro`) — owner wants it small and dim.
- Animations: scroll reveal, count-up, card tilt + spotlight, timeline line-draw.
- Branded page-to-page transition (`PageTransition.astro`), ~1 s.
- UI/motion polish from Vercel web-design-guidelines + Emil Kowalski audits; "Pause animations" toggle in the footer; contact form per-field errors + unsaved guard; `?status=` filter in the URL.

## 2. Open tasks

**Waiting on Saad (manual):**
1. **Purge old commits** that still contain a private email (GitHub keeps old SHAs after a history rewrite). Saad deletes the repo in Settings and says "deleted" → recreate `smsaad-181/portfolio`, push `main`, make public, `gh api -X POST repos/smsaad-181/portfolio/pages -f build_type=workflow`, confirm deploy and that old SHAs 404.
2. **Tina Cloud:** Saad creates the project at app.tina.io and puts `TINA_PUBLIC_CLIENT_ID` / `TINA_TOKEN` in `.env` → set GitHub secrets `TINA_CLIENT_ID` / `TINA_TOKEN` from `.env` with `gh secret set` (never echo values) → redeploy; `/portfolio/admin/` turns on.
3. **Web3Forms key** → secret `WEB3FORMS_KEY` (contact form only renders with it).
4. Review/publish the 3 blog drafts (`src/content/blog/*.mdx`), answer `docs/FACT-CHECK.md` (incl. the new About bio line from 25 Nov), headshot, build/test photos.
5. Check share previews (LinkedIn Post Inspector).

**Open for Claude (not started / optional):**
- Phase 7: run `qa-reviewer` against the live site (see PLAN-v2 Phase 7).
- Low-priority review leftovers: BoardViewer keyboard pan + `?board=` in URL; theme-color meta follows the toggle; preload the Mr Dafoe font; box-shadow hovers → opacity of a pseudo-element.
- Home Lighthouse back above 95 (last single run 92 at 2× CPU).
- Resume QA nits (25 Nov): training courses show in file-name order, not the CV's (IPS, IOSH, EOSH, Fire); certifications have no `order` field. Old required-ness mismatches between the two schemas: profile `avatar`, experience `bullets`/`tags` (required in Astro, optional in Tina).

## 3. Know before you start (saves time)

- **Rules:** `CLAUDE.md` (constraints, agents, workflow). Never edit `.kiro/`. Colours only in `src/styles/tokens.css`. Change `content.config.ts` and `tina/config.ts` together. Never invent facts.
- **Key files:** layout `src/layouts/BaseLayout.astro` (head script: theme, `reveal-on`, `tilt-on`, `motion-paused`, `pt-enter`/`pt-arrived`) · transition `src/components/PageTransition.astro` · background `src/components/CircuitField.astro` · motion tokens `--ease-out`/`--ease-drawer` in `tokens.css` · 3D pipeline `scripts/pcb3d/` (tools in git-ignored `scripts/pcb3d/pcbtools/`, one board at a time, `node --max-old-space-size=3000`).
- **Local-only skills** (not in git, listed in `.git/info/exclude`): `.claude/skills/web-design-guidelines/`, `.claude/skills/emil-*/`. Reinstall from `github.com/vercel-labs/agent-skills` and `github.com/emilkowalski/skills` on a new machine.
- **Tool quirks:** the Edit/Write tools decode `<` / ` ` → write such strings from a script with `String.fromCharCode(...)` and verify with `od -c`. Bash heredocs/one-liners break on apostrophes → write scripts to the scratchpad. Use `set -o pipefail` before outward-facing commands. Stage files **by name** (a locked `src/pages/404.astro.tmp.*` file exists; it's excluded and harmless — delete after a reboot).
- **Ports stuck after stopping a background server:** `netstat -ano | grep 4321` → `taskkill //PID <pid> //T //F`.
- **CV facts:** the newest CV (25 Nov) is summarised in `.claude/skills/portfolio-content-seed/references/cv-data.md`. Full name "Sultan Mahmud Saad" on the resume only. Never publish the CV's phone number or referees' details. Experience dates may be year-only (`"2021"`) — format them with `formatMonthYear()` in `src/lib/dates.ts`, never `new Date().toLocaleDateString` directly.
- **Tina lock:** after any change to `tina/config.ts`, regenerate and commit `tina/tina-lock.json` (Tina Cloud indexes it; CI's Tina build fails on a stale one). `tinacms dev` hangs at "initializing" here; instead run `node node_modules/@tinacms/cli/bin/tinacms build --local --skip-indexing --skip-cloud-checks --skip-search-index --noTelemetry` in the background, wait until the lock file's time changes, then stop it (its server never exits). Its local `public/admin/` is git-ignored.
- **Blank CMS fields:** Tina saves a cleared optional field as `""`. Wrap optional non-string fields (dates, numbers, URLs) in `blankable()` in `src/content.config.ts`.
- **CV PDF:** `npm run cv:pdf` needs a server on :4321 (dev, or `preview` after a build on the same day). It fails above 2 pages; measure with a print-media Playwright check before cutting content (the header contact grid is what made it fit).
- **Audit the contact form** by building once with a dummy `PUBLIC_WEB3FORMS_KEY=00000000-0000-0000-0000-000000000000`, then rebuild normally.

## 4. Session log (newest first)

- **2026-11-25** — Resume page and PDF rebuilt from Saad's new CV; new `resume` singleton (Astro + Tina, lock regenerated), experience `achievements`, year-only dates, education `startYear`; About bio updated to SouthernIoT / B.Sc. 2023. QA fixes: absolute links in the PDF (+ `cv:pdf` now fails on localhost links), blank CMS fields no longer break the build, impossible dates rejected.

- **2026-11-24** — README trimmed to intro + live/CMS links only (setup and commands live in `CLAUDE.md`).
- **2026-11-24** — Installed Vercel + Emil skills locally; fixed all high/medium findings (commit `f49a09b`); QA caught and fixed a stuck-cover bug (transition + "Leave page?"). my-skills repo updated with these lessons. Added this handoff file.
- **2026-11-23** — Branded page transition (`e0a09d9`), card tilt / timeline draw (`e5a0f1a`), CI skips Tina build without secrets (`c42d2f0`) → site live.
- **2026-11-22** — Circuit background (`05227eb`), audit fix (`c5dfa7a`).
- **2026-11-21** — Feedback round (`714c78a`), Fingerprint V1.1 3D (`0c1ff17`).
