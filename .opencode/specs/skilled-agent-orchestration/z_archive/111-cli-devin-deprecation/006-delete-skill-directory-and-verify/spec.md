---
title: "Feature Specification: Phase 6: delete-skill-directory-and-verify"
description: "After all active references are removed and canonical assets re-homed, the cli-devin skill directory must be deleted and the whole deprecati"
trigger_phrases:
  - "cli-devin deprecation phase 6"
  - "delete-skill-directory-and-verify"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/111-cli-devin-deprecation/006-delete-skill-directory-and-verify"
    last_updated_at: "2026-06-08T17:34:13.174Z"
    last_updated_by: "deprecation-host"
    recent_action: "Phase 6 complete: delete-skill-directory-and-verify executed and verified"
    next_safe_action: "Deprecation complete; operator commits the change-set"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ctx-142-cli-devin-20260608151217"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: delete-skill-directory-and-verify

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-08 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-historical-record-reference-sweep |
| **Successor** | None (final phase) |
| **Handoff Criteria** | cli-devin dir deleted; 0 dead paths; tests + CI green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the cli-devin deprecation specification. The verified, line-resolved edit list lives in ../context/context-report.md §2.

**Scope Boundary**: Delete .opencode/skills/cli-devin/

**Dependencies**:
- Predecessor phase 005-historical-record-reference-sweep complete

**Deliverables**:
- Delete .opencode/skills/cli-devin/
- Global verification grep (active surface)
- Type-check + run touched test suites
- 4-seat adversarial deep review + fix confirmed findings

**Changelog**:
- Phase work recorded in implementation-summary.md.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After all active references are removed and canonical assets re-homed, the cli-devin skill directory must be deleted and the whole deprecation verified for completeness and correctness.

### Purpose
Delete the cli-devin skill directory and verify zero active references, no dead paths, sound runtime dispatch, and clean CI — closed out by an adversarial deep review.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete .opencode/skills/cli-devin/
- Global verification grep (active surface)
- Type-check + run touched test suites
- 4-seat adversarial deep review + fix confirmed findings

### Out of Scope
- Committing the change-set (operator controls commits)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-devin/` | Delete | Whole skill directory removed (~70 files) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | cli-devin directory deleted | dir absent |
| REQ-002 | Zero dead cli-devin/ path references in active files | grep 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Touched test suites + CI green | 56 + 23 + 5 tests pass; CI exit 0 |
| REQ-004 | Deep review finds no P0; P1/P2 fixed or documented | 4-seat review complete |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: cli-devin dir deleted; 0 dead paths; tests + CI green
- **SC-002**: deep review: 0 P0; 2 P1 + genuine P2 fixed; remainder documented
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Predecessor phase 005-historical-record-reference-sweep | Blocks start | Completed before this phase |
| Risk | Dangling reference after edits | Med | Global grep verification + deep review |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — phase complete and verified.
<!-- /ANCHOR:questions -->
