---
title: "Decision Capture Tests: DSH Adapter Suite"
description: "node --test suite that covers live and late-reply answer capture, the idle reminder and the fail-open policy of the DSH decision capture adapter."
trigger_phrases:
  - "dsh decision capture tests"
  - "decision capture parity tests"
  - "dsh answer queue tests"
version: 1.0.0.0
---

# Decision Capture Tests: DSH Adapter Suite

---

## 1. OVERVIEW

`.skilled/hooks/decision-capture/tests/` holds the `node --test` suite for the DSH decision capture adapter. A case builds a fake plugin context, registers the adapter in it and fires one or more events. Across the suite, the cases check what the adapter queued, the notice it injected and the warning the context logged.

The folder holds no runtime code. The adapter sits in the sibling dsh folder. The fake context helpers come from `.skilled/hooks/shared/tests/`.

---

## 2. ARCHITECTURE

The folder ships no production module. The suite connects the real adapter to a stub queue core and reads the stub's record of each append.

```text
╭──────────────────────────────────────────────────────────────╮
│              dsh-decision-capture.test.mjs                   │
╰──────────────────────────────────────────────────────────────╯

┌────────────────────┐        ┌──────────────────────────────┐
│ node --test        │ ─────▶ │ a case in the suite          │
└────────────────────┘        └──────────────┬───────────────┘
                                             │
                    ┌────────────────────────┴─────────────────────┐
                    ▼                                              ▼
      ┌──────────────────────────────┐      ┌──────────────────────────────┐
      │ harnessWithCore()            │      │ fakeAgent()                  │
      │ pluginHarness() builds ctx   │      │ session id and project folder│
      └──────────────┬───────────────┘      └──────────────┬───────────────┘
                     │                                     │
                     └─────────────────┬───────────────────┘
                                       ▼
                     ┌────────────────────────────────────────┐
                     │ registerDecisionCapture(ctx, options)  │
                     │ ../dsh/decision-capture.mjs            │
                     └───────────────────┬────────────────────┘
                                         │
                    ┌────────────────────┴─────────────────────┐
                    ▼                                          ▼
     ┌─────────────────────────────┐      ┌─────────────────────────────┐
     │ dshAnswerRecords()          │      │ stub queue core             │
     │ ../bin/sweep-dsh.mjs        │      │ appendRecords, takeNudge    │
     └─────────────────────────────┘      └─────────────────────────────┘
```

`fakeAgent()` supplies the session id and project folder the record is keyed under. A case can replace the stub `takeNudge` function through `harnessWithCore()`. The default stub returns 0.

---

## 3. FILES

The folder is flat. This table is the full inventory.

| File | Responsibility |
|---|---|
| `dsh-decision-capture.test.mjs` | The `node --test` suite for the DSH adapter. It registers the adapter against a stub queue core and covers live capture, late replies, the idle reminder and the fail-open policy. |

Each case calls `harnessWithCore()` to build its context. That helper wraps `pluginHarness()` from `../../shared/tests/dsh-plugin-harness.mjs` and calls `registerDecisionCapture` with `isEnabled: enabled` and `createNotice: plainNotice`. It also swaps the queue core for a stub that records each append batch under its project folder and session id.

The first case fires `tools/result` for an answered `ask_user_question` call from a fake agent. It asserts one append under the fake project folder and session id. The record keeps the question text, the chosen option label, the runtime label `dsh` and the source `hook`. The same case builds a record with `dshAnswerRecords` from `../bin/sweep-dsh.mjs` and compares the two keys, so a live capture and a swept record agree.

A second case leaves the value off the result and reads the answer from the result text. A third fires a failed call and a pending call, then a `bash` call that is not a question. It expects no append for any of them.

A fourth case sends a late reply through `session/event`. The event is a `user/message` whose source kind is `user-question-reply`. A plain user message follows and adds nothing. The suite expects one append with the answer `Postgres`.

A fifth case drives `agent/status` from `running` to `idle`. The running status injects nothing. The idle status injects one notice that names the count and points at `/speckit:save`. A second idle status injects nothing more, because the stub count is spent.

The last case gives the stub a throwing `appendRecords` and expects one warning in `logs`. It registers the adapter with `isEnabled: disabled` and expects no handler, so the switch removes the adapter. The case also asserts that `ERROR_POLICY` is `fail-open`.

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | The suite imports `node:test` and `node:assert/strict` from Node. It imports the adapter and the record mapper from the concern. The fake context helpers come from the shared test folder. |
| Exports | None. `node --test` runs the file for its cases. |
| Ownership | This folder owns the DSH adapter test. The adapter and the record mapper belong to their own folders. |
| State | No queue file is written. Every append goes to the stub core the case passed in. |

An answered call enters through `tools/result`. The adapter skips a call whose name is not `ask_user_question` or whose result is an error. It reads the session id and project folder from the agent. It builds records with `dshAnswerRecords` and hands the tagged batch to `appendRecords`. The case then asserts the fields on the record in the stub.

The late-reply case enters through `session/event`. The adapter accepts a `user/message` whose source kind is `user-question-reply` and `recoveredRecords` builds the batch.

---

## 5. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/decision-capture/tests/dsh-decision-capture.test.mjs
```

Expected result: one `✔` line per case, then `pass 6` and `fail 0` in the summary. The command exits 0.

---

## 6. RELATED

- [the DSH adapter the suite drives](../dsh/decision-capture.mjs)
- [the sweep module that builds the record keys](../bin/sweep-dsh.mjs)
- [the shared test helpers](../../shared/tests/README.md)
- [the queue core the adapter appends through](../lib/capture-core.mjs)
- [the decision capture concern](../README.md)
- [the hooks tree](../../README.md)
