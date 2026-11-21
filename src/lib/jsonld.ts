/**
 * Structured data (schema.org JSON-LD) built from the content collections,
 * so search engines get the same facts as the page. Person goes on Home and
 * About; project pages emit their own CreativeWork.
 */
import { getCollection } from "astro:content";
import { getImage } from "astro:assets";
import { getProfile } from "./profile";
import { getHomeSkills } from "./skills";
import { absoluteUrl, pageUrl } from "./urls";

/** Serialise for a <script type="application/ld+json">: escapes "<" so CMS
 * text containing "</script>" cannot end the tag early. */
export function toJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export async function personJsonLd(portrait?: ImageMetadata): Promise<Record<string, unknown>> {
  const { data } = await getProfile();
  const job = (await getCollection("experience")).find((e) => e.data.current);
  const skills = await getHomeSkills();
  const image = portrait ? absoluteUrl((await getImage({ src: portrait, width: 800, format: "webp" })).src) : undefined;
  const [locality, country] = data.location.split(",").map((s) => s.trim());
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.name,
    alternateName: "Saad",
    jobTitle: data.title,
    description: data.summary,
    url: absoluteUrl(pageUrl("/")),
    email: `mailto:${data.email}`,
    ...(image && { image }),
    // schema.org Role pattern: his actual role at the company, not jobTitle.
    ...(job && {
      worksFor: {
        "@type": "EmployeeRole",
        roleName: job.data.role,
        worksFor: { "@type": "Organization", name: job.data.company },
      },
    }),
    address: { "@type": "PostalAddress", addressLocality: locality, addressCountry: country },
    sameAs: Object.values(data.socialLinks).filter(Boolean),
    knowsAbout: ["PCB design", "Embedded systems", "IoT", ...skills.map((s) => s.skill.data.name)],
  };
}
