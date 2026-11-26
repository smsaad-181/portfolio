/**
 * Official brand logos for the skills (Simple Icons, CC0 — simpleicons.org).
 * Only the logos the site uses are imported, keyed by their Simple Icons slug
 * as written in src/content/skills/*.json (`logo` field). Each logo keeps its
 * official brand colour (`hex`) — the one exception to "colours only in
 * tokens.css", like the OG image and favicon. Logos are trademarks of their
 * owners and only name the tools Saad uses.
 */
import {
  siArduino,
  siAutodesk,
  siBluetooth,
  siC,
  siCplusplus,
  siEasyeda,
  siEclipsemosquitto,
  siEspressif,
  siGit,
  siGithub,
  siGrafana,
  siHomeassistant,
  siHtml5,
  siKicad,
  siLatex,
  siMongodb,
  siMqtt,
  siMysql,
  siNodered,
  siPlatformio,
  siProteus,
  siPython,
  siRaspberrypi,
  siReact,
} from "simple-icons";

export interface BrandLogo {
  title: string;
  path: string;
  hex: string;
}

const LOGOS: Record<string, BrandLogo> = Object.fromEntries(
  [
    siArduino, siAutodesk, siBluetooth, siC, siCplusplus, siEasyeda, siEclipsemosquitto, siEspressif,
    siGit, siGithub, siGrafana, siHomeassistant, siHtml5, siKicad, siLatex, siMongodb, siMqtt, siMysql,
    siNodered, siPlatformio, siProteus, siPython, siRaspberrypi, siReact,
  ].map((i) => [i.slug, { title: i.title, path: i.path, hex: i.hex }])
);

/** The logo for a Simple Icons slug; an unknown slug fails the build loudly. */
export function brandLogo(slug: string): BrandLogo {
  const logo = LOGOS[slug];
  if (!logo) {
    throw new Error(`Unknown logo "${slug}" — add it to src/lib/brand-logos.ts (Simple Icons slug).`);
  }
  return logo;
}
