---
title: "Feature Specification: 012 Causal Graph Channel Routing Utilization"
description: "Activate the graph and degree channels for intent-driven and short-query searches that currently route only through vector+fts+bm25 — 1,328 live causal edges sit unused because the complex-tier threshold (>8 terms) excludes essentially all natural queries."
trigger_phrases:
  - "009-causal-graph-channel-routing"
  - "graph channel skipped"
  - "causal graph underutilized"
  - "complexity router graph"
  - "shouldPreserveGraph"
  - "graph channel intent driven"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing"
    last_updated_at: "2026-05-08T10:35:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author spec for graph-channel routing activation under intent + entity-density signals"
    next_safe_action: "Decompose plan, then implement REQ-001 shouldPreserveGraph + REQ-002 entity-density signal"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/query-classifier.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/intent-classifier.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-causal-graph-channel-routing"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should graph channel activate for intent=understand on entity-rich queries, or restrict to find_decision/find_spec mirror of bm25 logic?"
      - "Telemetry threshold: what graph_channel_invocation_rate signals 'healthy utilization'?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 012 Causal Graph Channel Routing Utilization

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Shipped (012/001 closed 2026-05-08; remediation in 012/002-fix-deep-review-findings-for-causal-graph-channel-routing) |
| **Created** | 2026-05-08 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 12 |
| **Predecessor** | 011-cocoindex-daemon-resilience |
| **Successor** | None |
| **Handoff Criteria** | Cross-AI session live-trace shows graph channel activated for `find_decision` / `find_spec` queries and entity-rich `understand` queries; `graph_channel_invocation_rate` rises from ~0% (current) to a measurable baseline (target band declared post-baseline). |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Phase 12 of the 026 graph-and-context-optimization wrapper. The 010-graph-impact-and-affordance-uplift wrapper added causal-trust display and trust axes; this phase closes the runtime-utilization gap by ensuring the *channel selector* actually activates the graph channel for queries where causal traversal would surface results that vector+fts cannot.

**Scope Boundary**: Modify only the channel-selection logic in `query-router.ts` and `query-classifier.ts` (plus tests). Does NOT change: the graph traversal algorithm, edge creation pathways, or causal-trust scoring weights.

**Dependencies**:
- Existing `causal_edges` table (1,328 edges, 46.14% link coverage as of 2026-05-08T10:34Z snapshot).
- Existing `intent-classifier.ts` returning `find_spec | find_decision | understand | refactor | …`.
- Existing `query-router.ts` precedent: `shouldPreserveBm25` already upgrades simple-tier queries to bm25 when intent is `find_spec | find_decision`.

**Deliverables**:
- `shouldPreserveGraph(query)` mirroring `shouldPreserveBm25` with intent + entity-density rules.
- `entityDensityScore(query)` helper that flags queries whose terms map to high-edge-count `memory_index` rows (using a cached lookup, not per-query DB scan).
- Channel-list adjustment: when `shouldPreserveGraph(query) === true`, ensure `graph` (and optionally `degree`) is included regardless of complexity tier.
- Telemetry: `graph_channel_invocation_rate` exported via `memory_health` data, plus per-query `routingReasons` already produced by `buildRoutingQueryPlan` (reason `graph-preserved-by-intent` / `graph-preserved-by-entity-density`).
- Tests: unit + integration covering all four activation paths + non-activation control.

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The query complexity router (`query-router.ts:75-79`) only includes the `graph` channel for queries classified as `complex` (`>8 terms` per `query-classifier.ts:29`). Natural user queries are typically 1–5 terms, so they classify as `simple` (≤3 terms) or `moderate` (4–8 terms), both of which exclude `graph`. A live cross-AI session captured 2026-05-08 confirmed three sequential queries — "feature flag cleanup" (3 terms), "cli-opencode" (1 term), "cli-opencode orchestration dispatch skill" (5 terms) — all routed without `graph`. The `causal_edges` table currently holds 1,328 edges with 46.14% link coverage and avg_strength=0.83, so the data exists; only the routing logic ignores it.

