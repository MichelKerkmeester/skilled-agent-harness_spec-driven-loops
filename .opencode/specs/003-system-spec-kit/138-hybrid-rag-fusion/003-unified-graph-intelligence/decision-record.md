# Decision Record: Unified Graph-RAG Intelligence Integration

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/workflows-documentation/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Virtual Graph Adapter over SQLite-Only Merge

<!-- ANCHOR:adr-001-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-20 |
| **Deciders** | OpenCode AI, Michel Kerkmeester |

---

### Context

Two disconnected graph systems exist inside the MCP server with no bridge between them. The Causal Edge Graph lives in SQLite (`causal_edges` table, 6 edge types: `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`) and uses integer memory IDs. The SGQS Skill Graph lives in memory as a `Map<string, SkillNode>` with 412 nodes and 627 edges, using `{skill}/{path}` string IDs. The hybrid search pipeline has one `graphSearchFn` slot — wiring both graphs into it required deciding whether to merge them physically into SQLite or compose them virtually at query time.

### Constraints

- Zero schema migrations: the existing `causal_edges` table schema cannot change
- The 120ms total pipeline budget leaves at most 30ms for graph traversal
- SGQS relies on O(1) adjacency via in-memory Map lookups; losing that breaks BFS performance
- RRF fusion deduplicates by result ID — incompatible ID formats between the two graphs cause phantom duplicates
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: A Virtual Graph Adapter — a composite `createUnifiedGraphSearchFn()` that queries both graphs in parallel and merges their results under a shared namespace-prefixed ID scheme.

**How it works**: The adapter dispatches two parallel async calls — one to the causal edge traversal and one to the SGQS BFS engine — then merges their result arrays. Causal edge results receive IDs prefixed `mem:{id}`, SGQS results receive IDs prefixed `skill:{path}`. Scores are normalized to the same 0–1 range before both result sets enter RRF. The composite function satisfies the existing `GraphSearchFn` type signature exactly, so `hybridSearchEnhanced()` requires no changes. Total addition: ~130 LOC.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Virtual Graph Adapter (chosen)** | Zero schema changes; both graphs remain independent; additive; O(1) adjacency preserved | Requires ID normalization logic; slightly more complex merge code | 9/10 |
| SQLite-Only Merge | Single query surface; unified SQL joins | Imports 412 SGQS nodes into `causal_edges`, breaking zero-migration constraint; loses in-memory O(1) adjacency for BFS; adds 400+ rows to SQLite | 4/10 |

**Why this one**: The Virtual Adapter scores highest because it solves the integration problem without touching the database schema. Importing SGQS into SQLite would violate the hard zero-migration constraint established in ADR-D1 of the 138 parent spec, and it would destroy the in-memory performance characteristic that makes SGQS fast for BFS traversal.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Both graph systems contribute results to RRF fusion without any database schema change
- SGQS adjacency operations stay at O(1) Map lookups — BFS within the 30ms budget
- Cross-graph convergence (memory matched by both graphs) automatically triggers the existing `+0.10` convergence bonus in `rrf-fusion.ts:160-167`

