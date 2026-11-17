---
title: "Session Handover Library: Shared Relaunch Logic"
description: "Shared state, nudge text, usage readers, killer supervision, hop history, goal hand-over and withdrawal logic behind every relaunch adapter."
trigger_phrases:
  - "session handover core"
  - "relaunch record state"
  - "hop history log"
version: 1.0.0.0
---

# Session Handover Library: Shared Relaunch Logic

---

## 1. OVERVIEW

`.skilled/hooks/session-handover/lib/` holds the code that the session handover adapters and the CLI load. The `skilled-loop` wrapper loads it too. `relaunch-core.cjs` owns the handoff note format, the relaunch record and the per-user state directory. The other modules build on it and add nudge text, context usage readers, goal slice rendering, hop history, the detached killer and the withdrawal helper.

Current state:

- Every module is CommonJS and loads without an external package.
- No module writes to stdout, so each caller owns its printed output. `readRelaunchFile` writes one stderr line when the state directory is not a real directory owned by the current user.
- Handoff notes live in the repository's session handover state folder, and the hop history sits beside them.
- Relaunch records and nudge state live in a per-user runtime directory, under `XDG_RUNTIME_DIR` when it is set.

---

## 2. ARCHITECTURE

The adapters and the CLI enter at the top. `nudge.cjs` turns a context ratio into text and keeps the per-session nudge level. `relaunch-core.cjs` validates notes and moves records under a lock. `hop-history.cjs` records each hop beside the notes. `killer.cjs` watches an armed record and ends the idle session. `withdraw.cjs` disarms a prepared hand-over, grants one more nudge and writes the history line. `goal-handover.cjs` renders the next session's goal slice, and `context-usage.cjs` reads the fill a runtime records.

```text
╭──────────────────────────────────────────────────────────────╮
│                    session-handover/lib/                     │
╰──────────────────────────────────────────────────────────────╯

┌──────────────────────┐
│ Adapters and the CLI │
└──────────┬───────────┘
           │
           ├────────────────────▶ ┌─────────────────────┐
           │                      │ context-usage.cjs   │
           │                      │ fill and window     │
           │                      └─────────────────────┘
           ▼
┌──────────────────────┐         ┌─────────────────────┐
│ nudge.cjs            │ ──────▶ │ relaunch-core.cjs   │
│ text and nudge state │         │ notes and records   │
└──────────┬───────────┘         └──────────┬──────────┘
           │                                │
           ▼                                ▼
┌──────────────────────┐         ┌─────────────────────┐
│ hop-history.cjs      │         │ per-user state dir  │
│ goal-handover.cjs    │         │ relaunch records    │
│ withdraw.cjs         │         │ and nudge state     │
│ killer.cjs           │         └─────────────────────┘
└──────────────────────┘
```

Modules load downwards. `withdraw.cjs`, `killer.cjs`, `hop-history.cjs` and `goal-handover.cjs` build on `nudge.cjs`, which builds on `relaunch-core.cjs`. `context-usage.cjs` loads no local module, and the core loads it lazily when it reads a session's model.

---

## 3. FILES

| File | Responsibility |
|---|---|
| `context-usage.cjs` | Reads context fill from the transcript or journal a runtime writes. Adds the token fields Pi and OpenCode pass in, resolves the window and returns the fill ratio. |
| `goal-handover.cjs` | Runs the goal command for a packet and returns the `chat_slice` it prints when the packet budget is `ok`. A slice over 4,000 characters is refused. So is one that carries frontmatter or comment markup, and every refusal is one line. |
| `hop-history.cjs` | Appends one tab-separated line per hop event to the history file beside the handoff notes. A hand-over, a claim, a finished note, a timeout, a kept note and a withdrawal each write their own line. Reads the latest lines and lists the notes still open. It sends the macOS notice only when `SESSION_HANDOVER_NOTIFY_HOPS` is on. |
| `killer.cjs` | The detached process a runtime stop hook starts. When it gets a transcript, it waits for the transcript to go idle. It then checks the armed record, declines one that is stale or at the hop cap, and signals the target runtime with `SIGTERM`. On timeout it disarms the record and raises a macOS notice with the manual claim command. |
| `nudge.cjs` | Builds the nudge text and the claim seed the next session starts on. It also builds the text for a note a withdrawal left stale. Resolves the threshold and the hop cap, and reads or writes the per-session nudge level. The nudge claim it takes lets one racing hook deliver. |
| `relaunch-core.cjs` | Parses and validates handoff notes, and moves relaunch records through their states under a lock. Resolves the per-user state directory and the goal packet a note carries. Provides the append lock and the log helper. It also walks the process table for the killer and the arm paths. |
| `withdraw.cjs` | Disarms a prepared hand-over under the record lock. Grants one more nudge and writes a `withdrawn` history line. Exposes `withdrawOnPrompt` for a runtime prompt hook. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | The adapter folders and the wrapper load these modules. No module here loads an adapter or an external package. |
| Exports | Each file exports functions. The core, `nudge.cjs`, `hop-history.cjs` and `goal-handover.cjs` also export constants. Printed output belongs to the caller. |
| Ownership | The note format, record state, locks and process checks belong here. Runtime registration belongs to the runtime configuration. |

