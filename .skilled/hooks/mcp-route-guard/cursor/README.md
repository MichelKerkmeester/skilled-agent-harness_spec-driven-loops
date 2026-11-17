---
title: "Cursor MCP Route Guard: beforeMCPExecution Adapter"
description: "Cursor adapter that packs the split server and tool fields into the Claude shape and spawns the Claude adapter for the advisory text."
trigger_phrases:
  - "cursor mcp route guard"
  - "beforemcpexecution advisory"
  - "cursor code mode routing"
version: 1.0.0.0
---

# Cursor MCP Route Guard: beforeMCPExecution Adapter

---

## 1. OVERVIEW

`.skilled/hooks/mcp-route-guard/cursor/` holds the Cursor adapter for the MCP route guard concern. It runs at `beforeMCPExecution` and hands the shared core a packed name for a native MCP call.

Cursor registers the adapter in `.cursor/hooks.json` under the `beforeMCPExecution` event, with no matcher and a 10-second timeout. The entry runs `node .skilled/hooks/mcp-route-guard/cursor/mcp-route-guard.mjs`. When the adapter is missing or `node` fails, the entry prints a drift line on stderr and an allow envelope whose `agent_message` asks for a rebuild.

The adapter checks the concern switch with `isHookEnabled('mcp-route-guard')` before it reads stdin. When the switch is off it returns `{"permission":"allow"}` at once. On a live switch it parses the payload and takes `workspace_roots[0]` as the project directory. It packs `mcp_server_name` and `tool_name` into `mcp__<server>__<tool>`. Without a server name the bare tool name passes through unpacked, so the core can match it only against a known server token.

With the packed or bare name the adapter runs `.skilled/hooks/mcp-route-guard/claude/mcp-route-guard.cjs` through `spawnSync` under a 3000 ms timeout and a 1 MB buffer. A non-empty `additionalContext` from the child returns as `agent_message` beside `permission: allow`.

The concern switch is `MCP_ROUTE_GUARD_DISABLED`. `SYSTEM_HOOKS_DISABLED` is the master switch. The adapter never denies a call. A disabled switch, invalid JSON, a spawn error, a timeout, non-JSON child output and a thrown error each end in `{"permission":"allow"}` with no `agent_message`. Every one exits 0.

---

## 2. DIRECTORY TREE

| File | Responsibility |
|---|---|
| `mcp-route-guard.mjs` | The adapter. It checks the switch, packs the split fields, spawns the Claude adapter and prints the advisory. |

The folder holds no test of its own. The concern suite in `.skilled/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs` drives this adapter.

---

## 3. VALIDATION

Run the command from the repository root.

```bash
node --test .skilled/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs
```

Expected result: the summary reads `fail 0`. The suite's Cursor case confirms that a workspace outside the checkout still produces an advisory.

---

## 4. RELATED

- [`../README.md`](../README.md): the MCP route guard concern, with the policy table and the runtime matrix.
- [`../claude/mcp-route-guard.cjs`](../claude/mcp-route-guard.cjs): the Claude adapter this file spawns.
- [`../lib/mcp-route-guard.cjs`](../lib/mcp-route-guard.cjs): the policy core the child adapter calls.
- [`../../shared/hook-flags.mjs`](../../shared/hook-flags.mjs): the ESM facade over the switch resolver.
- [`../../../../.cursor/hooks.json`](../../../../.cursor/hooks.json): the file that registers this adapter under `beforeMCPExecution`.
