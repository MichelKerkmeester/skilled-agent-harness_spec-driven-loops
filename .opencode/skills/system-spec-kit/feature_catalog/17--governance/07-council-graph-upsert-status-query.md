---
title: "Council graph upsert status query"
description: "council_graph_upsert, council_graph_status, and council_graph_query expose a write/read surface over the deep-AI-council planning graph for deterministic packet-local nodes."
---

# Council graph upsert status query

## 1. OVERVIEW

The council graph surface lets the deep AI council read and write its own planning graph through three coordinated tools. `council_graph_upsert` writes a node identified by `nodeId` with a `kind` tag and arbitrary attributes. `council_graph_status` returns node and edge counts so callers can confirm health before issuing a query. `council_graph_query` returns nodes that match a free-form query against the council graph state.

The three tools share a packet-local storage layer so council deliberations stay traceable inside the originating spec packet without leaking into the global memory index.

---

## 2. CURRENT REALITY

Each tool lives under `mcp_server/handlers/council-graph/` and shares the validation, persistence, and response-shape conventions of the larger handler registry. Upsert is idempotent on `nodeId`. Status returns non-negative counts even when the graph is empty. Query returns nodes plus cited graph records for downstream council consumers.

- `council_graph_upsert(nodeId, kind, attributes)`: idempotent write
- `council_graph_status()`: count surface for nodes and edges
- `council_graph_query(query)`: node-and-record return for council consumers

The handlers are packet-local: writes do not bleed into the memory_index or causal_edges tables that back regular memory search.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/council-graph/upsert.ts` | Handler | Idempotent node upsert |
| `mcp_server/handlers/council-graph/status.ts` | Handler | Node/edge count surface |
| `mcp_server/handlers/council-graph/query.ts` | Handler | Node-and-record query return |

### Validation And Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/council-graph.vitest.ts` | Upsert idempotence, status counts, query return shape |

---

## 4. SOURCE METADATA
- Group: Governance
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `17--governance/07-council-graph-upsert-status-query.md`
