---
title: "Changelog: A8 Surface Provenance Fields [005-spec-data-quality/008-a8-surface-provenance-fields]"
description: "Chronological changelog for the A8 Surface Provenance Fields phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/008-a8-surface-provenance-fields` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality`

### Summary

This phase is planned and scaffolded only. Nothing has been built yet. The docs below describe the intended change so a later session can pick it up without re-deriving the seams from the research.

### Added

- No new additions recorded.

### Changed

- This phase is planned and scaffolded only. Nothing has been built yet. The docs below describe the intended change so a later session can pick it up without re-deriving the seams from the research.

### Fixed

- No fixes recorded.

### Verification

- validate.sh strict on the phase folder - PENDING
- zod parse of generated and legacy JSON - PENDING
- stale vs fresh causal_summary fixture - PENDING

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts` | Planned Modify | Add source_kind, provenance, content_type optional fields |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` | Planned Modify | Add document_weight and freshness fields, bind causal_summary to source_docs |
| `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts` | Planned Modify | Populate the new fields at the atomicWriteJson write seam |
| `.opencode/skills/system-spec-kit/scripts/validation/content-quality.ts` | Planned Modify or Create | Add a warn-tier provenance coherence check |

### Follow-Ups

- Build this on-write gate per plan.md. The A1, B1 and B2 surfaces share the safe-fix engine in `026-shared-safe-fix-engine`, so build that first.
- Land it default-off and warn first, then flip to error only after the corpus backfill reads zero, per the migration sequence in `028-governance-rollout`.
