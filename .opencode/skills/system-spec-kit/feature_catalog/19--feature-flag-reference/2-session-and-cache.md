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

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `DISABLE_SESSION_DEDUP` | `false` | boolean | `lib/session/session-manager.ts` | When `'true'`, disables cross-turn session deduplication entirely. All memories are returned on every call regardless of whether they were already sent in this session. |
| `ENABLE_BM25` | `true` | boolean | `lib/search/bm25-index.ts` | Controls the in-memory BM25 search channel. When disabled (set to `'false'`), the BM25 channel is excluded from multi-channel retrieval. The FTS5 SQLite channel is unaffected. When enabled, the in-memory engine can be selected by `SPECKIT_BM25_ENGINE` and uses the same field-priority intent as FTS5. |
| `ENABLE_TOOL_CACHE` | `true` | boolean | `lib/cache/tool-cache.ts` | Master switch for the tool result cache. When disabled (set to `'false'`), all cache reads return `null` and writes are no-ops. Cache is always bypassed when this is off. |
| `SESSION_DEDUP_DB_UNAVAILABLE_MODE` | `'block'` | string | `lib/session/session-manager.ts` | Behavior when the session database is unavailable. `'allow'` permits all memories through (no dedup). `'block'` (default) rejects dedup attempts, returning an error rather than silently allowing duplicates. |
| `SESSION_MAX_ENTRIES` | `100` | number | `lib/session/session-manager.ts` | Maximum number of memory entries tracked per session for deduplication purposes. When entries exceed this cap, the oldest entries are evicted via LRU deletion (`enforceEntryLimit`). |
| `SESSION_TTL_MINUTES` | `30` | number | `lib/session/session-manager.ts` | How long session deduplication records are retained after last use, in minutes. Sessions older than this are cleaned up on the next periodic maintenance pass. |
| `SPECKIT_BM25_ENGINE` | `auto` | enum | `lib/search/bm25-index.ts` | Selects the BM25 engine: `auto`, `sqlite`, `packed-inmemory`, or `legacy-inmemory`. `auto` selects the packed in-memory fallback when an in-memory fallback is needed; `legacy-inmemory` remains a rollback/comparison path. |
| BM25F field weights | `title=10`, `trigger_phrases=5`, `content_generic=2`, `body=1` | runtime constants | `lib/search/bm25-index.ts`, `lib/storage/ports/lexical-search.ts` | Packed in-memory BM25 stores per-field term frequencies in typed-array postings and applies query-time BM25F weights, so callers can override field weights without rebuilding the index. |
| `STALE_CLEANUP_INTERVAL_MS` | `3600000` | number | `lib/session/session-manager.ts` | Interval in milliseconds between stale session cleanup sweeps. Default is 1 hour (3,600,000 ms). Stale sessions are those whose last activity exceeds `STALE_SESSION_THRESHOLD_MS`. |
| `STALE_SESSION_THRESHOLD_MS` | `86400000` | number | `lib/session/session-manager.ts` | Age in milliseconds at which a session is considered stale and eligible for cleanup. Default is 24 hours (86,400,000 ms). |
| `TOOL_CACHE_CLEANUP_INTERVAL_MS` | `30000` | number | `lib/cache/tool-cache.ts` | Interval in milliseconds between expired-entry eviction sweeps of the tool cache. Default is 30 seconds (30,000 ms). The interval timer is unrefed so it does not prevent process exit. |
| `TOOL_CACHE_MAX_ENTRIES` | `1000` | number | `lib/cache/tool-cache.ts` | Maximum number of entries the tool cache holds before evicting the oldest entry on insert. Eviction is O(1) using insertion-order iteration over the underlying Map. |
| `TOOL_CACHE_TTL_MS` | `60000` | number | `lib/cache/tool-cache.ts` | Default time-to-live in milliseconds for tool cache entries. After this duration, entries are treated as expired and evicted on next access or cleanup sweep. Default is 60 seconds (60,000 ms). |

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
- Feature file path: `19--feature-flag-reference/2-session-and-cache.md`
Related references:
- [1-search-pipeline-features-speckit.md](1-search-pipeline-features-speckit.md) — Search Pipeline Features (SPECKIT_*)
- [3-mcp-configuration.md](3-mcp-configuration.md) — 3. MCP Configuration
