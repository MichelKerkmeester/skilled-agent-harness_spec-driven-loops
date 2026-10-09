---
title: "Tasks: External-user compatibility path for /doctor:update"
description: "Wire the check and action, build collision checking, test preview and approval flows."
trigger_phrases:
  - "doctor update compatibility tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: External-user compatibility path for /doctor:update

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

- [x] T001 Create fixture v3 repo with old-era packets for testing (tests/). Built in temp directories by the two compat test files at run time, not committed as fixture files.
- [x] T002 Read Phase 8 era report output format and error cases (repo-era.mjs usage). The fields the check reads are listed as `era_report_fields` in `doctor-update-check.yaml`.
- [x] T003 [P] Design path map collision detection algorithm (sketch on paper or in comments). Built as `compareLayoutTrees` in `upgrade-legacy.mjs`.
- [x] T030 Confirm phases 005, 006, 008 and 010 have landed before this phase ships (parent D2). Their spec.md Status rows read Complete as of 2026-10-09.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement path map collision-check function in upgrade-legacy.mjs (new function, location to choose, does not modify existing functions). Added `planLayoutMove`, `compareLayoutTrees`, `partialLayoutMove` and `layoutRootCollision`. The file's entry point changed too: `main()` now runs only on a direct run, see implementation-summary.md Deviations.
- [x] T005 Build compatibility section in doctor-update-check.yaml that calls era report (doctor-update-check.yaml:new section). Added `phase_3_compatibility`.
- [x] T006 Create doctor-update-compat-action.yaml workflow: preview, collision check, approval, move, upgrade (doctor-update-compat-action.yaml). 173 lines, parses as YAML.
- [x] T007 Update doctor/_routes.yaml to point the existing "spec-kit version migration" phrase to the new compatibility action workflow (doctor/_routes.yaml:update existing route). The phrase now sits on the `compat` route.
- [x] T008 Add compatibility menu option to doctor presentation assets (doctor-update-presentation.txt). The router menu lists compat, and section 10 "Compatibility Action" holds the templates.
- [x] T009 Update doctor/update.md with external-user workflow documentation (update.md:new section). Added section 7, External-User Compatibility Path.
- [x] T010 Add error handling for dirty trees, interrupted moves, and failed repairs. Written into phases 1, 2, 4 and 7 of the action YAML. Covered by tests for the dirty root, the tree dirtied after approval and the interrupted runs.
- [x] T011 Add parser/action guard to detect partial or complete v3 layout moves and handle appropriately (show both, skip move step if complete, or recommend finishing if partial). The state routing in phase 2 of the action YAML covers v3, partial, v4 and none, and each state has a test.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Test path map collision checker with fixture paths, add cases to `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts` or `.skilled/commands/doctor/scripts/tests/*.test.cjs`. Cases are in `doctor-update-compat.test.cjs` (`collisions stop the move and list both paths with their reasons`).
- [x] T013 Test /doctor:update check calls era report and shows results (manual or bash test). The contract test pins the two check commands and the fixture tests run them. The rendered Layout line is a presentation template and was not run live.
- [ ] T014 Test compatibility action workflow: preview, approval, move, upgrade on fixture v3 repo. Preview, move and upgrade are run by the integration test. The approval prompts are not exercised by any test and need a manual run. Closeout 2 (2026-10-09): stays open, because the approval step needs the manual run named here.
- [x] T015 Test edge cases: dirty tree rejection, interrupted move recovery, failed packet handling. Dirty root and dirty-after-approval refusals, three interrupted-run tests and the failed-packet parse test pass. The release lock refusal and a failed move step are not tested. Closeout 2 (2026-10-09): the failed move step is now pinned by `a move step that cannot complete stops the run and reports the failed step` (`gates/closeout2-009/compat-unit.log`, 21 of 21, rc 0). The release lock refusal is still not tested.
- [ ] T016 Full integration test: fixture v3 repo through check → preview → approve → apply → validation passes. The integration test passes through preview, move, upgrade and validation. The approve step is not run by the suite. Closeout 2 (2026-10-09): stays open, because the approve step is part of the manual run.
- [x] T017 Update spec.md, plan.md for closure (this folder). Closeout 2 (2026-10-09): done. spec.md, plan.md, acceptance-criteria.md, tasks.md and implementation-summary.md were brought to the built state.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 to REQ-007 in spec.md section 4)
- [x] CHK-002 [P0] Technical approach defined in plan.md (plan.md sections 2 and 3, synchronized to the build at close)
- [x] CHK-003 [P1] Dependencies identified and available (phases 005, 006, 008 and 010 are Complete, see T030, `git` is on PATH and the tests build repositories with it)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (`node --check upgrade-legacy.mjs` exits 0, the three edited YAML files parse, and the wave gate `npm --prefix .skilled/skills/system-spec-kit/runtime/cli run check` returned rc 0 in tree3, see implementation-summary.md Verification. Closeout 2 (2026-10-09): the same check returned rc 0 in tree4, `gates/tree4/cli-check.rc` and `cli-check.log`. Closeout 3 (2026-10-09): the same check returned rc 0 in tree5, `gates/tree5/cli-check.rc`)
- [x] CHK-011 [P0] No console errors or warnings (`grep -n "console\." upgrade-legacy.mjs` finds nothing, the layout code writes through `process.stdout` and `process.stderr`)
- [x] CHK-012 [P1] Error handling implemented (refusals for a dirty spec root, a collision, a held release lock, a failed step, an unexpected upgrade exit and a manifest refusal are in the workflow and the presentation, the dirty root, collision and interrupted cases have tests)
- [x] CHK-013 [P1] Code follows project patterns (judged from the diff: the new functions sit under the file's section banners and use its `process.stderr.write` and `process.exitCode` style, the tests reuse the doctor suite's `node:test` layout)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (see acceptance-criteria.md, AC-007 depends on the tree3 gate). Closeout 2 (2026-10-09): every row is Met. AC-007 is Met on `gates/closeout2-009/root-test-bound-raised.log` (rc 0), and its sub-steps are listed in that row. Closeout 3: AC-007 is also re-cited to `gates/tree5/root-test.log`, which ends with rc 0. Closeout 4 (2026-10-09): that log is the AC-007 evidence, and it ran on the final code (see that row).
- [ ] CHK-021 [P0] Manual testing complete (not done: no operator-run `/doctor:update compat` session on a real v3 repository. The fixture and CLI runs are recorded in acceptance-criteria.md)
- [x] CHK-022 [P1] Edge cases tested (classic v3, partial, v4, dirty spec root, tree dirtied after approval, interrupted classic, interrupted before the legacy link, interrupted partial, collisions of three kinds. Not pinned by a test: the release lock refusal, a failed move step, an upgrade that fails after the move) Closeout 2 (2026-10-09): the failed move step is now pinned, so the gaps left are the release lock refusal and an upgrade that fails after the move.
- [ ] CHK-023 [P1] Error scenarios validated (not complete: the lock refusal, a failed move step and the manifest refusal have no test. The dirty root, collisions and interrupted runs are covered) Closeout 2 (2026-10-09): the failed move step is now covered by its own case. The lock refusal and the manifest refusal have no executable path in this test harness, so they stay open until a test can reach them.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. (review round 1: F1 algorithmic, the recovery-aware skip rules, F2 instance-only, the dry-run wording in update.md, F3 instance-only, era_report removed from the action preflight, F4 instance-only, the dirty re-check missing from phase 4 only. Final Opus review F5 instance-only, the rollback block missing the legacy root undo and the parent directories.)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. (`grep -n dirty_check_command` on the action YAML finds the check in phase 2 and phase 4 only, and phase 4 now has it, the other mutating step, the upgrade, is guarded by upgrade-legacy's own dirty handling, covered by 010.)
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. (`planLayoutMove` has one caller, the `--layout-map` branch, and the tests, the router and the contract test name map point to the new `doctor-update-compat-action.yaml`, update.md and the doctor tests README list the new suites.)
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. (open: the rollback fix derives parent directories from logged `mv` argv, and no adversarial table test was added for it. The layout code builds paths from fixed roots and has no user path input.) Closeout 2 (2026-10-09), not applicable: the rollback is operator guidance text in the action YAML and the presentation, not code, so no adversarial table test is owed for it. The first-pass note above stays as the record of why it was open.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. (no test matrix: the axes are the layout states v3, partial, v4 and none, plus the dirty, interrupted and collision cases, each listed in acceptance-criteria.md)
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. (the integration suite strips `GIT_DIR`, `GIT_WORK_TREE` and `SPECKIT_*` variables and points `GIT_CONFIG_GLOBAL` at an empty file, `planLayoutMove` reads no environment variable)
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. (open: the work is not committed yet. It ships as the combined commit for the shared `upgrade-legacy.mjs` file, per parent D6)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (a case-insensitive grep of the added lines for secret, token, password, api key and credential finds nothing)
- [x] CHK-031 [P0] Input validation implemented (the layout map takes no user path: it reads the fixed `.opencode/specs` and `specs` roots under the repository root, and the direct run enters the layout branch only for the exact argument `--layout-map`)
- [x] CHK-032 [P1] Auth/authz working correctly (not applicable: a local command-line workflow with no authentication step)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (spec.md Status, plan.md checklists and the testing and dependency tables, tasks.md, acceptance-criteria.md and implementation-summary.md were brought to the built state at close)
- [x] CHK-041 [P1] Code comments adequate (the comments explain the sort order of the collision lists, why a missing legacy entry is a hard failure in the partial move, and why the entry point compares realpaths)
- [x] CHK-042 [P2] README updated (if applicable) (`update.md` section 7 and `.skilled/commands/doctor/scripts/tests/README.md` list the new compatibility path and its two suites. The spec-kit `spec/README.md` is not changed by this phase.)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (scratch/ holds only `.gitkeep`, the smoke runs wrote to the build scratchpad)
- [x] CHK-051 [P1] scratch/ cleaned before completion (scratch/ holds only `.gitkeep`)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 13 | 11/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-09
<!-- /ANCHOR:summary -->

---
