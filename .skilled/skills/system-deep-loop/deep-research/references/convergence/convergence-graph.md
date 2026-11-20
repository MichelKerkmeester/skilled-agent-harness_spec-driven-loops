---
title: Graph-Aware Convergence Reference
description: Coverage graph signals and STOP blockers for deep-research convergence.
trigger_phrases:
  - "graph aware research convergence"
  - "research coverage graph signals"
  - "research graph stop blockers"
  - "research graph event contract"
  - "graph convergence graceful degradation"
importance_tier: normal
contextType: implementation
version: 1.14.2.0
---

# Graph-Aware Convergence Reference

Graph-aware convergence adds structural STOP evidence when iterations emit `graphEvents` or record finding rows that answer a stored question. It complements the three statistical signals; it does not replace them.

---

## 1. OVERVIEW

### Purpose

Define how coverage graph signals support or block deep-research STOP candidates when graph data exists.

### When to Use

Load this reference when `graphEvents` appear in iteration records, when a STOP candidate is blocked by graph coverage, or when validating graph-aware dashboard fields.

### Core Principle

Graph gates add structural evidence to legal-stop checks. They never replace the standard convergence signals or legal-stop bundle.

---

## 2. WHEN GRAPH GATES APPLY

A graph decision is required for every non-terminal STOP. Without a graph decision, every non-terminal STOP is blocked and the loop continues.

The iteration graph upsert does not depend on `graphEvents` alone. When an iteration's delta holds `finding` rows and its `answeredQuestions` match the text of a QUESTION node, from the stored graph, the batch or the frontier node store, `upsert.cjs` derives one FINDING node per finding row, a SOURCE node with a CITES edge per cited file (line ref dropped, quality class derived from the path), and an ANSWERS edge to each matched question. This holds on a default run too, where no matching QUESTION node means nothing is derived. An iteration whose `graphEvents` declare FINDING nodes derives nothing, and a derived edge that repeats a stored or leaf link is dropped, so `source_diversity_guard`, `evidence_depth_guard` and `uncovered_questions` never count one finding twice.

`graphEvents` are documented in `../state/state-jsonl.md`. Reducer-owned graph summaries are documented in `../state/state-reducer-registry.md`.

---

## 3. GRAPH SIGNALS

| Signal | Type | Stop Support |
|--------|------|--------------|
| `graphComponentCount` | number | Decreasing components support consolidation |
| `graphIsolatedNodes` | number | Increasing isolated nodes block STOP |
| `graphEdgeDensity` | number `0.0-1.0` | Higher density supports stop |
| `graphAnswerCoverage` | number `0.0-1.0` | Coverage above `0.85` supports stop |
| `sourceDiversity` | number `0.0-1.0` | Must be at least `0.40` when enforced |
| `evidenceDepth` | number | Must be at least `1.5` when enforced |

---

## 4. LEGAL-STOP INTEGRATION

Graph checks participate in the quality gate as additional sub-checks.

```text
qualityGate.checks.graphCoverage = {
  pass: graphAnswerCoverage >= 0.85 and graphIsolatedNodes <= 2,
  detail: "Graph coverage shows N/M questions answered with K isolated nodes"
}
```

The loop may STOP for composite convergence only when:

- the inline composite vote nominates STOP;
- standard legal-stop gates pass;
- the latest graph decision is `STOP_ALLOWED`.

If graph data says `STOP_BLOCKED`, the workflow emits a blocked-stop path and continues.

---

## 5. GRAPH EVENT CONTRACT

The canonical graph convergence event is:

```json
{
  "type": "event",
  "event": "graph_convergence",
  "mode": "research",
  "run": 7,
  "decision": "STOP_ALLOWED",
  "signals": {
    "graphAnswerCoverage": 0.9,
    "graphIsolatedNodes": 1,
    "sourceDiversity": 0.5,
    "evidenceDepth": 2.0
  },
  "blockers": [],
  "timestamp": "2026-05-24T00:00:00Z"
}
```

Event fields and namespace rules live in `../state/state-jsonl.md`.

---

## 6. GRACEFUL DEGRADATION

| Condition | Behavior |
|-----------|----------|
| No `graphEvents` and no finding row matching a stored question in any iteration | Block every non-terminal STOP until a graph decision exists |
| MCP unavailable | Rebuild graph-derived state from JSONL when possible |
| Fewer than 2 graph iterations | Mark graph signals `insufficient_data` |
| Graph has zero edges | Use `graphEdgeDensity = 0.0`; skip unsupported graph checks |
| `blendedScore` missing | Reducer uses numeric fallback instead of collapsing score to zero |

---

## 7. CALIBRATION NOTES

Relation weights are inherited from shared coverage graph logic and remain calibration-sensitive. These notes are guidance, not executable deep-research policy:

| Relation | Calibration Note |
|----------|------------------|
| `ANSWERS` | Primary convergence driver |
| `SUPPORTS` | Useful for evidence depth |
| `CONTRADICTS` | Should usually block or delay STOP until resolved |
| `SUPERSEDES` | Helps retire stale findings |
| `DERIVED_FROM` | Useful for lineage, not a STOP signal alone |
| `COVERS` | Supports question coverage |
| `CITES` | Supports source diversity |
