---
title: "Feature Specification: Phase 9: reducer-config-message"
description: "Name the missing review config in the reducer's strict failure headline instead of calling it state-log corruption."
trigger_phrases:
  - "reducer config message"
  - "phase 9 reducer config message"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: reducer-config-message

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-11 |
| **Branch** | `worktrees/099-residual-closeout` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 10 |
| **Predecessor** | 008-surface-hint-hub-root |
| **Successor** | 010-final-gate-ledger |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the residual closeout phase parent. It fixes review finding P2-4 from the 006 closeout review.

**Scope Boundary**: Only the files in the table below change.

**Dependencies**:
- None beyond the files named below.

**Deliverables**:
- Name the missing review config in the reducer's strict failure headline instead of calling it state-log corruption.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A review folder with a state log and no `deep-review-config.json` fails strict reduction with `parseJsonl detected 1 corrupt line(s) in <state log>` and the hint `to ignore corruption`, though the log parsed clean.

### Purpose
When the only warnings are file-level, the headline names the missing file instead of corrupt lines, and the hint still names --lenient.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `createCorruptionError` in reduce-state.cjs
- One assertion on the headline in the reducer test

### Out of Scope
- The error code STATE_CORRUPTION, which callers match on
- The lenient path

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modify | Headline wording |
| `deep-review-state-reducer.vitest.ts` | Modify | Headline assertion |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Config-only failure names the config | The headline holds `deep-review-config.json` and not `corrupt line` |
| REQ-002 | Error code unchanged | `error.code` stays STATE_CORRUPTION |

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
