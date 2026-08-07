---
title: "Changelog: Memory MCP Retrieval-Class Routing and Recall-Shape Intelligence [001-speckit-memory/003-retrieval-class-routing]"
description: "Chronological changelog for the Memory MCP retrieval-class routing and recall-shape intelligence phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/003-retrieval-class-routing` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

The Memory search path now has a deterministic retrieval-class axis. The shipped slice classifies each query once, carries that class beside the existing route metadata and lets SingleHop and MultiHop queries diverge safely at the graph-preservation seam. It also wires default-off per-class retrieval profiles into the pre-fusion ranking path, so profile weights can change channel contribution without changing flags-off behavior. Recall-shape work and graph-context extension remain pending.

### Added

- Added a pure retrieval-class classifier with the five-class taxonomy and neutral fallback.
- Added `retrievalClass` as an additive route axis.
- Added default-off retrieval profiles that feed channel weights into the shared RRF fuser.

### Changed

- SingleHop routing now forces graph preservation off at the existing route seam.
- MultiHop routing keeps the current graph-preserving behavior.
- Fusion now receives the live bonus denominator option so zero-weight channels do not distort the convergence bonus.

### Fixed

- Added adversarial and totality coverage for empty, mixed-shape and precedence-heavy queries.
- Proved the neutral profile leaves fused output unchanged.
- Confirmed the changed surfaces use existing routing and fusion seams.

### Verification

- Baseline typecheck: PASS.
- Baseline related Vitest: PASS, 7 files and 265 tests.
- Final Memory MCP typecheck: PASS.
- Final shared typecheck: PASS.
- Final related Vitest: PASS, 8 files and 281 tests.
- Strict phase validation: PASS.
- Comment hygiene: PASS.

### Files Changed

_No file-level detail recorded in the generated changelog._

### Follow-Ups

- Finish the recall-shape extension only after a termination property test exists.
- Exercise the remaining flag-state matrix before promotion.
- Keep the routing class, intent and complexity axes explicit in future tests.
