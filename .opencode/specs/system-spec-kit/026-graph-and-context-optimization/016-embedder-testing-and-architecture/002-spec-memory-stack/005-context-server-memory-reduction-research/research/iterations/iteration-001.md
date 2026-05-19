# Iteration 1 — root memory consumers (RSS attribution: SQLite WAL, llama-cpp model weights, embedding caches, vector store, code-graph mirror, JS heap)

## Summary

The observed ~1080 MB RSS is most plausibly a stack-up of native llama-cpp model/runtime state plus SQLite page cache/mmap over a 716 MB hot DB, not the small TypeScript embedding LRU. The first high-confidence reductions are to make llama-cpp unloadable after idle, lower SQLite cache/mmap budgets, and remove hidden JS heap retention in trigger/tool caches while preserving continuity save, vector search, code-graph bridge, hot-reload, and embedder pluggability.

## Findings

### Finding 1: llama-cpp keeps native model/runtime resident after first embedding
- Evidence: `shared/embeddings/providers/llama-cpp.ts:65-79` defines module-level `cachedRuntime`; `shared/embeddings/providers/llama-cpp.ts:206-249` loads `node-llama-cpp`, the GGUF model, and an embedding context, then stores the runtime forever; `shared/embeddings/providers/llama-cpp.ts:356-373` uses that runtime for every embedding; `shared/embeddings/providers/llama-cpp.ts:443-449` only clears it in the test reset path.
- Memory impact: the active default Q8 model file is ~313 MiB (`embeddinggemma-300M-Q8_0.gguf`, 320,880 KiB on disk). Native runtime/context overhead likely puts the steady contribution around 330-450 MiB, or roughly 31-42% of the observed ~1080 MB RSS. If a user swaps to BF16 or F32 GGUF, the same code path can pin ~584 MiB or ~1.13 GiB of model weights before overhead.
- Proposed change: in `shared/embeddings/providers/llama-cpp.ts`, replace the bare `cachedRuntime` lifetime with a ref-counted runtime wrapper. Add `activeInferenceCount`, `lastUsedAt`, and `LLAMA_CPP_EMBEDDINGS_IDLE_UNLOAD_MS`/`SPECKIT_EMBEDDER_IDLE_UNLOAD_MS` with a default around 600000 ms. Route `generateEmbedding()` through `withRuntime(async runtime => ...)`, cancel the idle timer while in use, and after idle call `runtime.context.dispose?.()` plus the supported `node-llama-cpp` model/runtime dispose method before setting `cachedRuntime = null`, `runtimePromise = null`, and `runtimePromisePath = null`. Keep provider metadata/profile intact so Voyage, Ollama, llama-cpp, and future BGE/mxbai choices remain pluggable.
- Trade-off: first embedding after idle pays model reload latency and may re-fault the GGUF into memory. Debugging also gets one more lifecycle state: provider created but local model unloaded.
- Effort: M

### Finding 2: SQLite pragmas allow a large resident page/mmap footprint per open memory DB
- Evidence: `mcp_server/lib/search/vector-index-store.ts:376-380` has a singleton DB plus a `db_connections` map keyed by path; `mcp_server/lib/search/vector-index-store.ts:800-806` hard-codes `journal_mode = WAL`, `cache_size = -64000`, `mmap_size = 268435456`, and `temp_store = MEMORY`. Active DB measurement: `context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite` is 716 MiB; WAL is 4.7 MiB; `PRAGMA page_size` is 4096; `page_count` is 183,308; `freelist_count` is 14,952 (~58 MiB free pages).
- Memory impact: `cache_size = -64000` is a 64,000 KiB (~62.5 MiB) SQLite page-cache target per connection, while `mmap_size = 268435456` allows up to 256 MiB of mapped DB pages. WAL itself is not the problem at 4.7 MiB; the potential resident SQLite budget is page cache + mapped hot pages + temp memory, easily 100-300 MiB under a vector/search-heavy workload.
- Proposed change: in `mcp_server/lib/search/vector-index-store.ts:800-806`, replace hard-coded pragmas with bounded env-backed defaults:
  - `SPECKIT_SQLITE_CACHE_KIB`, default `16384`, applied as `cache_size = -16384` (~16 MiB, saving ~46.5 MiB of page-cache target per connection).
  - `SPECKIT_SQLITE_MMAP_BYTES`, default `67108864` (~64 MiB, lowering potential mapped hot-set by 192 MiB).
  - `SPECKIT_SQLITE_TEMP_STORE`, default `DEFAULT` or `FILE` for MCP steady state, with `MEMORY` retained only when explicitly requested for benchmark runs.
  Also log the effective `cache_size`, `mmap_size`, `page_count`, and `freelist_count` once at startup so the RSS delta is measurable against the current ~1080 MB baseline.
