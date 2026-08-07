---
title: "Iter 3 — mxbai-rerank-base-v2 Architecture Deep-Read"
description: "Web-search evidence on mxbai-rerank-base-v2 architecture, training methodology, and inference path. Key finding: mxbai-rerank-v2 is NOT a traditional cross-encoder — it's a Qwen-2.5 causal LM trained with reinforcement learning to output relevance scores."
trigger_phrases:
  - "iter 3 mxbai architecture"
  - "mxbai-rerank-base-v2 training data"
  - "mxbai causal LM vs cross-encoder"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: research-iter | v1.0 -->
<!-- SPECKIT_LEVEL: 1 -->

# Iter 3 — mxbai-rerank-base-v2 Architecture Deep-Read

## TL;DR

mxbai-rerank-base-v2 is **not a traditional cross-encoder** like bge-reranker-v2-m3 — it's a Qwen-2.5 causal LM (0.5B params) trained with a three-step reinforcement learning process (GRPO → Contrastive Learning → Preference Learning) to output relevance scores via the formula `score = logits[last_token, "1"] - logits[last_token, "0"]`. The model uses a chat template prompt (`query: {query}\ndocument: {document}`) and was explicitly trained for code support, achieving 31.73 NDCG@10 on CoIR-Retrieval/cosqa (vs bge-reranker-v2-m3 at 24.86). This architectural shift from cross-encoder to RL-optimized causal LM likely addresses the lexical-cue density bias by training the model to understand semantic relevance rather than lexical overlap.

## Question (restate)

Deep architecture read of mixedbread-ai/mxbai-rerank-base-v2. Capture: (a) training data composition (any code data?), (b) loss function + training objective, (c) inference scoring path (true cross-encoder vs causal-LM scoring), (d) v1->v2 changes, (e) published BEIR/MTEB/CodeSearchNet numbers if any, (f) reasoned probability it fixes probes 3/10/14/18 — argue from architecture, not hope.

## Evidence (URL citations)

1. https://huggingface.co/mixedbread-ai/mxbai-rerank-base-v2 — Model card with architecture details (Qwen2ForCausalLM), training details, and benchmark results
2. https://mixedbread.com/blog/mxbai-rerank-v2 — Technical blog post with v1 vs v2 comparison table, training methodology, and code search benchmarks
3. https://github.com/mixedbread-ai/mxbai-rerank — GitHub repository with usage examples and benchmark results
4. https://www.mixedbread.com/docs/models/reranking — Documentation with training methodology and use cases (code snippets, function call ranking)
5. https://huggingface.co/tss-deposium/mxbai-rerank-base-v2-onnx-fp16 — ONNX export documentation revealing the causal LM scoring formula and chat template prompt

## Findings (numbered, with citations)

### 1. Architecture: Qwen-2.5 causal LM, NOT a traditional cross-encoder

mxbai-rerank-base-v2 is built on Qwen-2.5 as a causal LM (Qwen2ForCausalLM), not a traditional cross-encoder architecture like bge-reranker-v2-m3. This is a fundamental architectural difference that changes how the model scores query-document pairs. <ref_url url="https://huggingface.co/mixedbread-ai/mxbai-rerank-base-v2" />

The model configuration shows:
- `architectures: ["Qwen2ForCausalLM"]`
- `model_type: "qwen2"`
- 0.5B parameters (896 hidden size, 24 layers, 14 attention heads)
- 32K token context window (8K default, 32K compatible) <ref_url url="https://huggingface.co/mixedbread-ai/mxbai-rerank-base-v2" />

### 2. Training methodology: Three-step reinforcement learning process

The model was trained using a three-step RL process, not traditional contrastive loss:

1. **GRPO (Guided Reinforcement Prompt Optimization)**: Taught the model to output 1 for relevant documents and 0 for irrelevant ones. Ensures format consistency and provides a strong performance boost. <ref_url url="https://mixedbread.com/blog/mxbai-rerank-v2" />
2. **Contrastive Learning**: Developed fine-grained understanding of query-document relationships, similar to how embedding models learn semantic similarity. <ref_url url="https://mixedbread.com/blog/mxbai-rerank-v2" />
3. **Preference Learning**: Tuned the model to rank the most relevant documents highest, mirroring how real users judge search results. <ref_url url="https://mixedbread.com/blog/mxbai-rerank-v2" />

This RL-based training is fundamentally different from bge-reranker-v2-m3's training on MS-MARCO with standard cross-encoder loss.

### 3. Inference scoring path: Causal LM with binary token scoring

The inference path uses a causal LM with a specific scoring formula, not cross-encoder pair encoding:

