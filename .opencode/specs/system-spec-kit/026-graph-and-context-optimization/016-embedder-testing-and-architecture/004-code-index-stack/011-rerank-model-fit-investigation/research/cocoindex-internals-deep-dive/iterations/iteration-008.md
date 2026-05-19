# Iter 8 — Re-index cost analysis — does the fix require chunking/embedder rework or just env tuning?

## TL;DR (2-3 sentences)

Only Option B (chunking tuning and/or embedder swap) requires a full re-index: wipe the 692 MB `target_sqlite.db` + 528 MB CocoIndex framework state, rebuild all 86,635 chunks across 8,440 files, and regenerate embeddings — estimated 15–40 minutes wall-clock depending on device. Options A (jina-v3), C (jina+path-class), D (bench fix), and the hybrid-recalibration/query-expansion subsets of B do NOT touch the DB: they are env-var changes requiring a daemon restart at most, with zero data discarded. The decisive cost differentiator is that A/C/D/S(knob-only) each cost S dev-time + daemon restart, while B(chunking) costs M dev-time + full re-index + 1.2 GB DB rebuild.

## Question (restate the scoped RQ)

Re-index cost analysis. For each fix option in Iter 7, does the fix require a full re-index of the corpus (chunking tuning = yes; embedder swap = yes; rerank swap = no; FTS5 changes = depends; query expansion = no; hybrid recalibration = no — just env vars + restart)? Make the work cost CONCRETE: (a) approx wall time for a re-index of current corpus, (b) what gets thrown away (the DB has to be rebuilt), (c) operator burden (zero-downtime swap or daemon restart required?). For each option: cost line including re-index + dev time + operator time.

## Evidence (file:line citations + sqlite queries + JSONL grep results required)

### DB baseline: what "full re-index" means concretely

- **Disk footprint**: `target_sqlite.db` is 692 MB; the CocoIndex framework state at `.cocoindex_code/cocoindex.db/mdb/` is 528 MB; total `.cocoindex_code/` is 1.2 GB. A full re-index discards both. Citation: `ls -lh .cocoindex_code/target_sqlite.db` → 692M; `du -sh .cocoindex_code/cocoindex.db/mdb/` → 528M; `du -sh .cocoindex_code/` → 1.2G.
- **Index contents**: 86,635 vector rows (`code_chunks_vec`) and 86,635 FTS rows (`code_chunks_fts`) spanning 8,440 unique files. Estimated embedding storage is ~254 MB (86,635 × 768 × 4 bytes float32). Average chunk content length is 1,094 characters (max 1,500, min 58). Total raw content is ~95 MB. Citation: sqlite3 query — `SELECT COUNT(*) FROM code_chunks_vec` → 86635; `SELECT COUNT(DISTINCT file_path)` → 8440; `SELECT AVG(LENGTH(content))` → 1094; language partitions: typescript=65590, javascript=10132, python=3821, bash=3594, markdown=3464; embedding dim confirmed as float[768] via `sqlite_master`.
- **Path class distribution**: implementation=48,971, tests=37,481, spec_research=120, docs=63. Citation: sqlite3 query — `SELECT path_class, COUNT(*) FROM code_chunks_vec GROUP BY path_class`.
- **Embedding dimension note**: current DB schema is `embedding float[768]`; the current `BAAI/bge-code-v1` encoder produces 1,536 dimensions (Iter 5 confirmed dimension mismatch). Any embedder swap must wipe the DB and re-index from scratch because old and new vector dimensions are incompatible. Citation: `sqlite_master` → `embedding float[768]`; Iter 5 evidence at `iteration-005.md:41-45`.

### Indexing mechanics: how re-index works

