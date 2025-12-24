# Semantic Memory Reference - MCP Tools & Intelligent Retrieval

Vector search, hybrid FTS5+vector retrieval, and intelligent memory management for context preservation.

---

## 1. 📖 OVERVIEW

Semantic search provides intelligent memory retrieval through vector embeddings, enabling natural language queries across all saved context. The system provides hybrid search (FTS5 + vector), six-tier importance system, memory decay, checkpoint management, constitutional memories, auto-indexing, and confidence-based promotion.

**Core Principle:** Memory should surface relevant context automatically based on semantic meaning, not just keyword matches. The system balances recency, importance, and relevance to prioritize what matters most.

### Key Capabilities

| Feature | Description |
|---------|-------------|
| Hybrid Search | FTS5 keyword + vector semantic fusion via RRF |
| Six Importance Tiers | constitutional → deprecated with boost multipliers |
| Time-Based Decay | 90-day half-life with tier-specific rates |
| Checkpoints | Save/restore memory state for safety |
| Constitutional Tier | Always-surfaced memories (~500 tokens) |
| Confidence Promotion | Auto-promote validated memories to critical |

---

## 2. 🛠️ MCP TOOLS

### Quick Reference

| Tool | Purpose |
|------|---------|
| `memory_search` | Semantic vector search with hybrid FTS5 fusion |
| `memory_load` | Load memory by spec folder and optional anchor |
| `memory_match_triggers` | Fast trigger phrase matching (<50ms) |
| `memory_list` | Browse memories with pagination |
| `memory_update` | Update memory metadata and importance |
| `memory_delete` | Remove memories by ID or spec folder |
| `memory_validate` | Record validation feedback, build confidence |
| `memory_stats` | Get memory system statistics |
| `memory_save` | Index single memory file (auto-indexing) |
| `memory_index_scan` | Bulk scan and index workspace (auto-indexing) |
| `checkpoint_create` | Save current memory state |
| `checkpoint_list` | List available checkpoints |
| `checkpoint_restore` | Restore from checkpoint |
| `checkpoint_delete` | Delete a checkpoint |

### memory_search Parameters

```typescript
memory_search({
  query: string,           // Natural language query
  concepts?: string[],     // 2-5 concepts for AND search
  limit?: number,          // Max results (default: 10)
  specFolder?: string,     // Filter by spec folder
  tier?: string,           // Filter by importance tier
  contextType?: string,    // Filter by context type
  useDecay?: boolean,      // Apply time-based decay (default: true)
  includeConstitutional?: boolean  // Include constitutional tier (default: true)
})
```

### memory_update Parameters

```typescript
memory_update({
  id: number,                    // Memory ID to update
  title?: string,                // New title
  triggerPhrases?: string[],     // Updated trigger phrases
  importanceWeight?: number,     // Weight 0-1
  importanceTier?: string        // 'constitutional'|'critical'|'important'|'normal'|'temporary'|'deprecated'
})
```

### memory_validate Parameters

```typescript
memory_validate({
  id: number,         // Memory ID to validate
  wasUseful: boolean  // Whether the memory was useful
})
// After 5+ validations at 90%+ confidence → promotion to critical tier offered
}
```

### memory_save Parameters (Auto-Indexing)

```typescript
memory_save({
  filePath: string,      // Absolute path to memory file (required)
  force?: boolean        // Re-index even if content unchanged (default: false)
})
```

**Response:**
```json
{
  "success": true,
  "action": "indexed",
  "memoryId": 42,
  "specFolder": "005-memory",
  "title": "Session Context",
  "triggerPhrases": ["memory", "indexing"]
}
```

### memory_index_scan Parameters (Auto-Indexing)

```typescript
memory_index_scan({
  specFolder?: string,   // Limit to specific spec folder
  force?: boolean        // Re-index all files (default: false)
})
```

**Response:**
```json
{
  "success": true,
  "scanned": 15,
  "indexed": 3,
  "skipped": 12,
  "errors": 0
}
```
RRF_score(d) = sum( 1 / (k + rank_i(d)) ) for each ranking system i

