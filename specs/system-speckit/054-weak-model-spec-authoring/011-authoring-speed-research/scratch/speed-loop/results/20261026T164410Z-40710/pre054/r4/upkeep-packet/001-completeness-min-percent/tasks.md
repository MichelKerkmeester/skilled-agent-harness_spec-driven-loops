---
title: "Tasks: Add a min-percent option to calculate-completeness.sh"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "completeness min percent tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Add a min-percent option to calculate-completeness.sh

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

- [ ] T001 Read the argument loop, the globals block, both output functions and the exit block, and record the line anchors the change touches (`calculate-completeness.sh`)
- [ ] T002 Capture baselines for plain text, `--json`, `--verbose` and `--help`, and build fixture folders under `mktemp -d` with known percentages just below, at and just above a chosen floor (`scratch/baselines/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add the `MIN_PERCENT` global and the `--min-percent` branch in the argument loop, consuming its value with `shift 2` (`calculate-completeness.sh`)
- [ ] T004 Validate the value before any calculation: present, integer, 0 to 100, failing with one `ERROR:` line on stderr and exit 1 (`calculate-completeness.sh`)
- [ ] T005 Reject `--min-percent` combined with `--file`, since that mode never computes an overall percentage (`calculate-completeness.sh`)
- [ ] T006 Add the exit gate after the report call, as a full `if` with an `else` branch, exiting 3 when the overall percentage is below the floor (`calculate-completeness.sh`)
- [ ] T007 Document the option and exit code 3 in `show_help`, the header usage comment and the exit-code comment block (`calculate-completeness.sh`)
- [ ] T011 Add `min_percent_met` to the `--json` report when `--min-percent` is set, true when Overall Completion is at or above the floor and false otherwise (`calculate-completeness.sh`, REQ-005)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run the exit matrix: below the floor gives 3, at the floor gives 0, above gives 0, no option gives 0, and each invalid value gives 1
- [ ] T009 Diff stdout with and without the option in text, `--json`, `--verbose` and `--quality` modes, and confirm stderr stays empty and the folder path works in either argument position
- [ ] T010 Record the exit matrix and the diff results in `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
