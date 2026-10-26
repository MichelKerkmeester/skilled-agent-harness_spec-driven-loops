---
title: "Tasks: Add a min-percent option to calculate-completeness.sh"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "completeness min percent tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
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

**Shell variables** used below:

| Variable | Value |
|----------|-------|
| `$S` | `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` |
| `$F` | A fixture spec folder with at least one unfilled placeholder |
| `$P` | The percentage the run prints, read before the comparison: `P=$(bash $S $F \| sed -n 's/.*Overall Completion: \([0-9]*\)%.*/\1/p')` |

Export `S` and `F` before running a verify command. `P` is read from the run itself, so no fixture needs an exact percentage.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the current report and exit status for the fixture folder (`$S`). Verify: `bash $S $F; echo "exit=$?"` prints the report and `exit=0`.
- [ ] T002 Read the option loop and the trailing `exit 0` (`$S`). Verify: `rg -n 'exit 0|--file\|-f' $S` prints the parser case and the final `exit 0`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add a `MIN_PERCENT` global beside `SINGLE_FILE`, empty by default (`$S`). Verify: `rg -n '^MIN_PERCENT=' $S` prints one line.
- [ ] T004 Parse `--min-percent <N>` in the option loop and reject a missing value with exit 1 (`$S`). Verify: `bash $S --min-percent` prints `ERROR:` on stderr and `echo "exit=$?"` prints `exit=1`.
- [ ] T005 Reject a non-integer or out-of-range N with exit 1 and an `ERROR:` line on stderr (`$S`). Verify: `bash $S --min-percent 101 $F` prints `ERROR:` on stderr and `echo "exit=$?"` prints `exit=1`.
- [ ] T006 Compare the printed percentage with N after the output call and exit 3 when it is below (`$S`). Verify: `bash $S --min-percent $((P+1)) $F; echo "exit=$?"` prints `exit=3`.
- [ ] T007 Add the option to the `show_help()` block (`$S`). Verify: `bash $S --help | rg -- '--min-percent <N>'` prints one line.
- [ ] T008 Record exit code 3 in the trailing exit-code comment (`$S`). Verify: `rg -n '^#   3' $S` prints one line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Prove the report is unchanged with the option present (`$S`). Verify: `diff <(bash $S $F) <(bash $S --min-percent 0 $F)` prints nothing.
- [ ] T010 Prove both threshold outcomes against the same run (`$S`). Verify: `bash $S --min-percent $P $F; echo "exit=$?"` prints `exit=0`, and `bash $S --min-percent $((P+1)) $F; echo "exit=$?"` prints `exit=3`.
- [ ] T011 Prove `--file` mode applies the floor to the file's own completion (`$S`). Verify: `bash $S --file $F/spec.md --min-percent 100; echo "exit=$?"` prints `exit=0` for a file with no placeholders.
- [ ] T012 Re-run strict validation on this packet (`specs/zz-bench-authoring/001-completeness-min-percent`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/zz-bench-authoring/001-completeness-min-percent --strict | tail -1` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The `diff` of the reports with and without `--min-percent` is empty, and both exit statuses 0 and 3 were observed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
