---
title: "Operator decision capture"
description: "Queues each operator answer to an AI question and lets a full-auto `/speckit:save` write it into the bound packet's `decision-record.md` as a short decision with the exact question, options and answer kept beside it."
trigger_phrases:
  - "operator decision capture"
  - "decision capture"
  - "operator decisions"
  - "capture askuserquestion answers"
  - "verbatim operator answers"
version: 1.0.0.0
---

# Operator decision capture

This catalog entry maps the current decision-capture behavior to its implementation files, validation tests and operator reference.

## 1. OVERVIEW

An answer the operator gives to an AI question is a product decision, and its exact wording is evidence for it. Decision capture queues each answer locally, and a full-auto `/speckit:save` turns the queued answers into rows in the bound packet's `decision-record.md`, with the verbatim exchange in the same file under the same `Q` id.

This feature is cataloged under UX hooks because its live half is a hook. The save-time half runs inside the continuity writer and needs no daemon.

---

## 2. HOW IT WORKS

### Capture

On Claude, a PostToolUse hook on `AskUserQuestion` hands each answered question to the runtime-neutral core, which appends one record per answer to a per-session queue under the gitignored `.skilled/skills/.state/decision-capture/` folder. Each record carries a source key built from the runtime, the session, the tool-use id and the question's position, and a key is queued at most once. Questions about Gate 3, spec folders, worktrees, branches and commit or push permission are dropped before they reach the queue. `SYSTEM_DECISION_CAPTURE_DISABLED=1` turns the hook off.

### Sweeps

`/speckit:save` runs a sweep for the current runtime before it writes. On Claude, `sweep-transcript.mjs` copies any answered `AskUserQuestion` call the hook missed from the session transcript, and lists plain chat questions that closed an assistant turn together with the typed reply. On OpenCode, `sweep-opencode.mjs` reads answered question calls from OpenCode's SQLite store, opened read-only. On Devin, `sweep-devin.mjs` reads them from Devin's stored transcripts. The OpenCode and Devin sweeps offer no chat candidates. Each sweep prints the pending records, each with its `key`.

### Save

The session model writes one `operatorDecisions` entry per pending answer and per confirmed chat candidate, with the printed `key` as its `sourceKey`. A plan-only save lists the entries and writes nothing. A `--full-auto` save hands them to `decision-record-writer.ts`, which upserts a row in the `operator-decisions` anchor and adds the exact question, options and answer to the `operator-answers-verbatim` anchor. A known source key keeps its `Q` id. A row written by hand carries no key, so the writer matches it by its question and answer text, ignoring case and spacing. A repeated save changes no byte, and an existing appendix item is never rewritten.

The writer can create `decision-record.md` at any level. When it does so in a packet whose `spec.md` carries no level marker, it first stamps the level the validator already detects, so the new file cannot change that level. Written keys go to `consumed.jsonl` once each, so a later save does not offer them again.

### Nudge

The Claude Stop hook counts the answers still waiting for a record and reports a rising count once. A save that consumes only part of the queue lowers the count it last reported, so the next new answer is reported again.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.skilled/hooks/decision-capture/lib/capture-core.mjs` | Hook core | Normalizes answers, filters process questions, appends to the locked queue and computes the Stop-hook count. |
| `.skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs` | Claude adapter | PostToolUse entry point for `AskUserQuestion`. |
| `.skilled/hooks/decision-capture/bin/sweep-transcript.mjs` | Save-time sweep | Claude transcript reader and chat-candidate pairing. |
| `.skilled/hooks/decision-capture/bin/sweep-opencode.mjs` | Save-time sweep | OpenCode SQLite store reader. |
| `.skilled/hooks/decision-capture/bin/sweep-devin.mjs` | Save-time sweep | Devin transcript reader. |
| `.skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts` | Runtime library | Row and appendix upsert, level guard and consumed-key log. |
| `.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts` | Save pipeline | Routes each entry to its packet and writes it in full-auto mode. |
| `.skilled/skills/system-spec-kit/runtime/cli/utils/input-normalizer.ts` | Save pipeline | Validates the `operatorDecisions` payload. |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts` | Claude Stop hook | Pending-answer nudge. |
| `.skilled/skills/system-spec-kit/templates/addons/decision-record.md.tmpl` | Template | The two operator anchors. |
| `.skilled/skills/.state/decision-capture/README.md` | Runtime state | Queue, consumed log and cleanup. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/hooks/decision-capture/lib/capture-core.test.mjs` | Automated test | Capture, filter, deduplication, locking, adapter and nudge. |
| `.skilled/hooks/decision-capture/bin/sweep-transcript.test.mjs` | Automated test | Transcript recovery and chat candidates. |
| `.skilled/hooks/decision-capture/bin/sweep-opencode.test.mjs` | Automated test | OpenCode store reader. |
| `.skilled/hooks/decision-capture/bin/sweep-devin.test.mjs` | Automated test | Devin transcript reader. |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/decision-record-writer.vitest.ts` | Automated test | Upsert, idempotence, hand-written rows, appendix round trip, level guard and consumed log. |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/save-continuity-write.vitest.ts` | Automated test | Plan-only and full-auto saves, routing and consumption. |
| `.skilled/skills/system-spec-kit/runtime/tests/hook-session-stop.vitest.ts` | Automated test | Stop-hook nudge. |

---

## 4. SOURCE METADATA

- Group: UX Hooks
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `ux-hooks/operator-decision-capture.md`
- Related reference: `.skilled/skills/system-spec-kit/references/memory/save-workflow.md`
