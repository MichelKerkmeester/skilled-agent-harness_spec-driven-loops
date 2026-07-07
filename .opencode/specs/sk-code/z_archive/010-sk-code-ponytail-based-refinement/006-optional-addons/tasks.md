---
title: "Tasks: Phase 6 — Optional Add-ons"
description: "Task breakdown for the optional add-ons (2 shipped, 2 deferred)."
trigger_phrases:
  - "phase 6 tasks optional addons"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: .opencode/specs/sk-code/z_archive/010-sk-code-ponytail-based-refinement/006-optional-addons
    last_updated_at: 2026-06-13T17:40:00Z
    last_updated_by: claude-opus
    recent_action: "Phase 6: anti-stall + depth alias shipped; benchmark + hooks deferred"
    next_safe_action: "Operator: request benchmark metric or hooks if wanted"
---
# Tasks: Phase 6 — Optional Add-ons

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` done · `[ ]` pending · `[-]` deferred (operator-optional).

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Recon insertion points: sk-code §4 ALWAYS; sk-code-review §9 (after M-2); the existing SK_CODE_REVIEW_MIN_CHANGED_LINES env idiom + ON_DEMAND tier.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-002 Add the implementer anti-stall rule (sk-code/SKILL.md §4 ALWAYS bullet 9).
- [x] T-003 Add the `SK_CODE_REVIEW_DEPTH` depth alias (sk-code-review/SKILL.md §9.3) — names existing tiers, floors immutable.
- [-] T-004 DEFERRED (operator-optional): benchmark LOC/over-engineering metric in deep-improvement Lane B sweep (#9) — eval-only, ADOPT-LATER, needs a sweep run to fully verify.
- [-] T-005 DEFERRED (operator-optional): startup/typing hooks (#11) — research's lowest priority, highest 3-runtime upkeep, runtime blast radius.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-006 `verify_alignment_drift.py` (sk-code + sk-code-review) → exit 0.
- [x] T-007 Diff: pure insertions, correct placement, no severity/contract drift; scope = the 2 files.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] The 2 worthwhile add-ons shipped + verified; floors/contracts preserved.
- [x] The 2 deferred add-ons documented with rationale + marked operator-optional.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` · Plan: `plan.md` · Summary: `implementation-summary.md`
- Research: `../research/research.md` (recs #9, #11; ADOPT-LATER bucket)

<!-- /ANCHOR:cross-refs -->
