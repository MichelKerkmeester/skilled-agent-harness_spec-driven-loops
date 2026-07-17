---
title: "Implementation Plan: 035 CocoIndex MCP Reliability"
description: "Plan for diagnosing CocoIndex MCP timeout and msgspec reliability failures without source changes."
trigger_phrases:
  - "035 plan"
  - "cocoindex mcp reliability plan"
importance_tier: "critical"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/035-cocoindex-mcp-reliability"
    last_updated_at: "2026-05-14T00:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Mapped diagnostic phases and follow-up recommendation"
    next_safe_action: "Use implementation-summary.md as the handoff for a fix packet"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan | v2.2 -->
# Implementation Plan: 035 CocoIndex MCP Reliability

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Runtime** | Python FastMCP server under `.opencode/skills/mcp-coco-index/mcp_server` |
| **MCP Tool** | `search` |
| **Daemon Client** | `multiprocessing.connection.Client` over `~/.cocoindex_code/daemon.sock` |
| **Daemon Protocol** | `msgspec` msgpack tagged unions |
| **Known Failure Modes** | `-32001 Request timed out`; `msgspec` decode errors |
| **Mutation Scope** | Packet docs only |

### Overview

This packet is diagnostic. It maps the path from MCP JSON-RPC tool call to daemon IPC response, checks local logs, attempts safe baseline observation, and recommends a follow-up fix. No source changes are made because the failure was only partially reproduced from local evidence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Gate 3 answered with the 035 phase folder.
- [x] User forbade Memory MCP calls and SpawnAgent.
- [x] User forbade branches, commits, and unnecessary source edits.
- [x] 032 failure context supplied by dispatch.

### Definition of Done

- [x] Level-2 packet docs created.
- [x] CocoIndex MCP code paths mapped with file:line refs.
- [x] Local logs and daemon baseline files inspected.
- [x] Diagnostic status recorded as partial where live reproduction was blocked.
- [x] Follow-up fix recommendation documented.
- [x] Strict validation exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

The MCP server is a thin FastMCP wrapper over a long-lived daemon. The wrapper receives a JSON-RPC tool call, optionally refreshes the index, then delegates query execution through a blocking daemon client in an executor. The daemon uses msgpack bytes encoded/decoded by `msgspec` over `multiprocessing.connection`.

### Key Components

- **`server.py`**: exposes the MCP `search` tool and maps daemon responses to Pydantic output.
- **`cli.py`**: exposes `ccc mcp` and starts background indexing while serving stdio.
- **`client.py`**: sends msgpack requests and blocks on `recv_bytes()` until a daemon response.
- **`daemon.py`**: accepts socket connections, decodes requests, dispatches index/search/status, and sends encoded responses.
- **`protocol.py`**: defines msgspec structs and encode/decode helpers.
- **`query.py`**: generates query embeddings and performs sqlite-vec KNN or full-scan search.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scaffold and Context

- Create the 035 Level-2 packet folder.
- Add description and graph metadata with dependency on 032.
- Set scope as diagnostic-only.

### Phase 2: Code Path Mapping

- Find CocoIndex MCP server files.
- Read MCP wrapper, client, daemon, protocol, query, and CLI entry points.
- Search for timeout constants, `-32001`, `msgspec`, and decode wrappers.

### Phase 3: Evidence and Baseline

- Inspect `~/.cocoindex_code` daemon files and logs.
- Inspect `/tmp/cocoindex*` watcher artifacts.
- Attempt non-load-bearing status/baseline observation.
- Record sandbox blockers honestly.

### Phase 4: Synthesis

- Document candidate root causes.
- Pick the highest-confidence hypothesis.
- Recommend a follow-up fix packet and instrumentation.
- Run strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool |
|-----------|-------|------|
| Source map | Locate code paths and line refs | `find`, `rg`, `nl -ba` |
| Timeout search | Locate `-32001`, `Request timed out`, timeout constants | `rg` |
| Log evidence | Daemon and watcher artifacts | `rg`, `tail`, `du`, `ls` |
| Baseline status | Daemon PID/socket and CLI status attempt | `cat`, `ls`, `ccc status` |
| Documentation validation | Level-2 packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Impact |
|------------|--------|--------|
| 032 evidence | Provided | Source of observed `-32001` and msgspec symptoms. |
| CocoIndex source | Present | Enables local path mapping. |
| Local daemon logs | Present | Provides strong client-disconnect evidence. |
| Active daemon process | Partially observable | PID/socket exist; process pressure blocked by sandbox. |
| Host MCP client internals | Not visible | Prevents proving `-32001` emitter in this packet. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

No source code or database mutations are made. If the packet needs rollback, remove the 035 documentation folder only. No daemon state is intentionally changed by this packet.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends on | Blocks |
|-------|------------|--------|
| Scaffold and Context | Gate 3 answer | Code path mapping |
| Code Path Mapping | Source files present | Evidence synthesis |
| Evidence and Baseline | Local logs and daemon files | Root-cause hypothesis |
| Synthesis | Source and log evidence | Strict validation |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Estimate | Notes |
|-------|----------|-------|
| Scaffold and Context | 5 min | Packet-only docs. |
| Code Path Mapping | 20 min | Multiple Python modules plus generated/build copies avoided. |
| Evidence and Baseline | 15 min | Logs are large; bounded grep/tail only. |
| Synthesis | 10 min | Diagnostic handoff and validation. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Scenario | Action |
|----------|--------|
| Strict validation fails | Patch only 035 docs until validation passes or report failure. |
| Source modification accidentally appears | Stop and report; do not revert unrelated user changes. |
| Reproduction blocked by sandbox | Record blocker and keep diagnostic status partial. |
| Follow-up root cause remains uncertain | Defer source fix to follow-up packet with instrumentation first. |
<!-- /ANCHOR:enhanced-rollback -->
