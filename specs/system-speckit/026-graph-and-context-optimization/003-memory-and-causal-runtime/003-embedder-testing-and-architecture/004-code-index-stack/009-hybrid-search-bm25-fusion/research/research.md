# Research Synthesis: 016/011/003 Hybrid Search (BM25 + Semantic Fusion)

> **Status**: CONVERGED (3 of 3 iters complete) — 2026-05-18T07:52-07:54Z. iter 8-10 ran via cli-devin kimi-k2.6 (SWE-1.6 quota exhausted).

## Question

Does adding BM25 lexical search + fusion (RRF or weighted-linear) to CocoIndex's semantic retrieval improve hit-rate on the 18-pair fixture? What weights/normalization?

## Recommendation (one-liner)

Add **SQLite FTS5** lexical engine + **RRF fusion** (k=60 default, vector=0.7 / fts5=0.7), mirroring mk-spec-memory's `hybrid-search.ts` + `rrf-fusion.ts` proven pattern. Min-max normalize per channel before RRF. Ship opt-in (`COCOINDEX_HYBRID=true`), graduate to default-on after fixture validation.

## Concrete decisions

| Component | Decision | Iter source |
|---|---|---|
| **BM25 engine** | **SQLite FTS5** (zero new deps, mirrors mk-spec-memory `sqlite-fts.ts`, 3ms queries at 1.7M+ docs) | iter 8 |
| Rejected: tantivy (Rust) | Overkill (0.8ms latency but +Rust toolchain + new API surface + ~250MB RAM) | iter 8 |
| Rejected: rank-bm25 (Python) | Too slow (~5s/query at 350K samples; 0.03-4.46 QPS) | iter 8 |
| Rejected: manticore | Standalone daemon contradicts CocoIndex's embedded design | iter 8 |
| **Fusion algorithm** | **RRF** (Reciprocal Rank Fusion), k=60 default — rank-robust, no normalization needed | iter 9 |
| **Score weights** | vector=0.7, fts5=0.7 starting defaults; lexical weight 0.5-0.6 for code | iter 9, iter 10 |
| **Normalization** | Min-max per channel before fusion (matches `hybrid-search.ts:125` contract) | iter 10 |
| **Default vs opt-in** | Opt-in first (`COCOINDEX_HYBRID=true`); promote to default after fixture validation shows lift | iter 10 |

## Cross-cutting integration (iter 10 — applies to all 3 §3 phases)

**Sequencing recommendation:**

| Order | Phase | Action | Fixture target |
|---|---|---|---|
| 1st | 002 Chunking | Implement CHUNK_SIZE=1500 + per-language overrides; full reindex | Baseline measurement on new chunks |
| 2nd | 003 Hybrid (this) | Add FTS5 + RRF fusion; A/B against pure semantic | Measure lift vs chunking-only baseline |
| 3rd | 001 Reranker | Integrate cross-encoder (GTE) on hybrid top-k | Measure lift vs hybrid-only baseline |
| 4th | Combined | Run full pipeline against 18-pair fixture | Validate total lift estimate |

**Conservative lift estimate (cumulative):**
- Baseline: 38.9% (7/18)
- + Chunking (002): ~43-45% (8/18)
- + Hybrid (003): ~50% (9/18) [iter 10: "hybrid+reranker"]
- + Reranker (001): ~55% (10/18) [iter 10: "with chunking"]

**Integration touchpoints:**
- **Chunking → Hybrid**: Chunk boundaries determine FTS5 document granularity. Smaller (function-level) chunks may improve FTS5 recall but require RRF k adjustment.
- **Hybrid → Reranker**: Reranker receives RRF-fused top-k as input. Reranker scores REPLACE RRF score (not additive) — matches `stage2-fusion.ts` → `stage3-rerank.ts` contract.
- **All → Fixture**: 18-pair fixture is the shared quality substrate.

## Literature + mk-spec-memory precedent

- **mk-spec-memory proven pattern**: `lib/search/sqlite-fts.ts` + `lib/search/pipeline/stage2-fusion.ts` + `lib/search/rrf-fusion.ts` — production-proven. CocoIndex implementation should mirror this.
- **BEIR/TREC hybrid retrieval literature**: RRF dominates linear-weighted for code corpora (rank-robust, no normalization needed).
- **RRF k-value**: 60 is the standard default (Cormack et al. 2009, TREC blueprint). Higher k weights lower-ranked items more.

## Citations

<!-- ANCHOR:citations -->
- Cormack, Clarke, and Buettcher (2009), "Reciprocal Rank Fusion Outperforms Condorcet and Individual Rank Learning Methods", SIGIR.
- Local implementation precedent: `.opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts`.
- Local implementation precedent: `.opencode/skills/system-spec-kit/shared/algorithms/rrf-fusion.ts`.
<!-- /ANCHOR:citations -->

## Implementation hints (cross-referenced)

- **Code touchpoints**: `cocoindex_code/query.py:query_codebase()` extends to run KNN + FTS5 in parallel, normalize per channel, fuse via RRF, then apply existing post-fusion boosts (implementation_intent, canonical_paths). Returns same `QueryResults` contract.
- **FTS5 schema**: Add `code_chunks_fts` virtual table to existing SQLite DB. Populate during indexing. Query with `bm25()`.
- **Env tuning**: `COCOINDEX_HYBRID_VECTOR_WEIGHT`, `COCOINDEX_HYBRID_FTS5_WEIGHT`, `COCOINDEX_HYBRID_RRF_K`.
- **Refresh sync**: FTS5 needs incremental updates during CocoIndex refresh — deletions + insertions tracked alongside vec store. (Open question for impl phase.)

## Open questions (carry to implementation)

- Incremental FTS5 maintenance vs full rebuild during refresh cycles
- Language-specific tokenization (default `unicode61` is adequate for code; custom tokenizer not justified at this scale)
- Whether to expose `--hybrid` CLI flag in `ccc search` or daemon-level default (recommend env var first, then CLI flag)

## Source iterations

| Iter | Dimension | File | Findings | Note |
|---|---|---|---|---|
| 8 | bm25-engine-options | `iterations/iteration-008.md` | 8 | FTS5 recommended; tantivy/rank-bm25/manticore rejected with rationale |
| 9 | fusion-algorithms | `iterations/iteration-009.md` | 7 | RRF k=60 primary; lexical weight 0.5-0.6 for code |
| 10 | hybrid-synthesis-and-cross-cutting | `iterations/iteration-010.md` | 10 | CONVERGED — full §3 cross-cutting roadmap: chunking→hybrid→reranker; cumulative 38.9%→55%; mirror mk-spec-memory `stage2-fusion.ts` |

## Next steps

1. **Sequence after chunking (002) ships** — chunking changes affect FTS5 document boundaries
2. Refine `plan.md` + `tasks.md` from this synthesis
3. Implementation: 
   - Stage A: Add FTS5 table + populate during indexing (no fusion yet — measure pure FTS5 recall)
   - Stage B: Add RRF fusion to `query_codebase` (opt-in via env)
   - Stage C: Validate against 18-pair fixture; promote to default-on if lift confirmed
4. Post-impl: 5-iter deep-review