- **Project creation**: `Project.create()` at `project.py:88-128` creates `.cocoindex_code/` directory, opens `target_sqlite.db` with `sqlite.connect(..., load_vec=True)`, provides embedder/DB/settings/gitignore contexts, and wires `indexer_main` into a CocoIndex App. It does NOT wipe an existing DB — the CocoIndex framework manages incremental updates through its own state DB at `cocoindex.db`.
- **Incremental update**: `Project.update_index()` at `project.py:41-74` calls `self._app.update()`, which is the CocoIndex framework's incremental-update mechanism. It watches snapshots and reports `num_adds`, `num_deletes`, `num_unchanged`, `num_reprocesses`. After update completes, FTS is synced via `sync_fts_from_code_chunks()`. This means that when ONLY file content changes (not chunking/embedder config), the framework re-processes only changed files.
- **Index pipeline**: `indexer_main()` at `indexer.py:320-365` mounts `code_chunks_vec` as a vec0 table, ensures `code_chunks_fts` exists, walks files through include/exclude/canonical matchers, and calls `process_file()` for each. `process_file()` at `indexer.py:245-317` reads chunk config from `getattr(config, "chunk_size", CHUNK_SIZE)`, chunks with `RecursiveSplitter`, generates embeddings via `await embedder.embed(chunk.text)`, and stores both vec rows and FTS rows.
- **What triggers re-index vs what doesn't**: The CocoIndex framework tracks file content hashes. Chunking parameter changes do NOT change file content, so `app.update()` may see files as unchanged and skip re-processing. The embedder is provided at `Project.create()` time (`project.py:92-128`) and is reused for both indexing and querying — switching the embedder requires a new `Project.create()` call with a new embedder, which implicitly needs a fresh DB (or manually wiped DB) because old vectors have wrong dimensions and are tied to the old embedder annotation (`CodeChunk.embedding` at `shared.py:189-202`). Citation: `indexer.py:33-39`, `indexer.py:245-317`, `indexer.py:320-365`, `project.py:41-74`, `project.py:88-128`, `shared.py:143-186`, `shared.py:189-202`.

### Config sensitivity: which env vars touch the DB vs which are query-time only

- **Chunking (requires re-index)**: `COCOINDEX_CODE_CHUNK_SIZE`, `COCOINDEX_CODE_CHUNK_OVERLAP`, `COCOINDEX_CODE_MIN_CHUNK_SIZE` — parsed at `config.py:370-387`, read by `process_file()` at `indexer.py:273-275`. Changing them requires re-index because chunk boundaries + stored embeddings both change.
- **Embedding model (requires re-index)**: `COCOINDEX_CODE_EMBEDDING_MODEL` — parsed at `config.py:335-346`, used to build the embedder at `shared.py:143-186` and provided to `Project.create()` at `project.py:92`. Changing it requires re-index because stored vectors are model-specific.
- **Hybrid/RRF (daemon restart only)**: `COCOINDEX_HYBRID`, `COCOINDEX_HYBRID_VECTOR_WEIGHT`, `COCOINDEX_HYBRID_FTS5_WEIGHT`, `COCOINDEX_HYBRID_RRF_K` — parsed at `config.py:388-406`, stored in the module-level `config` singleton at `config.py:464`. Read at query time by `query_codebase()` and `rrf_fuse()`. Changing them only requires daemon restart.
- **Rerank model (daemon restart only)**: `COCOINDEX_RERANK_MODEL`, `COCOINDEX_RERANK_TOP_K`, `COCOINDEX_RERANK_ADAPTER` — parsed at `config.py:407-429`. Used by `reranker.py:191-212` (`get_reranker_adapter()`) and `reranker.py:139-183` (`rerank()`). These are pure query-time: the reranker reads chunk content from the DB but never writes to it. Changing them only requires daemon restart.
- **Path-class boost (hot-reloadable, no restart needed)**: `COCOINDEX_RERANK_PATH_CLASS_BOOST` reads `os.environ` on every `rerank()` call at `reranker.py:33`. It can be toggled without daemon restart — just set the env var before the next search. `COCOINDEX_RERANK_PATH_CLASS_FACTORS` is also read per-call at `reranker.py:38-43`. Citation: `reranker.py:20-47`.
- **FTS5 tokenizer (requires re-index if schema changes)**: The FTS5 virtual table DDL hardcodes `tokenize='unicode61 remove_diacritics 2'` at `fts_index.py:25-37`. Changing the tokenizer requires dropping and recreating the FTS table, which requires re-index (FTS rows are populated in `process_file()` at `indexer.py:304-315`). The Python-level token regex `TOKEN_RE` at `fts_index.py:11-12` only affects query normalization, not indexing — changing it does NOT require re-index.

### Search-time read-only access proves rerank/query changes are DB-safe

