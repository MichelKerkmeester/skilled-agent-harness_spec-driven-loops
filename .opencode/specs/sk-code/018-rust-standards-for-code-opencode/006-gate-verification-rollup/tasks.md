---
title: "Tasks: Phase 6 — Gate Verification & Parent Rollup"
description: "Execution checklist for running the four gates and rolling up the 018 parent."
trigger_phrases:
  - "018 phase 006 tasks"
  - "gate verification rollup tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/006-gate-verification-rollup"
    last_updated_at: "2026-07-11T13:20:00Z"
    last_updated_by: "claude-code"
    recent_action: "All four gates green; 018 parent rolled up to complete"
    next_safe_action: "Packet 018 complete — no further action"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6 — Gate Verification & Parent Rollup

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Confirm phases 002–005 are complete and their edits are in place — 002/003/004 on origin; 005 completed this session (all six touchpoints, `validate.sh` Errors 0 at the sibling `DESCRIPTION_SHAPE` baseline)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Gate 1 — run the parent-hub drift-guard vitest; confirm exit 0 — `sk-code-router-sync.vitest.ts` 7/7 green (25/25 across all four drift-guard files)
- [x] T003 Gate 2 — run the skill-benchmark router-replay; assert the report fail-closed (verdict PASS, gateFailed false, D5 100, all scenarios pass) — regenerated Mode-A report: verdict PASS, gateFailed false, D5 100, 9/9 scenarios; OC-009 intentRecall 1 / resourceRecall 1
- [x] T004 Gate 3 — run the stack-folder + alignment verifiers; confirm exit 0 — `verify_stack_folders.py` exit 0 (6 langs incl. rust); `test_verify_alignment_drift` 15/15
- [x] T005 Gate 4 — run `validate.sh --strict` across the parent and all children — recursive validate Errors 0 (sole warning is the packet-wide `DESCRIPTION_SHAPE` baseline shared by every phase)
- [x] T006 Capture gate evidence into `implementation-summary.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Confirm all four gates are green — Gate 1 (7/7), Gate 2 (PASS 9/9 D5 100), Gate 3 (exit 0, 15/15), Gate 4 (Errors 0)
- [x] T008 Roll up the 018 parent (status complete, last_active_child_id) — parent `spec.md` Status → Complete, `graph-metadata.json` status → complete, `last_active_child_id` → 006-gate-verification-rollup
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All four gates green with evidence
- [x] No `[B]` blocked tasks remaining
- [x] Parent rolled up; union equality preserved
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Spec**: spec.md
- **Plan**: plan.md
- **Manifest**: ../001-research/research/research.md (Deliverable 4)
<!-- /ANCHOR:cross-refs -->
