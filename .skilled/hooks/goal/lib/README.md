---
title: "Goal Lib: Shared Core and Packet Slices"
description: "The runtime-neutral goal engine every adapter calls, and the one module that draws the packet goal.md boundary for the core and the OpenCode plugin."
trigger_phrases:
  - "goal core"
  - "goal slice"
  - "packet goal frontmatter"
version: 1.0.0.0
---

# Goal Lib: Shared Core and Packet Slices

---

## 1. OVERVIEW

`.skilled/hooks/goal/lib/` holds the shared goal engine. `goal-core.cjs` owns the session scope, the stored record, the lifecycle, the steering block and packet binding. `goal-slice.cjs` owns every read of a packet's `goal.md`.

The runtime adapters for Cursor, Devin, DSH, Pi and Vibe require the core. The manage CLI does the same. The OpenCode plugin loads both modules.

Current state:

- A record is keyed by the session scope, so two sessions in one repository keep separate goals.
- A bound session renders from the packet file on every turn, never from the copy stored at bind time.
- A read fails open and returns `null`. A mutation throws `GoalError` with a stable code.
- Neither module writes to stdout or stderr.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                     goal/lib: goal engine                        │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────────┐
│ Callers            │
│ runtime adapters   │
│ manage CLI         │
│ OpenCode plugin    │
└─────────┬──────────┘
          │
          ▼
┌──────────────────────┐       ┌──────────────────────┐
│ goal-core.cjs        │──────▶│ state directory      │
│ scope, record,       │       │ record and archive   │
│ render, verify       │       │                      │
└─────────┬────────────┘       └──────────────────────┘
          │
          ▼
┌──────────────────────┐
│ goal-slice.cjs       │
│ packet reads,        │
│ projections          │
└─────────┬────────────┘
          │
          ▼
┌──────────────────────┐
│ packet goal.md       │
│ slices and log       │
└──────────────────────┘

Dependency direction: goal-core.cjs ───▶ goal-slice.cjs
```

The arrow between the modules runs one way. `goal-core.cjs` imports `goal-slice.cjs`. The slice module imports Node builtins only, so it loads on its own. The OpenCode plugin calls the slice module directly, which keeps one boundary for the packet text.

---

## 3. FILES

| File | Responsibility |
|---|---|
| `goal-core.cjs` | Session scope, stored record, lifecycle, steering block and packet binding. |
| `goal-slice.cjs` | Packet `goal.md` reads, the frontmatter boundary and every projection. |
| `goal-core.test.cjs` | `node --test` suite for the core, including the CLI envelope. |
| `goal-slice.test.cjs` | `node --test` suite for the slices and the budget. |

`goal-core.cjs` writes a JSON record at mode 0600 by renaming a flushed temp file into place. Each scope mutation holds a lock directory keyed to the scope. A lock waits up to 10 seconds and clears one older than 120 seconds.

`goal-slice.cjs` splits a document at the frontmatter fence. It stops the durable slice at the log anchor and drops the markup from the chat copy. A packet path or a `goal.md` link that resolves outside the workspace reads as unbound.

`goal-core.test.cjs` covers state isolation, concurrent writers, archive on clear and the render template. It also drives the manage CLI. `goal-slice.test.cjs` covers the frontmatter leak, slice stability, symlink escape and the budget rules.

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Node builtins. The core also imports `./goal-slice.cjs` and `../../shared/hook-flags.cjs`. The slice module imports Node builtins only. |
| Writes | The core writes the session record and its archive. It also appends a packet log row. The slice module writes nothing. |
| Reads | The slice module reads a packet `goal.md`, its `spec.md` level and the spec kit manifest. An unreadable path reads as unbound. |
| Ownership | Session state belongs in `goal-core.cjs`. A rule about packet text belongs in `goal-slice.cjs`. |
| Output | No stdout and no stderr. A caller gets a value or a thrown `GoalError`. |

Every state path comes from one scope. The core hashes the session identity into an opaque key. The workspace and runtime also form part of the scope. The default root is `.skilled/skills/.state/goal/` under the repository. `OPENCODE_GOAL_STATE_DIR` moves it. An explicit `stateDir` option wins over the variable.

The goal concern has its own switch. `OPENCODE_GOAL_DISABLED` makes a mutation throw `PLUGIN_DISABLED` before it writes. `showGoal` still reads the record under the switch, but the manage CLI fails every action with `PLUGIN_DISABLED` before it runs, `show` included. The shared resolver also honors `SYSTEM_HOOKS_DISABLED` and the legacy alias `OPENCODE_GOAL_PLUGIN_DISABLED`.

A packet log row locks on the packet's real path under the repository state root, not under the record store. Two sessions that keep records in different directories still queue on one log.

Main flow for a bound session:

```text
╭──────────────────────────────────────────╮
│ adapter reads the record for the scope   │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ readGoalRecord                           │
│ no record → no brief                     │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ resolvePacketGoal                        │
│ packet gone → no brief, no stored copy   │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ readPacketGoal                           │
│ slice text and hash                      │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ renderGoalBrief                          │
│ active block or compact fallback         │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ caller injects the block                 │
╰──────────────────────────────────────────╯
```

A content edit above the log changes the slice hash, so `resendPending` turns true until `noteResent` stores the new hash. A reflow or a trailing newline does not, because the hash collapses whitespace first. A log row never changes the hash. `appendPacketLog` refuses a write that would.

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `resolveGoalScope(options)` | Function | Hashes the scope into the record and archive paths. |
| `readGoalRecord(options)` | Function | Returns this scope's record, `null` when nothing reads. |
| `renderGoalBrief({ goal, runtimeLabel, maxChars, workspace })` | Function | Builds the `[active_goal]` block. A goal that is not active returns an empty string. |
| `verifyGoalHeuristic({ goal, transcriptText, assistantText })` | Function | Scores the evidence and returns a verdict with its reason. |
| `bindGoal(input, options)` | Function | Points a session at a packet and throws `PACKET_GOAL_NOT_FOUND` when no document reads. |
| `describePacketGoal(packetPath, options)` | Function | Returns the slices and the budget state without a session record. |
| `readPacketGoal(workspace, packetPath)` | Function | Returns the packet projections with the slice hash, `null` when the packet does not read. |
| `appendPacketLog({ workspace, packetPath, item, state, evidence })` | Function | Appends one row under the log anchor. |
| `renderResendReminder(goal, workspace, options)` | Function | Returns the `goal_resend_pending` line while the packet sits ahead of the last resend. |

The injection block has a default cap of 4800 characters. Above that cap, `renderGoalBrief` falls back to a shorter block with fewer field lines.

The core also exports the lifecycle calls `setGoal`, `completeGoal`, `pauseGoal`, `resumeGoal` and `clearGoal`, plus the legacy quarantine calls. The manage CLI, [the goal router](../bin/goal.cjs), turns an action name into one of these calls.

---

## 6. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/goal/lib/goal-slice.test.cjs .skilled/hooks/goal/lib/goal-core.test.cjs
```

Expected result: `pass 123` and `fail 0` in the summary, with exit status 0.

A failed assertion fails the test process with a nonzero status. Both suites build their fixtures in a temp directory, so a run never touches the real state tree.

---

## 7. RELATED

- [The goal hooks README](../README.md) covers the runtime matrix and the state layout.
- [The manage CLI](../bin/README.md) turns an action name into a core call.
- [The goal adapter tests](../tests/README.md) cover the DSH wrappers and the CLI bridge.
- [The hooks library](../../README.md) lists every hook folder.
