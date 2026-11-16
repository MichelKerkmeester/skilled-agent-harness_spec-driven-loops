---
title: "Task Dispatch Hooks: Cursor Adapter"
description: "Cursor preToolUse adapter that delegates the dispatch decision to the Claude guard and translates its envelope."
trigger_phrases:
  - "cursor task dispatch guard"
  - "cursor deep loop guard"
  - "cursor pretooluse task"
version: 1.0.0.0
---

# Task Dispatch Hooks: Cursor Adapter

---

## 1. OVERVIEW

`cursor/` holds the Cursor adapter for the Task Dispatch concern. Cursor runs it from a `preToolUse` entry with the matcher `Task` in `.cursor/hooks.json`. That entry allows 10 seconds. It sits beside the unmatched Spec Gate entry, which covers every tool call.

The adapter holds no policy of its own. It builds a payload from the Cursor event and spawns `../claude/task-dispatch-guard.cjs` by repository-relative path. It then translates the returned `hookSpecificOutput` into Cursor's permission envelope.

Claude, Devin, DSH, OpenCode, Pi and Vibe run the same guard through their own adapters.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `task-dispatch-guard.mjs` | The Cursor `preToolUse` adapter. It reads the event, spawns the Claude adapter and translates the reply into Cursor's permission envelope. |

The adapter checks the `task-dispatch` switch first, so a disabled switch returns `permission: allow` at once. It then parses stdin, so a payload that is not JSON returns the same envelope. A `tool_name` other than `Task` also returns `permission: allow` before any child runs.

For a `Task` call it builds a fresh payload. `tool_input` and `session_id` pass through unchanged. `cwd` comes from `workspace_roots[0]` and falls back to the process directory.

It spawns the Claude adapter through `process.execPath`. The child gets a 5 s timeout and a 1 MiB stdio cap. It runs in the project directory with the parent environment. A timeout kills the child with `SIGKILL` and leaves no output, so the adapter approves. A spawn error approves the same way.

A deny becomes `permission: deny` with `user_message` and `agent_message` set to the reason. The adapter then exits 2. A warn becomes `permission: allow` with the advisory in `agent_message`. Any other reply, including non-JSON output, returns a bare `permission: allow`.

Every throw inside the adapter ends in that same bare allow. A bug here never blocks a correctly scoped dispatch.

---

## 3. VALIDATION

Run from the repository root.

```bash
printf '%s' '{"tool_name":"Read"}' | node .skilled/hooks/subagent-dispatch-guard/cursor/task-dispatch-guard.mjs
```

Expected result: `{"permission":"allow"}` and exit 0. A tool name other than `Task` returns before the child runs.

---

## 4. RELATED

- [`../README.md`](../README.md): the Task Dispatch concern, its runtime table and its switches.
- [`../claude/task-dispatch-guard.cjs`](../claude/task-dispatch-guard.cjs): the Claude adapter this file spawns.
- [`../lib/subagent-dispatch-guard.cjs`](../lib/subagent-dispatch-guard.cjs): the shared policy core behind the child.
- [`../../../../.cursor/hooks.json`](../../../../.cursor/hooks.json): the Cursor registration file.
