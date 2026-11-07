---
title: "Task Dispatch Hooks: DSH Adapter"
description: "Real DSH adapter that records shared deep-loop dispatch warnings for subagent hand-offs."
trigger_phrases:
  - "dsh task dispatch guard"
  - "dsh subagent hand off"
  - "dsh deep loop guard"
version: 1.0.0.0
---

# Task Dispatch Hooks: DSH Adapter

---

## 1. OVERVIEW

`dsh/` holds the real DSH adapter for the Task Dispatch concern, and the `repo-guards` bundle imports it through its own link. It runs on `tools/pre-execute` for `subagent` and `subagent_fork`. The adapter is record-only. It evaluates the shared core, writes the audits and warnings, then hands the call to the next handler, so a hand-off always proceeds.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| `task-dispatch-guard.mjs` | `tools/pre-execute` on `subagent` and `subagent_fork` | Reads `agent`, `agent_preset`, `subagent_type` or `subagentType` with the prompt, calls `evaluateDispatch`, then appends the audits and warnings to the shared state directory. An `action` or `resume` call is skipped. | Fails open. `ERROR_POLICY` is `fail-open`, the failure is logged and the call proceeds. |

---

## 3. RELATED

- [`../README.md`](../README.md): the Task Dispatch concern, its per-runtime table and its env flags.
- [`../lib/dispatch-guard.cjs`](../lib/dispatch-guard.cjs): the shared policy core the adapter calls.
- [`../tests/dsh-task-dispatch-guard.test.mjs`](../tests/dsh-task-dispatch-guard.test.mjs): the adapter tests.
