---
title: "Search: Memory Retrieval Package"
description: "Code-folder guide for hybrid memory search, vector storage, lexical retrieval, graph signals, reranking, and query routing."
trigger_phrases:
  - "search subsystem"
  - "hybrid search"
  - "vector index"
  - "memory search pipeline"
  - "RRF fusion"
---

# Search: Memory Retrieval Package

> Hybrid memory search package for vector storage, lexical retrieval, graph signals, reranking, and query routing.

---

## 1. OVERVIEW

`lib/search/` owns memory retrieval for the MCP server. It turns a plain-language query into ranked spec-doc records using vector search, lexical search, graph signals, query routing, scoring, optional reranking, and response metadata.

Current state:

- `hybrid-search.ts` coordinates the main retrieval path.
- `pipeline/` splits search into candidate generation, fusion, enrichment, rerank, and final filtering stages.
- `vector-index*.ts` files own SQLite vector schema, queries, mutations, aliases, and storage helpers.
- `bm25-index.ts` and `sqlite-fts.ts` provide lexical retrieval.
- `graph-search-fn.ts`, `causal-boost.ts`, and graph signal helpers add relationship-aware scoring.
- Query helpers classify intent, route by complexity, expand queries, decompose complex input, and build recovery payloads.

This folder is a domain package. It does not expose MCP tools directly. Handlers call into it through stable exports and receive ranked results, diagnostics, and metadata.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                       SEARCH PACKAGE                             │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌──────────────────┐      ┌─────────────────┐
│ handlers/    │ ───▶ │ hybrid-search.ts │ ───▶ │ pipeline/       │
│ memory tools │      │ orchestration    │      │ staged ranking  │
└──────┬───────┘      └────────┬─────────┘      └────────┬────────┘
       │                       │                         │
       │                       ▼                         ▼
       │              ┌──────────────────┐      ┌─────────────────┐
       └───────────▶  │ query helpers    │      │ vector + lexical│
                      │ intent + routing │      │ retrieval       │
                      └────────┬─────────┘      └────────┬────────┘
                               │                         │
                               ▼                         ▼
                      ┌──────────────────┐      ┌─────────────────┐
                      │ graph signals    │ ───▶ │ rerank + filter │
                      │ causal context   │      │ final payload   │
                      └──────────────────┘      └─────────────────┘

Dependency direction:
handlers ───▶ hybrid-search.ts ───▶ pipeline and retrieval modules
pipeline ───▶ vector, lexical, graph, scoring, and metadata helpers
retrieval helpers ───▶ shared types and database adapters
```

---

## 3. PACKAGE TOPOLOGY

```text
lib/search/
+-- hybrid-search.ts          # Main retrieval orchestration
+-- pipeline/                 # Stage-based candidate, score, rerank, and filter flow
+-- vector-index.ts           # Public vector index facade
+-- vector-index-*.ts         # Schema, query, mutation, store, type, and alias modules
+-- bm25-index.ts             # Pure TypeScript BM25 retrieval
+-- sqlite-fts.ts             # SQLite FTS5 lexical retrieval
+-- graph-search-fn.ts        # Graph and degree retrieval channel
+-- causal-boost.ts           # Causal-neighbor score adjustment
+-- intent-classifier.ts      # Query intent detection
+-- query-*.ts                # Query classification, routing, expansion, decomposition, and surrogates
+-- *feedback*.ts             # Learned feedback and denylist support
+-- *metadata*.ts             # Anchor and validation metadata helpers
+-- pipeline/stage3-rerank.ts # Algorithmic MMR diversity and MPAB chunk-collapse; model rerankers removed
+-- session-*.ts              # Per-session search context and transitions
`-- README.md
```

Allowed dependency direction:

```text
hybrid-search.ts → pipeline/ and retrieval helpers
pipeline/ → vector-index, BM25, FTS, graph, scoring, metadata helpers
vector-index.ts → vector-index-types/schema/queries/mutations/store/aliases
query helpers → shared search types and local utilities
```

Disallowed dependency direction:

```text
lib/search/ → handlers/
vector-index-* → pipeline orchestration when a smaller helper import is enough
graph scoring helpers → MCP transport modules
tests or fixtures → production modules through private build output
```

---

## 4. DIRECTORY TREE

