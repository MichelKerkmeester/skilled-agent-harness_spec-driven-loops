# Research Synthesis: 016/011/001 Reranker Integration

> **Status**: CONVERGED (4 of 4 iters complete) — cli-devin SWE-1.6 deep-research, 2026-05-18T05:14-05:18Z

## Question

Which cross-encoder reranker maximizes top-3 hit-rate lift on the 18-pair fixture (baseline 38.9%) with acceptable Mac MPS latency, and where in the CocoIndex pipeline should it integrate?

## Recommendation (one-liner)

Add feature-gated inline `query_codebase()` rerank with `Alibaba-NLP/gte-multilingual-reranker-base`, `rerank_k=20`, preserve vector/heuristic scores in ranking signals, sweep K=10/20/50/100 on the 18-pair fixture, and default-on only if p95 add <500 ms plus ≥+2 top-3 hits.

## Concrete decisions

| Dimension | Decision | Iter source |
|---|---|---|
| **First-pick reranker** | `Alibaba-NLP/gte-multilingual-reranker-base` (Apache-2.0, 306M, 8192 ctx, encoder-only) | iter 1 |
| **Evaluation oracle** | `jinaai/jina-reranker-v2-base-multilingual` (best code-specific score, but cc-by-nc-4.0 — license-risky for default) | iter 1 |
| **Opt-in accuracy challenger** | `mixedbread-ai/mxbai-rerank-large-v2` (Apache-2.0 but 1.5B + 0.89s/query on A100 — likely >500ms p95 locally) | iter 1 |
| **Apache baseline (if budget)** | `BAAI/bge-reranker-v2-m3` (mature, 568M) | iter 1 |
| **Integration point** | Inline in `cocoindex_code/query.py:query_codebase()` after first-stage retrieval + heuristic dedup, before final slice — split telemetry from current `"rerank"` token into `heuristic_rank` + `cross_encoder_rerank` | iter 2 |
| **Top-K (first production)** | K=20 (matches current `fetch_k = unique_k * 4` overfetch shape; `limit=5` → ~20 raw candidates) | iter 3 |
| **K sweep for harness** | K=10/20/50/100 — report candidate-depth recall@K AND reranked top-3 hit rate | iter 3 |
| **Expected lift threshold** | Min +2 hits (7/18 → 9/18 = 50.0%, +11.1pp); high-confidence +4 hits (→ 11/18 = 61.1%, +22.2pp) | iter 4 synthesis |
| **RAM estimate** | ~0.61GB fp16 for GTE + tokenizer/cache overhead, within parent ~500MB-2GB envelope | iter 4 |
| **Latency gate** | p95 add <500ms on local Apple MPS (parent budget) | iter 4 |
| **Rollout** | Opt-in/shadow first (`rerank_enabled=false`, `rerank_model=gte`, `rerank_k=20`); default-on after gate passes | iter 4 + iter 2 (mk-spec-memory precedent at `lib/search/local-reranker.ts:206-240`) |

## Implementation hints (cross-referenced)

- **Current code path**: `cocoindex_code/query.py:298-355` — `query_codebase()` embeds query → fetches `fetch_k = unique_k * 4` candidates → heuristic dedup/rank → logs `"rerank"` → returns. Integration point lives between heuristic dedup and final return.
- **Protocol gap**: `cocoindex_code/protocol.py:21-29 + 96-115` — no rerank-control fields or reranker-score field in the request/response schemas. Needs `rerank_enabled` + `rerank_model` + `rerank_k` controls; response should carry both the rerank score and the original heuristic score for auditability.
- **mk-spec-memory precedent (already proven)**: `lib/search/pipeline/stage3-rerank.ts:347-502` (rerank after fusion, preserve score auditability, graceful fallback) + `lib/search/local-reranker.ts:4-6 + :206-240` (opt-in flag + RAM/model-file gates + graceful unchanged-order fallback). The CocoIndex implementation should mirror this pattern.

## Open gaps (carry to implementation phase)

- **No authoritative local Apple MPS latency** for GTE/Jina/BGE/mxbai at our chunk lengths. The harness must measure this directly before default-on.
- **No code-specific benchmark score on the GTE model card** — the GTE pick is "safest given license + size", not "highest measured on code retrieval". The 18-pair fixture is the local ground truth.
- **Schema/protocol plumbing** is a non-trivial side change (request fields + response fields + telemetry split) — flag in plan.md as a "do this first" prerequisite.

## Source iterations

| Iter | Dimension | File | Findings | Note |
|---|---|---|---|---|
| 1 | reranker-model-survey | `iterations/iteration-001.md` | 8 | GTE safest; mxbai accuracy challenger; Jina license-constrained |
| 2 | reranker-integration-point | `iterations/iteration-002.md` | 7 | Inline query-stage rerank in `query_codebase` recommended; external wrapper only for eval/shadow |
| 3 | reranker-topk-sweep | `iterations/iteration-003.md` | 10 | K=20 first prod default; sweep K=10/20/50/100 with candidate-depth + latency gates |
| 4 | reranker-synthesis | `iterations/iteration-004.md` | 8 | (this synthesis derived from iter 4 directly) |

<!-- ANCHOR:citations -->
## Citations

- Local integration precedent: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts`
- Local fallback precedent: `.opencode/skills/system-spec-kit/mcp_server/lib/search/local-reranker.ts`
- Target implementation path: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py`
- Model card: https://huggingface.co/Alibaba-NLP/gte-multilingual-reranker-base
<!-- /ANCHOR:citations -->

## Next steps

1. Refine `plan.md` from this synthesis — concrete implementation phases (schema plumbing → inline integration → harness sweep → opt-in flag → benchmark gate → default-on promotion).
2. Author the harness extension for K=10/20/50/100 sweep + per-K hit-rate + p95 measurement.
3. Implement GTE first (smallest model, lowest risk).
4. Run 18-pair fixture; assert ≥+2 hits + p95 add <500ms.
5. If gate passes: promote to default-on via separate commit + post-impl deep-review.
