---
title: "Implementation Plan: Slider JS Refactor & Variant Split"
description: "Plan for genericising the testimonial slider and splitting it into two named variants with scoped collision constants."
trigger_phrases:
  - "slider refactor plan"
  - "slider_testimonial plan"
  - "slider_timeline plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/003-slider-refactor"
    last_updated_at: "2026-06-06T10:20:00Z"
    last_updated_by: "opencode"
    recent_action: "All repo work completed and spec folder closed"
    next_safe_action: "No repo follow-on required; use webflow-update-guide.md for external Webflow Designer changes"
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
# Implementation Plan: Slider JS Refactor & Variant Split

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript ES6+ and CSS for Webflow embeds |
| **Runtime Libraries** | Motion.dev `horizontalLoop` inside the slider scripts |
| **Source Layout** | Canonical source under `a_nobel_en_zn/2_javascript/`; MEGA-synced mirror under `anobel.com/src/2_javascript/` |
| **Build Output** | Minified bundles under `a_nobel_en_zn/2_javascript/z_minified/` |
| **Verification** | `minify-webflow.mjs --force`, `verify-minification.mjs`, `test-minified-runtime.mjs`, and strict spec validation |
| **Deployment Boundary** | Direct Webflow Designer publishing was out of scope; repository docs capture the required external updates |

### Overview
The implementation converts the testimonial-specific carousel script into a generic slider contract, then ships two explicit variants: `slider_testimonial.js` keeps image colour states for logo/tab navigation, while `slider_timeline.js` removes those image states for timeline navigation. The variants use separate `STYLE_ID`, `DECORATED_FLAG`, `INIT_FLAG`, and section selectors so both scripts can coexist on the same page without decorating each other's sections.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Original reuse blocker documented: the carousel script and attributes were testimonial-branded (`testimonial.js`, `data-testimonial-slider`, `--testimonial-slide-x`, `__testimonialSliderCdnInit`).
- [x] Variant split defined: testimonial keeps runtime image colour states; timeline does not.
- [x] Collision points identified: `STYLE_ID`, `DECORATED_FLAG`, `INIT_FLAG`, and section selectors require per-variant values.
- [x] External boundary documented: direct Webflow Designer publishing is not part of this repository change.

### Definition of Done
- [x] `slider_testimonial.js` and `slider_timeline.js` exist with variant-specific constants and selectors.
- [x] Timeline runtime styles contain no image filter/greyscale rules.
- [x] Timeline tab underline, hover, focus, and active text styling are scoped under `data-target="slider-timeline"`.
- [x] Mobile pagination controls prevent default link behavior and stop propagation before advancing the loop.
- [x] Both variant bundles were minified and runtime-verified with the Webflow verification scripts recorded in this packet.
- [x] Stale `testimonial.min.js` and `slider.min.js` outputs were removed.
- [x] `webflow-update-guide.md` and `testimonial-tab-update-guide.md` document the external Designer changes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two named, self-contained slider variants derived from the genericized slider base. No shared runtime module is introduced in this packet; each variant owns its own injected style ID, decoration flag, init flag, and section selector.

### Key Components
- **`slider_testimonial.js`**: testimonial variant using `data-target="slider-testimonial"`; retains image greyscale/default and active/hover/focus colour state in `ensureStyles()`.
- **`slider_timeline.js`**: timeline variant using `data-target="slider-timeline"`; removes image colour-state rules and relies on static timeline CSS for tab visuals.
- **`slider_timeline.css`**: scopes timeline underline, hover, focus, active text colour, and active font weight under the timeline wrapper.
- **Minified bundles**: `slider_testimonial.min.js` and `slider_timeline.min.js` are regenerated outputs for CDN/Webflow use.
- **Webflow guides**: packet-local docs describe required section wrappers, shared child attributes, script embeds, and tab setup.

### Data Flow
Webflow page markup provides a variant wrapper (`data-target="slider-testimonial"` or `data-target="slider-timeline"`) -> the matching script scans only that wrapper type -> slider child elements are decorated through the generic `data-slider="*"` contract -> Motion.dev `horizontalLoop` drives slide movement -> variant-specific controls, tabs, pagination, and active states update without cross-variant collisions.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Analyse the original testimonial slider naming and reusable slider requirements.
- [x] Confirm the generic child attribute contract and variant-specific wrapper targets.
- [x] Identify constants and injected style IDs that would collide if both variants loaded together.

### Phase 2: Implementation
- [x] Replace testimonial-prefixed identifiers with generic slider-prefixed equivalents.
- [x] Create `slider_testimonial.js` from the genericized base and assign testimonial-specific constants.
- [x] Create `slider_timeline.js` with timeline-specific constants and without runtime image colour-state CSS.
- [x] Scope section selectors to `data-target="slider-testimonial"` and `data-target="slider-timeline"`.
- [x] Scope timeline tab underline/active styling to timeline wrappers only.
- [x] Prevent mobile pagination link defaults and event bubbling before loop navigation.
- [x] Delete stale minified outputs superseded by the named variants.
- [x] Create the Webflow Designer update guides.

### Phase 3: Verification
- [x] Regenerate `slider_testimonial.min.js` and `slider_timeline.min.js` with `minify-webflow.mjs --force`.
- [x] Run `verify-minification.mjs` for both variants; selectors, DOM events, `Webflow.push`, and `Motion.animate` were preserved.
- [x] Run `test-minified-runtime.mjs` for both variants; the correct init flags were set.
- [x] Confirm timeline `ensureStyles()` contains no image `filter` declarations.
- [x] Confirm packet documentation records the external Webflow Designer update path.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Build | Regenerate both minified slider bundles | `minify-webflow.mjs --force` |
| Static Minification Guard | Preserve required selectors, DOM events, `Webflow.push`, and `Motion.animate` | `verify-minification.mjs` |
| Runtime Simulation | Execute each minified bundle and confirm variant init flags | `test-minified-runtime.mjs` |
| Targeted Source Review | Confirm timeline variant has no runtime image filter rules and timeline CSS selectors are wrapper-scoped | Source inspection recorded in packet evidence |
| Spec Validation | Confirm packet structure has no blocking validation errors | `validate.sh --strict` |
| External Manual Validation | Apply Webflow Designer changes and page-level embed/cache updates | Documented in guides; not performed inside this repository |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Webflow markup using `data-target="slider-testimonial"` and `data-target="slider-timeline"` | External content contract | Documented | Variant scripts will not initialise the intended sections |
| Generic `data-slider="*"` child attributes | External content contract | Documented | Controls, tabs, slides, or pagination may not bind |
| Motion.dev `horizontalLoop` behavior | Runtime library | Unchanged | Slider movement would regress outside this refactor's scope |
| Webflow minification scripts | Build tooling | Used | Minified CDN bundles cannot be regenerated or verified |
| R2/Webflow embed publishing | External deployment | Out of scope | Repository changes are not live until bundles and embeds are updated externally |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Either variant fails to initialise, both variants collide on the same page, timeline CSS affects testimonial tabs, or mobile pagination regresses after deployment.
- **Repository procedure**: Revert the touched source files, minified bundles, timeline CSS, stale artifact cleanup, and Webflow guide changes from version control.
- **External procedure**: If Webflow/R2 updates were already applied, restore the prior script embeds, cache-buster values, and old section attributes in Webflow Designer.
- **Verification after rollback**: Re-run the Webflow minification/runtime checks for the restored bundle and manually verify affected Webflow pages.
<!-- /ANCHOR:rollback -->
