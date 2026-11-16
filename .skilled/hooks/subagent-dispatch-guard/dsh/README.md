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

`dsh/` holds the real DSH adapter for the Task Dispatch concern. The `repo-guards` bundle imports it through its own link at `.dsh/plugins/repo-guards/adapters/task-dispatch-guard.mjs`. The adapter runs on `tools/pre-execute` for the `subagent` and `subagent_fork` tools. It is record-only: it evaluates the shared core, writes the audits and warnings, then hands the call to the next handler. A hand-off always proceeds, because every path ends with a call to the next handler.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `task-dispatch-guard.mjs` | The DSH adapter for `tools/pre-execute`. It records the shared core's audits and warnings. |

The adapter reads `agent`, `agent_preset`, `subagent_type` or `subagentType` with the prompt. It calls `evaluateDispatch`, then appends the audits and warnings to the shared state directory. An `action` or `resume` call is skipped, and so is a call with no prompt. `ERROR_POLICY` is `fail-open`, so a failure is logged and the call proceeds. The adapter registers no handler when `isHookEnabled('task-dispatch')` returns false.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/subagent-dispatch-guard/tests/dsh-task-dispatch-guard.test.mjs
```

Expected result: every test passes.

---

## 4. RELATED

- [`../README.md`](../README.md): the Task Dispatch concern, its per-runtime table and its env flags.
- [`../lib/subagent-dispatch-guard.cjs`](../lib/subagent-dispatch-guard.cjs): the shared policy core the adapter calls.
- [`../tests/dsh-task-dispatch-guard.test.mjs`](../tests/dsh-task-dispatch-guard.test.mjs): the adapter tests.
