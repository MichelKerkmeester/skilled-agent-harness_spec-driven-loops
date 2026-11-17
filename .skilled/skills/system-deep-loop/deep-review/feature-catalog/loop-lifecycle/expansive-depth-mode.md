---
title: "Expansive depth mode (--depth-mode=expansive)"
description: "Opt-in --depth-mode=expansive on deep-review seeds depth-one sub-target nodes from the review target, keeps node status in review/frontier-nodes.jsonl, and holds a review stop while nodes stay open."
trigger_phrases:
  - "--depth-mode=expansive review"
  - "expansive depth review"
  - "review frontier mode"
  - "review frontier-nodes"
version: 1.0.0.0
---

# Expansive depth mode (--depth-mode=expansive)

## 1. OVERVIEW

`--depth-mode` takes `default` or `expansive`. A review without the flag is unchanged. `expansive` seeds depth-one sub-target nodes from the review target before iteration 1, admits leaf `frontier_proposal` rows under the same caps as research, keeps node status in `review/frontier-nodes.jsonl`, and holds open nodes as `searchDebt`. The live pilot runs that would show this mode on real targets are still open, so this page describes the shipped code and its tests and records no pilot result.

## 2. HOW IT WORKS

### Seeding And Admission

The expansive run seeds depth-one sub-target nodes from the review target before iteration 1. Leaf `frontier_proposal` rows are admitted under depth, fan-out, budget, dedupe and cycle caps. Merge commits are pruned as `merge-no-own-diff`, and index rebuilds are pruned as `generated-artifact`.

### Dimension Coverage

The active node's next uncovered dimension is dispatched. A node needs one iteration per configured dimension, so `--max-iterations` should be at least `ceil(nodes / lineages) * dimensions` for the depth reached.

### Stop Behavior

A review stop candidate becomes another iteration while nodes stay open. The `frontierOpen` veto applies to the review stop candidates, including `all_dimensions_clean` and the composite stop, after the minIterations floor.

### Pivot

The divergent review pivot runs only once the frontier is terminal. It seeds from terminal unanswered nodes and routes accepted candidates through admission.

### Fan-Out

Fan-out lineages receive a share of the seeded nodes. `runtime/scripts/fanout-merge.cjs` returns the merged review frontier and runs the review fan-in guard over the recorded partition.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/commands/deep/review.md` | Command doc | The `--depth-mode` flag row. |
| `.skilled/commands/deep/assets/deep-review.yaml` | Command workflow | The `depth_mode` input, the frontier seed step and the config keys. |
| `.skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json` | Config | `antiConvergence.depthMode`, the `expansiveDepth` block and the locked `depthMode` field. |
| `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` | Script | Admits review proposals as node-store rows and open `searchDebt` entries. |
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
