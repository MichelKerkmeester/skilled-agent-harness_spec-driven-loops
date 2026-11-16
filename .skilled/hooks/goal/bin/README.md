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

`goal.cjs` is the manage command for runtimes with no plugin tool surface. Adapters and operators invoke it directly. It is a thin router over `../lib/goal-core.cjs` and never writes goal state itself. It parses the action and the scope flags, then calls the core for the work.

`goal.cjs` dispatches `set`, `bind`, `unbind`, `resent`, `log`, `packet` and `packet-log` to the core. `show`, `history`, `doctor`, `health`, `clear`, `complete`, `pause` and `resume` take the same route. The three legacy actions are `legacy-inspect`, `legacy-migrate` and `legacy-archive`.

A session action needs `--runtime`, `--session` and `--workspace` before it can run. The router validates that scope before any write. `set` and `bind` also accept `--budget <n>` to cap the token budget. `packet` reads a packet file and `packet-log` appends a log row to one. Neither needs a session, and the workspace defaults to the current directory when `--workspace` is absent. `doctor`, `health`, `legacy-inspect` and `legacy-archive` also run without a session scope.

Every action prints a `STATUS=OK ACTION=...` or `STATUS=FAIL ACTION=...` envelope. A failed action adds a `code=` line and sets exit status 1. A missing workspace, runtime or session id fails before any write. A leading flag no action owns, such as `--help`, fails with `UNKNOWN_ACTION`. Such a flag is a typo or a usage request, never an objective. `OPENCODE_GOAL_DISABLED=1` fails every action with `PLUGIN_DISABLED` before any work starts.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `goal.cjs` | The manage CLI. It parses the action and the scope flags, then dispatches to the core. |
| `goal.test.cjs` | The test suite. It spawns the CLI and asserts the envelope, the exit status and the state left behind. |

`goal.test.cjs` covers missing identity, per-session isolation and aggregate diagnostics. It also covers legacy inspect, migrate and archive, plus concurrent writers. An unknown leading flag, the `MISSING_WORKSPACE` gate and the workspace-free packet read are covered too. A failed assertion fails the test process with a nonzero status.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/goal/bin/goal.test.cjs
```

Expected result: every test passes.

---

## 4. RELATED

- [`../README.md`](../README.md): the goal concern, with the scope model and the state layout.
- [`./goal.cjs`](./goal.cjs): the manage CLI itself.
- [`../lib/goal-core.cjs`](../lib/goal-core.cjs): the shared core every action calls.
