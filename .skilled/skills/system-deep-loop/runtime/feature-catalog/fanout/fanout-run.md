---
title: "Fan-out CLI lineage driver"
description: "TSX-bootstrapped entry point that spawns N headless CLI subprocesses (opencode, claude, opencode), each running the full loop in an isolated `lineages/{label}/` sub-packet, with per-kind state-dir isolation and a post-subprocess salvage sweep."
trigger_phrases:
  - "fan-out cli lineage driver"
  - "fanout-run.cjs"
  - "spawn fanout lineages"
  - "per-kind state-dir isolation"
  - "cli subprocess fanout dispatch"
version: 1.4.18.0
---

# Fan-out CLI lineage driver

---

## 1. OVERVIEW

`fanout-run.cjs` bridges the pool primitive and the actual CLI executor subprocesses. It
parses the fanout config JSON, filters to CLI lineages (native lineages are handled by the
YAML `step_fanout_spawn_native` agent dispatch), creates `{base}/lineages/{label}/` and
`{label}/.executor-state/` directories per lineage, builds a "run the full loop" prompt,
constructs the per-kind CLI command (`opencode run` + stdin, `claude -p`, `opencode run` +
`</dev/null`), sets
`SPECKIT_FANOUT_LINEAGE_ID={label}` and `SPECKIT_<KIND>_STATE_DIR={stateDir}` environment
variables to prevent same-kind replica lockfile collisions, runs via `spawnSync` with a
generous timeout, saves subprocess stdout to `{lineageDir}/logs/fanout-lineage.out`, then
calls `runSalvageSweep` from `fanout-salvage.cjs`.

### Why This Matters

Dispatches every CLI executor fan-out lineage. If this drifts, parallel research/review
runs can produce mis-isolated sub-packets, lose the per-kind state-dir isolation, or miss
the post-subprocess salvage step.

---

## 2. HOW IT WORKS

Fully shipped. Supports every CLI executor kind (`EXECUTOR_KINDS` in `lib/deep-loop/executor-config.ts`): `cli-codex`, `cli-claude-code`, `cli-opencode`, `cli-cursor`, `cli-devin`, `cli-pi`, and `cli-deepseek-harness` (experimental).
Per-lineage subprocess timeout = `min(iterations *
timeoutSeconds * 2, 4h)`. TSX bootstrap (mirrors `convergence.cjs` pattern) ensures
TypeScript imports (`parseFanoutConfig`, `expandLineages`) resolve in the CJS context. Exit
codes: 0=all ok, 2=some failed, 3=all failed or refused before start. A research or review
matrix that expands to one lineage is refused with exit 3 before any lineage directory or
process exists, unless `--only-lineage` names its label. `--only-lineage LABEL`, space-separated and not `=`, reruns one lineage of the
unedited matrix and keeps the budget and frontier share it had in the full run; a label outside
the matrix, or the flag with no label, is refused. Before spawning, the runner skips a lineage whose config is `complete` and
whose report and iterations are on disk, records `skipped_complete` in the status ledger and
spawns nothing for it, under `--only-lineage` too, so a forced rerun needs that lineage's
`lineages/<label>/` folder archived first. This pre-spawn check needs only one iteration under the
convergence policy. A lineage that recorded a terminal stop row must also pass the stop-reason
and cap checks the post-attempt check applies to that row; only a lineage with no terminal row is
skipped on its config and artifacts alone. The post-attempt check stays strict. A finished lineage
is skipped only for the run it finished under: when its recorded `topic` (research) or `reviewTarget`
(review), or the executor fields in its `invocation-metadata.json` (kind, model, effort, tier,
sandbox, permission and web search, not the executable path or version), differ from this run's,
the whole run is refused with exit 3 and reason `finished_lineage_mismatch`, before any spawn,
ledger mark or summary write, with a message naming each mismatched lineage and `--restart`. One
mismatch refuses every lineage, because the merge reads every lineage folder and a partial refusal
would mix old results with new ones. A side that recorded no value is not judged on it.

A `cli-deepseek-harness` lineage is built by `buildDshLineageCommand`. It first checks that
`dsh --version` prints the pinned release, running that probe in a throwaway home outside the
checkout. It then maps the model to one of the two route patches in `.dsh/patches/` and adds
the lineage patch, an optional persona patch and the guards patch, which is required. A lineage
that names `code_mode` in `liveTools.mcpServers` also gets the MCP patch. The prompt goes in on
stdin, the cwd is the lineage directory and every lineage gets a fresh `DSH_HOME`.
`validateDshCompletion` passes a run only when it exits 0, ends on a `final` event whose reason
is `completed`, and its stderr has no "did not activate" line. That line is the only sign of a
guards bundle that failed to load.

The driver also carries an optional per-lineage progress-heartbeat gauge.
`startLineageProgressHeartbeat` emits periodic progress events at the configured cadence so a
long-running lineage stays operator-readable. The cadence comes from the
`progressHeartbeatSeconds` config field, whose committed default is **60 seconds**, so the
gauge is on unless a caller sets it to 0.

