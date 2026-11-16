---
title: "DSH Decision Capture: Live Answers and Idle Reminder"
description: "DSH adapter that queues answered questions, recovers late replies and injects one save reminder when captured answers wait."
trigger_phrases:
  - "dsh decision capture"
  - "dsh ask_user_question capture"
  - "dsh answer reminder"
version: 1.0.0.0
---

# DSH Decision Capture: Live Answers and Idle Reminder

---

## 1. OVERVIEW

`decision-capture.mjs` is the DSH adapter for the decision capture concern. It exports `registerDecisionCapture`, which registers one handler for each event it reads.

The `tools/result` handler queues each answered `ask_user_question` call into the shared queue. The `session/event` handler recovers a late reply to a timed question from the session feed. The `agent/status` handler injects one save reminder when the agent goes idle.

The module declares `ERROR_POLICY = 'fail-open'`, and every handler catches its own error. The `repo-guards` plugin bundle imports this adapter from this folder. DSH loads the adapter through a link at `.dsh/plugins/repo-guards/adapters/decision-capture.mjs`. The bundle at `.dsh/plugins/repo-guards/index.mjs` calls `registerDecisionCapture` in its `apply` function.

The concern key is `decision-capture`, and `SYSTEM_DECISION_CAPTURE_DISABLED=1` turns the adapter off.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `decision-capture.mjs` | The DSH adapter. It exports `registerDecisionCapture` and `ERROR_POLICY`. |

The register function accepts the plugin context and an options object that tests override. The options carry the queue core, the switch resolver, the notice factory and a working directory.

On `tools/result`, the adapter skips a call that is not `ask_user_question`. It also skips a result whose `isError` flag is set. It builds the session from the agent, then maps the answer with `dshAnswerRecords`. The live value is the same answer batch the result text spells. A live record and a swept one therefore share one key and never queue twice. The queue tags each record `source: 'hook'` and appends it through `appendRecords`.

On `session/event`, the adapter reads only a `user/message` event whose source kind is `user-question-reply`. It maps that event with `recoveredRecords` and queues the result.

On `agent/status`, the adapter acts only when the status is `idle`. It calls `takeNudge`, which returns the waiting count only when it has risen since the last report, and 0 otherwise. When the count is above zero, it injects a notice through `agent.inject`. The default notice factory builds the message with `createUserMessage` from `loadDshLlm()` and sets its source kind to `repo-guards`. The notice names the count and points at `/speckit:save` with `--full-auto`.

Each handler wraps its work in a try block and calls `logFailure` on a throw. That helper writes one warning through `ctx.logger.warn` and swallows a logging failure. The tool result or the turn therefore continues unchanged.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/decision-capture/tests/dsh-decision-capture.test.mjs
```

Expected result: every test passes, with `fail 0` in the summary. The suite covers the live answer queue and the answer read from result text. It also covers the skipped call, the late reply, the idle reminder and the fail-open throw policy.

---

## 4. RELATED

- [`../`](../): the decision capture concern README, with the queue core and the sweeps.
- [`../lib/capture-core.mjs`](../lib/capture-core.mjs): the queue core the adapter appends through.
- [`../bin/sweep-dsh.mjs`](../bin/sweep-dsh.mjs): the sweep that exports `dshAnswerRecords` and `recoveredRecords`.
- [`../tests/dsh-decision-capture.test.mjs`](../tests/dsh-decision-capture.test.mjs): the tests for this adapter.
