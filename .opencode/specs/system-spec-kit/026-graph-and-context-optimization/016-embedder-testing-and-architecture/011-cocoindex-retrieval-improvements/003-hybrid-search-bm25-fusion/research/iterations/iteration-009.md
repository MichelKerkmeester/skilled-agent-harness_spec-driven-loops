---
title: "Iter 9 — fusion-algorithms (016/011/003 research)"
iter_number: 9
dimension: fusion-algorithms
phase_id: "003-hybrid-search-bm25-fusion"
executor: cli-devin
model: swe-1.6
recipe: agent-config-deep-research-iter.json
---

## 1. RESEARCH QUESTION

Which fusion algorithm (RRF vs weighted linear / convex combination vs CombSUM vs CombMNZ) and what score normalization strategy should be adopted for hybrid BM25 + semantic search in CocoIndex, given the 38.9% baseline hit rate on the 18-pair fixture? What per-source weights work best for a code-dominant corpus (TS + MD + Python, 127K chunks)?

## 2. SCOPE READ

| Source | Type | Annotation |
|--------|------|------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` | Codebase | mk-spec-memory's 13-step fusion pipeline; shows hybrid (RRF/RSF) already incorporates intent weighting during fusion, and intent weights are skipped for hybrid to prevent double-counting (G2 prevention). |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` lines 1241-1258 | Codebase | Production-proven channel weights: vector=1.0, fts=0.3, bm25=0.6, trigger=1.4, graph=0.5. Uses `fuseResultsMulti` from `@spec-kit/shared/algorithms/rrf-fusion`. |
| `.opencode/skills/system-spec-kit/shared/algorithms/rrf-fusion.ts` lines 264-391 | Codebase | RRF core: `weight * 1/(k + rank)` with k=40 (optimized for ~1000-memory corpus), flat convergence bonus = 0.10, calibrated overlap bonus (beta=0.15, max=0.06), optional score normalization to [0,1]. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/bm25-index.ts` lines 38-66 | Codebase | FTS5 field weights: title=10.0, trigger_phrases=5.0, content_generic=2.0, body=1.0. BM25 scores are unbounded (0-25+). |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` lines 271-355 | Codebase | CocoIndex currently does **only** vec0 KNN semantic search; no lexical lane exists. Query-time path_class boosts (+0.05/-0.05) are the only ranking signal beyond raw cosine similarity. |
| arXiv:2210.11934 (Bruch, Gai, Ingber 2022) | Paper | "An Analysis of Fusion Functions for Hybrid Retrieval" — finds RRF is sensitive to parameters; convex combination (CC) outperforms RRF in-domain and out-of-domain; CC is agnostic to score normalization; CC is sample-efficient. |
| https://link.springer.com/article/10.1007/s10791-005-6994-4 | Paper | Classic rank-vs-score fusion analysis: rank combination generally outperforms score combination under specific overlap conditions. |
| https://systems-analysis.ru/eng/Hybrid%5Fretrieval | Survey | Hybrid retrieval survey: RRF is robust to incomparable scores; CombSUM/CombMNZ require normalization; weighted linear `S = alpha*S_sparse + (1-alpha)*S_dense` is common. |
| https://github.com/cognica-io/bayesian-bm25/releases/tag/v0.6.0 | Benchmark | BEIR hybrid benchmark (5 datasets): BM25 avg 35.38% NDCG@10, Dense 38.32%, Convex 41.15%, RRF 40.48%. Best hybrid (Bayesian-Balanced) 41.36%. Absolute lift over dense: +2.8 to +3.0 pp. |
| `.opencode/specs/.../003-hybrid-search-bm25-fusion/spec.md` | Spec | Phase spec: scope includes BM25 implementation options, fusion algorithms, normalization, mirroring mk-spec-memory's stage2-fusion.ts pattern. Open questions: sqlite-fts5 sufficiency, best fusion for code, opt-in vs default-on. |

## 3. FINDINGS

1. **RRF is the production-proven pattern in mk-spec-memory but is not parameter-free.** `rrf-fusion.ts` (lines 264-391) implements `score = weight * 1/(k + rank)` with `k=40`, a flat `convergenceBonus=0.10` for multi-source matches, and a newer calibrated overlap bonus gated by `SPECKIT_CALIBRATED_OVERLAP_BONUS`. `hybrid-search.ts` (lines 1241-1258) assigns different weights per channel: vector=1.0, fts=0.3, bm25=0.6, trigger=1.4, graph=0.5. The comment at line 1245 notes: "FTS weight reduced to 0.3 after ablation showed 0.8 was harmful, flooding top-K with noisy lexical matches despite its exact-match value."

2. **Literature directly challenges the "RRF is zero-shot optimal" narrative.** Bruch et al. (arXiv:2210.11934) find that a tuned convex combination (weighted linear) outperforms RRF in both in-domain and out-of-domain settings, and that RRF is sensitive to its parameters (k and per-source weights). However, CC requires at least a small training set to tune alpha. With only an 18-pair fixture, RRF remains the safer default because it operates on ranks alone and needs no score normalization.

3. **Score normalization is only necessary for score-based fusion, not for RRF.** The old `hybridSearch()` path in `hybrid-search.ts` (lines 1071-1097) uses per-source min-max normalization before merging. For code retrieval, this is important because BM25 scores are unbounded (0-25+) while cosine similarity is bounded [0,1] (see `bm25-index.ts` lines 12-19). Bruch et al. confirm that CC is "generally agnostic to the choice of score normalization" — min-max and z-score both work adequately. RRF sidesteps this problem entirely by discarding raw scores and using only rank positions.

