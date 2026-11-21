# PCB 3D models (STEP → GLB)

How the interactive boards in `public/models/<slug>/*.glb` are made from
Saad's EasyEDA projects in `D:\SAAD\PCB`. Run this by hand when a board changes;
it is not part of the site build.

- `step2board.mjs` converts one STEP file:
  - one node per placed part, named by its reference designator (U1, R3 …), with its BOM line;
  - the real top and bottom 2D layouts as the board texture. The solder mask is
    recoloured to match EasyEDA's 3D render when the two exports disagree.
- `part-looks.mjs` holds the realistic materials. EasyEDA's STEP export has
  almost no colours, so each part's type (from its reference, BOM and
  footprint) decides how its body, pins, plates and markings look. The Clock
  documentation's 3D model is the visual reference.
- `convert-boards.mjs` converts every board listed in `pcbfacts/manifest.json`
  (STEP path, 2D images, render, output path; BOM tables are in `pcbfacts/*-bom.md`).
  Run `node convert-boards.mjs <portfolio-dir> [slug or slug/board …]`, one board at a time.

## One-time setup (outside the site's dependencies)

```bash
cd scripts/pcb3d && mkdir pcbtools && cd pcbtools   # git-ignored
npm init -y
npm install occt-import-js@0.0.23 @gltf-transform/core@4 @gltf-transform/extensions@4 @gltf-transform/functions@4 meshoptimizer@1
```

## Convert one board

```bash
node step2board.mjs <board.step> <out.glb> <bom.md|-> <top2d.png|-> <bottom2d.png|-> <pcbtools-dir> <portfolio-dir> [render3d.png]
```

## Corrections and special cases

- `overrides.json`: per-board corrections Saad confirmed, keyed by the output
  path (e.g. `models/acqua-node/board.glb`), each with a material and a note that
  the viewer shows (Acqua Node LEDs follow the silkscreen labels, not the BOM).
- Manifest `layoutOutdated`: the STEP file is newer than the 2D images, render and
  Pick & Place (Fingerprint V1.1), so the board is built from the STEP alone
  (STEP solder-mask colour, no copper/silkscreen texture).
- Parts EasyEDA exported without a model (a 0.76 mm placeholder cube) are built
  at datasheet/package size, centred from Pick & Place and refined by the part's
  outline in EasyEDA's render.
