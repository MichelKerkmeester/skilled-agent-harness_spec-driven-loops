<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: Unified Graph Intelligence Integration

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

The `graphSearchFn` argument in the production hybrid search pipeline has been NULL since initial deployment. At `context-server.ts:566`, `hybridSearch.init()` is called with only 2 of 3 required arguments, meaning the entire graph channel infrastructure — RRF boost weights, convergence bonuses, co-activation spreading, and all 7 intelligence amplification patterns — receives zero data on every query. This spec covers wiring both graph systems (Causal Edge SQLite CTEs and SGQS Skill Graph) into the hybrid pipeline via a Unified Graph Adapter, plus enabling all 7 derived intelligence patterns that share the same 8–10ms infrastructure overhead.

**Key Decisions**: Virtual Graph Adapter architecture (no schema migrations, no external databases); SkillGraphCacheManager with 5-minute TTL to eliminate per-query filesystem rebuilds from 412-node/627-edge graph.

**Critical Dependencies**: Workstream 002 (Skill Graph Integration) is COMPLETE and provides the SGQS parser/executor and graph data that this spec consumes. Workstream 001 (Hybrid RAG Fusion) provides the adaptive fusion and MMR pipeline that this spec augments. Both must be in a stable state before Phase 1 validation begins.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-02-20 |
| **Branch** | `138-hybrid-rag-fusion` |
| **Parent Spec** | `.opencode/specs/003-system-spec-kit/138-hybrid-rag-fusion/spec.md` |
| **Sibling 001** | `.opencode/specs/003-system-spec-kit/138-hybrid-rag-fusion/001-system-speckit-hybrid-rag-fusion/spec.md` |
| **Sibling 002** | `.opencode/specs/003-system-spec-kit/138-hybrid-rag-fusion/002-skill-graph-integration/spec.md` |
| **Complexity Score** | 85/100 |
| **Estimated LOC** | ~600 (new) + ~150 (modified) |
| **Author** | @speckit + @orchestrate |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The production `hybridSearchEnhanced()` pipeline in `context-server.ts` calls `hybridSearch.init(db, embeddingFn)` at line 566, omitting the third argument `graphSearchFn`. This single missing argument means the graph channel — comprising Causal Edge weighted traversal, SGQS Skill Graph queries, RRF graph boost weights (`GRAPH_WEIGHT_BOOST = 1.5` at `rrf-fusion.ts:21,139`), co-activation spreading, and convergence bonuses — contributes zero signal to every retrieval operation. Simultaneously, the SGQS Skill Graph (412 nodes, 627 edges, 9 skills fully decomposed) rebuilds from the filesystem on every call at `sgqs/index.ts:50-55`, adding unnecessary I/O latency even though the graph data is static between deployments.

### Purpose

Wire both graph systems — Causal Edge CTEs and SGQS Skill Graph — into the hybrid search pipeline through a Unified Graph Adapter, restore the full 3-channel RRF fusion the codebase already implements, and unlock all 7 intelligence amplification patterns that share the same 8–10ms infrastructure overhead, delivering measurably more precise and diverse memory retrieval within the existing 120ms pipeline budget.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Implement `createUnifiedGraphSearchFn()` that queries Causal Edge graph and SGQS Skill Graph in parallel and merges results into a unified `GraphSearchResult[]`
- Implement `SkillGraphCacheManager` with 5-minute TTL, invalidation on filesystem change, and ~300KB memory footprint cap
- Wire `graphSearchFn` at `context-server.ts:566` and `db-state.ts:140` (the two init call sites)
- Add `graphWeight` dimension to `FusionWeights` interface in `adaptive-fusion.ts`
- Bind co-activation spreading results currently discarded at `hybrid-search.ts:406-416`
- Implement Graph-Guided MMR (Pattern 1): use graph distance as a diversity signal alongside cosine similarity
- Implement Intent-to-Subgraph Routing (Pattern 3): route recognized intents (`find_decision`, `find_spec`, `find_memory`) to the appropriate graph channel
- Implement Structural Authority Propagation (Pattern 2): apply Index > Node > Reference hierarchy as a ranking boost
- Define `UnifiedNodeId` type alias and `GraphSearchResult` interface in shared types
- Integration tests validating end-to-end pipeline with graph channel active
- Performance benchmark confirming ≤120ms pipeline latency under load

