---
title: "Changelog: A6 HVR Style Auto-Fix Linter [005-spec-data-quality/006-a6-hvr-style-autofix]"
description: "Chronological changelog for the A6 HVR Style Auto-Fix Linter phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/006-a6-hvr-style-autofix` (Level 2)
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

- A mixed fixture auto-fixes to zero issues with code inline-code and frontmatter regions byte-identical - PLANNED, not yet run
- A re-run over already-clean prose applies zero changes under the content_hash guard - PLANNED, not yet run
- An em-dash inside a fence and inside frontmatter yields zero issues - PLANNED, not yet run
- detect in report mode returns issues and leaves the file unchanged on disk - PLANNED, not yet run
- Each ambiguous swap asserts its exact documented output - PLANNED, not yet run

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/.../detector-registry.ts` | Planned modify | Add the hvr.style detector entry with fixClass: 'safe' and surface: 'spec-doc' |
| `.opencode/skills/system-spec-kit/mcp_server/.../detectors/hvr-style.ts` | Planned create | The fence-aware prose parser, the three swap rules, and the length-neutrality and idempotency guards |
| `.opencode/skills/system-spec-kit/mcp_server/.../detectors/__tests__/hvr-style.vitest.ts` | Planned create | Fixtures for each swap rule, fence and frontmatter exclusion, and idempotency |

### Follow-Ups

- Build this on-write gate per plan.md. The A1, B1 and B2 surfaces share the safe-fix engine in `026-shared-safe-fix-engine`, so build that first.
- Land it default-off and warn first, then flip to error only after the corpus backfill reads zero, per the migration sequence in `028-governance-rollout`.
