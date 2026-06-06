---
title: "Tasks: Link Card Button & Mobile Animation Fixes"
description: "Task list for the link-card fixes, follow-up revisions, iOS WebKit flicker guard, and publish handoff."
trigger_phrases:
  - "link card collapse expand tasks"
  - "link card mobile animation tasks"
  - "data-link-card button tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/002-link-card-button-and-mobile-animation"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Revision 5 added scoped mobile visual-layer transition suppression and verified the injected animation/cleanup window."
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

- [x] T101 Bug 3 — remove `'important'` from animated mobile height writes (`2_javascript/link_card_collapse_expand.js`).
- [x] T102 Bug 1 — center collapsed desktop button with `right: calc(50% - 2rem)` for the 4rem button (`...js`).
- [x] T103 Rev 1 — restore `inset`/`transform` button transitions for seamless desktop slide (`1_css/link/link_card_collapse_expand.css`).
- [x] T104 Rev 1 — remove the superseded dissolve path and keep desktop button opacity visible throughout the slide (`...js`).
- [x] T105 [P] Cleanup — remove `text_wrappers` array (184, 377) + unused `text_wrapper` SELECTOR (31) (`…js`).
- [x] T106 [P] Cleanup — remove dead CSS var `--link-card-mobile-expanded-size` (`…css`).
- [x] T107 [P] Cleanup — reconcile mobile collapsed image `scale(1.04)` to `scale(1)` (`...css`).
- [x] T108 [P] Rev 1 — remove the mobile expanded paragraph from the white color override so it uses the Webflow default gray (`...css`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Sync + Verification

- [x] T201 Mirror canonical JS+CSS to `3_staging/*` (byte-identical).
- [x] T202 bdg desktop probe — collapsed button center offset ≈ 0 (REQ-001).
- [x] T203 bdg desktop probe — real-mouse expand; button slides top-center to top-right with `opacity=1` and no dissolve gap (REQ-002).
- [x] T204 bdg mobile probe — height ramps 82→331 over ~1.1s, no plateau/snap, both directions (REQ-003).
- [x] T205 Confirm no console errors; reduced-motion path unaffected (REQ-004).
- [x] T206 Update `implementation-summary.md` + `checklist.md` with evidence; refresh continuity.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Minification (sk-code WEBFLOW — follow-up request)

- [x] T301 Minify link_card JS via terser `--compress --mangle` to `z_minified/link_card_collapse_expand.min.js`; single-file workflow (scoped).
- [x] T302 AST verify (`verify-minification.mjs`): suite 58/58 PASS.
- [x] T303 Runtime test (`test-minified-runtime.mjs`): suite 58/58 PASS.
- [x] T304 Browser-verify minified (injected into live page): mobile ramp + desktop centering identical to source.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Revision 3 - iOS Flicker + Cleanup Handoff

- [x] T401 Analyze iOS Chrome recording and isolate the white-section flicker to overflow-visible section paint skipping.
- [x] T402 Add `performance.css` fail-safe: overflow-visible sections with `data-render-content` compute to `content-visibility: visible`.
- [x] T403 Harden mobile height cleanup so CSS transitions stay disabled until after the fixed height is cleared.
- [x] T404 Update Webflow performance guidance for the `content-visibility` + overflow-visible rule.
- [x] T405 Reconcile source/staging CSS with the Rev 1/Rev 2 evidence: remove dead mobile expanded var, set mobile collapsed image scale to `scale(1)`, and remove paragraph from the white expanded color rule.
- [x] T406 Re-run source/staging/minified JS checks, minification verification, guide validation, strict spec validation, and scoped diff checks.
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: Revision 4 - Mobile End-Frame Flicker

- [x] T501 Defer WAAPI height `cancel()` until after the final pixel height has painted.
- [x] T502 Clear expanded inline height one frame after cancel while keeping `transition:none !important` active.
- [x] T503 Keep cleanup stale-safe when state changes or a newer mobile height animation starts.
- [x] T504 Re-minify link-card JS and verify source/staging/minified syntax, source/staging mirrors, AST preservation, runtime execution, and scoped diff checks.
- [x] T505 Live `bdg` injection probe on `/nl/drafts` under 390px mobile viewport: expanded height stayed stable through cleanup and transition restore.
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:phase-7 -->
## Phase 7: Revision 5 - Mobile Visual-Layer Flicker

- [x] T601 Analyze the new MP4 and identify localized visual-layer churn instead of a full white-section flash.
- [x] T602 Ask a fresh read-only sub-agent to critique the plan; it agreed and recommended setting the animating state before mobile prepass state flips.
- [x] T603 Add `data-link-card-mobile-animating` before mobile prepass and clear it after guarded cleanup plus stale/reduced/breakpoint exits.
- [x] T604 Add scoped CSS transition suppression for Motion-owned mobile child layers only.
- [x] T605 Re-minify link-card JS and verify syntax, mirrors, minification, runtime, diff check, comment hygiene, and Public hardlink mirrors.
- [x] T606 Live `bdg` injection probe on `/nl/drafts` under 390px mobile viewport: child-layer transitions stayed `none / 0s` while animating and restored after cleanup with stable height.
<!-- /ANCHOR:phase-7 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] REQ-001..003 verified live via bdg with recorded evidence.
- [x] No `[B]` blocked tasks remaining.
- [x] `3_staging/*` byte-identical to canonical source for touched link-card JS/CSS.
- [x] Evidence recorded in `implementation-summary.md`.
- [ ] Published Webflow URL re-verified after user publishes updated CSS/JS assets.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **QA**: See `checklist.md`.
<!-- /ANCHOR:cross-refs -->
