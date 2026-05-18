---
title: "Iter 1 — reranker-model-survey (016/011/001 research)"
iter_number: 1
dimension: reranker-model-survey
phase_id: "001-reranker-integration"
executor: cli-devin
model: swe-1.6
recipe: agent-config-deep-research-iter.json
---

## 1. RESEARCH QUESTION

Survey pre-trained cross-encoder rerankers viable for code retrieval and rank `jina-reranker-v2-base-multilingual`, `mxbai-rerank-large-v2`, `bge-reranker-v2-m3`, and `gte-multilingual-reranker-base` by reported retrieval signal, RAM/disk footprint, latency, and license fit for 016/011/001.

## 2. SCOPE READ

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-code-embedder-coderank/003-comparison-measure/decision-record.md:55-64` — benchmark method and constraints; confirms no reranker/rescue layer existed during 018/003.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-code-embedder-coderank/003-comparison-measure/decision-record.md:82-90` — 018/003 result: jina-code and gemma tied at 7/18 = 0.389, with jina-code lower p95 than gemma.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/011-section3-structural-improvements/spec.md:50-56` — umbrella rationale: embedder swap may not be dominant; reranker/chunking/hybrid affect all embedders.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/011-section3-structural-improvements/spec.md:95-105` — risk envelope: rerankers may add ~500MB-2GB and use the 018/003 fixture.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/011-section3-structural-improvements/001-reranker-integration/spec.md:49-62` — phase question, named candidates, integration point, and <500ms p95 added-latency target.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-code-embedder-coderank/002-baseline-fixture/evidence/code-retrieval-fixture.json:1-146` — 18-pair quality fixture, with easy/medium/hard code and spec-kit queries.
- `https://huggingface.co/jinaai/jina-reranker-v2-base-multilingual` — HF model card / metadata for Jina reranker.
- `https://huggingface.co/mixedbread-ai/mxbai-rerank-large-v2` and `https://www.mixedbread.com/docs/models/reranking` — HF metadata and vendor benchmark/latency page for mxbai rerank v2.
- `https://huggingface.co/BAAI/bge-reranker-v2-m3` — HF model card / metadata for BGE reranker.
- `https://huggingface.co/Alibaba-NLP/gte-multilingual-reranker-base` and `https://arxiv.org/abs/2407.19669` — HF model card and mGTE paper for GTE multilingual reranker.
- `https://archersama.github.io/coir/` and `https://arxiv.org/abs/2407.02883` — CoIR benchmark context for code information retrieval.

## 3. FINDINGS

1. The local baseline leaves enough headroom for a reranker bake-off: 018/003 found both primary embedders at only 7/18 top-3 hits (0.389), so a reranker should be evaluated as a structural lever rather than as another embedder swap. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-code-embedder-coderank/003-comparison-measure/decision-record.md:82-90`; umbrella rationale at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/011-section3-structural-improvements/spec.md:50-56`.

2. The implementation constraint is strict: rerank after embedder top-K retrieval, before returning results, and target <500ms added p95 latency. This strongly favors 300M-600M encoder rerankers for default-on local use and pushes 1.5B models into challenger/opt-in status. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/011-section3-structural-improvements/001-reranker-integration/spec.md:57-62`; RAM risk envelope at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/011-section3-structural-improvements/spec.md:97-100`.

3. `jinaai/jina-reranker-v2-base-multilingual` has the strongest cited code-specific metric among the directly compared small/medium models: the model card reports 278M parameters, BEIR nDCG@10 53.17, MLDR recall@10 68.95, and CodeSearchNet MRR@10 71.36; the same card lists `bge-reranker-v2-m3` at CodeSearchNet 62.86. It is also compact by raw weight size (~278M BF16 ≈ 0.56GB before runtime overhead). Evidence: `https://huggingface.co/jinaai/jina-reranker-v2-base-multilingual` and model-card benchmark table in search result; license metadata `license:cc-by-nc-4.0`.

4. Jina’s license is the main blocker: the HF model card marks `license:cc-by-nc-4.0` and states it is licensed for research/evaluation, with commercial usage directed to Jina APIs/marketplaces. That makes it a good evaluation oracle but risky as the default production/local-distribution recommendation unless the packet explicitly allows non-commercial model weights. Evidence: `https://huggingface.co/jinaai/jina-reranker-v2-base-multilingual`.

5. `mixedbread-ai/mxbai-rerank-large-v2` is the strongest Apache-2.0 accuracy challenger but is probably too heavy for default-on local rerank without measurement. Mixedbread reports Apache-2.0, 1.5B parameters, 100+ languages, long context, BEIR score 57.49, code-search score 32.05, and A100 latency 0.89s per query; HF metadata shows safetensors total file size around 3.09GB. Evidence: `https://www.mixedbread.com/docs/models/reranking`, `https://mixedbread.com/blog/mxbai-rerank-v2`, `https://huggingface.co/mixedbread-ai/mxbai-rerank-large-v2`.

