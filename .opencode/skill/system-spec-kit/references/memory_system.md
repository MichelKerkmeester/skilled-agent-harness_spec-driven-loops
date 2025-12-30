---
title: Memory System Reference
description: Detailed documentation for Spec Kit Memory MCP tools, behavior notes, and configuration
---

# Memory System Reference

Spec Kit Memory MCP tools, behavior notes, and configuration options.

---

## 1. 📖 OVERVIEW

The Spec Kit Memory system provides context preservation across sessions through vector-based semantic search and structured memory files. This reference covers MCP tool behavior, importance tiers, decay scoring, and configuration.

### Architecture

| Component | Location | Purpose |
|-----------|----------|---------|
| MCP Server | `mcp_server/context-server.js` | Spec Kit Memory MCP with vector search |
| Database | `database/context-index.sqlite` | SQLite with FTS5 + vector embeddings |
| Constitutional | `constitutional/` | Always-surface rules (Gate 3 enforcement) |
| Scripts | `scripts/generate-context.js` | Memory file generation with ANCHOR format |

### Core Capabilities

- **Semantic search** - Find memories by meaning, not just keywords
- **Importance tiers** - Six-level system for prioritizing context
- **Decay scoring** - Recent memories rank higher than old ones
- **Checkpoints** - Save/restore memory state snapshots
- **Constitutional tier** - Critical rules that always surface

---

## 2. 🏷️ IMPORTANCE TIERS

Six-tier system for prioritizing memory relevance:

| Tier | Weight | Purpose | Auto-Surface |
|------|--------|---------|--------------|
| **Constitutional** | 1.0 | Critical rules that ALWAYS apply | Yes (top of every search) |
| **Critical** | 1.0 | High-importance context | Yes (high relevance) |
| **Important** | 0.8 | Significant decisions/context | Relevance-based |
| **Normal** | 0.5 | Standard session context | Relevance-based |
| **Temporary** | 0.3 | Short-term notes | Relevance-based |
| **Deprecated** | 0.1 | Outdated (kept for history) | Never (excluded from search results) |

### Constitutional Tier Behavior

- Stored in `constitutional/` folder
- Auto-indexed on MCP server startup
- **ALWAYS** surface at top of search results, regardless of query
- Used for gate enforcement (e.g., "always ask spec folder question")
- EXEMPT from decay scoring (always max relevance)

---

## 3. 🔧 MCP TOOLS

> **Note:** MCP tool names use the format `spec_kit_memory_<tool_name>`. In documentation, shorthand names like `memory_search()` refer to the full `spec_kit_memory_memory_search()` tool.

### Tool Reference

| Tool | Purpose | Example Use |
|------|---------|-------------|
| `memory_search()` | Semantic search with vector similarity | Find prior decisions on auth |
| `memory_match_triggers()` | Fast keyword matching (<50ms) | Gate enforcement |
| `memory_save()` | Index a memory file. Re-generates embedding when **title** changes. Content changes without title changes do not trigger re-embedding. | After generate-context.js |
| `memory_list()` | Browse stored memories | Review session history |
| `memory_validate()` | Mark memory as useful/not useful | Confidence scoring |
| `checkpoint_create()` | Save named state snapshot | Before risky changes |
| `checkpoint_restore()` | Restore from checkpoint | Rollback if needed |

---

## 4. 🔍 MEMORY_SEARCH() BEHAVIOR

### Parameter Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | string | - | Natural language search query |
| `specFolder` | string | - | Filter to specific spec folder |
| `includeConstitutional` | boolean | true | Include constitutional memories |
| `includeContent` | boolean | false | Embed full file content in results |
| `includeContiguity` | boolean | false | Include adjacent memories |
| `tier` | string | - | Filter by importance tier |
| `limit` | number | 10 | Maximum results to return |
| `useDecay` | boolean | true | Apply temporal decay scoring |

### Constitutional Memory Behavior

> **Important:** Constitutional memories ALWAYS appear at the top of search results, even when a `specFolder` filter is applied. This is BY DESIGN to ensure critical context (e.g., Gate enforcement rules) is never accidentally filtered out.

| Parameter | Behavior |
|-----------|----------|
| `specFolder: "007-auth"` | Filters results to that folder, but constitutional memories still appear first |
| `includeConstitutional: false` | Explicitly excludes constitutional memories from results |
| `includeContent: true` | Embeds full memory file content in results (eliminates separate load calls) |

### Usage Examples

