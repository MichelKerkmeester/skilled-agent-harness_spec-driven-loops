---
title: "Feature Specification: Phase 12: advisor-doc-target-and-engines"
description: "Stop 'sk-doc changelog' from counting as a doc target and match the Node range to the toolchain."
trigger_phrases:
  - "advisor doc target and engines"
  - "phase 12 advisor doc target and engines"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 12: advisor-doc-target-and-engines

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
| **Phase** | 12 of 9 |
| **Predecessor** | 010-validator-false-positives |
| **Successor** | 013-python-advisor-native-and-parity |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the skill authoring UX phase parent. It remediates findings from `../001-authoring-ux-research/research/research.md`.

**Scope Boundary**: Only the files in the table below change. Document content owned by the parallel feature-catalog track is handed off, not edited.

**Dependencies**:
- The research in `../001-authoring-ux-research/`.
- The DeepSeek V4.1 Flash builder through cli-pi, verified by the orchestrator.

**Deliverables**:
- Stop 'sk-doc changelog' from counting as a doc target and match the Node range to the toolchain.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The review found that the doc-file suffix rule in the explicit lane treats the word changelog after a skill name as a doc file, so "Create a changelog entry for sk-git with the sk-doc changelog mode" flips to sk-git (P1-01). The runtime engines range >=20.19.0 is also wider than vite and rolldown declare, ^20.19.0 || >=22.12.0 (P2-08).

### Purpose
Route a named changelog mode to its skill again and declare the Node range the build really needs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `lanes/explicit.ts` DOC_FILE_SUFFIX and its vitest.
- `runtime/package.json` and its lockfile root engines.

### Out of Scope
- The Python scorer, owned by phase 013.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | Modify | changelog only as changelog.md or changelog/ |
| `.skilled/skills/system-skill-advisor/runtime/tests/name-mention-scoring.vitest.ts` | Modify | Review prompt case |
| `.skilled/skills/system-skill-advisor/runtime/package.json`, `package-lock.json` | Modify | engines range |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Changelog mode prompt routes to sk-doc | Vitest case passes and fails before |
| REQ-002 | Engines range matches the toolchain | grep shows the range in both files |

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
