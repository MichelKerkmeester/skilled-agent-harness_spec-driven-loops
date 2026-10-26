---
title: "Tasks: Add a min-percent option to calculate-completeness.sh"
description: "Task Format: T### [P?] Description (file path), then a verify clause naming the command and its expected output."
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

**Task Format**: `T### [P?] Description (file path).` then `Verify:` and the command with the output it must print.

**Paths used below**: `S` is `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` and `P` is `specs/zz-bench-authoring/001-completeness-min-percent`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the argument parser and the final exit path in the script to confirm where the gate belongs (`S`). Verify: `rg -n 'Unexpected argument' "$S"` prints one line.
- [ ] T002 Capture the current text report for the packet folder as the parity baseline (`P/scratch/baseline.txt`). Verify: `bash "$S" "$P" > "$P/scratch/baseline.txt"` exits 0 and the file is non-empty.
- [ ] T003 Capture the current JSON report for the packet folder as the second baseline (`P/scratch/baseline.json`). Verify: `bash "$S" --json "$P" > "$P/scratch/baseline.json"` exits 0 and the file is non-empty.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add a `MIN_PERCENT` global and a `--min-percent` branch that shifts two arguments (`S`). Verify: `bash "$S" --min-percent 0 "$P"` exits 0 and prints the normal report.
- [ ] T005 Reject a value that is not a whole number with an `ERROR` line on stderr and exit 1, before analysis (`S`). Verify: `bash "$S" --min-percent abc "$P"; echo $?` prints `1`.
- [ ] T006 Select the exit status from the completion value the report used, written as a full `if` so `set -e` does not exit early (`S`). Verify: `bash "$S" --min-percent 101 "$P"; echo $?` prints `3`.
- [ ] T007 Add `--min-percent <N>` to `show_help` and document exit `3` in the exit-code comment block (`S`). Verify: `bash "$S" --help` prints one line containing `--min-percent`.
- [ ] T012 Emit a boolean `min_percent_met` in the JSON report when `--json` and `--min-percent` are combined, `true` when the reported completion is at or above the threshold and `false` otherwise (REQ-006) (`S`). Verify: `bash "$S" --json --min-percent 101 "$P" | rg -q '"min_percent_met": false'` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Prove text-output parity between a run with and without the option (`P/scratch/parity.txt`). Verify: `diff "$P/scratch/baseline.txt" <(bash "$S" --min-percent 0 "$P")` prints nothing.
- [ ] T009 Prove JSON-output parity between a run with and without the option (`P/scratch/parity.json`). Verify: `diff "$P/scratch/baseline.json" <(bash "$S" --json --min-percent 0 "$P")` prints nothing.
- [ ] T010 Confirm the gate returns 0 at a threshold the report meets and 3 at one it cannot meet (`S`). Verify: `bash "$S" --min-percent 0 "$P"; echo $?` prints `0` and `bash "$S" --min-percent 101 "$P"; echo $?` prints `3`.
- [ ] T011 Record the parity and exit-status results in the packet summary (`P/implementation-summary.md`). Verify: `rg -n 'min-percent' "$P/implementation-summary.md"` prints at least one line.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `diff` of the baseline and the `--min-percent` run prints nothing for both text and `--json`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