- **Search without loaded project**: `ProjectRegistry.search()` at `daemon.py:456-521` opens a read-only SQLite connection when no project is loaded (`sqlite3.connect(f"file:{target_db}?mode=ro", uri=True)` at `daemon.py:532`). This confirms the search path never writes to the DB — all rerank/query changes are safe without re-index. Citation: `daemon.py:469-497`, `daemon.py:530-536`.
- **Reranker is read-only on DB**: `CrossEncoderRerankerAdapter.rerank()` at `reranker.py:139-183` reads `candidate.content` from memory (already loaded from DB by `query_codebase()`), scores pairs, and returns reordered results. No DB writes. `JinaRerankerAdapter` at `rerankers_jina_v3.py:127-190` follows the same read-only contract. Citation: `reranker.py:139-183`, `rerankers_jina_v3.py:127-190`.

### Prior iter evidence on fix classification

- **Iter 7 decision rubric**: Classified costs as A=S, B=M, C=S, D=S, and recommended A (jina-v3) + D (bench fix) as the highest-utility path. Latency deltas: jina-v3 +495ms median, +2,446ms p95 over baseline BGE. Citation: `iteration-007.md:21-22` (utility table), `iteration-007.md:29-31` (A+D recommendation).
- **Iter 6 root cause**: Concluded the failure is a two-factor interaction: BGE lexical-cue-density preference (factor f) amplified by chunking boundary suboptimality (factor a). Neither fix requires re-index for the reranker component; chunking fix requires re-index. Citation: `iteration-006.md:29-47`.
- **Iter 5 DB replay limitation**: Live DB has float[768] but bge-code-v1 produces 1,536 dim, confirming any embedder swap requires a fresh re-index against the new model. Citation: `iteration-005.md:41-45`.

## Findings (numbered, with citations)

### Option A — Production jina-v3 adapter packet

1. **Re-index required: NO.** Jina-v3 adapter is a query-time reranker swap. It reads chunk content from the DB via `query_codebase()` → `reranker.rerank()` path, scores pairs, and reorders results. No DB writes occur. Changing `COCOINDEX_RERANK_ADAPTER=jina_v3` or `COCOINDEX_RERANK_MODEL=jinaai/jina-reranker-v3` followed by daemon restart is sufficient. Citation: `reranker.py:191-212`, `reranker.py:139-183`, `rerankers_jina_v3.py:127-190`, `config.py:407-429`, `daemon.py:456-521`.

2. **What gets thrown away: NOTHING.** The 692 MB `target_sqlite.db` and 528 MB `cocoindex.db` state are untouched. All 86,635 chunks, 8,440 files, and ~254 MB of embeddings are preserved as-is. Citation: DB evidence — 692 MB target_sqlite.db, 528 MB cocoindex.db.

3. **Wall time for re-index: 0 minutes.** No re-index needed.

4. **Operator burden: daemon restart.** Stop daemon, set `COCOINDEX_RERANK_ADAPTER=jina_v3`, start daemon. The adapter is lazily loaded on first `rerank()` call. Estimated operator time: <1 minute. Citation: `reranker.py:191-212` (lazy adapter loading), `config.py:429` (rerank_adapter env var).

5. **Dev time: S.** Adapter code already exists as throwaway at `rerankers_jina_v3.py:1-50`. Production promotion requires: (a) remove throwaway markers from module header, (b) add `jina_v3` to default adapter registry at `reranker.py:204-208`, (c) write 012 packet with probe-5 regression investigation. All existing bench data validates it. Citation: `rerankers_jina_v3.py:1-23` (throwaway header), `reranker.py:204-208` (adapter dispatch).

6. **Total cost line: S dev + 0 min re-index + <1 min operator. ~0.1 engineer-days.**

### Option B — Candidate-set fix (chunking tuning sub-option)

7. **Re-index required: YES.** Chunking parameters (`COCOINDEX_CODE_CHUNK_SIZE`, `_CHUNK_OVERLAP`, `_MIN_CHUNK_SIZE`) control how `RecursiveSplitter` splits files at `indexer.py:277-283`. Different chunk boundaries produce different content, different content hashes, and different embeddings. The CocoIndex framework tracks file content hashes — changed chunk parameters don't change file content, so `app.update()` may skip unchanged files. A full DB wipe is required: `rm -rf .cocoindex_code/target_sqlite.db .cocoindex_code/cocoindex.db`. Citation: `indexer.py:33-39`, `indexer.py:245-317`, `indexer.py:320-365`, `config.py:370-387`, `project.py:41-74`, `project.py:88-128`.