```javascript
// Basic semantic search
memory_search({ query: "authentication decisions" })

// Folder-scoped with content
memory_search({ 
  query: "OAuth implementation", 
  specFolder: "007-auth",
  includeContent: true 
})

// Exclude constitutional tier
memory_search({ 
  query: "login flow",
  includeConstitutional: false 
})
```

---

## 5. 📋 MEMORY_LIST() BEHAVIOR

### Exact Matching Behavior

> **Important:** The `specFolder` filter uses **EXACT matching**, not prefix or hierarchical matching.

| Query | Matches | Does NOT Match |
|-------|---------|----------------|
| `specFolder: "003-memory"` | `003-memory` only | `003-memory-and-spec-kit`, `003-memory-upgrade` |
| `specFolder: "003-memory-and-spec-kit"` | `003-memory-and-spec-kit` only | `003-memory` |

Use exact folder names when filtering. This is intentional for precise filtering control.

### Parameter Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `specFolder` | string | - | Filter by exact spec folder name |
| `limit` | number | 20 | Maximum results (max 100) |
| `offset` | number | 0 | Pagination offset |
| `sortBy` | string | `created_at` | Sort order: created_at, updated_at, importance_weight |

### Spec Folder Filtering

The `specFolder` parameter behavior varies by operation:
- `memory_search`: Exact match (SQL `=` operator)
- `memory_list`: Exact match (SQL `=` operator)
- `findMemoryFiles`: Prefix match (`startsWith`) - matches `007-auth` and `007-auth-v2`

For consistent exact matching, use the full spec folder name.

---

## 6. ⏱️ DECAY SCORING

Memories decay over time to prioritize recent context:

### Decay Formula

- **Half-life:** ~62 days
- **Recent context:** Ranks higher than old context
- **Constitutional tier:** EXEMPT from decay (always max relevance)

### Decay Examples

| Memory Age | Decay Factor | Effective Weight (Normal tier) |
|------------|--------------|-------------------------------|
| Today | 1.0 | 0.50 |
| 1 week | 0.92 | 0.46 |
| 1 month | 0.71 | 0.36 |
| 3 months | 0.35 | 0.18 |

### Disabling Decay

```javascript
memory_search({ 
  query: "historical decisions",
  useDecay: false  // Returns results without temporal weighting
})
```

---

## 7. 🔄 REAL-TIME SYNC

### Current Limitation

> **Note:** Memory files are indexed on MCP server startup. Changes made to memory files after startup are NOT automatically detected.

### Workarounds

To index new or modified memory files:

1. **Single file:** Use `memory_save` tool to index a specific file
   ```javascript
   memory_save({ filePath: "specs/007-auth/memory/session.md" })
   ```

2. **Batch scan:** Use `memory_index_scan` tool to scan and index all memory files
   ```javascript
   memory_index_scan({ specFolder: "007-auth" })
   ```

3. **Full restart:** Restart the MCP server (indexes all files on startup)

### Future Enhancement

File watcher for real-time sync is planned but not yet implemented.

### Rate Limiting

The `memory_index_scan` operation has a 1-minute cooldown between scans to prevent resource exhaustion. If called within the cooldown period, it returns an error with the remaining wait time.

---

## 8. 🔐 CONSTITUTIONAL RULES

### Purpose

Constitutional rules are critical context that should surface in every relevant interaction. Examples:

- Gate 3 enforcement ("always ask spec folder question")
- Project-specific constraints
- Security policies

### Location

Constitutional files are stored in:
```
.opencode/skill/system-spec-kit/constitutional/
```

### Auto-Surfacing

- Indexed automatically on MCP server startup
- Always appear at TOP of search results
- Matched via trigger phrases for fast keyword matching
- Not affected by decay scoring

### Creating Constitutional Rules

1. Create file in `constitutional/` folder
2. Add YAML frontmatter with triggers:
   ```yaml
   ---
   title: Gate 3 Enforcement
   triggers:
     - "file modification"
     - "gate 3"
     - "spec folder"
   importanceTier: constitutional
   ---
   ```
3. Restart MCP server or use `memory_index_scan()`

---

## 9. 🔗 RELATED RESOURCES

### Reference Files
- [save_workflow.md](./save_workflow.md) - Memory save workflow documentation
- [troubleshooting.md](./troubleshooting.md) - Common issues and solutions
- [environment_variables.md](./environment_variables.md) - Configuration options

### Scripts
- `scripts/generate-context.js` - Memory file generation
- `mcp_server/context-server.js` - MCP server implementation

### Related Skills
- `system-spec-kit` - Parent skill orchestrating spec folder workflow
