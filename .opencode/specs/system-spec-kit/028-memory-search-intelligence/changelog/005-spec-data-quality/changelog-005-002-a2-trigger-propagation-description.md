---
title: "Changelog: A2 Trigger Propagation and Derived Description [005-spec-data-quality/002-a2-trigger-propagation-description]"
description: "Chronological changelog for the A2 Trigger Propagation and Derived Description phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/002-a2-trigger-propagation-description` (Level 2)
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

- Regenerating 005/description.json writes a trigger_phrases superset of its curated set - PLANNED, not yet run
- The regenerated description is not a verbatim copy of the first # heading - PLANNED, not yet run
- The derive cap and the propagation cap both read 12 - PLANNED, not yet run
- The subset coherence assertion passes against a folder with curated triggers - PLANNED, not yet run
- A second regeneration over an unchanged spec.md yields identical output - PLANNED, not yet run

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Planned modify | Populate trigger_phrases in generatePerFolderDescription, demote the title-copy in extractDescription to a fallback, read curated frontmatter triggers from spec.md |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts` | Planned modify | Raise the extractTriggersFromContent cap from 8 to 12 to match the propagation cap |
| `.opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts` | Planned confirm | Confirm trigger_phrases validation tolerates the populated capped array, no schema break since the field is already declared |

### Follow-Ups

- Build this on-write gate per plan.md. The A1, B1 and B2 surfaces share the safe-fix engine in `026-shared-safe-fix-engine`, so build that first.
- Land it default-off and warn first, then flip to error only after the corpus backfill reads zero, per the migration sequence in `028-governance-rollout`.
