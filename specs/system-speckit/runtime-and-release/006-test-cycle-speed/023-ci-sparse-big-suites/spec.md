---
title: "Feature Specification: Phase 23: ci-sparse-big-suites"
description: "Only six test files in the spec-kit, deep-loop and sk-doc suites read loop state, so three more CI jobs skip the loop-state folders in their checkout."
trigger_phrases:
  - "ci sparse big suites"
  - "phase 23 ci sparse big suites"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 23: ci-sparse-big-suites

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/361-ci-sparse-big-suites` |
| **Parent Spec** | ../spec.md |
| **Phase** | 23 of 23 |
| **Predecessor** | 022-ci-sparse-loop-state |
| **Successor** | None |
| **Handoff Criteria** | The edited jobs pass with the same test counts as their last run on main |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 23** of the Test Cycle Speed specification.

**Scope Boundary**: A map of which tests in the spec-kit, deep-loop and sk-doc suites read loop state, and the checkout step of three jobs that the map allows to change. No test changes.

**Dependencies**:
- Phase 22, which left these suites on the full checkout because some of their tests read loop-state files.

**Deliverables**:
- The list of test files that read loop state, with the paths they read.
- A sparse checkout for the CLI and runtime vitest jobs of `spec-kit-check.yml` and for `deep-loop-runtime.yml`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 22 excluded the loop-state folders from seven workflows and left the largest suites alone, because a search found 30 files in them that name a loop-state path. A name in a file does not show that a test reads the path at run time, so nobody knew how many tests depend on those folders.

### Purpose
Know exactly which tests read loop state, and give every job that does not need the folders the shorter checkout.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
(scratch clone of main, suites run twice: without the four folder kinds, then with the full checkout)
== speckit: sparse fails 10, full fails 1, only without loop state 9
 Test Files 1 failed | 205 passed | 3 skipped (209)
 Tests 1 failed | 2520 passed | 20 skipped (2541)
 Test Files 126 passed | 3 skipped (129)
 Tests 1649 passed | 13 skipped (1662)
== deeploop: sparse fails 72, full fails 71, only without loop state 1
 Test Files 12 failed | 161 passed (173)
 Tests 71 failed | 2814 passed | 8 skipped (2893)
== skdoc: sparse fails 2, full fails 0, only without loop state 2
--- only-sparse, by file:
   1 tests/alignment-drift-fixture-preservation.vitest.ts
   4 tests/gate-3-classifier.vitest.ts
   4 tests/multi-ai-council-validator.vitest.ts
   1 tests/unit/deep-research-ledger-schema.vitest.ts
FAIL test_readme_verdict_parity.py (exit 1)
FAIL test_root_name_consumer_matrix.py (exit 1)

(full checkout step, seconds, 48 steps in six runs of Spec-Kit Check on main, sorted)
21 22 23 23 23 25 25 26 26 27 27 27 28 41 44 45 52 55 56 57 57 57 57 57 57 57 58 59 59 59 59 59 59 59 60 60 60 60 60 60 60 61 61 64 72 75 79 80
```
The totals shown under each suite are those of the full run. The run without the folders reported the same totals, 2,541, 1,662 and 2,893 tests, so no test skipped itself.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run the three suites in a scratch clone without the four folder kinds, then again with the full checkout as the control.
- Exclude the four folder kinds in the runtime vitest job of `spec-kit-check.yml`.
- Exclude them in the CLI vitest job and name the three folders its suites read again.
- Exclude them in `deep-loop-runtime.yml` and name the folders of the five recorded loop logs again.

### Out of Scope
- The `check`, `legacy-lanes`, `mirrors` and `doctor-scripts` jobs of `spec-kit-check.yml` - the scratch run did not cover all they execute.
- The sk-doc suites - two of their tests walk every README in the repository, archived ones included.
- Moving the fixtures out of the archive - that would change tests, and the pattern list solves it without one.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/workflows/spec-kit-check.yml` | Modify | Sparse checkout in the `cli-vitest` and `runtime-vitest` jobs |
| `.github/workflows/deep-loop-runtime.yml` | Modify | Sparse checkout, merged with the existing `fetch-depth: 2` |
| `.github/workflows/README.md` | Modify | Names the three jobs and the rule for a new test that reads loop state |
| `.skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md` | Modify | Two cited line numbers |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every edited job passes | `gh pr checks 104` shows no failing check |
| REQ-002 | No test is silently skipped | Each edited job reports the same test totals on the branch as on `main` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The map separates loop-state readers from failures the clone causes | Only a test that fails without the folders and passes with them is listed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Five jobs (three CLI shards, the runtime job and the deep-loop job) pass with equal test totals.
- **SC-002**: `actionlint` exits 0 on every workflow and `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A test reads a loop-state file and skips itself when the file is absent | High: coverage is lost without a red check | Test totals are compared with `main` for every edited job |
| Risk | A new test in one of these jobs reads another loop-state path | Medium: it passes locally and fails on the runner | The README states the rule, and the failure names the missing path |
| Risk | 71 deep-loop tests fail in the scratch clone either way, so the clone could not judge them | Medium | The runner ran them with the sparse checkout and all 2,885 passed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
