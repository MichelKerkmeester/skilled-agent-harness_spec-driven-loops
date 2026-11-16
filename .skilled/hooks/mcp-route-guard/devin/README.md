---
title: "MCP Route Guard: Devin PreToolUse Adapter"
description: "Devin CLI adapter for native external MCP calls, wired in .devin/hooks.v1.json under PreToolUse and using the same packed tool-name shape as Claude and Codex."
trigger_phrases:
  - "devin mcp route guard"
  - "devin pretooluse advisory"
  - "devin code mode routing"
version: 1.0.0.0
---

# MCP Route Guard: Devin PreToolUse Adapter

---

## 1. OVERVIEW

`devin/` holds the Devin CLI adapter for the MCP route guard. `.devin/hooks.v1.json` registers it on `PreToolUse` under the `^mcp__.*$` matcher, at a 5-second timeout. Devin sends the packed tool-name shape that Claude uses, so the adapter hands `tool_name` straight to the shared core.

The adapter reads `tool_name` and `cwd` from the hook payload. A whitespace-only `cwd` counts as absent, so the project directory falls back to `DEVIN_PROJECT_DIR` and then to `process.cwd()`. The adapter calls `evaluateNativeMcpCall()` with the tool name, the project directory and the process environment.

A `warn` result becomes `hookSpecificOutput.additionalContext`, with one advisory per line. The adapter never writes `permissionDecision`, so the call always proceeds. Invalid stdin, a missing payload or a core error exits 0 with no output.

---

## 2. FILES

| File | Responsibility |
|---|---|
| [`mcp-route-guard.cjs`](./mcp-route-guard.cjs) | The Devin `PreToolUse` adapter. It reads the payload, evaluates the shared core and emits the advisory. |

The adapter checks `isHookEnabled('mcp-route-guard')` first and exits 0 when the switch is off.

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the policy table and the per-runtime matrix.
- [`../lib/mcp-route-guard.cjs`](../lib/mcp-route-guard.cjs): the shared core this adapter calls.
- [`../../shared/hook-adapter-shared.cjs`](../../shared/hook-adapter-shared.cjs): the fail-open stdin reader and JSON parser.
- [`../../shared/hook-flags.cjs`](../../shared/hook-flags.cjs): the switch resolver behind `isHookEnabled`.
