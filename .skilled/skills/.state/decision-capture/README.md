---
title: Decision Capture Runtime State
description: Holds the local queue of captured operator answers, the consumed-key log and the Stop-hook nudge counters.
trigger_phrases:
  - "decision capture runtime state"
  - "operator answer queue"
  - "consumed decision keys"
version: 1.0.1.0
---

# Decision Capture Runtime State

> Local storage for operator answers that are waiting to become decision-record entries.

---

## 1. OVERVIEW

This folder belongs to the runtime-neutral [`capture-core.mjs`](../../../hooks/decision-capture/lib/capture-core.mjs). Two producers write to it. The Claude PostToolUse adapter appends an answer the moment an AskUserQuestion call returns, once that hook is registered. The transcript sweep appends any answer the hook missed when `/speckit:save` runs.

The queue holds the exact question, options and answer. It never holds the rewritten decision. A full-auto save turns a queued answer into a short decision in the bound packet's `decision-record.md`, keeps the verbatim exchange in that file's appendix and then records the source key as consumed here.

Process questions about Gate 3, spec folders, worktrees, branches and commit or push permission are dropped before they reach the queue.

Raw data is git-ignored. Only this `README.md` is tracked, so the folder and its purpose stay visible without shipping anyone's answers.

---

## 2. STRUCTURE

| Path | Shape | Purpose |
|---|---|---|
| `<session-id-hex>.jsonl` | One JSON object per line | Captured answers for one session. Each record carries a `key`, the runtime, the session and tool-use ids, the question index, the exact `question`, `header`, `options` and `answer`, its `source` (`hook` or `transcript`) and `captured_at`. A key appears at most once. |
| `consumed.jsonl` | One JSON object per line | Keys a full-auto save has written into a decision record, with the packet and the Q id they received. |
| `<session-id-hex>.nudge` | A plain integer | The pending count the Stop hook last reported, so it reports a count once rather than on every turn. |
| `probe/` | JSON files | Results of the runtime answer-surface probes. |
| `.locks/` | Temporary lock directories | Serialize appends to one queue file. A lock older than two minutes is reclaimed. |

---

## 3. CLEANUP

Deleting a session's `.jsonl` file discards answers that no save has consumed yet, so run a full-auto `/speckit:save` first. `consumed.jsonl` can be deleted at any time. The writer stores each source key in the record's appendix, so a later save still maps a known answer to its existing Q id. A row written by hand carries no key, so the writer matches it by its question and answer text instead, ignoring case and spacing. A hand-written row that shortens the question gets no match. Give it the `<!-- source: KEY -->` line the sweep printed, directly under its `### Q` heading, or a later sweep adds the answer again.
