---
title: "Task Dispatch Hooks: Cursor Adapter"
description: "Real Cursor adapter that delegates deep-loop dispatch policy to the Claude guard and translates its envelope."
trigger_phrases:
  - "cursor task dispatch guard"
  - "cursor deep loop guard"
  - "cursor pretooluse task"
version: 1.0.0.0
---

# Task Dispatch Hooks: Cursor Adapter

---

## 1. OVERVIEW

`cursor/` holds the real Cursor adapter for the Task Dispatch concern. Cursor wires it to a `preToolUse` entry with the matcher `Task` in `.cursor/hooks.json`, beside the unmatched Spec Gate entry. The adapter does not reimplement the policy. It forwards its payload unchanged to the Claude adapter by repository-relative path and translates the returned `hookSpecificOutput` into Cursor's permission envelope.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| `task-dispatch-guard.mjs` | `preToolUse` with matcher `Task` | Spawns `../claude/task-dispatch-guard.cjs` with a 5 s timeout and a 1 MiB stdio cap. A deny becomes `permission: deny` with `user_message` and `agent_message` at exit 2. A warn becomes `permission: allow` with `agent_message`. | Fails open. A missing payload, spawn error, non-zero child or non-JSON output returns `permission: allow`. |

---

## 3. RELATED

- [`../README.md`](../README.md): the Task Dispatch concern, its per-runtime table and its env flags.
- [`../claude/task-dispatch-guard.cjs`](../claude/task-dispatch-guard.cjs): the Claude adapter this file spawns.
- [`../lib/dispatch-guard.cjs`](../lib/dispatch-guard.cjs): the shared policy core behind the child.
- [`../../../../.cursor/hooks.json`](../../../../.cursor/hooks.json): the Cursor registration file.
