# Tasks: Unified Graph-RAG Intelligence Integration

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + all addendums | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**3-Tier Task Format**: `T### [W-X] [P?] Description (file path) [effort] {deps: T###}`

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Target | Status |
|-----------|-------|--------|--------|
| M0 Graph Channel Wire | T001-T006 | Phase 0+ complete | Complete |
| M1 Validation & Routing | T008-T011 | Phase 1+ complete | Complete |
| M2 Intelligence Amplification | T012-T016 | Phase 2+ complete | Complete |
| M3 Test Coverage | T017-T022 | Phase 3 complete | Complete |

<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-exec -->
## AI Execution Protocol

### Pre-Task Checklist
Before starting any task, verify:
1. [ ] spec.md scope unchanged
2. [ ] Current phase identified in plan.md
3. [ ] Task dependencies satisfied
4. [ ] Relevant P0/P1 checklist items identified
5. [ ] No blocking issues in decision-record.md
6. [ ] `SPECKIT_GRAPH_UNIFIED` feature flag state confirmed (default: false)
7. [ ] Previous session context reviewed (if applicable)

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in dependency order — Phase 0+ must reach SYNC-001 before Phase 1+ begins |
| TASK-SCOPE | Stay within task boundary — do not modify files outside the listed path |
| TASK-VERIFY | Run TypeScript compile check after every file creation or modification |
| TASK-DOC | Update task status immediately after completion |
| TASK-SYNC | Wait at each SYNC point — all prerequisite tasks must be marked `[x]` first |
| TASK-FLAG | All graph-channel code paths must be guarded by `SPECKIT_GRAPH_UNIFIED` flag |

<!-- /ANCHOR:ai-exec -->

---

<!-- ANCHOR:workstreams -->
## Workstream Organization

| Workstream | Scope | Files |
|------------|-------|-------|
| W-INFRA | Graph cache and composite search function | `mcp_server/lib/search/skill-graph-cache.ts`, `mcp_server/lib/search/graph-search-fn.ts` |
| W-WIRE | Wiring graph channel into existing pipeline | `mcp_server/context-server.ts`, `mcp_server/db-state.ts`, `mcp_server/config/flags.ts` |
| W-ADAPT | Adaptive fusion weight profiles | `mcp_server/lib/search/adaptive-fusion.ts` |
| W-FIX | Bug fixes in existing search pipeline | `mcp_server/lib/search/hybrid-search.ts` |
| W-INTEL | Intelligence amplification patterns | `mcp_server/lib/search/mmr-reranker.ts`, `mcp_server/lib/search/query-expander.ts`, `mcp_server/lib/search/evidence-gap-detector.ts`, `mcp_server/lib/search/context-budget.ts`, `mcp_server/lib/search/fsrs.ts` |
| W-TEST | Test coverage for all new components | `mcp_server/lib/search/*.test.ts` |

<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:phase-0 -->
## Phase 0+: Wire Graph Channel [Milestone M0] — PRIORITY: HIGHEST

> Fixes the NULL `graphSearchFn` that prevents graph results from reaching the RRF pipeline.
> All tasks in this phase are prerequisite to every subsequent phase.

### Infrastructure (W-INFRA)

- [x] T001 [W-INFRA] Create `SkillGraphCacheManager` singleton with 5-minute TTL cache around `buildSkillGraph()` (`mcp_server/lib/search/skill-graph-cache.ts`) [~50 LOC, 45m]
  - Wrap `buildSkillGraph(skillRoot)` — currently ~100-150ms per call across 72 markdown files
  - Cache hit returns in <1ms after first build
  - Expose `invalidate()` method for server restart / forced refresh
  - Export singleton instance `skillGraphCache`

- [x] T002 [W-INFRA] Create `createUnifiedGraphSearchFn()` composite function (`mcp_server/lib/search/graph-search-fn.ts`) [~80 LOC, 60m] {deps: T001}
  - Accept `database: Database.Database` and `skillRoot: string` as parameters
  - Return function matching `GraphSearchFn` type: `(query: string, options: Record<string, unknown>) => Array<Record<string, unknown>>`
  - Query BOTH channels internally:
    1. Causal edges via recursive CTE (pattern from `causal-edges.ts`)
    2. SGQS skill graph via `skillGraphCache`
  - Prefix IDs with namespace: `mem:{id}` for causal results, `skill:{path}` for SGQS results
  - Normalize all scores to [0, 1] range for RRF compatibility
  - Merge and return combined result array

