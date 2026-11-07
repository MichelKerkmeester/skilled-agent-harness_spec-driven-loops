---
title: "Devin Decision Capture: ask_user_question PostToolUse Adapter"
description: "Devin CLI PostToolUse adapter that queues each answered ask_user_question call under the same key the Devin sweep writes."
trigger_phrases:
  - "devin decision capture"
  - "devin ask_user_question capture"
  - "devin operator answer queue"
version: 1.0.0.0
---

# Devin Decision Capture: ask_user_question PostToolUse Adapter

---

## 1. OVERVIEW

`hooks/decision-capture/devin/` holds the Devin CLI adapter for the decision capture concern. The adapter runs at `PostToolUse` for `ask_user_question`. It reuses `devinAnswerRecords` from the Devin sweep, so the live path and the save-time sweep write the same key and a question never queues twice. Every failure exits 0 with no output.

The unified tree at `../../README.md` covers the shared hooks conventions.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `ask-capture-posttooluse.mjs` | `PostToolUse` for `ask_user_question` | Rebuilds the question and answer as the step shape the Devin sweep reads, maps it with `devinAnswerRecords` and appends the records to the queue. It writes no output. | Fails open. Every failure exits 0 and leaves the tool result unchanged. |
| `ask-capture-posttooluse.test.mjs` | `node --test` suite | Runs the adapter on the recorded payload under `fixtures/` and checks the queued record and its deduplication key. | Not applicable. The suite removes its own temporary directories. |

The `fixtures/` folder holds the recorded `ask_user_question` payload the test replays.

---

## 3. RELATED

- [`../`](../): the decision capture concern folder.
- [`../bin/sweep-devin.mjs`](../bin/sweep-devin.mjs): the sweep that exports the record mapper this adapter reuses.
- [`../bin/README.md`](../bin/README.md): the save-time sweeps and their behavior.
