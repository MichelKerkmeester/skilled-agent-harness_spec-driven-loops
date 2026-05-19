---
title: "Research: Post-May-2026 Text Embedder Survey for mk-spec-memory"
description: "Hugging Face survey of post-2026-05-01 text embedder releases or updates from named labs, filtered for local mk-spec-memory viability against jina-embeddings-v3 + rescue."
trigger_phrases:
  - "newer text embedders survey"
  - "post may 2026 embedder survey"
  - "mk-spec-memory hf crawl"
  - "jina-v3 hold decision"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion-arc/004-newer-text-embedders-survey"
    last_updated_at: "2026-05-18T20:41:03Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Documented post-May HF candidate survey."
    next_safe_action: "Keep jina-embeddings-v3 + rescue as default; only bench if an operator manually promotes a CONSIDER candidate."
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion-arc/004-newer-text-embedders-survey/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "004-newer-text-embedders-survey-research-20260518"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Post-May candidate verdicts: SKIP=3, CONSIDER=3, MEASURE=0."
---
# Research: Post-May-2026 Text Embedder Survey for mk-spec-memory

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->

---

## 1. Metadata

| Field | Value |
|---|---|
| Research date | 2026-05-18 |
| Researcher role | Text-embedder release-tracking researcher |
| Baseline | `jinaai/jina-embeddings-v3` + rescue layer, ADR-012, May 17 2026 |
| Baseline reference size | ~570M params; local reference memory ~495 MB in existing packet context |
| Candidate gate | Released, updated, or materially published after 2026-05-01 |
| Hard filters | Text-tuned; not code-tuned; Apple Silicon compatible; no xformers-only gate; <1 GB loaded target; paraphrase/text-matching, recall, or hard-negative evidence |
| Bench action | None. Zero MEASURE candidates. |

Method: HF web search was used for the named labs, then HF model pages and HF API metadata were checked for `createdAt`, `lastModified`, tags, parameter counts, and source-card claims. The API timestamps below were retrieved on 2026-05-18.

Baseline comparison note: `jina-embeddings-v3` reports English MTEB average 65.60, English retrieval 53.87, multilingual average 64.44, and multilingual retrieval 57.98 in its HF performance discussion. It also has a text-matching adapter, which matters for paraphrase-like recall in mk-spec-memory.

---

## 2. Executive Verdict

**Standing decision: HOLD on `jina-embeddings-v3 + rescue layer`.**

The survey found no post-May-2026 candidate that is simultaneously stronger on paper, cleanly local-first, Apple-Silicon friendly, and under the <1 GB loaded target. The best watch-list candidates are IBM Granite R2 97M/311M and Jina's v5 omni small text-matching GGUF path, but each misses the MEASURE bar:

- IBM R2 is efficient and Apache-2.0, but published English retrieval scores do not clearly beat jina-v3's reported English retrieval baseline.
- Jina v5 omni small text-matching GGUF is plausibly strong for text matching and Apple/llama.cpp use, but it is a multimodal GGUF packaging path with a non-upstream fork requirement and no direct mk-spec-memory paper win over the existing baseline.
- NVIDIA's post-May-updated embedding models are too large and multimodal-first for this local text embedder slot.

Verdict count:

| Verdict | Count | Models |
|---|---:|---|
| MEASURE | 0 | None |
| CONSIDER | 3 | IBM Granite 97M R2, IBM Granite 311M R2, Jina v5 omni small text-matching GGUF |
| SKIP | 3 | Jina v5 omni nano text-matching BF16, NVIDIA Llama Nemotron Embed VL 1B v2, NVIDIA Omni-Embed Nemotron 3B |

---

## 3. Candidate Triage

