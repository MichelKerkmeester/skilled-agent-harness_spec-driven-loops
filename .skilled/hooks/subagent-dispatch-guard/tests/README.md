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

`tests/` holds the `node --test` suite for the DSH Task Dispatch adapter. The suite imports `subagent-dispatch-guard.cjs` and drives the adapter through the fake plugin context in `.skilled/hooks/shared/tests/`. It checks core parity for an unknown hand-off identity and the `fail-open` throw policy.

The suite runs its cases against the adapter's `tools/pre-execute` handler. The parity case builds a request for an unregistered agent and calls `evaluateDispatch`. It asserts that the core allows the hand-off, then sends `subagent_fork` through the handler. The throw case checks `ERROR_POLICY` and sends `subagent` with a core that raises. It then asserts that the call is allowed and that one log line was written.

DSH registers the adapter in `.dsh/plugins/repo-guards/index.mjs`, which imports `.dsh/plugins/repo-guards/adapters/task-dispatch-guard.mjs`. That file is a link to the adapter at `../dsh/task-dispatch-guard.mjs`. The adapter logs a failure through `ctx.logger.warn` and then calls the next handler, so the hand-off proceeds.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `dsh-task-dispatch-guard.test.mjs` | The `node --test` suite for the DSH adapter. |

The suite imports the core and the adapter, then registers it on a fake context. It passes an `isEnabled` that always returns true, so the kill switch never runs. Each case reads the handler that the adapter registered for `tools/pre-execute`.

A failed assertion exits non-zero, so the runner reports the file as failed.

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
- [`../dsh/task-dispatch-guard.mjs`](../dsh/task-dispatch-guard.mjs): the DSH adapter the suite registers and drives.
- [`../lib/subagent-dispatch-guard.cjs`](../lib/subagent-dispatch-guard.cjs): the shared policy core the parity case compares against.
- [`../../shared/tests/`](../../shared/tests/): the shared test helpers, including the fake plugin context.
