---
title: "Implementation Plan: Link Card Button & Mobile Animation Fixes"
description: "Surgical plan for the three link-card defects plus approved cleanups, with exact functions/selectors to touch and the cascade reasoning behind each fix."
trigger_phrases:
  - "link card collapse expand plan"
  - "link card mobile animation plan"
  - "data-link-card button plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/002-link-card-button-and-mobile-animation"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored plan from approved plan-mode file"
    next_safe_action: "Implement Bug 3 first (smallest, highest impact)"
    blockers: []
    key_files:
      - "a_nobel_en_zn/2_javascript/molecules/link_card_collapse_expand.js"
      - "a_nobel_en_zn/1_css/link/link_card_collapse_expand.css"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Link Card Button & Mobile Animation Fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Four edits across two canonical files (then mirrored to `3_staging`). Order: Bug 3 first (smallest,
highest impact), then desktop centering (Bug 1), then desktop dissolve (Bug 2), then cleanups.
Diagnosis and acceptance probes use the Chrome DevTools CLI (`bdg`). Full background lives in the
approved plan file `~/.claude/plans/plan-mode-first-floofy-pascal.md`.
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
- `apply_collapsed_button` desktop branch (JS ≈682–691): `inset: '1.5rem auto auto 50%'` +
  `transform: 'translateX(-50%)'` (replaces `calc(50% - 28px)` right-anchor). Width-independent.

### Change C — Desktop button dissolve, no travel (Bug 2)
- CSS button transition block (≈243–253): remove `inset` and `transform` from the `transition` list
  (keep background/border/color/box-shadow).
- `animate_card_state` (JS ≈875–905): replace the synchronous button apply with a dissolve —
  fade `opacity→0` (~120ms); in `onComplete` guarded by `is_current_run(card, run)`, apply the new
  button position/style + `set_svg_state(card, expand, false)` (instant icon swap); fade
  `opacity→1` (~200ms, optional small delay). Add `button_out`/`button_in` to `CONFIG.motion`.
- Instant/reduced-motion paths keep applying the button directly with `opacity:1`.

### Change D — Cleanups
- Keep + wire `is_current_run` (used by Change C guard) — supersedes "remove dead fn".
- Remove `text_wrappers: []` (≈184) and `card.text_wrappers.push(...)` (≈377); remove unused
  `text_wrapper` SELECTOR (≈31). Keep the text-node wrapping + `data-link-card-heading-text` set.
- Remove dead CSS var `--link-card-mobile-expanded-size` (CSS ≈339).
- Reconcile image scale: CSS mobile collapsed `scale(1.04)` (≈466) → `scale(1)` (matches the
  live-effective JS value at ≈762 and desktop collapsed).
<!-- /ANCHOR:changes -->

---

<!-- ANCHOR:context -->
## 3. TECHNICAL CONTEXT

- **CSS cascade order** (high→low): transitions > `!important` author > **animations (WAAPI)** >
  normal author. This is *why* the `!important` height pin defeated `wrapper.animate()` (Bug 3) and
  why removing `!important` lets WAAPI win while normal inline still holds the resting state.
- **Button ride** is geometric: the expanded button is right-anchored and the card's right edge is
  the moving edge during the grow. Dissolve hides the position change; minor late-stage ride is
  tuned out via fade timing.
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
