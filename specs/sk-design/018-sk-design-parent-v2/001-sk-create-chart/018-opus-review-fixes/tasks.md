---
title: "Tasks: fixes from the fresh Opus review of the chart packets"
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
# Tasks: fixes from the fresh Opus review of the chart packets

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

- [x] T001 Reproduce the five P1s from the review. Evidence: the review record in `implementation-summary.md`
- [x] T002 Checker: hex-only roles, distinguishability gate, exports removed. Evidence: `scratch/mutations.txt`
- [x] T003 [P] Mapper: distinguishability on admit, relative provenance, stack-aware fonts; reference updated. Evidence: `node --test` 6/6; `path=.opencode/...` in themed output
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Category-headed tooltip cards on grouped bars, stacked bars and the stripe delivery. Evidence: static gate PASSED
- [x] T005 016 evidence corrected: citations, test count, captures regenerated, generated scratch removed. Evidence: `validate.sh` AC coverage 9/9
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Corpus static and render gates and the default-themed set under `--extra --render` PASSED
- [x] T009 The three mutations fail with the recorded lines
- [x] T010 Packet docs filled; `validate.sh --strict` RESULT: PASSED
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



