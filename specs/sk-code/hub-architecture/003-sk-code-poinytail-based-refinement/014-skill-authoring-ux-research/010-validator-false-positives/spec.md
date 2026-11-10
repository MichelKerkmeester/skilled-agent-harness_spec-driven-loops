---
title: "Feature Specification: Phase 10: validator-false-positives"
description: "Stop the catalog and skill package validators from failing on paths and files that are correct."
trigger_phrases:
  - "validator false positives"
  - "phase 10 validator false positives"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 10: validator-false-positives

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
| **Phase** | 10 of 9 |
| **Predecessor** | 009-advisor-vocabulary-freshness |
| **Successor** | None |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the skill authoring UX phase parent. It remediates findings from `../001-authoring-ux-research/research/research.md`.

**Scope Boundary**: Only the files in the table below change. Document content owned by the parallel feature-catalog track is handed off, not edited.

**Dependencies**:
- The research in `../001-authoring-ux-research/`.
- The DeepSeek V4.1 Flash builder through cli-pi, verified by the orchestrator.

**Deliverables**:
- Stop the catalog and skill package validators from failing on paths and files that are correct.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The feature-catalog track reported validator findings that no document edit can clear: a committed symlink whose build target is absent counts as missing, a gitignored runtime file a document names counts as missing, a fixture tree named runtime-fixture is held to kebab-case, a hub is told to add standalone-skill sections, and scripts/ rejects .ts scripts and the .txt data files sk-git hooks read by path.

### Purpose
Make each of those checks judge what the author controls, so the remaining findings are real.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `validate_catalog_package.py`: treat a committed symlink as present and skip existence for gitignored paths.
- `package_skill.py`: exempt any fixture-named directory, skip recommended sections for a hub, accept .ts and .txt in scripts/.

### Out of Scope
- Output file names in root catalog rows and the .opencode/specs alias: dropped, see the decisions.
- Document content and changelog frontmatter, owned by the feature-catalog track.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` and its test | Modify | lexists and gitignore |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` and its test | Modify | fixture, hub sections, script extensions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Symlink and gitignored paths pass | The catalog test cases pass and fail before |
| REQ-002 | Fixture, hub and extension findings gone | The package test cases pass and fail before |

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
