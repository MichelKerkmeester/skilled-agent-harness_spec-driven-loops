# Focus

A5 self-healing and observability for the memory indexing subsystem: orphan-row GC, rename/move reconciliation, index-freshness/health surface, auto-reindex triggers, and cross-angle synthesis.

# Actions Taken

- Read the deep-research state log and strategy first, per loop protocol.
- Inspected `memory_index_scan` discovery, incremental stale cleanup, and scan lease behavior.
- Inspected main/vector delete paths, integrity checks, `memory_health`, `memory_stats`, embedder job status, retry status, file-watcher behavior, and the existing post-commit hook.
- Compared current behavior against the A5 prompt's orphan-row incident and designed a self-healing contract that composes with A1-A4.

# Findings (file:line evidence)

## 1. Orphan Detection And GC

Current scan discovery is rooted in the workspace, with optional `spec_folder` filtering applied to spec-doc and graph-metadata discovery before dedupe (`memory-index.ts:271-279`, `memory-index.ts:301-313`). Stale cleanup is not a raw filesystem sweep inside the handler; in incremental non-force mode the handler asks `categorizeFilesForIndexing(files)` for `toDelete`, then deletes stale indexed record ids from those paths (`memory-index.ts:444-450`, `memory-index.ts:600-608`).

The important nuance: `categorizeFilesForIndexing()` adds deleted paths from the scan input, but then performs a second pass over all indexed paths via `listStaleIndexedPaths(filePaths)` so removed files can enter `toDelete` even though discovery only returns existing files (`incremental-index.ts:233-277`). That stale pass queries distinct `memory_index.file_path`/`canonical_file_path` rows globally, excludes only paths discovered in the current scan, and checks both stored path variants on disk before calling a row stale (`incremental-index.ts:280-327`). The delete lookup also guards against deleting rows whose stored file or canonical path still exists (`incremental-index.ts:329-386`).

Therefore the stale cleanup is not strictly scoped to the exact scan folder: a normal incremental scan of any scope can discover vanished rows outside the scan's discovery set because the stale pass reads all indexed paths. The gap is reliability and UX, not total absence: cleanup is skipped for `force`/non-incremental scans, only executes after a successful scan when `results.failed === 0`, and only surfaces as `staleDeleted` in the scan response (`memory-index.ts:373-380`, `memory-index.ts:600-608`).

Recommended design: keep the existing conservative path-existence checks, but extract them into a bounded `orphan_sweep` phase owned by the A1 scan job. The sweep should page through `memory_index` by `id` or `updated_at`, check at most N rows per tick, produce counters (`checked`, `missing`, `deleted`, `deferred`, `failed`), and call the same deletion primitive used today. It should run independently of scan scope and force mode, but be serialized under the scan single-writer lease so it cannot race with writes. Default trigger: every completed scan plus lazy enqueue after any includeContent `File not found` result. Safety gates: delete only rows whose `file_path` and `canonical_file_path` are both missing, retain history, and cap deletes per tick.

Where vector rows are cleaned today: normal stale deletion uses `vectorIndex.deleteMemory()`, which calls `delete_memory_from_database()` (`memory-index.ts:331-336`, `vector-index-mutations.ts:577-592`). That transaction deletes the matching active `vec_memories` row, cleans ancillary rows, deletes embedding-cache entries by content hash, and then deletes the `memory_index` row (`vector-index-mutations.ts:592-627`). Bulk deletes similarly remove `vec_memories` before deleting `memory_index` rows (`vector-index-mutations.ts:728-744`). The integrity checker also detects vector rows whose rowid no longer exists in `memory_index` and can auto-clean them (`vector-index-queries.ts:1391-1423`). File-row cleanup in integrity mode is optional and requires `autoClean && cleanFiles`; it then calls `delete_memory_from_database()` and records history (`vector-index-queries.ts:1440-1488`). `memory_health` wires this under `autoRepair` and includes `orphan_files_cleanup` only when `cleanFiles` is true (`memory-crud-health.ts:578-585`, `memory-crud-health.ts:717-740`).

Design implication: vector shard cleanup should remain downstream of main-row deletion. The orphan sweep should never raw-delete `memory_index`; it should reuse `delete_memory_from_database()` so `vec_memories`, ancillary graph rows, projection rows, BM25 cleanup, and embedding cache cleanup follow the same path. A separate vector-only sweep remains useful for broken historical rows where `vec_memories.rowid` no longer has a main row.

## 2. Rename/Move Reconciliation

