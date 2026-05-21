---
title: "Iter 10 - Final Convergence + Phase 2 Bench Refinement"
description: "Final convergence verdict for the reranker model-fit investigation, with Phase 2 bench order, commands, SWAP/HOLD/NEEDS-CUSTOM rubric, and fallback packet structure."
trigger_phrases:
  - "iter 10 final convergence"
  - "rerank model fit phase 2 bench"
  - "path-class mxbai swap hold needs custom"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: research-iter | v1.0 -->
<!-- SPECKIT_LEVEL: 1 -->

# Iter 10 — Final Convergence + Phase 2 Bench Refinement

## TL;DR (2-3 sentences)

Headline verdict: **do not swap reranker defaults from architecture evidence alone; run Phase 2 as a full-18 replay where the first bench lane is BGE plus path-class post-processing and the practical model-swap complement is mxbai.** The four known failures are useful as a smoke gate, but the final SWAP/HOLD decision must use the full 18-probe fixture because the unresolved risk is control regression, not whether probes 3 and 14 are tempting. Qwen3 remains the stronger semantic prior, but it belongs in a custom-adapter packet unless default CrossEncoder integration proves non-null scores and acceptable latency.

## Question (restate the scoped RQ)

Final convergence plus Phase 2 bench refinement. Read iters 1-9 and write both this iteration file and a separate `research-convergence.md`. Include a one-sentence verdict, precise Phase 2 bench commands with env vars, probes, and expected wall time for the top candidate and stack complement, a SWAP/HOLD/NEEDS-CUSTOM decision rubric after Phase 2, the failure fallback packet structure, bench order, and whether Phase 2 should run only the 4 failure probes or all 18.

## Evidence (file:line citations or URLs required)

1. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/iterations/iteration-009.md" lines="48-60" /> - Iter 9 quantitative rubric ranks path-class first, mxbai second, Qwen3 third.
2. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/iterations/iteration-009.md" lines="62-95" /> - Iter 9 ordered recommendation, stacking analysis, and full replay requirement.
3. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/iterations/iteration-008.md" lines="96-106" /> - Iter 8 adversarial ranked-confidence list.
4. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion-arc/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md" lines="45-70" /> - Four failure probes and lexical-cue density pattern.
5. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion-arc/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md" lines="131-139" /> - Prior recommendation to investigate path-class boost and audit fixture truth.
6. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py" lines="20-44" /> - Existing `COCOINDEX_RERANK_LOG_PATH` score logger.
7. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py" lines="68-108" /> - Current reranker loads `sentence_transformers.CrossEncoder`.
8. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py" lines="109-150" /> - Current reranker scores `(query, candidate.content)` and sorts only by reranker score.
9. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py" lines="15-19" /> - Default hybrid and rerank settings.
10. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py" lines="250-270" /> - `COCOINDEX_CODE_EMBEDDING_MODEL` env override.
11. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py" lines="309-340" /> - `COCOINDEX_HYBRID*` and `COCOINDEX_RERANK*` env vars.
12. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py" lines="624-683" /> - Pipeline order: RRF fusion before rerank.
13. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fusion.py" lines="42-87" /> - Weighted RRF formula and channel ranks.
14. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/schema.py" lines="24-40" /> - `QueryResult` carries `path_class`, `pre_rerank_score`, and `reranker_score`.
15. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py" lines="55-93" /> - Existing path-class taxonomy.
16. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-18/benchmark_report.md" lines="55-100" /> - Existing fixture methodology and baseline env settings.
17. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-18/benchmark_report.md" lines="205-208" /> - Prior campaign wall-clock evidence.
18. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-18/risk-analysis-rerank-nondeterminism.md" lines="131-147" /> - Single-candidate full-18 rerank instrumentation estimate.
19. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/002-baseline-fixture/evidence/code-retrieval-fixture.json" lines="1-145" /> - Full 18-probe fixture.
20. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off/evidence/run-extended-bake-off-with-hybrid-rerank.sh" lines="11-23" /> - Existing harness paths and canonical `ccc` binary.
21. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off/evidence/run-extended-bake-off-with-hybrid-rerank.sh" lines="69-90" /> - Harness env, reset, index, and fixture loop setup.
22. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off/evidence/run-extended-bake-off-with-hybrid-rerank.sh" lines="107-184" /> - Harness probe loop, top-5 hit semantics, latency, and JSONL output.
23. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/012-fixture-audit-10-probes/spec.md" lines="48-76" /> - Existing 012 fixture-audit packet scope.

