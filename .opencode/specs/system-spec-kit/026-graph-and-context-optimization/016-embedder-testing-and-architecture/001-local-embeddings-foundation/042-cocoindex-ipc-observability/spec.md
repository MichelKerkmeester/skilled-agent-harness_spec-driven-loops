---
title: "041 CocoIndex IPC Observability"
description: "Adds request correlation, structured timings, serialized response byte counts, gated msgspec decode metadata, client-disconnect counts, and a configurable MCP request timeout."
trigger_phrases:
  - "041 cocoindex ipc observability"
  - "cocoindex ipc debug"
  - "COCOINDEX_CODE_MCP_REQUEST_TIMEOUT_MS"
  - "COCOINDEX_CODE_IPC_DEBUG"
importance_tier: "critical"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/042-cocoindex-ipc-observability"
    last_updated_at: "2026-05-14T16:20:00Z"
    last_updated_by: "main-agent"
    recent_action: "Implemented CocoIndex MCP/daemon IPC observability and timeout configuration"
    next_safe_action: "Use logs from 041 to decide the follow-on behavior packet for refresh/search semantics"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000041"
      session_id: "042-cocoindex-ipc-observability"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should a follow-on packet default MCP refresh_index to false or split refresh from search?"
    answered_questions:
      - "Gate 3: E - phase folder 042-cocoindex-ipc-observability"
      - "Branch: main; no commits"
      - "Memory MCP and SpawnAgent: forbidden"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 041 CocoIndex IPC Observability

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | main (no branch, no commit per dispatch) |
| **Parent Spec** | `../spec.md` (`014-local-embeddings-migration`) |
| **Phase** | 041 |
| **Predecessor** | `035-cocoindex-mcp-reliability` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet 035 found strong daemon-log evidence that the MCP host times out before the CocoIndex daemon finishes work, then the daemon later logs that the client disconnected before the response could be sent. The remaining gap was observability: no request correlation, no stage timings, no serialized response byte counts, and no gated msgspec payload metadata when decode fails.

### Purpose

Add the observability needed to correlate a host-visible MCP timeout with daemon-side IPC work, without changing `refresh_index` defaults or splitting refresh from search.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Request correlation IDs across FastMCP search, daemon client search, daemon dispatch, and error responses.
- Structured JSON one-line logs for parse, embedding, index lookup, rerank, and response serialization stages.
- Serialized response byte counts for JSON and msgspec responses.
- Gated msgspec decode failure metadata behind `COCOINDEX_CODE_IPC_DEBUG=true`.
- In-memory client-disconnect counting exposed through daemon status.
- Configurable MCP request timeout via `COCOINDEX_CODE_MCP_REQUEST_TIMEOUT_MS`.
- Unit tests for timeout env resolution and clamping.

### Out of Scope

- Changing the default value of `refresh_index`.
- Splitting refresh from search.
- Modifying Spec Kit Memory MCP.
- Branches, commits, PRs, network access, or sub-agents.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability.py` | Create | Shared structured logging, reqId, timeout, and decode-debug helpers. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py` | Modify | Add `reqId` to search/error protocol and `clientDisconnects` to daemon status. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py` | Modify | Generate MCP reqIds, enforce/log timeout, log parse and JSON response size. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py` | Modify | Propagate reqIds and log gated response decode failures. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py` | Modify | Log parse/serialization, decode metadata, disconnect counts, daemon timeout config. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | Modify | Log embedding, index lookup, and rerank timings. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_observability.py` | Create | Cover timeout default, invalid values, and clamp range. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Correlate each MCP search request | FastMCP `search` creates a short reqId and passes it through daemon IPC. |
| REQ-002 | Log stage timings | Logs emit `event=cocoindex_stage` for parse, embedding, index lookup, rerank, and response serialization. |
| REQ-003 | Log response byte counts | Logs emit `event=cocoindex_response_size` for JSON and msgspec serialized responses. |
| REQ-004 | Capture decode metadata safely | Decode payload bytes/type/prefix are logged only when `COCOINDEX_CODE_IPC_DEBUG=true`. |
| REQ-005 | Count client disconnects | `_safe_send_bytes` increments a process-local counter and daemon status exposes `clientDisconnects`. |
| REQ-006 | Make timeout configurable | `COCOINDEX_CODE_MCP_REQUEST_TIMEOUT_MS` defaults to `10000`, clamps to `1000..600000`, and is logged at startup/server creation. |
| REQ-007 | Preserve refresh behavior | `refresh_index` default remains unchanged. |
| REQ-008 | Verify locally | Python compile, pytest, editable build, and strict packet validation pass or are documented. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Given an MCP search, when logs are inspected, then reqId-prefixed structured entries show parse, embedding, index lookup, rerank, and response serialization timing.
- **SC-002**: Given a msgspec decode failure and `COCOINDEX_CODE_IPC_DEBUG=true`, when the handler catches the failure, then logs include payload bytes, type, and first-200-byte prefix metadata.
- **SC-003**: Given a client disconnect during daemon response send, when daemon status is requested, then `clientDisconnects` reflects the observed count.
- **SC-004**: Given `COCOINDEX_CODE_MCP_REQUEST_TIMEOUT_MS`, when the server or daemon initializes, then the resolved clamped value is logged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Packet 035 findings | High | Use 035's mapped source path and root-cause hypothesis as the implementation target. |
| Risk | IPC payload prefix can include sensitive source/query content | High | Gate prefix logging behind `COCOINDEX_CODE_IPC_DEBUG=true`; default is off. |
| Risk | Timeout enforcement can interrupt long searches | Medium | Default mirrors the inferred host MCP budget and is configurable up to 600000ms. |
| Risk | Streaming daemon iterators have separate lifecycle behavior | Medium | MCP wrapper timeout covers MCP search; daemon streaming index/search-wait paths remain documented as a limitation. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the next packet make MCP `refresh_index=false` by default, split refresh from search, or both?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **NFR-P01**: Observability logging must not add network or external service dependencies.
- **NFR-S01**: Raw payload content must not be logged unless `COCOINDEX_CODE_IPC_DEBUG=true`.
- **NFR-R01**: Timeout values must be bounded from `1000` to `600000` milliseconds.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Invalid timeout env values fall back to `10000`.
- Too-low timeout values clamp to `1000`.
- Too-high timeout values clamp to `600000`.
- Decode failures before reqId extraction still log metadata with a newly generated reqId for the error response.
- Daemon status works without a loaded project and includes `clientDisconnects`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Six Python source files plus one focused pytest. |
| Risk | 17/25 | Protocol schema changes and timeout handling touch shared daemon IPC. |
| Research | 13/20 | Built from 035's source map and local code reads. |
| **Total** | **48/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
