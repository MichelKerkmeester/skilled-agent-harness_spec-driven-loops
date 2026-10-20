---
title: "Tasks: Phase 26: ci-and-test-runners"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "ci and test runners tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 26: ci-and-test-runners

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

- [x] T001 Take the baselines before any edit Done: the two sk-doc node tests passed 34 and 30 checks, the 33 sk-doc Python tests passed with 1 skipped, the config-shape test passed 6 of 6 and the hooks vitest tree passed 204 of 204 in the provisioned worktree.
- [x] T002 Run the hooks tree in a clean export on node 20.19.5 with a system-only PATH (`scratch/mutation/row17-hermetic-path.txt`) Done: 3 of 204 failed, all Pi preflight tests that need `devin` or `pi` on PATH.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Row 14: run the two self-running node tests by name in sk-doc's runner (`.skilled/skills/sk-doc/scripts/tests/run-script-tests.sh`) Done: with the engine's patch bump changed to +2, the new runner exits 1 and the old one exits 0 (`scratch/mutation/row14-runner.txt`).
- [x] T004 Row 16: run both trigger-path unit tests in the battery job (`.github/workflows/opencode-dual-version.yml`) Done: each test is named in a run step, where before neither was (`scratch/mutation/row16-trigger-steps.txt`).
- [x] T005 Row 17: add the blocking `hooks-vitest` job (`.github/workflows/dispatch-enforcement-guard.yml`) Done: it runs the whole hooks vitest tree, which holds the three adapter suites.
- [x] T006 Row 17: stub `devin` and `pi` on PATH in the Pi preflight suite (`.skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts`) Done: on the CI-like PATH the old test fails 3 and the new one passes 38 of 38, and a mutant that registers no handler fails 19 (`scratch/mutation/row17-hermetic-path.txt`).
- [x] T007 Row 28: call the locked vitest by path in the audit step (`.github/workflows/dispatch-enforcement-guard.yml`) Done: with an ancestor stub and no `.skilled/node_modules`, `npx --prefix .skilled` ran the stub and the path call failed loudly (`scratch/mutation/row28-ancestor-node-modules.txt`).
- [x] T008 Row 32: record why `.pi/extensions` is not a root (`.skilled/scripts/run-node-tests.mjs`) Done: adding the root lists 137 files, the same as without it, because all 11 `.pi` suites are `.test.ts` (`scratch/mutation/row32-pi-roots.txt`).
- [x] T009 Row 33: test the drift-guard orchestrator (`.skilled/skills/sk-code/sk-code-skilled/scripts/tests/run-all-drift-guards.test.cjs`) Done: 4 of 4 pass; uncounted failures, a failure path that exits 0 and unsummed warnings each fail at least one test (`scratch/mutation/row33-drift-guards.txt`). The shared runner that collects it is advisory, so `.github/workflows/sk-code-script-tests.yml` runs the folder's three suites, 27 tests, in a blocking job.
- [x] T010 Row 34: add the `security_policy` document type (`validate_document.py`, `template-rules.json`, `test_validator.py`, two fixtures, `core-standards.md`, `shared/scripts/README.md`) Done: `SECURITY.md` validates as `security_policy` with 0 issues; on the old validator both new cases fail, 11 of 13 (`scratch/mutation/row34-security-type.txt`).
- [x] T011 Correct 012's Phase label to `12 of 12` and record it as 012's T010 (`specs/hooks/023-session-relaunch-loop/012-ci-red-check-repairs/`) Done: 012 validates strict, RESULT: PASSED, after a `repair-derived.cjs` refresh of its graph metadata.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Lint the changed workflows (`scratch/after/workflow-lint.txt`) Done: `check-gate-inputs.sh` RESULT: PASSED with 0 failures, and `actionlint` exit 0 on all three.
- [x] T013 Run the changed suites after the edits (`scratch/after/`) Done: the hooks tree passes 204 of 204 and the sk-code script tests 27 of 27 (`scratch/after/sk-code-script-tests.txt`), and the sk-doc script suite passes 35 with 1 skipped as in CI (`scratch/after/sk-doc-script-tests.txt`).
- [x] T014 Review the change read-only with Luna until PASS (`scratch/review/`) Done: round 1 FAIL (row 33 suite only under the advisory runner; row 28 evidence used `--no-install`), round 2 FAIL (packet marked Complete before the CI proof; installed-state audit run lacked its exit), round 3 PASS with one P2, a missing sk-code run log, now `scratch/after/sk-code-script-tests.txt`.
- [x] T015 Validate this folder strict and 082 recursively, each RESULT: PASSED Done: after the main merge, the recursive strict run over 082 printed RESULT: PASSED for all 23 folders, exit 0.
- [x] T016 Rows 17 and 28: prove the `hooks-vitest` job and the audit step pass on CI at the pushed main commit Done: at main `bb0680d9bb`, Dispatch Enforcement Guard run 39389716576 passed both jobs, and `hooks-vitest` ran 6 files and 204 of 204 tests. The same commit passed sk-code Script Tests (39389716546), sk-doc Script Tests (39389716415, both node tests PASS), OpenCode Dual-Version Battery (39389716463, the unit-test step 35 of 35 on v1 and v2) and Spec-Kit Check (39389716535).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
