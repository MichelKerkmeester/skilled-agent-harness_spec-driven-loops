---
title: "Changelog: Corpus Reindex — Gate-Zero for Recall Benchmarking [001-speckit-memory/001-corpus-reindex-gate-zero]"
description: "Chronological changelog for the Corpus Reindex — Gate-Zero for Recall Benchmarking phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/001-corpus-reindex-gate-zero` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

Shipped: - C9-4 assertEmbeddingCoverage guard (DONE): added inspectEmbeddingCoverage + assertEmbeddingCoverage in lib/eval/ablation-framework.ts, wired beside assertGroundTruthAlignment at the runner. Default threshold is 100 percent of unique golden parent IDs, requiring both memory_index.embedding_status = 'success' and a vec_memories row. The failure message references the reindex/reconcile remediation and scripts/evals/map-ground-truth-ids.ts --write. 59 ablation tests pass; typecheck and validate.sh --strict green.

### Added

- No new additions recorded.

### Changed

- Invoke it at the existing pre-flight call site :580-586 alongside assertGroundTruthAlignment (lib/eval/ablation-framework.ts) [10m]
- Unit: assertEmbeddingCoverage throws below threshold, passes above (mcp_server/ vitest) [20m]

### Fixed

- Add assertEmbeddingCoverage (compute golden-set parent embedding coverage; throw-with-remediation below threshold) (lib/eval/ablation-framework.ts) [45m]
- Integration: runAblation refuses a deliberately-low-coverage probe and passes on the restored corpus [20m]

### Verification

- Tasks complete - 4 completed task item(s) recorded

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- CHK-001 Pre-reindex coverage baseline captured
- CHK-002 Embedding provider healthy + no competing scan job
- CHK-003 Guard seam confirmed present
- CHK-010 assertEmbeddingCoverage compiles + lint/typecheck clean
- CHK-011 Guard reuses the existing pre-flight choke point (no duplicated benchmark path)
- CHK-012 Reconcile run fail-closed (dry-run before apply; no deletes)
