---
title: "Feature Specification: Phase 7: advisor-name-mention-scoring"
description: "Stop a named file, path or generic word from pulling the advisor route."
trigger_phrases:
  - "advisor name mention scoring"
  - "phase 7 advisor name mention scoring"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: advisor-name-mention-scoring

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
| **Phase** | 7 of 9 |
| **Predecessor** | 006-create-skill-guidance |
| **Successor** | 008-advisor-surface-hint |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the skill authoring UX phase parent. It remediates findings from `../001-authoring-ux-research/research/research.md`.

**Scope Boundary**: Only the files in the table below change. Document content owned by the parallel feature-catalog track is handed off, not edited.

**Dependencies**:
- The research in `../001-authoring-ux-research/`.
- The DeepSeek V4.1 Flash builder through cli-pi, verified by the orchestrator.

**Deliverables**:
- Stop a named file, path or generic word from pulling the advisor route.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-code probe battery reads 12 of 17 positives and 2 of 5 negatives. A skill name inside a path or before SKILL.md adds a full point to that skill, the executor-delegation guard still matches the pre-rename .opencode/ path so a .skilled/ path reads as a handoff, and the generic token findings adds 0.85 to sk-code.

### Purpose
The battery passes its own rule: at least 14 of 17 positives and 0 of 5 negatives, with no regression in the advisor suite.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `NEGATIVE_GUARD` in `.skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts`.
- The skill-name point, the write-doc-surface rule and the `findings` token in `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts`.
- A focused test in `.skilled/skills/system-skill-advisor/runtime/tests/`.

### Out of Scope
- A new negative-keyword lane.
- How the ranking shows bonus-adjusted order beside raw scores.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts` | Modify | Guard matches .skilled/ as well as .opencode/ |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | Modify | Skip the name point for a path or doc object; doc surface knows SKILL.md; drop findings |
| `.skilled/skills/system-skill-advisor/runtime/tests/name-mention-scoring.vitest.ts` | Create | Focused cases for the three fixes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Battery passes | The replay prints at least 14/17 and 0/5 |
| REQ-002 | No suite regression | Advisor vitest failures do not exceed the baseline |

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
