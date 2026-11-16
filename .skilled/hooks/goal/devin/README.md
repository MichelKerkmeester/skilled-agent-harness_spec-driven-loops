---
title: "Goal (Devin): SessionStart and UserPromptSubmit Injection"
description: "The Devin goal adapter that renders the bound packet goal and the resend reminder as additionalContext on session start and on each submitted prompt."
trigger_phrases:
  - "devin goal injection"
  - "userpromptsubmit goal brief"
  - "additional context envelope"
version: 1.0.0.0
---

# Goal (Devin): SessionStart and UserPromptSubmit Injection

---

## 1. OVERVIEW

`goal-inject.mjs` is the Devin goal adapter. `.devin/hooks.v1.json` registers the file for `SessionStart` and `UserPromptSubmit`, so one file serves both events. Devin exposes no prompt command surface in this repository, which makes the runtime injection-only. Binding happens on a runtime whose command carries a native session identity. The record is shared through the same core.

The hook reads `session_id` and takes the workspace from `cwd` or `DEVIN_PROJECT_DIR`. It falls back to the process working directory when neither names one. It binds a hand-over packet when one was exported. Then it reads the active record and renders the brief.

While the operator copy is behind the packet, the reminder names the `goal.cjs resent` line. That line records the resend for this session. The result is a `hookSpecificOutput` envelope with `hookEventName` and `additionalContext`. The envelope keeps the event name the payload carries, and `UserPromptSubmit` is the default.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `goal-inject.mjs` | The hook for both events. It reads the payload, binds a hand-over packet, renders the brief and the reminder, records one turn and emits the envelope. |
| `goal-devin.test.mjs` | The `node --test` suite. It spawns the hook as a real process against a temp state directory. |

`goal-inject.mjs` reads the payload, binds a hand-over packet, renders the brief and the resend reminder. It records one turn on the bound record and emits `{ hookSpecificOutput: { hookEventName, additionalContext } }`. A malformed payload, a disabled plugin or any core error emits `{}` instead. An unusable hand-over packet writes one stderr line, and the session continues. Every path exits 0, so the hook never blocks a turn.

`goal-devin.test.mjs` spawns the hook as a real process against a temp state directory. It covers the injection envelope, the reminder text and the missing and paused cases. Bad input and a disabled plugin fail open. The suite also covers the hand-over bind, a later turn and a dispatched child. A failed assertion fails the test process with a nonzero status.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/goal/devin/goal-devin.test.mjs
```

Expected result: every test passes.

---

## 4. RELATED

- [`../README.md`](../README.md): the concern index, with the per-runtime capability matrix and the state layout.
- [`./goal-inject.mjs`](./goal-inject.mjs): the hook itself.
- [`../lib/goal-core.cjs`](../lib/goal-core.cjs): the core it imports for reads, rendering and the hand-over bind.
- [`../../../../.devin/hooks.v1.json`](../../../../.devin/hooks.v1.json): the Devin registration for both events.
