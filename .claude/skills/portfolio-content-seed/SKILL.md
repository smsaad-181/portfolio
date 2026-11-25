---
name: portfolio-content-seed
description: Real source data about Saad (Sultan Mahmud) — CV facts and known project details. Use whenever writing or editing content that states facts about him or his projects (profile, experience, education, certifications, skills, project write-ups, hero stats, FACT-CHECK.md), so nothing is invented.
---

# Portfolio Content Seed

This skill bundles the actual facts to use when populating content. Do not
invent or guess biographical or project details — no made-up numbers, part
numbers, dates, metrics or outcomes.

## Reference files
- `references/cv-data.md` — profile, experience, education, certifications
  and skills, extracted directly from Saad's CV.
- `references/projects-inventory.md` — known project details, plus a list of
  projects that need Saad's input before they can be written up.

## How to use
1. Read the relevant reference file for the content you're writing.
2. Map each fact directly onto the schema fields in `src/content.config.ts`
   (rules in `CLAUDE.md` → "Content model"). No embellishment.
3. If a fact isn't in the references or existing confirmed content, either
   ask Saad or write `TODO(saad)` in its place.
4. For any project marked `[NEEDS INPUT]`, keep it `draft: true` with only
   confirmed facts (title, likely category from its name); Saad supplies the
   rest and Claude adds it.
5. When auditing content, record each specific claim and its source
   (`cv`, `inventory`, or `UNVERIFIED`) in `docs/FACT-CHECK.md`.