| Verdict | Model ID | Post-May event | Size and memory read | MTEB-en / text score reported | Training / data summary | License | Paraphrase or hard-negative signal | Apple Silicon compatibility |
|---|---|---|---|---|---|---|---|---|
| CONSIDER | `ibm-granite/granite-embedding-97m-multilingual-r2` | HF API `lastModified=2026-05-18`; model card release field says 2026-04-29; paper/blog surfaced after May 1 | 97.4M BF16 params, ~195 MB weights; likely under 1 GB loaded | English retrieval v2 50.1; multilingual retrieval 59.6; LongEmbed 65.5 | ModernBERT-based; pruned from 311M; multiple-teacher distillation plus contrastive fine-tuning; permissive web title-body pairs, public paired data, IBM internal technical pairs, IBM synthetic multilingual long-doc pairs | Apache-2.0 | Sentence-similarity card plus contrastive retrieval training; no specific paraphrase-recall win over jina-v3 | Yes. SentenceTransformers, Transformers, ONNX/OpenVINO; Flash Attention 2 optional, not required |
| CONSIDER | `ibm-granite/granite-embedding-311m-multilingual-r2` | HF API `lastModified=2026-05-18`; model card release field says 2026-04-29; paper/blog surfaced after May 1 | 311.7M BF16 params, ~623 MB weights; probably under 1 GB loaded but peak should be measured before production | English retrieval v2 52.6; multilingual retrieval 64.0; LongEmbed 71.7 | ModernBERT with multilingual tokenizer; multiple-teacher distillation, contrastive fine-tuning, Matryoshka learning; same four broad data sources as 97M | Apache-2.0 | Strong retrieval/long-doc profile; no direct paraphrase-recall claim beyond sentence-similarity support | Yes. SentenceTransformers, Transformers, ONNX/OpenVINO; Flash Attention 2 optional, not required |
| SKIP | `jinaai/jina-embeddings-v5-omni-nano-text-matching` | HF API `lastModified=2026-05-17`; paper published after May 1 | 947.6M BF16 params, ~1.90 GB weights; fails raw <1 GB target | No standalone MTEB-en card score; aligned with v5 text-nano text-matching vector space | Jina v5 omni: multimodal frozen-tower composition aligned to text-only v5 nano text-matching; supports text/image/video/audio | CC BY-NC 4.0 | Explicit text-matching target, but multimodal package is not the clean local text slot | Not for this slot. SentenceTransformers works, but raw BF16 exceeds memory target and uses custom code |
| CONSIDER | `jinaai/jina-embeddings-v5-omni-small-text-matching-GGUF` | HF API `createdAt=2026-05-03`, `lastModified=2026-05-12` | Full omni family ~1.56B params; text GGUF has Q4/Q5/Q8 quant levels and is likely sub-1GB for text-only, but exact loaded peak was not measured | No MTEB-en card score for this GGUF; same task space as `jinaai/jina-embeddings-v5-text-small-text-matching` | GGUF + multimodal-projector build of Jina v5 omni small text-matching; task-aligned with text-only v5 small text-matching | CC BY-NC 4.0 | Strongest paraphrase-like signal in the post-May set because it is explicitly text-matching targeted | Maybe. Text-only GGUF path is llama.cpp-friendly, but the card requires Jina's `feat-v5-omni` llama.cpp fork, so this is not clean enough for MEASURE |
| SKIP | `nvidia/llama-nemotron-embed-vl-1b-v2` | HF API `lastModified=2026-05-12`; release field says 2025-12-18 | 1.68B BF16 params, ~3.36 GB weights; fails <1 GB target | Internal multimodal/ViDoRe results, not a comparable MTEB-en text score | VLM embedding model using Llama 3.2 1B plus SigLIP2 image encoder; contrastive training for query-document/page matching | NVIDIA Open Model License plus Llama terms | Positive-aware hard-negative mining appears in the cited NVIDIA retrieval work; model is visual-document first | No for this slot. SentenceTransformers works, but size and multimodal design fail local text-filter constraints |
| SKIP | `nvidia/omni-embed-nemotron-3b` | HF API `lastModified=2026-05-06`; release field says 2025-10-01 | 4.7B to 5B BF16 params, ~9.4 GB weights; fails <1 GB target | Text retrieval benchmark average nDCG@10 0.6059; no comparable MTEB-en average | Multimodal model on Qwen2.5-Omni thinker; text/image/audio/video retrieval; cites NV-Retriever hard-negative mining | NVIDIA noncommercial/evaluation terms plus Qwen research license | Hard-negative mining lineage, but model is multimodal and very large | No. Custom code and model size are incompatible with the mk-spec-memory local default slot |

### Triage Rationale

`MEASURE` requires a paper-level reason to believe the candidate will beat jina-v3 on the mk-spec-memory paraphrase-recall shape while fitting the local runtime envelope. None met all three tests.

IBM R2 is the only clean local-first new family. The 311M model's multilingual retrieval and LongEmbed numbers are strong, but its English retrieval v2 score, 52.6, is below the jina-v3 English retrieval figure, 53.87. The 97M model is excellent for its size, not clearly better than the current production default.

