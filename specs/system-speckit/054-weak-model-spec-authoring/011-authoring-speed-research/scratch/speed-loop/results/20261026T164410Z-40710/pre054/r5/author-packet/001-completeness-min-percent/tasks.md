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

- [ ] T001 Read the argument loop, `show_help` and the exit-code footer in `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` and record the three insertion points (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T002 Capture baseline stdout and stderr for a fixture packet in text and `--json` mode, so the unchanged-output check has something to compare against (`.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts`)
- [ ] T003 [P] Run the existing script test file and confirm it is green before any edit (`.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add a `MIN_PERCENT` global with an empty default beside `VERBOSE`, `JSON_OUTPUT`, `QUALITY_CHECK` and `SINGLE_FILE` (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T005 Add the `--min-percent` arm to the argument `case` loop, consuming the next argument (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T006 Validate `N` as an integer in 0-100 and exit 1 with a usage message on stderr when it is missing, non-numeric or out of range (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T007 Add the post-report verdict: compare the figure the report presented against `MIN_PERCENT` and exit 3 below it, 0 at or above it, using the explicit `if` form rather than a bare test (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T008 Document the option and exit code 3 in `show_help` and add 3 to the exit-code footer comment (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T009 Add the four test cases: threshold passes at equality, threshold fails below, malformed `N` exits 1, and stdout plus stderr are identical with and without the option (`.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run the script test file from `.skilled/skills/system-spec-kit/runtime/cli` and confirm every case passes, including the pre-existing two (`.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts`)
- [ ] T011 Diff stdout and stderr from a run with and without `--min-percent` on the same fixture in text and `--json` mode; expect no differences (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T012 Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/zz-bench-authoring/001-completeness-min-percent --strict` and confirm it reports `RESULT: PASSED` (`.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh`)
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
