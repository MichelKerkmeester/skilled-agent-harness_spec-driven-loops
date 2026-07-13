---
title: "Feature Specification: Phase 2 Advisor Realignment"
description: "Align advisor metadata and routing projections with cli-external-orchestration while retaining cli-opencode as the concrete executor."
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
    packet_pointer: "skilled-agent-orchestration/135-cli-hub-rename/002-advisor-realign"
    last_updated_at: "2026-07-13T06:08:29Z"
    last_updated_by: "markdown-agent"
    recent_action: "Documented completed advisor realignment"
    next_safe_action: "Use phase 3 for live-reference alignment"
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
# Feature Specification: Phase 2: advisor-realign

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

Phase 2: advisor-realign: scoped, completed, and verified; evidence is recorded in the phase docs below.

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
| **Phase** | 2 of 4 |
| **Predecessor** | `../001-hub-dir-rename/spec.md` |
| **Successor** | `../003-reference-sweep/spec.md` |
| **Handoff Criteria** | Local advisor resolves `cli-opencode` through the new hub at confidence 0.95 and uncertainty 0.20 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the cli-hub-rename specification.

**Scope Boundary**: Advisor descriptors, hub routing metadata, and generated routing projections only.

**Dependencies**:
- Completed phase 1 hub move

**Deliverables**:
- Canonical parent hub routing identity
- Fresh routing projection
- Local advisor smoke evidence

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Moving the hub invalidates advisor paths and projections unless they are regenerated or repointed. The hub and nested executor must remain distinct identities.

### Purpose
Make advisor routing discover the `cli-external-orchestration` parent and resolve concrete requests to `cli-opencode`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Repoint advisor metadata to `cli-external-orchestration`.
- Preserve `cli-opencode` as a nested workflow packet.
- Produce a fresh routing projection and smoke result.

### Out of Scope
- Broad prose updates, owned by phase 3.
- Repairing unrelated graph key paths, outside this packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/description.json` | Modify | Parent advisor identity |
| Routing projection artifacts | Regenerate | Fresh hub-to-executor projection |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Advisor recognizes the canonical parent hub | Hub metadata points to `cli-external-orchestration` |
| REQ-002 | Concrete executor intent remains routable | Smoke resolves `cli-opencode` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Projection is fresh | Hash equals `sha256:56e8cceee4c9c7a1eadcdb024e9ac48c9215323bafa96e851abc610dc5a583f0` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Local smoke returns `cli-opencode`, confidence 0.95, uncertainty 0.20.
- **SC-002**: Projection freshness check reports the pinned hash.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 hub move | Metadata could point to a missing path | Require phase 1 completion |
| Risk | Hub/executor identity collapse | High | Keep parent and nested packet roles explicit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **Reliability**: routing projection must be reproducibly fresh.
- **Clarity**: hub and executor names must not be used interchangeably.

## 8. EDGE CASES

- None identified for this completed phase; the move is deterministic and reversible via `git mv`.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Basis |
|---|---:|---|
| Scope | 20/25 | Advisor, registry, and generated projection |
| Risk | 20/25 | Routing could silently misdirect |
| Research | 10/20 | Local smoke required |
| Coordination | 10/15 | Depends on move and feeds reference sweep |
| **Total** | **60/85** | **Level 3** |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| R-001 | Stale projection | High | Medium | Pin fresh hash |

## 11. USER STORIES

**As a** CLI dispatcher, **I want** `cli-opencode` to resolve through `cli-external-orchestration`, **so that** executor selection remains deterministic after the hub move.

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
