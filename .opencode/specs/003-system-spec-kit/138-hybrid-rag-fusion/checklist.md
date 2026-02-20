# Checklist: 138-hybrid-rag-fusion

<!-- ANCHOR: checklist-status-138 -->
## Integration & Readiness State

### Phase 0 Validation (Quick Wins)
- [ ] [P0] **Adaptive Fusion Active:** Execute a `mode="auto"` search for "fetch auth token". Verify via debug logs that RRF weights shifted heavily toward the FTS5 engine because it detected a technical keyword intent.
- [ ] [P0] **Graph Channel Active:** Create a test memory explicitly linked via `/memory:link` but with 0 keyword or semantic overlap to a second memory. Verify the second memory appears in search results because `useGraph: true` pulled it directly into RRF scoring via its causal edge.
- [ ] [P1] **Co-activation Success:** Search for "auth error". Verify `co-activation.ts` BFS spread successfully retrieves temporal neighbors (e.g., a "database connection error" memory created in the exact same 5-minute session).
- [ ] [P1] **Adaptive Fallback:** Execute a gibberish or hyper-specific query that intentionally returns 0 results at `0.3` vector similarity. Verify the payload returns results, and the `extraData.fallbackRetry` metadata flag is `true`.

### Phase 1 Validation (MMR & TRM)
- [ ] [P0] **MMR Pruning (True Redundancy):** Insert 3 completely identical implementation summaries into the database. Run a search. Verify post-fusion MMR eliminates 2 of them, returning only 1 alongside 4 other highly diverse memories.
- [ ] [P0] **Token Budget:** Execute a broad `mode="deep"` search across the entire corpus. Verify the returned markdown string payload strictly remains beneath the 2000-token boundary (approx 8000 ASCII characters).
- [ ] [P1] **TRM Intercept:** Run a search with a completely unrelated topic (e.g., "how to bake bread" in a software database). Verify TRM calculates a Z-score < 1.5 on the RRF array and successfully injects the `> **⚠️ EVIDENCE GAP DETECTED**` markdown warning into the LLM prompt.

### Phase 2 Validation (Field Weights & Graph)
- [ ] [P1] **FTS5 Weighting:** Create two memories. Memory A has "AuthGuard" in the title. Memory B has "AuthGuard" mentioned 10 times in the body. Run an FTS-only query. Verify Memory A mathematically outranks Memory B due to the SQLite `bm25(..., 10.0, ...)` multiplier.
- [ ] [P1] **Graph Recursion Boost:** Create a chain: Memory A `supersedes` Memory B `caused` Memory C. Search for C. Verify A outranks B because the 1.5x `supersedes` multiplier overpowered the 1.3x `caused` multiplier in the recursive CTE.

### Phase 3 Validation (Multi-Query)
- [ ] [P1] **Async Non-Blocking Execution:** Verify that `mode="deep"` executes multiple query variants via `Promise.all`. The system log should show 3 concurrent DB transactions.
- [ ] [P0] **Latency Ceiling:** Verify that the `mode="deep"` search does not block the Node.js event loop for more than 50ms total.

### Phase 4 & Cognitive Validation
- [ ] [P1] **Structure Preservation:** Ingest a document with a complex Markdown table spanning 600 tokens. Query it. Verify the returned chunk contains the *entire* table, proving `remark-gfm` AST parsing prevented a mid-table chunk slice.
- [ ] [P2] **PageRank Batching:** Run `/memory:manage`. Verify `pagerank_score` updates in the `memory_index` SQLite table without throwing `SQLITE_BUSY` (database locked) errors.
- [ ] [P2] **Read-Time Gating:** Intentionally retrieve a Constitutional memory ("Must use Postgres") and a Scratch memory ("I used MySQL today") that contradict each other. Verify `prediction-error-gate.ts` flags the contradiction explicitly in the response payload.
- [ ] [P2] **FSRS Decay Velocity:** Verify Constitutional memories exhibit mathematically minimal FSRS decay over simulated time (e.g., stability score barely drops after 30 simulated days) compared to Scratch memories.

### Phase 5 Validation (Test Coverage)

#### New Test Files
- [ ] [P0] **`adaptive-fallback.vitest.ts` exists:** Tests two-pass fallback (0-result retry at 0.17, `fallbackRetry` flag, skip on non-zero).
- [ ] [P0] **`mmr-reranker.vitest.ts` exists:** Tests `applyMMR()` — dedup, lambda diversity/relevance, N=20 hardcap, <2ms for N=20, limit enforcement.
- [ ] [P0] **`evidence-gap-detector.vitest.ts` exists:** Tests `detectEvidenceGap()` — Z-score threshold, edge cases (single, identical, empty).
- [ ] [P1] **`query-expander.vitest.ts` exists:** Tests `expandQuery()` — compound split, synonym lookup, max 3 variants, original always included.
- [ ] [P1] **`structure-aware-chunker.vitest.ts` exists:** Tests AST chunking — tables atomic, code blocks atomic, heading attachment, size limits.
- [ ] [P1] **`pagerank.vitest.ts` exists:** Tests batch PageRank — convergence, score persistence, no SQLITE_BUSY, isolated node minimum.
- [ ] [P0] **`integration-138-pipeline.vitest.ts` exists:** End-to-end: intent→scatter→fuse→co-activate→TRM→MMR→serialize. Latency <120ms. Token budget <2000.

#### Updated Test Files
- [ ] [P0] **`adaptive-fusion.vitest.ts` updated:** New tests for intent-weighted RRF activation via `hybridAdaptiveFuse(intent)`.
- [ ] [P0] **`hybrid-search.vitest.ts` updated:** New tests for `useGraph: true` default, scatter-gather with graph, `mode="deep"` multi-query parallelism.
- [ ] [P1] **`co-activation.vitest.ts` updated:** Pipeline integration test for post-RRF `spreadActivation()`.
- [ ] [P1] **`bm25-index.vitest.ts` updated:** Weighted BM25 SQL tests (title 10x > body, trigger_phrases 5x).
- [ ] [P1] **`causal-edges.vitest.ts` updated:** Relationship weight multiplier tests (supersedes 1.5x, contradicts 0.8x, caused 1.3x).
- [ ] [P1] **`unit-rrf-fusion.vitest.ts` updated:** Multi-dimensional array (cross-variant) RRF with +0.10 convergence bonus.
- [ ] [P0] **`intent-classifier.vitest.ts` updated:** Centroid-based classification tests, intent-to-lambda mapping.
- [ ] [P1] **`fsrs-scheduler.vitest.ts` updated:** Tier decay modulation (Constitutional 0.1x, Scratch 3.0x).
- [ ] [P1] **`prediction-error-gate.vitest.ts` updated:** Read-time contradiction flagging for Constitutional+Scratch conflicts.
- [ ] [P1] **`handler-memory-search.vitest.ts` updated:** `[EVIDENCE GAP DETECTED]` warning injection in markdown payload.
- [ ] [P0] **`integration-search-pipeline.vitest.ts` updated:** Regression guards for feature-flag-off behavior.

#### Test Quality Gates
- [ ] [P0] **All tests pass:** `npx vitest run` exits with code 0 (no failures).
- [ ] [P0] **No regressions:** Existing 3,872+ tests remain green after all changes.
- [ ] [P1] **Coverage targets met:** Unit ≥80%, Integration ≥70% for new/modified modules.
<!-- /ANCHOR: checklist-status-138 -->