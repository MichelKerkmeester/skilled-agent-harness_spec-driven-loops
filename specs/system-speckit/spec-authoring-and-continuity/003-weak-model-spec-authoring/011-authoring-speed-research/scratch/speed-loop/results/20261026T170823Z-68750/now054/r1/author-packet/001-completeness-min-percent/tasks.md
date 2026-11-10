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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the section 8 option loop, the two output functions and the trailing `exit 0` (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`). Verify: `rg -n 'exit 0|--file\|-f'` prints the `--file` arm and the final exit
- [ ] T002 Build a throwaway fixture packet with `mktemp -d` and enough placeholder lines in `spec.md`, `plan.md` and `tasks.md` to land the report well below the threshold. Verify: the plain run prints `Overall Completion: <N>%` and exits 0
- [ ] T003 [P] Confirm `bc` is installed, since the script exits 1 without it. Verify: `command -v bc` exits 0
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `MIN_PERCENT=""` to the section 3 globals and a `--min-percent) MIN_PERCENT="$2"; shift 2 ;;` arm to the section 8 option loop (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`). Verify: `rg -n 'min-percent'` prints the case arm
- [ ] T005 Validate the parsed value after the loop: an integer from 0 to 100, or `ERROR: --min-percent requires an integer from 0 to 100` on stderr with exit 1, before the `bc` check and the calculation (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`). Verify: `--min-percent abc`, `-1`, `101` and a bare `--min-percent` each exit 1 and print no results block
- [ ] T006 Add the exit gate after the output call: exit 3 when the presented percentage is below `MIN_PERCENT`, else exit 0, written as an `if` that always ends in an explicit `exit 0` (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`). Verify: `--min-percent 100` on the fixture exits 3
- [ ] T007 Document the option in `show_help`, the file's usage header and the exit-code footer (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`). Verify: `--help` prints the `--min-percent <N>` line and the footer lists exit 3
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Capture stdout from the plain run and from `--min-percent 50` on the same fixture, then diff them. Verify: `diff` prints nothing and the two exit statuses are 0 and 3
- [ ] T009 Run the boundary pair: N at the printed percentage and N one point above it. Verify: the first exits 0 and the second exits 3
- [ ] T010 Repeat with `--file` and `--json`. Verify: `--file` with a threshold above the file's `Completion` exits 3, and the `--json` body is byte-identical to the unflagged run
- [ ] T011 Run `validate.sh --strict` on this packet. Verify: it prints `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
