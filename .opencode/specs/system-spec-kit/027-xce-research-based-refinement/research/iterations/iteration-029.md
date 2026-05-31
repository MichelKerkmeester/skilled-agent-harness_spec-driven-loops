# Iteration 010 - RQ-B5 Shared embedding cache and rerank infra

## Focus

RQ-B5 asks whether `mcp-coco-index` and the system-spec-kit memory backend should share embedding-cache and rerank infrastructure because both are currently in the Voyage family.

Verdict: ADAPT the client contracts, DEFER a shared persistent embedding store, and do not share indexing pipelines. A shared `RerankClient` is the highest-leverage part because it can centralize provider selection, caps, cache keys, circuit breaker behavior, and telemetry. A shared `EmbeddingCacheClient` interface is useful as an adapter seam, but the cache data itself should stay backend-local until measured duplicate content or query embedding reuse justifies a common store.

## Actions Taken

- Read the memory-side embedding cache. It is a better-sqlite3 table keyed by `(content_hash, model_id, dimensions)`, stores raw embedding blobs, tracks `last_used_at`, exposes hit/miss counters, and caps entries at 10000 with LRU eviction (`embedding-cache.ts:45-56`, `embedding-cache.ts:72-97`, `embedding-cache.ts:101-148`, `embedding-cache.ts:185-215`).
- Read CocoIndex query embedding usage. `query_codebase()` gets the Coco embedder from CocoIndex context, embeds the live query directly, converts it to float32 bytes, and searches `code_chunks_vec` via KNN or full scan (`query.py:267-323`). No separate query embedding cache or rerank stage appears in this path.
- Read CocoIndex indexing. Code chunks are normalized, hashed, language-tagged, and embedded during file processing, then stored in `code_chunks_vec` with code-specific auxiliary columns (`indexer.py:281-295`, `indexer.py:308-326`).
- Read CocoIndex embedder configuration. The Python side builds either a SentenceTransformers or LiteLLM embedder and tracks model-specific query prompt behavior in its own runtime context (`shared.py:46-76`).
- Read memory-side rerank. Stage 3 gates reranking behind feature flags, candidate floors, and `decideConditionalRerank`, then maps memory rows to generic rerank documents before calling the cross-encoder module (`stage3-rerank.ts:136-174`, `stage3-rerank.ts:317-429`).
- Read the cross-encoder module. It already has provider abstraction for Voyage, Cohere, and local rerankers, provider caps, timeout handling, in-memory result caching, circuit breaker fallback, tail scoring, and score-origin metadata (`cross-encoder.ts:35-60`, `cross-encoder.ts:73-124`, `cross-encoder.ts:252-270`, `cross-encoder.ts:287-327`, `cross-encoder.ts:411-554`).
- Re-read continuity from iterations 001-009. The pattern is consistent: adapt bounded interfaces and feature-flagged sidecars, defer default-on behavior until Phase 005 evaluation, and avoid making CocoIndex, graph, or memory backends depend on each other's readiness.

## Findings

### F-iter010-001 - Shared cache semantics are already portable, but shared cache storage is not yet earned

Verdict: ADAPT_INTERFACE_DEFER_SHARED_STORE. LOC estimate: ~80-140 production LOC for an `EmbeddingCacheClient` interface and memory adapter; ~120-220 more for a cross-runtime Coco adapter. Dependencies: RQ-B1 semantic trigger embeddings, RQ-A1 query expansion if Coco starts caching expanded query embeddings, Phase-005 evaluation for default-on.

Evidence: The memory cache key is already content-addressed and model-scoped with dimensions in the primary key (`embedding-cache.ts:47-55`), which is the right abstract shape. It also exposes operational stats and LRU/age eviction (`embedding-cache.ts:160-166`, `embedding-cache.ts:185-215`). CocoIndex has `content_hash` for chunks (`indexer.py:281-295`) and direct query embedding calls (`query.py:293-296`), so it could consume the same logical interface.

The leak is storage ownership. Memory's cache is embedded in the TypeScript memory database lifecycle; CocoIndex's embeddings are produced in Python/CocoIndex and stored in `.cocoindex_code/target_sqlite.db` as part of the code index. Sharing the table would cross language/runtime boundaries and couple memory retention sweeps to code-index rebuild behavior.

