---
title: "Changelog: Novel typed-relation KG auto-extracted [005-spec-data-quality/004-novel-research/023-novel-typed-relation-kg]"
description: "Chronological changelog for the Novel typed-relation KG auto-extracted phase."
trigger_phrases:
 - "phase changelog"
 - "nested changelog"
 - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-21

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/004-novel-research/023-novel-typed-relation-kg` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality`

### Summary

Nothing is built yet. This phase holds the Level-2 doc set and the design, and it waits on implementation. The notes below describe the planned build so a future session can pick it up without re-deriving scope.

### Added

- No new additions recorded.

### Changed

- Nothing is built yet. This phase holds the Level-2 doc set and the design, and it waits on implementation. The notes below describe the planned build so a future session can pick it up without re-deriving scope.

### Fixed

- No fixes recorded.

### Verification

- bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict - Doc set only, run during scaffold authoring, not a completion gate
- vitest unit suite - Not yet run, no code shipped
- Acceptance criteria in spec.md - Not yet met, scaffold only

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/lib/causal/llm-relation-extractor.ts` | Planned (Create) | LLM typed-relation extractor with bounded parse and reused caps |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` | Planned (Modify) | Persist LLM-derived edges with a distinct created_by and an LLM evidence marker |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Planned (Modify) | Register the backfill callback at bootstrap to close the unwired seam |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts` | Planned (Modify) | Read-only typed-edge navigation accessor over causal_edges |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Planned (Modify) | Document the extractor under the existing SPECKIT_LLM_GRAPH_BACKFILL flag |

### Follow-Ups

- Build this capability per plan.md as a report-only or additive seam that never mutates an authored document body.
- It bypasses the 3-result truncation floor by construction, so it earns its keep on a non-retrieval metric of its own.
