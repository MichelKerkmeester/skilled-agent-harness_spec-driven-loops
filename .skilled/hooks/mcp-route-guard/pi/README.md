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

`pi/` holds the Pi extension for the MCP route guard. Pi discovers it through the one-line entry file `.pi/extensions/mcp-route-guard.ts`, which re-exports it. The extension registers one `tool_call` handler and imports `hook-flags.mjs` through `../../shared/`.

The handler ignores a tool name that is not a string or does not start with `mcp_`. It then checks `isHookEnabled('mcp-route-guard')` and stops when that switch is off. A live switch dynamic-imports `../lib/mcp-route-guard.cjs` and calls `evaluateNativeMcpCall()` with `ctx.cwd`.

A non-empty warning list becomes `{reason}`, with the warnings joined by a newline. An empty warning list returns `undefined`, so the tool call proceeds. A failed dynamic import or a core error returns `undefined` too, so the call still runs.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `mcp-route-guard.ts` | The Pi extension. It registers the `tool_call` handler and returns the core's warnings as the reason. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the policy table and the per-runtime matrix.
- [`../lib/mcp-route-guard.cjs`](../lib/mcp-route-guard.cjs): the shared policy core that this extension imports at call time.
- [`../../../../.pi/extensions/mcp-route-guard.ts`](../../../../.pi/extensions/mcp-route-guard.ts): the one-line entry file that Pi discovers and loads.
