# MCP Server Database Storage

> SQLite database storage for semantic memory with vector embeddings, full-text search, and checkpoint state management.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. ⚡ FEATURES](#4--features)
- [5. 💡 USAGE EXAMPLES](#5--usage-examples)
- [6. 🛠️ TROUBLESHOOTING](#6--troubleshooting)
- [7. 📚 RELATED DOCUMENTS](#7--related-documents)

---

## 1. 📖 OVERVIEW

### What is this folder?

The `database/` folder contains the SQLite database files that store all indexed memory data, vector embeddings, and checkpoint snapshots for the Spec Kit Memory MCP server. This is the persistent storage layer for the semantic memory system.

### Key Features

| Feature | Description |
|---------|-------------|
| **Vector Search** | sqlite-vec extension for semantic similarity search |
| **Full-Text Search** | FTS5 virtual table for keyword matching |
| **Hybrid Storage** | Combines vector embeddings (768d/1024d/1536d) with relational data |
| **Multi-Provider Support** | HF Local (768d), Voyage AI (1024d), OpenAI (1536d) embeddings |
| **Checkpoint Snapshots** | Save/restore database state for safety |
| **External Update Detection** | `.db-updated` signal file for process coordination |

### Database Size and Performance

| Metric | Typical Values | Notes |
|--------|----------------|-------|
| **File Size** | 4-5 MB per 100 memories | Varies by embedding dimension |
| **WAL File** | 250 KB - 4.7 MB | Write-ahead log for transactions |
| **SHM File** | 32 KB | Shared memory for WAL mode |
| **Search Latency** | 50-500ms | Depends on dataset size |

### Requirements

| Requirement | Minimum | Purpose |
|-------------|---------|---------|
| better-sqlite3 | 9.0.0+ | SQLite driver with WAL support |
| sqlite-vec | Latest | Vector similarity extension |
| Disk Space | 10 MB+ | Per 100-200 memories |

---

## 2. 🚀 QUICK START

### Accessing the Database

```bash
# Open database with sqlite3 CLI
sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite

# Or use the MCP server tools (recommended)
# memory_search, memory_list, memory_stats
```

### Verify Database Health

```bash
# Check database integrity
sqlite3 context-index.sqlite "PRAGMA integrity_check;"

# View table list
sqlite3 context-index.sqlite ".tables"

# Count indexed memories
sqlite3 context-index.sqlite "SELECT COUNT(*) FROM memory_index;"
```

### Quick Queries

```bash
# View recent memories
sqlite3 context-index.sqlite \
  "SELECT id, title, spec_folder, importance_tier FROM memory_index ORDER BY created_at DESC LIMIT 10;"

# Check checkpoint count
sqlite3 context-index.sqlite \
  "SELECT COUNT(*) FROM checkpoints;"

# View database size
du -h context-index.sqlite*
```

---

## 3. 📁 STRUCTURE

```
database/
├── context-index.sqlite               # Main database file
├── context-index.sqlite-shm           # Shared memory for WAL mode (32 KB)
├── context-index.sqlite-wal           # Write-ahead log (varies)
├── context-index__voyage__voyage-4__1024.sqlite      # Legacy Voyage embedding DB
├── context-index__voyage__voyage-4__1024.sqlite-shm  # Legacy WAL shared memory
├── context-index__voyage__voyage-4__1024.sqlite-wal  # Legacy WAL log
└── .db-updated                        # External update signal (timestamp)
```

### Key Files

| File | Purpose | Can Delete? |
|------|---------|-------------|
| `context-index.sqlite` | Main database with memory index, vectors, FTS5 | ❌ No - data loss |
| `context-index.sqlite-wal` | Write-ahead log for uncommitted transactions | ⚠️ Only if DB closed cleanly |
| `context-index.sqlite-shm` | Shared memory for WAL coordination | ⚠️ Auto-recreated on startup |
| `.db-updated` | External update signal (BUG-001) | ✅ Yes - auto-recreated |
| `context-index__voyage__*` | Legacy multi-provider databases | ✅ Yes - if migrated to main |

### File Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Server Startup   │ Opens context-index.sqlite in WAL mode   │
├─────────────────────┼──────────────────────────────────────────┤
│ 2. Write Operations │ Changes append to .sqlite-wal            │
├─────────────────────┼──────────────────────────────────────────┤
│ 3. Checkpoint       │ WAL merged into main .sqlite file        │
├─────────────────────┼──────────────────────────────────────────┤
│ 4. External Update  │ generate-context.js writes .db-updated   │
├─────────────────────┼──────────────────────────────────────────┤
│ 5. Reload Detection │ Server reads .db-updated, reinitializes  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. ⚡ FEATURES

### Database Schema

**memory_index Table** (Primary storage)

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER PRIMARY KEY | Auto-increment memory ID |
| `spec_folder` | TEXT | Source spec folder path |
| `file_path` | TEXT | Absolute path to memory file |
| `title` | TEXT | Memory title (indexed for FTS5) |
| `importance_tier` | TEXT | Tier: constitutional/critical/important/normal/temporary/deprecated |
| `importance_weight` | REAL | Weight within tier (0.0-1.0) |
| `context_type` | TEXT | Type: technical/decision/workflow/etc. |
| `content_hash` | TEXT | SHA-256 for change detection |
| `created_at` | INTEGER | Unix timestamp |
| `last_accessed` | INTEGER | Unix timestamp |
| `load_count` | INTEGER | Access frequency counter |

**vec_memories Table** (Vector embeddings)

| Column | Type | Description |
|--------|------|-------------|
| `rowid` | INTEGER | Links to memory_index.id |
| `embedding` | FLOAT[] | 768d/1024d/1536d vector |

**memory_fts Table** (Full-text search)

| Column | Type | Description |
|--------|------|-------------|
| `rowid` | INTEGER | Links to memory_index.id |
| `title` | TEXT | Tokenized for FTS5 |
| `content` | TEXT | Tokenized memory content |

**checkpoints Table** (State snapshots)

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER PRIMARY KEY | Checkpoint ID |
| `name` | TEXT UNIQUE | User-provided checkpoint name |
| `created_at` | INTEGER | Snapshot timestamp |
| `memory_data` | TEXT | JSON-serialized memory state |

**config Table** (System configuration)

| Column | Type | Description |
|--------|------|-------------|
| `key` | TEXT PRIMARY KEY | Config key (e.g., "last_index_scan") |
| `value` | TEXT | Config value (stored as string) |

### Embedding Provider Detection

The database auto-detects embedding provider and dimension from environment:

| Provider | Dimension | Environment Variable | File Pattern |
|----------|-----------|---------------------|--------------|
| HF Local | 768 | Default | `context-index.sqlite` |
| Voyage AI | 1024 | `VOYAGE_API_KEY` | `context-index__voyage__voyage-4__1024.sqlite` |
| OpenAI | 1536 | `OPENAI_API_KEY` | `context-index__openai__text-embedding-3-small__1536.sqlite` |

**Note:** Multi-provider support is currently in transition. Legacy provider-specific databases may exist but are deprecated in favor of the main `context-index.sqlite`.

### External Update Coordination (BUG-001)

The `.db-updated` file enables coordination between the MCP server and external scripts:

```
┌─────────────────────────────────────────────────────────────────┐
│ PROCESS 1: generate-context.js (External)                       │
│   1. Parses memory files                                        │
│   2. Writes to context-index.sqlite                             │
│   3. Writes timestamp to .db-updated                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ PROCESS 2: MCP Server (context-server.js)                       │
│   1. Before each search, checks .db-updated                     │
│   2. If timestamp > last_check, reinitializes DB connection     │
│   3. Search now sees new data                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Signal File Format:**
```bash
# .db-updated contains Unix timestamp in milliseconds
cat .db-updated
# 1737375600000
```

---

## 5. 💡 USAGE EXAMPLES

### Example 1: Query Memory Index

```bash
# List all memories with tier and folder
sqlite3 context-index.sqlite <<EOF
SELECT
  id,
  title,
  spec_folder,
  importance_tier,
  datetime(created_at/1000, 'unixepoch') as created
FROM memory_index
ORDER BY created_at DESC
LIMIT 10;
EOF
```

**Result**: Shows 10 most recent memories with metadata.

### Example 2: Check Vector Embeddings

```bash
# Count vector embeddings
sqlite3 context-index.sqlite \
  "SELECT COUNT(*) FROM vec_memories;"

# Verify embedding dimensions (768d for HF local)
sqlite3 context-index.sqlite \
  "SELECT vec_length(embedding) FROM vec_memories LIMIT 1;"
```

### Example 3: View Checkpoints

```bash
# List all saved checkpoints
sqlite3 context-index.sqlite <<EOF
SELECT
  id,
  name,
  datetime(created_at/1000, 'unixepoch') as created,
  length(memory_data) as data_size_bytes
FROM checkpoints
ORDER BY created_at DESC;
EOF
```

### Example 4: Find Constitutional Memories

```bash
# Query constitutional tier memories (always surface)
sqlite3 context-index.sqlite \
  "SELECT id, title, spec_folder FROM memory_index WHERE importance_tier = 'constitutional';"
```

### Example 5: Database Maintenance

```bash
# Checkpoint WAL to main file
sqlite3 context-index.sqlite "PRAGMA wal_checkpoint(FULL);"

# Vacuum database to reclaim space
sqlite3 context-index.sqlite "VACUUM;"

# Analyze for query optimization
sqlite3 context-index.sqlite "ANALYZE;"
```

### Common Patterns

| Task | SQL Command | When to Use |
|------|-------------|-------------|
| List memories | `SELECT * FROM memory_index LIMIT N` | Browse indexed content |
| Check health | `PRAGMA integrity_check` | After crashes or errors |
| Count vectors | `SELECT COUNT(*) FROM vec_memories` | Verify indexing completeness |
| Checkpoint WAL | `PRAGMA wal_checkpoint(FULL)` | Before backup or shutdown |

---

## 6. 🛠️ TROUBLESHOOTING

### Common Issues

#### Database Locked Errors

**Symptom**: `SQLITE_BUSY: database is locked`

**Cause**: Another process has an exclusive lock on the database

**Solution**:
```bash
# Check for multiple server instances
ps aux | grep context-server.js

# Kill stale processes
pkill -f context-server.js

# Restart MCP server
```

#### WAL File Growing Large

**Symptom**: `context-index.sqlite-wal` is 4+ MB and not shrinking

**Cause**: WAL checkpoint not running, transactions not committing

**Solution**:
```bash
# Force WAL checkpoint
sqlite3 context-index.sqlite "PRAGMA wal_checkpoint(TRUNCATE);"

# Check WAL size after
ls -lh context-index.sqlite-wal
```

#### Missing Vector Embeddings

**Symptom**: `memory_search` returns 0 results or "No results found"

**Cause**: Vector table empty or embedding dimension mismatch

**Solution**:
```bash
# Check vector count
sqlite3 context-index.sqlite "SELECT COUNT(*) FROM vec_memories;"

# If 0, re-index all memories
# Via MCP tool: memory_index_scan({ force: true })

# If dimension mismatch, delete DB and re-index
rm context-index.sqlite*
# Then run: memory_index_scan({})
```

#### Corrupted Database

**Symptom**: `SQLITE_CORRUPT: database disk image is malformed`

**Cause**: Unclean shutdown, disk issues, or concurrent write conflicts

**Solution**:
```bash
# Try integrity check first
sqlite3 context-index.sqlite "PRAGMA integrity_check;"

# If corrupted, restore from checkpoint or rebuild
rm context-index.sqlite*
# Re-index: memory_index_scan({})

# Or restore checkpoint: checkpoint_restore({ name: "before-corruption" })
```

#### Stale Search Results

**Symptom**: New memories don't appear in search after `generate-context.js` run

**Cause**: MCP server didn't detect `.db-updated` file

**Solution**:
```bash
# Verify .db-updated exists and timestamp is recent
cat .db-updated
# Should show recent Unix timestamp

# Force server restart to reload
# (Stop and start via MCP client or opencode.json)
```

#### Out of Disk Space

**Symptom**: `SQLITE_FULL: database or disk is full`

**Cause**: Database directory out of disk space

**Solution**:
```bash
# Check available space
df -h .opencode/skill/system-spec-kit/mcp_server/database/

# Clean up WAL files after checkpoint
sqlite3 context-index.sqlite "PRAGMA wal_checkpoint(TRUNCATE);"

# Vacuum to reclaim space
sqlite3 context-index.sqlite "VACUUM;"
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Database locked | Kill stale processes: `pkill -f context-server.js` |
| Large WAL file | Checkpoint: `PRAGMA wal_checkpoint(TRUNCATE)` |
| No search results | Re-index: `memory_index_scan({ force: true })` |
| Corruption | Delete and rebuild: `rm context-index.sqlite*` |
| Stale results | Restart MCP server |

### Diagnostic Commands

```bash
# Full database health check
sqlite3 context-index.sqlite <<EOF
PRAGMA integrity_check;
PRAGMA foreign_key_check;
SELECT COUNT(*) as memory_count FROM memory_index;
SELECT COUNT(*) as vector_count FROM vec_memories;
SELECT COUNT(*) as checkpoint_count FROM checkpoints;
EOF

# View table schemas
sqlite3 context-index.sqlite ".schema memory_index"
sqlite3 context-index.sqlite ".schema vec_memories"

# Check database size breakdown
sqlite3 context-index.sqlite "SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size();"
```

---

## 7. 📚 RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [MCP Server README](../README.md) | Complete server documentation with all 14 MCP tools |
| [Vector Index Module](../lib/search/vector-index.js) | Database operations implementation |
| [Memory Parser Module](../lib/parsing/memory-parser.js) | Memory file parsing and indexing |
| [Checkpoint Module](../lib/storage/checkpoints.js) | Checkpoint save/restore logic |

### Configuration References

| Document | Purpose |
|----------|---------|
| [Environment Variables](../../references/config/environment_variables.md) | Database path and provider configuration |
| [Core Config Module](../core/config.js) | Database path constants |

### Schema References

| Document | Purpose |
|----------|---------|
| [Memory System Reference](../../references/memory/memory_system.md) | Complete schema documentation |
| [Importance Tiers](../lib/scoring/importance-tiers.js) | Six-tier importance system |

### External Resources

| Resource | Description |
|----------|-------------|
| [sqlite-vec GitHub](https://github.com/asg017/sqlite-vec) | Vector search extension documentation |
| [SQLite WAL Mode](https://www.sqlite.org/wal.html) | Write-ahead logging documentation |
| [better-sqlite3 Docs](https://github.com/WiseLibs/better-sqlite3) | Node.js SQLite driver |

---

*Database schema version: 1.7.2 | Last updated: 2026-01-21*
