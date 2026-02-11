# Handlers

> Request handlers for all MCP memory operations.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. ⚡ FEATURES](#4--features)
- [5. 💡 USAGE EXAMPLES](#5--usage-examples)
- [6. 🔗 INTEGRATION](#6--integration)
- [7. 🛠️ TROUBLESHOOTING](#7--troubleshooting)
- [8. 📚 RELATED DOCUMENTS](#8--related-documents)

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
| `memory_conflicts` | memory-save | PE gate audit logging |

---

## 2. 🚀 QUICK START

### Handler Invocation

```typescript
import {
  handle_memory_search,
  handle_memory_update,
  handle_checkpoint_create,
  handle_task_preflight
} from './handlers';

// Search for memories (hybrid is the default strategy)
const searchResult = await handle_memory_search({
  query: 'authentication workflow',
  limit: 5
});

// Update memory metadata
const updateResult = await handle_memory_update({
  id: 'mem_123',
  title: 'Updated title',
  importanceTier: 'critical'
});

// Create checkpoint
const checkpoint = await handle_checkpoint_create({
  name: 'pre-refactor',
  metadata: { reason: 'safety checkpoint' }
});

// Track learning (preflight)
const preflight = await handle_task_preflight({
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
├── index.ts              # Module aggregator and exports (TypeScript barrel export)
├── types.ts              # Shared interfaces (MCPResponse, Database, EmbeddingProfile, etc.)
├── memory-search.ts      # Search operations (vector, hybrid, multi-concept)
├── memory-triggers.ts    # Trigger phrase matching and surfacing
├── memory-save.ts        # Memory creation and indexing
├── memory-crud.ts        # Update, delete, list, stats, health
├── memory-index.ts       # Index management and re-indexing
├── checkpoints.ts        # Checkpoint save/restore/list
├── session-learning.ts   # Epistemic tracking (preflight/postflight)
├── memory-context.ts     # Unified context entry point
└── causal-graph.ts       # Causal relationship operations
```

### Handler Modules

> **Export Convention**: All handlers export both camelCase (primary) and snake_case (backward-compatible alias) names. For example: `handleMemorySearch` (primary) and `handle_memory_search` (alias). Both are functional and interchangeable.

| File | Barrel Exports (via `index.ts`) | Purpose |
|------|----------|---------|
| `types.ts` | (imported directly, not re-exported) | Shared interfaces: `MCPResponse`, `Database`, `DatabaseExtended`, `EmbeddingProfile`, `EmbeddingProfileExtended`, `IntentClassification` |
| `index.ts` | - | Aggregates all handlers and exposes unified interface (TypeScript barrel export) |
| `memory-search.ts` | `handleMemorySearch` | Vector/hybrid/multi-concept search with relevance ranking + Testing Effect integration |
| `memory-triggers.ts` | `handleMemoryMatchTriggers` | Fast trigger phrase matching (SK-004 Memory Surface) |
| `memory-save.ts` | `handleMemorySave`, `indexMemoryFile`, `atomicSaveMemory`, `getAtomicityMetrics` | Memory creation with embedding generation + Prediction Error Gating. Additional direct exports: `findSimilarMemories`, `reinforceExistingMemory`, `markMemorySuperseded`, `updateExistingMemory`, `logPeDecision`, `escapeLikePattern`, `processCausalLinks`, `resolveMemoryReference`, `CAUSAL_LINK_MAPPINGS` |
| `memory-crud.ts` | `handleMemoryDelete`, `handleMemoryUpdate`, `handleMemoryList`, `handleMemoryStats`, `handleMemoryHealth`, `setEmbeddingModelReady` | Update, delete, list, stats, health operations, embedding model initialization |
| `memory-index.ts` | `handleMemoryIndexScan`, `indexSingleFile`, `findConstitutionalFiles` | Index scanning (params: `specFolder`, `force`, `includeConstitutional`), re-indexing, status management |
| `checkpoints.ts` | `handleCheckpointCreate`, `handleCheckpointList`, `handleCheckpointRestore`, `handleCheckpointDelete`, `handleMemoryValidate` | Database snapshots for recovery and context switching |
| `session-learning.ts` | `handleTaskPreflight`, `handleTaskPostflight`, `handleGetLearningHistory` | Epistemic baseline/delta tracking with Learning Index. Additional direct export: `ensureSchema` |
| `memory-context.ts` | `handleMemoryContext` | Unified context entry with intent awareness. Additional direct exports: `CONTEXT_MODES`, `INTENT_TO_MODE` |
| `causal-graph.ts` | `handleMemoryDriftWhy`, `handleMemoryCausalLink`, `handleMemoryCausalStats`, `handleMemoryCausalUnlink` | Causal edge CRUD, graph traversal, decision lineage |

---

## 4. ⚡ FEATURES

### Prediction Error Gating (memory-save.ts)

**Purpose**: Prevents duplicate memories and handles conflicts intelligently using similarity thresholds. Thresholds are defined in `lib/cognitive/prediction-error-gate.ts`.

| Similarity | Action | Description |
|------------|--------|-------------|
| >= 0.95 | REINFORCE | Strengthen existing memory, skip create |
| 0.85-0.94 | UPDATE or SUPERSEDE | UPDATE existing if consistent; SUPERSEDE if contradiction detected |
| 0.70-0.84 | CREATE_LINKED | Create new memory with causal link to existing |
| < 0.70 | CREATE | Create new memory |

**Barrel exports** (available via `handlers/index.ts`): `handleMemorySave`/`handle_memory_save`, `indexMemoryFile`/`index_memory_file`, `atomicSaveMemory`/`atomic_save_memory`, `getAtomicityMetrics`/`get_atomicity_metrics`

**Additional exports** (available via direct import from `memory-save.ts` only): `findSimilarMemories`, `reinforceExistingMemory`, `markMemorySuperseded`, `updateExistingMemory`, `logPeDecision`, `escapeLikePattern`, `processCausalLinks`, `resolveMemoryReference`, `CAUSAL_LINK_MAPPINGS` (and their snake_case aliases)

### Testing Effect (memory-search.ts)

**Purpose**: Accessing memories strengthens them via "desirable difficulty" principle from cognitive science.

- Lower retrievability at access time = greater stability boost
- Automatically applied on search results retrieval
- Implements spacing effect for long-term retention
- Uses `strengthenOnAccess` function defined locally within `memory-search.ts`

### Memory Search

**Multi-Strategy Search**: Supports vector (semantic), hybrid (vector + keyword), multi-concept, and trigger-based search. Hybrid is the default and primary strategy; search strategy is determined automatically based on the arguments provided.

| Strategy | Use When | How to Invoke |
|----------|----------|---------------|
| **hybrid** (default) | Best of both worlds | `query: "login process"` |
| **multi-concept** | Multiple independent topics | `concepts: ['auth', 'errors']` |
| **trigger** | Fast phrase matching | Use `handle_memory_match_triggers` handler instead |

**SearchArgs Parameters** (defined in `memory-search.ts`):

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | string | - | Natural language search query |
| `concepts` | string[] | - | Multiple concepts for AND search (2-5 concepts) |
| `specFolder` | string | - | Limit search to specific spec folder |
| `limit` | number | 10 | Maximum results to return |
| `tier` | string | - | Filter by importance tier |
| `contextType` | string | - | Filter by context type |
| `useDecay` | boolean | true | Apply temporal decay scoring |
| `includeContiguity` | boolean | false | Include adjacent/contiguous memories |
| `includeConstitutional` | boolean | true | Include constitutional tier memories at top |
| `includeContent` | boolean | false | Include full file content in results |
| `anchors` | string[] | - | Filter content to specific anchors (requires `includeContent: true`) |
| `bypassCache` | boolean | false | Bypass tool cache |
| `sessionId` | string | - | Session ID for deduplication |
| `enableDedup` | boolean | true | Enable session deduplication |
| `intent` | string | - | Task intent for weight adjustments (`add_feature`, `fix_bug`, `refactor`, `security_audit`, `understand`) |
| `autoDetectIntent` | boolean | true | Auto-detect intent from query |
| `minState` | string | - | Minimum memory state filter (HOT, WARM, COLD, DORMANT, ARCHIVED) |
| `applyStateLimits` | boolean | false | Apply state-based result limits |
| `rerank` | boolean | false | Enable cross-encoder reranking |
| `applyLengthPenalty` | boolean | false | Penalize overly long memories |

```typescript
import { handle_memory_search } from './handlers';

// Search with anchor filtering (hybrid is the default strategy)
const result = await handle_memory_search({
  query: 'authentication flow',
  limit: 5,
  includeContent: true,
  anchors: ['summary', 'decisions']  // Token optimization
});
```

### Memory CRUD Operations

**Create, Read, Update, Delete** with automatic embedding management.

```typescript
import { handle_memory_update, handle_memory_delete } from './handlers';

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

```typescript
import { handle_memory_index_scan } from './handlers';

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

```typescript
import { handle_checkpoint_create, handle_checkpoint_restore } from './handlers';

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

```typescript
import { handle_task_preflight, handle_task_postflight } from './handlers';

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

```typescript
import { handle_memory_search } from './handlers';

// Constitutional memories always appear first
const result = await handle_memory_search({
  query: 'workflow process',
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

```typescript
import { handle_memory_stats } from './handlers';

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

```typescript
import { handle_memory_delete, handle_checkpoint_restore } from './handlers';

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

```typescript
import { handle_get_learning_history } from './handlers';

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

### context-server.ts Integration

Handlers are imported and dispatched by `context-server.ts`:

```typescript
// Import from handlers/index.ts (compiled to dist/handlers/index.js at runtime)
// Both camelCase (primary) and snake_case (alias) exports are available.
import {
  handleMemorySearch, handleMemoryMatchTriggers,
  handleMemoryDelete, handleMemoryUpdate, handleMemoryList,
  handleMemoryStats, handleMemoryHealth, setEmbeddingModelReady,
  handleMemorySave, indexMemoryFile,
  handleMemoryIndexScan, indexSingleFile, findConstitutionalFiles,
  handleCheckpointCreate, handleCheckpointList,
  handleCheckpointRestore, handleCheckpointDelete,
  handleMemoryValidate,
  handleTaskPreflight, handleTaskPostflight, handleGetLearningHistory,
  handleMemoryContext,
  handleMemoryDriftWhy, handleMemoryCausalLink,
  handleMemoryCausalStats, handleMemoryCausalUnlink,
  atomicSaveMemory, getAtomicityMetrics,
} from './handlers';
```

**Tool Registration**: Each handler is registered as an MCP tool in `ListToolsRequestSchema`:
- `memory_search`, `memory_match_triggers`
- `memory_delete`, `memory_update`, `memory_list`, `memory_stats`, `memory_health`
- `checkpoint_create`, `checkpoint_list`, `checkpoint_restore`, `checkpoint_delete`
- `memory_validate`, `memory_save`, `memory_index_scan`
- `task_preflight`, `task_postflight`, `memory_get_learning_history`
- `memory_context`
- `memory_drift_why`, `memory_causal_link`, `memory_causal_unlink`, `memory_causal_stats`

**Tool Dispatch**: The `CallToolRequestSchema` handler dispatches to the appropriate handler function based on tool name.

---

## 7. 🛠️ TROUBLESHOOTING

### Common Issues

#### Embedding Regeneration Failed on Update

**Symptom**: `MemoryError: Embedding regeneration failed, update rolled back`

**Cause**: Embedding provider unavailable or title too long

**Solution**:
```typescript
import { handle_memory_update, handle_memory_index_scan } from './handlers';

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
```typescript
import { handle_checkpoint_create, handle_memory_delete } from './handlers';

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
```typescript
import { handle_memory_health, handle_memory_stats, handle_memory_match_triggers } from './handlers';

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
```typescript
import { handle_task_preflight, handle_task_postflight } from './handlers';

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
| Search too slow | Use `handle_memory_match_triggers` for fast phrase matching |
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

*Module version: 1.7.2 | Last updated: 2026-02-08*
