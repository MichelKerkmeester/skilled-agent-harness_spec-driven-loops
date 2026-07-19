---
title: "Graph channel ID fix"
description: "Tracks the fix for the graph search channel that had a 0% hit rate due to string-vs-numeric ID comparison mismatches."
trigger_phrases:
  - "graph channel id fix"
  - "graph search channel"
  - "fix graph hit rate"
  - "string vs numeric id mismatch"
  - "graph channel zero hit rate"
version: 3.6.0.15
---

# Graph channel ID fix

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Tracks the fix for the graph search channel that had a 0% hit rate due to string-vs-numeric ID comparison mismatches.

One of the search channels that was supposed to find related memories through their connections was completely broken because of a simple label mismatch. It was comparing apples to oranges internally, so it never found anything. The fix corrected the labels so that channel now works as intended and actually contributes useful results.

---

## 2. HOW IT WORKS

The graph search channel had a 0% hit rate in production. Zero. The system was designed as a multi-channel retrieval engine, but the graph channel contributed nothing because `graph-search-fn.ts` compared string-formatted IDs (`mem:${edgeId}`) against numeric memory IDs at two separate locations.

Both comparison points now extract numeric IDs, and the graph channel returns results for queries where causal edge relationships exist. The `mem:` prefix pattern has been fully removed from `graph-search-fn.ts` (verified: no occurrences remain in the file). This was the single highest-impact bug in the system because it meant an entire retrieval signal was dead on arrival.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp-server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp-server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
| `mcp-server/lib/search/bm25-index.ts` | Lib | BM25 index management |
| `mcp-server/lib/search/graph-flags.ts` | Lib | Graph feature flags |
| `mcp-server/lib/search/graph-search-fn.ts` | Lib | Graph degree scoring |
| `mcp-server/lib/search/search-types.ts` | Lib | Search type definitions |
| `mcp-server/lib/search/spec-folder-hierarchy.ts` | Lib | Spec folder hierarchy traversal |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/bm25-index.vitest.ts` | Automated test | BM25 index operations |
| `mcp-server/tests/content-normalizer.vitest.ts` | Automated test | Content normalization tests |
| `mcp-server/tests/graph-flags.vitest.ts` | Automated test | Graph flag behavior |
| `mcp-server/tests/graph-search-fn.vitest.ts` | Automated test | Graph search function tests |
| `mcp-server/tests/rollout-policy.vitest.ts` | Automated test | Rollout policy tests |
| `mcp-server/tests/spec-folder-hierarchy.vitest.ts` | Automated test | Folder hierarchy tests |

---

## 4. SOURCE METADATA
- Group: Bug Fixes And Data Integrity
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `bug-fixes-and-data-integrity/graph-channel-id-fix.md`
Related references:
- [chunk-collapse-deduplication.md](../../feature-catalog/bug-fixes-and-data-integrity/chunk-collapse-deduplication.md) — Chunk collapse deduplication
