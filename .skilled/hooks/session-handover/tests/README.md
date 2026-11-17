---
title: "Session handover tests: node test suites for the handover hooks"
description: "Node test files and captured runtime payloads that cover the session handover hooks, the handoff protocol, the killer process and the skilled-loop wrapper."
trigger_phrases:
  - "session handover tests"
  - "relaunch loop test suite"
  - "session handover fixtures"
  - "killer test harness"
version: 1.0.0.0
---

# Session handover tests: node test suites for the handover hooks

---

## 1. OVERVIEW

`tests/` holds the `node:test` suites for the session handover hooks in `../`. One suite drives one concern: a runtime adapter, the core state model, the killer process, the command line entry or the wrapper that starts each runtime.

A suite runs without a live agent runtime. It builds a temporary root, writes a repository and the runtime directory the hooks resolve there, then removes the root in a cleanup hook. An adapter case spawns the hook with a captured payload and a sandbox environment, then reads the JSON it prints and the state file it wrote.

Current state:

- `fixtures/` supplies the captured payloads, so an adapter sees the shape its runtime sends.
- Every sandbox drops the inherited relaunch switches and `HOOK_FLAGS_CONFIG` before it sets its own. A switch exported in your shell cannot decide a case.
- The suites never install hooks into this repository. They start the hook files directly.

---

## 2. ARCHITECTURE

Every suite follows the same run path.

```text
╭──────────────────────────────────────────╮
│ node --test                              │
╰──────────────────┬───────────────────────╯
                   ▼
┌──────────────────────────────────────────┐
│ tests/<concern>.test.cjs                 │
└──────────────────┬───────────────────────┘
                   ▼
┌──────────────────────────────────────────┐
│ sandbox root                             │
│ repository and runtime directory         │
└──────────────────┬───────────────────────┘
                   ▼
┌──────────────────────────────────────────┐
│ hook, CLI or wrapper child process       │
└──────────────────┬───────────────────────┘
                   ▼
┌──────────────────────────────────────────┐
│ stdout JSON and state file               │
└──────────────────────────────────────────┘
```

The case asserts against the last box. The wrapper suites place a stub binary in the sandbox `PATH`, so a hop replays without a real runtime.

---

## 3. DIRECTORY TREE

```text
tests/
+-- *.test.cjs                        # One suite per concern
+-- skilled-loop-wrapper-harness.cjs  # Sandbox and runtime stubs for the wrapper suites
+-- fixtures/                         # Captured payloads and sandbox helpers
`-- README.md
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `adapter-conformance.test.cjs` | Runs one table of seed, nudge and arm cases through the Claude, Codex and OpenCode adapters. |
| `claude-adapters.test.cjs` | Covers the Claude hooks for the context nudge, the stop arm, the prompt seed and the compact pointer. |
| `codex-adapters.test.cjs` | Covers the same hooks for Codex and checks that each registered event maps to a unique adapter. |
| `context-usage.test.cjs` | Covers the usage readers for Claude, Codex, OpenCode, Pi and Vibe, plus the window resolution. |
| `goal-handover.test.cjs` | Checks `renderGoalSlice` against the real goal command in a throwaway checkout. |
| `history-lookup-entry.test.cjs` | Covers the history lookup entry, its refusal codes and the offer gate. |
| `hop-history.test.cjs` | Covers the history lines a hand-over, a claim, a completion and a keep write. |
| `killer.test.cjs` | Covers the killer process: the ancestor walk, the locks, the takeover and the signal refusals. |
| `nudge.test.cjs` | Covers the handoff text, the seed prefix and the threshold rules. |
| `relaunch-core.test.cjs` | Covers the state paths and the functions `arm`, `unarm`, `shouldRelaunch`, `completeHandoff`, `dropNestedLoop`. |
| `session-handover-cli.test.cjs` | Covers the subcommands, the exit codes and the refusals. |
| `skilled-loop-shell.test.cjs` | Covers the shell shim under bash and zsh, with a terminal and without one. |
| `skilled-loop-wrapper-claim-goal.test.cjs` | Covers the claim state, the withdrawn hand-overs and the goal packets. |
| `skilled-loop-wrapper-decline-manual.test.cjs` | Covers the exit codes, the declined hops and the printed manual command. |
| `skilled-loop-wrapper-harness.cjs` | Holds the sandbox and the runtime stubs that the four wrapper suites load. |
| `skilled-loop-wrapper-launch-arguments.test.cjs` | Covers the first launch and the arguments a hop replays on each runtime. |
| `skilled-loop-wrapper-model-effort.test.cjs` | Covers the model, effort and runtime options a hop carries. |
| `subagent-guard.test.cjs` | Covers the guard that denies lifecycle commands from a sub-agent and the question dialog. |
| `vibe-adapters.test.cjs` | Covers the Vibe hooks for turn start, post tool, withdrawal and turn end. |
| `withdraw.test.cjs` | Covers the shared helper that disarms a record and writes its history line. |
| `fixtures/` | Holds the captured payloads and the sandbox helpers the suites read. |

