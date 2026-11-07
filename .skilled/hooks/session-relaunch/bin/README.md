---
title: "Session Relaunch: CLI"
description: "Command-line surface for the relaunch record, from prepare and claim through consume and history, used by the hooks, the wrapper and the operator."
trigger_phrases:
  - "session relaunch cli"
  - "relaunch prepare claim"
  - "handoff record command"
version: 1.0.0.0
---

# Session Relaunch: CLI

---

## 1. OVERVIEW

`bin/` holds `session-relaunch.cjs`, the command-line surface for the session relaunch record. The hook output, the `skilled-loop` wrapper and an operator all call it. It prepares a handoff note, claims and completes a note, consumes a record at relaunch, calls off a prepared hand-over and prints the hop history. A malformed invocation exits 2 with the subcommand syntax, and a `prepare` that cannot arm a hop prints a manual claim command and exits 3.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`session-relaunch.cjs`](./session-relaunch.cjs) | CLI | Exposes `prepare`, `should-relaunch`, `keep`, `claim`, `complete`, `consume`, `cancel`, `hand-over` and `history`. Validates the note, writes or removes the record and prints seed or goal text where needed. | A malformed invocation prints the syntax to stderr and exits 2. A `prepare` outside a loop or at the hop cap prints the claim command and exits 3. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the handoff protocol and the runtime matrix.
- [`../lib/relaunch-core.cjs`](../lib/relaunch-core.cjs): the shared state layer the CLI drives.
- [`../../../bin/skilled-loop`](../../../bin/skilled-loop): the wrapper that calls `consume` and starts the next session.
