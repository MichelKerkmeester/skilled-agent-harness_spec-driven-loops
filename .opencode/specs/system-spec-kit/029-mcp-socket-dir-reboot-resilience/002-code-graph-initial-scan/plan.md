---
title: "Implementation Plan: Populate the empty code graph via an initial code_graph_scan"
description: "Operational plan: reconnect mk_code_index (validates Phase 1), run a full code_graph_scan to populate the empty graph, then verify code_graph_status reports a non-empty, ready graph."
trigger_phrases:
  - "code graph initial scan plan"
  - "code_graph_scan full populate plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/029-mcp-socket-dir-reboot-resilience/002-code-graph-initial-scan"
    last_updated_at: "2026-05-28T17:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-2 plan; scan pending mk_code_index reconnect"
    next_safe_action: "Reconnect mk_code_index, then run code_graph_scan + verify status"
    blockers: ["mk_code_index disconnected; scan cannot run until reconnect"]
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000296"
      session_id: "029-002-plan"
      parent_session_id: null
    completion_pct: 40
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Populate the empty code graph via an initial code_graph_scan

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | N/A (operational MCP tool call) |
| **Framework** | system-code-graph MCP (`code_graph_scan`, `code_graph_status`) |
| **Storage** | code-graph SQLite DB |
| **Testing** | Status verification (`code_graph_status`) |

### Overview
With Phase 1 letting `mk_code_index` start, populate the empty graph: reconnect the server, run one full `code_graph_scan`, then confirm `code_graph_status` reports nodes > 0.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (Phase 1 fix + reconnect)

### Definition of Done
- [ ] code_graph_scan completed
- [ ] code_graph_status reports nodes > 0 / non-empty freshness
- [ ] Docs updated
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Operational invocation; no code or schema change.

### Key Components
- **`code_graph_scan`**: Builds the graph from the opted-in scope (skills/agents/commands/specs/plugins).
- **`code_graph_status`**: Reports readiness (nodes, edges, freshness, parser health).

### Data Flow
Reconnect → `code_graph_scan` (full) → persisted graph DB → `code_graph_status` reports ready.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable — this phase is an operational scan with no code change. The only dependency is the Phase 1 socket-dir fix being live so the server reconnects.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Phase 1 socket-dir fix shipped + dist rebuilt (prerequisite)
- [ ] User reconnects mk_code_index (`/mcp`)

### Phase 2: Core Implementation
- [ ] Run `code_graph_scan` (full)

### Phase 3: Verification
- [ ] `code_graph_status` reports nodes > 0
- [ ] Update docs
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Verification | Graph readiness after scan | `code_graph_status` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| mk_code_index reconnect | Internal | Yellow (disconnected) | Scan cannot run |
| Phase 1 socket-dir fix | Internal | Green (shipped) | Reconnect would fail without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Scan corrupts or destabilizes the graph DB.
- **Procedure**: The graph is a derived cache; re-run `code_graph_scan` (full) to rebuild, or clear the graph DB and rescan. No source rollback needed.
<!-- /ANCHOR:rollback -->
