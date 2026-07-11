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
    last_updated_at: "2026-07-11T08:53:41Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded this phase task list from the 018 research manifest"
    next_safe_action: "Execute T001 (run the drift-guard vitest)"
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

- [ ] T001 Confirm phases 002–005 are complete and their edits are in place
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Gate 1 — run the parent-hub drift-guard vitest; confirm exit 0
- [ ] T003 Gate 2 — run the skill-benchmark router-replay; assert the report fail-closed (verdict PASS, gateFailed false, D5 100, all scenarios pass)
- [ ] T004 Gate 3 — run the stack-folder + alignment verifiers; confirm exit 0
- [ ] T005 Gate 4 — run `validate.sh --strict` across the parent and all children
- [ ] T006 Capture gate evidence into `implementation-summary.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Confirm all four gates are green
- [ ] T008 Roll up the 018 parent (status complete, last_active_child_id) — only after gates pass
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All four gates green with evidence
- [ ] No `[B]` blocked tasks remaining
- [ ] Parent rolled up; union equality preserved
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Spec**: spec.md
- **Plan**: plan.md
- **Manifest**: ../001-research/research/research.md (Deliverable 4)
<!-- /ANCHOR:cross-refs -->
