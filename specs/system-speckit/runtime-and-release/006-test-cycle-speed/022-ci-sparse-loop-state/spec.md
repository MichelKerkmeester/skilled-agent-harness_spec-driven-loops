---
title: "Feature Specification: Phase 22: ci-sparse-loop-state"
description: "A full checkout fetches 88,000 loop-state files under specs/ and costs about a minute per CI job. Seven workflows whose suites read none of them now skip those folders."
trigger_phrases:
  - "ci sparse loop state"
  - "phase 22 ci sparse loop state"
  - "sparse checkout loop state folders"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 22: ci-sparse-loop-state

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
| **Branch** | `worktrees/360-ci-sparse-loop-state` |
| **Parent Spec** | ../spec.md |
| **Phase** | 22 of 22 |
| **Predecessor** | 021-test-db-temp-leak |
| **Successor** | None |
| **Handoff Criteria** | Every edited job passes with the same test counts as its last run on main |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 22** of the Test Cycle Speed specification.

**Scope Boundary**: The checkout step of seven workflows. No file is untracked, moved or deleted, and no protected workflow is edited.

**Dependencies**:
- Phase 17, which measured the loop-state footprint and left the choice to the operator.
- Phase 9, which gave five workflows a cone-mode sparse checkout.

**Deliverables**:
- Nine checkouts that skip `research/`, `review/`, `scratch/` and `z_archive/` under `specs/`.
- A comparison of checkout time and test counts with `main` for each edited workflow.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
88,151 of the 134,068 tracked files are loop state under `specs/`, and a full checkout fetches all of them. That step takes 56 to 68 s in each job, and on pull request 102 it took 8 min 39 s once, which ran a job into its 10 minute limit. The operator chose to keep everything tracked and to stop CI from fetching what a job does not read.

### Purpose
A job whose suites read no loop state does not check it out.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
(checkout step, seconds, last successful run on main per workflow)
opencode-plugin-tests 59
hook-vitest-suites 59
sk-git-script-tests 57
skill-advisor-stress 56
opencode-dual-version 68,26,29
command-tree-parity 57,57
playbook-operator-contract 57

$ gh run view 43320986672 --attempt 1 --json jobs   (pull request 102, cancelled at the 10 minute limit)
Run actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 2026-11-12T22:34:55Z 2026-11-12T22:43:34Z

(local clone with the exclusion patterns)
files checked out: 46049  skipped: 88252
leftover loop-state files: 0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a non-cone sparse checkout that excludes the four folder kinds to nine checkouts in seven workflows.
- Name the one archived packet a plugin test reads again after the exclusions in `opencode-plugin-tests.yml`.
- Describe the checkouts in the workflow README and update three cited line numbers.

### Out of Scope
- `spec-kit-check.yml`, `deep-loop-runtime.yml`, `advisory-checks.yml` and the sk-doc suites - their tests read loop-state files such as recorded loop logs and `research.md`.
- Workflows that validate packets or check links - loop state is what they check.
- The five protected workflows - an edit needs a second named confirmation.
- `agent-mirror-sync.yml` - it fetches full history and was left as it is.
- Untracking, moving or deleting any file - the operator chose against it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/workflows/opencode-plugin-tests.yml` | Modify | Sparse checkout, with one archived packet named again |
| `.github/workflows/hook-vitest-suites.yml` | Modify | Sparse checkout |
| `.github/workflows/sk-git-script-tests.yml` | Modify | Sparse checkout |
| `.github/workflows/skill-advisor-stress.yml` | Modify | Sparse checkout |
| `.github/workflows/opencode-dual-version.yml` | Modify | Sparse checkout in two jobs |
| `.github/workflows/command-tree-parity.yml` | Modify | Sparse checkout in two jobs |
| `.github/workflows/playbook-operator-contract.yml` | Modify | Sparse checkout |
| `.github/workflows/README.md` | Modify | Describes the checkouts |
| `.skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md` | Modify | Three cited line numbers |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every edited job passes | `gh pr checks` shows no failing check |
| REQ-002 | No test is silently skipped | Each edited workflow reports the same test counts on the branch as on `main` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The checkout step is shorter | Each edited checkout takes less time on the branch than on `main` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Seven workflows pass with equal test counts and a shorter checkout step.
- **SC-002**: `actionlint` exits 0 on every workflow and `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A test reads a loop-state file and skips itself when the file is absent | High: coverage is lost without a red check | Test counts are compared with `main` for every edited workflow |
| Risk | A later test starts reading loop state in one of these jobs | Medium: it fails on the runner and passes locally | The failure names the missing path, and the README says which workflows skip loop state |
| Dependency | `actions/checkout` non-cone sparse patterns | A change in pattern handling would alter what is checked out | The action is pinned by commit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
