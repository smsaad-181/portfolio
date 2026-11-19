# Pictures — drop your images here

Images in this folder are optimised by Astro at build time (resized, converted
to WebP, lazy-loaded), so put photos here rather than in `public/`.

## `profile/` — your portrait (used on the home page)

| File name | Used for |
|-----------|----------|
| `portrait.png` | Big photo on the right of the home page hero |

- Best result: a **PNG with a transparent background** (a "cut-out" of you,
  head and shoulders, like a passport photo with the background removed).
  Free tools: remove.bg, Canva "Background Remover", or Photoshop.
- Portrait orientation, at least **1000 px tall**.
- `portrait.webp` / `portrait.jpg` also work — but a JPG keeps its background.
- The site picks the file up automatically; just refresh the browser.
  If no portrait is present, an "SM" monogram is shown instead.

## `projects/` — project photos, schematics, PCB renders

Make one folder per project, named like the project file in
`src/content/projects/` (without `.mdx`), e.g.

```
projects/
  home-automation-v2/
    cover.jpg        ← card + header image
    schematic.png
    pcb-top.png
    pcb-bottom.png
    assembled.jpg
  esp32-s3-water-monitor/
    cover.jpg
```

Once photos are here, ask Claude to wire them into the project pages.
