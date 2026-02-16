---
title: "Search Subsystem"
description: "Multi-modal hybrid search architecture combining vector, lexical (BM25/FTS5) and graph-based retrieval with Reciprocal Rank Fusion (RRF)."
trigger_phrases:
  - "search subsystem"
  - "hybrid search"
  - "vector search"
importance_tier: "normal"
---

# Search Subsystem

> Multi-modal hybrid search architecture combining vector and lexical (BM25/FTS5) retrieval alongside graph-based discovery, fused with Reciprocal Rank Fusion (RRF).

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🧩 KEY CONCEPTS]](#2--key-concepts)
- [3. 📁 MODULE STRUCTURE]](#3--module-structure)
- [4. ⚡ FEATURES](#4--features)
- [5. 💡 USAGE EXAMPLES](#5--usage-examples)
- [6. 🔗 RELATED RESOURCES](#6--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

## 1. 📖 OVERVIEW
<!-- ANCHOR:overview -->

The search subsystem provides production-grade hybrid search capabilities with multiple retrieval methods fused via RRF scoring. It handles query expansion, intent classification, typo tolerance and optional cross-encoder reranking.

**Core Capabilities:**
- **Triple-Hybrid Search**: Vector (semantic) + BM25/FTS5 (lexical) + Graph (relationship-based)
- **RRF Score Fusion**: Industry-standard k=60 with convergence bonuses
- **Intent Classification**: 7 intent types route to task-specific retrieval weights
- **Query Enhancement**: Fuzzy matching (Levenshtein) + acronym expansions (via hybrid-search.ts inline logic)
- **Reranking Pipeline**: Optional cross-encoder with length penalties
- **Schema Management**: sqlite-vec schema includes v13 document-type fields used for spec-doc indexing and scoring

**Architecture Pattern:**
```
Query Input
    |
Intent Classifier -> Task-specific weights
    |
Parallel Search
|---> Vector (sqlite-vec) -> Semantic matches
|---> BM25 (Pure JS)       -> Keyword matches
|---> Graph (Co-activation) -> Relationship matches
    |
RRF Fusion (k=60) -> Unified scores
    |
Cross-Encoder Rerank (optional) -> Relevance refinement
    |
Final Results
```

**Architecture Note:**
`vector-index.ts` is a typed facade that delegates operations to `vector-index-impl.ts` (the full implementation). Both files are TypeScript. See [Module Structure](#3-module-structure) for details.

<!-- /ANCHOR:overview -->

---

## 2. 🧩 KEY CONCEPTS
<!-- ANCHOR:key-concepts -->

### Reciprocal Rank Fusion (RRF)

**Formula**: `score = Sum 1/(k + rank_i)` where k=60 (industry standard)

**Why RRF?**
- Parameter-free fusion (no weight tuning required)
- Resilient to retrieval method failures (graceful degradation)
- Citation: Cormack et al. "RRF outperforms Condorcet" (SIGIR 2009)

**Enhancements (REQ-011):**
- **10% Convergence Bonus**: Results in multiple sources get +10% score boost
- **1.5x Graph Weight**: Graph-exclusive discoveries weighted higher for novelty

**Example:**
```javascript
// Vector rank: 2, BM25 rank: 5, Graph rank: 1
// RRF score = 1/(60+2) + 1/(60+5) + 1.5/(60+1)
//           = 0.0161 + 0.0154 + 0.0246 = 0.0561
// Convergence bonus: 0.0561 * 1.10 = 0.0617 (final)
```

### BM25 (Best Matching 25)

**Formula**:
```
score(D, Q) = Sum IDF(qi) * (tf(qi,D) * (k1+1)) / (tf(qi,D) + k1 * (1-b + b*|D|/avgdl))
```

**Parameters:**
- `k1 = 1.2`: Term frequency saturation (higher = less saturation)
- `b = 0.75`: Length normalization (0=ignore length, 1=full penalty)
- `tf(qi,D)`: Term frequency of query term qi in document D
- `|D|`: Document length, `avgdl`: Average document length
- `IDF(qi)`: Inverse document frequency: `log((N - n(qi) + 0.5) / (n(qi) + 0.5) + 1)`

**Why BM25?**
- Handles term frequency saturation (repeated words don't dominate)
- Length normalization (short docs not penalized unfairly)
- Pure JavaScript implementation (REQ-028, no Python dependency)

### Intent-Aware Retrieval

**7 Intent Types** (REQ-012, T036-T039):

| Intent           | Description                  | Prioritizes                         |
| ---------------- | ---------------------------- | ----------------------------------- |
| `add_feature`    | Building new functionality   | Patterns, examples, architecture    |
| `fix_bug`        | Debugging issues             | Error history, root cause, patches  |
| `refactor`       | Restructuring code           | Patterns, dependencies, design docs |
| `security_audit` | Security review              | Vulnerabilities, audit logs         |
| `understand`     | Learning/exploring (default) | Explanations, context, decisions    |
| `find_spec`      | Spec document retrieval      | Boosts spec-doc source weights      |
| `find_decision`  | Decision rationale lookup    | Boosts decision-record source weights |

**Detection**: Keyword matching with primary (2x weight) and secondary (1x weight) terms.

**Example**:
```javascript
// Query: "add user registration feature"
// Intent: add_feature
// Boosts: architecture memories, pattern docs, examples
```

### Cross-Encoder Reranking

**Purpose**: Refine top results using query-document pair scoring.

**Providers** (REQ-013):
- **Voyage rerank-2**: API-based, max 100 docs
- **Cohere Rerank v3.5**: API-based, max 100 docs
- **Local**: Cross-encoder/ms-marco-MiniLM-L-6-v2 (Python, unimplemented)

**Length Penalty** (REQ-008): Short content (<100 chars) scored 0.8x - 1.0x.

**Latency Protection**:
- P95 latency threshold: 500ms (configurable via `RERANK_P95_THRESHOLD`)
- Auto-disable if threshold exceeded
- Cache TTL: 5 minutes (300,000ms)

**Trade-off**: Adds 200-500ms latency but improves precision by 15-25%.

<!-- /ANCHOR:key-concepts -->

---

## 3. 📁 MODULE STRUCTURE
<!-- ANCHOR:structure -->

### Migration Status

**TypeScript migration is COMPLETE.** All source files are TypeScript (0 `.js` source files remain).

| Status               | Files                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------- |
| **TypeScript**       | `hybrid-search.ts`, `cross-encoder.ts`, `intent-classifier.ts`, `bm25-index.ts`             |
| **TypeScript**       | `vector-index.ts` (typed facade) -> `vector-index-impl.ts` (full implementation)             |
| **TypeScript**       | `reranker.ts` (score-based reranking), `rrf-fusion.ts` (RRF score fusion)                    |

### Facade Pattern: vector-index

```
Consumers
    |
    v
vector-index.ts          (700 LOC)
  - TypeScript types & interfaces
  - Typed function signatures
  - Thin wrappers that delegate calls to:
    |
    v
vector-index-impl.ts     (3333 LOC)
  - Full TypeScript implementation
  - Schema creation & migrations (includes v13 document-type migration)
  - All database operations (CRUD, search, caching)
  - Uses import syntax (ESM)
  - References SERVER_DIR for config paths
```

**NOTE**: `vector-index.ts` is a typed facade. Modifying it without updating `vector-index-impl.ts` may not have the expected runtime effect, since most logic lives in the impl file.

### Module Listing

| File                     | LOC    | Language   | Purpose                                             |
| ------------------------ | ------ | ---------- | --------------------------------------------------- |
| `vector-index.ts`        | ~700   | TypeScript | Typed facade: interfaces, type exports, delegation  |
| `vector-index-impl.ts`   | ~3333  | TypeScript | Full implementation: schema, CRUD, search, caching  |
| `hybrid-search.ts`       | ~381   | TypeScript | Orchestrates vector/BM25/graph fusion via RRF       |
| `cross-encoder.ts`       | ~433   | TypeScript | Reranking with Voyage/Cohere providers              |
| `intent-classifier.ts`   | ~291   | TypeScript | 7 intent types with keyword patterns                |
| `bm25-index.ts`          | ~241   | TypeScript | Pure TypeScript BM25 (REQ-028, v1.2.0)              |
| `reranker.ts`            | -      | TypeScript | Score-based reranking utility (sort + truncate)     |
| `rrf-fusion.ts`          | -      | TypeScript | Reciprocal Rank Fusion scoring logic                |

**Total**: ~5,379+ LOC across 8 files (all TypeScript)

### Data Flow

```
1. QUERY PREPROCESSING
   hybrid-search.ts -> Expand acronyms + fix typos (inline)
   intent-classifier.ts -> Detect task intent

         |
         v

2. PARALLEL RETRIEVAL
   vector-index.ts (-> vector-index-impl.ts) -> Vector search (semantic)
   bm25-index.ts -> BM25 search (keyword)
   graph (via co-activation.ts) -> Relationship search

         |
         v

3. SCORE FUSION
   hybrid-search.ts -> RRF with k=60, convergence bonus
   hybrid-search.ts -> Orchestrate multi-source fusion

         |
         v

4. RERANKING (Optional)
   cross-encoder.ts -> API or local reranker
   Apply length penalty for short content

         |
         v

   Final Results
```

<!-- /ANCHOR:structure -->

---

## 4. ⚡ FEATURES
<!-- ANCHOR:features -->

### Configuration Options

**Environment Variables:**

| Variable                 | Default  | Purpose                             |
| ------------------------ | -------- | ----------------------------------- |
| `ENABLE_RRF_FUSION`      | `true`   | Enable RRF fusion                   |
| `ENABLE_BM25`            | `true`   | Enable BM25 lexical search          |
| `ENABLE_FUZZY_MATCH`     | `true`   | Enable fuzzy query expansion        |
| `ENABLE_CROSS_ENCODER`   | `false`  | Enable cross-encoder reranking      |
| `CROSS_ENCODER_PROVIDER` | `auto`   | `voyage`, `cohere`, `local`, `auto` |
| `MAX_RERANK_CANDIDATES`  | `20`     | Max docs to rerank (R1 mitigation)  |
| `RERANK_P95_THRESHOLD`   | `500`    | P95 latency threshold (ms)          |
| `RERANK_CACHE_TTL`       | `300000` | Cache TTL (5 minutes)               |
| `RERANK_CACHE_SIZE`      | `1000`   | Max cache entries                   |
| `EMBEDDING_DIM`          | `768`    | Fallback embedding dimension        |

**RRF Parameters** (hardcoded, REQ-011):
```javascript
const DEFAULT_K = 60;              // Industry standard
const CONVERGENCE_BONUS = 0.10;    // 10% boost for multi-source
const GRAPH_WEIGHT_BOOST = 1.5;    // 1.5x for graph discoveries
```

**BM25 Parameters** (hardcoded, tuned):
```javascript
const DEFAULT_K1 = 1.2;   // Term frequency saturation
const DEFAULT_B = 0.75;    // Length normalization
```

### Vector Index Features

**Schema Versions** (v1-v9, v12-v14. Note: v10-v11 are skipped):

| Version | Migration                                                                    |
| ------- | ---------------------------------------------------------------------------- |
| v1      | Initial schema (no-op, base tables created by `create_schema()`)             |
| v2      | Add `idx_history_timestamp` index on `memory_history`                        |
| v3      | Add `related_memories` column to `memory_index`                              |
| v4      | FSRS columns (`stability`, `difficulty`, `last_review`, `review_count`) + `memory_conflicts` table + FSRS indexes |
| v5      | `memory_type` column (9 cognitive types) + `half_life_days` + `type_inference_source` |
| v6      | `file_mtime_ms` column for incremental indexing (REQ-023, T064-T066)         |
| v7      | `partial` embedding_status + `idx_embedding_pending` + `idx_fts_fallback` (REQ-031, T096) |
| v8      | `causal_edges` table with 6 relationship types (REQ-012, T043-T047)          |
| v9      | `memory_corrections` table for learning from corrections (REQ-015, REQ-026, T052-T055) |
| v10-v11 | **Skipped** (no migration functions exist. Version jumps from 9 to 12)       |
| v12     | Unified `memory_conflicts` DDL: drop and recreate with canonical schema (KL-1) |
| v13     | Add `document_type` + `spec_level` columns and indexes for spec-doc indexing and document-type scoring (Spec 126) |
| v14     | Follow-up schema updates after v13 (current schema constant) |

**Spec 126 hardening references:**
- `tests/spec126-full-spec-doc-indexing.vitest.ts`: validates 8 spec document types, scoring multipliers and new intents.
- `handlers/memory-index.ts`: keeps 5-source indexing and `includeSpecDocs` wiring aligned with search expectations.

**Multi-Provider Support**:
- Voyage AI: 1024-dim (default)
- OpenAI: 1536-dim
- Auto-detection via API keys

**Buffer Handling**:
```javascript
// Float32Array -> Buffer conversion for sqlite-vec
function toEmbeddingBuffer(embedding) {
  return Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
}
```

### BM25 Index Features

**Pure JavaScript Implementation**:
- No Python dependencies (REQ-028)
- In-memory index for fast retrieval
- Simple stemming (15+ suffix rules)
- 44-word stopword list

**Tokenization**:
```javascript
// Preserves code identifiers (underscores), removes punctuation
"user_authentication_flow" -> ["user", "authent", "flow"]
```

**IDF Calculation**:
```javascript
// Inverse document frequency with smoothing
IDF = log((N - n(qi) + 0.5) / (n(qi) + 0.5) + 1)
```

### Hybrid Search Features

**Triple-Source Fusion**:
```javascript
// unifiedSearch() orchestrates:
// 1. Vector search (semantic similarity)
// 2. BM25/FTS5 search (keyword matching)
// 3. Graph search (relationship traversal, 1.5x boost)
// -> RRF fusion -> Sorted by combined score
```

**Spec Folder Scoping**:
```javascript
// Filter to specific project context
hybridSearch("authentication", { specFolder: "specs/007-auth" })
```

**Graceful Degradation**:
- If BM25 disabled: Vector + FTS5 only
- If RRF disabled: Vector-only with basic metadata
- If no graph: Vector + Lexical fusion

### Intent Classification Features

**Keyword Weighting**:
```javascript
// Primary keywords: 2x weight
// Secondary keywords: 1x weight
// Threshold: 3.0 for confident detection
```

**Example Detection**:
```javascript
// Query: "fix login crash after update"
// Matches: "fix" (primary, 2.0) + "crash" (primary, 2.0) + "login" (secondary, 1.0)
// Total: 5.0 -> fix_bug intent
```

**Fallback**: `understand` intent if no match (score < 3.0).

### Cross-Encoder Features

**Provider Auto-Detection**:
```javascript
// Checks API keys in order:
// 1. VOYAGE_API_KEY -> Voyage rerank-2
// 2. COHERE_API_KEY -> Cohere v3.5
// 3. Python available -> Local (unimplemented)
```

**Caching**:
```javascript
// Cache key: SHA-256(query + document IDs)
// Avoids redundant API calls for identical searches
```

**Latency Monitoring**:
```javascript
// Track P95 latency (last 100 searches)
// Auto-disable if P95 > threshold
// Log warning with recovery hint
```

**Length Penalty** (REQ-008):
```javascript
// content_length < 100 chars -> penalty 0.8x - 1.0x
// Linear interpolation: penalty = 0.8 + (len/100) * 0.2
```

<!-- /ANCHOR:features -->

---

## 5. 💡 USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Basic Hybrid Search

```typescript
import { initializeDb } from './vector-index';
import { init, unifiedSearch } from './hybrid-search';
import { vectorSearch } from './vector-index';
import Database from 'better-sqlite3';

// Initialize
const db = initializeDb();
init(db, vectorSearch);

// Search with all methods
const results = await unifiedSearch('authentication flow', {
  limit: 10,
  specFolder: 'specs/007-auth',  // Optional: scope to project
  enableGraph: true,              // Include graph search
});

// Results include:
// - rrfScore: Combined score
// - sources: ['vector', 'bm25', 'graph']
// - vectorRank, bm25Rank, graphRank
// - sourceCount: How many methods found this result
```

### Intent-Aware Search

```typescript
import { classifyIntent } from './intent-classifier';
import { unifiedSearch } from './hybrid-search';

// Classify query intent
const query = 'add dark mode feature';
const intent = classifyIntent(query);
// -> { type: 'add_feature', confidence: 0.85 }

// Adjust retrieval weights based on intent
const results = await unifiedSearch(query, {
  intent: intent.type,  // Boosts relevant memory types
  limit: 10,
});
```

### Cross-Encoder Reranking

```typescript
import { rerankResults } from './cross-encoder';

// Get initial results
const initial = await unifiedSearch('user authentication', { limit: 20 });

// Rerank top 20 with cross-encoder
const reranked = await rerankResults('user authentication', initial, {
  topK: 10,  // Return top 10 after reranking
  provider: 'voyage',
});

// Results include:
// - crossEncoderScore: Reranker score
// - lengthPenalty: Applied penalty (if <100 chars)
// - finalScore: crossEncoderScore * lengthPenalty
```

### BM25 Direct Access

```typescript
import * as bm25Index from './bm25-index';

// Check availability
if (bm25Index.isBm25Enabled()) {
  // Search directly
  const results = bm25Index.getIndex().search('authentication', {
    limit: 10,
    specFolder: 'specs/007-auth',
  });

  // Results: [{ id, score, rank }]
}
```

### Vector Index Schema Migration

```typescript
import { initializeDb, getDb } from './vector-index';

// Initialize DB (auto-runs migrations to current schema, including v13+)
initializeDb();

// Check current version
const db = getDb();
const version = db.prepare('PRAGMA user_version').pluck().get() as number;
console.log(`Schema version: ${version}`);
```

<!-- /ANCHOR:usage-examples -->

---

## 6. 🔗 RELATED RESOURCES
<!-- ANCHOR:related -->

### Internal Dependencies

| Module           | Purpose                           |
| ---------------- | --------------------------------- |
| `../cognitive/`  | Tier classifier, attention decay  |
| `../utils/`      | Format helpers, path security     |
| `@spec-kit/shared/embeddings` | Embeddings provider abstraction   |
| `../errors/`     | Recovery hints for error handling |
| Search weights configuration | Loaded via SERVER_DIR in vector-index-impl.ts |

### External Dependencies

| Library          | Purpose                 |
| ---------------- | ----------------------- |
| `better-sqlite3` | SQLite database driver  |
| `sqlite-vec`     | Vector search extension |

### Configuration Files

| File                          | Purpose                                  |
| ----------------------------- | ---------------------------------------- |
| `configs/search-weights.json` | Max triggers per memory, scoring weights (loaded via SERVER_DIR) |

### Related Documentation

- `../cognitive/README.md`: Cognitive layer (attention, tier classification)
- `../storage/README.md`: Storage layer (checkpoints, history, access tracking)
- `../parsing/README.md`: Parsing layer (memory parser, trigger matcher)
- `context-server.ts`: MCP integration and API endpoints

### Research References

- **RRF**: Cormack et al. "Reciprocal Rank Fusion outperforms Condorcet" (SIGIR 2009)
- **BM25**: Robertson & Walker "Okapi at TREC-3" (1994)
- **Cross-Encoders**: Nogueira et al. "Document Ranking with Neural Networks" (2019)

### REQ Tracking

| REQ     | Feature                          | Files                           |
| ------- | -------------------------------- | ------------------------------- |
| REQ-008 | Length penalty for short content | cross-encoder.ts                |
| REQ-011 | RRF fusion enhancement           | hybrid-search.ts                |
| REQ-012 | Intent classification            | intent-classifier.ts            |
| REQ-013 | Cross-encoder reranking          | cross-encoder.ts                |
| REQ-014 | BM25 hybrid search               | bm25-index.ts, hybrid-search.ts |
| REQ-018 | Query expansion (fuzzy)          | hybrid-search.ts                |
| REQ-027 | Fuzzy acronym matching           | hybrid-search.ts                |
| REQ-028 | Pure TypeScript BM25             | bm25-index.ts                   |

<!-- /ANCHOR:related -->

---

**Version**: 1.7.2
**Last Updated**: 2026-02-16
**Maintainer**: system-spec-kit MCP server

**Migration Status**:
- TypeScript migration is **complete**: all 8 code files are TypeScript (0 `.js` source files)
- `vector-index.ts` is a typed facade. `vector-index-impl.ts` is the full implementation
- `reranker.ts` and `rrf-fusion.ts` provide score-based reranking and RRF fusion utilities
