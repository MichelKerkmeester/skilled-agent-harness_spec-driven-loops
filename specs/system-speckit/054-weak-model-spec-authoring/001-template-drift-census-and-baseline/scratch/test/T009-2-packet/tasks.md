---
title: "Tasks: Add a quiet flag to recommend-level.sh"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "recommend level quiet flag tasks"
  - "recommend-level.sh quiet tasks"
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

- [ ] T001 Read the parse loop, the GLOBALS block and both output functions (`recommend-level.sh`)
- [ ] T002 Capture the default text baseline for a low, a medium and a high input set (`scratch/baseline-text-*.txt`)
- [ ] T003 Capture the JSON baseline for the same three input sets (`scratch/baseline-json-*.json`)
- [ ] T004 [P] Inventory the callers of the script and confirm which ones read JSON (`plan.md` affected-surfaces table)
- [ ] T005 [P] Record the pre-change one-line shapes to assert against: quiet line regex and default first line (`scratch/baseline-shapes.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Add `QUIET=false` to section 2 GLOBALS beside `JSON_OUTPUT` (`recommend-level.sh`)
- [ ] T007 Add the `--quiet` arm to the argument loop, setting `QUIET=true` and shifting one token (`recommend-level.sh`)
- [ ] T008 Add the leading quiet branch to `output_text()` that prints the level line and returns (`recommend-level.sh`)
- [ ] T009 Add the `--quiet` line to the file header `OPTIONS:` block (`recommend-level.sh`)
- [ ] T010 Add the `--quiet` line to `show_help()` and place it near `--json, -j` (`recommend-level.sh`)
- [ ] T011 Confirm `output_json()` is untouched and `--json` still takes precedence over quiet (`recommend-level.sh`)
- [ ] T012 Run `bash -n` on the modified script (`recommend-level.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Run `--quiet` for the low, medium and high input sets and assert one line each (`scratch/quiet-*.txt`)
- [ ] T014 Assert the quiet line matches `^Recommended Level: [0-3] \([A-Za-z]+\)$` for all three sets (`scratch/quiet-*.txt`)
- [ ] T015 Diff the default text runs against the captured baselines and require an empty diff (`scratch/baseline-text-*.txt`)
- [ ] T016 Diff the `--json` runs against the captured baselines and require an empty diff (`scratch/baseline-json-*.json`)
- [ ] T017 Compare `--quiet --json` to `--json` and require byte equality plus a successful JSON parse (`scratch/json-quiet-*.json`)
- [ ] T018 Verify `--quiet` with no input, bad `--loc`, bad `--phase-threshold` and an unknown option: exit 1, stdout empty, message on stderr (`scratch/err-*.txt`)
- [ ] T019 Verify `--quiet --help` prints the full help and exits 0 (`scratch/help-quiet.txt`)
- [ ] T020 Verify `--quiet` twice and `--quiet` in both argument positions still print one line (`scratch/quiet-order.txt`)
- [ ] T021 Record the observed results in `implementation-summary.md` (`implementation-summary.md`)
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
- **Acceptance criteria**: See `acceptance-criteria.md`
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

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001 through REQ-007)
- [ ] CHK-002 [P0] Technical approach defined in plan.md, including the quiet branch placement
- [ ] CHK-003 [P1] Dependencies identified and available: bash, python3 for the JSON assertion
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `bash -n` passes on the modified script
- [ ] CHK-011 [P0] The quiet path prints no blank line, score line, breakdown or phase block
- [ ] CHK-012 [P1] The header `OPTIONS:` block and `show_help()` list the same option set
- [ ] CHK-013 [P1] The change follows the script's existing shape: global, parse arm, output branch
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met with observed evidence in `acceptance-criteria.md`
- [ ] CHK-021 [P0] Quiet output is exactly one line for the low, medium and high input sets
- [ ] CHK-022 [P1] Default text output and JSON output diff empty against the captured baselines
- [ ] CHK-023 [P1] Error scenarios validated: exit 1, stdout empty, message on stderr
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Not applicable. This packet adds an option; it does not remediate a review finding, so there is no
finding class, no same-class producer repair, and no adversarial delimiter matrix to discharge. The
closest analogue, the output matrix across three input scales and four output modes, is enumerated
in `plan.md` §5 and executed by T013-T020.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets or credentials added
- [ ] CHK-031 [P0] Input validation unchanged for `--loc`, `--files` and `--phase-threshold`
- [ ] CHK-032 [P1] `--quiet` consumes no argument, so no new value reaches the parser
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks stay synchronized after the implementation
- [ ] CHK-041 [P1] File header `OPTIONS:` and `show_help()` both document `--quiet`
- [ ] CHK-042 [P2] Confirmed README and SKILL.md tool tables carry no option list, so neither needs an edit
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Baselines and run captures live under `scratch/` only
- [ ] CHK-051 [P1] `scratch/` contents are listed or removed before completion, and no file outside the packet changed
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-23
<!-- /ANCHOR:summary -->

---