Implication: define an interface first, not a shared table:

```ts
interface EmbeddingCacheClient {
  lookup(input: { modelId: string; contentHash: string; dimensions: number }): Promise<Buffer | null>;
  store(input: { modelId: string; contentHash: string; dimensions: number; embedding: Buffer }): Promise<void>;
  stats(): Promise<{ hits: number; misses: number; hitRate: number }>;
}
```

Memory can adapt `embedding-cache.ts` immediately. CocoIndex should only adopt an adapter if query expansion or example-bank work creates repeat embedding pressure. Persistent cross-backend storage should wait for measured hit-rate overlap.

### F-iter010-002 - Embedding reuse across CocoIndex and memory is likely low because models and text domains differ

Verdict: DEFER_SHARED_PERSISTENT_CACHE. LOC estimate: ~0 now; ~40-70 telemetry LOC if adding a shadow overlap audit. Dependencies: RQ-A1/RQ-A4 for Coco query/example embeddings, RQ-B1 for trigger embeddings.

Evidence: The prompt states CocoIndex uses Voyage Code 3 while memory uses Voyage 4. Even though both are 1024-dimensional, `model_id` must remain a hard cache dimension because same text under different models is not interchangeable. The memory cache's primary key already enforces that (`embedding-cache.ts:47-55`). CocoIndex content is code chunks with language-aware chunking and code path metadata (`indexer.py:271-295`); memory content is spec-doc records, frontmatter, triggers, and causal context. The shared key would prevent incorrect reuse, but it also means most rows will not hit across systems.

Implication: do not sell shared embedding cache as a meaningful quota saver yet. The near-term value is instrumentation and interface consistency. Add optional shadow telemetry such as `crossBackendEmbCacheCandidate`, `sameContentHashDifferentModel`, and `sameModelSameHashHit` before moving storage.

### F-iter010-003 - Rerank is the better shared client because the current memory module is already provider-generic

Verdict: ADAPT_SHARED_RERANK_CLIENT. LOC estimate: ~140-240 production LOC plus ~80-140 tests. Dependencies: existing memory `cross-encoder.ts`; optional RQ-A5 fusion if Coco graph fusion later reranks code candidates.

Evidence: `cross-encoder.ts` already defines a generic document shape, provider configs for Voyage/Cohere/local, provider detection, result cache keys based on provider/query/document fingerprints, max-document caps, circuit breaker fallback, and score-origin metadata (`cross-encoder.ts:35-60`, `cross-encoder.ts:73-124`, `cross-encoder.ts:220-230`, `cross-encoder.ts:252-270`, `cross-encoder.ts:468-554`). Stage 3 consumes it through a narrow adapter: memory rows are converted to `{id, content, score}` and remapped back after reranking (`stage3-rerank.ts:410-465`).

That is almost the right boundary for CocoIndex too. CocoIndex would need its own candidate adapter from `QueryResult` to rerank document and back to `QueryResult`, with score-origin and `rankingSignals` preserved. It should not import memory pipeline stages, MPAB reassembly, MMR over `vec_memories`, or memory-specific gate scope.

Implication: extract or mirror the provider-generic layer as `RerankClient`:

```ts
interface RerankClient<T> {
  rerank(input: {
    query: string;
    candidates: T[];
    toDocument(candidate: T): { id: string | number; content: string; score?: number };
    limit: number;
    scope?: { tenantId?: string; userId?: string; agentId?: string };
  }): Promise<{ results: T[]; applied: boolean; provider: string; signals: unknown }>;
}
```

This supports memory and CocoIndex without sharing indexers. The first implementation should be default-off for CocoIndex and reuse the existing memory provider behavior rather than adding a second Voyage rerank caller.

### F-iter010-004 - The abstraction boundary must stop before indexing, chunking, and domain-specific post-processing

Verdict: SKIP_SHARED_INDEXING_PIPELINE. LOC estimate: ~0; document the boundary in the future phase. Dependencies: none.

