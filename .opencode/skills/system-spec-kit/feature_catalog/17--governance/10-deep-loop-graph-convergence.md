---
title: "Deep-loop graph convergence"
description: "deep_loop_graph_convergence reports a convergence score, missing-dimension list, and next-action guidance for the deep-loop coverage graph so sparse iteration states return diagnosable output."
---

# Deep-loop graph convergence

## 1. OVERVIEW

`deep_loop_graph_convergence` reads the deep-loop coverage graph and reports whether the iteration set has converged. The handler returns a convergence score, a missing-dimension list, and a next-action recommendation when sparse evidence prevents a confident verdict.

The endpoint is read-only. It exists so deep-research and deep-review runners can decide whether to continue iterating, request more evidence, or declare convergence without re-running the full loop.

---

## 2. CURRENT REALITY

The handler reads node and edge state from the coverage graph, applies the convergence scoring rules per iteration dimension, and emits a structured response. Sparse states return blockers naming the missing dimensions plus a next-action string so callers can act without inspecting the raw graph.

- `score`: numeric convergence score on a documented scale
- `missingDimensions`: ordered list of unmet dimensions
- `nextAction`: named follow-on (continue iteration, request evidence, or declare convergence)

The handler never throws on sparse input. Callers receive a structured payload they can branch on deterministically.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/coverage-graph/convergence.ts` | Handler | Convergence scoring and missing-dimension reporting |

### Validation And Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/coverage-graph-convergence.vitest.ts` | Score boundaries, missing-dimension shape, sparse-input handling |

---

## 4. SOURCE METADATA
- Group: Governance
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `17--governance/10-deep-loop-graph-convergence.md`