**What it costs**:
- ID normalization logic adds ~20 LOC of mapping code. Mitigation: isolated in the adapter layer with unit tests covering all prefix edge cases
- Two parallel async calls add a small scheduling overhead (~2ms). Mitigation: `Promise.all()` keeps both calls concurrent; total latency matches whichever graph is slower, not the sum

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| SGQS graph not yet built on first call (cold start) | M | `SkillGraphCacheManager` (ADR-002) handles first-call build and caches; adapter waits for cache to be ready |
| ID prefix collision if a future system also uses `mem:` or `skill:` prefix | L | Prefix registry in adapter config — new systems register a unique prefix before wiring |
| RRF score normalization bug causes one graph to dominate | H | Integration tests assert that both graph types contribute to final top-10 results in a fixed test corpus |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Graph channel slot exists in `hybridSearchEnhanced()` but is empty in production; two graph systems exist with no bridge |
| 2 | **Beyond Local Maxima?** | PASS | SQLite-Only Merge evaluated and scored 4/10 due to schema migration requirement and O(1) loss |
| 3 | **Sufficient?** | PASS | ~130 LOC adapter satisfies the integration goal; no new infrastructure required |
| 4 | **Fits Goal?** | PASS | Directly activates the graph channel for `memory_search()` and `memory_context()` — the two most-called MCP tools |
| 5 | **Open Horizons?** | PASS | Prefix registry design allows a third graph system (e.g., a future semantic graph) to join without refactoring the adapter |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- New file: `mcp_server/lib/search/unified-graph-adapter.ts` — composite function with namespace prefixing and score normalization
- Edit: `mcp_server/context-server.ts` — wire `createUnifiedGraphSearchFn()` into the `graphSearchFn` parameter of `hybridSearchEnhanced()`
- Edit: `mcp_server/lib/search/rrf-fusion.ts` — add convergence-bonus detection for cross-graph ID pairs (`mem:X` + `skill:Y` targeting the same conceptual result)

**How to roll back**: Set `graphSearchFn: null` in the `hybridSearchEnhanced()` call. This restores the pre-integration production behavior — the graph channel returning null was already the default. No database changes to revert.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Cache-First SGQS over Per-Call Filesystem Rebuild

<!-- ANCHOR:adr-002-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-20 |
| **Deciders** | OpenCode AI, Michel Kerkmeester |

---

### Context

`sgqs/index.ts:50-55` calls `buildSkillGraph(skillRoot)` on every query invocation. That function reads 72 markdown files from the filesystem to reconstruct the full 412-node, 627-edge graph from scratch. On a warm disk cache this takes 100-150ms. The entire hybrid search pipeline budget is 120ms. A single SGQS query already blows the budget before any vector or FTS5 search runs, making per-call filesystem rebuild incompatible with production latency requirements.

### Constraints

- 120ms total pipeline budget for `mode="auto"` (the most-called mode)
- The skill graph changes only when markdown files on disk change — which happens on server restart or skill updates, not between queries
- Memory footprint must stay reasonable for a local MCP server process (~300KB for the full graph is acceptable)
- No external cache infrastructure (Redis, memcached) — must be in-process
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: A `SkillGraphCacheManager` singleton with a 5-minute TTL and a manual `invalidate()` method.

**How it works**: The first call to `getGraph()` triggers `buildSkillGraph(skillRoot)` and stores the result in a module-level variable alongside a `builtAt` timestamp. Subsequent calls within the TTL window return the cached reference in under 1ms — the graph object is not copied or serialized, just referenced. After TTL expiry, the next call rebuilds and refreshes the cache. The `invalidate()` method clears the cache immediately and is called during server restart and after any skill file write operation.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Cache-First Singleton with TTL (chosen)** | <1ms cache hit; ~300KB memory footprint; simple implementation; auto-invalidates on TTL | Cold-start penalty of 100-150ms on first call per TTL window | 9/10 |
| LRU cache at query-node granularity | Potentially finer-grained invalidation | The graph is the same object for all queries — node-level caching adds complexity without reducing memory use or improving hit rate; still requires a full build on any cache miss | 3/10 |
| Filesystem watcher with hot-reload | Zero TTL delay; instant invalidation on file change | Requires `chokidar` or `fs.watch` dependency; adds OS-level file descriptor overhead; complex error handling for rapid successive changes | 5/10 |

**Why this one**: The query-node LRU scores low because all queries share the same graph state. A filesystem watcher would work but adds a dependency and OS-level complexity that is out of proportion to the problem — a 5-minute TTL is more than sufficient given that skill files change at deployment time, not during query bursts.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- SGQS queries drop from 100-150ms to <1ms after the first call in each TTL window
- The graph channel can contribute to every `memory_search()` call without breaching the 120ms budget
- ~300KB memory footprint is fixed regardless of query volume

