# Spec Kit Memory MCP Server

> Context preservation with **spec kit memory** (v1.7.2): six-tier importance system, hybrid search (FTS5 + vector), exponential decay for recency boosting, checkpoint save/restore, session-based learning metrics, and **cognitive memory features** (working memory with HOT/WARM/COLD tiers, turn-based attention decay, spreading co-activation). Provides **17 MCP tools** and **28 library modules** for intelligent memory management. This is a **Native MCP tool** - call it directly.

> **Navigation**:
> - New to Spec Kit Memory? Start with [Overview](#1--overview)
> - Need tool reference? See [MCP Tools](#2--mcp-tools-17)
> - Configuration help? See [Configuration](#6--configuration)
> - Troubleshooting? See [Troubleshooting](#8--troubleshooting)

[![MCP](https://img.shields.io/badge/MCP-compatible-blue.svg)](https://modelcontextprotocol.io)

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🔧 MCP TOOLS (17)](#2--mcp-tools-17)
- [3. 📁 STRUCTURE](#3--structure)
- [4. ⚡ FEATURES](#4--features)
- [5. 🚀 QUICK START](#5--quick-start)
- [6. ⚙️ CONFIGURATION](#6--configuration)
- [7. 💡 USAGE EXAMPLES](#7--usage-examples)
- [8. 🛠️ TROUBLESHOOTING](#8--troubleshooting)
- [9. 📚 RELATED RESOURCES](#9--related-resources)

---

## 1. 📖 OVERVIEW

### What This Server Does

The `mcp_server/` folder contains a standalone MCP server implementation for spec kit memory operations. It exposes memory tools via the Model Context Protocol for use by AI assistants like Claude and OpenCode.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| **MCP Tools** | 17 | Search, CRUD, checkpoints, session learning |
| **Library Modules** | 28 | Parsing, scoring, cognitive, storage |
| **Handler Modules** | 7 | Organized by function domain |
| **Embedding Providers** | 3 | HF Local, Voyage AI, OpenAI |

### Key Features

| Feature | Description |
|---------|-------------|
| **17 MCP Tools** | Complete CRUD + search + checkpoints + session learning |
| **Hybrid Search** | FTS5 keyword + vector semantic search with RRF fusion |
| **Multi-Provider Embeddings** | HF Local (768d), Voyage AI (1024d), OpenAI (1536d) - auto-detected |
| **Six Importance Tiers** | constitutional/critical/important/normal/temporary/deprecated |
| **Checkpoints** | Save/restore memory state for safety |
| **Session Learning** | Track knowledge improvement with preflight/postflight metrics |
| **Auto-Indexing** | Startup scan for automatic indexing |
| **Cognitive Memory** | Working memory with HOT/WARM/COLD tiers, attention decay |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18.0.0 | 20+ |
| npm | 9+ | 10+ |

---

## 2. 🔧 MCP TOOLS (17)

### Tool Categories Overview

| Category | Tools | Purpose |
|----------|-------|---------|
| **Search & Retrieval** | 4 | Find and match memories |
| **CRUD Operations** | 5 | Create, update, delete, validate |
| **Checkpoints** | 4 | State snapshots for recovery |
| **Session Learning** | 3 | Knowledge tracking across tasks |
| **System** | 1 | Health monitoring |

### Search & Retrieval Tools

| Tool | Purpose | Latency |
|------|---------|---------|
| `memory_search` | Semantic vector search with hybrid FTS5 fusion | ~500ms |
| `memory_match_triggers` | Fast trigger phrase matching with cognitive features | <50ms |
| `memory_list` | Browse memories with pagination | <50ms |
| `memory_stats` | System statistics and folder rankings | <10ms |

### CRUD Tools

| Tool | Purpose | Latency |
|------|---------|---------|
| `memory_save` | Index a single memory file | ~1s |
| `memory_index_scan` | Bulk scan and index workspace | varies |
| `memory_update` | Update metadata/tier/triggers | <50ms* |
| `memory_delete` | Delete by ID or spec folder | <50ms |
| `memory_validate` | Record validation feedback | <50ms |

*+~400ms if title changed (triggers embedding regeneration)

### Checkpoint Tools

| Tool | Purpose | Latency |
|------|---------|---------|
| `checkpoint_create` | Create named state snapshot | <100ms |
| `checkpoint_list` | List available checkpoints | <50ms |
| `checkpoint_restore` | Restore from checkpoint | varies |
| `checkpoint_delete` | Delete a checkpoint | <50ms |

### Session Learning Tools (New in v1.7.2)

| Tool | Purpose | Latency |
|------|---------|---------|
| `task_preflight` | Capture epistemic baseline before task execution | <50ms |
| `task_postflight` | Capture state after task, calculate learning delta | <50ms |
| `memory_get_learning_history` | Get learning history with trends for a spec folder | <50ms |

### System Tools

| Tool | Purpose | Latency |
|------|---------|---------|
| `memory_health` | Check health status of the memory system | <10ms |

### Tool Parameters Reference

#### memory_search

Search memories semantically using vector similarity.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | string | - | Natural language search query |
| `concepts` | string[] | - | Multi-concept AND search (2-5 concepts) |
| `specFolder` | string | - | Limit search to specific spec folder |
| `limit` | number | 10 | Maximum results to return (1-20) |
| `tier` | string | - | Filter by importance tier |
| `contextType` | string | - | Filter by context type |
| `useDecay` | boolean | true | Apply temporal decay scoring |
| `includeContiguity` | boolean | false | Include adjacent/contiguous memories |
| `includeConstitutional` | boolean | **true** | Include constitutional tier at top of results |
| `includeContent` | boolean | false | Embed memory file content directly in results |
| `anchors` | string[] | - | Specific anchor IDs to extract from content |

#### memory_match_triggers

Fast trigger phrase matching (<50ms) with optional cognitive memory features.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `prompt` | string | **Required** | User prompt to match against trigger phrases |
| `limit` | number | 3 | Maximum matching memories to return |
| `session_id` | string | - | Session identifier for cognitive features |
| `turn_number` | number | - | Current turn for decay calculation |
| `include_cognitive` | boolean | true | Enable cognitive features (decay, tiers, co-activation) |

#### task_preflight

Capture epistemic baseline before task execution.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `specFolder` | string | **Yes** | Path to spec folder |
| `taskId` | string | **Yes** | Task identifier (e.g., "T1", "implementation") |
| `knowledgeScore` | number | **Yes** | Current knowledge level (0-100) |
| `uncertaintyScore` | number | **Yes** | Current uncertainty level (0-100) |
| `contextScore` | number | **Yes** | Context completeness (0-100) |
| `knowledgeGaps` | string[] | No | List of identified knowledge gaps |
| `sessionId` | string | No | Optional session identifier |

#### task_postflight

Capture epistemic state after task execution and calculate learning delta.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `specFolder` | string | **Yes** | Path to spec folder (must match preflight) |
| `taskId` | string | **Yes** | Task identifier (must match preflight) |
| `knowledgeScore` | number | **Yes** | Post-task knowledge level (0-100) |
| `uncertaintyScore` | number | **Yes** | Post-task uncertainty level (0-100) |
| `contextScore` | number | **Yes** | Post-task context completeness (0-100) |
| `gapsClosed` | string[] | No | List of knowledge gaps closed during task |
| `newGapsDiscovered` | string[] | No | List of new gaps discovered during task |

**Learning Index Formula:**
```
LI = (KnowledgeDelta x 0.4) + (UncertaintyReduction x 0.35) + (ContextImprovement x 0.25)
```

#### memory_get_learning_history

Get learning history for a spec folder.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `specFolder` | string | **Required** | Spec folder path to get learning history for |
| `sessionId` | string | - | Filter by session ID |
| `limit` | number | 10 | Maximum records to return (max: 100) |
| `onlyComplete` | boolean | false | Only return complete learning cycles |
| `includeSummary` | boolean | true | Include summary statistics in response |

---

## 3. 📁 STRUCTURE

```
mcp_server/
├── context-server.js       # Main MCP server entry point
├── package.json            # Dependencies and scripts
├── README.md               # This file
├── LICENSE                 # MIT license
│
├── core/                   # Core initialization modules
│   ├── index.js            # Core exports
│   ├── config.js           # Configuration management
│   └── db-state.js         # Database state management
│
├── handlers/               # MCP tool handlers (7 modules)
│   ├── index.js            # Handler exports
│   ├── memory-search.js    # memory_search handler
│   ├── memory-triggers.js  # memory_match_triggers handler
│   ├── memory-save.js      # memory_save handler
│   ├── memory-crud.js      # update/delete/list/stats/validate handlers
│   ├── memory-index.js     # memory_index_scan handler
│   ├── checkpoints.js      # checkpoint_* handlers
│   └── session-learning.js # task_preflight/postflight/learning_history
│
├── hooks/                  # Auto-surface hooks
│   ├── index.js            # Hook exports
│   └── memory-surface.js   # SK-004 auto-surface implementation
│
├── lib/                    # Library modules (28 total)
│   ├── cognitive/          # Cognitive memory (5 modules)
│   ├── parsing/            # File parsing (4 modules)
│   ├── providers/          # Embedding providers (2 modules)
│   ├── scoring/            # Scoring algorithms (5 modules)
│   ├── search/             # Search engines (4 modules)
│   ├── storage/            # Persistence (4 modules)
│   └── utils/              # Utilities (4 modules)
│
├── formatters/             # Response formatters
│   ├── search-results.js   # Search result formatting
│   └── token-metrics.js    # Token counting/metrics
│
├── utils/                  # Server utilities
│   ├── batch-processor.js  # Batch operation handling
│   ├── json-helpers.js     # JSON parsing utilities
│   └── validators.js       # Input validation (SEC-003)
│
├── configs/                # Configuration files
│   └── search-weights.json # Search scoring weights
│
├── database/               # SQLite database storage
│   └── context-index.sqlite
│
├── scripts/                # CLI utilities
│   └── index-cli.js        # Manual indexing CLI
│
└── tests/                  # Test files
```

### Key Files

| File | Purpose |
|------|---------|
| `context-server.js` | Main entry point - MCP server with 17 tools |
| `package.json` | Dependencies: @modelcontextprotocol/sdk, better-sqlite3, sqlite-vec |
| `handlers/index.js` | Aggregates all handler exports |
| `lib/search/vector-index.js` | SQLite + sqlite-vec database operations |
| `lib/providers/embeddings.js` | Multi-provider embedding generation |

---

## 4. ⚡ FEATURES

### Constitutional Tier

The **constitutional** tier is the highest importance level, designed for operational rules and critical context that must ALWAYS be visible to the AI agent.

| Behavior | Description |
|----------|-------------|
| **Always surfaces** | Included at top of every `memory_search` result by default |
| **Fixed similarity** | Returns `similarity: 100` regardless of query relevance |
| **Response flag** | `isConstitutional: true` in search results |
| **Token budget** | ~2000 tokens max for constitutional memories per search |
| **Control** | Set `includeConstitutional: false` to disable |

### Session Learning (New in v1.7.2)

Track knowledge improvement across task execution with structured pre/post metrics.

**Workflow:**
```
1. task_preflight  → Record knowledge/uncertainty/context before task
2. [Execute Task]  → Do the implementation work
3. task_postflight → Record post-task state, calculate Learning Index
4. memory_get_learning_history → View trends over time
```

**Learning Index Components:**
| Component | Weight | Measures |
|-----------|--------|----------|
| Knowledge Delta | 40% | How much knowledge increased |
| Uncertainty Reduction | 35% | How much uncertainty decreased |
| Context Improvement | 25% | How much context improved |

### Cognitive Memory System

The cognitive memory system implements a biologically-inspired working memory model.

#### Tier System

| Tier | Score Range | Content Returned | Max Items |
|------|-------------|------------------|-----------|
| HOT | >= 0.8 | Full content | 5 |
| WARM | 0.25-0.79 | Summary only | 10 |
| COLD | < 0.25 | Not returned | - |

#### Importance Tier Decay Rates

| Category | Tier | Decay Rate | Behavior |
|----------|------|------------|----------|
| **Protected** | `constitutional` | 1.0 | Never decays |
| **Protected** | `critical` | 1.0 | Never decays |
| **Protected** | `important` | 1.0 | Never decays |
| **Decaying** | `normal` | 0.80 | Standard decay per turn |
| **Decaying** | `temporary` | 0.60 | Fast decay per turn |

### Auto Memory Surfacing (SK-004)

Automatically injects relevant context when memory-aware tools are invoked.

**Memory-Aware Tools:**
- `memory_search`
- `memory_match_triggers`
- `memory_list`
- `memory_save`
- `memory_index_scan`

---

## 5. 🚀 QUICK START

### 30-Second Setup

The server is typically started via MCP configuration, not manually.

```bash
# 1. Navigate to mcp_server directory
cd .opencode/skill/system-spec-kit/mcp_server

# 2. Install dependencies (if not already installed)
npm install

# 3. Start server (for testing - normally launched by MCP client)
npm start
```

### Verify Installation

```bash
# Check Node.js version
node --version
# Expected: v18.0.0 or higher

# Check dependencies installed
ls node_modules/@modelcontextprotocol/sdk
# Should exist
```

### MCP Configuration

Add to your MCP client configuration (e.g., `opencode.json`):

```json
{
  "mcpServers": {
    "spec_kit_memory": {
      "command": "node",
      "args": [".opencode/skill/system-spec-kit/mcp_server/context-server.js"],
      "cwd": "${workspaceFolder}"
    }
  }
}
```

---

## 6. ⚙️ CONFIGURATION

### Environment Variables

#### Core Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `MEMORY_DB_PATH` | `./database/context-index.sqlite` | Database location |
| `MEMORY_BASE_PATH` | CWD | Workspace root for memory files |
| `DEBUG_TRIGGER_MATCHER` | `false` | Enable verbose trigger logs |

#### Embedding Provider Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `EMBEDDINGS_PROVIDER` | No | Force provider: `voyage`, `openai`, or `hf-local` |
| `VOYAGE_API_KEY` | For Voyage | Voyage AI API key (1024 dimensions) |
| `OPENAI_API_KEY` | For OpenAI | OpenAI API key (1536 dimensions) |
| `EMBEDDING_BATCH_DELAY_MS` | No | Delay between batch requests (default: 100ms) |

**Provider Auto-Detection Priority:**
1. Explicit `EMBEDDINGS_PROVIDER` variable
2. `VOYAGE_API_KEY` detected -> Voyage (1024d)
3. `OPENAI_API_KEY` detected -> OpenAI (1536d)
4. Default -> HuggingFace Local (768d)

#### Cognitive Memory Thresholds

| Variable | Default | Description |
|----------|---------|-------------|
| `HOT_THRESHOLD` | 0.8 | Score threshold for HOT tier |
| `WARM_THRESHOLD` | 0.25 | Score threshold for WARM tier |
| `MAX_HOT_MEMORIES` | 5 | Maximum HOT tier memories to return |
| `MAX_WARM_MEMORIES` | 10 | Maximum WARM tier memories to return |

### Database Schema

The SQLite database contains these tables:

| Table | Purpose |
|-------|---------|
| `memory_index` | Memory metadata (title, tier, triggers, file path) |
| `vec_memories` | Vector embeddings (sqlite-vec virtual table) |
| `memory_fts` | Full-text search index (FTS5 virtual table) |
| `checkpoints` | State snapshots for recovery |
| `memory_history` | Access and modification history |
| `learning_records` | Session learning preflight/postflight data |
| `working_memory` | Session-scoped attention scores |

### Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `@modelcontextprotocol/sdk` | ^1.24.3 | MCP protocol implementation |
| `@huggingface/transformers` | ^3.8.1 | Local embedding generation |
| `better-sqlite3` | ^12.5.0 | SQLite database |
| `sqlite-vec` | ^0.1.7-alpha.2 | Vector similarity search |
| `chokidar` | ^3.6.0 | File watching (optional) |
| `lru-cache` | ^11.2.4 | In-memory caching |

---

## 7. 💡 USAGE EXAMPLES

### Example 1: Basic Memory Search

```javascript
// Search for authentication-related memories
memory_search({
  query: "how does authentication work",
  limit: 5
})

// Result includes constitutional memories at top + semantic matches
```

### Example 2: Session Learning Workflow

```javascript
// 1. Before starting implementation
task_preflight({
  specFolder: "specs/077-upgrade",
  taskId: "T1",
  knowledgeScore: 40,
  uncertaintyScore: 70,
  contextScore: 50,
  knowledgeGaps: ["database schema", "API endpoints"]
})

// 2. After completing implementation
task_postflight({
  specFolder: "specs/077-upgrade",
  taskId: "T1",
  knowledgeScore: 85,
  uncertaintyScore: 20,
  contextScore: 90,
  gapsClosed: ["database schema", "API endpoints"]
})

// Result: Learning Index calculated from deltas
// LI = (45 x 0.4) + (50 x 0.35) + (40 x 0.25) = 45.5
```

### Example 3: Cognitive Memory with Session

```javascript
// Match triggers with cognitive features enabled
memory_match_triggers({
  prompt: "implement authentication feature",
  session_id: "session-abc",
  turn_number: 5,
  include_cognitive: true
})

// Returns memories with attention scores, HOT/WARM tiers, and co-activated related memories
```

### Example 4: Bulk Indexing

```javascript
// Scan and index all memory files
memory_index_scan({})

// Scan specific folder with force re-index
memory_index_scan({
  specFolder: "049-auth-system",
  force: true
})
```

### Common Patterns

| Pattern | Tool Call | When to Use |
|---------|-----------|-------------|
| Find related context | `memory_search({ query: "..." })` | Before starting work |
| Track learning | `task_preflight` -> work -> `task_postflight` | Implementation tasks |
| Check system health | `memory_health({})` | Debugging issues |
| Recover state | `checkpoint_restore({ name: "..." })` | After errors |

---

## 8. 🛠️ TROUBLESHOOTING

### Common Issues

#### Model Download Failures

**Symptom:** `Error: Failed to download embedding model`

**Cause:** Network issues or HuggingFace cache problems

**Solution:**
```bash
# Check internet connectivity
# Clear cache and retry
rm -rf ~/.cache/huggingface/
# Server will re-download on next start
```

#### Database Corruption

**Symptom:** `SQLITE_CORRUPT` or search returns no results

**Cause:** Database file corrupted or incomplete shutdown

**Solution:**
```bash
# Delete database
rm .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite

# Re-index via MCP tool
memory_index_scan({ force: true })
```

#### Embedding Dimension Mismatch

**Symptom:** `Error: Vector dimension mismatch`

**Cause:** Switched embedding providers (e.g., from HF Local to Voyage)

**Solution:**
```bash
# Delete database to clear old embeddings
rm .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite

# Re-index with new provider
memory_index_scan({ force: true })
```

#### Server Not Responding

**Symptom:** MCP calls timeout or fail

**Cause:** Server crashed or not started

**Solution:**
```bash
# Check if process is running
ps aux | grep context-server

# Restart MCP client (Claude Desktop, OpenCode, etc.)
# Server starts automatically via MCP configuration
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Empty search results | `memory_index_scan({ force: true })` |
| Slow embeddings | Set `VOYAGE_API_KEY` or `OPENAI_API_KEY` for faster API-based embeddings |
| Missing constitutional | Check file is in `constitutional/` directory |
| Learning not tracked | Ensure `specFolder` and `taskId` match in preflight/postflight |

### Diagnostic Commands

```bash
# Check database status
sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite \
  "SELECT COUNT(*) FROM memory_index;"

# Check schema version
sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite \
  "PRAGMA user_version;"

# Check learning records
sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite \
  "SELECT * FROM learning_records LIMIT 5;"
```

---

## 9. 📚 RELATED RESOURCES

### Parent Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| Skill README | `../README.md` | Complete skill documentation |
| SKILL.md | `../SKILL.md` | Workflow instructions for AI agents |
| Install Guide | `../../../install_guides/MCP - Spec Kit Memory.md` | Detailed installation steps |

### Sub-Folder Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| Handlers README | `./handlers/README.md` | Handler module organization |
| Library README | `./lib/README.md` | Library module documentation |
| Core README | `./core/README.md` | Core module documentation |
| Utils README | `./utils/README.md` | Utility module documentation |
| Hooks README | `./hooks/README.md` | Auto-surface hook documentation |
| Formatters README | `./formatters/README.md` | Response formatter documentation |
| Configs README | `./configs/README.md` | Configuration file documentation |

### External Resources

| Resource | URL |
|----------|-----|
| MCP Protocol Spec | https://modelcontextprotocol.io/ |
| nomic-embed-text-v1.5 | https://huggingface.co/nomic-ai/nomic-embed-text-v1.5 |
| sqlite-vec | https://github.com/asg017/sqlite-vec |
| Voyage AI | https://www.voyageai.com/ |

---

*Documentation version: 1.7.2 | Last updated: 2026-01-23*
