---
title: "Task Dispatch Tests: DSH Adapter Suite"
description: "Node test suite for the DSH task dispatch adapter against the shared deep-loop policy core."
trigger_phrases:
  - "task dispatch dsh tests"
  - "dsh adapter parity tests"
  - "task dispatch throw policy"
version: 1.0.0.0
---

# Task Dispatch Tests: DSH Adapter Suite

---

## 1. OVERVIEW

`tests/` holds the `node --test` suite for the DSH Task Dispatch adapter. The suite imports `dispatch-guard.cjs` and drives the adapter through the fake plugin context in `.skilled/hooks/shared/tests/`. It checks core parity for an unknown hand-off identity and the `fail-open` throw policy.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| `dsh-task-dispatch-guard.test.mjs` | `node --test` suite | Runs `tools/pre-execute` for `subagent` and `subagent_fork`, compares the adapter result with `evaluateDispatch`, and asserts that a core throw still allows the call and logs once. | A failed assertion exits non-zero. |

---

## 3. RELATED

- [`../README.md`](../README.md): the Task Dispatch concern, its per-runtime table and its env flags.
- [`../dsh/task-dispatch-guard.mjs`](../dsh/task-dispatch-guard.mjs): the adapter under test.
- [`../lib/dispatch-guard.cjs`](../lib/dispatch-guard.cjs): the shared policy core the suite compares against.
- [`../../shared/tests/`](../../shared/tests/): the shared test helpers the suite uses.
