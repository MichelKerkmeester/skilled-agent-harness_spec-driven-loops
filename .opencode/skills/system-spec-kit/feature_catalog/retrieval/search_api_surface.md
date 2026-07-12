---
title: "Search API surface"
description: "Covers the stable public search barrel that re-exports hybrid search, SQLite FTS helpers, and the vector index namespace."
trigger_phrases:
  - "search API surface"
  - "public search barrel"
  - "api/search.ts"
  - "vector index namespace"
  - "hybrid search public API"
version: 3.6.0.10
---
# Search API surface

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW
`mcp_server/api/search.ts` is the stable script-facing entrypoint for retrieval code. It does not implement search itself. Instead, it freezes a supported API boundary so scripts can import search features from one place without reaching into `lib/search/*` internals, which is consistent with the file header comments marking it as the public ARCH-1 surface.

That public surface groups three distinct concerns. First, it exposes hybrid-search initialization and the main enhanced retrieval entrypoint. Second, it exposes the SQLite FTS5 utility functions for direct lexical search and feature detection. Third, it re-exports the entire vector-index facade as a namespace, giving callers access to the underlying schema, mutation, query, cache, and store helpers through one import path. In practice this file is less about new runtime logic and more about controlling which search internals are considered safe to import directly.

---
## 2. HOW IT WORKS
The named exports from `search.ts` are `initHybridSearch`, `hybridSearchEnhanced`, `fts5Bm25Search`, `isFts5Available`, `type HybridSearchOptions`, `type HybridSearchResult`, and `vectorIndex` as a namespace export. `initHybridSearch` is a re-export of `lib/search/hybrid-search.ts:init()`, which stores the active database handle plus optional vector and graph search functions in module-local state for later search calls. `hybridSearchEnhanced` is the async high-level retrieval function from the same module. It routes queries across up to five channels (`vector`, `fts`, `bm25`, `graph`, `degree`), applies adaptive fusion and route-based channel selection, can enforce channel representation and dynamic token budgets, supports reranking and MMR diversification, and falls back gracefully when individual channels fail because channel errors are swallowed as non-fatal inside the orchestrator.

The SQLite lexical surface comes from `lib/search/sqlite-fts.ts`. `fts5Bm25Search(db, query, options)` sanitizes query tokens, quotes each token, joins them with `OR`, optionally scopes to a `specFolder`, excludes archived rows unless `includeArchived=true`, and negates SQLite's native `bm25()` score so callers receive higher-is-better `fts_score` values. When the query sanitizes to nothing it returns `[]`, and when SQLite throws it logs a warning and also returns `[]`. `isFts5Available(db)` does a table existence check against `sqlite_master` for `memory_fts` and returns a boolean feature-detect result.

The `vectorIndex` namespace is not a single function but a large facade re-export from `lib/search/vector-index.ts`. It bundles vector-index types, schema and migration helpers, mutation helpers such as `index_memory`, `update_memory`, and delete variants, query helpers such as `vector_search`, `keyword_search`, stats and integrity functions, cache and alias helpers such as `cached_search`, `record_access`, and `enhanced_search`, plus low-level store lifecycle functions including `initializeDb`, `closeDb`, `getDb`, `getDbPath`, vector-search availability checks, embedding-dimension validation, and related storage utilities. The practical effect is that `api/search.ts` offers a thin but broad compatibility layer: it owns almost no business logic itself, yet it defines the supported search import contract for operational callers.
---
## 3. SOURCE FILES
### Implementation
| File | Layer | Role |
|------|-------|------|
| `mcp_server/api/search.ts` | API | Stable public search barrel for scripts |
| `mcp_server/lib/search/hybrid-search.ts` | Lib | Hybrid-search initialization, orchestration, and exported search types |
| `mcp_server/lib/search/sqlite-fts.ts` | Lib | SQLite FTS5 BM25 helper functions |
| `mcp_server/lib/search/vector-index.ts` | Lib | Namespace facade over vector-index types, schema, mutations, queries, cache, and store exports |

### Validation And Tests
| File | Type | Role |
|---|---|---|
| `mcp_server/tests/api-public-surfaces.vitest.ts` | Automated test | Direct export contract for `api/search.ts` and top-level barrel parity |
| `mcp_server/tests/hybrid-search.vitest.ts` | Automated test | Hybrid-search entrypoint behavior and public search-type stability |
---
## 4. SOURCE METADATA
- Group: Retrieval
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `retrieval/search_api_surface.md`
Related references:
- [session-recovery-spec-kit-resume.md](session_recovery_spec_kit_resume.md) — Session recovery via /speckit:resume
- [session-transition-trace-contract.md](session_transition_trace_contract.md) — Session transition trace contract
