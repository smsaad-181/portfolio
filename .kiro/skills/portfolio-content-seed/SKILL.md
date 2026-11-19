---
name: portfolio-content-seed
description: Real source data for seeding this portfolio's initial content — Saad's CV facts and known project details. Use when creating the first content files for the profile, experience, education, certifications, skills, or projects collections.
---

# Portfolio Content Seed

This skill bundles the actual facts to use when populating content — do not
invent or guess biographical or project details. If a fact isn't in the
reference files, either ask Saad or create the entry as a `draft: true` stub
with a `[NEEDS INPUT]` note in an internal comment, per
`.kiro/steering/content-model.md`.

## Reference files
- `references/cv-data.md` — profile, experience, education, certifications,
  and skills, extracted directly from Saad's CV.
- `references/projects-inventory.md` — known project details plus a list of
  projects that need Saad's input before they can be fully written up.

## How to use
1. Read the relevant reference file for the collection you're seeding.
2. Map each fact directly onto the schema fields defined in
   `.kiro/steering/content-model.md` — don't add embellishment or invented
   metrics.
3. For any project marked `[NEEDS INPUT]`, create the file with
   `draft: true` and only the confirmed facts (title, likely category based
   on its name) filled in; leave the rest for Saad to complete via `/admin`.
