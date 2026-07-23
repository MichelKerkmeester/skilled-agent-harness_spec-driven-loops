---
title: "Tasks: Code READMEs (System-Deep-Loop Batch)"
description: "Split the fifty-three folders into six batches, author them, refresh the two stale catalogs, then reconcile and validate."
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/021-documentation-quality-program/007-code-readmes-deep-loop"
    last_updated_at: "2026-07-22T15:15:43Z"
    last_updated_by: "claude"
    recent_action: "All fifty-three READMEs authored and the two catalogs refreshed."
    next_safe_action: "Proceed to phase 008 (closeout)."
    blockers: []
    key_files: []
---

# Tasks: Code READMEs (System-Deep-Loop Batch)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

- [x] T001 Split the fifty-three folders into six batches (`p7-lib-batch-aa/ab/ac`, other-runtime, deep-modes, shared) and confirm the two stale catalogs.
- [x] T002 Reuse the shared code-README brief and name `runtime/lib/council/README.md` as the domain batch model.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Author 12 `runtime/lib` domains, batch 1 (`authorized-ledger`, `event-envelope`, `cross-mode-closures`, and nine more).
- [x] T004 [P] Author 12 `runtime/lib` domains, batch 2 (`mixed-version-fixtures`, `hierarchical-budgets`, `locks-and-fencing`, and nine more).
- [x] T005 [P] Author 11 `runtime/lib` domains, batch 3 (`replay-fingerprint`, `sealed-reference-artifacts`, `transactional-projections`, and eight more).
- [x] T006 [P] Author 4 other-runtime folders (`runtime/hooks/claude`, `runtime/scripts/lib`, `runtime/tests/fixtures`, `runtime/tests/hierarchical-budgets`).
- [x] T007 [P] Author 8 deep-mode folders (`deep-alignment/scripts` and nested, three `manual-testing-playbook` stress-test folders, `deep-review/scripts/tests`).
- [x] T008 [P] Author 6 `shared` folders (`behavior-benchmark` and nested, `shared/progress`, `shared/rollout/tests`, `shared/synthesis`).

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Refresh `runtime/lib/README.md` to list all 37 domains and `runtime/tests/README.md` to list its 7 subfolders, each with a one-line purpose sourced from the domain README.
- [x] T010 Floor-validate all 53 new READMEs plus the 2 refreshed catalogs with `validate_document.py --type readme`.
- [x] T011 Cross-check every CONTENTS-table filename against the real folder listing (`c7-mismatch.txt`) and sweep for em dashes and semicolons.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All 53 READMEs and both refreshed catalogs report VALID
- [x] `checklist.md` verified with evidence

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
