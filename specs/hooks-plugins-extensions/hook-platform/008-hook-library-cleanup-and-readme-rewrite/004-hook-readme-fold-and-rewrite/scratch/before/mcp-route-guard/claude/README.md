---
title: "MCP Route Guard: Claude PreToolUse Adapter"
description: "Claude Code adapter that evaluates a native external MCP call with the shared route-guard core and returns an additionalContext advisory, never a permission decision."
trigger_phrases:
  - "claude mcp route guard"
  - "pretooluse mcp advisory"
  - "code mode routing nudge"
version: 1.0.0.0
---

# MCP Route Guard: Claude PreToolUse Adapter

---

## 1. OVERVIEW

`claude/` holds the Claude Code adapter for the MCP route guard. `.claude/settings.json` wires it to the `PreToolUse` event under the matcher `mcp__claude_ai_.*`. The adapter reads the hook payload from stdin, calls `../lib/mcp-route-guard.cjs` with the tool name and project directory, and writes the core's warnings as `hookSpecificOutput.additionalContext`. It never writes `permissionDecision`, so the call always proceeds.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`mcp-route-guard.cjs`](./mcp-route-guard.cjs) | `PreToolUse` | Reads `tool_name` and `cwd`, checks the shared switch with `isHookEnabled('mcp-route-guard')`, and runs `evaluateNativeMcpCall()`. A `warn` result becomes the advisory text. | Fails open. Invalid stdin, a missing payload or a core error exits 0 with no output. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the policy table and the per-runtime matrix.
- [`../lib/mcp-route-guard.cjs`](../lib/mcp-route-guard.cjs): the shared core this adapter calls.
- [`../../shared/hook-adapter-shared.cjs`](../../shared/hook-adapter-shared.cjs): the fail-open stdin reader and JSON parser.
