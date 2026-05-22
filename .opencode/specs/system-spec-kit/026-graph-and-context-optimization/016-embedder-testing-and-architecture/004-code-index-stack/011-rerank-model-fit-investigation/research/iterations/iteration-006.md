---
title: "Iter 6 — Alt-Mitigation B: Hybrid Fusion Recalibration Feasibility"
description: "File-read analysis of hybrid fusion recalibration feasibility. Key finding: fusion weights ARE configurable via environment variables (COCOINDEX_HYBRID_VECTOR_WEIGHT, COCOINDEX_HYBRID_FTS5_WEIGHT, COCOINDEX_HYBRID_RRF_K), but the failure pattern from iters 1-2 is a reranker-level issue, not fusion-level. Expected lift on probes 3/10/14/18 is LOW-MEDIUM (indirect mitigation), regression risk is MEDIUM (global weight change affects all queries), and implementation cost is TRIVIAL (env var changes only)."
trigger_phrases:
  - "iter 6 fusion recalibration"
  - "hybrid fusion weight re-weighting"
  - "RRF vs Borda count feasibility"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: research-iter | v1.0 -->
<!-- SPECKIT_LEVEL: 1 -->

# Iter 6 — Alt-Mitigation B: Hybrid Fusion Recalibration Feasibility

## TL;DR

Hybrid fusion recalibration is **trivially implementable** via environment variables (COCOINDEX_HYBRID_VECTOR_WEIGHT, COCOINDEX_HYBRID_FTS5_WEIGHT, COCOINDEX_HYBRID_RRF_K) but offers only **LOW-MEDIUM expected lift** on the failure probes because the lexical-cue density bias is a reranker-level issue (iters 1-2), not a fusion-level issue. The current implementation uses weighted RRF with k=60 and equal 0.7/0.7 weights for vector and FTS5. No alternative fusion methods (Borda count, weighted sum) are implemented. Regression risk is MEDIUM since changing fusion weights globally affects all queries, not just the failure pattern. Fusion recalibration is an indirect mitigation that would need to be combined with direct reranker fixes (model replacement or path-class boost) for meaningful impact.

## Question (restate)

Feasibility of hybrid fusion recalibration. CocoIndex uses RRF for dense+BM25 (.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fusion.py). Could re-weighting (dense-heavy 0.7/0.3, sparse-heavy 0.3/0.7, or non-RRF like Borda count) fix the failure pattern? Capture expected lift + regression risk grounded in the fusion.py implementation.

## Evidence (file:line citations or URLs required)

1. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fusion.py" lines="42-48" /> — RRF fusion function with configurable k, vector_weight, fts_weight parameters
2. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fusion.py" lines="63-66" /> — RRF scoring formula: `score += weight * (1 / (k + rank))`
3. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py" lines="15-17" /> — Default fusion weights: vector_weight=0.7, fts5_weight=0.7, rrf_k=60
4. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py" lines="310-327" /> — Environment variable configuration for fusion weights with validation ranges
5. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py" lines="624-630" /> — Fusion invocation in query pipeline using config values
6. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md" lines="63-70" /> — Failure mode pattern showing reranker-level lexical-cue density bias
7. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py" lines="109-150" /> — Reranker implementation from iter 2 showing failure occurs after fusion, not before

## Findings (numbered, with citations)

### 1. Current fusion implementation: Weighted RRF with configurable parameters

CocoIndex uses weighted Reciprocal Rank Fusion (RRF) to combine vector and FTS5 BM25 result lists. The `rrf_fuse()` function accepts three configurable parameters: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fusion.py" lines="42-48" />

- **k**: RRF constant (default: 60)
- **vector_weight**: Weight for vector channel (default: 0.7)
- **fts_weight**: Weight for FTS5 channel (default: 0.7)

The RRF scoring formula is: `score += weight * (1 / (k + rank))` for each channel <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fusion.py" lines="63-66" />. This means higher-ranked items (lower rank number) contribute more to the fused score, and the weight parameter controls each channel's influence.

### 2. Fusion weights are configurable via environment variables

