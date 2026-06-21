---
title: "Changelog: A3 Enum-Constrain JSON Metadata Schemas [005-spec-data-quality/003-a3-enum-constrain-schemas]"
description: "Chronological changelog for the A3 Enum-Constrain JSON Metadata Schemas phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/003-a3-enum-constrain-schemas` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality`

### Summary

Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Added

- No new additions recorded.

### Changed

- Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Fixed

- No fixes recorded.

### Verification

- An out-of-enum importance_tier, status, or content_type fixture fails on both schemas - PLANNED, not yet run
- An in-enum fixture passes on both schemas - PLANNED, not yet run
- A derive-then-parse round trip over a real packet produces only in-enum values - PLANNED, not yet run
- A description fixture with extra authored keys still parses - PLANNED, not yet run
- An out-of-enum value yields a precise per-field message through formatDescriptionSchemaIssues - PLANNED, not yet run

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` | Planned modify | Add the three as const vocabularies, swap importance_tier and status to z.enum(...), add the content_type enum |
| `.opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts` | Planned modify | Add importance_tier and content_type enums, tighten type, keep .passthrough() and the per-field issue formatter |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Planned modify | Close the normalizeDerivedStatus default so the producer only emits in-enum values |

### Follow-Ups

- Build this on-write gate per plan.md. The A1, B1 and B2 surfaces share the safe-fix engine in `026-shared-safe-fix-engine`, so build that first.
- Land it default-off and warn first, then flip to error only after the corpus backfill reads zero, per the migration sequence in `028-governance-rollout`.
