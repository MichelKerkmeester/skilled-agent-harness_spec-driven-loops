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
| `append-mode-event.cjs` | Appends a validated mode event through the authorized gateway and refreshes the mode's state projection. In review mode it also records a bare `type:"iteration"` record and projects it back. A research or review iteration row is timed by the gateway clock, and a stamp the model wrote rides beside it as `claimedTimestamp`. |
| `append-state-record.cjs` | Appends a validated state record to the durable state stream. |
| `check-contract-drift.cjs` | Checks command and runtime contract surfaces for drift. |
| `check-documentation-drift.cjs` | Checks the hub README, mode READMEs and the benchmark report index against the mode registry for stale links and counts. |
| `check-direct-append.cjs` | Detects a write to a legacy state file that bypassed the gateway, once a mode's authority has moved. |
| `check-protocol-append-sites.cjs` | Fails a workflow asset that records canonical state without declaring the append gateway, or that appends directly without declaring the exception. |
| `codex-dispatch.cjs` | Runs the Codex executor dispatch boundary and records its result. |
| `compile-command-contracts.cjs` | Compiles command contract inputs into the runtime validation surface. |
| `convergence.cjs` | Computes typed convergence decisions from graph state. Under `--record-blocked-stop` it also records a blocked research stop through the append gateway. |
| `dispatch-iteration.cjs` | Dispatches one research or review iteration to a CLI executor and refuses the `native` kind, which runs through the orchestrator instead. A Claude Code dispatch validates the configured config directory before reading the prompt and passes it as `CLAUDE_CONFIG_DIR`. Every kind passes a requested sandbox mode through, so a requested `read-only` stays read-only. For codex, cursor, devin, pi and deepseek-harness an unset mode resolves to `workspace-write`. |
| `divergent-pivot.cjs` | Runs one divergent pivot transaction across process boundaries: `prepare` derives the mode's input and the missing Council seats, `record-seat` records one seat result, and `finalize` completes the pivot from disk. A first-attempt quorum failure is retryable once through a second `prepare`. |
| `fanout-merge.cjs` | Merges fan-out lineage outputs into deterministic consolidated artifacts. |
| `fanout-pool.cjs` | Provides the concurrency-capped fan-out worker pool and status ledger. |
| `fanout-run.cjs` | Runs research or review fan-out lineages through CLI subprocesses. `--status` prints a read-only per-lineage table from the run's status ledger, and `--stop` ends a live run from a second process. |
| `fanout-salvage.cjs` | Recovers missing iteration artifacts from captured subprocess output, reads each lineage's provider cost, and judges each committed pass from the lineage log against the gateway commits. |
| `frontier-admit.cjs` | Seeds, admits, prunes and closes nodes in the append-only frontier node store of an expansive run, applying the relevance, dedupe, depth, fan-out, run-wide node cap, budget and acyclicity checks in that order. The six commands are `seed`, `admit`, `close`, `graph`, `block` and `budget`: `graph` projects the store as graph events, `block` renders the FRONTIER prompt block and `budget` writes the derived seed budget into the mode config. |
| `loop-lock.cjs` | Adapts shared loop-lock acquisition, heartbeat, reclaim and release to the CLI. |
| `opencode-version.cjs` | Resolves the OpenCode binary from `$OPENCODE_BIN`, else the first `opencode` on PATH, parses `--version` into `v2` or `unknown` and refuses a dispatch on any version other than OpenCode 2. `fanout-run.cjs` uses it to build the `run` line. |
| `query.cjs` | Queries coverage gaps, contradictions and stored graph state. |
| `reduce-state.cjs` | Reduces durable state records into a current runtime projection. |
| `render-command-contract.cjs` | Renders the command contract used by validation and dispatch. |
| `score-fanout-pairs.cjs` | Reads recorded fan-out registries, prints the near-line and cross-body pair census and the merge's own decision per pair, and behind `--jev` scores that backend against the operator's labels. The merge is unchanged and the default run makes no call. Until 40 pairs carry a label, 10 of them cross-body, the run prints `stop: fewer than 40 labeled pairs` or `stop: fewer than 10 labeled cross-body pairs` and no arm runs. The `--write-pair-sheet <path>` and `--labels <file>` switches write and read the operator's pair sheet, and `--out <dir>` records every call. |
| `status.cjs` | Reports session-scoped graph health and stored row counts. |
| `synthesis-closeout.cjs` | Checks a finished research or review synthesis against its iteration state, including lineage logs, and stages the completion event for the gateway. |
| `upsert.cjs` | Stores graph nodes, edges and iteration events. |
| `workflow-steps.cjs` | Carries the multi-line step programs the research and review workflows once ran inline as `node -e` bodies, one subcommand each, so a workflow step makes one plain call: `prior-lineage`, `extend-research`, `extend-review`, `generation`, `run-open-research`, `run-open-review`, `max-duration`, `replay-legacy-review` and `refuse-single-vibe`. |
| `verify-iteration.cjs` | Validates iteration artifacts and their required evidence. |

---

## 4. PUBLIC SURFACE

The public surface is the executable script name plus its documented argument contract. Invoke a script through the runtime path and pass the required mode, session and input arguments. Internal helpers belong to the [CLI internal library](lib/README.md).

The scripts write or read durable state through the domain modules. They do not own mode semantics or consumer presentation.

A review fan-out reviews its spec folder unless `fanout-run.cjs` is given `--review-target`, with `--review-target-type` as one of `spec-folder`, `skill`, `agent`, `track` or `files`. The spec folder still owns every write. A named target with no type is treated as `files`. The workflow passes the target, the review focus and a research topic through `--review-target-file`, `--review-focus-file` and `--research-topic-file`, files it writes itself, so shell characters in the text never reach a shell. The inline flags still work, and passing both forms of one flag is refused.

One focus line reaches every lineage. To give each lineage its own angle, write a `steer.md` into its lineage folder before the run. A CLI lineage reads it before init, before each iteration and before resolving a conflict:

```text
<spec-folder>/review/lineages/<label>/steer.md

Review angle for this lineage: command workflows only.
Iteration 1 covers the create commands, iteration 2 the deep commands.
Cite every finding as path:line.
```

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