The fusion weights are fully configurable via environment variables with validation ranges: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py" lines="310-327" />

- **COCOINDEX_HYBRID_VECTOR_WEIGHT**: Default 0.7, range 0.0-2.0
- **COCOINDEX_HYBRID_FTS5_WEIGHT**: Default 0.7, range 0.0-2.0
- **COCOINDEX_HYBRID_RRF_K**: Default 60, range 1-500

The config module parses these values at startup via `_parse_float_env()` and `_parse_int_env()` helpers with bounded validation. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py" lines="174-209" />. This means fusion recalibration requires only environment variable changes—no code modifications needed.

### 3. No alternative fusion methods implemented

The codebase currently implements only RRF fusion. No alternative fusion methods are available:

- **No Borda count**: The fusion.py file contains only the `rrf_fuse()` function; no Borda count or weighted sum implementations exist. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fusion.py" lines="1-87" />
- **No configurable fusion algorithm**: The query pipeline hardcodes the call to `rrf_fuse()` with no abstraction layer for swapping fusion methods. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py" lines="624-630" />
- **No fusion strategy pattern**: The feature catalog documents only RRF as the fusion method. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/feature_catalog/05--search-and-ranking/07-hybrid-search-bm25-rrf.md" lines="23" />

Implementing Borda count or other fusion methods would require new code in fusion.py and changes to the query pipeline.

### 4. Failure pattern is reranker-level, not fusion-level

The lexical-cue density bias identified in iters 1-2 is a reranker-level issue, not a fusion-level issue. The margin analysis shows that the cross-encoder reranker systematically demotes semantically correct targets in favor of lexically dense distractors after fusion has already occurred. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md" lines="63-70" />

The query pipeline order is:
1. Vector retrieval
2. FTS5 BM25 retrieval
3. **Fusion via RRF** <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py" lines="624-630" />
4. **Reranker cross-encoder scoring** <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py" lines="109-150" />

The failure occurs at step 4, not step 3. Fusion recalibration would change the candidate set composition before reranking, but the reranker's lexical-cue density bias would still apply to whatever candidates fusion produces.

### 5. Expected lift on failure probes: LOW-MEDIUM (indirect mitigation)

Fusion recalibration could indirectly affect the failure probes through two mechanisms:

**Dense-heavy fusion (0.9/0.3)**: If dense embeddings are less susceptible to lexical-cue density than BM25 (which is inherently lexical), then increasing vector_weight might reduce the proportion of lexically dense distractors in the top-20 candidate set before reranking. However, this is speculative—the margin analysis does not provide dense vs BM25 score breakdowns for the failure probes to validate this hypothesis. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md" lines="45-52" />

**Sparse-heavy fusion (0.3/0.9)**: Conversely, if BM25's exact term matching is actually better at distinguishing implementation files from tests/docs (e.g., implementation files contain more unique function names), then increasing fts_weight might help. However, BM25 is inherently lexical, so this could exacerbate the lexical-cue density problem rather than mitigate it.

**Assessment**: Expected lift is LOW-MEDIUM because fusion recalibration is an indirect mitigation. The root cause is the reranker's scoring function (iter 2), not the fusion weights. Even with optimal fusion weights, the reranker would still apply its lexical-cue density bias to the fused candidates.

### 6. Regression risk on all queries: MEDIUM

Changing fusion weights globally affects all queries, not just the failure probes. Regression risk is MEDIUM for several reasons:

- **Global impact**: Fusion weight changes apply to every search query in the system, not just code retrieval. Queries that currently work well with 0.7/0.7 balance might degrade with skewed weights.
- **Unknown optimal weights**: The current 0.7/0.7 balance appears to be a heuristic default (equal emphasis). There is no documented A/B testing or benchmark data showing optimal weights for different query types.
- **Interaction with reranker**: Fusion recalibration changes the candidate set composition before reranking, which could have unpredictable interactions with the reranker's scoring function.
- **No telemetry on weight sensitivity**: The feature catalog does not document any telemetry or experiments on fusion weight sensitivity. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/feature_catalog/05--search-and-ranking/07-hybrid-search-bm25-rrf.md" lines="15" />

