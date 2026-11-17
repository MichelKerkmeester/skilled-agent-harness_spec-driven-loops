---
title: "Vibe Decision Capture: Post-Tool Adapter"
description: "Vibe post_tool adapter that queues each answered ask_user_question call under the same key the Vibe sweep writes."
trigger_phrases:
  - "vibe decision capture"
  - "vibe ask_user_question capture"
  - "vibe operator answer queue"
version: 1.0.0.0
---

# Vibe Decision Capture: Post-Tool Adapter

---

## 1. OVERVIEW

`.skilled/hooks/decision-capture/vibe/` holds the Vibe adapter for the decision capture concern. It runs at `post_tool` on an answered `ask_user_question` call and appends the exchange to the shared queue. The session sees no output, so the tool result the model already holds reaches the model unchanged.

Vibe registers the adapter in `.vibe/hooks.toml` as `decision-capture-ask`, with `type = "post_tool"` and `match = "ask_user_question"`. The entry sets no timeout. No other runtime registers this file.

The adapter checks the concern switch before it reads any payload. `isHookEnabled('decision-capture')` returns false and the process exits at once. Otherwise it reads the JSON payload from standard input. A payload that names another tool returns at once, and so does one with no `session_id` or `tool_call_id`.

The answer mapper is `vibeAnswerRecords`, which `.skilled/hooks/decision-capture/bin/sweep-vibe.mjs` exports. The adapter calls it with `source: 'hook'`, so the live hook and a later save write one key for one answer. `appendRecords` from `.skilled/hooks/decision-capture/lib/capture-core.mjs` skips a key already queued or consumed, so an answer never queues twice.

The queue goes under the directory the payload names in `cwd`. A relative path resolves against the checkout root, and a blank field falls back to that root.

The concern key is `decision-capture`. Its switch is `SYSTEM_DECISION_CAPTURE_DISABLED`, and `SYSTEM_HOOKS_DISABLED` is the master switch, because `isHookEnabled` resolves through `.skilled/hooks/shared/hook-flags.cjs`.

Every failure exits 0 with no output. A disabled switch, unparseable JSON, another tool name, a missing identifier and a queue write that throws all end that way.

---

## 2. DIRECTORY TREE

```text
vibe/
+-- README.md
+-- decision-capture-post-tool.mjs
`-- decision-capture-post-tool.test.mjs
```

| File | Responsibility |
|---|---|
| `decision-capture-post-tool.mjs` | The adapter. It checks the switch, reads the payload, maps the answer with `vibeAnswerRecords` and appends the records. |
| `decision-capture-post-tool.test.mjs` | The `node --test` suite. It spawns the adapter on recorded payloads and reads what the run leaves on disk. |

The folder holds one adapter and its test. It has no symlink.

---

## 3. VALIDATION

Run the command from the repository root.

```bash
node --test .skilled/hooks/decision-capture/vibe/decision-capture-post-tool.test.mjs
```

Expected result: every test passes and the command exits 0. The runner prints `fail 0`.

The suite covers the measured payload, a payload for another tool, a group-qualified tool name and malformed input. Each case builds its project folder under the system temp directory and removes it afterwards. The suite deletes the two master switch names and `SYSTEM_DECISION_CAPTURE_DISABLED` from the environment it passes to the adapter. An `MK_DECISION_CAPTURE_DISABLED` exported in your shell still reaches the adapter and turns it off.

---

## 4. RELATED

- [the decision capture folder](../README.md): the concern README, with the queue, the core and the runtime coverage.
- [the Vibe sweep](../bin/sweep-vibe.mjs): the save-time reader that exports the answer mapper this adapter reuses.
- [the shared queue core](../lib/capture-core.mjs): the module that appends and deduplicates records.
- [the switch resolver](../../shared/hook-flags.cjs): the shared resolver this adapter calls.
- [the hooks tree](../../README.md): the switch index and the coverage matrix.
- [the Vibe registration](../../../../.vibe/hooks.toml): the `post_tool` entry that loads this adapter.
