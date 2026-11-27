# Pictures — drop your images here

Images in this folder are optimised by Astro at build time (resized, converted
to WebP, lazy-loaded), so put photos here rather than in `public/`.

## `profile/` — your photos

| File name | Used for |
|-----------|----------|
| `hero-photo.jpg` | Photo in the gradient circle on Home and About (square crop, face slightly above centre) |
| `cv-photo.jpg` | Photo on the resume page (same as the CV PDF) |

- Square, at least **1000 × 1000 px**; the site shows it as a circle.
- Save it from an editor or with sharp so camera metadata (EXIF/GPS) is dropped.

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
