---
title: "Cursor Task Dispatch Guard: preToolUse Adapter"
description: "Cursor preToolUse adapter that delegates the dispatch decision to the Claude guard and translates its envelope."
trigger_phrases:
  - "cursor task dispatch guard"
  - "cursor deep loop guard"
  - "cursor pretooluse task"
version: 1.0.0.0
---

# Cursor Task Dispatch Guard: preToolUse Adapter

---

## 1. OVERVIEW

`.skilled/hooks/subagent-dispatch-guard/cursor/` holds the Cursor adapter for the Task Dispatch concern. It runs at `preToolUse` on a `Task` call and carries no policy of its own. It builds a payload and spawns the Claude guard. It then translates the reply into Cursor's permission envelope.

Cursor registers the adapter in `.cursor/hooks.json` as a second entry in the `preToolUse` array, with `"matcher": "Task"` and a 10-second timeout. The entry wraps the command in a drift fallback. When the adapter file is missing or `node` fails, the fallback prints an `mk-hook-drift` line on stderr and writes an allow envelope on stdout with `mkHookDrift` set, so the call proceeds. A deny exits 2, which trips the same fallback: the registered command prints the deny, then the drift line and the allow envelope, and exits 0. Which envelope Cursor acts on is unconfirmed.

The concern key is `task-dispatch`, and its switch is `SYSTEM_TASK_DISPATCH_DISABLED`. The adapter checks that switch before it reads stdin, so a disabled concern returns `{"permission":"allow"}` at once. The check goes through `isHookEnabled` in `.skilled/hooks/shared/hook-flags.mjs`, so `SYSTEM_HOOKS_DISABLED=1` is the master switch.

A `Task` call builds a fresh payload. `tool_input` and `session_id` pass through unchanged. `cwd` comes from `workspace_roots[0]` and falls back to the process directory. The child runs through `process.execPath` with a 5-second timeout and a 1 MiB stdio cap. A timeout sends `SIGKILL` and leaves no output, which approves the call.

A deny from the child becomes `permission: deny`, with the reason in `user_message` and `agent_message`. The adapter then exits 2. Warning text becomes `permission: allow` with the text in `agent_message`.

Every failure ends the same way: `{"permission":"allow"}` on stdout and exit 0. That covers a payload that is not JSON, a tool name other than `Task`, a spawn error, non-JSON child output and an internal throw. A fault in this adapter costs a dispatch check, not the dispatch.

---

## 2. DIRECTORY TREE

The folder is flat. The table names every entry except this README.

| File | Responsibility |
|---|---|
| `task-dispatch-guard.mjs` | The adapter. It checks the `task-dispatch` switch and builds the child payload. It then translates the reply. |

---

## 3. VALIDATION

Run the smoke from the repository root. It sends a `Task` dispatch whose declared mode conflicts with the target, so the child returns a deny and the adapter translates it.

```bash
printf '%s' '{"tool_name":"Task","tool_input":{"subagent_type":"deep-review","prompt":"mode=research do the thing"}}' | SYSTEM_DEEP_LOOP_GUARD_REJECT=1 node .skilled/hooks/subagent-dispatch-guard/cursor/task-dispatch-guard.mjs
```

Expected result: one JSON line with `"permission":"deny"` and the `Deep Route mode mismatch` reason in `user_message` and `agent_message`, then exit status 2.

---

## 4. RELATED

- [`../README.md`](../README.md): the concern folder, with the runtime table and the switch list.
- [`../claude/task-dispatch-guard.cjs`](../claude/task-dispatch-guard.cjs): the Claude adapter this file spawns.
- [`../lib/subagent-dispatch-guard.cjs`](../lib/subagent-dispatch-guard.cjs): the shared policy core behind that child.
- [`../../../../.cursor/hooks.json`](../../../../.cursor/hooks.json): the Cursor registration file.
