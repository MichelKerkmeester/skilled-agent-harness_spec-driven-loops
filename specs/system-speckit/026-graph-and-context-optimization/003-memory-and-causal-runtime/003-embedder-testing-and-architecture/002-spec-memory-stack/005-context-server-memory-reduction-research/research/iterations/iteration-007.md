# Iteration 7 — code-graph mirror representation (in-memory vs SQLite-backed, partial loading by query scope)

## Summary

`context-server` does not keep a full code-graph mirror in-process: startup reads a 5.7 KB readiness marker, and request-time graph reads cross an MCP boundary into the standalone `system-code-graph` server. The direct steady-state RSS win inside PID 4791 is therefore small, but passive graph enrichment can still spawn/attach to the graph process and parse transient graph payloads; if the launcher-level RSS budget includes code-graph daemons, the bigger wins are SQLite-backed partial reads and avoiding full-graph JS maps during scan/query paths.

## Findings

### Finding 1: `context-server` is marker/RPC-backed, not an in-memory code-graph mirror
- Evidence: `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts:4` says this is the spec-kit side of a process boundary, and `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts:153`-`173` only reads/parses `.code-graph-readiness.json`. Full reads call a launcher-backed MCP client at `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts:272`-`304`. The measured marker is 5,724 bytes; the standalone code graph DB is 53 MB with 9,937 files, 59,816 nodes, and 37,013 edges.
- Memory impact: replacing a nonexistent in-process mirror saves ~0 MB in `context-server`. The current resident representation there is marker JSON plus bounded RPC results, while the 53 MB SQLite mirror belongs to the `system-code-graph` process.
- Proposed change: add a marker-only fast path in `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:968`-`970` before passive `resolveDispatchGraphContext()`: if `getGraphReadinessSnapshotFromMarker()` reports `freshness='empty'|'error'` or `action='full_scan'` with no inline index, return a lightweight `dispatchGraphContext` status from the marker instead of calling `code_graph_context`. Explicit `code_graph_*` tools still cross the boundary normally.
- Trade-off: passive enrichment will not attempt a graph read when the marker already says it cannot be useful. That can defer automatic hints by one call after a scan, but it preserves explicit graph features.
- Effort: S

### Finding 2: passive dispatch enrichment can do up to six graph RPC launches for one tool result
- Evidence: graph enrichment caps are small (`GRAPH_ENRICHMENT_NEIGHBOR_LIMIT = 6`) at `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:205`-`208`, but `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:538`-`544` loops over file paths and calls `callCodeGraphTool('code_graph_context', ...)` once per file. Each call creates stdio transport at `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts:277`-`283`; the launcher can spawn the standalone server at `.opencode/bin/mk-code-index-launcher.cjs:351`-`356`.
- Memory impact: steady-state `context-server` impact is low, but worst-case passive enrichment can create six transport/payload lifetimes and potentially wake the standalone code-graph Node process. The payload itself is bounded to 6 nodes + 6 edges per file, so the avoidable cost is mostly subprocess/transport overhead rather than retained JS heap.
- Proposed change: replace the per-file loop in `buildDispatchGraphContextViaRpc()` with one batched `code_graph_context` call using `seeds: filePaths.map(filePath => ({ filePath, source: 'tool-dispatch' }))`, `queryMode: 'neighborhood'`, `profile: 'quick'`, and the existing 800-token budget. Then map returned sections back to `GraphContextFileSummary[]`.
- Trade-off: batching makes one bad/slow graph request affect all passive file summaries. Keep the existing 250 ms race at `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:606`-`647` and treat batch failure as the same non-fatal unavailable enrichment.
- Effort: S

### Finding 3: standalone code-graph SQLite is already lean, but its memory profile should be explicit
- Evidence: `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:106`-`145` stores files, nodes, and edges in SQLite. Init only sets `busy_timeout`, WAL, and foreign keys at `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:269`-`271`. A read-only probe showed `page_size=4096`, `page_count=13599`, `freelist_count=42`, `cache_size=2000` pages (~7.8 MB), `mmap_size=0`, `journal_mode=wal`, and `wal_autocheckpoint=1000`; dbstat attributed ~29.7 MB to `code_files`/`code_nodes`/`code_edges` and ~25.7 MB to indexes.
- Memory impact: current code-graph SQLite policy is not a large root compared with the 246 MB `context-server` baseline. If the standalone daemon is counted, setting `cache_size=-4096` caps its page cache around 4 MB, saving up to ~4 MB versus SQLite's default 2,000 pages per live code-graph connection and preventing future mmap regressions.
- Proposed change: in `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts` immediately after line 271, add env-backed pragmas: `CODE_GRAPH_SQLITE_CACHE_KIB` default `4096`, `CODE_GRAPH_SQLITE_MMAP_BYTES` default `0`, `CODE_GRAPH_SQLITE_TEMP_STORE` default `DEFAULT`, and `CODE_GRAPH_SQLITE_WAL_AUTOCHECKPOINT_PAGES` default `512`. Log the effective values with `page_count` and `freelist_count` once at startup.
- Trade-off: a smaller page cache can make repeated graph queries colder. The DB is only 53 MB today and graph reads are advisory/contextual, so memory predictability is the better default.
- Effort: S

