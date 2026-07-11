---
title: "MCP launcher front-proxy (reconnecting session proxy)"
description: "The launcher fronts the MCP daemon with a reconnecting session proxy so secondary clients survive an in-place daemon recycle transparently, with a retryable recycle error (-32001) and a non-retryable protocol fail-closed (-32002)."
trigger_phrases:
  - "mcp launcher front proxy"
  - "reconnecting session proxy"
  - "daemon recycle transparency"
  - "SPECKIT_BACKEND_ONLY backend-only mode"
  - "-32002 protocol mismatch fail closed"
version: 3.6.0.2
---

# MCP launcher front-proxy (reconnecting session proxy)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The Spec Kit Memory MCP server runs as a shared background daemon. Each MCP client connects through a launcher process rather than to the daemon directly. The lease-holding launcher owns the daemon; secondary (non-lease-holder) launchers bridge their client stdio to the daemon through a reconnecting session proxy. The proxy lets a client survive an in-place daemon recycle transparently instead of having its connection severed.

This matters because the daemon recycles itself in place when it sustains an RSS ceiling breach. Without the proxy, that recycle would drop every secondary client mid-request. The proxy reattaches to the restarted backend, replays safe in-flight requests, and only fails the session when reconnection is genuinely impossible (a protocol-version drift) — and even then it fails closed with a clear, non-retryable error.

---

## 2. HOW IT WORKS

### Front-proxy bridge

`bridgeStdioThroughSessionProxy(socketPath, options)` in `mk-spec-memory-launcher.cjs` wraps a secondary launcher's client stdio in a `createSessionProxy` instance. Each secondary launcher gets its own proxy with its own `pendingRequests` map and cached-initialize state because it owns its own stdio. The proxy owns stdout and emits JSON-RPC errors on failure, so the raw bridge's stdout error marker is intentionally unused on this path (it would corrupt the MCP stream). The lease holder bridges directly; secondaries bridge through the proxy so they reconnect like the lease holder does.

### In-place daemon recycle

`recycleDaemonInPlace(graceMs)` in `mk-spec-memory-launcher.cjs` is invoked on a sustained RSS ceiling breach (`onRssBreach`). It sends `SIGTERM` to the running `context-server` child (and the `hf-model-server` child first when present), escalates to `SIGKILL` after the grace window, then re-spawns the backend in place. The re-spawned backend runs with `SPECKIT_BACKEND_ONLY: '1'` so it serves the IPC socket without binding its own stdio transport.

### Backend-only mode (SPECKIT_BACKEND_ONLY)

`context-server.ts` reads `process.env.SPECKIT_BACKEND_ONLY === '1'`. When set, the server skips connecting the `StdioServerTransport` — it initializes the database, dynamic instructions, and the boot FTS integrity check, but does not attach its own stdin/stdout. That is how a recycled daemon serves clients through the launcher socket rather than through a process stdio pipe.

### Reattach, replay, and keepalive

When the backend socket drops, the proxy transitions to `REATTACHING`, pauses client input, and runs a bounded reattach loop (`maxReattachAttempts`, with a `PROBE_BACKOFF_MS` backoff) that waits for the daemon to come ready and attaches a fresh socket. On reattach it replays in-flight requests: requests whose method is in `REPLAYABLE_TOOL_NAMES` (read-mostly and idempotent tools such as `memory_search`, `memory_context`, `memory_match_triggers`, `session_bootstrap`, `checkpoint_list`) are re-sent to the fresh backend, while non-replayable in-flight requests are answered with the retryable recycle error so the client can retry safely. A keepalive ping (`startKeepalive`) using a private id prefix detects a wedged backend between requests.

### Error codes: -32001 retryable, -32002 fail-closed

The proxy distinguishes two failure classes:

- **`-32001` `RETRYABLE_RECYCLE_ERROR`** (`{ retryable: true }`) — emitted for in-flight non-replayable requests during a recycle and when the reattach loop exhausts its budget. It tells the client "backend recycled; retry". This code is LIVE and is the proxy's primary recycle signal.
- **`-32002` `PROTOCOL_MISMATCH_ERROR`** (`{ retryable: false }`) — emitted when a re-handshaked backend negotiates a different protocol version than the one the client originally negotiated. Serving it would silently break the client's protocol contract, so the proxy fails closed: it destroys the fresh socket, moves to the terminal `CLOSED` state (the reattach loop must not retry a version-mismatched backend), and ends the session with a non-retryable error so the client reconnects from scratch.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `.opencode/bin/lib/launcher-session-proxy.cjs` | Reconnecting session proxy: reattach loop, replay snapshot, keepalive, `RETRYABLE_RECYCLE_ERROR` (-32001), `PROTOCOL_MISMATCH_ERROR` (-32002), terminal `CLOSED` fail-closed on protocol drift |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | `bridgeStdioThroughSessionProxy` for secondary clients; `recycleDaemonInPlace` on RSS breach; spawns the backend with `SPECKIT_BACKEND_ONLY: '1'` |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | IPC socket path resolution and daemon probe used by the proxy |
| `mcp_server/context-server.ts` | Reads `SPECKIT_BACKEND_ONLY`; in backend-only mode skips the stdio transport and serves the IPC socket |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/launcher-session-proxy.vitest.ts` | Automated test | Session-proxy reattach, replay, keepalive, and protocol-mismatch fail-closed behavior |
| `mcp_server/tests/launcher-ipc-bridge-probe.vitest.ts` | Automated test | IPC bridge probe and socket-path resolution |
| `mcp_server/tests/launcher-watchdog.vitest.ts` | Automated test | Watchdog / recycle trigger behavior |
| `mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts` | Automated test | Daemon-recycle transparency under load (secondary clients survive a recycle) |

---

## 4. SOURCE METADATA
- Group: Pipeline Architecture
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `pipeline-architecture/mcp-launcher-front-proxy.md`
Related references:
- [routing-telemetry-and-channel-invocation-rates.md](routing-telemetry-and-channel-invocation-rates.md) — Routing telemetry and channel invocation rates
- [cross-process-db-hot-rebinding.md](cross-process-db-hot-rebinding.md) — Cross-process DB hot-rebinding
