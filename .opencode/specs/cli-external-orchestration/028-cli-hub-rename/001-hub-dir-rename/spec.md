---
title: "Feature Specification: Phase 1 Hub Directory Rename"
description: "Establish cli-external-orchestration as the canonical external CLI hub while preserving repository history and nested executor layout."
trigger_phrases:
  - "cli-external-orchestration hub rename"
  - "history-preserving git move"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/028-cli-hub-rename/001-hub-dir-rename"
    last_updated_at: "2026-07-13T06:08:29Z"
    last_updated_by: "markdown-agent"
    recent_action: "Documented completed hub directory rename"
    next_safe_action: "Use phase 2 for advisor alignment"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "135-cli-hub-rename-doc-finalization"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: hub-dir-rename

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

Phase 1: hub-dir-rename: scoped, completed, and verified; evidence is recorded in the phase docs below.

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
| **Phase** | 1 of 4 |
| **Predecessor** | None |
| **Successor** | `../002-advisor-realign/spec.md` |
| **Handoff Criteria** | Hub exists at `.opencode/skills/cli-external-orchestration/` with history preserved |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the cli-hub-rename specification.

**Scope Boundary**: Rename the hub directory only; advisor and reference consumers belong to later phases.

**Dependencies**:
- Existing external CLI hub and nested executor packets

**Deliverables**:
- Canonical `.opencode/skills/cli-external-orchestration/` directory
- Preserved nested `cli-opencode` and `cli-claude-code` packets

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The external CLI hub used a directory identity that no longer matched the canonical parent-skill name. A naive copy could split history or leave duplicate hubs.

### Purpose
Rename the existing hub with repository history intact and leave consumer updates to explicit downstream phases.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move the existing hub to `.opencode/skills/cli-external-orchestration/` with `git mv`.
- Preserve nested workflow packet structure.
- Hand off the new path to advisor and reference workstreams.

### Out of Scope
- Advisor projection updates, handled in phase 2.
- Broad live-reference updates, handled in phase 3.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/` | Rename | Canonical external CLI parent hub |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve hub history during the rename | The move is performed with `git mv` |
| REQ-002 | Keep nested executor packets intact | Both executor packet directories remain under the hub |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Establish one canonical live hub path | Live hub resolves under `.opencode/skills/cli-external-orchestration/` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The hub rename is represented as a repository move, not a duplicated tree.
- **SC-002**: Phase 2 can target the new hub without restructuring nested executors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Git index | History could be obscured | Use `git mv` |
| Risk | Missed live consumers | High | Isolate consumer work in phases 2 and 3 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **Reliability**: One canonical hub path must remain after the move.
- **Maintainability**: Nested executor ownership must remain explicit.

## 8. EDGE CASES

- None identified for this completed phase; the move is deterministic and reversible via `git mv`.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Basis |
|---|---:|---|
| Scope | 18/25 | Cross-cutting skill directory |
| Risk | 18/25 | Path identity affects routing consumers |
| Research | 8/20 | Existing structure was known |
| Coordination | 12/15 | Three downstream workstreams |
| **Total** | **56/85** | **Level 3** |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| R-001 | Duplicate or history-less hub | High | Low | Direct `git mv` |

## 11. USER STORIES

**As a** CLI workflow maintainer, **I want** one canonical external CLI hub, **so that** routing and documentation share a stable parent identity.

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
