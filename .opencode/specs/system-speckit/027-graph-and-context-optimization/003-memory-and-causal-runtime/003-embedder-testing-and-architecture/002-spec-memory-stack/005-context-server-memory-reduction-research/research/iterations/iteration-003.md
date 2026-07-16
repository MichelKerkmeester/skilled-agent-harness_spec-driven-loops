# Iteration 3 — embedding cache eviction policies (LRU caps, TTL, size-bounded, per-model partition)

## Summary

The 246 MB post-POST-006 baseline is not dominated by the tiny in-process embedding LRU; it is more exposed to the SQLite-backed `embedding_cache`, which is count-bounded, globally shared across model profiles, and not actively TTL-maintained. The best cache-policy win is to make the persistent cache byte-bounded and profile-partitioned, then pair eviction with SQLite memory release; the in-process cache should be fixed for profile correctness and hot-reload hygiene, but it is a single-digit-MB lever.

## Findings

### Finding 1: Persistent `embedding_cache` is count-bounded, not byte-bounded or profile-partitioned
- Evidence: `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:101-105` hard-codes `MAX_CACHE_ENTRIES = 10000`; `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:130-148` evicts by total row count before `INSERT OR REPLACE`; `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:47-55` stores `(content_hash, model_id, dimensions)` as the key but the cap is global, not per `(model_id, dimensions)`.
- Memory impact: current live Ollama/Jina DB snapshot: `embedding_cache` had 2,809 rows, 11,505,664 raw vector bytes, ~12,951,552 table bytes, and ~303,104 index bytes. The old capped llama-cpp DB had 10,000 rows, 30,720,000 raw vector bytes, ~41,058,304 table bytes, and ~1,331,200 index bytes. At 1024 dims, 10,000 entries are ~39.1 MiB raw; at Voyage 2048 dims, the same count can reach ~78.1 MiB raw before SQLite page overhead. On a 246 MB RSS process, the active cache table is already roughly a 5% hot-DB surface, and a full 1024/2048 cache can plausibly add 20-70 MB of cache/mmap pressure.
- Proposed change: in `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts`, replace `MAX_CACHE_ENTRIES` with env-backed policy:
  - `SPECKIT_EMBED_CACHE_MAX_BYTES`, default `16777216` (16 MiB global raw embedding budget).
  - `SPECKIT_EMBED_CACHE_MAX_ENTRIES`, default `4096`.
  - `SPECKIT_EMBED_CACHE_PROFILE_MAX_BYTES`, default `8388608` (8 MiB per `model_id + dimensions`).
  - `SPECKIT_EMBED_CACHE_PROFILE_MAX_ENTRIES`, default `2048`.
  After `INSERT OR REPLACE`, run `enforceEmbeddingCacheBudget(db, modelId, dimensions)` using a CTE/window query:
  ```sql
  WITH ranked AS (
    SELECT rowid,
           SUM(LENGTH(embedding)) OVER (
             PARTITION BY model_id, dimensions
             ORDER BY last_used_at DESC, rowid DESC
           ) AS profile_bytes,
           ROW_NUMBER() OVER (
             PARTITION BY model_id, dimensions
             ORDER BY last_used_at DESC, rowid DESC
           ) AS profile_rank
    FROM embedding_cache
    WHERE model_id = ? AND dimensions = ?
  )
  DELETE FROM embedding_cache
  WHERE rowid IN (
    SELECT rowid FROM ranked
    WHERE profile_bytes > ? OR profile_rank > ?
  );
  ```
  Then enforce the global budget with the same pattern without `PARTITION BY`. Add `CREATE INDEX IF NOT EXISTS idx_embedding_cache_lru ON embedding_cache(model_id, dimensions, last_used_at DESC)` and `CREATE INDEX IF NOT EXISTS idx_embedding_cache_global_lru ON embedding_cache(last_used_at DESC)` in `initEmbeddingCache()` / `ensureEmbeddingCacheSchema()`.
- Trade-off: older cache hits will be recomputed more often, especially after model comparisons. That is a latency/API-cost trade, not a feature reduction; vector search, continuity save, hot reload, and model pluggability stay intact.
- Effort: M

