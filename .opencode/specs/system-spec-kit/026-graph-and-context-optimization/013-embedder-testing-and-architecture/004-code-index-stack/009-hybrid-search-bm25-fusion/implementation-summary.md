---
title: "Summary: 016/011/003 Hybrid Search BM25 Fusion"
description: "SQLite FTS5 lexical lane plus opt-in RRF fusion for CocoIndex code search"
trigger_phrases:
  - "016/011/003 summary"
  - "cocoindex hybrid search"
  - "SQLite FTS5 RRF fusion"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/009-hybrid-search-bm25-fusion"
    last_updated_at: "2026-05-18T08:40:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Implemented opt-in CocoIndex hybrid search with SQLite FTS5 BM25 lane and RRF fusion"
    next_safe_action: "Run fixture validation and compare hybrid lift against 011/002 chunking baseline"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fts_index.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fusion.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_fts_index.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000011003"
      session_id: "016-011-003-hybrid-search-bm25-fusion-impl"
      parent_session_id: "016-011-003-hybrid-search-bm25-fusion"
    completion_pct: 95
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Summary: 016/011/003 Hybrid Search BM25 Fusion

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| Status | IMPLEMENTED |
| Artifact | CocoIndex hybrid search: SQLite FTS5 + RRF fusion |
| Owner | cli-codex |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

- Added `cocoindex_code/fts_index.py` with `code_chunks_fts` FTS5 creation, population, sync, and BM25 query helpers.
- Added `cocoindex_code/fusion.py` with weighted RRF fusion, k=60 default compatibility, and per-channel min-max scores for audit tie-breaking.
- Extended indexing to create/populate FTS data during processing and resync FTS from `code_chunks_vec` after index updates.
- Extended `query_codebase()` with opt-in `COCOINDEX_HYBRID=true` dispatch: vector lane + FTS5 lane -> RRF -> existing implementation/canonical boosts.
- Added `fts5_score` and `rrf_score` to result surfaces for protocol/MCP/CLI transparency while preserving `score` as final post-boost score.
- Added focused tests for FTS table creation, FTS population, BM25 ranking, RRF fusion, hybrid-off compatibility, and hybrid-on fused query results.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation mirrors the converged research decision: embedded SQLite FTS5 avoids new service dependencies, and RRF avoids fragile cross-channel score calibration. Hybrid search remains opt-in through `COCOINDEX_HYBRID=false` default.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

- D1: FTS5 is embedded in the existing `target_sqlite.db` as `code_chunks_fts`.
- D2: FTS sync runs after index updates to catch deletions/reprocesses even when per-file processing is skipped by memoization.
- D3: RRF uses configurable `COCOINDEX_HYBRID_RRF_K`, `COCOINDEX_HYBRID_VECTOR_WEIGHT`, and `COCOINDEX_HYBRID_FTS5_WEIGHT`.
- D4: Hybrid telemetry emits `lane=vector_only` or `lane=hybrid_rrf` on lookup/rerank stages.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

- `cd .opencode/skills/mcp-coco-index/mcp_server && .venv/bin/python -m py_compile cocoindex_code/fts_index.py cocoindex_code/fusion.py cocoindex_code/query.py cocoindex_code/indexer.py cocoindex_code/project.py cocoindex_code/schema.py cocoindex_code/protocol.py cocoindex_code/daemon.py cocoindex_code/server.py` -> pass
- `cd .opencode/skills/mcp-coco-index/mcp_server && .venv/bin/python -m pytest tests/test_fts_index.py -v` -> 6 passed
- `cd .opencode/skills/mcp-coco-index/mcp_server && .venv/bin/python -m pytest tests/ -v` -> 60 passed
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-packet> --strict` -> passed, 0 errors / 0 warnings
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

- 18-pair fixture lift is not measured in this implementation pass; next step is fixture validation against the 011/002 chunking baseline.
- Hybrid remains opt-in until fixture validation justifies default-on behavior.
<!-- /ANCHOR:limitations -->
