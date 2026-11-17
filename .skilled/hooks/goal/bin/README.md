---
title: "Goal Bin: Manage CLI"
description: "The goal.cjs router that runs goal actions through the shared core, with the stable STATUS envelope and the scope flags every session action needs."
trigger_phrases:
  - "goal manage cli"
  - "goal.cjs status envelope"
  - "session goal scope flags"
version: 1.0.0.0
---

# Goal Bin: Manage CLI

---

## 1. OVERVIEW

`.skilled/hooks/goal/bin/` holds the manage command for runtimes with no plugin tool surface, so an adapter or an operator can run a goal action from a shell. The command parses its action and its scope flags, checks the scope, then passes the work to `../lib/goal-core.cjs`. It writes no goal state of its own.

Every action ends with one status envelope on stdout, and the exit status agrees with it. A session action needs `--runtime` and `--session`, plus an explicit `--workspace`, so a caller's current directory never becomes the scope by accident. A packet read and a packet log write need no session, and without `--workspace` they use the current directory as the workspace.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────╮
│ caller: adapter or operator                   │
╰──────────────────────────────────────────────╯
                     │
                     ▼
┌──────────────────────────────────────────────┐
│ parseScopeArgs   --runtime --session ...      │
└──────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────┐
│ main   action check, switch, session scope    │
└──────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────┐
│ run<Action>   builds the envelope payload     │
└──────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────┐
│ ../lib/goal-core.cjs   record and packet      │
└──────────────────────────────────────────────┘
                     │
                     ▼
╭──────────────────────────────────────────────╮
│ STATUS line, payload lines, exit status       │
╰──────────────────────────────────────────────╯
```

The dependency runs one way. `goal.cjs` imports the core and the core owns every change. The command decides what to print. The record and the packet belong to the core.

---

## 3. FILES

| File | Responsibility |
|---|---|
| `goal.cjs` | The manage CLI. It parses the action and the scope flags, dispatches to the core and prints the envelope. |
| `goal.test.cjs` | The test suite. It asserts the envelope, the exit status and the state left behind. |

The suite covers missing identity, per-session isolation and aggregate diagnostics. It also covers legacy inspect and migration, a malformed legacy archive and concurrent writers. The unknown leading flag and the `MISSING_WORKSPACE` gate have tests of their own, and so does a packet read with no workspace flag.

Each test points `OPENCODE_GOAL_STATE_DIR` at a fresh temporary folder and removes it afterwards, so a run leaves the workspace state alone.

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | `goal.cjs` imports `../lib/goal-core.cjs` and nothing else. |
| Exports | `goal.cjs` exports `main`, `parseArgv`, `parseScopeArgs` and `parseSetArgs`. |
| State | The command writes no record. The core owns the state folder, the locks and the archive. |
| Scope | A session action needs an explicit workspace flag. |
| Switch | `OPENCODE_GOAL_DISABLED` belongs to the goal concern, and `SYSTEM_HOOKS_DISABLED` is the master switch. |

Every run applies the same checks in order:

1. A leading flag that no action owns fails with `UNKNOWN_ACTION`. `--budget` is the exception, since it can open a bare objective. Any other unrecognized token falls through to `set` as the objective.
2. A scope flag with a blank value fails with a `MISSING_` code named for that flag, such as `MISSING_SESSION_ID`.
3. The goal switch fails the run with `PLUGIN_DISABLED`. `OPENCODE_GOAL_DISABLED=1` is one value that sets it.
4. A session action without `--workspace` fails with `MISSING_WORKSPACE`. That check runs before the runtime namespace and the session id are read.
5. The action reaches its handler, which prints the envelope.

A run prints one of two envelopes:

```text
STATUS=OK ACTION=<action>
mutation=<change>
<key>=<value>
```

```text
STATUS=FAIL ACTION=<action> ERROR="<message>"
code=<code>
```

An OK envelope carries the `mutation=` line only when the action changed state, and its payload follows as `key=value` lines. A failure always adds the `code=` line and sets exit status 1. Free-text values use JSON string quoting, so a newline inside a message or an objective cannot forge a payload line.

---

## 5. ENTRYPOINTS

Run the script from the repository root. The first token that is not a scope flag is the action.

```bash
node .skilled/hooks/goal/bin/goal.cjs show --runtime <name> --session <id> --workspace <root>
```

Expected output when that session has no stored goal:

```text
STATUS=OK ACTION=show
goal_present=false
store_health=no_active_goal
```

A missing workspace prints the failure envelope with `code=MISSING_WORKSPACE` and exits 1. `set` and `bind` accept `--budget` with a positive integer. Any other value fails with `INVALID_TOKEN_BUDGET`.

| Action | Effect | Session |
|---|---|---|
| `set` | Stores the objective for the session and replaces any earlier one. | required |
| `bind` | Points the session at a packet `goal.md` and records the token budget. | required |
| `unbind` | Drops the packet pointer and keeps the record. | required |
| `resent` | Records that the packet slice was sent again. | required |
| `log` | Appends a log row to the packet the session is bound to. | required |
| `packet` | Prints the slices of a packet `goal.md` with their budget state. | no |
| `packet-log` | Appends a log row to a packet `goal.md` with no record. | no |
| `show` | Prints the record for the session, or marks that none is stored. | required |
| `clear` | Removes the session record and archives it first when one exists. | required |
| `complete` | Marks the goal complete and archives the record. The active file is removed. | required |
| `pause` | Marks an active goal paused and stores the trailing words as a reason. | required |
| `resume` | Returns a paused goal to active. | required |
| `history` | Lists the archived records. | required |
| `doctor` | Prints the state folder path and its counts. It also reports the legacy status and the switch state. | no |
| `health` | The same report as `doctor`. | no |
| `legacy-inspect` | Reports the legacy state file and its status. A valid file also prints the stored id and objective. | no |
| `legacy-migrate` | Converts the legacy record into a record for the session. | required |
| `legacy-archive` | Moves the legacy state file into the archive. | no |

---

## 6. VALIDATION

```bash
node --test .skilled/hooks/goal/bin/goal.test.cjs
```

Expected result: the summary reports `pass 10` and `fail 0`, with exit status 0. The suite starts the CLI as a child process, so it checks the stream a caller reads.

---

## 7. RELATED

- [Goal hooks](../README.md): the runtime coverage table and the state directory.
- [Shared hook resolver](../../shared/README.md): how a concern switch and the master switch resolve.
- [Hooks overview](../../README.md): the coverage matrix and the kill-switch index.
- [Core module](../lib/goal-core.cjs): the functions this command calls for records and packets.
