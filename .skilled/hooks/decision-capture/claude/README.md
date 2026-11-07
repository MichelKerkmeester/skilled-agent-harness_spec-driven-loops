---
title: "Claude Decision Capture: AskUserQuestion PostToolUse Adapter"
description: "Claude Code PostToolUse adapter that queues each answered AskUserQuestion call so a later full-auto save can quote the operator's exact wording."
trigger_phrases:
  - "claude decision capture"
  - "askuserquestion capture"
  - "operator answer queue"
version: 1.0.0.0
---

# Claude Decision Capture: AskUserQuestion PostToolUse Adapter

---

## 1. OVERVIEW

`hooks/decision-capture/claude/` holds the Claude Code adapter for the decision capture concern. The adapter runs at `PostToolUse` for `AskUserQuestion`. It normalizes the answered call into the shared queue so a later full-auto save can quote the exchange instead of reconstructing it. It prints nothing, so the tool result Claude already has reaches the model unchanged.

The unified tree at `../../README.md` covers the shared hooks conventions.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `ask-capture-posttooluse.mjs` | `PostToolUse` for `AskUserQuestion` | Checks the kill switch, parses the payload, calls `normalizeAskUserQuestion` and `appendRecords` to queue the answer. It writes no output. | Fails open. A missing payload, a parse error, a disabled switch or a queue write failure exits 0 with no output. |
| `ask-capture-posttooluse.test.mjs` | `node --test` suite | Spawns the adapter on the recorded payload under `fixtures/` and reads what it leaves on disk. | Not applicable. The suite removes its own temporary directories. |

The `fixtures/` folder holds the recorded `AskUserQuestion` payload the test replays.

---

## 3. RELATED

- [`../`](../): the decision capture concern folder.
- [`../lib/capture-core.mjs`](../lib/capture-core.mjs): the shared queue core this adapter calls.
- [`../bin/README.md`](../bin/README.md): the Claude transcript sweep that recovers what this adapter missed.