### Out of Scope

- External graph databases (Neo4j, TigerGraph, Amazon Neptune) — zero external dependencies constraint
- SQLite schema migrations — v15 schema is frozen; all logic is TypeScript orchestration only
- Semantic Bridge Discovery (Pattern 4) — deferred to post-validation phase; requires wikilink AST parse pass not currently in scope
- Context Budget Optimization (Pattern 6) — deferred; requires token-counting instrumentation pass
- Temporal-Structural Coherence (Pattern 7) — deferred; requires FSRS decay × centrality math validation
- Changes to the SGQS parser or executor implemented in Workstream 002
- Changes to the Hybrid RAG Fusion pipeline architecture implemented in Workstream 001

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `src/context-server.ts` | Modify | Wire `graphSearchFn` at line 566 — pass `createUnifiedGraphSearchFn(db, skillCache)` as third arg |
| `src/db-state.ts` | Modify | Wire `graphSearchFn` at line 140 — second `hybridSearch.init()` call site |
| `src/hybrid-search.ts` | Modify | Bind co-activation results at lines 406-416; ensure `graphSearchFn` path executes |
| `src/adaptive-fusion.ts` | Modify | Add `graphWeight` to `FusionWeights` interface (lines 15-22); update weight normalization |
| `src/rrf-fusion.ts` | Modify | Remove hardcoded `GRAPH_WEIGHT_BOOST = 1.5`; read from `FusionWeights.graphWeight` |
| `src/graph/unified-graph-adapter.ts` | Create | `createUnifiedGraphSearchFn()` — parallel Causal Edge + SGQS query, result merge |
| `src/graph/skill-graph-cache.ts` | Create | `SkillGraphCacheManager` — 5-min TTL cache, ~300KB cap, filesystem change detection |
| `src/graph/graph-guided-mmr.ts` | Create | Pattern 1 — graph distance diversity signal for MMR selection |
| `src/graph/intent-subgraph-router.ts` | Create | Pattern 3 — intent classification to graph channel routing |
| `src/graph/structural-authority.ts` | Create | Pattern 2 — Index > Node > Reference hierarchy scoring |
| `src/types/graph.ts` | Create | `UnifiedNodeId`, `GraphSearchResult`, `GraphSearchOptions` type definitions |
| `tests/graph/unified-graph-adapter.test.ts` | Create | Unit tests for unified adapter and cache manager |
| `tests/integration/hybrid-search-graph.test.ts` | Create | End-to-end tests with graph channel active |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Wire `graphSearchFn` at `context-server.ts:566` and `db-state.ts:140` | `hybridSearch.init()` called with all 3 arguments at both sites; graph channel no longer NULL in production logs |
| REQ-002 | Implement `createUnifiedGraphSearchFn()` querying both Causal Edge CTEs and SGQS Skill Graph in parallel | Function accepts `(query: string, options: GraphSearchOptions)`, returns `GraphSearchResult[]`; both graph sources contribute results in test suite |
| REQ-003 | Implement `SkillGraphCacheManager` with ≥5-minute TTL | First call builds graph from filesystem; subsequent calls within TTL return cached instance; cache invalidates on filesystem mtime change; memory footprint ≤350KB measured |
| REQ-004 | Add `graphWeight` dimension to `FusionWeights` in `adaptive-fusion.ts` | `FusionWeights` interface includes `graphWeight: number`; weight normalization sum remains 1.0; existing vector and BM25 weights recalculated proportionally |
| REQ-005 | Bind co-activation spreading results at `hybrid-search.ts:406-416` | Co-activation scores contribute to final ranked results; spreading results no longer silently discarded; graph-activated memories appear in output when relevant |
| REQ-006 | Pipeline latency ≤120ms with graph channel active | p95 latency ≤120ms measured over 100 representative queries with graph channel enabled in benchmark test |
| REQ-007 | Zero SQLite schema migrations | No `ALTER TABLE`, `CREATE TABLE`, or `DROP` statements in any new or modified file; all graph queries operate on existing v15 schema tables (`memories`, `memory_fts`, `causal_edges`, `memory_index`) |
| REQ-008 | Zero external runtime dependencies | No `npm install` of new packages required; only `sqlite-vec`, `sqlite3`, Node.js standard library, and existing codebase utilities used |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Graph-Guided MMR (Pattern 1) — graph distance as diversity signal | MMR selection considers graph distance between candidate nodes; two nodes with high cosine similarity but low graph distance are penalized relative to two nodes with moderate cosine similarity but high graph distance; unit test validates diversity improvement |
| REQ-010 | Intent-to-Subgraph Routing (Pattern 3) — route recognized intents to appropriate graph | Intent classifier maps `find_decision` → causal edge graph, `find_spec` → skill graph index nodes, `find_memory` → full hybrid; routing decision logged at DEBUG level; unit test covers all three paths |
| REQ-011 | Structural Authority Propagation (Pattern 2) — hierarchy-based score boost | Index-type nodes receive 1.3× boost, Node-type receive 1.0×, Reference-type receive 0.8×; boost applied before RRF merge; boost magnitude configurable in `FusionWeights` |

