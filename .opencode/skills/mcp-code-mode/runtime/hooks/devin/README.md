---
title: "Runtime Hooks: Devin PreToolUse MCP Route Guard"
description: "Devin CLI PreToolUse hook that advises routing native external MCP calls through Code Mode's call_tool_chain."
---

# Runtime Hooks: Devin PreToolUse MCP Route Guard

---

## 1. OVERVIEW

`runtime/hooks/devin/` holds the Devin CLI adapter for the mcp-route-guard core, the sibling of `../claude/` and `../codex/` targeting the Devin runtime instead. It reads a `PreToolUse(^mcp__.*$)` JSON payload from stdin and evaluates it against the same runtime-neutral guard in `../../lib/`.

**STATUS: DORMANT for two independent reasons** - `.devin/hooks.v1.json` is confirmed not consulted at all under `devin -p` (packet-wide finding, see `../../../../system-spec-kit/mcp-server/hooks/devin/README.md`); additionally, like its Codex sibling, every MCP server registered under `cli-devin` today is `mk_`-prefixed and therefore exempt from the guard. This adapter only becomes practically relevant once an external, non-`mk_` MCP family is registered under Devin - re-evaluated by `../009-devin-mcp-host-integration/`.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `mcp-route-guard.cjs` | Reads the `PreToolUse` stdin payload, calls `guardCore.evaluateNativeMcpCall`, and on a match emits a warn-only `additionalContext` advisory. Never sets `permissionDecision` and fails open (exits 0, approves) on any missing or invalid payload. |

## 3. RELATED

- [`../../lib/README.md`](../../lib/README.md)
- [`../claude/README.md`](../claude/README.md)
- [`../codex/README.md`](../codex/README.md)
