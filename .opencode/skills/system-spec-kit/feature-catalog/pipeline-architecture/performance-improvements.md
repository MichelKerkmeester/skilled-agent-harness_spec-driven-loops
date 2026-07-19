---
title: "Performance improvements"
description: "Sixteen performance improvements reduce runtime cost across TF-IDF scoring, fallback fusion, token budgeting, mutation ledger scanning, entity linking and hierarchy caching."
trigger_phrases:
  - "performance improvements"
  - "TF-IDF scoring optimization"
  - "token budgeting efficiency"
  - "mutation ledger scan cost"
  - "reduce pipeline runtime cost"
version: 3.6.0.16
---

# Performance improvements

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Sixteen performance improvements reduce runtime cost across TF-IDF scoring, fallback fusion, token budgeting, mutation ledger scanning, entity linking and hierarchy caching.

Sixteen small speed improvements were made across the system. Some replaced slow scanning operations with faster lookups. Others fixed places where the same question was asked many times when once would do. The result is a system that responds more quickly, especially as the amount of stored data grows. Think of it as replacing a hand-cranked search with a power tool.

---

## 2. HOW IT WORKS

### Core Behavior

Sixteen performance improvements were applied:

**Quick wins:** `Math.max(...spread)` replaced with `reduce`-based max in `tfidf-summarizer.ts` (prevents RangeError on large arrays). Unbounded query in `memory-summaries.ts` gained a `LIMIT` clause. O(n) full scan in `mutation-ledger.ts` replaced with SQL `COUNT(*)` query using `json_extract`.

**Entity linker:** `mergedEntities` array lookups converted to `Set` for O(1) `.has()` checks. N+1 `getEdgeCount` queries replaced with a single batch query that combines `source_id IN (...)` and `target_id IN (...)` branches via `UNION ALL` before aggregation.

**SQL-level:** Causal edge upsert keeps explicit row lookup before and after UPSERT so weight-history logging and canonical row-id resolution stay deterministic. Round-trip reduction via `last_insert_rowid()` has not been applied in the current implementation. Spec folder hierarchy tree is cached with a 60-second WeakMap TTL keyed by database instance.

### Pipeline Architecture

**Fallback pipeline split (T310):** Tiered fallback now separates fused candidate collection from post-fusion enrichment. `executeFallbackPlan()` gathers per-tier fused result sets first, then `searchWithFallbackTiered()` merges the selected tier outputs before `enrichFusedResults()` runs once. This removes repeated reranking, co-activation, folder scoring, and token-budget work from intermediate fallback tiers.

**Token estimation cache (T311):** `truncateToBudget()` caches per-result token estimates in a `Map` keyed by canonical `result.id`, so repeated passes over the same merged set do not re-estimate identical rows. `estimateResultTokens()` also replaced `JSON.stringify`-style whole-object sizing with direct field-aware character counting, reducing allocation overhead while staying aligned to the returned payload shape.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp-server/lib/search/hybrid-search.ts` | Lib | Tiered fallback split, single-pass enrichment, and cached token-budget estimation |
| `mcp-server/lib/search/tfidf-summarizer.ts` | Lib | Reduce-based max scoring for large-summary safety |
| `mcp-server/lib/search/memory-summaries.ts` | Lib | Summary query LIMIT and summary-channel operations |
| `mcp-server/lib/storage/mutation-ledger.ts` | Lib | COUNT/json_extract SQL path replacing O(n) scans |
| `mcp-server/lib/search/entity-linker.ts` | Lib | Set-based entity checks and batched edge counting |
| `mcp-server/lib/storage/causal-edges.ts` | Lib | Transactional upsert with deterministic pre/post lookup for weight-history logging |
| `mcp-server/lib/search/spec-folder-hierarchy.ts` | Lib | WeakMap + TTL caching for folder hierarchy tree |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/hybrid-search.vitest.ts` | Automated test | Tiered fallback and token-budget pipeline behavior |
| `mcp-server/tests/memory-summaries.vitest.ts` | Automated test | TF-IDF summary generation and summary query behavior |
| `mcp-server/tests/mutation-ledger.vitest.ts` | Automated test | Mutation ledger counting/query performance guards |
| `mcp-server/tests/entity-linker.vitest.ts` | Automated test | Entity linker batch edge-count logic coverage |
| `mcp-server/tests/causal-edges-unit.vitest.ts` | Automated test | Causal edge upsert/update unit behavior |
| `mcp-server/tests/causal-edges.vitest.ts` | Automated test | Causal edge storage integration paths |
| `mcp-server/tests/spec-folder-hierarchy.vitest.ts` | Automated test | Hierarchy cache/TTL behavior and traversal checks |

---

## 4. SOURCE METADATA
- Group: Pipeline Architecture
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `pipeline-architecture/performance-improvements.md`
Related references:
- [search-pipeline-safety.md](../../feature-catalog/pipeline-architecture/search-pipeline-safety.md) — Search pipeline safety
- [legacy-v1-pipeline-removal.md](../../feature-catalog/pipeline-architecture/legacy-v1-pipeline-removal.md) — Legacy V1 pipeline removal
