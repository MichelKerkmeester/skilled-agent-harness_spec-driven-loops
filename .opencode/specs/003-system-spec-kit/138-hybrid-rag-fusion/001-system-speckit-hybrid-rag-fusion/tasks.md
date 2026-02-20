# Tasks: 138-hybrid-rag-fusion

<!-- ANCHOR: tasks-phase-0-138 -->
## Phase 0: Activate Assets
**Target File:** `lib/search/hybrid-search.ts`
- [ ] **Refactor `hybridSearchEnhanced()`:** Replace hardcoded `[1.0, 0.8, 0.6]` weights with an invocation of `hybridAdaptiveFuse(intent)`.
- [ ] **Activate Graph Routing:** Modify `hybridSearchEnhanced()` configuration object to default `useGraph: true`, mapping the causal relationships directly into the RRF fusion array.
- [ ] **Activate Co-Activation:** In `hybridSearchEnhanced()`, inject `await spreadActivation(top5_ids)` after the RRF fusion step and before final metadata formatting.
- [ ] **Implement Adaptive Fallback:** Wrap the primary `Promise.all` scatter block.
  ```typescript
  let results = await executeScatter(query, { min_similarity: 0.3 });
  if (results.length === 0) {
      results = await executeScatter(query, { min_similarity: 0.17 });
      metadata.fallbackRetry = true;
  }
  ```
<!-- /ANCHOR: tasks-phase-0-138 -->

<!-- ANCHOR: tasks-phase-1-138 -->
## Phase 1: Diversity and Confidence (TRM/MMR)
**Target Files:** `lib/search/mmr-reranker.ts` (NEW), `lib/search/evidence-gap-detector.ts` (NEW)
- [ ] **MMR Algorithm Calculation:** Implement `applyMMR(candidates, lambda, limit)` utilizing a pairwise cosine similarity matrix on the returned `sqlite-vec` embeddings.
  ```typescript
  // Core MMR calculation loop snippet
  const sim = computeCosine(candidate.embedding, selectedMemory.embedding);
  const mmrScore = (lambda * candidate.score) - ((1 - lambda) * maxSimToSelected);
  ```
- [ ] **Intent-Mapped Lambdas:** Create a configuration map where `intent="understand"` sets MMR `lambda=0.5` (high diversity), and `intent="fix_bug"` sets `lambda=0.85` (high relevance).
- [ ] **TRM Confidence Check:** Write `detectEvidenceGap(rrfScores: number[])` that calculates the Mean and Standard Deviation of the array. If `(topScore - mean) / stdDev < 1.5`, return `{ gapDetected: true }`.
- [ ] **Warning Injection:** Modify the MCP markdown formatter in `memory-search.ts` to forcefuly prepend `> **⚠️ EVIDENCE GAP DETECTED:** Retrieved context has low mathematical confidence. Consider first principles.` if TRM returns true.
<!-- /ANCHOR: tasks-phase-1-138 -->

<!-- ANCHOR: tasks-phase-2-138 -->
## Phase 2: Graph & Weights
**Target Files:** `lib/search/sqlite-fts.ts`, `lib/search/causal-edges.ts`
- [ ] **FTS5 SQL Upgrade:** Rewrite the standard `WHERE ... MATCH ?` SQL statement to use the native weighted `bm25()` ranker to elevate `title` matches 10x.
  ```sql
  -- Target SQL Implementation
  SELECT m.id, m.title, bm25(memory_fts, 10.0, 5.0, 1.0, 2.0) AS fts_score
  FROM memory_fts 
  JOIN memories m ON m.id = memory_fts.rowid
  WHERE memory_fts MATCH ?
  ORDER BY fts_score LIMIT ?;
  ```
- [ ] **Graph Weights CTE:** Update `causal-edges.ts` SQL CTE. Add a multiplier directly into the accumulator:
  ```sql
  -- Add to the recursive CTE accumulator
  (cte.score * CASE WHEN relation = 'supersedes' THEN 1.5 
                    WHEN relation = 'contradicts' THEN 0.8 
                    ELSE 1.0 END * edgeStrength) AS new_score
  ```