That default is load-bearing rather than cosmetic. The heartbeat appends to the
orchestrator's own ledgers *while a lineage is dispatched*, which is what makes those
files change inside every containment window — the reason they are named as
orchestrator-owned exemptions rather than left to be attributed to whichever leaf was
running. Reading this default as "opt-in, therefore usually absent" is what made that
failure look impossible on a single-lineage run.

Every lineage subprocess gets `DEEP_LOOP_COVERAGE_DB_DIR` set to `graph-db/` inside its own
lineage directory, for every depth mode. The coverage graph store otherwise defaults to the
shared runtime database, which sits outside the lineage write surface, so a leaf that honors
the write limit would skip every graph step. Each CLI lineage keeps its coverage graph in
its own `graph-db/`.

The workflow hands the research topic, review focus and review target to the runner as files
through `--research-topic-file`, `--review-focus-file` and `--review-target-file`, so shell
characters in operator text never reach a shell. The inline flags still work, and passing both
forms of one flag is refused with a usage error.

### Expansive Depth

`--depth-mode` takes `default` or `expansive`, and `normalizeDepthMode` refuses any other value
with exit 3. A run without the flag is unchanged.

Under `expansive`, `partitionFrontierNodes` reads `frontier-nodes.jsonl` in the base artifact
dir, keeps the depth-1 nodes that are `open` or `active`, sorts them by node id by UTF-16 code
unit rather than locale collation, and deals them round-robin across the lineage labels. The same seed therefore always gives each lineage the
same share. The split is written to `orchestration-summary.json` as `frontier_partition`, a map
from lineage label to node ids, which the merge's partition guard reads.

Before a lineage spawns, `writeLineageFrontierStore` writes its share to
`{lineageDir}/frontier-nodes.jsonl`. It writes only when the lineage has no store yet and its
share is not empty, so a resumed lineage keeps the nodes it already closed. A research lineage
also gets one `inbox.jsonl` row per node. The inbox is written before the store, which marks the
lineage as seeded, so a failed inbox write leaves no store and the next spawn attempt seeds both.
A review lineage gets no inbox, because its nodes reach
the leaf through the FRONTIER block.

`depthMode` and the lineage's node ids reach the lineage through its prompt.
`buildLoopPrompt` adds `config.depthMode: expansive` and a `frontier_scope` binding that lists
the lineage's node ids, or `none`. A review lineage also gets `frontier_scope` in its review
setup bindings. A leaf-contract line tells a research or review lineage to work its
`frontier_scope` nodes and to propose children only as `frontier_proposal` delta rows.
`buildNativeCommandInput` adds `--depth-mode=expansive`, `depth_mode: expansive` and the same
`frontier_scope` line.

For an expansive research or review run, `expansiveLineageBudgets` sets each lineage's
iteration count. A matrix `iterations` value is explicit and always kept. A lineage with no
matrix value is sized from its own seed share by `expansiveBudget` in `frontier-admit.cjs`.
The floor is the loop default that lineage would otherwise run: 12 for a native lineage, and
`LOOP_DEFAULT_MAX_ITERATIONS` for a CLI lineage, 7 for review and 10 for research. A lineage
dealt no seed node runs at that floor. A lineage with a share runs
`min(24, max(floor, 2 × perNode × (share + 2)))` iterations, where `perNode` is 4 for review
(the canonical four dimensions) and 1 for research, and `share + 2` comes from the default
`maxDepth` of 3. `expansiveLineageBudgetNotes` writes one stderr line per derived budget and a
warning when there are more lineages than open seed nodes.

### Completion, Preview and Diagnostics

`--preview` builds every lineage command without writing: it prints the redacted argv (each prompt replaced by its digest), cwd, session id, iterations, frontier scope, the Claude config dir when set and the model, reasoning effort and sandbox mode, then exits before any directory, ledger or store exists. In `effective_config`, `permissionMode` is the value the command passes after `--permission-mode`, or null for a kind that passes none (cli-codex, cli-cursor, cli-opencode, cli-pi), `sandboxEnforcement` is `preventive` when the executor's own confinement is on, `compensating` when the builder emits a non-OS restriction and otherwise `none`, and `effortApplied` is `flag`, `baked` (dsh, whose route patch sets the effort) or `none`. The preview JSON also carries `dry_run_halt`, the `child-spawn` halt event for `step_fanout_spawn` that the workflow prints when a dry run halts there, and `topic_digest`, the SHA-256 of the collapsed research topic, null for review. A `cli-mistral-vibe` lineage prints no command, and a matrix the real run would refuse prints that refusal.

The preview's `aggregate_budget` carries a `units` legend for its cost numbers. `upper_bound.estimated_cost_units` is the sum of every lineage's `base_cost_units`, one attempt each, and it is the spend the aggregate cap gates on. A lineage's `base_cost_units` is its iterations times the cost units per iteration for one attempt, and its own `estimated_cost_units` is `base_cost_units x (retries + 1)`, the worst case if every retry runs, which is reported and never gated.

