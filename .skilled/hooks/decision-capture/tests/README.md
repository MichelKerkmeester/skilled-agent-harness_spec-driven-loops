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

`tests/` holds one suite for the DSH decision capture adapter. The suite runs under `node --test` and imports the adapter from `../dsh/decision-capture.mjs`. It also imports `dshAnswerRecords` from `../bin/sweep-dsh.mjs`, the mapper a save-time sweep uses.

The suite builds a plugin context with `pluginHarness` from `../../shared/tests/dsh-plugin-harness.mjs`. It fires the three events the adapter registers: `tools/result`, `session/event` and `agent/status`. The helpers record queued records, injected notices and log lines.

This folder holds no runtime adapter, and the live adapters sit beside it.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `dsh-decision-capture.test.mjs` | The suite for the DSH adapter. It covers capture, the reminder and the throw policy. |

The suite fires `tools/result` with an answered `ask_user_question` call from a fake agent. It asserts one append under the project folder and session id. The record carries the question text and the chosen option label. It also names the runtime `dsh` and the source `hook`. A second assertion compares its key with the key `dshAnswerRecords` builds for the same call.

A second case reads the answer from the result text when no value is attached. The text holds a custom answer, and the suite expects `DuckDB`. A third case fires a failed call, a pending call and an unrelated `bash` call. The suite expects the queue to stay empty for all three.

A fourth case feeds a late reply to a timed question through `session/event`. The reply arrives as a `user/message` whose source kind is `user-question-reply`. A plain user message after it adds nothing to the queue. The suite expects one append that carries the answer `Postgres`.

A fifth case drives `agent/status` from a running status to idle. A running status injects nothing, and the idle status injects one notice. The notice names two waiting answers and points at `/speckit:save`. A second idle status injects nothing more, because the count is spent.

The last case checks the throw policy and the kill switch. `ERROR_POLICY` is `fail-open`, and a throwing `appendRecords` writes one warning. The same case registers the adapter with a disabled switch. No handler registers, so the kill switch removes the adapter.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/decision-capture/tests/dsh-decision-capture.test.mjs
```

Expected result: one `pass` line per case and a closing `fail 0`.

---

## 4. RELATED

- [`../README.md`](../README.md): the decision capture concern, with the runtime coverage table.
- [`../`](../): the concern folder, with its adapters, sweeps and README.
- [`../dsh/decision-capture.mjs`](../dsh/decision-capture.mjs): the adapter under test, with its three event handlers.
- [`../lib/capture-core.mjs`](../lib/capture-core.mjs): the queue core the adapter calls to append records.
- [`../../README.md`](../../README.md): the hooks tree, with the switch index and the coverage matrix.
