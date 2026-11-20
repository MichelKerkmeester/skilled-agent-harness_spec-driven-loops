---
title: "Decision Capture Sweeps: Save-Time Answer Recovery"
description: "Per-runtime sweeps that replay a session record at save time and append every answered question the live adapter missed to the decision queue."
trigger_phrases:
  - "decision capture sweep"
  - "session decision sweep"
  - "answered question recovery"
version: 1.0.0.0
---

# Decision Capture Sweeps: Save-Time Answer Recovery

---

## 1. OVERVIEW

`bin/` holds the save-time answer sweeps for the decision capture concern. A live adapter sees a question only while its hook is registered. Each sweep replays a runtime's stored session and appends the answers that hook missed. The queue core deduplicates by key, so a key an earlier producer wrote is skipped. A sweep can run on every save.

One file covers each runtime that has a sweep: Claude, Codex, Devin, DSH, OpenCode, Pi and Vibe. Cursor has no sweep. `/speckit:save` runs the file that matches the runtime it saves on.

The Devin, DSH, Pi, Vibe and OpenCode sweeps are also modules. Their live adapters import the record mappers from these files, so the live path and the swept path build a record with the same mapper.

---

## 2. ARCHITECTURE

Two producers write one queue. A live adapter maps its runtime's tool result to a record and calls `appendRecords`. A sweep does the same from stored session data. `../lib/capture-core.mjs` owns the record shape and the key. It also writes the queue file.

```text
╭──────────────────────────────────────────────────────────────────╮
│                    decision-capture/bin/                         │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────────┐      ┌────────────────────┐      ┌──────────────────────┐
│ Live adapter     │ ───▶ │ capture-core.mjs   │ ───▶ │ Session queue        │
│ runtime hook     │      │ appendRecords      │      │ one file per session │
└──────────────────┘      └─────────▲──────────┘      └──────────────────────┘
                                    │
┌──────────────────┐                │
│ Sweep CLI        │ ───────────────┘
│ bin/sweep-*.mjs  │
└──────────────────┘

Write path: live adapter ───▶ capture-core ◀─── sweep
```

A chat candidate pairs an assistant question with the next typed prompt, and the save step decides whether it becomes a decision record. Every sweep lists chat candidates except Vibe's, which reports recovered answers and pending records only.

---

## 3. DIRECTORY TREE

```text
bin/
+-- README.md
+-- fixtures/                       # Recorded runtime payloads the suites replay
+-- runtime-refusal.test.mjs        # Coverage-row check for the hooks tree README
+-- sweep-codex.mjs                 # Codex rollout sweep
+-- sweep-devin.mjs                 # Devin transcript sweep
+-- sweep-dsh.mjs                   # DSH session log sweep
+-- sweep-opencode.mjs              # OpenCode database sweep
+-- sweep-pi.mjs                    # Pi session file sweep
+-- sweep-transcript.mjs            # Claude transcript sweep
+-- sweep-vibe.mjs                  # Vibe journal sweep
`-- sweep-<runtime>.test.mjs        # The node --test suite for each sweep
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `fixtures/` | Recorded runtime payloads the Codex, Devin, OpenCode, Pi and Claude suites replay. |
| `runtime-refusal.test.mjs` | Reads the hooks tree README and checks its `decision-capture` coverage row. |
| `sweep-codex.mjs` | Appends answered `request_user_input` calls from a Codex rollout and lists chat candidates. |
| `sweep-codex.test.mjs` | Suite for the Codex sweep. |
| `sweep-devin.mjs` | Appends answered `ask_user_question` calls from a Devin transcript, or from the `message_nodes` store when the transcript file does not exist yet. |
| `sweep-devin.test.mjs` | Suite for the Devin sweep. |
| `sweep-dsh.mjs` | Appends answers from a DSH session log, including a late reply to a timed question. |
| `sweep-dsh.test.mjs` | Suite for the DSH sweep. |
| `sweep-opencode.mjs` | Appends completed `question` parts from OpenCode's SQLite store. |
| `sweep-opencode.test.mjs` | Suite for the OpenCode sweep. |
| `sweep-pi.mjs` | Appends answers from a Pi session file for `ask_user_question` and `question`. |
| `sweep-pi.test.mjs` | Suite for the Pi sweep. |
| `sweep-transcript.mjs` | Appends answered `AskUserQuestion` calls from a Claude transcript and lists chat candidates. |
| `sweep-transcript.test.mjs` | Suite for the Claude sweep. |
| `sweep-vibe.mjs` | Appends answered `ask_user_question` calls from a Vibe session journal. |
| `sweep-vibe.test.mjs` | Suite for the Vibe sweep. |

