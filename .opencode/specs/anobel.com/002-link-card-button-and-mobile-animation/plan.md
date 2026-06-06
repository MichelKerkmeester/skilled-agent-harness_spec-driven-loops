---
title: "Implementation Plan: Link Card Button & Mobile Animation Fixes"
description: "Surgical plan and revision notes for link-card animation fixes, iOS WebKit flicker guard, and publish handoff."
trigger_phrases:
  - "link card collapse expand plan"
  - "link card mobile animation plan"
  - "data-link-card button plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/002-link-card-button-and-mobile-animation"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Plan reconciled with Revision 1-5 outcomes; mobile visual-layer CSS transitions are suppressed while Motion owns the animation."
    next_safe_action: "Publish updated link-card CSS/JS assets plus any unpublished global CSS, then re-verify on the published Webflow URL."
    blockers: []
    key_files:
      - "a_nobel_en_zn/2_javascript/link_card_collapse_expand.js"
      - "a_nobel_en_zn/2_javascript/z_minified/link_card_collapse_expand.min.js"
      - "a_nobel_en_zn/1_css/link/link_card_collapse_expand.css"
      - "a_nobel_en_zn/1_css/global/performance.css"
      - "a_nobel_en_zn/3_staging/link_card_collapse_expand.js"
      - "a_nobel_en_zn/3_staging/link_card_collapse_expand.css"
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Link Card Button & Mobile Animation Fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The original plan fixed three link-card defects, then follow-up revisions changed the final desktop
button behavior and added an iOS WebKit flicker guard. Current source of truth: seamless desktop
button slide (not dissolve), guarded mobile height cleanup, overflow-visible content-visibility
fail-safe, and publish-ready source/staging/minified assets. Diagnosis and acceptance probes use the
Chrome DevTools CLI (`bdg`). Full original background lives in the approved plan file
`~/.claude/plans/plan-mode-first-floofy-pascal.md`.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:changes -->
## 2. CHANGES

### Change A — Mobile height animation (Bug 3)
- `set_mobile_fixed_height` (JS ≈1017–1023): drop the `'important'` priority on `height`,
  `maxHeight`, `minHeight`. WAAPI keyframes then paint (animation layer beats *normal* inline; was
  blocked by `!important`). CSS `transition:none` is already held during the WAAPI run, so no
  double-fire. Leave `set_mobile_collapsed_height` (resting state) as-is.

### Change B — Desktop collapsed-button centering (Bug 1)
- `apply_collapsed_button` desktop branch (JS ≈682–691): `inset: '1.5rem calc(50% - 2rem) auto auto'`
  with `transform: 'none'`. The button is 4rem wide, so `2rem` is the width-independent center offset
  and still interpolates cleanly to the expanded right anchor.

### Change C — Desktop button final behavior (Rev 1 superseded dissolve)
- CSS button transition block (≈243–253): keep `inset` and `transform` transitions so the button can
  slide smoothly between the centered collapsed anchor and top-right expanded anchor.
- `animate_card_state` (JS ≈875–905): apply the button state directly; no dissolve timing and no
  `button_out`/`button_in` path. The button remains visible (`opacity:1`) throughout the desktop
  slide.
- Instant/reduced-motion paths keep applying the same final button state directly.

### Change D — Cleanups
- Remove obsolete dissolve-run bookkeeping after Rev 1 reverted the dissolve behavior.
- Remove `text_wrappers: []` (≈184) and `card.text_wrappers.push(...)` (≈377); remove unused
  `text_wrapper` SELECTOR (≈31). Keep the text-node wrapping + `data-link-card-heading-text` set.
- Remove dead CSS var `--link-card-mobile-expanded-size` (CSS ≈339).
- Reconcile image scale: CSS mobile collapsed `scale(1.04)` (≈466) to `scale(1)` (matches the
  live-effective JS value at ≈762 and desktop collapsed).
- Remove the mobile expanded paragraph from the white color override so it uses Webflow's default
  gray paragraph color.

### Change E — iOS WebKit flicker guard (Rev 3)
- `1_css/global/performance.css`: add a fail-safe for `.u--overflow-visible[data-render-content]` so
  these sections compute to `content-visibility: visible`, `contain: layout style`, and
  `contain-intrinsic-size: none`.
- `2_javascript/link_card_collapse_expand.js`: keep `transition:none !important` active through the
  mobile height cleanup frame, clear fixed height/max-height while transitions are disabled, then
  restore CSS transitions only after state/no-new-animation guards pass.
- Regenerate `2_javascript/z_minified/link_card_collapse_expand.min.js` after the JS cleanup change.

### Change F — Mobile end-frame cleanup hardening (Rev 4)
- `finish_mobile_height_animation()` keeps the final pixel height and disables CSS transitions before
  cleanup.
- WAAPI height animation cancellation is delayed by one animation frame so WebKit can paint the final
  pixel height first.
- Expanded inline height is cleared in the following animation frame; CSS transitions restore only
  after the cleared-height state is stable and no newer mobile height animation exists.

### Change G — Mobile visual-layer transition suppression (Rev 5)
- Add `data-link-card-mobile-animating` before mobile measurement/prepass state flips.
- While active, CSS disables transitions only on child layers also animated by Motion/JS: caption,
  paragraph, heading-span, heading children, generated label, image, image-overlay, and SVG icons.
- Clear the attribute after guarded cleanup, and on stale/reduced-motion/breakpoint cleanup exits.
<!-- /ANCHOR:changes -->

---

<!-- ANCHOR:context -->
## 3. TECHNICAL CONTEXT

- **CSS cascade order** (high→low): transitions > `!important` author > **animations (WAAPI)** >
  normal author. This is *why* the `!important` height pin defeated `wrapper.animate()` (Bug 3) and
  why removing `!important` lets WAAPI win while normal inline still holds the resting state.
- **Desktop button motion** is geometric: both states are right-anchored, with collapsed using
  `right: calc(50% - 2rem)` and expanded using `right: 1.5rem`, so CSS can interpolate length values
  cleanly.
- **iOS flicker** comes from `content-visibility:auto` paint skipping on an overflow-visible animated
  section. The fail-safe preserves layout/style containment but disables skipped painting.
- Verification mirrors the diagnosis probes (geometry, screen-X timeline, height timeline).
<!-- /ANCHOR:context -->

---

<!-- ANCHOR:cross-refs -->
## 4. CROSS-REFERENCES

- **Specification**: `spec.md`
- **Tasks**: `tasks.md`
- **QA**: `checklist.md`
- **Approved plan**: `~/.claude/plans/plan-mode-first-floofy-pascal.md`
<!-- /ANCHOR:cross-refs -->