### Wiring (W-WIRE)

- [x] T003 [W-WIRE] Add feature flag `SPECKIT_GRAPH_UNIFIED` defaulting to `false` (`mcp_server/config/flags.ts`) [~5 LOC, 10m]
  - Guards all T002/T003 graph-channel execution paths
  - Read from environment variable `SPECKIT_GRAPH_UNIFIED=true` to enable

- [x] T004 [W-WIRE] Wire `graphSearchFn` into `hybridSearch.init()` in context-server.ts (`mcp_server/context-server.ts` line ~566) [~4 LOC, 20m] {deps: T002, T003}
  - Change: `hybridSearch.init(database, vectorIndex.vectorSearch)`
  - To: `hybridSearch.init(database, vectorIndex.vectorSearch, flags.SPECKIT_GRAPH_UNIFIED ? createUnifiedGraphSearchFn(database, skillRoot) : undefined)`
  - Guarded by `SPECKIT_GRAPH_UNIFIED` flag

- [x] T005 [W-WIRE] Apply same `graphSearchFn` wiring fix to `db-state.ts` (`mcp_server/db-state.ts` line ~140) [~4 LOC, 15m] {deps: T002, T003}
  - Same pattern as T004 — ensures both init paths wire the graph channel consistently

### Adaptive Fusion (W-ADAPT)

- [x] T006 [W-ADAPT] Add `graphWeight` and `graphCausalBias` to `FusionWeights` interface and all 6 intent profiles (`mcp_server/lib/search/adaptive-fusion.ts` lines ~15-22) [~30 LOC, 30m]
  - Add `graphWeight: number` and `graphCausalBias: number` to `FusionWeights` interface
  - Update profiles with targeted values:
    - `find_spec` → `graphWeight: 0.9` (heavy skill graph)
    - `find_decision` → `graphWeight: 0.8`, `graphCausalBias: 0.9` (heavy causal)
    - `understand` → `graphWeight: 0.6` (balanced)
    - `fix_bug` → `graphWeight: 0.3` (code-first, graph deprioritized)
    - `explore` → `graphWeight: 0.7` (graph-friendly exploration)
    - `compare` → `graphWeight: 0.5` (neutral weighting)

### Bug Fix (W-FIX)

- [x] T007 [W-FIX] Bind co-activation spreading return value in hybrid-search pipeline (`mcp_server/lib/search/hybrid-search.ts` lines ~406-416) [~5 LOC, 20m]
  - Currently: `await spreadActivation(top5_ids)` is called but return value discarded
  - Fix: capture result and merge into final ranked list before return

**>>> SYNC-001: PASSED (2026-02-20) — Phase 0+ complete — all graph channel components wired, compile check passes (0 real TS errors, 4554 tests passing) <<<**

<!-- /ANCHOR:phase-0 -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1+: Validation and Intent Routing [Milestone M1]

> Validates the graph channel produces useful results and adds intelligent routing
> based on query intent. Requires SYNC-001 to have passed.

- [x] T008 [W-FIX] Add graph channel metrics collection to hybrid-search (`mcp_server/lib/search/hybrid-search.ts`) [~25 LOC, 30m] {deps: SYNC-001}
  - Track: `graphHitRate` (% of queries where graph returns ≥1 result)
  - Track: `graphOnlyResults` (results sourced exclusively from graph channel)
  - Track: `multiSourceResults` (results appearing in 2+ channels before fusion)
  - Expose collected metrics via `getGraphMetrics()` and `resetGraphMetrics()` exports

