---
title: "Runtime Hooks: Devin PreToolUse MCP Route Guard"
description: "Devin CLI PreToolUse hook that advises routing native external MCP calls through Code Mode's call_tool_chain."
---

# Runtime Hooks: Devin PreToolUse MCP Route Guard

---

## 1. OVERVIEW

`runtime/hooks/devin/` holds the Devin CLI adapter for the mcp-route-guard core, the sibling of `../claude/` and `../codex/` targeting the Devin runtime instead. It reads a `PreToolUse(^mcp__.*$)` JSON payload from stdin and evaluates it against the same runtime-neutral guard in `../../lib/`.

**STATUS: REGISTERED, NO APPLICABLE LIVE CALL YET** - Devin hooks fire under `devin -p`, and this adapter passes direct tests. Every MCP server registered under Devin today is `mk_`-prefixed and exempt from the guard, so the hook becomes practically relevant only after an external non-`mk_` family is registered. Phase 009 re-evaluates that condition.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `mcp-route-guard.cjs` | Reads the `PreToolUse` stdin payload, calls `guardCore.evaluateNativeMcpCall`, and on a match emits a warn-only `additionalContext` advisory. Never sets `permissionDecision` and fails open (exits 0, approves) on any missing or invalid payload. |

## 3. RELATED

- [`../../lib/README.md`](../../lib/README.md)
- [`../claude/README.md`](../claude/README.md)
- [`../codex/README.md`](../codex/README.md)
