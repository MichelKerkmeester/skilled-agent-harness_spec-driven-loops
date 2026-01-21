---
title: Memory System Reference
description: Detailed documentation for Spec Kit Memory MCP tools, behavior notes, and configuration
---

# Memory System Reference - MCP Tools & Behavior

Spec Kit Memory MCP tools, behavior notes, and configuration options.

---

## 1. 📖 OVERVIEW

The Spec Kit Memory system provides context preservation across sessions through vector-based semantic search and structured memory files. This reference covers MCP tool behavior, importance tiers, decay scoring, and configuration.

### Architecture

| Component | Location | Purpose |
|-----------|----------|---------|
| MCP Server | `mcp_server/context-server.js` | Spec Kit Memory MCP with vector search |
| Database | `mcp_server/database/context-index.sqlite` | SQLite with FTS5 + vector embeddings |
| Constitutional | `constitutional/` | Always-surface rules (Gate 3 enforcement) |
| Scripts | `scripts/memory/generate-context.js` | Memory file generation with ANCHOR format |

### Core Capabilities

- **Semantic search** - Find memories by meaning, not just keywords
- **Importance tiers** - Six-level system for prioritizing context
- **Decay scoring** - Recent memories rank higher than old ones
- **Checkpoints** - Save/restore memory state snapshots
- **Constitutional tier** - Critical rules that always surface

---

## 2. 🏷️ IMPORTANCE TIERS

Six-tier system for prioritizing memory relevance:

| Tier | Weight | searchBoost | Purpose | Auto-Surface |
|------|--------|-------------|---------|--------------|
| **Constitutional** | 1.0 | 3.0 | Critical rules that ALWAYS apply | Yes (top of every search) |
| **Critical** | 1.0 | 2.0 | High-importance context | Yes (high relevance) |
| **Important** | 0.8 | 1.5 | Significant decisions/context | Relevance-based |
| **Normal** | 0.5 | 1.0 | Standard session context | Relevance-based |
| **Temporary** | 0.3 | 0.5 | Short-term notes | Relevance-based |
| **Deprecated** | 0.1 | 0.0 | Outdated (kept for history) | Never (excluded from search) |

**searchBoost Multipliers:** Applied to search scores to prioritize higher tiers:
- Constitutional memories get 3x boost in search ranking
- Critical memories get 2x boost
- Important memories get 1.5x boost
- Normal memories have no boost (1.0x)
- Temporary and Deprecated get reduced visibility (0.5x and 0x respectively)

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
| `memory_match_triggers()` | Fast keyword matching (<50ms) with cognitive features | Gate enforcement |
| `memory_save()` | Index a memory file. Re-generates embedding when **content hash** changes. Title-only changes do not trigger re-embedding. | After generate-context.js |
| `memory_list()` | Browse stored memories with pagination | Review session history |
| `memory_delete()` | Delete memory by ID or bulk delete by spec folder | Remove outdated memories |
| `memory_update()` | Update memory metadata (title, tier, triggers) | Correct memory properties |
| `memory_validate()` | Mark memory as useful/not useful | Confidence scoring |
| `memory_stats()` | Get memory system statistics | Check index health |
| `memory_index_scan()` | Bulk scan and index memory files | After creating multiple files |
| `memory_health()` | Check health status of memory system | Diagnose issues |
| `checkpoint_create()` | Save named state snapshot | Before risky changes |
| `checkpoint_list()` | List available checkpoints | Find restore points |
| `checkpoint_restore()` | Restore from checkpoint | Rollback if needed |
| `checkpoint_delete()` | Delete a checkpoint | Clean up old snapshots |

---

## 4. 🔍 MEMORY_SEARCH() BEHAVIOR

### Parameter Requirements

> **IMPORTANT:** You MUST provide either `query` OR `concepts` parameter. Calling `memory_search({ specFolder: "..." })` without a search parameter will cause an E040 error.

**Required Parameters (one of):**
- `query`: Natural language search query (string)
- `concepts`: Multiple concepts for AND search (array of 2-5 strings)

**Optional Parameters:**
- `specFolder`: Limit search to specific spec folder
- `includeContent`: Include full file content in results
- `includeConstitutional`: Include constitutional tier memories
- `anchors`: Array of anchor IDs for targeted section retrieval (token-efficient)
- `tier`: Filter by importance tier
- `limit`: Maximum results to return
- `useDecay`: Apply temporal decay scoring

### Parameter Reference

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | One of query/concepts | - | Natural language search query |
| `concepts` | string[] | One of query/concepts | - | 2-5 concepts for AND search (results must match ALL) |
| `specFolder` | string | No | - | Filter to specific spec folder |
| `includeConstitutional` | boolean | No | true | Include constitutional memories |
| `includeContent` | boolean | No | false | Embed full file content in results |
| `includeContiguity` | boolean | No | false | Include adjacent memories |
| `anchors` | string[] | No | - | Anchor IDs to extract (e.g., `['summary', 'decisions']`) |
| `tier` | string | No | - | Filter by importance tier |
| `limit` | number | No | 10 | Maximum results to return |
| `useDecay` | boolean | No | true | Apply temporal decay scoring |

### Constitutional Memory Behavior

> **Important:** Constitutional memories ALWAYS appear at the top of search results, even when a `specFolder` filter is applied. This is BY DESIGN to ensure critical context (e.g., Gate enforcement rules) is never accidentally filtered out.