8. **What gets thrown away: 1.2 GB.** `target_sqlite.db` (692 MB, containing 86,635 vector rows + FTS rows + indices), `cocoindex.db/mdb/` (528 MB, CocoIndex framework state tracking file hashes, chunk metadata, update watermarks). All embeddings (~254 MB of float32[768]) must be regenerated. Also WAL files if present. Citation: DB size evidence — 692 MB + 528 MB = 1.2 GB; `code_chunks_vec` schema → `embedding float[768]`; estimated embedding storage ~254 MB.

9. **Wall time for re-index: 15–40 minutes.** The bottleneck is embedding: 86,635 chunks must each be embedded. BGE-family models (bge-code-v1) process ~50–200 chunks/sec on MPS depending on batch size and device. At 100 chunks/sec: ~14.5 minutes. At 50 chunks/sec: ~29 minutes. This is purely the embedding computation time. File I/O (walk 8,440 files, read text, chunk with RecursiveSplitter) adds overhead. A conservative estimate is 15–40 minutes wall-clock on Apple Silicon (MPS device). On CPU, expect 40–90 minutes. Citation: DB evidence — 86,635 chunks total; `indexer.py:245-317` (process_file flow); `shared.py:143-186` (embedder construction with device selection at `config.py:352`).

10. **Operator burden: manual DB wipe + daemon restart + monitor re-index.** Steps: (1) stop daemon, (2) `rm -rf .cocoindex_code/target_sqlite.db .cocoindex_code/cocoindex.db`, (3) set new chunk env vars, (4) restart daemon (auto-triggers load-time indexing at `daemon.py:346-347`), (5) wait for `ccc status` to report indexing complete. No zero-downtime swap possible — search is unavailable or returns stale results during re-index. Estimated operator time: 5 minutes active + 15–40 minutes passive wait. Citation: `daemon.py:330-348` (get_project auto-index), `daemon.py:375-403` (run_index with progress), `project.py:41-74` (update_index streams progress).

11. **Dev time: M.** Current `RecursiveSplitter` only exposes `chunk_size`/`min_chunk_size`/`chunk_overlap` knobs (`indexer.py:33-39`, `config.py:370-387`). No tree-sitter or AST-aware splitting is available. If larger chunks (e.g., 4,000) do solve probe 14, dev time is S (env var change + re-bench). If they don't, dev time becomes L (write custom chunker, integrate, test). Realistic: M with 2–3 parameter-exploration iterations, each requiring re-index + full bench re-run. Citation: `indexer.py:33-39`, `config.py:370-387`.

12. **Total cost line: M dev + 15–40 min re-index + 5 min operator. ~1–2 engineer-days (with iteration).**

### Option B — Candidate-set fix (query expansion sub-option)

13. **Re-index required: NO (for query.py changes). YES (for FTS5 tokenizer schema changes).** Adding synonym maps, camelCase decomposition, or code-aware token splitting to `query.py:55-74` or before `embedder.embed()` at `query.py:579-585` touches only query-time code — no DB change. Changing the FTS5 virtual table tokenizer (currently `tokenize='unicode61 remove_diacritics 2'` at `fts_index.py:25-37`) requires dropping and recreating `code_chunks_fts`, which requires re-populating FTS rows (done in `process_file()` at `indexer.py:304-315`). The Python-level query token regex `TOKEN_RE` at `fts_index.py:11-12` can be changed without re-index. Citation: `query.py:55-74`, `query.py:579-585`, `fts_index.py:11-12`, `fts_index.py:25-37`, `indexer.py:304-315`.

14. **What gets thrown away: NOTHING (query.py only). FTS table only (tokenizer change).** For query.py changes: zero data loss. For FTS tokenizer changes: only the FTS table needs rebuild (FTS data is derivable from vec table content), not the vec table.

15. **Wall time: 0 min (query.py). ~5–10 min (FTS rebuild, content already indexed).**

16. **Operator burden: daemon restart (query.py). DB FTS rebuild (tokenizer).**

17. **Dev time: M–L.** No expansion infrastructure exists in `query.py` — only `_has_implementation_intent()` at `query.py:55-74`. Building synonym maps, camelCase splitters, or code-aware query rewriting requires: (a) design expansion plugin architecture, (b) integrate before embedding in `query.py:579-585` and before FTS normalization in `fts_index.py:88-103`, (c) test against Phase 2 probes, (d) ensure no regression on controls. Citation: `query.py:55-74`, `query.py:579-585`, `fts_index.py:88-103`.

