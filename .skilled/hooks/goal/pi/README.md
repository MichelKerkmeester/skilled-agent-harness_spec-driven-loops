---
title: "Goal (Pi): Native Lifecycle Injection"
description: "The Pi extension that registers goal-pi and injects the bound packet goal on input and session_start, with a heuristic verify nudge on turn_end."
trigger_phrases:
  - "pi goal context"
  - "goal-pi command"
  - "turn end verify nudge"
version: 1.0.0.0
---

# Goal (Pi): Native Lifecycle Injection

---

## 1. OVERVIEW

`goal/pi/` holds the real Pi goal extension. `goal-context.ts` is discovered through `.pi/extensions/goal-context.ts`, a relative symlink back to this file. It registers `/goal-pi` and three lifecycle handlers that all load `../lib/goal-core.cjs` at call time, so the extension works from the canonical path and from the discovery link.

`input` binds a hand-over packet, reads the active record and returns `{ action: 'transform', text }` with the brief and any resend reminder appended to the operator's prompt. `session_start` restores the same brief with `pi.sendMessage` and `triggerTurn: false`. `turn_end` runs the heuristic verifier, records the turn and sends a `[goal_verify]` note with `deliverAs: 'nextTurn'` when the verdict is not met. That note never restarts a turn. Management shells to `bin/goal.cjs` with the native session id.

---

## 2. WHAT EACH FILE DOES

| File | Event | What it does | On error |
|---|---|---|---|
| `goal-context.ts` | `input`, `session_start`, `turn_end` and the `/goal-pi` command | Renders the bound goal brief, appends the resend reminder, restores it at session start, verifies at turn end and routes management through the shared CLI. | Every handler catches and fails open. `input` returns `{ action: 'continue' }`, `session_start` returns `undefined`, `turn_end` skips the nudge and the command notifies a `STATUS=FAIL` line. |
| `goal-pi.test.mjs` | `node --test` | Covers the factory export, the registered handlers and command, per-session isolation, the verify nudge, the tool-heavy turn tail, missing identity, legacy-only state, native management and the hand-over bind. | A failed assertion fails the test process with a nonzero status. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern index, with the per-runtime capability matrix and the state layout.
- [`./goal-context.ts`](./goal-context.ts): the extension itself.
- [`../lib/goal-core.cjs`](../lib/goal-core.cjs): the core it loads at call time.
- [`../../../../.pi/extensions/goal-context.ts`](../../../../.pi/extensions/goal-context.ts): the discovery symlink Pi loads.
