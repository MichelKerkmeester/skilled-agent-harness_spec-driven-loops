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

**Variables**: `S` is `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`. `T` is a temp fixture folder whose report prints `Overall Completion: 0%`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the option loop, the tail and the exit-code comment in `S`, and record the current exit codes. Verify: `rg -n 'exit [0-9]' "$S"` prints the existing `exit 0` plus the error exits.
- [ ] T002 Build the fixture: `T=$(mktemp -d); printf '[%s]\n' TBD > "$T/spec.md"`. Verify: `bash "$S" "$T"` prints `Overall Completion: 0%`.
- [ ] T003 [P] Capture the baseline report for later diffing: `bash "$S" "$T" > baseline.txt`. Verify: the command exits 0 and `wc -l < baseline.txt` prints a non-zero count.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add a `MIN_PERCENT` global and a `--min-percent` case to the option loop that validates `^[0-9]+$` and a value from 0 to 100, exiting 1 with a stderr usage error otherwise (`S`). Verify: `bash "$S" --min-percent abc "$T"` exits 1 and `bash "$S" --min-percent 90 "$T"` is accepted.
- [ ] T005 Replace the unconditional `exit 0` with the threshold comparison, using `OVERALL_PERCENTAGE` in folder mode and the single-file percentage under `--file`, so a completion below `MIN_PERCENT` exits 3 and anything else exits 0 (`S`). Verify: `bash "$S" --min-percent 90 "$T"` exits 3 and `bash "$S" --min-percent 0 "$T"` exits 0.
- [ ] T006 Add the `--min-percent <N>` line to `show_help` and list exit 3 in the trailing exit-code comment (`S`). Verify: `bash "$S" --help` prints one `--min-percent` line and `rg -n '3 - ' "$S"` prints the below-threshold entry.
- [ ] T007 [P] Confirm the option appears only where intended (`S`). Verify: `rg -n 'min-percent|MIN_PERCENT' "$S"` lists hits only in `show_help`, the option loop and the tail, with none inside `output_text` or `output_json`.
- [ ] T013 Implement REQ-007: emit a boolean `min_percent_met` in the `--json` output when `--json` and `--min-percent` are both passed, true when the reported Overall Completion is at or above `MIN_PERCENT` and false otherwise, leaving the JSON unchanged when the option is absent (`S`). Verify: `bash "$S" --json --min-percent 90 "$T"` prints `"min_percent_met": false`, `bash "$S" --json --min-percent 0 "$T"` prints `"min_percent_met": true`, and `bash "$S" --json "$T"` prints no `min_percent_met` key.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run the exit matrix on the fixture. Verify: no option exits 0, `--min-percent 0` exits 0, `--min-percent 1` exits 3 and `--min-percent 90` exits 3.
- [ ] T009 Diff the text report with and without the option. Verify: `diff <(bash "$S" "$T" || true) <(bash "$S" --min-percent 90 "$T" || true)` prints nothing.
- [ ] T010 [P] Diff the JSON report with and without the option. Verify: `diff <(bash "$S" --json "$T" || true) <(bash "$S" --json --min-percent 90 "$T" || true)` prints nothing.
- [ ] T011 Run the matrix on a complete fixture: `C=$(mktemp -d); printf '## 1. METADATA\nFilled content.\n' > "$C/spec.md"`. Verify: `bash "$S" --min-percent 100 "$C"` exits 0 and `bash "$S" --min-percent 101 "$C"` exits 1 with a stderr message.
- [ ] T012 Run spec validation on this packet as a regression check. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/zz-bench-authoring/001-completeness-min-percent --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Exit matrix and both output diffs recorded in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
