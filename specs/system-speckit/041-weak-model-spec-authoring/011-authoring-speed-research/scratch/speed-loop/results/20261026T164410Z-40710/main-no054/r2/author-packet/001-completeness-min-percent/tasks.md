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

- [ ] T001 Read the argument loop, `show_help()` option block, output dispatch, final `exit 0` and trailing exit-code comment block in the target script, and confirm each anchor this plan names still exists (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T002 [P] Capture baseline report output in text and JSON modes for one fixture folder, to diff against after the change (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T003 [P] Confirm the Bash 3.2 constraint and that the percentage is already an integer before any comparison, so the gate needs no `bc` call (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add a `MIN_PERCENT=""` global to the globals block, beside `VERBOSE`, `JSON_OUTPUT`, `QUALITY_CHECK`, `SINGLE_FILE` and `SPEC_FOLDER` (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T005 Add the `--min-percent)` case to the argument loop, capturing the next argument and shifting by two (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T006 Validate the captured value as an integer in 0-100 and reject a missing value, a non-integer, a negative and a value above 100 with a stderr usage line and `exit 1` (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T007 Derive the gate percentage from the value the report prints: `OVERALL_PERCENTAGE` in folder mode, the sourced stats-file `percentage` with the output path's existing fallback in `--file` mode (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T008 Add the threshold comparison after the output dispatch and before the final exit, written as a full `if` block so `errexit` cannot turn the false branch into an early exit, and exit 3 only when the percentage is strictly below `MIN_PERCENT` (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T009 List `--min-percent <N>` in `show_help()` and on the header `# Options:` line, stating the exit-3 condition (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T010 Document exit code 3 in the trailing exit-code comment block, keeping the comment durable and free of packet or requirement identifiers (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Add vitest cases for below-threshold, at-threshold, invalid value and unchanged report output (`.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts`)
- [ ] T012 Add a vitest case for single-file mode, asserting the verdict follows that file's `completion_percentage` (`.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts`)
- [ ] T013 Run the vitest file and confirm the two existing cases plus the new ones all pass (`.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts`)
- [ ] T014 Diff text and JSON report output with and without `--min-percent` and confirm no difference, then confirm the unchanged exit codes 0 and 1 on the success and error paths (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T015 Confirm `--help` lists the option and still exits 0 (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
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
