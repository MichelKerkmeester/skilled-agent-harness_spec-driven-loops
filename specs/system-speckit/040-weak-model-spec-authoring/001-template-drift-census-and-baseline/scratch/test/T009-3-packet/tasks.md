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

<!-- SPECKIT_LEVEL: 2 -->

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

- [ ] T001 Capture the pre-change default report for three input shapes, Level 0, Level 1 and Level 3 (`specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/before/text/`)
- [ ] T002 Capture the pre-change `--json` document for the same three inputs (`specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/before/json/`)
- [ ] T003 [P] Read `output_text`, the argument loop and `show_help` so the edit lands at the existing seam (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `QUIET_OUTPUT=false` beside the existing `JSON_OUTPUT` global (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T005 Add a `--quiet` arm to the argument loop that sets the boolean and shifts one, with no value (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T006 Add the quiet branch at the top of `output_text` that prints the existing level-line string and returns before the score, breakdown and phase sections (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T007 [P] Document the flag in the header `OPTIONS` block and in the `show_help` heredoc (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T008 [P] Add the `--quiet` row to the feature-flag table (`.skilled/skills/system-spec-kit/references/workflows/execution-methods.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Probe quiet output for the three input shapes and confirm exactly one line each, with a single trailing newline (`specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/after/quiet/`)
- [ ] T010 Diff the default report against the Phase 1 captures for all three shapes and confirm no difference (`specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/after/text-diff.txt`)
- [ ] T011 Diff `--json` against `--json --quiet` for all three shapes and parse both with `node -e` (`specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/after/json-diff.txt`)
- [ ] T012 Exercise `--quietly`, repeated `--quiet`, `--loc 0 --files 0 --quiet` and `--quiet --help`, recording exit status and both streams (`specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/after/edges.txt`)
- [ ] T013 Add the quiet cases to the node harness and run it (`runtime/cli/tests/test-phase-system.js`)
- [ ] T014 Run `bash -n` on the script and `npm run test:legacy`, both exit 0 (`.skilled/skills/system-spec-kit/runtime/cli/`)
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
- **Closure verdict**: See `acceptance-criteria.md`
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

- [ ] CHK-001 [P0] Requirements REQ-001 through REQ-006 documented in `spec.md`
- [ ] CHK-002 [P0] Flag, renderer branch and JSON precedence defined in `plan.md`
- [ ] CHK-003 [P1] Pre-change default and JSON output captured for the three probe shapes under `scratch/before/`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `bash -n recommend-level.sh` exits 0 with no syntax error
- [ ] CHK-011 [P0] No new external command, subshell or bash-4-only construct; the macOS bash 3.2 floor holds
- [ ] CHK-012 [P1] The default report diffs clean against the captured baseline for every probe shape
- [ ] CHK-013 [P1] The new arm follows the existing boolean pattern and sits with the other booleans, not among the value-taking arms
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every row in `acceptance-criteria.md` is Met with observed evidence
- [ ] CHK-021 [P0] Quiet output is exactly one line for the Level 0, Level 1 and Level 3 shapes
- [ ] CHK-022 [P1] Edge cases exercised: `--quietly` rejection, repeated `--quiet`, invalid input, `--quiet --help`
- [ ] CHK-023 [P1] `node tests/test-phase-system.js` exits 0 and counts the new quiet cases
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each changed surface is classified as instance-only, class-of-bug, cross-consumer or matrix/evidence before the change is called complete.
- [ ] CHK-FIX-002 [P0] Producer inventory for the level line is complete: `rg -n "Recommended Level:" .skilled/skills/system-spec-kit/runtime`, every hit classified.
- [ ] CHK-FIX-003 [P0] Consumer inventory for `recommend-level.sh` is complete, and every `--json` consumer is confirmed unchanged.
- [ ] CHK-FIX-004 [P0] The input matrix rows are listed before completion: flag, format, phases and input shape, plus flag order.
- [ ] CHK-FIX-005 [P1] Flag order is exercised, with `--quiet` both first and last in the argument list.
- [ ] CHK-FIX-006 [P1] Help output and the header `OPTIONS` block agree on the flag's wording.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the implementing commit or an explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Neither output mode prints a secret, token or absolute operator path
- [ ] CHK-031 [P0] `--quiet` takes no value and reads no file or environment variable
- [ ] CHK-032 [P1] No auth or authorization surface is touched; recorded as not applicable rather than left unchecked
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` agree on the flag's behaviour and on JSON precedence
- [ ] CHK-041 [P1] `--help` output and the file-header `OPTIONS` block both document `--quiet`
- [ ] CHK-042 [P2] The feature-flag table in `references/workflows/execution-methods.md` carries the new row
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Probe output and before/after captures live under `scratch/` only
- [ ] CHK-051 [P1] `scratch/` holds no temporary file at completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending - no verification run yet
<!-- /ANCHOR:summary -->

---
