---
title: "Feature Specification: Phase 2: parent-goal-budget"
description: "Cut the 011 parent goal under its 4,000-character budget without dropping a criterion."
trigger_phrases:
  - "parent goal budget"
  - "phase 2 parent goal budget"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: parent-goal-budget

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/095-skill-authoring-ux-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 9 |
| **Predecessor** | 001-authoring-ux-research |
| **Successor** | 003-unread-version-fields |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the skill authoring UX phase parent. It remediates findings from `../001-authoring-ux-research/research/research.md`.

**Scope Boundary**: Only the files in the table below change. Document content owned by the parallel feature-catalog track is handed off, not edited.

**Dependencies**:
- The research in `../001-authoring-ux-research/`.
- The DeepSeek V4.1 Flash builder through cli-pi, verified by the orchestrator.

**Deliverables**:
- Cut the 011 parent goal under its 4,000-character budget without dropping a criterion.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Adding the 014 binding row pushed the 011 parent goal durable slice to 4,064 characters, over the 4,000 limit, so check-goal fails its budget check and strict validation of the 011 parent fails. Two sibling tracks will add their own rows at merge.

### Purpose
Bring the 011 parent goal to 3,800 characters or fewer, leaving room for the sibling rows, while keeping all six criteria.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The durable slice of `../../goal.md` (the 011 parent goal): objective, decisions, binding and criteria.

### Out of Scope
- The 011 goal log, which is outside the measured slice.
- Any child goal of 011.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `../../goal.md` | Modify | Shorten decision prose and restated child text per budget-and-handoff.md section 3 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Durable slice at or under 3,800 characters | `goal.cjs packet` prints packet_durable_chars of 3800 or less |
| REQ-002 | No criterion dropped | The goal still holds six criteria |

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
| Dependency | LLM Gateway route for DeepSeek V4.1 Flash | The build cannot start | Switch to the cline route; if that is limited too, wait for the reset |
| Risk | A builder report is a claim | High | The orchestrator reruns every check itself |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
