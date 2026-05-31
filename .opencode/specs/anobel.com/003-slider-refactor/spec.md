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
    last_updated_at: "2026-05-31T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Completed slider refactor — generic rebrand + two named variants, minified and verified"
    next_safe_action: "Wire the new data-slider attributes in Webflow Designer for any section that previously used data-testimonial-slider attributes"
    blockers: []
    key_files:
      - "a_nobel_en_zn/2_javascript/carousel/slider_testimonial.js"
      - "a_nobel_en_zn/2_javascript/carousel/slider_timeline.js"
      - "a_nobel_en_zn/2_javascript/z_minified/carousel/slider_testimonial.min.js"
      - "a_nobel_en_zn/2_javascript/z_minified/carousel/slider_timeline.min.js"
      - "src/1_css/button/btn_tab_main.css"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-anobel.com/003-slider-refactor"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Tab active-state styling lives in btn_tab_main.css (static) and ensureStyles() in slider_testimonial.js (runtime image filter). slider_timeline.js omits the image filter block entirely."
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
3. Scope the three collision-prone constants (`STYLE_ID`, `DECORATED_FLAG`, `INIT_FLAG`) per variant so both can run on the same page.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename all `testimonial`-prefixed identifiers to generic `slider`-prefixed equivalents.
- Create two named source files from the generic base.
- Scope per-variant constants to prevent same-page collisions.
- Remove image colour state CSS from the timeline variant's `ensureStyles()`.
- Minify both variants and verify with the sk-code Webflow verification pipeline.
- Remove stale minified files (`testimonial.min.js`, `slider.min.js`).

### Out of Scope
- Changes to the Motion.dev animation engine (`horizontalLoop`).
- Changes to `btn_tab_main.css` or any other CSS file.
- Webflow Designer markup changes (data-attribute updates in the Designer are a follow-on task).

### Files Changed

| File | Change |
|------|--------|
| `carousel/slider_testimonial.js` | Renamed from `testimonial.js`; all attributes genericised; variant constants scoped |
| `carousel/slider_timeline.js` | New variant; image colour state removed from `ensureStyles()` |
| `z_minified/carousel/slider_testimonial.min.js` | New minified output |
| `z_minified/carousel/slider_timeline.min.js` | New minified output |
| `z_minified/carousel/testimonial.min.js` | Deleted (stale) |
| `z_minified/carousel/slider.min.js` | Deleted (intermediate, superseded) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| Requirement | Acceptance Criteria |
|-------------|---------------------|
| No `testimonial`-branded identifiers in source or output | grep for `testimonial` returns zero hits in both source files |
| Both variants safe to load on same page | `STYLE_ID`, `DECORATED_FLAG`, `INIT_FLAG` are unique per variant |
| Timeline variant has no image colour state | `ensureStyles()` in `slider_timeline.js` contains no `filter` or greyscale rules |
| Minification passes all three verification stages | `verify-minification.mjs` and `test-minified-runtime.mjs` both exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `slider_testimonial.min.js` and `slider_timeline.min.js` exist in `z_minified/carousel/`.
- **SC-002**: Both runtime tests confirm correct `INIT_FLAG` set (`__sliderTestimonialCdnInit` / `__sliderTimelineCdnInit`).
- **SC-003**: No stale `testimonial.min.js` or `slider.min.js` remain.
- **SC-004**: `slider_timeline.js` `ensureStyles()` contains no `filter` declarations.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Webflow Designer sections still carry old `data-testimonial-slider` attributes | High — slider will not initialise | Update data attributes in Webflow Designer as a follow-on task; see handover.md §Webflow markup contract |
| Risk | Any page embedding both slider variants must load both JS files | Low | Both files are independent IIFEs with scoped flags |
| Dependency | `btn_tab_main.css` | None — untouched | Tab active state (font-weight, colour, border) handled by static CSS; no change required |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. All decisions resolved in-session.
<!-- /ANCHOR:questions -->
