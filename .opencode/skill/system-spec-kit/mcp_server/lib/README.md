# MCP Server Library Modules

> Core JavaScript modules powering the Spec Kit Memory MCP server with vector search, embeddings, and memory management.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. ⚡ FEATURES](#4--features)
- [5. ⚙️ CONFIGURATION](#5--configuration)
- [6. 💡 USAGE EXAMPLES](#6--usage-examples)
- [7. 🛠️ TROUBLESHOOTING](#7--troubleshooting)
- [8. 📚 RELATED DOCUMENTS](#8--related-documents)

---

## 1. 📖 OVERVIEW

### What is the lib/ Directory?

The `lib/` directory contains the core JavaScript modules that power the Spec Kit Memory MCP server. These modules handle vector storage, semantic search, embeddings, checkpoints, and memory management. They are designed to be modular, testable, and composable.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Modules | 23 | Specialized JavaScript modules |
| Categories | 6 | Database, Search, Embeddings, Triggers, Scoring, Utilities |
| Vector Dimensions | 768 | nomic-embed-text-v1.5 embeddings |
| Importance Tiers | 6 | constitutional → deprecated |

### Key Features

| Feature | Description |
|---------|-------------|
| **Vector Search** | sqlite-vec based semantic search with 768-dim embeddings |
| **Hybrid Search** | Combined vector + FTS5 full-text search with RRF fusion |
| **Checkpoints** | Save/restore memory state with compression |
| **Importance Tiers** | Six-tier prioritization with decay and auto-expiration |
| **Trigger Matching** | Fast (<50ms) exact phrase matching for proactive surfacing |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18+ | 20+ |
| better-sqlite3 | 9.0+ | Latest |
| sqlite-vec | 0.1+ | Latest |

---

## 2. 🚀 QUICK START

### Module Loading

```javascript
// Modules are loaded by context-server.js
// Direct usage example:

const vectorIndex = require('./lib/vector-index');
const hybridSearch = require('./lib/hybrid-search');
const checkpoints = require('./lib/checkpoints');

// Initialize with database
const db = vectorIndex.init();
hybridSearch.init(db, vectorIndex.vectorSearch);
checkpoints.init(db);
```

### Verify Installation

```bash
# Check that all modules exist
ls .opencode/skill/system-spec-kit/mcp_server/lib/

# Expected: 23 .js files
# access-tracker.js, channel.js, checkpoints.js, ...
```

### First Use

```javascript
// Perform a semantic search
const results = await vectorIndex.search(queryEmbedding, {
  limit: 10,
  specFolder: 'my-spec'
});
```

---

## 3. 📁 STRUCTURE

```
lib/
├── Core Database & Storage
│   ├── vector-index.js         # sqlite-vec vector storage (768-dim)
│   ├── checkpoints.js          # Session state save/restore
│   └── history.js              # Memory history tracking
│
├── Search & Retrieval
│   ├── hybrid-search.js        # Vector + FTS5 combined search
│   ├── rrf-fusion.js           # Reciprocal Rank Fusion
│   ├── reranker.js             # Result reranking
│   ├── scoring.js              # Relevance scoring with decay
│   └── composite-scoring.js    # Combined scoring algorithms
│
├── Embeddings
│   └── embeddings.js           # Re-export from scripts/lib
│
├── Trigger System
│   ├── trigger-extractor.js    # Extract trigger phrases
│   └── trigger-matcher.js      # Fast phrase matching (<50ms)
│
├── Confidence & Importance
│   ├── confidence-tracker.js   # Validation feedback tracking
│   └── importance-tiers.js     # Six-tier prioritization
│
├── Utilities
│   ├── access-tracker.js       # Memory access tracking
│   ├── channel.js              # Communication channel
│   ├── config-loader.js        # Configuration loading
│   ├── entity-scope.js         # Entity scoping
│   ├── errors.js               # Error classes and codes
│   ├── index-refresh.js        # Index update management
│   ├── memory-parser.js        # Memory file parsing
│   ├── retry-manager.js        # Retry logic
│   ├── temporal-contiguity.js  # Time-based grouping
│   └── token-budget.js         # Token budget management
│
└── README.md                   # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `vector-index.js` | Core database operations, vector storage, search |
| `hybrid-search.js` | Combines vector and FTS5 search with RRF fusion |
| `checkpoints.js` | Save/restore memory state for session management |
| `importance-tiers.js` | Six-tier importance system with decay |
| `trigger-matcher.js` | Fast trigger phrase matching for hooks |

---

## 4. ⚡ FEATURES

### Core Database (vector-index.js)

**Purpose**: sqlite-vec based vector storage for memory embeddings

| Aspect | Details |
|--------|---------|
| **Vector Dimensions** | 768 (nomic-embed-text-v1.5) |
| **Database** | SQLite with sqlite-vec extension |
| **Security** | CWE-22 path traversal protection |
| **Caching** | LRU cache for search results |

**Key Functions**:
- `init()` - Initialize database with migrations
- `saveMemory()` - Store memory with embedding
- `vectorSearch()` - Semantic similarity search
- `verifyIntegrity()` - Check for orphaned files

---

### Hybrid Search (hybrid-search.js)

**Purpose**: Combined vector + FTS5 full-text search

| Aspect | Details |
|--------|---------|
| **Vector Search** | Semantic similarity via embeddings |
| **FTS5 Search** | Full-text keyword matching |
| **Fusion** | Reciprocal Rank Fusion (RRF) |
| **Filtering** | Spec folder, importance tier |

**Key Functions**:
- `hybridSearch()` - Combined search with RRF fusion
- `ftsSearch()` - FTS5-only search
- `isFtsAvailable()` - Check FTS5 availability

---

### Checkpoints (checkpoints.js)

**Purpose**: Session state management with save/restore

| Aspect | Details |
|--------|---------|
| **Compression** | zlib for memory snapshots |
| **Limits** | Max 10 checkpoints, 30-day TTL |
| **Scope** | Global or per-spec-folder |
| **Deduplication** | UPSERT logic prevents duplicates |

**Key Functions**:
- `createCheckpoint()` - Save current state
- `restoreCheckpoint()` - Restore from checkpoint
- `listCheckpoints()` - List available checkpoints
- `deleteCheckpoint()` - Remove a checkpoint

---

### Importance Tiers (importance-tiers.js)

**Purpose**: Six-tier memory prioritization system

| Tier | Value | Search Boost | Decay | Auto-Expire |
|------|-------|--------------|-------|-------------|
| constitutional | 1.0 | 3.0x | No | Never |
| critical | 1.0 | 2.0x | No | Never |
| important | 0.8 | 1.5x | No | Never |
| normal | 0.5 | 1.0x | Yes | Never |
| temporary | 0.3 | 0.5x | Yes | 7 days |
| deprecated | 0.1 | 0.0x | N/A | Manual |

**Key Functions**:
- `getTierConfig()` - Get tier configuration
- `validateTier()` - Validate tier name
- `getSearchBoost()` - Get tier's search multiplier

---

### Trigger Matcher (trigger-matcher.js)

**Purpose**: Fast exact phrase matching for proactive memory surfacing

| Aspect | Details |
|--------|---------|
| **Target Latency** | <50ms (hook timeout) |
| **Cache TTL** | 60 seconds |
| **No Embeddings** | Pure string operations |
| **Logging** | Execution time tracking |

**Key Functions**:
- `matchTriggers()` - Match prompt against trigger phrases
- `loadTriggerCache()` - Load/refresh trigger cache
- `clearCache()` - Force cache refresh

---

### Confidence Tracker (confidence-tracker.js)

**Purpose**: Track validation feedback and manage confidence scores

| Aspect | Details |
|--------|---------|
| **Base Confidence** | 0.5 |
| **Positive Increment** | +0.1 (capped at 1.0) |
| **Negative Decrement** | -0.05 (minimum 0.0) |
| **Promotion Threshold** | confidence ≥ 0.9, validations ≥ 5 |

**Key Functions**:
- `recordValidation()` - Record useful/not useful feedback
- `getPromotionCandidates()` - Find memories eligible for promotion

---

### Scoring (scoring.js)

**Purpose**: Memory decay and importance calculations

**Decay Formula**: `adjusted_score = similarity + (decay_weight × e^(-age_days / scale_days))`

| Age (days) | Decay Boost | % of Max |
|------------|-------------|----------|
| 0 | 0.300 | 100% |
| 7 | 0.278 | 93% |
| 30 | 0.215 | 72% |
| 90 | 0.110 | 37% |
| 365 | 0.005 | 2% |

---

### Error Handling (errors.js)

**Purpose**: Standardized error codes and MemoryError class

| Category | Code Range | Examples |
|----------|------------|----------|
| Embedding | E00x | E001: EMBEDDING_FAILED |
| File | E01x | E010: FILE_NOT_FOUND |
| Database | E02x | E020: DB_CONNECTION_FAILED |
| Validation | E03x | E030: INVALID_PARAMETER |
| Search | E04x | E040: SEARCH_FAILED |

---

## 5. ⚙️ CONFIGURATION

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MEMORY_DB_PATH` | No | Custom database path (default: `database/context-index.sqlite`) |
| `MEMORY_ALLOWED_PATHS` | No | Additional allowed paths for file reads (colon-separated) |
| `DEBUG_TRIGGER_MATCHER` | No | Enable verbose trigger matching logs |

### Database Configuration

**Location**: `database/context-index.sqlite`

```javascript
// Configuration in vector-index.js
const EMBEDDING_DIM = 768;           // nomic-embed-text-v1.5
const SCHEMA_VERSION = 3;            // Current schema version
const DB_PERMISSIONS = 0o600;        // Owner read/write only
```

### Decay Configuration

```javascript
// Configuration in scoring.js
const DECAY_CONFIG = {
  decayWeight: 0.3,   // Maximum boost for new memories
  scaleDays: 90,      // Decay time constant
  enabled: true       // Can be disabled globally
};
```

---

## 6. 💡 USAGE EXAMPLES

### Example 1: Semantic Search

```javascript
const vectorIndex = require('./lib/vector-index');
const { generateEmbedding } = require('./lib/embeddings');

// Generate query embedding
const queryEmbedding = await generateEmbedding('How does authentication work?');

// Search with options
const results = vectorIndex.vectorSearch(queryEmbedding, {
  limit: 10,
  specFolder: 'my-feature',
  useDecay: true
});

console.log(results);
// [{ id, title, similarity, spec_folder, ... }, ...]
```

### Example 2: Hybrid Search

```javascript
const hybridSearch = require('./lib/hybrid-search');

// Combined vector + FTS5 search
const results = await hybridSearch.hybridSearch(queryEmbedding, 'auth login', {
  limit: 10,
  vectorWeight: 0.7,
  ftsWeight: 0.3
});
```

### Example 3: Checkpoint Management

```javascript
const checkpoints = require('./lib/checkpoints');

// Create checkpoint before major changes
const checkpointId = checkpoints.createCheckpoint('pre-refactor', {
  specFolder: 'my-feature',
  metadata: { reason: 'Before architecture change' }
});

// Later: restore if needed
checkpoints.restoreCheckpoint('pre-refactor');
```

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| Semantic search | `vectorSearch(embedding, opts)` | Find by meaning |
| Hybrid search | `hybridSearch(embedding, text, opts)` | Combine semantic + keyword |
| Trigger match | `matchTriggers(prompt)` | Proactive surfacing (<50ms) |
| Save state | `createCheckpoint(name)` | Before risky operations |

---

## 7. 🛠️ TROUBLESHOOTING

### Common Issues

#### Database Not Found

**Symptom**: `SQLITE_CANTOPEN: unable to open database file`

**Cause**: Database path doesn't exist or permissions issue

**Solution**:
```bash
# Check database exists
ls -la .opencode/skill/system-spec-kit/database/

# Create directory if missing
mkdir -p .opencode/skill/system-spec-kit/database/
```

#### Embedding Dimension Mismatch

**Symptom**: `Error: embedding dimension mismatch (expected 768, got 384)`

**Cause**: Database created with old embedding model

**Solution**:
```bash
# Run migration script
node .opencode/skill/system-spec-kit/scripts/migrate-to-nomic.js
```

#### Slow Trigger Matching

**Symptom**: Trigger matching exceeds 50ms target

**Cause**: Large trigger cache or cold start

**Solution**:
```javascript
// Pre-warm cache on server start
const triggerMatcher = require('./lib/trigger-matcher');
triggerMatcher.loadTriggerCache();
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Stale cache | Restart MCP server |
| Orphaned files | Run `vectorIndex.verifyIntegrity()` |
| Duplicate entries | Checkpoints use UPSERT (auto-handled) |
| Missing FTS5 | Rebuild database with FTS5 extension |

### Diagnostic Commands

```bash
# Check database integrity
sqlite3 .opencode/skill/system-spec-kit/database/context-index.sqlite "PRAGMA integrity_check;"

# Count memories
sqlite3 .opencode/skill/system-spec-kit/database/context-index.sqlite "SELECT COUNT(*) FROM memory_index;"

# Check schema version
sqlite3 .opencode/skill/system-spec-kit/database/context-index.sqlite "SELECT * FROM schema_version;"
```

---

## 8. 📚 RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [context-server.js](../context-server.js) | MCP server entry point |
| [SKILL.md](../../SKILL.md) | Parent skill documentation |
| [scripts/lib/](../../scripts/lib/) | Shared library modules |
| [database/](../../database/) | SQLite database location |

### External Resources

| Resource | Description |
|----------|-------------|
| [sqlite-vec](https://github.com/asg017/sqlite-vec) | Vector search extension for SQLite |
| [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) | Fast SQLite3 bindings for Node.js |
| [nomic-embed-text](https://huggingface.co/nomic-ai/nomic-embed-text-v1.5) | Embedding model documentation |

---

*Documentation version: 1.0 | Last updated: 2025-12-26*