**What it costs**:
- First call in each 5-minute window incurs the 100-150ms build penalty. Mitigation: warm the cache proactively on server startup in the MCP initialization sequence
- Stale graph data possible if a skill file changes mid-TTL. Mitigation: `invalidate()` is called explicitly after any `memory_save()` that touches a skill path; acceptable risk for a local dev tool

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Server restart while graph is building (concurrent requests during cold start) | M | Mutex lock on `getGraph()` — only one build runs at a time; other callers await the same Promise |
| Memory leak if graph object holds references to large closed-over data | L | Unit test asserts that two successive `invalidate()` + `getGraph()` calls produce independent object references with no shared mutable state |
| TTL too short causes excessive rebuilds under high query load | L | TTL is configurable via `SPECKIT_SGQS_CACHE_TTL_MS` environment variable; default 300,000ms (5 min) is conservative |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 100-150ms per-call cost measured directly in `sgqs/index.ts:50-55`; exceeds the 120ms total budget alone |
| 2 | **Beyond Local Maxima?** | PASS | Three options evaluated: singleton TTL, LRU node cache, filesystem watcher; singleton TTL scores highest on simplicity/cost ratio |
| 3 | **Sufficient?** | PASS | Cache hit at <1ms leaves 119ms for the rest of the pipeline; no further optimization needed |
| 4 | **Fits Goal?** | PASS | Unblocks the graph channel from being usable in production without any infrastructure additions |
| 5 | **Open Horizons?** | PASS | TTL is environment-variable-configurable; `invalidate()` API allows future file-watcher integration without refactoring the cache interface |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- New file: `scripts/sgqs/cache-manager.ts` — `SkillGraphCacheManager` singleton with `getGraph()`, `invalidate()`, and TTL logic
- Edit: `scripts/sgqs/index.ts:50-55` — replace direct `buildSkillGraph(skillRoot)` call with `SkillGraphCacheManager.getGraph(skillRoot)`
- Edit: `mcp_server/context-server.ts` (initialization block) — call `SkillGraphCacheManager.getGraph(skillRoot)` during server startup to warm the cache

**How to roll back**: Revert `scripts/sgqs/index.ts:50-55` to call `buildSkillGraph(skillRoot)` directly. The cache manager can remain in the codebase but becomes unreferenced. No configuration changes required.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Composite graphSearchFn over Separate Graph Channels

<!-- ANCHOR:adr-003-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-20 |
| **Deciders** | OpenCode AI, Michel Kerkmeester |

---

### Context

`hybridSearchEnhanced()` accepts a single `graphSearchFn` parameter typed as `(query: string, options: GraphSearchOptions) => Promise<Array<SearchRecord>>`. There is one slot. We have two graph systems (Causal Edge Graph + SGQS Skill Graph) that both need to contribute results to RRF fusion. The question is whether to fit both into the existing single slot via a composite function, or to expand the pipeline to support multiple graph channels with separate scatter entries and adaptive weight assignments.

### Constraints

- Modifying `hybridSearchEnhanced()` scatter/gather logic requires updating `rrf-fusion.ts` weight calculations and the adaptive fusion weight table — a medium-risk refactor touching the critical search path
- The existing pipeline is already tested and in production; any refactor risks introducing regressions in the primary `memory_search()` path
- Both graphs return `Array<SearchRecord>` — they share the same output shape as the existing graph channel
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: A single composite function that queries both graph systems internally and returns a merged result array.

