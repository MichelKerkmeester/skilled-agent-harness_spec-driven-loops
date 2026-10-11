---
title: "Feature Specification: Phase 11: pre-existing-gate-failures"
description: "Six gates already failed when the removal began. Three are real defects: the compiled-routing move simulation, two Python advisor misroutes and the broken-move drill setup. This phase fixes those and reclassifies the other three."
trigger_phrases:
  - "pre existing gate failures"
  - "phase 11 pre existing gate failures"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 11: pre-existing-gate-failures

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-11 |
| **Branch** | worktree branch from sk-git's allocator |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 11 |
| **Predecessor** | 010-verification-and-closeout |
| **Successor** | None |
| **Handoff Criteria** | Every gate that failed at baseline passes, or is recorded as a status rather than a defect. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the agent-improvement and model-benchmark removal packet. The operator added it after phase 010 closed, to fix the gate failures that predate the removal.

**Scope Boundary**: only the files in this folder's `scratch/files.txt`. Implementation runs in the git worktree.

**Dependencies**:
- Phases: 010-verification-and-closeout (its gate runs are the baseline)

**Deliverables**:
- Sync five authored compiled-routing sources from the runtime copy
- Fix the Python scorer's misroutes for `P0-CHROME-002` and `rr-iter3-156`
- Make the broken-move drill set up on the already-moved tree
- Record `verify-authority` exit 2 as a rollout state
- Make the phrase linter fail open when its YAML dependency is missing
- Repair the hook-installer harness for the sentinel-based source root

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The compiled-route sync builds its runtime closure from the authored program under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/`. Five runtime files were edited without their authored sources: two by the cli-deem removal before this branch, and three by phase 005. So the move simulation fails to resolve `cli-classifier`. Since phase 005 it also fails on `system-deep-loop`, a regression phase 010 recorded as unchanged. The local Python advisor returns nothing for "inspect network waterfall in browser" and sends a deep-research prompt that mentions prompt routing to `sk-prompt`. The broken-move drill still performs the source-tree move, which has already landed, so its setup builds symlink loops and exits 2. Two more defects surfaced while fixing these: the pre-commit phrase gate blocks every commit in a clone without `node_modules`, because the linter loads `js-yaml` before its fail-open guard. And the hook-installer harness still rewrites an installer line that no longer exists.

### Purpose
Every gate that failed at baseline either passes or is recorded, with its reason, as a status rather than a defect.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Authored compiled-routing sources for `system-deep-loop` and `cli-classifier`
- The local Python scorer and the skill vocabulary it reads
- `.github/scripts/tests/broken-move-drill.sh`
- `template-phrase-lint.mjs` and a new fail-open test
- `install-git-hooks-worktree-harness.sh`

### Out of Scope
- Moving deep-loop modes to the ledger writer - a rollout decision; `verify-authority` exit 2 reports it correctly
- Editing any test expectation, ledger or baseline to make a gate pass

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scratch/files.txt` | Modify | The exact file list this phase owns |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The move simulation resolves all 7 hubs. Verified by: bin vitest 57/57 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The advisor routes both prompts to their gold skill. Verified by: advisor vitest, pytests and regression set pass |
| REQ-003 | The drill runs on the moved tree. Verified by: exit 0 on a scratch clone of the staged tree |
| REQ-004 | `verify-authority` exit 2 is recorded as a status. Verified by: its help text and the authority records |
| REQ-005 | The phrase linter fails open without its YAML dependency. Verified by: the new fail-open test, failing before the fix |
| REQ-006 | The hook-installer harness passes. Verified by: every git-hook test script exits 0 |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The six gates that failed at baseline pass, except `verify-authority`, whose exit 2 is recorded as a status.
- **SC-002**: No other gate gets worse.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A scorer change moves other routing cases | M | The worker runs every advisor gate before and after and stops on a trade-off |
| Risk | The authored copy differs from runtime for a reason | L | All five diffs were read; each runtime file is the newer one |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each DeepSeek work unit carries one change set, short enough to finish in one dispatch.

### Security
- **NFR-S01**: Every dispatch names banned operations and allowed write paths and runs in the worktree.

### Reliability
- **NFR-R01**: Each work unit has a tree snapshot to roll back to.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Generated files are never hand-edited; a brief that changes a source names its generator.

### Error Scenarios
- A work unit writes outside its list: restore the snapshot and re-dispatch with the brief corrected.
- DevPass hits its limit: fall back to Cline at `xhigh`, then wait for the reset.

### State Transitions
- Partial phase: `tasks.md` marks each finished work unit with its snapshot hash.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Files in `scratch/files.txt` |
| Risk | 12/25 | Advisor scoring is shared; reversible by snapshot |
| Research | 6/20 | Root causes traced in this phase |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


