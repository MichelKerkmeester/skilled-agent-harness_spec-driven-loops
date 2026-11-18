---
title: "Fan-out CLI lineage driver"
description: "TSX-bootstrapped entry point that spawns N headless CLI subprocesses (opencode, claude, opencode), each running the full loop in an isolated `lineages/{label}/` sub-packet, with per-kind state-dir isolation and a post-subprocess salvage sweep."
trigger_phrases:
  - "fan-out cli lineage driver"
  - "fanout-run.cjs"
  - "spawn fanout lineages"
  - "per-kind state-dir isolation"
  - "cli subprocess fanout dispatch"
version: 1.4.6.0
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
process exists, unless `--allow-single-lineage` is passed.

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
the write limit would skip every graph step. Each CLI lineage now keeps its coverage graph in
its own `graph-db/`.

### Expansive Depth

`--depth-mode` takes `default` or `expansive`, and `normalizeDepthMode` refuses any other value
with exit 3. A run without the flag is unchanged.

Under `expansive`, `partitionFrontierNodes` reads `frontier-nodes.jsonl` in the base artifact
dir, keeps the depth-1 nodes that are `open` or `active`, sorts them by node id and deals them
round-robin across the lineage labels. The same seed therefore always gives each lineage the
same share. The split is written to `orchestration-summary.json` as `frontier_partition`, a map
from lineage label to node ids, which the merge's partition guard reads.

Before a lineage spawns, `writeLineageFrontierStore` writes its share to
`{lineageDir}/frontier-nodes.jsonl`. It writes only when the lineage has no store yet and its
share is not empty, so a resumed lineage keeps the nodes it already closed. A research lineage
also gets one `inbox.jsonl` row per node. A review lineage gets no inbox, because its nodes reach
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
| `lib/deep-loop/executor-audit.ts` | `EXECUTOR_STATE_ENV_BY_KIND` constants for per-kind state dir naming |

### Validation

| File | Role |
|---|---|
| `tests/unit/fanout-run.vitest.ts` | 5 tests: native-only config returns early (no pool spawn), bad JSON config exits 3, missing required args exits 3, 2-lineage pool creates distinct dirs + ledger + summary, same-kind replica state dirs are distinct |
| `tests/unit/fanout-run.vitest.ts` | Expansive depth groups: `expansive depth frontier` (13 tests: the round-robin deal, the reuse of the budget step's partition, the per-lineage node store, the `frontier_scope` binding, the recorded partition and `depthMode` propagation) and `per-lineage expansive budget` (4 tests: the seed-share budget and the loop-default floor for a lineage dealt no seed node) |
| `manual-testing-playbook/fanout/fanout-expansive-lineage-budget.md` | DLR-066: the seed-share lineage budget, the loop-default floor and the stderr budget notes |

---

## 4. SOURCE METADATA

- Group: Fan-Out
- Catalog source: `feature-catalog/fanout/fanout-run.md`
- Primary source files: `scripts/fanout-run.cjs`
Related references:
- [fanout-pool.md](../../feature-catalog/fanout/fanout-pool.md) — Fan-out worker pool
- [fanout-salvage.md](../../feature-catalog/fanout/fanout-salvage.md) — Fan-out write-failure salvage
