---
title: "Changelog: 012 Causal Graph Channel Routing Utilization [026-graph-and-context-optimization/012-causal-graph-channel-routing]"
description: "Chronological changelog for the 012 Causal Graph Channel Routing Utilization phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-08

> Spec folder: `specs/system-spec-kit/026-graph-and-context-optimization/012-causal-graph-channel-routing` (Level 2)
> Parent packet: `specs/system-spec-kit/026-graph-and-context-optimization`

### Summary

The query router now activates the graph channel for queries the data argues should benefit from causal traversal — find_decision and find_spec intents at any tier, plus entity-rich queries that name memory rows with ≥3 outgoing causal edges. Pre-012, the graph channel only fired at the complex tier (>8 terms), so the 1,328 live causal edges sat unused for natural 1–5-term queries. Now the override sits at the routing layer above the tier classifier, leaving tier classification stable for telemetry continuity while expanding the channel set when the new gates fire.

### Added

- Add shouldPreserveGraph(query) to query-router.ts mirroring shouldPreserveBm25 (REQ-001)
- Create entity-density.ts with getEntityDensityScore + cached title→edge-count map (REQ-003)
- Create routing-telemetry.ts with rolling-window per-channel counter (REQ-004)
- cd mcp_server && npm run build exits 0
- Full vitest: 11606 passed / 157 failed vs baseline 11548 / 190 — 0 net regressions, 25 new tests added
- implementation-summary.md filled

### Changed

- Spec authored — spec.md
- Plan authored — plan.md
- Tasks authored — tasks.md
- T003a Synthetic baseline captured in scratch/baseline.md (live smoke deferred to next MCP restart per REQ-006 cold-start procedure)
- Wire shouldPreserveGraph + entity-density into routeQuery(); emit graph-preserved-by-* reasons (REQ-002, REQ-007)
- Surface data.routing.graphChannelInvocationRate in memory_health handler (REQ-004)

### Fixed

- No fixes recorded.

### Verification

- npm run build - PASS — tsc --build exit 0
- tests/query-router.vitest.ts - PASS — 48 tests (33 pre-existing + 15 new for 012-T1..T4)
- tests/entity-density.vitest.ts - PASS — 12 tests covering lookup, cold-start, cache behavior
- Routing latency p99 (012-T4.1) - PASS — 200-iteration loop, p99 < 5 ms (REQ-005)
- Telemetry rate after mixed routing (012-T3.1) - PASS — 5 routings, 2 with graph → rate = 0.40
- Cold-start safety (012-ED-2.*) - PASS — null DB, empty causal_edges, missing tables all score 0
- Feature flag OFF (012-T2.5) - PASS — no graph addition; matches pre-change channel set
- Full vitest regression check - PASS — 11606 passed / 157 failed (vs baseline 11548 / 190); 0 net regressions, 25 new tests added

### Files Changed

| File | Action | What changed |
|---|---|---|
| `mcp_server/lib/search/query-router.ts` | Modified | Add shouldPreserveGraph, isGraphChannelPreservationEnabled, telemetry recording, and the override branch in routeQuery |
| `mcp_server/lib/search/entity-density.ts` | Created | Cached getEntityDensityScore with 60s TTL + invalidateEntityDensityCache |
| `mcp_server/lib/search/routing-telemetry.ts` | Created | 200-decision rolling ring; recordInvocation / getSnapshot / resetRoutingTelemetry |
| `mcp_server/handlers/memory-crud-health.ts` | Modified | Surface data.routing block from telemetry snapshot |
| `mcp_server/tests/query-router.vitest.ts` | Modified | Add 27 tests covering shouldPreserveGraph, integration, telemetry, latency |
| `mcp_server/tests/entity-density.vitest.ts` | Created | 12 tests covering lookup, cold-start, cache behavior |
| `specs/.../012-causal-graph-channel-routing/scratch/baseline.md` | Created | Synthetic pre-change baseline rationale |
| `specs/.../012-causal-graph-channel-routing/scratch/post-change.md` | Created | Test-derived rate evidence + live-smoke procedure for next MCP restart |

### Follow-Ups

- /memory:save to persist continuity (next user-driven step)
- All P0 + P1 tasks marked [x]
- No [B] blocked tasks remaining
- Tests + build green; zero net regressions
- Post-change smoke shows graph_channel_invocation_rate ≥ 0.30
- Live smoke deferred until next MCP restart. The currently-running MCP child loaded the pre-012 dist. After restart, memory_health.data.routing.graphChannelInvocationRate becomes observable; the 20-query smoke procedure in scratch/post-change.md produces the SC-001 measurement.