18. **Total cost line: M–L dev + 0–10 min re-index + daemon restart. ~2–5 engineer-days.**

### Option B — Candidate-set fix (hybrid recalibration sub-option)

19. **Re-index required: NO.** `COCOINDEX_HYBRID_VECTOR_WEIGHT`, `COCOINDEX_HYBRID_FTS5_WEIGHT`, and `COCOINDEX_HYBRID_RRF_K` are env vars parsed at `config.py:388-406` and stored in the module-level `config` singleton. They are read at query time by `query_codebase()` → `rrf_fuse()` and do not affect stored data. Changing them only requires daemon restart. Citation: `config.py:388-406`, `fusion.py:42-87`, `query.py:594-640`.

20. **What gets thrown away: NOTHING.**

21. **Wall time: 0 minutes.**

22. **Operator burden: daemon restart.** Set env vars, restart daemon.

23. **Dev time: S.** Tuning weights and RRF k is parameter exploration only. Run bench with different values, compare hit/miss matrix. No code changes needed.

24. **Total cost line: S dev + 0 min re-index + daemon restart. ~0.25 engineer-days.**

### Option C — jina-v3 + path-class stack

25. **Re-index required: NO.** Same rationale as Option A. Path-class boost is a query-time score multiplier at `reranker.py:20-47`, hot-reloadable (reads env on every `rerank()` call, no daemon restart needed). Jina-v3 adapter is query-time only. Stacking them requires setting both `COCOINDEX_RERANK_ADAPTER=jina_v3` and `COCOINDEX_RERANK_PATH_CLASS_BOOST=1` simultaneously. Citation: `reranker.py:20-47`, `reranker.py:139-183`, `rerankers_jina_v3.py:140-190`, `config.py:421-428`.

26. **What gets thrown away: NOTHING.**

27. **Wall time: 0 minutes.**

28. **Operator burden: none (path-class is hot-reloadable) or daemon restart (jina adapter).** Path-class boost reads `os.environ` per call at `reranker.py:33` — can be toggled between searches. Jina adapter requires daemon restart (or pre-set env var).

29. **Dev time: S.** Both components exist; stacking is trivial. Verification: set both env vars, re-run bench, confirm no adapter interaction bugs (both call the same `_apply_path_class_boost()` helper at `reranker.py:20-47` and `rerankers_jina_v3.py:140`). However, Iter 7 proved path-class is a dead variable when all candidates share `implementation` class — multiply-by-1.00 is identity. So C adds complexity without proven value.

30. **Total cost line: S dev + 0 min re-index + <1 min operator. ~0.1 engineer-days.**

### Option D — Bench harness fix + fixture audit

31. **Re-index required: NO.** Bench harness changes touch only the `run-phase2-smoke.sh` script and fixture JSON files. No daemon, DB, or code changes. The path extraction regex at `run-phase2-smoke.sh:139-149` and probe fixture at `probe-subset.json` are external to the CocoIndex stack. Citation: `run-phase2-smoke.sh:117-168` (parser logic), `run-phase2-smoke.sh:31` (probe-subset.json reference).

32. **What gets thrown away: NOTHING.** Zero impact on the index, daemon, or search infrastructure.

33. **Wall time: 0 minutes.**

34. **Operator burden: none.** Bench script change only; re-run script to validate.

35. **Dev time: S.** Fixes are localized: (a) improve path extraction regex at `run-phase2-smoke.sh:139-149` to exclude import statements and mock data strings from candidate paths, (b) change probe 10 expected from `.js` dist to `.ts` source in `probe-subset.json`, (c) verify corrected fixtures against live DB presence with read-only SQLite queries — probe 10's `generate-context.ts` has 128 vec rows while `.js` dist has 0, confirming the fix. Citation: `settings.py:53-63` (default excludes include `**/dist`), sqlite3 query — `generate-context.js` has 0 rows, `generate-context.ts` has 128 rows.

36. **Total cost line: S dev + 0 min + 0 operator. ~0.1 engineer-days.**

### Synthesis: cost comparison table

37. **Concrete cost lines for all options**, ordered by total cost:

