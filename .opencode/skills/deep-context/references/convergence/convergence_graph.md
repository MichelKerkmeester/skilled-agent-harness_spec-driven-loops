---
title: "Deep Context: Graph-Aware Convergence"
description: How the loop_type=context coverage graph drives the stop decision — the upsert-to-convergence flow, node/edge endpoints, and the FK constraint.
---

# Deep Context: Graph-Aware Convergence

The `deep-context` stop decision runs entirely over the `loop_type='context'` coverage graph: the host upserts nodes/edges each iteration, then `evaluateContext` reads them back to compute the five signals. The compact stop contract lives in [convergence.md](./convergence.md).

---

## 1. OVERVIEW

### Purpose

Describe the operational stop path: how host-written `loop_type='context'` coverage-graph nodes and edges become the five convergence signals, and the structural constraints that keep that graph valid. Unlike `deep-research`, the graph is not an optional add-on here — it is the substrate the stop decision is computed from.

### When to Use

Load this reference when a STOP decision disagrees with what the iteration narrative suggests, when an upsert is rejected, or when reasoning about which nodes/edges a sweep must produce for the signals to move.

### Core Principle

The graph is the single source of truth for convergence. If a finding is not represented as a node/edge, it does not move the signals — so the host must upsert the merged graph before evaluating convergence each iteration.

### Key Sources

- Schema, kinds, relations, weights, FK constraint: `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` (`VALID_KINDS.context`, `VALID_RELATIONS.context`, `CONTEXT_WEIGHTS`, `SCHEMA_SQL`).
- Stop evaluation: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` (`--loop-type context`, `evaluateContext`).
- Per-iteration upsert + convergence steps: `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` (`step_graph_upsert`, `step_graph_convergence`).

This reference describes the operational stop flow. The schema catalog — full kind/relation tables and weight rationale — lives in the feature_catalog and is not duplicated here: see [loop-type-context-schema.md](../../feature_catalog/06--coverage-graph-schema/loop-type-context-schema.md) and [context-node-kinds-relations.md](../../feature_catalog/06--coverage-graph-schema/context-node-kinds-relations.md).

---

## 2. THE STOP PATH

Each iteration runs three graph-touching steps in order:

| Step | Action | Effect |
|------|--------|--------|
| `step_graph_upsert` | `upsert.cjs --loop-type context` writes `graph_nodes_json` + `graph_edges_json` from the merge | Materializes this iteration's findings as nodes/edges; skipped silently when there are no graph events |
| `step_graph_convergence` | `convergence.cjs --loop-type context` reads the graph and computes signals | Returns `CONTINUE` / `STOP_ALLOWED` / `STOP_BLOCKED` + signals + blockers; appends a `graph_convergence` event |
| `step_check_convergence` | Host combines the graph decision with its saturation check | Final loop action (see [convergence.md](./convergence.md) §1) |

`convergence.cjs` dispatches on `loopType === 'context'` to `computeContextSignalsFromData(nodes, edges)` for the signals and `evaluateContext(...)` for the decision. With zero nodes it short-circuits to `CONTINUE` ("Graph is empty; insufficient data").

---

## 3. WHICH NODES AND EDGES DRIVE EACH SIGNAL

The signals are graph reads, so each depends on specific node kinds and edge relations being present with the right endpoints:

| Signal | Reads |
|--------|-------|
| `sliceCoverage` | SLICE nodes; `COVERED_BY` edges where the SLICE is the **source** |
| `reuseCatalogCoverage` | REUSE_CANDIDATE nodes; their `CONFIRMS` in-edges or `metadata.confirmations`, or `metadata.verified` |
| `agreementRate` | Relevance-gated finding nodes (`REUSE_CANDIDATE` / `PATTERN` / `CONSTRAINT`); `CONFIRMS` in-edge counts vs `metadata.confirmations` |
| `relevanceFloor` | Finding nodes; their `metadata.relevance` |
| `dependencyCompleteness` | DEPENDENCY nodes; `DEPENDS_ON` edges where the DEPENDENCY is the **target** |

Edge endpoint direction is load-bearing: `COVERED_BY` is `SLICE → covered node` (so coverage counts the slice as the source), and `DEPENDS_ON` is `SYMBOL → DEPENDENCY` (so a dependency is resolved when it is the target). `IMPORTS` is `FILE → FILE` and never touches a DEPENDENCY endpoint, so it does not contribute to `dependencyCompleteness`. Relation weights (`CONTEXT_WEIGHTS`, with `REUSES` highest at `1.5`) feed node `weightSum` telemetry; they do not change the threshold decision.

---

## 4. THE FK CONSTRAINT

`coverage_edges` enforces foreign keys on **both** endpoints — every `source_id` and `target_id` must reference an existing `coverage_nodes` row in the same namespace — and the database opens with `PRAGMA foreign_keys = ON`. The table also rejects self-loops (`CHECK(source_id != target_id)`) and clamps `weight` to `[0.0, 2.0]`.

Consequence for the host: there is **no `ITERATION` or `EXECUTOR`/`SEAT` node kind**. An iteration marker or a confirming executor must be modeled as node/edge **metadata** (`metadata.iteration`, `metadata.confirmations`), never as an edge endpoint — otherwise the upsert fails the FK check and the finding never reaches the signals. This is why `agreementRate` reads `metadata.confirmations` as well as `CONFIRMS` in-edges: a confirming seat is metadata, not a node.

Namespacing is the composite primary key `(spec_folder, loop_type, session_id, id)`, so two sessions reusing the same logical node id never collide, and convergence is always computed over the session-scoped subgraph only.

---

## 5. THE GRAPH CONVERGENCE EVENT

`step_graph_convergence` appends the decision to the JSONL state log:

```json
{
  "type": "event",
  "event": "graph_convergence",
  "mode": "context",
  "run": 5,
  "decision": "STOP_BLOCKED",
  "signals": { "sliceCoverage": 0.6, "reuseCatalogCoverage": 0.7, "agreementRate": 0.45, "relevanceFloor": 0.8, "dependencyCompleteness": 1.0, "score": 0.66 },
  "blockers": [ { "type": "low_cross_executor_agreement", "severity": "blocking", "count": 1 } ],
  "timestamp": "...",
  "sessionId": "...",
  "generation": 1
}
```

`graph_convergence_score` (the `signals.score` composite) is recorded for trend analysis; the `decision` is what the host acts on. When the decision is `STOP_BLOCKED`, the host routes to the blocked-stop recovery path — see [convergence_recovery.md](./convergence_recovery.md) §2.

---

## 6. GRACEFUL DEGRADATION

| Condition | Behavior |
|-----------|----------|
| No graph events this iteration | `step_graph_upsert` is skipped; the host saturation check still runs |
| Empty graph at convergence time | `convergence.cjs` returns `CONTINUE` with `signals: null` |
| Code graph unavailable for seeding/verification | Fall back to Glob+Grep; affected findings are labeled `unverified` (still upserted) |
| Snapshot persistence requested without `--iteration` | Snapshot write is skipped; the decision is still returned |

Per-signal definitions and the threshold table live in [convergence_signals.md](./convergence_signals.md); the interface and query semantics live in [context-convergence-signals.md](../../feature_catalog/06--coverage-graph-schema/context-convergence-signals.md).
