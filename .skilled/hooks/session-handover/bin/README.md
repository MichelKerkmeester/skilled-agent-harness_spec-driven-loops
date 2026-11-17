---
title: "Session Handover CLI: Commands for the Relaunch Record"
description: "Command-line surface for the relaunch record, from prepare and claim through consume and history, called by the wrapper and by the operator."
trigger_phrases:
  - "session handover cli"
  - "relaunch prepare claim"
  - "handoff record command"
version: 1.0.0.0
---

# Session Handover CLI: Commands for the Relaunch Record

---

## 1. OVERVIEW

`.skilled/hooks/session-handover/bin/` holds the command line for the session handover record. `session-handover.cjs` parses the arguments and runs one subcommand, then prints the result. `history-lookup.mjs` runs the read-only history command that a claim prints.

`skilled-loop` calls the CLI for each hop. It asks `should-relaunch` for a decision and reads the record with `consume`. Once it is about to relaunch, it calls `hand-over`. The wrapper exits 1 when the CLI file is missing.

Current state:

- The CLI prints its result to stdout and sets an exit code. A refusal goes to stderr with the reason.
- An operator runs the same file by hand. `prepare` outside a loop and `keep` both print a claim command for the operator.
- Note format and record state live in `../lib/relaunch-core.cjs`. The only parsing here is two small frontmatter fallbacks, one that prints a claimed note's body and one that recovers `spec_folder` from a broken note.

---

## 2. ARCHITECTURE

`main` reads the first argument and answers help before it dispatches. The note and record subcommands call `../lib/relaunch-core.cjs` for state. `keep` calls `../lib/nudge.cjs` for its printed claim and complete commands, and `claim` calls it for the complete command. `prepare` builds its manual claim command in `../lib/relaunch-core.cjs`. `../lib/hop-history.cjs` writes the history lines and `../lib/withdraw.cjs` disarms a prepared hand-over. `../../shared/hook-flags.cjs` decides whether the concern is on. `../lib/context-usage.cjs` answers the `window` command.

```text
╭──────────────────────────────────────────────────────────╮
│                  session-handover/bin/                   │
╰──────────────────────────────────────────────────────────╯

┌─────────────────────────────┐
│ skilled-loop wrapper        │
└──────────────┬──────────────┘
               │ hop commands
               ▼
┌─────────────────────────────┐
│ session-handover.cjs        │
│ main and one subcommand     │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ ../lib/relaunch-core.cjs    │
│ ../lib/nudge.cjs            │
│ ../lib/hop-history.cjs      │
│ ../lib/withdraw.cjs         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ handoff note and record     │
└─────────────────────────────┘
```

---

## 3. FILES

The folder is flat, so this table is its complete inventory.

| File | Responsibility |
|---|---|
| `session-handover.cjs` | The CLI. It parses the arguments and dispatches one subcommand, then prints the result and sets the exit code. |
| `history-lookup.mjs` | The entry the printed history lookup command runs. It loads `../history/dist/cli.js` and passes the arguments through. |

`history-lookup.mjs` reports both failures as one JSON line on stdout. A core that cannot load prints `{"ok":false,"code":"core_unavailable"}` and exits 2. A call that throws prints `{"ok":false,"code":"operation_invalid"}` and exits 2.

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | `session-handover.cjs` loads `../lib/relaunch-core.cjs` and `../lib/nudge.cjs`. It also loads `../lib/hop-history.cjs` and `../lib/withdraw.cjs`. The switch resolver is `../../shared/hook-flags.cjs`. `window` loads `../lib/context-usage.cjs` when it runs. |
| Exports | `session-handover.cjs` exports `main`, which takes an argument list and returns the exit code. `history-lookup.mjs` exports nothing and sets `process.exitCode`. |
| Ownership | Argument parsing, printed text and exit codes belong in this folder. Note format, record state and locks stay in `../lib/relaunch-core.cjs`. |
| Notes | A subcommand that takes a handoff path refuses one outside the session handover handoffs directory. |

`prepare` reads the `session-handover` concern before it touches the note. A concern that is off stops the command with a message that names the switch. No record is written. Outside Claude Code the concern is off unless a switch turns it on. `SYSTEM_SESSION_HANDOVER_ENABLED` turns it on for a runtime that sets no switch of its own. `SYSTEM_SESSION_HANDOVER_<RUNTIME>_ENABLED` sets one runtime. The master switch is `SYSTEM_HOOKS_DISABLED`.

### One hop

