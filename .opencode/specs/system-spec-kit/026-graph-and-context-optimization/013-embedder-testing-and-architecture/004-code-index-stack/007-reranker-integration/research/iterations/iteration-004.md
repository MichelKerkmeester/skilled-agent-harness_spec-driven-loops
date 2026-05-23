---
title: "Iter 4 — reranker-synthesis (016/011/001 research)"
iter_number: 4
dimension: reranker-synthesis
phase_id: "001-reranker-integration"
executor: cli-devin
model: swe-1.6
recipe: agent-config-deep-research-iter.json
---

## 1. RESEARCH QUESTION

Synthesize reranker iters 1-3 into a concrete 016/011/001 recommendation: which reranker to try first, where to integrate it, what top-K to rerank, expected fixture lift, RAM/latency cost, and whether it should ship opt-in or default-on.

## 2. SCOPE READ

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/003-comparison-measure/decision-record.md:55-64` — benchmark method and constraint that no CocoIndex rerank/rescue layer existed during 018/003.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/003-comparison-measure/decision-record.md:82-90` — jina-code and gemma both reached 7/18 top-3 hit rate, with jina-code lower p95.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/spec.md:50-56` — structural-improvement rationale; reranker is framed as an all-embedder lever.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/spec.md:95-105` — risk/dependency envelope, including Mac RAM risk and 018/003 fixture dependency.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/007-reranker-integration/spec.md:49-62` — child research question, candidate model list, integration point, and <500 ms added p95 target.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/007-reranker-integration/spec.md:71-79` — required synthesis outputs: estimated lift plus RAM/latency cost.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/007-reranker-integration/research/iterations/iteration-001.md:31-45` — model survey findings across GTE, Jina, Mixedbread, BGE, and CoIR gaps.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/007-reranker-integration/research/iterations/iteration-002.md:30-42` — integration-point findings and inline query-stage recommendation.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/007-reranker-integration/research/iterations/iteration-003.md:30-48` — top-K findings and current CocoIndex fetch-depth implications.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:181-268` — current score adjustment and dedup ranking are heuristic, not neural reranking.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:271-355` — live query path: embed query, fetch `4 * (limit + offset)`, dedup/rank, log `rerank`, return results.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:21-29` and `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:96-115` — current search request/response schema has no rerank controls or explicit reranker score.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:1-24` and `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:347-502` — mk-spec-memory precedent: Stage 3 rerank changes scores after fusion, preserves score auditability, and falls back unchanged on failure.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/local-reranker.ts:4-6` and `.opencode/skills/system-spec-kit/mcp_server/lib/search/local-reranker.ts:206-240` — existing local reranker guard pattern: opt-in flag, RAM/model-file gates, graceful degradation.
- `https://huggingface.co/Alibaba-NLP/gte-multilingual-reranker-base` — GTE model card: 306M, encoder-only, 8192 max input tokens, lower hardware requirements, Apache-2.0 metadata.
- `https://huggingface.co/jinaai/jina-reranker-v2-base-multilingual` — Jina model card: cross-encoder/reranker tags, 278M BF16 parameters, CC-BY-NC-4.0 metadata, code-retrieval benchmark signal.
- `https://www.mixedbread.com/docs/models/reranking` and `https://mixedbread.com/blog/mxbai-rerank-v2` — mxbai v2 docs/blog: Apache-2.0, 1.5B flagship, 0.89s/query A100 latency table, code/MCP use-case claims.
- `https://github.com/huggingface/sentence-transformers/blob/main/examples/sentence_transformer/applications/retrieve_rerank/README.md` — retrieve-then-rerank pattern: first retrieve e.g. 100 hits, then CrossEncoder scores candidates.
- Pradeep et al., “Squeezing Water from a Stone: A Bag of Tricks for Further Improving Cross-Encoder Effectiveness for Reranking,” ECIR 2022, DOI `10.1007/978-3-030-99736-6_44` — cross-encoders as high-effectiveness components in modern retrieval pipelines.

## 3. FINDINGS

1. The baseline justifies a structural reranker experiment, not another default embedder flip: the accepted ADR kept jina-code because jina-code and gemma tied at 7/18 top-3 hits (0.389), while jina-code had better p95 latency. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/003-comparison-measure/decision-record.md:82-90`.

2. The phase contract narrows the design: rerank after embedder top-K retrieval, before result return, with added p95 under 500 ms; it also requires a RAM/latency cost estimate and an expected hit-rate lift. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/007-reranker-integration/spec.md:57-62`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/007-reranker-integration/spec.md:71-79`.

3. The best first reranker candidate is `Alibaba-NLP/gte-multilingual-reranker-base`: Iter 1 ranked it first for local implementation because it is Apache-2.0, compact at 306M, supports 8192-token input, and uses an encoder-only architecture with lower hardware requirements; the remaining gap is no authoritative code-specific score on the model card. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/007-reranker-integration/research/iterations/iteration-001.md:43-44`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/007-reranker-integration/research/iterations/iteration-001.md:56-62`, `https://huggingface.co/Alibaba-NLP/gte-multilingual-reranker-base`.

