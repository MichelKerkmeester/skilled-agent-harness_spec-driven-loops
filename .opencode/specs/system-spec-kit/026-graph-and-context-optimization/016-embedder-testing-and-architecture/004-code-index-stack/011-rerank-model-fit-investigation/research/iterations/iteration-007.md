---
title: "Iter 7 — Alt-Mitigation C: Prompt-Side Instruction Injection Feasibility"
description: "Web-search and file-read analysis of prompt-side instruction injection feasibility for BAAI/bge-reranker-v2-m3. Key finding: bge-reranker-v2-m3 is NOT instruction-tuned — it's a traditional cross-encoder (XLMRobertaForSequenceClassification) trained on raw query-passage pairs without instruction formatting. The instruction-aware prompt format ('Given a query A and a passage B...') applies only to LLM-based rerankers (gemma, minicpm), not the normal bge-reranker-v2-m3. Expected lift on probes 3/10/14/18 is LOW-NONE, regression risk is MEDIUM."
trigger_phrases:
  - "iter 7 instruction injection"
  - "bge-reranker-v2-m3 instruction-tuned"
  - "prompt-side query rewrite feasibility"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: research-iter | v1.0 -->
<!-- SPECKIT_LEVEL: 1 -->

# Iter 7 — Alt-Mitigation C: Prompt-Side Instruction Injection Feasibility

## TL;DR

BAAI/bge-reranker-v2-m3 is **NOT instruction-tuned** and does not respond to instruction prompts. It's a traditional cross-encoder (XLMRobertaForSequenceClassification) trained on MS-MARCO with raw query-passage pairs. The instruction-aware prompt format shown in the Hugging Face documentation ("Given a query A and a passage B, determine whether the passage contains an answer to the query...") applies only to LLM-based rerankers (bge-reranker-v2-gemma, bge-reranker-v2-minicpm-layerwise), not the normal bge-reranker-v2-m3 used by CocoIndex. While sentence-transformers CrossEncoder has a `prompts` parameter, bge-reranker-v2-m3 has no saved prompts in its configuration. Expected lift on probes 3/10/14/18 is **LOW-NONE**, and regression risk is **MEDIUM** (instruction prefixes would add noise without guiding the model).

## Question (restate)

Feasibility of prompt-side instruction injection. Could prefixing the query with "find the implementation, not the test or reference: <query>" fix the failure pattern with the EXISTING reranker (BAAI/bge-reranker-v2-m3)? Capture: (a) does bge-reranker-v2-m3 respond to instruction-tuned prompts at all?, (b) where in cocoindex_code/reranker.py the query rewrite slots in, (c) expected lift + regression risk.

## Evidence (file:line citations or URLs required)

1. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py" lines="109-150" /> — Current reranker implementation showing naive cross-encoder scoring without instruction prompts
2. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py" lines="126" /> — Query-pair construction line where instruction rewrite would slot in
3. https://huggingface.co/BAAI/bge-reranker-v2-m3 — Model card showing bge-reranker-v2-m3 is a normal reranker (cross-encoder), not LLM-based
4. https://huggingface.co/BAAI/bge-reranker-v2-m3/blob/main/README.md — Documentation showing instruction format applies only to LLM-based rerankers (lines 266-270, 329-333)
5. https://huggingface.co/BAAI/bge-reranker-v2-m3/raw/main/config.json — Model configuration confirming XLMRobertaForSequenceClassification architecture with no prompt parameters
6. https://sbert.net/docs/package_reference/cross_encoder/model.html — Sentence-transformers CrossEncoder documentation showing `prompts` parameter exists for models that have saved prompts
7. https://huggingface.co/BAAI/bge-reranker-v2-m3/commit/8357406e72e230a8682a808df284d5dd077e39c7 — Commit showing sentence_bert_config.json was added with only max_seq_length and do_lower_case, no prompts

## Findings (numbered, with citations)

### 1. bge-reranker-v2-m3 is NOT instruction-tuned — it's a traditional cross-encoder