The adapter suites drive the hook files under the runtime folders beside this one. The core suites load modules from `../lib/`. The wrapper suites run `.skilled/bin/skilled-loop`.

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | The suites load hook modules from `../` and payload helpers from `fixtures/`. No hook imports a file from `tests/`. |
| Ownership | A case for one adapter belongs beside the other cases for that adapter. A payload more than one suite reads belongs in `fixtures/`. |
| State | A case writes under the sandbox root only. The cleanup hook removes that root when the case ends. |

`fixtures/relaunch-env.cjs` builds the dropped switch names from `../../../shared/hook-flags.cjs`, so a new alias is dropped without a test edit. Every test file loads that helper directly or through the shared wrapper helper, except `history-lookup-entry.test.cjs`, which needs no runtime environment.

A fixture is read by name. Renaming one breaks the suite that reads it.

---

## 6. VALIDATION

Run from the repository root.

```bash
env -u AI_SESSION_CHILD -u SKILLED_LOOP_CLAIM_SEED node --test .skilled/hooks/session-handover/tests/*.test.cjs .opencode/plugins/tests/session-handover.test.cjs
```

Expected result: exit 0, with `pass` equal to `tests` and every other count at zero. A full run reported:

```text
ℹ tests 1130
ℹ pass 1130
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
```

The count grows as cases are added, so the zeros are the invariant.

The `env -u` prefix matters. A shell inside `skilled-loop` can carry `SKILLED_LOOP_CLAIM_SEED`, and a dispatched child carries `AI_SESSION_CHILD`. A dispatched child owns no hand-over. The nudge cases then see no text and the run fails.

Run one file while you work on the history lookup entry:

```bash
env -u AI_SESSION_CHILD -u SKILLED_LOOP_CLAIM_SEED node --test .skilled/hooks/session-handover/tests/history-lookup-entry.test.cjs
```

Expected result: exit 0. The summary reports `ℹ tests 4` and `ℹ pass 4`, with zero for the other counts.

The Pi extension runs under vitest:

```bash
env -u AI_SESSION_CHILD -u SKILLED_LOOP_CLAIM_SEED ./.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-handover/pi/session-handover.test.ts
```

Expected result: `Test Files 1 passed (1)` and `Tests 69 passed (69)`.

The shim cases add a pseudo-terminal run when `script(1)` exists. They skip when it is absent.

---

## 7. RELATED

- [Session handover](../README.md): the hook overview and the switches these suites set.
- [Session handover CLI](../bin/session-handover.cjs): the entry the CLI cases call.
- [Test fixtures](fixtures/README.md): the payloads and helpers in this folder.
- [Pi extension suite](../pi/session-handover.test.ts): the vitest suite for the Pi extension.
- [OpenCode plugin suite](../../../../.opencode/plugins/tests/session-handover.test.cjs): the plugin's own suite, which the full run includes.
- [Hooks library](../../README.md): the other hook concerns beside this one.
