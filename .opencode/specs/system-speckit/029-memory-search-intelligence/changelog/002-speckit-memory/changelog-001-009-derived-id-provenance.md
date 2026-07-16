---
title: "Changelog: Content-Addressed Derived ID for Derived Causal Artifacts [001-speckit-memory/009-derived-id-provenance]"
description: "Chronological changelog for the content-addressed derived ID for derived causal artifacts phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/009-derived-id-provenance` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

This phase shipped the content-addressed derived ID for generated causal edges behind the default-off `SPECKIT_DERIVED_ID_PROVENANCE` flag. The derived-id helper reuses the shared content-id primitive, the schema version 40 migration adds the additive identity column with a partial unique index and the write path persists the id only for generated rows when the flag is on. Default behavior stays byte-identical until the gate is enabled. Commit `ed53661043` carried the lib code and a 396-line passing test.

### Added

- Added the default-off `SPECKIT_DERIVED_ID_PROVENANCE` flag and the derived-id helper in `lib/content-id.ts`.
- Added the v40 `causal_edges.derived_id` migration with duplicate-safe backfill and a partial unique index.
- Added `tests/derived-id-provenance.vitest.ts` covering helper stability, migration, flag gating, replay and rollback.

### Changed

- Confirmed the shared canonical JSON hash helper exists and reused it rather than adding a new primitive.
- Documented that legacy anchor-inclusive uniqueness drives the derived ID input shape.
- Shipped the helper, migration and write-path wiring with the verification sequence.

### Fixed

- Removed any benchmark framing from the phase. This is a correctness and reproducibility change.

### Verification

- Planning docs strict validation: PASS.
- Implementation tests: PASS. Focused suite 5 files / 41 tests at commit `ed53661043`.
- Migration and backfill tests: PASS, covered by the derived-id-provenance suite.

### Files Changed

- `lib/content-id.ts`: derived-id helper composing the canonical triple plus source plus rule_version.
- `lib/search/search-flags.ts`: default-off `SPECKIT_DERIVED_ID_PROVENANCE` flag.
- `lib/search/vector-index-schema.ts`: v40 migration, identity column, partial unique index and duplicate-safe backfill.
- `tests/derived-id-provenance.vitest.ts`: 396-line coverage of helper, migration and gating.

### Follow-Ups

- Decide canonical field order, kind tag, source definition and legacy rule-version handling before migration.
- Reuse the existing canonical JSON helper rather than adding a new hash primitive.
- Prove backfill on a real database copy before promoting the migration.
