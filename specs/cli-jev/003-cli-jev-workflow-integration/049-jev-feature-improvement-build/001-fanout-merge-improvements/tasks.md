---
title: "Tasks: Build: improve the Jev fan-out merge (030)"
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
# Tasks: Build: improve the Jev fan-out merge (030)

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

- [x] T001 Read 048's research for this feature and the scorer's keep rule
- [x] T002 Capture the suite baseline before any change
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the constant-same and lexical-rule baselines to the report
- [x] T004 Add the two-call early stop and the symmetric tiebreak
- [x] T005 Write the label digest, rubric hash, scorer hash, per-pair oracle decision and dropouts into `report.json`
- [x] T006 Print the verdict at cuts 0.4, 0.45 and 0.5
- [x] T007 Record the amendment in the goal log, then re-measure with `--out`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the scorer's suite
- [x] T009 Replay the recorded 047 run and compare picks and call count
- [x] T010 Run `validate.sh --strict` on this phase
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