- Trade-off: repeated large scans, checkpoint restores, and vector joins may get a little colder because fewer pages stay cached. This preserves features; it only changes memory/performance policy.
- Effort: S

### Finding 3: cold checkpoint blobs and lineage tables live in the hot memory DB
- Evidence: `mcp_server/lib/storage/checkpoints.ts:1515-1576` snapshots memory/vector state and gzip-compresses it; `mcp_server/lib/storage/checkpoints.ts:1590-1602` writes the compressed snapshot into `checkpoints.memory_snapshot`; `mcp_server/lib/storage/checkpoints.ts:1710-1717` fetches checkpoint rows with `SELECT *`; `mcp_server/lib/storage/checkpoints.ts:1756-1760` gunzips and parses the whole snapshot during restore. `dbstat` attribution on the active DB shows `checkpoints` at ~137.0 MB, `memory_lineage` at ~99.1 MB, `memory_index` at ~73.9 MB, and one checkpoint blob at ~129.8 MB compressed.
- Memory impact: checkpoint blobs are mostly cold, but they enlarge the same DB file that SQLite can mmap and cache for hot search traffic. Restore is worse: it can transiently hold the compressed 129.8 MB blob, the decompressed JSON buffer/string, and parsed objects at the same time.
- Proposed change: in `mcp_server/lib/storage/checkpoints.ts:1575-1602`, write large checkpoint payloads to a sidecar blob file or a separate `checkpoints.sqlite` opened with a tiny cache/mmap budget, while keeping a metadata row in the main DB with `snapshot_uri`, `snapshot_size`, hash, and backward-compatible `memory_snapshot` support for old rows. In `getCheckpoint()`/`restoreCheckpoint()`, load the sidecar only for restore, and prefer streaming `zlib.createGunzip()` plus incremental validation for payloads over a configured threshold.
- Trade-off: more migration and cleanup logic. The payoff is that checkpoint safety remains intact while cold rollback data stops inflating the hot search DB.
- Effort: L

### Finding 4: trigger matcher retains tens of thousands of RegExp objects despite an LRU
- Evidence: `mcp_server/lib/parsing/trigger-matcher.ts:23-33` stores `regex: RegExp` on every `TriggerCacheEntry`; `mcp_server/lib/parsing/trigger-matcher.ts:132-140` sets `MAX_REGEX_CACHE_SIZE` to 100; `mcp_server/lib/parsing/trigger-matcher.ts:171-179` defines both the trigger cache and regex LRU; `mcp_server/lib/parsing/trigger-matcher.ts:532-535` materializes a regex for every trigger phrase; `mcp_server/lib/parsing/trigger-matcher.ts:777-779` reads `entry.regex` during matching. DB measurement found 8,945 memories with trigger JSON and ~50,463 trigger phrases.
- Memory impact: the regex LRU does not bound RSS because each trigger entry keeps its own `RegExp` reference. Back-of-envelope: 50k RegExp objects plus entries/index sets can plausibly hold 20-80 MB of JS heap, depending V8's compiled regex representation and phrase length.
- Proposed change: in `mcp_server/lib/parsing/trigger-matcher.ts`, remove `regex` from `TriggerCacheEntry`, stop calling `getCachedRegex()` at entry creation, and change the match loop to `matchPhraseWithBoundary(promptNormalized, entry.phrase, getCachedRegex(entry.phrase))` after candidate filtering. If query-time compilation shows up in profiling, raise the true LRU to an env-backed 512/1024 entries; do not retain one regex per trigger phrase.
- Trade-off: a cold candidate phrase may compile a regex at query time. The candidate index already narrows the set, so this trades a small first-match CPU cost for a bounded heap.
- Effort: M

### Finding 5: memory_search tool cache is count-bounded, not byte-bounded
- Evidence: `mcp_server/lib/cache/tool-cache.ts:56-69` defaults to 1,000 entries and stores arbitrary values in a module-level `Map`; `mcp_server/lib/cache/tool-cache.ts:169-180` evicts only by count; `mcp_server/handlers/memory-search.ts:407-427` extracts `summary`, `data`, and `hints` from the full response envelope; `mcp_server/handlers/memory-search.ts:900-938` includes `includeContent` in the cache key; `mcp_server/handlers/memory-search.ts:1313-1315` caches the extracted payload.
- Memory impact: highly workload-dependent. Small summary-only result payloads are fine, but 1,000 cached `includeContent=true` payloads can retain many MB, and the current code has no byte ceiling or oversized-entry rejection.
- Proposed change: in `mcp_server/lib/cache/tool-cache.ts`, add `TOOL_CACHE_MAX_BYTES` defaulting to 16 MiB and `TOOL_CACHE_MAX_ENTRY_BYTES` defaulting to 1 MiB. Track `approxBytes = Buffer.byteLength(JSON.stringify(value), 'utf8')` on insert and evict oldest entries until under budget. In `memory-search.ts:1313-1315`, skip caching when `includeContent` is true unless a new `TOOL_CACHE_CACHE_CONTENT_RESPONSES=true` override is set.
- Trade-off: repeated content-heavy searches will recompute more often. Feature behavior stays the same; only cache-hit rate changes for large responses.
- Effort: S

