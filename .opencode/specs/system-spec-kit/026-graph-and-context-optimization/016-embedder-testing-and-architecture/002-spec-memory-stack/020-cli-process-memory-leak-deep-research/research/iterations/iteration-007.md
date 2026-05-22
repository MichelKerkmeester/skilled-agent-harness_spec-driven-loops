# Iteration 007: In-process MCP resource lifetime audit
## Focus
Inspect MCP server, context server, memory save/search/index handlers, reducer scripts, background timers, caches, retry jobs, and file handles for long-lived resources that can accumulate or keep processes alive unexpectedly.

Executor metadata: `{"kind":"cli-codex","model":"gpt-5.5","reasoningEffort":"xhigh","serviceTier":"fast"}`.

## Findings
1. `memory_index_scan` acquires a scan lease before walking/indexing, but lease completion is only called on two success exits. The lease is reserved at `handlers/memory-index.ts:241-244`, completed for the no-file path at `handlers/memory-index.ts:375`, and completed again before the normal success return at `handlers/memory-index.ts:724`. There is no top-level `try/finally` around the leased region. `core/db-state.ts:443-472` treats an existing `scan_started_at` as an active lease, and `core/db-state.ts:501-518` deletes it only when `completeIndexScanLease()` runs. If indexing throws between acquisition and either explicit completion point, follow-on scans can be blocked until stale-lease expiry.

2. Scheduled graph refresh has a process-keeping timer path and the shutdown path does not cancel it. `lib/search/graph-lifecycle.ts:154-179` keeps a process-local dirty-node `Set`, `lib/search/graph-lifecycle.ts:354-367` schedules a `setTimeout()` without `unref()`, and `lib/search/graph-lifecycle.ts:373-378` exposes `cancelScheduledRefresh()`. `context-server.ts:96-101` imports graph lifecycle helpers but not the cancel function, while `context-server.ts:1419-1473` shuts down sessions, retry manager, shadow scheduler, file watcher, vector DB, transport, and IPC without cancelling a scheduled graph refresh. The callback registered at `context-server.ts:1750-1768` clears dirty nodes only after a successful scheduled recompute.

3. Tier 3 save-routing cache is a singleton with no entry cap, and session-scope entries never expire. `handlers/memory-save.ts:178` creates one `InMemoryRouterCache`, and `handlers/memory-save.ts:1201-1206` reuses it for canonical routing. The cache implementation is a plain `Map` with lazy expiry only on `get()` at `lib/routing/content-router.ts:310-331`. Tier 3 routing writes a session-scope cache entry with infinite TTL and a spec-folder entry with 24-hour TTL at `lib/routing/content-router.ts:815-816`, so a long-lived MCP process can retain one entry per unique routed context indefinitely.

4. Retrieval session state caps session count but not per-session accumulators. The module documents in-memory storage, 30-minute inactivity TTL, and 100-session LRU at `lib/search/session-state.ts:13-22`, but each session stores `seenResultIds`, `openQuestions`, and `preferredAnchors` without size limits at `lib/search/session-state.ts:98-104`. `markSeen()`, `addQuestion()`, and `setAnchors()` append or copy without per-session caps at `lib/search/session-state.ts:130-159`, and expiry only runs when `getOrCreate()` is called at `lib/search/session-state.ts:83-109` and `lib/search/session-state.ts:191-198`. `handlers/memory-search.ts:1419-1433` marks returned result IDs as seen after each session search, so an active session can grow its seen set for the full TTL window.

5. Progressive-disclosure cursors are bounded by count and TTL, but each cursor stores the full result array in process memory. The cursor store is a module-level `Map` at `lib/search/progressive-disclosure.ts:90`; cursor TTL and max count are defined at `lib/search/progressive-disclosure.ts:20-27`. `createCursor()` prunes expired entries and evicts oldest entries over the 1000-cursor cap at `lib/search/progressive-disclosure.ts:315-327`, while `resolveCursor()` also prunes and deletes expired/empty cursors at `lib/search/progressive-disclosure.ts:375-396`. This is not unbounded, but it is a high transient-retention surface if many large result sets are paged within the TTL.

