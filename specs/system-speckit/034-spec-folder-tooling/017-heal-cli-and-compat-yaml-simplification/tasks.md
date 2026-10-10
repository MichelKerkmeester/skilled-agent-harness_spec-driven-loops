---
title: "Tasks: Phase 17: heal-cli-and-compat-yaml-simplification"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "heal cli and compat yaml simplification tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 17: heal-cli-and-compat-yaml-simplification

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

- [x] T001 Record the CLI suite's pass and fail counts before any change (`npm --prefix .skilled/skills/system-spec-kit/runtime/cli test`, raw output to `scratch/`) [evidence: `scratch/baseline-summary.txt`, CLI suite 171 files passed and 3 skipped, 1775 tests passed, 19 skipped, 0 failed]
- [x] T002 Add the refusal-order case: refusals from two or more modes across two or more documents, asserting the exact `refusals` array (`tests/upgrade-legacy.vitest.ts`) [evidence: commit c98cfc2682, case `records lane-mode refusals in mode, document and reason order`, four modes across three documents]
- [x] T003 Show the case is discriminating: with the sort call bypassed locally it fails, and restored it passes (`upgrade-legacy.mjs:1159`, not committed) [evidence: `scratch/mutation-results.txt`, the unmutated run passes and all five sort mutations (no sort, no mode key, no document key, no reason key, document and reason swapped) fail the case]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Phases 2 and 3 of the plan edit the same function, the same README lines and the same test case, so they shipped as one commit, d4221e892f, which names both flags.

