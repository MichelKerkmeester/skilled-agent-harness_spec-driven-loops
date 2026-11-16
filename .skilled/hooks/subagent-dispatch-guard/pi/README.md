---
title: "Task Dispatch Hooks: Pi Adapter"
description: "Pi extension that turns shared deep-loop dispatch verdicts into advisory reasons on subagent calls."
trigger_phrases:
  - "pi task dispatch guard"
  - "pi subagent guard"
  - "pi deep loop guard"
version: 1.0.0.0
---

# Task Dispatch Hooks: Pi Adapter

---

## 1. OVERVIEW

`pi/` holds the Pi extension for the Task Dispatch concern. Pi registers it through `.pi/extensions/task-dispatch-guard.ts`, a one-line re-export of `task-dispatch-guard.ts`. Pi calls the extension on `tool_call` for the `subagent` tool.

Every verdict is advisory here. A reject returns a `reason` and never blocks the call. `SYSTEM_TASK_DISPATCH_DISABLED=1` turns the concern off. The extension then returns at once.

The extension loads the shared core from `../lib/subagent-dispatch-guard.cjs`. The core returns the decision, the warnings and the audits.

Claude, Cursor, Devin, DSH, OpenCode, Pi and Vibe each run the guard. The parent README names each registration.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `task-dispatch-guard.ts` | The Pi extension. It registers the `tool_call` handler and returns the advisory as a `reason`. |

The handler skips any tool other than `subagent`. It also skips a call that carries an `action` or `resume` string. The prompt comes from `task`, `message` or `workflowScript`. The target comes from `agent`, `subagent_type` or `subagentType`.

The handler passes `sessionID`, `projectDir` and `env` to `evaluateDispatch`. It resolves the state directory through `resolveGuardPaths`. Each audit goes to `appendRejectModeDegradedAudit` and each warning to `appendWarningLog`.

A reject returns its detail as the reason and appends it to the warning log. A warn returns the warnings joined with a newline. A throw returns nothing, so the dispatch proceeds.

---

## 3. RELATED

- [`../README.md`](../README.md): the Task Dispatch concern, its per-runtime table and its env flags.
- [`../lib/subagent-dispatch-guard.cjs`](../lib/subagent-dispatch-guard.cjs): the shared policy core the extension calls.
- [`../../../../.pi/extensions`](../../../../.pi/extensions): the Pi extension folder that loads it.
