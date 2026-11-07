---
title: "MCP Route Guard: Codex PreToolUse Adapter"
description: "Codex CLI adapter for native external MCP calls, wired in .codex/hooks.json under the PreToolUse mcp__.* matcher and dormant until an external server family is registered."
trigger_phrases:
  - "codex mcp route guard"
  - "codex pretooluse advisory"
  - "codex code mode routing"
version: 1.0.0.0
---

# MCP Route Guard: Codex PreToolUse Adapter

---

## 1. OVERVIEW

`codex/` holds the Codex CLI adapter for the MCP route guard. `.codex/hooks.json` wires it to `PreToolUse` under the `mcp__.*` matcher group. The adapter reads stdin, resolves the project directory from `cwd` or `CODEX_PROJECT_DIR`, and evaluates the shared core. A `warn` result becomes `hookSpecificOutput.additionalContext`. The adapter is dormant under Codex today because the registered MCP servers use the internal `mk_` prefix and the core exempts them.

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
