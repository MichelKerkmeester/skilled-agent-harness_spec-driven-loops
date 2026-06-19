---
title: "Changelog: Semantic Edge Layer (semantic-edge-layer / GR-fact-embedding-on-edge) [001-speckit-memory/017-semantic-edge-layer]"
description: "Chronological changelog for the Semantic Edge Layer (semantic-edge-layer / GR-fact-embedding-on-edge) phase."
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

Nothing is built yet. When this packet runs, the causal graph's edges stop being exact-key-blind SQLite rows and start carrying fact text plus a relationship vector, so edges can be retrieved by semantic similarity and inform dedup, invalidation, and ranking. The shape of the build is fixed by one constraint: the memory-ID graph has no episode model and runs no LLM in the synchronous insert path, so the substrate is added at consolidation-time, off the foreground turn, and never touches the synchronous insertEdge txn.

### Added

- No new additions recorded.

### Changed

- Nothing is built yet. When this packet runs, the causal graph's edges stop being exact-key-blind SQLite rows and start carrying fact text plus a relationship vector, so edges can be retrieved by semantic similarity and inform dedup, invalidation, and ranking. The shape of the build is fixed by one constraint: the memory-ID graph has no episode model and runs no LLM in the synchronous insert path, so the substrate is added at consolidation-time, off the foreground turn, and never touches the synchronous insertEdge txn.

### Fixed

- No fixes recorded.

### Verification

- Migration back-compat (flag-off old reads/insert byte-identical) - PENDING
- Flag-off isolation (insert/consolidation/recall/contradiction byte-identical) - PENDING
- Synchronous insertEdge txn + deterministic core untouched - PENDING
- Dedup false-merge benchmark + edge-aware recall lift (post-reindex) - PENDING
- validate.sh --strict on this packet (docs) - PASS (planning docs)

### Files Changed

| File | Action | What changed |
|---|---|---|
| `mcp_server/lib/storage/causal-edges.ts` | Modified (planned) | Additive fact_text column; exact-key upsert (:350-352) unchanged |
| `mcp_server/lib/storage/edge-vector-store.ts` | Created (planned) | Dedicated edge-relationship vector collection + nearest-edge lookup |
| `mcp_server/lib/storage/consolidation.ts` | Modified (planned) | Flag-gated edge-embedding pass in runConsolidationCycle (:499) |
| `mcp_server/lib/graph/edge-semantic-retrieval.ts` | Created (planned) | Nearest-edge lookup + edge-aware-triplet scorer (side primitive) |
| `mcp_server/lib/graph/contradiction-detection.ts` | Modified (planned) | Shadow-gated cross-pair invalidation; same-pair (:85-93) unchanged when off |
| `mcp_server/lib/search/search-flags.ts` | Modified (planned) | SPECKIT_SEMANTIC_EDGE_LAYER + four consumer flags, default-off |
| `mcp_server/__tests__/` | Created (planned) | Migration back-compat, isolation, embedder, false-merge benchmark |

### Follow-Ups

- CHK-001 Requirements documented in spec.md (REQ-001..REQ-008)
- CHK-002 Technical approach defined in plan.md (substrate-first, consolidation-time, shadow-gated, benchmark-post-reindex)
- CHK-003 Dependencies identified: gate-zero corpus reindex (028/001-001), existing vector-store port, no-episode-model constraint
- CHK-004 Confirmed seams re-verified: exact-key upsert (causal-edges.ts:350-352), same-pair contradiction (contradiction-detection.ts:85-93), consolidation entry (consolidation.ts:499), 0 vector hits in causal-edges.ts
- CHK-010 tsc/build green; new store + retrieval modules + migration lint clean; node --check passes
- CHK-011 No console errors or warnings from the consolidation embedding pass
