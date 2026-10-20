---
title: "Feature Specification: Phase 29: unrun-tests-ci-coverage"
description: "Five suites passed locally but ran in no blocking CI job: the two .pi extension suites, the sk-git worktree-naming suite and two sk-doc node tests. A sixth suspect, the sk-doc consumer matrix, already blocks through its Python wrapper. This phase runs each one where a failure blocks, and corrects the dual-version workflow comment about bun lockfiles."
trigger_phrases:
  - "unrun tests ci coverage"
  - "phase 29 unrun tests ci coverage"
  - "pi extension tests workflow"
  - "sk-git script tests workflow"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 29: unrun-tests-ci-coverage

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-10-20 |
| **Branch** | `worktrees/168-unrun-tests-ci-coverage` |
| **Parent Spec** | ../spec.md |
| **Phase** | 29 of 29 |
| **Predecessor** | 026-ci-and-test-runners |
| **Successor** | None |
| **Handoff Criteria** | Every suite this phase owns runs in a blocking job, and each new job passes on CI at the pushed main commit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 29** of the OpenCode v1 and v2 dual-compatibility specification. It closes two items of the open-work list the operator approved on 2026-10-20 after phases 021 to 026 landed: item 6 (tests that no CI job runs) and the first small fix of item 9 (the dual-version workflow comment about bun lockfiles).

**Scope Boundary**: The five suites below and the one workflow comment. Phases 027, 028, 030 and 031 own the other open-work items.

**Dependencies**:
- `../026-ci-and-test-runners/`, which recorded these suites as unrun and left `.pi/extensions` out of the shared node runner on purpose.
- `../022-worktree-provision-completeness/`, which made provisioning install the two `.pi` trees and pick bun for a `bun.lockb` package.

**Deliverables**:
- A blocking job for each suite, the corrected comment, and the mutation evidence under `scratch/mutation/`.
- This folder's spec, plan, tasks and implementation summary, and the parent phase map row.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A grep of every workflow and every runner they call, on `origin/main` at `7d55952975`, finds five suites that no blocking job runs, and clears a sixth suspect. The `.pi/extensions/pi-cache-optimizer` (118 tests) and `.pi/extensions/pi-fast-mode-w-subagent-support` (81 tests) suites run only through their own `npm test`, which no workflow calls. `worktree-naming.test.sh` (109 tests) is named by no workflow. In sk-doc, `test-cite-drift-scan.mjs` (67 tests) matches neither sk-doc's runner (`test_*.py` plus a named node list) nor the shared runner's suffixes, and `install-guide-contract.test.cjs` (4 tests) is collected only by the shared runner, whose step is `continue-on-error`. The suspect `test-root-name-consumer-matrix.cjs` is already covered: `test_root_name_consumer_matrix.py` runs it and fails on a nonzero exit, and sk-doc Script Tests run 39413749326 printed `PASS test_root_name_consumer_matrix.py`. All five pass locally, so a regression in any of them would reach main unseen. Separately, the dual-version workflow says only packages with a `bun.lock` use bun, while provisioning also treats a `bun.lockb` package that way.

### Purpose
Each of the five suites runs in a job with no `continue-on-error`, and the workflow comment says what provisioning does.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Item 6: the two unrun sk-doc node tests join the named node list in sk-doc's `run-script-tests.sh`, which the blocking sk-doc Script Tests job runs.
- Item 6: a new blocking workflow runs `worktree-naming.test.sh` when sk-git changes.
- Item 6: a new blocking workflow runs each `.pi` extension's `npm test` after `npm ci`, when that extension changes.
- Item 6: the shared node runner's comment about `.pi/extensions` names the workflow that now runs those suites.
- Item 9: the bun comment in both provisioning steps of `opencode-dual-version.yml` matches `worktree-naming.sh`.

### Out of Scope
- The `.pi` typecheck and pack scripts - the open item was about tests that never run, and `tsc` 7 on the runner is a separate question.
- Triggering sk-doc's job on changes to the install guides that `install-guide-contract.test.cjs` reads in other skills - those guides live under every skill, and a repo-wide trigger would run the whole sk-doc suite on most pushes.
- The missing `sk-code-script-tests.yml` row in `.github/workflows/README.md` - phase 026's file.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` | Modify | Add `test-cite-drift-scan.mjs` and `install-guide-contract.test.cjs` to `NODE_TESTS` |
| `.github/workflows/sk-git-script-tests.yml` | Create | A blocking job that runs `worktree-naming.test.sh` |
| `.github/workflows/pi-extension-tests.yml` | Create | A blocking job per `.pi` extension: `npm ci`, then `npm test` |
| `.skilled/scripts/run-node-tests.mjs` | Modify | The `.pi/extensions` comment names the workflow that runs those suites |
| `.github/workflows/opencode-dual-version.yml` | Modify | The bun comment in both provisioning steps |
| `.github/workflows/README.md` | Modify | Rows for the two new workflows |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Item 6: the two unrun sk-doc node tests block. | With one assertion broken in each, the new runner exits 1 and names it, and the old runner exits 0 (`scratch/mutation/skdoc-node-tests.txt`); the sk-doc Script Tests job passes on CI at the pushed commit. |
| REQ-002 | Item 6: `worktree-naming.test.sh` blocks. | With the provisioning code mutated, the workflow's command exits nonzero (`scratch/mutation/sk-git-naming.txt`); the new job passes on CI at the pushed commit. |
| REQ-003 | Item 6: both `.pi` suites block. | With each extension's source mutated, its job command exits nonzero (`scratch/mutation/pi-extensions.txt`); both matrix legs pass on CI at the pushed commit. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Item 9: the bun comment is true. | Both comments name `bun.lock` and `bun.lockb` and the missing npm lockfile, as `worktree-naming.sh` decides. |
| REQ-005 | Every workflow change passes the gate checks. | `check-gate-inputs.sh` and `actionlint` pass, and each new path filter names both `.skilled` and `.opencode` where it names either. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All five suites run in a job with no `continue-on-error`, each proven to fail that job's command when one of its tests breaks.
- **SC-002**: Every CI run on the pushed main commit is read, and each new job is green there.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A suite that passes on macOS fails on the Linux runner | Med | Each suite was run on Node 22.23.1 with a system-only PATH and an empty HOME first; the CI run on the pushed commit is the proof |
| Risk | `test-cite-drift-scan.mjs` adds about 25 seconds to the sk-doc job | Low | Accepted; the job already walks the whole repository |
| Dependency | Phases 027, 028, 030 and 031 edit the same parent phase map | Low | The merge keeps every row from both sides |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
