---
title: "Runtime Hooks: Codex PreToolUse MCP Route Guard"
description: "Codex CLI PreToolUse hook that advises routing native external MCP calls through Code Mode's call_tool_chain."
---

# Runtime Hooks: Codex PreToolUse MCP Route Guard

---

## 1. OVERVIEW

`runtime/hooks/codex/` holds the Codex CLI adapter for the mcp-route-guard core, the sibling of `../claude/` targeting the Codex runtime instead. It reads a `PreToolUse` JSON payload from stdin and evaluates it against the same runtime-neutral guard in `../../lib/`. The file itself documents that it is dormant today: every MCP server Codex registers is `mk_`-prefixed and therefore exempt from the guard, so this adapter only activates once an external, non-`mk_` MCP family is registered under Codex.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `mcp-route-guard.cjs` | Reads the `PreToolUse` stdin payload, calls `guardCore.evaluateNativeMcpCall`, and on a match emits a warn-only `additionalContext` advisory. Never sets `permissionDecision` and fails open (exits 0, approves) on any missing or invalid payload. |

## 3. RELATED

- [`../../lib/README.md`](../../lib/README.md)
- [`../claude/README.md`](../claude/README.md)
