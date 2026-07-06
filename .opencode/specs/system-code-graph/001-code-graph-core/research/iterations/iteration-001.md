# Iteration 1: Code-Graph Baseline + Q1/Q6 Anchoring

## Focus
Establish a code-anchored baseline map of the tree-sitter→SQLite code graph under `.opencode/skills/system-code-graph/`, locating the scan/edge-write path, edge schema + weights, parser quarantine/skip-list, neighborhood/impact retrieval, and readiness gates. Anchor first hypotheses for Q1 (non-destructive supersede vs delete-on-reindex) and Q6 (readiness as hint vs hard watermark).

Edge case (missing dependency): the aionforge docs (`external/aionforge-memory-development/docs/bi-temporal-model.md`, `consolidation.md`) are NOT present in this checkout — `external/` is gitignored (`.gitignore:176`) and absent on disk [SOURCE: bash `ls external` → "No such file or directory"; `find . -iname 'bi-temporal*'` → no hits]. I proceeded with the in-scope code baseline (the bulk of the focus) and used the strategy's Known Context §12 as the proxy bi-temporal anchor. The aionforge reads are deferred to a future iteration if the external tree is fetched.

## Actions Taken
1. Read strategy.md (Q1–Q8, Known Context §12), config.json, state.jsonl — confirmed iteration 1, lineageMode `new`, generation 1, threshold 0.03.
2. Enumerated all 60+ source modules under `mcp_server/{lib,handlers,core}` (find).
3. Confirmed `external/` aionforge docs absent (gitignored) — classified as missing dependency.
4. Read `code-graph-db.ts` schema + delete/replace/prune paths; `indexer-types.ts` (edge types, IDs, weights); `config-defaults.ts` (edge weights); `readiness-contract.ts` (full); `ensure-ready.ts`, `handlers/query.ts`, `parser-skip-list.ts` (grepped key symbols).

## Findings [file:line]

### A. Scan + edge-write path (incremental selective-reindex)
1. Structural indexer is the scan entry; dual-backend (tree-sitter WASM default, `SPECKIT_PARSER=regex` fallback) for JS/TS/Python/Shell. `indexFiles()` supports `skipFreshFiles` + `specificFiles` for selective reindex, with an `AbortSignal` deadline checked between phases [SOURCE: structural-indexer.ts:1-7, 74-80].
2. Reindex is DESTRUCTIVE-REPLACE, not supersede. `replaceNodes(fileId, nodes)` runs in a txn: `DELETE FROM code_nodes WHERE file_id = ?` then re-INSERT [SOURCE: code-graph-db.ts:921-955, esp. :936]. It also hard-deletes all edges touching the file's old symbols: `DELETE FROM code_edges WHERE source_id IN (...) OR target_id IN (...)` [SOURCE: code-graph-db.ts:941-943].
3. `replaceEdges(sourceIds, edges)` deletes-then-inserts per source: `DELETE FROM code_edges WHERE source_id IN (...)` then re-INSERT only edges whose source survives in `code_nodes` [SOURCE: code-graph-db.ts:972-1018, delete at :985]. Dangling-edge prune physically deletes any edge whose source/target is no longer a live node [SOURCE: code-graph-db.ts:1009-1019 inline, and `pruneDanglingEdges()` :1027-1036].
4. Cross-file IMPORTS targets in not-yet-persisted files survive only via `deferDanglingTargetPrune` + a single post-scan `pruneDanglingEdges()`; the resolver only reconciles CALLS edges [SOURCE: code-graph-db.ts:957-968 doc-comment].

