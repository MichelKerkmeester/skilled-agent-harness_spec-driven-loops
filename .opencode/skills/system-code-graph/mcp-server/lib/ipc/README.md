---
title: "Code Graph IPC: Launcher Socket Bridge"
description: "Unix-socket IPC bridge and idle-timeout helpers for secondary mk-code-index clients and launcher-managed daemon access."
trigger_phrases:
  - "code graph ipc"
  - "mk-code-index socket"
  - "ipc bridge"
  - "secondary clients"
  - "launcher idle timeout"
---

# Code Graph IPC: Launcher Socket Bridge

> Socket-based bridge that lets secondary clients reach the `mk-code-index` MCP server through a controlled workspace-local endpoint.

---

## 1. OVERVIEW

`lib/ipc/` owns the local IPC socket server used by the launcher bridge. It creates a workspace-contained Unix socket or explicit TCP listener, accepts bounded secondary clients and connects each client to a fresh MCP `Server` over `StdioServerTransport`.

Current state:

- `socket-server.ts` owns secondary-client socket bridging.
- `launcher-idle-timeout.ts` owns the shared MCP idle self-exit timer.
- Socket paths default to the code-graph database directory and can be overridden with `SPECKIT_IPC_SOCKET_DIR`.
- Overrides must stay inside the workspace root unless the caller uses a TCP URL.
- Secondary clients are capped by `SPECKIT_MAX_SECONDARY_CLIENTS`, defaulting to `64`.
- `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN` defaults to `30`, accepts fractional values for tests, and `0` disables the idle monitor.

---

## 2. ARCHITECTURE

```text
mk-code-index launcher
  -> resolveIpcSocketPath(dbDir)
  -> startIpcSocketServer({ createServer })
  -> secondary net.Socket
  -> StdioServerTransport
  -> fresh MCP Server instance
```

Dependency direction:

```text
index.ts -> lib/ipc/socket-server.ts
socket-server.ts -> ../utils/workspace-path.ts
socket-server.ts -> @modelcontextprotocol/sdk
```

---

## 3. DIRECTORY TREE

```text
ipc/
+-- launcher-idle-timeout.ts  # Shared MCP idle self-exit timer
+-- socket-server.ts          # Multi-client socket bridge and stats
`-- README.md
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `launcher-idle-timeout.ts` | Parses `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN` and runs the idle shutdown timer. |
| `socket-server.ts` | Resolves socket paths, starts the socket server, tracks active secondary clients and exposes bridge stats. |

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Workspace safety | Non-TCP socket directories must stay within the workspace root. |
| Socket cleanup | Existing sockets are unlinked only when they are real sockets owned by the current user. |
| Client limits | The bridge refuses connections after the configured secondary-client cap. |
| Idle shutdown | Stdio and IPC connect/data/write activity refresh the idle timer; active secondary clients keep the server alive. |
| Transport | Each secondary socket gets its own `StdioServerTransport` and MCP server instance. |
| Database | This folder does not own SQLite state. It may use the DB directory only as a safe default socket location. |

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `resolveIpcSocketPath` | Function | Resolves the socket path from a DB directory and optional environment override. |
| `startIpcSocketServer` | Function | Starts the bridge server and returns a close handle. |
| `getIpcBridgeStats` | Function | Reports current socket path, secondary client count and message counters. |
| `createLauncherIdleMonitor` | Function | Starts the server-side idle monitor. |
| `parseLauncherIdleTimeoutMs` | Function | Parses the idle timeout env value. |
| `parseMaxClients` | Function | Parses `SPECKIT_MAX_SECONDARY_CLIENTS` with a safe fallback. |

---

## 7. VALIDATION

Run from the repository root.

```bash
.opencode/skills/system-code-graph/node_modules/.bin/vitest --config .opencode/skills/system-code-graph/vitest.config.ts --run mcp-server/tests/lib/security-hardening.vitest.ts
.opencode/skills/system-code-graph/node_modules/.bin/vitest --config .opencode/skills/system-code-graph/vitest.config.ts --run mcp-server/tests/launcher-idle-timeout.vitest.ts
python3 .opencode/skills/sk-doc/scripts/validate_document.py --type readme .opencode/skills/system-code-graph/mcp-server/lib/ipc/README.md
```

Expected result: Vitest exits `0`, and the README validator reports no blocking errors.

---

## 8. RELATED

| Document | Purpose |
|---|---|
| [../README.md](../README.md) | Parent code-graph library overview. |
| [../utils/README.md](../utils/README.md) | Workspace containment helper used by the IPC path guard. |
| [../../../README.md](../../../README.md) | MCP server package overview. |
| [../../tests/lib/README.md](../../tests/lib/README.md) | Focused tests covering socket hardening. |
