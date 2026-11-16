---
title: "Task Dispatch Hooks: OpenCode Plugin Link"
description: "Relative link to the OpenCode deep-loop guard plugin, which maps task transport onto the shared policy core."
trigger_phrases:
  - "opencode task dispatch guard"
  - "opencode deep loop guard"
  - "opencode task execute before"
version: 1.0.0.0
---

# Task Dispatch Hooks: OpenCode Plugin Link

---

## 1. OVERVIEW

`opencode/` holds one link for the OpenCode Task Dispatch path. It points at the committed plugin in `.opencode/plugins/`, which OpenCode loads through its flat glob over that folder. Nothing loads through this link. The plugin enforces on `tool.execute.before` for `task` and runs the state sweep on `event` for `session.created`. A reject becomes a thrown error, and a warning becomes a state-dir log line.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| `system-deep-loop-guard.js` | Plugin link | Link to `.opencode/plugins/system-deep-loop-guard.js`. Calls `evaluateDispatch`, appends the audits and warnings, and throws `Error(result.detail)` on reject. Never writes stdout or stderr. | Fails open on an unexpected internal error. Only a message that starts with `system-deep-loop-guard:` is re-thrown. |

---

## 3. RELATED

- [`../README.md`](../README.md): the Task Dispatch concern, its per-runtime table and its env flags.
- [`../../../../.opencode/plugins/system-deep-loop-guard.js`](../../../../.opencode/plugins/system-deep-loop-guard.js): the real plugin behind the link.
- [`../../../../.opencode/plugins/README.md`](../../../../.opencode/plugins/README.md): the plugin folder and its load rule.