| Option | Sub-option | Re-index? | DB discarded | Wall time | Operator | Dev time | Total eng-days |
|--------|-----------|-----------|-------------|-----------|----------|----------|----------------|
| **A** | jina-v3 production | No | 0 MB | 0 min | restart | S | ~0.1 |
| **C** | jina+path-class | No | 0 MB | 0 min | restart | S | ~0.1 |
| **D** | bench fix | No | 0 MB | 0 min | none | S | ~0.1 |
| **B** | hybrid recalibration | No | 0 MB | 0 min | restart | S | ~0.25 |
| **B** | query expansion (code only) | No | 0 MB | 0 min | restart | M-L | ~2–5 |
| **B** | query expansion (+FTS tokenizer) | FTS only | ~100 MB FTS | 5–10 min | DB rebuild | M-L | ~2–5 |
| **B** | chunking tuning | **YES** | **1.2 GB** | **15–40 min** | DB wipe+restart+wait | M | ~1–2 |
| **B** | embedder swap | **YES** | **1.2 GB** | **15–40 min** | DB wipe+restart+wait | M | ~1–2 |

The decisive cut is between the top 4 rows (S cost, no re-index, daemon restart at most) and the bottom 2 rows (M cost, full re-index, 1.2 GB discard, 15–40 minute wall-clock wait). This cost asymmetry strongly reinforces Iter 7's A+D recommendation: jina-v3 wins on both utility (0.759 vs 0.653) AND implementation cost (S vs M).

38. **Re-index cost is non-linear with corpus size.** The 86,635 chunks / 8,440 files in this corpus produce ~254 MB of embeddings (float32[768]). If the embedder were switched to a 1,536-dim model (like current bge-code-v1), embedding storage would double to ~508 MB, and total DB size would grow proportionally. If the corpus grows (more repos, more skills), re-index time scales linearly with chunk count, assuming constant embedding throughput. The 15–40 minute estimate is for the current corpus on Apple Silicon MPS; on CPU or larger corpora, multiply accordingly. Citation: DB evidence — 86,635 chunks × 768 × 4 = 254 MB; projected 86,635 × 1,536 × 4 = 508 MB.

## Gaps for Next Iter (or Convergence Claim if this is iter 10)

- **G1**: Measure actual wall-clock time for a full re-index with the current BGE embedder on the dev machine (Apple Silicon). The 15–40 minute estimate is based on typical SentenceTransformer throughput ranges; a single timed run with `ccc index` after `rm target_sqlite.db cocoindex.db` would provide a point measurement.
- **G2**: Verify whether the CocoIndex framework's `app.update()` detects chunk config changes as "files changed." If it does NOT, a full DB wipe is the only safe path. If the framework has a "force re-index all" flag (separate from incremental `update()`), document it to reduce operator burden.
- **G3**: Investigate whether `target_sqlite.db` can be rebuilt while the daemon serves search from a previous version (zero-downtime re-index). The current architecture at `daemon.py:456-521` uses a single DB path; a blue/green DB swap would require changes to `Project.create()` and `ProjectRegistry.search()`.
- **G4**: The current live DB has float[768] embeddings but the active bge-code-v1 model produces 1,536 dimensions — this mismatch means a fresh re-index is ALREADY needed for any embedder-consistent benchmark. Document whether the 011 packet should run a re-index before Phase 3 to bring the DB schema in line with the model, or whether Phase 2's bench was run against a different DB that has since been replaced.
- **G5**: Probe 5 regression mitigation under jina-v3 (3.2x score gap between expected file and stress test) may involve jina-specific document clipping tuning (`max_chars` knob at `rerankers_jina_v3.py:45`). This is a query-time parameter (no re-index) but needs investigation.

## JSONL Delta Row (paste the row at the end for verification)

```json
{"iter_id":"008","timestamp_utc":"2026-05-19T11:00:00Z","executor":"cli-opencode-deepseek-v4-pro-high","status":"PASSED","findings_count":9,"gaps_count":5,"primary_evidence_files":[".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py",".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py",".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/project.py",".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py",".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py",".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers_jina_v3.py",".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fts_index.py",".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py",".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py",".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py",".cocoindex_code/target_sqlite.db",".cocoindex_code/settings.yml",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/cocoindex-internals-deep-dive/iterations/iteration-005.md",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/cocoindex-internals-deep-dive/iterations/iteration-006.md",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/cocoindex-internals-deep-dive/iterations/iteration-007.md",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/run-phase2-smoke.sh"]}
```
