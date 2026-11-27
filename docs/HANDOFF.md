# Handoff — start here

Read this first instead of re-exploring the code. Update it (and push) after
every finished task. Public repo: no secrets, private emails or private links.

**Last updated:** 2026-11-28 · **Last commit:** `git log -1`

## 1. State

| | |
|---|---|
| Live | https://smsaad-181.github.io/portfolio/ — deploys on every push to `main` (~3 min) |
| Local | `npm run build:site` → `npm run preview` → http://localhost:4321/portfolio/ (or `npm run dev`) |
| Gates (all must pass) | `npm run check` 0/0/0 · `build:site` · `check:links` 0 broken · `check:drafts` · `audit:pages` 0 (needs preview running) |
| Design | `docs/DESIGN-SYSTEM.md` — "Midnight Lab": Saad's violet identity made premium (one accent, gradient in few places, Rubik + mono labels, shared classes in `global.css`) |
| Rules | `CLAUDE.md`. Colours only in `src/styles/tokens.css`. Content = files in `src/content/` (no CMS). Never invent facts. Never edit `.kiro/`. |

## 2. Saad's decisions (don't undo without asking)

- Name "Sultan Mahmud Saad"; title "Embedded Engineer & PCB Designer"; company "SIoT — Southern Innovation of Technology".
- Hero: name on one line, graduation photo (`src/assets/profile/hero-photo.jpg`) in a gradient ring + role/availability cards; buttons "About me" + "Download CV". About uses the same photo.
- No "Prototype"/status labels anywhere; no "See it in" links in "What I do".
- **Projects page + project cards = the pre-redesign version** (grid of all 16 cards; he preferred it to the featured+table design, 28 Nov). Project detail pages keep the redesign.
- Resume page = exact copy of his LaTeX PDF; phone + referees published (only in `src/content/resume/cv.json`).
- Pink/violet look, circuit background small and dim, page transition ~1 s (he asked for it).

## 3. Open

**Questions waiting for Saad** (asked 28 Nov):
1. Primary hero button "View projects" instead of "About me"? (UX review: nothing on the first screen leads to his work.)
2. Faster page transition (start loading during the cover)?
3. Shorter 1–2 sentence hero text (full summary stays on About)?
4. Compact Home timeline (Home repeats the About timeline)?
5. Dashboard screenshots with empty data ("Connecting…", "–") — real screenshots or hide?
6. OK that the "Current role" box was removed from Home's About section?
7. A second (workbench/professional) photo for one of Home/About?
8. Previous version of the project detail pages too?

**Waiting on Saad (manual):** purge old commits (he deletes the repo, says "deleted" → recreate, push, make public, `gh api -X POST repos/smsaad-181/portfolio/pages -f build_type=workflow`) · Web3Forms key → secret `WEB3FORMS_KEY` · publish/review 3 blog drafts · `docs/FACT-CHECK.md` answers · LinkedIn preview check.

**Optional for Claude:** Phase 7 qa-reviewer on the live site (`docs/PLAN-v2.md`); Home Lighthouse ≥ 95; BoardViewer keyboard pan.

## 4. Know before you start

- **Map:** pages `src/pages/` (index = Home, `projects/[slug].astro` = case study) · shared UI `src/components/` (Nav, Footer, ProjectCard, SectionHeading, SkillLogo, BoardViewer, CircuitField, PageTransition) · layout + head scripts `src/layouts/BaseLayout.astro` · tokens `src/styles/tokens.css` · shared classes `src/styles/global.css` · schema `src/content.config.ts` · URL helpers `src/lib/urls.ts` · tag casing `src/lib/tags.ts`.
- **CV update:** latest CV = private repo `smsaad-181/Saad-CV` (also `D:\CV\CV`). Clone to scratch → diff `main.tex` vs `src/content/resume/cv.json` → update JSON word for word (`--`→"–", `\textbf{x}`→`**x**`) → `npm run cv:import -- "<pdf>"` → build → compare line breaks with the PDF.
- **Big UI work that went well:** research → design-system doc → parallel agents that each own separate files, all previewing one `npm run dev` (hot reload) → 4 read-only reviewers (visual, UX, layout metrics, qa-reviewer) → apply safe fixes → owner decides the rest. Reviewers measure the built site on 4321; run fix agents on another dev port (4322) so they don't disturb them.
- **Tool quirks (Windows):** write multi-line scripts with the Write tool, not bash heredocs/`node -e` (backslashes and quotes get mangled; a `\S` became `S` once). After `git stash`/checkout files may be CRLF → strip `\r` before scripted string edits. `set -o pipefail` before outward commands. Stage files by name. Stuck port: `netstat -ano | grep 4321` → `taskkill //PID <pid> //T //F`. Playwright: `innerWidth` only inside `page.evaluate`; full-page screenshots go blank below the fold (shoot per viewport).
- **3D pipeline:** `scripts/pcb3d/` (tools in git-ignored `pcbtools/`), one board at a time, `node --max-old-space-size=3000`.
- **Local-only skills** (in `.git/info/exclude`): `.claude/skills/web-design-guidelines/`, `.claude/skills/emil-*/`.

## 5. Log (newest first)

- **2026-11-28** — Premium redesign "Midnight Lab" of the whole site (`1381bb4`), then Projects page + cards restored to the previous version at Saad's request (`234593c`). Pushed with this handoff.
- **2026-11-27** — Removed "See it in" + all status badges (`6f14d39`); hero redesign with photo circle (`de5c185`); resume synced to latest CV, SIoT name (`57d750d`); 4-agent UI fixes + Journey logos (`8576669`).
- **2026-11-26** — Name/title/company site-wide, skills with official logos (`740ef38`); TinaCMS removed (`1ed1e37`); resume = exact PDF copy with Bitstream Charter (`8858f2d`, `62c5ac5`).
- **2026-11-21…25** — Feedback round, 3D boards, circuit background, page transition, motion polish, resume rebuilt (see `git log`).
