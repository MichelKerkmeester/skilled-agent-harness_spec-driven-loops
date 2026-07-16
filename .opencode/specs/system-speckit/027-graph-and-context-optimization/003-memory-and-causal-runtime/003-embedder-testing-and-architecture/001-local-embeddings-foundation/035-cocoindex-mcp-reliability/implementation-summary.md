---
title: "Implementation Summary: 035 CocoIndex MCP Reliability"
description: "Records the diagnostic map and findings for CocoIndex MCP timeouts and msgspec decode reliability."
trigger_phrases:
  - "035 implementation summary"
  - "cocoindex mcp reliability summary"
importance_tier: "critical"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/035-cocoindex-mcp-reliability"
    last_updated_at: "2026-05-14T00:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Diagnostic packet complete; timeout root cause remains a follow-up fix"
    next_safe_action: "Create follow-up instrumentation packet"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000035"
      session_id: "035-cocoindex-mcp-reliability"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Confirm exact MCP client timeout budget and configurability."
      - "Capture msgspec decode exception text with IPC debug enabled."
    answered_questions:
      - "The daemon/client code has no per-search recv timeout; the visible -32001 timeout is most likely above CocoIndex in the MCP JSON-RPC client layer."
      - "Local logs strongly show clients disconnecting before daemon responses can be sent."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/035-cocoindex-mcp-reliability` |
| **Started** | 2026-05-14 |
| **Completed** | 2026-05-14 |
| **Level** | 2 |
| **Branch** | main |
| **Diagnostic Status** | partial |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Packet 035 created a Level-2 diagnostic record for the CocoIndex MCP reliability issue. No CocoIndex source code was changed.

### Code Path Map

| Layer | Source | Finding |
|-------|--------|---------|
| MCP tool wrapper | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:74` | `create_mcp_server()` constructs `FastMCP("cocoindex-code")`. |
| MCP `search` tool | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:95` | Tool default includes `refresh_index=True`, so every MCP search can start an index refresh unless caller overrides it. |
| Refresh before search | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:139` | If `refresh_index` is true, the MCP call runs `client.index(project_root)` before search. |
| Blocking search delegation | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:141` | `client.search(...)` runs in the executor and blocks until daemon response. |
| CLI MCP entry | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:497` | `ccc mcp` creates the MCP server and triggers `_bg_index()` before stdio serving. |
| Background index | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:515` | `_bg_index()` swallows exceptions, which can hide startup indexing failures from the MCP client. |
| Daemon client search | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:115` | Sends `SearchRequest` and loops on `recv_bytes()` until final `SearchResponse`. |
| Daemon client recv | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:143` | Search has no explicit timeout; EOF becomes `RuntimeError`, decode errors are not wrapped with payload context. |
| Generic send/recv | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:184` | `_send()` does one `recv_bytes()` without timeout. |
| msgspec protocol | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:169` | Msgpack encoders/decoders are module-level `msgspec` objects. |
| decode boundary | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:180` | `decode_request()` and `decode_response()` return typed unions and do not add context to decode failures. |
| daemon receive/decode | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:565` | `handle_connection()` reads bytes, decodes requests, dispatches, and sends encoded responses. |
| daemon invalid request handling | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:591` | Request decode exceptions become `ErrorResponse(message=f"Invalid request: {e}")`. |
| daemon dispatch | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:670` | Search dispatch calls `registry.search()` and returns a `SearchResponse`. |
| daemon listener | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:852` | Listener backlog is `128`; each accepted connection becomes a task. |
| query embedding | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:293` | Every search embeds the query before SQLite search. |
| path-filter full scan | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:300` | `paths` triggers `_full_scan_query()`, which can be slower than KNN. |

### Diagnostic Findings

The strongest local signal is timeout-induced client cancellation rather than daemon-side timeout emission. The CocoIndex daemon/client path has lifecycle timeouts for startup and shutdown, but no per-search timeout that returns `-32001`. Searches for `-32001` and `Request timed out` did not find an emitter in CocoIndex source or the local Python MCP package. That points upward to the host MCP JSON-RPC client layer.

Local daemon logs support that direction. `~/.cocoindex_code/daemon.log` and rotated logs contain repeated `client disconnected before response could be sent` entries. A bounded count across daemon logs returned `28595` matches. The current log shows bursts around `2026-05-14 14:12:47` through `14:13:07` and again around `15:17:08`. In the daemon code, that message is emitted by `_safe_send_bytes()` when the daemon tries to send a response after the client has already disconnected.

The `/tmp/cocoindex-watcher.log` artifact showed a prior indexing run converging at `116495` rows after `1083s`, with daemon PID `47883`. Current daemon files showed `~/.cocoindex_code/daemon.pid` containing `59617`, `daemon.sock` present, and large rotated daemon logs totaling roughly 936 MiB.