**Scoring formula**: `score = logits[last_token, "1"] - logits[last_token, "0"]` <ref_url url="https://huggingface.co/tss-deposium/mxbai-rerank-base-v2-onnx-fp16" />

**Chat template prompt**:
```
<|im_start|>system
You are Qwen, created by Alibaba Cloud. You are a helpful assistant.<|im_end|>
<|im_start|>user
query: {query}
document: {document}
{task_prompt}<|im_end|>
<|im_start|>assistant
```

The model is trained to output "1" for relevant documents and "0" for irrelevant ones, and the score is computed as the logit difference between these tokens at the last position. <ref_url url="https://huggingface.co/tss-deposium/mxbai-rerank-base-v2-onnx-fp16" />

This is fundamentally different from bge-reranker-v2-m3's cross-encoder approach, which encodes query-document pairs directly through a classification head.

### 4. Training data composition: Code support explicitly advertised, but specific datasets not documented

The model explicitly advertises "code support" and "code & SQL snippets" as a use case, and the documentation states the models were tested on "code-search benchmarks" including CoIR-Retrieval/cosqa. <ref_url url="https://mixedbread.com/blog/mxbai-rerank-v2" /> <ref_url url="https://www.mixedbread.com/docs/models/reranking" />

However, the specific training dataset composition (whether CodeSearchNet, CoIR, or other code corpora were included) is not publicly documented. The technical report is noted as "coming soon" on both the Hugging Face model card and GitHub repository. <ref_url url="https://huggingface.co/mixedbread-ai/mxbai-rerank-base-v2" /> <ref_url url="https://github.com/mixedbread-ai/mxbai-rerank" />

The API version is "trained on new data every month" to maintain recency, but the open-source version's training data composition remains unspecified. <ref_url url="https://www.mixedbread.com/docs/models/reranking" />

