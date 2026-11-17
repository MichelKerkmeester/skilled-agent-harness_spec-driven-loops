---
title: "Devin Decision Capture: PostToolUse Adapter"
description: "Devin CLI PostToolUse adapter that queues each answered ask_user_question call under the same key the Devin sweep writes."
trigger_phrases:
  - "devin decision capture"
  - "devin ask_user_question capture"
  - "devin operator answer queue"
version: 1.0.0.0
---

# Devin Decision Capture: PostToolUse Adapter

---

## 1. OVERVIEW

`.skilled/hooks/decision-capture/devin/` holds the Devin adapter for the decision capture concern. It runs at `PostToolUse` on an answered `ask_user_question` call. It rebuilds that call as the step shape the Devin sweep reads and maps the shape with `devinAnswerRecords`. Then it appends the records to the queue. The session sees no output, so the tool result Devin already holds reaches the model unchanged.

Devin registers the adapter in `.devin/hooks.v1.json` under `PostToolUse`. The entry matches `^ask_user_question$`, allows 5 seconds and names no fallback. `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs` renders that entry from the `decision-capture` row in `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`. Claude keeps its own adapter for the same concern.

The adapter checks the switch before it reads any payload. `isHookEnabled('decision-capture')` returns false and the process exits at once. It then reads standard input and parses the JSON. A payload with another `tool_name` is dropped, and so is one with no `session_id` or `tool_use_id`. The queue goes under `payload.cwd` when that field holds a non-blank string, else under `DEVIN_PROJECT_DIR`, else under `process.cwd()`.

The concern key is `decision-capture`. Its switch is `SYSTEM_DECISION_CAPTURE_DISABLED`, and `SYSTEM_HOOKS_DISABLED` is the master switch, because `isHookEnabled` resolves through `.skilled/hooks/shared/hook-flags.cjs`.

Every failure exits 0 with no output. That covers a disabled switch, unparseable JSON, another tool name, a missing identifier and a queue write that throws. A bug here cannot change a completed tool result.

---

## 2. DIRECTORY TREE

```text
devin/
+-- README.md
+-- decision-capture-posttooluse.mjs
+-- decision-capture-posttooluse.test.mjs
`-- fixtures/
    `-- devin-posttooluse-ask-user-question.json
```

| File | Responsibility |
|---|---|
| `decision-capture-posttooluse.mjs` | The adapter. It checks the switch, parses the payload, rebuilds the step shape, maps it with `devinAnswerRecords` and appends the records with `source: 'hook'`. |
| `decision-capture-posttooluse.test.mjs` | The `node --test` suite. It spawns the adapter on the recorded payload and checks the queued record, its key, the deduplication order and the silent exits. |
| `fixtures/` | The recorded `ask_user_question` payload, with `pear` as the answer the suite replays. |

The adapter stamps each record `source: 'hook'` and the sweep stamps `source: 'transcript'`. The queue keeps the first line written for a key, so a question never queues twice. A response that does not carry the answered-questions envelope yields no record, so a refused call never reaches the queue.

---

## 3. VALIDATION

Run the command from the repository root.

```bash
node --test .skilled/hooks/decision-capture/devin/decision-capture-posttooluse.test.mjs
```

Expected result: every test passes and the command exits 0. The runner prints `fail 0`.

The suite builds its project folder under the system temp directory and removes it afterwards. It clears every `_DISABLED` variable it inherits, so a switch in your shell cannot decide a case.

---

## 4. RELATED

- [Decision capture folder](../README.md): the concern folder, with its queue and switches.
- [Devin sweep](../bin/sweep-devin.mjs): the save-time reader that exports `devinAnswerRecords`.
- [Capture core](../lib/capture-core.mjs): the queue core that appends and deduplicates records.
- [Hook flags resolver](../../shared/hook-flags.cjs): the shared switch resolver this adapter calls.
- [Hooks tree](../../README.md): the switch index and the coverage matrix.