### Finding 2: TTL eviction exists but is not wired into production paths
- Evidence: `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:153-167` defines `evictOldEntries(db, maxAgeDays)`, but `rg evictOldEntries` shows production imports are absent; hits are tests plus the export. Cache users in `.opencode/skills/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:132-155`, `.opencode/skills/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:272-286`, and `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:608-650` only do lookup/store.
- Memory impact: TTL will not reduce the live active DB today because the sampled Jina rows were all fresh (`2026-05-18 19:33:35` to `19:49:35`), but it prevents stale model-testing caches from becoming permanent hot-DB baggage. A full stale 1024-dim partition is ~40 MB table/index footprint; a stale 2048-dim partition can be roughly double that.
- Proposed change: add `runEmbeddingCacheMaintenance(db, reason)` in `embedding-cache.ts` and call it from `storeEmbedding()` every N writes and once after `ensureEmbeddingCacheSchema()` in `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2350-2352` / `2480-2481`. Defaults:
  - `SPECKIT_EMBED_CACHE_TTL_DAYS=30`.
  - `SPECKIT_EMBED_CACHE_MAINTENANCE_EVERY_WRITES=100`.
  - `SPECKIT_EMBED_CACHE_TTL_DAYS=0` disables age eviction.
  Keep TTL based on `last_used_at`, not `created_at`, so frequently reused embeddings survive.
- Trade-off: first use after TTL expiry pays a provider call or Ollama request. For local Ollama this is mostly latency; for Voyage it can be API cost, so the TTL needs an obvious env override.
- Effort: S

### Finding 3: DB cache eviction needs SQLite memory release, not just DELETE
- Evidence: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:800-806` opens the memory DB with WAL, `cache_size = -64000`, `mmap_size = 268435456`, and `temp_store = MEMORY`; it does not set `auto_vacuum`. A read-only live probe returned `PRAGMA auto_vacuum = 0` for the active Ollama DB. Deleting rows will move pages to the freelist, but it will not shrink the DB file without VACUUM, and it may not immediately return page-cache memory without a connection-level shrink.
- Memory impact: cache-row deletion can reduce future hot-set pressure, but RSS may not drop by the raw deleted-vector size unless SQLite releases cached pages. This matters at the current 246 MB baseline because the active DB page/cache/mmap policy is now one of the main remaining resident contributors.
- Proposed change: have `runEmbeddingCacheMaintenance()` return `{ rowsDeleted, bytesDeleted }`; when either is non-zero, call `db.pragma('shrink_memory')` after the DELETE transaction. Do not run `VACUUM` inline on normal tool calls. Instead, surface a maintenance metric/hint when `freelist_count * page_size` exceeds a threshold such as 64 MiB, and make offline compaction an explicit maintenance action.
- Trade-off: `PRAGMA shrink_memory` can make the next query colder. Avoiding inline `VACUUM` keeps writes responsive and avoids surprising startup stalls.
- Effort: S

### Finding 4: The in-process embedding LRU is small, but its key is only provider-scoped
- Evidence: `.opencode/skills/system-spec-kit/shared/embeddings.ts:106-107` defines a process-wide `Map<string, Float32Array>` capped at 1,000 entries; `.opencode/skills/system-spec-kit/shared/embeddings.ts:305-308` keys by `providerName:text`; `.opencode/skills/system-spec-kit/shared/embeddings.ts:323-331` evicts one oldest entry by insertion order. Provider metadata already exposes model/dim/profile data in `.opencode/skills/system-spec-kit/shared/types.ts:68-77`, `.opencode/skills/system-spec-kit/shared/embeddings/providers/ollama.ts:415-433`, `.opencode/skills/system-spec-kit/shared/embeddings/providers/voyage.ts:324-343`, and `.opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts:406-424`.
- Memory impact: raw vector storage is low: 1,000 entries at 768 dims is ~2.9 MiB, 1024 dims is ~3.9 MiB, and 2048 dims is ~7.8 MiB before V8 `Map`/typed-array overhead. This cannot explain 246 MB RSS, but stale cross-model hits can corrupt search semantics after an embedder swap, and profile-local caps prevent a high-query run from evicting all document cache entries for another profile.
- Proposed change: in `.opencode/skills/system-spec-kit/shared/embeddings.ts`, replace `Map<string, Float32Array>` with:
  ```ts
  interface EmbeddingCacheEntry {
    embedding: Float32Array;
    profileKey: string;
    kind: 'document' | 'query' | 'generic';
    bytes: number;
    lastUsedAt: number;
  }
  ```
  Build `profileKey` from `provider`, `model`, `dim`, `dtype`, and `baseUrl` via `providerInstance.getProfile()` when initialized, else `getStartupEmbeddingProfile()`. Use env-backed caps: `SPECKIT_INPROC_EMBED_CACHE_MAX_BYTES=8388608`, `SPECKIT_INPROC_EMBED_CACHE_PROFILE_MAX_BYTES=4194304`, and keep `SPECKIT_INPROC_EMBED_CACHE_MAX_ENTRIES=1000` as a secondary guard. Preserve the current query rule at `.opencode/skills/system-spec-kit/shared/embeddings.ts:718-720`, but express it as a query partition cap, for example 25% of profile bytes.
- Trade-off: slightly more bookkeeping on every cache access and less cache reuse across model swaps. That is correct: embeddings from different models or dimensions should not be shared.
- Effort: M

### Finding 5: Hot-reload/DB reinit clears tool and trigger caches, but not embedding caches
- Evidence: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:828-843` clears `toolCache` and `triggerMatcher` after `checkDatabaseUpdated()` reports a reinit at `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:904-906`; `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:81` already imports the embedding module as `_embeddings`, but `clearEmbeddingCache()` is not called.
- Memory impact: bounded by the in-process cache cap: currently single-digit MB raw, maybe ~10-15 MB with V8 overhead at higher dims. The larger benefit is correctness and predictable measurement after provider/DB path changes.
- Proposed change: in `invalidateReinitializedDbCaches()`, call `_embeddings.clearEmbeddingCache()` and log the pre-clear stats from `_embeddings.getEmbeddingCacheStats()`. Also clear the in-process cache when `getProvider()` observes a profile key change, so hot provider swaps do not retain stale profile-local entries.
- Trade-off: the first embedding after DB rebind/provider swap is cold. Rebinds and swaps are already correctness boundaries, so this is acceptable.
- Effort: S