**Inference**: While not explicitly documented, the strong code search performance (31.73 NDCG@10 on CoIR vs bge-reranker-v2-m3's 24.86) and explicit "code support" positioning strongly suggest code data was included in training, but the specific corpora are unknown.

### 5. v1->v2 architectural changes: Major shift from cross-encoder to RL-optimized causal LM

The v1 to v2 transition represents a major architectural shift:

| Feature | V1 Models | V2 Models | Improvement |
|---|---|---|---|
| Architecture | Cross-encoder | RL-optimized Qwen-2.5 | More powerful base model |
| Parameters | Up to 435M | Up to 1.5B | Bigger, but better |
| Languages | English-focused | 100+ languages | Global coverage |
| Context Length | 512 tokens | 8K tokens (32K compatible) | 64x longer context |
| BEIR Score | 49.32 | 57.49 | +8 percentage points |
| Use Cases | Simple text support | Support for JSON, Code, MCP, more | Broader application support |
| Speed | Good balance | 8x faster than similar models | Still Fast | <ref_url url="https://mixedbread.com/blog/mxbai-rerank-v2" />

The key change is from traditional cross-encoder architecture to an RL-optimized Qwen-2.5 causal LM, which fundamentally changes how the model understands and scores query-document relevance.

### 6. Published benchmark numbers: Strong performance across BEIR, multilingual, and code search

**BEIR Benchmark** (industry-standard for English retrieval):
- mxbai-rerank-base-v2: 55.49 (blog) / 55.57 (HF card) BEIR Avg
- bge-reranker-v2-m3: 53.94 BEIR Avg
- mxbai-rerank-large-v2: 57.49 BEIR Avg <ref_url url="https://mixedbread.com/blog/mxbai-rerank-v2" /> <ref_url url="https://huggingface.co/mixedbread-ai/mxbai-rerank-base-v2" />

**Code Search** (CoIR-Retrieval/cosqa NDCG@10):
- mxbai-rerank-base-v2: 31.73
- mxbai-rerank-large-v2: 32.05
- bge-reranker-v2-m3: 24.86
- bge-reranker-v2-gemma: 31.51 <ref_url url="https://mixedbread.com/blog/mxbai-rerank-v2" /> <ref_url url="https://huggingface.co/mixedbread-ai/mxbai-rerank-base-v2" />

**Multilingual**:
- mxbai-rerank-base-v2: 28.56 multilingual, 83.70 Chinese
- mxbai-rerank-large-v1: 21.88 multilingual, 72.53 Chinese <ref_url url="https://huggingface.co/mixedbread-ai/mxbai-rerank-base-v2" />

**Latency** (A100 GPU):
- mxbai-rerank-base-v2: 0.67s
- bge-reranker-v2-m3: 3.05s
- bge-reranker-v2-gemma: 7.20s <ref_url url="https://www.mixedbread.com/docs/models/reranking" />

mxbai-rerank-base-v2 outperforms bge-reranker-v2-m3 by ~1.6 points on BEIR and ~7 points on code search (CoIR), while being 4.5x faster.

### 7. Reasoned probability of fixing probes 3/10/14/18: HIGH (70-80%) based on architectural advantages

**Reasoning from architecture, not hope**:

The lexical-cue density bias in bge-reranker-v2-m3 (iter 2) stems from:
1. **Cross-encoder architecture trained on MS-MARCO** (web text) — rewards lexical overlap
2. **Content-only scoring** — no semantic role awareness (test vs implementation)
3. **Tight but incorrect margins** — confidently ranks lexically dense distractors

mxbai-rerank-base-v2 addresses these through:

1. **RL-based training with preference learning** — trained to rank "how real users judge search results" rather than lexical overlap. The preference learning step specifically tunes the model to prioritize the most relevant documents, which should penalize semantically peripheral but lexically dense distractors. <ref_url url="https://mixedbread.com/blog/mxbai-rerank-v2" />

2. **Causal LM with chat template** — the `query: {query}\ndocument: {document}` prompt structure provides more contextual framing than raw cross-encoder pair encoding, potentially helping the model distinguish between "searching for implementation" vs "searching for tests/docs." <ref_url url="https://huggingface.co/tss-deposium/mxbai-rerank-base-v2-onnx-fp16" />

3. **Code-specific training** — explicit code support and strong CoIR performance (31.73 vs 24.86) suggests the model was trained on code data and learned to distinguish implementation files from tests/docs, which directly addresses the probe failure pattern. <ref_url url="https://mixedbread.com/blog/mxbai-rerank-v2" />

4. **Longer context window** (8K vs 512 tokens) — can process more file content, potentially capturing semantic context that helps distinguish implementation from test/doc rather than relying on local lexical cues. <ref_url url="https://mixedbread.com/blog/mxbai-rerank-v2" />

**Caveats**:
- The model still uses content-only scoring (no path-class metadata in the prompt), so path-class boost mitigation would still be needed for full robustness.
- Training data composition is unknown — if code data was minimal, the architectural advantages may not fully materialize.
- Probe-level validation is required — this analysis is based on architectural reasoning, not actual probe testing.

**Probability assessment**: 70-80% chance of improving probe 3/10/14/18 outcomes based on (a) RL preference learning for semantic relevance, (b) code-specific training evidence, (c) 7-point CoIR performance gap over bge-reranker-v2-m3. The remaining 20-30% uncertainty is due to unknown training data composition and lack of path-class awareness in the scoring path.

## Gaps for Next Iter

1. **Training data composition unknown**: The specific code corpora (CodeSearchNet, CoIR, etc.) used in mxbai-rerank-base-v2 training are not documented. Need to find the technical report or contact Mixedbread for this information.

2. **Probe-level validation missing**: This analysis is based on architectural reasoning and benchmark numbers, not actual testing on probes 3/10/14/18. Need to run the same probe analysis from iter 2 with mxbai-rerank-base-v2 to validate the 70-80% probability assessment.

3. **Path-class boost not investigated**: mxbai-rerank-base-v2 still uses content-only scoring without path-class metadata. The combined effect of (better model + path-class boost) is unknown.

4. **jina-reranker-v3 architecture missing**: Iter 1 identified jina-reranker-v3 as the highest performer (63.28 on CoIR). Need architectural analysis of jina to complete the comparison set (bge, mxbai, jina).

5. **bge-reranker-v2-m3 training data missing**: Need to confirm bge-reranker-v2-m3's training data composition (MS-MARCO only vs code-inclusive) to complete the domain mismatch analysis.

## JSONL Delta Row

```jsonl
{"iter_id":"003","timestamp_utc":"2026-05-19T04:53:00Z","executor":"devin-for-terminal","model":"swe-1.6","status":"PASSED","findings_count":7,"gaps_count":5,"primary_evidence_files":["https://huggingface.co/mixedbread-ai/mxbai-rerank-base-v2","https://mixedbread.com/blog/mxbai-rerank-v2","https://github.com/mixedbread-ai/mxbai-rerank","https://www.mixedbread.com/docs/models/reranking","https://huggingface.co/tss-deposium/mxbai-rerank-base-v2-onnx-fp16"],"note":"mxbai-rerank-v2_is_causal_LM_not_cross-encoder"}
```

SPAWN_AGENT_USED=no