### Note and record states

An open note carries flat frontmatter and four Markdown sections. `validateHandoff` checks the note before any caller writes relaunch state. Claiming a note sets `claimed`, and completing it sets `done`. Both writes hold the note's append lock. The claim's lock is what stops two sessions from claiming one note.

A relaunch record starts `pending` and becomes `armed`. `arm` accepts only a pending or armed record, and `unarm` stamps a reason. `shouldRelaunch` refuses a record that is stale or at the hop cap, with defaults of 10 minutes and 10 hops. A record disarmed by a cancel or by a prompt reports `withdrawn`, so the wrapper does not offer a manual claim for work the session kept.

### Withdrawal

`withdrawHandOver` disarms the record under the state lock, then asks `nudge.cjs` for one more nudge and has `hop-history.cjs` write a `withdrawn` line. A failure in either follow-up reaches the caller's `onError` and leaves the disarm in place. `withdrawOnPrompt` is the form a prompt hook calls. It logs `context-nudge-error` instead of throwing and returns whether a hand-over was withdrawn.

In one hop, a nudge asks for a note, `preparePending` writes a pending record, the runtime stop arms it, and `killer.cjs` ends the idle session so the wrapper can start a fresh one.

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `preparePending`, `arm` | Functions in `relaunch-core.cjs` | Write a pending record, then arm it once the runtime stops. |
| `claimHandoff`, `completeHandoff` | Functions in `relaunch-core.cjs` | Claim an open note for the new session, then close it when the work is done. |
| `withdrawHandOver`, `withdrawOnPrompt` | Functions in `withdraw.cjs` | Disarm a prepared hand-over from the CLI or from a prompt hook. |
| `renderGoalSlice` | Function in `goal-handover.cjs` | Render the packet slice a receiver starts on. |
| `main` | Function in `killer.cjs` | Run the detached killer with `--loop-id` and `--target-pid`. |

The command line entry is the [session handover CLI](../bin/session-handover.cjs). It parses arguments and calls `preparePending`, `claimHandoff`, `completeHandoff` and `withdrawHandOver` before it prints their result. The stop hooks call `arm` and start the killer's `main`, a prompt hook calls `withdrawOnPrompt` and the wrapper calls `renderGoalSlice`.

---

## 6. VALIDATION

Run both checks from the repository root.

```bash
for file in .skilled/hooks/session-handover/lib/*.cjs; do node --check "$file"; done
```

Expected result: no output and exit 0.

```bash
node --test .skilled/hooks/session-handover/tests/relaunch-core.test.cjs
```

Expected result: the run exits 0 and the summary shows `fail 0`, `cancelled 0`, `skipped 0` and `todo 0`. The [test suite guide](../tests/README.md) lists the commands for the other modules.

---

## 7. RELATED

- [Session handover](../README.md): the concern overview, runtime coverage and switches.
- [Session handover CLI](../bin/README.md): the commands that drive this library.
- [Session handover tests](../tests/README.md): the suites that cover these modules.
- [Goal command](../../goal/bin/goal.cjs): the command `goal-handover.cjs` runs for a packet.
