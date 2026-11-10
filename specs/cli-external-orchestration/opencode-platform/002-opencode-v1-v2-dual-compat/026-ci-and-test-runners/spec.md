---
title: "Feature Specification: Phase 26: ci-and-test-runners"
description: "Seven rows of the post-merge fix list are tests and checks that ran under no runner or no blocking job: two sk-doc node tests, two trigger-path unit tests, the hooks vitest tree with its runtime adapter suites, the drift-guard orchestrator, and SECURITY.md with no document type. This phase gives each one a runner that blocks, or records why not."
trigger_phrases:
  - "ci and test runners"
  - "phase 26 ci and test runners"
  - "hooks vitest blocking job"
  - "security_policy document type"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 26: ci-and-test-runners

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-20 |
| **Branch** | `worktrees/162-ci-and-test-runners` |
| **Parent Spec** | ../spec.md |
| **Phase** | 26 of 26 |
| **Predecessor** | 020-plugins-purity-dual-export |
| **Successor** | None |
| **Handoff Criteria** | Every row this phase owns is fixed or recorded, and the new blocking hooks job passes on CI at the pushed commit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 26** of the OpenCode v1 and v2 dual-compatibility specification. It closes the CI and test-runner group of the post-merge fix list.

**Scope Boundary**: Rows 14, 16, 17, 28, 32, 33 and 34 of the fix list in `../014-post-merge-deep-research/research/research.md` §6, and one stale label in `specs/hooks/023-session-relaunch-loop/012-ci-red-check-repairs/spec.md`. The other rows belong to phases 021 to 025.

**Dependencies**:
- The fix list in `../014-post-merge-deep-research/research/research.md`, rows 14, 16, 17, 28, 32, 33 and 34.
- The vitest pin under `.skilled/node_modules` and the hazard `specs/hooks/024-dispatch-adapter-test-repair/implementation-summary.md` records for a root-level `npx vitest`.

**Deliverables**:
- A runner or a blocking step for each orphaned suite, a test for the drift-guard orchestrator and a `security_policy` document type.
- This folder's spec, plan, tasks and implementation summary, the mutation evidence under `scratch/mutation/` and the parent phase map row.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Several suites passed locally but blocked nothing. The two sk-doc frontmatter-version tests are self-running node scripts that neither sk-doc's runner (`test_*.py` only) nor the shared runner (`*.test.mjs` and `*.test.cjs`, advisory) reaches. The OpenCode dual-version workflow triggers on two unit-test paths that no step runs. The hooks vitest tree, which holds the Pi preflight lint, the Pi directive dedup and the Codex shell-tool suites, runs in no job, and the one vitest step that does run reaches vitest through `npx`. The drift-guard orchestrator has no test of its pass and fail aggregation, and `SECURITY.md` matches no sk-doc document type, so README rules were applied to it.

### Purpose
Each suite named in rows 14, 16, 17 and 33 runs where a failure blocks a build, the hooks vitest step calls the locked vitest by its path, the `.pi` decision is recorded beside the runner's roots, and the sk-doc validator recognises `SECURITY.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Row 14: sk-doc's `run-script-tests.sh` runs the two self-running node tests by name.
- Row 16: the dual-version workflow runs both of its trigger-path unit tests.
- Rows 17 and 28: a blocking `hooks-vitest` job runs the whole hooks vitest tree, and both vitest calls in the guard workflow use `.skilled/node_modules/.bin/vitest`.
- Row 32: the shared node runner records why `.pi/extensions` is not one of its roots.
- Row 33: a node:test suite drives the drift-guard orchestrator through its pass, warn and fail paths, and a new blocking workflow runs it with the other sk-code script suites.
- Row 34: a `security_policy` document type that `SECURITY.md` matches by name. The `opencode.json` assessment in the same row is recorded, not done.
- `012-ci-red-check-repairs`: the Phase label corrected from `8 of 8` to `12 of 12`.

