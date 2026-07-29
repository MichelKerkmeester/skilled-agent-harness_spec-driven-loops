---
title: "Feature Specification: Destructive Tier"
description: "Seven destructive-operation rules retained by the research, each narrowed to positive state or an explicit rare destructive token."
trigger_phrases:
  - "git destructive advisory rules"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/005-destructive-tier"
    last_updated_at: "2026-07-28T07:30:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Built and verified in one pass"
    next_safe_action: "Operator review"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-28-sk-git-016-5"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Destructive Tier

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-28 |
| **Branch** | `sk-git/0113-016-advisory-hook-build` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-pathspec-integrity |
| **Successor** | 006-runtime-parity |
| **Handoff Criteria** | Tests green and the noise audit stays within budget |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The first ten rules covered the success-while-doing-less class. The research also retained a destructive tier — hard resets, forced cleans, forced branch deletes, stash clears, history expiry, remote deletions and plain force pushes — on the condition that each be narrowed to positive state, never the verb.

### Purpose

Encode the retained destructive tier without breaking the noise budget.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Seven rules: reset-hard on a dirty tree, clean that would really delete, branch -D with unmerged commits, stash clear with entries, immediate history expiry, remote ref deletion, and force without lease

### Out of Scope
- Blocking behaviour; every rule stays advisory.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| See implementation-summary.md | Modify | Recorded there with evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Seven rules: reset-hard on a dirty tree, clean that would really delete, branch -D with unmerged commits, stash clear with entries, immediate history expiry, remote ref deletion, and force without lease | 23/23 tests pass including one reproduction per rule; audit reports 0/25 ordinary fires with 17 rules active |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The noise budget holds with the change in place | Audit re-run reports within budget |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 23/23 tests pass including one reproduction per rule; audit reports 0/25 ordinary fires with 17 rules active
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 002 and 003 | Foundation | Complete and merged |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
