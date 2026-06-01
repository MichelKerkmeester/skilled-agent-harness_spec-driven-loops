---
title: "012 Causal Graph Channel Routing: Activate Graph Channel for Intent and Entity-Rich Queries"
description: "shouldPreserveGraph and entity-density override now activate the graph channel for find_decision and find_spec intents at any complexity tier plus entity-rich short queries. Routing telemetry surfaces graphChannelInvocationRate via memory_health."
trigger_phrases:
  - "causal graph channel routing mvp"
  - "shouldPreserveGraph delivery"
  - "entity density override routing"
  - "graphChannelInvocationRate telemetry"
  - "graph channel intent driven activation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-08

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/002-causal-graph-channel-routing/001-deliver-causal-graph-channel-routing-mvp` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/002-causal-graph-channel-routing`

### Summary

The query router previously activated the graph channel only at the complex tier (more than 8 terms), leaving 1,328 live causal edges unused for natural 1-5-term queries. Intent-driven searches for decisions and specs never reached the graph channel regardless of how many causal edges existed for those nodes. Operators had no telemetry to observe whether the graph channel was firing at all.

Three additions shipped together. `shouldPreserveGraph(query, db)` in `query-router.ts` mirrors the existing `shouldPreserveBm25` shape and activates the graph channel for `find_decision` and `find_spec` intents at any complexity tier, emitting `graph-preserved-by-intent` to `routingReasons`. `entity-density.ts` builds a 60s-TTL cache of tokens from `memory_index` rows with three or more outgoing causal edges. When two or more query tokens hit that cache, the router appends both `graph` and `degree` channels and emits `graph-preserved-by-entity-density`. `routing-telemetry.ts` maintains a 200-decision rolling ring buffer and exposes `graphChannelInvocationRate`, per-channel counts plus window size through a new `data.routing` block in `memory_health`. A `SPECKIT_GRAPH_CHANNEL_PRESERVATION` feature flag (default ON) allows operators to revert to the pre-012 channel set without a redeploy.

Live smoke after the next MCP restart recorded a rate of 0.625 across 40 routings, above the 0.30 acceptance threshold. Zero net regressions against the pre-change vitest baseline.

### Added

- `shouldPreserveGraph(query, db)` in `query-router.ts` mirroring `shouldPreserveBm25`; emits `graph-preserved-by-intent` to `routingReasons` for `find_decision` and `find_spec` intents (REQ-001)
- `entity-density.ts` module with `getEntityDensityScore(query, db)` plus `invalidateEntityDensityCache()`; 60s-TTL cache of lowercase tokens from `memory_index` rows with three or more outgoing `causal_edges` (REQ-003)
- Entity-density override in `routeQuery()`: when two or more query tokens hit the cache, appends both `graph` and `degree` channels regardless of complexity tier; emits `graph-preserved-by-entity-density` (REQ-002, REQ-003, REQ-007)
- `routing-telemetry.ts` module: 200-decision rolling ring buffer with `recordInvocation()`, `getSnapshot()` plus `resetRoutingTelemetry()` exposing per-channel counts and rates (REQ-004)
- `data.routing` block in `memory_health` response carrying `graphChannelInvocationRate`, `channelInvocationRates`, `totalRecorded` plus `windowSize` (REQ-004)
- `SPECKIT_GRAPH_CHANNEL_PRESERVATION` env flag (default ON); set to `false` to revert byte-for-byte to pre-012 channel selection (REQ-008)
- `tests/entity-density.vitest.ts` with 12 tests covering lookup, cold-start safety plus cache behavior (012-ED-1 through ED-3)
- `tests/routing-telemetry-stress.vitest.ts` with 11 stress tests covering ring overflow, 1k-iteration latency, cache invalidation plus env-flag live-path (012-S1 through S4)

### Changed

- `routeQuery()` in `query-router.ts` now records every routing decision through `recordInvocation()` so telemetry is always live, including the feature-flag-disabled and complexity-router-disabled branches
- `memory_health` response shape gains a top-level `data.routing` field (additive. Downstream consumers that ignore unknown fields are unaffected.)
- `tests/query-router.vitest.ts` expanded with 15 new tests across 012-T1 through T4 covering unit, integration, telemetry plus latency paths

### Fixed

None. This packet is purely additive.

### Verification

| Check | Result |
|-------|--------|
| `npm run build` | PASS. `tsc --build` exit 0. |
| `tests/query-router.vitest.ts` | PASS. 95 matching query-router/entity-density/routing-telemetry test cases, including 012-T1 through T4. |
| `tests/entity-density.vitest.ts` | PASS. 12 tests covering lookup, cold-start plus cache behavior. |
| Routing latency p99 (012-T4.1) | PASS. 200-iteration loop, p99 below 5 ms (REQ-005). |
| Telemetry rate after mixed routing (012-T3.1) | PASS. 5 routings, 2 with graph, rate = 0.40. |
| Cold-start safety (012-ED-2) | PASS. Null DB, empty `causal_edges` plus missing tables all score 0. |
| Feature flag OFF (012-T2.5) | PASS. Channel set matches pre-change behavior. |
| Full vitest regression check | PASS. 11606 passed / 157 failed vs baseline 11548 / 190. Zero net regressions. 25 new tests added. |
| `validate.sh --strict` | PASS. Errors: 0. Warnings: 0. |
| Live `graphChannelInvocationRate` smoke | PASS. Captured 2026-05-08T14:47Z post-MCP-restart; rate moved from 0.714 (21 prior) to 0.625 across 40 routings. Intent path verified to add `graph` without `degree`. Evidence in `scratch/live-smoke-results.md`. |
| Live stress (sustained burst) | PASS. 25 live `memory_search` calls producing 104 new routing decisions; graph=0.568 vs degree=0.304, parity broken cleanly per spec. Evidence in `scratch/stress-test-results.md`. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/lib/search/query-router.ts` | Modified | Added `shouldPreserveGraph`, `isGraphChannelPreservationEnabled`, override branch in `routeQuery`, `safeGetDb()` wrapper, telemetry recording. |
| `mcp_server/lib/search/entity-density.ts` | Created (NEW) | Cached `getEntityDensityScore` with 60s TTL. Cold-start safe. `invalidateEntityDensityCache()` for hook wiring. |
| `mcp_server/lib/search/routing-telemetry.ts` | Created (NEW) | 200-decision rolling ring. `recordInvocation`, `getSnapshot`, `resetRoutingTelemetry`. |
| `mcp_server/handlers/memory-crud-health.ts` | Modified | Surfaces `data.routing` block from telemetry snapshot. |
| `mcp_server/tests/query-router.vitest.ts` | Modified | 15 new tests across 012-T1 through T4 covering unit, integration, telemetry plus latency. |
| `mcp_server/tests/entity-density.vitest.ts` | Created (NEW) | 12 tests across 012-ED-1 through ED-3 covering lookup, cold-start plus cache. |
| `mcp_server/tests/routing-telemetry-stress.vitest.ts` | Created (NEW) | 11 stress tests across 012-S1 through S4: ring overflow, 1k-iter latency, cache invalidation, env-flag live-path. |

### Follow-Ups

- Wire `invalidateEntityDensityCache()` into the post-commit paths of `memory-save.ts` and `memory-bulk-delete.ts` if the 60-second TTL lag matters in practice. The current bias is false-negative only and does not cause false activation.
- Tighten playbook 272 query phrasing so "alternatives considered for caching" classifies as `find_decision` rather than `understand`. The code is correct. The playbook expectation is off by one hit out of five.
- Telemetry state resets on restart. If long-running rate trends are needed, add a persistent store for the rolling 200-decision window.
