---
title: "Implementation Summary: 023C Retrieval Observability"
description: "mcp-coco-index now exposes retrieval-stage diagnostics and effective configuration fingerprints for search/status observability."
trigger_phrases:
  - "023C complete"
  - "retrieval diagnostics complete"
  - "index fingerprint complete"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/002-retrieval-observability"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed retrieval observability implementation"
    next_safe_action: "Use diagnostics for 023B calibration"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_fingerprint.py"
    session_dedup:
      fingerprint: "sha256:023c000000000000000000000000000000000000000000000000000000000004"
      session_id: "023-deep-research-arc-blind-spots/002-retrieval-observability"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `023-deep-research-arc-blind-spots/002-retrieval-observability` |
| **Completed** | 2026-05-19 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

mcp-coco-index now reports what happened inside retrieval, not only how long retrieval took. Search responses carry candidate/fusion/rerank diagnostics, status responses carry the live effective configuration fingerprint, and index completion writes `index_meta.json` so daemon searches can warn when runtime config no longer matches the indexed corpus.

### Per-Query Diagnostics

Search now returns and logs these diagnostic fields:

- `vec_candidates_count`
- `fts_candidates_count`
- `overlap_count`
- `post_dedup_count`
- `rerank_input_count`
- `rerank_output_count`
- `boost_flip_count`
- `reranker_fallback_used`
- `reranker_fallback_reason`

### Index/Daemon Fingerprint

Status now returns these fingerprint fields:

- `embedder_name`
- `embedder_dim`
- `embedder_provider`
- `query_prompt_name`
- `document_prompt_name`
- `reranker_name`
- `reranker_enabled`
- `reranker_license`
- `chunk_size`
- `chunk_overlap`
- `chunking_policy`
- `corpus_root`
- `chunk_count`
- `file_count`
- `rrf_K`
- `rrf_V`
- `rrf_F`
- `hybrid_boost_path`
- `hybrid_boost_canonical`
- `effective_config_hash`
- `indexed_effective_config_hash`
- `fingerprint_warning`

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability.py` | Modified | Added diagnostics, fingerprint hashing, metadata read/write, and structured diagnostic logging |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py` | Modified | Added additive msgspec payload fields |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | Modified | Recorded per-stage retrieval counters |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py` | Modified | Recorded cross-encoder fallback reasons |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers_jina_v3.py` | Modified | Recorded Jina load/model/missing-index fallback reasons |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py` | Modified | Persisted metadata, compared hashes, returned fingerprint status |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py` | Modified | Mirrored diagnostics in MCP search response |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py` | Modified | Added index-time metadata writer |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py` | Modified | Printed retrieval fingerprint in `ccc status` |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_observability.py` | Modified | Added diagnostics, overlap, fallback, and boost-flip tests |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_fingerprint.py` | Created | Added fingerprint persistence, mismatch, and hash stability tests |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_coverage_tooling.py` | Created | Added pytest-cov availability smoke test |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The change was implemented as additive telemetry. Existing result fields remain unchanged; diagnostics and fingerprints use defaults so older clients can ignore them, and metadata mismatch only logs/returns a warning rather than blocking search.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Put diagnostics and fingerprint helpers in `observability.py` | The module already owns request observability, so this keeps counters and structured logs together |
| Persist metadata in project-local `.cocoindex_code/index_meta.json` | The existing index files are project-local, and status/search already resolve from project root |
| Add fields rather than change existing response structure | Maintains backward compatibility for daemon, CLI, and MCP clients |
| Count boost flips by comparing pre-boost fused order to boosted order | This captures whether heuristics moved top-K candidates without altering scoring behavior |
| Record Jina missing native indices as a fallback reason | Missing indices previously became `0.0`, which hid adapter drift |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `.venv/bin/python -m pytest tests/test_observability.py tests/test_fingerprint.py tests/test_coverage_tooling.py -q` | PASS, `13 passed in 2.38s` |
| `.venv/bin/ruff check cocoindex_code/ tests/` | PASS, `All checks passed!` |
| `.venv/bin/python -m pytest tests/ -q` | PASS, `188 passed in 18.12s` |
| `.venv/bin/python -m pytest --cov=cocoindex_code --cov-report=term-missing tests/ 2>&1 \| tail -30` | PASS, coverage report produced, `TOTAL 3851 1696 56%`, `188 passed in 19.28s` |

Findings closed:

| Finding | Status | Evidence |
|---------|--------|----------|
| HIGH FINDING-009-A | Closed | pytest-cov installed in verify venv; coverage command produced report |
| HIGH FINDING-013-B | Closed | fingerprint fields added to protocol/status and persisted metadata |
| MED FINDING-006-C | Closed | reranker fallback reasons now observable |
| MED FINDING-009-B | Closed | per-stage retrieval counters added |
| MED FINDING-009-C | Closed | fingerprint tests cover incompatible embedder hash state and hash stability |
| MED FINDING-014-A | Closed | observability prerequisite added for RRF calibration |
| MED FINDING-016-D | Closed | `ccc status` prints fingerprint block |
| MED FINDING-019-C | Closed | observability landed before broad calibration |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Reranker license registry is local.** The fingerprint reports known licenses for current built-in reranker prefixes and `unknown` for unregistered custom models.
2. **Fingerprint mismatch is warning-only.** Search continues when hashes differ so operators can inspect results before deciding whether to reset/reindex.
<!-- /ANCHOR:limitations -->
