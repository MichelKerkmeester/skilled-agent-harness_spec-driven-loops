---
title: "Context Convergence Signals"
description: "Documents the ContextConvergenceSignals interface exported by coverage-graph-signals.ts and how evaluateContext computes each signal from the graph state."
trigger_phrases:
  - "context convergence signals"
  - "ContextConvergenceSignals"
  - "evaluateContext"
  - "coverage graph signals"
  - "blendedScore"
  - "createSnapshot"
---

# Context Convergence Signals

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Documents the `ContextConvergenceSignals` interface exported by `coverage-graph-signals.ts` and how `evaluateContext` computes each signal from the graph state.

`coverage-graph-signals.ts` is the TypeScript module that bridges the raw SQLite graph data and the convergence decision. It exports type-safe signal interfaces and per-loop-type signal functions. For `deep-context`, `computeContextSignals(ns)` reads the graph nodes/edges and returns the five context signals; `convergence.cjs` then blends them into a composite score and runs its own `evaluateContext(...)` to decide CONTINUE | STOP_ALLOWED | STOP_BLOCKED.

---

## 2. HOW IT WORKS

### Interface

```typescript
export interface ContextConvergenceSignals {
  sliceCoverage: number;         // [0.0, 1.0]
  reuseCatalogCoverage: number;  // [0.0, 1.0]
  agreementRate: number;         // [0.0, 1.0]
  relevanceFloor: number;        // [0.0, 1.0]
  dependencyCompleteness: number;// [0.0, 1.0]
}
```

### Computation Queries

`computeContextSignalsFromData(nodes, edges)` is a pure function over the fetched graph nodes/edges (`computeContextSignals(ns)` fetches them first). "Finding nodes" are the kinds `REUSE_CANDIDATE`, `PATTERN`, `CONSTRAINT`. Each signal vacuous-passes (1.0) when its node kind is absent. The relevance gate is `0.55` (`CONTEXT_RELEVANCE_GATE`) and the agreement minimum is `2` (`CONTEXT_AGREEMENT_MIN`):

| Signal | Computation |
|---|---|
| `sliceCoverage` | SLICE nodes that are the source of a `COVERED_BY` edge / total SLICE nodes |
| `reuseCatalogCoverage` | REUSE_CANDIDATE nodes with agreement ≥ 1 (a CONFIRMS edge or `metadata.confirmations`) OR `metadata.verified === true` / total REUSE_CANDIDATE nodes |
| `agreementRate` | Relevance-gated finding nodes with agreement ≥ 2 / relevance-gated finding nodes (relevance ≥ 0.55) |
| `relevanceFloor` | Fraction of finding nodes with `metadata.relevance` ≥ 0.55 |
| `dependencyCompleteness` | DEPENDENCY nodes that are the target of a `DEPENDS_ON` edge / total DEPENDENCY nodes |

### Blended Score

`convergence.cjs#computeCompositeScore` blends the five signals with reuse-first weights (reuseCatalogCoverage 0.30, agreementRate 0.25, sliceCoverage 0.20, relevanceFloor 0.15, dependencyCompleteness 0.10) into a `score`. It surfaces as `graph_convergence_score` in the JSONL `graph_convergence` event and is telemetry for trend analysis — the STOP decision itself is gated by `evaluateContext`'s per-signal thresholds, not by this composite score.

### Snapshots

`createSnapshot(snapshot: CoverageSnapshot)` persists the per-iteration signal state in the `coverage_snapshots` table with a `UNIQUE(spec_folder, loop_type, session_id, iteration)` constraint and upsert-on-conflict semantics. `getLatestSnapshot` retrieves the most recent snapshot for dashboard and stuck-detection diagnostics.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | Shared | `ContextConvergenceSignals` interface, `computeContextSignals` / `computeContextSignalsFromData`, `createSnapshot`, `getLatestSnapshot`, `getStats` |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` | Shared | `CoverageSnapshot` interface, `getDb`, `getNodes`, `getEdges` — called by evaluateContext |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts` | Shared | `getContradictions`, `getHotNodes`, `getProvenancePath` — query helpers used by evaluateContext for diagnostics |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/context/manual_testing_playbook/06--coverage-graph-schema/context-convergence-signals.md` | Manual playbook | Verifies ContextConvergenceSignals interface fields exist in coverage-graph-signals.ts, evaluateContext returns parseable JSON with all five fields, createSnapshot upserts correctly |

---

## 4. SOURCE METADATA

- Group: Coverage-Graph Schema
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `06--coverage-graph-schema/context-convergence-signals.md`

Related references:
- [loop-type-context-schema.md](loop-type-context-schema.md) — SQLite schema that backs the node/edge queries used here
- [evaluate-context.md](../04--convergence-detection/evaluate-context.md) — convergence.cjs that calls evaluateContext
