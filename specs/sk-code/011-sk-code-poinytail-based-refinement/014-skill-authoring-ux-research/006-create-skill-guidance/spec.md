---
title: "Feature Specification: Phase 6: create-skill-guidance"
description: "Correct the routing-field sentence, name every version carrier, and sharpen two generator messages."
trigger_phrases:
  - "create skill guidance"
  - "phase 6 create skill guidance"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: create-skill-guidance

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
| **Phase** | 6 of 9 |
| **Predecessor** | 005-changelog-single-bump |
| **Successor** | 007-advisor-name-mention-scoring |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the skill authoring UX phase parent. It remediates findings from `../001-authoring-ux-research/research/research.md`.

**Scope Boundary**: Only the files in the table below change. Document content owned by the parallel feature-catalog track is handed off, not edited.

**Dependencies**:
- The research in `../001-authoring-ux-research/`.
- The DeepSeek V4.1 Flash builder through cli-pi, verified by the orchestrator.

**Deliverables**:
- Correct the routing-field sentence, name every version carrier, and sharpen two generator messages.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-create-skill tells authors that description.json keywords are read by the advisor, which no advisor code does. Its maintenance guidance names one version field. The leaf generator's stale message shows two hashes but not which file changed, and regenerate-skill-derived.cjs documents a failing exit code and a --skills-dir option it does not have.

### Purpose
Authors edit the fields the advisor reads, know every file a bump moves, and see which leaf changed when the manifest goes stale.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.skilled/skills/sk-doc/sk-create-skill/SKILL.md` step 28 and the packet version.
- `.skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md` version section.
- `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` stale message and a test.
- `.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs` header.
- `.skilled/skills/sk-doc/sk-create-skill/changelog/` entry.

### Out of Scope
- Teaching the advisor to read description.json, which would add a third vocabulary to keep in sync.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-skill/SKILL.md` | Modify | Step 28 names graph-metadata intent_signals and the ROUTER.md carry; version bump |
| `.skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md` | Modify | Name every carrier and the changelog command |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` | Modify | List added and removed leaves and the full write command |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-stale-message.test.cjs` | Create | Asserts the message names an added leaf |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs` | Modify | Header matches real options and exit codes |
| `.skilled/skills/sk-doc/sk-create-skill/changelog/` | Create | Entry for the bump |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No claim that description.json feeds the advisor | grep finds no such sentence in SKILL.md |
| REQ-002 | Stale message names the changed leaf | The new test passes and failed before the change |

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
