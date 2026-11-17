---
title: "Claude Decision Capture: PostToolUse Adapter"
description: "Claude Code PostToolUse adapter that queues each answered AskUserQuestion call so a later full-auto save can quote the operator's exact wording."
trigger_phrases:
  - "claude decision capture"
  - "askuserquestion capture"
  - "operator answer queue"
version: 1.0.0.0
---

# Claude Decision Capture: PostToolUse Adapter

---

## 1. OVERVIEW

`.skilled/hooks/decision-capture/claude/` holds the Claude Code adapter for the decision capture concern. It runs at `PostToolUse` on an answered `AskUserQuestion` call and appends the exchange to the shared queue. A later full-auto save can then quote the operator's own wording. It prints nothing, so the tool result Claude already holds reaches the model unchanged.

Claude registers the adapter in `.claude/settings.json` under the `PostToolUse` event, with the matcher `AskUserQuestion`. The command changes into `${CLAUDE_PROJECT_DIR:-$PWD}` and exits 0 when `.skilled/hooks` is absent. It allows 5 seconds. If the adapter file is missing or node fails, the fallback prints a drift line on stderr and a `hookSpecificOutput` envelope that tells Claude to rebuild the runtime. No other runtime registers this file.

The adapter checks the concern switch first, then reads the hook payload from stdin. It returns at once when the payload names another tool, or when it finds no project directory, checking `CLAUDE_PROJECT_DIR` before the payload `cwd`. `normalizeAskUserQuestion` maps the answers to queue records and `appendRecords` appends them under a lock. Both live in `.skilled/hooks/decision-capture/lib/capture-core.mjs`.

The concern key is `decision-capture`. Its switch is `SYSTEM_DECISION_CAPTURE_DISABLED`, and `SYSTEM_HOOKS_DISABLED` is the master switch. Every failure ends the same way: exit 0 with no output on either stream.

---

## 2. DIRECTORY TREE

```text
claude/
+-- README.md
+-- decision-capture-posttooluse.mjs
+-- decision-capture-posttooluse.test.mjs
`-- fixtures/
    `-- claude-posttooluse-askuserquestion.json
```

| File | Responsibility |
|---|---|
| `decision-capture-posttooluse.mjs` | The adapter. It checks the switch, reads the payload, normalizes the answer and appends the records. |
| `decision-capture-posttooluse.test.mjs` | The `node --test` suite. It spawns the adapter on the recorded payload and reads what the run leaves on disk. |
| `fixtures/` | Holds `claude-posttooluse-askuserquestion.json`, the recorded `AskUserQuestion` payload the suite replays. |

The folder holds one adapter and its test. It has no symlink.

---

## 3. VALIDATION

Run the command from the repository root.

```bash
node --test .skilled/hooks/decision-capture/claude/decision-capture-posttooluse.test.mjs
```

Expected result: every test passes, the run reports `fail 0` and the command exits 0.

---

## 4. RELATED

- [the decision capture folder](../README.md): the concern README, with the core and the runtime coverage.
- [the shared queue core](../lib/capture-core.mjs): the module this adapter imports for normalization and append.
- [the switch resolver](../../shared/README.md): the shared helpers every adapter calls.
- [the hooks tree](../../README.md): the switch index and the coverage matrix.
- [the save-time sweeps](../bin/README.md): how the save command recovers answers from stored sessions.
