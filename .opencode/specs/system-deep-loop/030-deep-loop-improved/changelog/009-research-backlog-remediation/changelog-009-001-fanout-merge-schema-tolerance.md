---
title: "Changelog: Fanout Merge Schema Tolerance [009-research-backlog-remediation/001-fanout-merge-schema-tolerance]"
description: "Chronological changelog for the Fanout Merge Schema Tolerance phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-01

> Spec folder: `.opencode/specs/deep-loops/030-deep-loop-improved/009-research-backlog-remediation/001-fanout-merge-schema-tolerance` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/030-deep-loop-improved/009-research-backlog-remediation`

### Summary

The fan-out merge script silently dropped an entire lineage's findings whenever its registry used a non-canonical schema key. A tolerant normalizer now coerces known key aliases before merging and logs a structured warning instead of a silent skip.

### Added

- Add `normalizeRegistrySchema()` in `fanout-merge.cjs`, wired into both `mergeResearchRegistries()` and `mergeReviewRegistries()`.
- Add `schema_mismatch` structured warning events (alias key, canonical key, coerced count) for every alias hit or unusable-registry skip.

### Changed

- Both merge functions now normalize a lineage's registry schema before checking for a `keyFindings` or `openFindings` array, instead of dropping the lineage outright when the array is missing under the expected key.

### Fixed

- Fixed the silent data-loss bug where a lineage's real findings vanished from synthesis because its registry used `findings` instead of `keyFindings` (research) or `openFindings` (review), with no warning that this happened.

### Verification

- Targeted `fanout-merge.vitest.ts` run, PASS.
- Full `deep-loop-runtime` Vitest suite run, PASS with the same pre-existing unrelated baseline failures noted throughout this remediation phase.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | Modified | Added `normalizeRegistrySchema()` and wired it into both merge paths. |

### Follow-Ups

- The research-side counterpart for a fully missing registry file (not just a schema mismatch) was tracked separately and shipped later in this same phase as `009/011`'s `reconstructResearchRegistryFromState`.
