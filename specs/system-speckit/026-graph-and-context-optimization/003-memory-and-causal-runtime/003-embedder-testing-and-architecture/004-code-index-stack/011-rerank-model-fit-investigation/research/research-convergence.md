---
title: "Research Convergence - Rerank Model Fit Investigation"
description: "Final verdict and Phase 2 bench refinement for path-class boost, mxbai, Qwen3, fusion recalibration, and prompt-injection candidates."
trigger_phrases:
  - "rerank model fit convergence"
  - "phase 2 rerank bench refinement"
  - "path-class mxbai decision rubric"
importance_tier: "important"
contextType: "research"
---

# Research Convergence - Rerank Model Fit Investigation

## Headline Verdict

**Hold the current reranker default until Phase 2; benchmark BGE+path-class first, mxbai second, and promote only from a full-18 replay that proves net lift without control regression.**

The packet's evidence points in one direction: the current BGE reranker fails because it scores `(query, candidate.content)` and then sorts only by cross-encoder score, while the missing signal is candidate role/path metadata already present on `QueryResult`. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py" lines="109-150" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/schema.py" lines="24-40" /> That makes path-class post-processing the top Phase 2 candidate, but not a production default yet: probes 10 and 18 have fixture-truth ambiguity, and the 14 non-failure probes have not been replayed under path penalties. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md" lines="45-70" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/iterations/iteration-009.md" lines="87-95" />

## Final Candidate Ranking

| Rank | Candidate | Verdict Before Phase 2 | Why |
|---:|---|---|---|
| 1 | BGE + path-class boost | MEASURE | Best causal fit for probes 3 and 14; almost no expected latency. Needs full-18 control replay. |
| 2 | mxbai reranker | MEASURE / NEEDS-CUSTOM if CrossEncoder fails | Best practical model-swap lane. Existing env model override can smoke it, but causal-LM scoring may need a custom adapter. |
| 3 | Qwen3 reranker | NEEDS-CUSTOM unless smoke passes | Strongest semantic prior, but useful version wants chat template, custom instruction, and yes/no token scoring. |
| 4 | Fusion recalibration | INSTRUMENT ONLY | Candidate-set shaping, not a reranker fix. |
| 5 | Prompt injection into BGE | REJECT | BGE is not instruction-tuned; prefixing is noise rather than control. |

## Phase 2 Bench Order

Run in this sequence:

1. **4-failure smoke gate:** probes `3,10,14,18` for baseline, BGE+path-class, mxbai, and mxbai+path-class.
2. **Full-18 decision run:** every candidate that fixes at least two failure probes without obvious smoke regression.
3. **Score-log analysis:** compare rank-1/rank-2 margins, path classes, and null/non-null reranker fields.
4. **Decision:** apply SWAP/HOLD/NEEDS-CUSTOM rubric below.

Do not run Phase 2 candidates in parallel. The daemon observes env vars, model caches, and index state; sequential runs are slower but cleaner. The existing harness already fixes root paths, loops over the fixture, records top-5 hit semantics, and emits JSONL/CSV. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off/evidence/run-extended-bake-off-with-hybrid-rerank.sh" lines="11-23" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off/evidence/run-extended-bake-off-with-hybrid-rerank.sh" lines="107-184" />

## Commands

Use the full-18 harness for decision runs and keep the embedder fixed to `sbert/BAAI/bge-code-v1` so this remains a reranker/path-role test.

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
export CCC="$PWD/.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc"
export BENCH_DIR="$PWD/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench"
mkdir -p "$BENCH_DIR"

export COCOINDEX_CODE_EMBEDDING_MODEL="sbert/BAAI/bge-code-v1"
export COCOINDEX_HYBRID=true
export COCOINDEX_HYBRID_VECTOR_WEIGHT=0.7
export COCOINDEX_HYBRID_FTS5_WEIGHT=0.7
export COCOINDEX_HYBRID_RRF_K=60
export COCOINDEX_RERANK=true
export COCOINDEX_RERANK_TOP_K=20

# Baseline: current BGE reranker
unset COCOINDEX_RERANK_PATH_CLASS_BOOST
unset COCOINDEX_RERANK_PATH_CLASS_FACTORS
export COCOINDEX_RERANK_MODEL="BAAI/bge-reranker-v2-m3"
export COCOINDEX_RERANK_LOG_PATH="$BENCH_DIR/baseline-bge.rerank-scores.jsonl"
bash .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off/evidence/run-extended-bake-off-with-hybrid-rerank.sh "sbert/BAAI/bge-code-v1"