### B. Edge schema + relations + weights
5. `code_edges(id, source_id, target_id, edge_type, weight REAL DEFAULT 1.0, metadata TEXT)` — NO validity-window / temporal columns (no valid_from/valid_to/generation/superseded_by). Currentness = physical edge presence [SOURCE: code-graph-db.ts:177-184]. SCHEMA_VERSION = 5 [SOURCE: code-graph-db.ts:142].
6. 10 edge relations: CONTAINS, CALLS, IMPORTS, EXPORTS, EXTENDS, IMPLEMENTS, TESTED_BY, DECORATES, OVERRIDES, TYPE_OF [SOURCE: indexer-types.ts:19-22].
7. Static default weights (no learning today): CONTAINS/IMPORTS/EXPORTS 1.0, EXTENDS/IMPLEMENTS 0.95, DECORATES/OVERRIDES 0.9, TYPE_OF 0.85, CALLS 0.8, TESTED_BY 0.6; overridable via `SPECKIT_CODE_GRAPH_EDGE_WEIGHTS_JSON` env only [SOURCE: config-defaults.ts:45-59; indexer-types.ts:24]. Edge metadata already carries `confidence`, `detectorProvenance` ('ast'|'structured'|'regex'|'heuristic'), `evidenceClass` ('EXTRACTED'|'INFERRED'|'AMBIGUOUS') — a hook for rank-time reliability [SOURCE: indexer-types.ts:26-37].
8. Symbol IDs are deterministic but PATH-COUPLED: `sha256(filePath + '::' + fqName + '::' + kind).slice(0,16)` [SOURCE: indexer-types.ts:99-105]. Content hash for change-detection is separate: `sha256(content).slice(0,12)` [SOURCE: indexer-types.ts:107-110]. [INFERENCE: because the symbol ID includes filePath, a pure rename changes the ID and looks like delete+create, not a supersede — relevant to Q1/Q2 and the 001 "renamed-vs-deleted" temporal-close mapping.]

