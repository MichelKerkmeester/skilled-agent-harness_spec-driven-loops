---
title: "07. Hybrid search (BM25 + RRF fusion)"
description: "Fuses vector and FTS5 BM25 result lists with weighted Reciprocal Rank Fusion when enabled."
---

# 07. Hybrid search (BM25 + RRF fusion)

Fuses vector and FTS5 BM25 result lists with weighted Reciprocal Rank Fusion when enabled. The hybrid lane queries the semantic vector index and the `code_chunks_fts` BM25 index in sequence, normalizes both score channels and combines them with weighted RRF so exact-token hits and semantic neighbors share a single ranked list.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The hybrid lane runs the vector channel and the FTS5 channel sequentially, applies per-channel min-max normalization for telemetry, then fuses by rank with weighted RRF. It is opt-in via `COCOINDEX_HYBRID=true`; vector-only behavior is preserved when the flag is unset. Estimated lift is research-derived and not yet validated on the fixture suite.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`query_codebase` dispatches on `config.hybrid_enabled`. When true, the function fetches `fetch_k = (limit + offset) * 4` rows from the vector channel via `_hybrid_vector_rows`, asks `query_fts` for the same fetch budget against `code_chunks_fts`, and calls `rrf_fuse` with `k = config.hybrid_rrf_k` and `(config.hybrid_vector_weight, config.hybrid_fts5_weight)`. `rrf_fuse` returns `FusedRow` records carrying per-channel ranks, normalized per-channel scores and the combined `rrf_score`. The fused candidates pass through the existing dedup, path-class heuristics and pagination window; ranking signals gain `hybrid_rrf` and `fts5_lane` markers. Telemetry distinguishes the lane via `lane=hybrid_rrf` vs `lane=vector_only` in stage logs, and `fts5_score` plus `rrf_score` are exposed on the protocol response for auditability. When the flag is off, the vector-only KNN, multi-language merge and path-filter full-scan paths run unchanged.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fts_index.py:94` | FTS5 module | `query_fts` runs BM25 against `code_chunks_fts` with language and path filters. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fusion.py:28` | Fusion | `_min_max_scores` normalizes per-channel scores for `FusedRow` telemetry. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fusion.py:42` | Fusion | `rrf_fuse` combines vector and FTS5 rank lists with weighted RRF. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:533` | Query | `_hybrid_vector_rows` fetches the vector channel for fusion. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:600` | Query | Dispatches on `config.hybrid_enabled` and fuses the two channels. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:399` | Query | `_hybrid_ranked_result` carries `rrf_score`, `fts5_score` and lane signals through to the result records. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:309` | Config | Loads `COCOINDEX_HYBRID`, weights and RRF `k` into the `Config` singleton. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_fts_index.py:140` | Unit | `test_fts_query_returns_ranked_bm25` covers BM25 ordering through `query_fts`. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_fts_index.py:156` | Unit | `test_rrf_fuse_combines_two_ranked_lists` covers weighted RRF combination. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_fts_index.py:170` | Unit | `test_query_codebase_hybrid_off_unchanged` proves vector-only is unchanged when the flag is unset. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_fts_index.py:205` | Unit | `test_query_codebase_hybrid_on_returns_fused` proves fused results when the flag is set. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py:196` | Unit | `TestHybridConfigValidation` covers env-driven hybrid overrides. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Search and ranking
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--search-and-ranking/07-hybrid-search-bm25-rrf.md`

<!-- /ANCHOR:source-metadata -->
