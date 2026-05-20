---
title: "04. Environment overrides"
description: "Supports runtime overrides for config directory, root path, device and legacy variables."
---

# 04. Environment overrides

Supports runtime overrides for config directory, root path, device and legacy variables. Environment overrides give agents and CI runs deterministic control over where CocoIndex stores state and which project it searches.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Environment overrides give agents and CI runs deterministic control over where CocoIndex stores state and which project it searches.

> **Pipeline note**: environment settings address both retrieval stages separately. `COCOINDEX_CODE_EMBEDDING_MODEL` selects the Stage 1 bi-encoder embedder (`sbert/nomic-ai/CodeRankEmbed`, 768d, MIT by default); `COCOINDEX_RERANK_MODEL` selects the Stage 2 cross-encoder reranker (`Qwen/Qwen3-Reranker-0.6B`, Apache-2.0 by default). The embedder runs over queries and chunks independently at index/search time; the reranker runs only on top-K fused candidates.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`COCOINDEX_CODE_DIR` changes the global settings directory. `COCOINDEX_CODE_ROOT_PATH` pins the project root for helper scripts and legacy config. Extra extension and excluded pattern environment variables remain in the compatibility config path. Chunking, hybrid lexical search and cross-encoder reranking are also driven by environment variables consumed by `Config.from_env`. All bounded numeric overrides fall back to their default with a warning when the value is missing, non-numeric or outside the documented bounds.

### Chunking overrides (Stage A)

| Variable | Default | Bounds | Behavior |
|----------|--------:|--------|----------|
| `COCOINDEX_CODE_CHUNK_SIZE` | 1500 | 100..8000 | Target chunk size in characters passed to `RecursiveSplitter`. |
| `COCOINDEX_CODE_CHUNK_OVERLAP` | 200 | 0..1000 | Overlap between adjacent chunks. |
| `COCOINDEX_CODE_MIN_CHUNK_SIZE` | 250 | 50..1000 | Minimum chunk size before merging with a neighbor. |

### Hybrid search overrides (default ON)

| Variable | Default | Bounds | Behavior |
|----------|--------:|--------|----------|
| `COCOINDEX_HYBRID` | `true` | truthy/falsy | Default-on flag for the FTS5 + RRF hybrid lane in `query_codebase`. Set `false` to fall back to vector-only retrieval. |
| `COCOINDEX_HYBRID_VECTOR_WEIGHT` | 0.9 | 0.0..2.0 | Weight applied to the vector channel during RRF fusion. Locked at 0.9 per ADR-020 (017 calibration). |
| `COCOINDEX_HYBRID_FTS5_WEIGHT` | 0.5 | 0.0..2.0 | Weight applied to the FTS5 channel during RRF fusion. Locked at 0.5 per ADR-020 (017 calibration). |
| `COCOINDEX_HYBRID_RRF_K` | 60 | 1..500 | RRF smoothing constant `k` in `1 / (k + rank)`. |

### Reranker overrides (default ON)

| Variable | Default | Bounds | Behavior |
|----------|--------:|--------|----------|
| `COCOINDEX_RERANK` | `true` | truthy/falsy | Default-on flag for cross-encoder reranking after RRF fusion. Set `false` to disable the rerank stage. |
| `COCOINDEX_RERANK_MODEL` | `Qwen/Qwen3-Reranker-0.6B` | non-empty string | Cross-encoder reranker name passed to `sentence-transformers.CrossEncoder`. Empty values fall back to the default with a warning. Pin `jinaai/jina-reranker-v3` only when its CC BY-NC 4.0 license is acceptable; pin `Alibaba-NLP/gte-multilingual-reranker-base` only on non-MPS backends because GTE currently fails on Apple Silicon MPS and `RerankerAdapter` falls back silently. |
| `COCOINDEX_RERANK_TOP_K` | 20 | 5..100 | Number of candidates passed to the cross-encoder; the remaining tail keeps its prior order. |

Chunking, hybrid and reranking overrides are research-derived Stage A defaults; lift estimates are not yet validated on the fixture suite. The reranker loads on first call unless `COCOINDEX_RERANK=false` is set and skips when available RAM is below the 2 GB gate enforced by `RerankerAdapter._load_model`.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py:123` | Settings | Uses `COCOINDEX_CODE_DIR` for global settings location. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:115` | Config helper | `_parse_int_env` bounds chunking and RRF integer overrides. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:153` | Config helper | `_parse_bool_env` parses the hybrid and reranker boolean flags (default-on as of v1.10). |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:174` | Config helper | `_parse_float_env` bounds RRF channel weights. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:291` | Config | Loads chunking, hybrid and reranker env vars into the `Config` singleton. |
| `.opencode/skills/mcp-coco-index/scripts/common.sh:123` | Script helper | Runs `ccc` with `COCOINDEX_CODE_ROOT_PATH`. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py:112` | Unit | `TestChunkConfigValidation` covers chunking defaults, override and out-of-bounds fallback. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py:196` | Unit | `TestHybridConfigValidation` covers `COCOINDEX_HYBRID*` overrides. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_reranker.py:143` | Unit | `test_config_rerank_defaults` covers `COCOINDEX_RERANK*` defaults and overrides. |
| `.opencode/skills/mcp-coco-index/tests/test_config.py:49` | Unit | Covers embedder defaults from env config. |
| `.opencode/skills/mcp-coco-index/tests/test_backward_compat.py:29` | Compatibility | Covers legacy environment variables. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Configuration
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `08--configuration/04-environment-overrides.md`

<!-- /ANCHOR:source-metadata -->
