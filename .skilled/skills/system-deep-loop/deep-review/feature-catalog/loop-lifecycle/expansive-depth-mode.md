---
title: "Expansive depth mode (--depth-mode=expansive)"
description: "Opt-in --depth-mode=expansive on deep-review seeds depth-one sub-target nodes from the review target, keeps node status in review/frontier-nodes.jsonl, and holds a review stop while nodes stay open."
trigger_phrases:
  - "--depth-mode=expansive review"
  - "expansive depth review"
  - "review frontier mode"
  - "review frontier-nodes"
version: 1.0.5.0
---

# Expansive depth mode (--depth-mode=expansive)

## 1. OVERVIEW

`--depth-mode` takes `default` or `expansive`. A review without the flag is unchanged. `expansive` seeds depth-one sub-target nodes from the review target before iteration 1, admits leaf `frontier_proposal` rows under the same caps as research, keeps node status in `review/frontier-nodes.jsonl`, and holds open nodes as `searchDebt`. Two live review pilots ran. In the first the depth-1 budget check passed but the stop criterion failed: the root fan-out cap of 6, since raised to 8 for a review seed, pruned a seventh depth-1 node, and three of six lineages stopped on `maxIterationsReached`. The second, at `maxIterations` 16, seeded eight depth-1 nodes and answered all eight, and the merged frontier ended with 0 open and 0 active nodes under a passing partition guard, which met the amended pilot criterion. This page describes the shipped code and its tests.

---

## 2. HOW IT WORKS

### Seeding And Admission

The expansive run seeds depth-one sub-target nodes from the review target before iteration 1. Leaf `frontier_proposal` rows are admitted under relevance, dedupe, depth, fan-out, budget and cycle checks, in that order. Merge commits are pruned as `merge-no-own-diff`, and index rebuilds are pruned as `generated-artifact`.

### Dimension Coverage

The active node's next uncovered dimension is dispatched. A node needs one iteration per dimension in its universe, the four canonical dimensions plus any custom name. Each depth band starts from its `budgetSplit` share of `--max-iterations` (0.5, 0.35 and 0.15), plus any share an earlier band left unspent once that band holds no open node, so fund the depth-1 band with at least `2 * ceil(nodes / lineages) * dimensions`. The run-wide `maxFrontierNodes` cap defaults to half of `maxIterations`, and every seed that is not pruned counts toward it. When `--max-iterations` is left at its default, the run sizes its budget from the seed: `min(24, max(7, 2 × D × (S + maxDepth − 1)))` iterations for S seeded depth-1 nodes and D configured dimensions, and the seed step prints the derived budget. With the four canonical dimensions the ceiling of 24 binds from two seeds on, so one run cannot fund every node at every depth of a wide review; split a wide review with fan-out, where each lineage sizes its own budget from its share of the seed. The node cap stays half the budget, which leaves room for at least two nodes past depth 1. An explicit `--max-iterations`, marker or fan-out matrix `iterations` value always wins, even below the derived value, and the seed warns when it leaves no room past depth 1. At about seven to eight minutes an iteration, a 24-iteration review can reach `maxDurationMinutes` (120) before its iteration cap.

### Stop Behavior

A review stop candidate becomes another iteration while nodes stay open. The `frontierOpen` veto applies to the review stop candidates, including `all_dimensions_clean` and the composite stop, after the minIterations floor. Once every node is closed and at least one was answered, a run that forms no other stop candidate gets `frontier_drained`, which the legal-stop gates still decide.

### Pivot

The divergent review pivot runs only once the frontier is terminal. It seeds from terminal unanswered nodes, and an accepted candidate becomes the next review direction through `restoredFocus`. The pivot writes no frontier node.

### Fan-Out

Fan-out lineages receive a share of the seeded nodes. `runtime/scripts/fanout-merge.cjs` returns the merged review frontier and runs the review fan-in guard over the recorded partition. Each fan-out CLI lineage keeps its coverage graph in `graph-db/` inside its own directory: `fanout-run.cjs` exports `DEEP_LOOP_COVERAGE_DB_DIR` to it, so the graph steps stay inside the lineage write surface instead of the shared runtime database.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/commands/deep/review.md` | Command doc | The `--depth-mode` flag row. |
| `.skilled/commands/deep/assets/deep-review.yaml` | Command workflow | The `depth_mode` input, the frontier seed step and the config keys. |
| `.skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json` | Config | `antiConvergence.depthMode`, the `expansiveDepth` block and the locked `depthMode` field. |
| `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` | Script | Admits review proposals as node-store rows; the reducer files the nodes it leaves open as `searchDebt`. |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Script | Reads the review frontier, the close rule and the per-node dimension cover. |
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Script | Applies the frontier-open veto to review stop candidates. |
| `.skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts` | Script | Pivots only once the frontier is terminal. |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Script | Returns the merged review frontier and runs the fan-in guard. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/tests/unit/frontier-admit-review.vitest.ts` | Vitest | Review admission into the node store and debt entries. |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | Manual playbook | DRV-076: the flag defaults to `default` and a default run matches the baseline. |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-review-stop.md` | Manual playbook | DRV-080: an open frontier node holds a review stop. |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md` | Manual playbook | DRV-081: the review pivot waits for a terminal frontier. |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | Manual playbook | DRV-082: a review fan-out deals seeded nodes round-robin. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `loop-lifecycle/expansive-depth-mode.md`

Related references:
- [convergence-check.md](convergence-check.md) - Convergence check
- [fanout-dispatch.md](fanout-dispatch.md) - Fan-out dispatch
