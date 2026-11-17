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

`.skilled/hooks/goal/tests/` holds the DSH test suite for the goal concern. It runs under `node --test` and covers the manage adapter and the context adapter from `../dsh/`.

Most cases stub the manage CLI and the goal core. One case imports the real core and spawns the real `../bin/goal.cjs` against a fixture packet in a temp directory. It compares the text the context adapter injects with the `chat_slice=` line that the CLI prints.

The suite asserts the action set, the CLI grammar and the session scope flags. It checks the failed envelope, the tool on an interactive agent and the brief on an operator turn. It covers the verify note at idle, the leaf gate and the disabled gate, plus the `fail-open` policy of both adapters.

Every adapter case builds its adapter through the shared test module `../../shared/tests/dsh-plugin-harness.mjs`. Two unit cases check `GOAL_ACTIONS` and `goalCliArgs` directly and build no adapter. A fake plugin context records the handlers, commands and log lines. A fake agent records injected messages and registered tools. No case starts a DSH process.

---

## 2. ARCHITECTURE

The suite imports production code and test support from four places.

```text
╭──────────────────────────────────────────────────────────╮
│                       goal/tests/                        │
│                                                          │
│   dsh-goal.test.mjs                                      │
│     -> dsh/goal-manage.mjs     command, tool, turn hooks │
│     -> dsh/goal-context.mjs    packet chat slice         │
│     -> lib/goal-core.cjs       real core in one case     │
│     -> shared test helpers     fake context and agent    │
│                                                          │
│   bin/goal.cjs is spawned by the one context case        │
╰──────────────────────────────────────────────────────────╯
```

The manage cases drive `registerGoalManage`. It registers the `goal-dsh` command, the `dsh_goal` tool on `agent/created` and handlers for `agent/pre-step`, `agent/turn-stopping` and `agent/status`.

The context cases drive `registerGoalContext`. It hooks `agent/created` alone.

---

## 3. FILES

| File | Responsibility |
|---|---|
| `dsh-goal.test.mjs` | The whole suite. It imports both adapters, the goal core and the shared test module, then asserts what an adapter does on a named event. |

A failed assertion throws, so the test process exits nonzero. The real-CLI case removes its temp directory in a `finally` block.

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Manage CLI | Cases pass a `runCli` stub that records an argv and returns canned stdout. The real-CLI case spawns the CLI instead. |
| Goal core | `stubCore()` supplies the calls the manage adapter reads. The real-CLI case passes the real core to the context adapter. |
| Runtime | `pluginHarness()` and `adapterHarness()` supply fake contexts. `fakeAgent()` supplies a session, so no DSH plugin loader runs. |
| Temp state | `tempDir()` creates a directory under the system temp path and `cleanup()` removes it. |

A manage case registers the adapter on a `pluginHarness` context, fires one event with a fake agent and reads the recorded argv, tool or notice. A context case registers the adapter on an `adapterHarness`, fires `agent/created` and reads what the agent injected.

The verify note waits for idle. `agent/turn-stopping` records the turn and holds a pending note when the verdict is not `met`. The next `agent/status` with `idle` injects that note once and clears it.

---

## 5. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/goal/tests/dsh-goal.test.mjs
```

Expected output: a pass line for every test, then `fail 0` in the summary and exit status 0.

---

## 6. RELATED

- [Goal concern index](../README.md): the runtime coverage table and the switches.
- [Manage adapter](../dsh/goal-manage.mjs): the command, tool and turn handlers under test.
- [Context adapter](../dsh/goal-context.mjs): the packet chat slice under test.
- [Shared test helpers](../../shared/tests/README.md): the fake context, agent and notice helpers.
- [Manage CLI](../bin/goal.cjs): the router that one case spawns.
