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

`goal/bin/` holds the manage command for runtimes with no plugin tool surface. `goal.cjs` is a thin router over `../lib/goal-core.cjs` and never writes goal state itself. It parses the action and the scope flags, validates the scope when an action needs a session and calls the core for the work. `goal.test.cjs` covers that contract.

Session actions require `--runtime`, `--session` and `--workspace`. `set` and `bind` also accept `--budget <n>`. The packet reads `packet` and `packet-log` need only `--workspace`, and `doctor`, `health`, `legacy-inspect` and `legacy-archive` run without a session scope. A failed action prints `STATUS=FAIL`, a `code=` line and sets exit status 1. A leading flag no action owns, such as `--help`, fails with `UNKNOWN_ACTION` instead of becoming an objective.

---

## 2. WHAT EACH FILE DOES

| File | Event | What it does | On error |
|---|---|---|---|
| `goal.cjs` | Invoked by adapters and operators | Parses the action and scope, then dispatches to the core for `set`, `bind`, `unbind`, `resent`, `log`, `packet`, `packet-log`, `show`, `history`, `doctor`, `health`, `clear`, `complete`, `pause`, `resume` and the three legacy actions. Prints the `STATUS=OK ACTION=...` or `STATUS=FAIL ACTION=...` envelope. | Prints `STATUS=FAIL` with a stable `code=` and exits 1. A missing workspace, runtime or session id fails before any write. |
| `goal.test.cjs` | `node --test` | Covers missing identity, per-session isolation, aggregate diagnostics, legacy inspect, migrate and archive, concurrent writers, an unknown leading flag, the `MISSING_WORKSPACE` gate and the workspace-free packet read. | A failed assertion fails the test process with a nonzero status. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern index, with the scope model and the state layout.
- [`./goal.cjs`](./goal.cjs): the manage CLI itself.
- [`../lib/goal-core.cjs`](../lib/goal-core.cjs): the shared core every action calls.
