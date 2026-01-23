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
- Session learning with preflight/postflight epistemic tracking
- Health monitoring and statistics reporting

**Architecture Pattern**: Each handler module is autonomous and follows a consistent pattern:
```
Receive args → Validate → Coordinate modules → Format response → Return MCP payload
```

**Database Tables Used**:

| Table | Handler Module | Purpose |
|-------|----------------|---------|
| `memories` | memory-crud, memory-save, memory-search | Core memory storage |
| `memory_fts` | memory-search | Full-text search (FTS5) |
| `trigger_phrases` | memory-triggers | Fast phrase matching |
| `checkpoints` | checkpoints | Database snapshots |
| `session_learning` | session-learning | Epistemic tracking |

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
  importanceTier: 'critical'
});

// Create checkpoint
const checkpoint = await handlers.handle_checkpoint_create({
  name: 'pre-refactor',
  metadata: { reason: 'safety checkpoint' }
});

// Track learning (preflight)
const preflight = await handlers.handle_task_preflight({
  specFolder: 'specs/003-memory',
  taskId: 'T1',
  knowledgeScore: 40,
  uncertaintyScore: 60,
  contextScore: 50,
  knowledgeGaps: ['API structure', 'Error handling']
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
├── checkpoints.js        # Checkpoint save/restore/list
└── session-learning.js   # Epistemic tracking (preflight/postflight)
```

### Handler Modules

| File | Handlers | Purpose |
|------|----------|---------|
| `index.js` | - | Aggregates all handlers and exposes unified interface |
| `memory-search.js` | `handle_memory_search` | Vector/hybrid/multi-concept search with relevance ranking |
| `memory-triggers.js` | `handle_memory_match_triggers` | Fast trigger phrase matching (SK-004 Memory Surface) |
| `memory-save.js` | `handle_memory_save`, `index_memory_file` | Memory creation with embedding generation |
| `memory-crud.js` | `handle_memory_delete`, `handle_memory_update`, `handle_memory_list`, `handle_memory_stats`, `handle_memory_health`, `handle_memory_validate` | Update, delete, list, stats, health, validation |
| `memory-index.js` | `handle_memory_index_scan`, `index_single_file`, `find_constitutional_files` | Index scanning, re-indexing, status management |
| `checkpoints.js` | `handle_checkpoint_create`, `handle_checkpoint_list`, `handle_checkpoint_restore`, `handle_checkpoint_delete` | Database snapshots for recovery and context switching |
| `session-learning.js` | `handle_task_preflight`, `handle_task_postflight`, `handle_get_learning_history` | Epistemic baseline/delta tracking with Learning Index |

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
  importanceTier: 'critical',      // Update tier
  allowPartialUpdate: true         // Proceed even if embedding fails
});

// Bulk delete with auto-checkpoint
const deleteResult = await handle_memory_delete({
  specFolder: 'specs/obsolete-feature',
  confirm: true  // Required for bulk operations
});
// Creates checkpoint: pre-cleanup-YYYY-MM-DDTHH-MM-SS
```

### Importance Tiers

The six-tier importance system controls memory surfacing and retention:

| Tier | Weight | Behavior |
|------|--------|----------|
| `constitutional` | 1.0 | Always surfaces at top of results |
| `critical` | 0.9 | High priority in search ranking |
| `important` | 0.7 | Elevated priority |
| `normal` | 0.5 | Standard treatment (default) |
| `temporary` | 0.3 | Lower priority, may be auto-cleaned |
| `deprecated` | 0.1 | Minimal surfacing, retained for reference |

### Index Management

**Scan and re-index** memories with status tracking.

```javascript
// Scan index for health issues
const scanResult = await handle_memory_index_scan({
  autoFix: true  // Automatically fix orphaned/missing embeddings
});

// Re-index specific folder
const reindexResult = await handle_memory_index_scan({
  specFolder: 'specs/new-feature',
  force: true  // Force new embeddings
});
```

### Checkpoints

**Save and restore** database state for safety and context switching.

```javascript
// Save checkpoint before risky operation
await handle_checkpoint_create({
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

### Session Learning

**Track epistemic state** across task execution with preflight/postflight pattern.

```javascript
// Before starting work - capture baseline
await handle_task_preflight({
  specFolder: 'specs/003-memory/077-upgrade',
  taskId: 'T1',
  knowledgeScore: 40,      // How well do you understand?
  uncertaintyScore: 60,    // How uncertain about approach?
  contextScore: 50,        // How complete is context?
  knowledgeGaps: ['API structure', 'Error handling patterns']
});

// After completing work - measure learning
await handle_task_postflight({
  specFolder: 'specs/003-memory/077-upgrade',
  taskId: 'T1',
  knowledgeScore: 75,
  uncertaintyScore: 25,
  contextScore: 85,
  gapsClosed: ['API structure'],
  newGapsDiscovered: ['Edge case handling']
});
// Response includes Learning Index calculation
```

**Learning Index Formula**:
```
LI = (Knowledge Delta x 0.4) + (Uncertainty Reduction x 0.35) + (Context Improvement x 0.25)
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

### Example 4: Learning History Analysis

```javascript
// Get learning history for a spec folder
const history = await handle_get_learning_history({
  specFolder: 'specs/003-memory/077-upgrade',
  onlyComplete: true,
  includeSummary: true
});

// Response includes:
// {
//   specFolder: 'specs/003-memory/077-upgrade',
//   count: 5,
//   learningHistory: [...],
//   summary: {
//     totalTasks: 5,
//     completedTasks: 5,
//     averageLearningIndex: 18.5,
//     interpretation: 'Positive learning trend - moderate knowledge improvement'
//   }
// }
```

### Common Patterns

| Pattern | Handler | When to Use |
|---------|---------|-------------|
| Search before load | `memory_search` with `includeContent: false` | Browse results before loading full content |
| Anchor filtering | `memory_search` with `anchors: [...]` | Load specific sections for token efficiency |
| Auto-checkpoint | `memory_delete` with `specFolder` | Safety before bulk deletes |
| Partial update | `memory_update` with `allowPartialUpdate: true` | Update even if embedding regeneration fails |
| Health check | `memory_health` | Monitor system status |
| Learning tracking | `task_preflight` then `task_postflight` | Measure epistemic progress |

---

## 6. 🔗 INTEGRATION

### context-server.js Integration

Handlers are imported and dispatched by `context-server.js`:

```javascript
// Import from handlers/index.js
const {
  handle_memory_search, handle_memory_match_triggers,
  handle_memory_delete, handle_memory_update, handle_memory_list,
  handle_memory_stats, handle_memory_health,
  handle_memory_save, index_memory_file,
  handle_memory_index_scan, index_single_file, find_constitutional_files,
  handle_checkpoint_create, handle_checkpoint_list,
  handle_checkpoint_restore, handle_checkpoint_delete,
  handle_memory_validate,
  handle_task_preflight, handle_task_postflight, handle_get_learning_history
} = require('./handlers');
```

**Tool Registration**: Each handler is registered as an MCP tool in `ListToolsRequestSchema`:
- `memory_search`, `memory_match_triggers`
- `memory_delete`, `memory_update`, `memory_list`, `memory_stats`
- `checkpoint_create`, `checkpoint_list`, `checkpoint_restore`, `checkpoint_delete`
- `memory_validate`, `memory_save`, `memory_index_scan`, `memory_health`
- `task_preflight`, `task_postflight`, `memory_get_learning_history`

**Tool Dispatch**: The `CallToolRequestSchema` handler dispatches to the appropriate handler function based on tool name.

---

## 7. 🛠️ TROUBLESHOOTING

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
await handle_memory_index_scan({
  force: true
});
```

#### Bulk Delete Without Checkpoint

**Symptom**: Warning about failed checkpoint creation

**Cause**: Database issues or disk space

**Solution**:
```javascript
// Manually create checkpoint first
await handle_checkpoint_create({ name: 'manual-backup' });

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
```javascript
// Check health status
await handle_memory_health({});
// Expected: embeddingModelReady: true, vectorSearchAvailable: true

// Check database
await handle_memory_stats({});
// Expected: totalMemories > 0

// Try trigger-based search as fallback
await handle_memory_match_triggers({ prompt: 'your query' });
```

#### Preflight Record Not Found

**Symptom**: `MemoryError: No preflight record found`

**Cause**: Calling `task_postflight` without prior `task_preflight`

**Solution**:
```javascript
// Always call preflight first
await handle_task_preflight({
  specFolder: 'specs/my-spec',
  taskId: 'T1',
  knowledgeScore: 50,
  uncertaintyScore: 50,
  contextScore: 50
});

// Then postflight
await handle_task_postflight({
  specFolder: 'specs/my-spec',  // Must match
  taskId: 'T1',                  // Must match
  knowledgeScore: 70,
  uncertaintyScore: 30,
  contextScore: 80
});
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Embedding failed on update | Use `allowPartialUpdate: true` |
| Bulk delete without backup | Set `confirm: true` (proceeds without checkpoint) |
| Search too slow | Use `searchType: 'trigger'` for fast phrase matching |
| Invalid importance tier | Use valid tiers: `constitutional`, `critical`, `important`, `normal`, `temporary`, `deprecated` |
| Memory not found by ID | Use `memory_list` to verify ID exists |
| Preflight missing | Call `task_preflight` before `task_postflight` |

---

## 8. 📚 RELATED DOCUMENTS

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

*Module version: 1.8.0 | Last updated: 2026-01-23*