Baseline pressure observation was blocked by the sandbox: `ps -ef | grep -i cocoindex` failed with `operation not permitted`, `os.kill(pid, 0)` on the daemon PID raised `PermissionError`, and `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc status` failed with `Operation not permitted: '/Users/michelkerkmeester/.cocoindex_code/daemon.spawn-lock'`.

### Root Cause Hypothesis

Likely root cause: the MCP host/client timeout budget is shorter than the worst-case `search` tool path when `refresh_index=True`, background startup indexing, path-filter full scans, or embedding latency are active. The host cancels the JSON-RPC request and returns `-32001 Request timed out`; the daemon continues processing through its unbounded `recv_bytes()`/dispatch path and later logs `client disconnected before response could be sent`. The msgspec decode failures are probably adjacent transport fallout or schema/payload-context gaps, but this packet did not capture a live msgspec decode stack trace, so that part remains unproven.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Commands and checks were local-only:

| Check | Result |
|-------|--------|
| `find .opencode/skills/mcp-coco-index -type f ...` | Located source and test files; avoided `.venv` for main path mapping. |
| `ls .opencode/skills/mcp-coco-index/mcp_server/` | Confirmed MCP server package and venv layout. |
| `rg "timeout|TIMEOUT|-32001|msgspec|..."` | Found msgspec protocol and internal daemon lifecycle timeouts; no CocoIndex `-32001` emitter. |
| `cat .opencode/bin/cocoindex-launcher.cjs ...` | No launcher found; `.opencode/bin` has no CocoIndex launcher. |
| `ps -ef | grep -i cocoindex` | Blocked by sandbox with `operation not permitted`. |
| `ls /tmp/cocoindex*` | Found watcher script, log, and PID. |
| `find ~/.cocoindex_code -maxdepth 2 -type f` | Found daemon logs, pid, lock, socket, settings. |
| `ccc status` | Blocked by sandbox on `daemon.spawn-lock`. |
| `validate.sh <035> --strict` | Passed. |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Do not patch CocoIndex source in 035 | Reproduction was partial and no single source fix was proven. |
| Treat `-32001` as likely host MCP timeout | No local CocoIndex or Python MCP package emitter was found; daemon logs show client disconnects after work. |
| Treat msgspec root cause as open | The protocol boundary is clear, but current logs did not show the exact decode exception. |
| Recommend instrumentation before behavior change | Need request duration, payload byte length, response byte length, and decode exception context to choose the fix safely. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result | Evidence |
|-------|--------|----------|
| Packet scaffold | PASS | 035 folder contains `description.json`, `graph-metadata.json`, `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`. |
| Source path mapping | PASS | `server.py`, `client.py`, `daemon.py`, `protocol.py`, `query.py`, and `cli.py` cited with line refs. |
| Launcher identification | PASS | No `.opencode/bin/cocoindex-launcher.cjs`; actual MCP entry is `ccc mcp` / `cli.py:497-512`. |
| Local logs inspected | PASS | `~/.cocoindex_code/daemon.log*` and `/tmp/cocoindex*` checked. |
| Reproduction | PARTIAL | Active load reproduction not run; baseline status blocked by sandbox, but logs reproduce the client-disconnect symptom. |
| No source code edits | PASS | Diagnostic docs only. |
| Strict validate | PASS | `validate.sh <035-folder> --strict` exit 0. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. This packet does not fix the reliability issue. It scopes the most likely failure layer and the evidence needed for a fix.
2. Live repeated MCP query load was not run in this dispatch. The user explicitly requested baseline observation rather than repeated MCP queries.
3. Process CPU/memory pressure could not be measured because `ps` and daemon PID probing were blocked by sandbox permissions.
4. The exact host MCP timeout value and `-32001` emitter were not visible in this repository's CocoIndex source.
5. The msgspec decode failure was mapped to protocol boundaries but not actively reproduced with payload capture.

### Recommended Next Step

Open a follow-up fix packet, likely 041+ depending on active numbering, that adds temporary reliability instrumentation before changing behavior: per-request IDs, duration logging around `server.py` refresh/search executor calls, daemon send/receive byte lengths, msgspec decode exception payload metadata behind `COCOINDEX_CODE_IPC_DEBUG`, and a metric for client disconnects. After that, the likely behavioral fix is to split refresh from search for MCP calls or default MCP `refresh_index` to false, then expose a configurable MCP timeout budget or bounded progressive response strategy so long refreshes do not hit host JSON-RPC timeout.
<!-- /ANCHOR:limitations -->
