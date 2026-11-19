# Requirements Document

## Introduction
Build a static Astro portfolio website for Sultan Mahmud ("Saad"), a Hardware
Engineer, deployed to GitHub Pages via GitHub Actions, with all content
editable after launch through a Tina CMS admin UI backed by Tina Cloud. See
`.kiro/steering/` for full architectural context and constraints before
implementing anything below.

## Requirements

### Requirement 1: Static site build & deploy
**User Story:** As Saad, I want every push to `main` to automatically build
and deploy the site, so that I never run a manual deploy step.

#### Acceptance Criteria
1. WHEN a commit is pushed to `main` THE SYSTEM SHALL trigger a GitHub
   Actions workflow that builds the Astro site and deploys it to GitHub
   Pages.
2. WHEN the Astro build fails (including a content schema validation error)
   THE SYSTEM SHALL NOT deploy, and SHALL surface the failure in the Actions
   run.
3. WHEN two pushes land in quick succession (e.g., a manual push followed by
   a Tina Cloud commit) THE SYSTEM SHALL cancel the older in-flight deploy
   run in favor of the newer one, so the newest content always wins.
4. WHEN the site is deployed THE SYSTEM SHALL be reachable at
   `https://smsaad-181.github.io/portfolio/` with no broken internal links or
   asset paths caused by the `/portfolio` base path.

### Requirement 2: Editable content without code changes
**User Story:** As Saad, I want to add or edit a project, skill, or bio text
through a CMS admin UI, so that I don't need local dev tools to update my
portfolio.

#### Acceptance Criteria
1. WHEN Saad logs into `/admin` via Tina Cloud auth THE SYSTEM SHALL present
   editable forms for profile, experience, education, certifications,
   skills, and projects.
2. WHEN Saad saves a change in `/admin` THE SYSTEM SHALL commit the change
   directly to the `main` branch of the GitHub repo as a real content file.
3. WHEN a project is marked `draft: true` THE SYSTEM SHALL exclude it from
   the production build output.
4. IF a required field (e.g., project title, slug, or image alt text) is
   missing THEN THE SYSTEM SHALL fail the build rather than publish
   incomplete or inaccessible content.
5. WHEN Saad adds a new skill or project tag not previously used THE SYSTEM
   SHALL accept it without requiring a schema or code change.

### Requirement 3: Project showcase
**User Story:** As a site visitor (recruiter/peer), I want to browse Saad's
hardware/embedded projects with enough detail to evaluate his work, so that I
can assess his engineering ability.

#### Acceptance Criteria
1. WHEN a visitor opens `/projects` THE SYSTEM SHALL display all
   non-draft projects as a filterable grid (filterable by tag and by
   status).
2. WHEN a visitor opens a project detail page THE SYSTEM SHALL display the
   project's summary, rich description, images (with alt text), tags,
   status badge, and any external links (GitHub, OSHWLab, live demo).
3. WHEN a visitor opens the homepage THE SYSTEM SHALL display featured
   projects (CMS-controlled via `featured` and `order` fields), not a
   hardcoded list.

### Requirement 4: Resume delivery
**User Story:** As Saad, I want to update my resume PDF without redeploying
code, so that my CV is always current.

#### Acceptance Criteria
1. WHEN Saad uploads a new resume file via `/admin` THE SYSTEM SHALL replace
   the file served at `/resume` after the next deploy.
2. WHEN a visitor opens `/resume` THE SYSTEM SHALL offer the current PDF as a
   direct download.

### Requirement 5: Contact
**User Story:** As a site visitor, I want a way to contact Saad, so that I
can reach out about opportunities.

#### Acceptance Criteria
1. WHEN a visitor opens `/contact` THE SYSTEM SHALL display working links to
   Saad's email, LinkedIn, GitHub, and OSHWLab profiles.
2. THE SYSTEM SHALL NOT depend on a custom backend server for any contact
   mechanism (static-friendly form service or `mailto:` only).

### Requirement 6: Accessibility & performance
**User Story:** As any site visitor, I want a fast, accessible site, so that
the portfolio reflects engineering quality, not just content.

#### Acceptance Criteria
1. WHEN any image is rendered THE SYSTEM SHALL include meaningful alt text
   sourced from a required content field.
2. WHEN the site is audited with Lighthouse THE SYSTEM SHALL score
   consistently in the "good" range for performance, accessibility, best
   practices, and SEO.
3. WHEN a page is requested that doesn't exist THE SYSTEM SHALL serve a
   working `404` page.

### Requirement 7: Growth-ready architecture
**User Story:** As Saad, I want to add new content types later (e.g., a
notes/blog section) without a major rewrite, so that the site scales with my
career.

#### Acceptance Criteria
1. WHEN a new content collection is added THE SYSTEM SHALL follow the same
   pattern already established for `projects` (Astro content collection +
   mirrored Tina schema pointing at the same files).
2. THE SYSTEM SHALL keep tag/category fields as free text across all
   collections so future content doesn't require a schema migration just to
   add a new tag.
