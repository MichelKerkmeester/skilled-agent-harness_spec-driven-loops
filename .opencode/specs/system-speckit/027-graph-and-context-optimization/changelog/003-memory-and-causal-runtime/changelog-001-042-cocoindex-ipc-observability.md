---
title: "CocoIndex IPC Observability: Request Correlation and Configurable MCP Timeout"
description: "Adds request-scoped correlation IDs, structured stage timings, response byte counts, gated msgspec decode metadata, client-disconnect counting plus a configurable MCP request timeout to the CocoIndex MCP/daemon IPC path."
trigger_phrases:
  - "cocoindex ipc observability"
  - "COCOINDEX_CODE_IPC_DEBUG"
  - "COCOINDEX_CODE_MCP_REQUEST_TIMEOUT_MS"
  - "cocoindex reqId stage timings"
  - "cocoindex client disconnect counting"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/042-cocoindex-ipc-observability` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

Packet 035 surfaced daemon-log evidence that the MCP host times out before CocoIndex finishes work, then the daemon later logs that the client disconnected before the response could be sent. The remaining gap was observability: no request correlation, no stage timings, no serialized response byte counts. Gated msgspec payload metadata on decode failure was also absent.

This phase wires request-scoped correlation IDs through the FastMCP wrapper, daemon client, msgspec protocol, daemon handler plus query implementation. Structured one-line JSON logs now cover parse, embedding, index lookup, rerank plus response serialization stages. A configurable MCP request timeout (default 10000 ms, clamp 1000 to 600000) is enforced at the server level and logged at both MCP server creation and daemon startup. Sensitive payload prefix data is gated behind `COCOINDEX_CODE_IPC_DEBUG=true`. The `refresh_index` default and refresh/search split are unchanged.

### Added

- `observability.py` shared helper with reqId generation, structured JSON logging, stage/response-size log helpers, timeout resolver plus gated msgspec decode-debug utilities
- `reqId` field on `SearchRequest` and `ErrorResponse` in `protocol.py` for cross-path correlation
- `clientDisconnects` field on `DaemonStatusResponse` in `protocol.py` for disconnect accounting
- `COCOINDEX_CODE_MCP_REQUEST_TIMEOUT_MS` env knob (default 10000, clamp 1000 to 600000) logged at server creation and daemon startup
- `test_observability.py` covering default value, invalid input fallback, low clamp, high clamp plus in-range timeout resolution

### Changed

- `server.py` now generates a reqId per MCP search, logs `cocoindex_stage` at parse, wraps the search path in `asyncio.wait_for`, logs `cocoindex_response_size` after JSON serialization. reqId is included in timeout error responses.
- `client.py` propagates `req_id` through `DaemonClient.search` into `SearchRequest` and logs gated msgspec response decode metadata for index, search plus generic send paths
- `daemon.py` logs parse/serialization events via `_send_response`, tracks in-memory client-disconnect counts, increments on broken-pipe or reset, exposes `clientDisconnects` through daemon status, applies the resolved request timeout to direct dispatch work. Resolved timeout config is logged at startup.
- `query.py` logs embedding, index lookup plus rerank stage durations with result counts

### Fixed

- No bug was present before this phase. The change addresses an observability gap that made MCP timeout root-cause analysis impossible without daemon-side correlation data.

### Verification

| Check | Result | Evidence |
|-------|--------|----------|
| Python compile | PASS | `PYTHONPYCACHEPREFIX=/tmp/cocoindex-pycache python3 -m compileall -q .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code .opencode/skills/mcp-coco-index/mcp_server/tests` exit 0 |
| Focused pytest | PASS | `PYTHONPYCACHEPREFIX=/tmp/cocoindex-pycache .venv/bin/python -m pytest tests/test_observability.py tests/test_daemon.py -q` -> 18 passed in 0.79s |
| Full CocoIndex pytest | PASS | `PYTHONPYCACHEPREFIX=/tmp/cocoindex-pycache .venv/bin/python -m pytest tests -q` -> 22 passed, 3 skipped in 4.24s |
| Editable build | PASS | `.venv/bin/python -m pip install -e . --no-deps --no-build-isolation` exit 0 |
| CLI health check | PASS | `.venv/bin/ccc --help` listed init, index, search, status, reset, mcp plus daemon |
| OpenCode alignment | PASS | `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/mcp-coco-index/mcp_server` exit 0 with non-blocking package-wide warnings |
| Strict validate | PASS | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict` -> RESULT: PASSED |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability.py` (NEW) | Created | Shared structured logging helper: reqId generation, timeout resolver, stage/response-size log functions, gated msgspec decode-debug utilities |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py` | Modified | Added optional `SearchRequest.reqId`, `ErrorResponse.reqId` plus `DaemonStatusResponse.clientDisconnects` fields |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py` | Modified | reqId generation per search, `asyncio.wait_for` timeout enforcement, parse and JSON response size logging, timeout config log at server creation |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py` | Modified | req_id propagation through `DaemonClient.search`, gated msgspec decode metadata logging for send paths |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py` | Modified | Disconnect counter, msgspec serialization logging, gated request payload metadata, daemon-side timeout dispatch, clientDisconnects in status, timeout config log at startup |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | Modified | Stage timing logs for embedding, index lookup plus rerank with result counts |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_observability.py` (NEW) | Created | Five pytest cases covering timeout default, invalid value fallback, low clamp, high clamp plus in-range resolution |

### Follow-Ups

- Daemon-side timeout wraps direct `_dispatch` work. Streaming iterator lifetimes, such as index progress or search waiting for active indexing, are still primarily bounded by the MCP wrapper timeout when reached through FastMCP search.
- `COCOINDEX_CODE_IPC_DEBUG=true` can log payload prefixes. Operators should enable it only for short diagnostic runs and turn it off afterward.
- A follow-on packet should decide whether to default `refresh_index` to false, whether to split refresh from search, whether to do both. Use the new observability data as evidence for that decision.