### P2 - Optional (can defer without approval)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-012 | Semantic Bridge Discovery (Pattern 4) — wikilink paths as BM25 synonym dictionary | Wikilinks parsed from markdown at ingest time; synonym pairs stored in memory; BM25 query expansion uses synonym pairs; requires AST parsing pass |
| REQ-013 | Context Budget Optimization (Pattern 6) — maximize graph region coverage in 2000-token budget | Token counter integrated into result selection; algorithm selects results maximizing graph region diversity within token cap; ~2.5ms overhead |
| REQ-014 | Temporal-Structural Coherence (Pattern 7) — FSRS decay × graph centrality scoring | Node recency weight multiplied by graph centrality score; combined signal used as tiebreaker in RRF; requires FSRS decay availability per memory node |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Graph channel is active and non-NULL in all production query paths — verified by logging `graphSource` field in `GraphSearchResult` entries appearing in retrieval output.
- **SC-002**: Pipeline p95 latency remains ≤120ms with graph channel active across 100 benchmark queries on representative query set.
- **SC-003**: Co-activation spreading contributes to at least 15% of query results in the integration test suite (previously 0% due to discarded results).
- **SC-004**: SGQS Skill Graph cache hit rate ≥95% after warmup (first query per session), measured over 20 consecutive queries in test suite.
- **SC-005**: `FusionWeights` correctly normalizes to 1.0 across all three channels (vector + BM25 + graph) — verified by unit test asserting `|sum - 1.0| < 0.001`.
- **SC-006**: All P0 requirements pass automated test suite with zero regressions in existing `hybrid-search` and `rrf-fusion` tests.
- **SC-007**: Graph-Guided MMR (REQ-009) produces measurably more diverse result sets — verified by intra-result cosine similarity mean decreasing ≥10% compared to cosine-only MMR baseline in unit test.
- **SC-008**: Zero new external npm dependencies in `package.json` after implementation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Workstream 001 (Hybrid RAG Fusion) — adaptive-fusion.ts and rrf-fusion.ts stability | Changes to FusionWeights or RRF constants in WS001 can conflict with REQ-004/REQ-005 | Coordinate with WS001 on interface freeze before Phase 0+ begins; define shared types in `src/types/graph.ts` as single source of truth |
| Dependency | Workstream 002 (Skill Graph Integration) — SGQS graph data and executor API | SkillGraphCacheManager wraps SGQS executor; breaking API changes break cache layer | WS002 is COMPLETE; treat SGQS API as stable; add integration test that fails fast if SGQS API shape changes |
| Dependency | SQLite v15 schema — `causal_edges` table structure | Causal Edge CTE queries depend on column names and index definitions | Read schema from `schema.ts` or migration files before writing any CTE; add schema version assertion in `unified-graph-adapter.ts` init |
| Risk | Latency overrun — graph channel adds >20ms overhead | Pipeline exceeds 120ms budget, triggering MCP timeout warnings | Benchmark after each implementation phase; cache warms on first call; abort graph search after 18ms timeout with graceful degradation to 2-channel RRF |
| Risk | SkillGraphCacheManager memory growth — graph grows over time | Cache exceeds 350KB cap, causing GC pressure | Implement hard eviction at 350KB; log cache size on each build; add Jest memory assertion |
| Risk | Intent classifier false routing — `find_decision` queries routed to skill graph | Graph results irrelevant, reducing retrieval quality | Intent routing is additive (graph channel supplements, not replaces vector+BM25); mis-routing degrades to 0-contribution from graph channel rather than returning wrong results |
| Risk | Co-activation spreading produces irrelevant activations | Noise injected into ranked results | Limit spreading depth to 2 hops; apply minimum edge weight threshold of 0.3; spreading results capped at 20% of total result budget |
| Risk | `graphSearchFn` wiring at two call sites — db-state.ts site may have different initialization order | Race condition on cache manager initialization | Initialize `SkillGraphCacheManager` once at module level in `unified-graph-adapter.ts`; both call sites receive same cached singleton |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: End-to-end `hybridSearchEnhanced()` pipeline p95 latency ≤120ms with all three channels active (vector 35ms + BM25 15ms + graph 15ms + RRF 5ms + MMR 8ms + overhead).
- **NFR-P02**: Graph channel internal timeout of 18ms — if Causal Edge + SGQS parallel query exceeds 18ms, abort and return empty `GraphSearchResult[]`, allowing 2-channel RRF to proceed without blocking.
- **NFR-P03**: `SkillGraphCacheManager` cache hit latency ≤1ms (in-memory Map lookup); cache miss (filesystem rebuild) ≤12ms for 412-node/627-edge graph.
- **NFR-P04**: `createUnifiedGraphSearchFn()` Causal Edge CTE queries use only indexed columns (`source_id`, `target_id`, `edge_weight`); no full table scans on `causal_edges`.