**How it works**: `createUnifiedGraphSearchFn()` (from ADR-001) accepts the same `(query, options)` signature that `hybridSearchEnhanced()` expects. Inside, it runs both the causal edge BFS and the SGQS BFS in parallel via `Promise.all()`. The merged array — with namespace-prefixed IDs — returns as a single flat `Array<SearchRecord>`. From the pipeline's perspective, there is still one graph channel. RRF fusion processes graph results exactly as it did before. No changes to the scatter array, weight table, or fusion algorithm.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Composite function (chosen)** | Zero refactor of `hybridSearchEnhanced()`; zero risk to production pipeline; clean encapsulation of multi-graph logic inside the adapter | Both graph results share a single RRF weight — cannot tune causal vs. skill graph weight separately at the fusion level | 9/10 |
| Separate graph channels (expand pipeline) | Independent per-graph weight tuning; cleaner conceptual model | Requires modifying `hybridSearchEnhanced()` scatter array, RRF weight table, adaptive fusion config — medium refactor touching the critical path; higher regression risk | 5/10 |

**Why this one**: The composite function achieves the goal with zero changes to the code that every `memory_search()` call runs through. The per-graph weight tuning advantage of separate channels is not worth the refactor risk at this stage — the adaptive fusion system already handles channel-level weighting dynamically based on query type.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Both graph systems contribute results to RRF without any changes to the tested production pipeline code
- Integration is self-contained — the composite function can be unit tested in isolation from the full pipeline

**What it costs**:
- Both graph systems share a single adaptive fusion weight slot — cannot independently boost or suppress causal vs. skill graph results at the RRF level. Mitigation: internal scoring within the composite function can apply a pre-normalization weight multiplier per graph type before results are merged
- If one graph system errors, the composite function's error handling must decide whether to return partial results or propagate the error. Mitigation: fail-soft — if one graph errors, return results from the healthy graph with a telemetry warning rather than failing the entire search

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Result array size doubles (both graphs return N results), bloating RRF input | M | Cap per-graph result count at 10 before merge; total graph channel output capped at 20 — same as current single-graph cap |
| One graph consistently dominates the merged results, drowning the other | M | Integration test asserts both graph types contribute at least 1 result to the final top-10 in the standard test corpus |
| Future need to tune per-graph weights requires refactor | L | Document the weight-multiplier hook inside the composite function as an extension point; if tuning becomes necessary, the multiplier approach avoids a pipeline refactor |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | One graph slot, two graph systems — a composition strategy is required |
| 2 | **Beyond Local Maxima?** | PASS | Separate channels option evaluated and scored 5/10 due to pipeline refactor risk |
| 3 | **Sufficient?** | PASS | Composite function achieves full dual-graph contribution with zero pipeline changes |
| 4 | **Fits Goal?** | PASS | Direct path to activating both graphs in `memory_search()` with minimum change surface |
| 5 | **Open Horizons?** | PASS | Composite approach can expand to 3+ graph systems by adding another `Promise.all()` entry without touching the pipeline |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- New file: `mcp_server/lib/search/unified-graph-adapter.ts` — implements `createUnifiedGraphSearchFn()` with parallel dispatch, fail-soft error handling, and per-graph result cap (shared artifact with ADR-001)
- Edit: `mcp_server/context-server.ts` — replace `graphSearchFn: null` with `graphSearchFn: createUnifiedGraphSearchFn({ causalEdgeDb: db, sgqsCache: SkillGraphCacheManager })`
- New test: `mcp_server/tests/unified-graph-adapter.vitest.ts` — asserts composite output shape, ID prefixing, fail-soft behavior, and result cap enforcement

**How to roll back**: Set `graphSearchFn: null` in `context-server.ts`. The composite function module can remain but becomes unreferenced. All pipeline behavior reverts to the pre-integration baseline in one line change.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Phased Feature-Flag Rollout over Big-Bang Activation

<!-- ANCHOR:adr-004-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-20 |
| **Deciders** | OpenCode AI, Michel Kerkmeester |

---

### Context

Wiring the unified graph channel touches the critical path that every `memory_search()` and `memory_context()` call runs through. These are the two most-called MCP tools — a broken deployment disables all context retrieval in the AI assistant. A single-step "big-bang" activation (wire everything, ship it) offers no safe intermediate state. If the graph channel introduces a latency regression or an unexpected error, the only recovery option is a full code revert, which requires identifying the commit, reverting, rebuilding, and restarting the MCP server — a process that interrupts active sessions.

