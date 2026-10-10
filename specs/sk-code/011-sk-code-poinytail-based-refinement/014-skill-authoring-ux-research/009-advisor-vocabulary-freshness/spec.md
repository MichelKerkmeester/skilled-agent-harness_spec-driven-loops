---
title: "Feature Specification: Phase 9: advisor-vocabulary-freshness"
description: "Clear the failing intent-signal carry and the stale compiled graph, and let the freshness panel fail in CI."
trigger_phrases:
  - "advisor vocabulary freshness"
  - "phase 9 advisor vocabulary freshness"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: advisor-vocabulary-freshness

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
| **Phase** | 9 of 9 |
| **Predecessor** | 008-advisor-surface-hint |
| **Successor** | None |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the skill authoring UX phase parent. It remediates findings from `../001-authoring-ux-research/research/research.md`.

**Scope Boundary**: Only the files in the table below change. Document content owned by the parallel feature-catalog track is handed off, not edited.

**Dependencies**:
- The research in `../001-authoring-ux-research/`.
- The DeepSeek V4.1 Flash builder through cli-pi, verified by the orchestrator.

**Deliverables**:
- Clear the failing intent-signal carry and the stale compiled graph, and let the freshness panel fail in CI.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
generate-router-intent-signals --check fails today: cli-classifier is missing 23 declared phrases. The compiled skill graph is stale against its newest source, and the freshness panel always exits 0 and does not name the command that fixes it, so neither drift can fail a build.

### Purpose
Both drifts are cleared with the repository generators, and the routing CI job fails the next time either recurs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Regenerate `.skilled/skills/cli-classifier/graph-metadata.json` with the intent-signal generator.
- Regenerate `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` with the compiler.
- A `--strict` flag and a named fix command in `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs`.
- Two steps in `.github/workflows/routing-registry-drift.yml`.

### Out of Scope
- The advisor SQLite reindex, which stays operator-gated.
- Rebuilding the trigger index per branch: CI rebuilds it after merge by design.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-classifier/graph-metadata.json` | Modify | Generated intent-signal carry |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modify | Regenerated compiled graph |
| `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs` | Modify | --strict exit and named fix command |
| `.github/workflows/routing-registry-drift.yml` | Modify | Run the intent-signal check and the strict panel |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Intent-signal check passes | The check prints RESULT: PASSED |
| REQ-002 | Panel can fail | With --strict it exits 1 on a stale graph and 0 on a fresh one |

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