### Finding 6: embedding/vector caches are not the main JS heap root, but inactive vector tables add hot-DB pressure
- Evidence: `shared/embeddings.ts:106-107` caps the in-memory embedding cache at 1,000 `Float32Array` values; `shared/embeddings.ts:323-331` uses LRU eviction; `shared/embeddings.ts:469-500` caches document embeddings; `shared/embeddings.ts:718-720` only caches query embeddings when the cache is under 90% full. `mcp_server/lib/search/vector-index-queries.ts:81-99` chooses the active vector table by embedder dimension, and `mcp_server/lib/search/vector-index-queries.ts:217-326` performs vector search in SQLite rather than loading a JS vector mirror. DB attribution: `embedding_cache` is ~41.1 MB on disk with 10,000 rows / 30.7 MB raw vectors; `vec_768` is ~54.1 MB; `vec_1024` is ~60.8 MB; `vec_memories_vector_chunks00` is ~53.6 MB.
- Memory impact: the TypeScript embedding LRU is only ~3.1 MB at 768 dims or ~4.1 MB at 1024 dims before Map overhead. The material cost is SQLite hot-set pressure from on-disk vector/cache tables, especially when multiple dimensions live in one DB profile.
- Proposed change: do not prioritize shrinking `EMBEDDING_CACHE_MAX_SIZE`; it cannot explain a 1 GB process. Instead, split per-embedder vector/cache tables into profile-specific attached DBs opened only for the active embedder: keep `memory_index` and continuity metadata in the canonical DB, move `vec_<dim>` and `embedding_cache` rows to `vectors/<profile>.sqlite`, and update `activeVectorSource()` to return `attached_profile.vec_<dim>` after attaching the active profile DB. Preserve hot swap by attaching the target profile on switch rather than deleting inactive vectors.
- Trade-off: larger migration and transaction-boundary work. The benefit is that inactive BGE/mxbai/llama vector stores remain available without all sharing the same hot mmap/cache surface.
- Effort: L

## Cross-references

No prior iteration files exist. This iteration establishes the root-consumer baseline for later passes: native embedder lifecycle, SQLite memory policy, cold-table placement, and JS heap retention points.

## Negative knowledge (ruled-out)

- The code-graph mirror is not a steady-state in-process mirror inside `context-server`. `mcp_server/lib/code-graph-boundary.ts:1-5` describes a process boundary; `mcp_server/lib/code-graph-boundary.ts:272-305` creates a short-lived MCP client/transport and closes it in `finally`. If lockstep code-graph daemons contribute to the user's total machine RSS, that is a separate PID attribution problem, not context-server heap to prune.
- WAL is not the observed gigabyte root. The active WAL was ~4.7 MiB and `-shm` was 32 KiB after a passive checkpoint; WAL should stay enabled for concurrency.
- The shared in-memory embedding LRU is not the main culprit. At 1,000 cached vectors it is single-digit MB raw, even at 1024 dimensions.
- There is no full JS vector-store mirror in the search path investigated here. `vector_search()` joins SQLite/sqlite-vec tables and returns result rows, so vector memory pressure is mostly SQLite native cache/mmap, not a large TypeScript array.
- CocoIndex semantic search was attempted for this investigation but the daemon could not be reached from the sandbox: `Operation not permitted: '/Users/michelkerkmeester/.cocoindex_code/daemon.spawn-lock'`. Direct `rg`, source reads, and SQLite inspection were used instead.
- Live `ps` RSS re-measurement was blocked by sandbox permissions, so the iteration uses the user-observed ~1080 MB RSS plus local DB/model size attribution. The next measurement pass should run outside this sandbox or through the launcher telemetry.

## Open questions

- Does the installed `node-llama-cpp` version expose a model-level dispose/free method that reliably returns RSS on macOS, or does only context disposal work? This needs an RSS-before/after probe.
- How many DB connections can be alive in real usage through `db_connections`, migrations, shadow eval, and custom paths? The SQLite cache/mmap saving is per open connection.
- What is the actual V8 heap profile of `triggerCache` after startup: retained size by `TriggerCacheEntry`, `RegExp`, and `Set<number>`?
- Can checkpoint sidecar storage be introduced with a compatibility reader and one-time migration, or should old BLOB rows be lazily externalized during checkpoint pruning?
- Should the launcher expose per-daemon RSS and model-loaded state so context-server, skill-advisor, and code-graph memory are attributed separately?
