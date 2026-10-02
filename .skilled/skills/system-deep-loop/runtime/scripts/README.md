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
| `check-documentation-drift.cjs` | Checks the hub README, mode READMEs, the council playbook and the benchmark report index against the mode registry for stale links and counts. |
| `check-direct-append.cjs` | Detects a write to a legacy state file that bypassed the gateway, once a mode's authority has moved. |
| `check-protocol-append-sites.cjs` | Fails a workflow asset that records canonical state without declaring the append gateway, or that appends directly without declaring the exception. |
| `codex-dispatch.cjs` | Runs the Codex executor dispatch boundary and records its result. |
| `compile-command-contracts.cjs` | Compiles command contract inputs into the runtime validation surface. |
| `convergence.cjs` | Computes typed convergence decisions from graph state. |
| `fanout-merge.cjs` | Merges fan-out lineage outputs into deterministic consolidated artifacts. |
| `fanout-pool.cjs` | Provides the concurrency-capped fan-out worker pool and status ledger. |
| `fanout-run.cjs` | Runs research or review fan-out lineages through CLI subprocesses. |
| `fanout-salvage.cjs` | Recovers missing iteration artifacts from captured subprocess output. |
| `loop-lock.cjs` | Adapts shared loop-lock acquisition, heartbeat, reclaim and release to the CLI. |
| `query.cjs` | Queries coverage gaps, contradictions and stored graph state. |
| `reduce-state.cjs` | Reduces durable state records into a current runtime projection. |
| `render-command-contract.cjs` | Renders the command contract used by validation and dispatch. |
| `score-fanout-pairs.cjs` | Reads recorded fan-out registries, prints the near-line and cross-body pair census and the merge's own decision per pair, and behind `--jev` scores that backend against the operator's labels. The merge is unchanged and the default run makes no call. Until 40 pairs carry a label, 10 of them cross-body, the run prints `stop: fewer than 40 labeled pairs` or `stop: fewer than 10 labeled cross-body pairs` and no arm runs. The `--write-pair-sheet <path>` and `--labels <file>` switches write and read the operator's pair sheet, and `--out <dir>` records every call. |
| `score-severity-replay.cjs` | Measures offline whether a Jev severity choice would separate real P0 findings from false ones better than the recorded severity, with no model call by default and no severity change. The `--write-label-sheet <path>` and `--labels <file>` switches write and read the operator's label sheet, `--jev` opens the rating arm behind the label gate, and `--out <dir>` records every call. |
| `score-stop-hint.cjs` | Replays one stop-rater report offline and prints per-column hint counts and one Keep-Rule verdict per column past its label gate, with no model call in any mode. The `--rater-report <dir>` switch names the report to read, `--jev` adds the rater's recorded column, and `--out <dir>` writes the run's report. |
| `score-stop-rater.cjs` | Replays recorded deep-research stop decisions offline against gold derived from the delta files, with no model call by default. The `--jev` switch opens a rating arm and `--gold-reads <file>` supplies the confirmed reads that gate it. |
| `status.cjs` | Reports session-scoped graph health and stored row counts. |
| `synthesis-closeout.cjs` | Checks a finished research or review synthesis against its iteration state, including lineage logs, and stages the completion event for the gateway. |
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
.skilled/skills/system-deep-loop/runtime/node_modules/.bin/vitest run --config .skilled/skills/system-deep-loop/runtime/vitest.config.ts
```

---

## 7. RELATED

- [Runtime overview](../README.md)
- [CLI internal library](lib/README.md)
- [Runtime tests](../tests/README.md)
- [Script interface contract](../references/script-interface-contract.md)
