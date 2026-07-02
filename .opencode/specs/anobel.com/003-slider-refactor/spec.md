---
title: "Feature Specification: Slider JS Refactor & Variant Split"
description: "Rebrand the testimonial-specific carousel slider to a generic slider base, then split it into two named variants: slider_testimonial.js (with image colour states) and slider_timeline.js (without colour states). Differentiate per-variant collision constants so both can coexist on the same page."
trigger_phrases:
  - "slider refactor"
  - "slider_testimonial"
  - "slider_timeline"
  - "carousel slider variants"
  - "slider generic rebrand"
  - "horizontalLoop"
  - "Motion.dev slider"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/003-slider-refactor"
    last_updated_at: "2026-06-06T10:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Closed slider variants"
    next_safe_action: "Apply Webflow update guides"
    blockers: []
    key_files:
      - "a_nobel_en_zn/2_javascript/slider_testimonial.js"
      - "a_nobel_en_zn/2_javascript/slider_timeline.js"
      - "a_nobel_en_zn/2_javascript/z_minified/slider_testimonial.min.js"
      - "a_nobel_en_zn/2_javascript/z_minified/slider_timeline.min.js"
      - "a_nobel_en_zn/1_css/slider/slider_timeline.css"
      - "specs/anobel.com/003-slider-refactor/webflow-update-guide.md"
      - "specs/anobel.com/003-slider-refactor/testimonial-tab-update-guide.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-anobel.com/003-slider-refactor"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Timeline active-state underline styling is scoped under data-target=slider-timeline. Testimonial tabs use runtime image colour state from slider_testimonial.js and do not receive the timeline underline."
      - "Both slider variants now require variant-specific section wrappers: data-target=slider-testimonial or data-target=slider-timeline."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Slider JS Refactor & Variant Split

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-31 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The carousel slider was named and attributed specifically for testimonials (`testimonial.js`, `data-testimonial-slider`, `--testimonial-slide-x`, `__testimonialSliderCdnInit`, etc.). This prevented the same engine from being reused for other slider patterns without renaming collisions and conflicting injected styles.

### Purpose
1. Strip all testimonial branding to produce a reusable generic base.
2. Split into `slider_testimonial.js` (retains image greyscale/colour states for logo tabs) and `slider_timeline.js` (no image colour states, for timeline-style navigation where tabs are text/icon only).
3. Scope the three collision-prone constants (`STYLE_ID`, `DECORATED_FLAG`, `INIT_FLAG`) and section selectors per variant so both can run on the same page.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename all `testimonial`-prefixed identifiers to generic `slider`-prefixed equivalents.
- Create two named source files from the generic base.
- Scope per-variant constants to prevent same-page collisions.
- Remove image colour state CSS from the timeline variant's `ensureStyles()`.
- Require variant-specific section wrappers: `data-target="slider-testimonial"` and `data-target="slider-timeline"`.
- Scope timeline tab underline/active text CSS to timeline sections only.
- Prevent mobile pagination controls from following link defaults or bubbling into slide handlers.
- Minify both variants and verify with the sk-code Webflow verification pipeline.
- Remove stale minified files (`testimonial.min.js`, `slider.min.js`).
- Document required Webflow Designer changes in `webflow-update-guide.md` and `testimonial-tab-update-guide.md`.

### Out of Scope
- Changes to the Motion.dev animation engine (`horizontalLoop`).
- Direct Webflow Designer publishing. The required external Designer changes are documented, but not applied inside Webflow from this repository.

### Files Changed

| File | Change |
|------|--------|
| `a_nobel_en_zn/2_javascript/slider_testimonial.js` | Testimonial variant; generic child attributes; variant section selector; mobile pagination click handling |
| `a_nobel_en_zn/2_javascript/slider_timeline.js` | Timeline variant; image colour state removed; variant section selector; mobile pagination click handling |
| `a_nobel_en_zn/2_javascript/z_minified/slider_testimonial.min.js` | Regenerated minified output |
| `a_nobel_en_zn/2_javascript/z_minified/slider_timeline.min.js` | Regenerated minified output |
| `a_nobel_en_zn/1_css/slider/slider_timeline.css` | Timeline tab underline, hover, focus, and active text scoped under timeline wrapper only |
| `webflow-update-guide.md` | Webflow Designer action guide |
| `testimonial-tab-update-guide.md` | Testimonial tab-specific Webflow guide |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| Requirement | Acceptance Criteria |
|-------------|---------------------|
| Both variants safe to load on same page | `STYLE_ID`, `DECORATED_FLAG`, `INIT_FLAG` are unique per variant |
| Both variants decorate only their own section type | testimonial scans `data-target="slider-testimonial"`; timeline scans `data-target="slider-timeline"` |
| Timeline variant has no image colour state | `ensureStyles()` in `slider_timeline.js` contains no `filter` or greyscale rules |
| Timeline underline styling does not affect testimonials | underline, hover, focus, and active text selectors are scoped under `data-target="slider-timeline"` |
| Mobile pagination controls respond consistently | previous/next click handlers prevent default link behavior and stop propagation before advancing the loop |
| Minification passes all three verification stages | `verify-minification.mjs` and `test-minified-runtime.mjs` both exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `slider_testimonial.min.js` and `slider_timeline.min.js` exist in `z_minified/`.
- **SC-002**: Both runtime tests confirm correct `INIT_FLAG` set (`__sliderTestimonialCdnInit` / `__sliderTimelineCdnInit`).
- **SC-003**: No stale `testimonial.min.js` or `slider.min.js` remain.
- **SC-004**: `slider_timeline.js` `ensureStyles()` contains no `filter` declarations.
- **SC-005**: Timeline tab underline CSS is scoped to `data-target="slider-timeline"`.
- **SC-006**: Webflow Designer instructions are documented in `webflow-update-guide.md` and `testimonial-tab-update-guide.md`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Webflow Designer sections still carry old `data-testimonial-slider` attributes | High — slider will not initialise | Use `webflow-update-guide.md` to apply the documented external Designer changes |
| Risk | Any page embedding both slider variants uses generic `data-slider="section"` wrappers | Medium — both scripts may not target intended sections | Use `data-target="slider-testimonial"` and `data-target="slider-timeline"` wrappers |
| Dependency | `slider_timeline.css` | Timeline tabs only | Timeline underline/active text styling is scoped to the timeline wrapper |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. All decisions resolved in-session.
<!-- /ANCHOR:questions -->
