---
title: "Cache: Tool and Embedding Caches"
description: "In-memory tool output cache and SQLite embedding cache for MCP server retrieval paths."
trigger_phrases:
  - "tool cache"
  - "cache TTL"
  - "embedding cache"
---

# Cache: Tool and Embedding Caches

---

## 1. OVERVIEW

`lib/cache/` owns two cache surfaces for MCP server retrieval paths. `tool-cache.ts` caches tool results in memory with TTL, key hashing, invalidation and in-flight request coalescing. `embedding-cache.ts` stores content embeddings in SQLite with content-hash keys and LRU eviction.

Current state:

- Tool cache configuration is read from `ENABLE_TOOL_CACHE`, `TOOL_CACHE_TTL_MS`, `TOOL_CACHE_MAX_ENTRIES` and `TOOL_CACHE_CLEANUP_INTERVAL_MS`.
- Embedding cache rows are keyed by `content_hash`, `model_id` and `dimensions`.
- `cache/scoring/` is a documentation-only re-export namespace. Import scoring code from `lib/scoring/`.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────╮
│ lib/cache/                                   │
│ Runtime cache boundaries                     │
╰──────────────────────────────────────────────╯
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌──────────────────────┐  ┌──────────────────────┐
│ tool-cache.ts        │  │ embedding-cache.ts   │
│ In-memory TTL cache  │  │ SQLite embedding rows│
└──────────┬───────────┘  └──────────┬───────────┘
           │                         │
           ▼                         ▼
┌──────────────────────┐  ┌──────────────────────┐
│ MCP tool handlers    │  │ Embedding providers  │
│ withCache callers    │  │ Content hash callers │
└──────────────────────┘  └──────────────────────┘
```

---

## 3. DIRECTORY TREE

```text
cache/
├── embedding-cache.ts        # SQLite embedding cache helpers
├── scoring/
│   └── README.md             # Scoring namespace note
├── tool-cache.ts             # In-memory tool result cache
└── README.md                 # Developer orientation
```

---

## 4. KEY FILES

| File | Role |
|---|---|
| `tool-cache.ts` | Owns cache keys, TTL storage, invalidation, in-flight coalescing, stats and lifecycle |
| `embedding-cache.ts` | Owns the `embedding_cache` table, lookup, store, eviction, stats and content hashing |
| `scoring/README.md` | Points readers to `lib/scoring/` for scoring imports |

Imports used by this folder:

| Import | Used By | Purpose |
|---|---|---|
| `crypto` | `tool-cache.ts` | SHA-256 cache key generation |
| `crypto` `createHash` | `embedding-cache.ts` | SHA-256 content hashing |
| `better-sqlite3` | `embedding-cache.ts` | SQLite table access |

---

## 5. BOUNDARIES AND FLOW

Allowed imports:

- Tool handlers may import `withCache`, invalidation helpers, stats and lifecycle functions from `tool-cache.ts`.
- Embedding callers may import SQLite cache helpers from `embedding-cache.ts`.

Disallowed ownership:

- Cache modules do not own retrieval scoring or search logic.
- Cache modules do not decide whether memory rows are valid. They only store reusable results.

Tool cache flow:

```text
Caller invokes withCache
          │
          ▼
Generate SHA-256 key from tool and args
          │
          ▼
Return cached value, await in-flight work or run callback
          │
          ▼
Store result when generation is still current
          │
          ▼
Expose stats and invalidation hooks
```

Embedding cache flow:

```text
Caller computes or receives content
          │
          ▼
Compute content hash
          │
          ▼
Lookup by content hash, model ID and dimensions
          │
          ▼
Return cached buffer or store new embedding
```

---

## 6. ENTRYPOINTS

Tool cache imports:

```typescript
import {
  clear,
  generateCacheKey,
  getStats,
  invalidateByTool,
  invalidateOnWrite,
  withCache,
} from './tool-cache.js'
```

Embedding cache imports:

```typescript
import {
  computeContentHash,
  deleteByContentHash,
  getCacheStats,
  initEmbeddingCache,
  lookupEmbedding,
  storeEmbedding,
} from './embedding-cache.js'
```

Public surfaces:

| File | Export Groups |
|---|---|
| `tool-cache.ts` | `get`, `set`, `has`, `del`, key generation, invalidation, `withCache`, cleanup, stats, config and lifecycle exports |
| `tool-cache.ts` | `CONFIG` alias for `TOOL_CACHE_CONFIG` |
| `embedding-cache.ts` | Table setup, lookup, store, eviction, stats, clear, delete-by-content-hash and content hashing |
| `embedding-cache.ts` | `EmbeddingCacheEntry`, `EmbeddingCacheStats`, `EmbeddingCacheHitStats` types |

---

## 7. VALIDATION

Run from the repository root after editing this README:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/mcp_server/lib/cache/README.md
```

Use package TypeScript checks when changing `tool-cache.ts` or `embedding-cache.ts`.

---

## 8. RELATED

| Resource | Relationship |
|---|---|
| `../README.md` | Parent library map |
| `../response/README.md` | Response payload consumers |
| `../scoring/README.md` | Scoring source modules |
| `../storage/README.md` | Database context for embedding cache callers |