## Findings (numbered, with citations)

### 1. Convergence verdict: proceed to Phase 2 bench, not another research iteration

The research has converged enough to stop literature/architecture passes. Iter 8 and Iter 9 independently rank path-class boost first for the narrow "fix at least two failure probes" target, while both label mxbai and Qwen3 as model-swap priors without direct replay evidence. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/iterations/iteration-008.md" lines="96-106" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/iterations/iteration-009.md" lines="48-60" />

The strongest single-sentence verdict is: **HOLD the current reranker default until Phase 2; measure BGE+path-class first, mxbai second, and only SWAP when full-18 replay shows net quality lift without control regression.** The evidence does not support a blind model swap: current reranking is content-only and score-only, which explains why path-class metadata is a complementary missing signal; but Qwen3/mxbai still require replay or custom adapter validation before promotion. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py" lines="109-150" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/schema.py" lines="24-40" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/iterations/iteration-009.md" lines="62-95" />

### 2. Phase 2 must decide on the full 18 probes, with a 4-probe smoke gate only

Bench only the four failures first for a quick sanity check, but do not decide from them. The four failures are probes 3, 10, 14, and 18, all with rank-1/rank-2 margins below 0.05 and a shared lexical-cue-density pattern; however, probes 10 and 18 are fixture-truth edge cases, not clean "implementation beats test" examples. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion-arc/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md" lines="45-70" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion-arc/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md" lines="137-139" />

The full fixture already exists as 18 `(query, expected_source_path)` records spanning easy, medium, and hard probes, and the existing harness records top-5 hit semantics and latency per probe. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/002-baseline-fixture/evidence/code-retrieval-fixture.json" lines="1-145" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off/evidence/run-extended-bake-off-with-hybrid-rerank.sh" lines="107-184" /> The practical order is sequential, not parallel, because each lane changes daemon-visible env vars, model caches, and sometimes index state. Parallelize only post-run analysis of JSONL outputs.

### 3. Phase 2 bench commands: baseline, path-class, mxbai, then stack

Use the existing embedder harness with the embedder fixed to `sbert/BAAI/bge-code-v1`, because this investigation is about reranker/model-fit rather than re-running the embedder bake-off. The current config supports `COCOINDEX_CODE_EMBEDDING_MODEL`, `COCOINDEX_HYBRID*`, `COCOINDEX_RERANK`, `COCOINDEX_RERANK_MODEL`, and `COCOINDEX_RERANK_TOP_K`; the current config does **not** yet expose a path-class boost flag, so Phase 2 must add one before the top-ranked candidate can be measured honestly. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py" lines="250-270" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py" lines="309-340" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py" lines="55-93" />

Recommended Phase 2 env surface for the path-class lane:

```bash
export COCOINDEX_RERANK_PATH_CLASS_BOOST=1
export COCOINDEX_RERANK_PATH_CLASS_FACTORS='{"implementation":1.00,"tests":0.85,"docs":0.85,"generated":0.95,"vendor":0.70,"spec_research":0.90}'
```

The score adjustment should slot after `scores = model.predict(...)` and before the score-only sort, using the existing `QueryResult.path_class`. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py" lines="123-150" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/schema.py" lines="24-40" />

Precise command skeleton for each full-18 lane:

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
export CCC="$PWD/.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc"
export BENCH_DIR="$PWD/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench"
mkdir -p "$BENCH_DIR"