6. The file watcher has a bounded reindex queue and close-drain behavior, but per-path maps can grow with file churn. `lib/ops/file-watcher.ts:216-241` keeps `debounceTimers`, `contentHashes`, `canonicalPaths`, and in-flight state; `lib/ops/file-watcher.ts:251-267` caps pending reindex waiters at 1000. Reindex success stores content hashes at `lib/ops/file-watcher.ts:447-459`, and unlink cleanup removes hashes/canonical path entries at `lib/ops/file-watcher.ts:471-477`. Close clears timers, drains queued waiters, waits for in-flight work, and closes the watcher at `lib/ops/file-watcher.ts:503-520`. The residual risk is distinct path churn that never produces unlink events before server shutdown.

7. The ingest job queue is process-local and has no pending-job cap. `lib/ops/job-queue.ts:105-109` declares a sequential `pendingQueue`, worker flag, and process function. `drainQueue()` processes one job at a time and yields between jobs at `lib/ops/job-queue.ts:651-679`. `enqueueIngestJob()` de-dupes by job ID but otherwise pushes without a max length at `lib/ops/job-queue.ts:681-697`, and startup recovery re-enqueues every reset incomplete job at `lib/ops/job-queue.ts:703-714`. A large recovered backlog or a burst of ingest starts can therefore keep the MCP process active while the single worker drains.

8. The retry manager cleans up its interval but does not abort or await an in-flight retry run. The retry background state is module-level at `lib/providers/retry-manager.ts:347-355`. `startBackgroundJob()` launches one immediate run and then an unrefed interval at `lib/providers/retry-manager.ts:859-887`; `stopBackgroundJob()` clears the interval and flips `backgroundJobRunning` false at `lib/providers/retry-manager.ts:890-898`. `runBackgroundJob()` resets that flag in `finally` after awaiting queue processing at `lib/providers/retry-manager.ts:904-937`, and `retryEmbedding()` awaits `generateDocumentEmbedding()` at `lib/providers/retry-manager.ts:579-630` without an abort signal at this layer. Provider-level timeouts may still exist below this call, but the retry manager itself cannot cancel an active provider call during shutdown.

9. Search decision audit rotation prevents a single huge current file, but rotated audit files have no retention cap. Search writes the decision envelope at `handlers/memory-search.ts:1459-1464`. `lib/search/decision-audit.ts:9` sets a 10 MB default max, `lib/search/decision-audit.ts:43-52` appends one JSONL envelope synchronously after rotation, and `lib/search/decision-audit.ts:113-119` renames an oversized file to a timestamped `.rotated` path. No cleanup or max rotated-file count is visible in that module, so high search traffic can accumulate disk files even though open file handles are not retained.

## Ruled Out
- `memory-index-discovery.detectSpecLevel()` is not a file-descriptor leak: it opens a spec file with `openSync()` at `handlers/memory-index-discovery.ts:204-207` and closes it in a `finally` block at `handlers/memory-index-discovery.ts:210-214`.
- `tool-cache` has practical process-lifetime controls: max entries and aux-map caps at `lib/cache/tool-cache.ts:62-78`, an unrefed cleanup interval at `lib/cache/tool-cache.ts:371-380`, in-flight promise cleanup in `finally` at `lib/cache/tool-cache.ts:416-457`, and explicit shutdown at `lib/cache/tool-cache.ts:593-603`.
- `embedding-cache` is DB-backed and budgeted: byte/profile/query budgets are defined at `lib/cache/embedding-cache.ts:64-68`, writes call eviction at `lib/cache/embedding-cache.ts:441-463`, and eviction enforces byte and per-profile entry budgets at `lib/cache/embedding-cache.ts:473-506`.
- The deep-research reducer is a one-shot synchronous script, not a process-keeping background service. It reads delta payloads at `skills/deep-research/scripts/reduce-state.cjs:112-120`, groups exhausted approaches in memory at `skills/deep-research/scripts/reduce-state.cjs:631-659`, and exits through the CLI path at `skills/deep-research/scripts/reduce-state.cjs:976-1005`.

