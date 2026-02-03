# Storage Layer

> Persistence layer for the Spec Kit Memory MCP server - handles memory indexing, checkpoints, history tracking, causal graphs, and atomic file operations.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 📁 STRUCTURE](#2--structure)
- [3. ⚡ FEATURES](#3--features)
- [4. 💡 USAGE EXAMPLES](#4--usage-examples)
- [5. 🛠️ TROUBLESHOOTING](#5--troubleshooting)
- [6. 🔗 RELATED RESOURCES](#6--related-resources)

---

## 1. 📖 OVERVIEW

The storage layer provides all persistence operations for the Spec Kit Memory MCP server. It manages memory state across sessions, tracks access patterns for relevance scoring, maintains modification history with undo support, and enables causal relationship mapping between memories.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Modules | 8 | Core persistence modules |
| Relationship Types | 6 | Causal edge types for decision lineage |
| Performance | 10-100x | Faster re-indexing with incremental updates |

### Key Features

| Feature | Description |
|---------|-------------|
| **Incremental Indexing** | Content hash + mtime diff updates skip unchanged files (10-100x faster) |
| **Causal Edges** | 6 relationship types model decision lineage between memories |
| **Checkpoints** | State snapshots with embedding preservation for rollback |
| **Atomic Transactions** | File write + index insert wrapped atomically with rollback |
| **Access Tracking** | Batched updates minimize I/O while tracking usage for relevance boost |
| **History/Undo** | Full modification history with undo support |

---

## 2. 📁 STRUCTURE

```
storage/
├── index.js               # Module aggregator - exports all storage functions
├── access-tracker.js      # Track memory access for usage boost scoring
├── causal-edges.js        # Causal graph storage with 6 relationship types
├── checkpoints.js         # State snapshots with embedding preservation
├── history.js             # Modification history with undo support
├── incremental-index.js   # Content hash + mtime diff updates
├── index-refresh.js       # Index maintenance and status tracking
├── transaction-manager.js # Atomic file + index operations
└── README.md              # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `access-tracker.js` | Tracks memory access patterns with batched updates for +15% relevance boost |
| `causal-edges.js` | Stores causal relationships (caused, enabled, supersedes, contradicts, derived_from, supports) |
| `checkpoints.js` | Creates/restores named checkpoints with compressed snapshots and embeddings |
| `history.js` | Records ADD/UPDATE/DELETE events with prev/new values for undo |
| `incremental-index.js` | Determines which files need re-indexing via mtime fast path |
| `index-refresh.js` | Tracks embedding status (pending/success/failed/retry) |
| `transaction-manager.js` | Ensures file writes and index inserts are atomic |

---

## 3. ⚡ FEATURES

### Incremental Indexing (v1.2.0)

**Purpose**: Skip unchanged files during re-indexing for 10-100x performance improvement.

| Aspect | Details |
|--------|---------|
| **Fast Path** | If mtime unchanged, skip hash check entirely |
| **Content Hash** | SHA-256 hash detects actual content changes |
| **Mtime Update** | Files touched but unchanged get mtime update only |

Decision logic:
1. File not in database -> reindex (new file)
2. Mtime unchanged -> skip (fast path, no hash check)
3. Mtime changed but hash same -> update mtime only
4. Mtime and hash changed -> reindex (content changed)

### Causal Edges (v1.2.0)

**Purpose**: Model decision lineage and memory relationships with 6 relationship types.

| Relation | Meaning |
|----------|---------|
| `caused` | A caused B to be created |
| `enabled` | A enabled/unlocked B |
| `supersedes` | A replaces/supersedes B |
| `contradicts` | A contradicts B |
| `derived_from` | A was derived from B |
| `supports` | A supports/reinforces B |

Supports depth-limited traversal (max 3 hops) for "why" queries.

### Checkpoints

**Purpose**: Create named snapshots of memory state for rollback/recovery.

| Aspect | Details |
|--------|---------|
| **Compression** | gzip compression reduces storage |
| **Embeddings** | Preserves embeddings for instant semantic search after restore |
| **Working Memory** | Optional backup of working_memory state (v1.7.1) |
| **TTL** | 30-day retention with last_used_at tracking |
| **Limit** | Max 10 checkpoints per spec folder |

### Access Tracking

**Purpose**: Track memory access patterns for usage-based relevance boost.

| Aspect | Details |
|--------|---------|
| **Batching** | Accumulates accesses, flushes after threshold (5 accesses) |
| **Usage Boost** | Frequently-accessed memories get up to +50% relevance boost |
| **Formula** | `min(1.5, 1.0 + accessCount * 0.05)` |

### Transaction Manager

**Purpose**: Ensure atomic file write + index insert operations.

| Aspect | Details |
|--------|---------|
| **Atomic Write** | Write to temp file, then rename |
| **Rollback** | Delete file on index failure |
| **Pending Recovery** | Rename to `*_pending` suffix for later recovery |
| **Metrics** | Tracks success/failure/rollback counts |

---

## 4. 💡 USAGE EXAMPLES

### Example 1: Check if File Needs Re-indexing

```javascript
const { should_reindex } = require('./storage/incremental-index');

const decision = should_reindex(db, '/path/to/file.md');

if (decision.reindex) {
  console.log(`Re-index needed: ${decision.reason}`);
  // Reasons: new_file, content_changed, embedding_pending, force_requested
} else {
  console.log(`Skip: ${decision.reason}`);
  // Reasons: mtime_unchanged (fast path), content_unchanged
}
```

### Example 2: Create and Traverse Causal Edges

```javascript
const { insert_edge, get_causal_chain, RELATION_TYPES } = require('./storage/causal-edges');

// Create edge
insert_edge(db, {
  source_id: 'memory-123',
  target_id: 'memory-456',
  relation: RELATION_TYPES.CAUSED,
  strength: 0.9,
  evidence: 'Decision A led to implementation B'
});

// Traverse chain (max 3 hops)
const chain = get_causal_chain(db, 'memory-123', {
  max_depth: 3,
  direction: 'outgoing'
});

console.log(`Found ${chain.total_edges} related edges`);
console.log(`By cause: ${chain.by_cause.length}`);
```

### Example 3: Create Checkpoint with Embeddings

```javascript
const { create, restore } = require('./storage/checkpoints');

// Create checkpoint
const checkpointId = create('before-refactor', {
  specFolder: 'specs/005-feature',
  metadata: { reason: 'Pre-refactoring snapshot' }
});

// Restore checkpoint
const result = restore('before-refactor', {
  clearExisting: true,
  reinsertMemories: true
});

console.log(`Restored ${result.restored} memories, ${result.embeddingsRestored} embeddings`);
```

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| Batch categorize | `categorize_files_for_indexing(db, paths)` | Pre-filter files before indexing |
| Track access | `track_access(id)` | After memory is retrieved |
| Record history | `record_history(db, { memory_id, event: 'UPDATE', ... })` | After modifying memory |
| Undo change | `undo_last_change(db, memory_id)` | Revert last modification |
| Atomic save | `execute_atomic_save({ file_path, content, index_fn })` | File + index together |

---

## 5. 🛠️ TROUBLESHOOTING

### Common Issues

#### Embeddings Not Restored After Checkpoint Restore

**Symptom**: Semantic search returns no results after restoring checkpoint.

**Cause**: Embedding dimension mismatch between checkpoint and current provider.

**Solution**:
```bash
# Run memory_index_scan to regenerate embeddings
memory_index_scan({ specFolder: "specs/your-folder" })
```

#### High Pending Count Warning

**Symptom**: Log shows "High pending count: N. Consider background indexing."

**Cause**: Many files queued for embedding generation.

**Solution**:
```javascript
// Check status
const stats = get_index_stats(db);
console.log(`Pending: ${stats.pending}, Failed: ${stats.failed}`);

// Reset failed to retry
reset_failed(db, { spec_folder: 'specs/your-folder' });
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Stale mtime cache | Files appear unchanged when modified |
| Orphaned edges | `find_orphaned_edges(db)` to detect, manual cleanup |
| Checkpoint too large | Split by spec_folder, max 100MB |
| Transaction rollback | Check `get_metrics()` for failure reasons |

### Diagnostic Commands

```javascript
// Check index status
const { get_index_stats } = require('./storage/index-refresh');
console.log(get_index_stats(db));

// Check causal graph health
const { get_graph_stats, find_orphaned_edges } = require('./storage/causal-edges');
console.log(get_graph_stats(db));
console.log(find_orphaned_edges(db));

// Check transaction metrics
const { get_metrics } = require('./storage/transaction-manager');
console.log(get_metrics());

// Check history stats
const { get_history_stats } = require('./storage/history');
console.log(get_history_stats(db));
```

---

## 6. 🔗 RELATED RESOURCES

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../README.md](../README.md) | Parent lib directory overview |
| [../cognitive/README.md](../cognitive/README.md) | Cognitive processing modules |
| [../session/README.md](../session/README.md) | Session management modules |

### Related Modules

| Module | Purpose |
|--------|---------|
| `context-server.js` | MCP server that uses storage layer |
| `shared/embeddings.js` | Embedding generation for checkpoints |
| `scripts/memory/` | Memory save/generation scripts |

---

*Documentation version: 1.0 | Last updated: 2026-02-02 | Storage layer v1.2.0*
