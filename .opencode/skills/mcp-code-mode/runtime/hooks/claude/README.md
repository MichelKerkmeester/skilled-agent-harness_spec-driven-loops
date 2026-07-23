---
title: "Runtime Hooks: Claude PreToolUse MCP Route Guard"
description: "Claude Code PreToolUse hook that advises routing native external MCP calls through Code Mode's call_tool_chain."
---

# Runtime Hooks: Claude PreToolUse MCP Route Guard

---

## 1. OVERVIEW

`runtime/hooks/claude/` holds the Claude Code adapter for the mcp-route-guard core. It targets the Claude Code runtime specifically: it reads a `PreToolUse` JSON payload from stdin, matches Claude's `mcp__<server>__<tool>` tool-name shape, and evaluates it against the runtime-neutral guard in `../../lib/`. The sibling `../codex/` folder is the same adapter shape targeting Codex CLI instead.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `mcp-route-guard.cjs` | Reads the `PreToolUse` stdin payload, calls `guardCore.evaluateNativeMcpCall`, and on a match emits a warn-only `additionalContext` advisory. Never sets `permissionDecision` and fails open (exits 0, approves) on any missing or invalid payload. |

## 3. RELATED

- [`../../lib/README.md`](../../lib/README.md)
- [`../codex/README.md`](../codex/README.md)
