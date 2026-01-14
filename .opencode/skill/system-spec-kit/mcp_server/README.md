# Spec Kit Memory MCP Server

Context preservation with **spec kit memory** (v17.1): six-tier importance system, hybrid search (FTS5 + vector), exponential decay for recency boosting, checkpoint save/restore, and **cognitive memory features** (working memory with HOT/WARM/COLD tiers, turn-based attention decay, spreading co-activation). Provides **14 MCP tools** and **28 library modules** for intelligent memory management. This is a **Native MCP tool** - call it directly.

> **Navigation**:
> - New to Spec Kit Memory? Start with [Overview](#1--overview)
> - Need tool reference? See [MCP Tools](#2--mcp-tools-14)
> - Configuration help? See [Configuration](#5--configuration)
> - Troubleshooting? See [Troubleshooting](#7--troubleshooting)

[![MCP](https://img.shields.io/badge/MCP-compatible-blue.svg)](https://modelcontextprotocol.io)

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🔧 MCP TOOLS (14)](#2--mcp-tools-14)
- [3. 📁 LIBRARY MODULES (28)](#3--library-modules-28)
- [4. 🔄 FILE WATCHER](#4--file-watcher)
- [5. ⚙️ CONFIGURATION](#5--configuration)
- [6. 🚀 INSTALLATION](#6--installation)
- [7. 🛠️ TROUBLESHOOTING](#7--troubleshooting)
- [8. 📚 RELATED RESOURCES](#8--related-resources)

---

## 1. 📖 OVERVIEW

### What This Folder Contains

The `mcp_server/` folder is the standalone MCP server implementation for spec kit memory operations. It exposes memory tools via the Model Context Protocol for use by AI assistants like Claude and OpenCode.

### Entry Points

| File                | Purpose         | How to Run                           |
| ------------------- | --------------- | ------------------------------------ |
| `context-server.js` | Main MCP server | `node context-server.js` (via stdio) |

> **Note:** File watching functionality is not currently implemented. Use `memory_index_scan` for manual re-indexing.

### Key Features

| Feature                  | Description                                                   |
| ------------------------ | ------------------------------------------------------------- |
| **14 MCP Tools**         | Complete CRUD + search operations for memory management       |
| **Hybrid Search**        | FTS5 keyword + vector semantic search with RRF fusion         |
| **Multi-Provider Embeddings** | HF Local (768d), Voyage AI (1024d), OpenAI (1536d) - auto-detected |
| **Six Importance Tiers** | constitutional/critical/important/normal/temporary/deprecated |
| **Checkpoints**          | Save/restore memory state for safety                          |
| **Auto-Indexing**        | Startup scan for automatic indexing (file watcher not yet implemented) |
| **Auto Memory Surfacing** | SK-004: Automatically surfaces constitutional + triggered memories on tool calls |

### Constitutional Tier

The **constitutional** tier is the highest importance level, designed for operational rules and critical context that must ALWAYS be visible to the AI agent.

| Behavior             | Description                                                |
| -------------------- | ---------------------------------------------------------- |
| **Always surfaces**  | Included at top of every `memory_search` result by default |
| **Fixed similarity** | Returns `similarity: 100` regardless of query relevance    |
| **Response flag**    | `isConstitutional: true` in search results                 |
| **Token budget**     | ~2000 tokens max for constitutional memories per search     |
| **Control**          | Set `includeConstitutional: false` to disable              |

**Use cases:**
- Gate enforcement rules (e.g., Gate 3 spec folder question)
- Safety constraints and hard blockers
- User preferences that apply globally

**Reference:** See `specs/005-memory/018-gate3-enforcement/` for implementation example.

### SK-004: Auto Memory Surfacing

The **SK-004 Memory Surface Hook** automatically injects relevant context when memory-aware tools are invoked. This provides bonus context without explicit searching.

| Aspect | Details |
| ------ | ------- |
| **Trigger** | Any call to memory-aware tools (see below) |
| **What surfaces** | Constitutional memories + triggered memories matching query |
| **Response field** | `auto_surfaced_context` added to tool response |
| **Cache TTL** | 60 seconds for constitutional memories |

**Memory-Aware Tools:**
- `memory_search`
- `memory_match_triggers`
- `memory_list`
- `memory_save`
- `memory_index_scan`

**Response Structure:**
```json
{
  "auto_surfaced_context": {
    "constitutional": [
      { "id": 1, "specFolder": "...", "title": "...", "importanceTier": "constitutional" }
    ],
    "triggered": [
      { "memory_id": 5, "spec_folder": "...", "title": "...", "matched_phrases": ["fix", "implement"] }
    ],
    "surfaced_at": "2026-01-14T...",
    "latency_ms": 12
  }
}
```

**Value:** When using memory tools, you automatically get relevant rules and context injected - no explicit search needed.

**Reference:** See `specs/005-hooks/002-hook-analysis/implementation-summary.md` for implementation details.

### v17.1: Cognitive Memory Features

The cognitive memory system (v17.1) implements a biologically-inspired working memory model with attention-based activation, decay, and spreading activation for related memories.

#### Cognitive Memory Flow

When `session_id` and `turn_number` are passed to `memory_match_triggers`:

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. DECAY     │ Apply turn-based decay to all working memory     │
│              │ scores (default rate: 0.80 per turn)             │
├──────────────┼──────────────────────────────────────────────────┤
│ 2. MATCH     │ Find memories matching trigger phrases in prompt │
├──────────────┼──────────────────────────────────────────────────┤
│ 3. ACTIVATE  │ Set matched memories to attention score = 1.0    │
├──────────────┼──────────────────────────────────────────────────┤
│ 4. CO-ACTIVATE │ Boost related memories via spreading activation │
│              │ (+0.35 boost to semantically related memories)   │
├──────────────┼──────────────────────────────────────────────────┤
│ 5. CLASSIFY  │ Assign HOT/WARM/COLD tiers based on score        │
├──────────────┼──────────────────────────────────────────────────┤
│ 6. RETURN    │ Tiered content (HOT=full, WARM=summary, COLD=skip)│
└─────────────────────────────────────────────────────────────────┘
```

#### Tier System

| Tier | Score Range | Content Returned | Max Items |
| ---- | ----------- | ---------------- | --------- |
| HOT  | >= 0.8      | Full content     | 5         |
| WARM | 0.25-0.79   | Summary only     | 10        |
| COLD | < 0.25      | Not returned     | -         |

#### Configuration

```javascript
WORKING_MEMORY_CONFIG = {
  defaultDecayRate: 0.80,      // Multiplied each turn
  hotThreshold: 0.8,           // Score >= this = HOT
  warmThreshold: 0.25,         // Score >= this = WARM
  maxHotMemories: 5,           // Cap on HOT tier returns
  maxWarmMemories: 10,         // Cap on WARM tier returns
  coActivationBoost: 0.35      // Added to related memories
}
```

**Importance Tier Decay Rates:**

| Category | Tier | Decay Rate | Behavior |
| -------- | ---- | ---------- | -------- |
| **Protected** | `constitutional` | 1.0 | Never decays |
| **Protected** | `critical` | 1.0 | Never decays |
| **Protected** | `important` | 1.0 | Never decays |
| **Protected** | `deprecated` | 1.0 | Never decays (but excluded from results) |
| **Decaying** | `normal` | 0.80 | Standard decay per turn |
| **Decaying** | `temporary` | 0.60 | Fast decay per turn |

**Note:** Decay rates determine how quickly memories fade from working memory. Protected tiers maintain full attention score indefinitely, while decaying tiers lose relevance over conversation turns.

```javascript
// Example: After 5 turns with no re-activation
// normal tier:    1.0 → 0.80 → 0.64 → 0.51 → 0.41 → 0.33
// temporary tier: 1.0 → 0.60 → 0.36 → 0.22 → 0.13 → 0.08
```

#### New Parameters for memory_match_triggers

| Parameter          | Type    | Default | Description                                |
| ------------------ | ------- | ------- | ------------------------------------------ |
| `session_id`       | string  | -       | Session identifier for cognitive features  |
| `turn_number`      | number  | 1       | Current conversation turn for decay calc   |
| `include_cognitive`| boolean | true    | Enable cognitive features when session set |

#### Response Format Changes

When cognitive features are enabled, the response includes a `cognitive` field with processing statistics:

```json
{
  "matches": [...],
  "cognitive": {
    "decayApplied": true,
    "memoriesActivated": 3,
    "coActivations": 7,
    "tierDistribution": {
      "hot": 2,
      "warm": 5,
      "cold": 12
    },
    "sessionId": "session-123",
    "turnNumber": 5
  }
}
```

#### Feature Flags

| Flag                    | Default | Description                              |
| ----------------------- | ------- | ---------------------------------------- |
| `ENABLE_WORKING_MEMORY` | true    | Enable working memory system             |
| `ENABLE_CO_ACTIVATION`  | true    | Enable spreading activation for related  |

#### Three-Layer Memory Model

```
┌─────────────────────────────────────────────────────────────────┐
│ LAYER 1: WORKING MEMORY (v17.1)                                 │
│   • Session-scoped attention scores                             │
│   • Turn-based decay (triggered by memory_match_triggers)       │
│   • HOT/WARM/COLD tiers for content injection amount            │
└─────────────────────────────────────────────────────────────────┘
│ LAYER 2: EPISODIC MEMORY (ENHANCED)                             │
│   • Semantic + trigger search                                   │
│   • Related memories via co-activation                          │
└─────────────────────────────────────────────────────────────────┘
│ LAYER 3: SEMANTIC MEMORY (BASE)                                 │
│   • Constitutional tier (always surfaces)                       │
│   • Long-term storage with vector embeddings                    │
└─────────────────────────────────────────────────────────────────┘
```

#### Session Management

| Aspect             | Behavior                                        |
| ------------------ | ----------------------------------------------- |
| **Isolation**      | Each session has isolated working memory state  |
| **Turn Tracking**  | Counter advances on each `memory_match_triggers` call |
| **Decay Rate**     | 0.80 per turn (configurable via config)         |
| **Expiration**     | Sessions auto-expire after 1 hour of inactivity |

### Architecture

```text
MCP Client (Claude/OpenCode)
         │ stdio
         ▼
context-server.js  ───────────────────────────────────────┐
  │                                                       │
  ├─ lib/embeddings.js      Local embedding generation    │
  ├─ lib/vector-index.js    SQLite + sqlite-vec storage   │
  ├─ lib/hybrid-search.js   FTS5 + vector fusion          │
  ├─ lib/trigger-matcher.js Fast phrase matching          │
  ├─ lib/memory-parser.js   File parsing + validation     │
  └─ lib/checkpoints.js     State snapshots               │
                                                          │
                                                          │
   Note: File watching not currently implemented          │
   Use memory_index_scan for manual re-indexing           │
```

---

## 2. 🔧 MCP TOOLS (14)

### Search & Retrieval Tools

| Tool                    | Purpose                                        | Latency |
| ----------------------- | ---------------------------------------------- | ------- |
| `memory_search`         | Semantic vector search with hybrid FTS5 fusion | ~500ms  |
| `memory_match_triggers` | Fast trigger phrase matching                   | <50ms   |
| `memory_list`           | Browse memories with pagination                | <50ms   |
| `memory_stats`          | System statistics and health                   | <10ms   |

### CRUD Tools

| Tool                | Purpose                       | Latency |
| ------------------- | ----------------------------- | ------- |
| `memory_save`       | Index a single memory file    | ~1s     |
| `memory_index_scan` | Bulk scan and index workspace | varies  |
| `memory_update`     | Update metadata/tier/triggers | <50ms*  |
| `memory_delete`     | Delete by ID or spec folder   | <50ms   |
| `memory_validate`   | Record validation feedback    | <50ms   |

*+~400ms if title changed (triggers embedding regeneration)

### Checkpoint Tools

| Tool                 | Purpose                     | Latency |
| -------------------- | --------------------------- | ------- |
| `checkpoint_create`  | Create named state snapshot | <100ms  |
| `checkpoint_list`    | List available checkpoints  | <50ms   |
| `checkpoint_restore` | Restore from checkpoint     | varies  |
| `checkpoint_delete`  | Delete a checkpoint         | <50ms   |

### Tool Parameters Reference

#### memory_search

Search memories semantically using vector similarity.

| Parameter               | Type     | Default  | Description                                                                   |
| ----------------------- | -------- | -------- | ----------------------------------------------------------------------------- |
| `query`                 | string   | -        | Natural language search query                                                 |
| `concepts`              | string[] | -        | Multi-concept AND search (2-5 concepts)                                       |
| `specFolder`            | string   | -        | Limit search to specific spec folder                                          |
| `limit`                 | number   | 10       | Maximum results to return (1-20)                                              |
| `tier`                  | string   | -        | Filter by importance tier                                                     |
| `contextType`           | string   | -        | Filter by context type                                                        |
| `useDecay`              | boolean  | true     | Apply temporal decay scoring                                                  |
| `includeContiguity`     | boolean  | false    | Include adjacent/contiguous memories                                          |
| `includeConstitutional` | boolean  | **true** | Include constitutional tier at top of results                                 |
| `includeContent`        | boolean  | false    | Embed memory file content directly in results (replaces legacy `memory_load`) |

**Response Fields:**

| Field              | Type     | Description                                           |
| ------------------ | -------- | ----------------------------------------------------- |
| `id`               | number   | Memory ID                                             |
| `title`            | string   | Memory title                                          |
| `similarity`       | number   | 0-100 relevance score                                 |
| `isConstitutional` | boolean  | `true` if constitutional tier (always surfaces first) |
| `importanceTier`   | string   | One of 6 tiers                                        |
| `specFolder`       | string   | Source spec folder                                    |
| `triggerPhrases`   | string[] | Trigger phrases for fast matching                     |

#### memory_update

Update an existing memory's metadata.

| Parameter          | Type     | Required | Description                                                                            |
| ------------------ | -------- | -------- | -------------------------------------------------------------------------------------- |
| `id`               | number   | **Yes**  | Memory ID to update                                                                    |
| `title`            | string   | No       | New title (triggers re-embedding)                                                      |
| `importanceTier`   | string   | No       | One of: `constitutional`, `critical`, `important`, `normal`, `temporary`, `deprecated` |
| `importanceWeight` | number   | No       | Weight 0-1 within tier                                                                 |
| `triggerPhrases`   | string[] | No       | Updated trigger phrases for fast matching                                              |

**Tier Promotion Example:**
```typescript
// Promote memory to constitutional tier for Gate 3 enforcement
memory_update({ 
  id: 132, 
  importanceTier: "constitutional",
  triggerPhrases: ["fix", "implement", "create", "modify", "update", "refactor"]
})
```

#### memory_list

Browse stored memories with pagination and filtering.

| Parameter    | Type   | Default      | Description                                                 |
| ------------ | ------ | ------------ | ----------------------------------------------------------- |
| `limit`      | number | 20           | Results per page (max 100)                                  |
| `offset`     | number | 0            | Skip N results for pagination                               |
| `specFolder` | string | -            | Filter by spec folder                                       |
| `sortBy`     | string | `created_at` | Sort order: `created_at`, `updated_at`, `importance_weight` |

#### memory_match_triggers

Fast trigger phrase matching (<50ms) with optional cognitive memory features.

| Parameter          | Type    | Default      | Description                                              |
| ------------------ | ------- | ------------ | -------------------------------------------------------- |
| `prompt`           | string  | **Required** | User prompt to match against trigger phrases             |
| `limit`            | number  | 3            | Maximum matching memories to return                      |
| `session_id`       | string  | -            | Session identifier for working memory (v17.1+)           |
| `turn_number`      | number  | -            | Current turn for decay calculation (v17.1+)              |
| `include_cognitive`| boolean | false        | Enable cognitive features (decay, co-activation) (v17.1+)|

**Response includes:** `memoryId`, `matchedPhrases[]`, `title`, `importanceWeight`

**Cognitive Response Fields (when `include_cognitive: true`):**

| Field              | Type   | Description                                    |
| ------------------ | ------ | ---------------------------------------------- |
| `attention_score`  | number | Current attention score (0.0-1.0)              |
| `tier`             | string | HOT, WARM, or COLD classification              |
| `content`          | string | Full content (HOT) or summary (WARM)           |
| `co_activated`     | array  | Related memories activated by spreading        |

**Example with cognitive features:**
```typescript
memory_match_triggers({
  prompt: "implement authentication",
  session_id: "session-123",
  turn_number: 5,
  include_cognitive: true
})
// Returns memories with attention scores, tiers, and co-activated related memories
```

#### memory_delete

Delete memories by ID or spec folder.

| Parameter    | Type    | Required | Description                                           |
| ------------ | ------- | -------- | ----------------------------------------------------- |
| `id`         | number  | No*      | Memory ID to delete                                   |
| `specFolder` | string  | No*      | Delete all memories in spec folder                    |
| `confirm`    | boolean | No       | Required for bulk delete (when specFolder is used)    |
| `dryRun`     | boolean | No       | Preview what would be deleted without deleting (v12.6+) |

*Either `id` or `specFolder` is required.

**Example with dryRun:**
```typescript
// Preview deletions first
memory_delete({ specFolder: "old-feature", dryRun: true })
// Returns: { dryRun: true, wouldDelete: 15, memories: [...] }

// Then confirm deletion
memory_delete({ specFolder: "old-feature", confirm: true })
```

#### memory_index_scan

Scan workspace for memory files and index them.

| Parameter              | Type    | Default | Description                                           |
| ---------------------- | ------- | ------- | ----------------------------------------------------- |
| `specFolder`           | string  | -       | Limit scan to specific spec folder                    |
| `force`                | boolean | false   | Re-index all files (ignore content hash)              |
| `includeConstitutional`| boolean | true    | Also scan `.opencode/skill/*/constitutional/` directories |

**Examples:**
```typescript
// Full workspace scan
memory_index_scan({})

// Scan specific folder
memory_index_scan({ specFolder: "049-auth-system" })

// Force re-index everything
memory_index_scan({ force: true })

// Skip constitutional directories
memory_index_scan({ includeConstitutional: false })
```

---

## 3. 📁 LIBRARY MODULES (28 TOTAL)

### Core Modules

| Module                 | Purpose                                                            |
| ---------------------- | ------------------------------------------------------------------ |
| `embeddings.js`        | Local embedding generation using HuggingFace nomic-embed-text-v1.5 |
| `vector-index.js`      | SQLite + sqlite-vec database operations (CRUD, search)             |
| `memory-parser.js`     | Memory file parsing, validation, and metadata extraction           |
| `trigger-matcher.js`   | Fast phrase matching for proactive memory surfacing                |
| `trigger-extractor.js` | TF-IDF based automatic trigger phrase extraction                   |

### Search Modules

| Module             | Purpose                                     |
| ------------------ | ------------------------------------------- |
| `hybrid-search.js` | Combined FTS5 + vector search with fallback |
| `rrf-fusion.js`    | Reciprocal Rank Fusion for result merging   |
| `reranker.js`      | Result reranking based on relevance         |

### Scoring & Ranking Modules

| Module                   | Purpose                                           |
| ------------------------ | ------------------------------------------------- |
| `scoring.js`             | Base relevance scoring algorithms                 |
| `composite-scoring.js`   | Multi-factor composite score calculation          |
| `importance-tiers.js`    | Six-tier importance system with boost multipliers |
| `temporal-contiguity.js` | Adjacent memory linking and retrieval             |

### State Management Modules

| Module                  | Purpose                                   |
| ----------------------- | ----------------------------------------- |
| `checkpoints.js`        | Save/restore memory state snapshots       |
| `history.js`            | Memory access and modification history    |
| `access-tracker.js`     | Load count tracking for popularity boost  |
| `confidence-tracker.js` | Validation feedback and confidence scores |

### Infrastructure Modules

| Module             | Purpose                                         |
| ------------------ | ----------------------------------------------- |
| `config-loader.js` | Configuration file loading and validation       |
| `channel.js`       | Communication channel management                |
| `entity-scope.js`  | Entity and scope resolution                     |
| `errors.js`        | Custom error types and error handling utilities |
| `index-refresh.js` | Index refresh and maintenance                   |
| `retry-manager.js` | Failed embedding retry with exponential backoff |
| `token-budget.js`  | Token limit enforcement for responses           |

### Cognitive Memory Modules (v17.1)

| Module                | Purpose                                              |
| --------------------- | ---------------------------------------------------- |
| `working-memory.js`   | Session-based working memory with attention scores   |
| `attention-decay.js`  | Turn-based decay mechanics for attention scores      |
| `tier-classifier.js`  | HOT/WARM/COLD classification based on attention      |
| `co-activation.js`    | Spreading activation graph for related memories      |
| `summary-generator.js`| Summary generation for WARM tier content             |

---

## 4. 🔄 FILE INDEXING

### Purpose

Memory files are indexed into the semantic database for vector search. Indexing can be triggered manually or via the MCP tool.

### Manual Indexing

Use the `memory_index_scan` MCP tool to scan and index memory files:

```typescript
// Scan all memory files in workspace
memory_index_scan({})

// Scan specific spec folder
memory_index_scan({ specFolder: "049-auth-system" })

// Force re-index even if content unchanged
memory_index_scan({ force: true })
```

### Features

| Feature              | Description                        |
| -------------------- | ---------------------------------- |
| **Scan Pattern**     | `specs/**/memory/**/*.md` and `.opencode/specs/**/memory/**/*.md` |
| **Content Hash**     | Skip unchanged files (SHA-256)     |
| **Batch Processing** | 5 files per batch with 100ms delay |
| **Retry Logic**      | Exponential backoff for failures   |

### Specs Directory Locations

The memory system supports specs folders in two locations (checked in priority order):

| Priority | Location | Use Case |
|----------|----------|----------|
| 1 | `<project>/specs/` | Standard location, visible at project root |
| 2 | `<project>/.opencode/specs/` | Hidden location, keeps project root clean |

If both locations exist, the project root location takes precedence. A warning is logged when multiple locations are detected.

---

## 5. ⚙️ CONFIGURATION

### Environment Variables

| Variable                | Default                                                         | Description                     |
| ----------------------- | --------------------------------------------------------------- | ------------------------------- |
| `MEMORY_DB_PATH`        | `.opencode/skill/system-spec-kit/database/context-index.sqlite` | Database location               |
| `MEMORY_BASE_PATH`      | CWD                                                             | Workspace root for memory files |
| `HUGGINGFACE_CACHE`     | `~/.cache/huggingface/`                                         | Model cache directory           |
| `DEBUG_TRIGGER_MATCHER` | `false`                                                         | Enable verbose trigger logs     |

**Tier Threshold Environment Variables:**

| Variable | Default | Description |
|----------|---------|-------------|
| `HOT_THRESHOLD` | 0.8 | Score threshold for HOT tier (0.0-1.0) |
| `WARM_THRESHOLD` | 0.25 | Score threshold for WARM tier (0.0-1.0) |
| `MAX_HOT_MEMORIES` | 5 | Maximum HOT tier memories to return |
| `MAX_WARM_MEMORIES` | 10 | Maximum WARM tier memories to return |

**Validation:** Invalid values automatically fall back to defaults. `HOT_THRESHOLD` must be greater than `WARM_THRESHOLD`.

### Database Location

```text
{project}/.opencode/skill/system-spec-kit/database/context-index.sqlite
```

Contains:
- `memory_index` table - Memory metadata
- `vec_memories` virtual table - Vector embeddings (sqlite-vec)
- `memory_fts` virtual table - Full-text search index (FTS5)
- `checkpoints` table - State snapshots
- `memory_history` table - Access/modification history

### Dependencies

| Dependency                  | Version | Purpose                     |
| --------------------------- | ------- | --------------------------- |
| `@modelcontextprotocol/sdk` | ^1.0.0  | MCP protocol implementation |
| `@huggingface/transformers` | ^3.0.0  | Local embedding generation  |
| `better-sqlite3`            | ^9.0.0  | SQLite database             |
| `sqlite-vec`                | Latest  | Vector similarity search    |
| `chokidar`                  | ^3.5.0  | File watching (optional)    |

---

## 6. 🚀 INSTALLATION

See [MCP - Spec Kit Memory Install Guide](../../../install_guides/MCP%20-%20Spec%20Kit%20Memory.md) for detailed installation steps, platform-specific instructions, and configuration options.

---

## 7. 🛠️ TROUBLESHOOTING

### Common Issues

#### Model Download Failures
**Symptom:** `Error: Failed to download embedding model`
**Solution:**
- Check internet connectivity
- Verify `EMBEDDING_MODEL` environment variable
- Try manual download: `npx fastembed download`

#### Database Corruption
**Symptom:** `SQLITE_CORRUPT` or search returns no results
**Solution:**
- Delete database: `rm .opencode/skill/system-spec-kit/database/context-index.sqlite`
- Re-index: Run `memory_index_scan({ force: true })`

#### Embedding Dimension Mismatch
**Symptom:** `Error: Vector dimension mismatch`
**Solution:**
- This occurs when switching embedding models
- Delete database and re-index all memory files

#### Memory File Validation Errors
**Symptom:** `Invalid anchor format` or `Missing required fields`
**Solution:**
- Ensure memory files use ANCHOR format: `<!-- ANCHOR: id -->`
- Run validation: `node .opencode/skill/system-spec-kit/scripts/generate-context.js --validate`

### Diagnostic Commands

```bash
# Check database status
sqlite3 .opencode/skill/system-spec-kit/database/context-index.sqlite "SELECT COUNT(*) FROM memories;"

# Verify MCP server is running
curl -s http://localhost:3000/health

# Force re-index all memories
memory_index_scan({ force: true })
```

---

## 8. 📚 RELATED RESOURCES

### Parent Documentation

| Document      | Location             | Purpose                                    |
| ------------- | -------------------- | ------------------------------------------ |
| Skill README  | `../README.md`       | Complete skill documentation (2000+ lines) |
| SKILL.md      | `../SKILL.md`        | Workflow instructions for AI agents        |
| Install Guide | `../../../install_guides/MCP - Spec Kit Memory.md` | Detailed installation steps |

### Reference Files

| Document            | Location         | Purpose                             |
| ------------------- | ---------------- | ----------------------------------- |
| `folder_routing.md` | `../references/` | Routing logic and alignment scoring |
| `save_workflow.md`  | `../references/` | Save context workflows              |

### External Resources

| Resource              | URL                                                   |
| --------------------- | ----------------------------------------------------- |
| MCP Protocol Spec     | https://modelcontextprotocol.io/                      |
| nomic-embed-text-v1.5 | https://huggingface.co/nomic-ai/nomic-embed-text-v1.5 |
| sqlite-vec            | https://github.com/asg017/sqlite-vec                  |

---

## 9. 🧪 EXPERIMENTAL FEATURES

### Cross-Encoder Reranking

An experimental reranking feature is available that uses a cross-encoder model to improve search result relevance.

**Enable:**
```bash
export ENABLE_RERANKER=true
```

**Requirements:**
- Python 3.8+
- `sentence_transformers` package: `pip install sentence-transformers`

**Note:** This feature is experimental and may increase response latency.