---
title: "Tasks: Link Card Button & Mobile Animation Fixes"
description: "Task list for the three link-card defect fixes plus approved cleanups, with live bdg verification."
trigger_phrases:
  - "link card collapse expand tasks"
  - "link card mobile animation tasks"
  - "data-link-card button tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/002-link-card-button-and-mobile-animation"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored task list"
    next_safe_action: "Execute T101 (Bug 3 !important removal)"
    blockers: []
    key_files:
      - "a_nobel_en_zn/2_javascript/molecules/link_card_collapse_expand.js"
      - "a_nobel_en_zn/1_css/link/link_card_collapse_expand.css"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Link Card Button & Mobile Animation Fixes

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Create Level 2 spec packet (`.opencode/specs/anobel.com/002-link-card-button-and-mobile-animation`).
- [x] T002 Live diagnosis via bdg (geometry, button screen-X, mobile height timeline).
- [x] T003 [P] Pre-flight greps (no `!important` height; `[data-link-card-heading-text]` unqueried).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation (canonical source)

- [x] T101 Bug 3 — remove `'important'` from `set_mobile_fixed_height` (`2_javascript/molecules/link_card_collapse_expand.js`).
- [x] T102 Bug 1 — center collapsed button via `left:50% + translateX(-50%)` in `apply_collapsed_button` desktop branch (`…js`).
- [x] T103 Bug 2 — drop `inset`/`transform` from button `transition` (`1_css/link/link_card_collapse_expand.css`).
- [x] T104 Bug 2 — add `button_out`/`button_in` to `CONFIG.motion`; dissolve in `animate_card_state` guarded by `is_current_run` (`…js`).
- [x] T105 [P] Cleanup — remove `text_wrappers` array (184, 377) + unused `text_wrapper` SELECTOR (31) (`…js`).
- [x] T106 [P] Cleanup — remove dead CSS var `--link-card-mobile-expanded-size` (`…css`).
- [x] T107 [P] Cleanup — reconcile mobile collapsed image `scale(1.04)`→`scale(1)` (`…css`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Sync + Verification

- [x] T201 Mirror canonical JS+CSS to `3_staging/*` (byte-identical).
- [x] T202 bdg desktop probe — collapsed button center offset ≈ 0 (REQ-001).
- [x] T203 bdg desktop probe — real-mouse expand; button screen-X stable while `opacity>0.1`; tune timing (REQ-002).
- [x] T204 bdg mobile probe — height ramps 82→331 over ~1.1s, no plateau/snap, both directions (REQ-003).
- [x] T205 Confirm no console errors; reduced-motion path unaffected (REQ-004).
- [x] T206 Update `implementation-summary.md` + `checklist.md` with evidence; refresh continuity.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Minification (sk-code WEBFLOW — follow-up request)

- [x] T301 Minify link_card JS via terser `--compress --mangle` → `z_minified/molecules/link_card_collapse_expand.min.js` (57,967B → 18,911B, 67.4%); single-file workflow (scoped).
- [x] T302 AST verify (`verify-minification.mjs`): link_card PASS (selectors/events/Webflow.push/Motion.animate preserved); suite 59/59.
- [x] T303 Runtime test (`test-minified-runtime.mjs`): link_card PASS (executes, init flag set); suite 109/109.
- [x] T304 Browser-verify minified (injected into live page): mobile ramp + desktop centering identical to source.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] REQ-001..003 verified live via bdg with recorded evidence.
- [x] No `[B]` blocked tasks remaining.
- [x] `3_staging/*` byte-identical to canonical source.
- [x] Evidence recorded in `implementation-summary.md`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **QA**: See `checklist.md`.
<!-- /ANCHOR:cross-refs -->
