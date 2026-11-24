---
title: "Decision Capture: Operator Answer Queue for the Next Save"
description: "Queues question-tool answers for the next full-auto save through live adapters in Claude, Devin, DSH, OpenCode, Pi and Vibe and a save-time sweep in Codex."
trigger_phrases:
  - "decision capture"
  - "operator answer queue"
  - "decision capture hook"
  - "queued operator answers"
  - "answer queue for the next save"
importance_tier: "normal"
contextType: "reference"
---

# Decision Capture: Operator Answer Queue for the Next Save

---

## 1. OVERVIEW

`decision-capture/` queues answered question-tool calls for the next full-auto save. Live adapters write through `lib/capture-core.mjs`. The save command runs runtime-specific sweeps from `bin/` to recover answers from stored sessions.

The core keeps the queue under `.skilled/skills/.state/decision-capture` inside the project root. `lib/chat-questions.mjs` builds candidates from assistant questions followed by the operator's next prompt.

The concern key is `decision-capture`. Its switch is `SYSTEM_DECISION_CAPTURE_DISABLED`. `SYSTEM_HOOKS_DISABLED=1` is the master switch.

---

## 2. HOW IT WORKS

`normalizeAskUserQuestion` maps a tool payload to queue records when it has a question list and an answers object. It matches each answer by the exact question text. `isProcessQuestion` drops questions about how the session should run.

`appendRecords` ignores an empty batch. It locks the session queue, skips keys already queued or consumed and appends new records.

`pendingRecords` filters out consumed keys. `takeNudge` returns a count only when the pending count has risen since the last notice.

On Claude, the Stop hook runs at the end of every turn and records the session's queued tool answers itself when the transcript tail names exactly one spec folder that holds a `spec.md`. It writes them into that folder's `decision-record.md` and marks their keys consumed, so the nudge that follows stays quiet and no later save offers them again. Each entry starts `Recorded automatically:` and gives no reason, so a person edits the row to add one. When the writer creates the record and `spec.md` has no level marker, it adds one to `spec.md`. A tail with no folder or several, a child session, the concern switch or a failed write leaves the answers pending for the nudge. `SYSTEM_SESSION_LIFECYCLE_DISABLED=1` stops the Claude Stop hook itself, so it turns off both the automatic record and the nudge. Chat candidates always wait for a save.

The tail check cannot tell which packet an answer was about. A session that answers in one packet and then reads only another near the end files the answers under the second.

`chatCandidatesFromTurns` builds candidates from ordered turns and reports how many candidates it dropped.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `PostToolUse` on `AskUserQuestion` | `claude/decision-capture-posttooluse.mjs` | `.skilled/hooks/decision-capture/claude/decision-capture-posttooluse.mjs` | No output on success. A command failure can produce a hook-drift notice. |
| Codex | Save-time sweep | `bin/sweep-codex.mjs` | `.skilled/hooks/decision-capture/bin/sweep-codex.mjs` | Prints a JSON report when the sweep finds work. |
| Cursor | None | None | None | No adapter or sweep in this folder. |
| Devin | `PostToolUse` on `^ask_user_question$` | `devin/decision-capture-posttooluse.mjs` | `.skilled/hooks/decision-capture/devin/decision-capture-posttooluse.mjs` | Exits 0 with no output on capture errors. |
| OpenCode | `tool.execute.after` and `experimental.chat.system.transform` | `opencode/decision-capture.js` | `.opencode/plugins/decision-capture.js` | Adds a system-text reminder when `takeNudge` returns a positive count. |
| Pi | `tool_result` and `turn_end` | `pi/decision-capture.ts` | `.skilled/hooks/decision-capture/pi/decision-capture.ts` | Shows an info notice only with a UI and a positive pending count. |
| DSH | `tools/result` for the question tool | `dsh/decision-capture.mjs` | `.skilled/hooks/decision-capture/dsh/decision-capture.mjs` | Logs capture errors. Injects an idle notice when new answers wait. |
| Vibe | `post_tool` on `ask_user_question` | `vibe/decision-capture-post-tool.mjs` | `.skilled/hooks/decision-capture/vibe/decision-capture-post-tool.mjs` | Exits 0 with no output on success or capture errors. |

Claude and Devin use the `decision-capture` row in `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`. Both command records set a five-second timeout. The registry sets Claude's fallback to `envelope` and Devin's to `none`. Claude registers in `.claude/settings.json`. Devin registers in `.devin/hooks.v1.json`.

Codex's hook configuration file is `.codex/hooks.json`. It has no `decision-capture` entry. The save command runs `bin/sweep-codex.mjs` against rollout records. Cursor's hook configuration file is `.cursor/hooks.json`. This folder has no Cursor adapter or sweep.

OpenCode discovers JavaScript plugins from the flat `.opencode/plugins/` folder. Pi loads `.pi/extensions/decision-capture.ts`, which re-exports `pi/decision-capture.ts`. The DSH bundle entry `.dsh/plugins/repo-guards/index.mjs` imports the adapter through `.dsh/plugins/repo-guards/adapters/decision-capture.mjs`. Vibe registers `decision-capture-ask` in `.vibe/hooks.toml`.

The DSH adapter also listens to `session/event` for late replies and `agent/status` for idle reminders. It logs capture errors through the DSH context logger.

---

## 4. DIRECTORY TREE

```text
decision-capture/
+-- README.md
+-- bin/
+-- claude/
+-- devin/
+-- dsh/
+-- lib/
+-- opencode/
+-- pi/
+-- tests/
`-- vibe/
```

The `opencode/decision-capture.js` entry is a symlink to `.opencode/plugins/decision-capture.js`.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `lib/capture-core.mjs` | Normalizes records and manages the queue state. |
| `lib/chat-questions.mjs` | Builds candidates from assistant questions and later prompts. |
| `bin/sweep-codex.mjs` | Reads `request_user_input` results from Codex rollout records. |
| `.skilled/hooks/shared/hook-flags.cjs` | Resolves the concern switch and master switch. |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Stores registry bindings for this concern. |
| `.skilled/commands/speckit/save.md` | Runs runtime sweeps during save. |

---

## 6. CONFIGURATION

The concern runs by default. Set the concern switch to stop live adapter capture. The master switch turns off hooks that use the shared resolver.

| Switch | Concern key | Effect |
|---|---|---|
| `SYSTEM_DECISION_CAPTURE_DISABLED=1` | `decision-capture` | Stops live adapter capture and the Claude Stop hook's automatic record. |
| `SYSTEM_HOOKS_DISABLED=1` | Every concern | Master switch for hooks that use the shared resolver. |

Both switches accept `1`, `true`, `yes` or `on`, in any case. The resolver checks the environment before `.skilled/hooks/hook-flags.env`. Copy `.skilled/hooks/hook-flags.env.example` to that path to keep local switch values. The save command still runs sweeps on stored session data.

---

## 7. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/decision-capture/lib/chat-questions.test.mjs
```

Expected result: all chat-candidate tests pass and the command exits 0.

```bash
SYSTEM_DECISION_CAPTURE_DISABLED=1 node .skilled/hooks/decision-capture/claude/decision-capture-posttooluse.mjs < /dev/null
```

Expected result: no output and exit status 0.

---

## 8. RELATED

- [hooks index](../README.md): the runtime coverage matrix.
- [sweep guide](bin/README.md): how the runtime sweeps recover saved answers.
- [shared helpers](../shared/README.md): the switch resolver used by the adapters.
- [save command](../../commands/speckit/save.md): when the save workflow runs sweeps.
