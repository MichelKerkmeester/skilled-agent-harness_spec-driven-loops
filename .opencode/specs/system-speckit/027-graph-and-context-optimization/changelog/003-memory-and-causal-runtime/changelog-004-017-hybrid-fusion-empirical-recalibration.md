---
title: "Code Index Stack 017: Hybrid Fusion Empirical RRF Recalibration"
description: "Empirical 7-cell RRF parameter sweep across K, vec_weight and fts_weight revealed fusion tuning is a no-op on hit rate for the bge-code-v1 pipeline. All swept cells tied at 12/18. The latency-optimum cell (K=60, V=0.9, F=0.5) was locked as the new production default, yielding a 2.8 percent p95 win at identical recall."
trigger_phrases:
  - "RRF parameter sweep recalibration"
  - "hybrid fusion no-op hit rate"
  - "sweep-rrf.sh sweep-rrf.py"
  - "COCOINDEX_HYBRID_VECTOR_WEIGHT locked default"
  - "016/004/017 empirical recalibration"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/017-hybrid-fusion-empirical-recalibration` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack`

### Summary

CocoIndex's hybrid fusion had inherited RRF defaults (`k=60`, `vec_weight=0.7`, `fts_weight=0.7`) that were never empirically validated against the corrected pipeline from packets 013-016. A sweep harness and deterministic analyzer were built and run across a 7-cell neighborhood of the default config. All seven cells produced identical hit rate (12/18) on the corrected 18-probe fixture under bge-code-v1, confirming that the six missed probes fail at the recall stage and are not recoverable by RRF re-weighting. The latency-optimum cell `(K=60, V=0.9, F=0.5)` was selected by the deterministic picker and locked as new production defaults in `config.py`, delivering a 2.8 percent p95 latency improvement at identical recall. ADR-020 documents the sweep grid, the finding, the rollback path plus guidance for future re-sweeps when the embedder or corpus changes.

### Added

- `sweep-rrf.sh` with 4x4x4 grid env parsing, per-cell daemon restart, bench invocation, JSON capture and `--resume` support (NEW)
- `sweep-rrf.py` deterministic aggregator producing top-N ranking table, per-probe heatmap, latency scatter and evidence-derived picked-cell recommendation (NEW)
- `tests/test_rrf_config.py` with four tests covering env-var parsing, default fallback, invalid-value handling and picker tiebreak behavior (NEW)
- `evidence/sweep-results.md` with all three result tables and the picked-cell decision rationale (NEW)
- `evidence/phase2-comparison-017-recalibrated.md` final-gate bench output confirming no regression across baseline-bge, bge-path-class and jina-v3 lanes (NEW)
- Per-cell JSON artifacts for all 7 swept cells under `evidence/cells/` (NEW)

### Changed

- `config.py` `_DEFAULT_HYBRID_VECTOR_WEIGHT` updated from `0.7` to `0.9` and `_DEFAULT_HYBRID_FTS5_WEIGHT` updated from `0.7` to `0.5` based on empirical picker output. `_DEFAULT_HYBRID_RRF_K` remains `60` as all K values tied.
- `tests/test_config.py` default-value assertions updated to match the new locked defaults.

### Fixed

- Inherited RRF defaults were undocumented convention with no empirical basis for the corrected pipeline. Sweep provides evidence-backed defaults and ADR-020 documents the rationale and rollback path.

### Verification

| Check | Status | Evidence |
|---|---|---|
| Shell syntax | Pass | `bash -n sweep-rrf.sh` |
| Analyzer syntax | Pass | `python -m py_compile sweep-rrf.py` |
| Focused pytest | Pass | `tests/test_rrf_config.py` 4 tests |
| Existing test suite | Pass | `tests/test_config.py` assertions updated |
| 7-cell sweep completed | Pass | `evidence/sweep-results.md` shows 7 cells loaded |
| Final-gate bench | Pass | `evidence/phase2-comparison-017-recalibrated.md` confirms 12/18 baseline-bge, 13/18 bge-path-class, 14/18 jina-v3 |
| No regression | Pass | All three bench lanes match or exceed post-016 baselines |
| Strict validation | Pass | `validate.sh --strict` returned `RESULT: PASSED` |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `phase2-bench/sweep-rrf.sh` | Created (NEW) | RRF sweep wrapper iterating the parameter grid with per-cell env vars, daemon restart and `--resume` |
| `phase2-bench/sweep-rrf.py` | Created (NEW) | Deterministic aggregator, picker and report writer producing sweep-results.md |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_rrf_config.py` | Created (NEW) | Four tests for sweep grid defaults, overrides, invalid values and picker behavior |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | Modified | `_DEFAULT_HYBRID_VECTOR_WEIGHT` 0.7 to 0.9. `_DEFAULT_HYBRID_FTS5_WEIGHT` 0.7 to 0.5. `_DEFAULT_HYBRID_RRF_K` unchanged. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py` | Modified | Default-value assertions updated to match new locked defaults |
| `evidence/sweep-results.md` | Created (NEW) | Three result tables and picked-cell decision with rationale |
| `evidence/phase2-comparison-017-recalibrated.md` | Created (NEW) | Final-gate bench output across three lanes confirming no regression |

### Follow-Ups

- Re-run the sweep harness when a new embedder or reranker is promoted to production. The harness supports arbitrary grids via the three JSON-list env vars.
- ADR-020 rollback path uses `COCOINDEX_HYBRID_VECTOR_WEIGHT=0.7 COCOINDEX_HYBRID_FTS5_WEIGHT=0.7` env overrides to revert to pre-017 defaults without a code change.
- The six consistently missed probes (5, 10, 12, 13, 14, 18) fail at the recall stage. Improving hit rate beyond 12/18 under bge-code-v1 requires a better candidate set, not RRF re-weighting. Track as input to a future embedder or chunking packet.
