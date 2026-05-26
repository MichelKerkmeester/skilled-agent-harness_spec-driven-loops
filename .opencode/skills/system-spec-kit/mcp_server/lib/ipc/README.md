---
title: "Spec Kit Memory IPC Helpers"
description: "Local IPC socket bridge and idle-timeout helpers for the mk-spec-memory MCP server."
trigger_phrases:
  - "spec memory ipc"
  - "mk-spec-memory socket"
  - "launcher idle timeout"
  - "secondary clients"
---

# Spec Kit Memory IPC Helpers

<!-- sk-doc-template: code_folder_readme -->

---

## 1. OVERVIEW

`lib/ipc/` owns local IPC helpers used by the `mk-spec-memory` launcher bridge. The socket bridge lets secondary MCP clients connect to the existing server process, while the idle monitor gives the server a configurable self-exit path when no primary or secondary client activity remains.

---

## 2. OWNERSHIP

| Surface | Owner | Notes |
|---|---|---|
| Socket bridge | Spec Kit Memory MCP | Bridges secondary clients to the active MCP server. |
| Idle monitor | Shared launcher pattern, spec-memory copy | Tracks stdio and IPC activity through `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN`. |
| Lease cleanup | Launcher process | Existing child-process exit handlers clear launcher lease files after server exit. |

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `socket-server.ts` | Resolves socket paths, starts the secondary-client bridge, tracks activity, and exposes bridge stats. |
| `launcher-idle-timeout.ts` | Parses `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN` and runs the idle shutdown timer. |

---

## 4. BOUNDARIES

- Keep transport, socket, and idle-monitor behavior here.
- Keep MCP handler logic outside IPC helpers.
- Keep the LaunchAgent and orphan sweeper runbook in `.opencode/scripts/README.md`.

---

## 5. ENTRYPOINTS

```text
resolveIpcSocketPath()
startIpcSocketServer()
getIpcBridgeStats()
createLauncherIdleMonitor()
parseLauncherIdleTimeoutMs()
```

---

## 6. VALIDATION

Run from the repository root:

```bash
npm --prefix .opencode/skills/system-spec-kit/mcp_server run test -- tests/launcher-idle-timeout.vitest.ts tests/ipc-socket-activity.vitest.ts
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/mcp_server/lib/ipc/README.md
```

---

## 7. RELATED

- [`../../README.md`](../../README.md)
- [`../../ENV_REFERENCE.md`](../../ENV_REFERENCE.md)
- [`../../tests/launcher-idle-timeout.vitest.ts`](../../tests/launcher-idle-timeout.vitest.ts)
- [`../../tests/ipc-socket-activity.vitest.ts`](../../tests/ipc-socket-activity.vitest.ts)
- [`../../../../../scripts/README.md`](../../../../../scripts/README.md)
