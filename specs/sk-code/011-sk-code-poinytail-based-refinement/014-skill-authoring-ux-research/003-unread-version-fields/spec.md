---
title: "Feature Specification: Phase 3: unread-version-fields"
description: "Stop storing the hub version in hub-router.json and mode-registry.json, which nothing reads."
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
| **Status** | Planned |
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
- Stop storing the hub version in hub-router.json and mode-registry.json, which nothing reads.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A hub version is carried in six files that must move together. Two of them, hub-router.json and mode-registry.json, have no reader: a full search of repository code found only the doctor parity check 13a, which already skips a file that declares no version. description.json keeps its version because the doctor requires that key.

### Purpose
Cut the copies a bump must move from six to four by deleting the unread field and stopping new hubs from getting it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `version` in the seven hubs' `hub-router.json` and `mode-registry.json`.
- `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md`, the hub-router and registry templates under `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/`, and `.skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py`.
- Tests that assert the field.

### Out of Scope
- `description.json` version, which `parent-skill-check.cjs` requires (doctor rule 8).
- SKILL.md, ROUTER.md and README.md versions, which documentation frontmatter rules require.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/*/hub-router.json`, `.skilled/skills/*/mode-registry.json` | Modify | Delete the version key |
| `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md` | Modify | Drop version from the field table and example |
| `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-router-template.json`, `parent-skill-registry-template.json` | Modify | Delete the version key |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py` | Modify | Stop writing version into the hub-router and registry it scaffolds |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No hub JSON carries version | grep finds no version key in any hub-router.json or mode-registry.json |
| REQ-002 | Doctor and routing still pass | parent-skill-check exits 0 on all seven hubs and the route guard reports every hub fresh |

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
