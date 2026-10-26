---
title: "Tasks: Add a min-percent option to calculate-completeness.sh"
description: "Task Format: T### [P?] Description (file path)"
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

Two shell variables keep the commands short. Set them once before running any task:

```bash
S=.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh
P=specs/zz-bench-authoring/001-completeness-min-percent
```

`S` is the script under change and `P` is this packet folder. `X` below stands for the `Overall Completion` percentage the baseline report prints.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture the current text report and its exit status (`$S`). Verify: `bash "$S" "$P" > /tmp/before.txt 2>/tmp/before.err; echo $?` prints `0`.
- [ ] T002 Capture the current JSON report (`$S`). Verify: `bash "$S" --json "$P" > /tmp/before.json; echo $?` prints `0`.
- [ ] T003 Read the argument loop and the trailing exit path (`$S`). Verify: `rg -n 'exit 0' "$S"` prints the final `exit 0` that closes the main block.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the `--min-percent <N>` case to the argument loop with integer range validation, storing the value in a new global (`$S`). Verify: `bash "$S" --min-percent abc "$P"; echo $?` prints one `ERROR:` line and `1`.
- [ ] T005 Replace the trailing `exit 0` with an explicit `if` gate that exits 3 when the reported completion is below `N` (`$S`). Verify: `bash "$S" --min-percent 100 "$P" >/dev/null; echo $?` prints `3` while the report is below 100, and `bash "$S" --min-percent 0 "$P" >/dev/null; echo $?` prints `0`.
- [ ] T006 Add the option to the `show_help` text (`$S`). Verify: `bash "$S" --help | rg -c 'min-percent'` prints `1`.
- [ ] T013 Emit a `min_percent_met` boolean in the `--json` report when `--min-percent` is set, `true` at or above `N` and `false` below it (REQ-006) (`$S`). Verify: `bash "$S" --json --min-percent 100 "$P" | rg -c '"min_percent_met": false'` prints `1` while the report is below 100, and `bash "$S" --json --min-percent 0 "$P" | rg -c '"min_percent_met": true'` prints `1`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Diff the text report with and without the flag (`$S`). Verify: `bash "$S" --min-percent 0 "$P" > /tmp/after.txt; diff /tmp/before.txt /tmp/after.txt` prints nothing.
- [ ] T008 Diff the JSON report with and without the flag (`$S`). Verify: `bash "$S" --json --min-percent 0 "$P" > /tmp/after.json; diff /tmp/before.json /tmp/after.json` prints nothing.
- [ ] T009 Check the below-threshold exit code (`$S`). Verify: `bash "$S" --min-percent $((X + 1)) "$P" >/dev/null; echo $?` prints `3`.
- [ ] T010 Check the boundary and above-threshold exit codes (`$S`). Verify: `bash "$S" --min-percent "$X" "$P" >/dev/null; echo $?` prints `0`, and the same with `$((X > 0 ? X - 1 : 0))` prints `0`.
- [ ] T011 Check the runs that do not use the flag (`$S`). Verify: the plain, `--json`, `--verbose` and `--file` invocations each print `0` from `echo $?`.
- [ ] T012 Run the strict validator on this packet (`$P`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$P" --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The report diff is empty in text and JSON mode, and `--min-percent` exits 3 below the threshold and 0 at or above it
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
