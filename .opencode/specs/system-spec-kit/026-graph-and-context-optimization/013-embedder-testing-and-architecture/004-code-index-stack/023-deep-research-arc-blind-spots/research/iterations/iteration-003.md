# Iteration 003 - Calibration sensitivity

## Preflight reasoning
- Focus: test whether the RRF/hybrid/path-class knobs are robust or fixture-fit.
- Hypotheses: post-RRF additive boosts may dominate RRF score deltas; the sweep evidence is narrower than the spec language implies.
- Evidence to gather: RRF implementation, query post-processing boosts, benchmark sweep rows, and a synthetic perturbation.
- Falsification test: RRF deltas remain much larger than heuristic boosts across realistic top ranks, and the sweep is broad enough to justify confidence.
- Expected surprise level: medium-high because rank-fusion scores are numerically small.

## Hypotheses going in
- H1: The selected RRF tuple `(K=60,V=0.9,F=0.5)` is not independently calibrated; benchmark evidence mostly says multiple nearby cells tied.
- H2: Hybrid path-class and canonical boosts can flip results after fusion because they are additive in a much larger numeric scale than adjacent RRF gaps.

## Evidence gathered
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fusion.py:42-87` computes weighted RRF as `weight * (1 / (k + rank))` and only uses min-max vector/FTS scores as tie-breakers.
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:38-39` sets `_HYBRID_PATH_CLASS_SHIFT = 0.01` and `_HYBRID_CANONICAL_RESOURCE_BOOST = 0.02`; `:459-504` adds those values after RRF in `_hybrid_ranked_result`.
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:410-456` applies larger vector-only path-class/canonical boosts of `0.05` and `0.10`.
- Synthetic perturbation command output:
  - `config 60 0.9 0.5 top4 [(0, 0.021004098, 1, 20), (1, 0.020845243, 2, 19), (2, 0.020695971, 3, 18), (3, 0.020556006, 4, 17)]`
  - `config 30 0.9 0.5 top4 [(0, 0.039032258, 1, 20), ...]`
  - `config 120 0.9 0.5 top4 [(0, 0.011009445, 1, 20), ...]`
  - `config 60 0.7 0.7 top4 [(0, 0.02022541, 1, 20), (19, 0.02022541, 20, 1), ...]`
  - `vector_top20_adjacent_gap_min_max 0.00014240506329113792 0.00023796932839767297`
  - `hybrid_path_shift 0.01 hybrid_canonical_boost 0.02`
- Sweep evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/017-rrf-fusion-and-calibration/evidence/sweep-results.md:9-17` shows seven successful cells, all `12/18`, with p95 still above the target; `:21-40` shows the probe heatmap did not change across successful cells.
- Spec evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/017-rrf-fusion-and-calibration/spec.md:123-130` asked for a `4x4x4` grid, while `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/017-rrf-fusion-and-calibration/spec.md:46` documents the implemented evidence as a seven-cell local-neighborhood sweep.
- Rerank evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/018-jina-v3-reranker-integration/evidence/rerank-matrix-results.md:11-15` shows reranker lane changes hit rate more than RRF tuning did.

## Findings (severity-tagged)
- **FINDING-003-A** [severity: HIGH-LATENT-RISK]:
  - **What**: Hybrid path-class/canonical boosts are numerically large enough to dominate adjacent RRF gaps. In the synthetic top-20 probe, adjacent vector-only RRF gaps were `0.000142-0.000238`, while hybrid path and canonical shifts are `0.01` and `0.02`.
  - **Why deep-review couldn't catch this**: Deep-review verified that boosts were scaled below earlier values and tests passed. It did not require a numeric sensitivity argument showing when a boost flips rank.
  - **Evidence**: Synthetic perturbation output above; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:38-39`, `:459-504`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fusion.py:42-87`.
  - **What to do**: Add a calibration packet that logs pre-boost and post-boost rank deltas on real queries and proves the boost is load-bearing only on intended cases.

- **FINDING-003-B** [severity: MEDIUM-OPPORTUNITY]:
  - **What**: The RRF configuration is low-confidence as an optimum. Seven local cells tied on hit rate, all failed latency cap, and the broader requested grid was not run.
  - **Why deep-review couldn't catch this**: The shipped decision can be valid even when the calibration confidence is low. Review checks consistency with evidence, not whether the evidence exhausts the tuning space.
  - **Evidence**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/017-rrf-fusion-and-calibration/evidence/sweep-results.md:9-17`, `:21-40`, `:54-58`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/017-rrf-fusion-and-calibration/spec.md:46`, `:123-130`.
  - **What to do**: Run a bounded perturbation study over `(K,V,F)` plus path/canonical boosts, with rank-flip counts and confidence intervals rather than hit-rate-only scoring.

- **FINDING-003-C** [severity: MEDIUM-OPPORTUNITY]:
  - **What**: Reranker `top_k=20` is now a load-bearing default, but the 018 matrix did not isolate `top_k` sensitivity. This matters because missing a relevant document before rerank cannot be recovered by a better reranker.
  - **Why deep-review couldn't catch this**: The 018 packet integrated the reranker and showed a winning lane; it did not claim to tune the cutoff.
  - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:22-26`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:818-824`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/018-jina-v3-reranker-integration/evidence/rerank-matrix-results.md:11-15`.
  - **What to do**: Add top-K sweeps for 10/20/40/80 on the same fixture plus the expanded fixture from Finding-001-A.

## Hypotheses that FAILED falsification
- The hypothesis that RRF local tuning produced a clearly superior hit-rate cell failed: every successful seven-cell sweep row stayed at `12/18`.
- The hypothesis that heuristic boosts are necessarily too small to matter failed numerically; the boosts are much larger than adjacent RRF gaps in the synthetic probe.

## Updates to research.md
- Added calibration sensitivity: RRF confidence is low, post-RRF boosts may dominate, and rerank top-K remains uncalibrated.

## NO-EARLY-STOP confirmation
- Iteration <= 10: continuing to next iter with the explicit question "what didn't I challenge yet?"