### Constraints

- `SPECKIT_GRAPH_UNIFIED=false` must produce exactly the pre-integration production behavior — no behavioral change at all
- Individual intelligence pattern flags (`SPECKIT_GRAPH_MMR`, `SPECKIT_GRAPH_AUTHORITY`) must be independently reverted without affecting the base graph channel
- Zero database changes required to enable or disable any flag
- Flag state must be readable at server startup (environment variables, not runtime config files)
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: A three-phase dark launch controlled by environment variable flags.

**How it works**: Phase 0+ ships the complete implementation with `SPECKIT_GRAPH_UNIFIED` defaulting to `false`. The unified graph adapter is wired but the `graphSearchFn` parameter is only populated when the flag is `true`. Phase 0+ validates the implementation in a local environment without any production traffic change. Phase 1+ sets `SPECKIT_GRAPH_UNIFIED=true` and collects latency and result-quality metrics for 24 hours. If P50/P95 latency stays under 120ms and result quality scores improve, Phase 1+ is declared stable. Phase 2+ enables the individual intelligence enhancement flags (`SPECKIT_GRAPH_MMR`, `SPECKIT_GRAPH_AUTHORITY`) one at a time, each validated independently.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Phased feature-flag rollout (chosen)** | Each phase independently reverted in seconds (env var change + restart); zero database changes; no session disruption on rollback | Adds flag-check branches to the search path; requires disciplined metric collection between phases | 9/10 |
| Big-bang activation | Simpler code (no flag branches); faster time to full activation | Any latency regression or bug requires full code revert; no safe intermediate state; disrupts active sessions during rollback | 3/10 |
| Runtime toggle via MCP tool | Enables activation without server restart | Introduces mutable server state that is difficult to reason about; flag state lost on restart; complicates observability | 4/10 |

**Why this one**: The phased rollout scores highest because each flag is a one-line environment variable change — faster to revert than any code change. The graph channel returning `null` (flag=false) is already the production baseline, so Phase 0+ ships zero behavioral change to production and costs nothing.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Each phase can be independently assessed against latency and quality metrics before the next phase activates
- Rollback from any phase is a single environment variable change and server restart — no code change, no database migration
- The flag-false path is identical to pre-integration production behavior — there is no risk of regression while the flag is off

**What it costs**:
- Flag-check branches add minor conditional logic to `context-server.ts`. Mitigation: flags are evaluated once at startup and stored as boolean constants — no per-query flag reads
- Metric collection between phases requires discipline: someone must actively monitor and record P50/P95 latency and result-quality scores. Mitigation: the telemetry module already records per-call latency to the retrieval telemetry table — query it with a 24-hour window

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Phase 1+ shows latency regression but metrics are not checked before Phase 2+ | H | Gate: Phase 2+ activation requires explicit latency sign-off in `checklist.md` with measured P95 value |
| Flag values forgotten in environment after extended testing period | L | Document flag defaults in `references/environment_variables.md` with "production default = false" annotation |
| Two developers enable conflicting flag combinations in the same environment | M | Flags are documented in `.env.example` with phase labels; Phase 2+ flags depend on Phase 1+ being stable — this dependency is documented |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The graph channel touches every `memory_search()` call — a safe rollback mechanism is required, not optional |
| 2 | **Beyond Local Maxima?** | PASS | Big-bang activation and runtime toggle evaluated; both score poorly on rollback safety |
| 3 | **Sufficient?** | PASS | Three phases cover the full activation surface: base integration (Phase 1+) and intelligence enhancements (Phase 2+) |
| 4 | **Fits Goal?** | PASS | Flags enable local testing (Phase 0+) and gradual production validation (Phase 1+, Phase 2+) — directly on the critical path to stable activation |
| 5 | **Open Horizons?** | PASS | Any future graph enhancement can follow the same pattern: ship behind a flag, validate, then set default to true |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- Edit: `mcp_server/context-server.ts` — read `SPECKIT_GRAPH_UNIFIED`, `SPECKIT_GRAPH_MMR`, `SPECKIT_GRAPH_AUTHORITY` from `process.env` at startup; store as boolean constants; wire `graphSearchFn` only when `SPECKIT_GRAPH_UNIFIED === true`
- Edit: `.env.example` — add the three flag variables with `false` defaults and phase labels (`# Phase 1+`, `# Phase 2+`)
- Edit: `references/environment_variables.md` — document flag semantics, default values, and phase dependencies

