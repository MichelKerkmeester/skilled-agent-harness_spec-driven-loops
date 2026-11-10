---
title: "Feature Specification: Phase 3: unread-version-fields"
description: "Run the full reader search for the hub JSON version copies and record why removing them is dropped."
trigger_phrases:
  - "unread version fields"
  - "phase 3 unread version fields"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: unread-version-fields

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/095-skill-authoring-ux-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 9 |
| **Predecessor** | 002-parent-goal-budget |
| **Successor** | 004-commit-hook-checks |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the skill authoring UX phase parent. It remediates findings from `../001-authoring-ux-research/research/research.md`.

**Scope Boundary**: Only the files in the table below change. Document content owned by the parallel feature-catalog track is handed off, not edited.

**Dependencies**:
- The research in `../001-authoring-ux-research/`.
- The DeepSeek V4.1 Flash builder through cli-pi, verified by the orchestrator.

**Deliverables**:
- Run the full reader search for the hub JSON version copies and record why removing them is dropped.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The research proposed deleting the version from hub-router.json, mode-registry.json and description.json because nothing reads it, but only after a full reader search. The search finds that the doctor requires the description.json key (rule 8), and that five hub SKILL.md files and the router schema name these copies as carriers of the release version.

### Purpose
Decide, with the evidence on record, whether removing the copies earns its cost once phases 004 and 005 exist.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A repository-wide search for code that reads version from hub-router.json, mode-registry.json or description.json.
- The decision and its reason, recorded in this phase.

### Out of Scope
- Editing any JSON file, schema, template or hub SKILL.md: the decision is to drop the removal.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `implementation-summary.md`, `goal.md` (this phase) | Modify | Reader search result and drop decision |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Reader search recorded | The summary lists every reader found |
| REQ-002 | Drop reason recorded under prevent-overengineering | The summary names what fails at the cheaper move |

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
