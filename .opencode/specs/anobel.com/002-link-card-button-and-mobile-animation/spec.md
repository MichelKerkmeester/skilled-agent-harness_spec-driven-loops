---
title: "Feature Specification: Link Card Collapse/Expand — Button & Mobile Animation Fixes"
description: "Fix three reported defects in the sector-menu link card (desktop collapsed-button centering, desktop button travel on expand, broken mobile height animation) plus approved code/CSS cleanups. Root-caused live with the Chrome DevTools CLI (bdg)."
trigger_phrases:
  - "link card collapse expand"
  - "sector menu card button"
  - "link card mobile animation glitch"
  - "data-link-card button centering"
  - "link_card_collapse_expand"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/002-link-card-button-and-mobile-animation"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Implemented + live-verified all 3 fixes and cleanups; staging mirror synced"
    next_safe_action: "User publishes 3_staging/* to Webflow staging, then re-verify on the published URL"
    blockers: []
    key_files:
      - "a_nobel_en_zn/2_javascript/molecules/link_card_collapse_expand.js"
      - "a_nobel_en_zn/1_css/link/link_card_collapse_expand.css"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-anobel.com/002-link-card-button-and-mobile-animation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Desktop button behavior on expand: dissolve to top-right (no visible travel)."
      - "Scope: fix the 3 bugs AND fold in the approved cleanups."
      - "Image scale reconciliation default: align CSS to scale(1) (live-effective value)."
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
| **Status** | Complete (pending user publish to Webflow) |
| **Created** | 2026-05-30 |
| **Branch** | `scaffold/002-link-card-button-and-mobile-animation` |
| **Diagnosis** | Live, via Chrome DevTools CLI (`bdg`) against `a-nobel-en-zn.webflow.io/nl/drafts` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sector-menu link card (`[data-link-card]`) has three defects:

1. **Desktop — collapsed `+` button off-center.** With JS active the collapsed button is ~2px left
   of card center; in CSS-only mode it is perfectly centered.
2. **Desktop — button travels on expand.** The action button visibly slides across the card as it
   expands; the user wants no positional travel — a clean swap to the expanded (arrow) state.
3. **Mobile — no transition, just a glitch/snap.** Tapping a collapsed card does not animate height;
   the card stays collapsed ~1.1s then snaps open.

### Purpose
Make the collapsed `+` perfectly centered, replace the desktop button travel with a dissolve to the
top-right arrow, and restore a smooth mobile height animation — then apply the approved cleanups.
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
- Desktop expand/collapse: dissolve the button between collapsed (centered `+`) and expanded
  (top-right arrow) — no visible horizontal travel.
- Restore a smooth mobile height animation (expand and collapse).
- Cleanups: keep+use `is_current_run`; remove write-only `text_wrappers` + unused `text_wrapper`
  SELECTOR; remove dead CSS var `--link-card-mobile-expanded-size`; reconcile image
  `scale(1.04)`↔`scale(1)` (align CSS to `scale(1)`).

### Out of Scope
- Any other component / file. No broader refactor of the no-JS fallback CSS.
- The deploy step to the live Webflow staging site (user's publish action).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `a_nobel_en_zn/2_javascript/molecules/link_card_collapse_expand.js` | Modify | Centering, button dissolve, mobile height `!important` removal, cleanups |
| `a_nobel_en_zn/1_css/link/link_card_collapse_expand.css` | Modify | Button transition (drop inset/transform), dead var removal, scale reconcile |
| `a_nobel_en_zn/3_staging/link_card_collapse_expand.js` | Mirror | Byte-identical copy of the JS source |
| `a_nobel_en_zn/3_staging/link_card_collapse_expand.css` | Mirror | Byte-identical copy of the CSS source |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Collapsed desktop button is centered | Live `btnCenterOffsetFromCardCenter` ≈ 0 (was −2); uses `left:50% + translateX(-50%)` |
| REQ-002 | Desktop button slides seamlessly (Rev 1: reverted from dissolve) | Button slides top-center→top-right with `opacity` 1 throughout (no dissolve gap); collapsed button centered (`off ≈ 0`) |
| REQ-003 | Mobile height animates smoothly | Live height ramps 82→331 across ~1.1s with no frozen plateau + snap, both directions |
| REQ-007 | Expanded description uses the Webflow default color (Rev 1) | Paragraph computes to the Webflow grayish (`rgb(207,207,207)`) on desktop and mobile; no white override on the paragraph |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Reduced-motion / no-Motion still correct | Instant paths apply final button position + `opacity:1`; no dissolve |
| REQ-005 | Cleanups applied without regressions | `is_current_run` used as fade guard; `text_wrappers`/unused SELECTOR removed; dead CSS var removed; image scale consistent |
| REQ-006 | Staging mirror stays in sync | `3_staging/*` byte-identical to canonical source after edits |
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
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Residual button ride during dissolve fade-in (card still growing) | Medium | Front-loaded card ease; tune `button_out/in` timing empirically via bdg screen-X probe |
| Risk | Removing `!important` lets other CSS override mobile height | Low | Verified no `!important` height in component CSS; re-verify live computed height during animation |
| Risk | Rapid desktop hovering interrupts the button fade | Low | Guard fade `onComplete` with `is_current_run`; `stop_card_animations` already cancels in-flight runs |
| Dependency | Motion.dev present globally (Webflow) | Low | Existing graceful fallback to instant states preserved |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- None blocking. If the subtle mobile collapsed image zoom was intentional, switch the reconcile
  direction (make JS animate to `scale(1.04)` instead of aligning CSS to `scale(1)`).
<!-- /ANCHOR:questions -->