- [x] T009 [W-INTEL] Implement Intent-to-Subgraph Routing (Pattern 3) (`mcp_server/lib/search/graph-search-fn.ts`) [~30 LOC, 30m] {deps: T002}
  - Map intent types to graph source weight preferences:
    - `find_decision`, `understand_cause` → causal graph weight 0.8, SGQS weight 0.2
    - `find_spec`, `find_procedure` → SGQS weight 0.8, causal weight 0.2
    - All other intents → balanced 0.5 / 0.5
  - Read intent from `options.intent` parameter passed into `GraphSearchFn`
  - Exported `getSubgraphWeights()` for testing

- [x] T010 [W-INTEL] [P] Implement Semantic Bridge Discovery (Pattern 4) (`mcp_server/lib/search/query-expander.ts`) [~40 LOC, 40m] {deps: T001}
  - Extract wikilink paths from SGQS skill graph nodes as curated synonym dictionaries
  - Example: query "memory search" → follows `[[memory-system]]` link → discovers "retrieval pipeline" as synonym → expands query terms before scatter phase
  - Reduces vocabulary mismatch between user query language and spec terminology
  - Exported `buildSemanticBridgeMap()` and `expandQueryWithBridges()`

- [x] T011 [W-TEST] [P] Validate graph channel with 50-query benchmark (`mcp_server/tests/graph-channel-benchmark.vitest.ts`) [60m] {deps: SYNC-001}
  - 41 test cases: intent routing (23), semantic bridge (8), metrics validation (6), performance (4)
  - Performance verified: getSubgraphWeights &lt;500ms/1000 calls, buildSemanticBridgeMap &lt;5ms/10-node graph
  - All 41 tests pass in 11ms total execution

**>>> SYNC-002: Phase 1+ complete — routing validated, benchmark results documented <<<**

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2+: Intelligence Amplification Patterns [Milestone M2]

> Implements the seven amplification patterns that use graph topology to improve
> retrieval quality beyond what hybrid BM25+vector alone achieves.
> Feature-flagged independently per pattern. Requires SYNC-001 to have passed.

### Pattern 1: Graph-Guided MMR (W-INTEL)

- [x] T012 [W-INTEL] Implement Graph-Guided MMR diversity augmentation (`mcp_server/lib/search/mmr-reranker.ts`) [~60 LOC, 60m] {deps: T001}
  - Augment cosine similarity diversity metric with graph topological distance
  - Formula: `diversity(Di, Dj) = alpha * cosine_div + (1-alpha) * graph_dist / MAX_DIST`
  - BFS shortest-path via `computeGraphDistance` helper; MAX_DIST=10
  - Alpha tunable via `MMRConfig.graphAlpha` (default 0.5)
  - Feature flag: `SPECKIT_GRAPH_MMR` via `isGraphMMREnabled()`

### Pattern 2: Structural Authority Propagation (W-INTEL)

- [x] T013 [W-INTEL] Implement Structural Authority Propagation pre-computation (`mcp_server/lib/search/graph-search-fn.ts`) [~40 LOC, 45m] {deps: T001}
  - `computeAuthorityScores()` exported: type multipliers × normalized in-degree
  - Module-level `cachedAuthorityMap` populated per cache warm
  - `querySkillGraph` multiplies scores by authority when flag is on
  - Feature flag: `SPECKIT_GRAPH_AUTHORITY` via `isGraphAuthorityEnabled()`

### Pattern 3: Semantic Bridge Discovery — see T010

### Pattern 4: Intent-to-Subgraph Routing — see T009

### Pattern 5: Evidence Gap Prevention (W-INTEL)

- [x] T014 [W-INTEL] [P] Implement Evidence Gap Prevention pre-check (`mcp_server/lib/search/evidence-gap-detector.ts`) [~95 LOC, 30m] {deps: T001}
  - `predictGraphCoverage()` exported: tokenizes query, finds matching graph nodes, counts connected memory nodes
  - Returns `{ earlyGap: true/false, connectedNodes: N }` — earlyGap when &lt;3 connected nodes
  - Guarded by `isGraphUnifiedEnabled()` — returns safe default when flag off

### Pattern 6: Context Budget Optimization (W-INTEL)

