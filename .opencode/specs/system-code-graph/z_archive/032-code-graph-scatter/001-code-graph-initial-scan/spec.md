---
title: "Feature Specification: Populate the empty code graph via an initial code_graph_scan"
description: "The code graph is empty (0 nodes, freshness=empty, action=full_scan), so structural queries return nothing. Run an initial full code_graph_scan to populate it and verify the graph reports ready. Requires mk_code_index reconnected (Phase 1 fix)."
trigger_phrases:
  - "code graph initial scan"
  - "code_graph_scan populate"
  - "empty code graph full scan"
  - "code graph readiness"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/032-code-graph-scatter/001-code-graph-initial-scan"
    last_updated_at: "2026-05-28T17:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-2 spec; scan pending mk_code_index reconnect"
    next_safe_action: "Reconnect mk_code_index, then run code_graph_scan + verify status"
    blockers: ["mk_code_index disconnected; scan cannot run until reconnect"]
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000295"
      session_id: "029-002-spec"
      parent_session_id: null
    completion_pct: 40
    open_questions: []
    answered_questions:
      - "Scan requires the Phase 1 fix so mk_code_index can reconnect first"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Populate the empty code graph via an initial code_graph_scan

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-05-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 7 |
| **Predecessor** | 001-ipc-socket-dir-canonicalize |
| **Successor** | 003-daemon-reliability-research |
| **Handoff Criteria** | code_graph_status reports nodes > 0 and freshness != empty |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the packet: with the code-graph server able to start (Phase 1), populate the empty graph so structural queries work.

**Scope Boundary**: One operational `code_graph_scan` (full) + a readiness verification. No code changes.

**Dependencies**: Phase 1 (the socket-dir fix) must be live so `mk_code_index` reconnects; the scan runs through that server.

**Deliverables**: A populated code graph (nodes > 0) and a `code_graph_status` showing non-empty freshness.

**Changelog**: When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`code_graph_status` reports `totalNodes: 0`, `freshness: "empty"`, `action: "full_scan"`. Structural code queries (callers, imports, impact) return nothing because the graph has never been built this environment.

### Purpose
Run an initial full scan so the code graph is populated and structural queries are usable.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reconnect `mk_code_index` (validates the Phase 1 fix live).
- Run `code_graph_scan` (full) to populate the graph.
- Verify `code_graph_status` shows nodes > 0 / non-empty freshness.

### Out of Scope
- Code changes (none — operational only).
- Tuning scan scope beyond the default (skills/agents/commands/specs/plugins opt-in already active).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| (none — operational) | N/A | Populates the code-graph DB, not tracked source |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The code graph is populated | `code_graph_status` returns `totalNodes > 0` and `freshness != "empty"` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The scan completes without parser failures blocking readiness | `parserHealth: "ok"` and no blocking errors in status |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `code_graph_status` reports a non-empty graph (nodes > 0).
- **SC-002**: `mk_code_index` reconnected cleanly with no pre-created socket dir (live confirmation of Phase 1).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `mk_code_index` must be reconnected | Blocking | User runs `/mcp` reconnect; Phase 1 fix makes startup succeed |
| Risk | Full scan resource use on a large repo | Low/Med | Scan is bounded by the opt-in scope; run once, verify status |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
