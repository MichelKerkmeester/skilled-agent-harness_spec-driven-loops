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

**Variables**: `C` is `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`. `F` is the 80% fixture folder described in `plan.md` section 5, built under `$TMPDIR`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the baseline report from the unmodified script (`C`). Verify: `bash C specs/system-speckit/026-graph-and-context-optimization > /tmp/baseline.txt` exits 0 and `grep 'Overall Completion' /tmp/baseline.txt` prints `Overall Completion: 100%`.
- [ ] T002 Confirm the script parses cleanly before the change (`C`). Verify: `bash -n C` exits 0.
- [ ] T003 Build the 80% fixture (`$TMPDIR/min-percent-fixture/spec.md`). Verify: `bash C "$F"` prints `Overall Completion: 80%`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Declare the option global (`C`). Add `MIN_PERCENT=""` beside `VERBOSE`, `JSON_OUTPUT` and `QUALITY_CHECK` in section 3, so `set -u` never sees it unset.
- [ ] T005 Add the argument branch (`C`). In the section 8 `case "$1"` block, add `--min-percent` that consumes `$2` and rejects a missing value with `ERROR: --min-percent requires a value` on stderr and exit 1; validate the value is an integer from 0 to 100 and reject anything else with `ERROR: --min-percent must be an integer between 0 and 100` and exit 1. Verify: `bash C --min-percent abc "$F"` prints the error and exits 1.
- [ ] T006 Add the threshold comparison (`C`). After the `output_json` / `output_text` call and before the final `exit 0`, compare the reported percentage against `MIN_PERCENT` only when `MIN_PERCENT` is non-empty, exiting 3 when the report is below it. Use `OVERALL_PERCENTAGE` in folder mode and the stats-file `percentage` in `--file` mode. Verify: `bash C --min-percent 90 "$F"` exits 3.
- [ ] T007 Document the option in `show_help` (`C`). Add `--min-percent <N>` with the 0-100 range and the exit-3 meaning. Verify: `bash C --help | grep -- '--min-percent'` prints one line.
- [ ] T008 Extend the trailing exit-code comment (`C`). Add `3 - Overall Completion below --min-percent` under the existing `0` and `1` entries. Verify: `tail -5 C | grep -c '3 -'` prints `1`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Syntax check (`C`). Verify: `bash -n C` exits 0.
- [ ] T010 Below-threshold run (`C`, `F`). Verify: `bash C --min-percent 90 "$F"` exits 3 and still prints the full report including `Overall Completion: 80%`.
- [ ] T011 At-or-above-threshold run (`C`, `F`). Verify: `bash C --min-percent 70 "$F"` exits 0.
- [ ] T012 Plain run unchanged (`C`, `F`). Verify: `bash C "$F"` exits 0.
- [ ] T013 Text output unchanged (`C`, `F`). Verify: `diff <(bash C "$F") <(bash C --min-percent 70 "$F")` prints nothing.
- [ ] T014 JSON output unchanged (`C`, `F`). Verify: `diff <(bash C --json "$F") <(bash C --json --min-percent 70 "$F")` prints nothing.
- [ ] T015 Invalid values rejected (`C`, `F`). Verify: `bash C --min-percent 101 "$F"`, `bash C --min-percent abc "$F"` and `bash C --min-percent` each exit 1 and print no report.
- [ ] T016 `--file` mode threshold (`C`, `F/spec.md`). Verify: `bash C --file "$F/spec.md" --min-percent 90` exits 3 and `--min-percent 70` exits 0.
- [ ] T017 Update documentation (`spec.md`, `plan.md`, `tasks.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/zz-bench-authoring/001-completeness-min-percent --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `diff` of plain-run stdout against `--min-percent` stdout is empty in both text and `--json` modes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