export COCOINDEX_CODE_EMBEDDING_MODEL="sbert/BAAI/bge-code-v1"
export COCOINDEX_HYBRID=true
export COCOINDEX_HYBRID_VECTOR_WEIGHT=0.7
export COCOINDEX_HYBRID_FTS5_WEIGHT=0.7
export COCOINDEX_HYBRID_RRF_K=60
export COCOINDEX_RERANK=true
export COCOINDEX_RERANK_TOP_K=20

# Lane A: current baseline
unset COCOINDEX_RERANK_PATH_CLASS_BOOST
unset COCOINDEX_RERANK_PATH_CLASS_FACTORS
export COCOINDEX_RERANK_MODEL="BAAI/bge-reranker-v2-m3"
export COCOINDEX_RERANK_LOG_PATH="$BENCH_DIR/baseline-bge.rerank-scores.jsonl"
bash .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off/evidence/run-extended-bake-off-with-hybrid-rerank.sh "sbert/BAAI/bge-code-v1"

# Lane B: top-ranked candidate, after Phase 2 adds the flag above
export COCOINDEX_RERANK_MODEL="BAAI/bge-reranker-v2-m3"
export COCOINDEX_RERANK_PATH_CLASS_BOOST=1
export COCOINDEX_RERANK_PATH_CLASS_FACTORS='{"implementation":1.00,"tests":0.85,"docs":0.85,"generated":0.95,"vendor":0.70,"spec_research":0.90}'
export COCOINDEX_RERANK_LOG_PATH="$BENCH_DIR/bge-path-class.rerank-scores.jsonl"
bash .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off/evidence/run-extended-bake-off-with-hybrid-rerank.sh "sbert/BAAI/bge-code-v1"

# Lane C: practical model-swap complement; first classify load behavior
unset COCOINDEX_RERANK_PATH_CLASS_BOOST
unset COCOINDEX_RERANK_PATH_CLASS_FACTORS
export COCOINDEX_RERANK_MODEL="mixedbread-ai/mxbai-rerank-base-v2"
export COCOINDEX_RERANK_LOG_PATH="$BENCH_DIR/mxbai.rerank-scores.jsonl"
bash .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off/evidence/run-extended-bake-off-with-hybrid-rerank.sh "sbert/BAAI/bge-code-v1"

