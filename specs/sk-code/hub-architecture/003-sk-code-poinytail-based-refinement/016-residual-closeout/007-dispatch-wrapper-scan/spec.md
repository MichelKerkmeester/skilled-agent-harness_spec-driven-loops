---
title: "Feature Specification: Phase 7: dispatch-wrapper-scan"
description: "Make inspectDispatch read every shell wrapper payload in a command, not only the first."
trigger_phrases:
  - "dispatch wrapper scan"
  - "phase 7 dispatch wrapper scan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: dispatch-wrapper-scan

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
| **Phase** | 7 of 10 |
| **Predecessor** | 006-closeout-deep-review |
| **Successor** | 008-surface-hint-hub-root |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the residual closeout phase parent. It fixes review finding P2-1 from the 006 closeout review.

**Scope Boundary**: Only the files in the table below change.

**Dependencies**:
- None beyond the files named below.

**Deliverables**:
- Make inspectDispatch read every shell wrapper payload in a command, not only the first.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`inspectDispatch` in `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` unwraps only the first `bash -c` wrapper. `bash -c 'true' ; bash -c "devin -p task </dev/null"` returns `none`, so the Pi preflight guard never inspects the dispatch, while the reverse order returns `direct`.

### Purpose
Every wrapper payload in the command is classified, and the results combine the way the segment loop combines them: one direct executor and nothing else reads `direct`, anything more reads `ambiguous`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `shellPayload` and its call in `inspectDispatch`
- One regression test for a dispatch in the second wrapper

### Out of Scope
- Shapes the guard cannot prove, such as a variable in command position
- Other wrappers than bash, sh, zsh and dash

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Modify | Scan every wrapper payload |
| The dispatch-audit test file | Modify | Second-wrapper case |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A dispatch in a later wrapper is seen | `inspectDispatch` on the two-wrapper command returns direct cli-devin in both orders |
| REQ-002 | No regression | Hooks vitest and the stdin deadline tests pass |

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
