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

`S` is `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`.
`L` is a folder scoring `Overall Completion: 10%` and `H` is one scoring `100%`; `P` is this packet folder, `specs/zz-bench-authoring/001-completeness-min-percent`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture the current stdout of a 10% run as the before-change baseline (`P/scratch/baseline-10pct.txt`). Verify: `bash $S $L > $P/scratch/baseline-10pct.txt; echo $?` prints `0`.
- [ ] T002 [P] Confirm `bc` is present, since the percentage arithmetic needs it (`$S`). Verify: `command -v bc` prints a path.
- [ ] T003 [P] Confirm the unconditional tail this feature replaces (`$S`). Verify: `tail -n 2 $S` prints `exit 0`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add a `--min-percent) MIN_PERCENT="$2"; shift 2 ;;` arm to the argument loop, beside the existing `--file` arm (`$S`). Verify: `bash $S --min-percent 90 $H >/dev/null; echo $?` prints `0`.
- [ ] T005 Declare `MIN_PERCENT=""` with the other globals and validate it after the loop: an integer in 0-100, otherwise a stderr message naming the value and `exit 1` (`$S`). Verify: `bash $S --min-percent abc $H; echo $?` prints the message and `1`, with no report.
- [ ] T006 Document the option in `show_help` and list exit `3` in the exit-code comment at the foot of the script (`$S`). Verify: `bash $S --help | grep -c -- '--min-percent <N>'` prints `1`.
- [ ] T007 Replace the trailing `exit 0` with a branch that exits 3 when `MIN_PERCENT` is set and `OVERALL_PERCENTAGE` is below it, written as a full `if` so the false branch leaves status 0 (`$S`). Verify: `bash $S --min-percent 90 $L >/dev/null; echo $?` prints `3`.
- [ ] T008 Confirm the branch runs after output so a failing gate still prints its report (`$S`). Verify: `bash $S --min-percent 90 $L | grep -c 'Overall Completion:'` prints `1`.
- [ ] T015 Add a boolean `min_percent_met` to the `--json` object, true when `OVERALL_PERCENTAGE` is at or above `MIN_PERCENT` and false otherwise, emitted only when both `--json` and `--min-percent` are set (REQ-007) (`$S`). Verify: `bash $S --json --min-percent 90 $L` prints `"min_percent_met": false` and the same run on `$H` prints `"min_percent_met": true`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Verify the below-threshold path at three thresholds (`$S`). Verify: `--min-percent 90`, `50` and `11` on `L` each print the report and exit `3`.
- [ ] T010 Verify the at-or-above path, including the boundary (`$S`). Verify: `--min-percent 10` on `L` and `--min-percent 90` on `H` each exit `0`.
- [ ] T011 Verify the report is byte-identical with and without the option (`$S`). Verify: `diff <(bash $S $L) <(bash $S --min-percent 50 $L)` prints nothing, and the same holds with `--json` and with `--verbose`.
- [ ] T012 Verify bad values are rejected before any report (`$S`). Verify: `--min-percent` with no value, `abc`, `-1` and `101` each exit `1` and print no `Overall Completion:` line.
- [ ] T013 Verify a run without the option is unchanged against the baseline (`$S`). Verify: `diff $P/scratch/baseline-10pct.txt <(bash $S $L)` prints nothing and the run exits `0`.
- [ ] T014 Verify the packet still validates (`P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] T011's `diff` is empty, which is the artifact proving the report did not change
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
