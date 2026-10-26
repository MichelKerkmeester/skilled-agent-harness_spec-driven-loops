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

- [ ] T001 Read the argument loop, both output functions and the `--file` NOT FOUND branch, and record which variable holds the percentage each path reports (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T002 Read the existing vitest file and confirm the `spawnSync` helper and temp-packet teardown it already provides (`.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts`)
- [ ] T003 [P] Confirm the test command for the suite and run it once to capture the baseline of the two existing cases (`.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `MIN_PERCENT=""` and `REPORTED_PERCENTAGE=100` to the globals block beside `VERBOSE` and `OVERALL_PERCENTAGE` (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T005 Add the `--min-percent) MIN_PERCENT="${2:-}"; shift 2 ;;` arm to the argument loop, reading the value as `${2:-}` so `set -u` cannot abort on a trailing flag (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T006 Add `validate_min_percent()` and call it after parsing but before the folder is read; reject a non-integer or an out-of-range value with a stderr message naming the option and exit `1` (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T007 Assign `REPORTED_PERCENTAGE` from `OVERALL_PERCENTAGE` in folder mode and from the sourced `percentage` in `--file` mode, and set it to `0` in the NOT FOUND branch, without changing a printed line (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T008 Replace the closing `exit 0` with the gate: `exit 3` when `MIN_PERCENT` is set and `REPORTED_PERCENTAGE` is below it, otherwise `exit 0` (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T009 Add the `--min-percent <N>` line to the help OPTIONS block and an example, and document status `3` in the trailing exit-code comment (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Add cases for below/at/above the floor asserting statuses `3`, `0`, `0` against a packet with a deterministic percentage (`.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts`)
- [ ] T011 Add cases asserting stdout is identical with and without the flag, in text mode and under `--json` (`.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts`)
- [ ] T012 Add cases for a missing value, `abc`, `-1` and `101`, each asserting exit `1`, empty stdout and an option-naming stderr message (`.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts`)
- [ ] T013 Add a `--file` case above the file's percentage and its `--json` counterpart, asserting the status survives with the payload intact (`.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts`)
- [ ] T014 Run the vitest file and confirm the new cases and the two pre-existing cases all pass (`.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts`)
- [ ] T015 Diff the report of a real packet with and without `--min-percent 50`, and confirm the help text names the option (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `REQ-001` through `REQ-006` each have an executed check recorded against them
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
