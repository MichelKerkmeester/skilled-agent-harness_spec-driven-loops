---
title: "Changelog: Remove coco from runtime configs + 4-runtime mirror [002-deprecate-coco-index/006-runtime-configs-4runtime-mirror]"
description: "Chronological changelog for the Remove coco from runtime configs + 4-runtime mirror phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/002-deprecate-coco-index/006-runtime-configs-4runtime-mirror` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/002-deprecate-coco-index`

### Summary

> Planned scaffold from the 001 research DAG. Detailed scope + file:line live in ../resource-map.md §4 (this phase's row) and the cited 001-touchpoint-research/research/iterations/ files. Run /spec_kit:plan on this folder to flesh out plan.md / tasks.md before execution.

### Added

- None.

### Changed

- Remove `cocoindex_code` MCP registration from `opencode.json`, `.vscode/mcp.json`, `.gemini/settings.json`, and `.codex/config.toml`.
- Remove `RERANK_SIDECAR_PORT`, `SPECKIT_CROSS_ENCODER`, and `RERANKER_LOCAL` environment notes from all runtime configs.
- Remove CocoIndex references from agent and command frontmatter across `.opencode/`, `.claude/`, `.gemini/`, and `.codex/` mirrors.
- Remove CocoIndex entries from `doctor_update.yaml` and `.gemini/commands/doctor/update.toml`.

### Fixed

- None.

### Verification

- No explicit verification recorded.

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- None.
