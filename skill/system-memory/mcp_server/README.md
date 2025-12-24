# Semantic Memory MCP Server

> Model Context Protocol server providing semantic search, context preservation, and intelligent memory retrieval via 14 MCP tools.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🔧 MCP TOOLS (14)](#2--mcp-tools-14)
- [3. 📁 LIBRARY MODULES (22)](#3--library-modules-22)
- [4. 🔄 FILE WATCHER](#4--file-watcher)
- [5. ⚙️ CONFIGURATION](#5--configuration)
- [6. 🚀 INSTALLATION](#6--installation)
- [7. 📚 RELATED RESOURCES](#7--related-resources)

---

## 1. 📖 OVERVIEW

### What This Folder Contains

The `mcp_server/` folder is the standalone MCP server implementation for semantic memory operations. It exposes memory tools via the Model Context Protocol for use by AI assistants like Claude and OpenCode.

### Entry Points

| File                 | Purpose           | How to Run                            |
| -------------------- | ----------------- | ------------------------------------- |
| `semantic-memory.js` | Main MCP server   | `node semantic-memory.js` (via stdio) |
| `file-watcher.js`    | Auto-index daemon | `npm run watch`                       |

### Key Features

| Feature                  | Description                                                   |
| ------------------------ | ------------------------------------------------------------- |
| **14 MCP Tools**         | Complete CRUD + search operations for memory management       |
| **Hybrid Search**        | FTS5 keyword + vector semantic search with RRF fusion         |
| **Local Embeddings**     | nomic-embed-text-v1.5 (768 dimensions) - no external APIs     |
| **Six Importance Tiers** | constitutional/critical/important/normal/temporary/deprecated |
| **Checkpoints**          | Save/restore memory state for safety                          |
| **Auto-Indexing**        | Startup scan + file watcher for automatic indexing            |

### Constitutional Tier

The **constitutional** tier is the highest importance level, designed for operational rules and critical context that must ALWAYS be visible to the AI agent.

| Behavior | Description |
|----------|-------------|
| **Always surfaces** | Included at top of every `memory_search` result by default |
| **Fixed similarity** | Returns `similarity: 100` regardless of query relevance |
| **Response flag** | `isConstitutional: true` in search results |
| **Token budget** | ~500 tokens max for constitutional memories per search |
| **Control** | Set `includeConstitutional: false` to disable |

**Use cases:**
- Gate enforcement rules (e.g., Gate 3 spec folder question)
- Safety constraints and hard blockers
- User preferences that apply globally

**Reference:** See `specs/005-memory/018-gate3-enforcement/` for implementation example.

### Architecture

```
MCP Client (Claude/OpenCode)
         │ stdio
         ▼
semantic-memory.js  ──────────────────────────────────────┐
  │                                                       │
  ├─ lib/embeddings.js      Local embedding generation    │
  ├─ lib/vector-index.js    SQLite + sqlite-vec storage   │
  ├─ lib/hybrid-search.js   FTS5 + vector fusion          │
  ├─ lib/trigger-matcher.js Fast phrase matching          │
  ├─ lib/memory-parser.js   File parsing + validation     │
  └─ lib/checkpoints.js     State snapshots               │
                                                          │
file-watcher.js ──────────────────────────────────────────┘
  │
  └─ Watches specs/**/memory/*.md for changes
```

---

## 2. 🔧 MCP TOOLS (14)

### Search & Retrieval Tools

| Tool                    | Purpose                                        | Latency |
| ----------------------- | ---------------------------------------------- | ------- |
| `memory_search`         | Semantic vector search with hybrid FTS5 fusion | ~500ms  |
| `memory_load`           | Load memory content by spec folder or ID       | <10ms   |
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

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | string | - | Natural language search query |
| `limit` | number | 10 | Maximum results to return (1-20) |
| `tier` | string | - | Filter by importance tier |
| `contextType` | string | - | Filter by context type |
| `specFolder` | string | - | Limit search to specific spec folder |
| `concepts` | string[] | - | Multi-concept AND search (2-5 concepts) |
| `includeConstitutional` | boolean | **true** | Include constitutional tier at top of results |
| `includeContiguity` | boolean | false | Include adjacent/contiguous memories |
| `useDecay` | boolean | true | Apply temporal decay scoring |

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Memory ID |
| `title` | string | Memory title |
| `similarity` | number | 0-100 relevance score |
| `isConstitutional` | boolean | `true` if constitutional tier (always surfaces first) |
| `importanceTier` | string | One of 6 tiers |
| `specFolder` | string | Source spec folder |
| `triggerPhrases` | string[] | Trigger phrases for fast matching |

#### memory_update

Update an existing memory's metadata.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | **Yes** | Memory ID to update |
| `title` | string | No | New title (triggers re-embedding) |
| `importanceTier` | string | No | One of: `constitutional`, `critical`, `important`, `normal`, `temporary`, `deprecated` |
| `importanceWeight` | number | No | Weight 0-1 within tier |
| `triggerPhrases` | string[] | No | Updated trigger phrases for fast matching |

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

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 20 | Results per page (max 100) |
| `offset` | number | 0 | Skip N results for pagination |
| `tier` | string | - | Filter by importance tier (e.g., `constitutional`, `critical`) |
| `specFolder` | string | - | Filter by spec folder |
| `sortBy` | string | `created_at` | Sort order: `created_at`, `updated_at`, `importance_weight` |

#### memory_match_triggers

Fast trigger phrase matching (<50ms) without embeddings.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `prompt` | string | **Required** | User prompt to match against trigger phrases |
| `limit` | number | 3 | Maximum matching memories to return |

**Response includes:** `memoryId`, `matchedPhrases[]`, `title`, `importanceWeight`

---

## 3. 📁 LIBRARY MODULES (22)

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
| `index-refresh.js` | Index refresh and maintenance                   |
| `retry-manager.js` | Failed embedding retry with exponential backoff |
| `token-budget.js`  | Token limit enforcement for responses           |

---

## 4. 🔄 FILE WATCHER

### Purpose

The file watcher (`file-watcher.js`) provides automatic indexing of memory files when they are created or modified.

### Features

| Feature               | Description                        |
| --------------------- | ---------------------------------- |
| **Watch Pattern**     | `specs/**/memory/**/*.md`          |
| **Debouncing**        | 500ms delay to batch rapid changes |
| **Content Hash**      | Skip unchanged files (SHA-256)     |
| **Graceful Handling** | Handles add/change/unlink events   |

### Usage

```bash
# From mcp_server directory
npm run watch

# Or with custom workspace path
node file-watcher.js /path/to/project
```

### Environment Variables

| Variable                   | Default | Description                        |
| -------------------------- | ------- | ---------------------------------- |
| `MEMORY_WATCH_PATH`        | CWD     | Base path to watch                 |
| `MEMORY_DEBOUNCE_MS`       | 500     | Debounce delay in ms               |
| `MEMORY_SKIP_STARTUP_SCAN` | (unset) | Set to `1` to disable startup scan |

---

## 5. ⚙️ CONFIGURATION

### Environment Variables

| Variable                | Default                                                       | Description                     |
| ----------------------- | ------------------------------------------------------------- | ------------------------------- |
| `MEMORY_DB_PATH`        | `.opencode/skill/system-memory/database/memory-index.sqlite` | Database location               |
| `MEMORY_BASE_PATH`      | CWD                                                           | Workspace root for memory files |
| `HUGGINGFACE_CACHE`     | `~/.cache/huggingface/`                                       | Model cache directory           |
| `DEBUG_TRIGGER_MATCHER` | `false`                                                       | Enable verbose trigger logs     |

### Database Location

```
{project}/.opencode/skill/system-memory/database/memory-index.sqlite
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

See [INSTALL_GUIDE.md](./INSTALL_GUIDE.md) for detailed installation steps, platform-specific instructions, and configuration options.

---

## 7. 📚 RELATED RESOURCES

### Parent Documentation

| Document      | Location             | Purpose                                    |
| ------------- | -------------------- | ------------------------------------------ |
| Skill README  | `../README.md`       | Complete skill documentation (2000+ lines) |
| SKILL.md      | `../SKILL.md`        | Workflow instructions for AI agents        |
| Install Guide | `./INSTALL_GUIDE.md` | Detailed installation steps                |

### Reference Files

| Document                   | Location         | Purpose                       |
| -------------------------- | ---------------- | ----------------------------- |
| `alignment_scoring.md`     | `../references/` | Three-tier alignment scoring  |
| `spec_folder_detection.md` | `../references/` | CLI-first spec folder routing |
| `execution_methods.md`     | `../references/` | Save context workflows        |

### External Resources

| Resource              | URL                                                   |
| --------------------- | ----------------------------------------------------- |
| MCP Protocol Spec     | https://modelcontextprotocol.io/                      |
| nomic-embed-text-v1.5 | https://huggingface.co/nomic-ai/nomic-embed-text-v1.5 |
| sqlite-vec            | https://github.com/asg017/sqlite-vec                  |