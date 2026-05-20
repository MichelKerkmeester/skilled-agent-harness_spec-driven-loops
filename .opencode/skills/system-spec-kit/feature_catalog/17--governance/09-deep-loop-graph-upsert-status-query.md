---
title: "Deep-loop graph upsert status query"
description: "deep_loop_graph_upsert, deep_loop_graph_status, and deep_loop_graph_query expose a write/read surface over the deep-loop coverage graph for iteration-tracking nodes."
---

# Deep-loop graph upsert status query

## 1. OVERVIEW

The deep-loop graph surface mirrors the council graph contract for deep-research and deep-review iteration tracking. `deep_loop_graph_upsert` writes a node tagged with a kind such as `iteration`. `deep_loop_graph_status` returns non-negative node and edge counts. `deep_loop_graph_query` returns matching nodes for downstream consumers.

The surface lets the deep-loop runners keep iteration evidence in a packet-local graph that the convergence engine can score without crossing into general memory indexing.

---

## 2. CURRENT REALITY

The three handlers live under `mcp_server/handlers/coverage-graph/`. Upsert is keyed on `nodeId` and is idempotent. Status returns counts even for an empty graph. Query supports free-form input and returns cited graph records.

- `deep_loop_graph_upsert(nodeId, kind, attributes)`: idempotent iteration-node write
- `deep_loop_graph_status()`: count surface for nodes and edges
- `deep_loop_graph_query(query)`: node-and-record return for iteration consumers

The surface is packet-local. Deep-loop iterations remain visible inside their originating spec packet without polluting the global memory index.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/coverage-graph/upsert.ts` | Handler | Idempotent node upsert |
| `mcp_server/handlers/coverage-graph/status.ts` | Handler | Node/edge count surface |
| `mcp_server/handlers/coverage-graph/query.ts` | Handler | Node-and-record query return |
| `mcp_server/handlers/coverage-graph/index.ts` | Handler | Registry wiring |

### Validation And Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/coverage-graph.vitest.ts` | Upsert idempotence, status counts, query return shape |

---

## 4. SOURCE METADATA
- Group: Governance
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `17--governance/09-deep-loop-graph-upsert-status-query.md`
