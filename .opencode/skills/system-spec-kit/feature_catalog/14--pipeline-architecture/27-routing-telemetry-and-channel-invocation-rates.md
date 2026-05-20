---
title: "Routing telemetry and channel invocation rates"
description: "memory_health.data.routing reports rolling channel-invocation rates and a graphChannelInvocationRate so operators can observe how often each retrieval channel is firing and confirm intent-driven graph-channel preservation is active."
---

# Routing telemetry and channel invocation rates

## 1. OVERVIEW

The query-router maintains a rolling window of routing decisions per process. `memory_health` exposes that window under `data.routing` so operators can see how often each retrieval channel is being invoked and whether graph-channel preservation is firing for the expected intents.

The telemetry is in-process state with a fixed window size. It supports the graph-channel preservation contract: when `SPECKIT_GRAPH_CHANNEL_PRESERVATION=true` (default) and an incoming query is classified as `find_decision` or `find_spec`, the router preserves the graph channel even when other heuristics would skip it. The flag opt-out drops the rate to zero so the override can be disabled without code changes.

---

## 2. CURRENT REALITY

`mcp_server/lib/search/routing-telemetry.ts` records each routing decision with channel attribution and writes a structured `routingReasons` field to `mcp_server/data/search-decisions.jsonl`. The health handler reads the in-process counters and reports them on the `data.routing` envelope.

- `graphChannelInvocationRate`: rolling rate of routings that included the graph channel
- `channelInvocationRates`: per-channel rate map (vector, fts, bm25, graph, degree)
- `totalRecorded`: integer count of routings inside the window
- `windowSize`: fixed window length

The router uses an entity-density cache and an intent classifier to make the preservation decision. Both surfaces emit named reasons (`graph-preserved-by-intent`, `graph-preserved-by-entity-density`) so the JSONL audit log can be filtered by cause.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/routing-telemetry.ts` | Library | Rolling window, channel attribution, rate computation |
| `mcp_server/lib/search/query-router.ts` | Library | Routing decisions, graph-channel preservation gating |
| `mcp_server/handlers/memory-health.ts` | Handler | Surfaces `data.routing` envelope on health responses |

### Validation And Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/query-router.vitest.ts` | Routing decisions and telemetry recording shape |
| `mcp_server/tests/query-router-channel-interaction.vitest.ts` | Channel-interaction matrix |
| `mcp_server/tests/routing-telemetry-stress.vitest.ts` | Window stability under load and reset behavior |

---

## 4. SOURCE METADATA
- Group: Pipeline Architecture
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `14--pipeline-architecture/27-routing-telemetry-and-channel-invocation-rates.md`
