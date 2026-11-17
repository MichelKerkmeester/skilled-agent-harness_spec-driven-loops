---
title: "Claude MCP Route Guard: PreToolUse Adapter"
description: "Claude Code adapter that evaluates a native external MCP call with the shared route-guard core and returns an additionalContext advisory, never a permission decision."
trigger_phrases:
  - "claude mcp route guard"
  - "pretooluse mcp advisory"
  - "code mode routing nudge"
version: 1.0.0.0
---

# Claude MCP Route Guard: PreToolUse Adapter

---

## 1. OVERVIEW

`.skilled/hooks/mcp-route-guard/claude/` holds the Claude Code adapter for the MCP route guard concern. It runs at `PreToolUse` on a native external MCP call and turns the shared core's route warning into an `additionalContext` advisory. The call still runs, because the adapter never writes `permissionDecision`.

Claude registers the adapter in `.claude/settings.json` under the `PreToolUse` event. The matcher is `mcp__claude_ai_.*` and the timeout is 5 seconds. The command changes into `${CLAUDE_PROJECT_DIR:-$PWD}` and exits 0 when `.skilled/hooks` is absent. If the adapter file is missing or `node` fails, the fallback prints a drift line on stderr and a `hookSpecificOutput` envelope that tells Claude to rebuild the runtime.

The adapter checks the switch before it reads stdin. A call to `isHookEnabled('mcp-route-guard')` resolves `MCP_ROUTE_GUARD_DISABLED`, and a disabled guard exits 0 with no output.

On a live switch it reads stdin and parses the payload. A null parse returns at once, which covers empty input and invalid JSON. Otherwise it takes `tool_name` from the payload and resolves the project directory from the payload `cwd`. A missing `cwd` falls back to `CLAUDE_PROJECT_DIR`, then to `process.cwd()`.

Both values go to `evaluateNativeMcpCall()` in `.skilled/hooks/mcp-route-guard/lib/mcp-route-guard.cjs`. One warning or more becomes `hookSpecificOutput.additionalContext`, joined by a newline, and the adapter exits 0.

The concern key is `mcp-route-guard`. Its switch is `MCP_ROUTE_GUARD_DISABLED`, and `SYSTEM_HOOKS_DISABLED` is the master switch. Every failure ends the same way: exit 0 with no output on either stream. An unexpected throw takes that path, and so does a stdin error.

Cursor reaches this file through `.skilled/hooks/mcp-route-guard/cursor/mcp-route-guard.mjs`. That adapter packs the server and tool into `mcp__<server>__<tool>`, spawns this file and reads the advisory from its stdout.

---

## 2. DIRECTORY TREE

| File | Responsibility |
|---|---|
| `mcp-route-guard.cjs` | The adapter. It checks the switch, reads the payload, calls the core and prints the advisory. |

The folder holds one adapter and no test. It has no symlink.

---

## 3. VALIDATION

Run the command from the repository root.

```bash
node .skilled/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs
```

Expected result: every case passes, the run prints the `[mcp-route-guard]` assertion summary and the command exits 0. The suite spawns this adapter with a routable `PreToolUse` payload and asserts an `additionalContext` advisory with no `permissionDecision`. It then repeats with an unrouteable family and with malformed input to confirm the adapter stays silent.

---

## 4. RELATED

- [the mcp route guard folder](../README.md): the concern README, with the policy table and the runtime matrix.
- [the shared guard core](../lib/mcp-route-guard.cjs): the module this adapter calls for a route decision.
- [the shared stdin reader](../../shared/hook-adapter-shared.cjs): the fail-open reader and JSON parser.
- [the switch resolver](../../shared/hook-flags.cjs): the module behind `isHookEnabled`.
- [the Claude settings file](../../../../.claude/settings.json): the `PreToolUse` registration for this adapter.
- [the hooks tree](../../README.md): the switch index and the coverage matrix.
