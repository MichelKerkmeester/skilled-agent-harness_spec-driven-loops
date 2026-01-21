# Handlers

> Request handlers for all MCP memory operations.

---

## 1. 📖 OVERVIEW

**Purpose**: Handlers are the entry points for all MCP tool calls. They validate arguments, coordinate between modules (vector index, embeddings, parsing), and format responses for the MCP protocol.

**Key Features**:
- Memory CRUD operations (create, read, update, delete, list)
- Multi-strategy search (vector, hybrid, multi-concept, trigger-based)
- Memory indexing and re-indexing operations
- Checkpoint save/restore for safety and context switching
- Health monitoring and statistics reporting

**Architecture Pattern**: Each handler module is autonomous and follows a consistent pattern:
```
Receive args → Validate → Coordinate modules → Format response → Return MCP payload
```

---

## 2. 🚀 QUICK START

### Handler Invocation

```javascript
const handlers = require('./handlers');

// Search for memories
const searchResult = await handlers.handle_memory_search({
  query: 'authentication workflow',
  searchType: 'hybrid',
  limit: 5
});

// Update memory metadata
const updateResult = await handlers.handle_memory_update({
  id: 'mem_123',
  title: 'Updated title',
  importanceTier: 'core'
});

// Create checkpoint
const checkpoint = await handlers.handle_checkpoint_save({
  name: 'pre-refactor',
  metadata: { reason: 'safety checkpoint' }
});
```

---

## 3. 📁 STRUCTURE

```
handlers/
├── index.js              # Module aggregator and exports
├── memory-search.js      # Search operations (vector, hybrid, multi-concept)
├── memory-triggers.js    # Trigger phrase matching and surfacing
├── memory-save.js        # Memory creation and indexing
├── memory-crud.js        # Update, delete, list, stats, health
├── memory-index.js       # Index management and re-indexing
└── checkpoints.js        # Checkpoint save/restore/list
```

### Key Files

| File | Purpose |
|------|---------|
| `index.js` | Aggregates all handlers and exposes unified interface |
| `memory-search.js` | Vector/hybrid/multi-concept search with relevance ranking |
| `memory-triggers.js` | Fast trigger phrase matching (SK-004 Memory Surface) |
| `memory-save.js` | Memory creation with embedding generation |
| `memory-crud.js` | Update, delete, list, stats, health endpoints |
| `memory-index.js` | Index scanning, re-indexing, status management |
| `checkpoints.js` | Database snapshots for recovery and context switching |

---

## 4. ⚡ FEATURES

### Memory Search

**Multi-Strategy Search**: Supports vector (semantic), hybrid (vector + keyword), multi-concept, and trigger-based search.

| Strategy | Use When | Example Query |
|----------|----------|---------------|
| **vector** | Semantic understanding needed | "How does authentication work?" |
| **hybrid** | Best of both worlds (default) | "login process implementation" |
| **multi-concept** | Multiple independent topics | concepts: ['auth', 'errors'] |
| **trigger** | Fast phrase matching | "gate 1 question" |

```javascript
// Hybrid search with anchor filtering
const result = await handle_memory_search({
  query: 'authentication flow',
  searchType: 'hybrid',
  limit: 5,
  includeContent: true,
  anchors: ['summary', 'decisions']  // Token optimization
});
```

### Memory CRUD Operations

**Create, Read, Update, Delete** with automatic embedding management.

```javascript
// Update with automatic embedding regeneration
const updateResult = await handle_memory_update({
  id: 'mem_123',
  title: 'New title',              // Triggers embedding regeneration
  importanceTier: 'core',           // Update tier
  allowPartialUpdate: true          // Proceed even if embedding fails
});

// Bulk delete with auto-checkpoint
const deleteResult = await handle_memory_delete({
  specFolder: 'specs/obsolete-feature',
  confirm: true  // Required for bulk operations
});
// Creates checkpoint: pre-cleanup-YYYY-MM-DDTHH-MM-SS
```

### Index Management

**Scan and re-index** memories with status tracking.

```javascript
// Scan index for health issues
const scanResult = await handle_memory_index_scan({
  autoFix: true  // Automatically fix orphaned/missing embeddings
});

// Re-index specific folder
const reindexResult = await handle_memory_index_reindex({
  specFolder: 'specs/new-feature',
  forceRegenerate: true  // Force new embeddings
});
```

### Checkpoints

**Save and restore** database state for safety and context switching.

```javascript
// Save checkpoint before risky operation
await handle_checkpoint_save({
  name: 'pre-cleanup',
  metadata: {
    reason: 'Safety before bulk delete',
    specFolder: 'specs/old-project'
  }
});

// Restore if something goes wrong
await handle_checkpoint_restore({
  name: 'pre-cleanup'
});
```

---

