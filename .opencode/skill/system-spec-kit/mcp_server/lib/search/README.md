# Search Subsystem

Multi-modal hybrid search architecture combining vector, lexical (BM25/FTS5), and graph-based retrieval with Reciprocal Rank Fusion (RRF).

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 KEY CONCEPTS](#2--key-concepts)
- [3. 📁 MODULE STRUCTURE](#3--module-structure)
- [4. ⚡ FEATURES](#4--features)
- [5. 💡 USAGE EXAMPLES](#5--usage-examples)
- [6. 🔗 RELATED RESOURCES](#6--related-resources)

---

## 1. 📖 OVERVIEW

The search subsystem provides production-grade hybrid search capabilities with multiple retrieval methods fused via RRF scoring. It handles query expansion, intent classification, typo tolerance, and optional cross-encoder reranking.

**Core Capabilities:**
- **Triple-Hybrid Search**: Vector (semantic) + BM25/FTS5 (lexical) + Graph (relationship-based)
- **RRF Score Fusion**: Industry-standard k=60 with convergence bonuses
- **Intent Classification**: 5 intent types route to task-specific retrieval weights
- **Query Enhancement**: Fuzzy matching (Levenshtein ≤2) + 30+ acronym expansions
- **Reranking Pipeline**: Optional cross-encoder with length penalties
- **Schema Management**: sqlite-vec with 11 migration versions

**Architecture Pattern:**
```
Query Input
    ↓
Intent Classifier → Task-specific weights
    ↓
Parallel Search
├─→ Vector (sqlite-vec) → Semantic matches
├─→ BM25 (Pure JS)      → Keyword matches
└─→ Graph (Co-activation) → Relationship matches
    ↓
RRF Fusion (k=60) → Unified scores
    ↓
Cross-Encoder Rerank (optional) → Relevance refinement
    ↓
Final Results
```

---

## 2. 🚀 KEY CONCEPTS

### Reciprocal Rank Fusion (RRF)

**Formula**: `score = Σ 1/(k + rank_i)` where k=60 (industry standard)

**Why RRF?**
- Parameter-free fusion (no weight tuning required)
- Robust to retrieval method failures (graceful degradation)
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
score(D, Q) = Σ IDF(qi) * (tf(qi,D) * (k1+1)) / (tf(qi,D) + k1 * (1-b + b*|D|/avgdl))
```

**Parameters:**
- `k1 = 1.2` - Term frequency saturation (higher = less saturation)
- `b = 0.75` - Length normalization (0=ignore length, 1=full penalty)
- `tf(qi,D)` - Term frequency of query term qi in document D
- `|D|` - Document length, `avgdl` - Average document length
- `IDF(qi)` - Inverse document frequency: `log((N - n(qi) + 0.5) / (n(qi) + 0.5) + 1)`

**Why BM25?**
- Handles term frequency saturation (repeated words don't dominate)
- Length normalization (short docs not penalized unfairly)
- Pure JavaScript implementation (REQ-028, no Python dependency)

### Intent-Aware Retrieval

**5 Intent Types** (REQ-012, T036-T039):

| Intent           | Description                  | Prioritizes                         |
| ---------------- | ---------------------------- | ----------------------------------- |
| `add_feature`    | Building new functionality   | Patterns, examples, architecture    |
| `fix_bug`        | Debugging issues             | Error history, root cause, patches  |
| `refactor`       | Restructuring code           | Patterns, dependencies, design docs |
| `security_audit` | Security review              | Vulnerabilities, audit logs         |
| `understand`     | Learning/exploring (default) | Explanations, context, decisions    |

**Detection**: Keyword matching with primary (2x weight) and secondary (1x weight) terms.

**Example**:
```javascript
// Query: "add user registration feature"
// Intent: add_feature
// Boosts: architecture memories, pattern docs, examples
```

### Fuzzy Matching & Acronyms

**Levenshtein Distance** (REQ-018): Max edit distance of 2 for typo tolerance.

**ACRONYM_MAP** (30+ entries, REQ-027):
```javascript
'RRF' → ['Reciprocal Rank Fusion', 'rank fusion']
'BM25' → ['Best Matching 25', 'Okapi BM25', 'keyword search']
'RAG' → ['Retrieval Augmented Generation', 'retrieval augmented']
'MCP' → ['Model Context Protocol', 'context protocol']
// ... 26 more acronyms
```

**Query Expansion**:
```javascript
// Input: "RRF serch implementation"
// Expanded: "RRF search implementation" (typo fixed)
//         + "Reciprocal Rank Fusion"
//         + "rank fusion"
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

---

## 3. 📁 MODULE STRUCTURE

### Core Modules

| File                   | LOC  | Purpose                                          |
| ---------------------- | ---- | ------------------------------------------------ |
| `vector-index.js`      | ~600 | sqlite-vec integration, schema migrations v1-v11 |
| `hybrid-search.js`     | ~400 | Orchestrates vector/BM25/graph fusion            |
| `rrf-fusion.js`        | ~250 | RRF score calculation with bonuses               |
| `bm25-index.js`        | ~350 | Pure JS BM25 (REQ-028, v1.2.0)                   |
| `cross-encoder.js`     | ~400 | Reranking with multiple providers                |
| `intent-classifier.js` | ~300 | 5 intent types with keyword patterns             |
| `fuzzy-match.js`       | ~250 | Levenshtein + 30+ acronym expansions             |
| `reranker.js`          | ~100 | Legacy local reranker (unimplemented)            |
| `index.js`             | ~50  | Module aggregator                                |

**Total**: ~2,700 LOC

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. QUERY PREPROCESSING                                      │
│    fuzzy-match.js → Expand acronyms + fix typos              │
│    intent-classifier.js → Detect task intent                 │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. PARALLEL RETRIEVAL                                       │
│    vector-index.js → Vector search (semantic)               │
│    bm25-index.js → BM25 search (keyword)                    │
│    graph (via co-activation.js) → Relationship search       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. SCORE FUSION                                             │
│    rrf-fusion.js → RRF with k=60, convergence bonus         │
│    hybrid-search.js → Orchestrate multi-source fusion       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. RERANKING (Optional)                                     │
│    cross-encoder.js → API or local reranker                 │
│    Apply length penalty for short content                   │
└─────────────────────────────────────────────────────────────┘
                          ↓
                    Final Results
```

---

## 4. ⚡ FEATURES

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
const DEFAULT_B = 0.75;   // Length normalization
const MIN_DOC_LENGTH = 10; // Ignore docs <10 words
```

### Vector Index Features

**Schema Versions** (v1-v11):
- v1-v3: Initial FTS5 + vector
- v4: Content deduplication
- v5: Title field
- v6: Tags field
- v7: Composite scoring weights
- v8: Access patterns tracking
- v9: Spec folder scoping
- v10: Trigger metadata
- v11: Constitutional memories (highest priority)

**Multi-Provider Support**:
- Voyage AI: 1024-dim (default)
- OpenAI: 1536-dim
- Auto-detection via API keys

**Buffer Handling**:
```javascript
// Float32Array → Buffer conversion for sqlite-vec
function to_embedding_buffer(embedding) {
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
"user_authentication_flow" → ["user", "authent", "flow"]
```

**IDF Calculation**:
```javascript
// Inverse document frequency with smoothing
IDF = log((N - n(qi) + 0.5) / (n(qi) + 0.5) + 1)
```

### Hybrid Search Features

**Triple-Source Fusion**:
```javascript
// unified_search() orchestrates:
// 1. Vector search (semantic similarity)
// 2. BM25/FTS5 search (keyword matching)
// 3. Graph search (relationship traversal, 1.5x boost)
// → RRF fusion → Sorted by combined score
```

**Spec Folder Scoping**:
```javascript
// Filter to specific project context
hybrid_search("authentication", { spec_folder: "specs/007-auth" })
```

**Graceful Degradation**:
- If BM25 disabled → Vector + FTS5 only
- If RRF disabled → Vector-only with basic metadata
- If no graph → Vector + Lexical fusion

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
// Total: 5.0 → fix_bug intent
```

**Fallback**: `understand` intent if no match (score < 3.0).

### Fuzzy Match Features

**Levenshtein Distance** (max 2 edits):
```javascript
// "serch" → "search" (distance 1) ✅
// "searc" → "search" (distance 1) ✅
// "sersh" → "search" (distance 2) ✅
// "sarch" → "search" (distance 3) ❌
```

**Acronym Expansion**:
```javascript
// Query: "RRF implementation"
// Expanded: "RRF implementation Reciprocal Rank Fusion rank fusion"
```

**Stop Word Filtering**: 70+ common words excluded to prevent false acronyms (e.g., "not" → "HOT").

### Cross-Encoder Features

**Provider Auto-Detection**:
```javascript
// Checks API keys in order:
// 1. VOYAGE_API_KEY → Voyage rerank-2
// 2. COHERE_API_KEY → Cohere v3.5
// 3. Python available → Local (unimplemented)
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
// content_length < 100 chars → penalty 0.8x - 1.0x
// Linear interpolation: penalty = 0.8 + (len/100) * 0.2
```

---

## 5. 💡 USAGE EXAMPLES

### Basic Hybrid Search

```javascript
const { init, unified_search } = require('./hybrid-search');
const { init: initVector, vector_search } = require('./vector-index');

// Initialize
const db = new Database('context-index.sqlite');
initVector(db);
init(db, vector_search);

// Search with all methods
const results = await unified_search('authentication flow', {
  limit: 10,
  spec_folder: 'specs/007-auth',  // Optional: scope to project
  enable_graph: true,              // Include graph search
});

// Results include:
// - rrf_score: Combined score
// - sources: ['vector', 'bm25', 'graph']
// - vector_rank, bm25_rank, graph_rank
// - source_count: How many methods found this result
```

### Intent-Aware Search

```javascript
const { classify_intent } = require('./intent-classifier');
const { unified_search } = require('./hybrid-search');

// Classify query intent
const query = 'add dark mode feature';
const intent = classify_intent(query);
// → { type: 'add_feature', confidence: 0.85 }

// Adjust retrieval weights based on intent
const results = await unified_search(query, {
  intent: intent.type,  // Boosts relevant memory types
  limit: 10,
});
```

### Fuzzy Query Expansion

```javascript
const { expand_query } = require('./fuzzy-match');

// Expand with typo tolerance + acronyms
const expanded = expand_query('RRF serch implementation');
// → "RRF search implementation Reciprocal Rank Fusion rank fusion"

// Use expanded query
const results = await unified_search(expanded, { limit: 10 });
```

### Cross-Encoder Reranking

```javascript
const { rerank_results } = require('./cross-encoder');

// Get initial results
const initial = await unified_search('user authentication', { limit: 20 });

// Rerank top 20 with cross-encoder
const reranked = await rerank_results('user authentication', initial, {
  top_k: 10,  // Return top 10 after reranking
  provider: 'voyage',
});

// Results include:
// - cross_encoder_score: Reranker score
// - length_penalty: Applied penalty (if <100 chars)
// - final_score: cross_encoder_score * length_penalty
```

### BM25 Direct Access

```javascript
const bm25Index = require('./bm25-index');

// Check availability
if (bm25Index.is_bm25_enabled()) {
  // Search directly
  const results = bm25Index.get_index().search('authentication', {
    limit: 10,
    spec_folder: 'specs/007-auth',
  });

  // Results: [{ id, score, rank }]
}
```

### Vector Index Schema Migration

```javascript
const { ensure_schema } = require('./vector-index');

// Ensure schema is up-to-date (v11)
// Automatically detects current version and runs migrations
await ensure_schema(db);

// Check current version
const version = db.prepare('PRAGMA user_version').pluck().get();
console.log(`Schema version: ${version}`);
```

### RRF Fusion with Convergence

```javascript
const { fuse_results_multi, SOURCE_TYPES } = require('./rrf-fusion');

// Manual fusion (typically done by hybrid-search.js)
const vector_results = [{ id: 1 }, { id: 2 }, { id: 3 }];
const bm25_results = [{ id: 2 }, { id: 1 }, { id: 4 }];
const graph_results = [{ id: 3 }, { id: 5 }];

const fused = fuse_results_multi(vector_results, bm25_results, graph_results, {
  k: 60,                    // RRF parameter
  enable_graph_boost: true, // 1.5x weight for graph
});

// Results sorted by rrf_score:
// id:2 → sources: [vector, bm25], convergence bonus applied
// id:1 → sources: [vector, bm25], convergence bonus applied
// id:3 → sources: [vector, graph], convergence bonus + graph boost
// id:4 → sources: [bm25]
// id:5 → sources: [graph], graph boost applied
```

---

## 6. 🔗 RELATED RESOURCES

### Internal Dependencies

| Module           | Purpose                           |
| ---------------- | --------------------------------- |
| `../cognitive/`  | Tier classifier, attention decay  |
| `../utils/`      | Format helpers, path security     |
| `../providers/`  | Embeddings provider abstraction   |
| `../errors/`     | Recovery hints for error handling |
| `../../configs/` | Search weights configuration      |

### External Dependencies

| Library          | Purpose                 |
| ---------------- | ----------------------- |
| `better-sqlite3` | SQLite database driver  |
| `sqlite-vec`     | Vector search extension |

### Configuration Files

| File                          | Purpose                                  |
| ----------------------------- | ---------------------------------------- |
| `configs/search-weights.json` | Max triggers per memory, scoring weights |

### Related Documentation

- `../cognitive/README.md` - Cognitive layer (attention, tier classification)
- `../storage/README.md` - Storage layer (checkpoints, history, access tracking)
- `../parsing/README.md` - Parsing layer (memory parser, trigger matcher)
- `context-server.js` - MCP integration and API endpoints

### Research References

- **RRF**: Cormack et al. "Reciprocal Rank Fusion outperforms Condorcet" (SIGIR 2009)
- **BM25**: Robertson & Walker "Okapi at TREC-3" (1994)
- **Cross-Encoders**: Nogueira et al. "Document Ranking with Neural Networks" (2019)

### REQ Tracking

| REQ     | Feature                          | Files                           |
| ------- | -------------------------------- | ------------------------------- |
| REQ-008 | Length penalty for short content | cross-encoder.js                |
| REQ-011 | RRF fusion enhancement           | rrf-fusion.js                   |
| REQ-012 | Intent classification            | intent-classifier.js            |
| REQ-013 | Cross-encoder reranking          | cross-encoder.js                |
| REQ-014 | BM25 hybrid search               | bm25-index.js, hybrid-search.js |
| REQ-018 | Query expansion (fuzzy)          | fuzzy-match.js                  |
| REQ-027 | Fuzzy acronym matching           | fuzzy-match.js                  |
| REQ-028 | Pure JS BM25                     | bm25-index.js                   |

---

**Version**: 1.2.0
**Last Updated**: 2025-01-XX
**Maintainer**: system-spec-kit MCP server
