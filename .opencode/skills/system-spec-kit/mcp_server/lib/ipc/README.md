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

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`lib/ipc/` owns local IPC helpers used by the `mk-spec-memory` launcher bridge. The socket bridge lets secondary MCP clients connect to the existing server process, while the idle monitor gives the server a configurable self-exit path when no primary or secondary client activity remains.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:ownership -->
## 2. OWNERSHIP

| Surface | Owner | Notes |
|---|---|---|
| Socket bridge | Spec Kit Memory MCP | Bridges secondary clients to the active MCP server. |
| Idle monitor | Shared launcher pattern, spec-memory copy | Tracks stdio and IPC activity through `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN`. |
| Lease cleanup | Launcher process | Existing child-process exit handlers clear launcher lease files after server exit. |

<!-- /ANCHOR:ownership -->

---

<!-- ANCHOR:key-files -->
## 3. KEY FILES

| File | Responsibility |
|---|---|
| `socket-server.ts` | Resolves socket paths, starts the secondary-client bridge, tracks activity, and exposes bridge stats. |
| `launcher-idle-timeout.ts` | Parses `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN` and runs the idle shutdown timer. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries -->
## 4. BOUNDARIES

- Keep transport, socket, and idle-monitor behavior here.
- Keep MCP handler logic outside IPC helpers.
- Keep the LaunchAgent and orphan sweeper runbook in `.opencode/scripts/README.md`.

<!-- /ANCHOR:boundaries -->

---

<!-- ANCHOR:entrypoints -->
## 5. ENTRYPOINTS

```text
resolveIpcSocketPath()
startIpcSocketServer()
getIpcBridgeStats()
createLauncherIdleMonitor()
parseLauncherIdleTimeoutMs()
```

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 6. VALIDATION

Run from the repository root:

```bash
npm --prefix .opencode/skills/system-spec-kit/mcp_server run test -- tests/launcher-idle-timeout.vitest.ts tests/ipc-socket-activity.vitest.ts
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/mcp_server/lib/ipc/README.md
```

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 7. RELATED

- [`../../README.md`](../../README.md)
- [`../../ENV_REFERENCE.md`](../../ENV_REFERENCE.md)
- [`../../tests/launcher-idle-timeout.vitest.ts`](../../tests/launcher-idle-timeout.vitest.ts)
- [`../../tests/ipc-socket-activity.vitest.ts`](../../tests/ipc-socket-activity.vitest.ts)
- [`../../../../../scripts/README.md`](../../../../../scripts/README.md)

<!-- /ANCHOR:related -->
