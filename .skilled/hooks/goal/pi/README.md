---
title: "Pi Goal: input, session_start and turn_end Adapters"
description: "The Pi extension that registers goal-pi and injects the bound packet goal on input and session_start, with a heuristic verify nudge on turn_end."
trigger_phrases:
  - "pi goal context"
  - "goal-pi command"
  - "turn end verify nudge"
version: 1.0.0.0
---

# Pi Goal: input, session_start and turn_end Adapters

---

## 1. OVERVIEW

`.skilled/hooks/goal/pi/` holds the Pi adapter for the goal concern. At `input` it adds the active goal brief to the operator's prompt. At `session_start` it restores the same brief. At `turn_end` it judges the finished turn and queues a note for the next prompt when the verdict is not `met`. The adapter also registers the `/goal-pi` command.

Pi discovers the adapter through `.pi/extensions/goal-context.ts`, a single line that re-exports the default export from this folder. Pi auto-discovers every `.ts` entry in `.pi/extensions/`, so no settings registration is needed. It calls the default export once at session start with the `ExtensionAPI` handle. The default export registers `pi.on('input', ...)` and `pi.on('session_start', ...)` for the brief. It registers `pi.on('turn_end', ...)` for the verifier and `/goal-pi` with `pi.registerCommand`.

`input` and `session_start` both bind a hand-over packet once per session before they read the active record. `input` returns the operator's text with the brief added, as `{ action: 'transform', text }`. A resend reminder follows the brief when the packet's durable slice changed since the last resend. `session_start` sends the brief through `pi.sendMessage` with `triggerTurn: false`. `turn_end` builds the evidence from the tool results and the assistant message, then runs `core.verifyGoalHeuristic` and `core.recordTurn`. When the verdict is not `met`, it sends a `[goal_verify]` note with `deliverAs: 'nextTurn'`, so no turn starts and the running one is never steered.

`/goal-pi` runs `.skilled/hooks/goal/bin/goal.cjs` with `--runtime Pi`. It passes the native session id through `--session` and the workspace through `--workspace`, then notifies what the CLI printed, as info when the line starts with `STATUS=OK` and as error otherwise. An argument-less command runs `show`.

Each lifecycle handler loads `../lib/goal-core.cjs` at call time and reads the switch before anything else. The concern key is `goal`. Its switch is `OPENCODE_GOAL_DISABLED`, and `SYSTEM_HOOKS_DISABLED` is the master switch, because `isPluginDisabled` resolves through `.skilled/hooks/shared/hook-flags.cjs`. With the switch set, each handler exits at once and `/goal-pi` reports the disabled state from the CLI.

Every handler catches its own error. A failed `input` returns `{ action: 'continue' }`, so the prompt reaches Pi unchanged. A failed `session_start` or `turn_end` returns `undefined`, so no message is sent and the turn continues. The command notifies an error line when the CLI prints nothing or cannot run.

---

## 2. DIRECTORY TREE

The folder is flat. It holds no subfolder and no symlink.

| File | Responsibility |
|---|---|
| `goal-context.ts` | The adapter. It registers `/goal-pi` and the lifecycle handlers. Each handler loads `../lib/goal-core.cjs` at call time and fails open on error. |
| `goal-pi.test.mjs` | The `node --test` suite. It imports the real `goal-context.ts` and drives it through a fake Pi API, with a fresh temp state folder per case. |

---

## 3. VALIDATION

Run the command from the repository root.

```bash
node --test .skilled/hooks/goal/pi/goal-pi.test.mjs
```

Expected result: every test passes and the command exits 0.

The suite imports `goal-context.ts` through a file URL, so the real adapter file runs. It swaps in a fake `ExtensionAPI` that records handlers, the command, notifications and sent messages. Each case points `OPENCODE_GOAL_STATE_DIR` at a temp folder and removes it afterwards.

---

## 4. RELATED

- [Goal folder](../README.md): the concern README, with the core and the per-runtime table.
- [Goal core](../lib/goal-core.cjs): the core this adapter imports at call time.
- [Manage CLI](../bin/goal.cjs): the CLI behind the `/goal-pi` command.
- [Hook flags resolver](../../shared/hook-flags.cjs): the resolver that answers the concern switch.
- [Pi extensions mirror](../../../../.pi/extensions/README.md): the folder that discovers this adapter.