Jina v5 omni small text-matching GGUF is the most tempting follow-up because it is task-targeted and has a quantized text-only path. The problem is operational: it is not the normal HF/SentenceTransformers path, and the card calls for a Jina llama.cpp fork. That makes it a watch-list item, not a measurement trigger.

---

## 4. Screened Labs With No Eligible Post-May Candidate

| Lab / family | Screen result | Reason not promoted into candidate table |
|---|---|---|
| BAAI / BGE | No post-2026-05-01 text embedder update found in the requested lane | `BAAI/bge-m3` is old in HF API metadata and already measured/lost in the existing bake-off context |
| Google | No post-May HF text embedder update found | `google/embeddinggemma-300m` is local-friendly but last modified in 2025 |
| Snowflake | No post-May HF text embedder update found | Arctic embed v2.0 family is 2025-era; no fresh post-May-2026 model surfaced |
| Alibaba-NLP | No post-May HF text embedder update found | GTE ModernBERT/GTE multilingual candidates are 2025-era or before the May 2026 date gate |
| Salesforce | No post-May local text embedder candidate found | SFR embedding family surfaced as older and too large where relevant |
| Nomic | No post-May 2026 text embedder update found | `nomic-embed-text-v2-moe` and GGUF variants are 2025-era; v1/v1.5 updates are not stronger than measured/default baseline |
| Qwen embedding | Date gate failed for the main local candidate | `Qwen/Qwen3-Embedding-0.6B` is strong on MTEB but HF API `lastModified=2026-04-20`, before the requested cutoff, and BF16 weights are ~1.19 GB |
| Mistral embedding | No eligible HF local model found | Search did not surface a post-May open HF text embedder under Mistral that fits local-first constraints |
| Voyage / voyage-3 | Date gate failed | `voyageai/voyage-4-nano` is Apache-2.0 and small, but HF API `lastModified=2026-03-02`; older `voyage-3/3.5` entries are not post-May-2026 |

---

## 5. Decision

No Phase-2 benchmark is authorized by this run.

The existing bake-off scaffold remains the right place if an operator later decides to measure a CONSIDER candidate:

`../../002-spec-memory-stack/004-spec-memory-embedder-bake-off/`

Suggested future trigger: only revisit if one of these happens:

- IBM publishes a direct MTEB English average or paraphrase/STS recall result that beats jina-v3, not just size-class retrieval claims.
- Jina publishes a clean, upstream llama.cpp or SentenceTransformers path for v5 text/omni text-matching that is demonstrably <1 GB loaded on Apple Silicon.
- Qwen or Voyage posts a new after-2026-05-01 local model under the memory cap.

Until then, ADR-012 still holds.

---

## 6. Sources

- Jina v3 baseline: [jinaai/jina-embeddings-v3 HF performance discussion](https://huggingface.co/jinaai/jina-embeddings-v3/discussions/13/files)
- IBM 97M R2: [ibm-granite/granite-embedding-97m-multilingual-r2](https://huggingface.co/ibm-granite/granite-embedding-97m-multilingual-r2)
- IBM 311M R2: [ibm-granite/granite-embedding-311m-multilingual-r2](https://huggingface.co/ibm-granite/granite-embedding-311m-multilingual-r2)
- IBM R2 announcement: [Granite Embedding Multilingual R2 HF blog](https://huggingface.co/blog/ibm-granite/granite-embedding-multilingual-r2)
- Jina omni nano text matching: [jinaai/jina-embeddings-v5-omni-nano-text-matching](https://huggingface.co/jinaai/jina-embeddings-v5-omni-nano-text-matching)
- Jina omni small text-matching GGUF: [jinaai/jina-embeddings-v5-omni-small-text-matching-GGUF](https://huggingface.co/jinaai/jina-embeddings-v5-omni-small-text-matching-GGUF)
- NVIDIA Llama Nemotron Embed VL 1B v2: [nvidia/llama-nemotron-embed-vl-1b-v2](https://huggingface.co/nvidia/llama-nemotron-embed-vl-1b-v2)
- NVIDIA Omni-Embed Nemotron 3B: [nvidia/omni-embed-nemotron-3b](https://huggingface.co/nvidia/omni-embed-nemotron-3b)
- Qwen date-gate reference: [Qwen/Qwen3-Embedding-0.6B](https://huggingface.co/Qwen/Qwen3-Embedding-0.6B)
- Voyage date-gate reference: [voyageai/voyage-4-nano](https://huggingface.co/voyageai/voyage-4-nano)
