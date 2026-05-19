---
title: "Implementation Plan: 012 Causal Graph Channel Routing Utilization"
description: "Mirror the existing shouldPreserveBm25 pattern with shouldPreserveGraph + entity-density override; add routingReasons telemetry and a graph_channel_invocation_rate metric on memory_health."
trigger_phrases:
  - "009-causal-graph-channel-routing plan"
  - "shouldPreserveGraph plan"
  - "entity density routing plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing"
    last_updated_at: "2026-05-08T10:35:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author plan for graph-channel routing utilization"
    next_safe_action: "Start T004 (shouldPreserveGraph helper)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-causal-graph-channel-routing"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 012 Causal Graph Channel Routing Utilization

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mcp_server) |
| **Framework** | Node.js MCP server |
| **Storage** | SQLite (`causal_edges`, `memory_index`) |
| **Testing** | Vitest |

### Overview
Mirror the existing `shouldPreserveBm25` precedent (`query-router.ts:120-128`) with a new `shouldPreserveGraph()` helper that activates the `graph` channel when intent is `find_decision` / `find_spec` or when an entity-density cache lookup confirms ≥2 query terms map to memory_index rows with high outgoing-edge counts. Emit auditable `routingReasons` strings (`graph-preserved-by-intent`, `graph-preserved-by-entity-density`) and surface a rolling `graphChannelInvocationRate` metric in `memory_health`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (SC-001..005)
- [x] Dependencies identified (`intent-classifier`, `causal_edges`, `query-router`)
- [ ] Baseline `graph_channel_invocation_rate` captured pre-change

### Definition of Done
Note: Closed 2026-05-08 with deep-review remediation tracked in 002-fix-deep-review-findings-for-causal-graph-channel-routing/.

- [x] REQ-001 — `shouldPreserveGraph` implemented + intent-driven test passes
- [x] REQ-002 — Channel-list adjustment in `routeQuery()` integrated; routingReasons surface
- [x] REQ-003 — Entity-density helper + cache implemented and tested
- [x] REQ-004 — Rolling-window invocation-rate metric exposed via `memory_health`
- [x] REQ-005 — Microbenchmark <5ms p99
- [x] REQ-006 — Cold-start DB edge case test passes
- [x] REQ-007 — `search-decisions.jsonl` carries new reasons
- [x] REQ-008 — Feature flag (P2; deferral ok)
- [x] `npm run build` exits 0
- [x] Full vitest run regresses 0 tests vs. pre-change baseline
- [x] `validate.sh --strict` exits 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Override at the *router* layer — keep the *classifier* tier-stable for telemetry continuity. New helpers slot in between `classifyQueryComplexity()` and `getChannelSubset()`, expanding the channel list with `graph` (and optionally `degree`) when a preservation rule fires.

### Key Components
- **`shouldPreserveGraph(query)`** (new, `query-router.ts`): pure function — input query, output boolean + reason.
- **`getEntityDensityScore(query, db)`** (new, `entity-density.ts`): cached lookup — returns count of high-degree entity matches.
- **Title→edge-count cache** (new, in `entity-density.ts`): refreshes every 60s OR on `memory_bulk_delete` / `memory_save` notification (tap into existing post-commit hooks).
- **`routingTelemetry.recordInvocation(channels)`** (new or extend `routing-telemetry.ts`): rolling counter; per-channel hit rate over last N=200 routing decisions.
- **`memory_health` handler**: read `routingTelemetry.snapshot()` and emit under `data.routing.graphChannelInvocationRate`.

### Data Flow
1. Query enters `routeQuery(query, triggers)`.
2. Existing classifier returns tier (simple/moderate/complex).
3. NEW: `shouldPreserveGraph(query)` checks intent + entity-density.
4. If true, channels = enforceMinimumChannels([...tierChannels, 'graph', maybeDegree]).
5. routingPlan.routingReasons appends `graph-preserved-by-intent` and/or `graph-preserved-by-entity-density`.
6. routingTelemetry.recordInvocation(channels).
7. Existing pipeline executes selected channels.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `query-router.ts:routeQuery` | Channel-set producer for executor | **Update** — branch on shouldPreserveGraph after tier classification | Unit + integration tests |
| `query-router.ts:shouldPreserveBm25` | Existing intent-driven channel preservation | **Reference** — mirror its shape | grep confirms naming convention |
| `query-classifier.ts` | Tier classifier | **Unchanged** — keep tier semantics stable for telemetry continuity | grep + test |
| `intent-classifier.ts` | Intent label producer | **Unchanged** — consume only | existing tests |
| `entity-density.ts` (new) | New cached entity-density signal | **Create** | new test file |
| `routing-telemetry.ts` (new or extend) | Rolling counter for channel invocations | **Create or extend** | new test |
| `memory-crud-health.ts` | `memory_health` response builder | **Update** — add `data.routing` block | extend existing test |
| `search-decisions.jsonl` (data file) | Audit trail | **Unchanged shape; new reason strings** | integration test scrapes file |

