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

`claude/` holds the Claude Code adapter for the MCP route guard. `.claude/settings.json` registers it on the `PreToolUse` event under the matcher `mcp__claude_ai_.*`, with a 5-second timeout.

The adapter reads the hook payload from stdin and calls `../lib/mcp-route-guard.cjs`. The core answers `allow` or `warn` and nothing stronger.

A non-empty `warnings` list becomes `hookSpecificOutput.additionalContext`, joined by a newline. The adapter never writes `permissionDecision`, so the call always proceeds.

Every other outcome exits 0 with no output. That covers invalid stdin, a missing payload, a disabled switch and a thrown error. A core error returns no warnings, so the call proceeds.

Cursor reaches the same file through its own adapter. `../cursor/mcp-route-guard.mjs` spawns it with a packed `tool_name` and a `cwd`, then reads the advisory from its stdout.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `mcp-route-guard.cjs` | The Claude `PreToolUse` adapter for the route guard. |

The adapter checks the shared switch with `isHookEnabled('mcp-route-guard')` before it reads anything. A disabled switch exits 0 with no output.

On a live switch it parses the payload and runs `evaluateNativeMcpCall()`. The project directory is `cwd`, then `CLAUDE_PROJECT_DIR`, then the process working directory.

The shared parser returns null for invalid JSON, so the adapter treats null as no payload. A stdin stream error rejects the read. The entrypoint catches that rejection and exits 0.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs
```

Expected result: every test passes. The suite pipes a `PreToolUse` payload through this adapter and asserts an `additionalContext` advisory with no `permissionDecision`.

---

## 4. RELATED

- [`../README.md`](../README.md): the concern README with the policy table and the per-runtime matrix.
- [`../lib/mcp-route-guard.cjs`](../lib/mcp-route-guard.cjs): the shared core this adapter calls.
- [`../../shared/hook-adapter-shared.cjs`](../../shared/hook-adapter-shared.cjs): the fail-open stdin reader and JSON parser.
- [`../../shared/hook-flags.cjs`](../../shared/hook-flags.cjs): the switch resolver behind `isHookEnabled`.
