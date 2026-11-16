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

`.skilled/hooks/decision-capture/devin/` holds the Devin CLI adapter for the decision capture concern. The adapter runs at `PostToolUse` for `ask_user_question`. It rebuilds the answered call as the step shape the Devin sweep reads. Then it maps that shape with `devinAnswerRecords` and appends the records to the queue. It writes no output, so the tool result Devin already has reaches the model unchanged.

Devin loads the hook from `.devin/hooks.v1.json`. `sync-hook-registrations.cjs` renders that file out of `hook-registry.json`. The entry matches `^ask_user_question$`, allows 5 seconds and names no fallback.

The adapter checks the switch before it reads any payload. `SYSTEM_DECISION_CAPTURE_DISABLED=1` turns the concern off. The project folder is `payload.cwd` when that field holds a non-blank string. Otherwise the adapter reads `DEVIN_PROJECT_DIR` and falls back to `process.cwd()`.

Every failure exits 0 with no output. That covers a disabled switch, unparseable JSON, another tool name, a missing `session_id` or `tool_use_id` and a queue write that throws. A bug here can never change a completed tool result.

---

## 2. DIRECTORY TREE

```text
devin/
+-- README.md
+-- decision-capture-posttooluse.mjs       # The adapter
+-- decision-capture-posttooluse.test.mjs  # The node --test suite
`-- fixtures/                              # The recorded ask_user_question payload
```

| File | Responsibility |
|---|---|
| `decision-capture-posttooluse.mjs` | The adapter. It checks the switch, parses the payload, rebuilds the step shape, maps it with `devinAnswerRecords` and appends the records with `source: 'hook'`. |
| `decision-capture-posttooluse.test.mjs` | The `node --test` suite. It spawns the adapter on the recorded payload and checks the queued record, its deduplication key and the silent exits. |
| `fixtures/` | The recorded `ask_user_question` payload the test replays. |

The adapter stamps each record `source: 'hook'` and the sweep stamps `source: 'transcript'`. The queue keeps the first line written for a key, so a question never queues twice.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/decision-capture/devin/decision-capture-posttooluse.test.mjs
```

Expected result: every case passes and the process exits 0.

The suite builds its project folder under the system temp directory and removes it afterwards. Each case drops every `_DISABLED` variable it inherits, so a switch in your shell cannot decide a case.

---

## 4. RELATED

- [`../README.md`](../README.md): the decision capture concern at `../`, with its queue and switches.
- [`../../README.md`](../../README.md): the hooks tree, with the switch index and the coverage matrix.
- [`../bin/sweep-devin.mjs`](../bin/sweep-devin.mjs): the Devin sweep that exports the record mapper this adapter reuses.
- [`../bin/README.md`](../bin/README.md): the save-time sweeps and their behavior.
- [`../lib/capture-core.mjs`](../lib/capture-core.mjs): the queue core that appends and deduplicates the records.
