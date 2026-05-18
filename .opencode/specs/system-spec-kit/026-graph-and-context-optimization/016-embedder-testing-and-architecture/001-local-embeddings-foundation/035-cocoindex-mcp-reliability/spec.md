---
title: "035 CocoIndex MCP Reliability"
description: "Diagnostic packet for sporadic CocoIndex MCP timeouts and msgspec decode failures under repeated query load."
trigger_phrases:
  - "035 cocoindex mcp reliability"
  - "cocoindex mcp timeout"
  - "msgspec decode errors"
  - "request timed out -32001"
related_specs:
  - "032-substrate-repair-followups"
  - "037-llama-cpp-embedding-worker-deep-dive"
  - "039-token-aware-chunking"
importance_tier: "critical"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/035-cocoindex-mcp-reliability"
    last_updated_at: "2026-05-14T00:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Mapped CocoIndex MCP, daemon IPC, msgspec protocol, and local daemon log evidence"
    next_safe_action: "Open a follow-up fix packet for MCP timeout budget and IPC instrumentation"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000035"
      session_id: "035-cocoindex-mcp-reliability"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which host MCP client injects -32001 Request timed out for this runtime?"
      - "Are reported msgspec decode errors malformed daemon IPC payloads, truncated transport reads, or client-side schema mismatches?"
    answered_questions:
      - "Gate 3: E - Phase folder 035-cocoindex-mcp-reliability"
      - "Branch: main; no commits"
      - "Memory MCP and SpawnAgent: forbidden"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec | v2.2 -->
# Feature Specification: 035 CocoIndex MCP Reliability

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
| **Branch** | main (no feature branch; no commit per dispatch) |
| **Parent Spec** | ../spec.md (014-local-embeddings-migration phase parent) |
| **Phase** | 35 |
| **Predecessors** | 032 |
| **Handoff Criteria** | Code path map, local log evidence, candidate root causes, and follow-up recommendation documented; strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet 032 reported repeated-query CocoIndex MCP reliability failures in 24-- scenarios, especially scenarios 404 and 407. The two observed failure modes were:

1. `MCP error -32001: Request timed out` from the JSON-RPC/MCP layer.
2. `msgspec` decode errors between the daemon and its client protocol.

Packets 037 and 039 repair llama-cpp embedding worker availability and token sizing. Those changes should reduce embedding-worker retries, but they do not explain a client-visible JSON-RPC timeout or binary IPC decoding failure in the CocoIndex MCP path.

### Purpose

This packet scopes the reliability issue without changing CocoIndex source. It maps the MCP server, daemon client, daemon handler, msgspec protocol, query implementation, launcher path, and local logs so a follow-up fix packet can target the right layer.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Scaffold Level-2 packet docs for phase 035.
- Map the CocoIndex MCP code path from local source files.
- Locate timeout and msgspec serialization boundaries.
- Inspect local daemon and watcher logs for supporting evidence.
- Attempt a lightweight baseline observation without repeated MCP query load.
- Document candidate root causes and a recommended follow-up fix.
- Strict-validate the 035 packet.

### Out of Scope

- CocoIndex source edits.
- Repeated MCP load generation from this dispatch.
- Branch creation, commits, or PR work.
- Memory MCP calls.
- SpawnAgent usage.
- Network access.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/035-cocoindex-mcp-reliability/` | Create | Level-2 diagnostic packet documentation and metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Failure modes are captured precisely | `spec.md` records both `-32001 Request timed out` and `msgspec` decode failures. |
| REQ-002 | MCP path is mapped with source citations | `spec.md` and `implementation-summary.md` cite file:line refs for server, client, daemon, protocol, and query boundaries. |
| REQ-003 | Timeout ownership is bounded | Docs distinguish daemon/client code timeouts from MCP JSON-RPC timeout ownership. |
| REQ-004 | Local logs are checked | Docs record `~/.cocoindex_code` daemon logs and `/tmp/cocoindex*` watcher findings. |
| REQ-005 | No source code is modified | Only the 035 packet folder is authored. |
| REQ-006 | Follow-up fix is recommended | `implementation-summary.md > What Was Built` and `Known Limitations` state that this packet is diagnostic only. |
| REQ-007 | Strict validation passes | `validate.sh <035-folder> --strict` exits 0. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** the CocoIndex MCP source, **When** the path is mapped, **Then** the MCP tool wrapper, daemon client, daemon handler, and msgspec protocol boundaries are identified with file:line references.
- **SC-002**: **Given** local daemon logs, **When** timeout evidence is inspected, **Then** client disconnect patterns are documented with counts and timestamps.
- **SC-003**: **Given** this packet is diagnostic, **When** no high-confidence code fix is proven, **Then** no CocoIndex source code is changed.
- **SC-004**: **Given** strict validation is required, **When** packet docs are complete, **Then** `validate.sh --strict` passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Failure is sporadic and load-dependent | High | Treat live reproduction as partial; preserve evidence and recommend targeted instrumentation. |
| Risk | `-32001` is emitted outside CocoIndex source | Medium | Search local CocoIndex and installed MCP package; document that source was not found there. |
| Risk | msgspec decode error is not present in current daemon logs | Medium | Document protocol boundary and missing evidence; propose IPC debug capture. |
| Risk | Sandbox blocks `ps` and daemon lock access | Medium | Record the baseline observation failure and use pid/socket/log files instead. |
| Dependency | 032 evidence | High | `graph-metadata.json` depends on 032. |
| Dependency | Active daemon state | Medium | `~/.cocoindex_code/daemon.pid`, socket, and logs provide partial baseline evidence. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which host MCP client layer emits `-32001 Request timed out` in this runtime? It was not found in the CocoIndex source or the local Python `mcp` package search.
- Are msgspec decode errors caused by malformed payload bytes, response schema drift, or the host canceling/truncating a daemon response after timeout?
- Should the follow-up fix raise the host MCP timeout, make `refresh_index=false` the runtime default, split refresh from search, or add cancellation-aware daemon request handling?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

| NFR | Target | Verification |
|-----|--------|--------------|
| Minimality | Diagnostic only | No CocoIndex source patches in this packet |
| Traceability | Findings cite local file:line refs | Source references recorded in `implementation-summary.md` |
| Reproducibility | Baseline commands are documented | Commands and local log paths captured |
| Safety | No daemon stress load from this dispatch | Repeated query load deferred to follow-up |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

1. **MCP client timeout before daemon response**: local logs show repeated daemon-side send failures after the client disconnects.
2. **Background index on MCP startup**: both `server.py` and `cli.py` create a background index task when the MCP server starts, which can contend with explicit `refresh_index=True` searches.
3. **Path-filter full scan**: `query.py` switches to full scan when `paths` is provided, increasing response latency under certain searches.
4. **Daemon status blocked by sandbox**: `ccc status` failed with `Operation not permitted` on `daemon.spawn-lock`, and `ps` was blocked, so process pressure was not measured.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Phase | Complexity | Rationale |
|-------|------------|-----------|
| Scaffold | Low | Docs-only Level-2 packet. |
| Code path mapping | Medium | Crosses FastMCP, daemon client, daemon handler, msgspec protocol, query, and CLI entry points. |
| Reproduction | Medium | Full reproduction needs host MCP load; this dispatch only performed lightweight baseline observation. |
| Root-cause isolation | Medium | Strong timeout/client-disconnect signal, but msgspec decode root remains unproven. |
| Verification | Low | Strict packet validation only. |
<!-- /ANCHOR:complexity -->
