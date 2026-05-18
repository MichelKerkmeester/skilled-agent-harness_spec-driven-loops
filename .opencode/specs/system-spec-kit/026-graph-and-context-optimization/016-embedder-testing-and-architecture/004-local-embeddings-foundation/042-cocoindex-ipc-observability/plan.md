---
title: "Implementation Plan: 041 CocoIndex IPC Observability"
description: "Add observability along the existing FastMCP -> daemon client -> daemon dispatch -> query path without changing refresh semantics."
trigger_phrases:
  - "041 implementation plan"
  - "cocoindex ipc observability plan"
importance_tier: "critical"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/042-cocoindex-ipc-observability"
    last_updated_at: "2026-05-14T16:20:00Z"
    last_updated_by: "main-agent"
    recent_action: "Planned CocoIndex observability implementation"
    next_safe_action: "Use 041 logs for behavior follow-up"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000041"
      session_id: "042-cocoindex-ipc-observability-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 041 CocoIndex IPC Observability

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3.11 |
| **Framework** | FastMCP, multiprocessing Connection IPC, msgspec msgpack |
| **Storage** | Existing SQLite/vec query path only |
| **Testing** | pytest, compileall, editable build, spec strict validation |

The implementation keeps the existing daemon architecture and threads a short request ID through the search protocol. Timings are emitted at the layer that owns each stage: MCP wrapper for parse/JSON response, daemon for IPC parse/msgspec serialization/disconnects, and query for embedding/lookup/rerank.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Packet 035 findings read.
- [x] CocoIndex source tree inspected.
- [x] Scope excludes refresh default changes and search/refresh split.

### Definition of Done

- [x] Observability hooks implemented.
- [x] Timeout env resolver tested.
- [x] Local CocoIndex pytest suite passes.
- [x] Strict packet validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Small shared observability helper plus direct call-site instrumentation.

### Key Components

- **`observability.py`**: owns request IDs, structured JSON logs, timeout env resolution, and gated msgspec decode metadata.
- **`server.py`**: starts MCP request scope, enforces the MCP request timeout, returns reqId in error responses, and logs JSON response sizes.
- **`client.py` / `protocol.py`**: carries reqId over daemon IPC and annotates daemon errors.
- **`daemon.py`**: logs IPC parse/serialization, decode failures, disconnect counts, and timeout config.
- **`query.py`**: records embedding, index lookup, and rerank stage durations.

### Data Flow

`FastMCP search` generates `reqId` -> `DaemonClient.search(..., req_id=...)` encodes `SearchRequest.reqId` -> `daemon.handle_connection` decodes/logs parse -> `_dispatch` passes reqId into `ProjectRegistry.search` -> `query_codebase` logs stage timings -> daemon and MCP wrapper log serialized response sizes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| MCP search wrapper | User-facing FastMCP tool | Add reqId, timeout, JSON response size logging | `pytest tests`, compileall |
| Daemon IPC protocol | msgspec request/response schema | Add optional `reqId` and `clientDisconnects` fields | `pytest tests` |
| Daemon handler | Reads, decodes, dispatches, sends responses | Add parse/serialization logs, timeout, decode metadata, disconnect counter | `pytest tests/test_daemon.py` |
| Query path | Embedding, lookup, rerank | Add reqId-aware timing logs | compileall, full pytest |
| Timeout env | No explicit MCP knob | Add `COCOINDEX_CODE_MCP_REQUEST_TIMEOUT_MS` default `10000`, clamp `1000..600000` | `tests/test_observability.py` |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Scaffold Level 2 packet.
- [x] Read packet 035 findings.
- [x] Inspect CocoIndex server/client/daemon/protocol/query source.

### Phase 2: Core Implementation

- [x] Add shared observability helpers.
- [x] Carry reqId through MCP search and daemon search IPC.
- [x] Add structured timing and response-size logs.
- [x] Add gated msgspec decode metadata.
- [x] Add client-disconnect counter and daemon-status exposure.
- [x] Add timeout env resolver and request timeout handling.

### Phase 3: Verification

- [x] Add pytest coverage for timeout env resolution.
- [x] Run compile/test/build checks.
- [x] Fill packet docs and strict validate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Timeout default/invalid/clamp behavior | pytest |
| Regression | Existing daemon resilience tests | pytest |
| Integration-lite | Full CocoIndex test suite | pytest |
| Syntax/build | Python source compile and editable install | compileall, pip editable build |
| Spec | Level 2 packet validation | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing venv | Local | Green | Required for pytest and editable build. |
| Network | External | Not used | Build isolation attempted network and failed; rerun used `--no-build-isolation --no-deps`. |
| Packet 035 | Internal | Green | Provided root-cause hypothesis and source map. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the 041 source changes in `cocoindex_code/` and remove `tests/test_observability.py`. No database migration or index format change was introduced.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Setup -> implementation -> verification. Packet 041 depends on packet 035's diagnostics and blocks the follow-on behavior packet.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Actual Effort |
|-------|------------|---------------|
| Setup | Low | Scaffold and source reads |
| Core Implementation | Medium | Protocol, daemon, MCP wrapper, and query instrumentation |
| Verification | Medium | Compile, pytest, editable build, strict validation |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

No data reversal is needed. The only runtime knobs added are environment variables and optional log output.
<!-- /ANCHOR:enhanced-rollback -->
