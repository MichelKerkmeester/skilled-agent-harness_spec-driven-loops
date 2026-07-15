---
title: "Phase 012: Daemon bridge socket for skill-advisor and code-index"
description: "The skill-advisor and code-index daemons now bind IPC bridge sockets after stdio connect. Secondary launcher subprocesses attach via those sockets instead of exiting with the LEASE_HELD_BY garbage string that broke MCP handshakes."
trigger_phrases:
  - "daemon bridge socket skill-advisor"
  - "daemon bridge socket code-index"
  - "secondary launcher attach bridge"
  - "lease held by no bridge socket"
  - "socket-server ipc skill-advisor code-index"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-20

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/012-daemon-bridge-socket-for-skill-advisor-and-code-index` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency`

### Summary

Packet 010 introduced the multi-client stdio-to-socket bridge but shipped daemon-side binding only for `mk-spec-memory`. The skill-advisor and code-index daemons got launcher-side bridge code but no daemon socket to attach to. When a secondary launcher spawned and found a live lease, it would call `maybeBridgeLeaseHolder()`, find no socket file, write `LEASE_HELD_BY:<pid> (no-bridge-socket)` to stdout. The process then exited. The OpenCode plugin's MCP client tried to parse that string as JSON-RPC. Parsing failed. The plugin reported `SYSTEM_SKILL_ADVISOR_UNAVAILABLE` after 145ms.

This packet mirrors the `mk-spec-memory` daemon-side bridge socket pattern into both missing daemons. `socket-server.ts` was copied verbatim into `system-skill-advisor/mcp_server/lib/ipc/` and `system-code-graph/mcp_server/lib/ipc/`. Both daemon entrypoints were refactored with a factory function plus an `startIpcSocketServer` call after stdio connect. Three IPC env vars were added to the skill-advisor launcher's `CHILD_ENV_ALLOWLIST`. Smoke verification on 2026-05-20 confirmed both daemons bind their bridge sockets and secondary launchers print the canonical `bridging to lease holder pid=<n> socket=<path>` line.

### Added

- `socket-server.ts` (verbatim copy from `system-spec-kit/mcp_server/lib/ipc/`) in `system-skill-advisor/mcp_server/lib/ipc/` (NEW)
- `socket-server.ts` (same copy) in `system-code-graph/mcp_server/lib/ipc/` (NEW)
- `createAdvisorMcpServer()` factory in `advisor-server.ts` that wraps `Server` construction and handler registration for reuse per bridge connection
- `createCodeIndexMcpServer()` factory in `system-code-graph/mcp_server/index.ts` with the same pattern
- Explicit `SIGTERM`/`SIGINT` handlers and `shutdownCodeIndex()` in `system-code-graph/mcp_server/index.ts`
- `SPECKIT_IPC_SOCKET_DIR`, `SPECKIT_LAUNCHER_BRIDGE_DISABLED`, `SPECKIT_MAX_SECONDARY_CLIENTS` added to `mk-skill-advisor-launcher.cjs::CHILD_ENV_ALLOWLIST`

### Changed

- `advisor-server.ts`: top-level `Server` construction replaced by `createAdvisorMcpServer()` factory call. `main()` now calls `startIpcSocketServer` after `await server.connect(transport)`. `shutdownAdvisor()` closes the IPC bridge before transport teardown.
- `system-code-graph/mcp_server/index.ts`: same factory and bridge pattern added. Signal handling added where none existed before.

### Fixed

- Secondary skill-advisor launcher subprocesses exited with `LEASE_HELD_BY:<pid> (no-bridge-socket)` when the primary was alive. Bridge socket now present at `/tmp/mk-skill-advisor/daemon-ipc.sock`.
- Secondary code-index launcher subprocesses had the same failure mode. Bridge socket now present at `/tmp/mk-code-index/daemon-ipc.sock`.
- OpenCode plugin's `SYSTEM_SKILL_ADVISOR_UNAVAILABLE` symptom caused by the MCP client receiving the garbage lease string instead of a valid JSON-RPC channel.

### Verification

| Check | Result |
|-------|--------|
| Strict packet validate (`validate.sh --strict`) | Exit 0. Errors: 0. Warnings: 0. PASSED (observed 2026-05-21) |
| `npm run build` in `system-skill-advisor/mcp_server` | Exit 0 |
| `npm run build` in `system-code-graph/mcp_server` | Exit 0 |
| Primary skill-advisor bridge socket present | `/tmp/mk-skill-advisor/daemon-ipc.sock` `srw-------` within ~5s of cold start. Log line `[ipc-bridge] socket listening at /tmp/mk-skill-advisor/daemon-ipc.sock` |
| Primary code-index bridge socket present | `/tmp/mk-code-index/daemon-ipc.sock` `srw-------` within ~10s of cold start |
| Secondary skill-advisor launcher attaches | Output: `[mk-skill-advisor-launcher] bridging to lease holder pid=86629 socket=/tmp/mk-skill-advisor/daemon-ipc.sock` |
| Secondary code-index launcher attaches | Output: `[mk-code-index-launcher] bridging to lease holder pid=87044 socket=/tmp/mk-code-index/daemon-ipc.sock` |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/ipc/socket-server.ts` (NEW) | Verbatim copy of the IPC socket server from `system-spec-kit/mcp_server/lib/ipc/`. Exports `resolveIpcSocketPath`, `startIpcSocketServer`, `getIpcBridgeStats`, `parseMaxClients`. |
| `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts` | Extracted `createAdvisorMcpServer()` factory. Added `startIpcSocketServer` call after stdio connect. Added bridge close in `shutdownAdvisor()`. |
| `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts` (NEW) | Same verbatim copy for the code-index daemon. |
| `.opencode/skills/system-code-graph/mcp_server/index.ts` | Extracted `createCodeIndexMcpServer()` factory. Added `startIpcSocketServer` call. Added `SIGTERM`/`SIGINT` handlers and `shutdownCodeIndex()`. |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Added `SPECKIT_IPC_SOCKET_DIR`, `SPECKIT_LAUNCHER_BRIDGE_DISABLED`, `SPECKIT_MAX_SECONDARY_CLIENTS` to `CHILD_ENV_ALLOWLIST`. |

### Follow-Ups

- Raise the OpenCode plugin's `DEFAULT_BRIDGE_TIMEOUT_MS` beyond 1000ms so a full MCP handshake can complete through the bridge socket under load. Tracked as proposed follow-on `013-plugin-bridge-timeout-tune`.
- Add SQLite-table-level dead-PID reclaim for `skill_graph_daemon_lease`. The bridge fix does not address stale rows pointing at exited processes. The file-lease-level `kill(pid, 0)` probe blocks false-alive reads, but the table rows still accumulate. Tracked as a separate follow-on per packet 011 REQ-006.
- Consolidate `socket-server.ts` from 3 workspace copies into a single shared source. D-001 documents the rationale for the copy approach. A future packet could introduce a shared library once the build-system cost is justified.
