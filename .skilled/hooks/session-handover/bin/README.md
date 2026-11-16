---
title: "Session Handover: CLI"
description: "Command-line surface for the relaunch record, from prepare and claim through consume and history, called by the wrapper and by the operator."
trigger_phrases:
  - "session handover cli"
  - "relaunch prepare claim"
  - "handoff record command"
version: 1.0.0.0
---

# Session Handover: CLI

---

## 1. OVERVIEW

`bin/` holds the two entry points for the session handover record. `session-handover.cjs` is the command-line surface that prepares, claims and consumes a note. `history-lookup.mjs` runs the history lookup command that a claim prints.

The `skilled-loop` wrapper calls the CLI on every hop. It asks `should-relaunch` for a decision and calls `consume` to read and remove the record. It calls `hand-over` once it is about to relaunch. The wrapper exits 1 when the CLI file is missing.

An operator runs the same CLI by hand. The Claude, Codex, OpenCode, Pi and Vibe adapters print its commands in their notices and seeds. A `prepare` outside a loop prints the claim command.

A malformed invocation prints the syntax it missed to stderr and exits 2. An unknown subcommand gets the full listing instead. A `prepare` outside a loop, or at the hop cap inside one, prints a manual claim command and exits 3. Every other refusal prints its reason to stderr and exits 2.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `session-handover.cjs` | The CLI. It parses arguments, validates the note and writes or removes the relaunch record. |
| `history-lookup.mjs` | The runnable entry for the printed history lookup command. It loads the history engine's build, `../history/dist/cli.js`, and passes the arguments through. |

`session-handover.cjs` exposes `prepare`, `should-relaunch`, `keep`, `claim`, `complete`, `consume`, `cancel`, `hand-over`, `history`, `window` and `session-id`. `claim` prints the note body, then the history lookup section and the goal packet when the note carries them. `consume` prints one JSON line and removes the record.

A malformed invocation prints the missing syntax to stderr and exits 2. A `prepare` outside a loop, or at the hop cap, prints the claim command and exits 3.

`should-relaunch` exits 0 to relaunch and 1 to stay. `cancel` prints `no prepared hand-over to cancel` and exits 1 when no record is waiting. `history` prints the latest hops and takes `--last <count>` to set how many. `window` prints the configured Claude context window or the settings that configure it. `session-id` prints the id used when `--session` is omitted: the Claude Code session for `prepare` and `claim`, or with `--runtime vibe` the Vibe session `skilled-loop` last saw, which only `prepare` falls back to.

`prepare` refuses a note that leaves the `Running workers:` line unanswered. Inside a loop it also refuses while the runtime still has a live shell child. `prepare` refuses when the `session-handover` concern is off and names the switch that turned it off.

`history-lookup.mjs` imports `runHistoryLookupCli` from `../history/dist/cli.js`. A core that cannot load prints `{"ok":false,"code":"core_unavailable"}` and exits 2. A call that throws prints `{"ok":false,"code":"operation_invalid"}` and exits 2.

---

## 3. VALIDATION

Run from the repository root.

```bash
node .skilled/hooks/session-handover/bin/session-handover.cjs --help; echo "exit: $?"
```

Expected result: the usage listing with every subcommand, then `exit: 0`.

---

## 4. RELATED

- [`../README.md`](../README.md): the concern README with the handoff protocol and the runtime matrix.
- [`../lib/relaunch-core.cjs`](../lib/relaunch-core.cjs): the shared state layer the CLI drives.
- [`../history/README.md`](../history/README.md): the history lookup engine `history-lookup.mjs` runs.
- [`../../../bin/skilled-loop`](../../../bin/skilled-loop): the wrapper that calls `consume` and starts the next session.
