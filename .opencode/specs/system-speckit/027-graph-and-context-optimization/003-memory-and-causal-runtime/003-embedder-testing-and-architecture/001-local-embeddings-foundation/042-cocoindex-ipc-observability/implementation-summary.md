---
title: "Implementation Summary: 041 CocoIndex IPC Observability"
description: "Records the CocoIndex MCP/daemon IPC observability hooks, timeout knob, verification evidence, and limitations."
trigger_phrases:
  - "041 implementation summary"
  - "cocoindex ipc observability summary"
  - "COCOINDEX_CODE_IPC_DEBUG"
  - "COCOINDEX_CODE_MCP_REQUEST_TIMEOUT_MS"
importance_tier: "critical"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/042-cocoindex-ipc-observability"
    last_updated_at: "2026-05-14T16:20:00Z"
    last_updated_by: "main-agent"
    recent_action: "Added CocoIndex IPC observability and configurable MCP timeout"
    next_safe_action: "Use 041 logs for behavior follow-up"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_observability.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000041"
      session_id: "042-cocoindex-ipc-observability"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which follow-on behavior change should use the new evidence: default refresh_index=false, split refresh from search, or both?"
    answered_questions:
      - "Timeout knob added: COCOINDEX_CODE_MCP_REQUEST_TIMEOUT_MS, default 10000, clamp 1000..600000."
      - "Sensitive payload metadata is gated by COCOINDEX_CODE_IPC_DEBUG=true."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/042-cocoindex-ipc-observability` |
| **Started** | 2026-05-14 |
| **Completed** | 2026-05-14 |
| **Level** | 2 |
| **Branch** | main |
| **Status** | PASS |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

CocoIndex now emits enough request-scoped evidence to connect an MCP timeout seen by the host with daemon-side work still in flight. The patch adds reqIds, structured stage timings, serialized response sizes, gated msgspec payload metadata, client-disconnect counts, and a configurable MCP request timeout without changing the `refresh_index` default or splitting refresh from search.

### Instrumentation Hooks

| Hook | Source | What changed |
|------|--------|--------------|
| Shared observability helper | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability.py:15` | Defines `COCOINDEX_CODE_MCP_REQUEST_TIMEOUT_MS` default `10000`, clamp range `1000..600000`, `COCOINDEX_CODE_IPC_DEBUG`, reqId generation, structured JSON logging, stage logs, response-size logs, and gated msgspec decode metadata. |
| Protocol correlation fields | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:21` | Adds optional `SearchRequest.reqId`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:147` adds optional `ErrorResponse.reqId`. |
| Diagnostic counter field | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:132` | Adds `DaemonStatusResponse.clientDisconnects`. |
| MCP request scope | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:86` | Resolves/logs timeout config when the FastMCP server is created. |
| MCP search reqId and parse timing | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:158` | Generates a reqId per search and logs `{"event":"cocoindex_stage","stage":"parse",...}`. |
| MCP timeout and error reqId | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:209` | Wraps the full MCP search path in `asyncio.wait_for`; timeout responses include `reqId`. |
| JSON response byte count | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:239` | Serializes the Pydantic result and logs `{"event":"cocoindex_response_size","stage":"json_response",...}`. |
| Daemon client propagation | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:125` | Adds `req_id` to `DaemonClient.search` and encodes it into `SearchRequest`. |
| Client decode metadata | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:100` | Logs gated msgspec response decode metadata for index/search/generic send paths. |
| Client-disconnect counter | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:73` | Tracks disconnects in-memory; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:116` increments on broken pipe/reset. |
| msgspec response size | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:138` | Encodes responses through `_send_response`, logs `response_serialization`, then logs msgspec byte size. |
| Request decode metadata | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:656` | Logs gated request payload metadata when `decode_request` fails. |
| Daemon timeout handling | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:699` | Applies the resolved request timeout to direct dispatch work and returns `ErrorResponse(reqId=...)` on timeout. |
| Daemon status counter | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:805` | Exposes `clientDisconnects` through daemon status. |
| Daemon startup config log | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:905` | Logs resolved timeout config at daemon startup. |
| Query stage timings | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:298` | Logs embedding, index lookup, and rerank durations with result counts. |
| Timeout tests | `.opencode/skills/mcp-coco-index/mcp_server/tests/test_observability.py:13` | Covers default, invalid, low clamp, high clamp, and in-range timeout values. |

### Env Vars

| Env Var | Default | Effect |
|---------|---------|--------|
| `COCOINDEX_CODE_MCP_REQUEST_TIMEOUT_MS` | `10000` | MCP request timeout budget; values clamp to `1000..600000` milliseconds. |
| `COCOINDEX_CODE_IPC_DEBUG` | unset / false | Enables sensitive IPC msgspec decode metadata and send-prefix logging when set to `true`, `1`, `yes`, or `on`. |

### Operator Verification

Set `COCOINDEX_CODE_IPC_DEBUG=true` only for a diagnostic run, then reproduce the failing MCP search. Inspect daemon or MCP logs for:

- `cocoindex_stage` entries by `reqId` and `stage`.
- `cocoindex_response_size` entries by `reqId`.
- `cocoindex_msgspec_decode_error` entries when decode fails.
- `cocoindex_client_disconnect` entries and `clientDisconnects` in daemon status.
- `cocoindex_mcp_request_timeout_config` at MCP server creation and daemon startup.

Example grep targets:

```bash
rg '"event":"cocoindex_stage"' ~/.cocoindex_code/daemon.log*
rg '"event":"cocoindex_response_size"' ~/.cocoindex_code/daemon.log*
rg '"event":"cocoindex_msgspec_decode_error"' ~/.cocoindex_code/daemon.log*
rg '"event":"cocoindex_client_disconnect"' ~/.cocoindex_code/daemon.log*
```
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation followed the code path mapped by packet 035: FastMCP wrapper, daemon client, msgspec protocol, daemon handler, project registry, and query implementation. The existing Python package is editable, so the offline rebuild used `pip install -e . --no-deps --no-build-isolation` after the isolated build attempt tried to reach PyPI and failed under restricted network.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Add a shared `observability.py` helper | The same env parsing and structured log shape is needed in server, daemon, client, and query code. |
| Keep payload prefix logging behind `COCOINDEX_CODE_IPC_DEBUG` | Query/search payloads can contain source snippets or user prompts; default logs must avoid that content. |
| Carry `reqId` in the msgspec search protocol | This is the narrowest way to correlate MCP wrapper logs with daemon/query logs. |
| Expose disconnect count through daemon status | There is already a daemon diagnostic endpoint; adding `clientDisconnects` avoids a new tool. |
| Do not change `refresh_index=True` | The dispatch explicitly scoped refresh semantics to a follow-on behavior packet. |
| Use default timeout `10000` ms | Packet 035 inferred the host MCP timeout was likely in the 5-10s range; 10s is the least surprising explicit budget and can be raised. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result | Evidence |
|-------|--------|----------|
| Python compile | PASS | `PYTHONPYCACHEPREFIX=/tmp/cocoindex-pycache python3 -m compileall -q .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code .opencode/skills/mcp-coco-index/mcp_server/tests` exit 0. Initial run without `PYTHONPYCACHEPREFIX` failed because macOS tried to write bytecode under a non-writable user cache. |
| Focused pytest | PASS | `PYTHONPYCACHEPREFIX=/tmp/cocoindex-pycache .venv/bin/python -m pytest tests/test_observability.py tests/test_daemon.py -q` -> `18 passed in 0.79s`. |
| Full CocoIndex pytest | PASS | `PYTHONPYCACHEPREFIX=/tmp/cocoindex-pycache .venv/bin/python -m pytest tests -q` -> `22 passed, 3 skipped in 4.24s`. |
| Editable build | PASS | `.venv/bin/python -m pip install -e . --no-deps --no-build-isolation` exit 0. Isolated build failed first because network is restricted and pip tried to fetch `setuptools>=61`. |
| CLI health check | PASS | `.venv/bin/ccc --help` listed `init`, `index`, `search`, `status`, `reset`, `mcp`, and `daemon`. No `.opencode/bin` CocoIndex launcher was found. |
| OpenCode alignment | PASS | `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/mcp-coco-index/mcp_server` exit 0 with non-blocking package-wide shebang/docstring warnings. |
| Strict validate | PASS | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/042-cocoindex-ipc-observability --strict` -> `RESULT: PASSED`. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The daemon-side timeout wraps direct `_dispatch` work. Streaming iterator lifetimes, such as index progress or search waiting for active indexing, are still primarily bounded by the MCP wrapper timeout when reached through FastMCP search.
2. `COCOINDEX_CODE_IPC_DEBUG=true` can log payload prefixes. Operators should enable it only for short diagnostic runs and turn it off afterward.
3. This packet does not decide the user-visible behavior change. `refresh_index=True` remains the MCP default, and refresh/search splitting remains a follow-on packet.
<!-- /ANCHOR:limitations -->
