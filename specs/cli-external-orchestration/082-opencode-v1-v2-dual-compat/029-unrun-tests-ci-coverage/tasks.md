---
title: "Tasks: Phase 29: unrun-tests-ci-coverage"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "unrun tests ci coverage tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 29: unrun-tests-ci-coverage

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

- [x] T001 Item 6: confirm where each suite runs before any edit (`scratch/baseline/where-suites-run.txt`) Done: no workflow names `worktree-naming.test.sh`, either `.pi` extension, `test-cite-drift-scan.mjs` or `install-guide-contract.test.cjs`; the last is collected only by the shared runner, whose step is `continue-on-error`. The suspect `test-root-name-consumer-matrix.cjs` already blocks: `test_root_name_consumer_matrix.py` runs it, and sk-doc Script Tests run 39413749326 printed `PASS test_root_name_consumer_matrix.py`.
- [x] T002 Item 6: take the baselines on Node 22.23.1 (`scratch/baseline/suites.txt`) Done: cite-drift-scan 67 of 67, install-guide-contract 4 of 4, worktree-naming 109 of 109, pi-cache-optimizer 118 of 118, pi-fast-mode 81 of 81; the git-using suites also passed with an empty HOME and no git identity.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Item 6: add `test-cite-drift-scan.mjs` and `install-guide-contract.test.cjs` to sk-doc's named node list (`.skilled/skills/sk-doc/scripts/tests/run-script-tests.sh`) Done: with a failing test appended to each, the new runner exits 1 and names both, and the base runner exits 0 (`scratch/mutation/skdoc-node-tests.txt`).
- [x] T004 Item 6: a blocking sk-git workflow that runs `worktree-naming.test.sh` (`.github/workflows/sk-git-script-tests.yml`) Done: with provisioning made to pick npm for a bun package, the job's command exits 1 with 11 failures (`scratch/mutation/sk-git-naming.txt`).
- [x] T005 Item 6: a blocking matrix workflow that runs each `.pi` extension's `npm test` after `npm ci` (`.github/workflows/pi-extension-tests.yml`) Done: with a failing test appended to one file per extension, each leg's `npm test` exits 1 (`scratch/mutation/pi-extensions.txt`).
- [x] T006 Item 6: name the new workflow in the shared runner's `.pi/extensions` comment (`.skilled/scripts/run-node-tests.mjs`)
- [x] T007 Item 6: rows for the two new workflows (`.github/workflows/README.md`)
- [x] T008 Item 9: the bun comment in both provisioning steps matches `worktree-naming.sh` (`.github/workflows/opencode-dual-version.yml`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Lint the workflows (`scratch/after/workflow-lint.txt`) Done: `actionlint` exit 0 on the three changed workflows, and `check-gate-inputs.sh` RESULT: PASSED with 0 failures.
- [x] T010 Run sk-doc's runner the way CI does (`scratch/after/sk-doc-script-tests.txt`) Done: 37 PASS, 1 SKIP, exit 0, the two newly listed tests among the passes.
- [ ] T011 Review the change read-only with Luna until PASS (`scratch/review/`)
- [ ] T012 Validate this folder strict and 082 recursively, each RESULT: PASSED
- [ ] T013 Item 6: prove each new job passes on CI at the pushed main commit
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



