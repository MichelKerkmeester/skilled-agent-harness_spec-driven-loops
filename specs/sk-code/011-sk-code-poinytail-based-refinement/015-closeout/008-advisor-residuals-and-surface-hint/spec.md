---
title: "Feature Specification: Phase 8: advisor-residuals-and-surface-hint"
description: "Close the three residual battery misses with evidence that a competing calibrated rule owns each, and wire the surface hint into the one caller that can know the surface and shows its effect."
trigger_phrases:
  - "advisor residuals and surface hint"
  - "phase 8 advisor residuals and surface hint"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: advisor-residuals-and-surface-hint

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-11 |
| **Branch** | `worktrees/098-post-092-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 9 |
| **Predecessor** | 007-review-reducer-missing-config |
| **Successor** | 009-open-items-ledger |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the epic closeout phase parent. It closes items 9 and 10 of the closeout list, the advisor battery residual misses and surface-hint adoption.

**Scope Boundary**: Only the files in the table below change.

**Dependencies**:
- None beyond the files named below.

**Deliverables**:
- Close the three residual battery misses with evidence that a competing calibrated rule owns each, and wire the surface hint into the one caller that can know the surface and shows its effect.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-code advisor batteries stop at 15 of 17 (native) and 14 of 17 (CLI): P4 and P15 miss on both, P7 on the CLI. And `advisor_recommend` accepted `options.surfaceHint` with no caller sending one.

### Purpose
Each miss has a recorded owner and a reason it stays, and the OpenCode plugin sends the workspace surface so the compiled route it renders leads with that surface.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Per-probe scoring evidence for P4, P7 and P15
- Workspace surface detection in the OpenCode advisor plugin and its tests
- The system-skill-advisor bump

### Out of Scope
- Scorer rule changes for the three probes, which would overturn rules calibrated on other corpora
- A surface hint from the Claude and Codex hooks, whose brief renders no compiled targets

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/system-skill-advisor.js` | Modify | detectWorkspaceSurface and the request option |
| `.skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts` | Modify | Five surface cases |
| `system-skill-advisor SKILL.md, changelog/v0.15.1.0.md, Hermes copy` | Modify, Create | Version 0.15.1.0 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each miss has a named owner rule | Scoring output per probe recorded in the implementation summary |
| REQ-002 | The plugin sends the surface | The request carries surfaceHint for OPENCODE, OBSIDIAN and WEBFLOW workspaces and none otherwise |
| REQ-003 | Routing is unchanged | Both batteries report the same per-probe winners |

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
| Risk | A change reaches a caller the phase did not name | Med | The gates named in goal.md are rerun from the final state |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