### Finding 6: Ollama pre-init model naming can create a wrong cache partition
- Evidence: `.opencode/skills/system-spec-kit/shared/embeddings.ts:764-781` handles Voyage, OpenAI, llama-cpp, and hf-local in `detectConfiguredModelName()`, but not Ollama. The factory does know the Ollama model at `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:253-269` and surfaces it in provider info at `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:758-769`. A live active DB sample had one `embedding_cache` row under `onnx-community/embeddinggemma-300m-ONNX` with `dimensions=1024` inside the Ollama/Jina database, while the rest were `jina-embeddings-v3`.
- Memory impact: currently negligible (one 4 KiB vector row), but it undermines per-model partitioning and can make eviction stats misleading during provider startup. If the provider is cold and many async saves compute model IDs before provider init, wrong partitions can grow until global eviction catches them.
- Proposed change: add an `ollama` case to `detectConfiguredModelName()` returning `providerInfo.config.OLLAMA_EMBEDDINGS_MODEL || 'jina-embeddings-v3'`, or better, derive both `getModelName()` and `getEmbeddingDimension()` from `getStartupEmbeddingProfile()` when no provider instance exists. In `.opencode/skills/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:128-130`, compute `modelId` from a canonical profile helper rather than a provider-loaded-state-dependent branch.
- Trade-off: minor shared API cleanup and test updates. The upside is that cache eviction policies operate on the real model profile from the first write.
- Effort: S

## Cross-references

This builds on Iteration 1 Finding 6: the in-memory embedding LRU is not the main RSS root, but DB-backed vector/cache tables create SQLite hot-set pressure. It also builds on Iteration 1 Finding 2 and Iteration 2 Finding 1: once the model moved out of process via Ollama, SQLite page cache/mmap and hot DB contents became proportionally more important. It does not contradict Iteration 2 Finding 4; provider lazy loading remains mostly correct, while this pass narrows the cache-policy work after the provider is active or after persistent cache rows accumulate.

## Negative knowledge (ruled-out)

- Shrinking `EMBEDDING_CACHE_MAX_SIZE` alone is not a meaningful 246 MB RSS fix. The shared in-process cache is at most single-digit MB raw for the relevant 768/1024/2048 dimensions, and the active non-default embedder search path uses `OllamaAdapter` in `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:636-652`, bypassing `shared/embeddings.ts` query caching.
- TTL eviction alone will not reduce the current active Jina cache immediately; sampled rows were fresh. TTL is a prevention policy for stale model-test partitions, not the primary immediate drop.
- Deleting persistent cache rows without `shrink_memory` or offline compaction may not visibly reduce RSS or file size. With `auto_vacuum=0`, row deletion creates freelist pages; it does not automatically shrink the DB file.
- Restricting supported embedding models is unnecessary. Byte/profile caps scale by `dimensions` and `model_id`, so Voyage, llama-cpp, Ollama, BGE, mxbai, and future adapters remain pluggable.

## Open questions

- What persistent-cache hit rate do we actually need for `memory_save`, retry, and chunking? Add per-model hit/miss/eviction counters before choosing final byte defaults.
- Should active embedder reindex jobs also populate `embedding_cache`, or should that cache stay tied only to save/retry/chunking paths?
- Should cache maintenance live in `embedding-cache.ts` only, or should `memory_health` expose a safe manual maintenance command that reports rows/bytes deleted plus `freelist_count`?
- After eviction plus `PRAGMA shrink_memory`, what is the measured RSS delta on PID 4791 under the active Ollama/Jina baseline?
