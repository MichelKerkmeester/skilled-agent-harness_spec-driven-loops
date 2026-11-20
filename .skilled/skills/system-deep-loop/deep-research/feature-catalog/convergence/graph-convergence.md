---
title: "Graph convergence"
description: "Adds coverage-graph evidence to the stop decision when iterations emit graph events."
trigger_phrases:
  - "graph convergence"
  - "coverage-graph stop"
  - "graph_convergence event"
  - "graph-aware legal stop"
  - "edge density answer coverage"
version: 1.14.2.0
---

# Graph convergence

## 1. OVERVIEW

Adds coverage-graph evidence and blockers to the deep-research legal-stop path when graph events exist.

Graph convergence extends the default stop logic with structural evidence from coverage-graph nodes and edges. It lets the loop ask not only whether novelty is low, but also whether the question graph looks connected enough to stop.

---

## 2. HOW IT WORKS

When iteration records carry `graphEvents`, or finding rows whose `answeredQuestions` match a stored QUESTION node, from which the iteration graph upsert derives FINDING, SOURCE, CITES and ANSWERS evidence, the workflow runs convergence.cjs, which evaluates the coverage graph and computes the stop decision, then writes a `graph_convergence` event into the JSONL log. The live graph signals include component count, isolated nodes, edge density, and answer coverage. Those signals become part of the legal-stop evaluation instead of living only in notes.

The reducer consumes the newest `graph_convergence` event and surfaces its verdict in the synchronized packet outputs. `findings-registry.json` stores graph score, decision, and blockers, and `deep-research-dashboard.md` renders those values for operators. If no graph decision exists, convergence.cjs answers a non-terminal STOP candidate with CONTINUE and the reason detail `graphDecisionMissing`, and the reducer defaults those fields.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md` | Reference | Defines the graph-aware convergence model and graph-specific stop support signals. |
| `.skilled/commands/deep/assets/deep-research.yaml` | Workflow | Runs convergence.cjs and appends `graph_convergence` events. Confirm mode adds approval gates. |
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Reducer | Reads the latest graph event and exposes graph score, decision, and blockers. |
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | CLI script | Produces the graph convergence verdict that the workflow records and the reducer consumes. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/graph-aware-stop.vitest.ts` | Vitest | Verifies graph convergence events reach the reducer and dashboard correctly. |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/graph-convergence-signals.md` | Manual playbook | Verifies graph convergence signals are derived and exposed correctly. |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/graph-aware-stop-gate.md` | Manual playbook | Verifies graph-aware stop gates can block or allow synthesis. |

---

## 4. SOURCE METADATA

- Group: Convergence
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `convergence/graph-convergence.md`
Related references:
- [quality-guards.md](../../feature-catalog/convergence/quality-guards.md) — Quality guards