4. `jinaai/jina-reranker-v2-base-multilingual` is the best evaluation oracle but not the safest default: Iter 1 found the strongest cited code-specific metric for Jina, but the model card license is `cc-by-nc-4.0`, so default production/local-distribution use is license-risky unless the packet explicitly allows non-commercial weights. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/007-reranker-integration/research/iterations/iteration-001.md:35-38`, `https://huggingface.co/jinaai/jina-reranker-v2-base-multilingual`.

5. `mixedbread-ai/mxbai-rerank-large-v2` should be an opt-in accuracy challenger, not the initial default: it is Apache-2.0 and code/MCP-oriented, but the cited docs describe a 1.5B model and report 0.89s/query on A100, already above the child packet’s <500 ms added p95 budget if comparable locally. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/007-reranker-integration/research/iterations/iteration-001.md:39-43`, `https://www.mixedbread.com/docs/models/reranking`, `https://mixedbread.com/blog/mxbai-rerank-v2`.

6. The integration point should be inline inside `query_codebase()` after first-stage candidate lookup and heuristic dedup/ranking, not a separate long-term MCP tool: current code embeds the query, fetches candidates, dedups/ranks, logs `rerank`, then returns results, and Iter 2 found this is the cleanest steady-state architecture. Evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:298-355`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/007-reranker-integration/research/iterations/iteration-002.md:30-40`, Sentence Transformers retrieve-rerank docs at `https://github.com/huggingface/sentence-transformers/blob/main/examples/sentence_transformer/applications/retrieve_rerank/README.md`.

7. K=20 is the best first production-depth candidate, while K=10/20/50/100 should be measured in the harness: current CocoIndex fetches `fetch_k = unique_k * 4`, so normal `limit=5` already maps to ~20 raw candidates; K=50/100 require deliberately widening first-stage retrieval and pay linear cross-encoder cost. Evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:310-320`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/007-reranker-integration/research/iterations/iteration-003.md:36-48`, Sentence Transformers retrieve-rerank docs at `https://github.com/huggingface/sentence-transformers/blob/main/examples/sentence_transformer/applications/retrieve_rerank/README.md`.

8. Default-on should wait for a local gate; the implementation should land opt-in/shadow first. The mk-spec-memory precedent gates local reranking by feature flag, RAM, model-file availability, and graceful unchanged-order fallback; CocoIndex’s current protocol has no rerank controls or reranker score fields, so initial rollout needs explicit config/request plumbing or ranking-signal-only provenance. Evidence: `.opencode/skills/system-spec-kit/mcp_server/lib/search/local-reranker.ts:4-6`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/local-reranker.ts:206-240`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:21-29`, `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:96-115`.

## 4. RECOMMENDATIONS

1. **Recommended reranker**: implement first with `Alibaba-NLP/gte-multilingual-reranker-base`; include `jinaai/jina-reranker-v2-base-multilingual` as evaluation-only upper-bound if license policy permits, `mixedbread-ai/mxbai-rerank-large-v2` as opt-in accuracy challenger, and `BAAI/bge-reranker-v2-m3` as a mature Apache baseline only if implementation budget allows.

2. **Recommended integration point**: add an optional inline query-stage cross-encoder inside CocoIndex `query_codebase()` after first-stage vector lookup plus heuristic dedup/ranking and before final slicing/return; split telemetry from current `"rerank"` into `heuristic_rank` and `cross_encoder_rerank` so added cost is observable.

3. **Recommended top-K**: use `rerank_k=20` as the first production-depth candidate because it matches current `limit=5` overfetch shape; benchmark K=10/20/50/100 and report both candidate-depth recall@K and reranked top-3 hit rate.

4. **Expected lift threshold**: require at least +2 recovered hits on the 18-pair fixture before promotion, moving from 7/18 to at least 9/18 (50.0%, +11.1 pp); treat +4 recovered hits to 11/18 (61.1%, +22.2 pp) as the high-confidence win target. Evidence basis is the umbrella +10-20 pp prior, not an observed local run. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/spec.md:50-56`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/007-reranker-integration/research/iterations/iteration-003.md:58-60`.

5. **RAM/latency cost estimate**: plan for GTE raw weights around 0.61GB in fp16 plus runtime/tokenizer/cache overhead, likely within the parent risk envelope of ~500MB-2GB; enforce the child gate of added p95 <500 ms on local Apple MPS before default-on. GAP: no authoritative local Apple MPS latency exists yet for GTE/Jina/BGE/mxbai at this repo’s chunk lengths.

6. **Opt-in vs default-on**: ship as opt-in/shadow first (`rerank_enabled=false`, `rerank_model=gte`, `rerank_k=20`), then promote to default-on only if local benchmark shows both (a) added p95 <500 ms and (b) top-3 fixture lift >= +2 hits without regressions in existing hits.

7. **1-line swap-runbook analog**: Add feature-gated inline `query_codebase()` rerank with `Alibaba-NLP/gte-multilingual-reranker-base`, `rerank_k=20`, preserve vector/heuristic scores in ranking signals, sweep K=10/20/50/100 on the 18-pair fixture, and default-on only if p95 add <500 ms plus >=+2 top-3 hits.

## 5. JSONL DELTA ROW