### Purpose
Activate the graph channel for the queries where causal traversal materially improves recall — intent-driven retrieval (find_decision/find_spec) and entity-rich queries — without bloating the simple-tier latency budget for trivial lookups.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `shouldPreserveGraph(query)` in `query-router.ts` mirroring `shouldPreserveBm25` semantics.
- Add an entity-density signal: when ≥2 query terms exact-match titles/triggers of `memory_index` rows that have ≥3 outgoing `causal_edges`, treat the query as graph-worthy.
- Adjust `routeQuery()` to upgrade the channel set with `graph` (and optionally `degree`) when `shouldPreserveGraph(query) === true`, even at simple/moderate tier.
- Annotate `routingReasons` and `routingPlan` so the decision is auditable in `search-decisions.jsonl`.
- Add a `graph_channel_invocation_rate` metric to `memory_health.data.routing` over a rolling N-query window.
- Unit tests for: shouldPreserveGraph(intent=find_decision)=true, shouldPreserveGraph(intent=understand + low entity density)=false, entity-density signal lookup hit/miss, and routing integration where the graph channel appears in `selectedChannels`.

### Out of Scope
- Changing the graph traversal algorithm (`graph-search-fn.ts`).
- Changing how causal edges are *created* (that's the 010 wrapper's territory).
- Adjusting `causal_boost.ts` weight tuning.
- Lowering the `COMPLEX_TERM_THRESHOLD` constant — instead we add an *override* at the routing layer so the classifier stays stable for telemetry continuity.
- Recall/precision evaluation pipeline (out of band; track separately if the post-baseline metric warrants).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/query-router.ts` | Modify | Add `shouldPreserveGraph()` + integration in `routeQuery()`; route `graph` (and `degree` if entity-rich) into adjustedChannels; emit `routingReasons` |
| `mcp_server/lib/search/query-classifier.ts` | (no change) | Tier classification stays stable; the override happens at the router level |
| `mcp_server/lib/search/entity-density.ts` (new) | Create | Cached helper `getEntityDensityScore(query)`; uses `causal_edges` aggregated by source/target and a memoized title→edge-count map refreshed every N seconds |
| `mcp_server/handlers/memory-crud-health.ts` | Modify | Add `graph_channel_invocation_rate` to `data.routing` (rolling counter populated by router) |
| `mcp_server/lib/search/routing-telemetry.ts` (new or extend) | Create or extend | Maintain per-channel invocation counters; expose snapshot for memory_health |
| `mcp_server/tests/query-router.vitest.ts` | Modify | Add tests for shouldPreserveGraph + integration |
| `mcp_server/tests/entity-density.vitest.ts` (new) | Create | Cover cached-lookup hit/miss + cache-refresh staleness |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `shouldPreserveGraph(query)` returns true when `classifyIntent(query).intent ∈ {find_decision, find_spec}` | Unit test asserts true for "find related decisions about auth", "look up the spec for X"; false for "fix typo in readme" |
| REQ-002 | Channel-list adjustment: when `shouldPreserveGraph(query) === true`, the returned `selectedChannels` MUST include `graph` regardless of complexity tier | Integration test: a 3-term `find_decision` query routes through {vector, fts, bm25, graph} (NOT `complex`-tier `degree`); `routingReasons` contains `graph-preserved-by-intent` |
| REQ-003 | Entity-density override: when ≥2 query terms exact-match titles/trigger_phrases of memory_index rows with ≥3 outgoing causal edges, `selectedChannels` includes both `graph` and `degree` | Integration test seeds a memory with high-degree edges; query of its title returns selectedChannels containing graph+degree; `routingReasons` contains `graph-preserved-by-entity-density` |
| REQ-004 | Telemetry: `memory_health.data.routing.graphChannelInvocationRate` reports the share of recent queries whose selectedChannels included `graph` | Integration test: after 10 queries (4 graph-included, 6 not), the rate reports 0.4 ± rounding tolerance |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Cache for entity-density lookup MUST NOT add >5ms p99 latency to the routing decision | Microbenchmark in test or governance suite |
| REQ-006 | When the causal_edges table is empty (cold start), `shouldPreserveGraph` does NOT activate the entity-density override; intent-driven path still works | Edge-case test with a fresh DB |
| REQ-007 | `routingReasons` is emitted into `search-decisions.jsonl` for every router decision (existing behavior) — verify the new reasons surface there | Integration test scrapes the file after a known query and asserts the reason string |

### P2 - Optional (track for future)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Add a feature flag `SPECKIT_GRAPH_CHANNEL_PRESERVATION` (default ON) to disable the new override for A/B comparison | Env-flag test asserts opt-out behavior |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After this packet ships, ad-hoc smoke run of 20 representative queries (mix of find_spec / find_decision / understand / refactor intents) shows `graph_channel_invocation_rate ≥ 0.30`, vs. ~0.00 today (baseline captured pre-change).
- **SC-002**: All P0 + P1 acceptance criteria pass in unit + integration tests.
- **SC-003**: Microbenchmark shows <5 ms p99 added latency from the new path.
- **SC-004**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` exits 0.
- **SC-005**: `npm run build` exits 0; full vitest run regresses 0 tests vs. pre-change baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Graph channel activation degrades p95 latency for short queries | Med | Microbenchmark gate (REQ-005); feature flag (REQ-008); cap entity-density lookups via cached map (refresh every 60s) |
| Risk | False activation on noisy intent classification (intent classifier mis-labels "list features" as `find_decision`) | Low | Mirrors existing `shouldPreserveBm25` precedent that has been stable; new `routingReasons` makes mis-routes auditable |
| Risk | Entity-density cache becomes stale after bulk inserts/deletes | Low | Refresh on memory_bulk_delete and memory_save commit hooks; TTL fallback |
| Dependency | Existing `intent-classifier.ts` accuracy on intent labels | If accuracy drops, false activations grow | Coverage already monitored separately; if regressions appear, tighten threshold |
| Dependency | `causal_edges` table populated above coverage floor (currently 46.14%) | Below ~20% the entity-density signal becomes too sparse to fire | The intent-driven path still works regardless of edge count |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **Performance**: Routing decision time MUST stay <5 ms p99 (currently ~1 ms). Cache hit on entity-density map MUST be O(1).
- **Observability**: `routingReasons` MUST list every reason a channel was added; `graph_channel_invocation_rate` exposed via memory_health.
- **Backward Compatibility**: When the new override does NOT fire, channel selection behavior is unchanged from the current implementation. No existing tests should break.
- **Telemetry**: All routing decisions continue to flow through `search-decisions.jsonl` (existing pipeline); new reason strings adopt the `graph-preserved-by-*` prefix.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:complexity -->
## 7a. COMPLEXITY ASSESSMENT