### Security

- **NFR-S01**: No user-controlled input is interpolated into raw SQL strings; all Causal Edge CTE queries use parameterized statements via `sqlite3` prepared statements.
- **NFR-S02**: `SkillGraphCacheManager` filesystem path is resolved to an absolute path and validated against the project root before any file reads; no path traversal possible.

### Reliability

- **NFR-R01**: Graph channel failure (any unhandled exception in `createUnifiedGraphSearchFn`) is caught at the adapter boundary; pipeline falls back to 2-channel (vector + BM25) RRF without surfacing an error to the caller.
- **NFR-R02**: Cache invalidation on mtime change is best-effort — if filesystem stat call fails, cache entry is retained and a warning is logged; no crash on stat failure.
- **NFR-R03**: All P0 requirements covered by automated tests that run in CI; no P0 requirement ships without a corresponding failing test that passes after implementation.

### Maintainability

- **NFR-M01**: `UnifiedNodeId`, `GraphSearchResult`, and `GraphSearchOptions` types are defined exclusively in `src/types/graph.ts`; no inline type duplication across adapter, cache, and MMR files.
- **NFR-M02**: `GRAPH_WEIGHT_BOOST` constant removed from `rrf-fusion.ts`; graph weight sourced only from `FusionWeights.graphWeight` to eliminate dual-source confusion.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Graph Channel Absence

- **Empty `causal_edges` table**: CTE query returns zero rows; `createUnifiedGraphSearchFn()` returns `[]`; RRF proceeds with vector + BM25 only; no error thrown.
- **SGQS graph not yet built** (fresh install, no skills indexed): `SkillGraphCacheManager.get()` returns an empty graph object `{ nodes: [], edges: [] }`; skill graph queries return `[]`; system degrades to causal-only graph channel.
- **Both graph sources return empty**: `graphSearchFn` returns `[]`; `GRAPH_WEIGHT_BOOST` effectively contributes zero to RRF; pipeline output identical to pre-integration 2-channel behavior.

