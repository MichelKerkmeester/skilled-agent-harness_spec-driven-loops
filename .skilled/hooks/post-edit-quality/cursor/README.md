---
title: "Post-Edit Quality: Cursor postToolUse Adapter"
description: "Cursor link to the multiplexing postToolUse hook that proxies Write to the Claude quality adapter and Shell to the dispatch audit."
trigger_phrases:
  - "cursor post edit quality"
  - "cursor post tool use"
  - "cursor quality proxy"
version: 1.0.0.0
---

# Post-Edit Quality: Cursor postToolUse Adapter

---

## 1. OVERVIEW

`cursor/` holds one relative symlink. `post-tool-use.mjs` points to `.skilled/skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs`, and `.cursor/hooks.json` registers that real file on `postToolUse`. The hook multiplexes by `tool_name`: `Write` becomes a Claude-shaped payload for the Claude quality adapter, and `Shell` goes to the dispatch audit, which belongs to a separate concern. Findings return as `agent_message` inside a `{permission: 'allow'}` envelope.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`post-tool-use.mjs`](./post-tool-use.mjs) | Symlink, `postToolUse` | Points at `.skilled/skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs`. The target spawns `claude-posttooluse.cjs` for `Write` and `dispatch-audit-posttooluse.mjs` for `Shell`, each under an 8000 ms timeout and a 1 MB buffer. | Fails open. Bad stdin, a spawn failure or non-JSON child output returns `{permission: 'allow'}`. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the dispatch table and the per-runtime matrix.
- [`../claude/claude-posttooluse.cjs`](../claude/claude-posttooluse.cjs): the child that runs the quality checks for `Write`.
- [`../../../../.skilled/skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs`](../../../../.skilled/skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs): the real hook.