- [x] T004 Remove the `--mode` parsing and its unknown-mode error, and pass no `modes` from the CLI (`heal-spec-docs.cjs:1363-1379`, `:1390`) [evidence: commit d4221e892f, `scratch/recheck.txt` shows no `--mode` left in `heal-spec-docs.cjs` and the base commit does show it]
- [x] T005 Remove `--mode` from the usage comment, the README row and the README usage line, and the unknown-mode assertions (`heal-spec-docs.cjs:23`, `spec/README.md:113`, `:271`, `heal-lane-modes.vitest.ts:587-591`) [evidence: commit d4221e892f, `scratch/recheck.txt` shows no removed flag left in the README]
- [x] T006 Rerun the phase 15 two-pass corpus check from plain output on a scratch copy, and record each count AC-019 names (raw output to `scratch/`) [evidence: `scratch/corpus-summary.txt`, 42403 copied `.md` files, pass 1 applied 264 and refused 132 with 132 changed files, pass 2 applied 0 and the same 132 refusals, copy hashes unchanged]
- [x] T007 Remove the `--json` branch, its usage text, README bracket and assertions, and rename the case to `lane-modes-cli-dry-run` (`heal-spec-docs.cjs:1362`, `:1392-1395`, `:23`, `spec/README.md:271`, `heal-lane-modes.vitest.ts:567-585`) [evidence: commit d4221e892f, the renamed case passes in `scratch/vitest-two-summary.txt`]
- [x] T008 [P] Fold `step_failure` into `on_step_failure`, keeping every clause of both (`doctor-update-compat-action.yaml:125-126`) [evidence: commit 26179f4be7]
- [x] T009 [P] Point the five failed-step phrase checks at `on_step_failure` (`doctor-update-compat.test.cjs:823-827`) [evidence: commit 26179f4be7, the test also asserts `step_failure` is undefined]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the two vitest files and the doctor test, raw output to `scratch/` [evidence: `scratch/vitest-two-summary.txt` 2 files and 82 tests passed, `scratch/doctor-summary.txt` 21 passed and 0 failed]
- [x] T011 Rerun the CLI suite and compare with T001 [evidence: `scratch/cli-summary.txt`, 171 files passed and 3 skipped, 1776 tests passed, 19 skipped, 0 failed, one more passing test than T001 and that one is the new order case, every companion suite count equals `scratch/baseline-summary.txt`]
- [x] T012 Search the repo for `--mode`, `--json` and `step_failure` outside `specs/` and record each remaining hit's owner [evidence: `scratch/search.txt` and `scratch/recheck.txt`, no tracked file outside `specs/` names `--lane-modes` with a removed flag, and `step_failure` survives only as `on_step_failure` in the compat YAML and its test plus that test's assertion that the old key is undefined, all owned by the doctor compat command]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every row in `acceptance-criteria.md` is Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `../016-research-recommendations/research/research.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md [evidence: spec.md REQ-001 to REQ-006]
- [x] CHK-002 [P0] Technical approach defined in plan.md [evidence: plan.md section 4]
- [x] CHK-003 [P1] Dependencies identified and available [evidence: plan.md section 6, operator answer 2026-10-09]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` passes on `heal-spec-docs.cjs`, and the YAML parses in its test [evidence: `scratch/recheck.txt` node --check exit 0, and the doctor test that loads the YAML passes 21 of 21 in `scratch/doctor-summary.txt`]
- [x] CHK-011 [P0] No new warning in the two vitest files or the doctor test [evidence: the doctor run prints no warning, the two-file run prints only the Vite config notice about `vitest.config.ts` that this change does not touch, and `scratch/recheck.txt` counts 73 warning-like lines in the baseline CLI run and 73 in the final one]
- [x] CHK-012 [P1] No error path was removed except the unknown-mode error, which went with its flag [evidence: commit d4221e892f removed two errors, the missing mode name and the unknown mode, and both belonged to the `--mode` parser, no other error path changed]
- [x] CHK-013 [P1] No ids or spec paths added to code comments [evidence: `scratch/recheck.txt`, the id search over the comment lines the code commits added finds nothing, and the same search matches a planted comment]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [evidence: `acceptance-criteria.md` AC-001 to AC-007 all Met]
- [x] CHK-021 [P0] The corpus two-pass from plain output ran (T006) [evidence: `scratch/corpus-summary.txt`]
- [x] CHK-022 [P1] The order test fails with the sort bypassed (T003) [evidence: `scratch/mutation-results.txt`]
- [x] CHK-023 [P1] The CLI suite shows no failure beyond T001's count [evidence: `scratch/cli-summary.txt` against `scratch/baseline-summary.txt`, 0 failed in both]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each recommendation has a finding class: all four are `instance-only` [evidence: plan.md affected-surfaces inventories]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed [evidence: only `runLaneModesCli` parses `--mode` or `--json`, `heal-spec-docs.cjs:644-646` and `:1416-1418` parse neither]
- [x] CHK-FIX-003 [P0] Consumer inventory rerun after the edits (T012) [evidence: `scratch/search.txt` and `scratch/recheck.txt`]
- [x] CHK-FIX-004 [P0] No security, path, parser or redaction logic changes, so no adversarial table applies [evidence: spec.md scope]
- [x] CHK-FIX-005 [P1] Matrix axes: none [evidence: plan.md affected-surfaces]
- [x] CHK-FIX-006 [P1] No test or changed code reads new process-wide state [evidence: spec.md files to change]
- [x] CHK-FIX-007 [P1] Evidence is pinned to each phase's commit SHA [evidence: phase 1 is c98cfc2682, phases 2 and 3 are d4221e892f, phase 4 is 26179f4be7]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [evidence: `scratch/recheck.txt`, no secret-like string in the lines the code commits added]
- [x] CHK-031 [P0] The `--apply` gate is unchanged: a dry run still writes nothing (`lane-modes-cli-dry-run`) [evidence: the case asserts the packet manifest is identical after a dry run and passes in `scratch/vitest-two-summary.txt`, and the diff keeps `apply` passed to `runLaneModes`]
- [x] CHK-032 [P1] No auth surface is touched [evidence: spec.md files to change]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [evidence: this commit sets spec.md, plan.md, tasks.md, acceptance-criteria.md and implementation-summary.md to the same complete state]
- [x] CHK-041 [P1] The usage comment at `heal-spec-docs.cjs:23` matches the parsed flags [evidence: `scratch/recheck.txt` lines 20 to 24 list only `--roots`, `--folder` and `--apply` for `--lane-modes`]
- [x] CHK-042 [P2] CLI README updated at lines 113 and 271 [evidence: commit d4221e892f]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [evidence: the 42403-file corpus copy and the full run logs stayed in the session scratch area outside the repository, and the scoped diff lists only the intended files]
- [x] CHK-051 [P1] scratch/ cleaned before completion [evidence: `scratch/` holds only the eight small evidence files this packet cites]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-09
<!-- /ANCHOR:summary -->

---



