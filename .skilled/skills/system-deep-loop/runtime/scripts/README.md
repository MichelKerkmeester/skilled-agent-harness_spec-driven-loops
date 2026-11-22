---
title: "runtime scripts"
description: "CLI entry points and shared script modules for deep-loop runtime operations and durable state transitions."
trigger_phrases:
  - "deep-loop runtime scripts"
  - "runtime CLI entry points"
---

# runtime / scripts

---

## 1. OVERVIEW

This folder contains the CommonJS scripts for graph operations, state reduction, convergence, executor dispatch, fan-out and loop locking. Most are CLI entry points. Each one validates its command boundary and emits the documented result or exit code.

Many scripts delegate domain behavior to `../lib/`. Some carry their domain logic in place, such as `fanout-run.cjs`, `reduce-state.cjs`, `convergence.cjs` and `fanout-merge.cjs`. Some have no CLI entry and are shared script-side modules: `fanout-pool.cjs`, `fanout-salvage.cjs`, `opencode-version.cjs` and `runtime-bootstrap.cjs`. Deep-loop mode workflows consume the scripts.

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
| `append-mode-event.cjs` | Appends a validated mode event through the authorized gateway and refreshes the mode's state projection. In review mode it also records a bare `type:"iteration"` record and projects it back. A research or review iteration row is timed by the gateway clock, and a stamp the model wrote rides beside it as `claimedTimestamp`. A legacy research or review row's event id, idempotency key, producer and epoch are minted by the gateway, never taken from the row. A reused key with other content exits 2 and writes the reason to stderr. |
| `append-state-record.cjs` | Appends a validated state record, read from stdin, to the state log named as its one argument. It restamps `timestamp` with the append time and keeps a differing claimed time as `reportedTimestamp`. It refuses an iteration record without a positive integer `iteration`. It refuses a target that resolves outside the working directory, directly or through a symlink, before anything is written. A missing, flag-shaped or surplus target exits 2. An escaping target, an empty record, invalid JSON or a refused iteration record exits 1. |
| `check-contract-drift.cjs` | Checks command and runtime contract surfaces for drift. |
| `check-documentation-drift.cjs` | Checks the hub README, mode READMEs and the benchmark report index against the mode registry for stale links and counts. |
| `check-direct-append.cjs` | Detects a write to a legacy state file that bypassed the gateway, once a mode's authority has moved. |
| `check-ledger-stem-producers.cjs` | Holds each mode's ledger stem census to the emitters on disk in both directions: every emitted stem must be registered and declared spoken, and every stem declared spoken must have a real emitter. It matches the structured `stem` key a producer writes, not prose mentions. Takes `[--repo-root <path>]`, prints a JSON result and exits 0 when clean, 2 on violations and 1 on a bad argument or script error. |
| `check-projection-coverage.cjs` | Reads the legacy projection manifest as text and checks that every `disposition:'project'` surface is backed by an exported contract factory or declared as uncovered. It splits the uncovered set into mode-owned and infrastructure surfaces. Takes `[--dir <runtime-root>]`, prints a JSON result and exits 0 when clean, 2 on violations or an unknown option and 1 on a script error. |
| `check-protocol-append-sites.cjs` | Fails a workflow asset that records canonical state without declaring the append gateway, or that appends directly without declaring the exception. |
| `codex-dispatch.cjs` | Runs the Codex executor dispatch boundary and records its result. |
| `compile-command-contracts.cjs` | Compiles command contract inputs into the runtime validation surface. |
| `convergence.cjs` | Computes typed convergence decisions from graph state. Under `--record-blocked-stop` it also records a blocked research or review stop through the append gateway. `--read-only` opens the graph database read-only and records no observability event and no snapshot, and it cannot be combined with `--record-blocked-stop`. |
| `dispatch-iteration.cjs` | Dispatches one research or review iteration to a CLI executor and refuses the `native` kind, which runs through the orchestrator instead. A Claude Code dispatch validates the configured config directory before reading the prompt and passes it as `CLAUDE_CONFIG_DIR`. Every kind except cli-opencode passes a requested sandbox mode through, so a requested `read-only` stays read-only. cli-opencode refuses `read-only`, because its Bash tool can write anywhere and no read-only boundary exists. For codex, cursor, devin, pi, opencode and deepseek-harness an unset mode resolves to `workspace-write`. Every kind it dispatches builds its command through `buildLineageCommand`. The child's stdout streams to the iteration's `.out` log under the artifact dir's iterations folder rather than a memory buffer, so a long run cannot overflow a capture cap. The log is masked like a fan-out lineage log once the runner has read it, and an earlier attempt's log is kept under the next free number. Claude logs stream-json and writes its session cost to a cost JSON file beside that log, an unset Claude or codex model resolves to `CLAUDE_DEFAULT_MODEL` or `CODEX_DEFAULT_MODEL`, and a missing binary is refused before any receipt is written. That refusal, and an artifact dir outside the git worktree, exit 64 like a bad flag, with the message and no stack trace. |
| `divergent-pivot.cjs` | Runs one divergent pivot transaction across process boundaries: `prepare` derives the mode's input and the missing Council seats, `record-seat` records one seat result, and `finalize` completes the pivot from disk. A first-attempt quorum failure is retryable once through a second `prepare`. |
| `fanout-merge.cjs` | Merges fan-out lineage outputs into deterministic consolidated artifacts. |
| `fanout-pool.cjs` | Provides the concurrency-capped fan-out worker pool and status ledger. |
| `fanout-run.cjs` | Runs research or review fan-out lineages through CLI subprocesses. `--status` prints a read-only per-lineage table from the run's status ledger, and `--stop` ends a live run from a second process. |
| `fanout-salvage.cjs` | Recovers missing iteration artifacts from captured subprocess output, reads each lineage's provider cost, and judges each committed pass from the lineage log against the gateway commits. |
| `frontier-admit.cjs` | Seeds, admits, prunes and closes nodes in the append-only frontier node store of an expansive run, applying the relevance, dedupe, depth, fan-out, run-wide node cap, budget and acyclicity checks in that order. The seven commands are `seed`, `admit`, `close`, `graph`, `block`, `budget` and `scope`: `graph` projects the store as graph events, `block` renders the FRONTIER prompt block, `budget` writes the derived seed budget into the mode config and `scope` records the files a commit-range review target touches as the review config's `reviewScopeFiles`. |
| `iteration-graph-upsert.cjs` | Persists the graph events one research iteration declared, plus the evidence its finding rows carry, by calling `upsert.cjs`. The iteration's delta file is the source when it exists, because the state log does not carry `graphEvents`. An iteration with no graph events and no finding rows is skipped with exit 0. Takes `--delta-dir`, `--state-log`, `--iteration`, `--spec-folder` and `--session-id`, and exits 64 on a usage error. |
| `loop-heartbeat.cjs` | Writes the single-loop telemetry row for a research run's `started`, `progress` or `terminal` phase to the status ledger, appending only when its `state_hash` changed. It mirrors the row to the packet's `observability-events.jsonl` on a best-effort basis, with the execution mode in the producer name. Every phase requires `--status-ledger`, `--packet-dir`, `--timestamp`, `--session-id` and `--execution-mode auto\|confirm`, plus its own phase flags, and refuses a flag the phase does not take. A usage error exits 64. |
| `loop-lock.cjs` | Adapts shared loop-lock acquisition, heartbeat, reclaim and release to the CLI. |
| `opencode-version.cjs` | Resolves the OpenCode binary from `$OPENCODE_BIN`, else the first `opencode` on PATH, parses `--version` into `v2` or `unknown` and refuses a dispatch on any version other than OpenCode 2. `fanout-run.cjs` uses it to build the `run` line. |
| `query.cjs` | Queries coverage gaps, contradictions and stored graph state. |
| `reduce-state.cjs` | Reduces durable state records into a current runtime projection. |
| `render-command-contract.cjs` | Renders the command contract used by validation and dispatch. |
| `review-verdict.cjs` | Derives the verdict a review stops on from loop state: a remaining P0 or a failed required gate is `FAIL`, a remaining P1 or open search debt is `CONDITIONAL` and anything else is `PASS` with `has_advisories` set when P2 findings remain. It reads `--registry-path` and `--state-log`, or takes counts a merge already bound through `--active-p0`, `--active-p1`, `--active-p2`, `--search-debt` and `--failed-gate-ids`. Prints JSON and exits 2 on any error. |
| `run-now-sentinel.cjs` | Handles the research loop's one-shot run-now sentinel. `check` stages a requested event at the loop boundary. A paused loop then stages a rejection and leaves the sentinel in place. Otherwise `check` claims the sentinel and stages an accepted event. `restore` stages a restored event when the sentinel was recreated after this run was accepted. Both hand the staged events to `append-mode-event.cjs` rather than writing beside the state log. Both require `--sentinel`, `--state-log`, `--session-id`, `--generation` and `--run`, and `check` also requires `--pause-sentinel`. A usage error exits 64. |
| `runtime-bootstrap.cjs` | Shared process-boot helpers with no CLI entry. `tsxChildEnv` builds the environment for an entrypoint's tsx re-exec with `NODE_PRESERVE_SYMLINKS` removed. `resolveContainmentRepoRoot` picks the write-containment root from `DEEP_LOOP_REPO_ROOT`, the worktree that holds the artifact or the working directory. It also exports `realpathSafe` and `isSubpath`. |
| `score-fanout-pairs.cjs` | Reads recorded fan-out registries, prints the near-line and cross-body pair census and the merge's own decision per pair, and behind `--jev` scores that backend against the operator's labels. The merge is unchanged and the default run makes no call. Until 40 pairs carry a label, 10 of them cross-body, the run prints `stop: fewer than 40 labeled pairs` or `stop: fewer than 10 labeled cross-body pairs` and no arm runs. The `--write-pair-sheet <path>` and `--labels <file>` switches write and read the operator's pair sheet, and `--out <dir>` records every call. |
| `status.cjs` | Reports session-scoped graph health and stored row counts. |
| `synthesis-closeout.cjs` | Checks a finished research or review synthesis against its iteration state, including lineage logs, and stages the completion event for the gateway. |
| `terminal-gates.cjs` | Computes a stopping review's three terminal gates, `evidence`, `scope` and `coverage`, from its config, state log and finding registry, each row carrying a digest of the summary it was decided from. A failed gate is reported, not an error. An absent registry file means no recorded findings. Takes `--config-path`, `--state-log` and `[--registry-path]`, prints JSON and exits 2 on any error. |
| `upsert.cjs` | Stores graph nodes, edges and iteration events. |
| `workflow-steps.cjs` | Carries the multi-line step programs the research and review workflows once ran inline as `node -e` bodies, one subcommand each, so a workflow step makes one plain call: `prior-lineage`, `extend-research`, `extend-review`, `generation`, `run-open-research`, `run-open-review`, `max-duration`, `replay-legacy-review` and `refuse-single-vibe`. A malformed state-log line is skipped with a warning on stderr, and a read failure other than a missing file fails the step. |
| `verify-authority.cjs` | Read-only verifier that reads each mode's `authority-<mode>.json` record straight from disk, independent of the flip runner. A missing record is reported as source `default` and an unparsable one as `malformed`. Takes `[--authority-root <path>]` and prints JSON with `allOnLedger`. Exits 0 when every mode is on the ledger with the dark writer, 2 when one is not and 1 on a script error. |
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

Scripts are the command boundary between mode workflow YAML and the runtime spine. They normalize input, call the appropriate library module or run the logic they carry, preserve structured output and map failures to stable exit behavior.

Fan-out scripts additionally own subprocess coordination and salvage. State and graph ownership remains in the library modules and database layer.

`fanout-run.cjs`, `reduce-state.cjs`, `convergence.cjs` and `fanout-merge.cjs` are a reviewed exception to single responsibility. Each carries several concerns in one file, and `fanout-run.cjs` holds budget, Vibe, status-table and watchdog logic side by side. Their exports are imported widely across the test suite and other scripts, so a split would move a wide surface with no defect behind it. A concern moves into `../lib/` when a change touches that concern.

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