6. `BAAI/bge-reranker-v2-m3` is the safest mature Apache baseline but not the most code-promising candidate. HF metadata reports Apache-2.0, multilingual sentence-transformers support, `AutoModelForSequenceClassification`, and 567,755,777 F32 parameters (~2.27GB raw F32; less if converted/quantized). The BGE card describes it as a lightweight multilingual reranker with fast inference, while the Jina comparison table reports lower CodeSearchNet MRR@10 (62.86) than Jina (71.36). Evidence: `https://huggingface.co/BAAI/bge-reranker-v2-m3`; comparison table at `https://huggingface.co/jinaai/jina-reranker-v2-base-multilingual`.

7. `Alibaba-NLP/gte-multilingual-reranker-base` is the best first local implementation candidate on license/size/context balance. HF reports Apache-2.0, 306M model size, 8192 max input tokens, >70 languages, encoder-only architecture, lower hardware requirements, and “10x increase in inference speed” versus decode-only LLM rerankers; raw F16 weights are approximately 0.61GB before runtime overhead. GAP: no authoritative code-specific CodeSearchNet/CoIR score found on its model card. Evidence: `https://huggingface.co/Alibaba-NLP/gte-multilingual-reranker-base`; mGTE paper `https://arxiv.org/abs/2407.19669`.

8. CoIR is useful benchmark context but does not settle this reranker choice. CoIR is a code information retrieval benchmark with 10 curated code datasets and MTEB/BEIR-aligned schema, but the public leaderboard evidence found in this pass focuses on first-stage retrieval models, not the four cross-encoder rerankers as second-stage rerankers. GAP: no authoritative CoIR leaderboard row found for these exact reranker configurations. Evidence: `https://archersama.github.io/coir/`; CoIR paper `https://arxiv.org/abs/2407.02883`.

### Ranked Candidate Table

| Rank | Candidate | Reported retrieval signal | Footprint estimate | Latency signal | License | Iter-1 verdict |
|---:|---|---|---:|---|---|---|
| 1 | `Alibaba-NLP/gte-multilingual-reranker-base` | SOTA-style multilingual reranking claims; mGTE paper reports strong multilingual/long-context retrieval; GAP: no code-specific score found | 306M F16, ~0.61GB raw weights + overhead | Model card claims encoder-only design and 10x speed vs decode-only LLM rerankers; GAP: no per-query local/MPS latency | Apache-2.0 | Best first local bake-off candidate: license-safe, compact, long-context, likely fits <500ms only if K is bounded |
| 2 | `mixedbread-ai/mxbai-rerank-large-v2` | BEIR 57.49; code-search score 32.05; vendor claims code/SQL suitability | 1.5B, ~3.09GB HF file size + overhead | 0.89s/query on A100 for benchmark setup; likely opt-in/challenger for local MPS | Apache-2.0 | Accuracy challenger, not default-first under current latency target |
| 3 | `BAAI/bge-reranker-v2-m3` | BEIR 53.65; MLDR 59.73; CodeSearchNet 62.86 in Jina comparison table | 567.8M F32, ~2.27GB raw F32 + overhead | “Lightweight / fast inference” card language; GAP: no comparable per-query latency found | Apache-2.0 | Stable baseline/challenger; lower code metric than Jina and larger than GTE |
| 4 | `jinaai/jina-reranker-v2-base-multilingual` | BEIR 53.17; MLDR 68.95; CodeSearchNet 71.36, strongest code-specific cited metric here | 278M BF16, ~0.56GB raw weights + overhead | GAP: no authoritative comparable latency found in this pass | CC-BY-NC-4.0 | Best research/evaluation oracle, but license-constrained for default production use |

## 4. RECOMMENDATIONS

1. Use `Alibaba-NLP/gte-multilingual-reranker-base` as the first implementation bake-off target for 016/011/001 because it best matches the phase constraints: Apache-2.0, compact 306M footprint, 8k context, and credible speed architecture.
2. Include `mixedbread-ai/mxbai-rerank-large-v2` as an accuracy challenger only if the harness supports opt-in K control (K=10/20/50) and measures MPS p50/p95 latency; its A100 0.89s/query signal makes default-on risky.
3. Include `BAAI/bge-reranker-v2-m3` as a mature Apache baseline if time allows, especially to compare against existing BGE ecosystem tooling.
4. Treat `jinaai/jina-reranker-v2-base-multilingual` as an evaluation-only upper-bound candidate unless license policy explicitly permits CC-BY-NC weights for this local workflow.
5. Next research should shift from model-card survey to a local benchmark design: rerank the same 18-pair fixture over semantic top-K candidates and measure hit-rate lift plus added p95 latency.

## 5. JSONL DELTA ROW