`runtime-refusal.test.mjs` looks for the row under the coverage matrix header in `../../README.md`. It wants one cell per runtime, each marked `✓ covered` or carrying a state such as `by-design: <reason>`. A bare `n/a` fails, and so does an empty reason or a state outside the accepted prefixes. The row may hold no `n/a` cell at all, because no runtime is expected to lack a surface.

Each other suite runs under `node --test` and builds its session in a temp folder.

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Every sweep imports `appendRecords` from `../lib/capture-core.mjs`. The chat-capable sweeps also import `chatCandidatesFromTurns` from `../lib/chat-questions.mjs`. `sweep-vibe.mjs` reads journals through `../../shared/session-readers/vibe.mjs`. |
| Exports | `devinAnswerRecords`, `dshAnswerRecords`, `QUESTION_TOOL` and `recoveredRecords` from `sweep-dsh.mjs`, `recoveredRecords` and `QUESTION_TOOLS` from `sweep-pi.mjs`, `vibeAnswerRecords` with `isQuestionTool` and `openCodeAnswerRecords`. Each sweep also exports its `sweep*` entry. |
| Writes | Only `appendRecords` writes. The Devin and OpenCode stores are opened read-only, and no sweep writes to a runtime's own files. |
| Ownership | This folder owns reading stored sessions and mapping them to records. `../lib/` owns the record shape and the queue. The sibling adapter folders own the live hook path. |

### How a sweep finds its session

| Runtime | Flag | Without it |
|---|---|---|
| Claude | `--transcript` | The transcript for `CLAUDE_CODE_SESSION_ID`, else the newest transcript whose recorded `cwd` matches the project. |
| Codex | `--transcript` | The rollout file named for `CODEX_THREAD_ID`, else the newest rollout whose header `cwd` matches the project. |
| Devin | `--transcript` | The session whose lock a parent process holds, else the newest session row for the project. |
| DSH | `--session` | The log for `DSH_SESSION_ID`, else the newest log whose header `cwd` matches the project. |
| OpenCode | `--db`, `--session` | The `OPENCODE_SESSION_ID` session, climbed to the session that dispatched a subagent, else the newest session for the project directory. |
| Pi | `--transcript` | The file in `PI_SESSION_FILE` when `PI_SESSION_ID` is set, else the newest session file whose header `cwd` matches the project. |
| Vibe | `--session` | The session whose lease a parent process holds, else the newest session whose recorded directory matches the project. |

Claude, Codex, DSH, OpenCode and Pi name the calling session in the environment, so a later session in the same project is never read instead.

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `sweepTranscript` | Function | Recovers the answers in a Claude transcript. |
| `sweepCodexTranscript` | Function | Recovers the answers in a Codex rollout. |
| `sweepDevinTranscript` | Function | Recovers the answers in a Devin transcript. |
| `databaseTranscript` | Function | Rebuilds a Devin session from `message_nodes` when the transcript file does not exist yet. |
| `sweepDshSession` | Function | Recovers the answers in a DSH session log. |
| `sweepOpenCodeSession` | Function | Recovers the answers in an OpenCode store. |
| `sweepPiTranscript` | Function | Recovers the answers in a Pi session file. |
| `sweepVibeSession` | Function | Recovers the answers in a Vibe session folder. |

Each sweep file is also a CLI that runs its function on the current project. Run the file with `node` and pass the flag named in the session table. The Codex, DSH, Pi and Vibe files print nothing and exit 0 when they find no session or no records. The other files always print a JSON object: an `error` with exit 1 when they find no session, and a report when the session holds no records. A named file a sweep cannot read prints a JSON error and exits 1.

### Run one sweep

```bash
node .skilled/hooks/decision-capture/bin/sweep-codex.mjs --transcript .skilled/hooks/decision-capture/bin/fixtures/codex-chat-rollout.jsonl
```

Expected result: a JSON report whose `recovered` count is 0 and whose `pending` list is empty, with one entry in `chat_candidates`. The exit status is 0.

---

## 7. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/decision-capture/bin/*.test.mjs
```

Expected result: every suite passes and the command exits 0.

```bash
node --test .skilled/hooks/decision-capture/bin/sweep-vibe.test.mjs
```

Expected result: the Vibe suite passes and the command exits 0.

The sweep suites build their sessions in a temp folder, so a run needs no saved runtime session.

---

## 8. RELATED

- [decision capture](../README.md): the concern, with its queue and switches.
- [queue core](../lib/capture-core.mjs): the module every sweep appends through.
- [chat detector](../lib/chat-questions.mjs): the module that pairs an assistant question with the next prompt.
- [hooks tree](../../README.md): the coverage matrix that `runtime-refusal.test.mjs` reads.
- [save command](../../../commands/speckit/save.md): the workflow that runs a sweep on save.