**Mitigation**: Fusion recalibration should be tested via A/B framework with telemetry before production deployment, starting with conservative weight adjustments (e.g., 0.8/0.6 rather than extreme 0.9/0.3).

### 7. Implementation cost: TRIVIAL (env var changes only)

Fusion recalibration requires no code changes—only environment variable configuration:

```bash
export COCOINDEX_HYBRID_VECTOR_WEIGHT=0.8
export COCOINDEX_HYBRID_FTS5_WEIGHT=0.6
export COCOINDEX_HYBRID_RRF_K=60
```

The config module already handles parsing and validation of these variables. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py" lines="310-327" /> This makes fusion recalibration the cheapest mitigation to experiment with, even if expected lift is low-medium.

However, implementing alternative fusion methods (Borda count, weighted sum) would require:
- New fusion functions in fusion.py
- Config changes to support fusion algorithm selection
- Query pipeline changes to dispatch on fusion algorithm
- Test coverage for new fusion methods

This would be MEDIUM implementation cost, not trivial.

### 8. Fusion recalibration is complementary to direct reranker fixes

From iters 3-5, the direct mitigation approaches are:
- **Model replacement**: mxbai-rerank-base-v2 or Qwen3-Reranker-0.6B (iter 3-4)
- **Path-class boost**: Post-processing reranker scores based on path class (iter 5)

Fusion recalibration is **complementary** to these approaches:
- Fusion recalibration changes the candidate set composition before reranking
- Model replacement changes the reranker's scoring function
- Path-class boost changes the reranker's output post-processing

The combined approach (fusion recalibration + better model + path-class boost) would likely provide the strongest defense, but fusion recalibration alone is insufficient to address the root cause.

### 9. No dense vs BM25 score breakdown data for failure probes

The margin analysis does not provide dense vs BM25 score breakdowns for the failure probes (3, 10, 14, 18). It only reports reranker cross-encoder scores. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md" lines="45-52" />

Without this data, it's impossible to determine:
- Whether dense or BM25 is currently ranking the implementation higher before reranking
- Whether dense-heavy or sparse-heavy fusion would change the top-20 candidate composition
- Whether the distractors (tests/docs) are being introduced by the vector channel, FTS5 channel, or both

This data gap makes fusion recalibration a blind experiment without grounded hypotheses.

## Gaps for Next Iter

1. **Dense vs BM25 score breakdown missing**: Need to instrument the query pipeline to log per-channel (vector vs FTS5) scores and ranks for the failure probes. This would enable data-driven fusion recalibration rather than blind experimentation.

2. **No A/B testing framework for fusion weights**: The current implementation allows weight configuration but provides no telemetry or A/B testing infrastructure to measure the impact of weight changes on query quality across the corpus.

3. **Alternative fusion methods not implemented**: Borda count, weighted sum, and other fusion methods are not available. Implementing these would require code changes and could provide different trade-offs than RRF.

4. **Fusion weight optimization unexplored**: The 0.7/0.7 default appears to be a heuristic. No systematic optimization or grid search has been documented to find optimal weights for code retrieval vs other query types.

5. **Interaction with reranker top-K unknown**: Fusion recalibration changes candidate composition, but the reranker's top-K=20 window is fixed. The interaction between fusion weights and reranker top-K is unexplored—e.g., would dense-heavy fusion allow reducing reranker top-K to 10, lowering latency while maintaining quality?

## JSONL Delta Row

```jsonl
{"iter_id":"006","timestamp_utc":"2026-05-19T04:56:00Z","executor":"devin-for-terminal","model":"swe-1.6","status":"PASSED","findings_count":9,"gaps_count":5,"primary_evidence_files":["fusion.py","config.py","query.py","pre-confirmation-margin-analysis.md","reranker.py"],"note":"fusion_recalibration_is_trivial_via_env_vars_but_low_medium_lift_due_to_reranker_level_root_cause"}
```

SPAWN_AGENT_USED=no