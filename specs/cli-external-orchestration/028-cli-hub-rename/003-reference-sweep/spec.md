---
title: "Feature Specification: Phase 3 Live Reference Sweep"
description: "Repoint active references to cli-external-orchestration, preserve executor-specific names, and synchronize prompt-quality-card data."
trigger_phrases:
  - "feature"
  - "specification"
  - "name"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/028-cli-hub-rename/003-reference-sweep"
    last_updated_at: "2026-07-13T06:08:29Z"
    last_updated_by: "markdown-agent"
    recent_action: "Documented completed live-reference sweep"
    next_safe_action: "Use phase 4 for verification closeout"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "135-cli-hub-rename-doc-finalization"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: reference-sweep

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## Executive Summary

Phase 3: reference-sweep: scoped, completed, and verified; evidence is recorded in the phase docs below.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-13 |
| **Branch** | `goalC-cli-rename` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 3 of 4 |
| **Predecessor** | `../002-advisor-realign/spec.md` |
| **Successor** | `../004-verify-closeout/spec.md` |
| **Handoff Criteria** | Active references use the correct hub or executor identity and prompt-quality-card sync reports PASS |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the cli-hub-rename specification.

**Scope Boundary**: Active contract and documentation references; historical evidence remains unchanged unless directive.

**Dependencies**:
- Completed advisor realignment

**Deliverables**:
- Repointed live hub references
- Preserved executor-specific references
- Prompt-quality-card synchronization evidence

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After a hub rename, active docs and generated prompt surfaces can continue speaking the old path. Blind replacement would also corrupt legitimate historical evidence.

### Purpose
Make every live consumer name the correct hub or executor while preserving trustworthy history.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Repoint live parent-hub references to `cli-external-orchestration`.
- Keep concrete executor references as `cli-opencode` where appropriate.
- Verify prompt-quality-card synchronization.

### Out of Scope
- Historical records that describe prior state.
- Repository-wide graph repairs unrelated to this rename.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Live skill and command references | Modify | Point to canonical hub path |
| Prompt-quality-card projection | Synchronize | Match current routing data |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Update active parent-hub references | Live instructions point to `cli-external-orchestration` |
| REQ-002 | Preserve executor semantics | Concrete executor references remain `cli-opencode` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Synchronize prompt-quality-card data | Sync check reports PASS |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Live references are repointed without compatibility aliases.
- **SC-002**: Prompt-quality-card sync reports PASS.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 2 identity model | References could use the wrong semantic name | Require phase 2 completion |
| Risk | Historical evidence rewritten | Medium | Classify each occurrence by role |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **Accuracy**: live paths must resolve to existing canonical locations.
- **Auditability**: historical evidence must remain faithful to prior state.

## 8. EDGE CASES

- None identified for this completed phase; the move is deterministic and reversible via `git mv`.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Basis |
|---|---:|---|
| Scope | 22/25 | Cross-repository live references |
| Risk | 18/25 | Semantic hub/executor distinction |
| Research | 12/20 | Occurrence classification |
| Coordination | 10/15 | Depends on advisor model and feeds closeout |
| **Total** | **62/85** | **Level 3** |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| R-001 | Over-broad replacement | Medium | Medium | Live-versus-historical classification |

## 11. USER STORIES

**As a** repository reader, **I want** active references to resolve while historical evidence stays honest, **so that** both operation and audit remain trustworthy.

## 12. OPEN QUESTIONS

- None for this completed phase.

## RELATED DOCUMENTS

- `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
