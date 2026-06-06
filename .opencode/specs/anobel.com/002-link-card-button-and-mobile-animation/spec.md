---
title: "Feature Specification: Link Card Collapse/Expand — Button & Mobile Animation Fixes"
description: "Fix link-card desktop button behavior, mobile height animation, and iOS WebKit section flicker, with verified source/staging/minified assets ready for publish."
trigger_phrases:
  - "link card collapse expand"
  - "sector menu card button"
  - "link card mobile animation glitch"
  - "data-link-card button centering"
  - "link_card_collapse_expand"
  - "iOS Chrome section flicker"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/002-link-card-button-and-mobile-animation"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Revision 5 mobile visual-layer transition suppression implemented and verified by local checks plus live injection; publish/re-test remains."
    next_safe_action: "Publish updated link-card CSS/JS assets plus any unpublished global CSS, then re-verify on the published Webflow URL."
    blockers: []
    key_files:
      - "a_nobel_en_zn/2_javascript/link_card_collapse_expand.js"
      - "a_nobel_en_zn/2_javascript/z_minified/link_card_collapse_expand.min.js"
      - "a_nobel_en_zn/1_css/link/link_card_collapse_expand.css"
      - "a_nobel_en_zn/1_css/global/performance.css"
      - "a_nobel_en_zn/3_staging/link_card_collapse_expand.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-anobel.com/002-link-card-button-and-mobile-animation"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Desktop button behavior on expand: seamless slide to top-right; the prior dissolve was reverted after feedback."
      - "Scope: fix the 3 bugs AND fold in the approved cleanups."
      - "Image scale reconciliation default: align CSS to scale(1) (live-effective value)."
      - "Revision 3 scope: guard overflow-visible sections from content-visibility:auto on iOS WebKit."
      - "Revision 4 scope: defer WAAPI cancel and height cleanup across animation frames to avoid mobile end-frame flicker."
      - "Revision 5 scope: suppress CSS transitions on Motion-owned mobile child layers while the card is animating."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Link Card Collapse/Expand — Button & Mobile Animation Fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implementation verified (pending user publish + post-deploy re-test) |
| **Created** | 2026-05-30 |
| **Branch** | `scaffold/002-link-card-button-and-mobile-animation` |
| **Diagnosis** | Live, via Chrome DevTools CLI (`bdg`) against `a-nobel-en-zn.webflow.io/nl/drafts` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sector-menu link card (`[data-link-card]`) had three original defects, then one follow-up iOS
paint defect was confirmed from a mobile recording:

1. **Desktop — collapsed `+` button off-center.** With JS active the collapsed button is ~2px left
   of card center; in CSS-only mode it is perfectly centered.
2. **Desktop — button travels on expand.** The action button visibly slides across the card as it
   expands; the user wants no positional travel — a clean swap to the expanded (arrow) state.
3. **Mobile — no transition, just a glitch/snap.** Tapping a collapsed card does not animate height;
   the card stays collapsed ~1.1s then snaps open.
4. **iOS Chrome/WebKit — whole-section white flicker.** The sector-card section can briefly expose
   the white page background while scrolling because an overflow-visible section still used
   `content-visibility:auto`.

### Purpose
Make the collapsed `+` perfectly centered, preserve the final seamless desktop button slide, restore
smooth mobile height animation, and prevent iOS paint skipping on overflow-visible sections.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:root-cause -->
## 3. ROOT CAUSE (live evidence)

| Bug | Evidence (bdg) | Cause |
|-----|----------------|-------|
| 1 | collapsed card 90px, button 60px, `inset: 22.5px 17px 367.5px 13px`, center offset −2px | JS `apply_collapsed_button` hardcodes `calc(50% - 28px)` (assumes a 56px button; real button is 60px) |
| 2 | expanded button rides right edge; card right edge sweeps ~770px over 1000ms | Button is right-anchored to a growing box — intrinsic ride |
| 3 | height frozen at 82px for ~1.1s, then snaps to 331px at t≈1280ms | `set_mobile_fixed_height` writes `height/max-height` with `!important`; `!important` author rules outrank the Web-Animations layer, so `wrapper.animate()` keyframes never paint |
<!-- /ANCHOR:root-cause -->

---

<!-- ANCHOR:scope -->
## 4. SCOPE

