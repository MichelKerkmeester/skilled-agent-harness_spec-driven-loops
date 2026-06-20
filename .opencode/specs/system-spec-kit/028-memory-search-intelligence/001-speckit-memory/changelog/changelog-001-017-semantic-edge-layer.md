---
title: "Changelog: Semantic Edge Layer [001-speckit-memory/017-semantic-edge-layer]"
description: "Chronological changelog for the semantic edge layer phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/017-semantic-edge-layer` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

This phase shipped the semantic-edge substrate and a shadow retrieval primitive behind default-off flags. The v41 migration adds fact text and a dedicated edge-relationship vector store, edge embedding is wired into the consolidation cycle and the synchronous insert path stays unchanged. The dedup-merge and invalidation-discovery consumers stay pending behind benchmark and safety gates. Commit `5308401d95` carried the lib code with focused tests.

### Added

- Added the v41 semantic-edge migration in `lib/search/vector-index-schema.ts` with backfill and rollback.
- Added the dedicated edge vector store in `lib/storage/edge-vector-store.ts` and the nearest-edge retrieval primitive in `lib/graph/edge-semantic-retrieval.ts`.
- Added the flag-gated edge-embedding hook in `lib/storage/consolidation.ts` and passive `fact_text` write support in `lib/storage/causal-edges.ts`.
- Added the default-off `SPECKIT_SEMANTIC_EDGE_LAYER` flag plus four consumer flags.

### Changed

- Scoped the semantic edge layer to consolidation-time substrate work.
- Kept exact-key edge upsert and synchronous insert behavior unchanged.
- Shipped default-off consumer flags for retrieval, dedup and invalidation experiments.

### Fixed

_No fixes recorded._

### Verification

- Strict phase validation: PASS.
- Semantic-edge tests: PASS via `tests/semantic-edge-layer.vitest.ts` covering passive insert, store and retrieval, flag isolation and the consolidation embedder and failure paths.
- Semantic recall benchmarks remain pending.

### Files Changed

- `lib/search/vector-index-schema.ts`: v41 semantic-edge migration, backfill and rollback.
- `lib/storage/edge-vector-store.ts`: dedicated edge-relationship vector collection and nearest-edge lookup.
- `lib/graph/edge-semantic-retrieval.ts`: nearest-edge lookup and edge-aware-triplet scorer.
- `lib/storage/consolidation.ts`: flag-gated edge-embedding hook in the consolidation cycle.
- `lib/storage/causal-edges.ts`: passive `fact_text` write support, exact-key upsert unchanged.
- `lib/search/search-flags.ts`: default-off `SPECKIT_SEMANTIC_EDGE_LAYER` plus four consumer flags.
- `tests/semantic-edge-layer.vitest.ts`: passive insert, store and retrieval, flag isolation and consolidation coverage.

### Follow-Ups

- Build the additive schema and edge vector store before any consumer.
- Prove false-merge safety and recall lift after the reindex gate.
- Keep synchronous insert behavior unchanged.
