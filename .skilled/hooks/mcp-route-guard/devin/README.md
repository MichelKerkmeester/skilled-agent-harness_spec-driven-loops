---
title: "Devin MCP Route Guard: PreToolUse Adapter"
description: "Devin adapter that warns on native MCP calls which Code Mode can route, for the MCP route guard concern."
trigger_phrases:
  - "devin mcp route guard"
  - "devin pretooluse advisory"
  - "devin code mode routing"
version: 1.0.0.0
---

# Devin MCP Route Guard: PreToolUse Adapter

---

## 1. OVERVIEW

`.skilled/hooks/mcp-route-guard/devin/` holds the Devin adapter for the MCP route guard concern. It runs at `PreToolUse` and passes a native external MCP call to `evaluateNativeMcpCall()` in the shared core, `.skilled/hooks/mcp-route-guard/lib/mcp-route-guard.cjs`. A warned call gets an advisory that points to `call_tool_chain`.

Devin registers the adapter in `.devin/hooks.v1.json` under the `PreToolUse` event, with the matcher `^mcp__.*$` and a 5-second timeout. The entry runs `node .skilled/hooks/mcp-route-guard/devin/mcp-route-guard.cjs` from the project directory.

The adapter checks the concern switch through `isHookEnabled('mcp-route-guard')` before it reads any input, and returns at once when the switch is off. Otherwise it reads `tool_name` and `cwd` from the payload. A whitespace-only `cwd` counts as absent, so the project directory falls back to `DEVIN_PROJECT_DIR` and then to `process.cwd()`.

The concern switch is `MCP_ROUTE_GUARD_DISABLED`, and `SYSTEM_HOOKS_DISABLED` is the master switch. A warn result becomes `hookSpecificOutput.additionalContext`, with one advisory per line. The adapter never writes `permissionDecision`, so the call always proceeds. Invalid stdin and a thrown error both end in exit 0 with no output. A missing payload takes the same path.

---

## 2. DIRECTORY TREE

| File | Responsibility |
|---|---|
| `mcp-route-guard.cjs` | The adapter. It checks the switch, reads the payload, calls the shared core and prints the advisory. |

---

## 3. VALIDATION

Run the commands from the repository root.

```bash
printf '%s' '{"tool_name":"mcp__clickup_official__get_tasks","cwd":"."}' | node .skilled/hooks/mcp-route-guard/devin/mcp-route-guard.cjs
```

Expected result: one JSON object on stdout. Its `hookSpecificOutput.additionalContext` names `clickup_official` and points to `call_tool_chain`, and the command exits 0.

```bash
printf '%s' 'not json' | node .skilled/hooks/mcp-route-guard/devin/mcp-route-guard.cjs
```

Expected result: no output on stdout or stderr and exit status 0.

---

## 4. RELATED

- [`../README.md`](../README.md): the MCP route guard concern, with the policy table and the runtime matrix.
- [`../lib/mcp-route-guard.cjs`](../lib/mcp-route-guard.cjs): the shared core this adapter calls.
- [`../../shared/hook-flags.cjs`](../../shared/hook-flags.cjs): the switch resolver behind `isHookEnabled`.
- [`../../shared/hook-adapter-shared.cjs`](../../shared/hook-adapter-shared.cjs): the stdin reader and fail-open JSON parser.
- [`../../../../.devin/hooks.v1.json`](../../../../.devin/hooks.v1.json): the file that registers this adapter under `PreToolUse`.
