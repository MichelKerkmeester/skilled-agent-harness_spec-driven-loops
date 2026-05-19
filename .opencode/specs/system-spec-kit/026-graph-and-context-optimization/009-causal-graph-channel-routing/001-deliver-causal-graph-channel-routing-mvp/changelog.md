---
title: "Changelog: 012 Causal Graph Channel Routing Utilization [026-graph-and-context-optimization/009-causal-graph-channel-routing]"
description: "Phase 012 activates the graph and degree channels for intent-driven and entity-rich short queries; surfaces graphChannelInvocationRate via memory_health.data.routing."
trigger_phrases:
  - "009-causal-graph-channel-routing"
  - "shouldPreserveGraph"
  - "entity-density override"
  - "graphChannelInvocationRate"
  - "graph-preserved-by-intent"
  - "graph-preserved-by-entity-density"
  - "SPECKIT_GRAPH_CHANNEL_PRESERVATION"
  - "routing-telemetry rolling counter"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-08

> Spec folder: `specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing` (Level 2)
> Parent packet: `specs/system-spec-kit/026-graph-and-context-optimization`

### Summary

The query router now activates the graph channel for queries the data argues should benefit from causal traversal — `find_decision` and `find_spec` intents at any tier, plus entity-rich queries that name memory rows with ≥3 outgoing causal edges. Pre-012, the graph channel only fired at the complex tier (>8 terms), so the 1,328 live causal edges sat unused for natural 1–5-term queries. Now the override sits at the routing layer above the tier classifier, leaving tier classification stable for telemetry continuity while expanding the channel set when the new gates fire. `memory_health.data.routing.graphChannelInvocationRate` exposes a rolling rate so operators can watch utilization without a separate probe.

### Added

- `shouldPreserveGraph(query, db)` in `query-router.ts` mirroring `shouldPreserveBm25`; emits `graph-preserved-by-intent` to `routingReasons` (REQ-001).
- `entity-density.ts` module with `getEntityDensityScore(query, db)` + `invalidateEntityDensityCache()`; 60s TTL cache of lowercase tokens drawn from titles/trigger_phrases of memory_index rows with ≥3 outgoing causal_edges (REQ-003).
- Entity-density override in `routeQuery()` — when ≥2 query tokens hit the cache, appends `graph` AND `degree` regardless of complexity tier; emits `graph-preserved-by-entity-density` (REQ-002, REQ-003, REQ-007).
- `routing-telemetry.ts` module — 200-decision rolling ring buffer with `recordInvocation()` / `getSnapshot()` / `resetRoutingTelemetry()` exposing per-channel counts and rates (REQ-004).
- `data.routing` block in `memory_health` response carrying `graphChannelInvocationRate`, `channelInvocationRates`, `totalRecorded`, `windowSize` (REQ-004).
- `SPECKIT_GRAPH_CHANNEL_PRESERVATION` env flag (default ON); set to `false` to no-op the override and revert to byte-for-byte pre-012 channel selection (REQ-008, P2 delivered).
- 27 new tests across `tests/query-router.vitest.ts` (15 — 012-T1..T4) and `tests/entity-density.vitest.ts` (12 — 012-ED-1..ED-3).

### Changed

- `routeQuery()` in `query-router.ts` now records every routing decision via `recordInvocation()` so telemetry is always live, including the feature-flag-disabled and complexity-router-disabled branches.
- `memory_health` response shape gains a top-level `data.routing` field (additive; downstream consumers that ignore unknown fields are unaffected).

### Fixed

- No fixes recorded — this packet is purely additive.

### Verification

- `npm run build` — PASS, `tsc --build` exit 0.
- `tests/query-router.vitest.ts` — PASS, 48 tests (33 pre-existing + 15 new).
- `tests/entity-density.vitest.ts` — PASS, 12 tests including cold-start safety (REQ-006).
- Routing latency microbenchmark 012-T4.1 — PASS, p99 < 5ms over 200-iteration loop (REQ-005).
- Telemetry rate test 012-T3.1 — PASS, 5 routings (2 with graph) → rate = 0.40 (REQ-004 acceptance criterion).
- Feature flag OFF (012-T2.5) — PASS, channel set matches pre-change behavior.
- Full vitest regression check — 11606 passed / 157 failed vs pre-change baseline 11548 / 190; **0 net regressions, 25 new tests added**.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` — PASS, Errors: 0 Warnings: 0.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `mcp_server/lib/search/query-router.ts` | Modified | Added `shouldPreserveGraph`, `isGraphChannelPreservationEnabled`, override branch in `routeQuery`, `safeGetDb()` wrapper, telemetry recording |
| `mcp_server/lib/search/entity-density.ts` | Created | Cached `getEntityDensityScore` with 60s TTL; cold-start safe; `invalidateEntityDensityCache()` for hooks |
| `mcp_server/lib/search/routing-telemetry.ts` | Created | 200-decision rolling ring; `recordInvocation` / `getSnapshot` / `resetRoutingTelemetry` |
| `mcp_server/handlers/memory-crud-health.ts` | Modified | Surface `data.routing` block from telemetry snapshot |
| `mcp_server/tests/query-router.vitest.ts` | Modified | Add 15 tests across 012-T1..T4 (unit, integration, telemetry, latency) |
| `mcp_server/tests/entity-density.vitest.ts` | Created | 12 tests across 012-ED-1..ED-3 (lookup, cold-start, cache) |
| `specs/.../009-causal-graph-channel-routing/spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Authored | Level 2 spec packet documents |
| `specs/.../009-causal-graph-channel-routing/scratch/baseline.md`, `scratch/post-change.md` | Created | Synthetic baseline rationale + live-smoke procedure |

### Follow-Ups

- **Live MCP smoke (deferred)**: 20-query procedure in `scratch/post-change.md`. Current MCP child runs the pre-012 dist; rate becomes observable after next restart. Closes SC-001 (`graph_channel_invocation_rate ≥ 0.30`).
- **Optional cache invalidation hooks**: wire `invalidateEntityDensityCache()` into post-commit paths of `memory-save.ts` / `memory-bulk-delete.ts` if 60s TTL lag matters in practice. Not blocking — TTL ensures false-negative bias only.
