---
title: "Feature Specification: Phase 7: review-reducer-missing-config"
description: "Let the review reducer read a review folder that has a state log but no config file, so all 505 review folders under specs reduce."
trigger_phrases:
  - "review reducer missing config"
  - "phase 7 review reducer missing config"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: review-reducer-missing-config

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-11 |
| **Branch** | `worktrees/098-post-092-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 9 |
| **Predecessor** | 006-compiled-route-content-check |
| **Successor** | 008-advisor-residuals-and-surface-hint |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the epic closeout phase parent. It closes item 8 of the closeout list, the 43 review folders that error during reduction.

**Scope Boundary**: Only the files in the table below change.

**Dependencies**:
- None beyond the files named below.

**Deliverables**:
- Let the review reducer read a review folder that has a state log but no config file, so all 505 review folders under specs reduce.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Reducing every review folder under `specs/` with `reduceReviewState(..., { lenient: true })` fails on 43 of 505 folders. All 43 fail the same way: `ENOENT` on `deep-review-config.json`. They are archived reviews, per-lineage folders and early reviews that kept a state log and iterations but never wrote a config file.

### Purpose
Lenient reduction succeeds on every review folder, and strict reduction of a folder without a config fails with a message that names the file.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- reduceReviewState and createCorruptionError in the deep-loop runtime reduce-state.cjs
- One test in deep-review-state-reducer.vitest.ts
- The deep-loop runtime changelog

### Out of Scope
- Writing config files into the 43 folders, which belong to other packets and to finished reviews
- deep-research/scripts/reduce-state.cjs, which another session has uncommitted work in

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modify | Missing config is a warning |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts` | Modify | One test |
| `.skilled/skills/system-deep-loop/runtime/changelog/v1.9.8.0.md` | Create | Release note |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every review folder reduces leniently | Probe prints dirs=505 errors=0 |
| REQ-002 | Strict reduction names the file | The test expects STATE_CORRUPTION and deep-review-config.json in the message |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-090 | Strict validation of this phase passes | validate.sh --strict prints RESULT: PASSED |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every completion criterion in goal.md passes when the orchestrator reruns it.
- **SC-002**: The phase lands as one conventional commit in the worktree.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A change reaches a caller the phase did not name | Med | The gates named in goal.md are rerun from the final state |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
