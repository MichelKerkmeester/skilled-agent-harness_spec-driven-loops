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

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. OWNERSHIP](#2--ownership)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES](#4--boundaries)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

`lib/ipc/` owns local IPC helpers used by the advisor launcher and daemon bridge. The code keeps secondary MCP clients on the existing advisor daemon instead of starting duplicate server processes.

<!-- /ANCHOR:1-overview -->

---

<!-- ANCHOR:2-ownership -->
## 2. OWNERSHIP

| Surface | Owner | Notes |
|---|---|---|
| Socket bridge | Skill advisor | Bridges secondary clients to advisor MCP server instances. |
| Idle monitor | Shared launcher pattern, advisor copy | Keeps advisor launcher shutdown policy close to the launcher package. |
| Lease files | Runtime state | Files under `database/` are ignored and must not be committed. |

<!-- /ANCHOR:2-ownership -->

---

<!-- ANCHOR:3-key-files -->
## 3. KEY FILES

| File | Responsibility |
|---|---|
| `socket-server.ts` | Creates the Unix socket/TCP bridge for secondary MCP clients and exposes bridge stats. |
| `launcher-idle-timeout.ts` | Parses `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN` and shuts down idle launchers. |

<!-- /ANCHOR:3-key-files -->

---

<!-- ANCHOR:4-boundaries -->
## 4. BOUNDARIES

- Keep transport, socket and idle-monitor behavior here.
- Keep graph database leases in `../daemon/` and `../skill-graph/`.
- Do not import handler-specific recommendation logic into IPC helpers.

<!-- /ANCHOR:4-boundaries -->

---

<!-- ANCHOR:5-entrypoints -->
## 5. ENTRYPOINTS

```text
resolveIpcSocketPath()
startIpcSocketServer()
getIpcBridgeStats()
createLauncherIdleMonitor()
parseLauncherIdleTimeoutMs()
```

Compiled consumers load these from `mcp_server/dist/mcp_server/lib/ipc/`.

<!-- /ANCHOR:5-entrypoints -->

---

<!-- ANCHOR:6-validation -->
## 6. VALIDATION

Run from the repository root.

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run test -- tests/launcher-lease.vitest.ts
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/mcp_server/lib/ipc/README.md
```

<!-- /ANCHOR:6-validation -->

---

<!-- ANCHOR:7-related -->
## 7. RELATED

- [`../README.md`](../README.md)
- [`../daemon/README.md`](../daemon/README.md)
- [`../../tests/launcher-lease.vitest.ts`](../../tests/launcher-lease.vitest.ts)
- [`../../../../../scripts/README.md`](../../../../../scripts/README.md)

<!-- /ANCHOR:7-related -->
