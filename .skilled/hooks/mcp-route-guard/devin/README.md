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

`devin/` holds the Devin CLI adapter for the MCP route guard. `.devin/hooks.v1.json` wires it to `PreToolUse` under the `^mcp__.*$` matcher. Devin sends the same packed tool-name shape as Claude, so the adapter reads `tool_name` directly and evaluates the shared core. A whitespace-only `cwd` is treated as absent, and the project directory falls back to `DEVIN_PROJECT_DIR` then `process.cwd()`. A `warn` result becomes `hookSpecificOutput.additionalContext`.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`mcp-route-guard.cjs`](./mcp-route-guard.cjs) | `PreToolUse` | Reads `tool_name` and `cwd`, checks `isHookEnabled('mcp-route-guard')`, and runs `evaluateNativeMcpCall()`. A `warn` result becomes the advisory text. | Fails open. Invalid stdin, a missing payload or a core error exits 0 with no output. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the policy table and the per-runtime matrix.
- [`../lib/mcp-route-guard.cjs`](../lib/mcp-route-guard.cjs): the shared core this adapter calls.
- [`../../shared/hook-adapter-shared.cjs`](../../shared/hook-adapter-shared.cjs): the fail-open stdin reader and JSON parser.
