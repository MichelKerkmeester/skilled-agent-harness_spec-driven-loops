# Iteration 2: C2 vector layer

## Focus
Revalidate the C2 vector-layer claims from the baseline research docs (written against Turso v0.5.0) against the vendored Turso source at v0.7.0-pre.6: (C2a) whether native vector indexing (ANN/DiskANN) has shipped or queries remain brute-force, (C2b) native vector function semantics vs sqlite-vec's vec0 (`vec_distance_cosine`, `FLOAT[dim]`) and a concrete migration path for the `vec_memories` tables, and (C2c) whether the brute-force scaling-threshold table in 003 §Gap 1 / 002 §5 remains valid for a ~10k-memory corpus.

## Findings
- **KNOWN | UNCHANGED (C2a, gap 1)** — No native vector index at v0.7.0-pre.6; similarity search is still a full linear scan. The vendored docs state it verbatim: "Vector indexes are not yet supported. All similarity searches use a linear scan over the table." [SOURCE: .opencode/specs/z_future/sqlite-to-turso/external/turso-main/docs/sql-reference/functions/vector.mdx:392-394]. COMPAT.md's vector section lists only scalar creation/distance/utility functions — no index entries [SOURCE: external/turso-main/COMPAT.md:1005-1018]. `rg` for `diskann|vector_top_k|libsql_vector_idx` across `core/` and `cli/` returns zero engine hits.
- **NEW (C2a)** — Index groundwork exists but is experimental/disabled. The core tree has a pluggable index-method extension point containing a *toy* sparse-IVF vector index [SOURCE: external/turso-main/core/index_method/mod.rs, core/index_method/toy_vector_sparse_ivf.rs, tests/integration/index_method/mod.rs]. Separately, the JS conformance suite contains a `test.skip`'d test exercising the full libSQL ANN surface — `FLOAT32(8)` column, `CREATE INDEX ... libsql_vector_idx(embedding)`, and `vector_top_k('t_idx', ...)` [SOURCE: external/turso-main/testing/conformance/javascript/__test__/sync.test.js:277-300]. Turso is converging on the libSQL-compatible ANN API (the API baseline W1c relies on), but it is not callable in the local engine yet.
- **PARTIAL | CHANGED (C2b)** — The native function surface is broader than the baseline recorded. Baseline 003 listed only `vector_distance_cos` and `vector_distance_l2` [SOURCE: research/003 - gaps-and-workarounds-sqlite-to-turso.md:42-43]. v0.7.0-pre.6 additionally ships `vector_distance_dot` (negative dot product), `vector_distance_jaccard` (binary vectors), quantized creation functions `vector8` and `vector1bit`, plus `vector_extract`, `vector_concat`, `vector_slice` [SOURCE: external/turso-main/docs/sql-reference/functions/vector.mdx:88-228; COMPAT.md:1011-1018].
- **NEW (C2b)** — Binary blob format is migration-compatible with sqlite-vec for float32. Turso's dense f32 vector blob is a raw little-endian f32 array with length exactly `dims * 4` — no header, no trailing type byte (only the Float8/Float1Bit formats carry trailing metadata bytes 0x04/0x03) [SOURCE: external/turso-main/core/vector/vector_types.rs:54,67,213,346-347, `from_f32` at :90]. sqlite-vec stores float32 vectors in the same raw f32 LE layout, so existing `vec_memories` embedding blobs (and `to_embedding_buffer` output) can be bulk-copied without re-encoding.
- **KNOWN | UNCHANGED (C2b)** — Distance semantics are drop-in score-compatible: `vector_distance_cos` is defined as `1 - cosine_similarity` [SOURCE: external/turso-main/docs/sql-reference/functions/vector.mdx:134-136], the same definition sqlite-vec's `vec_distance_cosine` uses, so result ordering and any stored score thresholds are preserved.
- **NEW (C2b)** — Concrete `vec_memories` migration path, refined vs baseline W1a: (1) replace `CREATE VIRTUAL TABLE vec_memories USING vec0(... FLOAT[384] ...)` (vector-index-schema.ts:1176-1179 per 003:31-36) with a plain table `(rowid INTEGER PRIMARY KEY, embedding BLOB)` — the repo's per-dimension fallback blob tables (`vector_table_name_for_profile`) already model this [SOURCE: context/context-report.md:101]; (2) bulk-copy blobs as-is (format-compatible, above); (3) rewrite KNN queries from vec0 `MATCH`/`k=` and `vec_distance_cosine` calls (vector-index-queries.ts:403,407 per context-report.md:113) to `SELECT rowid, vector_distance_cos(embedding, ?) AS d FROM ... ORDER BY d ASC LIMIT k`; (4) dimension enforcement moves from DDL (`FLOAT[384]`) to runtime — distance functions error on dim mismatch [SOURCE: vector.mdx:145] — so keep the existing per-dimension table routing; (5) the `writeVectorsToKnn` transaction-wrapped delete+insert blocker (reindex.ts:370 per context-report.md:34) dissolves into ordinary DML once vec0 is gone. Caveat: the ATTACH/`VACUUM INTO` shard blockers (context-report.md:41,46-47) are separate gaps and unchanged by the vector layer.
- **KNOWN | UNCHANGED (C2c)** — The 003/002 §5 scaling table remains the operative planning model: 2k <10ms; 5k ~15-25ms; 10k ~50-100ms (marginal); 50k ~300-500ms (no); 100k 700ms+ (no) [SOURCE: research/003 - gaps-and-workarounds-sqlite-to-turso.md:100-106; research/002 - recommendations-sqlite-to-turso-migration.md:118]. Nothing in the vendored tree changes the O(n) premise (linear scan confirmed above). For a ~10k corpus the verdict is still "marginal". Distance ops have dedicated Rust implementations (core/vector/operations/distance_cos.rs etc.), so absolute milliseconds may beat the estimates, but no benchmark was run — treat the table's shape as high-confidence, its absolute numbers as medium-confidence.
- **NEW (C2c)** — A mitigation lever absent from baseline workarounds W1a-W1d: quantized vectors (`vector8`, `vector1bit` + `vector_distance_jaccard`) [SOURCE: vector.mdx:88-126,215-228] enable a cheap coarse-scan → exact-rerank two-stage pattern that could push brute-force acceptability past 10k without waiting for ANN.

