---
title: "Feature Specification: Pathspec Integrity"
description: "A check for the failure class where git reports success while committing less than the operator named."
trigger_phrases:
  - "pathspec-integrity"
  - "git advisory pathspec-integrity"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/004-pathspec-integrity"
    last_updated_at: "2026-07-27T21:20:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the phase scope; detail awaits research output"
    next_safe_action: "Wait for phase 001 research to land"
    blockers:
      - "Depends on phase 001 research output"
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-sk-git-016-4"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Pathspec Integrity

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-preflight-hook |
| **Successor** | None |
| **Handoff Criteria** | See the parent Phase Documentation Map |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Git action advisory hook specification.

**Scope Boundary**: A check that compares the paths named on a pathspec commit against the paths the commit actually contains.

**Dependencies**: Phase 001 research output. This phase is deliberately thin until that lands — writing the detail now would mean inventing the answers the research exists to find.

**Deliverables**: See requirements below.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`git commit --only <paths>` silently skips paths that are untracked. It reports success, the omission is invisible in a file count, and the dropped fix can then be destroyed by a later restore from HEAD. That happened in this repository and no sk-git rule covers it.

### Purpose

Make a commit that did less than it was told say so.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A check that compares the paths named on a pathspec commit against the paths the commit actually contains.

### Out of Scope
- Rewriting how commits are made. The check reports; it does not alter commit behaviour.
- Blocking behaviour. The pre-commit, commit-msg and pre-push hooks own enforcement; this packet advises.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| To be determined by phase 001 research | Pending | The research names the surfaces this phase touches |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A pathspec commit that drops a named path is reported | Reproduce the original failure and assert the check catches it |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The check covers the wider class research identifies, not only this one instance | Each additional failure mode research confirms has a corresponding check or a documented reason it has none |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The original omission is reproducible and caught
- **SC-002**: Related success-while-doing-less operations are covered or explicitly deferred
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 research | Blocks this phase entirely | Phase 001 is in flight |
| Risk | Scoping the check so narrowly it catches only the one remembered instance | Med | Named in phase 001 requirements |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Answered by phase 001 research output.
<!-- /ANCHOR:questions -->
