---
inclusion: always
---

# Product Context

## Who this is for
This is the personal portfolio website of **Sultan Mahmud ("Saad")**, a Hardware
Engineer at Southern IoT Limited (Dhaka, Bangladesh), specializing in PCB design,
embedded systems (ESP32, Arduino, ATmega), IoT product development, and
communication protocols (I²C, SPI, UART, Modbus, MQTT, LoRaWAN).

The site is a hiring-facing asset. Visitors are recruiters, hiring managers, and
peers evaluating his hardware/embedded engineering work.

## Goals (v1)
1. Fast, accessible, static portfolio reflecting his hardware/embedded/IoT work.
2. Fully editable after launch via a Tina CMS admin UI — no code changes needed
   to add a project, update skills, or edit bio text.
3. Push to `main` → GitHub Actions builds → auto-deploys to GitHub Pages. Zero
   manual deploy steps, ever.
4. Designed to grow over time: new project categories, new skill tags, a future
   notes/blog section, resume PDF versioning — without schema rewrites.
5. Strong Lighthouse scores (performance / SEO / accessibility).

## Explicit non-goals (v1)
- Live click-to-edit visual editing (architecturally incompatible with static
  GitHub Pages hosting — see `tech.md`).
- Multi-language / i18n.
- User comments or a server-backed contact form (use a static-friendly third
  party form endpoint or a `mailto:` link instead).
- CMS roles beyond Saad as sole editor (Tina Cloud free tier's 2-user limit is
  more than sufficient).

## Source of truth
The authoritative plan for this project is `.kiro/specs/portfolio-website/`.
When in doubt about a decision not covered there, prefer the option that keeps
the site (a) fully static-buildable, (b) editable from Tina without a code
change, and (c) simple over clever.
