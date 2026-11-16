---
title: "Goal (Tests): DSH Adapter Coverage"
description: "The node --test suite for the two DSH goal adapters, covering the manage CLI bridge, the per-turn brief, the verify note and the packet context slice."
trigger_phrases:
  - "dsh goal tests"
  - "goal adapter coverage"
  - "packet slice test"
version: 1.0.0.0
---

# Goal (Tests): DSH Adapter Coverage

---

## 1. OVERVIEW

`goal/tests/` holds the DSH adapter test suite for the goal concern. `dsh-goal.test.mjs` runs under `node --test` and drives both adapters through the shared DSH test support module at `.skilled/hooks/shared/tests/dsh-plugin-harness.mjs`. The manage CLI is stubbed in most cases. The packet context test runs the real `bin/goal.cjs` against a fixture repository in a temp directory.

The suite covers the command and tool action grammar, the scope flags passed to the CLI, the brief that rides an operator turn, the verify note held for the next idle status, the leaf and disabled gates and the context adapter's exact `chatSlice` injection. It also asserts the throw policy for both adapters.

---

## 2. WHAT EACH FILE DOES

| File | Event | What it does | On error |
|---|---|---|---|
| `dsh-goal.test.mjs` | `node --test` | Asserts the `dsh_goal` action set, maps each action onto the CLI grammar, runs `/goal-dsh` under the session scope, checks the failed envelope, the leaf gate and the disabled gate, compares the injected slice with the CLI `chat_slice=` output and asserts one log line on a thrown core. | A failed assertion fails the test process with a nonzero status. Temporary repositories are removed in `finally`. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern index, with the action set and the state layout.
- [`../dsh/goal-manage.mjs`](../dsh/goal-manage.mjs): the command, tool and per-turn adapter under test.
- [`../dsh/goal-context.mjs`](../dsh/goal-context.mjs): the packet context adapter under test.
