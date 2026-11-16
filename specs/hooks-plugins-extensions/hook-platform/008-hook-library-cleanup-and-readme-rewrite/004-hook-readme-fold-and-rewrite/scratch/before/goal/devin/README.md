---
title: "Goal (Devin): SessionStart and UserPromptSubmit Injection"
description: "The Devin hook pair that renders the bound packet goal and the resend reminder as additionalContext on session start and on each submitted prompt."
trigger_phrases:
  - "devin goal injection"
  - "userpromptsubmit goal brief"
  - "additional context envelope"
version: 1.0.0.0
---

# Goal (Devin): SessionStart and UserPromptSubmit Injection

---

## 1. OVERVIEW

`goal/devin/` holds the Devin goal adapter. `goal-inject.mjs` is registered in `.devin/hooks.v1.json` for `SessionStart` and `UserPromptSubmit`, so one file serves both events. Devin exposes no prompt command surface in this repository, which makes the runtime injection-only. Binding happens on a runtime whose command carries a native session identity, and the record is shared through the same core.

The hook reads `session_id` and takes the workspace from `cwd` or `DEVIN_PROJECT_DIR`. It binds a hand-over packet when one was exported, reads the active record and renders the brief. While the operator copy is behind the packet, the reminder names the `goal.cjs resent` line for this session. The result is a `hookSpecificOutput` envelope with `hookEventName` and `additionalContext`.

---

## 2. WHAT EACH FILE DOES

| File | Event | What it does | On error |
|---|---|---|---|
| `goal-inject.mjs` | `SessionStart` and `UserPromptSubmit` | Reads the payload, binds a hand-over packet, renders the brief plus the resend reminder and emits `{ hookSpecificOutput: { hookEventName, additionalContext } }`. Records one turn on the bound record. | Emits `{}` on malformed stdin, a disabled plugin or any core error. An unusable hand-over packet writes one stderr line and the session continues. |
| `goal-devin.test.mjs` | `node --test` | Spawns the hook against a temp state directory. Covers the injection envelope, the reminder text, the paused and missing cases and fail-open behavior on bad input. | A failed assertion fails the test process with a nonzero status. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern index, with the per-runtime capability matrix and the state layout.
- [`./goal-inject.mjs`](./goal-inject.mjs): the hook itself.
- [`../lib/goal-core.cjs`](../lib/goal-core.cjs): the core it imports for reads, rendering and the hand-over bind.
- [`../../../../.devin/hooks.v1.json`](../../../../.devin/hooks.v1.json): the Devin registration for both events.
