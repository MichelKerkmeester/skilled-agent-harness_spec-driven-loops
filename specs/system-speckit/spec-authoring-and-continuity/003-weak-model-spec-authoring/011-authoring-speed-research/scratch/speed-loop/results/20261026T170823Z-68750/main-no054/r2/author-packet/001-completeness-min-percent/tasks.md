---
title: "Tasks: Add a min-percent option to calculate-completeness.sh"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "completeness min percent tasks"
  - "min percent flag task breakdown"
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

- [ ] T001 Read the argument parser and the exit point to confirm where the gate belongs (calculate-completeness.sh)
- [ ] T002 Read the existing Vitest cases to reuse their temporary-folder helper (tests/calculate-completeness-script.vitest.ts)
- [ ] T003 [P] Confirm the script's Bash 3.2 constraints against the comparison style already used in the file (calculate-completeness.sh)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the `MIN_PERCENT` global with an empty default so an absent option means no gate (calculate-completeness.sh)
- [ ] T005 Add the `--min-percent` case to the argument parser, consuming the value with `shift 2` (calculate-completeness.sh)
- [ ] T006 Validate the value as an integer from 0 through 100 and exit 1 with an `ERROR:` line on stderr for a missing, non-numeric or out-of-range value (calculate-completeness.sh)
- [ ] T007 Replace the final `exit 0` with the threshold comparison: exit 3 when `MIN_PERCENT` is set and the reported percentage is below it, exit 0 otherwise (calculate-completeness.sh)
- [ ] T008 Read the per-file percentage in `--file` mode for the comparison, since that mode has no `OVERALL_PERCENTAGE` (calculate-completeness.sh)
- [ ] T009 Add the option, its 0-100 range and the exit-3 meaning to `show_help` and to the header usage comment (calculate-completeness.sh)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Add cases for below-floor, at-floor and `--min-percent 0` runs (tests/calculate-completeness-script.vitest.ts)
- [ ] T011 Add cases for the three rejected inputs, asserting exit 1, an `ERROR:` line on stderr and no report on stdout (tests/calculate-completeness-script.vitest.ts)
- [ ] T012 Add a stdout parity case that diffs a text run and a `--json` run with and without the option (tests/calculate-completeness-script.vitest.ts)
- [ ] T013 Run the Vitest file and confirm the two pre-existing cases still pass (tests/calculate-completeness-script.vitest.ts)
- [ ] T014 Run `validate.sh --strict` on this packet and record the RESULT line (specs/zz-bench-authoring/001-completeness-min-percent)
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
