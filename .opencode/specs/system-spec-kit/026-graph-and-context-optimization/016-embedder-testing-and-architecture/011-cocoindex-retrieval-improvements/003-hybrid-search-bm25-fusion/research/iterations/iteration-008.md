---
title: "Iter 8 — bm25-engine-options (016/011/003 research)"
iter_number: 8
dimension: bm25-engine-options
phase_id: "003-hybrid-search-bm25-fusion"
executor: cli-devin
model: swe-1.6
recipe: agent-config-deep-research-iter.json
---

# Iter 8 — bm25-engine-options

## 1. RESEARCH QUESTION

Which BM25 implementation should CocoIndex use for hybrid search (BM25 + semantic fusion), given a 127K-chunk corpus, Python codebase, sqlite-vec already in use, and the need to mirror mk-spec-memory's proven pattern? Compare on: (a) corpus scale support, (b) integration complexity, (c) language analyzer support, (d) RAM footprint.

## 2. SCOPE READ

| Source | Annotation |
|--------|------------|
| `decision-record.md` (ADR-001) | Baseline context: 38.9% hit rate, jina-code kept, 127,346 chunks indexed. Embedder swap not the dominant lever — structural changes needed. |
| `011-cocoindex-retrieval-improvements/spec.md` | Umbrella spec: §3 covers reranker, chunking, hybrid search. 3-4 iters allocated per child phase. |
| `003-hybrid-search-bm25-fusion/spec.md` | Phase spec: in-scope = BM25 implementation options, fusion algorithms, normalization; out-of-scope = Elasticsearch (too heavy). |
| `code-retrieval-fixture.json` | 18-pair fixture used as quality measurement substrate. Queries are natural language (e.g. "handler that accepts an embedder name"). |
| `bm25-index.ts` | mk-spec-memory's in-memory BM25 engine (custom tokenization, K1=1.2, B=0.75, simple stemmer). Production path actually uses sqlite-fts.ts. |
| `sqlite-fts.ts` | mk-spec-memory's FTS5 weighted BM25 wrapper: `bm25(memory_fts, 10.0, 5.0, 2.0, 1.0)` with per-column weights. Proven in production. |
| `stage2-fusion.ts` | mk-spec-memory's fusion pipeline: RRF via `fuseResultsMulti` from `@spec-kit/shared/algorithms/rrf-fusion`. Hybrid search already applies intent-aware scoring internally. |
| `rrf-fusion.ts` | RRF implementation: `1/(k + rank)` with k=40 default (tuned for ~1000-memory corpus), convergence bonus, calibrated overlap, source weights. |
| `query.py` | CocoIndex's current vector-only search using sqlite-vec KNN. No lexical lane exists yet. |
| `indexer.py` | CocoIndex's indexing pipeline: chunks stored in `code_chunks_vec` virtual table with auxiliary columns. |
| Web: dev.to/soytuber FTS5 1.7M patents | Evidence: FTS5 query ~3ms vs LIKE 10-30s on 1.73M records. Inverted index + BM25 ranking at scale. |
| Web: simonw/sqlite-tags-benchmark | Evidence: FTS5 at 3.28ms single-tag, 2.59ms AND on 100K rows. Storage 7MB. |
| Web: tantivy-py GitHub | Evidence: tantivy 2x faster than Lucene, <10ms startup, BM25 scoring, 17-language stemming. Requires Rust toolchain. |
| Web: bm25-benchmarks (xhluca) | Evidence: rank-bm25 0.03-4.46 QPS across datasets; OOM on large datasets. Not suitable for 127K chunks. |
| Web: rank-bm25 GitHub issue #27 | Evidence: rank-bm25 ~5s per query at 350K samples. Author recommends `retriv` or `bm25s` for scale. |
| Web: arxiv BM25S paper (2407.03618) | Evidence: BM25S (numpy/scipy) achieves 500x speedup over rank-bm25 via sparse matrices. Pure Python alternative if needed. |

## 3. FINDINGS

1. **SQLite FTS5 comfortably exceeds our corpus scale.** Evidence: dev.to article shows ~3ms query latency on 1.73M patent records; simonw's benchmark shows 3.28ms on 100K rows. Our 127K chunks are well within the sub-10ms comfort zone. The inverted index is disk-backed, so memory usage scales with index size (~1-2x text volume) rather than document count. <cite>dev.to/soytuber; simonw/sqlite-tags-benchmark</cite>

2. **FTS5 integration complexity is LOW — no new dependencies.** CocoIndex already uses sqlite-vec on a SQLite database. Adding an FTS5 virtual table is a schema-only change: `CREATE VIRTUAL TABLE code_chunks_fts USING fts5(content, file_path, tokenize='unicode61')`. Python's `sqlite3` module ships with FTS5 enabled on macOS and most modern builds. This mirrors mk-spec-memory's proven pattern in `sqlite-fts.ts` (lines 162-252). <cite>sqlite-fts.ts:162-252; query.py; indexer.py</cite>

3. **Tantivy is technically superior but overkill for this scale.** Evidence: tantivy-py README claims 2x faster than Lucene, 0.8ms query latency, 45K docs/sec indexing. However, it requires `pip install tantivy` (or build from source with Rust toolchain), introduces a foreign API (schema, index writer, query parser), and would add ~250MB RAM for 127K docs. The marginal latency gain (0.8ms vs 3ms) does not justify the dependency weight for an embedded CLI tool. <cite>quickwit-oss/tantivy-py; johal.in/tantivy article</cite>