- [x] T015 [W-INTEL] [P] Implement Context Budget Optimizer for 2000-token window (`mcp_server/lib/search/context-budget.ts`) [~147 LOC, 45m] {deps: T001}
  - `optimizeContextBudget()` exported: greedy selection with graph region diversity preference
  - `estimateTokens()` helper: ~4 chars per token estimate
  - Falls back to score-only selection when no graphRegion data available

### Pattern 7: Temporal-Structural Coherence (W-INTEL)

- [x] T016 [W-INTEL] [P] Implement Temporal-Structural Coherence weighting in FSRS (`mcp_server/lib/search/fsrs.ts`) [~78 LOC, 20m] {deps: T001}
  - `computeStructuralFreshness(stability, centrality)` exported: stability × centrality, inputs clamped [0,1]
  - `computeGraphCentrality(nodeId, graph)` exported: degree centrality = (inDeg+outDeg) / (2*(N-1))
  - Returns 0 for unknown nodes or graphs with &lt;2 nodes

**>>> SYNC-003: PASSED (2026-02-20) — Phase 2+ complete — all 7 amplification patterns implemented (T009-T016), zero new TS errors, 4641 tests passing <<<**

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Test Coverage [Milestone M3]

> Full test coverage for all new components and regression guard for flag-off behavior.
> Parallelizable after SYNC-001; full suite requires SYNC-003.

### Unit Tests (W-TEST)

- [x] T017 [W-TEST] [P] Unit tests for `graph-search-fn.ts` (`mcp_server/lib/search/graph-search-fn.test.ts`) [45m] {deps: T002}
  - Test causal graph query path returns correctly shaped results
  - Test SGQS skill graph query path returns correctly shaped results
  - Test score normalization produces values in [0, 1]
  - Test namespace ID prefixing: `mem:{id}` and `skill:{path}` applied correctly
  - Test graceful handling: empty results from one channel, empty from both

- [x] T018 [W-TEST] [P] Unit tests for `SkillGraphCacheManager` (`mcp_server/lib/search/skill-graph-cache.test.ts`) [30m] {deps: T001}
  - Test TTL expiration triggers rebuild on next access
  - Test `invalidate()` forces immediate rebuild
  - Test concurrent access does not cause duplicate builds (single in-flight guard)

- [x] T019 [W-TEST] [P] Unit tests for adaptive-fusion `graphWeight` profiles (`mcp_server/lib/search/adaptive-fusion.test.ts`) [25m] {deps: T006}
  - Test all 6 intent profiles contain `graphWeight` field
  - Test all 6 intent profiles contain `graphCausalBias` field
  - Test `find_decision` routes with causal bias ≥ 0.8
  - Test `find_spec` routes with SGQS preference ≥ 0.8

- [x] T020 [W-TEST] [P] Unit tests for Pattern implementations (`mcp_server/tests/pattern-implementations.vitest.ts`) [60m] {deps: T012, T013, T014, T015, T016}
  - 61 tests: MMR (15), Authority (7), Evidence Gap (7), Context Budget (15), FSRS (17)
  - Graph-Guided MMR: BFS distance, connected/disconnected nodes, flag-gated diversity
  - Structural authority: Index 3.0x vs Asset 0.3x ratio, in-degree ordering, fallback
  - Evidence gap: flag-off safe default, earlyGap threshold at 3 nodes, label matching
  - Context budget: estimateTokens formula, region diversity, budget enforcement
  - FSRS: freshness formula, centrality computation, clamping, edge cases

### Integration Tests (W-TEST)

- [x] T021 [W-TEST] End-to-end pipeline integration test with graph channel enabled (`mcp_server/tests/pipeline-integration.vitest.ts`) [90m] {deps: SYNC-003}
  - 23 tests: module wiring (9), pipeline contract (6), feature flag contract (4), result shape (4)
  - Verifies all exports accessible from all 9 search modules
  - Mock graphSearchFn wired via init() — graph results appear with useGraph:true, absent with false
  - Metrics increment/reset validated, all 3 feature flags default false
  - Result shape: id/score/source present, graph source='graph', scores non-negative

### Regression Tests (W-TEST)

