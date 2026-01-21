# Memory Scripts

> Context preservation and retrieval utilities for the Spec Kit Memory system.

---

## 1. 📖 OVERVIEW

### What are Memory Scripts?

Memory scripts manage the Spec Kit Memory system, which preserves conversation context across sessions using semantic search and importance-based ranking. These utilities handle context generation, memory ranking, and database maintenance.

### Key Features

| Feature | Description |
|---------|-------------|
| **Context Generation** | Creates ANCHOR-formatted memory files from spec folder data or JSON input |
| **Memory Ranking** | Computes composite scores for memories based on recency, tier weights, and folder activity |
| **Orphan Cleanup** | Removes orphaned vector embeddings and history entries from the database |

### Requirements

| Requirement | Minimum | Notes |
|-------------|---------|-------|
| Node.js | 18+ | For script execution |
| better-sqlite3 | Latest | Database access |
| sqlite-vec | Latest | Vector embeddings |

---

## 2. 🚀 QUICK START

### Generate Memory Context

```bash
# From spec folder (direct mode)
node generate-context.js specs/001-feature/

# From JSON data (JSON mode)
node generate-context.js /tmp/context-data.json specs/001-feature/
```

### Rank Memories

```bash
# From stdin
cat memories.json | node rank-memories.js --format compact --folder-limit 3

# From file
node rank-memories.js /path/to/memories.json --show-archived --memory-limit 5
```

### Cleanup Database

```bash
# Remove orphaned vectors and history entries
node cleanup-orphaned-vectors.js
```

---

## 3. 📁 STRUCTURE

```
memory/
├── generate-context.js           # Context generation CLI (executable)
├── rank-memories.js              # Memory ranking utility (executable)
└── cleanup-orphaned-vectors.js  # Database maintenance script
```

### Key Files

| File | Purpose |
|------|---------|
| `generate-context.js` | Creates memory files with ANCHOR format for indexing |
| `rank-memories.js` | Computes composite ranking scores using recency, tier, and folder activity |
| `cleanup-orphaned-vectors.js` | Removes orphaned database entries for maintenance |

---

## 7. 🛠️ TROUBLESHOOTING

### Common Issues

#### Invalid Spec Folder Pattern

**Symptom**: `Error: Invalid spec folder path`

**Cause**: Folder name doesn't match required pattern (NNN-short-name)

**Solution**:
```bash
# Valid format: 3 digits, hyphen, lowercase letters/digits/hyphens
# Examples: 001-feature, 064-bug-fix, 003-memory-spec-kit

# Rename to match pattern
mv 1-short specs/001-short/
```

#### Database Lock Error

**Symptom**: `Error: database is locked`

**Cause**: MCP server has database open with exclusive lock

**Solution**:
```bash
# Restart OpenCode to release database lock
# Or delete the database lock file
rm .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite-wal
```

#### Missing Input Data

**Symptom**: `Error: No input provided`

**Cause**: Script requires either JSON file or spec folder path

**Solution**:
```bash
# Provide spec folder path
node generate-context.js specs/001-feature/

# Or provide JSON data file
node generate-context.js /tmp/context-data.json
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Orphaned vectors | Run `cleanup-orphaned-vectors.js` |
| Stale rankings | Re-run `rank-memories.js` with updated data |
| Invalid folder name | Rename to NNN-short-name format |
| Database locked | Restart OpenCode or remove .sqlite-wal file |

### Diagnostic Commands

```bash
# Check database size
ls -lh .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite

# Validate spec folder structure
ls -la specs/001-feature/

# Test memory generation (dry run)
node generate-context.js --help
```

---

## 9. 📚 RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [Memory System Reference](../../references/memory/memory_system.md) | Complete memory system architecture |
| [Save Workflow](../../references/memory/save_workflow.md) | Context save protocol and validation |
| [Trigger Config](../../references/memory/trigger_config.md) | Memory trigger configuration rules |
| [Folder Scoring](../../mcp_server/lib/scoring/folder-scoring.js) | Composite scoring implementation |

### External Resources

| Resource | Description |
|----------|-------------|
| [sqlite-vec Documentation](https://github.com/asg017/sqlite-vec) | Vector embedding extension for SQLite |
| [better-sqlite3 API](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md) | SQLite driver for Node.js |
