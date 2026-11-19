---
title: "Expansive depth mode (--depth-mode=expansive)"
description: "Opt-in --depth-mode=expansive on deep-review seeds depth-one sub-target nodes from the review target, keeps node status in review/frontier-nodes.jsonl, and holds a review stop while nodes stay open."
trigger_phrases:
  - "--depth-mode=expansive review"
  - "expansive depth review"
  - "review frontier mode"
  - "review frontier-nodes"
version: 1.0.17.0
---

# Expansive depth mode (--depth-mode=expansive)

## 1. OVERVIEW

`--depth-mode` takes `default` or `expansive`. A review without the flag is unchanged. `expansive` seeds depth-one sub-target nodes from the review target before iteration 1, admits leaf `frontier_proposal` rows under the research caps with two differences, a root-children cap of at least 8 against research's 6 and a relevance check that prunes a proposal scoped outside a file-list review target, keeps node status in `review/frontier-nodes.jsonl`, and holds open nodes as `searchDebt`. This page describes the shipped code and its tests.

---

## 2. HOW IT WORKS

### Seeding And Admission

The expansive run seeds depth-one sub-target nodes from the review target before iteration 1. Leaf `frontier_proposal` rows are admitted under relevance, dedupe, depth, fan-out, budget and cycle checks, in that order. On a commit-range target, the seed prunes a merge commit with no diff of its own as `merge-no-own-diff` and a generated index rebuild as `generated-artifact`.

A defaulted review budget is capped at 24, so the depth-1 band gets at most 12 iterations, which funds three nodes at four dimensions. With four or more depth-1 nodes, raise `--max-iterations` or use fan-out.

### Dimension Coverage

The active node's next uncovered dimension is dispatched, apart from the last iteration under a cap of 2 or more while a core traceability protocol is unfinished and `traceability` is among the run's dimensions, which reviews `traceability`. A run whose `reviewDimensions` list leaves traceability out is not steered to it, so its last iteration reviews the configured set. A node needs one iteration per dimension in its universe, the four canonical dimensions plus any custom name. Only an attempt that produced evidence counts as a frontier visit, so an iteration record with status `error`, `failed`, `failure` or `timeout` covers no dimension, spends no band share and does not count for the focus tie-break. Each depth band starts from its `budgetSplit` share of `--max-iterations` (0.5, 0.35 and 0.15), plus any share an earlier band left unspent once that band holds no open node, so set `--max-iterations` to at least `2 * ceil(nodes / lineages) * dimensions`, which gives the depth-1 band `ceil(nodes / lineages) * dimensions` iterations. A store row that does not parse is skipped, and the reducer reports it on stderr and in the frontier projection's `warnings` with its file and line. The run-wide `maxFrontierNodes` cap defaults to half of `maxIterations`, and every seed that is not pruned counts toward it. `--frontier-max-depth=N` and `--frontier-max-nodes=N` set `maxDepth` and `maxFrontierNodes` when the config is created; both take a positive integer, need `--depth-mode=expansive` on a single-executor run, and are refused on a fan-out config. When `--max-iterations` is left at its default, the run sizes its budget from the seed: `min(24, max(7, 2 × D × (S + maxDepth − 1)))` iterations for S seeded depth-1 nodes and D the four canonical dimensions plus each custom name the config's `reviewDimensions` list adds, each counted once, and the seed step prints the derived budget. Since D is never below four, the ceiling of 24 binds from the first seed, so one run cannot fund every node at every depth of a wide review; split a wide review with fan-out, where each lineage with no matrix `iterations` value sizes its own budget from its share of the seed, with D fixed at the canonical four because a lineage reviews only those. A lineage dealt no seed node, or a run whose seeds were all pruned, runs at its loop default instead: 12 iterations for a native lineage and 7 for a CLI one or a single run. The node cap stays half the budget, which leaves room for at least two nodes past depth 1. An explicit `--max-iterations`, marker, setup answer or fan-out matrix `iterations` value always wins, even below the derived value, and the seed warns when it leaves no room past depth 1. At about seven to eight minutes an iteration, a 24-iteration review can reach `maxDurationMinutes` (120) before its iteration cap.

