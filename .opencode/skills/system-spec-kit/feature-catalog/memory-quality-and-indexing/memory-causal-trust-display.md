---
title: "Memory causal trust display"
description: "Display-only trust badges add confidence, extraction age, last access age, orphan status, and weight-history change state to each result envelope without changing causal storage."
trigger_phrases:
  - "memory causal trust display"
  - "trustBadges"
  - "MemoryResultEnvelope trust badges"
  - "causal lineage confidence display"
  - "trust badge on search results"
version: 3.6.0.5
---

# Memory causal trust display

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Memory causal trust display adds additive `trustBadges` to each `MemoryResultEnvelope` result. The badges summarize existing causal-lineage signals already present in Public storage: confidence from edge `strength`, freshness from `extracted_at`, access recency from `last_accessed`, orphan status from inbound-edge absence, and weight-history change state from the existing `weight_history` log.

This is presentation only. It does not change the `causal_edges` schema, relation vocabulary, traversal decay logic, or Memory's owner boundary. The feature exists so callers can judge whether a causal claim looks fresh and well-supported without turning Memory into a duplicate code index.

---

## 2. HOW IT WORKS

`formatSearchResults()` in `mcp-server/formatters/search-results.ts` now attaches `trustBadges` to each formatted result. The formatter batch-reads connected causal-edge data at response time, fails open when the database handle or history table is unavailable, and preserves any precomputed `trustBadges` payload a caller already supplied. The returned shape is additive:

- `confidence`: clamped from the strongest connected edge `strength`
- `extractionAge`: human-readable age from the newest connected `extracted_at`
- `lastAccessAge`: human-readable age from the newest connected `last_accessed`
- `orphan`: `true` when the result has no incoming causal edges
- `weightHistoryChanged`: `true` when any connected edge has a `weight_history` row

The placement decision is per-result, not top-level. `memory_search` shows the badges directly on each result envelope, and response-profile formatting preserves them on `results[]` and `topResult` without inventing a separate status surface.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp-server/formatters/search-results.ts` | Formatter | Defines `MemoryTrustBadges`, batch-derives trust metadata from existing causal-edge tables, and attaches additive `trustBadges` to each `MemoryResultEnvelope` |
| `mcp-server/lib/response/profile-formatters.ts` | Response | Extends response-profile result typing so `quick`, `research`, and `resume` outputs preserve `trustBadges` |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/memory/trust-badges.test.ts` | Automated test | Badge derivation, age rendering, orphan detection, explicit-badge preservation |
| `mcp-server/tests/response-profile-formatters.vitest.ts` | Automated test | Response-profile preservation for `trustBadges` |

---

## 4. SOURCE METADATA
- Group: Memory Quality And Indexing
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `memory-quality-and-indexing/memory-causal-trust-display.md`
Related references:
- [canonical-continuity-save-substrate.md](../../feature-catalog/memory-quality-and-indexing/canonical-continuity-save-substrate.md) — Canonical continuity save substrate
- [vec-memories-knn-and-factory-shard-fallback.md](../../feature-catalog/memory-quality-and-indexing/vec-memories-knn-and-factory-shard-fallback.md) — vec_memories KNN dual-write and factory shard fallback
