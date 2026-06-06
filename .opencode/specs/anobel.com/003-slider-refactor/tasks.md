---
title: "Tasks: Slider JS Refactor & Variant Split"
description: "Task checklist for the slider refactor — all tasks completed in-session."
trigger_phrases:
  - "slider refactor tasks"
  - "slider_testimonial tasks"
  - "slider_timeline tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/003-slider-refactor"
    last_updated_at: "2026-06-06T10:20:00Z"
    last_updated_by: "opencode"
    recent_action: "All repo tasks completed and spec folder closed"
    next_safe_action: "No repo follow-on required; apply external Webflow Designer changes from webflow-update-guide.md if needed"
    blockers: []
    key_files:
      - "a_nobel_en_zn/2_javascript/slider_testimonial.js"
      - "a_nobel_en_zn/2_javascript/slider_timeline.js"
      - "a_nobel_en_zn/1_css/slider/slider_timeline.css"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-anobel.com/003-slider-refactor"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Slider JS Refactor & Variant Split

<!-- SPECKIT_LEVEL: 1 -->

---

## Task List

- [x] Analyse original `testimonial.js` — architecture, quality findings, open issues
- [x] Replace all `testimonial`-prefixed strings with generic `slider` equivalents across source, CSS custom properties, data attributes, console prefixes, tab label fallback
- [x] Rename `slider.js` → `slider_testimonial.js` in both repos (MEGA-synced)
- [x] Update header comment to `// SLIDER: TESTIMONIAL`
- [x] Scope `STYLE_ID = 'slider-testimonial-styles'`
- [x] Scope `DECORATED_FLAG = 'sliderTestimonialDecorated'`
- [x] Scope `INIT_FLAG = '__sliderTestimonialCdnInit'`
- [x] Create `slider_timeline.js` with header `// SLIDER: TIMELINE` and timeline-scoped constants
- [x] Remove image greyscale/colour state CSS blocks from `slider_timeline.js` `ensureStyles()`
- [x] Run `minify-webflow.mjs --force` — both files minified, zero failures
- [x] Run `verify-minification.mjs` — PASS for both (data-selectors, DOM events, Webflow.push, Motion.animate)
- [x] Run `test-minified-runtime.mjs` — PASS for both (no errors, correct INIT_FLAG per variant)
- [x] Delete `z_minified/carousel/testimonial.min.js` (stale — source renamed)
- [x] Delete `z_minified/carousel/slider.min.js` (intermediate — superseded by named variants)
- [x] Require variant-specific section wrappers: `data-target="slider-testimonial"` and `data-target="slider-timeline"`
- [x] Scope timeline tab underline, hover, focus, and active text styling to `data-target="slider-timeline"`
- [x] Prevent mobile pagination controls from following default link behavior or bubbling into slide handlers
- [x] Regenerate `slider_testimonial.min.js` and `slider_timeline.min.js`
- [x] Create `webflow-update-guide.md` and `testimonial-tab-update-guide.md`
- [x] Run strict spec validation before closing the folder

## Completion Evidence

| Check | Result |
|-------|--------|
| `slider_testimonial.min.js` size | 32,757 B → 14,173 B (-56.7%) |
| `slider_timeline.min.js` size | 31,988 B → 13,390 B (-58.1%) |
| verify-minification testimonial | PASS — 20 data-selectors, 10 DOM events, Webflow.push, Motion.animate |
| verify-minification timeline | PASS — 22 data-selectors, 10 DOM events, Webflow.push, Motion.animate |
| runtime test testimonial | PASS — `__sliderTestimonialCdnInit` set |
| runtime test timeline | PASS — `__sliderTimelineCdnInit` set |
| strict spec validation | PASS — no blocking output |
