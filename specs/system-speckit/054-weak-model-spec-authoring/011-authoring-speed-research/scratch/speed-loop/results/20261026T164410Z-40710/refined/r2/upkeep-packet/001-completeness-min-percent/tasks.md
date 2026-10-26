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

`S` is `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`. `F` is `specs/zz-bench-authoring/001-completeness-min-percent/scratch/fixture-67`, the 67% fixture.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the script rejects the flag today (`S`). Verify: `bash S --min-percent 50 specs/zz-bench-authoring/001-completeness-min-percent` prints `ERROR: Unexpected argument: 50` and exits 1.
- [ ] T002 Build the 67% fixture (`F`). Verify: `bash S F` prints `Overall Completion: 67%` and exits 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add `MIN_PERCENT=""` beside the other option globals (`S`, §3 GLOBALS). Verify: `bash -n S` exits 0.
- [ ] T004 Add a `--min-percent)` arm that consumes the next token, rejects a missing, non-integer, negative or greater-than-100 value with `ERROR:` on stderr, and exits 1 (`S`, §8 MAIN SCRIPT option loop). Verify: `bash S --min-percent` exits 1 and prints `ERROR:`, and `bash S --min-percent abc F` exits 1 and prints `ERROR:`.
- [ ] T005 Add the post-output comparison that exits 3 when the computed percentage is below `MIN_PERCENT` and 0 otherwise (`S`, §8 MAIN SCRIPT after the output call). Verify: `bash S --min-percent 80 F` exits 3, and `bash S --min-percent 50 F` exits 0.
- [ ] T006 Add one `--min-percent <N>` line to the `OPTIONS:` block and one `3 - Completion below --min-percent` line to the exit-code footer (`S`, `show_help` and the footer). Verify: `bash S --help` prints a line containing `--min-percent <N>` and exits 0.
- [ ] T012 Add `min_percent_met` to the `--json` payload when `MIN_PERCENT` is set, `true` when the computed percentage is at or above `N` and `false` otherwise (REQ-006) (`S`, §8 MAIN SCRIPT JSON output branch). Verify: `bash S --json --min-percent 50 F` prints `"min_percent_met": true` and `bash S --json --min-percent 80 F` prints `"min_percent_met": false`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Verify the below-threshold path (`S`). Verify: `bash S --min-percent 80 F` exits 3 and its stdout still contains `Overall Completion: 67%`.
- [ ] T008 Verify the at-and-above-threshold paths (`S`). Verify: `bash S --min-percent 67 F` exits 0 and `bash S --min-percent 50 F` exits 0.
- [ ] T009 Verify the report is unchanged in text and JSON modes (`S`). Verify: `diff <(bash S F) <(bash S --min-percent 50 F)` prints nothing and `diff <(bash S --json F) <(bash S --json --min-percent 50 F)` prints nothing.
- [ ] T010 Verify a run with no flag still exits 0 (`S`). Verify: `bash S F` exits 0, and `bash S specs/zz-bench-authoring/001-completeness-min-percent` exits 0.
- [ ] T011 Verify every rejected value (`S`). Verify: `bash S --min-percent -1 F` and `bash S --min-percent 101 F` each exit 1 and print `ERROR:` on stderr.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/zz-bench-authoring/001-completeness-min-percent --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
