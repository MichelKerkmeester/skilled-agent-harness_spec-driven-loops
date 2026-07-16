---
title: "Iter 3 — reranker-topk-sweep (016/011/001 research)"
iter_number: 3
dimension: reranker-topk-sweep
phase_id: "001-reranker-integration"
executor: cli-devin
model: swe-1.6
recipe: agent-config-deep-research-iter.json
---

# RESEARCH QUESTION

What top-K candidate depth should CocoIndex rerank with a cross-encoder — K=10, K=20, K=50, or K=100 — given lift-vs-latency tradeoffs, the current 18-pair fixture baseline, and the phase target that reranking add less than 500 ms to p95 latency?

# SCOPE READ

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/003-comparison-measure/decision-record.md` — ADR-001 benchmark context: direct `ccc search --limit 5`, 7/18 top-3 hit rate for both jina-code and gemma, latency baseline.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/spec.md` — umbrella scope: structural improvements affect all embedders; reranker expected as one candidate +10-20 pp lever.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/007-reranker-integration/spec.md` — child scope: cross-encoder model selection, integration after embedder top-K, added p95 target under 500 ms, and explicit K question.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/002-baseline-fixture/evidence/code-retrieval-fixture.json` — 18 query/expected-source pairs used for quality measurement.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` — current CocoIndex query candidate-fetch, lightweight scoring, dedup, and “rerank” telemetry stage.
- BEIR example + paper — BEIR reranking baseline reranks top-100 BM25 hits with a cross-encoder; paper reports BM25+CE top-100 and broad nDCG gains.
- MTEB two-stage reranking docs — MTEB converts retrieval predictions to reranking tasks with `top_k=100`.
- Sentence Transformers Retrieve & Re-Rank docs + CrossEncoder docs — retrieve a candidate set such as 100, then score each query/document pair; `rank(..., top_k=...)` can return all or a subset after scoring.
- MS MARCO dataset docs — reranking tasks include top-100 document reranking and top-1000 passage reranking, separating reranker evaluation from first-stage retrieval.
- Hugging Face / model-card latency sources for `cross-encoder/ms-marco-MiniLM-L6-v2`, `jinaai/jina-reranker-v2-base-multilingual`, `BAAI/bge-reranker-v2-m3`, and `mixedbread-ai/mxbai-rerank-large-v2`.

# FINDINGS

1. The local benchmark baseline is weak enough that reranking is plausibly a major lever, but only if the correct chunks are already in the candidate pool. ADR-001 used direct `ccc search --limit 5` calls, and both `jina-code` and `gemma` produced 7/18 top-3 hits (38.9%) on the fixture; jina-code median/p95 were 404/590 ms, gemma median/p95 were 398/4011 ms. Evidence: `.opencode/.../decision-record.md:55`, `.opencode/.../decision-record.md:82-85`.

2. The parent spec already frames reranking as a structural improvement that should affect all embedders and estimates typical reranker lift at +10-20 percentage points. That puts a realistic target near 9-11 hits out of 18, or 50.0-61.1% top-3 hit rate, if first-stage recall contains enough missed targets. Evidence: `.opencode/.../004-code-index-stack/spec.md:50-53`, `.opencode/.../004-code-index-stack/spec.md:76-80`.

3. The child spec constrains this K sweep more tightly than BEIR/MTEB defaults: integration is after embedder top-K retrieval and before result return, rerank latency target is added p95 under 500 ms, and top-K size is explicitly open at K=10/K=20/K=50. Evidence: `.opencode/.../001-reranker-integration/spec.md:57-63`, `.opencode/.../001-reranker-integration/spec.md:73-79`, `.opencode/.../001-reranker-integration/spec.md:105-109`.

4. CocoIndex currently over-fetches by only `4 * (limit + offset)` before dedup/ranking, so a normal `limit=5` top-3/top-5 workflow currently exposes about 20 raw vector rows before local score boosts and dedup. That makes K=20 the closest fit to the current retrieval shape, while K=50/K=100 require intentionally widening first-stage retrieval beyond current behavior. Evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:310-320`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:339-354`.

5. The current CocoIndex “rerank” stage is not a neural cross-encoder; it is local score adjustment plus dedup. The `_ranked_result` function adjusts vector-derived score with implementation/docs/canonical-path boosts, and `_dedup_and_rank_rows` sorts by that adjusted score before slicing the requested window. Evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:181-227`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:230-268`.

6. BEIR and MTEB both make K=100 the common evaluation default, not necessarily the production default. BEIR’s reranking example retrieves “Top-100 docs using BM25” and reranks “Top-100 docs using Cross-Encoder”; the BEIR paper states BM25+CE reranks the top-100 first-stage BM25 hits. MTEB’s two-stage reranking guide converts retrieval output to reranking with `top_k=100` and reports an example NDCG@10 improvement from 0.286 to 0.338. Evidence: https://github.com/beir-cellar/beir/blob/main/examples/retrieval/evaluation/reranking/evaluate_bm25_ce_reranking.py, https://arxiv.org/pdf/2104.08663, https://embeddings-benchmark.github.io/mteb/get_started/advanced_usage/two_stage_reranking/.

7. Cross-encoder latency scales with scored pairs, so K is a direct latency multiplier. Sentence Transformers states the retriever first returns a large list such as 100 candidates, then a CrossEncoder scores all candidates; it also notes scoring thousands or millions of pairs is slow. Vespa’s cross-encoder guide states time complexity increases linearly with the number of documents compared to the query. Evidence: https://github.com/huggingface/sentence-transformers/blob/main/examples/sentence_transformer/applications/retrieve_rerank/README.md, https://vespa-engine.github.io/pyvespa/examples/cross-encoders-for-global-reranking.html.

8. Latency budgets differ sharply by model class. `cross-encoder/ms-marco-MiniLM-L6-v2` reports 1800 docs/sec on V100, implying ~5.6 ms for K=10, ~11.1 ms for K=20, ~27.8 ms for K=50, and ~55.6 ms for K=100 before local overhead on comparable GPU hardware; `mxbai-rerank-large-v2` reports 0.89 s query latency on A100 in its benchmark table, already above the phase’s <500 ms added p95 target if that latency applies locally. Evidence: https://huggingface.co/cross-encoder/ms-marco-MiniLM-L6-v2, https://huggingface.co/mixedbread-ai/mxbai-rerank-large-v2.

9. Model-card capability does not remove the need for local K measurement. Jina v2 is a cross-encoder reranker with up to 1024-token context and benchmark claims including code retrieval; BGE v2-m3 is multilingual, lightweight/easy deploy, and commonly shown with 512-token transformer usage or 1024-token FlagEmbedding usage. However, neither source gives authoritative Apple MPS latency for this repo’s chunk lengths. Evidence: https://huggingface.co/jinaai/jina-reranker-v2-base-multilingual, https://huggingface.co/BAAI/bge-reranker-v2-m3.

10. The fixture mix means K should be evaluated by candidate-depth recall, not just final top-3 hit rate. The 18-pair fixture includes easy, medium, and hard targets across mk-spec-memory, CocoIndex, spec scripts, code graph, tests, and rescue-layer categories; reranking can only promote a target already present in top-K candidates. Evidence: `.opencode/.../code-retrieval-fixture.json:2-41`, `.opencode/.../code-retrieval-fixture.json:43-81`, `.opencode/.../code-retrieval-fixture.json:83-121`, `.opencode/.../code-retrieval-fixture.json:123-145`.

# RECOMMENDATIONS

1. Use K=20 as the first production-default candidate depth for the local reranker experiment. Rationale: it matches current `limit=5` over-fetch behavior (`fetch_k = unique_k * 4`), bounds added latency, and should be enough to test whether reranking fixes near-miss ordering failures without making cross-encoder cost dominate the current ~404 ms median search baseline.

2. Sweep K=10/K=20/K=50/K=100 in the benchmark harness, but report two metrics separately: candidate-depth oracle recall@K and reranked top-3 hit rate. K=10 tests low-latency viability; K=20 tests current-shape viability; K=50 tests quality mode; K=100 aligns with BEIR/MTEB comparability.

3. Do not default to K=100 unless local candidate-depth recall proves that many expected targets first appear between ranks 51-100 and local p95 still stays under the child spec’s added <500 ms target. Literature uses K=100 heavily for evaluation, but production systems pay linear per-pair cross-encoder cost.

4. Expected fixture lift estimate: plan for +2 to +4 recovered hits as the decision threshold, moving from 7/18 to 9-11/18 (50.0-61.1%, +11.1 to +22.2 pp), because that matches the umbrella’s +10-20 pp reranker prior. GAP: no provided run establishes how many of the 11 misses are present in top-10/top-20/top-50/top-100 first-stage candidates, so this is a target/threshold, not an observed estimate.

5. Treat model speed claims as hardware-relative. MiniLM-style cross-encoders look safe for K=50/K=100 on V100-class numbers, while larger rerankers such as mxbai large-v2 may exceed the local <500 ms p95 budget unless batching, quantization, or a smaller model is used. GAP: no authoritative local Apple MPS measurement was found for the candidate rerankers on this repo’s chunk lengths.

# JSONL DELTA ROW
