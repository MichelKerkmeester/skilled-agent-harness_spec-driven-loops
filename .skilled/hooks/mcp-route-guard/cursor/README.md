---
title: "MCP Route Guard: Cursor beforeMCPExecution Adapter"
description: "Cursor adapter that packs the split server and tool fields into the Claude shape and spawns the Claude adapter for the advisory text."
trigger_phrases:
  - "cursor mcp route guard"
  - "beforemcpexecution advisory"
  - "cursor code mode routing"
version: 1.0.0.0
---

# MCP Route Guard: Cursor beforeMCPExecution Adapter

---

## 1. OVERVIEW

`cursor/` holds the Cursor adapter for the MCP route guard. `.cursor/hooks.json` registers it on the `beforeMCPExecution` event with a 10-second timeout. Cursor sends the server in `mcp_server_name` and a bare tool name in `tool_name`. The shared core needs a packed name, so a bare tool name matches only when it starts with a manifest manual name.

The adapter reads `workspace_roots[0]` as the project directory. It packs both fields into `mcp__<server>__<tool>`. It then runs `../claude/mcp-route-guard.cjs` with `spawnSync` under a 3000 ms timeout and a 1 MB buffer. The child owns the advisory text. A non-empty `additionalContext` from the child returns as `agent_message` beside `permission: allow`.

The adapter never denies a call. Invalid JSON, a spawn failure, a timeout, non-JSON child output or a thrown error returns a plain `permission: allow`. The `mcp-route-guard` switch turns the adapter into a bare approve.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `mcp-route-guard.mjs` | Packs the split fields, spawns the Claude adapter and maps its advisory to `agent_message`. |

The adapter resolves the guard script from its own location, never from the payload's workspace. A workspace outside this checkout therefore still reaches the shared guard. A payload with no workspace root falls back to `process.cwd()`. Without a server name or a tool name, the bare tool name passes through unpacked and usually matches nothing.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs
```

Expected result: every test passes. The suite covers the core plus the Claude and Cursor adapters.

---

## 4. RELATED

- [`../README.md`](../README.md): the concern README with the policy table and the per-runtime matrix.
- [`../claude/mcp-route-guard.cjs`](../claude/mcp-route-guard.cjs): the adapter this file shells out to.
- [`../lib/mcp-route-guard.cjs`](../lib/mcp-route-guard.cjs): the shared core behind both adapters.
