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

- [ ] T001 Pick the fixture pair - one spec folder whose report lands below 90% and one whose report lands at or above it - and record both reports plus their exit status (`specs/zz-bench-authoring/001-completeness-min-percent/scratch/before/fixtures.txt`)
- [ ] T002 [P] Record the current baseline: text and `--json` stdout, stderr and exit status for each fixture, so the later diff has something to compare against (`specs/zz-bench-authoring/001-completeness-min-percent/scratch/before/baseline.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add `MIN_PERCENT=""` to the globals and the `--min-percent` case to the option loop (`set -euo pipefail` section 3 and section 8 of `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T004 Add `validate_min_percent`, rejecting a missing value, a non-integer and anything outside 0 to 100 with the script's `ERROR:` plus `Use --help` shape and exit 1 (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T005 Add `reported_percentage`, resolving `OVERALL_PERCENTAGE` in folder mode and the stats-file `percentage` in `--file` mode, so the gate reads the number the report printed (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T006 Add the gate after the output call, exiting 3 below `MIN_PERCENT` and 0 otherwise, and name the option in the `--help` block, the header usage comment and the trailing exit-code comment (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
- [ ] T011 Implement REQ-006: when `--json` and `--min-percent` are set together, add a boolean `min_percent_met` field to the JSON output, true when Overall Completion is at or above N and false otherwise, leaving every existing field unchanged (`.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Diff stdout and stderr with and without the option for both fixtures, in text and `--json` mode, and again with `--verbose` and `--quality` (`specs/zz-bench-authoring/001-completeness-min-percent/scratch/after/output-identity.txt`)
- [ ] T008 Run the exit matrix: below the threshold, exactly at it and above it, in folder mode and in `--file` mode, and confirm the report still prints in every case (`specs/zz-bench-authoring/001-completeness-min-percent/scratch/after/exit-matrix.txt`)
- [ ] T009 Run the input matrix: missing value, `abc`, `-1`, `101` and an empty string, each expecting exit 1 with an `ERROR:` line on stderr and no report on stdout (`specs/zz-bench-authoring/001-completeness-min-percent/scratch/after/input-matrix.txt`)
- [ ] T010 [P] Rerun `archive.sh`'s `--json` completeness call against a complete folder and confirm it still parses and exits 0 (`specs/zz-bench-authoring/001-completeness-min-percent/scratch/after/archive-call.txt`)
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