```text
lib/search/
+-- pipeline/
|   +-- orchestrator.ts       # Stage runner for search pipeline execution
|   +-- stage1-candidate-gen.ts
|   +-- stage2-fusion.ts
|   +-- stage2b-enrichment.ts
|   +-- stage3-rerank.ts
|   +-- stage4-filter.ts
|   +-- ranking-contract.ts
|   +-- types.ts
|   `-- README.md
+-- vector-index.ts
+-- vector-index-types.ts
+-- vector-index-schema.ts
+-- vector-index-queries.ts
+-- vector-index-mutations.ts
+-- vector-index-store.ts
+-- vector-index-aliases.ts
+-- vector-index-impl.ts
+-- hybrid-search.ts
+-- bm25-index.ts
+-- sqlite-fts.ts
+-- graph-search-fn.ts
+-- entity-density.ts        # Cached entity-density signal for graph-preservation gate (60s TTL)
+-- intent-classifier.ts
+-- query-router.ts          # Hybrid routing + shouldPreserveBm25/Graph overrides
+-- routing-telemetry.ts     # Rolling 200-decision invocation window
+-- query-classifier.ts
+-- query-expander.ts
+-- query-decomposer.ts
+-- search-types.ts
+-- search-utils.ts
`-- README.md
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `hybrid-search.ts` | Coordinates multi-channel retrieval and returns ranked search results. |
| `pipeline/orchestrator.ts` | Runs the stage-based search flow. |
| `pipeline/stage1-candidate-gen.ts` | Gathers candidates without final scoring changes. When the embedder is unavailable and query-embedding generation fails, this stage degrades to lexical (BM25/FTS) candidate generation instead of throwing, and reports `embedderAvailable:false`, `vectorSearchSkipped:true`, and a `degradationReason` on the Stage 1 metadata. The embedder-success path is unchanged. |
| `pipeline/stage2-fusion.ts` | Applies fusion and scoring signals. |
| `pipeline/stage2b-enrichment.ts` | Adds enrichment metadata after core fusion. |
| `pipeline/stage3-rerank.ts` | Runs reranking and aggregation when gates allow it. |
| `pipeline/stage4-filter.ts` | Applies final filtering, budgets, and annotations. |
| `vector-index.ts` | Public facade for vector index operations. |
| `vector-index-schema.ts` | Creates and migrates vector index tables. |
| `vector-index-queries.ts` | Reads vector index data and similarity matches. |
| `vector-index-mutations.ts` | Writes, updates, and deletes vector index records. |
| `vector-index-store.ts` | Owns vector index lifecycle and storage helpers. The unclean-shutdown marker (`.unclean-shutdown`) uses present-means-dirty semantics: the close path runs an explicit WAL checkpoint and `db.close()` first, then removes the marker only inside the checkpoint-success guard, so a checkpoint or close that throws leaves the marker in place. |
| `bm25-index.ts` | Provides keyword ranking without external runtime dependencies. |
| `sqlite-fts.ts` | Runs SQLite FTS5 lexical queries when available. |
| `graph-search-fn.ts` | Produces graph and degree-channel candidates. |
| `query-router.ts` | Routes hybrid retrieval; `shouldPreserveBm25` / `shouldPreserveGraph` overrides activate bm25/graph channels for intent-driven and entity-rich queries regardless of complexity tier. Reads `SPECKIT_GRAPH_CHANNEL_PRESERVATION` env flag. |
| `entity-density.ts` | Cached lookup of memory rows with ≥3 outgoing causal edges. `getEntityDensityScore(query, db)` returns the count of query tokens that hit high-fanout rows. 60s TTL; safe to invalidate via `invalidateEntityDensityCache()`. |
| `routing-telemetry.ts` | In-process rolling 200-decision window tracking which channels routed per query. `getSnapshot()` returns per-channel counts and rates including `graphChannelInvocationRate`. |
| `intent-classifier.ts` | Maps query text to task intent. |
| `search-types.ts` | Defines shared search result and option types. |
| `entity-linker.ts` | Creates causal edges between memories that share entities across spec folders, and provides query-time concept routing for graph-channel selection. Gated by `SPECKIT_ENTITY_LINKING`. Its co-occurrence "supports" edges are written at strength 0.05, down-weighted from 0.7 in phase 008, so weak entity co-occurrence no longer drowns real causal edges. |
| `progressive-disclosure.ts` | Replaces hard tail-truncation with a multi-layer response: a quality-distribution summary, snippet previews with detail-available flags, and opaque continuation cursors for pagination. Flag `SPECKIT_PROGRESSIVE_DISCLOSURE`, default on. |
| `auto-promotion.ts` | Adjusts memory importance tier from validation signals: five or more positive validations promote `normal` to `important`, ten or more promote `important` to `critical`, and sustained negative validations step `important`/`critical` down one tier. |
| `retrieval-directives.ts` | Adds a `retrieval_directive` metadata field to constitutional-tier memories, formatted as instruction prefixes ("Always surface when:", "Prioritize when:"). Pure content transformation; ranking and scoring are untouched. |
| `deterministic-extractor.ts` | Rule-based, no-LLM save-time graph enrichment extractors (heading, alias, and relation-phrase links) that emit edges carrying `explicit_only` evidence. |
| `learned-feedback.ts` | Learns terms from user memory selections into a separate `learned_triggers` column (not the FTS5 index), weighted 0.7x with a 30-day TTL and ten safeguards. Flag `SPECKIT_LEARN_FROM_SELECTION`, default on. |

### Graph-Channel Preservation Overrides

`query-router.ts` can preserve graph and BM25 channels even when the complexity tier would otherwise skip them. The graph path is guarded by `SPECKIT_GRAPH_CHANNEL_PRESERVATION`, intent signals, and the cached entity-density score from `entity-density.ts`; entity-rich queries stay eligible for causal graph retrieval because they are more likely to benefit from high-fanout memory rows. `routing-telemetry.ts` records the resulting channel choices in a rolling 200-decision window so maintainers can inspect graph invocation rates through health telemetry. The full design lives in the local implementation notes.

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Public callers | MCP handlers should enter through `hybrid-search.ts`, vector index facades, or named helper exports. |
| Pipeline stages | Stage modules should keep their single responsibility and pass typed rows forward. |
| Vector storage | Schema, query, mutation, and store files keep storage rules separate from ranking. The store close path treats the unclean-shutdown marker as a durability signal: WAL checkpoint and close run before the marker is removed, and removal happens only on the success path so a failed checkpoint or close keeps the dirty marker. |
| Lexical retrieval | BM25 and FTS helpers return candidates, not transport-level responses. |
| Graph signals | Graph helpers score memory relationships and should not call MCP handlers. |
| Session context | Session helpers may affect ranking inputs, but they should not own persistence policy outside search state. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ memory_search or memory_context handler  │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ classify intent and route query           │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ gather vector, lexical, graph candidates  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ fuse scores and add ranking signals       │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ rerank, aggregate, filter, annotate       │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ ranked memory results and diagnostics     │
╰──────────────────────────────────────────╯
```