Evidence: CocoIndex's indexer owns file discovery, gitignore/canonical resource matching, language detection, lang-aware chunking, source realpath, line ranges, and `code_chunks_vec` schema (`indexer.py:271-326`). Memory Stage 3 owns retrieval-specific rerank gating, MMR over `vec_memories`, and MPAB chunk collapse/reassembly (`stage3-rerank.ts:176-295`). These are not generic embedding or rerank concerns.

Implication: the shared surface is client-level only. Do not attempt a common "retrieval engine" or common vec0 schema. The shared code should know about `EmbeddingCacheClient` and `RerankClient`; it should not know about code chunks, AST/language labels, memory tiers, frontmatter anchors, causal graph edges, or MPAB parent rows.

### F-iter010-005 - Default-off extraction fits the pt-03 pattern better than a broad cross-system packet

Verdict: ADAPT_WITH_SHADOW_FIRST. LOC estimate: ~220-380 production LOC plus ~120-220 tests for both clients and adapters; persistent shared storage is a later add-on. Dependencies: Phase-005 evaluation; RQ-B1/B2 for memory consumers; RQ-A1/A3/A4/A5 for Coco consumers.

Evidence: Iterations 001-009 repeatedly avoid default-on coupling: A1 adapts query expansion behind caps, A2 defers HLD rerank until Phase 001 ships, A3 uses clamped reducers, A4 returns separate exemplars, A5 defers graph fusion, B1 keeps lexical triggers primary, B2 defers active LLM curation, B3 uses a deferred reducer, and B4 shadows retention before live mutation.

Implication: make this a small shared-infra phase only if it can be consumed by at least one concrete follow-on immediately. Otherwise, fold the RerankClient extraction into the first Coco rerank phase and leave embedding-cache sharing as telemetry-only.

## Questions Answered

- Should CocoIndex and memory share embedding cache storage? Not yet. ADAPT the interface, DEFER shared persistent storage until telemetry shows cross-backend reuse.
- Should they share rerank infra? Yes, ADAPT a shared `RerankClient` or provider module. Memory already has most of it in `cross-encoder.ts`; CocoIndex should consume it through a candidate adapter, not copy a second Voyage rerank path.
- Does the same 1024-dimensional embedding size make caches interchangeable? No. Model identity remains part of the key; Voyage Code 3 and Voyage 4 embeddings must not be reused across each other.
- What leaks abstractions? Shared indexers, shared vec0 schemas, memory MPAB/MMR stages, code language chunking, path-class semantics, memory tiers, and causal graph metadata.
- LOC estimate? Approximately ~220-380 production LOC plus ~120-220 tests for client interfaces, adapters, flags, telemetry, and focused adapter tests. A shared persistent embedding table would add more migration and lifecycle work and should be deferred.
- Verdict? ADAPT shared clients default-off; DEFER shared persistent embedding cache; SKIP shared indexing pipeline.

## Synthesis Notes

### Verdict Matrix

| RQ | Verdict | LOC estimate | Dependencies |
| --- | --- | --- | --- |
| RQ-A1 Coco intent steering + query expansion | ADAPT | ~220-320 prod + focused tests | Phase-004 advisor wording optional; Phase-005 for default-on |
| RQ-A2 Coco HLD/LLD rerank | ADAPT design, DEFER implementation | ~150-240 prod + tests | Hard Phase-001; Phase-005 for default-on |
| RQ-A3 ccc_feedback active rerank loop | ADAPT | ~250-370 prod + ~90-150 tests | RQ-A1 for intent tags; Phase-005 for promotion |
| RQ-A4 few-shot example bank | ADAPT design, DEFER default-on | ~320-500 prod + ~120-180 tests | RQ-A3 signal quality; optional RQ-A1; Phase-005 |
| RQ-A5 coco + graph fused rerank | ADAPT design, DEFER active rerank | ~180-300 prod + ~80-140 tests | Hard Phase-001/002/003; Phase-005 |
| RQ-B1 semantic trigger matching | ADAPT | ~280-430 prod + ~180-280 tests | Existing Voyage/cache; memory indexing/backfill; Phase-005 for threshold promotion |
| RQ-B2 LLM-curated memory_context | ADAPT shadow, DEFER active | ~290-485 prod + ~220-390 tests | Shipped 4-stage pipeline; Phase-005 eval; optional RQ-B1 |
| RQ-B3 session-trace causal edges | ADOPT signal source, ADAPT reducer | ~170-265 prod + ~165-275 tests | Feedback ledger; causal edge caps; auto provenance fix |
| RQ-B4 learned retention/decay | ADAPT, DEFER live mutation | ~215-385 prod + ~225-385 tests | Feedback ledger; memory retention sweep; importance tiers; causal-edge endpoint joins |
| RQ-B5 shared cache + rerank infra | ADAPT clients, DEFER shared cache store, SKIP shared indexers | ~220-380 prod + ~120-220 tests | RQ-A/B consumers; Phase-005; existing cross-encoder |

