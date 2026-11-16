---
title: "DSH Decision Capture: Live Answers and Idle Reminder"
description: "DeepSeek Harness adapter that queues answered questions, recovers late replies and injects one save reminder when captured answers wait."
trigger_phrases:
  - "dsh decision capture"
  - "dsh ask_user_question capture"
  - "dsh answer reminder"
version: 1.0.0.0
---

# DSH Decision Capture: Live Answers and Idle Reminder

---

## 1. OVERVIEW

`hooks/decision-capture/dsh/` holds the DSH adapter for the decision capture concern. It exports `registerDecisionCapture`, which registers three handlers. One queues an answered `ask_user_question` call, one recovers a late reply to a timed question from the session feed, and one injects a save reminder when the agent goes idle.

The module declares `ERROR_POLICY = 'fail-open'`. The `repo-guards` plugin bundle imports this adapter from here.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `decision-capture.mjs` | `tools/result`, `session/event`, `agent/status` | Queues answers from `ask_user_question`, recovers `user-question-reply` messages whose source kind matches, and injects one notice at idle when `takeNudge` reports waiting answers. Records are tagged `source: 'hook'`. | Fails open. A throw is logged through `ctx.logger.warn`, and the tool result or turn continues unchanged. |

---

## 3. RELATED

- [`../`](../): the decision capture concern folder.
- [`../lib/capture-core.mjs`](../lib/capture-core.mjs): the queue core the adapter appends through.
- [`../bin/sweep-dsh.mjs`](../bin/sweep-dsh.mjs): the sweep that exports `dshAnswerRecords` and `recoveredRecords`.
- [`../tests/dsh-decision-capture.test.mjs`](../tests/dsh-decision-capture.test.mjs): the tests for this adapter.