---

## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `unifiedSearch` | Function | Main hybrid search path used by memory handlers. |
| `init` | Function | Initializes search dependencies for runtime use. |
| `classifyIntent` | Function | Detects task intent before retrieval. |
| `vectorSearch` | Function | Reads vector similarity results from the vector index. |
| `initializeDb` | Function | Creates or opens the search database schema. |
| `pipeline/orchestrator.ts` | Module | Runs staged retrieval when the pipeline path is used. |
| `bm25-index.ts` | Module | Provides direct lexical search helpers. |
| `sqlite-fts.ts` | Module | Provides FTS5-backed lexical helpers. |

---

## 8. VALIDATION

Run package checks from `mcp_server/`.

```bash
npm run build
npm test -- lib/search
```

Focused documentation checks from the repository root:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/mcp_server/lib/search/README.md
python3 .opencode/skills/sk-doc/scripts/extract_structure.py .opencode/skills/system-spec-kit/mcp_server/lib/search/README.md
```

Expected result: build and focused tests exit 0, README validation reports no blocking issues, and structure extraction returns a README document profile.

---

## 9. RELATED

- [`../../README.md`](../../README.md)
- [`pipeline/README.md`](./pipeline/README.md)
- [`../cognitive/README.md`](../cognitive/README.md)
- [`../storage/README.md`](../storage/README.md)
- [`../parsing/README.md`](../parsing/README.md)
- [`../extraction/README.md`](../extraction/README.md)
- [`../../ENV_REFERENCE.md`](../../ENV_REFERENCE.md)
