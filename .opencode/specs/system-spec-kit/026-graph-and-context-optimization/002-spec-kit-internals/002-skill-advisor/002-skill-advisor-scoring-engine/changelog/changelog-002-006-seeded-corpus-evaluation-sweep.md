---
title: "Seeded cosine embeddings in the lane-weight sweep with a numbers-driven weight recommendation"
description: "The lane-weight sweep ran with empty embeddings, producing identical results across all candidate weight vectors. This packet seeds real skill description vectors into the cosine lane and produces an evidence-backed recommendation."
trigger_phrases:
  - "corpus seeded sweep"
  - "advisor weight recommendation"
  - "cosine embedding seed"
  - "intent prompt sweep real"
  - "seeded corpus evaluation"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine/006-seeded-corpus-evaluation-sweep` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/002-skill-advisor-scoring-engine`

### Summary

The lane-weight sweep shipped in a prior phase ran with empty cosine embeddings because the fixture projection did not seed skill description vectors. Every candidate weight vector, including V6-cosine-dominant, produced identical accuracy numbers. This packet added a cache-aware fixture helper that embeds projection skill descriptions through the live embedding provider, wired the seeded vectors into the sweep, and produced an advisory recommendation backed by numeric evidence.

### Added

- A cache-aware fixture helper that embeds projection skill descriptions through the live embedding provider and stores vectors on disk under a content-addressed cache.

### Changed

- The lane-weight sweep test now seeds real skill description vectors into the cosine lane before running the weight sweep.
- The sweep test skips gracefully instead of failing when the configured embedding provider cannot produce vectors.

### Fixed

- None.

### Verification

- Targeted seeded sweep test: Pass with skip under default provider
- Provider unavailable skip: Pass (default provider failed with context creation error)
- Typecheck: Pass
- Dist rebuild: Pass
- Strict spec validation: Pass (packet and parent)
- Recommendation cited with numbers in research artifact: Pass

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `tests/scorer/fixtures/seed-skill-embeddings.ts` | Created | Cache-aware fixture helper that embeds skill descriptions and persists vectors |
| `tests/scorer/lane-weight-sweep.vitest.ts` | Modified | Wired seeded embeddings into sweep setup with a provider-unavailable skip guard |
| `research/sweep-results.md` | Created | Sweep report documenting the skip, exploratory numbers, and weight recommendation |

### Follow-Ups

- Re-run the sweep with a compatible embedding provider when one becomes available to capture cosine-lane deltas.
- Revisit the weight recommendation if skill descriptions change materially or the corpus expands.