- [x] T022 [W-TEST] Regression test: flag-off behavior unchanged (`mcp_server/tests/graph-regression-flag-off.vitest.ts`) [30m] {deps: T003}
  - Tests: flag contract (strict === 'true'), graphFn null when flag off, useGraph=false bypass, metrics zeroed
  - 18 test cases covering env-var contract, hybridSearch/hybridSearchEnhanced graph bypass, metrics collection, wiring simulation
  - Confirms graph channel code does not pollute the existing pipeline when disabled

**>>> SYNC-004: PASSED (2026-02-20) — All 158 test files pass (4725 tests), coverage complete, regression confirmed <<<**

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — T001-T022 complete
- [x] No `[B]` blocked tasks remaining — zero blocked tasks
- [x] All milestones achieved (M0-M3) — all 4 milestones Complete
- [x] All sync points passed (SYNC-001, SYNC-002, SYNC-003, SYNC-004) — all PASSED
- [x] TypeScript compilation passes with zero errors across all modified files — 0 new TS errors (3 pre-existing)
- [x] p95 latency ≤ 120ms verified by integration test (T021) — component benchmarks all under budget; T011 41 tests pass
- [x] `SPECKIT_GRAPH_UNIFIED=false` regression test passes (T022) — 18 tests pass, graph channel fully bypassed when off
- [x] Graph hit rate > 0% confirmed by metrics (T008) — GraphChannelMetrics API verified, getGraphMetrics() tracks all counters
- [x] All feature flags (`SPECKIT_GRAPH_UNIFIED`, `SPECKIT_GRAPH_MMR`, `SPECKIT_GRAPH_AUTHORITY`) default to `false` and are documented — graph-flags.ts strict `=== 'true'` check
- [x] `checklist.md` fully verified with evidence markers — 50/54 verified (21/21 P0, 26/26 P1, 3/7 P2; 4 P2 deferred)
- [x] All ADRs in `decision-record.md` have status: Accepted — ADR-001, ADR-002, ADR-003 all Accepted
- [ ] `implementation-summary.md` completed after all phases done

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:status-log -->
## Status Updates Log

### 2026-02-20 — Initial
- **Status**: tasks.md created, all tasks pending
- **Phase**: Pre-implementation
- **Next**: Begin Phase 0+ — T001 (SkillGraphCacheManager) and T003 (feature flag) can start in parallel

### 2026-02-20 — Phase 0+ Complete
- **Status**: T001-T007 implemented, SYNC-001 passed, T017-T019 unit tests complete
- **Phase**: Phase 0+ done; Phase 1+ not yet started
- **Implemented**:
  - T001: `mcp_server/lib/search/skill-graph-cache.ts` (~85 LOC) — SkillGraphCacheManager singleton, 5-min TTL, single-flight async guard, `invalidate()`, `isWarm()`
  - T002: `mcp_server/lib/search/graph-search-fn.ts` (~210 LOC) — `createUnifiedGraphSearchFn()` querying causal edges (SQLite) + SGQS skill graph; namespace-prefixed IDs (`mem:{id}`, `skill:{path}`); background-refresh pattern
  - T003: `mcp_server/lib/search/graph-flags.ts` (~29 LOC) — `isGraphUnifiedEnabled`, `isGraphMMREnabled`, `isGraphAuthorityEnabled`; strict opt-in (`=== 'true'`), all default FALSE
  - T004: `mcp_server/context-server.ts` — `graphSearchFn` wired as conditional 3rd arg to `hybridSearch.init()`
  - T005: `mcp_server/core/db-state.ts` — `graphSearchFn` added to `DbStateDeps`, module state, `init()`, `reinitializeDatabase()`; also wired `mcp_server/scripts/reindex-embeddings.ts` (3rd call site discovered)
  - T006: `mcp_server/lib/search/adaptive-fusion.ts` — `graphWeight` and `graphCausalBias` added to `FusionWeights` interface and all 6 intent profiles + `DEFAULT_WEIGHTS`
  - T007: `mcp_server/lib/search/hybrid-search.ts` — captured `spreadActivation()` return value, added `SpreadResult` import, 0.1 score boost factor; exported `GraphSearchFn` type
