---
title: "MCP Route Guard: Pi tool_call Extension"
description: "Pi extension that filters native mcp_ tool calls, evaluates the shared route-guard core and returns the advisory as the tool call reason."
trigger_phrases:
  - "pi mcp route guard"
  - "pi tool call advisory"
  - "pi code mode routing"
version: 1.0.0.0
---

# MCP Route Guard: Pi tool_call Extension

---

## 1. OVERVIEW

`pi/` holds the real Pi extension for the MCP route guard. Pi discovers it through the relative symlink `.pi/extensions/mcp-route-guard.ts`, and because Pi resolves imports against that link path, the file imports `hook-flags.mjs` through `../../.skilled/hooks/shared/`. The extension filters on the `mcp_` prefix, dynamic-imports `../lib/mcp-route-guard.cjs`, and returns the core's warnings as the `tool_call` reason.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`mcp-route-guard.ts`](./mcp-route-guard.ts) | `tool_call` | Ignores a non-string or non-`mcp_` tool name, checks `isHookEnabled('mcp-route-guard')`, and calls `evaluateNativeMcpCall()` with `ctx.cwd`. A warning becomes `{reason}`. | Fails open. A dynamic import or core error returns `undefined`, so the call proceeds. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the policy table and the per-runtime matrix.
- [`../lib/mcp-route-guard.cjs`](../lib/mcp-route-guard.cjs): the shared core this extension imports.
- [`../../../../.pi/extensions/mcp-route-guard.ts`](../../../../.pi/extensions/mcp-route-guard.ts): the link Pi discovers.
