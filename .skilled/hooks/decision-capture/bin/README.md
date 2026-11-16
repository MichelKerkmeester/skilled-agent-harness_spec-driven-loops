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

`.skilled/hooks/decision-capture/bin/` holds the save-time sweeps for the decision capture concern. A live adapter sees a question only while its hook is registered. Each sweep replays a runtime's session record and appends the answers the hook missed. The queue core deduplicates by key, so a key an earlier producer wrote is skipped. A sweep can therefore run on every save.

Each sweep is also a module. The live adapters import the Devin, DSH, Pi, Vibe and OpenCode record mappers. The live path and the swept path therefore write the same key.

Six runtimes run the live hook. Claude and Devin register it in `hook-registry.json` under the id `decision-capture`, each with a 5-second timeout. Claude's entry carries a fallback and Devin's names none. Pi loads `.skilled/hooks/decision-capture/pi/decision-capture.ts` through `.pi/extensions/decision-capture.ts`. DSH loads `.skilled/hooks/decision-capture/dsh/decision-capture.mjs` through a link at `.dsh/plugins/repo-guards/adapters/decision-capture.mjs`. Vibe names the hook `decision-capture-ask` in `.vibe/hooks.toml`. OpenCode loads `.opencode/plugins/decision-capture.js` from its plugin folder.

`/speckit:save` runs the sweep for the runtime it saves on. Codex has no live adapter, so its answers arrive only through `sweep-codex.mjs`.

---

## 2. DIRECTORY TREE

