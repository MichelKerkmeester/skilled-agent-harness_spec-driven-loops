---
title: "Codex MCP Route Guard: PreToolUse Adapter"
description: "Codex CLI adapter for native external MCP calls. It is wired in .codex/hooks.json under the PreToolUse mcp__.* matcher and stays dormant until an external server family is registered."
trigger_phrases:
  - "codex mcp route guard"
  - "codex pretooluse advisory"
  - "codex code mode routing"
version: 1.0.0.0
---

# Codex MCP Route Guard: PreToolUse Adapter

---

## 1. OVERVIEW

`.skilled/hooks/mcp-route-guard/codex/` holds the Codex adapter for the MCP route guard concern. It runs at `PreToolUse` and turns a route warning about a native MCP call into one advisory line.

Codex registers the adapter in `.codex/hooks.json` under the `"PreToolUse"` event, with the matcher `"mcp__.*"` and a 5-second timeout. The command runs `node .skilled/hooks/mcp-route-guard/codex/mcp-route-guard.cjs` from `${CODEX_PROJECT_DIR:-$PWD}` and wraps it in a drift fallback. When the adapter is missing or `node` fails, the fallback prints `mk-hook-drift host=codex event=PreToolUse adapter=mcp-route-guard.cjs` on stderr. It then prints a `hookSpecificOutput.additionalContext` message that asks the operator to build the spec-kit runtime or restore the missing adapter.

The adapter checks the concern switch first, through `isHookEnabled('mcp-route-guard')`. On a live switch it reads the hook payload from stdin and takes the tool name. The project directory is `cwd` when the payload carries one. Otherwise it is `CODEX_PROJECT_DIR`, with the process working directory as the last resort. The adapter passes them to `evaluateNativeMcpCall()` in `.skilled/hooks/mcp-route-guard/lib/mcp-route-guard.cjs`, together with the process environment.

A non-empty warning list becomes `hookSpecificOutput.additionalContext`, joined by a newline, with `hookEventName` set to `PreToolUse`. The adapter never writes `permissionDecision`.

Every other outcome inside the adapter exits 0 with no output. That covers invalid stdin, a missing payload, a disabled switch and a thrown error.

`.codex/config.toml` registers only the `code_mode` MCP server. The core exempts `code_mode` and `sequential_thinking`. It also exempts any server name that starts with `system_` or `mk_`. The adapter therefore stays quiet until Codex registers an external MCP family that a manual in `.utcp_config.json` can route.

The concern switch is `MCP_ROUTE_GUARD_DISABLED`. `SYSTEM_HOOKS_DISABLED` is the master switch. Both reach this adapter through the shared resolver in `.skilled/hooks/shared/hook-flags.cjs`.

---

## 2. DIRECTORY TREE

| File | Responsibility |
|---|---|
| `mcp-route-guard.cjs` | The adapter. It checks the switch, reads the payload, calls the core and writes the advisory. |

The folder is flat, so the table lists every entry other than this README.

---

## 3. VALIDATION

Run the command from the repository root. The payload names the `github` family, which `.utcp_config.json` registers as a manual.

```bash
printf '%s' '{"tool_name":"mcp__github__list_repos","cwd":"."}' | node .skilled/hooks/mcp-route-guard/codex/mcp-route-guard.cjs
```

Expected result: exit status 0 and one JSON object on stdout with no trailing newline. Its `additionalContext` starts `mcp-route-guard: native call to "github"`. No `permissionDecision` key appears.

---

## 4. RELATED

- [Concern README](../README.md): the route guard policy table and the runtime matrix.
- [Shared core](../lib/mcp-route-guard.cjs): the `evaluateNativeMcpCall()` function this adapter calls.
- [Stdin helpers](../../shared/hook-adapter-shared.cjs): the `readStdin` and `parseJsonFailOpen` functions behind the payload read.
- [Switch resolver](../../shared/hook-flags.cjs): the `isHookEnabled` function behind the concern switch.
- [Codex hook registration](../../../../.codex/hooks.json): the file that runs this adapter at `PreToolUse`.