Today a move looks like old path missing plus new path discovered. The scan dedupes discovered files by canonical path (`memory-index.ts:289-313`), incremental classification returns new/modified/skipped/deleted buckets (`incremental-index.ts:233-259`), and `index_memory`/`index_memory_deferred` identify existing records by `spec_folder`, canonical path, file path, and anchor, not by packet identity (`vector-index-mutations.ts:232-256`, `vector-index-mutations.ts:328-360`). That means a moved packet naturally becomes add-new plus stale-delete-old, which preserves correctness but causes needless re-embedding and can leave a stale row until a cleanup path runs.

Recommended design: add a pre-index `move_reconcile` phase between discovery and indexing. Build candidate pairs from discovered new files and stale/missing indexed rows, then update the existing row's path fields in place when identity is unambiguous. Do not use content hash alone as the identity key. Content hash is useful for confirmation, but two copied specs or template-identical files can share content. The safe primary identity should be `graph-metadata.json.packet_id` plus document role/anchor when available, because graph metadata declares both `packet_id` and `spec_folder` as required schema fields (`graph-metadata-schema.ts:61-71`). For packets missing graph metadata, fall back to description metadata if it has a stable packet id; only then use exact content hash plus unique title/doc-type as a lower-confidence candidate requiring no competing matches.

Concrete rule:

- Strong move: old row and new on-disk packet share the same `packet_id`, same document type, same anchor id, and no second live path has that packet/doc identity.
- Medium move: same normalized content hash plus same old/new `spec_folder` basename or graph `spec_folder`, no competing candidates, and old path missing.
- No move: duplicate packet ids, copied packets where both old and new paths exist, many-to-one hash collisions, divergent graph metadata, or document role mismatch.

Implementation shape: update `memory_index.file_path`, `canonical_file_path`, `spec_folder`, `updated_at`, and projection logical keys in a transaction; leave `id`, vector rowid, embedding, validation history, access history, and retry status intact. If content changed during move, preserve the row id but mark lexical content update and set embedding status according to A4: lexical commits immediately, vector becomes `pending` only if normalized embedding content changed.

## 3. Index-Freshness And Health Surface

Current operator surfaces are fragmented. `memory_stats` reports aggregate `memory_index` total, embedding status counts, dates, trigger count, tier breakdown, last indexed row update, database size, graph metrics, and folder rankings (`memory-crud-stats.ts:128-156`, `memory-crud-stats.ts:179-205`). `memory_health` reports process/runtime status, alias conflicts, FTS/vector consistency, embedding provider metadata, retry telemetry, routing telemetry, and optional repair results (`memory-crud-health.ts:435-452`, `memory-crud-health.ts:587-610`, `memory-crud-health.ts:791-823`). `embedder_status` reports the active embedder reindex job plus provider/model-server health (`embedder-status.ts:117-135`). Retry telemetry has DB-backed counts for pending/retry/failed/success and queue size, while the lightweight health accessor exposes pending/failed/queueDepth/circuitBreakerOpen/lastRun (`retry-manager.ts:613-657`). The scan lease records `last_index_scan` and `scan_started_at`, but those are not currently surfaced in `memory_health` (`db-state.ts:384-405`, `db-state.ts:501-519`).

Recommended design: add an `index` block to `memory_health` and mirror it in a `/doctor index` view. It should answer one operator question: "Is my index healthy and fresh?" Suggested summary enum:

- `healthy_fresh`: no orphan file rows, no FTS/vector inconsistencies beyond expected pending vectors, scan staleness below threshold, no active failed scan job.
- `healthy_lagging_vectors`: lexical index fresh, but vector backlog exists; include `pending`, `retry`, `failed`, `nextVectorAttemptAfter`, and active embedder job.
- `stale_needs_scan`: on-disk file delta or last scan age exceeds threshold; enqueue/coalesce scan.
- `degraded_needs_repair`: orphan file rows, orphan vectors/chunks, FTS mismatch, failed vector backlog above threshold, or scan job stuck past heartbeat expiry.
- `unavailable`: DB not initialized/unreadable or integrity probes failed.

Minimum `index` fields: `summary`, `indexedRows`, `indexedParentRows`, `onDiskIndexableFiles`, `delta`, `orphanFileRows`, `orphanVectorRows`, `missingVectors`, `orphanChunks`, `pendingVectors`, `retryVectors`, `failedVectors`, `lastScanAt`, `lastScanAgeSeconds`, `activeScanJob`, `activeEmbedderJob`, `nextAction`. `onDiskIndexableFiles` can reuse the same discovery functions as scan but with caps and no indexing. `orphanFileRows` can reuse `verifyIntegrity({autoClean:false})` and include only bounded sample ids/paths. `activeScanJob` should be A1's `index_scan_jobs` row; until then, surface the existing lease keys. The view should avoid raw absolute paths by reusing redaction rules already present in `memory_health` (`memory-crud-health.ts:62-74`).