**How to roll back**: Set `SPECKIT_GRAPH_UNIFIED=false` in the environment and restart the MCP server. Server returns to pre-integration baseline. No code changes, no database changes. Phase 2+ flags have no effect when Phase 1+ flag is false.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Namespace-Prefixed Unified IDs over Shared ID Space

<!-- ANCHOR:adr-005-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-20 |
| **Deciders** | OpenCode AI, Michel Kerkmeester |

---

### Context

Causal edge results use integer IDs (`42`, `137`) that reference `memory_index.id` — a SQLite auto-increment primary key. SGQS results use path strings (`system-spec-kit/nodes/memory-system`) that are the filesystem-relative skill node paths. RRF fusion deduplicates results by ID before computing ranks. Without a disambiguation scheme, two distinct results from different graphs that happen to share the same raw identifier string would collide and be treated as duplicates. The integer `42` from the causal graph and a hypothetical SGQS path that evaluates to `"42"` would be merged into one result, losing one graph's contribution. Additionally, the existing convergence bonus logic in `rrf-fusion.ts:160-167` adds `+0.10` when the same entity appears in multiple channels — without explicit cross-graph identity, this bonus cannot fire for semantically related but differently identified results.

### Constraints

- RRF deduplication key is the result `id` field — this is a string comparison in the current implementation
- The existing convergence bonus in `rrf-fusion.ts` uses exact ID match to detect cross-channel convergence
- SGQS IDs are human-readable paths that must remain usable for file traversal operations
- Causal edge IDs are SQLite integers that must remain usable for JOIN operations against `memory_index`
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: Namespace-prefixed IDs for all unified graph results, plus a new cross-graph edge type registry for explicit bridging.

**How it works**: The unified graph adapter prefixes all causal edge result IDs with `mem:` (producing `mem:42`, `mem:137`) and all SGQS result IDs with `skill:` (producing `skill:system-spec-kit/nodes/memory-system`). This guarantees zero collision between the two namespaces and makes the source graph machine-readable from the ID alone. For cross-graph bridging, three new edge types are registered in the `causal_edges` type taxonomy: `DESCRIBES` (a skill node describes what a memory record captures), `IMPLEMENTS` (a memory record implements a pattern defined in a skill node), and `GOVERNS` (a skill node governs the workflow that produced a memory). When the RRF fusion detects that `mem:X` and `skill:Y` both appear in the top results for the same query — and a `DESCRIBES`/`IMPLEMENTS`/`GOVERNS` edge connects them — it applies the existing `+0.10` convergence bonus.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Namespace-prefixed IDs (chosen)** | Zero collision risk; source graph readable from ID; enables convergence bonus detection; human-readable | Downstream code that strips the prefix to get the raw ID for DB/file operations needs a `parseUnifiedId()` helper | 9/10 |
| Shared ID space with collision detection | No prefix overhead | Integer `42` and string path `"42"` are a real but low-probability collision; detecting and resolving collisions at query time adds branching complexity; provides no convergence signal | 3/10 |
| UUID remapping (assign new UUIDs to all results) | Guaranteed uniqueness | Destroys human-readability; makes debugging opaque; requires a bidirectional UUID-to-original-ID lookup table | 2/10 |

