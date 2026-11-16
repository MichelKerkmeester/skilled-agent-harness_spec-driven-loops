---
title: "Session Handover: Shared Library"
description: "Shared state, nudge text, usage readers, killer supervision, hop history, goal hand-over and withdrawal logic behind every relaunch adapter."
trigger_phrases:
  - "session handover core"
  - "relaunch record state"
  - "hop history log"
version: 1.0.0.0
---

# Session Handover: Shared Library

---

## 1. OVERVIEW

`lib/` holds the shared logic behind the session handover adapters and the CLI. `relaunch-core.cjs` owns the handoff note and the relaunch record. The other modules add nudge text, usage readers, the detached killer and hop history.

`goal-handover.cjs` renders a packet's goal slice for the next session. `withdraw.cjs` calls a prepared hand-over off. No module writes to stdout, so each adapter and the CLI own their transport.

Claude and Codex register their adapters in `hook-registry.json`. Pi runs an extension, OpenCode loads a plugin and Vibe runs its own hooks.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `context-usage.cjs` | Reads Claude transcripts, Codex rollouts and Vibe journals. It accepts Pi and OpenCode usage values, resolves the window and computes the fill ratio. A missing source returns `null`. |
| `goal-handover.cjs` | Renders a packet's `goal.md` durable slice through the goal command, within a 4000-character limit. Every refusal is a one-line reason and never a throw. |
| `hop-history.cjs` | Appends hop events to `hop-history.log` beside the handoff notes. It formats recent hops, lists open notes and sends the opt-in notice. A failed write never fails the hop it describes. |
| `killer.cjs` | The detached process an adapter spawns when a session stops. It waits for transcript idle, signals the target runtime once an armed record exists and raises a macOS notice with the manual claim command on timeout. It logs the outcome and exits when the target is gone or the record changed. It also exits once the hop cap is reached. |
| `nudge.cjs` | Builds the seed, handoff, stale-note and withdrawn text. It decides the threshold and hop cap and reads or writes per-session nudge state. A read helper returns `null` for an absent note. A missing state file reads as level zero. |
| `relaunch-core.cjs` | Defines the runtime list, parses a handoff note and validates it. It prepares, arms, claims and completes a record. It resolves state paths and process ancestry and provides the append lock and log helper. It writes no transport of its own. |
| `withdraw.cjs` | Calls off a prepared hand-over under the record lock. The session keeps running and the note stays open. It returns `null` when no matching record is found. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the state files and switches.
- [`../bin/session-handover.cjs`](../bin/session-handover.cjs): the CLI over this library.
- [`../tests/README.md`](../tests/README.md): the suites for these modules.