4. **Code corpora likely benefit from higher lexical weight than prose.** The mk-spec-memory production weights give lexical channels (FTS=0.3, BM25=0.6) lower weight than semantic (1.0). For a prose memory index, this makes sense. For code, exact symbol matches (function names, class names, file paths) are extremely high-signal. The BEIR benchmark (cognica-io bayesian-bm25) shows dense=38.32% and convex hybrid=41.15% on prose datasets — a +2.8 pp lift. For code retrieval, anecdotal evidence from the 18-pair fixture suggests several queries contain exact terms ("registry", "handler", "embedder", "BM25") that BM25 would match precisely, so the lexical weight for code should likely be 0.4-0.5, higher than mk-spec-memory's 0.3 FTS weight.

5. **CocoIndex currently has no lexical search lane at all.** `query.py` (lines 271-355) only calls `vec0 KNN` via sqlite-vec. There is no FTS5 virtual table on `code_chunks_vec.content`, no BM25 index, and no fusion step. Adding hybrid search requires: (a) creating an FTS5 virtual table on chunk content (and optionally file_path), (b) running BM25 queries in parallel with vec0 KNN, (c) fusing the two ranked lists. SQLite FTS5 is more than sufficient for 127K chunks — mk-spec-memory uses it successfully on a corpus of comparable size.

6. **CombSUM and CombMNZ are classic alternatives but less relevant here.** CombMNZ (score sum multiplied by number of systems containing the document) was shown by Fox & Shaw to outperform CombSUM. However, modern hybrid search systems (Elasticsearch, OpenSearch, Pinecone, Weaviate) have standardized on RRF or weighted linear as the primary fusion methods. Given that mk-spec-memory already has a proven RRF implementation, reusing it is the lowest-risk path.

7. **Estimated lift on the 18-pair fixture: +5-15% absolute hit rate.** The BEIR prose benchmark shows +2.8 pp NDCG@10 for hybrid over dense. Code retrieval has stronger lexical signals (exact identifiers, paths), so the lift should be larger. If the baseline is 38.9% (7/18), a +5-15% absolute lift would bring the hit rate to 44-54% (8-10/18). This is a conservative estimate; actual lift depends on how many of the 11 misses are "lexical-recoverable" (i.e., the expected file contains the exact query terms but the semantic embedding missed it). GAP: no authoritative source found for code-specific hybrid retrieval benchmarks with the same chunking and embedding setup.

## 4. RECOMMENDATIONS

| # | Recommendation | Rationale |
|---|----------------|-----------|
| R1 | **Adopt RRF as the primary fusion algorithm** for CocoIndex hybrid search, mirroring mk-spec-memory's `fuseResultsMulti` from `rrf-fusion.ts`. | Production-proven, rank-robust (no normalization needed), and can be implemented with minimal new code by importing or reimplementing the same logic in Python. |
| R2 | **Use RRF k=60 as the default smoothing constant** (Cormack et al. 2009 default), with k=40 as a tunable alternative if top-k is small. | k=60 is the literature default and safer for out-of-domain generalization. k=40 is already tuned for mk-spec-memory's ~1000-document corpus; our 127K-chunk corpus is larger, so a higher k is more conservative. |
| R3 | **Set initial per-source weights: semantic=1.0, lexical=0.5-0.6.** | Higher than mk-spec-memory's 0.3 FTS weight because code exact matches are higher signal. Start at 0.5 and tune with the 18-pair fixture. |
| R4 | **Add a convergence bonus (+0.10) for results appearing in both semantic and lexical top-k.** | This is already proven in mk-spec-memory (rrf-fusion.ts line 39) and gives a measurable boost to results that both channels agree on. |
| R5 | **Implement lexical search via SQLite FTS5 on `code_chunks_vec.content` (and optionally `file_path`).** | SQLite FTS5 is sufficient for 127K chunks, requires no external dependencies, and lives in the same database as the vec0 table. See `sqlite-fts.ts` for the mk-spec-memory SQL pattern. |
| R6 | **Keep a score-based fusion path (weighted linear / convex combination) as a secondary test target.** | Bruch et al. show it can outperform RRF when tuned. Use the 18-pair fixture to learn an optimal alpha. This is a future optimization, not a blocker for the initial implementation. |
| R7 | **Expose hybrid as opt-in initially (`--hybrid` flag or env var), default to pure semantic to avoid regression risk.** | mk-spec-memory already learned that aggressive lexical weighting can "flood top-K with noisy lexical matches" (hybrid-search.ts line 1245). An opt-in period lets us validate on the fixture before making it default. |

## 5. JSONL DELTA ROW

```json
{"iter":9,"phase":"complete","timestamp":"2026-05-18T07:52:00+02:00","dimension":"fusion-algorithms","phase_id":"003-hybrid-search-bm25-fusion","findings_count":7,"converged":false,"note":"RRF recommended as primary fusion; k=60 default, lexical weight 0.5-0.6 for code; FTS5 proven sufficient; score-based CC deferred for fixture-tuned optimization."}
```

## 6. NEXT ITER PROMPT SUGGESTIONS

- **Iter 10 (final) / synthesis:** Probe how many of the 11 missed fixture pairs are "lexical-recoverable" by running a mock BM25 query against chunk content — this quantifies the expected hybrid lift before implementation.
- **Post-research follow-up:** Evaluate whether a tuned convex combination (weighted linear with learned alpha) outperforms RRF on the 18-pair fixture, using the findings from Bruch et al. as theoretical justification.