Required inventories:
- Same-class producers: `rg -n 'should[A-Z]\\w+|routingReasons' .opencode/skills/system-spec-kit/mcp_server/lib/search`.
- Consumers of changed symbols: `rg -n 'selectedChannels|routingReasons|graph_channel|graphChannelInvocationRate' .opencode/skills/system-spec-kit/mcp_server`.
- Algorithm invariant: when shouldPreserveGraph(q)=true, selectedChannels MUST contain `graph` regardless of tier; when false, behavior is byte-for-byte identical to current routing.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Spec authored
- [x] Plan authored
- [ ] Pre-change baseline captured: run 20 representative queries, log `selectedChannels`, compute `graph_channel_invocation_rate` baseline (expected ~0)

### Phase 2: Core Implementation
- [ ] T004 `shouldPreserveGraph(query)` helper (REQ-001)
- [ ] T005 `entity-density.ts` module + cache (REQ-003)
- [ ] T006 `routeQuery` integration (REQ-002)
- [ ] T007 `routing-telemetry.ts` rolling counter (REQ-004)
- [ ] T008 `memory_health` handler exposure (REQ-004)
- [ ] T009 Unit tests for shouldPreserveGraph
- [ ] T010 Integration tests for routeQuery
- [ ] T011 Cold-start edge-case test (REQ-006)
- [ ] T012 Microbenchmark for routing latency (REQ-005)
- [ ] T013 Feature flag wiring (REQ-008, optional)

### Phase 3: Verification
- [ ] T014 Build dist + run full vitest
- [ ] T015 Capture post-change `graph_channel_invocation_rate` from same 20-query smoke
- [ ] T016 `validate.sh --strict` exits 0
- [ ] T017 Update implementation-summary.md
- [ ] T018 Save context via `/memory:save`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `shouldPreserveGraph`, `getEntityDensityScore`, `routingTelemetry` rolling counter | Vitest |
| Integration | `routeQuery` end-to-end channel selection across intent + entity-density paths | Vitest with seeded SQLite |
| Microbenchmark | Routing decision p99 latency under cache hit/miss | Vitest perf assertion |
| Manual smoke | 20-query baseline & post-change comparison | MCP `memory_search` calls |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `intent-classifier.ts` accuracy | Internal | Green | False activations if accuracy regresses |
| `causal_edges` populated | Internal | Yellow (46% coverage) | Entity-density signal weakens below ~20% — intent-driven path unaffected |
| Cache-refresh hooks (`memory_bulk_delete`, `memory_save`) | Internal | Green | Stale cache for ≤60s if hooks miss; TTL fallback covers |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Latency regression >5ms p99, or false-activation rate (graph channel chosen for queries where it adds no recall) measurably hurts result quality.
- **Procedure**:
  1. Toggle `SPECKIT_GRAPH_CHANNEL_PRESERVATION=off` (REQ-008) — the override no-ops.
  2. If REQ-008 not implemented yet, `git revert <commit>` of the router change; rebuild.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES (LEVEL 2 ADDENDUM)

| Phase | Depends On | Why |
|-------|------------|-----|
| Phase 1 (Setup + baseline) | None | Pure observation — record baseline `graph_channel_invocation_rate` |
| Phase 2 (Implementation) | Phase 1 baseline captured | Baseline must exist to compare delta in REQ-004 |
| Phase 3 (Verification) | Phase 2 complete + dist built | Live smoke needs new dist |

External dependencies (unblocked):
- `intent-classifier.ts` — already shipped, accuracy independently monitored.
- `causal_edges` populated above floor — already at 46% coverage.

External dependencies (blocked-on if missing):
- MCP child restart for live smoke — same operational pattern as packet 055; can be batched with that restart.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATION (LEVEL 2 ADDENDUM)

| Task | Estimate | Notes |
|------|----------|-------|
| T004 `shouldPreserveGraph` | 30 min | Mirror existing helper |
| T005 `entity-density.ts` + cache | 2 h | New module + cache invalidation hooks |
| T006 `routeQuery` integration | 30 min | Add the override branch |
| T007 `routing-telemetry.ts` rolling counter | 1 h | New module |
| T008 `memory_health` exposure | 30 min | Surface telemetry snapshot |
| T009–T013 Tests | 3 h | Unit + integration + microbenchmark + edge cases |
| T014–T019 Verification + docs | 1.5 h | Build, full vitest, smoke, validate, summary |
| **Total** | **~9 h** | One focused day plus baseline observation half-day |

Sensitivity: if cache invalidation hooks turn out to require deeper integration into save/delete paths, Phase 2 could grow another 2 h. Cap is ~12 h.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK (LEVEL 2 ADDENDUM)

Multi-stage rollback plan:

| Stage | Trigger | Action |
|-------|---------|--------|
| 1 — Soft disable | Latency >5ms p99 in microbenchmark or production smoke | Set `SPECKIT_GRAPH_CHANNEL_PRESERVATION=off`; override no-ops; behavior matches pre-change |
| 2 — Code revert | Subtle correctness bug surfaced (false routing decisions) | `git revert <commit>` for router + entity-density + telemetry; `npm run build`; restart MCP child |
| 3 — Schema revert | New `data.routing` block consumed by external tooling and shape needs to roll back | Revert handler change; downstream consumers see the field absent (was never required) |

Recovery validation after each stage:
- Stage 1: `routingReasons` for a known query no longer contains `graph-preserved-by-*`.
- Stage 2: full vitest suite green; `selectedChannels` for known queries matches pre-change set.
- Stage 3: `memory_health.data.routing` field absent.
<!-- /ANCHOR:enhanced-rollback -->

---