| Parameter | Behavior |
|-----------|----------|
| `specFolder: "007-auth"` | Filters results to that folder, but constitutional memories still appear first |
| `includeConstitutional: false` | Explicitly excludes constitutional memories from results |
| `includeContent: true` | Embeds full memory file content in results (eliminates separate load calls) |

### Usage Examples

```javascript
// Basic semantic search (query required)
memory_search({ query: "authentication decisions" })

// Folder-scoped with content (query still required)
memory_search({
  query: "OAuth implementation",
  specFolder: "007-auth",
  includeContent: true
})

// Multi-concept AND search (alternative to query)
memory_search({
  concepts: ["authentication", "session management"],
  specFolder: "007-auth"
})

// Exclude constitutional tier
memory_search({
  query: "login flow",
  includeConstitutional: false
})

// WRONG: specFolder alone is NOT sufficient
// memory_search({ specFolder: "007-auth" })  // ERROR: E040
```

### Anchor-Based Retrieval (Token-Efficient)

The `anchors` parameter enables **targeted section retrieval** from memory files, reducing token usage by ~90% when you only need specific sections.

**When to Use Anchors:**
- You need only specific sections (summary, decisions) not full content
- Token efficiency is important (large memory files)
- Loading context for specific purposes (e.g., resume work, review decisions)

**Common Anchor Patterns:**

| Anchor ID | Content | Use Case |
|-----------|---------|----------|
| `summary` | High-level overview | Quick context refresh |
| `decisions` | Key decisions made | Understanding rationale |
| `metadata` | File metadata, dates, status | Filtering and sorting |
| `state` | Project state snapshot | Resume work |
| `context` | Project context | Understand scope |
| `artifacts` | Modified/created files | Track changes |
| `blockers` | Current blockers | Identify issues |
| `next-steps` | Planned actions | Continue work |

**Anchor Usage Examples:**

```javascript
// Get only summary and decisions (minimal tokens)
memory_search({
  query: "auth implementation",
  anchors: ['summary', 'decisions']
})

// Resume work - get state and next steps
memory_search({
  query: "session context",
  specFolder: "007-auth",
  anchors: ['state', 'next-steps', 'blockers']
})

// Review what changed - artifacts only
memory_search({
  query: "recent changes",
  anchors: ['artifacts', 'metadata']
})

// Full content (no anchors - default behavior)
memory_search({
  query: "complete context",
  includeContent: true  // Returns entire file
})
```

**Anchor Format in Memory Files:**

Memory files use HTML comment anchors:
```markdown
<!-- ANCHOR:summary -->
Brief summary of the session...
<!-- /ANCHOR:summary -->

<!-- ANCHOR:decisions -->
- Decision 1: Chose approach X because...
- Decision 2: Deferred Y until...
<!-- /ANCHOR:decisions -->
```

**Token Savings:**
- Full memory file: ~2000 tokens
- With `anchors: ['summary']`: ~150 tokens (93% savings)
- With `anchors: ['summary', 'decisions']`: ~300 tokens (85% savings)

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
| `sortBy` | string | `created_at` DESC | Sort order: created_at, updated_at, importance_weight |

### Spec Folder Filtering

The `specFolder` parameter behavior varies by operation:
- `memory_search`: Exact match (SQL `=` operator)
- `memory_list`: Exact match (SQL `=` operator)
- `findMemoryFiles`: Prefix match (`startsWith`) - matches `007-auth` and `007-auth-v2`

For consistent exact matching, use the full spec folder name.

---

## 6. ⏱️ DECAY SCORING

Memories decay over conversation turns to prioritize recent context:

### Tier-Specific Decay Rates (v1.7.1)

| Tier | Decay Rate | Behavior |
|------|------------|----------|
| `constitutional` | 1.0 | Never decays |
| `critical` | 1.0 | Never decays |
| `important` | 1.0 | Never decays |
| `normal` | 0.80 | Standard decay |
| `temporary` | 0.60 | Fast decay |
| `deprecated` | 1.0 | Never decays (but excluded from results) |

**Formula (TURN-BASED):** `new_score = current_score × (decay_rate ^ turns_elapsed)`

Where `turns_elapsed` = current conversation turn - last mentioned turn.

**Protected Tiers:** Constitutional, critical, important, and deprecated tiers are protected from decay (rate = 1.0). This ensures important context is preserved regardless of conversation length.

### Decay Examples (Normal Tier, decay_rate = 0.80)

| Turns Elapsed | Decay Factor | Effective Score (base 0.50) |
|---------------|--------------|----------------------------|
| 0 | 1.00 | 0.50 |
| 5 | 0.33 | 0.16 |
| 10 | 0.11 | 0.05 |
| 15 | 0.04 | 0.02 |

**Note:** Decay is per conversation TURN, not calendar time. Each new user message increments the turn counter.

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
- [troubleshooting.md](../debugging/troubleshooting.md) - Common issues and solutions
- [environment_variables.md](../config/environment_variables.md) - Configuration options

### Scripts
- `scripts/memory/generate-context.js` - Memory file generation
- `mcp_server/context-server.js` - MCP server implementation

### Related Skills
- `system-spec-kit` - Parent skill orchestrating spec folder workflow