## Ruled Out
- DiskANN (or any production ANN index) shipped in Turso core at v0.7.0-pre.6 — zero engine references; only a skipped JS conformance test mentions the libSQL ANN API.
- `vector_top_k` / `libsql_vector_idx` being locally usable — the sole occurrence is inside `test.skip` (sync.test.js:277).
- Baseline 003:45 "No ANN index, no HNSW, no IVF" is slightly stale in letter (a *toy* sparse-IVF exists behind the experimental index_method extension point) but holds in substance: nothing production-usable.

## Dead Ends
- WebSearch is permission-blocked in this seat — post-vendor state (releases after v0.7.0-pre.6, the "20.9% of 1.0 milestone" roadmap figure at 003:45, GitHub issue activity) could not be re-verified this iteration.
- CHANGELOG.md vector-history grep was lost to a sandbox-blocked compound Bash command; not retried under budget.

## Sources Consulted
- external/turso-main/docs/sql-reference/functions/vector.mdx:1-400 (full read)
- external/turso-main/COMPAT.md:1005-1018 (vector section grep)
- external/turso-main/core/vector/vector_types.rs:28-397 (serialization grep)
- external/turso-main/core/index_method/{mod.rs, toy_vector_sparse_ivf.rs}, tests/integration/index_method/mod.rs (existence/naming)
- external/turso-main/testing/conformance/javascript/__test__/sync.test.js:265-300
- research/003 - gaps-and-workarounds-sqlite-to-turso.md:21-110 (Gap 1 + scaling table), 249-280 (Gap 4)
- research/002 - recommendations-sqlite-to-turso-migration.md:85-128 (§P2-P4, §5 Risks)
- context/context-report.md:8, 30-47, 97-127, 142-155 (vector blocker map)
- Web: none (permission-blocked)

## Reflection
- What worked: The vendored docs (`vector.mdx` linear-scan note) plus COMPAT.md plus targeted source greps answered all three questions decisively; the blob-format check in `vector_types.rs` produced the single most actionable new fact (no re-encoding needed for f32 embeddings).
- What failed: WebSearch permission denied, so post-vendor web state is unverified; two Bash calls were burned on a stale working directory and a sandbox-blocked compound command.
- Confidence: high — for the source-tree verdicts (C2a unchanged, C2b semantics/format parity, linear-scan premise); medium only on the scaling table's absolute latency numbers (not re-benchmarked) and post-vendor state.

## Recommended Next Focus
Revalidate the C3 FTS layer (Tantivy `fts_score` index-time weights, `NoMergePolicy`/OPTIMIZE INDEX burden, AND/OR multi-term default) against the vendored 0.7.0-pre.6 tree, plus a CHANGELOG.md sweep to date the vector-function additions.
