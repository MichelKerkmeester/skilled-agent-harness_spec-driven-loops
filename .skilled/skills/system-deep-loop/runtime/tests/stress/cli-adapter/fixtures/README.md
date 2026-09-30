---
title: "fixtures: Hermetic Adapter, Process and Worktree Fixtures"
description: "Shared setup and teardown helpers that build hermetic shim environments, bounded child processes and isolated git worktrees for the CLI adapter stress suites."
trigger_phrases:
  - "cli adapter stress fixtures"
  - "hermetic adapter shim fixture"
  - "bounded process fixture"
---

# fixtures: Hermetic Adapter, Process and Worktree Fixtures

---

## 1. OVERVIEW

`fixtures/` owns the shared setup and teardown helpers that the CLI adapter stress suites run against. It builds temporary directories, installs the hermetic stand-in binaries from `../shims/`, starts bounded child processes, creates throwaway git worktrees and probes live dependencies before an opt-in probe runs.

Current state:

- Every helper returns a fixture object with its paths, environment and a `cleanup()` that removes the temporary root.
- No helper reaches a provider network or a real adapter binary. Adapter runs resolve the shim through a `PATH` that puts the fixture `bin/` directory first.
- A shim run receives `CLI_ADAPTER_SHIM_MODE`, `CLI_ADAPTER_SHIM_CAPTURE` and `CLI_ADAPTER_SHIM_PID_FILE` in its environment and in a control file under its private `HOME`, so a case can select a behavior mode and then read back what the child saw.
- Adapter shim environments carry `AI_SESSION_CHILD=1` and `SYSTEM_SPEC_GATE_ENFORCE=0`.
- Assertions stay in the sibling `*.vitest.ts` suites. These files build state, read it back and remove it.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `adapter-fixture.ts` | Declares the six adapter kinds with their binary names and models, builds a temporary shim `bin/` directory per kind, reads back captured argv, stdin, cwd and environment plus recorded pids, runs a fan-out through `runtime/scripts/fanout-run.cjs`, and reports adapter binary availability together with the live opt-in gate. |
| `adapter-suite.ts` | Factory that registers one adapter subject as a Vitest suite. Holds the shared matrix integrity, adapter contract, fixture integrity and live probe tests, builds the per-kind command, environment and expected flags, and removes fixtures, worktrees and leftover pids after each test. |
| `codex-fixture.ts` | Builds the codex shim environment by installing `codex-shim.cjs` as both `codex` and `pkill`, reads a single codex capture, swaps `process.env` around an operation, and writes the lineage artifact tree that a completed lineage is expected to leave behind. |
| `live-preflight.ts` | Gives the codex live probe its opt-in gate, a self-invocation guard against a `CODEX_` runtime variable, a dependency isolation check on `runtime/node_modules`, a binary presence check and a `codex login status` check. |
| `process-fixture.ts` | Spawns a command in its own process group under a timeout, escalates from SIGTERM to SIGKILL after a grace period, collects descendant pids from `ps` and from a descendant pid file, and reports status, signal, output, timeout state and elapsed time. Also exposes a pid liveness probe. |
| `worktree-fixture.ts` | Creates a throwaway git repository with two detached worktrees that each hold their own `node_modules`, provides realpath containment checks, takes an exclusive ownership claim on a lock path and returns both `node_modules` realpaths. |

---

## 3. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Node builtins, shim files under `../shims/`, the deep-loop executor config and audit libraries, and the sibling matrix manifest. `vitest` is imported only by `adapter-suite.ts`. |
| Exports | Fixture factories, capture readers, the bounded process runner and the suite factory. Nothing here asserts behavior. |
| Ownership | Temporary state, shim installation, process reaping and worktree setup belong here. Expected flags, diagnostics and matrix bindings belong to the sibling suites and to `../matrix-manifest.ts`. |
| Environment | Each shim run gets a private `HOME`, a `PATH` with the fixture `bin/` directory first, and the shim control variables. Live probe flags stay unset unless a case opts in. |

Main flow:

```text
a sibling *.vitest.ts suite
              │
              ▼
adapter-suite.ts builds the per-kind command and environment
              │
              ├──▶ adapter-fixture.ts installs the shim and starts the fan-out
              │
              ├──▶ process-fixture.ts runs a bounded child and reaps its tree
              │
              ├──▶ worktree-fixture.ts supplies isolated working directories
              │
              └──▶ live-preflight.ts decides whether the opt-in probe may run
              │
              ▼
capture files, pid files and lineage artifacts are read back, then removed
```

---

## 4. RELATED

- [`cli-adapter` suite README](../README.md)
- [`matrix-manifest.ts`](../matrix-manifest.ts)
- [`shims`](../shims/README.md)
