---
title: "Tasks: Add a min-percent option to calculate-completeness.sh"
description: "Ordered task list for the --min-percent option: baseline capture, option parsing and validation, the exit-status gate, then verification of all three exit paths."
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

**Task Format**: `T### [P?] Description (file path). Verify clause: <command> prints <expected output>`

**Paths**: `S` is `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` and `P` is `specs/zz-bench-authoring/001-completeness-min-percent`. Each verify clause spells both paths in full so it pastes and runs unchanged.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the unmodified script's report and exit status on this packet (`calculate-completeness.sh`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh specs/zz-bench-authoring/001-completeness-min-percent; echo $?` prints an `Overall Completion:` line followed by 0.
- [ ] T002 Confirm the option loop and the final exit are the only edit sites (`calculate-completeness.sh`). Verify: `rg -n 'exit 0' .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh | tail -1` prints one line.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Declare an empty `MIN_PERCENT` global beside the other option globals (`calculate-completeness.sh`). Verify: `rg -n '^MIN_PERCENT=""' .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` prints one line.
- [ ] T004 Add the `--min-percent` branch to the option loop so the value is stored and both argv slots are consumed (`calculate-completeness.sh`). Verify: `rg -n -- '--min-percent\\)' .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` prints one line.
- [ ] T005 Reject a non-integer, negative or above-100 N with a stderr message and exit 1 before any calculation runs (`calculate-completeness.sh`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --min-percent abc specs/zz-bench-authoring/001-completeness-min-percent >/dev/null; echo $?` prints an error on stderr then 1.
- [ ] T006 Document the option and the meaning of exit 3 in the `show_help` heredoc (`calculate-completeness.sh`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --help | rg -c -- '--min-percent <N>'` prints 1.
- [ ] T007 Compare `OVERALL_PERCENTAGE` with `MIN_PERCENT` after the output call and exit 3 when the figure is below it (`calculate-completeness.sh`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --min-percent 100 specs/zz-bench-authoring/001-completeness-min-percent >/dev/null; echo $?` prints 3.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Confirm a plain invocation still exits 0 (`calculate-completeness.sh`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh specs/zz-bench-authoring/001-completeness-min-percent >/dev/null; echo $?` prints 0.
- [ ] T009 Confirm the gated and ungated reports are identical (`calculate-completeness.sh`). Verify: `diff <(bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh specs/zz-bench-authoring/001-completeness-min-percent) <(bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --min-percent 0 specs/zz-bench-authoring/001-completeness-min-percent)` prints nothing.
- [ ] T010 Confirm an at-or-above threshold exits 0 (`calculate-completeness.sh`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --min-percent 0 specs/zz-bench-authoring/001-completeness-min-percent >/dev/null; echo $?` prints 0.
- [ ] T011 Confirm a below-threshold run still prints its full report before exiting 3 (`calculate-completeness.sh`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --min-percent 100 specs/zz-bench-authoring/001-completeness-min-percent | rg -c 'Overall Completion:'` prints 1.
- [ ] T012 Confirm an out-of-range N is rejected (`calculate-completeness.sh`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --min-percent 101 specs/zz-bench-authoring/001-completeness-min-percent >/dev/null 2>&1; echo $?` prints 1.
- [ ] T013 Validate this packet in strict mode (`specs/zz-bench-authoring/001-completeness-min-percent`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/zz-bench-authoring/001-completeness-min-percent --strict | tail -1` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Exit codes 3, 0 and 1 observed on `calculate-completeness.sh`, and the gated-versus-ungated `diff` is empty
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

