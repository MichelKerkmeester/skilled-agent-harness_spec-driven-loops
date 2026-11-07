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

`hooks/decision-capture/lib/` holds the runtime-neutral half of the decision capture concern. Two producers feed the queue, a live adapter that sees a question result and a sweep that recovers what the adapter missed. Both hand the same normalized shape to `appendRecords`, so the save step reads one file format whatever the source.

Answers are kept byte-exact. The queue lives under `.skilled/skills/.state/decision-capture` at the nearest Git root, appends serialize on a lock directory and a lock abandoned by a dead holder is reclaimed by age.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `capture-core.mjs` | Shared library | Exports `normalizeAskUserQuestion`, `appendRecords`, `readQueue`, `pendingRecords`, `takeNudge`, the source-key builders and the queue path helpers. Normalizes answers, deduplicates by key and appends under a lock. | Not stated in the module. Queue and lock failures surface to the calling adapter. |
| `capture-core.test.mjs` | `node --test` suite | Covers normalization, byte-exact answers, deduplication, locking, stale-lock reclaim and the nudge counter. | Not applicable. |
| `chat-questions.mjs` | Shared library | Exports `answerEvidence` and `chatCandidatesFromTurns`. Pairs an assistant question with the next typed prompt and offers the pair as a candidate for the save step. | Not stated in the module. The caller owns the failure path. |
| `chat-questions.test.mjs` | `node --test` suite | Covers candidate detection, the process-question filter and the evidence rules. | Not applicable. |

---

## 3. RELATED

- [`../`](../): the decision capture concern folder.
- [`../claude/README.md`](../claude/README.md): the Claude adapter that calls the queue core.
- [`../dsh/README.md`](../dsh/README.md): the DSH adapter that calls the queue core.
