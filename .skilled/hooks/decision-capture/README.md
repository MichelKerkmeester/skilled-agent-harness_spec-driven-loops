---
title: "Decision Capture: Operator Answer Queue for the Next Save"
description: "Queues each operator answer to a question tool so the next full-auto save can quote it. Live adapters and save-time sweeps feed one deduplicated queue."
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

`decision-capture/` queues each operator answer to a question tool. The next full-auto save reads that queue and quotes the operator's own wording. Answers are kept byte-exact, because a trimmed quote would change what they agreed to.

Two producers feed the queue: a live adapter and a save-time sweep. A runtime adapter sees the question tool's result as it happens. A transcript sweep in `bin/` recovers what the adapter missed, and `/speckit:save` runs the sweeps.

The core is `lib/capture-core.mjs`. It normalizes a payload, deduplicates by key and appends under a lock. `lib/chat-questions.mjs` handles questions asked in plain chat, where no tool result exists.

The queue lives under `.skilled/skills/.state/decision-capture` at the nearest Git root. A linked worktree shares its primary checkout's queue. The concern key is `decision-capture`. Its switch is `SYSTEM_DECISION_CAPTURE_DISABLED`, and `SYSTEM_HOOKS_DISABLED=1` is the master switch.

---

## 2. HOW IT WORKS

A tool result becomes a record only when it carries both questions and answers. `normalizeAskUserQuestion` reads the question text, the header and the option labels. It looks the answer up by the exact question text, so there is no loose matching.

`isProcessQuestion` drops a question about how the session itself should run. The offered choices are the strongest signal. A scope menu or a worktree choice marks the question as process. A commit or push option counts only when the question also mentions shipping.

`appendRecords` returns counts instead of throwing. An empty batch touches nothing, so a turn with no answer creates no state. A repeated key is skipped, which makes a sweep safe to run on every save.

An append reads the existing keys and then writes the new ones. Two producers racing on one session would otherwise both see the same key as new. `mkdir` is the atomic test-and-set, so there is no window between the check and the acquisition.

A holder that dies mid-append never removes its lock. The next writer reclaims a lock older than two minutes. A wait that passes ten seconds throws `decision-capture: timed out waiting for the queue lock`.

`readQueue` reads the project folder and the older folder above it, then drops a duplicate key. `pendingRecords` removes every key that `consumed.jsonl` already holds. `takeNudge` returns the waiting count only when it has risen since the last report, so a session does not repeat the reminder on every turn.

`chat-questions.mjs` pairs an assistant question with the next typed prompt. `answerEvidence` describes how the reply relates to the question, and it never accepts or rejects a candidate. `chatCandidatesFromTurns` keeps at most three candidates per message and twenty per sweep, and it reports what it cut.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry in this folder | Real file | What the runtime shows |
|---|---|---|---|---|
| Claude | `PostToolUse` on `AskUserQuestion` | `claude/decision-capture-posttooluse.mjs` | `.skilled/hooks/decision-capture/claude/decision-capture-posttooluse.mjs` | Nothing, unless the adapter cannot load, in which case Claude gets a hook-drift notice. |
| Devin | `PostToolUse` on `^ask_user_question$` | `devin/decision-capture-posttooluse.mjs` | `.skilled/hooks/decision-capture/devin/decision-capture-posttooluse.mjs` | Nothing. It exits 0 with no output. |
| Pi | `tool_result` and `turn_end` | `pi/decision-capture.ts` | `.skilled/hooks/decision-capture/pi/decision-capture.ts` | One info notice at turn end. |
| DSH | `tools/result`, `session/event` and `agent/status` | `dsh/decision-capture.mjs` | `.skilled/hooks/decision-capture/dsh/decision-capture.mjs` | One injected notice at idle. |
| Vibe | `post_tool` on `ask_user_question` | `vibe/decision-capture-post-tool.mjs` | `.skilled/hooks/decision-capture/vibe/decision-capture-post-tool.mjs` | Nothing. It exits 0 with no output. |
| OpenCode | `tool.execute.after` and `experimental.chat.system.transform` | `opencode/decision-capture.js` | `.opencode/plugins/decision-capture.js` | One system-text line naming the pending count and `/speckit:save --full-auto`. |
| Codex | None | None | `bin/sweep-codex.mjs` | Nothing live. The sweep prints a JSON report. |
| Cursor | None | None | None | Nothing. No adapter and no sweep. |

