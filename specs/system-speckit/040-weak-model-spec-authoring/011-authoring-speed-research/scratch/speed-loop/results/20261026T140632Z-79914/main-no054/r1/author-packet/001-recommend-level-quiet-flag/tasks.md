---
title: "Tasks: Add a quiet flag to recommend-level.sh"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "recommend level quiet flag tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->

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

- [ ] T001 Read `recommend-level.sh` and record the current output functions (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T002 Capture the baseline text, JSON and no-phase output into `scratch/` (`specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/`)
- [ ] T003 [P] Capture the baseline `--help` output for a later diff (`specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/help-baseline.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the `QUIET=false` global beside `JSON_OUTPUT` (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T005 Add the `--quiet` case arm to the argument parser (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T006 Add `print_recommended_level_line()` and call it from the full report (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T007 Add the early quiet branch to `output_text()` (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T008 [P] Add `--quiet` to the header comment OPTIONS block (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T009 [P] Add `--quiet` and one example to `show_help()` (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Confirm the no-flag text output matches the baseline with `diff` (`specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/baseline-text.txt`)
- [ ] T011 Confirm quiet output is one line and matches the expected string (`specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/quiet-line.txt`)
- [ ] T012 Confirm `--quiet --json` matches the JSON baseline (`specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/baseline-json.txt`)
- [ ] T013 Exercise the flag matrix: repeated flag, both positions, `--no-recommend-phases`, `--phase-threshold` (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T014 Confirm error paths still exit 1 with empty stdout under `--quiet` (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T015 Confirm `--help` lists `--quiet` (`specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/help-baseline.txt`)
- [ ] T016 Run the existing phase-system suite (`node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Baseline diff clean and quiet line verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Baselines captured in `scratch/` before the first edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `bash -n recommend-level.sh` reports no syntax error
- [ ] CHK-011 [P0] The changed lines follow the existing function and quoting style
- [ ] CHK-012 [P1] Every new variable is `local` or declared beside the other globals
- [ ] CHK-013 [P1] The quiet branch returns before any other output
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] AC-001 through AC-011 met with recorded evidence
- [ ] CHK-021 [P0] Baseline diff clean for the text and JSON reports
- [ ] CHK-022 [P1] Edge cases from spec.md section 8 exercised
- [ ] CHK-023 [P1] Error paths keep exit 1 and empty stdout
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Not applicable. This packet adds a feature, so no review finding needs a class.
- [ ] CHK-FIX-002 [P0] Not applicable. No producer is being fixed.
- [ ] CHK-FIX-003 [P0] Consumer inventory done: `output_text`, `output_json`, `show_help` and the header comment.
- [ ] CHK-FIX-004 [P0] Not applicable. No path, parser or redaction boundary changes.
- [ ] CHK-FIX-005 [P1] Matrix axes listed in plan.md before completion is claimed.
- [ ] CHK-FIX-006 [P1] Not applicable. The script reads no process-wide environment state.
- [ ] CHK-FIX-007 [P1] Evidence pinned to the commit that carries the change.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secret or credential enters the script
- [ ] CHK-031 [P0] The flag takes no value, so there is no new input to validate
- [ ] CHK-032 [P1] Error text stays on stderr under `--quiet`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md and tasks.md agree on the one-line contract
- [ ] CHK-041 [P1] The header comment and `show_help()` list the same options
- [ ] CHK-042 [P2] Any CLI flag list in the docs mentions `--quiet`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Baseline files live in `scratch/` only
- [ ] CHK-051 [P1] `scratch/` holds no result the packet needs after closure
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending implementation
<!-- /ANCHOR:summary -->

---
