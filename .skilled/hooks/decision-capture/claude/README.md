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

`.skilled/hooks/decision-capture/claude/` holds the Claude Code adapter for the decision capture concern. It runs at `PostToolUse` for `AskUserQuestion` and normalizes the answered call into the shared queue. A later full-auto save can then quote the exchange instead of reconstructing it. It prints nothing, so the tool result Claude already has reaches the model unchanged.

Claude registers the adapter in `.claude/settings.json` at `PostToolUse` with the matcher `AskUserQuestion`. The entry allows 5 seconds and carries a drift fallback. The registry mirror holds the same entry under the id `decision-capture`. No other runtime registers this file, so Devin and Pi keep their own adapters.

The adapter reads `CLAUDE_PROJECT_DIR` first, then the payload `cwd`. With neither set, it exits 0 and writes nothing. It acts only when `tool_name` is `AskUserQuestion`, so any other tool name returns at once. `normalizeAskUserQuestion` drops a process question, so a scope menu never reaches the queue. `appendRecords` deduplicates by key and appends under a lock.

The concern switch is `SYSTEM_DECISION_CAPTURE_DISABLED`, which turns the adapter off at once. `SYSTEM_HOOKS_DISABLED` is the master switch for every concern. Every failure exits 0 with no output. A missing payload, a parse error, a disabled switch or a queue write failure all end the same way.

---

## 2. DIRECTORY TREE

```text
claude/
+-- README.md
+-- decision-capture-posttooluse.mjs
+-- decision-capture-posttooluse.test.mjs
`-- fixtures/   claude-posttooluse-askuserquestion.json
```

| File | Responsibility |
|---|---|
| `decision-capture-posttooluse.mjs` | The adapter. It checks the switch, parses the payload and appends the normalized answer. |
| `decision-capture-posttooluse.test.mjs` | The `node --test` suite. It spawns the adapter on the recorded payload. |
| `fixtures/` | The recorded `AskUserQuestion` payload the suite replays. |

The suite reads what the adapter leaves on disk and removes its own temporary directories.

---

## 3. VALIDATION

Run the command from the repository root.

```bash
node --test .skilled/hooks/decision-capture/claude/decision-capture-posttooluse.test.mjs
```

Expected result: both cases pass. The first asserts exit 0, empty stdout and an untouched folder. The second asserts queue lines land under the payload `cwd`.

---

## 4. RELATED

- [`../README.md`](../README.md): the decision capture concern folder.
- [`../lib/capture-core.mjs`](../lib/capture-core.mjs): the shared queue core this adapter calls.
- [`../bin/README.md`](../bin/README.md): the save-time sweeps, including the Claude transcript sweep.
- [`../../README.md`](../../README.md): the hooks tree, with the switch index and the coverage matrix.
