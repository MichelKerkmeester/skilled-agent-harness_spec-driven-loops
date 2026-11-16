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

`.skilled/hooks/goal/pi/` holds the real Pi goal extension, which Pi discovers through `.pi/extensions/goal-context.ts`. The entry file is a single line that re-exports the adapter. `goal-context.ts` registers the `/goal-pi` command and the three lifecycle handlers Pi fires. Each handler loads `../lib/goal-core.cjs` at call time, so the extension runs from this folder. The fallback path in `DISCOVERY_CORE_PATH` does not resolve from this folder.

`input` binds a hand-over packet, reads the active record and returns `{ action: 'transform', text }`. The text is the operator's prompt with the brief and any resend reminder appended. At `session_start` the handler restores the same brief through `pi.sendMessage` with `triggerTurn: false`.

`turn_end` runs the heuristic verifier, records the turn and sends a `[goal_verify]` note with `deliverAs: 'nextTurn'` when the verdict is not met. That note never restarts a turn or steers the running one. Management shells to `.skilled/hooks/goal/bin/goal.cjs` with the native session id and workspace.

Each lifecycle handler catches its own error and fails open. On a failure `input` returns `{ action: 'continue' }` and `session_start` returns `undefined`. A failed `turn_end` returns `undefined`, which skips the nudge for that turn. The command notifies a `STATUS=FAIL` line when the CLI prints nothing or cannot run.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `goal-context.ts` | The Pi extension. It registers `/goal-pi` and the `input`, `session_start` and `turn_end` handlers. |
| `goal-pi.test.mjs` | The `node --test` suite. It imports the real extension and drives it through a fake Pi API. |

`goal-pi.test.mjs` covers the factory export, the registered handlers and command, per-session isolation and the verify nudge. It also covers the tool-heavy turn tail, missing identity, legacy-only state, native management and the hand-over bind. A failed assertion fails the test process with a nonzero status.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/goal/pi/goal-pi.test.mjs
```

Expected result: every test passes.

---

## 4. RELATED

- [`../README.md`](../README.md): the concern index, with the per-runtime capability matrix and the state layout.
- [`./goal-context.ts`](./goal-context.ts): the extension itself.
- [`../lib/goal-core.cjs`](../lib/goal-core.cjs): the core it loads at call time.
- [`../../../../.pi/extensions/goal-context.ts`](../../../../.pi/extensions/goal-context.ts): the one-line entry file Pi discovers.
