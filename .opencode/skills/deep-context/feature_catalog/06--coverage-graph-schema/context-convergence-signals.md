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

`coverage-graph-signals.ts` is the TypeScript module that bridges the raw SQLite graph data and the convergence decision. It exports type-safe signal interfaces and per-loop-type evaluation functions. For `deep-context`, `evaluateContext(ns)` queries the database and returns the five context signals plus a blended score.

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

`evaluateContext(ns: Namespace)` runs scoped SQL queries against the `coverage_nodes` and `coverage_edges` tables to derive each signal:

| Signal | SQL Pattern |
|---|---|
| `sliceCoverage` | `SELECT COUNT(DISTINCT source_id) FROM coverage_edges WHERE relation='COVERED_BY'` / total SLICE nodes |
| `reuseCatalogCoverage` | REUSE_CANDIDATE nodes with ≥2 CONFIRMS edges / total REUSE_CANDIDATE nodes |
| `agreementRate` | Units with `agreement >= agreementMin` / all relevance-gated units |
| `relevanceFloor` | `MIN(metadata->relevance)` across all surviving units |
| `dependencyCompleteness` | Resolved DEPENDS_ON + IMPORTS edges / expected edges (from strategy frontier) |

### Blended Score

A `blendedScore` is computed from a weighted combination of the five signals (weights reuse-first, per `CONTEXT_WEIGHTS`). This score becomes `graph_convergence_score` in the JSONL `graph_convergence` event and is used for trend analysis.

### Snapshots

`createSnapshot(snapshot: CoverageSnapshot)` persists the per-iteration signal state in the `coverage_snapshots` table with a `UNIQUE(spec_folder, loop_type, session_id, iteration)` constraint and upsert-on-conflict semantics. `getLatestSnapshot` retrieves the most recent snapshot for dashboard and stuck-detection diagnostics.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | Shared | `ContextConvergenceSignals` interface, `evaluateContext` function, `createSnapshot`, `getLatestSnapshot`, `getStats` |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` | Shared | `CoverageSnapshot` interface, `getDb`, `getNodes`, `getEdges` — called by evaluateContext |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts` | Shared | `getContradictions`, `getHotNodes`, `getProvenancePath` — query helpers used by evaluateContext for diagnostics |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-context/manual_testing_playbook/06--coverage-graph-schema/context-convergence-signals.md` | Manual playbook | Verifies ContextConvergenceSignals interface fields exist in coverage-graph-signals.ts, evaluateContext returns parseable JSON with all five fields, createSnapshot upserts correctly |

---

## 4. SOURCE METADATA

- Group: Coverage-Graph Schema
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `06--coverage-graph-schema/context-convergence-signals.md`

Related references:
- [loop-type-context-schema.md](loop-type-context-schema.md) — SQLite schema that backs the node/edge queries used here
- [evaluate-context.md](../04--convergence-detection/evaluate-context.md) — convergence.cjs that calls evaluateContext
