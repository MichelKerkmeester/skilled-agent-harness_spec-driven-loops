---
title: "Tasks: Phase 11: deep-research-swe-2"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "swe-2 research tasks"
  - "deep research task breakdown"
  - "research verification checklist"
  - "lineage iteration count"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Phase 11: deep-research-swe-2

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Confirm `swe-2-max` reaches the fan-out allowlist and dispatches live
- [x] T002 Author this phase's spec, plan and tasks and generate its metadata pair
- [x] T003 Compose the target string around what the decommission teaches, not what it got wrong
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Dispatch one `cli-devin` lineage at `swe-2-max`, five iterations, convergence disabled
- [x] T005 Leave every packet document untouched while the loop is live, so containment has nothing to revert
- [x] T006 Synthesize `research.md` from the iteration records
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Count the iteration records and confirm five, rather than reading the exit status
- [x] T008 Check the orchestration summary for a stalled or orphaned lineage
- [x] T009 Confirm the scoped diff touches nothing outside this phase folder
- [x] T010 Run `validate.sh --strict` on this phase and require `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
