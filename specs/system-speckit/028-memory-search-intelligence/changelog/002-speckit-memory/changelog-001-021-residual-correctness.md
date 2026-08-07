---
title: "Changelog: Residual Correctness with RRF Scale and Maintenance Grace TTL [001-speckit-memory/021-residual-correctness]"
description: "Chronological changelog for the residual correctness phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/021-residual-correctness` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

This phase shipped two always-on correctness residuals inside the 028 tree. Search score averaging now reads the calibrated absolute relevance signal for semantic rows and falls back safely for lexical-only rows. Maintenance marker TTL now derives from the owner lease TTL with the reclaim margin codified, while preserving the existing 180 second value.

### Added

- Added shared TTL derivation constants and tests for the maintenance marker.
- Added fixture coverage for cosine-scale average scores and lexical fallback.

### Changed

- Routed search score resolution through absolute relevance for semantic rows.
- Preserved effective-score fallback when a row has no similarity.
- Derived marker TTL from the owner lease constant instead of a standalone literal.

### Fixed

- Closed the residual path that still averaged RRF magnitudes after the 015 confidence fix.
- Made the marker lifetime invariant explicit without changing its value.

### Verification

- Both residuals: DONE.
- Independent seam verification: DONE.
- Typecheck: PASS.
- Focused Vitest: PASS, baseline 32 tests and final 36 tests.
- Build: PASS.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Modified | Uses calibrated absolute relevance where available |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts` | Modified | Derives marker TTL from owner lease constants |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts` | Modified | Adds score-scale and fallback coverage |
| `.opencode/skills/system-spec-kit/mcp_server/tests/maintenance-marker.vitest.ts` | Modified | Adds TTL derivation and margin coverage |

### Follow-Ups

- Expect recall-confidence magnitudes to move because the scale is corrected by design.
- Keep the maintenance refresh invariant in mind for any future synchronous phase that could run longer than half the TTL.
