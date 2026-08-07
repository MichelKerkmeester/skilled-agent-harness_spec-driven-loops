---
title: "Changelog: Decouple system-code-graph from CocoIndex [002-deprecate-coco-index/002-decouple-code-graph]"
description: "Chronological changelog for the Decouple system-code-graph from CocoIndex phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/002-deprecate-coco-index/002-decouple-code-graph` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/002-deprecate-coco-index`

### Summary

> Planned scaffold from the 001 research DAG. Detailed scope + file:line live in ../resource-map.md §4 (this phase's row) and the cited 001-touchpoint-research/research/iterations/ files. Run /spec_kit:plan on this folder to flesh out plan.md / tasks.md before execution.

### Added

- None.

### Changed

- Remove ccc_status, ccc_reindex, and ccc_feedback tool schemas from `tool-schemas.ts`, reducing the Code Graph MCP tool count from 11 to 8.
- Neutralize semantic and hybrid routing in `query-intent-classifier.ts` so structural queries no longer attempt CocoIndex-backed classification.
- Remove CocoIndex references from `cocoindex-path.ts`, `ccc-readiness-probe.ts`, and `startup-brief.ts`.
- Delete `feature_catalog/07--ccc-integration/` directory and its `ccc_bridge_integration.md` reference doc.
- Remove the cocoindex route from `_routes.yaml` and delete `doctor_cocoindex.yaml` plus related doctor entries for `mcp_install` and `debug`.
- Remove `COCOINDEX_BIN_PATH` from `mk-code-index-launcher.cjs`.

### Fixed

- None.

### Verification

- No explicit verification recorded.

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- Confirm operator decisions on memory cross-encoder loss and HYBRID semantic policy before execution.
