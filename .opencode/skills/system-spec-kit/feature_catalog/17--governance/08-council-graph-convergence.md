---
title: "Council graph convergence"
description: "council_graph_convergence reports a convergence score, blocker list, and insufficient-evidence guidance for the council planning graph so sparse states return diagnosable output instead of crashing."
---

# Council graph convergence

## 1. OVERVIEW

`council_graph_convergence` reads the council graph state and reports whether the deliberation has converged. The handler returns a convergence score, a blocker list naming the missing dimensions, and explicit insufficient-evidence guidance when the graph is too sparse to score.

The endpoint is read-only. It exists so council operators can decide whether to continue deliberation, request more evidence, or declare convergence without running through the full council loop manually.

---

## 2. CURRENT REALITY

The convergence handler reads node and edge counts, runs the convergence scoring rules over the current graph state, and emits a structured response. The scoring rules require a minimum evidence count per dimension before declaring convergence; below that threshold the response returns blockers naming the missing dimensions and recommended next actions.

- `score`: numeric convergence score on a documented scale
- `blockers`: ordered list of unmet dimensions
- `insufficientEvidence`: explicit flag when the graph is too sparse to score reliably

The handler never throws on sparse input. Callers can treat any non-PASS state as actionable guidance rather than an error.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/council-graph/convergence.ts` | Handler | Convergence scoring and blocker reporting |

### Validation And Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/council-graph-convergence.vitest.ts` | Score boundaries, blocker shape, sparse-input handling |

---

## 4. SOURCE METADATA
- Group: Governance
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `17--governance/08-council-graph-convergence.md`