```text
bin/
+-- README.md
+-- fixtures/                     # The recorded runtime payloads the suites replay
+-- runtime-refusal.test.mjs      # The hooks tree README coverage-row check
+-- sweep-codex.mjs               # The Codex sweep
+-- sweep-codex.test.mjs          # Its node --test suite
+-- sweep-devin.mjs               # The Devin sweep and record mapper
+-- sweep-devin.test.mjs          # Its node --test suite
+-- sweep-dsh.mjs                 # The DSH sweep and record mapper
+-- sweep-dsh.test.mjs            # Its node --test suite
+-- sweep-opencode.mjs            # The OpenCode sweep and record mapper
+-- sweep-opencode.test.mjs       # Its node --test suite
+-- sweep-pi.mjs                  # The Pi sweep and record mapper
+-- sweep-pi.test.mjs             # Its node --test suite
+-- sweep-transcript.mjs          # The Claude sweep
+-- sweep-transcript.test.mjs     # Its node --test suite
+-- sweep-vibe.mjs                # The Vibe sweep and record mapper
`-- sweep-vibe.test.mjs          # Its node --test suite
```

| File | Responsibility |
|---|---|
| `fixtures/` | The recorded runtime payloads the suites replay. |
| `runtime-refusal.test.mjs` | The suite that checks the `decision-capture` row of the hooks tree README's coverage matrix. |
| `sweep-codex.mjs` | The Codex sweep. |
| `sweep-codex.test.mjs` | The Codex suite. |
| `sweep-devin.mjs` | The Devin sweep and its record mapper. |
| `sweep-devin.test.mjs` | The Devin suite. |
| `sweep-dsh.mjs` | The DSH sweep and its record mapper. |
| `sweep-dsh.test.mjs` | The DSH suite. It covers the late-reply shape and the shared record key. |
| `sweep-opencode.mjs` | The OpenCode sweep and its record mapper. |
| `sweep-opencode.test.mjs` | The OpenCode suite. |
| `sweep-pi.mjs` | The Pi sweep and its record mapper. |
| `sweep-pi.test.mjs` | The Pi suite. |
| `sweep-transcript.mjs` | The Claude sweep. |
| `sweep-transcript.test.mjs` | The Claude suite. It covers transcript replay, chat candidates and deduplication. |
| `sweep-vibe.mjs` | The Vibe sweep and its record mapper. |
| `sweep-vibe.test.mjs` | The Vibe suite. It covers the answer mapping, a cancelled question and a sweep whose answer the hook already queued. |

Every suite runs under `node --test`. `runtime-refusal.test.mjs` reads the hooks tree README at `../../README.md` and finds the `decision-capture` row of its coverage matrix. It requires eight runtime cells, each marked covered or naming a known state with a non-empty reason. A bare `n/a` fails. So does a state outside the four accepted prefixes. No runtime may be marked `n/a`.

`sweep-codex.mjs` reads a Codex rollout record and appends its answered `request_user_input` calls. It also lists plain-chat question and answer candidates. `--transcript <file>` reads a named record. Without it, the sweep reads the rollout of the thread named by `CODEX_THREAD_ID`, which Codex sets in every command it runs. Only when that variable is unset does it take the newest rollout whose header `cwd` matches the project. It exits 0 with no output when no rollout matches, or when it appends nothing and finds no pending answer and no chat candidate. A record it cannot read prints a JSON error object and exits 1.

`sweep-devin.mjs` exports `devinAnswerRecords` for the live adapter and `sweepDevinTranscript` for the save path. It pairs a question call with the answer in the same step's observation. Only a result carrying the answered-questions envelope counts, so a rejected call queues nothing. `--transcript <file>` reads a named transcript. Without it the sweep reads Devin's store, opened read-only. Devin sets no session id in the commands it runs, so the sweep first looks for a lock in `session_locks/` held by a process it descends from, which names the calling session. That session must have run in this project. Without one, it takes the newest session row for the project. Devin 3000.12 keeps messages in its database and writes no transcript file, so when the chosen session has none the sweep prints the answers the live hook queued, with `transcript_missing: true`, and exits 0. It prints a JSON error object and exits 1 when no session is found, a named transcript is missing, or a read fails.

`sweep-dsh.mjs` exports `QUESTION_TOOL`, `dshAnswerRecords` and `recoveredRecords`. It decodes each Zstandard frame of a session log on its own. It pairs an answer with the question that asked it, including a late reply to a timed question.

`--session <file>` reads a named log. Without it, the sweep reads the log of the session named by `DSH_SESSION_ID`, which DSH sets in every command it runs. Only when that variable is unset does it take the newest log whose header `cwd` matches the project. It exits 0 with no output when no log matches, or when it appends nothing and finds no pending answer and no chat candidate. A log it cannot read prints a JSON error object and exits 1. So does a log with no session header.

`sweep-opencode.mjs` exports `openCodeAnswerRecords`, which the OpenCode plugin imports. It reads the `part` table and the `session_message` table of OpenCode's SQLite store. It appends answers from completed question parts only, so a dismissed call queues nothing. `--db <file>` names the store and `--session <id>` names the session. Without `--session`, the sweep reads the session named by `OPENCODE_SESSION_ID`, which OpenCode sets in every command it runs, and climbs from a subagent's session to the session that dispatched it. Only when that variable is unset does it take the newest session for the project. It prints a JSON error object and exits 1 when no session is found or a read fails.

`sweep-pi.mjs` exports `QUESTION_TOOLS` and `recoveredRecords`. It accepts `ask_user_question` and `question`. A cancelled or errored result is dropped. `--transcript <file>` reads a named session file. Without it, the sweep reads the file Pi names in `PI_SESSION_FILE`, set in every command it runs. When `PI_SESSION_ID` is set but the session has no file yet, it reads nothing. Only when `PI_SESSION_ID` is unset does it take the newest file whose header `cwd` matches the project. It exits 0 with no output when no file matches, or when it appends nothing and finds no pending answer and no chat candidate. A file it cannot read prints a JSON error object and exits 1.

`sweep-transcript.mjs` exports `sweepTranscript`. It replays a Claude transcript and appends answered `AskUserQuestion` calls. It also lists plain-chat question and answer candidates. A sidechain line and a torn final line are skipped. `--transcript <file>` reads a named transcript. Without it, the sweep reads the transcript of the session named by `CLAUDE_CODE_SESSION_ID`, which Claude Code sets in every command it runs, so a newer transcript from another session is never read. Only when that variable is unset does it take the newest transcript whose recorded `cwd` matches the project. It prints a JSON error object and exits 1 when no transcript is found or a read fails.

`sweep-vibe.mjs` exports `isQuestionTool` and `vibeAnswerRecords` for the live adapter and `sweepVibeSession` for the save path. It reads a Vibe session journal and matches `ask_user_question` bare or group-qualified. A cancelled question yields nothing.

`--session <dir>` reads a named session directory. Without it the sweep takes the newest session whose recorded directory matches the project, under the session root or its `unified/` folder, where Vibe 3 writes sessions. Vibe sets no session id in the commands it runs, so the sweep first tries the session whose lease in `active/` is held by a process it descends from, which is the calling session. It exits 0 with no output when no session matches, or when it appends nothing and finds no pending answer. A journal it cannot read prints a JSON error object and exits 1. So does a journal that names no session.

`fixtures/` holds the recorded payloads the Codex, Devin, OpenCode, Pi and Claude suites replay. The DSH and Vibe suites build their logs inside the test file.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/decision-capture/bin/*.test.mjs
```

Expected result: every case passes and the process exits 0.

```bash
node .skilled/hooks/decision-capture/bin/sweep-transcript.mjs --transcript .skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.jsonl
```

Expected result: a JSON report with `pending` and `chat_candidates`. The exit status is 0.

---

## 4. RELATED

- [`../README.md`](../README.md): the decision capture concern, with its queue and switches.
- [`../lib/capture-core.mjs`](../lib/capture-core.mjs): the queue core every sweep appends through.
- [`../lib/chat-questions.mjs`](../lib/chat-questions.mjs): the chat detector every sweep offers candidates to.
- [`../../README.md`](../../README.md): the hooks tree, with the switch index and the coverage matrix.
- [`../../../commands/speckit/save.md`](../../../commands/speckit/save.md): the save command that runs the sweeps.
