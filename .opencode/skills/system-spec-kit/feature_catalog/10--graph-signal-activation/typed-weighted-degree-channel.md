---
title: "Typed-weighted degree channel"
description: "Describes the fifth RRF channel that scores memories by graph connectivity using typed edge weights, logarithmic normalization and hub caps to prevent connection-count dominance."
trigger_phrases:
  - "typed-weighted degree channel"
  - "SPECKIT_DEGREE_BOOST"
  - "degree boosting"
  - "typed edge weights graph scoring"
  - "hub cap connection-count dominance"
---

# Typed-weighted degree channel

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Describes the fifth RRF channel that scores memories by graph connectivity using typed edge weights, logarithmic normalization and hub caps to prevent connection-count dominance.

This gives a search bonus to memories that are well-connected to other memories, like how a person who knows many people in a community is often a good source of information. Different types of connections count for different amounts, and there is a cap to prevent any single well-connected memory from dominating all search results just because it links to everything.

---

## 2. HOW IT WORKS

A fifth RRF channel scores memories by their graph connectivity. Edge type weights range from caused at 1.0 down to supports at 0.5, with logarithmic normalization and a hub cap (`DEFAULT_MAX_TYPED_DEGREE=15`, `MAX_TOTAL_DEGREE=50`, `DEGREE_BOOST_CAP=0.15`) to prevent any single memory from dominating results through connections alone.

Constitutional memories are excluded from degree boosting because they already receive top-tier visibility. The channel runs behind the `SPECKIT_DEGREE_BOOST` feature flag with a degree cache that invalidates only on graph mutations, not per query. That cache is now scoped per database instance via `WeakMap<Database.Database, Map<string, number>>`, with `getDegreeCacheForDb(database)` for lookup and `clearDegreeCacheForDb(database)` for explicit invalidation, so scores from one DB can no longer leak into another.

Cold-cache degree scoring now computes uncached candidate nodes in one batched SQL round-trip instead of one query per node. The query restricts edge scanning with `WHERE source_id IN (...) OR target_id IN (...)`, groups by candidate `node_id`, and caches the resolved global max typed degree alongside per-node boost values. This removes the prior N+1 query shape on cold cache while keeping repeat lookups in-memory until graph mutations invalidate the cache. When a spec-doc record has zero edges, the channel returns 0 rather than failing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
| `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
| `mcp_server/lib/search/bm25-index.ts` | Lib | BM25 index management |
| `mcp_server/lib/search/search-flags.ts` | Lib | Feature flag accessor for `SPECKIT_DEGREE_BOOST` |
| `mcp_server/lib/search/graph-search-fn.ts` | Lib | Graph degree scoring |
| `mcp_server/lib/search/search-types.ts` | Lib | Search type definitions |
| `mcp_server/lib/search/spec-folder-hierarchy.ts` | Lib | Spec folder hierarchy traversal |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/bm25-index.vitest.ts` | Automated test | BM25 index operations |
| `mcp_server/tests/content-normalizer.vitest.ts` | Automated test | Content normalization tests |
| `mcp_server/tests/degree-computation.vitest.ts` | Automated test | Degree computation tests |
| `mcp_server/tests/search-flags.vitest.ts` | Automated test | Search flag behavior, including graph-related toggles |
| `mcp_server/tests/graph-scoring-integration.vitest.ts` | Automated test | Graph scoring integration |
| `mcp_server/tests/graph-search-fn.vitest.ts` | Automated test | Graph search function tests |
| `mcp_server/tests/rollout-policy.vitest.ts` | Automated test | Rollout policy tests |
| `mcp_server/tests/rrf-degree-channel.vitest.ts` | Automated test | Degree channel integration |
| `mcp_server/tests/spec-folder-hierarchy.vitest.ts` | Automated test | Folder hierarchy tests |

---

## 4. SOURCE METADATA
- Group: Graph Signal Activation
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `10--graph-signal-activation/typed-weighted-degree-channel.md`
Related references:
- [co-activation-boost-strength-increase.md](co-activation-boost-strength-increase.md) — Co-activation boost strength increase
