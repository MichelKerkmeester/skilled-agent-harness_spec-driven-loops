---
title: "Feature Specification: Phase 5: changelog-single-bump"
description: "Make the changelog workflow the one bump command: number against upstream and move every version copy."
trigger_phrases:
  - "changelog single bump"
  - "phase 5 changelog single bump"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: changelog-single-bump

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
| **Phase** | 5 of 9 |
| **Predecessor** | 004-commit-hook-checks |
| **Successor** | 006-create-skill-guidance |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the skill authoring UX phase parent. It remediates findings from `../001-authoring-ux-research/research/research.md`.

**Scope Boundary**: Only the files in the table below change. Document content owned by the parallel feature-catalog track is handed off, not edited.

**Dependencies**:
- The research in `../001-authoring-ux-research/`.
- The DeepSeek V4.1 Flash builder through cli-pi, verified by the orchestrator.

**Deliverables**:
- Make the changelog workflow the one bump command: number against upstream and move every version copy.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The changelog workflow picks the next version from the local checkout only, so two branches from one base mint the same number, as system-spec-kit 2.7.1.0 did. It writes only the changelog file, leaving SKILL.md, ROUTER.md, README.md and description.json to be bumped by hand.

### Purpose
One run of /create:changelog picks a number no upstream entry holds and writes it into every version copy of the component, then proves parity with the doctor.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `step_3_version_determination` and `step_6_write_file` in `.skilled/commands/create/assets/create-changelog-auto.yaml` and `create-changelog-confirm.yaml`.
- Step 3 of the workflow in `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md`, with a packet version bump and changelog entry.

### Out of Scope
- Existing changelog entries and their content, which the parallel documentation track owns.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/create/assets/create-changelog-auto.yaml` | Modify | Upstream-aware numbering and carrier writes |
| `.skilled/commands/create/assets/create-changelog-confirm.yaml` | Modify | Same as auto |
| `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` | Modify | Step 3 reads the upstream changelog folder too; version bump |
| `.skilled/skills/sk-doc/sk-create-changelog/changelog/` | Create | Entry for the bump |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Next version is above upstream entries | Both workflows and the skill name git ls-tree against the upstream ref |
| REQ-002 | Every carrier is written | Both workflows name SKILL.md, ROUTER.md, README.md and description.json and run parent-skill-check for a hub |

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
