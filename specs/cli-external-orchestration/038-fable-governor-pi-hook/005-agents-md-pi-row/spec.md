---
title: "Phase 5: AGENTS.md Pi Row"
description: "Add the Pi runtime row to AGENTS.md §8 Runtime Agent Directory Resolution, coordinated with agents/002-runtime-surface-coverage which already targets the same table for the full six-runtime update."
trigger_phrases:
  - "AGENTS.md pi row"
  - "runtime directory pi"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/038-fable-governor-pi-hook/005-agents-md-pi-row"
    last_updated_at: "2026-08-04T20:15:00Z"
    last_updated_by: "pi-main-agent"
    recent_action: "Phase authored; successor link added for remediation phase 006"
    next_safe_action: "Implement"
    blockers: []
    key_files:
      - "AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-04-cli-038-005"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Coordinated with agents/002-runtime-surface-coverage T001 (same table)"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase 5: AGENTS.md Pi Row

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-04 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 5 of N |
| **Predecessor** | 004-pi-directive-enforcement |
| **Successor** | 006-dispatch-authorization-hardening |
| **Handoff Criteria** | Pi row present in AGENTS.md §8 table |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
AGENTS.md §8 Runtime Agent Directory Resolution lists Opencode, Claude Code, and Codex CLI — pi is absent, so pi agents resolving their directory have no documented row (research B2 confirmed the omission).

### Purpose
AGENTS.md documents `Pi → .pi/agents/` like the other runtimes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Pi row in the AGENTS.md §8 table

### Out of Scope
- Full six-runtime table update — owned by `agents/002-runtime-surface-coverage` (T001). This phase implements the pi row if 002 has not; if 002 lands first, this phase reduces to verification.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `AGENTS.md` | Modify | Add Pi row to §8 table |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | AGENTS.md §8 table contains Pi → `.pi/agents/` | grep AGENTS.md shows the row |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | No duplicate/conflicting row if 002-runtime-surface-coverage already updated the table | grep shows exactly one pi row |
| REQ-003 | Row follows sibling runtime formatting (bold name, backticked dir) | grep shows `| **Pi**            | `.pi/agents/`    |` pattern |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Exactly one Pi row in the §8 table, consistent with sibling runtimes' formatting
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Duplicate/conflicting row with agents/002 packet | Med | Check 002 state first (T001) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Coordination with `agents/002-runtime-surface-coverage`: if that packet's T001 executes first, this phase only verifies.
<!-- /ANCHOR:questions -->
