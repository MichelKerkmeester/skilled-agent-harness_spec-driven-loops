# Post-Arc Deep Review — Running Synthesis

## Iteration 001 — Restructure Import Correctness

**Status:** Complete

**Key findings:**
- P1: Top-level tests/ directory has stale imports and is not being run by pytest
- P2: Documentation import path in INSTALL_GUIDE.md may be stale
- INFO: Active test suite (mcp_server/tests/) uses correct imports, all 222 tests pass

**Summary:** The post-restructure import sweep (commit ed7dcd0ac) correctly updated the active test suite (mcp_server/tests/) but missed several files in the dormant top-level tests/ directory. Since pytest only runs mcp_server/tests/, these stale imports were masked.

## Iteration 002 — Phase-Parent Rename Correctness

**Status:** Complete

**Key findings:**
- P2: Stale old-slug reference "023C-observability" in 001-request-budget-hardening/graph-metadata.json
- INFO: Historical references to old slugs in research notes are acceptable
- INFO: All strict-validate checks pass for parent and all 8 children

**Summary:** The phase-parent rename was structurally successful (all validations pass) but missed one graph-metadata.json related_to entry that still references the old "023C-observability" slug instead of the new "002-retrieval-observability".

## Iteration 003 — Qwen3 Default Flip Soundness

**Status:** Complete

**Key findings:**
- P1: ADR-027 and benchmark report claim incorrect jina-v3 statistics (evidence mismatch with actual JSON data)
- INFO: Implementation correctness verified (DEFAULT_RERANKER_NAME, _DEFAULT_RERANK_MODEL, ccc doctor all correct)

**Summary:** Implementation is correct, but evidence documentation has a data integrity issue. ADR-027 claims jina-v3 had 29.0/73 hits with zero stddev, but actual JSON data shows [14, 29, 29] with mean 24.0 and stddev 8.49. Qwen3-0.6B data is consistent (30/30/30 hits, zero stddev). The jina-v3 run-1 anomaly (14 hits) needs investigation.