```text
╭──────────────────────────────────────────╮
│ session writes a handoff note            │
╰──────────────────────────────────────────╯
                     │
                     ▼
┌──────────────────────────────────────────┐
│ prepare checks the note and writes a     │
│ pending record                           │
└──────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────┐
│ the runtime's hand-off hook arms it      │
└──────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────┐
│ should-relaunch prints the decision      │
└──────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────┐
│ consume removes the record and           │
│ prints the note path                     │
└──────────────────────────────────────────┘
                     │
                     ▼
╭──────────────────────────────────────────╮
│ a fresh session claims the note          │
╰──────────────────────────────────────────╯
```

### Exit codes

| Code | Meaning |
|---|---|
| 0 | The command finished. Help also exits 0. |
| 1 | `should-relaunch` decided to stay or `cancel` found no prepared hand-over. |
| 2 | A refusal or a malformed invocation. The reason goes to stderr. |
| 3 | `prepare` printed the claim command instead of arming a record. |

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `node .skilled/hooks/session-handover/bin/session-handover.cjs <command> [options]` | CLI | Runs one subcommand from a terminal. |
| `main` | Function | Runs one subcommand from an argument list and returns its exit code. |
| `history-lookup.mjs` | Module | Runs the history lookup the claim prints. |

### Commands

| Command | Effect |
|---|---|
| `prepare --handoff <handoff-path> [--session <session-id>] [--runtime <runtime>]` | Checks the note and writes the pending record for the runtime's hand-off hook to arm. Claude and Codex arm it on `Stop`, Pi on `agent_settled`, Vibe after its agent turn and OpenCode on idle. A runtime that only runs the manual handoff command has no arm hook, so its session ends by hand. Outside a loop or at the hop cap, it prints the claim command and exits 3. |
| `should-relaunch --loop-id <loop-id>` | Prints the relaunch decision as JSON. Exit 0 means relaunch, exit 1 means stay. |
| `keep --handoff <handoff-path> [--session <session-id>] [--runtime <runtime>]` | For a session outside the loop. It records the note in the hop history and prints the claim command to run after auto-compaction. |
| `claim <handoff-path> [--session <session-id>]` | Marks the note claimed and prints its body. The rest of the output adds the complete command and the goal packet when the note carries one. When the sender's session can be located, the claim mints a fresh history locator and adds the lookup section. |
| `complete <handoff-path>` | Marks a claimed note done. |
| `consume --loop-id <loop-id>` | Removes the relaunch record under its lock and prints one JSON line. That line names the note and its spec folder, plus the note state. It adds the goal packet when the note carries one. |
| `cancel [--loop-id <loop-id>]` | Disarms this loop's prepared hand-over and leaves the note open. The loop id defaults to `SKILLED_LOOP_ID`. |
| `hand-over --handoff <handoff-path> [--hop <hop>] [--runtime <runtime>]` | Records the hand-over line when the note is open. Its desktop notice shows only when `SESSION_HANDOVER_NOTIFY_HOPS` is on. It prints nothing. |
| `history [--last <count>]` | Prints the latest hops, 20 by default. |
| `session-id [--runtime <runtime>]` | Prints the session id `prepare` uses when `--session` is omitted. With `claude` it reads `CLAUDE_CODE_SESSION_ID`. With `vibe` it reads the session `skilled-loop` recorded. |
| `window` | Prints the configured Claude context window or the settings needed to configure it. |

`prepare` refuses a note that leaves the `Running workers:` line out or one whose line says neither `none` nor a `pid <digits>` entry. Inside a loop it also refuses while the runtime still has a live shell child. `keep` refuses a session that runs under `skilled-loop` and points at `prepare`.

A malformed invocation exits 2 with the reason on stderr. An argument the parser rejects also prints the syntax it expected. An unknown subcommand gets the full listing instead. `--help` and `-h` print that listing and exit 0.

---

## 6. VALIDATION

Run both commands from the repository root.

```bash
node .skilled/hooks/session-handover/bin/session-handover.cjs --help
```

Expected result: the usage listing with every subcommand. The command exits 0.

```bash
node --test .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs
```

Expected result: the run exits 0 and the summary shows `fail 0`. The history lookup entry has its own suite at `../tests/history-lookup-entry.test.cjs`.

---

## 7. RELATED

- [Session handover](../README.md): the concern overview with the handoff protocol and the runtime matrix.
- [Session handover library](../lib/README.md): the note and record layer this CLI drives.
- [Session handover tests](../tests/README.md): every suite that covers these files.
- [History lookup engine](../history/README.md): the engine `history-lookup.mjs` runs.
- [skilled-loop](../../../bin/skilled-loop): the wrapper that calls `consume` and `hand-over`.
