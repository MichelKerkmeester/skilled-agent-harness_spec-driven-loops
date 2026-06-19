---
title: "Changelog: Corpus Reindex - Gate-Zero for Recall Benchmarking [001-speckit-memory/001-corpus-reindex-gate-zero]"
description: "Chronological changelog for the Corpus Reindex - Gate-Zero for Recall Benchmarking phase."
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

The benchmark gate now fails closed on embedding coverage before any recall number is trusted. The phase shipped an `assertEmbeddingCoverage` preflight in the ablation runner and verified that the live corpus already had complete vector coverage, so the manual reindex was superseded rather than run for its own sake. The remaining backlog belongs to background enrichment and normal index consistency repair, not missing benchmark embeddings.

### Added

- Added coverage inspection and assertion helpers to the ablation framework.
- Added a benchmark preflight that requires each golden parent to have both a successful embedding status and a vector row.
- Added remediation text that points operators to the reindex, reconcile and golden-id mapping paths when coverage fails.

### Changed

- The ablation runner now checks embedding coverage beside the existing ground-truth alignment gate.
- The reindex work was narrowed to a documented no-op because coverage evidence already satisfied the benchmark precondition.

### Fixed

- Recall benchmarks can no longer proceed against a cold or partially embedded golden set.

### Verification

- Ablation suite: PASS, 59 tests.
- TypeScript gate: PASS.
- Strict phase validation: PASS.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `lib/eval/ablation-framework.ts` | Modified | Added the coverage inspection and benchmark preflight guard |

### Follow-Ups

- Treat the enrichment backlog as a separate operational concern. It is not blocking recall benchmark coverage.
- Keep golden-id mapping available as the fallback if a later reindex changes parent identifiers.
