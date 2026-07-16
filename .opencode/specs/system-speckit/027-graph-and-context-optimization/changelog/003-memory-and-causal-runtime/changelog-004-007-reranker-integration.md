---
title: "Reranker Integration: GTE Cross-Encoder Opt-In After Hybrid RRF Fusion"
description: "Opt-in GTE cross-encoder reranker shipped for CocoIndex hybrid retrieval. Lazy load, RAM gate, unchanged-order fallback. Full score auditability via pre_rerank_score preservation."
trigger_phrases:
  - "reranker integration cocoindex"
  - "GTE cross-encoder reranker"
  - "COCOINDEX_RERANK opt-in"
  - "reranker.py cocoindex"
  - "hybrid RRF reranker integration"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-18

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/007-reranker-integration`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack`

### Summary

CocoIndex hybrid retrieval had no cross-encoder reranking step after RRF fusion, which left result ordering dependent solely on BM25 plus vector score fusion without any semantic re-scoring pass. A deep-research investigation converged on `Alibaba-NLP/gte-multilingual-reranker-base` (Apache-2.0, 306M parameters) as the first-pick model with K=20 top candidates and an opt-in rollout gate.

The reranker module ships behind `COCOINDEX_RERANK=true`. It loads lazily. On model-load failure or insufficient RAM (below 2 GB free) it falls back to unchanged ordering. The final score is replaced with the cross-encoder score while `pre_rerank_score` is preserved for audit. Integration runs after RRF fusion plus heuristic boosts, before final result slicing. The full pytest suite grew from 63 to 70 passing tests with 7 new reranker-specific cases.

Default-on promotion remains gated on an 18-pair fixture: p95 added latency under 500ms and at least two additional top-3 hits.

### Added

- `cocoindex_code/reranker.py` (NEW): `RerankerAdapter` wrapping `sentence_transformers.CrossEncoder` with lazy initialization, graceful fallback on model-load failure. Optional RAM gate included.
- `COCOINDEX_RERANK`, `COCOINDEX_RERANK_MODEL`, `COCOINDEX_RERANK_TOP_K` config keys in `config.py` with bounded defaults
- `tests/test_reranker.py` (NEW): 7 pytest cases covering import safety, empty input, model-load fallback, score replacement, config defaults, rerank-off compatibility. Rerank-on ordering verified.
- `pre_rerank_score` and `reranker_score` audit fields propagated through schema, daemon protocol, MCP server model. CLI output updated to surface both fields.

### Changed

- `query.py:query_codebase()`: reranker stage inserted after hybrid RRF fusion and heuristic boosts, before final result slicing, guarded by `COCOINDEX_RERANK` flag
- `schema.py`: two new audit score fields added to the result model
- `protocol.py` and `daemon.py`: reranker audit fields forwarded through the daemon protocol
- `server.py` and `cli.py`: updated output paths to surface the new audit fields

### Fixed

- Result ordering after RRF fusion was not semantically re-scored. The cross-encoder now re-ranks the top-K candidates, replacing the fused score with a semantically calibrated value.

### Verification

| Check | Result |
|---|---|
| `pytest tests/ -v` (full suite) | 70 of 70 passed (was 63 before this packet, +7 new reranker cases) |
| `verify_alignment_drift.py --root mcp_server` | Passed. 0 errors. 22 pre-existing style warnings. |
| `validate.sh ... --strict` | Passed. 0 errors. 0 warnings. |
| Reranker fallback path | Verified. Mocked model-load failure returns original order unchanged. |
| Score replacement | Verified. `pre_rerank_score` retains post-RRF value. `score` contains cross-encoder output. |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `mcp-coco-index/mcp_server/cocoindex_code/reranker.py` (NEW) | Created | `RerankerAdapter` with lazy init, fallback logic. RAM gate included. |
| `mcp-coco-index/mcp_server/cocoindex_code/query.py` | Modified | Reranker stage added after fusion, before slice |
| `mcp-coco-index/mcp_server/cocoindex_code/config.py` | Modified | Three new reranker config keys with defaults |
| `mcp-coco-index/mcp_server/cocoindex_code/schema.py` | Modified | `pre_rerank_score` and `reranker_score` fields added |
| `mcp-coco-index/mcp_server/cocoindex_code/protocol.py` | Modified | Audit fields forwarded through daemon protocol |
| `mcp-coco-index/mcp_server/cocoindex_code/daemon.py` | Modified | Audit field pass-through |
| `mcp-coco-index/mcp_server/cocoindex_code/server.py` | Modified | Output updated to surface audit fields |
| `mcp-coco-index/mcp_server/cocoindex_code/cli.py` | Modified | CLI output updated to surface audit fields |
| `mcp-coco-index/mcp_server/cocoindex_code/observability.py` | Modified | Audit field instrumentation |
| `mcp-coco-index/mcp_server/tests/test_reranker.py` (NEW) | Created | 7 pytest cases for reranker coverage |

### Follow-Ups

- Run the 18-pair fixture quality gate before promoting `COCOINDEX_RERANK` to default-on: require at least two additional top-3 hits versus the non-reranked baseline.
- Run the p95 latency gate before default-on promotion: reranker-added latency must stay under 500ms.
- Consider adding a live integration test that loads the actual GTE model once per CI run rather than relying solely on mocked fallback paths.
