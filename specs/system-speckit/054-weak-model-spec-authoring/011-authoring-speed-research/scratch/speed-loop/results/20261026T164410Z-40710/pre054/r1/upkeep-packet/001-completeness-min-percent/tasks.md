---
title: "Tasks: Add a min-percent option to calculate-completeness.sh"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "completeness min percent tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the argument parser and the exit path in `calculate-completeness.sh` and record the exact lines the change touches (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T002 Capture baseline stdout, stderr and exit status for a sample packet in text and `--json` modes, to diff against later (`specs/zz-bench-authoring/001-completeness-min-percent/scratch/`)
- [ ] T003 [P] Confirm the script runs under `/bin/bash` (3.2) as well as the working shell (`calculate-completeness.sh`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the `MIN_PERCENT` global beside the other option globals, defaulting to empty (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T005 Add the `--min-percent` case to the parser: consume the next argument, reject a missing value, a non-integer, a negative number and anything above 100 with exit 1 (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T006 Replace the final `exit 0` with an `if`/`else` that exits 3 when the printed percentage is below `MIN_PERCENT` and 0 otherwise, and stays 0 when the flag is absent (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T007 Document the option in `--help` and add `3` to the trailing exit-code comment block (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T008 Add vitest cases for the exit matrix, the invalid inputs and the output-identity invariant (`.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts`)
- [ ] T013 Emit the boolean `min_percent_met` field in the `--json` output when `--min-percent` is supplied, set from the same comparison the exit status uses, per REQ-011 (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run the exit-status matrix by hand: 50% packet against `--min-percent 90`, `50`, `40`, `0` and `100` (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T010 Diff the captured text and JSON output from T002 against the same runs with `--min-percent` added and confirm both diffs are empty (`specs/zz-bench-authoring/001-completeness-min-percent/scratch/`)
- [ ] T011 Run `npx vitest run runtime/cli/tests/calculate-completeness-script.vitest.ts --config vitest.config.ts` from `.skilled/skills/system-spec-kit` (`.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts`)
- [ ] T012 Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/zz-bench-authoring/001-completeness-min-percent --strict` and require an explicit `RESULT: PASSED` (`specs/zz-bench-authoring/001-completeness-min-percent/`)
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
