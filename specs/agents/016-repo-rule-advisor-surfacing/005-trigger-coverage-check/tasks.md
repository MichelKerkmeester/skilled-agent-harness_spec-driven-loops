---
title: "Tasks: Trigger coverage check"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "trigger coverage check tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Trigger coverage check

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

- [x] T001 Read `check-repo-rules.cjs` `CHECKS`, `splitRouterSections` and check 9
- [x] T002 Measure token overlap between every Fires-when bullet and its router row, and set the threshold
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add check 10 and `--root` (`check-repo-rules.cjs`)
- [x] T004 Write covered and uncovered fixtures (`test_check_repo_rules.py`)
- [x] T005 Fix the router rows for each real gap (`REPO RULES.md`)
- [x] T006 Update the check lists (`SKILL.md`, `rule-anatomy.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run the checker on the corpus and the pytest suite
- [x] T008 List every router edit in `implementation-summary.md`
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
