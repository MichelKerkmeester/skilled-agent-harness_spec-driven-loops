# Spec Kit Memory MCP Server

Context preservation with **spec kit memory**: six-tier importance system, hybrid search (FTS5 + vector), exponential decay for recency boosting, and checkpoint save/restore. Provides **14 MCP tools** for intelligent memory management. This is a **Native MCP tool** - call it directly.

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
- [3. 📁 LIBRARY MODULES (23)](#3--library-modules-23)
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

Fast trigger phrase matching (<50ms) without embeddings.

| Parameter | Type   | Default      | Description                                  |
| --------- | ------ | ------------ | -------------------------------------------- |
| `prompt`  | string | **Required** | User prompt to match against trigger phrases |
| `limit`   | number | 3            | Maximum matching memories to return          |

**Response includes:** `memoryId`, `matchedPhrases[]`, `title`, `importanceWeight`

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

## 3. 📁 LIBRARY MODULES (23 TOTAL)

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