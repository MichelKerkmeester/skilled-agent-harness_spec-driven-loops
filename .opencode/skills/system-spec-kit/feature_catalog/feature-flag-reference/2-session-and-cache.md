---
title: "2. Session and Cache"
description: "This document captures the implemented behavior, source references, and validation scope for 2. Session and Cache."
trigger_phrases:
  - "session and cache"
  - "session deduplication"
  - "tool cache settings"
  - "session ttl configuration"
version: 3.6.0.14
---

# 2. Session and Cache

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for 2. Session and Cache.

These settings control short-term memory and caching behavior. They decide how long the system remembers what it already returned, how cache entries expire, and whether duplicate results are filtered across a session.

---

## 2. HOW IT WORKS

> This category no longer enumerates flags — the authoritative, always-current list lives in
> [`ENV_REFERENCE.md` → Feature Flags Reference Table](../../mcp_server/ENV_REFERENCE.md#feature-flags-reference-table).
> Duplicating it here caused drift (survivor flags went missing); the catalog now points to the single source.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `mcp_server/lib/search/bm25-index.ts` | BM25 enablement, engine selection, packed typed-array postings, and BM25F field weights |
| `mcp_server/lib/storage/ports/lexical-search.ts` | `LexicalSearch` adapter over the selectable in-memory BM25 engine |
| `mcp_server/lib/eval/bm25-baseline.ts` | Legacy, packed, and FTS5 baseline comparison helper |
| `mcp_server/lib/eval/fixtures/bm25-packed-fixture.ts` | Fixture corpus and relevance data for packed-BM25 budget/baseline checks |

### Validation And Tests

| File | Role |
|---|---|
| `mcp_server/tests/bm25-packed-inmemory.vitest.ts` | Packed engine budget, BM25F, engine-toggle, and baseline parity coverage |
| `mcp_server/tests/bm25-baseline.vitest.ts` | BM25-only baseline evaluation |

---

## 4. SOURCE METADATA
- Group: Feature Flag Reference
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `feature-flag-reference/2-session-and-cache.md`
Related references:
- [1-search-pipeline-features-speckit.md](1-search-pipeline-features-speckit.md) — Search Pipeline Features (SPECKIT_*)
- [3-mcp-configuration.md](3-mcp-configuration.md) — 3. MCP Configuration