# Top candidate: BGE + path-class boost, after Phase 2 adds the flag
export COCOINDEX_RERANK_MODEL="BAAI/bge-reranker-v2-m3"
export COCOINDEX_RERANK_PATH_CLASS_BOOST=1
export COCOINDEX_RERANK_PATH_CLASS_FACTORS='{"implementation":1.00,"tests":0.85,"docs":0.85,"generated":0.95,"vendor":0.70,"spec_research":0.90}'
export COCOINDEX_RERANK_LOG_PATH="$BENCH_DIR/bge-path-class.rerank-scores.jsonl"
bash .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off/evidence/run-extended-bake-off-with-hybrid-rerank.sh "sbert/BAAI/bge-code-v1"

# Practical model-swap complement
unset COCOINDEX_RERANK_PATH_CLASS_BOOST
unset COCOINDEX_RERANK_PATH_CLASS_FACTORS
export COCOINDEX_RERANK_MODEL="mixedbread-ai/mxbai-rerank-base-v2"
export COCOINDEX_RERANK_LOG_PATH="$BENCH_DIR/mxbai.rerank-scores.jsonl"
bash .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off/evidence/run-extended-bake-off-with-hybrid-rerank.sh "sbert/BAAI/bge-code-v1"

# Stack: only if mxbai emits non-null reranker scores
export COCOINDEX_RERANK_MODEL="mixedbread-ai/mxbai-rerank-base-v2"
export COCOINDEX_RERANK_PATH_CLASS_BOOST=1
export COCOINDEX_RERANK_PATH_CLASS_FACTORS='{"implementation":1.00,"tests":0.85,"docs":0.85,"generated":0.95,"vendor":0.70,"spec_research":0.90}'
export COCOINDEX_RERANK_LOG_PATH="$BENCH_DIR/mxbai-path-class.rerank-scores.jsonl"
bash .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off/evidence/run-extended-bake-off-with-hybrid-rerank.sh "sbert/BAAI/bge-code-v1"
```

The path-class env vars are a proposed Phase 2 surface, not existing config. Current config exposes hybrid and rerank env vars, but no path-class factors yet. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py" lines="309-340" />

Expected wall time:

| Scope | Warm Cache | Cold Cache / Downloads |
|---|---:|---:|
| 4-probe smoke, one lane | 5-10 min | 15-25 min |
| Full 18, one lane | ~30 min run + ~15 min analysis | 45-75 min |
| Four full lanes | 2-3h | 3-4h |

The single-candidate rerank instrumentation estimate was under one hour including analysis, and the prior multi-candidate campaign took about 127 minutes across split sessions. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-18/risk-analysis-rerank-nondeterminism.md" lines="131-147" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-18/benchmark_report.md" lines="205-208" />

## Decision Rubric

### SWAP

Promote BGE+path-class when:

- Full-18 top-5 hit rate improves by at least +2 over baseline, or fixes at least two of the four failures with zero net control regression.
- Probes 3 and 14 improve, because those are the clean path-role failures.
- Probes 10 and 18 are either improved or explicitly routed to the fixture audit.
- p95 latency stays within 5% of baseline.
- Rerank score logs exist for every lane.

Promote mxbai only when:

- It loads through current runtime without silent fallback.
- `pre_rerank_score` and `reranker_score` are non-null for returned results.
- Full-18 hit rate improves by at least +2 with no more than one control regression.
- p95 latency is no worse than 25% above BGE baseline.

### HOLD

Hold when the candidate improves one or fewer failure probes, improves failures by sacrificing controls, requires aggressive static path penalties, or has latency outside the threshold without a quality gain large enough to justify it.

### NEEDS-CUSTOM

Use NEEDS-CUSTOM when a model does not fit the existing CrossEncoder path, when Qwen3/mxbai need causal-LM token scoring, when path-class factors need query-intent detection, or when fixture ambiguity dominates the result.

## If Phase 2 Fails

Use separate follow-on packets, not a larger 011:

1. **Path-role calibration packet:** implement query-intent detection, `reference/` classification, factor tuning, and control-aware path priors.
2. **Custom reranker adapter packet:** add causal-LM scoring, chat-template support, explicit warmup, and error surfacing for mxbai/Qwen3.
3. **Fixture audit packet:** continue the existing 012 packet for probe 10 first and full-18 expected-path review second. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/012-fixture-audit-10-probes/spec.md" lines="48-76" />

Convergence status: **research complete; Phase 2 should measure.**

SPAWN_AGENT_USED=no
