/**
 * Web app manifest — /portfolio/site.webmanifest. Lets phones show the
 * right name, icon and colours when the site is saved to the home screen.
 * Colours mirror --bg-base (dark) in src/styles/tokens.css.
 */
import type { APIRoute } from "astro";
import { getProfile } from "../lib/profile";
import { assetUrl, pageUrl } from "../lib/urls";

export const prerender = true;

export const GET: APIRoute = async () => {
  const { data } = await getProfile();
  const manifest = {
    name: `${data.name} — ${data.title}`,
    short_name: data.name,
    description: data.summary,
    start_url: pageUrl("/"),
    scope: pageUrl("/"),
    display: "browser",
    background_color: "#0b0614",
    theme_color: "#0b0614",
    icons: [
      { src: assetUrl("/icons/192.png"), sizes: "192x192", type: "image/png" },
      { src: assetUrl("/icons/512.png"), sizes: "512x512", type: "image/png" },
      { src: assetUrl("/favicon.svg"), sizes: "any", type: "image/svg+xml" },
    ],
  };
  return new Response(JSON.stringify(manifest, null, 2), { headers: { "Content-Type": "application/manifest+json" } });
};