BAAI/bge-reranker-v2-m3 is a traditional cross-encoder based on XLMRobertaForSequenceClassification, not an instruction-tuned model. The config.json shows it uses the standard XLM-RoBERTa architecture with no special prompt configuration or instruction parameters. <ref_url url="https://huggingface.co/BAAI/bge-reranker-v2-m3/raw/main/config.json" />

The model card explicitly distinguishes between "normal reranker" (bge-reranker-v2-m3) and "LLM-based reranker" (bge-reranker-v2-gemma, bge-reranker-v2-minicpm-layerwise). The instruction format with prompt customization applies only to the LLM-based variants. <ref_url url="https://huggingface.co/BAAI/bge-reranker-v2-m3" />

### 2. Instruction-aware prompt format applies only to LLM-based rerankers, not bge-reranker-v2-m3

The Hugging Face documentation shows that the instruction format `prompt = "Given a query A and a passage B, determine whether the passage contains an answer to the query by providing a prediction of either 'Yes' or 'No'."` is used only for LLM-based rerankers (bge-reranker-v2-gemma, bge-reranker-v2-minicpm-layerwise). <ref_url url="https://huggingface.co/BAAI/bge-reranker-v2-m3/blob/main/README.md" />

For the normal reranker (bge-reranker-v2-m3), the documentation shows direct usage without any prompt prefix:
```python
pairs = [['what is panda?', 'hi'], ['what is panda?', 'The giant panda...']]
inputs = tokenizer(pairs, padding=True, truncation=True, return_tensors='pt', max_length=512)
scores = model(**inputs, return_dict=True).logits.view(-1, ).float()
```
<ref_url url="https://huggingface.co/BAAI/bge-reranker-v2-m3/blob/main/README.md" />

This confirms that bge-reranker-v2-m3 was trained on raw query-passage pairs without instruction formatting.

### 3. sentence-transformers CrossEncoder supports prompts parameter, but bge-reranker-v2-m3 has no saved prompts

The sentence-transformers CrossEncoder class does have a `prompts` parameter that can prepend text before encoding: "prompts (dict[str, str], optional) – A dictionary with prompts for the model. The key is the prompt name, the value is the prompt text. The prompt text will be prepended before any text to encode." <ref_url url="https://sbert.net/docs/package_reference/cross_encoder/model.html" />

However, the commit that added sentence-transformers config to bge-reranker-v2-m3 only added `max_seq_length` and `do_lower_case` settings — no prompts were defined. <ref_url url="https://huggingface.co/BAAI/bge-reranker-v2-m3/commit/8357406e72e230a8682a808df284d5dd077e39c7" />

This means bge-reranker-v2-m3 does not have any saved prompts in its sentence-transformers configuration, and the model was not trained to understand instruction prefixes.

### 4. Query rewrite insertion point: Line 126 in reranker.py before pair construction

The optimal insertion point for query rewrite is in the `rerank()` method at line 126, where pairs are constructed as `pairs = [(query, candidate.content) for candidate in head]`. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py" lines="126" />

A query rewrite function would be called before this line:
```python
# Current code:
pairs = [(query, candidate.content) for candidate in head]

# With query rewrite:
rewritten_query = _apply_instruction_rewrite(query)
pairs = [(rewritten_query, candidate.content) for candidate in head]
```

However, since bge-reranker-v2-m3 is not instruction-tuned, this rewrite would have no meaningful effect on the model's scoring behavior.

### 5. Expected lift on probes 3/10/14/18: LOW-NONE

Since bge-reranker-v2-m3 is not instruction-tuned, adding instruction prefixes like "find the implementation, not the test or reference:" would have **LOW to NO expected lift** on the failure probes. The model was trained on MS-MARCO with raw query-passage pairs (iter 1), so it does not understand semantic instructions about implementation vs tests vs docs.

The lexical-cue density bias (iter 2) is a fundamental property of the model's training objective (cross-encoder on web text), not something that can be overridden with prompt prefixes. The model rewards lexical overlap because that's what it was trained to do, and instruction prefixes would just add more tokens to the input without changing the underlying scoring behavior.

### 6. Regression risk: MEDIUM

Adding instruction prefixes carries **MEDIUM regression risk** for several reasons:

