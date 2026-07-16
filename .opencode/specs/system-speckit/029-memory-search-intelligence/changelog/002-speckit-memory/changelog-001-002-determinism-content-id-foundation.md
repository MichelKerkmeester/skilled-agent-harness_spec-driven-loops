---
title: "Changelog: Determinism and Content-ID Foundation [001-speckit-memory/002-determinism-content-id-foundation]"
description: "Chronological changelog for the Determinism and Content-ID Foundation phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/002-determinism-content-id-foundation` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

This phase anchors deterministic Memory MCP retrieval. Five keystone seams shipped in the Wave-0 record: shared content-id primitives, deterministic ANN ordering below RRF, content-derived tie-breaks, an explicit active-channel bonus denominator and a rank-time decay clock. Those changes give the sibling subsystems a shared comparator and hash contract to byte-compare against. Four residue items remain gated because they either need a downstream consumer, a render-stage build or a multi-writer threat model that does not exist for the current single-host tool.

### Added

- Added shared SHA-256 helpers for content bodies and canonical JSON.
- Added an explicit fusion bonus denominator option while preserving the current active-channel default.
- Recorded the gated residue items with their promotion conditions instead of leaving them ambiguous.

### Changed

- Stabilized ANN tie ordering under the fusion cutoff.
- Routed deterministic output tie-breaks through content-derived identifiers.
- Refactored decay ranking to use caller-supplied rank time while keeping reinforcement as a separate event.

### Fixed

- Closed the candidate disposition gap: shipped seams, gated seams and no-go identity work now have separate final states.
- Preserved the cross-subsystem byte-compare contract for the default path.

### Verification

- Shipped commits were traced against the Wave-0 record.
- Content-id parity tests passed.
- Focused Memory MCP determinism suites passed.
- Strict phase validation passed.

### Files Changed

_No file-level detail recorded in the generated changelog._

### Follow-Ups

- Keep the configured bonus mode behind its downstream weight consumer and fusion invariant test.
- Promote render-stage serialization only with a golden baseline.
- Reopen the identity-hardening pair only if the subsystem becomes multi-writer.
