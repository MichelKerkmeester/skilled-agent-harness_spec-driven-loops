---
title: "Changelog: Mem0 Ranking and Extraction Bundle [001-speckit-memory/014-mem0-ranking-tweaks]"
description: "Chronological changelog for the Mem0 ranking and extraction bundle phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/014-mem0-ranking-tweaks` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

This phase moved from planning to partial implementation. Declarative regex entity extraction shipped always-on with parity coverage and the entity-cardinality penalty shipped behind a default-off flag on the graph degree channel. The content-hash reprocessing trigger closed as no-transfer because changed content already re-enters the save and indexing path. BM25 calibration, lemmatization, cascade extraction, write-time memory linking and entity vector boost remain pending behind benchmark, dependency or schema gates.

### Added

- Added a JSON entity-extraction rule asset that reproduces the built-in rules.
- Added a config loader with fail-closed fallback to the built-in extraction rules.
- Added a default-off cardinality penalty flag and unit coverage.

### Changed

- Applied the quadratic entity-cardinality damp at the degree-channel seam rather than in the shared fuser.
- Resolved content-hash reprocessing as already covered by the changed-content save path.

### Fixed

- Corrected the stale planning-only framing. The phase now records two shipped items, one no-transfer closure and five pending candidates.

### Verification

- Entity-config parity test: PASS.
- Cardinality penalty unit coverage: PASS.
- Strict phase validation: PASS.
- Recall benchmark, build and promotion gates remain pending for the ranking candidates.

### Files Changed

_Detailed file-level changes live in the phase spec and tasks._

### Follow-Ups

- Capture the reindexed recall baseline before promoting any ranking tweak.
- Resolve the lemmatizer dependency before touching FTS tokenization.
- Keep entity-store boost deferred until an entity vector index exists.
