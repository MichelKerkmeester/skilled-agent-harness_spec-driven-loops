---
title: "Tasks: Phase 1 — sk-code-review Checklist Rows"
description: "Task breakdown for the three additive sk-code-review checklist rows."
trigger_phrases:
  - "phase 1 tasks sk-code-review rows"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/015-sk-code-ponytail-based-refinement/001-skreview-checklist-rows"
    last_updated_at: 2026-06-13T11:40:00Z
    last_updated_by: claude-opus
    recent_action: "Phase 1 planned from 146 research recs #2/#6/#7"
    next_safe_action: "/speckit:implement — start with T-001"
---
# Tasks: Phase 1 — sk-code-review Checklist Rows

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete · `[ ]` pending. Each task is a small markdown edit + a check.

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Read live `code_quality_checklist.md` §6/§7 + `removal_plan.md` §2; note row style + exact section headings.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-002 Add §6 row: hand-rolled standard-library behavior where the language/runtime already ships a clear primitive (prefer the standard API when behavior AND edge cases match).
- [x] T-003 Add §6 row: custom code / dependency duplicating a native platform/runtime feature without a current requirement the native feature cannot satisfy.
- [x] T-004 Add §7 KISS needed-ness prompt: "Was this code asked for? If the requirement were dropped, would anything break? If not → removal candidate" → recommend removal (cross-ref `removal_plan.md`), P2 default / P1 if it adds attack-surface, contract, or regression risk.
- [x] T-005 Add `Replacement` column to `removal_plan.md` §2 table (nothing / stdlib API / native feature / shorter equivalent).

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-006 Dry-run a review on a snippet that reinvents a stdlib call AND adds unrequested code; confirm all three rows fire and the removal recommendation names a replacement.
- [x] T-007 Confirm no severity/output-contract drift (the `Review status:` final-line contract + P0/P1/P2 model unchanged).
- [x] T-008 Run `validate.sh <this-phase> --strict` → exit 0.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All three rows present and correctly worded; over-engineering defaults P2.
- [x] No duplication of the CLAUDE.md anti-pattern table or existing KISS/DRY rows.
- [x] Dry-run review confirms the rows are actionable.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` · Plan: `plan.md` · Checklist: `checklist.md`
- Research: `../research/research.md` (recs #2, #6, #7)

<!-- /ANCHOR:cross-refs -->
