---
inclusion: always
---

# Repo & Folder Structure

This repository is already scaffolded with the target folder layout. Generate
files into the existing folders below — do not invent a different top-level
layout.

```
portfolio/
├── .github/workflows/deploy.yml   # CI/CD — see deployment-cicd.md
├── .kiro/                         # Kiro control files (steering/specs/agents/skills)
├── public/
│   └── resume/                    # Saad's CV PDF (Tina-managed file field)
├── src/
│   ├── content/
│   │   ├── config.ts              # zod schemas — see content-model.md
│   │   ├── profile/                # singleton
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
│   │   ├── resume.astro
│   │   └── 404.astro
│   └── styles/
├── tina/
│   └── config.ts                  # mirrors src/content/config.ts
├── astro.config.mjs
├── package.json
├── .env.example
└── README.md
```

## Placeholder files
Every currently-empty content/component folder in this scaffold contains a
`.gitkeep` — delete a folder's `.gitkeep` only once you've added a real file
to that folder.

## Naming conventions
- Project content files: `src/content/projects/<kebab-case-slug>.mdx`
- Components: PascalCase, one component per file (`ProjectCard.astro`)
- Tags and skill categories: store lowercase in frontmatter, format for
  display at render time (don't trust free-text casing as-is — see
  `content-model.md`).