| Dimension | Rating | Notes |
|-----------|--------|-------|
| **Code surface** | Low | ~80 LOC across 4 files plus 1 new module + tests |
| **Cross-file coupling** | Medium | Touches router, classifier surface, handler, schema, telemetry — but all changes are additive on top of an existing precedent (`shouldPreserveBm25`) |
| **Risk of regression** | Low–Medium | When the new override does NOT fire, behavior is byte-for-byte identical to current; full vitest suite validates non-regression |
| **Operational complexity** | Low | New telemetry counter is in-process; no new tables / migrations |
| **Time-to-value** | Fast | Implementation ~half a day; live-baseline measurement on 20 queries another half-day |
| **Reversibility** | High | Feature flag (REQ-008) + clean revert path |

Overall complexity: **Medium-Low**. Justifies Level 2 verification (checklist.md) but does not warrant Level 3 architecture review — the precedent for the override pattern already exists in the same file.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Empty query**: existing fallback returns `complex` tier — graph already included. New override is a no-op.
- **Cold-start DB (zero causal edges)**: entity-density override does NOT activate; intent-driven path still upgrades simple-tier `find_decision` queries to include graph (which is harmless because graph traversal returns empty). Verify graph channel handler tolerates empty edge set.
- **Trigger-match path forces simple tier**: existing trigger-match logic forces `simple` even when terms are many. The new override should still apply because it works at the router level *after* tier is set.
- **Feature-flag-disabled state**: when `SPECKIT_COMPLEXITY_ROUTER` is OFF (`!isComplexityRouterEnabled()`), the router returns ALL channels (including graph) — no change needed.
- **Graph channel handler not loaded**: `runChannelSubset` already short-circuits unimplemented channels; the override doesn't risk a runtime error.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Should graph channel activate for intent=`understand` on entity-rich queries, or restrict the entity-density override to `find_decision`/`find_spec`/`fix_bug` intents only? (Default: activate for all intents — entity density itself is the gate.)
- What is the target `graph_channel_invocation_rate` band for healthy utilization? Initial baseline pass needed before declaring a number; SC-001 ≥0.30 is a placeholder.
- Should `degree` channel always pair with `graph` in the override, or only when entity-density score crosses a higher threshold? (Default: pair both; degree adds little latency on cached lookups.)
<!-- /ANCHOR:questions -->

---