<!-- /ANCHOR: tasks-phase-2-138 -->

<!-- ANCHOR: tasks-phase-3-138 -->
## Phase 3: Multi-Query (RAG Fusion)
**Target File:** `lib/search/query-expander.ts` (NEW), `handlers/memory-search.ts`
- [ ] **Synonym Utility:** Build `expandQuery(query: string)` that splits compound terms using standard Regex (`/(\b\w+\b)/g`) and checks against a static JSON `DOMAIN_VOCABULARY_MAP`.
- [ ] **Scatter-Gather Execution:** In the MCP handler for `mode="deep"`, execute:
  ```typescript
  const variants = expandQuery(originalPrompt); // returns max 3
  const nestedResults = await Promise.all(variants.map(v => executeScatter(v)));
  const flattened = nestedResults.flat();
  // Pass flattened array into Reciprocal Rank Fusion
  ```
- [ ] **Cross-Variant RRF:** Modify `rrf-fusion.ts` to accept multi-dimensional arrays, grouping identical memory IDs across variants and applying the `+0.10` convergence bonus.
<!-- /ANCHOR: tasks-phase-3-138 -->

<!-- ANCHOR: tasks-phase-4-138 -->
## Phase 4: Indexing Quality & Cognitive Layer
**Target Files:** `scripts/lib/structure-aware-chunker.ts` (NEW), `lib/manage/pagerank.ts` (NEW), `lib/search/intent-classifier.ts`
- [ ] **AST Parsing:** Integrate `remark` + `remark-gfm` syntax tree parsing during the `generate-context.js` ingest phase. Ensure any node of type `code` or `table` bypasses text splitting.
- [ ] **Batch PageRank:** Write batch PageRank SQL logic to execute iteratively (10 iterations) during `memory_manage` runs, storing the float value in `memory_index.pagerank_score`.
- [ ] **Embedding Centroids:** Refactor `intent-classifier.ts` to compute 7 centroid embeddings during initialization. Replace regex checks with `Math.max(...centroids.map(c => dotProduct(c, queryEmb)))`.
- [ ] **Tier Decay Modulation:** Update `fsrs.ts` decay math: `new_stability = old_stability * (1.0 - (decay_rate * TIER_MULTIPLIER[tier]))`.
- [ ] **Read-Time Prediction Error:** Pipe the retrieved context payload through `prediction-error-gate.ts` just before MMR to flag read-time contradictions.
<!-- /ANCHOR: tasks-phase-4-138 -->

<!-- ANCHOR: tasks-phase-5-138 -->
## Phase 5: Test Coverage
**Target Directory:** `mcp_server/tests/`

### Phase 0 Tests (Update Existing)
- [ ] **Update `adaptive-fusion.vitest.ts`:** Add tests for intent-weighted RRF activation via `hybridAdaptiveFuse(intent)`. Verify weight vectors change per intent type (e.g., `find_spec` heavily weights FTS5, `explore` balances evenly).
- [ ] **Update `hybrid-search.vitest.ts`:** Add tests for `useGraph: true` default routing. Verify causal edges are included in the scatter-gather `Promise.all` array as a primary source.
- [ ] **Update `co-activation.vitest.ts`:** Add pipeline integration test verifying `spreadActivation(top5_ids)` runs post-RRF and enriches results with temporal neighbors.
- [ ] **Create `adaptive-fallback.vitest.ts` (NEW):** Test two-pass fallback: verify 0-result at `min_similarity=0.3` triggers retry at `0.17`, verify `metadata.fallbackRetry=true` flag, verify non-zero results skip retry.

