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

- An out-of-enum importance_tier, status or content_type fixture fails on the strict schema variant while the default-off parse-on-load path accepts it - PLANNED, not yet run
- An in-enum fixture passes either way and a default-off parse of a legacy fixture is byte-identical to baseline - PLANNED, not yet run
- A derive-then-parse round trip over fixtures exercising all three producer paths, malformed source status, an unknown-availability ranked doc and a frontmatter importance_tier of high, produces only in-enum values - PLANNED, not yet run
- A description fixture with extra authored keys still parses - PLANNED, not yet run
- An out-of-enum value yields a precise per-field message through formatDescriptionSchemaIssues - PLANNED, not yet run

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` | Planned modify | Add the three as const vocabularies, add a flag-gated strict enum variant (or superRefine) for importance_tier, status and content_type so the base schema stays free-string when SPECKIT_SCHEMA_ENUM_ENFORCE is off, not a bare z.enum baked into the base |
| `.opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts` | Planned modify | Add importance_tier and content_type enums behind the same flag seam, tighten type, keep .passthrough() and the per-field issue formatter |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Planned modify | Guard all three out-of-enum producer paths so a derived file is in-enum: the normalizeDerivedStatus default-passthrough, the deriveStatus 'unknown' branch and the unnormalized deriveImportanceTier raw-tier return |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Planned modify | Add the isSchemaEnumEnforceEnabled() resolver wrapping isFeatureEnabled('SPECKIT_SCHEMA_ENUM_ENFORCE') so the strict path is reachable only when the flag is on |

### Follow-Ups

- Build this on-write gate per plan.md. The A1, B1 and B2 surfaces share the safe-fix engine in `026-shared-safe-fix-engine`, so build that first.
- Land it default-off and warn first, then flip to error only after the corpus backfill reads zero, per the migration sequence in `028-governance-rollout`.
