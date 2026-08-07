---
title: "Changelog: A4 Schema Warn to Error [003-spec-data-quality/001-on-write-quality/004-schema-warn-to-error]"
description: "Chronological changelog for the A4 Schema Warn to Error phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-spec-data-quality/001-on-write-quality/004-schema-warn-to-error` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-spec-data-quality`

### Summary

Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Added

- No new additions recorded.

### Changed

- Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Fixed

- No fixes recorded.

### Verification

- validate.sh --strict on a valid corpus exits 0 - PLANNED, not yet run
- Malformed metadata JSON reports an error not a warning - PLANNED, not yet run
- Corrupted scratch packet exits 2 under --strict - PLANNED, not yet run
- grep of validate.sh returns zero legacy_grandfathered matches - PLANNED, not yet run
- Dry-run census re-measures the live corpus to zero failing files. A real graphMetadataSchema safeParse fails 24 files today, 16 excluding archives, not the 11 the parent census reported, so the backfill must clear the real failing roots first - PLANNED, not yet run

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/scripts/rules/check-description-shape.sh` | Planned modify | Swap the inline check for a folderDescriptionSchema call routed through formatDescriptionSchemaIssues, surface every issue as error |
| `.opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata-shape.sh` | Planned modify | Swap the inline check for a graphMetadataSchema call, keep the pointer check, promote warnings to error |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Planned modify | Set severity to error for GRAPH_METADATA_SHAPE and DESCRIPTION_SHAPE |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Planned modify | Delete detect_legacy_grandfathered, its declaration, its call site and all four LEGACY_GRANDFATHERED reads in the strict RESULT and exit logic, not the single read the earlier draft named |

### Follow-Ups

- Build this on-write gate per plan.md. The A1, B1 and B2 surfaces share the safe-fix engine in `026-shared-safe-fix-engine`, so build that first.
- A4 is unconditional as a DECISION but the error flip is gated on backfill-to-zero. The live failing count is 16-to-24 today, not 0, and the real failing roots are `.opencode/specs/graph-metadata.json` (legacy two-key shape) plus three `026/022` packets failing on migration_source, a missing depends_on[].source and an out-of-enum save_lineage, not the 11 nested research-iteration text stubs the parent census named.
- Land it default-off and warn first, then flip to error only after the corpus backfill re-measures to zero, per the four-beat migration sequence in `028-governance-rollout`.
