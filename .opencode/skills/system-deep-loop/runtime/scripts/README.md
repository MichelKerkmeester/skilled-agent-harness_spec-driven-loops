---
title: "runtime scripts"
description: "CLI entry points for deep-loop runtime operations and durable state transitions."
trigger_phrases:
  - "deep-loop runtime scripts"
  - "runtime CLI entry points"
---

# runtime / scripts

---

## 1. OVERVIEW

This folder contains the CommonJS CLI entry points for graph operations, state reduction, convergence, executor dispatch, fan-out and loop locking. Each script validates its command boundary, delegates domain behavior to `../lib/` and emits the documented result or exit code.

The scripts are consumed by deep-loop mode workflows. They are adapters, not a second domain library.

---

## 2. DIRECTORY TREE

```text
scripts/
└── lib/
```

The `lib/` child contains CLI-only guards and writer-lock helpers.

---

## 3. FILES

| File | Responsibility |
|---|---|
| `append-state-record.cjs` | Appends a validated state record to the durable state stream. |
| `check-contract-drift.cjs` | Checks command and runtime contract surfaces for drift. |
| `codex-dispatch.cjs` | Runs the Codex executor dispatch boundary and records its result. |
| `compile-command-contracts.cjs` | Compiles command contract inputs into the runtime validation surface. |
| `convergence.cjs` | Computes typed convergence decisions from graph state. |
| `fanout-merge.cjs` | Merges fan-out lineage outputs into deterministic consolidated artifacts. |
| `fanout-pool.cjs` | Provides the concurrency-capped fan-out worker pool and status ledger. |
| `fanout-run.cjs` | Runs research or review fan-out lineages through CLI subprocesses. |
| `fanout-salvage.cjs` | Recovers missing iteration artifacts from captured subprocess output. |
| `loop-lock.cjs` | Adapts shared loop-lock acquisition, heartbeat, reclaim and release to the CLI. |
| `query.cjs` | Queries coverage gaps, contradictions and stored graph state. |
| `reduce-alignment-state.cjs` | Reduces alignment state records into the mode projection. |
| `reduce-state.cjs` | Reduces durable state records into a current runtime projection. |
| `render-command-contract.cjs` | Renders the command contract used by validation and dispatch. |
| `status.cjs` | Reports session-scoped graph health and stored row counts. |
| `upsert.cjs` | Stores graph nodes, edges and iteration events. |
| `verify-iteration.cjs` | Validates iteration artifacts and their required evidence. |

---

## 4. PUBLIC SURFACE

The public surface is the executable script name plus its documented argument contract. Invoke a script through the runtime path and pass the required mode, session and input arguments. Internal helpers belong to the [CLI internal library](lib/README.md).

The scripts write or read durable state through the domain modules. They do not own mode semantics or consumer presentation.

---

## 5. SPINE ROLE

Scripts are the command boundary between mode workflow YAML and the runtime spine. They normalize input, call the appropriate library module, preserve structured output and map failures to stable exit behavior.

Fan-out scripts additionally own subprocess coordination and salvage. State and graph ownership remains in the library modules and database layer.

---

## 6. VALIDATION

From the repository root, run a script with its documented arguments or run the runtime test suite.

```bash
.opencode/skills/system-deep-loop/runtime/node_modules/.bin/vitest run --config .opencode/skills/system-deep-loop/runtime/vitest.config.ts
```

---

## 7. RELATED

- [Runtime overview](../README.md)
- [CLI internal library](lib/README.md)
- [Runtime tests](../tests/README.md)
- [Script interface contract](../references/script-interface-contract.md)
