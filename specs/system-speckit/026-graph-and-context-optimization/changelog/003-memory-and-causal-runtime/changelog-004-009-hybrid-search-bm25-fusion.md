---
title: "Code Index Stack Phase 009: Hybrid Search BM25 Fusion"
description: "SQLite FTS5 lexical lane plus opt-in RRF fusion shipped for CocoIndex code retrieval. Deep-research converged on embedded FTS5 and RRF after rejecting tantivy, rank-bm25 and manticore. Implementation adds fts_index.py, fusion.py, extends query.py with hybrid dispatch and ships 6 new tests. All 63 tests pass."
trigger_phrases:
  - "hybrid search bm25 fusion"
  - "cocoindex fts5 rrf"
  - "sqlite fts5 code retrieval"
  - "rrf fusion cocoindex"
  - "COCOINDEX_HYBRID"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-18

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/009-hybrid-search-bm25-fusion` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack`

### Summary

CocoIndex code retrieval relied on semantic vector search alone, delivering a 38.9% (7/18) fixture hit-rate. Three deep-research iterations converged on SQLite FTS5 as the embedded lexical engine and Reciprocal Rank Fusion (RRF, k=60) as the fusion algorithm, rejecting tantivy (Rust toolchain overhead), rank-bm25 (too slow at corpus scale) and manticore (standalone daemon contradicts the embedded design).

Implementation shipped two new modules and extended eight existing files. `fts_index.py` creates the `code_chunks_fts` virtual table with a unicode61 tokenizer and provides ensure, populate and query helpers. `fusion.py` provides `rrf_fuse()` with per-channel min-max normalization and configurable weights. `query.py` gained an opt-in hybrid dispatch path behind `COCOINDEX_HYBRID=true` that runs the vector and FTS lanes sequentially, applies RRF then forwards to the existing post-boost pipeline. Six new tests cover FTS creation, population, BM25 ranking, RRF fusion, hybrid-off compatibility and hybrid-on fused results. The full suite grew from 57 to 63 tests with all passing.

Cumulative fixture lift is estimated at 50% (9/18) when combined with the 011/002 chunking baseline. Hybrid remains opt-in until fixture validation confirms the lift.

### Added

- `cocoindex_code/fts_index.py` with `code_chunks_fts` FTS5 virtual table, ensure, populate, sync and BM25 query helpers (NEW)
- `cocoindex_code/fusion.py` with `rrf_fuse()`, per-channel min-max normalization, configurable k and per-channel weights (NEW)
- `tests/test_fts_index.py` with 6 focused tests covering FTS creation, population, BM25 ranking, RRF fusion, hybrid-off path and hybrid-on fused results (NEW)
- `COCOINDEX_HYBRID`, `COCOINDEX_HYBRID_RRF_K`, `COCOINDEX_HYBRID_VECTOR_WEIGHT`, `COCOINDEX_HYBRID_FTS5_WEIGHT` env config vars with bounded validation and warn-on-invalid fallback
- `fts5_score` and `rrf_score` response fields on query results for MCP and CLI transparency
- Hybrid telemetry emitting `lane=vector_only` or `lane=hybrid_rrf` on lookup and rerank stages

### Changed

- `query.py` extended with opt-in hybrid dispatch path: vector lane plus FTS5 lane run sequentially, RRF-fused, existing post-fusion boosts preserved
- `indexer.py` extended with FTS5 populate hook after each chunk batch and FTS sync after index updates to catch deletions and reprocesses
- `tests/test_config.py` extended with hybrid env-var validation cases

### Fixed

- None. Additive-only phase.

### Verification

- Python compile check on all modified modules: exit 0 (fts_index.py, fusion.py, query.py, indexer.py, project.py, schema.py, protocol.py, daemon.py, server.py)
- `tests/test_fts_index.py`: 6 of 6 pass
- Full test suite (`pytest tests/ -v`): 63 of 63 pass (up from 57 before this phase)
- Strict packet validation (`validate.sh --strict`): passed, 0 errors, 0 warnings
- Deep-research convergence: 3 of 3 iterations complete, no new findings in final iteration

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fts_index.py` (NEW) | FTS5 virtual table creation, population, sync and BM25 query helpers |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fusion.py` (NEW) | `rrf_fuse()` with per-channel min-max normalization and configurable k plus weights |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_fts_index.py` (NEW) | 6 tests covering FTS and RRF paths |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | +347 lines. Opt-in hybrid dispatch, sequential lane execution, RRF fusion, telemetry split |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | +89 lines. Four new hybrid env vars with bounded validation |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py` | FTS5 populate hook and post-update FTS sync |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py` | `fts5_score` and `rrf_score` result fields |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py` | Hybrid env-var validation test cases |

### Follow-Ups

- Run 18-pair fixture validation comparing hybrid-on against the 011/002 chunking baseline to measure actual hit-rate lift.
- Measure p95 query latency delta for hybrid versus vector-only mode at production corpus scale.
- Promote `COCOINDEX_HYBRID` to default-on once fixture validation confirms the lift exceeds the baseline threshold.