### Finding 4: `blast_radius` builds a whole import graph in JS instead of traversing SQLite by scope
- Evidence: `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:874`-`899` reads every import dependency row, then `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:971`-`977` builds `Map<string, Set<string>>` for all imported files before the scoped BFS at `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:982`-`1008`. Current DB measurements: 4,162 `IMPORTS` edges but only 1,602 distinct file-to-file import pairs.
- Memory impact: current transient cost is likely low single-digit MB, but it grows linearly with the whole graph even when a query asks for one seed and `limit <= 1000`. On larger scoped graphs, this is the main query-time "in-memory mirror" pattern.
- Proposed change: replace `queryImportDependentsForBlastRadius()` + the global `importedBy` map with a SQLite recursive CTE scoped to `sourceFiles`, `maxDepth`, and `limit + 1`. Put it behind a helper such as `graphDb.queryReverseImportClosure(sourceFiles, { maxDepth, limit, minConfidence })`, returning `{ filePath, depth }[]` already sorted. If `minConfidence > 0` must honor metadata confidence, first add a persisted `confidence REAL` column or generated side table for import edges; otherwise keep the existing JS fallback only for confidence-filtered calls.
- Trade-off: SQL gets more complex and needs query-plan tests on stale/large graphs. It removes whole-graph import adjacency from the read path without removing `blast_radius`.
- Effort: M

### Finding 5: full scans and cross-file enrichment still materialize graph-shaped JS mirrors in the code-graph daemon
- Evidence: `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2130`-`2148` accumulates every parsed `ParseResult` in an array before finalization. Finalization creates global Sets/Maps at `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1881`-`1915`. Later, cross-file call enrichment loads all `code_nodes` into memory at `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:65`-`78`, then separately loads import-targeted call edges at `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts:80`-`89`.
- Memory impact: not `context-server` RSS, but relevant to launcher-level RSS. With the current graph, SQLite stores ~18.3 MB of node table pages and ~8.7 MB of edge table pages; the scan-time JS object mirror can reasonably be multiple times that raw table size because each node/edge is a V8 object with duplicated strings. This is a plausible 50-120 MB transient during full scans, depending on scope.
- Proposed change: keep the durable mirror SQLite-backed during scan. Stage parse output into temp tables (`scan_nodes`, `scan_edges`, `scan_captures`) per file or per chunk, run dedup/import/test-edge finalization as SQL joins, and persist promoted rows from staging into `code_nodes`/`code_edges`. For the near-term smaller patch, rewrite `resolveCrossFileCallEdges()` as a SQL update using grouped callable candidates rather than `SELECT * FROM code_nodes` into a `Map`.
- Trade-off: this is a larger code-graph architecture change and will make scan debugging more database-centric. It preserves scan, query, verify, and context features while moving the expensive mirror from JS heap to SQLite pages.
- Effort: L

## Cross-references

This sharpens Iteration 1 and Iteration 2's negative knowledge: code graph is not resident in `context-server`, so "lazy-load the code graph inside spec-memory" is the wrong framing. It builds on Iteration 4's SQLite-pragmas work, but applies a smaller explicit profile to the standalone `code-graph.sqlite`, not the much hotter memory/vector DB. It stays orthogonal to Iterations 3, 5, and 6: embedding caches, llama-cpp residency, and Voyage/Ollama policy remain separate levers.

## Negative knowledge (ruled-out)

- Do not move `code-graph.sqlite` into an in-process `context-server` cache. That would add the 53 MB graph mirror plus JS object overhead to PID 4791 and undo the ADR-style process boundary.
- Do not disable code-graph WAL for memory. The current code-graph WAL is 0 bytes and `-shm` is effectively empty in the sampled DB; WAL is not the memory root.
- Do not apply the memory-index DB's old mmap diagnosis blindly. `code-graph.sqlite` currently reports `mmap_size=0`, unlike the memory vector DB covered in Iteration 4.
- Do not restrict embedding models for this dimension. The code-graph boundary and handlers do not call Voyage, Ollama, or llama-cpp embedding APIs; embedder pluggability is unaffected by marker/RPC or SQLite traversal changes.
- The readiness marker is not worth shrinking for RSS. It is 5.7 KB and read synchronously on demand; the only useful marker change is using it to avoid unnecessary passive RPCs when the graph is known unqueryable.

## Open questions

- What is the measured RSS of the standalone `system-code-graph` daemon under the lockstep launcher, separate from PID 4791?
- Does batched `code_graph_context` with multiple `seeds[]` preserve enough per-file ordering for `GraphContextFileSummary[]`, or should the handler include seed IDs in each returned section?
- Is a recursive CTE for `blast_radius` faster enough under the current 1,602 import-pair graph, and how does it scale at 100k+ import pairs?
- Should passive dispatch enrichment skip stale `full_scan` markers entirely, or allow stale-but-selective markers to attempt inline refresh within the existing 250 ms deadline?
