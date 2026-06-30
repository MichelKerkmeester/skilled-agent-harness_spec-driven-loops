---
title: "Changelog: Remove mk-spec-memory local cross-encoder path [002-deprecate-coco-index/003-remove-memory-rerank-path]"
description: "Chronological changelog for the Remove mk-spec-memory local cross-encoder path phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/002-deprecate-coco-index/003-remove-memory-rerank-path` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/002-deprecate-coco-index`

### Summary

> Planned scaffold from the 001 research DAG. Detailed scope + file:line live in ../resource-map.md §4 (this phase's row) and the cited 001-touchpoint-research/research/iterations/ files. Run /spec_kit:plan on this folder to flesh out plan.md / tasks.md before execution.

### Added

- None.

### Changed

- Remove the local cross-encoder provider branch and fallback wiring from `cross-encoder.ts`, causing memory search to fall back to positional scoring.
- Remove opt-in gates in `search-flags.ts` that controlled the cross-encoder path.
- Remove the `ensureRerankSidecar` import and call from `mk-spec-memory-launcher.cjs`.
- Remove `SPECKIT_CROSS_ENCODER` and `RERANKER_LOCAL` flag documentation from `ENV_REFERENCE.md`.
- Remove `RERANK_SIDECAR_PORT` from `mk-skill-advisor-launcher.cjs`.

### Fixed

- None.

### Verification

- No explicit verification recorded.

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- Confirm operator decision on memory cross-encoder loss before execution.
