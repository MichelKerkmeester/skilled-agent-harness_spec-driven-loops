---
title: "Changelog: Summary Fusion and World-Summary Grounding [001-speckit-memory/015-summary-fusion-grounding]"
description: "Chronological changelog for the summary fusion and world-summary grounding phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/015-summary-fusion-grounding` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

This phase shipped shadow-gated summary and community fusion code, plus a default-off read-only grounding prelude over existing summaries. The fused lane is registered across routing, telemetry, ranked-list adaptation, RRF fusion and adaptive weights and the legacy inject paths are stood down to avoid double-counting. The benchmark delta, weight retune and persistent two-tier world-summary hierarchy remain pending because live benchmark and schema work were out of scope.

### Added

- Added summary and community channels to the routing surface.
- Added default-off flags for the fused lane and grounding prelude.
- Added fused ranked-list adapters for community and summary evidence.
- Added a read-only grounding prelude provider over existing summaries.

### Changed

- Pushed the fused lane into the RRF fusion site behind the shadow flag.
- Stood down the weak-result community fallback and summary Stage 1 inject path.
- Added a per-channel adaptive-weight slot and cache identity split for the new lane.
- Prepended the grounding prelude before retrieved context when its flag is on.

### Fixed

- Added tests that prove summary and community evidence is counted once.
- Corrected the stale "nothing implemented" summary to reflect shipped shadow-gated code.

### Verification

- TypeScript gate: PASS.
- Related Vitest slice: PASS, 15 files, 455 tests and 13 skipped.
- Strict phase validation: PASS.
- Comment-hygiene checks: PASS.
- Live retrieval baseline, post-change delta and byte-identical output proof remain pending.

### Files Changed

_Detailed file-level changes live in the phase spec and tasks._

### Follow-Ups

- Capture the pre-change retrieval baseline and post-change delta before promotion.
- Retune the affected RRF weights against measured data.
- Build the persistent world-summary hierarchy only in a schema-migration packet.
