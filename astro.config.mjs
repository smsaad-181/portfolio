// Kiro: this file encodes a load-bearing decision — do not change
// `site`/`base`/`output` without re-reading .kiro/steering/tech.md first.
//
// Repo is smsaad-181/portfolio (a project site), so the deployed URL is
// https://smsaad-181.github.io/portfolio/ — NOT the domain root. Every
// internal link/asset must respect `base`, or it 404s in production only.
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://smsaad-181.github.io",
  base: "/portfolio",
  output: "static",
  trailingSlash: "always",
  // Astro 7 defaults to "jsx", which strips whitespace between inline
  // elements ("<a>x</a> <b>y</b>" → "xy"). Keep the pre-7 behaviour.
  compressHTML: true,
  build: {
    // "auto": small stylesheets are inlined, larger ones stay as cached files.
    // Measured: inlining everything ("always") raised mobile blocking time.
    inlineStylesheets: "auto",
  },
  vite: {
    build: {
      // three.js (the 3D board viewer) is one large chunk. It is
      // dynamic-imported only on project pages that show a 3D board, so the
      // size is expected — don't warn about it.
      chunkSizeWarningLimit: 1100,
    },
  },
  integrations: [
    mdx(),
    sitemap(),
  ],
});