## 4. Auto-Reindex Triggers

Existing git-hook infrastructure is advisory and code-graph-specific. The post-commit hook counts files changed in HEAD and invalidates code-graph SQLite when a threshold is exceeded; it does not touch memory indexing (`post-commit:1-18`, `post-commit:31-43`, `post-commit:63-75`). The repo also already has a file watcher path that debounces add/change events, hashes content to avoid redundant work, reindexes via `config.reindexFn`, and handles unlink through `config.removeFn` (`file-watcher.ts:365-447`, `file-watcher.ts:463-497`). Search formatting currently detects includeContent read failures and surfaces `contentError: 'File not found'` plus a hint (`search-results.ts:923-943`, `search-results.ts:1010-1018`, `search-results.ts:1072-1074`).

Recommended trigger mix:

- Primary: lazy reconcile-on-search. When includeContent hits `File not found`, immediately mark the result as stale in the response, enqueue a targeted orphan/move reconcile job through A1 coalescing, and optionally suppress that row from future same-session results. This directly addresses the observed UX because the first user-visible stale row self-repairs without manual scans. Latency: one bad result can still appear once. Load: low. Correctness: high if it only enqueues and the job does bounded verification before delete.
- Secondary: daemon file watcher for running sessions. Keep debounce/hash behavior, but route add/change/unlink into the same A1 scan-job queue instead of directly doing unbounded indexing. Latency: best. Load: moderate. Correctness: good while daemon is alive, but not enough for offline changes or git checkout/renest while the daemon is down.
- Tertiary: post-commit hook as a coarse invalidation/enqueue marker. Extend the existing hook concept with memory-index awareness: if committed files under `.opencode/specs/**`, `specs/**`, or `.opencode/skills/*/constitutional/**` changed, write a small durable "memory index stale" marker or append a pending trigger record, not a full scan. Next MCP boot or `memory_health` consumes the marker and coalesces a scan. Latency: after next tool/boot. Load: low. Correctness: good for committed changes, misses uncommitted moves.

Do not rely on mtime/fs watch alone: it misses daemon-off periods and can thrash during bulk renests. Do not run full scans in git hooks: hooks should stay fast, non-blocking, and failure-tolerant. Do not raw-delete on search read failure: lazy reconcile should enqueue a verification job, not mutate inside result formatting.

All triggers feed A1's scan coalescer with scope keys: targeted file/path for search failures and watcher events, packet folder for changed spec folders, root scope for large post-commit invalidation. The coalescer applies cooldown internally and merges repeated triggers into one active or queued job.

## 5. Cross-Angle Synthesis Seed

A1-A5 compose into a self-maintaining index by turning `memory_index_scan` from a synchronous best-effort maintenance command into an idempotent job orchestrator: A1 gives callers a safe job/progress contract and coalescing; A2 splits work into walk, lexical commit, and async vector drain so large scans cannot time out; A3 serializes DB writers with leases/heartbeats while letting other clients enqueue/read; A4 makes lexical search always commit and vectors degrade into pending/retry with bounded retry/circuit behavior; A5 closes the loop with move reconciliation, orphan sweeps, health summaries, and low-thrash triggers. Minimal first slice for maximum UX/hardening win: add read-only `memory_health.index` with orphan counts + last scan/lease + vector backlog, then add lazy `File not found` enqueue plus bounded orphan sweep that reuses `delete_memory_from_database()`. That fixes the user-visible stale-row incident quickly without schema-heavy move reconciliation; the next slice adds `packet_id`-based in-place move updates to avoid re-embedding on future renests.

# Questions Answered

- A5.1 Orphan detection: current incremental stale cleanup already has a global indexed-path stale pass, but it is tied to incremental non-force scans and failure-free cleanup; a dedicated bounded sweep should make it reliable and visible.
- A5.2 Vector cleanup: stale main-row deletion should continue to use existing deletion primitives, because they clean active vector rows, ancillary graph/projection rows, BM25, and embedding cache; vector-only orphan cleanup belongs in integrity/health repair.
- A5.3 Rename/move reconciliation: use `packet_id` plus document role/anchor as the safe identity, with content hash only as confirmation or a lower-confidence unique fallback.
- A5.4 Health surface: expose a single `memory_health.index.summary` plus counts for on-disk delta, orphan files/vectors/chunks, pending/retry/failed vectors, last scan, and active scan/embedder jobs.
- A5.5 Auto triggers: combine lazy reconcile-on-search, daemon file watcher routing into the A1 queue, and lightweight post-commit stale markers; avoid full scans inside hooks or raw mutations inside result formatting.

# Questions Remaining

None for A5. Implementation planning remains for a follow-on packet.

# Next Focus

All five angles answered; ready for synthesis
