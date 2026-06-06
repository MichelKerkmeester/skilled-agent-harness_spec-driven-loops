---
title: "Graph channel preservation"
description: "The router preserves the graph (and degree) channel for find_decision/find_spec intents and entity-rich short queries even at simple/moderate complexity tier, so causal-edge data is no longer ignored on natural queries."
trigger_phrases:
  - "graph channel preservation"
  - "SPECKIT_GRAPH_CHANNEL_PRESERVATION"
  - "preserve graph channel for short queries"
  - "entity-density routing override"
  - "find_decision find_spec intent routing"
---

# Graph channel preservation

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The router preserves the graph (and degree) channel for find_decision/find_spec intents and entity-rich short queries even at simple/moderate complexity tier, so causal-edge data is no longer ignored on natural queries.

The complexity router used to gate the graph channel behind the >8-term complex tier, which natural user queries (1-5 terms) almost never hit. With 1,328 stored causal edges sitting unused on those queries, this feature adds a routing-layer override that fires graph based on intent and entity-density signals — turning previously-dormant traversal data into recall improvements without bloating the simple-tier latency budget. The override mirrors the existing `shouldPreserveBm25` precedent so the pattern stays consistent and feature-flag-revertible.

## 2. HOW IT WORKS

### Entry Point & Routing

`shouldPreserveGraph(query, db)` lives next to `shouldPreserveBm25` in `query-router.ts` and returns a `{ preserved, reasons, includeDegree }` decision. Two gates fire it:

- **Intent gate** — when `classifyIntent(query).intent` is `find_spec` or `find_decision`, preservation activates with reason `graph-preserved-by-intent`. No DB read, so the path stays cheap on the cold path; `degree` is NOT added (intent alone doesn't justify the high-fanout channel).
- **Entity-density gate** — when ≥2 query tokens (post-stopword filter) hit a cached set of lowercase tokens drawn from `memory_index.title` and `trigger_phrases` of rows with ≥3 outgoing `causal_edges`, preservation activates with reason `graph-preserved-by-entity-density`, and `degree` is also added because the query is provably touching a high-fanout node.

The channel-set adjustment happens in `routeQuery()` AFTER the tier classifier returns, so tier classification stays stable for telemetry continuity (per spec §3 Out of Scope). When `shouldPreserveGraph` returns `preserved: true`, `enforceMinimumChannels([...adjustedChannels, 'graph', maybeDegree])` produces the final selectedChannels and the corresponding reasons get appended to `routingPlan.routingReasons`. Complex-tier queries already include graph, so the override is a no-op there (verified by 012-T2.4).

### Edge Cases & Caveats

The entity-density cache is module-scoped in `entity-density.ts`. It rebuilds lazily on a 60s TTL or via `invalidateEntityDensityCache()`. Cold-start (no DB or empty `causal_edges` table) returns score 0, so the override stays inactive when the signal would be unreliable (REQ-006). Cache lookup is O(1) Set membership; the SQL build query (`INNER JOIN ... HAVING COUNT(*) >= 3`) runs only on refresh, not per-query.

A 200-decision rolling ring in `routing-telemetry.ts` records every routing decision via `recordInvocation(channels)`. `getSnapshot()` exposes per-channel counts, per-channel rates, and the headline `graphChannelInvocationRate`, which `memory_health.data.routing` surfaces alongside `channelInvocationRates`, `totalRecorded`, and `windowSize`.

### Configuration

The `SPECKIT_GRAPH_CHANNEL_PRESERVATION` flag is **enabled by default** (`isGraphChannelPreservationEnabled()` returns true unless `SPECKIT_GRAPH_CHANNEL_PRESERVATION=false`). When disabled, the override no-ops and the channel set reverts to byte-for-byte pre-012 behavior — clean rollback path.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/query-router.ts` | Lib | `shouldPreserveGraph`, `isGraphChannelPreservationEnabled`, override branch in `routeQuery`, `safeGetDb` wrapper, telemetry recording |
| `mcp_server/lib/search/entity-density.ts` | Lib | Cached high-degree title/trigger lookup with 60s TTL; tokenizer, build query, invalidate API |
| `mcp_server/lib/search/routing-telemetry.ts` | Lib | 200-decision rolling ring buffer; `recordInvocation` / `getSnapshot` / `resetRoutingTelemetry` |
| `mcp_server/lib/search/intent-classifier.ts` | Lib | Consumed unchanged — supplies `classifyIntent(query).intent` used by the intent gate |
| `mcp_server/handlers/memory-crud-health.ts` | Handler | Surface `data.routing` block on memory_health responses |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/query-router.vitest.ts` | Automated test | 012-T1.* (shouldPreserveGraph unit), 012-T2.* (routeQuery integration + feature flag), 012-T3.* (telemetry rate), 012-T4.* (latency microbenchmark) |
| `mcp_server/tests/entity-density.vitest.ts` | Automated test | 012-ED-1.* (lookup hits), 012-ED-2.* (cold-start safety), 012-ED-3.* (cache lifecycle) |
| `mcp_server/tests/routing-telemetry-stress.vitest.ts` | Automated test | 012-S1.* (ring overflow), 012-S2.* (1000-iter latency), 012-S3.* (cache invalidation stress), 012-S4.* (feature flag OFF live path) |

---

### TRACEABILITY

| Claim | Source | Lines |
|-------|--------|-------|
| `shouldPreserveGraph` returns true for find_spec / find_decision | `query-router.ts` | 228-255 |
| Override happens at router level, not classifier | `query-router.ts:routeQuery` | 392-429 |
| Entity-density cache rebuilds on 60s TTL | `entity-density.ts` | 105-123 |
| Cold-start: empty causal_edges → score 0 | `entity-density.ts` | 78-139 |
| Telemetry rolling ring of 200 decisions | `routing-telemetry.ts` | 18-38 |
| `data.routing` block in memory_health | `memory-crud-health.ts` | 629-683 |
| Default-on flag (`raw !== 'false'`) | `query-router.ts:isGraphChannelPreservationEnabled` | 182-198 |
| Spec REQ-001..REQ-008 | `specs/.../009-causal-graph-channel-routing/spec.md` | 136-155 |

## 4. SOURCE METADATA
- Group: Query Intelligence
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `12--query-intelligence/graph-channel-preservation.md`
- Related entries: `12--query-intelligence/query-complexity-router.md` (tier classifier — unchanged here, override sits above it), `12--query-intelligence/graph-concept-routing.md` (graph traversal algorithm — unchanged here), `03--discovery/health-diagnostics-memoryhealth.md` (surfaces the new `data.routing` block)
Related references:
- [graph-concept-routing.md](graph-concept-routing.md) — Graph concept routing
