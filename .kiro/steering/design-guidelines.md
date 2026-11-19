---
inclusion: always
---

# Design Guidelines

- **Dark-first UI**, consistent with the dashboard aesthetic Saad already uses
  in his ESP32 Home Automation web dashboard (dark sidebar, single accent
  color). Avoid a generic light "AI-generated portfolio template" look.
- Typography: one technical/monospace accent font for code snippets, specs,
  and stat callouts; one clean sans-serif for body text — reinforces the
  "hardware/embedded engineer" identity.
- Project cards show: cover image, title, 2–3 tag chips, and a status badge
  (`completed` / `in-progress` / `prototype`) using distinct colors per
  status.
- Always use Astro's `<Image />` component for project photos/schematics —
  never a raw `<img>` tag — since these will be the heaviest assets on the
  site.
- Mobile-first responsive layout.
- Follow the `frontend-design` best-practice principles for spacing and
  visual hierarchy rather than defaulting to a generic template layout —
  intentional design choices, not framework defaults.
- Every project detail page should read like a mini engineering write-up:
  problem/motivation → key components → challenges & how they were solved →
  outcome/links — matching how Saad already documents debugging cycles
  (e.g., I2C issues, WiFi failures from voltage-reference mistakes, firmware
  bugs) in his own project history.
