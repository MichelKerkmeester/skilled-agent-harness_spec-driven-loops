---
title: "Session Relaunch: Shared Library"
description: "Shared state, nudge text, usage readers, killer supervision, hop history, goal hand-over and withdrawal logic behind every relaunch adapter."
trigger_phrases:
  - "session relaunch core"
  - "relaunch record state"
  - "hop history log"
version: 1.0.0.0
---

# Session Relaunch: Shared Library

---

## 1. OVERVIEW

`lib/` holds the shared logic behind every session relaunch adapter and the CLI. `relaunch-core.cjs` owns the handoff note and the relaunch record. The other modules add nudge text and thresholds, usage readers for each runtime, the detached killer, the hop history, goal slice rendering and withdrawal. The modules write no stdout, so each adapter or CLI entry point owns its own transport.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`relaunch-core.cjs`](./relaunch-core.cjs) | Shared core | Defines the runtime list, parses and validates a handoff note, prepares, arms, claims and completes a record, resolves state paths and process ancestry, and provides the append lock and log helper. | No transport. The adapters that call it catch and log a failure. |
| [`nudge.cjs`](./nudge.cjs) | Shared helper | Builds seed, handoff, stale-note and withdrawn text, decides the threshold and hop cap, and reads or writes per-session nudge state. | Read helpers return `null` for an absent note or state, and the caller stays quiet. |
| [`context-usage.cjs`](./context-usage.cjs) | Shared helper | Reads Claude transcripts and Codex rollouts, accepts Pi, OpenCode and Hermes usage values, resolves the window and computes the fill ratio. | A missing source returns `null`, and the caller stops quietly. |
| [`killer.cjs`](./killer.cjs) | Detached process | Spawned by a stop adapter. Waits for transcript idle, signals the target runtime once an armed record exists and raises a macOS notice with the manual claim command on timeout. | Logs the outcome and exits when the target is gone, the record changed or the hop cap is reached. |
| [`hop-history.cjs`](./hop-history.cjs) | Shared helper | Appends hop events to `hop-history.log` beside the handoff notes, prints recent hops, lists open notes and sends the opt-in hand-over notice. | A failed history write never fails the hop it describes. |
| [`goal-handover.cjs`](./goal-handover.cjs) | Shared helper | Renders the packet's `goal.md` durable slice through the goal command for a receiver that starts on the goal prompt. The slice limit is 4000 characters. | Every refusal is a one-line reason and never a throw. |
| [`withdraw.cjs`](./withdraw.cjs) | Shared helper | Calls off a prepared hand-over under the record lock so the session keeps running and the note stays open. | Returns `null` when no matching record is found. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the state files and switches.
- [`../bin/session-relaunch.cjs`](../bin/session-relaunch.cjs): the CLI over this library.
- [`../tests/README.md`](../tests/README.md): the suites for these modules.
