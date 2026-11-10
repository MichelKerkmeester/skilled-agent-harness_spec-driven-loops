---
title: "Tasks: Add a min-percent option to calculate-completeness.sh"
description: "Fourteen ordered tasks across setup, implementation and verification for the --min-percent option, each with a command that proves it."
trigger_phrases:
  - "completeness min percent tasks"
  - "min-percent implementation tasks"
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

`S` is the script under change: `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`. `P` is this packet: `specs/zz-bench-authoring/001-completeness-min-percent`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Create the mid-range fixture (`$P/scratch/fixture/spec.md`). Write `# Fixture`, two lines carrying the bracketed TBD marker and one `Content line`. Verify: `bash $S $P/scratch/fixture | rg 'Overall Completion'` prints `Overall Completion: 50%`.
- [ ] T002 Capture the text baseline (`$P/scratch/baseline-text.txt`). Run `bash $S $P > $P/scratch/baseline-text.txt` before any edit. Verify: `rg -c 'Overall Completion: 100%' $P/scratch/baseline-text.txt` prints `1`.
- [ ] T003 Capture the JSON baseline (`$P/scratch/baseline-json.txt`). Run `bash $S --json $P > $P/scratch/baseline-json.txt` before any edit. Verify: `rg -c '"overall_completion": 100' $P/scratch/baseline-json.txt` prints `1`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Declare the threshold global (`$S`). Add `MIN_PERCENT=""` beside `SINGLE_FILE` in the globals block. Verify: `rg -n '^MIN_PERCENT=' $S` prints exactly one line.
- [ ] T005 Parse and validate the option (`$S`). Add a `--min-percent)` branch that reads `${2:-}`, rejects an empty value, a non-integer and a value outside 0-100 with an `ERROR: --min-percent` line on stderr and exit 1, and otherwise assigns `MIN_PERCENT` and shifts two. Verify: `bash $S --min-percent abc $P; echo $?` prints the `ERROR:` line then `1`.
- [ ] T006 Gate the exit code (`$S`). After the report writer call and before the final `exit 0`, compare `MIN_PERCENT` with `OVERALL_PERCENTAGE` in folder mode and with the single-file stats `percentage` in `--file` mode, exiting 3 when the value is lower. Verify: `bash $S --min-percent 51 $P/scratch/fixture; echo $?` prints `3`.
- [ ] T007 Document the option (`$S`). Add the `--min-percent <N>` line to `show_help` and a `3 - Below --min-percent threshold` line to the trailing exit-code comment block. Verify: `bash $S --help | rg -- '--min-percent'` prints one line.
- [ ] T015 Emit the `min_percent_met` field in the JSON report (REQ-008) (`$S`). In the `--json` writer, when `MIN_PERCENT` is set, emit `"min_percent_met": true` if `OVERALL_PERCENTAGE` is at or above `MIN_PERCENT` and `false` otherwise. Verify: `bash $S --json --min-percent 100 $P | rg '"min_percent_met": true'` prints one line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Text report parity (`$S`). Verify: `diff $P/scratch/baseline-text.txt <(bash $S --min-percent 0 $P)` prints nothing and exits 0.
- [ ] T009 JSON report parity (`$S`). Verify: `diff $P/scratch/baseline-json.txt <(bash $S --json --min-percent 0 $P)` prints nothing and exits 0.
- [ ] T010 Threshold boundary matrix (`$S`). Verify: `--min-percent 51` on the fixture exits 3, `50` exits 0 and `49` exits 0.
- [ ] T011 Top of range (`$S`). Verify: `bash $S --min-percent 100 $P; echo $?` prints `0` because the packet reports 100 percent.
- [ ] T012 Invalid input matrix (`$S`). Verify: `--min-percent` with no value, `abc`, `-1` and `101` each exit 1, print `ERROR:` on stderr and print no `Overall Completion` line.
- [ ] T013 Single-file mode (`$S`). Verify: `bash $S --file $P/scratch/fixture/spec.md --min-percent 51; echo $?` prints `3`, and the same call with `50` prints `0`.
- [ ] T014 Syntax and lint (`$S`). Verify: `bash -n $S` exits 0, and `shellcheck $S` reports nothing when shellcheck is installed.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `diff` of the text report and of the JSON report, with and without `--min-percent`, is empty
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
