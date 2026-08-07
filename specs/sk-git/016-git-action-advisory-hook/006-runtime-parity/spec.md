---
title: "Feature Specification: Runtime Parity"
description: "The advisory hook now serves Codex as well as Claude through one runtime-agnostic script registered in both hook configs."
trigger_phrases:
  - "git advisory codex runtime"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/006-runtime-parity"
    last_updated_at: "2026-07-28T07:30:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Built and verified in one pass"
    next_safe_action: "Operator review"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-28-sk-git-016-6"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Runtime Parity

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
| **Phase** | 6 of 6 |
| **Predecessor** | 005-destructive-tier |
| **Successor** | None |
| **Handoff Criteria** | Tests green and the noise audit stays within budget |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The hook was registered for the Claude runtime only, so under Codex the rules stayed prose-only — the exact gap this packet exists to close, reopened per runtime.

### Purpose

One hook, both runtimes, no second copy to drift.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Accept the Codex exec payload shape and resolve the project dir from the payload; register in the codex exec hook group

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
| REQ-001 | Accept the Codex exec payload shape and resolve the project dir from the payload; register in the codex exec hook group | A simulated Codex exec payload draws the advisory; the Claude path still fires |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The noise budget holds with the change in place | Audit re-run reports within budget |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A simulated Codex exec payload draws the advisory; the Claude path still fires
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
