---
title: "Vibe Decision Capture: ask_user_question Post-Tool Adapter"
description: "Vibe post_tool adapter that queues each answered ask_user_question call under the same key the Vibe sweep writes."
trigger_phrases:
  - "vibe decision capture"
  - "vibe ask_user_question capture"
  - "vibe operator answer queue"
version: 1.0.0.0
---

# Vibe Decision Capture: ask_user_question Post-Tool Adapter

---

## 1. OVERVIEW

`hooks/decision-capture/vibe/` holds the Vibe adapter for the decision capture concern. The adapter runs at `post_tool` for `ask_user_question`. It reuses `vibeAnswerRecords` and `isQuestionTool` from the Vibe sweep, so the live path and the save-time sweep write the same key and a question never queues twice. Every failure exits 0 with no output.

The adapter accepts the bare tool name and any group-qualified spelling of it, because the runtime gives a provided tool its group prefix (`ui.ask_user_question`) while a payload or a configured match may name it either way. A match on one spelling alone would capture nothing at all.

The unified tree at `../../README.md` covers the shared hooks conventions.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `decision-capture-post-tool.mjs` | `post_tool` for `ask_user_question` | Reads `tool_input.questions` and the `tool_output` answer object, maps them with `vibeAnswerRecords` under `tool_call_id` and appends the records to the queue. It writes no output. | Fails open. Every failure exits 0 and leaves the tool result unchanged. |
| `decision-capture-post-tool.test.mjs` | `node --test` suite | Runs the adapter on the recorded payload shape, on a payload for another tool, on a group-qualified tool name and on malformed input, then checks the queued record and its deduplication key. | Not applicable. The suite removes its own temporary directories. |

---

## 3. RELATED

- [`../`](../): the decision capture concern folder.
- [`../bin/sweep-vibe.mjs`](../bin/sweep-vibe.mjs): the sweep that exports the answer mapper this adapter reuses.
- [`../bin/README.md`](../bin/README.md): the save-time sweeps and their behavior.
