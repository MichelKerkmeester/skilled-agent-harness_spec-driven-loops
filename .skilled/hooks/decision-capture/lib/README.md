---
title: "Decision Capture Library: Queue Core and Chat Detection"
description: "Runtime-neutral queue that normalizes, deduplicates and lock-appends operator answers, plus detection for plain chat question and answer pairs."
trigger_phrases:
  - "decision capture queue"
  - "operator answer queue core"
  - "chat question detection"
version: 1.0.0.0
---

# Decision Capture Library: Queue Core and Chat Detection

---

## 1. OVERVIEW

`.skilled/hooks/decision-capture/lib/` is the runtime-neutral half of decision capture. A live adapter sees a question tool's result while the call happens. A save-time sweep replays a stored session later. Both producers build the same record shape and append it through `appendRecords`, so a save reads one queue format whatever the source.

Every answer stays byte-exact. A decision record quotes the operator's own wording. A trimmed quote would change what they agreed to. A question about how the session should run is dropped before a record exists, because that bookkeeping cannot guide a later reader.

`chat-questions.mjs` covers the other case, a question asked in plain chat where no tool result exists. It pairs an assistant question with the next typed prompt and describes the evidence for the save step. It writes nothing to the queue.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────╮
│                  decision-capture/lib/                       │
╰──────────────────────────────────────────────────────────────╯

  live adapter ──┐
                 ├──▶ normalizeAskUserQuestion ──▶ appendRecords
  save sweep ────┘                                      │
                                                        ▼
                                                one session JSONL
                                                        │
                                   readQueue ◀──────────┘
                                        │
                              pendingRecords ──▶ takeNudge

  transcript turns ──▶ chatCandidatesFromTurns ──▶ answerEvidence
```

Dependency direction: `chat-questions.mjs` reads `chatSourceKey` and `isProcessQuestion` from `capture-core.mjs`. Neither module imports an adapter or a sweep, so a hook and a save command can load the same core.

---

## 3. FILES

| File | Responsibility |
|---|---|
| `capture-core.mjs` | The queue core. It normalizes a tool payload, builds source keys, drops process questions, deduplicates and appends under a lock. |
| `capture-core.test.mjs` | The `node --test` suite for the core and the callers that use it. |
| `chat-questions.mjs` | The chat detector. It pairs an assistant question with the next prompt and builds bounded candidates. |
| `chat-questions.test.mjs` | The `node --test` suite for the detector and its evidence rules. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | `chat-questions.mjs` imports `chatSourceKey` and `isProcessQuestion` from `capture-core.mjs`. Nothing here imports an adapter or a sweep. |
| Exports | `capture-core.mjs` owns the queue API. `chat-questions.mjs` owns chat detection. |
| Ownership | Normalization, deduplication, queue paths, the nudge counter and chat evidence belong here. Runtime payload parsing belongs to an adapter or a sweep. |
| State | The queue sits under the skills state folder at the canonical project root, in a folder named by a hash of that root. |

Main flow:

```text
question tool result
        │
        ▼
normalizeAskUserQuestion   exact question text, process filter
        │
        ▼
appendRecords              queued and consumed keys read under a lock
        │
        ▼
session JSONL
```

`normalizeAskUserQuestion` reads a question list and an answers object. It matches each answer by the exact question text, because the runtime keys answers that way. A payload that carries neither shape yields no records, so a hook that misreads a newer payload stays silent. A record keeps the question, the option labels, the answer and the capture time.

The queue path follows the canonical project root. A call from a subfolder or through a symlink reaches the same folder, because `queueDir` resolves the real path first. `QUEUE_RELATIVE_DIR` holds the queue's relative location. `projectToken` supplies the folder name from the first 12 hex characters of a SHA-256 hash of the root.

A linked worktree shares the primary checkout's folder. A session's hook queues answers where the session started, while its save may run in the worktree. Reads also include the worktree's own older folder, so an answer queued there is still found. A submodule and a bare repository keep their own root.

Two producers can race on one session, so an append reads the queued keys and the consumed keys under a lock directory. A `mkdir` call acquires the lock in one step, so no gap opens between the check and the write. A lock folder older than two minutes is reclaimed, whether or not its holder is still running. A wait past ten seconds throws `decision-capture: timed out waiting for the queue lock`.

`appendRecords` returns counts for a repeated key instead of throwing, so an adapter can log a deduplicated batch. Any other queue or lock failure throws to the caller. An empty batch returns zero counts and touches nothing, so a turn with no answer creates no state.

`consumed.jsonl` sits in the queue folder and records the keys a save already wrote. `pendingRecords` removes those keys from the read result. `takeNudge` reports a pending count once, when it rises above the last report, so a session does not repeat the reminder on every turn. A count that falls after a partial save lowers the cursor. A zero count resets it. A session that captured nothing leaves no nudge file.

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `QUEUE_RELATIVE_DIR` | Constant | The queue's relative location under the project root. |
| `projectToken` | Function | Hashes the canonical project root into a queue folder name. |
| `queueDir` | Function | Returns the queue folder for a project directory. |
| `queueFile` | Function | Returns one session's queue file. |
| `normalizeAskUserQuestion` | Function | Maps a question tool payload to queue records. |
| `isProcessQuestion` | Function | Reports whether a question asks how the session should run. |
| `toolSourceKey` | Function | Builds a tool answer's source key. |
| `chatSourceKey` | Function | Builds a chat answer's source key. |
| `appendRecords` | Function | Appends new records under a lock and returns the counts. |
| `readQueue` | Function | Reads one session's records across the queue folders. |
| `readConsumedKeys` | Function | Reads the keys a save already recorded. |
| `pendingRecords` | Function | Returns the records no save has consumed. |
| `takeNudge` | Function | Reports a rising pending count once. |
| `answerEvidence` | Function | Describes how a reply relates to its question. |
| `chatCandidatesFromTurns` | Function | Builds bounded chat candidates from ordered turns. It writes nothing to the queue. |

`answerEvidence` returns null when the answer is not a string. Otherwise it reports `questionType`, `optionMatch`, `contentOverlap`, `imperativeOpening` and `topicShift`. The type is `numbered_list`, `alternative`, `yes_no` or `open_value`. `optionMatch` is a boolean or `not_applicable`. Those values inform the save model. They never accept or reject a candidate on their own.

`chatCandidatesFromTurns` keeps at most three candidates per message and twenty per sweep. Both caps report what they cut in `dropped`. A tool turn clears the pending assistant question, so an earlier question is not paired with a later prompt. A question that still waits for a prompt is kept with a null answer.

---

## 6. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/decision-capture/lib/capture-core.test.mjs .skilled/hooks/decision-capture/lib/chat-questions.test.mjs
```

Expected result: `pass 39` and `fail 0`, with exit status 0.

The core suite covers the queue paths, normalization, byte-exact answers, deduplication, the process filter and the nudge counter. It spawns the Claude and Devin adapters. It also drives the OpenCode plugin. A live capture and a sweep then agree on one key. The chat suite covers candidate detection, the per-message cap, the tool-turn reset and the evidence rules.

---

## 7. RELATED

- [the decision capture concern](../README.md): the queue contract and the runtime coverage matrix.
- [the save-time sweeps](../bin/README.md): the record mappers and their commands.
- [the save command](../../../commands/speckit/save.md): when the sweeps run.
- [the hooks tree](../../README.md): the switch index and the coverage matrix.