Verdict diversity target is met: ADOPT appears as an RQ-B3 signal-source decision; ADAPT dominates bounded designs; DEFER is explicit for default-on/fusion/shared storage; SKIP is explicit for closed XCE internals and shared indexing pipelines.

### Suggested Phase 006+ Scaffolds

1. `006-coco-intent-steering` - L2, ~250-350 LOC, ADAPT. Depends on RQ-A1. Build rule-based intent classifier, bounded query expansion, path-class priors, caps, and telemetry.
2. `007-semantic-trigger-fallback` - L2/L3, ~350-520 LOC, ADAPT. Depends on RQ-B1. Add semantic trigger fallback, trigger embedding backfill, lexical precedence, threshold telemetry, and shadow mode.
3. `008-learning-feedback-reducers` - L3, ~400-650 LOC, ADAPT. Combines RQ-A3, RQ-B3, and RQ-B4 at the aggregation layer only. Keep rerank weights, causal-edge inference, and retention decisions as separate reducers after shared feedback aggregation.
4. `009-retrieval-rerank-clients` - L2, ~250-420 LOC, ADAPT. Depends on RQ-B5 and existing `cross-encoder.ts`. Extract `RerankClient`, add candidate adapters, flags, cache telemetry, and a CocoIndex shadow rerank adapter.
5. `010-coco-memory-context-extras` - L3, ~500-800 LOC, ADAPT/DEFER split. Covers RQ-A4 exemplars and RQ-B2 curator shadow mode as separate presentation layers, not ranking authorities.

Hold RQ-A2/A5 active fusion until existing phases 001-003 ship. The only useful pre-work is interface/type documentation and shadow telemetry.

### Cross-Cutting Recommendations

- RQ-A5 and RQ-B5 should not become one unified "all retrieval fusion" packet. They share design philosophy, not implementation shape.
- RQ-B5 shared `RerankClient` can support future RQ-A5 fusion, but A5 still depends on graph feature providers from Phases 001-003.
- Shared embedding storage should be deferred. Add overlap telemetry first; a shared table is only justified if same-model same-content cache hits appear across systems.
- Shared feedback aggregation is more valuable than shared embedding cache. RQ-A3, RQ-B3, and RQ-B4 all need strong/weak signal classification, session grouping, and shadow audit trails.
- Keep all cross-system features default-off or shadow-first until Phase-005 evaluates task success, precision, latency, quota, and failure-mode clarity.

### Known Gaps / Pt-04 Candidates

- No direct measurement yet for CocoIndex query embedding repetition, memory trigger embedding hit rate, or cross-backend same-content overlap.
- No held-out Phase-005 task suite yet to compare query expansion, semantic triggers, rerank clients, exemplars, and LLM curation.
- No final contract for where shared TypeScript infrastructure should live if Python CocoIndex consumes it. Options include a local HTTP/CLI bridge, generated schema contract, or a duplicated Python adapter around the same provider API.
- No decision yet on whether CocoIndex rerank should run inside raw `query_codebase()`, the system-spec-kit code graph seed path, or only as an opt-in MCP wrapper.
- No privacy policy yet for example-bank records, feedback reducer retention windows, and cross-system telemetry retention beyond local/default-off assumptions.

## Next Focus

None. Iteration 010 completes RQ-B5 and prepares pt-03 for synthesis.