Claude and Devin register the hook in `hook-registry.json` under the id `decision-capture`, each with a 5-second timeout. Claude's entry carries a fallback, so a load failure becomes a hook-drift notice. Devin's entry has no fallback. Pi loads `pi/decision-capture.ts` through `.pi/extensions/decision-capture.ts`, which re-exports it. DSH loads `dsh/decision-capture.mjs` through a link at `.dsh/plugins/repo-guards/adapters/decision-capture.mjs`. Vibe names the hook `decision-capture-ask` in `.vibe/hooks.toml`. OpenCode loads `.opencode/plugins/decision-capture.js` from its plugin folder, through `dualPlugin`.

Each adapter fails open in its own way. Claude, Devin and Vibe exit 0 with no output on a disabled switch, a bad payload, a missing field or a queue failure. Pi swallows every error and returns undefined. DSH catches each handler's error and writes one warning through `ctx.logger.warn`. The OpenCode plugin swallows every error, so neither the tool result nor the model turn depends on capture.

Pi shows the reminder at `turn_end`, but only when the session has a UI. DSH injects it when the agent goes idle. OpenCode adds one system-text line on `experimental.chat.system.transform`, naming the pending count and `/speckit:save --full-auto`. All three name the count and point at `/speckit:save` with `--full-auto`.

Codex has no adapter here. Its answers arrive only through `bin/sweep-codex.mjs` at save time. Cursor has neither an adapter nor a sweep. The root `.skilled/hooks/README.md` matrix marks OpenCode covered for `decision-capture`.

---

## 4. DIRECTORY TREE