### Cache Manager Boundaries

- **Cache TTL expiry during active query**: TTL check occurs at start of `get()` call; in-flight query that started before TTL expiry completes with stale cache; next call triggers rebuild. No mid-query invalidation.
- **Concurrent cache misses** (two simultaneous queries on cold cache): Both threads trigger filesystem rebuild; second rebuild overwrites first in Map; no data corruption but wasted rebuild work. Acceptable given 12ms rebuild cost and rare occurrence.
- **Filesystem mtime unavailable** (network drive, permissions issue): `stat()` call throws; exception caught; cache entry retained with warning log `[WARN] SkillGraphCache: mtime check failed, retaining stale cache`.

### Intent Routing

- **Ambiguous intent** (query matches multiple intent patterns): Intent router selects highest-confidence classification; ties broken by defaulting to full hybrid (both graph channels active).
- **Unknown intent** (no classifier match): Falls through to default full hybrid routing; all graph channels queried.
- **Very short query** (<3 tokens): Intent classification skipped; full hybrid routing used; graph channel queries proceed with raw query string.

### Weight Normalization

- **`graphWeight` set to 0** (graph channel disabled via config): Normalization assigns full weight to vector + BM25 split; behavior identical to pre-integration pipeline.
- **All three weights set to 0**: Normalization guards against divide-by-zero; defaults to equal weight distribution `{ vectorWeight: 0.33, bm25Weight: 0.33, graphWeight: 0.34 }`.

### Co-Activation Spreading

- **Deeply connected node with 50+ neighbors**: Spreading depth capped at 2 hops; neighbor count capped at 20 nodes per activation round; prevents combinatorial explosion.
- **Circular graph paths** (A → B → A): Visited node set tracks traversed IDs; circular path detected and skipped on second encounter.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: 13 (7 new, 6 modified), LOC: ~750, Systems: 4 (hybrid-search, adaptive-fusion, rrf-fusion, sgqs) |
| Risk | 20/25 | Latency-sensitive pipeline (120ms budget), two init call sites, co-activation binding, graph NULL restoration |
| Research | 18/20 | 6-round multi-agent research sprint complete, 12 research documents produced, all 7 patterns characterized |
| Multi-Agent | 12/15 | 3 workstreams converging (001 RAG Fusion + 002 Skill Graph + 003 this spec), all requiring coordinated interface freeze |
| Coordination | 13/15 | Cross-module dependencies on adaptive-fusion.ts interface, rrf-fusion.ts constants, sgqs executor API, context-server.ts init sequence |
| **Total** | **85/100** | **Level 3+ — Multi-agent governance, formal approval, phased rollout required** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Graph channel latency overrun (>18ms) causes pipeline to exceed 120ms budget | High | Medium | 18ms hard timeout in `createUnifiedGraphSearchFn()`; graceful fallback to 2-channel RRF; benchmark after each phase |
| R-002 | `FusionWeights.graphWeight` addition breaks existing weight normalization for WS001 consumers | High | Low | Weight normalization is additive and proportional; existing vector/BM25 weights recalculated; unit test asserts sum == 1.0 |
| R-003 | SGQS API shape change (WS002 post-completion modification) breaks SkillGraphCacheManager | Medium | Low | WS002 marked COMPLETE; SGQS API treated as stable; integration test fails fast on API shape mismatch |
| R-004 | Co-activation spreading injects noise, degrading retrieval precision | Medium | Medium | Spreading depth capped at 2 hops; edge weight threshold 0.3; spreading results capped at 20% of result budget; A/B comparison in benchmark |
| R-005 | SkillGraphCacheManager concurrent miss on cold start causes double filesystem rebuild | Low | Low | Acceptable — 12ms rebuild cost; no data corruption; no crash; occurs at most once per session |
| R-006 | Intent-to-Subgraph routing misclassifies query, routing to wrong graph channel | Medium | Low | Graph channel is additive; misrouting contributes zero graph signal rather than wrong signal; vector+BM25 channels unaffected |
| R-007 | `db-state.ts:140` second init call site missed during implementation | High | Low | Explicit checklist item in `checklist.md`; grep for all `hybridSearch.init(` calls in CI validation step |
| R-008 | `GRAPH_WEIGHT_BOOST` hardcoded constant (rrf-fusion.ts:21,139) conflicts with new `FusionWeights.graphWeight` | Medium | High | Immediate fix: remove hardcoded constant; source from `FusionWeights`; unit test that fails if constant still present |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Restore graph channel signal (Priority: P0)

