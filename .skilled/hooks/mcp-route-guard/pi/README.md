---
title: "Pi MCP Route Guard: tool_call Adapter"
description: "Pi adapter that checks native mcp_ calls with the shared route-guard core and returns warnings as the tool call reason."
trigger_phrases:
  - "pi mcp route guard"
  - "pi tool call advisory"
  - "pi code mode routing"
version: 1.0.0.0
---

# Pi MCP Route Guard: tool_call Adapter

---

## 1. OVERVIEW

`.skilled/hooks/mcp-route-guard/pi/` holds the Pi adapter for native MCP route warnings. The adapter registers `tool_call` with `pi.on("tool_call", ...)`. The [Pi extension entry](../../../../.pi/extensions/mcp-route-guard.ts) re-exports this adapter.

The handler checks `event.toolName` first. It returns `undefined` when the name is not a string or does not start with `mcp_`. It then checks `isHookEnabled("mcp-route-guard")`. The shared resolver maps that concern to `MCP_ROUTE_GUARD_DISABLED` and also honors `SYSTEM_HOOKS_DISABLED` as the master switch.

When enabled, the handler imports the [shared core](../lib/mcp-route-guard.cjs) and calls `evaluateNativeMcpCall()`. The call receives `event.toolName` and `ctx.cwd` as the project directory. It also receives `process.env` as the environment.

Warnings return as `{ reason }`, joined with a newline. No warnings return `undefined`. An exception inside the handler also returns `undefined`.

---

## 2. DIRECTORY TREE

| File | Responsibility |
|---|---|
| `mcp-route-guard.ts` | Registers the `tool_call` handler and calls the shared core for native `mcp_` tool names. |

---

## 3. VALIDATION

Run the command from the repository root.

```bash
(cd .skilled/skills/system-spec-kit && npx vitest run --project root runtime/tests/hook-adapter-path-parity.vitest.ts)
```

Expected result: every test passes. The suite follows each one-line entry in `.pi/extensions/`, this adapter's included, and fails when the file it re-exports is missing.

---

## 4. RELATED

- [MCP Route Guard README](../README.md): the concern and its runtime adapters.
- [Shared route-guard core](../lib/mcp-route-guard.cjs): the policy evaluator.
