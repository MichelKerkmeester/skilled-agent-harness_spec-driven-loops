You are a precise implementation worker. Fix WCAG AA contrast failures in the design files below, using each file's existing CSS-variable palette. Authoring only. Do NOT run git. Do NOT change layout, copy, fonts, or the design's character beyond the contrast fix.

GATE 3: This work is tracked under .opencode/specs/design/002-mcp-open-design/010-design-playbook-live-run-and-refinement (pre-approved, skip Gate 3, do not ask).

PRIMARY FILE (two independent graders found these exact AA failures - fix each, prefer the file's existing tokens):
.opencode/specs/skilled-agent-orchestration/154-design-skill-integration-test/designs/mimo/01-meridian-roasters.html
- Footer/nav text using --slate (#5A6B7A) on --ink-water (#1B2A3D), ~2.6-3.0:1. Selectors: .footer__links a, .footer__bottom, .footer__tagline, .nav-rail__lat. Fix: set that text color to --fog-warm (#D0D8E0), which passes (~11:1).
- Small label text using --copper-oxide (#B86F4A) on dark, ~3.7-4.2:1. Selectors: .hero__eyebrow, .section__eyebrow, .origin-card__region, .footer__heading, .nav-rail__brand, and any tasting-wheel label. Fix: set the TEXT color to --fog (#E8EDF1) on dark backgrounds; keep copper only as an underline, border, or fill accent so the copper identity stays.
- CTA text --pale-steel (#F5F7F9) on the --copper-oxide button, ~3.6:1. Selector: .hero__cta. Fix: set the button text color to --ink-water (#1B2A3D), which passes (~4.6:1).
- .process-step__number using --fog-warm (#D0D8E0) on --pale-steel (#F5F7F9), ~1.3:1. Fix: set it to --graphite (#2C3E50) or --ink-water (dark on the light background).

ALSO SCAN AND FIX (same method, only fix REAL AA failures, leave passing colors alone):
- .opencode/specs/skilled-agent-orchestration/154-design-skill-integration-test/designs/mimo/02-wavelength-pricing.html
- .../designs/mimo/03-wattbird-dashboard.html
- .../designs/deepseek/01-meridian-roasters.html
- .../designs/deepseek/02-wavelength-pricing.html
- .../designs/deepseek/03-wattbird-dashboard.html
For each: compute contrast for body and label text against its actual background. Where it fails WCAG AA (4.5:1 normal text, 3:1 large text >=24px or >=18.66px bold), adjust the color to pass using that file's own palette tokens. Make the minimal change that passes.

CONSTRAINTS: no em dashes in any added CSS comments; never put spec paths or task ids in code/CSS comments (durable WHY only); no git; after editing, confirm each file still contains a <style> block.

OUTPUT: per file, list the fixes made as "selector: old-color -> new-color (old-ratio -> new-ratio)", or "no AA failures found".