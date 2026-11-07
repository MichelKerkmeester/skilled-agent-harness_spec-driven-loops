---
title: "Cursor Dispatch Hooks: Shell Preflight and Multiplexed Proxy"
description: "Cursor adapters that translate its Shell preToolUse payload to the Claude preflight and multiplex postToolUse between the dispatch audit and post-edit quality."
trigger_phrases:
  - "cursor dispatch preflight"
  - "cursor shell preflight"
  - "cursor post tool use proxy"
version: 1.0.0.0
---

# Cursor Dispatch Hooks: Shell Preflight and Multiplexed Proxy

---

## 1. OVERVIEW

`hooks/dispatch/cursor/` holds the Cursor adapters for the dispatch concern. Cursor has no native hard-rule engine. Its `preToolUse` adapter shapes a Claude `Bash` payload, spawns the Claude preflight and translates the returned envelope into Cursor's permission envelope.

The `postToolUse` entry is a shared multiplexed proxy. A `Shell` call reaches the dispatch audit, and a `Write` call reaches the post-edit-quality concern. Both entries are loaded from `.cursor/hooks.json`.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `dispatch-preflight-lint.mjs` | `preToolUse` on `Shell` | Renames the tool to `Bash`, spawns `claude/dispatch-preflight-lint.mjs` with a 5-second timeout and translates a deny into `{permission: 'deny'}` with the agent and user messages. A warn returns `{permission: 'allow', agent_message}`. | Fails open. A spawn or parse error approves the call. |
| `post-tool-use.mjs` | Symlink to [`../../../skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs`](../../../skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs) | Link only. The target multiplexes `postToolUse`. `Shell` normalizes to `Bash`, parses the stringified `tool_output` and spawns the Claude audit adapter. `Write` spawns the post-edit-quality adapter. | Fails open. A spawn or parse error on one branch never affects the tool call or the other branch. |

---

## 3. RELATED

- [`../README.md`](../README.md): the dispatch concern, the shared cores and the full rule list.
- [`../claude/dispatch-preflight-lint.mjs`](../claude/dispatch-preflight-lint.mjs): the Claude preflight this adapter spawns.
- [`../../../skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs`](../../../skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs): the real proxy this folder links to.
