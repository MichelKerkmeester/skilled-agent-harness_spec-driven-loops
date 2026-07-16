---
title: "Changelog: Rewrite docs + 27 YAML assets to HYBRID search policy [002-deprecate-coco-index/007-docs-readme-search-routing]"
description: "Chronological changelog for the Rewrite docs + 27 YAML assets to HYBRID search policy phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/002-deprecate-coco-index/007-docs-readme-search-routing` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/002-deprecate-coco-index`

### Summary

> Planned scaffold from the 001 research DAG. Detailed scope + file:line live in ../resource-map.md §4 (this phase's row) and the cited 001-touchpoint-research/research/iterations/ files. Run /spec_kit:plan on this folder to flesh out plan.md / tasks.md before execution.

### Added

- None.

### Changed

- Rewrite 27 YAML workflow assets (speckit, create, deep-loop, doctor) to HYBRID search policy based on Grep and code-graph structural queries.
- Remove `cocoindex_code` from `mcp_servers` blocks in deep-loop executor YAMLs for research and review workflows.
- Update `README.md`, install guides, `AGENTS.md`, and `CLAUDE.md` search routing sections and decision trees to reflect HYBRID policy.
- Remove CocoIndex vector and semantic channel references from `search.md`.

### Fixed

- None.

### Verification

- No explicit verification recorded.

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- None.