# Lane D: complementary stack, only if Lane C emits non-null reranker scores
export COCOINDEX_RERANK_MODEL="mixedbread-ai/mxbai-rerank-base-v2"
export COCOINDEX_RERANK_PATH_CLASS_BOOST=1
export COCOINDEX_RERANK_PATH_CLASS_FACTORS='{"implementation":1.00,"tests":0.85,"docs":0.85,"generated":0.95,"vendor":0.70,"spec_research":0.90}'
export COCOINDEX_RERANK_LOG_PATH="$BENCH_DIR/mxbai-path-class.rerank-scores.jsonl"
bash .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off/evidence/run-extended-bake-off-with-hybrid-rerank.sh "sbert/BAAI/bge-code-v1"
```

Expected wall time: use 5-10 minutes per warm 4-probe smoke, then about 30 minutes per full-18 lane plus 15 minutes of analysis. That estimate is grounded in the prior risk analysis, while the prior multi-candidate campaign took about 127 minutes across split sessions. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-18/risk-analysis-rerank-nondeterminism.md" lines="131-147" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-18/benchmark_report.md" lines="205-208" /> Budget 2-3 hours for the four lanes when caches are warm; 3-4 hours if reranker downloads and daemon restarts are cold.

### 4. SWAP/HOLD/NEEDS-CUSTOM rubric

Use the full-18 baseline as the control. For BGE+path-class, **SWAP** only if it fixes at least two of probes 3/10/14/18, produces zero net regression on the 14 non-failure probes, and keeps p95 latency within 5% of baseline because the method is score post-processing and should be effectively free. **HOLD** if it fixes only one failure probe, causes any non-failure regression without an offsetting fixture-audit explanation, or requires aggressive factors that would penalize legitimate test/doc searches. **NEEDS-CUSTOM** if the best result requires query-intent detection or a richer path-role model rather than static factors.

For mxbai, **SWAP** only if the existing `CrossEncoder` wrapper loads it successfully, every returned result has non-null `pre_rerank_score` and `reranker_score`, full-18 top-5 hits improve by at least two over baseline, and p95 latency is no worse than baseline by more than 25%. **HOLD** if it loads but produces <= +1 net hit or regresses more than one control. **NEEDS-CUSTOM** if it fails to load, silently falls back, emits null reranker scores, or needs the causal-LM binary-token scoring path described in Iter 3 rather than the current CrossEncoder path. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py" lines="68-108" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/iterations/iteration-003.md" lines="118-157" />

For Qwen3, default to **NEEDS-CUSTOM** unless an explicit Phase 2 smoke proves the default CrossEncoder wrapper gives valid scores with acceptable latency. Iter 4's best Qwen3 case depends on chat-template formatting, custom code-search instructions, and yes/no token scoring; that is a different integration surface from the current `pairs = [(query, content)]` implementation. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/iterations/iteration-004.md" lines="71-108" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/iterations/iteration-004.md" lines="120-158" />

### 5. If Phase 2 fails, split the next work instead of widening this packet

If BGE+path-class fails because controls regress, open a custom path-role packet: add query-intent detection, reference-path classification, and learned/calibrated factors instead of static penalties. If mxbai or Qwen3 fail to load or score through CrossEncoder, open a custom reranker-adapter packet with causal-LM scoring, chat-template support, and model-specific warmup/error surfacing. If probes 10 or 18 dominate the outcome, route into the already-scaffolded 012 fixture-audit packet before rerunning the bench; that packet explicitly audits probe 10 first and then the full 18. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/012-fixture-audit-10-probes/spec.md" lines="48-76" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/012-fixture-audit-10-probes/spec.md" lines="100-128" />

Do not add fusion recalibration as a primary fallback. Fusion occurs before rerank and can shape the candidate set, but the documented failures occur in the reranker stage; use fusion logs only as instrumentation unless channel attribution shows the target is missing from the rerank window. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py" lines="624-683" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fusion.py" lines="42-87" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/iterations/iteration-006.md" lines="66-117" />

## Gaps for Next Iter (or Convergence Claim if this is iter 10)

**Convergence claim:** research is complete enough for Phase 2. The remaining unknowns are empirical, not research-shaped:

1. Implement or expose the path-class boost flag before measuring the top-ranked candidate.
2. Run the full-18 replay matrix after a 4-failure smoke gate.
3. Audit probes 10 and 18 through the existing 012 packet if they drive contradictory outcomes.
4. Classify mxbai/Qwen3 as SWAP, HOLD, or NEEDS-CUSTOM from actual load/scoring behavior, not model-card priors.
5. Preserve rerank score logs for every lane using `COCOINDEX_RERANK_LOG_PATH`.

## JSONL Delta Row (paste the row at the end for verification)

```jsonl
{"iter_id":"010","timestamp_utc":"2026-05-19T05:13:15Z","executor":"codex","model":"gpt-5","status":"PASSED_WITH_SEQUENTIAL_THINKING_MCP_CANCELLED","findings_count":5,"gaps_count":5,"primary_evidence_files":["iteration-008.md","iteration-009.md","pre-confirmation-margin-analysis.md","reranker.py","config.py","query.py","fusion.py","schema.py","indexer.py","benchmark_report.md","risk-analysis-rerank-nondeterminism.md","code-retrieval-fixture.json","run-extended-bake-off-with-hybrid-rerank.sh","012-fixture-audit-10-probes/spec.md"],"note":"five sequential_thinking MCP calls attempted; tool returned user_cancelled each time; no SpawnAgent used"}
```

SPAWN_AGENT_USED=no
