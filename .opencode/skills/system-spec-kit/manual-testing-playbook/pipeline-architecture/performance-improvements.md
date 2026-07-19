---
title: "071 -- Performance improvements"
description: "This scenario validates Performance improvements for `071`. It focuses on confirming key perf remediations active, including fallback split, token-estimate caching, and BM25 demotion behavior."
audited_post_018: true
version: 3.6.0.17
id: pipeline-architecture-performance-improvements
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 071 -- Performance improvements

## 1. OVERVIEW

This scenario validates Performance improvements for `071`. It focuses on confirming key perf remediations active, including fallback split, token-estimate caching, and BM25 demotion behavior.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm key perf remediations active.
- Real user request: `Please validate Performance improvements against hybrid-search.ts and tell me whether the expected signals are present: Optimized code paths are active (not bypassed); fallback enrichment is single-pass; token estimation is cached per result; BM25 is opt-in with FTS5 default; BM25 warmup uses incremental maintenance; heavy queries complete within acceptable time; no performance regressions.`
- Prompt: `Validate performance improvements against hybrid-search.ts and return pass/fail with cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Optimized code paths are active (not bypassed); fallback enrichment is single-pass; token estimation is cached per result; BM25 is opt-in with FTS5 default; BM25 warmup uses incremental maintenance; heavy queries complete within acceptable time; no performance regressions
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if optimized paths are active and the fallback split, token cache, BM25 opt-in/default behavior, and incremental warmup are all visible in code/runtime evidence without regressions

---

## 3. TEST EXECUTION

### Prompt

```
Validate performance improvements against hybrid-search.ts and return pass/fail with cited evidence.
```

### Commands

1. Inspect `hybrid-search.ts` and confirm `executeFallbackPlan()` collects fused tier outputs before `searchWithFallbackTiered()` calls `enrichFusedResults()` once on the final merged set
2. Inspect `truncateToBudget()` and confirm it caches token estimates in a `Map` keyed by canonical result id and uses field-aware `estimateResultTokens()` instead of whole-object serialization
3. Inspect `bm25-index.ts` and confirm `isBm25Enabled()` returns false unless `ENABLE_BM25` is explicitly set to an allowed truthy value
4. Confirm `rebuildFromDatabase()` schedules batched warmup through `syncChangedRows()` instead of performing a synchronous full rebuild
5. Run or review a representative heavy retrieval path and capture timing notes for the post-change code path

### Expected

Optimized code paths are active; fallback enrichment is single-pass; token estimation is cached per result; BM25 stays disabled by default unless explicitly enabled; batched `syncChangedRows()` warmup replaces blocking rebuilds; heavy queries complete within acceptable time; no regressions

### Evidence

Observed 2026-07-02:

1. `hybrid-search.ts` fallback split / enrichment inspection:

```text
1101: async function executeFallbackPlan(
1115:   const primaryExecution = await collectAndFuseHybridResults(query, embedding, primaryOptions);
1116:   const primaryResults = primaryExecution
1117:     ? applyResultLimit(primaryExecution.fusedResults, primaryOptions.limit)
1137:     const retryExecution = await collectAndFuseHybridResults(query, embedding, retryOptions);
1138:     const retryResults = retryExecution
1139:       ? applyResultLimit(retryExecution.fusedResults, retryOptions.limit)
2315:   const { allowedChannels, stages } = await executeFallbackPlan(
2323:   const finalStage = retryStage?.results.length ? retryStage : primaryStage;
2324:   if (finalStage?.results.length) {
2325:     return finalStage.execution
2326:       ? enrichFusedResults(query, finalStage.execution, finalStage.options, finalStage.results)
2728:   const { stages } = await executeFallbackPlan(query, embedding, options, 'tiered');
2742:     const tier2Results = tier2Stage?.results ?? [];
2743:     results = mergeResults(results, tier2Results);
2774:   const finalResults = enrichmentExecution
2775:     ? await enrichFusedResults(query, enrichmentExecution, enrichmentOptions, results)
2776:     : applyResultLimit(results, options.limit);
```

2. `hybrid-search.ts` token estimate cache inspection:

```text
2858: function estimateResultTokens(result: HybridSearchResult): number {
2861:   const handledKeys = new Set([
2862:     'id',
2863:     'score',
2864:     'source',
2865:     'title',
2866:     'content',
2867:     'sources',
2868:     'spec_folder',
2869:     'file_path',
2870:     'traceMetadata',
2871:     'parentMemoryId',
2872:     'chunkIndex',
2873:     'similarity',
2874:     'combined_lexical_score',
2974: function truncateToBudget(
2988:   const sorted = [...results].sort((a, b) => b.score - a.score);
2989:   const tokenEstimateCache = new Map<string, number>();
2990:   const getTokenEstimate = (result: HybridSearchResult): number => {
2991:     const cacheKey = canonicalResultId(result.id);
2992:     const cached = tokenEstimateCache.get(cacheKey);
2993:     if (cached !== undefined) {
2994:       return cached;
2997:     const estimate = estimateResultTokens(result);
2998:     tokenEstimateCache.set(cacheKey, estimate);
3002:   const totalTokens = sorted.reduce((sum, result) => sum + getTokenEstimate(result), 0);
3036:   for (const result of sorted) {
3037:     const tokens = getTokenEstimate(result);
```

3. `bm25-index.ts` enablement inspection and environment check:

```text
154: function isBm25Enabled(): boolean {
155:   const value = process.env.ENABLE_BM25?.trim().toLowerCase();
156:   if (!value) return true; // enabled by default
157:   if (BM25_DISABLED_VALUES.has(value)) return false;
158:   return BM25_ENABLED_VALUES.has(value);
```

```text
$ node -e 'console.log(process.env.ENABLE_BM25 ?? "<unset>")'
<unset>
```

This contradicts the expected signal `BM25 stays disabled by default unless explicitly enabled`.

4. `bm25-index.ts` warmup inspection:

```text
705:   syncChangedRows(database: Database.Database, rowIds: Array<number | string>): number {
760:   /**
761:    * Defer full startup warmup into batched row-ID syncs so process
762:    * initialization is not blocked by a monolithic in-memory rebuild.
763:    */
764:   rebuildFromDatabase(database: Database.Database): number {
774:       const pendingIds = rows.map((row) => row.id);
779:       const warmupGeneration = ++this.warmupGeneration;
785:         const batchIds = pendingIds.splice(0, BM25_WARMUP_BATCH_SIZE);
792:         this.syncChangedRows(database, batchIds);
795:           this.warmupHandle = registerTimeout(processBatch, 0, { unref: true });
806:       this.warmupHandle = registerTimeout(processBatch, 0, { unref: true });
807:       return pendingIds.length;
```

5. Representative retrieval timing:

```text
memory_quick_search query="Validate performance improvements against hybrid-search.ts fallback enrichment token estimation cache BM25 warmup performance regressions" limit=20
summary: Found 5 memories
pipelineMetadata.stage1.durationMs: 1493
pipelineMetadata.stage2.durationMs: 1277
pipelineMetadata.stage3.durationMs: 0
pipelineMetadata.stage4.durationMs: 1
pipelineMetadata.timing.total: 2771
searchDecisionEnvelope.pipelineTiming.total: 2771
searchDecisionEnvelope.latencyMs: 2775
meta.latencyMs: 2778
lexicalPath: fts5
fallbackState: ok
searchDecisionEnvelope.queryPlan.selectedChannels: ["vector","fts","bm25","graph","degree"]
searchDecisionEnvelope.trustTree.decision: degraded
searchDecisionEnvelope.degradedReadiness.reason: code graph readiness marker unavailable
```

The deep `memory_context` retrieval path was also attempted and failed before query execution:

```text
Error: sessionId "memory-context:67444b8face5f43c" is not bound to a corroborated server identity. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.
code: E_SESSION_SCOPE
```

### Pass / Fail

- **FAIL**: `bm25-index.ts` returns `true` when `ENABLE_BM25` is unset, contradicting the expected BM25 opt-in/default-disabled behavior; the representative retrieval path also reported degraded readiness even though quick search completed in 2778 ms.

### Failure Triage

Profile the heavy retrieval path; check whether enrichment helpers are re-entered per tier; inspect token-budget estimation for cache misses; verify BM25 enablement and warmup scheduling behavior

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [pipeline-architecture/performance-improvements.md](../../feature-catalog/pipeline-architecture/performance-improvements.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 071
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `pipeline-architecture/performance-improvements.md`
