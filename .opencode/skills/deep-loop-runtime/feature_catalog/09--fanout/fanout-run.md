---
title: "Fan-out CLI lineage driver"
description: "CLI lineage pool driver: TSX-bootstrapped entry point that spawns N headless CLI subprocesses (codex, claude, opencode), each running the full loop in an isolated lineages/{label}/ sub-packet, with per-kind state-dir isolation and a post-subprocess salvage sweep."
trigger_phrases:
  - "fan-out cli lineage driver"
  - "fanout-run.cjs"
  - "spawn fanout lineages"
  - "per-kind state-dir isolation"
  - "cli subprocess fanout dispatch"
---

# Fan-out CLI lineage driver

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

`fanout-run.cjs` bridges the pool primitive and the actual CLI executor subprocesses. It
parses the fanout config JSON, filters to CLI lineages (native lineages are handled by the
YAML `step_fanout_spawn_native` agent dispatch), creates `{base}/lineages/{label}/` and
`{label}/.executor-state/` directories per lineage, builds a "run the full loop" prompt,
constructs the per-kind CLI command (`codex exec` + stdin, `claude -p`, `opencode run` +
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

Fully shipped. Supports all 3 CLI kinds: `cli-codex`, `cli-claude-code`, `cli-opencode`.
Per-lineage subprocess timeout = `min(iterations *
timeoutSeconds * 2, 4h)`. TSX bootstrap (mirrors `convergence.cjs` pattern) ensures
TypeScript imports (`parseFanoutConfig`, `expandLineages`) resolve in the CJS context. Exit
codes: 0=all ok, 2=some failed, 3=all failed.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `scripts/fanout-run.cjs` | Main entry: CLI arg parsing, per-kind command construction, pool orchestration, stdout capture, salvage call |
| `scripts/fanout-salvage.cjs` | Called post-subprocess for write-failure recovery |
| `scripts/fanout-pool.cjs` | `runCappedPool` for concurrency cap + ledger |
| `lib/deep-loop/executor-config.ts` | `parseFanoutConfig`, `expandLineages` imported via TSX |
| `lib/deep-loop/executor-audit.ts` | `EXECUTOR_STATE_ENV_BY_KIND` constants for per-kind state dir naming |

### Validation

| File | Role |
|---|---|
| `tests/unit/fanout-run.vitest.ts` | 5 tests: native-only config returns early (no pool spawn), bad JSON config exits 3, missing required args exits 3, 2-lineage pool creates distinct dirs + ledger + summary, same-kind replica state dirs are distinct |

---

## 4. SOURCE METADATA

- Group: Fan-Out
- Feature ID: F025
- Catalog source: `feature_catalog/09--fanout/fanout-run.md`
- Primary source files: `scripts/fanout-run.cjs`
Related references:
- [fanout-pool.md](fanout-pool.md) — Fan-out worker pool
- [fanout-salvage.md](fanout-salvage.md) — Fan-out write-failure salvage