4. **rank-bm25 (pure Python) is too slow at 127K chunks.** Evidence: GitHub issue #27 reports ~5s/query at 350K samples. The bm25-benchmarks repo shows rank-bm25 at 0.03-4.46 QPS, with OOM on larger datasets. While BM25S (arxiv 2407.03618) achieves 500x speedup via scipy sparse matrices, it would require building a custom integration from scratch. The in-memory approach also duplicates document storage already in SQLite. <cite>dorianbrown/rank_bm25#27; xhluca/bm25-benchmarks; arxiv:2407.03618</cite>

5. **Manticore and Elasticsearch are architecturally incompatible.** The phase spec already excludes Elasticsearch as "too heavy for embedded use." Manticore (Sphinx fork) is a standalone daemon — running a separate search server contradicts CocoIndex's embedded, zero-config design philosophy. <cite>003-hybrid-search-bm25-fusion/spec.md §3</cite>

6. **mk-spec-memory's production path uses FTS5, not in-memory BM25.** Evidence: `bm25-index.ts` contains an in-memory `BM25Index` class, but the actual search pipeline in `hybrid-search.ts` delegates lexical search to `fts5Bm25Search()` from `sqlite-fts.ts`. The in-memory index is a fallback/warmup layer. This validates FTS5 as the proven, production-tested choice. <cite>hybrid-search.ts:465-469; sqlite-fts.ts:162-252</cite>

7. **FTS5's unicode61 tokenizer is sufficient for code search, though not ideal.** unicode61 splits on non-alphanumeric characters, so snake_case identifiers like `apply_retrieval_rescue` become "apply", "retrieval", "rescue" (good), but camelCase like `handleEmbedderSet` stays as one token (acceptable for exact matching). Custom tokenizers for camelCase splitting are NOT supported by FTS5 — only built-in C tokenizers (unicode61, porter, trigram). For the 18-pair fixture, queries use standalone terms ("handler", "embedder", "name"), so unicode61 is adequate. If sub-token matching becomes critical, trigram tokenizer could be explored. <cite>SQLite FTS5 docs (sqlite.org/fts5.html); code-retrieval-fixture.json</cite>

8. **The mk-spec-memory RRF fusion pattern is directly portable.** `rrf-fusion.ts` implements `fuseResultsMulti` with k=40 (tuned for ~1000 docs), convergence bonus, and calibrated overlap. For 127K chunks, k=60 (Cormack et al. SIGIR 2009 default) may be more appropriate. The fusion algorithm is independent of the BM25 engine choice — any engine that produces a ranked list can feed into RRF. <cite>rrf-fusion.ts:37-38, 264-391</cite>

## 4. RECOMMENDATIONS

**Primary recommendation: Use SQLite FTS5 as the BM25 engine for CocoIndex hybrid search.**

Rationale summary:
- **Scale**: 127K chunks is trivial for FTS5 (proven at 1.7M+ docs, sub-10ms queries).
- **Integration**: Zero new dependencies; schema change only; mirrors mk-spec-memory's proven `sqlite-fts.ts` pattern.
- **Analyzers**: unicode61 tokenizer sufficient for fixture queries; porter stemmer available if needed.
- **RAM**: Disk-backed inverted index; no in-memory duplication.
- **Maintenance**: FTS5 is built into SQLite, so it inherits SQLite's stability and portability.

**Secondary recommendation: If custom tokenization (camelCase splitting) becomes a hard requirement in future iterations, evaluate tantivy as a drop-in replacement.** The integration cost is then justified by a specific feature gap, not by speculative performance needs.

**Implementation sketch for CocoIndex:**
1. In `indexer.py`, after declaring `code_chunks_vec` rows, also insert into `code_chunks_fts` (or use an external content FTS5 table mapping to `code_chunks_vec`).
2. In `query.py`, run a parallel (or sequential) `SELECT ... FROM code_chunks_fts WHERE code_chunks_fts MATCH ? ORDER BY bm25(code_chunks_fts)` query.
3. Fuse vec0 KNN results with FTS5 results via RRF (port the algorithm from `rrf-fusion.ts` to Python, or use a lightweight Python implementation).
4. Weighted BM25 on `content` and `file_path` columns, similar to mk-spec-memory's `[10.0, 5.0, 2.0, 1.0]` per-column weights.

**Estimated lift**: Hybrid search typically improves code retrieval recall by 10-20% in literature (though no direct citation for this exact fixture). On the 38.9% baseline (7/18 hits), a +2 to +4 hit improvement would push toward 50-55% (9-11/18). This is consistent with the reranker phase's independent estimate of +2 to +4 hits.

## 5. JSONL DELTA ROW

```json
{"iter":8,"phase":"complete","timestamp":"2026-05-18T07:49:00Z","dimension":"bm25-engine-options","phase_id":"003-hybrid-search-bm25-fusion","findings_count":8,"converged":false,"note":"FTS5 recommended as BM25 engine for CocoIndex; tantivy overkill, rank-bm25 too slow, manticore incompatible. Mirrors mk-spec-memory proven pattern."}
```

## 6. NEXT ITER PROMPT SUGGESTIONS

- **Iter 9 (fusion-algorithms)**: Probe RRF k-value sensitivity (k=40 vs k=60 vs k=∞) for 127K corpus; compare linear-weighted fusion (0.3 BM25 + 0.7 semantic) vs RRF; evaluate normalization strategies (min-max vs z-score vs none) for score alignment between vec0 distance and BM25 score.
- **Iter 10 (hybrid-synthesis-and-cross-cutting)**: Integrate hybrid lift estimate with reranker phase's GTE-inline recommendation and chunking-phase findings to produce combined structural-improvement roadmap and go/no-go decision.
