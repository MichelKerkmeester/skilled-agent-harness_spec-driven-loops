---
title: "Task Dispatch Hooks: Pi Adapter"
description: "Real Pi extension that turns shared deep-loop dispatch verdicts into advisory reasons on subagent calls."
trigger_phrases:
  - "pi task dispatch guard"
  - "pi subagent guard"
  - "pi deep loop guard"
version: 1.0.0.0
---

# Task Dispatch Hooks: Pi Adapter

---

## 1. OVERVIEW

`pi/` holds the real Pi extension for the Task Dispatch concern, and `.pi/extensions/` links to the same file. Pi wires it to `tool_call` on the `subagent` tool. The extension loads the shared core from its own folder or, through the extension link, from the hook library. Every verdict is advisory here. A reject returns a `reason` and never blocks the call.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| `task-dispatch-guard.ts` | `tool_call` on `subagent` | Reads `task`, `message` or `workflowScript` with `agent`, `subagent_type` or `subagentType`, calls `evaluateDispatch`, and appends the audits and warnings. A reject returns its detail as the reason. | Fails open. A load failure or core error returns nothing and the dispatch proceeds. |

---

## 3. RELATED

- [`../README.md`](../README.md): the Task Dispatch concern, its per-runtime table and its env flags.
- [`../lib/dispatch-guard.cjs`](../lib/dispatch-guard.cjs): the shared policy core the extension calls.
- [`../../../../.pi/extensions`](../../../../.pi/extensions): the Pi extension folder that loads it.
