---
title: "Changelog: 023C Retrieval Observability"
description: "Additive per-query diagnostics and index/runtime fingerprints shipped to mcp-coco-index so operators can audit candidate counts, reranker fallback paths and configuration drift before calibration work begins."
trigger_phrases:
  - "retrieval observability changelog"
  - "cocoindex diagnostics shipped"
  - "index fingerprint mismatch"
  - "023C retrieval observability"
  - "mcp-coco-index diagnostics"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/002-retrieval-observability`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots`

### Summary

mcp-coco-index had timing logs and result metadata but did not expose enough retrieval-stage evidence to explain quality regressions. Operators could not see vector/FTS candidate counts, fusion overlap, reranker fallback reasons or boost-driven reorders. There was no way to tell whether a live daemon was searching with a different embedder or configuration from the indexed corpus.

Nine additive diagnostic fields now appear in every search response and structured log. Status responses and `ccc status` expose 21 fingerprint fields covering embedder, reranker, chunking policy and RRF parameters. Index completion writes `index_meta.json` so daemon searches can warn when runtime config no longer matches the indexed corpus. All changes are additive with defaults, preserving backward compatibility.

### Added

- Nine per-query diagnostic fields in search responses (`vec_candidates_count`, `fts_candidates_count`, `overlap_count`, `post_dedup_count`, `rerank_input_count`, `rerank_output_count`, `boost_flip_count`, `reranker_fallback_used`, `reranker_fallback_reason`)
- Effective configuration fingerprint block in status responses and `ccc status` (21 fields covering embedder, reranker, chunking, RRF and corpus metadata)
- `index_meta.json` writer in the indexer that persists the effective config hash at index completion
- `INDEX_FINGERPRINT_MISMATCH` warning logged and returned when stored hash differs from runtime hash
- `tests/test_fingerprint.py` covering fingerprint persistence, mismatch detection and hash stability
- `tests/test_coverage_tooling.py` smoke test confirming pytest-cov is available in the verify venv

### Changed

- `observability.py`: extended with diagnostics helpers, fingerprint hashing and metadata read/write
- `query.py`: retrieval-stage counters now recorded per search call
- `daemon.py`: persists metadata, compares hashes and returns fingerprint status on every status call
- `server.py`: mirrors diagnostics fields in the MCP search response payload
- `cli.py`: prints fingerprint block in `ccc status` output

### Fixed

- Reranker fallback events were invisible. Cross-encoder and Jina paths now record fallback used and fallback reason so operators can distinguish load failures, model errors and missing indices.
- Boost-flip count was not tracked. Pre-boost and post-boost fused orderings are now compared so heuristic reorders are observable without altering scoring behavior.
- pytest-cov was absent from the verify venv. The dev dependency was installed and a smoke test locks availability.

### Verification

| Check | Result |
|-------|--------|
| `.venv/bin/python -m pytest tests/test_observability.py tests/test_fingerprint.py tests/test_coverage_tooling.py -q` | PASS. 13 passed in 2.38s |
| `.venv/bin/ruff check cocoindex_code/ tests/` | PASS. All checks passed |
| `.venv/bin/python -m pytest tests/ -q` | PASS. 188 passed in 18.12s |
| `.venv/bin/python -m pytest --cov=cocoindex_code --cov-report=term-missing tests/ 2>&1 \| tail -30` | PASS. TOTAL 3851 1696 56%, 188 passed in 19.28s |

Findings closed: HIGH FINDING-009-A (pytest-cov), HIGH FINDING-013-B (fingerprint fields), MED FINDING-006-C (reranker fallback reasons), MED FINDING-009-B (per-stage counters), MED FINDING-009-C (fingerprint tests), MED FINDING-014-A (observability prerequisite), MED FINDING-016-D (`ccc status` fingerprint), MED FINDING-019-C (observability before calibration). All 8 findings closed.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability.py` | Modified | Added diagnostics helpers, fingerprint hashing, metadata read/write and structured diagnostic logging |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py` | Modified | Added additive msgspec payload fields for diagnostics and fingerprint |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | Modified | Records per-stage retrieval counters on each search call |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py` | Modified | Records cross-encoder fallback reasons |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers_jina_v3.py` | Modified | Records Jina load, model and missing-index fallback reasons |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py` | Modified | Persists metadata, compares hashes, returns fingerprint status |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py` | Modified | Mirrors diagnostics in MCP search response |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py` | Modified | Writes `index_meta.json` at index completion |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py` | Modified | Prints fingerprint block in `ccc status` |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_observability.py` | Modified | Added diagnostics, overlap, fallback and boost-flip tests |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_fingerprint.py` | Created (NEW) | Fingerprint persistence, mismatch detection and hash stability tests |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_coverage_tooling.py` | Created (NEW) | pytest-cov availability smoke test |

### Follow-Ups

- Reranker license registry is local. The fingerprint reports known licenses for current built-in reranker prefixes and `unknown` for unregistered custom models. A future packet could add a plugin registry.
- Fingerprint mismatch is warning-only. Search continues when hashes differ so operators can inspect results before deciding whether to reset or reindex. A future packet could add a hard-block mode.
