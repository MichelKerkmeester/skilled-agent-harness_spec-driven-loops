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

`capture-core.mjs` is the runtime-neutral half of decision capture. Two producers feed the queue. Both hand the same normalized shape to `appendRecords`. A live adapter sees a question tool's result as it happens. A transcript sweep recovers what the adapter missed. The save step therefore reads one file format, whatever the source.

Answers are kept byte-exact, because a trimmed quote would change what the operator agreed to. The queue sits under `.skilled/skills/.state/decision-capture` at the nearest Git root, in a folder named by a hash of that root. A linked worktree uses its primary checkout's root, because a session's hook queues answers where the session started while its save may run in the worktree. Reads still include the worktree's old folder. Appends serialize on a lock directory. A lock abandoned by a dead holder is reclaimed after two minutes.

`chat-questions.mjs` handles questions asked in plain chat, where no tool result exists. It pairs an assistant question with the next typed prompt and describes the evidence for the save step.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `capture-core.mjs` | The queue core. It normalizes a payload, builds the source keys, deduplicates and appends under a lock. |
| `capture-core.test.mjs` | The `node --test` suite for the core and the adapters that call it. |
| `chat-questions.mjs` | The chat detector. It pairs a question with the next typed prompt. |
| `chat-questions.test.mjs` | The `node --test` suite for the chat detector. |

`capture-core.mjs` exports `normalizeAskUserQuestion`, `appendRecords`, `readQueue`, `pendingRecords`, `takeNudge`, `isProcessQuestion`, the source-key builders and the queue path helpers. `appendRecords` returns counts for a repeated key instead of throwing. Any other queue or lock failure throws to the calling adapter. An empty batch touches nothing, so a turn with no answer creates no state. A repeated key is skipped, so a second capture of the same answer adds nothing. A wait for the lock that passes ten seconds throws `decision-capture: timed out waiting for the queue lock`.

`readQueue` reads the project's hashed folder and the `decision-capture` folder above it, then drops a duplicate key. `pendingRecords` removes every key that `consumed.jsonl` already holds. `takeNudge` reports a rising count once, so a session does not repeat the reminder on every turn.

`chat-questions.mjs` exports `answerEvidence` and `chatCandidatesFromTurns`. It reads turns and writes nothing to the queue. `answerEvidence` returns null when the answer is not a string. `chatCandidatesFromTurns` keeps at most three candidates per message and twenty per sweep. Both caps report what they cut.

`capture-core.test.mjs` covers the queue path, normalization, byte-exact answers, deduplication, the process filter and the nudge counter. It also spawns the Claude and Devin adapters and the OpenCode plugin. A live capture and a sweep then agree on one key. `chat-questions.test.mjs` covers candidate detection, the per-message cap, the tool-turn reset and the evidence rules.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/decision-capture/lib/capture-core.test.mjs .skilled/hooks/decision-capture/lib/chat-questions.test.mjs
```

The command runs both `node --test` suites in one call.

---

## 4. RELATED

- [`../README.md`](../README.md): the decision capture concern, with the runtime coverage matrix.
- [`../claude/README.md`](../claude/README.md): the Claude adapter that calls the queue core.
- [`../dsh/README.md`](../dsh/README.md): the DSH adapter that calls the queue core.
