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

Two shell variables are used below:

- `SCRIPT` = `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`
- `FIXTURE` = `scratch/fixture`, a throwaway folder holding one `spec.md` with a known placeholder count
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the option loop, `output_text`, `output_json` and the exit-code trailer in `SCRIPT` and note the line each block starts on. (`SCRIPT`). Verify: `grep -n 'case "\$1" in\|^output_text\|^output_json\|^exit 0' "$SCRIPT"` prints four line numbers.
- [ ] T002 Create `FIXTURE/spec.md` with a placeholder count that yields a known percentage, then record that percentage. (`FIXTURE/spec.md`). Verify: `bash "$SCRIPT" "$FIXTURE"` prints `Overall Completion: <P>%` where `P` is the recorded value.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add a `MIN_PERCENT=""` global beside `VERBOSE`, `JSON_OUTPUT`, `QUALITY_CHECK` and `SINGLE_FILE`. (`SCRIPT`). Verify: `grep -n 'MIN_PERCENT=' "$SCRIPT"` prints the assignment in the globals block.
- [ ] T004 Add a `--min-percent` case to the option loop that consumes the next argument and exits 1 with a stderr message when the value is missing, not an integer, or outside 0-100. (`SCRIPT`). Verify: `bash "$SCRIPT" --min-percent abc "$FIXTURE"` exits 1 and writes nothing to stdout.
- [ ] T005 Record the percentage each output function renders in a shared global, so folder mode records `OVERALL_PERCENTAGE` and `--file` mode records the per-file value. (`SCRIPT`). Verify: `grep -c 'REPORTED_PERCENTAGE' "$SCRIPT"` prints at least one assignment per output function.
- [ ] T006 Add the gate after the output call: when `MIN_PERCENT` is set and the recorded percentage is below it, exit 3; otherwise fall through to the existing `exit 0`. (`SCRIPT`). Verify: `bash "$SCRIPT" --min-percent 100 "$FIXTURE"; echo $?` prints `3`.
- [ ] T007 Add the `--min-percent <N>` line to the OPTIONS block in `show_help` and an exit-code line naming 3. (`SCRIPT`). Verify: `bash "$SCRIPT" --help | grep -- '--min-percent'` prints the new OPTIONS line and the run exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Diff stdout with and without the option for folder, `--verbose`, `--json`, `--quality` and `--file` forms. (`SCRIPT`). Verify: every `diff <(bash "$SCRIPT" <args>) <(bash "$SCRIPT" --min-percent 100 <args>)` prints nothing.
- [ ] T009 Walk the boundary in both directions against the recorded percentage `P`. (`SCRIPT`). Verify: `--min-percent "$P"` exits 0 and `--min-percent "$((P + 1))"` exits 3.
- [ ] T010 Reject four invalid inputs and confirm the pre-existing exit paths still hold. (`SCRIPT`). Verify: `--min-percent` with no value, `abc`, `-1` and `101` each exit 1 with stderr text and empty stdout, while no arguments and a nonexistent folder exit 1 and `--help` exits 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: every `diff` in T008 is empty, T009 shows 0 and 3 on the two sides of the boundary, and T010 shows the unchanged exits.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` for the requirements and success criteria this list verifies
- **Plan**: See `plan.md` for the component boundaries and the testing strategy behind T008 and T009
<!-- /ANCHOR:cross-refs -->

---

