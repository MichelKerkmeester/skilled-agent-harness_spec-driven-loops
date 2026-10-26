---
title: "Tasks: Add a min-percent option to calculate-completeness.sh"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "completeness min percent tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`C` is `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`. `F` is the 77% fixture folder `/tmp/minpct-demo`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Build the 77% fixture (`/tmp/minpct-demo/spec.md`). Verify: `bash $C /tmp/minpct-demo | rg 'Overall Completion'` prints `Overall Completion: 77%`.
- [ ] T002 Record today's exit status on that fixture (`$C`). Verify: `bash $C /tmp/minpct-demo; echo "EXIT=$?"` prints `EXIT=0`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add the `MIN_PERCENT` global beside the other option flags (`$C`). Verify: `rg -n '^MIN_PERCENT=' $C` prints one line.
- [ ] T004 Add the `--min-percent` case to the argument loop, consuming the next argument and rejecting a missing or non-integer value with exit 1 (`$C`). Verify: `bash $C --min-percent abc /tmp/minpct-demo; echo "EXIT=$?"` prints `EXIT=1`.
- [ ] T005 Reject `--min-percent` together with `--file`, since no Overall Completion exists to compare (`$C`). Verify: `bash $C --min-percent 90 --file /tmp/minpct-demo/spec.md; echo "EXIT=$?"` prints `EXIT=1`.
- [ ] T006 Replace the final `exit 0` with the gate: exit 3 when `MIN_PERCENT` is set and `OVERALL_PERCENTAGE` is below it, exit 0 otherwise, after the report has printed (`$C`). Verify: `bash $C --min-percent 90 /tmp/minpct-demo; echo "EXIT=$?"` prints `Overall Completion: 77%` then `EXIT=3`.
- [ ] T007 Document `--min-percent <N>` and its exit 3 in `show_help`, and extend the trailing exit-code comment (`$C`). Verify: `bash $C --help | rg -c -- '--min-percent'` prints 2.
- [ ] T014 Add the `min_percent_met` boolean to the `--json` report when `MIN_PERCENT` is set, true at or above the threshold and false below it (REQ-007) (`$C`). Verify: `bash $C --json --min-percent 90 /tmp/minpct-demo | rg -c '"min_percent_met": false'` prints 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Confirm the at-or-above case exits 0 (`$C`). Verify: `bash $C --min-percent 70 /tmp/minpct-demo; echo "EXIT=$?"` prints `EXIT=0`.
- [ ] T009 Confirm the boundary is inclusive (`$C`). Verify: `bash $C --min-percent 77 /tmp/minpct-demo; echo "EXIT=$?"` prints `EXIT=0`.
- [ ] T010 Confirm the text report is unchanged by the option (`$C`). Verify: `diff <(bash $C /tmp/minpct-demo) <(bash $C --min-percent 90 /tmp/minpct-demo)` prints nothing.
- [ ] T011 Confirm the JSON report is unchanged by the option (`$C`). Verify: `diff <(bash $C --json /tmp/minpct-demo) <(bash $C --json --min-percent 90 /tmp/minpct-demo)` prints nothing.
- [ ] T012 Confirm a missing value is rejected rather than read as the folder (`$C`). Verify: `bash $C --min-percent; echo "EXIT=$?"` prints `EXIT=1`.
- [ ] T013 Validate the packet (`spec.md`, `plan.md`, `tasks.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/zz-bench-authoring/001-completeness-min-percent --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `--min-percent 90` exits 3 and `--min-percent 70` exits 0 on the 77% fixture, with both reports identical to the ungated run
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
