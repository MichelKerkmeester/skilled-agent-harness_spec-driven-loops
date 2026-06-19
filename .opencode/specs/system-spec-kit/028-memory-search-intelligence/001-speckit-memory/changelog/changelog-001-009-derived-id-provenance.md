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

This is a planning-stage packet for content-addressed derived causal artifacts. The shared content-id dependency exists, but the derived ID helper, migration and write-path changes remain behind the schema-migration gate. No production code shipped in this phase.

### Added

_No shipped additions recorded._

### Changed

- Confirmed the shared canonical JSON hash helper exists and can be reused.
- Documented that legacy anchor-inclusive uniqueness drives the derived ID input shape.
- Planned the helper, migration, write-path and verification sequence.

### Fixed

- Removed any benchmark framing from the phase. This is a correctness and reproducibility change.

### Verification

- Planning docs strict validation: PASS.
- Implementation tests: not run because the build is pending.
- Migration and backfill tests: not run because the build is pending.

### Files Changed

_No production file-level detail recorded._

### Follow-Ups

- Decide canonical field order, kind tag, source definition and legacy rule-version handling before migration.
- Reuse the existing canonical JSON helper rather than adding a new hash primitive.
- Prove backfill on a real database copy before promoting the migration.
