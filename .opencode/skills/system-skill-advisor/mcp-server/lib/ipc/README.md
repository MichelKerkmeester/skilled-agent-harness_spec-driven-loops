---
title: "Skill Advisor IPC Helpers"
description: "Advisor launcher IPC helpers for secondary MCP clients, socket lifecycle and idle-timeout behavior."
trigger_phrases:
  - "skill advisor ipc"
  - "advisor socket server"
  - "launcher idle timeout"
---

# Skill Advisor IPC Helpers

<!-- sk-doc-template: code_folder_readme -->

---

## 1. OVERVIEW

`lib/ipc/` owns local IPC helpers used by the advisor launcher and daemon bridge. The code keeps secondary MCP clients on the existing advisor daemon instead of starting duplicate server processes.

---

## 2. OWNERSHIP

| Surface | Owner | Notes |
|---|---|---|
| Socket bridge | Skill advisor | Bridges secondary clients to advisor MCP server instances. |
| Idle monitor | Shared launcher pattern, advisor copy | Keeps advisor launcher shutdown policy close to the launcher package. |
| Lease files | Runtime state | Files under `database/` are ignored and must not be committed. |

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `socket-server.ts` | Creates the Unix socket/TCP bridge for secondary MCP clients and exposes bridge stats. |
| `launcher-idle-timeout.ts` | Parses `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN` and shuts down idle launchers. |

---

## 4. BOUNDARIES

- Keep transport, socket and idle-monitor behavior here.
- Keep graph database leases in `../daemon/` and `../skill-graph/`.
- Do not import handler-specific recommendation logic into IPC helpers.

---

## 5. ENTRYPOINTS

```text
resolveIpcSocketPath()
startIpcSocketServer()
getIpcBridgeStats()
createLauncherIdleMonitor()
parseLauncherIdleTimeoutMs()
```

Compiled consumers load these from `mcp-server/dist/mcp-server/lib/ipc/`.

---

## 6. VALIDATION

Run from the repository root.

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp-server run test -- tests/launcher-lease.vitest.ts
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/mcp-server/lib/ipc/README.md
```

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../daemon/README.md`](../daemon/README.md)
- [`../../tests/launcher-lease.vitest.ts`](../../tests/launcher-lease.vitest.ts)
- [`../../../../../scripts/README.md`](../../../../../scripts/README.md)
