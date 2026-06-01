---
title: "MCP Launcher Concurrency 010: Multi-client stdio-socket launcher bridge"
description: "A shared launcher bridge and a daemon IPC socket server were added so secondary MCP sessions attach to the running daemon instead of exiting with LEASE_HELD_BY. The strict-single-writer invariant is preserved. Typecheck, build and vitest gates all pass."
trigger_phrases:
  - "multi-client launcher bridge"
  - "stdio socket bridge IPC"
  - "launcher bridge concurrency"
  - "LEASE_HELD_BY bridge"
  - "daemon IPC socket server"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/010-multi-client-stdio-socket-bridge` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency`

### Summary

The 006 arc made each MCP launcher a strict-single-writer, protecting SQLite from concurrent writes. A side effect was that any second MCP host session hit `LEASE_HELD_BY:<pid>` and an immediate launcher exit, which the host interpreted as a JSON-RPC `-32000` error and a failed tool connection.

A stdio-to-IPC-socket bridge was built so secondary launcher instances attach to the already-running daemon over a Unix-domain socket instead of exiting. The primary daemon remains the only SQLite writer. Each secondary connection receives its own `Server` instance with full tool-handler registration, sharing only the underlying SQLite handle. The bridge path is gated by socket presence and an operator rollback flag so the legacy `LEASE_HELD_BY` exit is always recoverable via `SPECKIT_LAUNCHER_BRIDGE_DISABLED=1`.

All three MCP launchers have bridge mode. Daemon-side socket listener support shipped for spec-memory in this packet. Code-index and skill-advisor daemon-side listeners were outside the frozen scope and are deferred to a follow-up packet.

### Added

- `.opencode/bin/lib/launcher-ipc-bridge.cjs` (NEW): shared `bridgeStdioToSocket()` and `getIpcSocketPath()` helpers used by all three launchers to avoid copy-paste bridge logic
- `.opencode/skills/system-spec-kit/mcp_server/lib/ipc/socket-server.ts` (NEW): daemon IPC socket listener for spec-memory at `<dbDir>/daemon-ipc.sock` mode `0600` with `EADDRINUSE` retry, bounded concurrency cap, lifecycle logging and `SIGTERM`/`SIGINT`/`beforeExit` cleanup
- `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-ipc-bridge.vitest.ts` (NEW): 8-test suite covering bridge pipe, lease-held routing, socket-missing fallback, `SPECKIT_LAUNCHER_BRIDGE_DISABLED` override, daemon round-trip, concurrent 3-client load, `MAX_SECONDARY_CLIENTS` bound and `SIGTERM` cleanup
- `ipc_bridge` telemetry block in full `memory_health` reports exposing socket path, active secondary count and message counters

### Changed

- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts`: handler registration refactored so each secondary connection receives an equivalent `Server` instance sharing the SQLite handle. IPC listener starts after `stdio server.connect()` and before the lazy memory runtime guard.
- `.opencode/bin/mk-spec-memory-launcher.cjs`, `.opencode/bin/mk-code-index-launcher.cjs`, `.opencode/bin/mk-skill-advisor-launcher.cjs`: lease-held branches now attempt bridge mode when `SPECKIT_LAUNCHER_BRIDGE_DISABLED` is unset and the socket is present. Missing or refused sockets fall back to the legacy `LEASE_HELD_BY` exit path.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`: full-report response extended with `ipc_bridge` fields

### Fixed

- Secondary MCP host sessions no longer exit with JSON-RPC `-32000` when a daemon is already running. The bridge attaches stdio to the daemon socket and exits cleanly when either side closes.

### Verification

| Check | Result |
|-------|--------|
| `node --check .opencode/bin/lib/launcher-ipc-bridge.cjs` and `node --check .opencode/bin/mk-*-launcher.cjs` | exit 0 |
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck` | exit 0 |
| `npx vitest --run launcher-ipc-bridge` | 8 tests passed |
| `npx vitest --run launcher` | 16 tests passed (regression) |
| `npm --prefix .opencode/skills/system-spec-kit/mcp_server run build` | exit 0 |
| Live Unix-socket probe | Blocked. `net.listen()` returns `EPERM` in the build sandbox. TCP loopback target included for socket-capable hosts. |
| Strict packet validation | Passed per implementation summary |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` (NEW) | Shared bridge helper: `bridgeStdioToSocket()` and `getIpcSocketPath()`. Eliminates copy-paste across launchers. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/ipc/socket-server.ts` (NEW) | Daemon IPC socket server for spec-memory. Mode `0600`. Bounded concurrency. Lifecycle cleanup. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-ipc-bridge.vitest.ts` (NEW) | 8-test Vitest suite for bridge helper and daemon socket behavior. |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Handler registration refactored for secondary connections. IPC listener lifecycle wired to server bootstrap. |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Bridge mode added to lease-held branch. |
| `.opencode/bin/mk-code-index-launcher.cjs` | Bridge mode added to lease-held branch. |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Bridge mode added to lease-held branch. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Full-report response extended with `ipc_bridge` telemetry fields. |

### Follow-Ups

- Run a live Unix-socket probe on a host that permits `net.listen()` to confirm socket lifecycle, secondary client attach and `SIGTERM` cleanup behavior end-to-end.
- Scope a follow-up packet to add daemon-side IPC socket listeners for `system-code-index` and `system-skill-advisor` so those services gain full multi-client concurrency parity with spec-memory.