**As a** developer using `memory_context()` to retrieve architectural decisions, **I want** the graph traversal channel to contribute results alongside vector and BM25, **so that** causally linked memories surface even when they lack strong keyword or semantic overlap with the query.

**Acceptance Criteria**:
1. Given a query for "why was MMR chosen", When `hybridSearchEnhanced()` runs, Then the `GraphSearchResult[]` array is non-empty and `graphSource` field is present in at least one result.
2. Given `hybridSearch.init()` is called in `context-server.ts`, When the server starts, Then the `graphSearchFn` argument is non-null and logs `[INFO] Graph channel: active`.

### US-002: Eliminate per-query skill graph rebuild (Priority: P0)

**As a** system operator monitoring MCP server performance, **I want** the SGQS Skill Graph to be cached between queries, **so that** repeated queries do not each trigger a full filesystem traversal and graph rebuild from 9 skill directories.

**Acceptance Criteria**:
1. Given a cold server start, When the first query arrives, Then the skill graph is built from filesystem and stored in cache with TTL timestamp.
2. Given a warm cache (TTL not expired), When a second query arrives within 5 minutes, Then the cached graph instance is returned without any filesystem reads (verified by zero `fs.readdir` calls in test spy).
3. Given a cache TTL of 5 minutes has elapsed, When the next query arrives, Then cache is rebuilt from filesystem and TTL is reset.

### US-003: Graph weight participates in adaptive fusion (Priority: P0)

**As a** developer tuning retrieval quality, **I want** the graph channel weight to be a first-class dimension in `FusionWeights`, **so that** intent-based adaptive fusion can increase or decrease graph signal relative to vector and BM25 for different query types.

**Acceptance Criteria**:
1. Given `FusionWeights { vectorWeight: 0.4, bm25Weight: 0.35, graphWeight: 0.25 }`, When RRF fusion runs, Then the sum of all weights equals 1.0 and graph results receive `GRAPH_WEIGHT_BOOST`-equivalent treatment via the `graphWeight` value.
2. Given a "find_decision" intent, When adaptive fusion computes weights, Then `graphWeight` is increased proportionally (≥0.3) and vector/BM25 weights are reduced to compensate.

### US-004: Graph-Guided MMR produces diverse results (Priority: P1)

**As an** LLM consuming memory retrieval payloads, **I want** retrieved memories to be diverse not just in semantic space but in graph structure, **so that** the 2000-token context window covers multiple distinct architectural regions rather than clustering around a single topic.

**Acceptance Criteria**:
1. Given 10 candidate memories with high pairwise cosine similarity but spanning 3 distinct graph regions, When Graph-Guided MMR selects 5, Then selected 5 span all 3 graph regions (no region is unrepresented).
2. Given Graph-Guided MMR versus cosine-only MMR on the same candidate set, When mean pairwise cosine similarity of selected sets is compared, Then Graph-Guided MMR selected set has mean pairwise cosine similarity at least 10% lower.

### US-005: Intent routing directs queries to the right graph (Priority: P1)

**As a** developer querying for skill-specific information, **I want** queries containing decision-tracking intent to prioritize causal edges and queries containing spec-lookup intent to prioritize the skill graph index nodes, **so that** graph retrieval precision improves for structured query types without degrading unstructured queries.

