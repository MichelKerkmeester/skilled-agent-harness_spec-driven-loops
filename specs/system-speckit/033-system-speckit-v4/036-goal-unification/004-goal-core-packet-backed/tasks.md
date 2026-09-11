---
title: "Tasks: Goal core packet-backed"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Goal core packet-backed

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

- [x] T001 Read ADR-1, ADR-2, ADR-3 and the sk-code-opencode checklist
- [x] T002 Baseline: node --test on the four goal suites, record counts
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the packet resolver per ADR-1 (lib/goal-core.cjs)
- [x] T004 Add stripDurableSlice and use it in renderGoalBrief and buildGoalPrompt (lib/goal-core.cjs)
- [x] T005 Add packet goal.md as the first read candidate; keep JSON as shim (lib/goal-core.cjs)
- [x] T006 Write path: setGoal appends to goal.md log and writes a resync marker under lock (lib/goal-core.cjs)
- [x] T007 Tests: packet resolution, strip, nested versus singular, migration shim (lib/goal-core.test.cjs)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 node --test all four goal suites
- [x] T009 verify_alignment_drift.py --root .opencode/hooks/goal
- [x] T010 Update goal.md log
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification tasks passed with recorded output
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