Where:
- d = document
- k = smoothing constant (default: 60)
- rank_i(d) = rank of document d in system i
```

### Implementation Example

```typescript
async function hybridSearch(query: string, limit: number = 10) {
  // 1. FTS5 keyword search
  const ftsResults = await db.all(`
    SELECT id, bm25(memory_fts) as fts_score
    FROM memory_fts WHERE memory_fts MATCH ?
    ORDER BY fts_score LIMIT ?
  `, [query, limit * 2]);

  // 2. Vector similarity search
  const embedding = await generateEmbedding(query);
  const vecResults = await db.all(`
    SELECT id, vec_distance_cosine(embedding, ?) as vec_score
    FROM memory_index WHERE embedding IS NOT NULL
    ORDER BY vec_score ASC LIMIT ?
  `, [embedding, limit * 2]);

  // 3. RRF fusion
  const k = 60;
  const scores = new Map();
  ftsResults.forEach((r, rank) => {
    scores.set(r.id, (scores.get(r.id) || 0) + 1 / (k + rank + 1));
  });
  vecResults.forEach((r, rank) => {
    scores.set(r.id, (scores.get(r.id) || 0) + 1 / (k + rank + 1));
  });

  return [...scores.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}
```

### Relevance Scoring

| Factor | Weight | Description |
|--------|--------|-------------|
| Hybrid RRF Score | 40% | Combined FTS5 + vector similarity |
| Importance Tier | 25% | Tier boost multiplier |
| Recency/Decay | 20% | Time-based decay factor |
| Keyword Overlap | 15% | Query keywords in anchor ID |

**Formula**: `score = (rrf*0.40 + tier_boost*0.25 + decay*0.20 + keywords*0.15) * 100`

### Fallback Behavior

| Scenario | Behavior |
|----------|----------|
| No FTS matches | Use vector-only results |
| No vector matches | Use FTS-only results |
| Both empty | Return empty with suggestion |
| Embedding unavailable | Fall back to FTS-only |

---

## 4. 📊 IMPORTANCE TIERS & DECAY

### Six-Tier System

| Tier | Description | Boost | Decay | Auto-Expire | Always Surface |
|------|-------------|-------|-------|-------------|----------------|
| `constitutional` | Universal rules, core constraints (~500 tokens) | 3.0x | No | Never | Yes |
| `critical` | Core decisions, architecture choices | 2.0x | No | Never | No |
| `important` | Key implementations, major features | 1.5x | No | Never | No |
| `normal` | Standard context, typical work | 1.0x | Yes | Never | No |
| `temporary` | Debugging sessions, experiments | 0.5x | Yes | 7 days | No |
| `deprecated` | Outdated info, superseded decisions | 0.0x | N/A | Manual | No (excluded) |

### Constitutional Tier

Constitutional memories are **always surfaced** at session start without needing a search query. Limited to ~500 tokens total.

**Use for:**
- Project-wide rules that should never be forgotten
- Critical constraints that apply to all work
- Lessons learned that prevent repeated mistakes

### Gate 3 Enforcement Example

Constitutional tier is used to enforce critical workflow rules. The Gate 3 enforcement memory demonstrates this pattern:

**Memory #132 - Gate 3 Spec Folder Enforcement:**

| Attribute | Value |
|-----------|-------|
| `importanceTier` | `constitutional` |
| `isConstitutional` | `true` |
| `similarity` | `100` (always surfaces at top) |
| `triggerCount` | 33 phrases |

**Trigger Phrase Categories:**

| Category | Phrases |
|----------|---------|
| **Create** | `create`, `add`, `generate`, `build`, `implement`, `write` |
| **Modify** | `modify`, `edit`, `update`, `change`, `refactor`, `fix` |
| **Delete** | `delete`, `remove`, `cleanup` |
| **Move** | `rename`, `move`, `migrate` |
| **Scale** | `comprehensive`, `all bugs`, `multiple files`, `codebase`, `entire`, `everything` |
| **Agents** | `parallel agents`, `15 agents`, `10 agents`, `dispatch agents` |
| **Compound** | `analyze and fix`, `find and fix`, `fix all`, `update all`, `modify all` |

**Response Behavior:**

When `includeConstitutional: true` (default), constitutional memories:
- Always appear at top of search results
- Return `similarity: 100` regardless of query
- Include `isConstitutional: true` flag in response
- Limited to ~500 tokens total budget

This ensures AI agents always see reminders about critical rules like asking for spec folder selection before file modifications.

**Reference:** See `specs/005-memory/018-gate3-enforcement/` for complete implementation.

### Memory Decay Formula

Time-based decay uses a 90-day half-life model, only applied to decay-enabled tiers (normal, temporary):

```
decayed_score = base_score * (0.5 ^ (days_since_creation / 90))
```

### Tier Decay Behavior

| Tier | Decay | Search Boost | Notes |
|------|-------|--------------|-------|
| `constitutional` | Disabled | 3.0x | Always surfaced, ~500 token budget |
| `critical` | Disabled | 2.0x | Preserved indefinitely |
| `important` | Disabled | 1.5x | Preserved indefinitely |
| `normal` | 90-day half-life | 1.0x | Standard decay behavior |
| `temporary` | 90-day half-life | 0.5x | Auto-expires after 7 days |
| `deprecated` | N/A | 0.0x | Excluded from search entirely |

### Disabling Decay

```typescript
// Per-search: disable decay
const results = await memory_search({
  query: "old authentication",
  useDecay: false  // Show all results without decay
});

// Per-memory: set high importance
await memory_update({
  id: 123,
  importanceWeight: 1.0  // Effective decay immunity
});
```

---

## 5. 🗄️ DATABASE SCHEMA

### Core Table: memory_index

```sql
CREATE TABLE memory_index (
  id INTEGER PRIMARY KEY,
  spec_folder TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  title TEXT,
  anchor_id TEXT,
  content TEXT,
  embedding BLOB,

  -- Metadata
  created_at TEXT DEFAULT (datetime('now')),
  created_at_epoch INTEGER,
  updated_at TEXT,

  -- Importance system
  importance_weight REAL DEFAULT 0.5,
  importance_tier TEXT CHECK(importance_tier IN (
    'constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'
  )) DEFAULT 'normal',

  -- Context classification
  context_type TEXT CHECK(context_type IN (
    'research', 'implementation', 'decision', 'discovery', 'general'
  )) DEFAULT 'general',

  -- Session tracking
  channel TEXT,
  session_id TEXT,

  -- Access tracking (for decay)
  access_count INTEGER DEFAULT 0,
  last_accessed TEXT,

  -- Validation tracking
  validation_count INTEGER DEFAULT 0,
  confidence_score REAL DEFAULT 0.5,

  -- Trigger phrases (JSON array)
  trigger_phrases TEXT DEFAULT '[]'
);

CREATE INDEX idx_memory_spec ON memory_index(spec_folder);
CREATE INDEX idx_memory_tier ON memory_index(importance_tier);
CREATE INDEX idx_memory_context ON memory_index(context_type);
CREATE INDEX idx_memory_created ON memory_index(created_at_epoch);
```

### Supporting Tables

```sql
-- Memory history for audit trail
CREATE TABLE memory_history (
  id INTEGER PRIMARY KEY,
  memory_id INTEGER NOT NULL,
  field_changed TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (memory_id) REFERENCES memory_index(id) ON DELETE CASCADE
);

-- Checkpoints for state management
CREATE TABLE checkpoints (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  memory_count INTEGER,
  snapshot_path TEXT,
  metadata TEXT  -- JSON blob
);

-- FTS5 for keyword search
CREATE VIRTUAL TABLE memory_fts USING fts5(
  title, content, anchor_id, spec_folder,
  content='memory_index', content_rowid='id',
  tokenize='porter unicode61'
);
```

### Context Types

| Type | Description | Use Case |
|------|-------------|----------|
| `research` | Investigation, analysis | Technical spikes, library evaluations |
| `implementation` | Code changes, feature builds | Active development work |
| `decision` | Architectural choices | ADRs, design decisions |
| `discovery` | Bugs found, unexpected behavior | Debugging sessions |
| `general` | Default catch-all | Unclassified context |

---

## 6. 🔧 CONFIGURATION

### config.jsonc

```jsonc
{
  "semantic": {
    "enabled": true,
    "model": "local",  // "local" | "openai"
    "dimensions": 768,  // nomic-embed-text-v1.5
    "indexPath": ".opencode/skill/system-memory/database/memory-index.sqlite"
  },
  "triggers": {
    "autoSaveInterval": 20,
    "phrases": ["save context", "document this"]
  },
  "memory": {
    "decay": {
      "enabled": true,
      "rates": {
        "constitutional": 0,
        "critical": 0.001,
        "important": 0.005,
        "normal": 0.01,
        "temporary": 0.05,
        "deprecated": 0.1
      },
      "minFloor": 0.1,
      "exemptTiers": ["constitutional", "critical"]
    },
    "defaultTier": "normal",
    "defaultContextType": "general"
  }
}
```

### Embedding Models

```javascript
// Default: Local embedding model via HuggingFace
const embedder = {
  model: 'nomic-embed-text-v1.5',
  dimensions: 768,       // Actual output dimensions
  matryoshka: true,      // Supports dimension reduction
  contextLength: 8192    // Max input tokens
};

// Vector storage: sqlite-vec extension
// CREATE VIRTUAL TABLE vec_memories USING vec0(embedding FLOAT[768])
```

---

## 7. ⏱️ PERFORMANCE

### Performance Targets

| Operation | Target | Typical |
|-----------|--------|---------|
| Hybrid search | <500ms | ~300ms |
| Vector-only search | <300ms | ~200ms |
| FTS-only search | <100ms | ~50ms |
| Trigger matching | <50ms | ~35ms |
| Embedding generation | <2s/file | ~1.5s |
| Index rebuild (50 files) | <60s | ~45s |

### Architecture

```
Memory Save → Content Extraction → Embedding Generation
                                          ↓
                              ┌───────────┴───────────┐
                              ↓                       ↓
                         Vector Index            FTS5 Index
                              ↓                       ↓
                              └───────────┬───────────┘
                                          ↓
Query → Query Embedding → Hybrid Search (RRF Fusion) → Ranked Results
                                          ↓
                                    Decay Applied → Final Scores
```

### Index Locations

| Component | Location |
|-----------|----------|
| MCP Server | `semantic-memory-mcp/` |
| SQLite Database | `.opencode/skill/system-memory/database/memory-index.sqlite` |
| Embeddings | sqlite-vec extension |
| FTS Index | SQLite FTS5 virtual table |

---

## 8. ⚠️ TROUBLESHOOTING

### Empty Search Results

```bash
# Check if index exists
ls -la .opencode/skill/system-memory/database/memory-index.sqlite

# Rebuild: restart MCP server (auto-rebuilds on startup)
# Or use checkpoint restore if available
```

### Slow Search Performance

```bash
# Check index size
sqlite3 .opencode/skill/system-memory/database/memory-index.sqlite "SELECT COUNT(*) FROM memory_index"

# Optimize via SQLite VACUUM
sqlite3 .opencode/skill/system-memory/database/memory-index.sqlite "VACUUM"
```

### Embedding Failures

```bash
# Check via MCP stats tool
# memory_stats() returns embedding model info

# Fall back to keyword search
grep -r "keyword" specs/*/memory/*.md
```

### FTS5 Out of Sync

```bash
# Rebuild FTS index
sqlite3 .opencode/skill/system-memory/database/memory-index.sqlite "INSERT INTO memory_fts(memory_fts) VALUES('rebuild')"
```

### Migration from v10 to v11

Migration is automatic on first access. New columns have sensible defaults:

| Column | Default |
|--------|---------|
| `importance_tier` | `'normal'` |
| `context_type` | `'general'` |
| `access_count` | `0` |
| `created_at_epoch` | Calculated from `created_at` |

---

## 9. ✅ USAGE EXAMPLES

### Basic Search

```typescript
// Natural language query via MCP
const results = await memory_search({
  query: "how did we implement authentication",
  limit: 5
});

// Output:
// [92%] specs/049-auth/memory/28-11-25_14-30__oauth.md
//       → OAuth callback flow with JWT tokens
```

### Multi-Concept AND Search

```typescript
// Finds documents matching ALL concepts
const results = await memory_search({
  concepts: ["oauth", "errors", "callback"]
});

// Output:
// [89%] specs/049-auth/memory/28-11-25_14-30__oauth.md
//       → Contains: oauth (5), errors (3), callback (7)
```

### Filter by Tier and Context

```typescript
// Find critical decisions about authentication
const results = await memory_search({
  query: "authentication",
  tier: "critical",
  contextType: "decision"
});
```

### Checkpoint Operations

```typescript
// Create checkpoint before major changes
await checkpoint_create({
  name: "pre-refactor-v2",
  description: "Before major auth system refactor"
});

// List available checkpoints
const checkpoints = await checkpoint_list();

// Restore if needed
await checkpoint_restore({ name: "pre-refactor-v2" });
```

### Validate and Promote

```typescript
// Validate memory accuracy (builds confidence)
await memory_validate({ id: 123, wasUseful: true });

// After 5+ validations at 90%+ confidence
// → Promotion to critical tier may be offered
```

### Trigger Phrase Matching

```typescript
// Fast trigger detection (<50ms)
const trigger = await memory_match_triggers({
  prompt: "save context for the auth work"
});
// Returns: { matched: true, trigger: 'save context', confidence: 0.95 }
```

---

## 10. 🔗 RELATED RESOURCES

### Auto-Indexing

Memory files are automatically indexed through multiple methods:

| Method | Trigger | Use Case |
|--------|---------|----------|
| Startup Scan | MCP server starts | Automatic (default) |
| File Watcher | `npm run watch` | Development sessions |
| CLI Indexer | `npm run index` | Manual/cron jobs |
| MCP Tools | `memory_save()` / `memory_index_scan()` | AI agent control |

**Content Hash Deduplication**: Files are only re-indexed when content changes (SHA-256 hash).

**CLI Commands:**
```bash
cd /path/to/semantic-memory

npm run watch              # Start file watcher
npm run index              # Run CLI indexer
npm run index -- --dry-run # Preview changes
npm run index -- --force   # Force re-index all
```

### Reference Files
- [execution_methods.md](./execution_methods.md) - Memory file detection and execution trigger patterns

### Related Skills
- `system-spec-kit` - Spec folder creation and template management
- `workflows-code` - Implementation workflow with browser verification

### External Resources
- [SQLite FTS5 Documentation](https://www.sqlite.org/fts5.html) - Full-text search implementation details
- [Reciprocal Rank Fusion Paper](https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf) - RRF score fusion algorithm
