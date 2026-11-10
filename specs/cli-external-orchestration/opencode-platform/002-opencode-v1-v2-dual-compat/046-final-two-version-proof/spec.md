---
title: "Feature Specification: Phase 46: final-two-version-proof"
description: "The open-work goal closes on a final proof taken from main: every plugin's live effect on both OpenCode versions, every tracked suite rerun against its starting count, recursive validation of the packet and CI on the final main commit. This phase gathers that proof without changing code."
trigger_phrases:
  - "final two version proof"
  - "phase 46 final two version proof"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 46: final-two-version-proof

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-21 |
| **Branch** | `worktrees/190-final-two-version-proof` |
| **Parent Spec** | ../spec.md |
| **Phase** | 46 of 46 |
| **Predecessor** | 045-relaunch-takeover-lock-identity |
| **Successor** | None |
| **Handoff Criteria** | The 17 by 2 live matrix, the suite table, recursive validation and the CI table on the final main commit are recorded in `implementation-summary.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 46** of the OpenCode v1 and v2 dual compatibility specification. It takes the goal's final proof from origin/main after groups 035 to 045 landed.

**Scope Boundary**: Verification only. No code, test or playbook file changes; the only writes are this folder and the parent phase map.

**Dependencies**:
- origin/main at `eb0c18f7e9`, which carries groups 035 to 045.
- The `plugin-utilization` playbook category and its runner `run-plugin-scenario.sh`.

**Deliverables**:
- `scratch/live-runs/results-matrix.md`, the 17 by 2 matrix with one evidence log per plugin.
- `scratch/suites/suites.txt`, every tracked suite against its starting count.
- `scratch/v1-default/`, the OpenCode 1 default-model dispatch result.
- The validation count and CI table in `implementation-summary.md`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Each group proved its own change, but the goal's criteria 3 to 6 are about the final tree: all 17 plugins working live on both versions, every touched suite at or above its starting count, a clean recursive validation and green CI on the last main commit. Nothing had yet checked those together on one commit.

### Purpose
One commit on main where the live matrix, the suites, the validation and CI are all recorded, with the evidence beside them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run all 17 `plugin-utilization` scenarios on OpenCode 1.19.3 and 2.0.32, plus the skill-advisor kill switch on each.
- Rerun the plugin, battery, hooks node and vitest, dispatch rule-check and audit, worktree-naming, Pi extension, default-model and models-form suites.
- Run one OpenCode 1 dispatch on the skill's default `opencode-go` model.
- Validate 082 recursively and record CI on the final main commit.

### Out of Scope
- Fixing any failure found here - a fix is a new decision for the operator.
- The shared v2 service - v2 runs use `--standalone` only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `046-final-two-version-proof/` | Create | Phase docs and evidence |
| `../spec.md`, `../graph-metadata.json` | Modify | Register phase 46 in the phase map |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every plugin shows its checked effect live on both versions | `results-matrix.md` has 17 PASS cells for v1 and 17 for v2, each naming its evidence file |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Every tracked suite is at or above its starting count with no failures, recursive validation passes and CI on the final main commit is recorded | `scratch/suites/suites.txt`; `RESULT: PASSED` for every folder; the CI table in `implementation-summary.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 17 of 17 plugins PASS on OpenCode 1.19.3 and on OpenCode 2.0.32.
- **SC-002**: Every workflow that runs on the final main commit succeeds, and every path-filtered workflow is accounted for with its last run.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | llmgateway quota | A live run fails on a provider error | Rerun that scenario once and record both runs |
| Risk | A model refuses the scenario prompt | Low | Rerun once; read the verdict from the evidence, never the reply |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


