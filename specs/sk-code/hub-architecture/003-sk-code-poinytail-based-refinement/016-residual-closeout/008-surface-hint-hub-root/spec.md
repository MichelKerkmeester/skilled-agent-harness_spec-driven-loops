---
title: "Feature Specification: Phase 8: surface-hint-hub-root"
description: "Send the OPENCODE surface hint only for a workspace inside the hub's own .skilled directory."
trigger_phrases:
  - "surface hint hub root"
  - "phase 8 surface hint hub root"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: surface-hint-hub-root

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
| **Branch** | `worktrees/099-residual-closeout` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 10 |
| **Predecessor** | 007-dispatch-wrapper-scan |
| **Successor** | 009-reducer-config-message |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the residual closeout phase parent. It fixes review finding P2-2 from the 006 closeout review.

**Scope Boundary**: Only the files in the table below change.

**Dependencies**:
- None beyond the files named below.

**Deliverables**:
- Send the OPENCODE surface hint only for a workspace inside the hub's own .skilled directory.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`detectWorkspaceSurface` in `.opencode/plugins/system-skill-advisor.js` returns OPENCODE when any path component is `.skilled`. A folder such as `/tmp/x/.skilled/demo`, outside this hub, gets the hint, which the canonical stack-detection rule does not allow.

### Purpose
The predicate compares the resolved workspace path with the hub's own `.skilled` directory, so only a workspace at or below it gets OPENCODE.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The OPENCODE predicate in detectWorkspaceSurface
- One plugin test for a non-hub `.skilled` path

### Out of Scope
- The OBSIDIAN and WEBFLOW markers
- The advisor front door that consumes the hint

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/system-skill-advisor.js` | Modify | Hub-rooted predicate |
| `system-skill-advisor-plugin.vitest.ts` | Modify | Non-hub case |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Non-hub path sends no OPENCODE hint | A `.skilled` folder outside the hub returns null |
| REQ-002 | Hub path still sends OPENCODE | The existing in-hub test passes |

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
