---
title: "Feature Specification: Phase 3: admission-gold"
description: "Decide whether DOC-331's gold or the deep-loop router is wrong, and fix the one that is or record why no honest fix exists."
trigger_phrases:
  - "admission gold"
  - "phase 3 admission gold"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: admission-gold

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
| **Branch** | `worktrees/099-residual-closeout` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 10 |
| **Predecessor** | 002-hooks-readme-voice |
| **Successor** | 004-battery-misses |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the residual closeout phase parent. It settles item 3 of the residual list: the DOC-331 deep-loop admission scenario that routes to research.

**Scope Boundary**: Only the files in the table below change.

**Dependencies**:
- None beyond the files named below.

**Deliverables**:
- Decide whether DOC-331's gold or the deep-loop router is wrong, and fix the one that is or record why no honest fix exists.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The system-deep-loop admission check reports one drift: DOC-331 (`doctor-deep-loop-lazy-init.md`) carries gold `UNKNOWN` and the prompt `Initialize the deep-loop graph from current iteration folders. We just finished a deep-research run.` The compiled router routes it to `research`. The 015 ledger closed it without a trial, and admission runs only with `--warn-only` in CI.

### Purpose
Settle which side is wrong with evidence, and either fix it so admission passes for the hub without `--warn-only`, or close it with the specific reason and the smallest fix tried.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The DOC-331 scenario gold and the system-deep-loop router inputs
- A read-only trial of the smallest router change

### Out of Scope
- Any other hub's gold, router or canary
- Rewording the scenario's prompt to dodge the router, which would test nothing

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/.../016-residual-closeout/003-admission-gold/scratch/context-strip-trial.cjs` | Create | Read-only trial script |
| Phase docs | Create | Decision record |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The verdict on the gold rests on evidence | The scenario's own pass condition and the research packet's contents are cited |
| REQ-002 | The smallest router change is measured, not assumed | The trial reports how many scenario prompts it would change |

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
