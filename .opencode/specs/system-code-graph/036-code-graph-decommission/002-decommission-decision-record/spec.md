---
title: "Feature Specification: Phase 2: decommission-decision-record"
description: "Ratify the decommission as an architecture decision: accept the permanent loss of structural code search, fix the replacement routing, set the archival boundary, and write the rollback procedure that every later phase depends on."
trigger_phrases:
  - "code graph decommission decision"
  - "code graph removal ADR"
  - "structural search replacement decision"
  - "decommission rollback procedure"
  - "036 decision record"
importance_tier: "critical"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/002-decommission-decision-record"
    last_updated_at: "2026-07-27T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Draft the decision record once the touchpoint research synthesis lands"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-002-decommission-decision-record"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: decommission-decision-record

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Not Started |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 15 |
| **Predecessor** | 001-touchpoint-research |
| **Successor** | 003-runtime-deregistration |
| **Handoff Criteria** | `decision-record.md` records the accepted capability loss, the per-consumer disposition, the archival boundary, and a tested rollback procedure |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the code graph decommission specification.

**Scope Boundary**: Decision-only. This phase authors a decision record and changes no runtime file.

**Dependencies**:
- The touchpoint inventory and per-consumer recommendations from phase 001.

**Deliverables**:
- A decision record accepting the permanent removal of structural code search.
- The replacement routing doctrine that phases 010 and 011 will write into agents and instruction files.
- A per-consumer disposition table: remove the feature outright, or retain the call site behind a fallback.
- A rollback procedure with the exact steps to restore a working subsystem.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Removing the subsystem permanently deletes a capability that project doctrine currently lists as mandatory: `code_graph_query` and its siblings are named in the Mandatory Tools table, the Code Search Decision Tree, and eight agent definitions across three runtimes. Deleting the implementation without first deciding what replaces that routing would leave every consumer pointing at a tool that no longer exists, and would leave the next contributor with no record of why.

### Purpose
Convert the operator decision into a durable, citable record — what is being given up, what replaces it, which consumers keep a fallback, and how to undo the whole thing — so that phases 003 through 015 execute against a ratified decision rather than an assumption.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The decision to remove structural code search permanently, with its accepted consequences.
- The replacement routing: Grep and Glob for code discovery, `memory_search` for spec docs and saved memory.
- A per-consumer disposition for `system-spec-kit`, `system-skill-advisor`, the deep-loop surface, and the command surface.
- The archival boundary that constrains every later phase.
- The rollback procedure and the conditions under which it would be invoked.

### Out of Scope
- Designing or selecting a replacement indexing engine.
- Any edit to a consumer, config, doc, or agent definition.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `decision-record.md` | Create | The ratified decommission decision and its rationale |
| `spec.md` | Modify | Record the resolved dispositions once decided |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The accepted capability loss is stated explicitly | The record names each of the eight tool ids that will no longer exist |
| REQ-002 | Replacement routing is specified | The record states what agents and doctrine should route to instead, precisely enough to copy into instruction files |
| REQ-003 | Rollback procedure is written and concrete | Steps restore a working subsystem from git history, including the launcher rebuild path |
| REQ-004 | The archival boundary is ratified | The record states that `.opencode/specs/**`, changelogs, and benchmark reports are not to be edited |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Per-consumer disposition table | Each consumer carries remove-or-fallback with a rationale |
| REQ-006 | Loss of the isolation-check guard is noted | The record explains why the CI job becomes meaningless and what pattern should not be reintroduced |
| REQ-007 | Concurrency constraint is recorded | The record states that deletion must not run while another session is mid-write |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every later phase can cite this record for its disposition instead of re-deciding.
- **SC-002**: The rollback procedure is specific enough to execute without further research.
- **SC-003**: No requirement in phases 003–014 contradicts a disposition recorded here.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 synthesis | Dispositions would be guesses | Do not draft until `research/research.md` exists |
| Risk | Capability loss regretted later | Rework to reinstate structural search | Rollback procedure and preserved git history |
| Risk | Decision record drifts from execution | Later phases diverge silently | Each phase cites the record; deviations are flagged, not silent |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does any consumer justify keeping a degraded fallback rather than removing the feature outright?
- Should the replacement routing name a future indexing engine, or stay silent on replacement?
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
