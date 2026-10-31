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

**Path variables**: `C` is `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`. `S` is `specs/zz-bench-authoring/001-completeness-min-percent`. `L` is `$S/scratch/low`, a below-threshold fixture built in T002.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the script's current output and exit status on this packet (`$C`). Verify: `bash $C $S` prints `Overall Completion: 100%` and `echo $?` prints 0.
- [ ] T002 Build the below-threshold fixture (`$L`). Copy `spec.md` there and seed it with one token from the script's `PLACEHOLDER_PATTERNS` list. Verify: `bash $C $L` prints an `Overall Completion:` line below 90.
- [ ] T003 [P] Capture baseline stdout for the output-stability check (`$S/scratch/baseline-text.txt`). Verify: `bash $C $S > $S/scratch/baseline-text.txt` exits 0 and the file is not empty.
- [ ] T004 [P] Capture baseline JSON for the same check (`$S/scratch/baseline-json.txt`). Verify: `bash $C --json $S > $S/scratch/baseline-json.txt` exits 0 and the file contains `"overall_completion"`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Declare a `MIN_PERCENT` global beside `SINGLE_FILE` (`$C`, section 3). Verify: `bash -n $C` exits 0.
- [ ] T006 Add the `--min-percent` arm to the option loop that consumes its value into `MIN_PERCENT` (`$C`, section 8). Verify: `bash $C --min-percent 90 $S` prints its report instead of `ERROR: Unexpected argument`.
- [ ] T007 Validate the value after parsing and before analysis: present, integer, within 0-100, else an `ERROR:` line on stderr and exit 1 (`$C`, section 8). Verify: `bash $C --min-percent abc $S; echo $?` prints an `ERROR:` line and 1.
- [ ] T008 Apply the exit status after the output functions run: exit 3 when the printed percentage is below `MIN_PERCENT`, else 0 (`$C`, section 8). Write it as a full `if` so no branch leaves a non-zero status under `set -e`. Verify: `bash $C --min-percent 90 $L; echo $?` prints the full report and 3.
- [ ] T009 Document the option in `show_help` and the header comment's option list, including what exit 3 means (`$C`, sections 1 and 4). Verify: `bash $C --help | grep -c -- '--min-percent'` prints a count of at least 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Verify both sides of the threshold (`$C`). Verify: `bash $C --min-percent 90 $L; echo $?` prints 3 and `bash $C --min-percent 90 $S; echo $?` prints 0.
- [ ] T011 Verify text output is unchanged (`$S/scratch/baseline-text.txt`). Verify: `bash $C --min-percent 50 $S > $S/scratch/with-text.txt; diff $S/scratch/baseline-text.txt $S/scratch/with-text.txt` prints nothing.
- [ ] T012 Verify JSON output is unchanged (`$S/scratch/baseline-json.txt`). Verify: `bash $C --json --min-percent 50 $S > $S/scratch/with-json.txt; diff $S/scratch/baseline-json.txt $S/scratch/with-json.txt` prints nothing.
- [ ] T013 Verify the usage errors (`$C`). Verify: `bash $C --min-percent $S; echo $?`, `bash $C --min-percent abc $S; echo $?` and `bash $C --min-percent 101 $S; echo $?` each print an `ERROR:` line and 1.
- [ ] T014 Verify a run without the option still exits 0 (`$C`). Verify: `bash $C $L; echo $?` prints 0, confirming the new threshold is opt-in only.
- [ ] T015 Verify `--file` mode applies the threshold to the file's own percentage (`$C`). Verify: `bash $C --file $S/plan.md --min-percent 90; echo $?` prints a `Completion:` line and the exit status matches whether that figure clears 90.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `--min-percent 90` exits 3 on `$L` and 0 on `$S`, with `diff` showing no output change in either mode
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
