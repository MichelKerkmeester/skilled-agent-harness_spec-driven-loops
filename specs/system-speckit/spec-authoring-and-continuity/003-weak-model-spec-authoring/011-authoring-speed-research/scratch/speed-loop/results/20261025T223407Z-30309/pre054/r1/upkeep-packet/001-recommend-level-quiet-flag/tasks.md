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

Evidence for a completed task names the command and what its output showed. An exit code alone is not evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture the current default stdout for `--loc 500 --files 15 --auth --api --db --architectural` into `scratch/baseline-default.txt` and the JSON stdout for `--loc 50 --files 2 --json` into `scratch/baseline-json.txt` (specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/)
- [ ] T002 Read the globals block, the parser, the output functions and the validation block, and record the line anchors for the edits (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`)
- [ ] T003 Read the `runBash` helper and the sandbox setup in the existing node test, and confirm `test:legacy` is the CI entry (`.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-validation.js`, `.skilled/skills/system-spec-kit/runtime/cli/package.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add `QUIET=false` beside `JSON_OUTPUT` in the globals block (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` §2)
- [ ] T005 Add the `--quiet` arm to the argument parser (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` §5)
- [ ] T006 Add `format_level_line` and `output_quiet`, and route `output_text` through the formatter (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` §4)
- [ ] T007 Add the mode guard that rejects `--quiet` with `--json`, ahead of the numeric checks (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` §5)
- [ ] T008 Add `--quiet` to the header OPTIONS block and one example (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` header comment)
- [ ] T009 Add `--quiet` to `show_help` (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` `show_help`)
- [ ] T010 Write the smoke test covering the eight cells of the output matrix (`.skilled/skills/system-spec-kit/runtime/cli/tests/test-recommend-level.js`)
- [ ] T011 Register the new test in the `test:legacy` script (`.skilled/skills/system-spec-kit/runtime/cli/package.json`)
- [ ] T017 Keep warnings on stderr in quiet mode, adding no stderr redirection to the quiet branch and asserting the `--quiet` stderr matches the default run (REQ-011) (`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` §4, `.skilled/skills/system-spec-kit/runtime/cli/tests/test-recommend-level.js`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Run the new test and read every PASS line (`.skilled/skills/system-spec-kit/runtime/cli/tests/test-recommend-level.js`)
- [ ] T013 Run the full legacy suite and confirm no existing test regressed (`.skilled/skills/system-spec-kit/runtime/cli/package.json` `test:legacy`)
- [ ] T014 Diff default stdout against `scratch/baseline-default.txt` and JSON stdout against `scratch/baseline-json.txt` (`specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/`)
- [ ] T015 Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/zz-bench-authoring/001-recommend-level-quiet-flag --strict` and require `RESULT: PASSED` (`specs/zz-bench-authoring/001-recommend-level-quiet-flag/`)
- [ ] T016 Fill `implementation-summary.md` with the evidence from T012 to T015 (`specs/zz-bench-authoring/001-recommend-level-quiet-flag/implementation-summary.md`)
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

- [ ] CHK-001 [P0] Requirements and success criteria recorded in spec.md (REQ-001 to REQ-010, SC-001 to SC-008)
- [ ] CHK-002 [P0] Output contract and mode guard defined in plan.md §3 and ADR-001
- [ ] CHK-003 [P1] Baseline captured before the first edit to the output path (T001)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `bash -n recommend-level.sh` exits 0
- [ ] CHK-011 [P0] The quiet path writes nothing to stderr on success
- [ ] CHK-012 [P1] `format_level_line` is the only renderer of the level line
- [ ] CHK-013 [P1] The new code keeps the file's section layout and comment style
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every criterion in `acceptance-criteria.md` is Met with its Verification command run
- [ ] CHK-021 [P0] `node tests/test-recommend-level.js` passes every assertion
- [ ] CHK-022 [P1] Default text and JSON stdout match the T001 baseline byte for byte
- [ ] CHK-023 [P1] The guard case, the empty-input case and the non-numeric case each exit 1 with empty stdout
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Not a fix packet. There is no finding, no same-class producer sweep and no adversarial table to build. The one invariant that matters here, the frozen default stdout, is covered by CHK-022 and T014.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secret, token or environment value added to the script or the test
- [ ] CHK-031 [P0] `--quiet` takes no value and validates no new input
- [ ] CHK-032 [P1] The quiet path opens no file, network connection or child process
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md, plan.md and tasks.md agree on the flag name, the line format and the guard
- [ ] CHK-041 [P1] The header comment and `show_help` list `--quiet` with the same wording
- [ ] CHK-042 [P1] ADR-001 in plan.md carries a status, a decision and the rejected alternatives, and matches the guard in T007
- [ ] CHK-043 [P2] `references/workflows/execution-methods.md` left unchanged, with the reason recorded in spec.md §3
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Baseline captures stay in `scratch/` and are not added as committed fixtures
- [ ] CHK-051 [P1] `scratch/` holds only the two baseline files when the packet closes
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->

---

