---
title: "MCP Route Guard: Codex PreToolUse Adapter"
description: "Codex CLI adapter for native external MCP calls. It is wired in .codex/hooks.json under the PreToolUse mcp__.* matcher and stays dormant until an external server family is registered."
trigger_phrases:
  - "codex mcp route guard"
  - "codex pretooluse advisory"
  - "codex code mode routing"
version: 1.0.0.0
---

# MCP Route Guard: Codex PreToolUse Adapter

---

## 1. OVERVIEW

`codex/` holds the Codex CLI adapter for the MCP route guard. `.codex/hooks.json` wires it to `PreToolUse` under the `mcp__.*` matcher group.

The adapter reads stdin and resolves the project directory from `cwd`, then from `CODEX_PROJECT_DIR`, then from `process.cwd()`. It passes the tool name and that directory to the shared core.

A `warn` result becomes `hookSpecificOutput.additionalContext`, with one advisory line per warning. The adapter never emits a permission decision. It only adds advisory text.

The adapter is dormant under Codex. `.codex/config.toml` registers `code_mode` as an MCP server. The core exempts that name. It exempts the internal `mk_` prefix too.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `mcp-route-guard.cjs` | The Codex adapter. It reads the payload and runs the shared core. |

The adapter checks `isHookEnabled('mcp-route-guard')` first. When the switch is off it exits 0 with no output.

Otherwise it parses the stdin payload and takes `tool_name` and `cwd` from it. It then runs `evaluateNativeMcpCall()` with the tool name, the project directory and the environment.

The adapter fails open. Invalid stdin, a missing payload or a core error exits 0 with no output.

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the policy table and the per-runtime matrix.
- [`../lib/mcp-route-guard.cjs`](../lib/mcp-route-guard.cjs): the shared core this adapter calls.
- [`../../shared/hook-adapter-shared.cjs`](../../shared/hook-adapter-shared.cjs): the fail-open stdin reader and JSON parser.
- [`../../shared/hook-flags.cjs`](../../shared/hook-flags.cjs): the switch resolver behind `isHookEnabled`.
