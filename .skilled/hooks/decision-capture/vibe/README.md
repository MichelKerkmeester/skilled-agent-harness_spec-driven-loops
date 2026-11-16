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

`vibe/` holds the Vibe adapter for the decision capture concern. The adapter runs at `post_tool` for `ask_user_question`. Vibe registers it in `.vibe/hooks.toml` as `decision-capture-ask`, with the match `ask_user_question`.

The adapter reuses `vibeAnswerRecords` and `isQuestionTool` from the Vibe sweep. The live path and the save-time sweep therefore write the same key. A repeated key is skipped, so one answer never queues twice.

The adapter accepts the bare tool name and any group-qualified spelling of it. The runtime gives a provided tool its group prefix, as in `ui.ask_user_question`. A payload or a configured match may name the tool either way. The match in `.vibe/hooks.toml` names the bare tool and that spelling still works. A match on one spelling alone would capture nothing at all.

Every failure exits 0 with no output. A disabled switch, an unreadable payload and a missing id all take that path. A queue write failure leaves the tool result unchanged.

The unified tree at `../../README.md` covers the shared hooks conventions.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `decision-capture-post-tool.mjs` | The adapter. It maps an answered question into queue records and appends them. |
| `decision-capture-post-tool.test.mjs` | The `node --test` suite. It runs the adapter as a child process and checks what it leaves on disk. |

The adapter reads `tool_input.questions` and the `tool_output` answer object. It maps them with `vibeAnswerRecords` under `tool_call_id` and appends the records to the queue. It writes no output. The queue belongs to the directory the payload names in `cwd`. An empty field falls back to the working directory.

The suite runs the adapter on the recorded payload shape and on a payload for another tool. It also covers a group-qualified tool name and malformed input. It then checks the queued record and its deduplication key. Each case runs in its own temporary project directory, which the suite removes.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/decision-capture/vibe/decision-capture-post-tool.test.mjs
```

Expected result: `pass` lines and `fail 0`.

```bash
SYSTEM_DECISION_CAPTURE_DISABLED=1 node .skilled/hooks/decision-capture/vibe/decision-capture-post-tool.mjs; echo "exit: $?"
```

Expected result: `exit: 0` and no other output.

---

## 4. RELATED

- [`../README.md`](../README.md): the decision capture concern folder.
- [`../bin/sweep-vibe.mjs`](../bin/sweep-vibe.mjs): the sweep that exports the answer mapper this adapter reuses.
- [`../bin/README.md`](../bin/README.md): the save-time sweeps and their behavior.
- [`../../README.md`](../../README.md): the hooks tree, with the switch index and the coverage matrix.