### In Scope
- Center the desktop collapsed button robustly (width-independent).
- Desktop expand/collapse: seamless slide from centered collapsed `+` to the top-right expanded state
  with no fade gap.
- Restore a smooth mobile height animation (expand and collapse).
- Prevent `content-visibility:auto` from applying to overflow-visible sections.
- Cleanups: remove obsolete dissolve bookkeeping; remove write-only `text_wrappers` + unused
  `text_wrapper` SELECTOR; remove dead CSS var `--link-card-mobile-expanded-size`; reconcile image
  transforms so desktop stays Webflow-owned and mobile remains explicit.

### Out of Scope
- Any other component / file. No broader refactor of the no-JS fallback CSS.
- The deploy step to the live Webflow staging site (user's publish action).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `a_nobel_en_zn/2_javascript/link_card_collapse_expand.js` | Modify | Centering, seamless desktop button slide, guarded mobile height cleanup, cleanups |
| `a_nobel_en_zn/2_javascript/z_minified/link_card_collapse_expand.min.js` | Generate | Publish bundle regenerated from the source JS |
| `a_nobel_en_zn/1_css/link/link_card_collapse_expand.css` | Modify | Button transition (drop inset/transform), dead var removal, scale reconcile |
| `a_nobel_en_zn/1_css/global/performance.css` | Modify | Disable `content-visibility:auto` for overflow-visible sections |
| `a_nobel_en_zn/3_staging/link_card_collapse_expand.js` | Mirror | Byte-identical copy of the JS source |
| `a_nobel_en_zn/3_staging/link_card_collapse_expand.css` | Mirror | Byte-identical copy of the CSS source |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Collapsed desktop button is centered | Live `btnCenterOffsetFromCardCenter` approx 0 (was -2); uses `right: calc(50% - 2rem)` for the 4rem button |
| REQ-002 | Desktop button slides seamlessly (Rev 1: reverted from dissolve) | Button slides top-center→top-right with `opacity` 1 throughout (no dissolve gap); collapsed button centered (`off ≈ 0`) |
| REQ-003 | Mobile height animates smoothly | Live height ramps 82→331 across ~1.1s with no frozen plateau + snap, both directions |
| REQ-008 | iOS overflow-visible sections do not skip paint | Overflow-visible sections with `data-render-content` compute to `content-visibility: visible`, `contain: layout style`, and `contain-intrinsic-size: none` |
| REQ-007 | Expanded description uses the Webflow default color (Rev 1) | Paragraph computes to the Webflow grayish (`rgb(207,207,207)`) on desktop and mobile; no white override on the paragraph |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Reduced-motion / no-Motion still correct | Instant paths apply final button position + `opacity:1`; no dissolve |
| REQ-005 | Cleanups applied without regressions | Obsolete dissolve guard removed; `text_wrappers`/unused SELECTOR removed; dead CSS var removed; image transform ownership consistent |
| REQ-006 | Staging and publish assets stay in sync | `3_staging` JS byte-identical to canonical source; minified bundle regenerated and verified |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- **SC-001**: Collapsed `+` visually centered on desktop (matches CSS-only mode).
- **SC-002**: Expanding/collapsing a desktop card shows the button slide seamlessly (no dissolve gap); collapsed button stays centered.
- **SC-006**: The expanded description (paragraph) uses Webflow's default grayish color on desktop and mobile.
- **SC-003**: Tapping a mobile card animates the height smoothly over ~1.1s.
- **SC-004**: No console errors; reduced-motion path unaffected.
- **SC-005**: Cleanups landed; staging mirror identical to source.
- **SC-007**: Overflow-visible sections do not compute to `content-visibility:auto` on mobile/iOS.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Mobile cleanup re-enables CSS transition too early | Low | Cleanup now holds `transition:none !important` through the height clear frame, then restores only after state/no-new-animation guards pass |
| Risk | Webflow Designer re-adds `data-render-content="large"` to overflow-visible sections | Low | CSS fail-safe overrides any overflow-visible section with `data-render-content` to `content-visibility: visible` |
| Dependency | Motion.dev present globally (Webflow) | Low | Existing graceful fallback to instant states preserved |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- None blocking. If the subtle mobile collapsed image zoom was intentional, switch the reconcile
  direction (make JS animate to `scale(1.04)` instead of aligning CSS to `scale(1)`).
<!-- /ANCHOR:questions -->
