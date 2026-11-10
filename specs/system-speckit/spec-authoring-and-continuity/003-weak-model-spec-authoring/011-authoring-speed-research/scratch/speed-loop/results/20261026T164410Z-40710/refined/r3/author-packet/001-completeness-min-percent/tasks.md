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

Shell variables used below:

- `S` is `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`
- `P` is `specs/zz-bench-authoring/001-completeness-min-percent`
- `X` is `specs/zz-bench-authoring/001-completeness-min-percent/scratch/fixture/spec.md`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the baseline report and exit code (`$S`). Verify: `bash $S $P > $P/scratch/baseline.txt; echo $?` prints `0` and `rg 'Overall Completion' $P/scratch/baseline.txt` prints `Overall Completion: 100%`.
- [ ] T002 Create a below-threshold fixture carrying one unfilled token from `PLACEHOLDER_PATTERNS` (`$X`). Verify: `bash $S --file $X | rg 'Completion:'` prints a percentage below `100`.
- [ ] T003 [P] Confirm the shell floor the change must keep (`$S`). Verify: `bash --version | head -1` prints `GNU bash, version 3.2.57`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add a `MIN_PERCENT=""` global and a `--min-percent <N>` branch to the argument loop (`$S`). Verify: `bash $S --min-percent 90 $P > /dev/null; echo $?` prints `0` and no longer prints `ERROR: Unexpected argument: 90`.
- [ ] T005 Reject a missing, non-integer or out-of-range value before any calculation (`$S`). Verify: `bash $S --min-percent abc $P; echo $?` prints `ERROR: --min-percent requires an integer between 0 and 100` then `1`.
- [ ] T006 Add `REPORTED_PERCENTAGE=0` to the globals and assign it in both `output_text` and `output_json` (`$S`). Verify: `diff <(bash $S $P) $P/scratch/baseline.txt` prints nothing.
- [ ] T007 Replace the final `exit 0` with the threshold gate (`$S`). Verify: `bash $S --min-percent 100 $X > /dev/null; echo $?` prints `3`.
- [ ] T008 [P] List the option in `show_help` and add exit code `3` to the comment block (`$S`). Verify: `bash $S --help | grep -c -- '--min-percent'` prints `1`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Text parity with and without the option (`$S`). Verify: `diff <(bash $S $P) <(bash $S --min-percent 90 $P)` prints nothing.
- [ ] T010 JSON parity with and without the option (`$S`). Verify: `diff <(bash $S --json $P) <(bash $S --json --min-percent 90 $P)` prints nothing.
- [ ] T011 Below-threshold exit on a folder run (`$S`). Verify: `bash $S --min-percent 100 $X > /dev/null; echo $?` prints `3`.
- [ ] T012 At-threshold exit on a folder run (`$S`). Verify: `bash $S --min-percent 100 $P > /dev/null; echo $?` prints `0`.
- [ ] T013 Zero threshold never fails (`$S`). Verify: `bash $S --min-percent 0 $X > /dev/null; echo $?` prints `0`.
- [ ] T014 Invalid and out-of-range values (`$S`). Verify: `bash $S --min-percent 150 $P; echo $?` prints the `ERROR:` line then `1`, and `bash $S --min-percent $P; echo $?` does the same.
- [ ] T015 Single-file run gates on the percentage it prints (`$S`). Verify: `bash $S --min-percent 100 --file $X > /dev/null; echo $?` prints `3`.
- [ ] T016 Baseline unchanged without the option (`$S`). Verify: `bash $S $P > /dev/null; echo $?` prints `0`.
- [ ] T017 Packet validation (`$P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `diff` of the text report with and without `--min-percent` prints nothing
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
