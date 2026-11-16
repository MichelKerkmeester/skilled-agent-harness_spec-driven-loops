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

`.skilled/hooks/goal/tests/` holds the DSH test suite for the goal concern. `dsh-goal.test.mjs` runs under `node --test`. It drives both DSH adapters through the shared support module at `.skilled/hooks/shared/tests/dsh-plugin-harness.mjs`.

Most cases stub the manage CLI. One case spawns the real `../bin/goal.cjs` and the real core against a fixture repository in a temp directory. That case compares the injected `chatSlice` with the CLI `chat_slice=` output.

The suite covers the action set, the CLI grammar and the session scope flags. It checks the failed envelope, the brief on an operator turn and the verify note on the next idle status. The leaf gate and the disabled gate get their own cases. Both adapters' throw policy is asserted too.

Only DSH runs these two adapters. DSH loads both through `.dsh/plugins/repo-guards/index.mjs`. The manage adapter registers the `/goal-dsh` command and the `dsh_goal` tool, then hooks `agent/created`, `agent/pre-step`, `agent/turn-stopping` and `agent/status`. The context adapter hooks `agent/created` alone.

Both adapters declare `fail-open`. On a thrown core in the pre-step hook, the manage adapter logs one warning and returns the downstream result. The context adapter logs one warning and injects nothing.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `dsh-goal.test.mjs` | The DSH goal suite. It covers both adapters and the manage CLI bridge. |

The suite asserts the `dsh_goal` action set and maps each action onto the CLI grammar. It runs `/goal-dsh` under the session scope and checks the failed envelope. It compares the injected slice with the CLI `chat_slice=` output and asserts one log line on a thrown core. A failed assertion fails the test process with a nonzero status. Temporary repositories are removed in `finally`.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/goal/tests/dsh-goal.test.mjs
```

Expected result: every test passes and the process exits 0.

---

## 4. RELATED

- [`../README.md`](../README.md): the concern index, with the action set and the state layout.
- [`../dsh/goal-manage.mjs`](../dsh/goal-manage.mjs): the command, tool and per-turn adapter under test.
- [`../dsh/goal-context.mjs`](../dsh/goal-context.mjs): the packet context adapter under test.
