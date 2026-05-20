---
title: "08. Reranker (cross-encoder)"
description: "Reranks the top hybrid candidates with a local cross-encoder reranker."
---

# 08. Reranker (cross-encoder)

Reranks the top hybrid candidates with a local cross-encoder when enabled. The reranker runs after RRF fusion and dedup but before the pagination window, replacing the fused score on the reranked head while preserving the prior score on `pre_rerank_score` for audit.

> **Pipeline note**: this page covers **Stage 2 — Cross-encoder reranker** (`Qwen/Qwen3-Reranker-0.6B`, Apache-2.0). It receives the top-K candidates after Stage 1 has already embedded the query/chunks and fused vector results with FTS5 via RRF. The reranker scores each `(query, candidate)` pair together with token-level attention; it is not an embedding model and cannot replace the bi-encoder over the full corpus.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Cross-encoders score full `(query, candidate)` pairs and typically lift top-N precision when query and chunk wording disagree. The reranker is **default-on** as of v1.10 (`COCOINDEX_RERANK=true`); operators opt out by setting `COCOINDEX_RERANK=false`. The Stage 2 reranker model is `Qwen/Qwen3-Reranker-0.6B` (Apache-2.0); it runs only on the top-K candidate set, defaulting to 20. `jinaai/jina-reranker-v3` remains available as an opt-in fallback, but its CC BY-NC 4.0 license is non-commercial.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:known-limitations -->
## 1a. KNOWN LIMITATIONS — GTE on Apple Silicon MPS

The prior default `Alibaba-NLP/gte-multilingual-reranker-base` currently fails on Apple Silicon MPS with the following error under sentence-transformers 5.4.1 + transformers 5.8.0 + torch 2.11.0:

```
AcceleratorError: index 733634176249652595 is out of bounds: 0, range 0 to 21
```

`RerankerAdapter` catches the exception and returns candidates in their unranked order, so the daemon continues to respond successfully but **every query effectively bypasses the reranker** — `pre_rerank_score` and `reranker_score` stay populated but the order is the upstream RRF order. This silent fallback was caught during end-to-end validation immediately after the v1.10 default-on promotion, before any benchmark could observe degraded rerank quality.

Mitigation in v1.10: the default reranker was moved away from GTE. Operators on non-MPS backends, or those validating future ST/transformers compatibility patches, can re-pin GTE via:

```bash
export COCOINDEX_RERANK_MODEL="Alibaba-NLP/gte-multilingual-reranker-base"
```

The fail-soft contract still applies: if any cross-encoder reranker fails to load or to predict, the daemon logs a warning and returns the upstream candidate order unchanged.
<!-- /ANCHOR:known-limitations -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`reranker.rerank` is only invoked from `query_codebase` when both `config.hybrid_enabled` and `config.rerank_enabled` are true. It scores the first `config.rerank_top_k` candidates with `sentence-transformers.CrossEncoder.predict`, sorts the reranked head in descending order and keeps the remaining tail in its prior order. The cross-encoder score replaces `score`; the previous score is captured on `pre_rerank_score` and `reranker_score`; the `rankingSignals` list gains a `cross_encoder_rerank` marker. `RerankerAdapter` lazy-loads the reranker on first call, caches it per reranker name and skips loading when available RAM is below the 2 GB gate enforced by `MIN_AVAILABLE_RAM_BYTES`. Model-load and prediction failures log a warning and return the original candidate order unchanged so the reranker is fail-soft. Telemetry surfaces the run as `lane=hybrid_rerank` and `stage=rerank` in stage logs when reranking actually changed the ordering.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

|| File | Layer | Role ||
||------|-------|------||
|| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py:40` | Reranker | `RerankerAdapter` wraps the lazy CrossEncoder with the RAM gate. ||
|| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py:81` | Reranker | `RerankerAdapter.rerank` applies score replacement and preserves `pre_rerank_score`. ||
|| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py:132` | Reranker | `reranker` module entrypoint used by `query_codebase`. ||
|| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:675` | Query | Invokes `reranker.rerank` after fusion when `config.rerank_enabled` is true. ||
|| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:700` | Query | Emits `stage=rerank` and `lane=hybrid_rerank` telemetry when reranking changed the order. ||
|| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:328` | Config | Loads `COCOINDEX_RERANK`, `COCOINDEX_RERANK_MODEL` and `COCOINDEX_RERANK_TOP_K`. ||

### Validation And Tests

|| File | Type | Role ||
||------|------|------||
|| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_reranker.py:112` | Unit | `test_rerank_falls_back_on_model_load_failure` covers fail-soft behavior on model-load error. ||
|| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_reranker.py:129` | Unit | `test_rerank_replaces_score_and_preserves_pre_rerank_score` covers the score-replacement contract. ||
|| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_reranker.py:156` | Unit | `test_query_codebase_rerank_off_unchanged` proves backward compatibility when the flag is unset. ||
|| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_reranker.py:184` | Unit | `test_query_codebase_rerank_on_changes_order` proves reranker rewires the head when enabled. ||
|| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_reranker.py:143` | Unit | `test_config_rerank_defaults` covers env-driven reranker overrides. ||

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Search and ranking
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--search-and-ranking/08-reranker-cross-encoder.md`

<!-- /ANCHOR:source-metadata -->
