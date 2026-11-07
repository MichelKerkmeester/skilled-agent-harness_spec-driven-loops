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

`hooks/decision-capture/bin/` holds the save-time sweeps for the decision capture concern. A live adapter sees a question only while its hook is registered. Each sweep replays a runtime's own session record and appends the answered questions the hook missed. Deduplication lives in the queue core, so a key an earlier producer wrote is skipped and a sweep can run on every save.

Each sweep is also a module. The live adapters import the Devin, DSH and Pi record mappers, so the live path and the swept path write the same key.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `sweep-codex.mjs` | Codex sweep, CLI | Reads a Codex rollout record and appends its answered questions to the queue. | Prints a JSON error object and exits 1 when the transcript cannot be read. |
| `sweep-codex.test.mjs` | `node --test` suite | Covers the Codex sweep against recorded rollout fixtures. | Not applicable. |
| `sweep-devin.mjs` | Devin sweep, CLI and module | Exports `devinAnswerRecords` for the live adapter and `sweepDevinTranscript` for the save path. Reads a Devin transcript and appends answered questions. | Prints a JSON error object and exits 1 on a read or path failure. |
| `sweep-devin.test.mjs` | `node --test` suite | Covers the Devin sweep and its record mapping. | Not applicable. |
| `sweep-dsh.mjs` | DSH sweep, CLI and module | Exports `QUESTION_TOOL`, `dshAnswerRecords` and `recoveredRecords`. Reads a DSH session log and pairs an answer with the question that asked it, including a late reply to a timed question. | Prints a JSON error object and exits 1 when the session log cannot be read. |
| `sweep-dsh.test.mjs` | `node --test` suite | Covers the DSH sweep, the late-reply shape and the shared record key. | Not applicable. |
| `sweep-opencode.mjs` | OpenCode sweep, CLI | Reads OpenCode's SQLite storage and appends answers from completed question parts. | Prints a JSON error object and exits 1 on a storage or read failure. |
| `sweep-opencode.test.mjs` | `node --test` suite | Covers the OpenCode sweep against recorded session data. | Not applicable. |
| `sweep-pi.mjs` | Pi sweep, CLI and module | Exports `QUESTION_TOOLS` and `recoveredRecords`. Reads a Pi session file and appends answered questions. | Prints a JSON error object and exits 1 when the session file cannot be read. |
| `sweep-pi.test.mjs` | `node --test` suite | Covers the Pi sweep and its record mapping. | Not applicable. |
| `sweep-transcript.mjs` | Claude sweep, CLI | Replays a Claude transcript, appends answered calls and lists plain-chat question and answer candidates. | Prints a JSON error object and exits 1 on a read or path failure. |
| `sweep-transcript.test.mjs` | `node --test` suite | Covers transcript replay, chat candidates and deduplication. | Not applicable. |
| `runtime-refusal.test.mjs` | `node --test` suite | Checks that the concern README carries a coverage row for all seven runtimes and that every cell has a known state with a non-empty reason. | Not applicable. |

The `fixtures/` folder holds the recorded runtime payloads these suites replay.

---

## 3. RELATED

- [`../`](../): the decision capture concern folder.
- [`../lib/capture-core.mjs`](../lib/capture-core.mjs): the queue core every sweep appends through.
- [`../../README.md`](../../README.md): the unified hooks tree this concern lives in.
