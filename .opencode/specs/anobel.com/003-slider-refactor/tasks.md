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
    next_safe_action: "Apply Webflow update guides"
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

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Analyse original `testimonial.js` architecture, quality findings, and open issues (`a_nobel_en_zn/2_javascript/`)
- [x] T002 Identify testimonial-branded strings, attributes, CSS custom properties, console prefixes, and tab label fallback behavior (`a_nobel_en_zn/2_javascript/`)
- [x] T003 Confirm the variant wrapper contract: `data-target="slider-testimonial"` and `data-target="slider-timeline"` (`spec.md`)
- [x] T004 Confirm direct Webflow Designer publishing stays outside repository scope (`spec.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Replace testimonial-prefixed identifiers with generic slider equivalents across source identifiers, data attributes, CSS custom properties, console prefixes, and tab label fallback (`slider_testimonial.js`)
- [x] T006 Rename the genericized testimonial variant to `slider_testimonial.js` in the MEGA-synced source/mirror workflow (`a_nobel_en_zn/2_javascript/slider_testimonial.js`)
- [x] T007 Update testimonial header comment to `// SLIDER: TESTIMONIAL` (`slider_testimonial.js`)
- [x] T008 Scope testimonial constants: `STYLE_ID = 'slider-testimonial-styles'`, `DECORATED_FLAG = 'sliderTestimonialDecorated'`, and `INIT_FLAG = '__sliderTestimonialCdnInit'` (`slider_testimonial.js`)
- [x] T009 Create `slider_timeline.js` with `// SLIDER: TIMELINE` and timeline-scoped constants (`slider_timeline.js`)
- [x] T010 Remove image greyscale/colour state CSS blocks from timeline `ensureStyles()` (`slider_timeline.js`)
- [x] T011 Require variant-specific section wrappers in each script (`slider_testimonial.js`, `slider_timeline.js`)
- [x] T012 Scope timeline tab underline, hover, focus, and active text styling to `data-target="slider-timeline"` (`slider_timeline.css`)
- [x] T013 Prevent mobile pagination controls from following default link behavior or bubbling into slide handlers (`slider_testimonial.js`, `slider_timeline.js`)
- [x] T014 Regenerate `slider_testimonial.min.js` and `slider_timeline.min.js` (`z_minified/`)
- [x] T015 Delete stale `z_minified/carousel/testimonial.min.js` and `z_minified/carousel/slider.min.js` (`z_minified/carousel/`)
- [x] T016 Create Webflow Designer update guides (`webflow-update-guide.md`, `testimonial-tab-update-guide.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Run `minify-webflow.mjs --force`; both files minified with zero failures
- [x] T018 Run `verify-minification.mjs`; both variants preserved data selectors, DOM events, `Webflow.push`, and `Motion.animate`
- [x] T019 Run `test-minified-runtime.mjs`; both variants executed without errors and set the expected init flags
- [x] T020 Confirm stale minified outputs were removed (`z_minified/carousel/`)
- [x] T021 Run strict spec validation before closing the folder (`validate.sh --strict`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks are marked `[x]`.
- [x] No `[B]` blocked tasks remain.
- [x] Both named variants and both minified bundles exist.
- [x] Timeline runtime styles contain no image colour-state CSS.
- [x] External Webflow Designer actions are documented rather than performed from this repository.

### Completion Evidence

| Check | Result |
|-------|--------|
| `slider_testimonial.min.js` size | 32,757 B -> 14,173 B (-56.7%) |
| `slider_timeline.min.js` size | 31,988 B -> 13,390 B (-58.1%) |
| verify-minification testimonial | PASS: 20 data-selectors, 10 DOM events, Webflow.push, Motion.animate |
| verify-minification timeline | PASS: 22 data-selectors, 10 DOM events, Webflow.push, Motion.animate |
| runtime test testimonial | PASS: `__sliderTestimonialCdnInit` set |
| runtime test timeline | PASS: `__sliderTimelineCdnInit` set |
| strict spec validation | PASS: no blocking output after documentation-completeness fix |
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Implementation summary**: `implementation-summary.md`
- **External Designer guide**: `webflow-update-guide.md`
- **Testimonial tab guide**: `testimonial-tab-update-guide.md`
<!-- /ANCHOR:cross-refs -->
