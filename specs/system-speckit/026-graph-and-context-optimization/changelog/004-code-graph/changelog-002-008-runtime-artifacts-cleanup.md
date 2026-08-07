---
title: "Changelog: Clean runtime artifacts, hooks, sweeper [002-deprecate-coco-index/008-runtime-artifacts-cleanup]"
description: "Chronological changelog for the Clean runtime artifacts, hooks, sweeper phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/002-deprecate-coco-index/008-runtime-artifacts-cleanup` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/002-deprecate-coco-index`

### Summary

> Planned scaffold from the 001 research DAG. Detailed scope + file:line live in ../resource-map.md §4 (this phase's row) and the cited 001-touchpoint-research/research/iterations/ files. Run /spec_kit:plan on this folder to flesh out plan.md / tasks.md before execution.

### Added

- None.

### Changed

- Remove leftover `.venv` directories from deleted CocoIndex and rerank-sidecar skills.
- Clean `~/.cocoindex_code/` daemon runtime artifacts (socket, PID, log) and local index directory.
- Remove sidecar-reaper telemetry from `sidecar-reaper.jsonl`.
- Remove rerank and port-8765 probes from `orphan-mcp-sweeper.sh`.
- Update `scripts/README.md` to remove CocoIndex references.
- Update git hook `session-start.sh` for post-cleanup compatibility.

### Fixed

- None.

### Verification

- No explicit verification recorded.

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- None.
