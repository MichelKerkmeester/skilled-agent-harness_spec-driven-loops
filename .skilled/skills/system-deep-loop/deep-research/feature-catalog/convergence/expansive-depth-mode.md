---
title: "Expansive depth mode (--depth-mode=expansive)"
description: "Opt-in --depth-mode=expansive on deep-research seeds depth-one frontier nodes from the topic, admits proposals under caps, and keeps a convergence stop open while frontier nodes stay open."
trigger_phrases:
  - "--depth-mode=expansive"
  - "expansive depth research"
  - "research frontier mode"
  - "frontier admission research"
version: 1.0.7.0
---

# Expansive depth mode (--depth-mode=expansive)

## 1. OVERVIEW

`--depth-mode` takes `default` or `expansive`. A run without the flag is unchanged. `expansive` turns on a research frontier: the run seeds depth-one nodes from the topic before iteration 1, admits leaf `frontier_proposal` rows as nodes under the relevance, dedupe, depth, fan-out, budget and cycle checks, in that order,, and holds a convergence stop while frontier nodes stay open. This page describes the shipped code and its tests.

---

## 2. HOW IT WORKS

### Seeding And Admission

The expansive run seeds depth-one nodes before iteration 1. Each iteration's leaf `frontier_proposal` rows go through `runtime/scripts/frontier-admit.cjs`, which admits each proposal into the node store. It applies the relevance, dedupe, depth, fan-out, budget and cycle checks in that order, and records the name of the first failing check as the reason for each prune.

### Configuration

`expansiveDepth` in `deep-research-config.json` sets `maxDepth` to 3, `maxChildrenPerNode` to 6, a 50/35/15 iteration budget across depths, and `maxFrontierNodes` to null, which admission resolves to half of `maxIterations` (10 when no config exists yet, as on a fan-out parent). The depth-1 seed answers only to the root-children cap, but every seed that is not pruned counts toward the run cap. When `--max-iterations` is left at its default, the run sizes its budget from the seed: `min(24, max(10, 2 × (S + maxDepth − 1)))` iterations for S seeded depth-1 nodes, 16 at the full six seeds, and the seed step prints the derived budget. The node cap stays half that budget, which leaves room for at least two nodes past depth 1. An explicit `--max-iterations`, marker or fan-out matrix `iterations` value always wins, even below the derived value, and the seed warns when it leaves no room past depth 1. `antiConvergence.depthMode` defaults to `default`. The convergence script adds `depthMode` to its stop-decision config only when the value is `expansive`.

### Frontier Graph Mirror

After the iteration graph upsert, the workflow step `step_frontier_graph_upsert` in `deep-research.yaml` mirrors the frontier node store into the coverage graph, so traversal does not depend on the leaf emitting graph events. It runs `frontier-admit.cjs graph`, which writes `frontier-graph-events.json` from `buildFrontierGraphEvents`, and then `upsert.cjs --events` on that file. When the graph command reports zero nodes in its JSON result, the upsert is skipped.

`buildFrontierGraphEvents` never writes a pruned node. A node that closed `exhausted`, `blocked` or `abstained` is re-kinded from QUESTION to a CLAIM with `verification_status: 'closed'`, so it stops lowering question coverage and source diversity, which both divide by every QUESTION node. Open, active and answered nodes stay QUESTION nodes. Every written node below depth 1 gets a DERIVED_FROM edge to its parent, closed CLAIMs included, unless that parent was pruned and so never written. A depth-1 node, whose parent is `root`, gets no edge. In a fan-out lineage the step writes to the lineage's own `graph-db/` store. A failure is logged as a `config_warning` event and the run continues, since the node store and registry stay authoritative.

### Stop And Next Focus

While a frontier node is open, a stop candidate, whether `all_questions_answered` or a composite convergence stop, becomes another iteration. Next Focus steers to the shallowest open node. The iteration cap, consecutive failures, the anti-convergence floor, stuck recovery, pause, `--convergence-mode=off` and the max-iterations policy decide before the frontier veto, so the frontier never extends a run past them.

### Fan-Out

Fan-out lineages each receive a share of the seeded nodes. `runtime/scripts/fanout-run.cjs` passes `depthMode` to a lineage only when it is `expansive`. `runtime/scripts/fanout-merge.cjs` merges the lineage frontiers and runs a fan-in guard over the recorded partition.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/commands/deep/research.md` | Command doc | The `--depth-mode` flag row. |
| `.skilled/commands/deep/assets/deep-research.yaml` | Command workflow | The `depth_mode` input, the preflight check, the config keys and the `step_frontier_graph_upsert` frontier graph mirror. |
| `.skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json` | Config | `antiConvergence.depthMode` and the `expansiveDepth` block. |
| `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` | Script | Seeds, admits and closes frontier nodes. Its `graph` command builds the frontier graph events through `buildFrontierGraphEvents`. |
| `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs` | Script | Stores the frontier graph events in the coverage graph through `--events`. |
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
