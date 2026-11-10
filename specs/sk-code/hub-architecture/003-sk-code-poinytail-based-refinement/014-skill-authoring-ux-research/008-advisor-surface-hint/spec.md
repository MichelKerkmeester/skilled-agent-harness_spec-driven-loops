---
title: "Feature Specification: Phase 8: advisor-surface-hint"
description: "Let advisor_recommend pass a surface hint to the compiled-route front door."
trigger_phrases:
  - "advisor surface hint"
  - "phase 8 advisor surface hint"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: advisor-surface-hint

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
| **Phase** | 8 of 9 |
| **Predecessor** | 007-advisor-name-mention-scoring |
| **Successor** | 009-advisor-vocabulary-freshness |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the skill authoring UX phase parent. It remediates findings from `../001-authoring-ux-research/research/research.md`.

**Scope Boundary**: Only the files in the table below change. Document content owned by the parallel feature-catalog track is handed off, not edited.

**Dependencies**:
- The research in `../001-authoring-ux-research/`.
- The DeepSeek V4.1 Flash builder through cli-pi, verified by the orchestrator.

**Deliverables**:
- Let advisor_recommend pass a surface hint to the compiled-route front door.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The compiled-route front door accepts --surface-hint and the sk-code hub tells its caller to pass it, but advisor_recommend, the only automated caller, has no option for it and never passes the flag.

### Purpose
A caller that knows the session surface can hand it to the advisor and get the hinted surface first on a tie.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `options.surfaceHint` in `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts`.
- The front-door spawn in `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts`.
- A handler test.
- The advisor packet version and changelog.

### Out of Scope
- Detecting the surface inside the advisor; the caller supplies it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` | Modify | Optional surfaceHint string |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` | Modify | Forward --surface-hint when set |
| `.skilled/skills/system-skill-advisor/runtime/tests/advisor-surface-hint.vitest.ts` | Create | Argv carries the flag only when the option is set |
| `.skilled/skills/system-skill-advisor/SKILL.md`, `changelog/` | Modify | Version bump and entry covering this phase and phase 007 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Hint reaches the front door | The new test passes and failed before |
| REQ-002 | No hint, no flag | The test asserts the argv is unchanged without the option |

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