## 5. 💡 USAGE EXAMPLES

### Example 1: Search with Constitutional Priority

```javascript
// Constitutional memories always appear first
const result = await handle_memory_search({
  query: 'workflow process',
  searchType: 'hybrid',
  limit: 10
});

// Response structure:
// {
//   results: [
//     { title: 'Core Protocol', isConstitutional: true, ... },  // First
//     { title: 'Feature Spec', isConstitutional: false, ... }
//   ],
//   constitutionalCount: 1
// }
```

### Example 2: Folder-Based Statistics

```javascript
// Get top folders by activity
const stats = await handle_memory_stats({
  folderRanking: 'composite',    // composite | recency | importance | count
  excludePatterns: ['archived/', 'temp/'],
  includeArchived: false,
  limit: 10
});

// Response includes composite scores:
// topFolders: [
//   {
//     folder: 'specs/auth-system',
//     count: 15,
//     score: 0.92,
//     recencyScore: 0.95,
//     importanceScore: 0.88,
//     lastActivity: '2026-01-21T10:30:00Z'
//   }
// ]
```

### Example 3: Safe Bulk Operations

```javascript
// Delete all memories in a folder with auto-checkpoint
const result = await handle_memory_delete({
  specFolder: 'specs/deprecated-feature',
  confirm: true
});

// Response:
// {
//   deleted: 12,
//   checkpoint: 'pre-cleanup-2026-01-21T10-30-00',
//   restoreCommand: 'checkpoint_restore({ name: "pre-cleanup-2026-01-21T10-30-00" })'
// }

// If something goes wrong, restore:
await handle_checkpoint_restore({
  name: 'pre-cleanup-2026-01-21T10-30-00'
});
```

### Common Patterns

| Pattern | Handler | When to Use |
|---------|---------|-------------|
| Search before load | `memory_search` with `includeContent: false` | Browse results before loading full content |
| Anchor filtering | `memory_search` with `anchors: [...]` | Load specific sections for token efficiency |
| Auto-checkpoint | `memory_delete` with `specFolder` | Safety before bulk deletes |
| Partial update | `memory_update` with `allowPartialUpdate: true` | Update even if embedding regeneration fails |
| Health check | `memory_health` | Monitor system status |

---

## 6. 🛠️ TROUBLESHOOTING

### Common Issues

#### Embedding Regeneration Failed on Update

**Symptom**: `MemoryError: Embedding regeneration failed, update rolled back`

**Cause**: Embedding provider unavailable or title too long

**Solution**:
```javascript
// Option 1: Allow partial update
await handle_memory_update({
  id: 'mem_123',
  title: 'New title',
  allowPartialUpdate: true  // Marks for re-index instead of failing
});

// Option 2: Re-index later
await handle_memory_index_reindex({
  forceRegenerate: true
});
```

#### Bulk Delete Without Checkpoint

**Symptom**: Warning about failed checkpoint creation

**Cause**: Database issues or disk space

**Solution**:
```javascript
// Manually create checkpoint first
await handle_checkpoint_save({ name: 'manual-backup' });

// Then delete with confirm
await handle_memory_delete({
  specFolder: 'specs/old',
  confirm: true
});
```

#### Search Returns No Results

**Symptom**: `count: 0, results: []`

**Cause**: Embedding model not ready, empty database, or query mismatch

**Solution**:
```bash
# Check health status
await handle_memory_health({});
# Expected: embeddingModelReady: true, vectorSearchAvailable: true

# Check database
await handle_memory_stats({});
# Expected: totalMemories > 0

# Try trigger-based search as fallback
await handle_memory_match_triggers({ query: 'your query' });
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Embedding failed on update | Use `allowPartialUpdate: true` |
| Bulk delete without backup | Set `confirm: true` (proceeds without checkpoint) |
| Search too slow | Use `searchType: 'trigger'` for fast phrase matching |
| Invalid importance tier | Use valid tiers: `constitutional`, `core`, `significant`, `routine`, `peripheral`, `deprecated` |
| Memory not found by ID | Use `memory_list` to verify ID exists |

---

## 7. 📚 RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../formatters/README.md](../formatters/README.md) | Output formatting used by handlers |
| [../lib/search/README.md](../lib/search/README.md) | Vector search implementation |
| [../lib/storage/README.md](../lib/storage/README.md) | Database and checkpoint storage |
| [../../references/memory/memory_system.md](../../references/memory/memory_system.md) | Memory system architecture |

### External Resources

| Resource | Description |
|----------|-------------|
| [MCP Tools](https://spec.modelcontextprotocol.io/specification/server/tools/) | MCP tool interface specification |
| [SQLite FTS5](https://www.sqlite.org/fts5.html) | Full-text search used in hybrid mode |

---

*Module version: 1.7.2 | Last updated: 2026-01-21*
