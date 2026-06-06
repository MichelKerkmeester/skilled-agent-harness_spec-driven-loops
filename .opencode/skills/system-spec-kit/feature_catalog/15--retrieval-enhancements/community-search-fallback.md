---
title: "Community-level search fallback"
description: "searchCommunities() provides topic-level fallback via word overlap scoring against community summaries, surfacing broad topical matches when fine-grained retrieval fails, gated by the SPECKIT_COMMUNITY_SEARCH_FALLBACK flag."
trigger_phrases:
  - "community-level search fallback"
  - "searchCommunities"
  - "SPECKIT_COMMUNITY_SEARCH_FALLBACK"
  - "topic-level memory retrieval"
---

# Community-level search fallback

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`searchCommunities()` provides topic-level fallback via word overlap scoring against community summaries, surfacing broad topical matches when fine-grained retrieval fails. When vector and BM25 channels return weak or empty results, community search offers a coarser but still useful layer of retrieval by matching queries against pre-computed community topic summaries.

---

## 2. HOW IT WORKS

Enabled by default (graduated). Set `SPECKIT_COMMUNITY_SEARCH_FALLBACK=false` to disable.

The `searchCommunities()` function scores the query against community summaries using word overlap. Each community represents a cluster of related memories with a summary describing its topic. The scoring function tokenizes both the query and each community summary, computes overlap, and returns communities ranked by relevance. Results from matching communities are surfaced as fallback candidates when primary retrieval channels produce insufficient results.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/community-search.ts` | Lib | `searchCommunities()` — word overlap scoring against community summaries |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/community-search.vitest.ts` | Automated test | Community search scoring and fallback behavior |

---

## 4. SOURCE METADATA
- Group: Retrieval Enhancements
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `15--retrieval-enhancements/community-search-fallback.md`

- Kill switch: SPECKIT_COMMUNITY_SEARCH_FALLBACK=false
Related references:
- [always-on-graph-context-injection.md](always-on-graph-context-injection.md) — Always-on graph context injection
- [dual-level-retrieval.md](dual-level-retrieval.md) — Dual-level retrieval