### Stop Behavior

A review stop candidate becomes another iteration while nodes stay open. The `frontierOpen` veto applies to the review stop candidates, including `all_dimensions_clean` and the composite stop, after the minIterations floor. Once every node is closed and at least one was answered, a run that forms no other stop candidate gets `frontier_drained`, which the legal-stop gates still decide.

### Dashboard

An expansive run adds a `## 10B. FRONTIER` section to its review dashboard, and a default run renders no such section. The section reports the frontier size by status, the pruned count, the revisits that covered no new dimension, each budget band's spent and allotted iterations, and the active node with its next dimension.

### Pivot

The divergent review pivot runs only once the frontier is terminal. It seeds only from nodes closed `exhausted` or `blocked`; an `abstained` node is terminal but never seeds it, and an accepted candidate becomes the next review direction through `restoredFocus`. The pivot writes no frontier node.

### Fan-Out

Fan-out lineages receive a share of the seeded nodes. `runtime/scripts/fanout-merge.cjs` returns the merged review frontier and runs the review fan-in guard over the recorded partition. A recorded partition with at least one dealt node builds the merged frontier even when no review lineage reports one, so a lost node still surfaces. Each fan-out CLI lineage keeps its coverage graph in `graph-db/` inside its own directory: `fanout-run.cjs` exports `DEEP_LOOP_COVERAGE_DB_DIR` to it, so the graph steps stay inside the lineage write surface instead of the shared runtime database.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/commands/deep/review.md` | Command doc | The `--depth-mode`, `--frontier-max-depth` and `--frontier-max-nodes` flag rows. |
| `.skilled/commands/deep/assets/deep-review.yaml` | Command workflow | The `depth_mode` input, the frontier seed step and the config keys. |
| `.skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json` | Config | `antiConvergence.depthMode`, the `expansiveDepth` block and the locked `depthMode` field. |
| `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` | Script | Admits review proposals as node-store rows; the reducer files the nodes it leaves open as `searchDebt`. |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Script | Reads the review frontier, the close rule and the per-node dimension cover. |
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Script | Applies the frontier-open veto to review stop candidates. |
| `.skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts` | Script | Pivots only once the frontier is terminal. |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Script | Returns the merged review frontier and runs the fan-in guard. |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Script | Deals the open seed nodes round-robin, sizes each lineage budget from its share and exports `DEEP_LOOP_COVERAGE_DB_DIR` to a CLI lineage. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/tests/unit/frontier-admit-review.vitest.ts` | Vitest | Review admission into the node store. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts` | Vitest | The review frontier projection, the dashboard frontier section, the band budget close and its roll-down, and the torn-row warning. |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | Manual playbook | DRV-076: the flag defaults to `default` and a default run matches the baseline. |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | Manual playbook | DRV-077: the seed writes depth-1 sub-target nodes. |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | Manual playbook | DRV-078: admission prunes a proposal with its reason. |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-and-node-dimension-coverage.md` | Manual playbook | DRV-079: the frontier focus and per-node dimension coverage. |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-review-stop.md` | Manual playbook | DRV-080: an open frontier node holds a review stop. |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md` | Manual playbook | DRV-081: the review pivot waits for a terminal frontier. |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | Manual playbook | DRV-082: a review fan-out deals seeded nodes round-robin. |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-drained-stops-review.md` | Manual playbook | DRV-083: a drained frontier forms the `frontier_drained` stop. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `loop-lifecycle/expansive-depth-mode.md`

Related references:
- [convergence-check.md](convergence-check.md) - Convergence check
- [fanout-dispatch.md](fanout-dispatch.md) - Fan-out dispatch