### Out of Scope
- Running the `.pi` TypeScript suites in CI - they need their own package installs, and the provisioning group owns that gap.
- `test-cite-drift-scan.mjs`, `test-root-name-consumer-matrix.cjs` and `install-guide-contract.test.cjs` in sk-doc, which may also run in no blocking job - they are not rows of this group.
- Assessing `opencode.json` against a document type - row 34 marks it for later.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` | Modify | Run the two node tests by name, honouring `SKIP_TESTS` and `ONLY_TESTS` |
| `.github/workflows/opencode-dual-version.yml` | Modify | A step that runs the config-shape and battery unit tests |
| `.github/workflows/dispatch-enforcement-guard.yml` | Modify | The `hooks-vitest` job, and the audit step's vitest called by path |
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | Modify | Stub `devin` and `pi` on PATH so the suite passes on a runner that has neither |
| `.skilled/scripts/run-node-tests.mjs` | Modify | A comment recording why `.pi/extensions` is not a root |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/run-all-drift-guards.test.cjs` | Create | Pass, warn and fail aggregation of the orchestrator against stub guards |
| `.github/workflows/sk-code-script-tests.yml` | Create | A blocking job that runs every sk-code script suite, the new one included |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modify | Detect `SECURITY.md` as `security_policy` and accept the type in `--type` |
| `.skilled/skills/sk-doc/shared/assets/template-rules.json` | Modify | The `security_policy` rule set |
| `.skilled/skills/sk-doc/scripts/tests/test_validator.py` and two `SECURITY.md` fixtures | Modify, Create | One valid policy that auto-detects and one without a reporting section |
| `.skilled/skills/sk-doc/shared/references/core-standards.md`, `.skilled/skills/sk-doc/shared/scripts/README.md` | Modify | Name the new type |
| `specs/hooks/023-session-relaunch-loop/012-ci-red-check-repairs/spec.md`, `tasks.md`, `graph-metadata.json` | Modify | The Phase label, the task that records it and the re-derived metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Row 17: the hooks vitest tree runs in a blocking job. | The `hooks-vitest` job runs `.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts` with no `continue-on-error`, and it passes on CI at the pushed commit. |
| REQ-002 | Row 28: the guard's vitest is the locked one whatever sits above it. | With a stub vitest in a root `node_modules` and `.skilled/node_modules` missing, `npx --prefix .skilled` ran the stub and the path call failed loudly (`scratch/mutation/row28-ancestor-node-modules.txt`). |
| REQ-003 | Row 14: sk-doc's runner reaches the two node tests. | With a broken engine, the new runner fails and the old one passes (`scratch/mutation/row14-runner.txt`). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Row 16: every trigger-path test appears in a step. | Both unit-test trigger paths are named in a run step (`scratch/mutation/row16-trigger-steps.txt`). |
| REQ-005 | Row 32: the `.pi` decision is recorded. | The runner comment says why, and adding the root discovers no file (`scratch/mutation/row32-pi-roots.txt`). |
| REQ-006 | Row 33: both exit paths of the orchestrator are covered, in a blocking job. | Four tests pass, three orchestrator mutants each fail at least one (`scratch/mutation/row33-drift-guards.txt`), and `sk-code-script-tests.yml` runs the folder's suites with no `continue-on-error`. |
| REQ-007 | Row 34: the validator recognises `SECURITY.md`. | `SECURITY.md` validates as `security_policy` with 0 issues, and both new cases fail on the old validator (`scratch/mutation/row34-security-type.txt`); sk-doc's script tests pass. |
| REQ-008 | The 012 Phase label matches the parent phase map. | 012's metadata reads `12 of 12`, T010 records it and 012 validates strict. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each row 14, 16, 17, 28, 32, 33 and 34 is fixed, documented or upstream, with its evidence in this folder.
- **SC-002**: Every changed or new workflow passes `check-gate-inputs.sh` and `actionlint`, and every CI run on the pushed main commit is read.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A hooks suite that passes on a developer machine fails on a clean runner | High | The tree was run in a clean export on node 20.19.5 with a system-only PATH before the push; it found three Pi preflight tests that need `devin` and `pi` on PATH, which the test now stubs (`scratch/mutation/row17-hermetic-path.txt`) |
| Risk | The new type claims a lowercase `security.md` reference or playbook leaf | Low | The match is case-sensitive on the exact name `SECURITY.md` |
| Dependency | Phases 021 to 025 edit the same parent phase map | Low | The merge keeps every row from both sides |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether `opencode.json` needs a document type of its own. Row 34 marks it UNKNOWN, and this phase does not assess it.
<!-- /ANCHOR:questions -->

---
