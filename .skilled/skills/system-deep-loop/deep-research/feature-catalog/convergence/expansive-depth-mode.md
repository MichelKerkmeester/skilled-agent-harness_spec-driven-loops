---
title: "Expansive depth mode (--depth-mode=expansive)"
description: "Opt-in --depth-mode=expansive on deep-research seeds depth-one frontier nodes from the topic, admits proposals under caps, and keeps a convergence stop open while frontier nodes stay open."
trigger_phrases:
  - "--depth-mode=expansive"
  - "expansive depth research"
  - "research frontier mode"
  - "frontier admission research"
version: 1.0.1.0
---

# Expansive depth mode (--depth-mode=expansive)

## 1. OVERVIEW

`--depth-mode` takes `default` or `expansive`. A run without the flag is unchanged. `expansive` turns on a research frontier: the run seeds depth-one nodes from the topic before iteration 1, admits leaf `frontier_proposal` rows as nodes under depth, fan-out, budget, dedupe and cycle caps, and holds a convergence stop while frontier nodes stay open. The live pilot runs that would show this mode on real topics are still open, so this page describes the shipped code and its tests and records no pilot result.

---

## 2. HOW IT WORKS

### Seeding And Admission

The expansive run seeds depth-one nodes before iteration 1. Each iteration's leaf `frontier_proposal` rows go through `runtime/scripts/frontier-admit.cjs`, which admits each proposal into the node store. It applies the depth cap, the fan-out cap, the iteration budget, dedupe and cycle checks, and records a reason for each prune.

### Configuration

`expansiveDepth` in `deep-research-config.json` sets `maxDepth` to 3, `maxChildrenPerNode` to 6, and a 50/35/15 iteration budget across depths. `antiConvergence.depthMode` defaults to `default`. The convergence script adds `depthMode` to its stop-decision config only when the value is `expansive`.

### Stop And Next Focus

While a frontier node is open, a composite convergence stop becomes another iteration. Next Focus steers to the shallowest open node. The iteration cap, the anti-convergence floor, stuck recovery, pause, `--convergence-mode=off` and the max-iterations policy decide before the frontier veto, so the frontier never extends a run past them.

### Fan-Out

Fan-out lineages each receive a share of the seeded nodes. `runtime/scripts/fanout-run.cjs` passes `depthMode` to a lineage only when it is `expansive`. `runtime/scripts/fanout-merge.cjs` merges the lineage frontiers and runs a fan-in guard over the recorded partition.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/commands/deep/research.md` | Command doc | The `--depth-mode` flag row. |
| `.skilled/commands/deep/assets/deep-research.yaml` | Command workflow | The `depth_mode` input, the preflight check and the config keys. |
| `.skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json` | Config | `antiConvergence.depthMode` and the `expansiveDepth` block. |
| `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` | Script | Seeds, admits and closes frontier nodes. |
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Script | Applies the frontier-open veto and passes `depthMode` into the stop-decision config when expansive. |
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Script | Builds the opt-in `frontier` registry and the question close rule. |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Script | Passes `depthMode` to lineages only when expansive. |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Script | Merges the lineage frontiers and runs the partition guard. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/tests/unit/frontier-admit.vitest.ts` | Vitest | Admission, prune reasons and the close rule for the frontier writer. |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md` | Manual playbook | DR-068: the flag defaults to `default` and a default run matches the baseline. |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-soft-stop.md` | Manual playbook | DR-072: an open frontier node turns a composite convergence stop into another iteration. |

---

## 4. SOURCE METADATA

- Group: Convergence
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `convergence/expansive-depth-mode.md`

Related references:
- [divergent-convergence-mode.md](divergent-convergence-mode.md) - Divergent convergence mode
- [anti-convergence-floor.md](anti-convergence-floor.md) - Anti-convergence floor