**Acceptance Criteria**:
1. Given a query "find the decision to use RRF over linear combination", When intent router classifies the query, Then `find_decision` intent is detected and causal edge graph is queried with higher priority than skill graph.
2. Given a query "what does the memory skill do", When intent router classifies the query, Then `find_spec` intent is detected and skill graph index nodes are queried preferentially.
3. Given a free-form query with no recognized intent pattern, When intent router runs, Then full hybrid routing is used with both graph channels at equal weight.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:approval-workflow -->
## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review — confirm scope, requirements, and interface contracts | Lead Developer | Pending | — |
| Phase 0+ Implementation Review — `createUnifiedGraphSearchFn()`, `SkillGraphCacheManager`, wiring at both init sites | Lead Developer | Pending | — |
| Phase 1+ Validation Review — graph channel active, latency benchmark pass, integration tests green | Lead Developer | Pending | — |
| Phase 2+ Intelligence Patterns Review — Graph-Guided MMR, Intent Routing, Structural Authority | Lead Developer | Pending | — |
| Final Launch Approval — all P0/P1 requirements complete, checklist verified, no regressions | Lead Developer | Pending | — |

**Phase Gate Rules:**
- Phase 0+ cannot begin until Spec Review is approved.
- Phase 1+ cannot begin until Phase 0+ Implementation Review is approved and all P0 tests pass.
- Phase 2+ cannot begin until Phase 1+ latency benchmark confirms ≤120ms p95.
- Launch Approval requires checklist.md fully verified with evidence for all P0 and P1 items.
<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance -->
## 13. COMPLIANCE CHECKPOINTS

### Dependency Compliance
- [ ] Zero new entries in `package.json` `dependencies` or `devDependencies` after implementation
- [ ] All new graph queries use parameterized prepared statements (no string interpolation)
- [ ] `causal_edges`, `memories`, `memory_fts`, `memory_index` — no DDL statements in new code

### Schema Compliance
- [ ] Schema version assertion in `unified-graph-adapter.ts` init confirms v15 schema is active
- [ ] All new CTE queries validated against v15 schema column names before merge
- [ ] No `ALTER TABLE`, `CREATE TABLE`, `DROP TABLE`, or `CREATE INDEX` in any new or modified file

### Interface Compliance
- [ ] `FusionWeights` interface change is backward-compatible (graphWeight optional with default 0)
- [ ] `GraphSearchResult` type definition is the single source of truth (no duplication across files)
- [ ] Both `hybridSearch.init()` call sites (`context-server.ts:566` and `db-state.ts:140`) updated

### Code Quality Compliance
- [ ] TypeScript strict mode passes on all new files
- [ ] No `any` types in `src/types/graph.ts` or `src/graph/unified-graph-adapter.ts`
- [ ] All new files include JSDoc comments on exported functions describing parameters, return type, and side effects
- [ ] Hardcoded `GRAPH_WEIGHT_BOOST = 1.5` constant removed from `rrf-fusion.ts`

### Test Compliance
- [ ] Unit tests for `createUnifiedGraphSearchFn()` cover: both sources returning results, causal-only, skill-only, and both empty
- [ ] Unit tests for `SkillGraphCacheManager` cover: cold miss, warm hit, TTL expiry, concurrent miss, mtime invalidation
- [ ] Integration test confirms end-to-end pipeline with graph channel active
- [ ] Benchmark test confirms p95 latency ≤120ms over 100 queries
<!-- /ANCHOR:compliance -->

---

