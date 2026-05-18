---
title: "08. Reranker (GTE cross-encoder)"
description: "Reranks the top hybrid candidates with a local GTE cross-encoder when enabled."
---

# 08. Reranker (GTE cross-encoder)

Reranks the top hybrid candidates with a local GTE cross-encoder when enabled. The reranker runs after RRF fusion and dedup but before the pagination window, replacing the fused score on the reranked head while preserving the prior score on `pre_rerank_score` for audit.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Cross-encoders score full `(query, candidate)` pairs and typically lift top-N precision when query and chunk wording disagree. The reranker is opt-in via `COCOINDEX_RERANK=true`. The default model is `Alibaba-NLP/gte-multilingual-reranker-base`. Estimated lift is research-derived and not yet validated on the fixture suite; default-on adoption is gated on p95 latency add under 500 ms and a measurable hit improvement on the 18-pair fixture.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`reranker.rerank` is only invoked from `query_codebase` when both `config.hybrid_enabled` and `config.rerank_enabled` are true. It scores the first `config.rerank_top_k` candidates with `sentence-transformers.CrossEncoder.predict`, sorts the reranked head in descending order and keeps the remaining tail in its prior order. The cross-encoder score replaces `score`; the previous score is captured on `pre_rerank_score` and `reranker_score`; the `rankingSignals` list gains a `cross_encoder_rerank` marker. `RerankerAdapter` lazy-loads the model on first call, caches it per model name and skips loading when available RAM is below the 2 GB gate enforced by `MIN_AVAILABLE_RAM_BYTES`. Model-load and prediction failures log a warning and return the original candidate order unchanged so the reranker is fail-soft. Telemetry surfaces the run as `lane=hybrid_rerank` and `stage=rerank` in stage logs when reranking actually changed the ordering.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py:40` | Reranker | `RerankerAdapter` wraps the lazy CrossEncoder with the RAM gate. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py:81` | Reranker | `RerankerAdapter.rerank` applies score replacement and preserves `pre_rerank_score`. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py:132` | Reranker | `rerank` module entrypoint used by `query_codebase`. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:675` | Query | Invokes `reranker.rerank` after fusion when `config.rerank_enabled` is true. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:700` | Query | Emits `stage=rerank` and `lane=hybrid_rerank` telemetry when reranking changed the order. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:328` | Config | Loads `COCOINDEX_RERANK`, `COCOINDEX_RERANK_MODEL` and `COCOINDEX_RERANK_TOP_K`. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_reranker.py:112` | Unit | `test_rerank_falls_back_on_model_load_failure` covers fail-soft behavior on model-load error. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_reranker.py:129` | Unit | `test_rerank_replaces_score_and_preserves_pre_rerank_score` covers the score-replacement contract. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_reranker.py:156` | Unit | `test_query_codebase_rerank_off_unchanged` proves backward compatibility when the flag is unset. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_reranker.py:184` | Unit | `test_query_codebase_rerank_on_changes_order` proves reranker rewires the head when enabled. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_reranker.py:143` | Unit | `test_config_rerank_defaults` covers env-driven reranker overrides. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Search and ranking
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--search-and-ranking/08-reranker-gte-cross-encoder.md`

<!-- /ANCHOR:source-metadata -->
