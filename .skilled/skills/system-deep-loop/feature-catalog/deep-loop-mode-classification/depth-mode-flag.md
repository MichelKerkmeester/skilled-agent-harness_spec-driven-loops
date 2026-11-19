---
title: "Depth mode flag (--depth-mode)"
description: "The --depth-mode flag on /deep:research and /deep:review selects default or expansive depth, and leaves the registry-driven workflowMode, runtimeLoopType and backendKind classification unchanged."
trigger_phrases:
  - "--depth-mode"
  - "depth mode flag"
  - "expansive depth flag"
  - "deep loop depth mode"
version: 1.0.9.0
---

# Depth mode flag (--depth-mode)

## 1. OVERVIEW

`--depth-mode` is a command-level option on `/deep:research` and `/deep:review`. It takes `default` or `expansive`. The flag is not part of `mode-registry.json`, so the hub classifies a request into the same workflow mode with or without it. The behavior the flag turns on lives in the research and review packets. Admission caps the live frontier at half of `maxIterations`, or at `expansiveDepth.maxFrontierNodes` when the config sets it, and falls back to 10 when no config exists yet, as for a fan-out parent's seed. The seed pass is exempt from that cap, but every seeded node counts toward it afterwards, so a defaulted budget is sized from the seed: `min(24, max(loop default, 2 × c × (S + maxDepth − 1)))` for S seeded depth-1 nodes, with c 1 for research and, for review, the four canonical dimensions plus any custom name, each counted once. A fan-out lineage with no matrix `iterations` value is sized from its own seed share with c fixed at the canonical four for review and maxDepth at its default of 3, since a lineage reviews only those. A run or fan-out lineage with no seeded node keeps its loop default. An explicit `--max-iterations` always wins, even below the derived value.

---

## 2. HOW IT WORKS

### Hub Classification Unchanged

`mode-registry.json` carries the `workflowMode`, `runtimeLoopType` and `backendKind` discriminator for `research` and `review`, and it has no depth field. Routing resolves the same packet whether the flag is present or not.

### Flag Routing

The command workflow reads `--depth-mode` and binds it as `depth_mode`. The runtime acts only on the value `expansive`. `runtime/scripts/convergence.cjs` adds `depthMode` to its stop-decision config only when the value is `expansive`, and `runtime/scripts/fanout-run.cjs` passes `depthMode` to fan-out lineages only when the value is `expansive`. A default run carries no depth key in either place.

### Packet Behavior

The expansive behavior is documented in the packet catalogs: [expansive depth mode for research](../../deep-research/feature-catalog/convergence/expansive-depth-mode.md) and [expansive depth mode for review](../../deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/mode-registry.json` | Registry | Holds the discriminator for `research` and `review`, with no depth field. |
| `.skilled/commands/deep/research.md` | Command doc | The `--depth-mode` flag row for research. |
| `.skilled/commands/deep/review.md` | Command doc | The `--depth-mode` flag row for review. |
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Script | Adds `depthMode` to the stop-decision config only when expansive. |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Script | Under expansive depth, passes `depthMode` to lineages, deals the seeded nodes round-robin and records the partition. |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Script | Merges the lineage frontiers and runs the partition guard over the recorded deal. |
| `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` | Script | Owns the node store and the seed, admit, close, block, graph and budget calls the flag turns on. |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Script | Projects `registry.frontier`, the input the review stop veto reads. |
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Script | Projects `registry.frontier` for research. |
| `.skilled/commands/deep/assets/deep-research.yaml` | Workflow | Binds `depth_mode` and owns `step_frontier_seed` and `step_frontier_admit` for research. |
| `.skilled/commands/deep/assets/deep-review.yaml` | Workflow | Binds `depth_mode` and owns `step_frontier_seed` and `step_frontier_admit` for review. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | Manual playbook | DR-068: the flag defaults to `default`, and a default run matches the baseline once the golden test strips the expansive-only persona paragraph from a fan-out CLI lineage prompt. |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | Manual playbook | DR-069: the seed writes depth-1 nodes before iteration 1. |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | Manual playbook | DR-070: admission prunes with a named reason. |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-picks-shallowest-open-node.md` | Manual playbook | DR-071: Next Focus picks the shallowest open node. |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-soft-stop.md` | Manual playbook | DR-072: the `frontierOpen` veto holds a soft stop. |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | Manual playbook | DR-073: fan-out deals the seeded nodes round-robin. |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | Manual playbook | DRV-076: the review flag defaults to `default`, and a default run matches the baseline once the golden test strips the expansive-only persona paragraph from a fan-out CLI lineage prompt. |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md` | Manual playbook | DRV-077: the review seed writes depth-1 sub-target nodes. |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md` | Manual playbook | DRV-078: review admission prunes with a named reason. |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-and-node-dimension-coverage.md` | Manual playbook | DRV-079: focus and per-node dimension coverage. |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-review-stop.md` | Manual playbook | DRV-080: the veto holds a review stop. |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md` | Manual playbook | DRV-081: the review pivot waits for a terminal frontier. |
| `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md` | Manual playbook | DRV-082: review fan-out deals the seeded nodes round-robin. |

---

## 4. SOURCE METADATA

- Group: Deep-loop mode classification
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `deep-loop-mode-classification/depth-mode-flag.md`

Related references:
- [deep-loop-mode-classification.md](deep-loop-mode-classification.md) - Registry-driven mode classification