```text
decision-capture/
+-- README.md
+-- bin/       the save-time sweeps, their suites and fixtures/
+-- claude/    decision-capture-posttooluse.mjs, its test and fixtures/
+-- devin/     decision-capture-posttooluse.mjs, its test and fixtures/
+-- dsh/       decision-capture.mjs
+-- lib/       capture-core.mjs, chat-questions.mjs and their tests
+-- opencode/  decision-capture.js, a link to the plugin in .opencode/plugins/
+-- pi/        decision-capture.ts and its test
+-- tests/     dsh-decision-capture.test.mjs
`-- vibe/      decision-capture-post-tool.mjs and its test
```

Each runtime subfolder holds its adapter and a README: `claude/README.md`, `devin/README.md`, `dsh/README.md`, `pi/README.md` and `vibe/README.md`.

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `lib/capture-core.mjs` | The queue core. It normalizes a payload, builds the source keys, deduplicates, appends under a lock and reports the pending count. |
| `lib/chat-questions.mjs` | Pairs a chat question with the next typed prompt and describes the evidence. |
| `bin/sweep-transcript.mjs` | The Claude sweep. It replays a transcript and lists chat candidates. |
| `bin/sweep-codex.mjs` | The Codex sweep. It reads a rollout record. |
| `bin/sweep-devin.mjs` | The Devin sweep and the record mapper the Devin adapter imports. |
| `bin/sweep-dsh.mjs` | The DSH sweep and the record mapper the DSH adapter imports. |
| `bin/sweep-opencode.mjs` | The OpenCode sweep. It reads the SQLite store and exports `openCodeAnswerRecords`, which the plugin imports. |
| `bin/sweep-pi.mjs` | The Pi sweep and the record mapper the Pi adapter imports. |
| `bin/sweep-vibe.mjs` | The Vibe sweep and the record mapper the Vibe adapter imports. |
| `claude/decision-capture-posttooluse.mjs` | The Claude adapter. |
| `devin/decision-capture-posttooluse.mjs` | The Devin adapter. |
| `dsh/decision-capture.mjs` | The DSH adapter. |
| `pi/decision-capture.ts` | The Pi extension. |
| `vibe/decision-capture-post-tool.mjs` | The Vibe adapter. |
| `.opencode/plugins/decision-capture.js` | The OpenCode plugin. It queues each answered `question` call and adds the pending-count line to the system text. |
| `.skilled/hooks/shared/hook-flags.cjs` | The switch resolver every adapter calls. |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Holds the `decision-capture` entry for Claude and Devin. |
| `.skilled/commands/speckit/save.md` | The save command that runs the sweeps. |

---

## 6. CONFIGURATION

The concern is on by default. A switch is on when its value is `1`, `true`, `yes` or `on`, in any case.

| Switch | Concern key | Effect |
|---|---|---|
| `SYSTEM_DECISION_CAPTURE_DISABLED=1` | `decision-capture` | Every adapter returns at once and queues nothing. |
| `SYSTEM_HOOKS_DISABLED=1` | Every concern | Turns off this concern along with every other repository hook. |

The save-time sweeps ignore the switch and still append what they recover.

Set a switch inline for one command or export it for a session. To keep it, write it in `.skilled/hooks/hook-flags.env`, a gitignored copy of `.skilled/hooks/hook-flags.env.example`. The environment wins over the file.

A sweep reads the calling session when its runtime names it: Claude Code, Codex, DSH, OpenCode and Pi set a session variable in every command they run. Devin and Vibe set none, so their sweeps look for the session lock held by a process the sweep descends from, and take the newest session for the project only when no lock matches. A flag reads one named record instead.

| Flag | Sweep | Effect |
|---|---|---|
| `--transcript <file>` | `bin/sweep-transcript.mjs`, `bin/sweep-codex.mjs`, `bin/sweep-devin.mjs`, `bin/sweep-pi.mjs` | Reads that transcript file. |
| `--session <file>` | `bin/sweep-dsh.mjs` | Reads that session file. |
| `--session <dir>` | `bin/sweep-vibe.mjs` | Reads that session directory. |
| `--db <file>` | `bin/sweep-opencode.mjs` | Reads that SQLite database. |
| `--session <id>` | `bin/sweep-opencode.mjs` | Reads that session id. |

Codex, DSH, Pi and Vibe print nothing and exit 0 when they find no session. Claude, Devin and OpenCode print an error object and exit 1.

---

## 7. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/decision-capture/lib/capture-core.test.mjs
```

Expected result: `pass` lines and `fail 0`.

```bash
node .skilled/hooks/decision-capture/bin/sweep-transcript.mjs --transcript .skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.jsonl; echo "exit: $?"
```

Expected result: a JSON report with `pending` and `chat_candidates`, then `exit: 0`. A missing transcript prints `no transcript found` and exits 1. On a read failure it prints an `error` object and `exit: 1`.

```bash
SYSTEM_DECISION_CAPTURE_DISABLED=1 node .skilled/hooks/decision-capture/claude/decision-capture-posttooluse.mjs; echo "exit: $?"
```

Expected result: `exit: 0` and no other output.

---

## 8. RELATED

- [`../README.md`](../README.md): the hooks tree, with the switch index and the coverage matrix.
- [`../shared/README.md`](../shared/README.md): the switch resolver every adapter calls.
- [`lib/README.md`](lib/README.md): the queue core and the chat detector.
- [`bin/README.md`](bin/README.md): the save-time sweeps.
- [`tests/README.md`](tests/README.md): the DSH adapter suite.
- [`../../commands/speckit/save.md`](../../commands/speckit/save.md): the save command that runs the sweeps.