A lineage counts as fulfilled only when its state log holds at least one iteration, a terminal stop row from this attempt (`terminal_gates` for review, a closeout synthesis row for research, where `synthesis_incomplete` does not count), every iteration row before that terminal row in the file, and no row whose stamp carries an explicit zone stamped more than two minutes after the lineage process ended; iteration stamps are written by the model, so they are never compared with the terminal row's stamp. A research lineage writes no stop-check row, so its closeout row must also carry a `stopReason` from the frozen lifecycle enum, and a `maxIterationsReached` stop must have recorded as many distinct iterations as the `maxIterations` cap in the lineage's own config; the failures are `missing_stop_reason`, `unknown_stop_reason` and `max_iterations_unproven`, which an unreadable cap also yields. Review keeps its gate-row check, and the lenient pre-spawn skip check is unchanged. Otherwise it fails even at exit 0. The executor-group `--sandbox-mode` maps to `sandboxMode`. A `cli-claude-code` lineage keeps `workspace-write`, which runs `acceptEdits` and cannot run Bash in `-p` mode, so the runner warns at launch, and if that lineage records nothing its failure names `--sandbox-mode=danger-full-access`; `cli-opencode` accepts only `danger-full-access` explicitly.

A fatally failed lineage prints one stderr line at once with its label and failure class. Provider ids, URLs and emails are masked in the ledger, stderr, a rotated log and a fatally failed lineage's raw log. A rerun rotates the previous raw log to `logs/fanout-lineage.N.out` instead of overwriting it. The runner has no settle-time metadata refresh, so a research or review fan-out never rewrites the packet's `description.json` or `graph-metadata.json`, and `--no-metadata-refresh` is refused as an unknown option.

The stdout summary and `orchestration-summary.json` carry `lineages`, one `{label, status, failure_class, exit_code, rerun_command}` row per lineage. `status` is `succeeded`, `skipped_complete` or `failed`. A failed lineage's `failure_class` is its class, or `exit` when the failure names none, and its `rerun_command` is the run's own argv, with any earlier `--only-lineage` pair dropped, plus `--only-lineage LABEL`, so the lineage keeps its share of the matrix. The runner path in it is absolute and the other arguments stay as given, so run it from the original working directory. A succeeded or `skipped_complete` lineage has a null `failure_class` and no rerun command, because a rerun would skip it as finished. A failed lineage whose config is `complete` cannot be rerun in place either, so its `rerun_command` is null and a `rerun_note` says to archive its `lineages/<label>/` folder first and names the command to run after.

`orchestration-summary.json` carries `provider_cost_usd: {total, by_lineage}`, each CLI lineage's provider cost in USD summed from the `step_finish` records of its live and rotated logs. A log with no cost record, such as a cli-claude-code lineage's text log, makes that lineage's cost null (unknown), and the total stays null while any lineage is unknown.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `scripts/fanout-run.cjs` | Main entry: CLI arg parsing, per-kind command construction, pool orchestration, stdout capture and salvage call, plus the per-lineage progress heartbeat via `startLineageProgressHeartbeat`; expansive depth via `normalizeDepthMode`, `partitionFrontierNodes`, `writeLineageFrontierStore`, `expansiveLineageBudgets` and `expansiveLineageBudgetNotes`; per-lineage `DEEP_LOOP_COVERAGE_DB_DIR` |
| `scripts/frontier-admit.cjs` | `readNodeStore`, `expansiveBudget` and `LOOP_DEFAULT_MAX_ITERATIONS` used for the frontier partition and lineage budgets |
| `scripts/fanout-salvage.cjs` | Called post-subprocess for write-failure recovery |
| `scripts/fanout-pool.cjs` | `runCappedPool` for concurrency cap + ledger |
| `lib/deep-loop/executor-config.ts` | `parseFanoutConfig`, `expandLineages` imported via TSX |
| `lib/deep-loop/lineage-timestamp-window.ts` | Post-attempt completion check, including the research stop-reason evidence |
| `lib/deep-loop/executor-audit.ts` | `EXECUTOR_STATE_ENV_BY_KIND` constants for per-kind state dir naming |

### Validation

| File | Role |
|---|---|
| `tests/unit/fanout-run.vitest.ts` | Native-only config returns early (no pool spawn), bad JSON config exits 3, missing required args exits 3, 2-lineage pool creates distinct dirs + ledger + summary, same-kind replica state dirs are distinct |
| `tests/unit/fanout-run.vitest.ts` | Expansive depth groups: `expansive depth frontier` (the round-robin deal, the reuse of the budget step's partition, the per-lineage node store, the `frontier_scope` binding, the recorded partition and `depthMode` propagation) and `per-lineage expansive budget` (the seed-share budget and the loop-default floor for a lineage dealt no seed node) |
| `manual-testing-playbook/fanout/fanout-expansive-lineage-budget.md` | DLR-066: the seed-share lineage budget, the loop-default floor and the stderr budget notes |

---

## 4. SOURCE METADATA

- Group: Fan-Out
- Catalog source: `feature-catalog/fanout/fanout-run.md`
- Primary source files: `scripts/fanout-run.cjs`
Related references:
- [fanout-pool.md](../../feature-catalog/fanout/fanout-pool.md) — Fan-out worker pool
- [fanout-salvage.md](../../feature-catalog/fanout/fanout-salvage.md) — Fan-out write-failure salvage
