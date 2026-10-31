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

- [ ] T001 Read the argument loop, the two percentage calculations and the trailing exit-code block; record the four lines the change must touch (`calculate-completeness.sh:544-562`, `:290-303`, `:587-591`) (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T002 Capture the baseline: run the script on this packet and on one `--file` target, then on the `--verbose`, `--json` and `--quality` variants, saving stdout, stderr and exit status for each (`specs/zz-bench-authoring/001-completeness-min-percent/scratch/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add `MIN_PERCENT=""` to the globals block beside `SINGLE_FILE` (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T004 Add the `--min-percent)` arm to the argument loop, reading `$2` and shifting two, matching the `--file` arm (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T005 Add `validate_min_percent` that rejects an empty value, a non-digit string and a value above `100` with a stderr message and exit `1` (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T006 Call `validate_min_percent` after the argument loop and before the folder/`bc` checks, so a bad value fails before any work runs (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T007 Resolve the reported percentage after the output call and exit `3` when `MIN_PERCENT` is set and the percentage is below it, leaving the existing `exit 0` as the fall-through (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T008 Document `--min-percent <N>` in `show_help` and add the `3` meaning to the trailing exit-code comment block (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T014 Add a `min_percent_met` boolean to the folder-mode JSON object, `true` when `OVERALL_PERCENTAGE` is at or above `MIN_PERCENT` and `false` otherwise, emitted only when both `--json` and `--min-percent` are passed (REQ-008) (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run `bash -n` on the edited script and record the exit status (`calculate-completeness.sh`)
- [ ] T010 Diff each baseline capture against the same invocation with `--min-percent` added; every diff must be empty (`specs/zz-bench-authoring/001-completeness-min-percent/scratch/`)
- [ ] T011 Boundary table: `N` equal to the reported percentage exits `0`, `N` one above exits `3`, `N=0` exits `0`, `N=100` on an incomplete folder exits `3` (`calculate-completeness.sh`)
- [ ] T012 Malformed table: missing value, `abc`, `-1`, `101` and `--min-percent --json` each exit `1` with empty stdout and a stderr message (`calculate-completeness.sh`)
- [ ] T013 Regression: the no-option, `--verbose`, `--json`, `--file` and `--quality` runs exit exactly as the T002 baseline recorded (`calculate-completeness.sh`)
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