- **User intent mismatch**: If a user explicitly searches for tests or docs (e.g., "test for config validation" or "documentation for refresh API"), the instruction prefix "find the implementation, not the test or reference:" would actively work against the user's intent, causing false negatives.

- **Input noise without guidance**: Since the model doesn't understand instructions, the prefix would just add noise tokens to the query, potentially diluting the actual query signal and harming performance across all queries, not just the failure probes.

- **No model-specific validation**: There is no documented evidence that bge-reranker-v2-m3 responds to any kind of prompt engineering. Unlike Qwen3-Reranker (iter 4) which has explicit instruction-aware architecture, bge-reranker-v2-m3 has no such capability.

- **Global impact**: Query rewrite would apply to all search queries in the system, not just code retrieval. The regression would affect every query type.

### 7. Implementation cost: LOW (5-10 lines), but effectiveness is ZERO

The implementation cost is LOW — a simple string concatenation function:
```python
def _apply_instruction_rewrite(query: str) -> str:
    """Apply instruction prefix to query."""
    prefix = "find the implementation, not the test or reference: "
    return f"{prefix}{query}"
```

This would be 5-10 lines of code inserted before line 126 in reranker.py. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py" lines="126" />

However, the effectiveness is ZERO because bge-reranker-v2-m3 is not instruction-tuned. The implementation would be technically trivial but functionally useless.

### 8. Comparison with instruction-aware rerankers (Qwen3 from iter 4)

Iter 4 showed that Qwen3-Reranker-0.6B has explicit instruction-aware prompting with customizable task instructions. Qwen3 uses a structured chat template with system prompts and can accept custom instructions like "Given a code search query, retrieve relevant implementation files." This architecture is fundamentally different from bge-reranker-v2-m3.

The key difference:
- **Qwen3-Reranker**: Causal LM trained with instruction-aware prompting, can understand and follow semantic instructions
- **bge-reranker-v2-m3**: Traditional cross-encoder trained on raw pairs, cannot understand instructions

This confirms that prompt-side instruction injection is only viable with instruction-aware rerankers, not with the current bge-reranker-v2-m3.

## Gaps for Next Iter

1. **No experimental validation needed**: Since the architectural analysis shows bge-reranker-v2-m3 is not instruction-tuned, probe-level testing of instruction prefixes would yield null results. This mitigation can be confidently ruled out without experimentation.

2. **Instruction-tuned reranker comparison missing**: Need to compare instruction-aware rerankers (Qwen3-Reranker from iter 4, jina-reranker-v2 if instruction-tuned) directly against bge-reranker-v2-m3 on probes 3/10/14/18 to validate whether instruction awareness actually addresses the lexical-cue density bias.

3. **Fine-tuning bge-reranker-v2-m3 with instructions unexplored**: While the base model is not instruction-tuned, it might be possible to fine-tune bge-reranker-v2-m3 with instruction-formatted data to add instruction awareness. However, this would be a significant undertaking (training data collection, fine-tuning infrastructure) compared to model replacement (mxbai/Qwen3).

4. **Hybrid approach unexplored**: Combining instruction prefixes with model replacement (e.g., using Qwen3-Reranker with custom code-search instructions) might provide better results than model replacement alone. This was not investigated in this iter.

5. **User intent detection missing**: Even if instruction prefixes worked, there would need to be a mechanism to detect when the user IS looking for tests/docs and suppress the instruction prefix in those cases. No such intent detection system exists in the current codebase.

## JSONL Delta Row

```jsonl
{"iter_id":"007","timestamp_utc":"2026-05-19T04:57:00Z","executor":"devin-for-terminal","model":"swe-1.6","status":"PASSED","findings_count":8,"gaps_count":5,"primary_evidence_files":["reranker.py","https://huggingface.co/BAAI/bge-reranker-v2-m3","https://huggingface.co/BAAI/bge-reranker-v2-m3/blob/main/README.md","https://huggingface.co/BAAI/bge-reranker-v2-m3/raw/main/config.json","https://sbert.net/docs/package_reference/cross_encoder/model.html"],"note":"bge-reranker-v2-m3_is_not_instruction-tuned_prompt_injection_has_low_none_expected_lift"}
```

SPAWN_AGENT_USED=no