### Phase 1 Tests (New Files)
- [ ] **Create `mmr-reranker.vitest.ts` (NEW):** Test `applyMMR(candidates, lambda, limit)` — verify identical candidates are deduplicated, verify lambda=0.5 maximizes diversity, verify lambda=0.85 preserves relevance order, verify N=20 hardcap, verify O(N²) completes in <2ms for N=20, verify output limit is respected.
- [ ] **Create `evidence-gap-detector.vitest.ts` (NEW):** Test `detectEvidenceGap(rrfScores)` — verify Z-score < 1.5 returns `gapDetected: true`, verify well-distributed scores return `gapDetected: false`, verify edge cases (single score, all identical scores, empty array).
- [ ] **Update `intent-classifier.vitest.ts`:** Add tests for intent-to-lambda mapping configuration (`understand`→0.5, `fix_bug`→0.85, etc.).
- [ ] **Update `handler-memory-search.vitest.ts`:** Add test verifying `[EVIDENCE GAP DETECTED]` warning is prepended to markdown payload when TRM flags low confidence.

### Phase 2 Tests (Update Existing)
- [ ] **Update `bm25-index.vitest.ts`:** Add tests for weighted `bm25(memory_fts, 10.0, 5.0, 1.0, 2.0)` SQL. Verify title match (10x) outranks body match. Verify `trigger_phrases` match (5x) outranks generic content (2x).
- [ ] **Update `causal-edges.vitest.ts` or `causal-edges-unit.vitest.ts`:** Add tests for relationship weight multipliers in recursive CTE: `supersedes`=1.5x, `contradicts`=0.8x, `caused`=1.3x. Verify `supersedes` chain outranks `caused` chain.

### Phase 3 Tests (New + Update)
- [ ] **Create `query-expander.vitest.ts` (NEW):** Test `expandQuery(query)` — verify compound terms are split, verify synonym map lookups work, verify max 3 variants returned, verify original query is always included, verify unknown terms return only original.
- [ ] **Update `unit-rrf-fusion.vitest.ts`:** Add tests for multi-dimensional array input (cross-variant RRF). Verify identical memory IDs across variants receive `+0.10` convergence bonus. Verify single-variant input behaves identically to current behavior.
- [ ] **Update `hybrid-search.vitest.ts`:** Add test for `mode="deep"` scatter-gather execution verifying `Promise.all` parallelism with expanded query variants.

### Phase 4 Tests (New + Update)
- [ ] **Create `structure-aware-chunker.vitest.ts` (NEW):** Test AST-based chunking — verify markdown tables are never split mid-row, verify code blocks are kept atomic, verify headings stay with their content, verify chunk size limits are respected.
- [ ] **Create `pagerank.vitest.ts` (NEW):** Test batch PageRank — verify 10 iterations converge, verify `pagerank_score` is written to `memory_index`, verify no `SQLITE_BUSY` errors during batch execution, verify isolated nodes get minimum score.
- [ ] **Update `intent-classifier.vitest.ts`:** Add tests for centroid-based classification replacing regex. Verify 7 centroid embeddings are computed at init. Verify `dotProduct` distance correctly classifies all 7 intent types.
- [ ] **Update `fsrs-scheduler.vitest.ts`:** Add tests for tier decay modulation: verify Constitutional tier uses `TIER_MULTIPLIER=0.1` (minimal decay), verify Scratch tier uses `3.0` (rapid decay). Verify formula: `new_stability = old_stability * (1.0 - (decay_rate * TIER_MULTIPLIER[tier]))`.
- [ ] **Update `prediction-error-gate.vitest.ts`:** Add read-time contradiction test: verify contradicting Constitutional+Scratch memories trigger explicit flag in response payload.

### Integration Tests
- [ ] **Create `integration-138-pipeline.vitest.ts` (NEW):** End-to-end pipeline test covering the full `hybridSearchEnhanced()` flow: intent classification → scatter (vector + FTS5 + graph) → adaptive RRF fusion → co-activation → TRM check → MMR pruning → markdown serialization. Verify total latency < 120ms. Verify output respects 2000-token budget.
- [ ] **Update `integration-search-pipeline.vitest.ts`:** Add regression guards ensuring the new pipeline doesn't break existing search behavior when feature flags are `false`.
<!-- /ANCHOR: tasks-phase-5-138 -->