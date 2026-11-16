---
title: "MCP Route Guard: Cursor beforeMCPExecution Adapter"
description: "Cursor adapter that recombines the split server and tool fields into the packed Claude shape and spawns the Claude adapter so the two runtimes cannot drift."
trigger_phrases:
  - "cursor mcp route guard"
  - "beforemcpexecution advisory"
  - "cursor code mode routing"
version: 1.0.0.0
---

# MCP Route Guard: Cursor beforeMCPExecution Adapter

---

## 1. OVERVIEW

`cursor/` holds the Cursor adapter for the MCP route guard. `.cursor/hooks.json` wires it to the `beforeMCPExecution` event. Cursor sends the server in `mcp_server_name` and a bare tool name in `tool_name`, a shape the shared core cannot parse on its own. The adapter packs the two fields into `mcp__<server>__<tool>` and runs `../claude/mcp-route-guard.cjs` with `spawnSync` under a 3000 ms timeout and a 1 MB buffer. An advisory from the child returns as `agent_message` beside `permission: allow`.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`mcp-route-guard.mjs`](./mcp-route-guard.mjs) | `beforeMCPExecution` | Reads `workspace_roots[0]` as the project directory, packs the server and tool fields, and spawns the Claude adapter. A non-empty `additionalContext` becomes `agent_message`. | Fails open. Invalid JSON, a spawn failure, a timeout or non-JSON child output returns a plain `permission: allow`. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the policy table and the per-runtime matrix.
- [`../claude/mcp-route-guard.cjs`](../claude/mcp-route-guard.cjs): the adapter this file shells out to.
- [`../lib/mcp-route-guard.cjs`](../lib/mcp-route-guard.cjs): the shared core behind both adapters.