### C. Parser quarantine / skip-list
9. `parser_skip_list(file_path PK, error_class CHECK IN ('B1','B2','OTHER'), error_message, added_at, last_seen_at, attempt_count, source CHECK IN ('seed','runtime'))` — persistent guardrail for tree-sitter WASM crash cohorts [SOURCE: code-graph-db.ts:203-211; parser-skip-list.ts:1-18]. Add is idempotent upsert that bumps `attempt_count` [SOURCE: parser-skip-list.ts:78-86].
10. Removal is an INTENTIONAL no-op: "parser skip-list removal is manual-review-only. Successful parses must not auto-unskip files or imply self-heal support" [SOURCE: parser-skip-list.ts:94-95]. Seed path inserts class 'B1' from production cohort [SOURCE: parser-skip-list.ts:123-142]. [INFERENCE: B1/B2/OTHER are crash cohort labels, not yet an explicit transient-vs-fatal retry policy — aionforge's transient/fatal distinction is the candidate refinement for Q2; class semantics need a dedicated read.]
11. Separate `parse_diagnostics(file_path PK, error_message, error_count, last_seen_at)` tracks non-crashing parse errors distinct from the crash skip-list [SOURCE: code-graph-db.ts:196-201].

### D. Neighborhood / outline / impact retrieval
12. Generic typed BFS traversal `traverseGraphBfs(...)` with visited-set, depth bound, dangling-target capture, and path tracking is the shared walk primitive [SOURCE: graph/bfs-traversal.ts:76-174]. [INFERENCE: ranking today is a flat weighted edge walk — no PageRank/PPR seeding observed in bfs-traversal.ts — which is exactly the Q3 gap; needs confirmation in the query/context handlers next iteration.]

### E. Readiness gates (fresh / stale / empty / error)
13. `ensure-ready` computes a 4-state `GraphFreshness` ('fresh'|'stale'|'empty'|'error'): empty=0 nodes/no tracked files, stale=content/mtime drift or deleted files, fresh=all up-to-date, error=unreachable scope [SOURCE: ensure-ready.ts:395-518; states at :406, :420-441, :463-518, :499].
14. `readiness-contract.ts` maps freshness → canonical `StructuralReadiness` (fresh→ready, stale→stale, empty/error→missing) and → trust axis (fresh→live, stale→stale, empty→absent, error→unavailable) [SOURCE: readiness-contract.ts:68-118].
15. READINESS IS ALREADY A HARD READ-PATH GATE, not just a hint: `shouldBlockReadPath()` returns true when `readiness.freshness !== 'fresh'` (OR a failed verification gate) [SOURCE: handlers/query.ts:903-915]. The query handler calls it at :1348 and returns a `status:'blocked'`, `degraded:true`, `graphAnswersOmitted:true` payload with a `fallbackDecision` (`rg` on error, `code_graph_scan` otherwise) [SOURCE: handlers/query.ts:1321, 1348, buildBlockedReadPayload ~:939-967, buildFallbackDecision :916-936].
16. The block DEGRADES gracefully (returns a blocked payload + fallback tool) rather than throwing — consistent with the 001 `graph_available:false` degrade pattern [SOURCE: handlers/query.ts:939-967; Known Context §12]. Tombstones for deleted nodes/edges exist but are OPT-IN and OFF by default (`SPECKIT_CODE_GRAPH_TOMBSTONES`, gated at :233) [SOURCE: code-graph-db.ts:227-243, 245-288].

## Questions Answered
None fully answered (reconnaissance iteration). Q1 and Q6 are now code-anchored with strong hypotheses (below).

## Questions Remaining
- Q1 (anchored, not resolved): delete-on-reindex confirmed at code-graph-db.ts:936/941/985/1012/1031. Open: does a closed-validity-window edge model fit `code_edges` without breaking the dangling-prune contract and cross-file resolver? Needs aionforge bi-temporal-model.md.
- Q6 (anchored, not resolved): readiness already hard-gates reads at `freshness !== 'fresh'` (query.ts:913). Open: is a generation-numbered watermark (stale=error, per-generation supersede) a net win over the current 4-state degrade-with-fallback? Needs aionforge generation-checked maintained-sets read.
- Q2: skip-list classes B1/B2/OTHER exist but transient/fatal policy unread — needs parser-skip-list.ts full read + classifier source.
- Q3: no PPR/PageRank seeding found in bfs-traversal.ts; confirm flat walk in query/context handlers.
- Q4: static env-only edge weights; metadata.confidence is the rank-time hook — unwired.
- Q5, Q7, Q8: untouched this iteration (doc-lane node 'doc' language exists in SupportedLanguage:40 — flag for Q5).

## Hypotheses
- **Q1 H1**: Reindex is purely destructive-replace (DELETE+INSERT per file/source) at code-graph-db.ts:936/941/985; there is NO supersede path and edges carry no temporal columns. A bi-temporal model would add closed validity windows to `code_edges` (scan-time = transaction-time, commit-time = event-time per §12) instead of `DELETE`, letting "as-of-last-green-scan" impact queries survive a broken scan. The path-coupled symbol ID (indexer-types.ts:99) means renames currently masquerade as delete+create — the prime candidate for `supersedes` edges.
- **Q6 H1**: Readiness is ALREADY a hard gate at read time (query.ts:913 blocks on `!== 'fresh'`), but it is a binary freshness gate, not a generation watermark, and it degrades to a fallback tool rather than serving stale-but-usable data. The aionforge refinement is a generation-numbered watermark (stale→error with explicit generation) that could enable as-of-generation reads instead of all-or-nothing block-and-rescan.

## Next Focus
Iteration 2: Fetch/read aionforge `bi-temporal-model.md` + `consolidation.md` (if `external/` becomes available; else read GALADRIEL or the 001 packet's bi-temporal notes as proxy) and map the closed-validity-window edge model concretely onto `code_edges` (new columns vs shadow table) and the `replaceNodes`/`replaceEdges`/`pruneDanglingEdges` delete sites. Confirm Q3 by reading the query/context impact handlers for any ranking beyond flat weighted BFS. Read `parser-skip-list.ts` in full for B1/B2 transient/fatal semantics (Q2).
