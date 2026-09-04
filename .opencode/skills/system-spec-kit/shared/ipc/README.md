---
title: "IPC: canonical daemon socket-server bridge"
description: "Shared bind, reclaim and multi-client serve logic for every MCP daemon's Unix-socket IPC bridge."
---

# IPC

---

## 1. OVERVIEW

`shared/ipc/` is the canonical bridge logic behind every daemon launcher (code-index, skill-advisor). The primary MCP client connects over stdio. Secondary clients attach over a Unix socket that multiplexes onto the same running server. Each daemon package supplies its own socket and database paths through options. Only the bind, stale-socket reclaim and multi-client serve behavior lives here, so the security and race-safety contract cannot drift between services.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `socket-server.ts` | `startIpcSocketServer()` binds the socket with a race-safe stale-socket fence and directory ownership/mode hardening, accepts secondary clients up to a cap, answers liveness probes without counting them against the cap and relays JSON-RPC frames between the socket and the primary `StdioServerTransport`. Also exports `canUnlinkExistingSocket`, `getIpcBridgeStats`, `parseMaxClients` and `resolveIpcSocketPath`. |

---

## 3. CONSUMERS

Each daemon's local `lib/ipc/socket-server.ts` is a thin re-export of this module via the `@spec-kit/shared/ipc/socket-server.js` package export, not a separate copy:

- `.opencode/skills/system-skill-advisor/mcp-server/lib/ipc/socket-server.ts` and `mcp-server/advisor-server.ts`

---

## 4. VALIDATION

```bash
cd .opencode/skills/system-spec-kit/runtime && npx vitest run tests/launcher-ipc-bridge-probe.vitest.ts tests/orphan-sweeper-ipc-preserve.vitest.ts
```

---

## 5. RELATED

- [`ENV-REFERENCE.md`](../../runtime/ENV-REFERENCE.md): documents the IPC bridge's environment-driven configuration.