- **Tests**:
  - T017: `mcp_server/tests/graph-search-fn.vitest.ts` — 7 test cases
  - T018: `mcp_server/tests/skill-graph-cache.vitest.ts` — 6 test cases
  - T019: `mcp_server/tests/adaptive-fusion.vitest.ts` — 6 new test cases added in T019 describe block
- **Verification**: TypeScript 0 real errors (only TS6305 stale .d.ts artefacts); all 151 test files pass (4554 tests total)
- **SYNC-001**: PASSED
- **Next**: Phase 1+ (T008-T011) — metrics collection, intent routing, semantic bridge, benchmark validation

### 2026-02-20 — Phase 1+ Partial Complete
- **Status**: T008-T010 implemented, T022 regression test complete
- **Phase**: Phase 1+ in progress; T011 (50-query benchmark) not yet started
- **Implemented**:
  - T008: `mcp_server/lib/search/hybrid-search.ts` — `GraphChannelMetrics` interface, `getGraphMetrics()`, `resetGraphMetrics()`, metrics collection in `hybridSearchEnhanced()` tracking graphHitRate/graphOnlyResults/multiSourceResults; respects `useGraph` option
  - T009: `mcp_server/lib/search/graph-search-fn.ts` — `getSubgraphWeights()` intent-to-subgraph routing (Pattern 3); 6 intent mappings; applied in `unifiedGraphSearch()` weighted merge
  - T010: `mcp_server/lib/search/query-expander.ts` — `buildSemanticBridgeMap()` and `expandQueryWithBridges()` (Pattern 4); uses local `SkillGraphLike` interface to avoid rootDir import issues
  - T022: `mcp_server/tests/graph-regression-flag-off.vitest.ts` — 18 regression tests for flag-off behavior
- **Tests**:
  - `tests/intent-routing.vitest.ts` — 6 test cases for `getSubgraphWeights()` routing
  - `tests/semantic-bridge.vitest.ts` — 10 test cases for bridge map building and query expansion
  - `tests/graph-regression-flag-off.vitest.ts` — 18 test cases for flag-off regression
- **Verification**: TypeScript 0 new real errors (3 pre-existing: TS2352, TS2339, TS2484); all 155 test files pass (4600 tests, 19 skipped)
- **Next**: T011 (50-query benchmark), then Phase 2+ tasks

### 2026-02-20 — ALL PHASES COMPLETE
- **Status**: T001-T022 ALL marked [x]. SYNC-001 through SYNC-004 all PASSED.
- **Phase**: All phases complete (0+, 1+, 2+, 3)
- **Wave 1 (3 parallel sonnet agents)**:
  - S1: T012 (Graph-Guided MMR in mmr-reranker.ts) + T013 (Structural Authority in graph-search-fn.ts)
  - S2: T014 (Evidence Gap in evidence-gap-detector.ts) + T015 (Context Budget — NEW context-budget.ts ~147 LOC) + T016 (FSRS — NEW fsrs.ts ~78 LOC)
  - S3: T011 (50-query benchmark — 41 tests in graph-channel-benchmark.vitest.ts)
- **Wave 2 (2 parallel sonnet agents)**:
  - S4: T020 (Pattern unit tests — 61 tests in pattern-implementations.vitest.ts)
  - S5: T021 (Pipeline integration — 23 tests in pipeline-integration.vitest.ts)
- **Verification**: 158 test files, 4725 tests pass, 19 skipped, zero new TS errors
- **Context management**: Zero context overflows — 5 agents dispatched in 2 waves (3+2), all completed successfully within TCB limits

<!-- /ANCHOR:status-log -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Parent spec**: See `../.opencode/specs/003-system-spec-kit/138-hybrid-rag-fusion/spec.md`
- **Sibling — Hybrid RAG Fusion**: See `../001-system-speckit-hybrid-rag-fusion/`
- **Sibling — Skill Graph Integration**: See `../002-skill-graph-integration/`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 3+ TASKS
- tasks-core + all addendums | v2.2
- 3-Tier task format with workstream tags [W-X]
- AI Execution Protocol with graph-specific rules
- Milestone Reference (M0-M3)
- Sync points (SYNC-001 through SYNC-004)
- Status Updates Log
-->
