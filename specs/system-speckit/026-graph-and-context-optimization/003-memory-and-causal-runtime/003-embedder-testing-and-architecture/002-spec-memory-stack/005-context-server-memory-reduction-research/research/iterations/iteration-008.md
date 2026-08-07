# Iteration 8 — JS heap profiling (V8 heap snapshots, retained sizes, leak detection, GC tuning via --max-old-space-size)

## Summary

The main V8-heap suspect at the new 246 MB baseline is not an embedder model; it is the in-memory BM25 index. A read-only rebuild probe on the active Ollama/Jina store pushed a fresh Node process from 3 MB heapUsed to 119 MB heapUsed, while a packed term-id representation reduced the same corpus to about 12 MB heapUsed plus 6 MB arrayBuffers. Before tuning `--max-old-space-size`, the server needs first-class heap snapshots and heap stats because current health logs report RSS only, which blends V8 heap, better-sqlite3 native state, SQLite mmap/cache, and external embedder processes.

## Findings

### Finding 1: The server lacks V8 heap attribution, so RSS regressions are currently ambiguous
- Evidence: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1895` logs only `process.memoryUsage().rss`; `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:315`-`319` exposes only PID, RSS, and uptime in `memory_health`; `.opencode/bin/mk-spec-memory-launcher.cjs:296`-`302` spawns `node dist/context-server.js` with no child-specific V8 flags.
- Memory impact: direct RSS saving is 0 MB when disabled. The value is attribution: for the active store, separate probes show SQLite/BM25/native effects can each look like "RSS growth" unless `heapUsed`, `heapTotal`, `external`, and `arrayBuffers` are logged alongside RSS.
- Proposed change: add `.opencode/skills/system-spec-kit/mcp_server/lib/telemetry/heap-profiler.ts` with `getHeapSnapshot(label)`, `writeHeapSnapshot(label)`, and `logHeapMark(label)` using `node:v8.getHeapStatistics()`, `v8.writeHeapSnapshot()`, and `process.memoryUsage()`. Import it in `context-server.ts` and log marks at startup, before/after the BM25 rebuild block at `context-server.ts:1706`-`1711`, after startup scan completion, and after cache invalidation at `context-server.ts:826`-`842`. Add opt-in `SPECKIT_HEAP_SNAPSHOT_DIR`, `SPECKIT_HEAP_SNAPSHOT_SIGNAL=SIGUSR2`, and `SPECKIT_HEAP_SNAPSHOT_MIN_DELTA_MB`; add `heap_mb` to `memory_health` beside `rss_mb`.
- Trade-off: heap snapshots pause the process and can contain indexed memory text, prompts, file paths, and API-key-shaped strings. Keep snapshots disabled by default, create the snapshot directory `0700`, and emit only aggregate heap stats unless explicitly enabled.
- Effort: M

### Finding 2: In-memory BM25 is a large retained V8 object graph
- Evidence: BM25 is enabled by default in `.opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts:100`-`104`; `context-server.ts:1706`-`1711` schedules a rebuild from the database at startup; the index stores `documents: Map<string, { tokens: string[]; termFreq: Map<string, number> }>` and `documentFreq: Map<string, number>` at `bm25-index.ts:262`-`263`, then stores both token arrays and term-frequency Maps per document at `bm25-index.ts:278`-`293`.
- Memory impact: active DB probe: 3,414 `memory_index` rows, 26.7 MB `content_text`, 27.9 MB BM25 input text, ~2.79M token occurrences, ~1.12M per-document unique term entries, and ~49k unique terms. A read-only Node rebuild of the current `BM25Index` raised `heapUsed` from 3 MB to 119 MB and RSS from 47 MB to 325 MB. A quick compact representation that drops `tokens: string[]` but keeps per-doc `Map`s lowered `heapUsed` to 71 MB. A packed term-id prototype lowered it to 12 MB heapUsed plus 6 MB arrayBuffers, with the same 3,414 docs and ~47k terms.
- Proposed change: in `bm25-index.ts`, replace the per-document `tokens: string[]` and string-keyed `termFreq: Map<string, number>` with a packed representation:
  - `private termToId = new Map<string, number>()`
  - `private terms: string[] = []`
  - `private documentFreq: number[] | Uint32Array`
  - `private documents: Map<string, { length: number; termIds: Uint32Array; termCounts: Uint16Array | Uint32Array }>`
  During `addDocument()`, tokenize, build a temporary frequency Map, assign stable term IDs, sort IDs, then store typed arrays and discard the temporary Map/token array. Update `removeDocument()`, `calculateScore()`, `search()`, and `getStats()` to use document length and term IDs. Add `getMemoryFootprintStats()` returning doc count, term count, doc-term entries, estimated array bytes, and estimated JS-entry bytes.
- Trade-off: scoring gets slightly more complex because query terms must be converted to term IDs and per-document counts found by binary search or a tiny query-local lookup. This preserves the BM25 feature and embedding-provider pluggability; the cost is implementation and regression tests.
- Effort: M

### Finding 3: Startup should not eagerly build the JS BM25 index when SQLite FTS5 BM25 is available
- Evidence: SQLite FTS5 already performs weighted BM25 in `.opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:147`-`204`; `hybrid-search.ts:465`-`469` delegates the FTS lane to that weighted SQLite BM25 path. The in-memory channel is explicitly lower-weight and "kept for coverage breadth" at `hybrid-search.ts:1251`-`1257`, but `context-server.ts:1706`-`1711` still rebuilds it during startup whenever BM25 is enabled.
- Memory impact: if the live daemon is building this index, the avoidable V8 heap is roughly 100 MB today under the active 3,414-row store. If the live 246 MB PID does not show that, the likely explanations are `ENABLE_BM25=false`, incomplete warmup, or allocator/RSS differences; a heap snapshot would settle it.
- Proposed change: add `SPECKIT_BM25_ENGINE=sqlite|packed-inmemory|auto` with default `auto`. In `context-server.ts:1706`-`1711`, call `bm25Index.rebuildFromDatabase()` only when `bm25Index.shouldWarmInMemoryBm25(database)` returns true: FTS5 unavailable, explicit `packed-inmemory`, or a debug/eval override. In `hybrid-search.ts:329`-`404`, have `bm25Search()` use SQLite FTS5 BM25 when FTS5 is available and the in-memory index is cold; only build/use packed in-memory BM25 as a fallback or explicit coverage lane. Preserve the public `bm25` source label in metadata so downstream evaluation does not lose the channel name.
- Trade-off: first query after startup may do a capability check or lazy packed-index build if SQLite FTS5 is unavailable. Ranking may differ slightly between SQLite BM25 and the current JS BM25 stemmer/synonym path, so add golden-query comparisons before changing defaults.
- Effort: M

### Finding 4: Heap snapshots should target cache retained sizes already identified by prior iterations
- Evidence: trigger matching retains a module-level `triggerCache`, `triggerCandidateIndex`, and `regexLruCache` at `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:171`-`179`; each `TriggerCacheEntry` stores a `RegExp` at `trigger-matcher.ts:23`-`33` and entries are created with `regex: getCachedRegex(...)` at `trigger-matcher.ts:532`-`535`. `tool-cache.ts:67`-`69` stores arbitrary cached values in `cache` and `inFlight`, while `tool-cache.ts:459`-`471` reports entry counts but no byte estimate. The shared embedding LRU is a V8 `Map<string, Float32Array>` at `.opencode/skills/system-spec-kit/shared/embeddings.ts:106`-`107`.
- Memory impact: active DB probe found 12,253 JSON trigger phrases in the Ollama/Jina store, down from the old llama-cpp store's ~50,653. Trigger regex retention is therefore probably lower than Iteration 1's 20-80 MB old-baseline estimate, but still a plausible several-to-tens-of-MB heap root. Tool cache and embedding LRU are workload-dependent; typed embedding arrays show up under `arrayBuffers`/external memory, not only `heapUsed`.
- Proposed change: extend the new heap profiler with cache snapshots: `toolCache.getStats()` should include `approxBytes` and `inFlightCount`; `triggerMatcher.getCacheStats()` should include `candidateIndexKeys`, `candidateIndexRefs`, and `regexEntryCount`; `_embeddings.getEmbeddingCacheStats()` should include `approxBytes = entries * dim * 4` once profile-aware cache metadata exists. Add a `memory_health({ reportMode: "full" })` section `process.caches` that reports these counters next to V8 heap stats. Then take heap snapshots before and after `memory_match_triggers`, content-heavy `memory_search`, and provider swaps to verify the retained constructors before changing cache policy.
- Trade-off: byte estimates add serialization/counting overhead if computed on every call. Compute them only for health/profiling paths or cache mutation logs, not every search.
- Effort: S

### Finding 5: Response finalization creates transient heap peaks that snapshots should distinguish from leaks
- Evidence: `context-server.ts:973` calls `structuredClone(result)` before after-tool callbacks. The success path then repeatedly parses and reserializes `result.content[0].text` at `context-server.ts:995`-`1000`, `1009`-`1024`, `1041`-`1045`, and `1068`-`1124`. The extraction callback later stringifies or reads the same result text in `.opencode/skills/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:100`-`116` and `233`-`246`.
- Memory impact: mostly transient young/old-space pressure rather than retained heap. For a content-heavy response, this can temporarily hold the original JSON string, parsed envelope, cloned result, enriched envelope, and final serialized string at the same time. Back-of-envelope: a 5 MB response can create ~15-30 MB of short-lived heap churn; it should not explain steady 246 MB RSS unless callbacks or caches retain the cloned payload.
- Proposed change: in `context-server.ts`, parse the response envelope once into a local `envelope` object, run code-search hints, structural nudge, passive enrichment, auto-surface injection, session prime hints, and token-budget enforcement against that object, then serialize once at the end. Change `runAfterToolCallbacks(name, callId, structuredClone(result))` to pass a bounded callback payload `{ isError, text, meta }`, because `extraction-adapter.stringifyToolResult()` already prefers `content[0].text`. If a future callback needs full structured content, make that an explicit callback capability rather than cloning every tool result.
- Trade-off: this is a central dispatch-path refactor and needs envelope regression tests. The memory win is peak/GC smoothness, not guaranteed steady RSS reduction.
- Effort: M

### Finding 6: `--max-old-space-size` is useful after heap reduction, but dangerous as the first fix
- Evidence: the launcher currently passes no V8 flags to the child at `.opencode/bin/mk-spec-memory-launcher.cjs:296`-`302`; the largest measured JS heap candidate, current BM25, used 119 MB heapUsed in isolation. SQLite residency is configured separately through better-sqlite3 at `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:800`-`806`, and better-sqlite3/native mmap will not be constrained by V8 old-space limits.
- Memory impact: `--max-old-space-size` does not directly cap RSS from SQLite mmap/cache, sqlite-vec, Ollama runner processes, or node-llama-cpp native model memory. It can cap/leak-detect V8 old-space. A safe current canary is likely 192-256 MB; 128 MB is too close to the measured 119 MB BM25 heap and could OOM on a large response. After packed BM25 and byte-bounded caches land, a 128-160 MB cap becomes plausible.
- Proposed change: in `mk-spec-memory-launcher.cjs`, build child-only `nodeArgs` before `spawn()`: parse `SPECKIT_CONTEXT_SERVER_MAX_OLD_SPACE_MB`, default unset for production initially, and append `--max-old-space-size=<mb>` only when configured. Add `SPECKIT_CONTEXT_SERVER_EXPOSE_GC=true` for profiling sessions only, and if exposed, let `heap-profiler.ts` call `global.gc()` before opt-in snapshots or after major cache clears. Do not use a broad `NODE_OPTIONS` default that affects launcher/bootstrap/npm subprocesses.
- Trade-off: too-low old-space caps turn memory growth into process crashes. That is good in CI leak tests but risky in everyday MCP use until BM25 and cache retained sizes are reduced.
- Effort: S

## Cross-references

This builds on Iteration 1 Finding 4 and Finding 5 by turning trigger/tool cache suspicions into heap-snapshot targets rather than repeating the cache policy recommendations. It complements Iteration 3 and Iteration 6: embedding caches should become byte/profile bounded, but their raw V8 footprint is small compared with the measured BM25 heap. It aligns with Iteration 4 by keeping SQLite mmap/cache out of the V8 bucket, and with Iteration 5 by treating node-llama-cpp as native/model memory, not JS old-space. It also sharpens Iteration 2 Finding 1: startup work is not only opening SQLite; it can also build a retained in-memory lexical index.

## Negative knowledge (ruled-out)

- `--max-old-space-size` is not a SQLite memory fix. It will not cap better-sqlite3 page cache, SQLite mmap, sqlite-vec native allocations, or external Ollama model memory.
- Heap snapshots should not run continuously. They pause the MCP server and can write sensitive memory contents to disk.
- The local reranker is not an active in-process model root: `.opencode/skills/system-spec-kit/mcp_server/lib/search/local-reranker.ts:68`-`82` returns false/no-op/dispose no-op.
- `db_connections` in `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:376`-`380` may show small JS wrappers in heap snapshots, but the expensive part is native SQLite state covered by Iteration 4.
- Live PID measurement was not available in this sandbox: `ps -p 4791` returned `operation not permitted`, and the current server has no inspector/snapshot hook to query V8 heap from the outside.

## Open questions

- Is `ENABLE_BM25` disabled in the live PID 4791 environment, or is the current 246 MB baseline measured before BM25 warmup finishes? A heap mark after `context-server.ts:1706`-`1711` would answer this.
- What are p50/p95 query latencies for current JS BM25 vs packed BM25 vs SQLite FTS5 BM25 across the existing memory-search golden set?
- What old-space cap is safe after packed BM25: 128 MB, 160 MB, or 192 MB?
- Should heap snapshot artifacts live under the spec research folder during deep investigations, or under a gitignored operational directory such as `.opencode/diagnostics/heap/`?
