---
title: "Changelog: A7 EARS Patterns, Constraint Tier, and REQ_COVERAGE Gate [005-spec-data-quality/007-a7-ears-constraints-req-coverage]"
description: "Chronological changelog for the A7 EARS Patterns, Constraint Tier, and REQ_COVERAGE Gate phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/007-a7-ears-constraints-req-coverage` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality`

### Summary

Nothing is built yet. This phase is PLANNED and scaffolded. The doc set captures the approach so a later build stage can clone the shipped AC_COVERAGE rule into a REQ_COVERAGE gate without re-deriving the seams. The plan, tasks, and checklist hold the verified file references the build will act on.

### Added

- No new additions recorded.

### Changed

- Nothing is built yet. This phase is PLANNED and scaffolded. The doc set captures the approach so a later build stage can clone the shipped AC_COVERAGE rule into a REQ_COVERAGE gate without re-deriving the seams. The plan, tasks, and checklist hold the verified file references the build will act on.

### Fixed

- No fixes recorded.

### Verification

- Build of the REQ_COVERAGE clone - NOT RUN, phase is PLANNED
- validate.sh strict with the flag on against an unlinked REQ - NOT RUN, phase is PLANNED
- validate.sh strict flag-unset no-op on a 005 sibling - NOT RUN, phase is PLANNED
- Spec-doc set validate.sh strict on this folder - PASS, scaffold docs only

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/scripts/rules/check-req-coverage.sh` | Planned Create | Clone the AC rule and retarget to tasks REQ linkage |
| `.opencode/skills/system-spec-kit/scripts/rules/check-ears-lint.sh` | Planned Create | Advisory linter for non-EARS non-constraint rows |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Planned Modify | Register REQ_COVERAGE and EARS_LINT behind their flags |
| `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl` | Planned Modify | Add EARS patterns and the constraint tier |
| `.opencode/skills/system-spec-kit/templates/manifest/tasks.md.tmpl` | Planned Modify | Add a REQ-reference linkage marker |

### Follow-Ups

- Build this on-write gate per plan.md. The A1, B1 and B2 surfaces share the safe-fix engine in `026-shared-safe-fix-engine`, so build that first.
- Land it default-off and warn first, then flip to error only after the corpus backfill reads zero, per the migration sequence in `028-governance-rollout`.