<!-- ANCHOR:stakeholders -->
## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Lead Developer | Owner / Approver | High — all phase gate approvals; final architecture decisions on interface contracts and latency tradeoffs | Sync at each phase gate checkpoint; review of implementation-summary.md after Phase 1+ |
| @orchestrate Agent | Coordinator | High — coordinates WS001/WS002/WS003 interface freeze; dispatches @speckit for documentation | Inline in session via Task tool; context loaded from `memory/` at each session start |
| @speckit Agent | Documentation | High — maintains spec.md, plan.md, tasks.md, checklist.md, decision-record.md in sync with implementation | Invoked by @orchestrate at each phase transition |
| WS001 Implementer (Hybrid RAG Fusion) | Consumer / Provider | Medium — `adaptive-fusion.ts` and `rrf-fusion.ts` interface changes must be coordinated; `FusionWeights.graphWeight` addition affects WS001 weight normalization | Interface contract review at Spec Review checkpoint |
| WS002 Implementer (Skill Graph Integration) | Provider | Low (WS002 is COMPLETE) — SGQS executor API stability must be maintained | Notify if SGQS API changes are needed post-completion; WS002 API treated as frozen |
<!-- /ANCHOR:stakeholders -->

---

<!-- ANCHOR:changelog -->
## 15. CHANGE LOG

### v1.0 (2026-02-20)
**Initial specification — @speckit**
- Drafted from 6-round multi-agent research sprint (12 analysis + recommendation documents)
- Defined 8 P0 requirements, 3 P1 requirements, 3 P2 requirements
- Established 3-phase rollout: Phase 0+ (wiring + cache, ~7h) → Phase 1+ (validation + benchmark, ~4h) → Phase 2+ (intelligence patterns, ~6h)
- Identified `context-server.ts:566` and `db-state.ts:140` as the two `hybridSearch.init()` call sites requiring `graphSearchFn` wiring
- Established Virtual Graph Adapter architecture decision (no schema migrations, no external databases)
- Documented all 7 intelligence amplification patterns; scoped P0/P1 to patterns 1-3; deferred P2 patterns 4, 6, 7
<!-- /ANCHOR:changelog -->

---

<!-- ANCHOR:questions -->
## 16. OPEN QUESTIONS

- **Q-001**: Should `graphWeight` in `FusionWeights` default to `0` (backward-compatible, graph channel off until explicitly enabled) or to `0.2` (graph channel on by default with conservative weight)? Defaulting to `0` is safer for regression prevention; defaulting to `0.2` immediately exercises the channel. Requires Lead Developer decision at Spec Review.
- **Q-002**: The `db-state.ts:140` init call site — is this path exercised in the same production execution path as `context-server.ts:566`, or is it a test/CLI-only path? If CLI-only, P0 priority for that site may be reduced. Requires codebase trace confirmation before Phase 0+ begins.
- **Q-003**: Co-activation spreading at `hybrid-search.ts:406-416` — the results are currently computed but discarded. Is the spreading algorithm's output quality validated (do the activated nodes represent genuinely related memories), or is this a known-unvalidated feature that was deactivated intentionally? If the latter, REQ-005 should include a validation gate before enabling.
- **Q-004**: The 18ms graph channel timeout — if the Causal Edge CTE query (which may traverse large edge sets) frequently approaches the timeout on production data sizes, should the timeout be configurable via environment variable rather than hardcoded? Recommend yes; to be decided at Phase 1+ review.
- **Q-005**: Patterns 4, 6, 7 (Semantic Bridge Discovery, Context Budget Optimization, Temporal-Structural Coherence) are scoped to P2/deferred. Should they be tracked in a separate sub-spec (`004-intelligence-patterns`) or remain as deferred items in this spec's checklist? Requires Lead Developer decision post-Phase 2+ completion.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent Spec**: `.opencode/specs/003-system-spec-kit/138-hybrid-rag-fusion/spec.md`
- **Sibling 001 — Hybrid RAG Fusion**: `.opencode/specs/003-system-spec-kit/138-hybrid-rag-fusion/001-system-speckit-hybrid-rag-fusion/spec.md`
- **Sibling 002 — Skill Graph Integration**: `.opencode/specs/003-system-spec-kit/138-hybrid-rag-fusion/002-skill-graph-integration/spec.md`

---

<!--
LEVEL 3+ SPEC
- Core + L2-verify + L3-arch + L3plus-govern addendums
- Approval Workflow (phase-gated), Compliance checklist, Stakeholder matrix
- Full governance controls for multi-workstream convergence
- Complexity score: 85/100
-->
