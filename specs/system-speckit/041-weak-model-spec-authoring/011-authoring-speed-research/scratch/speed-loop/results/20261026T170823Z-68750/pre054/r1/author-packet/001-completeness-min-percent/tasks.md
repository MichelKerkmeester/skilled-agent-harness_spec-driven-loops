---
title: "Tasks: Add a min-percent option to calculate-completeness.sh"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "completeness min percent tasks"
  - "calculate completeness threshold tasks"
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

- [ ] T001 Read the argument parser, the two output functions and the trailing exit-code block, and record the exact line where the report finishes so the gate can be placed after it (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T002 Build a throwaway fixture packet in `scratch/` with a known placeholder ratio, and record the percentage the unmodified script reports for it (`specs/zz-bench-authoring/001-completeness-min-percent/scratch/fixture`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Declare the threshold global as empty in the globals block, so an unset value means "no gate" (`calculate-completeness.sh`)
- [ ] T004 Add the `--min-percent` case arm before the `*` fallback, with the argument-count guard and the integer 0-100 validation that exits `1` on a bad value (`calculate-completeness.sh`)
- [ ] T005 Add the post-output gate: compare the figure the active mode reports against the threshold and exit `3` below it, `0` at or above it (`calculate-completeness.sh`)
- [ ] T006 Document the option in `show_help` and extend the trailing exit-code comment block to cover `0`, `1` and `3` (`calculate-completeness.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Run the boundary matrix against the fixture: below, exactly at and above the threshold, asserting exit `3`, `0` and `0` respectively (`calculate-completeness.sh`)
- [ ] T008 Diff stdout and stderr from flagged against flagless runs for text, `--json`, `--verbose`, `--quality` and `--file`, and confirm every diff is empty (`calculate-completeness.sh`)
- [ ] T009 Run the malformed-value matrix (missing, non-integer, negative, above 100) and confirm exit `1` each time, plus `bash -n` on the script (`calculate-completeness.sh`)
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