**Why this one**: Namespace prefixing is the simplest approach that solves all three problems simultaneously — collision prevention, convergence detection, and source identification — at the cost of a single `parseUnifiedId()` helper function. UUID remapping would solve collision but at the cost of debuggability and a lookup table with no other benefit.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- Zero ID collision risk between the causal graph and SGQS regardless of future data growth
- RRF fusion convergence bonus now fires for cross-graph convergence when a memory and a skill node both match the same query — previously impossible
- Source graph is immediately identifiable from any result ID without a database lookup
- New cross-graph edge types (`DESCRIBES`, `IMPLEMENTS`, `GOVERNS`) enable explicit knowledge-base linking between episodic memories and procedural skill nodes

**What it costs**:
- All consumers of result IDs must handle the `mem:` and `skill:` prefix when passing IDs to downstream operations (SQLite lookups, file reads). Mitigation: `parseUnifiedId(id)` utility function returns `{ type: 'memory' | 'skill', rawId: string | number }` — one import, used in all three downstream consumers
- Three new edge type strings in the `causal_edges` type taxonomy require updating the type-validation list in `causal-tools.ts`. Mitigation: additive-only change — existing edge types are unaffected

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A consumer forgets to call `parseUnifiedId()` and passes the prefixed string directly to SQLite | H | TypeScript type guard: `UnifiedId` is a branded string type; raw `string` parameters in DB call signatures produce a type error at compile time |
| Cross-graph edges (`DESCRIBES`, `IMPLEMENTS`, `GOVERNS`) created with wrong direction (skill→memory vs. memory→skill) | M | Direction convention documented in `causal-tools.ts` JSDoc: `DESCRIBES` always runs skill→memory; `IMPLEMENTS` runs memory→skill; `GOVERNS` runs skill→memory |
| Convergence bonus fires too aggressively if many skill nodes weakly match every query | L | Convergence bonus requires both a cross-graph edge AND both results appearing in top-20 RRF candidates — dual gate prevents weak matches from triggering the bonus |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without a disambiguation scheme, integer ID `42` from causal graph collides with any SGQS result whose path resolves to the string `"42"` in RRF deduplication |
| 2 | **Beyond Local Maxima?** | PASS | Shared ID space and UUID remapping both evaluated; shared space has collision risk, UUID remapping destroys debuggability |
| 3 | **Sufficient?** | PASS | Prefix + `parseUnifiedId()` helper + three new edge types covers all identified requirements; no further ID management needed |
| 4 | **Fits Goal?** | PASS | Enables cross-graph convergence bonus which is a direct quality improvement for `memory_search()` result ranking |
| 5 | **Open Horizons?** | PASS | Prefix registry design supports a third graph system registering `doc:` or `proj:` namespace without modifying existing consumers |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- New utility: `mcp_server/lib/search/unified-id.ts` — `parseUnifiedId()`, `makeMem()`, `makeSkill()` helpers with branded `UnifiedId` TypeScript type
- Edit: `mcp_server/lib/search/unified-graph-adapter.ts` — apply `makeMem()` and `makeSkill()` when building result arrays
- Edit: `mcp_server/lib/search/rrf-fusion.ts:160-167` — update convergence bonus detection to check for `mem:X` / `skill:Y` pairs connected by a `DESCRIBES`, `IMPLEMENTS`, or `GOVERNS` edge
- Edit: `mcp_server/tools/causal-tools.ts` — add `DESCRIBES`, `IMPLEMENTS`, `GOVERNS` to the valid edge type enum; add direction convention JSDoc
- New test: `mcp_server/tests/unified-id.vitest.ts` — round-trip parse tests, branded type compile-time guard tests, convergence bonus integration test with a known cross-graph edge

**How to roll back**: Disable `SPECKIT_GRAPH_UNIFIED` flag (ADR-004). The prefix utility functions become unreferenced. The three new edge types remain in the enum but are never written to the database unless a user explicitly creates them — no data cleanup required.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!--
Level 3+ Decision Record: One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
State decisions with certainty. Be honest about trade-offs.
HVR rules: .opencode/skill/workflows-documentation/references/hvr_rules.md
-->
