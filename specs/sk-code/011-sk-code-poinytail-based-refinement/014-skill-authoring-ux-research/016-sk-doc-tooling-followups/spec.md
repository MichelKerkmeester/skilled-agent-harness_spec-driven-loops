---
title: "Feature Specification: Phase 16: sk-doc-tooling-followups"
description: "Tighten the catalog validator exemption, give confirm mode its collision remedy, record the validator changes and restore an executable bit."
trigger_phrases:
  - "sk doc tooling followups"
  - "phase 16 sk doc tooling followups"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 16: sk-doc-tooling-followups

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
| **Phase** | 16 of 9 |
| **Predecessor** | 015-freshness-strict-content |
| **Successor** | None |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the skill authoring UX phase parent. It remediates findings from `../001-authoring-ux-research/research/research.md`.

**Scope Boundary**: Only the files in the table below change. Document content owned by the parallel feature-catalog track is handed off, not edited.

**Dependencies**:
- The research in `../001-authoring-ux-research/`.
- The DeepSeek V4.1 Flash builder through cli-pi, verified by the orchestrator.

**Deliverables**:
- Tighten the catalog validator exemption, give confirm mode its collision remedy, record the validator changes and restore an executable bit.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The review found that the catalog validator passes any gitignored or dangling path and depends on machine excludes (P2-02), confirm mode detects an upstream collision with no remedy (P2-06), the package and catalog validator changes have no changelog line (P2-09), and regenerate-skill-derived.cjs lost its executable bit (P2-10).

### Purpose
Close the four remaining review findings in the sk-doc tooling.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `validate_catalog_package.py` and its test; `create-changelog-confirm.yaml`; the sk-create-skill and sk-create-feature-catalog changelogs; the file mode.

### Out of Scope
- Hub versions, bumped by the master at merge.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` and its test | Modify | Exemption tightened |
| `.skilled/commands/create/assets/create-changelog-confirm.yaml` | Modify | Collision remedy |
| sk-create-skill v1.5.2.0 entry; sk-create-feature-catalog SKILL.md and a new changelog entry | Modify, Create | Changelog lines |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs` | Modify | Mode 100755 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Typo under an ignored directory is reported | Catalog test passes and fails before |
| REQ-002 | Confirm mode increments on collision | grep finds the instruction |

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
