---
title: "Phase 005: memory-causal-trust-display"
description: "Memory search results gained display-only trust badges derived from existing causal-edge data and preserved through response profiles."
trigger_phrases:
  - "phase 005 changelog"
  - "memory causal trust display"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-25

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/wave-4-2026-05-26-reorg/004-external-project-adoption-dissolved` (Level 2)
> Parent packet: `027-graph-and-context-optimization/005-graph-impact-and-affordance`

### Summary

Phase 005 added per-result trust badges to Memory search output. The formatter reads existing causal-edge records at response time and derives confidence, age, orphan state and weight-history state without changing storage. Response profiles now keep those badges on `results[]` and `topResult`. The placement stayed per result because trust applies to a specific Memory claim, not the whole search request.

### Added

- Additive `MemoryTrustBadges` output on each `MemoryResultEnvelope`.
- Batch derivation from existing `strength`, `extracted_at`, `last_accessed` and `weight_history` data.
- Trust-badge tests for derivation, age rendering, orphan detection and explicit payload preservation.
- Feature catalog and manual testing playbook entries for the display surface.

### Changed

- `profile-formatters.ts` preserves `trustBadges` through `quick`, `research` and `resume` views.
- Formatter fails open when the DB handle or `weight_history` table is unavailable.
- Explicit caller-supplied trust badges are preserved.
- Review remediation later added merge-per-field behavior, age-label allowlisting and trace fields.

### Fixed

- Memory search results now show trust context without adding Code Graph facts to Memory.
- Response-profile shaping no longer drops the badge payload.
- Review remediation later fixed the skipped SQL test rig with a DI seam and bind-side string coercion.
- Review remediation later tied memory-search cache keys to causal-edge generation when causal boost is enabled.

### Verification

- Wave-3 evidence: `tsc --noEmit` exited 0.
- Wave-3 evidence: 9 passed and 1 skipped test file, with 90 passed and 3 skipped tests.
- `tests/response-profile-formatters.vitest.ts` was inside the passed files.
- `tests/memory/trust-badges.test.ts` SQL-mock block was skipped at Wave-3 and later fixed in phase 007.
- Protected storage files `causal-edges.ts` and `causal-boost.ts` were unchanged in the original phase.
- Git history for this directory includes `131b57f3a8` and `40dcf80052`.

### Files Changed

| File | What changed |
|------|--------------|
| `mcp_server/formatters/search-results.ts` | Trust-badge derivation and result-envelope attachment. |
| `mcp_server/lib/response/profile-formatters.ts` | Response profiles preserve badges. |
| `mcp_server/tests/memory/trust-badges.test.ts` | Badge derivation and explicit payload tests. |
| `mcp_server/tests/response-profile-formatters.vitest.ts` | Profile preservation coverage. |
| `feature_catalog/13--memory-quality-and-indexing/28-memory-causal-trust-display.md` | Catalog entry. |
| `manual_testing_playbook/13--memory-quality-and-indexing/203-memory-causal-trust-display.md` | Manual scenario. |
| `implementation-summary.md` | Placement, delivery and verification record. |

### Follow-Ups

- Original DQI scores remain operator-pending in canonical Wave-3 evidence.
- 008 research later recommended more tests for partial overlay, age boundaries and cache semantics.
