---
title: "Memory Scripts"
description: "TypeScript context preservation and retrieval utilities for the Spec Kit Memory system"
trigger_phrases:
  - "memory scripts"
  - "generate context memory"
  - "rank memories"
  - "cleanup orphaned vectors"
importance_tier: "normal"
---

# Memory Scripts

> TypeScript context preservation and retrieval utilities for the Spec Kit Memory system.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. 🛠️ TROUBLESHOOTING](#4--troubleshooting)
- [5. 📚 RELATED DOCUMENTS](#5--related-documents)

---

<!-- /ANCHOR:table-of-contents -->
## 1. 📖 OVERVIEW
<!-- ANCHOR:overview -->

### What are Memory Scripts?

Memory scripts manage the Spec Kit Memory system, which preserves conversation context across sessions using semantic search and importance-based ranking. These TypeScript utilities handle context generation, memory ranking, and database maintenance. Source files are compiled to `../dist/memory/` for execution.

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
| Compiled Output | `../dist/memory/` | JavaScript files for execution |

---

<!-- /ANCHOR:overview -->
## 2. 🚀 QUICK START
<!-- ANCHOR:quick-start -->

### Generate Memory Context

```bash
# From spec folder (direct mode)
node ../dist/memory/generate-context.js specs/001-feature/

# From JSON data (JSON mode)
node ../dist/memory/generate-context.js /tmp/context-data.json specs/001-feature/
```

### Rank Memories

```bash
# From stdin
cat memories.json | node ../dist/memory/rank-memories.js --format compact --folder-limit 3

# From file
node ../dist/memory/rank-memories.js /path/to/memories.json --show-archived --memory-limit 5
```

### Cleanup Database

```bash
# Remove orphaned vectors and history entries
node ../dist/memory/cleanup-orphaned-vectors.js
```

---

<!-- /ANCHOR:quick-start -->
## 3. 📁 STRUCTURE
<!-- ANCHOR:structure -->

```
memory/
├── generate-context.ts           # Context generation CLI (TypeScript source)
├── rank-memories.ts              # Memory ranking utility (TypeScript source)
├── cleanup-orphaned-vectors.ts  # Database maintenance script (TypeScript source)
├── README.md                     # This file
│
└── Compiled Output: ../dist/memory/
    ├── generate-context.js       # Compiled executable
    ├── rank-memories.js          # Compiled executable
    └── cleanup-orphaned-vectors.js # Compiled executable
```

### Key Files

| File | Purpose |
|------|---------|
| `generate-context.ts` | Creates memory files with ANCHOR format for indexing |
| `rank-memories.ts` | Computes composite ranking scores using recency, tier, and folder activity |
| `cleanup-orphaned-vectors.ts` | Removes orphaned database entries for maintenance |
| `../dist/memory/*.js` | Compiled JavaScript executables |

---

<!-- /ANCHOR:structure -->
## 4. 🛠️ TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

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
node ../dist/memory/generate-context.js specs/001-feature/

# Or provide JSON data file
node ../dist/memory/generate-context.js /tmp/context-data.json
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Orphaned vectors | Run `node ../dist/memory/cleanup-orphaned-vectors.js` |
| Stale rankings | Re-run `node ../dist/memory/rank-memories.js` with updated data |
| Invalid folder name | Rename to NNN-short-name format |
| Database locked | Restart OpenCode or remove .sqlite-wal file |

### Diagnostic Commands

```bash
# Check database size
ls -lh .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite

# Validate spec folder structure
ls -la specs/001-feature/

# Test memory generation (dry run)
node ../dist/memory/generate-context.js --help
```

---

<!-- /ANCHOR:troubleshooting -->
## 5. 📚 RELATED DOCUMENTS
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [Memory System Reference](../../references/memory/memory_system.md) | Complete memory system architecture |
| [Save Workflow](../../references/memory/save_workflow.md) | Context save protocol and validation |
| [Trigger Config](../../references/memory/trigger_config.md) | Memory trigger configuration rules |
| [Folder Scoring](../../mcp_server/lib/scoring/folder-scoring.ts) | Composite scoring implementation (TypeScript source) |

### External Resources

| Resource | Description |
|----------|-------------|
| [sqlite-vec Documentation](https://github.com/asg017/sqlite-vec) | Vector embedding extension for SQLite |
| [better-sqlite3 API](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md) | SQLite driver for Node.js |

---

*Documentation version: 1.0 | Last updated: 2025-01-21*
<!-- /ANCHOR:related -->