## Dead Ends
- Searching for obvious leaked file handles produced mostly false positives: the directly inspected `openSync()` path closes correctly, and the main audit-file path uses synchronous append without retaining handles.
- Re-checking process-spawn ownership would have duplicated iterations 001 and 006. This pass stayed on in-process timers, maps, queues, leases, and disk accumulation.
- The provider layer below `generateDocumentEmbedding()` was not expanded in this iteration; the retry-manager finding is limited to the absence of cancellation at the retry-manager layer.

## Edge Cases
- The scheduled graph-refresh finding is conditional: default local recompute can clear dirty nodes synchronously, but scheduled mode or large-component fallback uses the timer path.
- Progressive-disclosure cursor retention is bounded by TTL and max cursor count, but the retained value is a full result array, not a small cursor descriptor.
- File watcher path-map growth depends on churn in distinct watched paths without corresponding unlink events.
- Retry shutdown behavior depends on whether the lower provider call returns promptly; this layer does not enforce that guarantee.

## Sources Consulted
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:96-101`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1419-1473`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1750-1768`
- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1813-1823`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:241-244`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:365-397`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:724-730`
- `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:365-371`
- `.opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:390-524`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:178`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:1201-1206`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1419-1433`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1459-1464`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:204-214`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:154-179`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:354-378`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:420-470`
- `.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts:310-331`
- `.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts:815-816`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/session-state.ts:13-22`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/session-state.ts:83-109`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/session-state.ts:130-159`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/session-state.ts:191-198`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:20-27`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:90`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:315-327`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:375-396`
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:216-292`
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:327-352`
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:447-520`
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:105-109`
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:651-714`
- `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:347-355`
- `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:579-630`
- `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:859-898`
- `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:904-937`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/decision-audit.ts:9`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/decision-audit.ts:43-52`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/decision-audit.ts:113-119`
- `.opencode/skills/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:62-78`
- `.opencode/skills/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:371-388`
- `.opencode/skills/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:416-457`
- `.opencode/skills/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:593-603`
- `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:64-68`
- `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:441-506`
- `.opencode/skills/deep-research/scripts/reduce-state.cjs:112-120`
- `.opencode/skills/deep-research/scripts/reduce-state.cjs:631-659`
- `.opencode/skills/deep-research/scripts/reduce-state.cjs:976-1005`

## Assessment
The highest-confidence leak or liveness risks are the missing scan-lease `finally`, scheduled graph-refresh shutdown gap, unbounded Tier 3 routing cache, per-session retrieval accumulators, and unbounded ingest pending queue. The retry manager is a medium-confidence liveness risk because this layer lacks cancellation, but a provider beneath it may still enforce its own timeout. File watcher and progressive-disclosure risks are bounded or conditional, but they are still worth covering in stress tests because their retained values can be large.

The server already has several good controls: tool-cache cleanup is unrefed and explicitly shut down, embedding-cache has byte budgets, file watcher pending waiters are capped, and direct file-open paths inspected here close handles in `finally`. The dominant pattern is not missing cleanup everywhere; it is cleanup that exists for top-level services while lower-level singleton maps, queues, and leases have weaker bounds.

## Reflection
This iteration adds a different layer than the earlier process-spawn work. The prior evidence explains how extra processes and sidecars can persist; this pass shows how the main MCP process itself can retain state through timers, singleton caches, session maps, queues, and leases even when no child process is involved.

## Recommended Next Focus
Convert these findings into a small fix plan and tests: wrap `memory_index_scan` lease ownership in `try/finally`, wire `cancelScheduledRefresh()` into context-server shutdown and consider `unref()`, cap or byte-bound Tier 3 routing cache and per-session state, add an ingest queue limit/backpressure policy, add rotated audit retention, and add shutdown/stress tests that assert no active timers, pending leases, or unexpected retained map growth after representative save/search/index workloads.
