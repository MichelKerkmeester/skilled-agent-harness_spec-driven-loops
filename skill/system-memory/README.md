# Semantic Memory MCP Server

> **Remember everything. Surface what matters. Keep it private.**

Your AI assistant forgets everything between sessions. You explain your auth system Monday—by Wednesday, it's a blank slate. This memory system fixes that with semantic search that understands *meaning*, importance tiers that prioritize *what matters*, and local-first architecture that keeps *your code yours*.

No cloud. No external APIs. Just intelligent context preservation that makes AI-assisted development actually work.

This memory system doesn't just remember. It *understands*. It knows which memories matter most. It surfaces context before you ask. And it does it all locally—your code never leaves your machine.

## Why This Memory System is Different

| Capability               | Basic Chat Logs    | This Memory System                                      |
| ------------------------ | ------------------ | ------------------------------------------------------- |
| **Search**               | Ctrl+F (text only) | Hybrid semantic + keyword (RRF fusion)                  |
| **Prioritization**       | None               | 6-tier importance (constitutional → deprecated)         |
| **Relevance**            | All memories equal | 90-day decay keeps recent memories on top               |
| **Privacy**              | Often cloud-stored | 100% local (nomic-embed runs on YOUR machine)           |
| **Token Efficiency**     | Load everything    | ANCHOR format (93% savings)                             |
| **Spec Kit Integration** | None               | Deep (Gate 5 enforced, lives in spec folders)           |
| **Proactive Surfacing**  | None               | <50ms trigger matching                                  |
| **Recovery**             | Hope you backed up | Checkpoints (undo button for your index)                |
| **Promotion**            | Manual             | Confidence-based (validated memories earn higher tiers) |

> **The bottom line:** 14 MCP tools, 6 importance tiers, <50ms trigger matching, 93% token savings, 0 data sent externally.

## Spec Kit Integration

> **Deep Integration**: Memory and Spec Kit are designed to work together.

| Integration Point         | How It Works                                                      |
| ------------------------- | ----------------------------------------------------------------- |
| **Memory Location**       | Files live IN spec folders: `specs/###-feature/memory/`           |
| **Gate 5 Enforcement**    | Memory saves MUST use `generate-context.js` (no orphaned context) |
| **Sub-folder Versioning** | Each 001/002/003 sub-folder has independent memory context        |
| **Session Continuity**    | `/spec_kit:resume` auto-loads relevant memories                   |
| **V13.0 Stateless**       | Project state embedded in memory files (no separate STATE.md)     |

When you save context, it goes to the right spec folder. When you resume work, memories load automatically. When you version your specs, memories version with them.

---

## TABLE OF CONTENTS

1. [📖 OVERVIEW](#1--overview)
2. [🎯 TOOL SELECTION GUIDE](#2--tool-selection-guide)
3. [🔧 MCP TOOLS](#3--mcp-tools) (14 tools)
4. [⌨️ SLASH COMMANDS](#4--slash-commands) (3 commands)
5. [💬 TRIGGER PHRASES](#5--trigger-phrases)
6. [🔍 SEMANTIC SEARCH](#6--semantic-search)
7. [🔀 HYBRID SEARCH](#7--hybrid-search)
8. [🏗️ ARCHITECTURE](#8-️-architecture)
9. [💾 DATABASE SCHEMA](#9--database-schema)
10. [🔄 AUTO-INDEXING](#10--auto-indexing)
11. [📸 CHECKPOINTS](#11--checkpoints)
12. [📊 PERFORMANCE](#12--performance)
13. [🚀 INSTALLATION & SETUP](#13--installation--setup)
14. [🛠️ TROUBLESHOOTING](#14-️-troubleshooting)
15. [❓ FAQ](#15--faq)
16. [📚 RESOURCES](#16--resources)

> **Navigation**:
> - New to semantic memory? Start with [Installation & Setup](#13--installation--setup)
> - Need tool guidance? See [Tool Selection Guide](#2--tool-selection-guide)
> - Quick command lookup? See [Slash Commands](#4--slash-commands)
> - Workflow integration? See [SKILL.md](../SKILL.md)

---

## 1. 📖 OVERVIEW

### What It Does

> **Local-First**: All processing happens on your machine. No data sent to external APIs. Ever.

The Semantic Memory MCP Server transforms your AI assistant from amnesiac to elephant. It enables AI assistants to:

- **Search memories semantically** — Find context by meaning, not just keywords
- **Load memory content** — By spec folder, anchor ID, or memory ID (93% token savings with anchors)
- **Match trigger phrases** — <50ms proactive surfacing before you even ask
- **Manage memory lifecycle** — Validation, tier promotion, decay, and checkpoints

### Key Capabilities

| Feature                   | Why It Matters                                                               |
| ------------------------- | ---------------------------------------------------------------------------- |
| **Hybrid Search**         | FTS5 + vector + RRF fusion = finds what you mean AND what you typed          |
| **Six Importance Tiers**  | Constitutional memories ALWAYS surface; deprecated ones stay hidden          |
| **Time-Based Decay**      | 90-day half-life keeps recent memories relevant without manual cleanup       |
| **Checkpoints**           | Your undo button—experiment freely, restore if needed                        |
| **Constitutional Tier**   | Project rules in every session (~500-800 tokens, always visible)             |
| **Confidence Promotion**  | Validated memories earn their tier (90%+ confidence → auto-suggest critical) |
| **Local Embeddings**      | nomic-embed-text-v1.5 runs on YOUR machine—complete privacy                  |
| **Fast Trigger Matching** | <50ms proactive surfacing—context appears before you ask                     |
| **Multi-Concept Search**  | AND search across 2-5 concepts for precise recall                            |
| **Graceful Degradation**  | Falls back gracefully: hybrid → vector-only → anchor-only                    |
| **Access Tracking**       | Frequently-used memories rank higher automatically                           |
| **Auto Embedding Regen**  | Title changes trigger re-embedding for search accuracy                       |
| **Batch Processing**      | 5 concurrent files, 100ms delay—won't overwhelm your machine                 |

> **Spec Kit Connection**: Memory files live in `specs/###-feature/memory/` and are version-controlled with your spec folders.

### Privacy-First Design

> **Your Code Stays Yours**: Not a feature—a fundamental design principle.

**All processing happens locally:**
- Embedding model runs on YOUR machine (nomic-embed-text-v1.5)
- Vector database stored in YOUR project (`.opencode/skill/system-memory/database/`)
- Memory files stored in YOUR spec folders (`specs/*/memory/`)
- No data sent to external APIs—ever
- No cloud dependencies—works offline

### Embedding Model

> **Model**: `nomic-ai/nomic-embed-text-v1.5` (768 dimensions)

| Specification      | Value                            |
| ------------------ | -------------------------------- |
| **Model Name**     | `nomic-ai/nomic-embed-text-v1.5` |
| **Dimensions**     | 768                              |
| **Context Window** | 8,192 tokens                     |
| **Inference**      | Local (HuggingFace Transformers) |
| **Storage**        | sqlite-vec (`FLOAT[768]`)        |

**Why nomic-embed-text-v1.5?**
- 2x larger context window than alternatives (8K vs 512 tokens)
- Better semantic understanding for technical documentation
- Fully local inference - no API calls, complete privacy

---

## 2. 🎯 TOOL SELECTION GUIDE

### Tools at a Glance

| Tool                    | Purpose                | Speed  | Use When                                         |
| ----------------------- | ---------------------- | ------ | ------------------------------------------------ |
| `memory_search`         | Semantic vector search | ~500ms | Need meaning-based retrieval                     |
| `memory_load`           | Load memory content    | <10ms  | Know exact spec folder/ID                        |
| `memory_match_triggers` | Fast phrase matching   | <50ms  | Quick keyword lookup first                       |
| `memory_list`           | Browse memories        | <50ms  | Explore what's indexed                           |
| `memory_stats`          | System statistics      | <10ms  | Check system health                              |
| `memory_update`         | Update metadata        | <50ms* | Change tier/triggers (*+~400ms if title changed) |
| `memory_delete`         | Delete memories        | <50ms  | Remove outdated content                          |
| `memory_validate`       | Record feedback        | <50ms  | Build confidence scores                          |
| `memory_save`           | Index single file      | ~1s    | Manual file indexing                             |
| `memory_index_scan`     | Bulk scan & index      | varies | After creating many files                        |
| `checkpoint_create`     | Save state             | <100ms | Before major changes                             |
| `checkpoint_list`       | List checkpoints       | <50ms  | See available snapshots                          |
| `checkpoint_restore`    | Restore state          | varies | Recover from issues                              |
| `checkpoint_delete`     | Delete checkpoint      | <50ms  | Clean up old snapshots                           |

### Tool Selection Flowchart

```
User Request
     │
     ▼
┌─────────────────────────────────────────┐
│ Does request contain specific keywords?  │
└────────────────┬────────────────────────┘
                 │
         ┌───────┴───────┐
         │               │
        YES              NO
         │               │
         ▼               ▼
┌─────────────────┐  ┌────────────────────┐
│ memory_match_   │  │ Need semantic      │
│ triggers        │  │ understanding?     │
│ (<50ms)         │  └─────────┬──────────┘
└────────┬────────┘            │
         │              ┌──────┴──────┐
         │             YES            NO
         │              │              │
         ▼              ▼              ▼
┌─────────────────┐  ┌──────────────┐  ┌────────────────┐
│ Found matches?  │  │ memory_search│  │ memory_load    │
│                 │  │ (~500ms)     │  │ (direct access)│
└────────┬────────┘  └──────────────┘  └────────────────┘
         │
    ┌────┴────┐
   YES        NO
    │          │
    ▼          ▼
┌────────┐  ┌──────────────┐
│ Done!  │  │ memory_search│
│        │  │ (fallback)   │
└────────┘  └──────────────┘
```

### Smart Routing Logic

```python
def select_memory_tool(user_request):
    # Fast path: specific keywords present
    if has_specific_keywords(user_request):
        result = memory_match_triggers(user_request, limit=3)
        if result.count > 0:
            return memory_load(result.results[0])

    # Semantic path: understanding needed
    if needs_semantic_understanding(user_request):
        return memory_search(user_request)

    # Multi-concept: multiple topics
    if has_multiple_concepts(user_request):
        concepts = extract_concepts(user_request)
        return memory_search(query=user_request, concepts=concepts)

    # Direct path: known location
    if has_spec_folder(user_request):
        return memory_load(specFolder=extract_spec_folder(user_request))
```

### Usage Patterns

#### Pattern 1: Quick Topic Check

```
1. Call memory_match_triggers with topic keywords
   → Fast check for relevant memories (<50ms)

2. If matches found, call memory_load for details
   → Load full content of matched memories

3. If no matches, call memory_search for semantic lookup
   → Broader search using meaning (slower but thorough)
```

#### Pattern 2: Deep Research

```
1. Call memory_search with natural language query
   → Find semantically related memories

2. Call memory_search with concepts array
   → Find memories matching ALL concepts (AND search)
   → Example: ["authentication", "error handling", "retry"]

3. Call memory_load for promising results
   → Load full content to review
```

#### Pattern 3: Direct Access

```
1. Call memory_load with specFolder
   → Get most recent memory for that spec

2. Add anchorId for section-specific loading (93% token savings)
   → Get specific section only
   → Anchor format: <!-- ANCHOR:id --> ... <!-- /ANCHOR:id -->
```

---

## 3. 🔧 MCP TOOLS

> **14 Tools Total**: Complete memory lifecycle management via MCP protocol.

### 3.1 memory_search

**Purpose**: Search conversation memories semantically using vector similarity with hybrid FTS5 fusion.

**Parameters**:

| Parameter               | Type    | Required | Default | Description                   |
| ----------------------- | ------- | -------- | ------- | ----------------------------- |
| `query`                 | string  | Yes      | -       | Natural language search query |
| `concepts`              | array   | No       | -       | 2-5 concepts for AND search   |
| `specFolder`            | string  | No       | -       | Limit to specific spec folder |
| `tier`                  | string  | No       | -       | Filter by importance tier     |
| `contextType`           | string  | No       | -       | Filter by context type        |
| `limit`                 | number  | No       | 10      | Maximum results               |
| `useDecay`              | boolean | No       | true    | Apply time-based decay        |
| `includeConstitutional` | boolean | No       | true    | Include constitutional tier   |

**Example Request**:
```json
{
  "query": "authentication implementation decisions",
  "specFolder": "049-auth-system",
  "limit": 5
}
```

**Example Response**:
```json
{
  "searchType": "hybrid",
  "count": 3,
  "constitutionalCount": 1,
  "results": [
    {
      "id": 132,
      "specFolder": "005-memory/018-gate3-enforcement",
      "title": "GATE 3 ENFORCEMENT - ASK SPEC FOLDER FIRST",
      "similarity": 100,
      "isConstitutional": true,
      "importanceTier": "constitutional",
      "triggerPhrases": ["fix", "implement", "create", "modify", "..."]
    },
    {
      "id": 42,
      "specFolder": "049-auth-system",
      "filePath": "specs/049-auth-system/memory/28-11-25_14-30__oauth.md",
      "title": "OAuth Implementation Session",
      "similarity": 89.5,
      "isConstitutional": false,
      "importanceTier": "important"
    }
  ]
}
```

---

### 3.2 memory_load

> **93% Token Savings**: Load just the section you need, not the entire file.

**Purpose**: Load memory content by spec folder, anchor ID, or memory ID. Supports section-specific loading for massive token savings.

**Parameters**:

| Parameter    | Type   | Required | Default | Description                               |
| ------------ | ------ | -------- | ------- | ----------------------------------------- |
| `specFolder` | string | Yes*     | -       | Spec folder identifier                    |
| `anchorId`   | string | No       | -       | Load specific section (93% token savings) |
| `memoryId`   | number | No       | -       | Direct memory ID access                   |

*Either `specFolder` or `memoryId` required

**Anchor Format**:

Memory files use HTML comment anchors with closing tags for section extraction:

```html
<!-- ANCHOR:decision-jwt-049 -->
## Key Decisions
Content here...
<!-- /ANCHOR:decision-jwt-049 -->
```

**Format Rules**:
- Both `ANCHOR` and `anchor` (case-insensitive) are supported
- Include BOTH opening AND closing tags
- Optional space after colon: `ANCHOR:id` or `ANCHOR: id` both work
- **Recommended**: Use UPPERCASE for consistency with templates

**Anchor ID Pattern**: `[context-type]-[keywords]-[spec-number]`

| Context Type     | Use For              | Example                             |
| ---------------- | -------------------- | ----------------------------------- |
| `implementation` | Code patterns        | `implementation-oauth-callback-049` |
| `decision`       | Architecture choices | `decision-database-schema-005`      |
| `research`       | Investigation        | `research-lenis-scroll-006`         |
| `discovery`      | Learnings            | `discovery-api-limits-011`          |
| `general`        | Mixed content        | `general-session-summary-049`       |

**Example Request (Full File)**:
```json
{
  "specFolder": "011-semantic-memory-upgrade"
}
```

**Example Request (Section Only - 93% Token Savings)**:
```json
{
  "specFolder": "011-semantic-memory-upgrade",
  "anchorId": "decision-jwt-011"
}
```

**Example Response**:
```json
{
  "id": 15,
  "specFolder": "011-semantic-memory-upgrade",
  "filePath": "specs/011-semantic-memory-upgrade/memory/06-12-25_18-46.md",
  "title": "Semantic Memory Implementation",
  "anchor": "decision-jwt-011",
  "content": "## Key Decisions\n\n1. Use nomic-embed-text-v1.5 for local embeddings..."
}
```

---

### 3.3 memory_match_triggers

> **<50ms Response**: Context surfaces before you finish typing.

**Purpose**: Fast trigger phrase matching without embeddings. Use for quick keyword-based lookups that don't need semantic understanding.

**Parameters**:

| Parameter | Type   | Required | Default | Description                    |
| --------- | ------ | -------- | ------- | ------------------------------ |
| `prompt`  | string | Yes      | -       | Text to match against triggers |
| `limit`   | number | No       | 3       | Maximum results                |

**Example Request**:
```json
{
  "prompt": "How did we implement OAuth with JWT tokens?",
  "limit": 3
}
```

**Example Response**:
```json
{
  "matchType": "trigger-phrase",
  "count": 2,
  "results": [
    {
      "memoryId": 42,
      "specFolder": "049-auth-system",
      "filePath": "specs/049-auth-system/memory/28-11-25_14-30__oauth.md",
      "title": "OAuth Implementation",
      "matchedPhrases": ["oauth", "jwt"],
      "importanceWeight": 0.8
    }
  ]
}
```

---

### 3.4 memory_list

**Purpose**: Browse stored memories with pagination.

**Parameters**:

| Parameter    | Type   | Required | Default    | Description                                           |
| ------------ | ------ | -------- | ---------- | ----------------------------------------------------- |
| `specFolder` | string | No       | -          | Filter by spec folder                                 |
| `limit`      | number | No       | 20         | Maximum results (max 100)                             |
| `offset`     | number | No       | 0          | Pagination offset                                     |
| `sortBy`     | string | No       | created_at | Sort order: created_at, updated_at, importance_weight |

**Example Request**:
```json
{
  "specFolder": "049-auth-system",
  "limit": 10,
  "offset": 0
}
```

---

### 3.5 memory_update

**Purpose**: Update memory metadata, importance tier, or trigger phrases.

**Parameters**:

| Parameter          | Type   | Required | Default | Description                                                              |
| ------------------ | ------ | -------- | ------- | ------------------------------------------------------------------------ |
| `id`               | number | Yes      | -       | Memory ID to update                                                      |
| `title`            | string | No       | -       | New title                                                                |
| `triggerPhrases`   | array  | No       | -       | Updated trigger phrases                                                  |
| `importanceWeight` | number | No       | -       | Weight 0-1                                                               |
| `importanceTier`   | string | No       | -       | Tier: constitutional, critical, important, normal, temporary, deprecated |

**Embedding Regeneration**: When updating a memory's `title`, the embedding is automatically regenerated to maintain search accuracy. The response includes `embeddingRegenerated: true/false` to indicate whether regeneration occurred.

**Example Request**:
```json
{
  "id": 42,
  "importanceTier": "critical",
  "triggerPhrases": ["oauth", "authentication", "jwt"]
}
```

**Example Response** (with title change):
```json
{
  "success": true,
  "memoryId": 42,
  "updated": ["title", "importanceTier"],
  "embeddingRegenerated": true
}
```

---

### 3.6 memory_delete

**Purpose**: Delete memories by ID or spec folder.

**Parameters**:

| Parameter    | Type    | Required | Default | Description               |
| ------------ | ------- | -------- | ------- | ------------------------- |
| `id`         | number  | No       | -       | Memory ID to delete       |
| `specFolder` | string  | No       | -       | Delete all in spec folder |
| `confirm`    | boolean | No       | -       | Required for bulk delete  |

**Example Request**:
```json
{
  "id": 42
}
```

---

### 3.7 memory_validate

**Purpose**: Record validation feedback for a memory. Builds confidence scores and can trigger tier promotion.

**Parameters**:

| Parameter   | Type    | Required | Default | Description                   |
| ----------- | ------- | -------- | ------- | ----------------------------- |
| `id`        | number  | Yes      | -       | Memory ID to validate         |
| `wasUseful` | boolean | Yes      | -       | Whether the memory was useful |

**Example Request**:
```json
{
  "id": 42,
  "wasUseful": true
}
```

**Example Response**:
```json
{
  "success": true,
  "memoryId": 42,
  "validationCount": 5,
  "confidenceScore": 0.92,
  "promotionEligible": true,
  "message": "Memory has 5+ validations at 90%+ confidence. Consider promoting to critical tier."
}
```

**Confidence-Based Promotion:**
- After 5+ validations at 90%+ confidence, the system suggests promoting to `critical` tier
- Use `memory_update` with `importanceTier: "critical"` to accept the promotion

---

### 3.8 memory_stats

**Purpose**: Get memory system statistics.

**Example Response**:
```json
{
  "totalMemories": 47,
  "byTier": {
    "constitutional": 2,
    "critical": 5,
    "important": 12,
    "normal": 25,
    "temporary": 3,
    "deprecated": 0
  },
  "byStatus": {
    "success": 45,
    "pending": 2,
    "failed": 0
  },
  "databaseSize": "12.5 MB",
  "lastIndexed": "2025-12-16T10:30:00Z"
}
```

---

### 3.9 memory_save

> **Spec Kit Gate 5**: In the enhanced Spec Kit fork, this is called via `generate-context.js`—never manually.

**Purpose**: Index a single memory file into the semantic database.

**Parameters**:

| Parameter  | Type    | Required | Default | Description                        |
| ---------- | ------- | -------- | ------- | ---------------------------------- |
| `filePath` | string  | Yes      | -       | Absolute path to memory file       |
| `force`    | boolean | No       | false   | Re-index even if content unchanged |

**Example Request**:
```json
{
  "filePath": "/Users/me/project/specs/005-memory/memory/16-12-25_14-30__session.md",
  "force": false
}
```

**Example Response**:
```json
{
  "success": true,
  "action": "indexed",
  "memoryId": 42,
  "specFolder": "005-memory",
  "title": "Session Context",
  "triggerPhrases": ["memory", "indexing", "session"]
}
```

---

### 3.10 memory_index_scan

**Purpose**: Scan workspace for new/changed memory files and index them.

**Parameters**:

| Parameter    | Type    | Required | Default | Description                        |
| ------------ | ------- | -------- | ------- | ---------------------------------- |
| `specFolder` | string  | No       | -       | Limit scan to specific spec folder |
| `force`      | boolean | No       | false   | Re-index all files (ignore hash)   |

**Performance**: Uses batch processing to prevent resource exhaustion during bulk indexing:
- **Concurrent processing**: 5 files at a time
- **Batch delay**: 100ms between batches
- **Progress logging**: Reports progress during large scans

**Example Request**:
```json
{
  "specFolder": "005-memory",
  "force": true
}
```

**Example Response**:
```json
{
  "success": true,
  "scanned": 15,
  "indexed": 3,
  "skipped": 12,
  "errors": 0,
  "details": [
    { "file": "16-12-25_14-30__session.md", "action": "indexed", "memoryId": 42 },
    { "file": "15-12-25_10-00__research.md", "action": "skipped", "reason": "unchanged" }
  ]
}
```

---

### 3.11-3.14 Checkpoint Tools

#### checkpoint_create

Create a named checkpoint of current memory state.

```json
{
  "name": "pre-refactor",
  "specFolder": "049-auth-system"
}
```

**Response**:
```json
{
  "success": true,
  "checkpoint": "pre-refactor",
  "memoryCount": 47,
  "createdAt": "2025-12-16T10:30:00Z"
}
```

#### checkpoint_list

List available checkpoints.

```json
{
  "specFolder": "049-auth-system",
  "limit": 10
}
```

**Response**:
```json
{
  "checkpoints": [
    {
      "name": "pre-refactor",
      "memoryCount": 47,
      "createdAt": "2025-12-16T10:30:00Z"
    },
    {
      "name": "v1-release",
      "memoryCount": 42,
      "createdAt": "2025-12-05T14:00:00Z"
    }
  ]
}
```

#### checkpoint_restore

Restore memory state from a checkpoint.

```json
{
  "name": "pre-refactor",
  "clearExisting": false
}
```

#### checkpoint_delete

Delete a checkpoint.

```json
{
  "name": "old-checkpoint"
}
```

---

## 4. ⌨️ SLASH COMMANDS

### Command Reference

| Command              | Purpose                                                |
| -------------------- | ------------------------------------------------------ |
| `/memory/save`       | Save current context with interactive folder detection |
| `/memory/search`     | Search, manage index, view recent, rebuild, verify     |
| `/memory/cleanup`    | Interactive cleanup of old memories                    |
| `/memory/triggers`   | View and manage learned trigger phrases                |
| `/memory/status`     | Quick health check and statistics                      |
| `/memory/checkpoint` | Create, restore, list, delete checkpoints              |

### /memory/save

Simple save with spec folder detection:
- Spec folder passed as CLI argument (stateless)
- Prompts for confirmation or manual selection
- Generates memory file with embeddings

### /memory/search

All search and index management operations:

| Subcommand                             | Purpose                   |
| -------------------------------------- | ------------------------- |
| `/memory/search "query"`               | Semantic search           |
| `/memory/search multi "term1" "term2"` | Multi-concept AND search  |
| `/memory/search recent`                | View recent memories      |
| `/memory/search verify`                | Check index health        |
| `/memory/search rebuild`               | Regenerate all embeddings |
| `/memory/search retry`                 | Retry failed embeddings   |
| `/memory/search list-failed`           | List failed embeddings    |
| `/memory/search resume`                | Resume search session     |

### /memory/cleanup

Interactive cleanup of old, unused, or low-relevance memories:

| Feature                 | Description                                      |
| ----------------------- | ------------------------------------------------ |
| **Zero flags required** | Works without parameters - uses smart defaults   |
| **Interactive preview** | Shows candidates before any deletion             |
| **Review mode**         | Step through each memory with [y/n/v]iew options |
| **Smart defaults**      | 90 days old, <3 accesses, <0.4 confidence        |

**Usage:**
```
/memory/cleanup

# Shows: "Found 5 memories that may be outdated"
# Actions: [a]ll, [r]eview each, [n]one, [c]ancel
```

### /memory/triggers

View and manage learned trigger phrases:

| Feature               | Description                                              |
| --------------------- | -------------------------------------------------------- |
| **Transparency**      | See what phrases the system learned from your searches   |
| **Add/Remove**        | Manually associate or disassociate phrases with memories |
| **Search by trigger** | Find memories matching a specific trigger phrase         |
| **Clear all**         | Reset all learned triggers (with confirmation)           |

**Usage:**
```
/memory/triggers              # Interactive menu
/memory/triggers search oauth # Find memories with "oauth" trigger
/memory/triggers clear        # Reset all triggers
```

### /memory/status

Quick health check and system statistics:

| Metric          | Description                       |
| --------------- | --------------------------------- |
| **Memories**    | Total indexed count               |
| **Health**      | System status (OK/Degraded/Error) |
| **Last save**   | When context was last saved       |
| **Storage**     | Database size in MB               |
| **Performance** | Vector search availability        |

**Usage:**
```
/memory/status

# Output:
# Memories:     47 indexed
# Health:       All systems operational
# Storage:      12.5 MB used
# Quick actions: [s]earch [c]leanup [r]ebuild index
```

### /memory/checkpoint

Create and manage memory state checkpoints:

| Subcommand                          | Purpose                     |
| ----------------------------------- | --------------------------- |
| `/memory/checkpoint create "name"`  | Create named checkpoint     |
| `/memory/checkpoint list`           | List all checkpoints        |
| `/memory/checkpoint restore "name"` | Restore to checkpoint state |
| `/memory/checkpoint delete "name"`  | Delete a checkpoint         |

**Usage:**
```
# Before major changes
/memory/checkpoint create "pre-refactor"

# List available checkpoints
/memory/checkpoint list
# Output:
# - pre-refactor (Dec 10, 47 memories)
# - v1-release (Dec 5, 42 memories)

# Restore if needed
/memory/checkpoint restore "pre-refactor"
```

---

## 5. 💬 TRIGGER PHRASES

### Save Context Triggers

| Phrase          | Also Works             |
| --------------- | ---------------------- |
| "save context"  | "save conversation"    |
| "document this" | "preserve context"     |
| "save session"  | "save this discussion" |

### Manual Save

Save context manually using `/memory/save` command or trigger phrases like "save context". No automatic interval-based saving in OpenCode.

### When to Save

| Scenario           | Example                                  |
| ------------------ | ---------------------------------------- |
| Feature complete   | "Just finished the payment integration"  |
| Complex discussion | "We made 5 architecture decisions today" |
| Team sharing       | "Need to document this for the team"     |
| Session ending     | "Wrapping up for the day"                |

---

## 6. 🔍 SEMANTIC SEARCH

### Basic Search

```bash
/memory/search "how did we implement OAuth authentication"
/memory/search "database schema design decisions"
/memory/search "error handling patterns"
```

**Output:**
```
Semantic Search: "OAuth authentication"

Found 3 relevant memories

  [92%] 049-auth-system/memory/28-11-25_14-30__oauth-implementation.md
        "OAuth callback flow implementation with JWT tokens"
        Triggers: oauth, jwt authentication, callback flow

  [78%] 049-auth-system/memory/25-11-25_10-15__auth-decisions.md
        "Authentication strategy decisions and trade-offs"
```

### Multi-Concept AND Search

```bash
/memory/search multi "oauth" "error handling"
/memory/search multi "database" "performance" "queries"
```

Returns only memories matching **ALL** concepts (2-5 concepts supported).

### Interactive Search Mode

Rich interactive search with preview, filtering, and session persistence:

```
/memory/search "oauth implementation"

Memory Search Results                              Page 1/3
============================================================

Query: "oauth implementation"
Found: 25 memories across 5 spec folders

#1 [92%] OAuth callback flow implementation
   Folder: 049-auth-system  |  Date: Dec 5  |  Tags: oauth, jwt
   "Authorization Code flow with PKCE, httpOnly refresh..."

#2 [85%] JWT token refresh strategy
   Folder: 049-auth-system  |  Date: Dec 4  |  Tags: jwt, refresh
   "Sliding window refresh with httpOnly cookies..."

---------------------------------------------------------------------
Actions: [v]iew #n | [l]oad #n | [f]ilter | [c]luster | [n]ext | [q]uit
```

#### Interactive Actions

| Action           | Purpose                       | Example                          |
| ---------------- | ----------------------------- | -------------------------------- |
| `v#` or `view #` | Preview memory before loading | `v1`                             |
| `l#` or `load #` | Load memory into context      | `l1`                             |
| `f <filter>`     | Filter results                | `f folder:auth date:>2025-12-01` |
| `c`              | Cluster by spec folder        | `c`                              |
| `n` / `p`        | Next/previous page            | `n`                              |
| `e <anchor>`     | Extract specific section      | `e decisions`                    |
| `b`              | Back to previous view         | `b`                              |
| `?`              | Show help                     | `?`                              |

#### Filter Syntax

```bash
f folder:049-auth      # Filter by spec folder (partial match)
f date:>2025-12-01     # Filter by date (after)
f date:<2025-12-01     # Filter by date (before)
f tag:oauth            # Filter by tag
f folder:auth tag:jwt  # Multiple filters (AND)
```

#### Session Persistence

Search sessions persist for 1 hour:
- Resume with `/memory/search resume`
- Auto-saves on every action
- Preserves filters, pagination, and state

### Relevance Scoring

| Factor          | Weight | Description                                      |
| --------------- | ------ | ------------------------------------------------ |
| Category Match  | 35%    | decision > implementation > guide > architecture |
| Keyword Overlap | 30%    | Number of query keywords in anchor ID            |
| Recency Factor  | 20%    | Newer files rank higher                          |
| Spec Proximity  | 15%    | Same spec=1.0, parent=0.8, other=0.3             |

---

## 7. 🔀 HYBRID SEARCH

> **Best of Both Worlds**: Keywords bubble up exact matches. Vectors catch semantic similarity. RRF fusion balances them.

### How It Works

Most search systems force you to choose: keyword search (fast but literal) or vector search (semantic but misses exact matches). This system does both simultaneously, then fuses the results using Reciprocal Rank Fusion (RRF).

```
┌────────────────────────────────────────────────────────────┐
│                    HYBRID SEARCH FLOW                      │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Query: "OAuth error handling"                             │
│         │                                                  │
│         ├──────────────────┬────────────────────┐          │
│         ▼                  ▼                    │          │
│  ┌──────────────┐   ┌──────────────┐            │          │
│  │   FTS5       │   │   Vector     │            │          │
│  │   Search     │   │   Search     │            │          │
│  │  (keywords)  │   │  (semantic)  │            │          │
│  └──────┬───────┘   └──────┬───────┘            │          │
│         │                  │                    │          │
│         ▼                  ▼                    │          │
│  ┌──────────────────────────────────┐           │          │
│  │     RRF Score Fusion             │           │          │
│  │  score = 1/(k + fts_rank) +      │           │          │
│  │          1/(k + vec_rank)        │           │          │
│  └──────────────┬───────────────────┘           │          │
│                 │                               │          │
│                 ▼                               │          │
│  ┌──────────────────────────────────┐           │          │
│  │     Apply Decay + Boosts         │           │          │
│  │  - Memory decay (90-day)         │           │          │
│  │  - Access count boost            │           │          │
│  │  - Importance tier weight        │           │          │
│  └──────────────┬───────────────────┘           │          │
│                 │                               │          │
│                 ▼                               │          │
│         Ranked Results                          │          │
│                                                 │          │
└─────────────────────────────────────────────────┘──────────┘
```

### RRF Score Fusion

> **Why RRF Matters**: You search for "OAuth error handling". FTS5 finds files containing "OAuth". Vector search finds files about "authentication failure recovery". RRF gives you BOTH, ranked intelligently.

Reciprocal Rank Fusion (RRF) combines results from both search methods:

```javascript
// k = 60 (standard RRF constant)
rrf_score = (1 / (k + fts_rank)) + (1 / (k + vector_rank))
```

Benefits:
- Exact keyword matches bubble up (FTS5 strength)
- Semantic similarity still influences ranking (vector strength)
- Neither method dominates—balanced results
- Graceful degradation if one method fails

### Fallback Behavior

| Scenario                            | Behavior              |
| ----------------------------------- | --------------------- |
| FTS5 available + Vector available   | Full hybrid search    |
| FTS5 available + Vector unavailable | FTS5-only mode        |
| FTS5 unavailable + Vector available | Vector-only mode      |
| Both unavailable                    | Anchor-based fallback |

---

## 8. 🏗️ ARCHITECTURE

> **Spec Kit Integration**: Memory files live IN your spec folders, version-controlled alongside your documentation.

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    MCP Client (Claude/OpenCode)             │
└─────────────────────────────┬───────────────────────────────┘
                              │ stdio
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    semantic-memory.js                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ MCP Protocol Handler (@modelcontextprotocol/sdk)    │    │
│  │ - ListTools / CallTool handlers                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                              │                              │
│  ┌─────────────────┬─────────┼─────────┬─────────────────┐  │
│  │                 │         │         │                 │  │
│  ▼                 ▼         ▼         ▼                 │  │
│ ┌─────┐   ┌─────────┐   ┌─────────┐   ┌──────────────┐   │  │
│ │embed│   │vector-  │   │trigger- │   │memory-       │   │  │
│ │dings│   │index.js │   │matcher  │   │parser.js     │   │  │
│ │.js  │   │         │   │.js      │   │(auto-index)  │   │  │
│ └──┬──┘   └────┬────┘   └────┬────┘   └──────┬───────┘   │  │
│    │           │              │               │          │  │
│    │     ┌─────┴─────┐        │               │          │  │
│    │     │           │        │               │          │  │
│    ▼     ▼           ▼        ▼               ▼          │  │
│ ┌────────────┐  ┌────────────────┐    ┌──────────────┐   │  │
│ │ HuggingFace│  │ SQLite + vec   │    │ File Watcher │   │  │
│ │ nomic-v1.5 │  │ memory-index   │    │ (chokidar)   │   │  │
│ │ (local)    │  │ .sqlite        │    │              │   │  │
│ └────────────┘  └────────────────┘    └──────────────┘   │  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Auto-Indexing Layer                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │ file-watcher.js │  │ index-cli.js    │  │ Startup     │  │
│  │ (npm run watch) │  │ (npm run index) │  │ Scan        │  │
│  └────────┬────────┘  └────────┬────────┘  └──────┬──────┘  │
│           │                    │                  │         │
│           └────────────────────┼──────────────────┘         │
│                                ▼                            │
│                     ┌───────────────────┐                   │
│                     │ memory-parser.js  │                   │
│                     │ (shared parsing)  │                   │
│                     └───────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
Save Flow:
  Conversation → generate-context.js → [Write .md, Generate Embedding, Extract Triggers]
                                                ↓
                                     Index in sqlite-vec + FTS5 + Store metadata
                                                ↓
                                        Context Saved (async)

Search Flow (Hybrid):
  1. Query received → Generate embedding
  2. Run parallel searches:
     ├─ FTS5 full-text search (keywords)
     └─ Vector similarity search (semantic)
  3. Merge results with RRF fusion (k=60)
  4. Apply filters (tier, context type, spec folder)
  5. Apply decay + importance boosts
  6. Return ranked results
  
  Fallback: If hybrid fails → Vector-only mode

Trigger Flow:
  Prompt → Load Cache (<20ms) → String Match (<10ms) → Rank → Inject Top 3 (<50ms total)
```

### Storage Architecture

| Data Type         | Location                                                     | Purpose                              |
| ----------------- | ------------------------------------------------------------ | ------------------------------------ |
| Memory content    | `specs/*/memory/*.md`                                        | Human-readable, version controlled   |
| Metadata          | `specs/*/memory/metadata.json`                               | Session info, embedding status       |
| Vector embeddings | `.opencode/skill/system-memory/database/memory-index.sqlite` | Fast semantic search (project-local) |
| FTS5 index        | `.opencode/skill/system-memory/database/memory-index.sqlite` | Full-text keyword search             |
| Checkpoints       | `.opencode/skill/system-memory/database/memory-index.sqlite` | State snapshots                      |
| Trigger cache     | In-memory                                                    | <50ms trigger execution              |

### Memory Decay

Memories naturally decay over time using a 90-day half-life formula:

```
decay_score = base_score * (0.5 ^ (days_since_creation / 90))
```

### Importance Tiers

> **Constitutional Tier**: These memories surface in EVERY session. Use for project rules, coding standards, critical architectural decisions, and **gate enforcement rules** that should never be forgotten.

#### Constitutional Tier for Gate Enforcement

The constitutional tier can be used to create memories that **always surface** at the top of every search, regardless of query relevance. This is critical for enforcement rules like Gate 3 (spec folder question).

**How it works:**
- Memories with `importanceTier: "constitutional"` bypass relevance filtering
- They appear first in search results (~500 token budget)
- Trigger phrases ensure they surface via `memory_match_triggers()`

**Example: Gate 3 Enforcement Memory**
A constitutional memory reminds the AI to always ask the spec folder question before file modifications. See `specs/005-memory/018-gate3-enforcement/` for implementation details.

**Create via:** `memory_update({ id: X, importanceTier: "constitutional" })`

**Response Behavior:**

When constitutional memories are included in search results:
- `similarity: 100` - Always maximum score, regardless of query relevance
- `isConstitutional: true` - Flag for UI/logic differentiation
- `constitutionalCount` - Number of constitutional memories in response
- Always appear at top of results before other memories

Six-level classification system for memory prioritization:

| Tier             | Boost | Use Case                                        | Examples                                            |
| ---------------- | ----- | ----------------------------------------------- | --------------------------------------------------- |
| `constitutional` | 3.0x  | Always-surfaced rules (~500-800 tokens)         | Agent framework, coding standards                   |
| `critical`       | 2.0x  | Architecture decisions, security patterns       | Auth design, database schema choices                |
| `important`      | 1.5x  | Feature implementations, key decisions          | API patterns, integration approaches                |
| `normal`         | 1.0x  | General discussions, explorations               | Session summaries, research notes                   |
| `temporary`      | 0.5x  | Debugging notes, experiments (7-day auto-decay) | Debug sessions, throwaway experiments               |
| `deprecated`     | 0.0x  | Excluded from search                            | Outdated content (still accessible via direct load) |

**Why This Matters:**
- Constitutional memories appear in the dashboard EVERY session—no need to search
- Critical/important memories rank higher without needing exact keyword matches
- Temporary memories fade naturally—no manual cleanup required
- Deprecated memories don't pollute search results but aren't deleted

### Access Tracking

Every memory load increments an access counter. Frequently-accessed memories receive a boost:

```
access_boost = min(1.0, 0.1 * log(access_count + 1))
```

### Cache Behavior

| Cache               | TTL     | Purpose                           |
| ------------------- | ------- | --------------------------------- |
| Trigger phrases     | 60s     | In-memory cache for fast matching |
| Embedding model     | Session | Singleton pattern, loaded once    |
| Database connection | Session | WAL mode for concurrent access    |

### Plugin Integration (Memory Dashboard) - OPTIONAL

> **Note**: The plugin is an **optional enhancement**. The MCP server provides complete memory functionality (all 14 tools) without the plugin. The plugin only adds automatic dashboard injection at session start.

The Memory Context Plugin automatically injects a compact ASCII dashboard at session start, providing immediate visibility into stored memories without consuming excessive context tokens.

#### Dashboard Format

```
╭─────────────────────────────────────────────────────────────╮
│  MEMORY DASHBOARD                          [14 entries]     │
├─────────────────────────────────────────────────────────────┤
│  ★ CONSTITUTIONAL (always active)                           │
│    #42  Agent Framework Rules                               │
│    #15  Code Quality Standards                              │
│                                                             │
│  ◆ CRITICAL                                                 │
│    #89  OAuth Implementation Decisions                      │
│    #67  Database Schema Choices                             │
│                                                             │
│  ◇ IMPORTANT                                                │
│    #103 Payment Integration Notes                           │
│                                                             │
│  ○ RECENT (last 7 days)                                     │
│    #156 Session: Tab Menu Fix (Dec 16)                      │
│    #155 Session: Performance Optimization (Dec 15)          │
├─────────────────────────────────────────────────────────────┤
│  Load: memory_load({ memoryId: # })                         │
│  Search: memory_search({ query: "..." })                    │
╰─────────────────────────────────────────────────────────────╯
```

#### Dashboard Specifications

| Specification      | Value                                                             |
| ------------------ | ----------------------------------------------------------------- |
| **Token Budget**   | ~500-800 tokens (was 2,000-5,000 with full content)               |
| **Max Entries**    | 14 total (3 constitutional + 3 critical + 3 important + 5 recent) |
| **Empty Sections** | Hidden automatically                                              |
| **Tier Icons**     | ★ Constitutional, ◆ Critical, ◇ Important, ○ Recent               |

#### On-Demand Loading

The dashboard displays memory IDs rather than full content. To load a specific memory:

```javascript
// Load by memory ID from dashboard
memory_load({ memoryId: 42 })

// Load by spec folder
memory_load({ specFolder: "049-auth-system" })

// Load specific section (93% token savings)
memory_load({ specFolder: "049-auth-system", anchorId: "decision-jwt-049" })
```

#### Plugin Location

The plugin hooks into OpenCode's session initialization to query the memory database and render the compact dashboard.

**Without the plugin**: All memory operations (search, save, load, etc.) work normally via MCP tools. You simply won't have the automatic dashboard injection at session start.

---

## 9. 💾 DATABASE SCHEMA

### memory_index Table

```sql
CREATE TABLE memory_index (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    spec_folder TEXT NOT NULL,
    file_path TEXT NOT NULL UNIQUE,
    anchor_id TEXT,
    title TEXT,
    summary TEXT,
    trigger_phrases TEXT,          -- JSON array
    importance_weight REAL,        -- 0.0 to 1.0 (legacy)
    importance_tier TEXT DEFAULT 'normal',  -- constitutional|critical|important|normal|temporary|deprecated
    context_type TEXT,             -- decision|implementation|debug|research|discussion
    channel TEXT,                  -- cli|web|api|hook
    session_id TEXT,               -- unique session identifier
    access_count INTEGER DEFAULT 0, -- load/access counter
    validation_count INTEGER DEFAULT 0,  -- times validated by user
    confidence_score REAL DEFAULT 0.5,   -- 0.0-1.0, updated by validation
    embedding_status TEXT,         -- pending | success | failed | retry
    retry_count INTEGER DEFAULT 0,
    last_retry_at TEXT,
    failure_reason TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    created_at_epoch INTEGER,      -- Unix timestamp for decay calculations
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_memory_spec_folder ON memory_index(spec_folder);
CREATE INDEX idx_memory_status ON memory_index(embedding_status);
CREATE INDEX idx_memory_tier ON memory_index(importance_tier);
CREATE INDEX idx_memory_context_type ON memory_index(context_type);
CREATE INDEX idx_memory_created_epoch ON memory_index(created_at_epoch);
CREATE INDEX idx_memory_confidence ON memory_index(confidence_score);
```

### vec_memories Virtual Table

```sql
CREATE VIRTUAL TABLE vec_memories USING vec0(
    embedding FLOAT[768]
);

-- rowid corresponds to memory_index.id
SELECT m.*, v.distance
FROM memory_index m
JOIN vec_memories v ON m.id = v.rowid
WHERE v.embedding MATCH ?
ORDER BY v.distance
LIMIT 10;
```

### memory_fts Virtual Table

```sql
CREATE VIRTUAL TABLE memory_fts USING fts5(
    title,
    summary,
    trigger_phrases,
    content='memory_index',
    content_rowid='id'
);

-- FTS5 search
SELECT m.*, fts.rank
FROM memory_fts fts
JOIN memory_index m ON fts.rowid = m.id
WHERE memory_fts MATCH 'oauth AND authentication'
ORDER BY fts.rank;
```

### memory_history Table

```sql
CREATE TABLE memory_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    memory_id INTEGER NOT NULL,
    action TEXT NOT NULL,          -- created|updated|accessed|deleted
    old_values TEXT,               -- JSON of previous state
    new_values TEXT,               -- JSON of new state
    timestamp TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (memory_id) REFERENCES memory_index(id)
);

CREATE INDEX idx_history_memory ON memory_history(memory_id);
CREATE INDEX idx_history_timestamp ON memory_history(timestamp);
```

### checkpoints Table

```sql
CREATE TABLE checkpoints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    memory_count INTEGER,
    snapshot_data TEXT,            -- JSON blob of memory state
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_checkpoint_name ON checkpoints(name);
```

### Enum Values

#### Embedding Status

| Status    | Description                           |
| --------- | ------------------------------------- |
| `pending` | Embedding generation scheduled        |
| `success` | Embedding generated and indexed       |
| `retry`   | Failed, will retry (retry_count < 3)  |
| `failed`  | Permanently failed (retry_count >= 3) |

#### Context Types

| Type             | Description                   |
| ---------------- | ----------------------------- |
| `decision`       | Architecture/design decisions |
| `implementation` | Code implementation details   |
| `debug`          | Debugging sessions            |
| `research`       | Research and exploration      |
| `discussion`     | General conversation          |

---

## 10. 🔄 AUTO-INDEXING

> **Automation Win**: Create a memory file, it gets indexed. Change a memory file, it gets re-indexed. No manual steps required.

The system provides automatic memory file indexing with 4 complementary approaches.

### How It Works

```
Memory File Created/Changed
         │
         ├─────────────────────────────────────────────────┐
         │                                                 │
         ▼                                                 ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Startup Scan    │  │ File Watcher    │  │ MCP Tools       │
│ (automatic)     │  │ (npm run watch) │  │ (AI agent)      │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              ▼
                    ┌───────────────────┐
                    │ memory-parser.js  │
                    │ Extract metadata  │
                    │ Generate embedding│
                    └────────┬──────────┘
                             │
                             ▼
                    ┌───────────────────┐
                    │ SQLite + vec      │
                    │ memory-index.db   │
                    └───────────────────┘
```

### Indexing Methods

| Method           | How to Use                               | When                 |
| ---------------- | ---------------------------------------- | -------------------- |
| **Startup Scan** | Automatic on MCP server start            | Always (default)     |
| **File Watcher** | `npm run watch` in semantic-memory dir   | Development sessions |
| **CLI Indexer**  | `npm run index` in semantic-memory dir   | Manual/cron jobs     |
| **MCP Tools**    | `memory_save()` or `memory_index_scan()` | AI agent control     |

### CLI Indexer

Command-line tool for manual or cron-based indexing:

```bash
npm run index [options]
```

**Options:**

| Option          | Description                              |
| --------------- | ---------------------------------------- |
| `--dry-run`     | Show what would be indexed without doing |
| `--force`       | Re-index all files (ignore hash)         |
| `--folder NAME` | Limit to specific spec folder            |
| `--cleanup`     | Remove orphaned index entries            |
| `--verbose`     | Show detailed output                     |

**Examples:**
```bash
# Preview what would be indexed
npm run index -- --dry-run

# Force re-index everything
npm run index -- --force

# Index only one spec folder
npm run index -- --folder 005-memory

# Clean up orphaned entries
npm run index -- --cleanup
```

### File Watcher Daemon

Background process that watches for memory file changes:

```bash
npm run watch
# Or: node file-watcher.js
```

**Features:**
- Watches `specs/**/memory/**/*.md` patterns
- Debounces rapid changes (500ms)
- Handles add, change, unlink events

**Environment Variables:**

| Variable                   | Default                   | Description                        |
| -------------------------- | ------------------------- | ---------------------------------- |
| `MEMORY_WATCH_PATH`        | Current working directory | Base path to watch                 |
| `MEMORY_DEBOUNCE_MS`       | 500                       | Debounce delay in ms               |
| `MEMORY_SKIP_STARTUP_SCAN` | (unset)                   | Set to `1` to disable startup scan |

### Content Hash Deduplication

All indexing methods use SHA-256 content hashing:
1. Hash computed from file content
2. Compared against stored hash in database
3. Skip if unchanged (unless `force: true`)
4. Update hash after successful index

### Memory File Detection

Files are detected as memory files if they:
1. Are in a `specs/**/memory/` directory
2. Have `.md` extension
3. Follow naming pattern `DD-MM-YY_HH-MM__topic.md`

### Metadata Extraction

The parser extracts from each memory file:
- **Title**: First `# Heading` or filename
- **Spec Folder**: Derived from path
- **Trigger Phrases**: From frontmatter or auto-extracted via TF-IDF
- **Context Type**: From frontmatter (`decision`, `implementation`, etc.)
- **Importance Tier**: From frontmatter (defaults to `normal`)
- **Content Hash**: SHA-256 for change detection

---

## 11. 📸 CHECKPOINTS

> **Your Undo Button**: Experiment with tier changes, bulk cleanup, or reorganization. Restore in seconds if unhappy.

Checkpoints provide a safety net for memory state management, allowing you to save and restore memory index snapshots.

### Overview

Checkpoints capture the current state of all indexed memories (metadata only, not content files). This enables:
- **Safety nets** before major refactoring or bulk operations
- **Context switching** between different work streams
- **Experimentation** with memory organization
- **Recovery** from accidental deletions or bulk updates

### Use Cases

| Scenario               | Example                                               |
| ---------------------- | ----------------------------------------------------- |
| **Before refactoring** | Save state before reorganizing spec folders           |
| **Context switching**  | Checkpoint "feature-A" before pivoting to "feature-B" |
| **Experimentation**    | Test new importance tiers, restore if unhappy         |
| **Bulk operations**    | Before running cleanup or mass tier updates           |
| **Version milestones** | Checkpoint at v1.0 release for reference              |

### Checkpoint Tools

#### checkpoint_create

Create a named snapshot of current memory state.

**Parameters:**

| Parameter    | Type   | Required | Default | Description                   |
| ------------ | ------ | -------- | ------- | ----------------------------- |
| `name`       | string | Yes      | -       | Unique checkpoint name        |
| `specFolder` | string | No       | -       | Limit to specific spec folder |
| `metadata`   | object | No       | -       | Additional metadata to store  |

**Example Request:**
```json
{
  "name": "pre-refactor-dec-2025",
  "specFolder": "049-auth-system",
  "metadata": {
    "reason": "Before reorganizing auth memories",
    "author": "claude"
  }
}
```

**Example Response:**
```json
{
  "success": true,
  "checkpoint": "pre-refactor-dec-2025",
  "memoryCount": 47,
  "createdAt": "2025-12-16T10:30:00Z",
  "specFolder": "049-auth-system"
}
```

#### checkpoint_list

List all available checkpoints with optional filtering.

**Parameters:**

| Parameter    | Type   | Required | Default | Description           |
| ------------ | ------ | -------- | ------- | --------------------- |
| `specFolder` | string | No       | -       | Filter by spec folder |
| `limit`      | number | No       | 50      | Maximum results       |

**Example Request:**
```json
{
  "specFolder": "049-auth-system",
  "limit": 10
}
```

**Example Response:**
```json
{
  "checkpoints": [
    {
      "name": "pre-refactor-dec-2025",
      "memoryCount": 47,
      "specFolder": "049-auth-system",
      "createdAt": "2025-12-16T10:30:00Z",
      "metadata": { "reason": "Before reorganizing auth memories" }
    },
    {
      "name": "v1-release",
      "memoryCount": 42,
      "specFolder": null,
      "createdAt": "2025-12-05T14:00:00Z",
      "metadata": {}
    }
  ],
  "total": 2
}
```

#### checkpoint_restore

Restore memory state from a checkpoint.

**Parameters:**

| Parameter       | Type    | Required | Default | Description                           |
| --------------- | ------- | -------- | ------- | ------------------------------------- |
| `name`          | string  | Yes      | -       | Checkpoint name to restore            |
| `clearExisting` | boolean | No       | false   | Clear current memories before restore |

**Example Request:**
```json
{
  "name": "pre-refactor-dec-2025",
  "clearExisting": false
}
```

**Example Response:**
```json
{
  "success": true,
  "checkpoint": "pre-refactor-dec-2025",
  "restoredCount": 47,
  "action": "merged"
}
```

**Restore Modes:**
- `clearExisting: false` (default) - Merges checkpoint state with current memories
- `clearExisting: true` - Replaces all memories with checkpoint state

#### checkpoint_delete

Delete a checkpoint that's no longer needed.

**Parameters:**

| Parameter | Type   | Required | Default | Description               |
| --------- | ------ | -------- | ------- | ------------------------- |
| `name`    | string | Yes      | -       | Checkpoint name to delete |

**Example Request:**
```json
{
  "name": "old-checkpoint"
}
```

**Example Response:**
```json
{
  "success": true,
  "deleted": "old-checkpoint"
}
```

### Slash Command: /memory/checkpoint

Interactive checkpoint management via slash command:

```bash
# Create a checkpoint
/memory/checkpoint create "pre-refactor"

# List all checkpoints
/memory/checkpoint list

# Restore a checkpoint
/memory/checkpoint restore "pre-refactor"

# Delete a checkpoint
/memory/checkpoint delete "old-checkpoint"
```

### Database Schema

Checkpoints are stored in the `checkpoints` table:

```sql
CREATE TABLE checkpoints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    memory_count INTEGER,
    snapshot_data TEXT,            -- JSON blob of memory state
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_checkpoint_name ON checkpoints(name);
```

### Best Practices

1. **Name checkpoints descriptively** - Use dates and context: `"pre-auth-refactor-dec-16"` not `"backup"`
2. **Create before bulk operations** - Always checkpoint before cleanup, tier changes, or reorganization
3. **Clean up old checkpoints** - Delete checkpoints older than 30 days unless they mark milestones
4. **Use spec folder filtering** - Checkpoint specific folders when working on isolated features
5. **Document in metadata** - Include `reason` in metadata for future reference

### Limitations

| Limitation              | Details                                                     |
| ----------------------- | ----------------------------------------------------------- |
| **Metadata only**       | Checkpoints store index metadata, not original file content |
| **No auto-checkpoints** | Must be created manually (or via slash command)             |
| **Storage overhead**    | Each checkpoint stores full snapshot (~1KB per memory)      |
| **Max checkpoints**     | Default limit of 10 (configurable in config.jsonc)          |

### Configuration

```jsonc
// In config.jsonc
{
  "checkpoints": {
    "maxCheckpoints": 10,           // Maximum stored checkpoints
    "autoCheckpointOnMajorChanges": false  // Future: auto-checkpoint before bulk ops
  }
}
```

---

## 12. 📊 PERFORMANCE

### Target Metrics

| Operation                  | Target | Typical |
| -------------------------- | ------ | ------- |
| Manual save                | 2-3s   | ~2.5s   |
| Auto-save                  | 3-5s   | ~4s     |
| Embedding generation       | <500ms | ~400ms  |
| Semantic search            | <100ms | ~80ms   |
| Hybrid search              | <150ms | ~120ms  |
| Multi-concept search       | <200ms | ~150ms  |
| Trigger matching           | <50ms  | ~35ms   |
| Vector search              | <500ms | ~450ms  |
| FTS5 search                | <50ms  | ~30ms   |
| Memory load                | <10ms  | ~5ms    |
| Memory update (metadata)   | <50ms  | ~30ms   |
| Memory update (with title) | <500ms | ~430ms  |
| Batch index (per file)     | ~1s    | ~800ms  |
| Batch index (100 files)    | ~25s   | ~20s    |

### Memory Usage

| Component                     | Memory |
| ----------------------------- | ------ |
| Embedding model               | ~200MB |
| Trigger cache (1000 memories) | ~50KB  |
| SQLite connection             | ~10MB  |
| Per embedding                 | ~1.5KB |
| FTS5 index overhead           | ~20%   |

### Optimization Tips

1. **Model Warmup**: Pre-load model before heavy usage
2. **Limit Search Scope**: Use `--spec` flag to search specific folder
3. **Adjust Similarity**: Higher threshold = fewer, more relevant results
4. **Cache TTL**: Increase `cacheTimeMs` for less frequent refreshes

---

## 13. 🚀 INSTALLATION & SETUP

### System Requirements

| Component      | Minimum    | Recommended |
| -------------- | ---------- | ----------- |
| **Node.js**    | 18.0.0     | 20.x LTS    |
| **npm**        | 8.x        | 10.x        |
| **Disk Space** | 200MB      | 500MB       |
| **RAM**        | 512MB free | 2GB free    |

### Dependencies

| Dependency                  | Version | Purpose                  |
| --------------------------- | ------- | ------------------------ |
| `@huggingface/transformers` | ^3.0.0  | Embedding generation     |
| `better-sqlite3`            | ^9.0.0  | SQLite database          |
| `sqlite-vec`                | Latest  | Vector similarity search |

### Quick Start

```bash
# 1. Install sqlite-vec (macOS)
brew install sqlite-vec

# 2. Install Node.js dependencies
cd /path/to/semantic-memory && npm install

# 3. Save context - interactive folder detection
/memory/save

# 4. Search your memories semantically
/memory/search "how did we implement authentication"

# 5. Rebuild index for existing memories
/memory/search rebuild
```

### Environment Variables

| Variable                   | Default                                                      | Description                        |
| -------------------------- | ------------------------------------------------------------ | ---------------------------------- |
| `MEMORY_INDEX_PATH`        | `.opencode/skill/system-memory/database/memory-index.sqlite` | Vector index location              |
| `HUGGINGFACE_CACHE`        | `~/.cache/huggingface/`                                      | Model cache directory              |
| `DEBUG_TRIGGER_MATCHER`    | `false`                                                      | Enable verbose trigger logs        |
| `MEMORY_SURFACING_LIMIT`   | `3`                                                          | Max memories surfaced per prompt   |
| `MEMORY_WATCH_PATH`        | CWD                                                          | Base path for file watcher         |
| `MEMORY_DEBOUNCE_MS`       | `500`                                                        | Debounce delay for watcher         |
| `MEMORY_SKIP_STARTUP_SCAN` | (unset)                                                      | Set to `1` to disable startup scan |

### config.jsonc

```jsonc
{
  "embedding": {
    "model": "nomic-ai/nomic-embed-text-v1.5",
    "dimensions": 768,
    "maxTextLength": 8000
  },
  "surfacing": {
    "enabled": true,
    "maxMemories": 3,
    "minImportanceWeight": 0.3,
    "cacheTimeMs": 60000
  },
  "search": {
    "defaultLimit": 10,
    "minSimilarity": 0.5,
    "multiConceptMinSimilarity": 0.4
  },
  "retry": {
    "maxAttempts": 3,
    "backoffMinutes": [1, 5, 15]
  },
  "memoryDecay": {
    "enabled": true,
    "halfLifeDays": 90,
    "minDecayFactor": 0.1,
    "applyToSearch": true
  },
  "importanceTiers": {
    "constitutional": 3.0,
    "critical": 2.0,
    "important": 1.5,
    "normal": 1.0,
    "temporary": 0.5,
    "deprecated": 0.0,
    "defaultTier": "normal"
  },
  "hybridSearch": {
    "enabled": true,
    "ftsWeight": 0.4,
    "vectorWeight": 0.6,
    "rrfK": 60,
    "minFtsScore": 0.1,
    "minVectorScore": 0.3
  },
  "accessTracking": {
    "enabled": true,
    "boostFactor": 0.1,
    "maxBoost": 1.0
  },
  "checkpoints": {
    "maxCheckpoints": 10,
    "autoCheckpointOnMajorChanges": false
  },
  "constitutionalTier": {
    "enabled": true,
    "maxTokens": 500,
    "alwaysSurface": true
  },
  "confidenceTracking": {
    "enabled": true,
    "promotionThreshold": 0.9,
    "minValidations": 5
  }
}
```

### Claude Code Configuration (.mcp.json)

```json
{
  "mcpServers": {
    "memory_server": {
      "command": "node",
      "args": ["/path/to/semantic-memory/semantic-memory.js"],
      "env": {},
      "disabled": false
    }
  }
}
```

**Enable in settings.local.json**:
```json
{
  "enabledMcpjsonServers": ["memory_server"]
}
```

### OpenCode Configuration (opencode.json)

```json
{
  "mcp": {
    "memory_server": {
      "type": "local",
      "command": ["node", "/path/to/semantic-memory/semantic-memory.js"],
      "environment": {},
      "enabled": true
    }
  }
}
```

### File Locations

| File           | Location                                                     | Purpose                 |
| -------------- | ------------------------------------------------------------ | ----------------------- |
| Vector Index   | `.opencode/skill/system-memory/database/memory-index.sqlite` | Embeddings + metadata   |
| Memory Content | `specs/*/memory/*.md`                                        | Human-readable markdown |
| Metadata       | `specs/*/memory/metadata.json`                               | Session metadata        |

### Testing

```bash
cd .opencode/skill/system-memory

# Unit tests
node scripts/tests/embeddings.test.js
node scripts/tests/trigger-extractor.test.js
node scripts/tests/trigger-matcher.test.js
node scripts/tests/vector-index.test.js

# Integration tests
node scripts/tests/integration/mcp-server.integration.test.js
node scripts/tests/integration/hook-surfacing.integration.test.js

# E2E tests
node scripts/tests/e2e/full-workflow.e2e.test.js

# Performance tests
node scripts/tests/performance/latency.perf.test.js
```

### Test Coverage

| Module               | Tests              | Coverage                           |
| -------------------- | ------------------ | ---------------------------------- |
| embeddings.js        | Unit               | Generation, normalization, Unicode |
| vector-index.js      | Unit + Integration | CRUD, search, multi-concept        |
| trigger-extractor.js | Unit               | Extraction, stop words, dedup      |
| trigger-matcher.js   | Unit + Integration | Matching, cache, performance       |
| MCP Server           | Integration        | Tools, error handling              |

### Manual Testing

```bash
# 1. Save a test context
/memory/save

# 2. Verify it was indexed
/memory/search verify

# 3. Search for it
/memory/search "your test topic"
```

---

## 14. 🛠️ TROUBLESHOOTING

### Server Won't Start

**Problem**: `Error: Cannot find module`

**Solutions**:
1. Check symlink:
   ```bash
   ls -la node_modules
   # Should point to correct location
   ```

2. Reinstall if broken:
   ```bash
   rm node_modules
   ln -s /path/to/.opencode/memory/node_modules .
   ```

### sqlite-vec Not Loading

**Problem**: `Warning: sqlite-vec unavailable, falling back to anchor-only mode`

**Solutions**:
1. Check platform binary:
   ```bash
   ls node_modules/sqlite-vec-darwin-arm64/  # macOS ARM
   ls node_modules/sqlite-vec-linux-x64/     # Linux x64
   ```

2. Install manually (macOS):
   ```bash
   brew install sqlite-vec
   ```

**Fallback**: System operates in anchor-only mode

### Model Download Failed

```bash
# Manual model download
npx @huggingface/transformers download nomic-ai/nomic-embed-text-v1.5

# Or set custom cache directory
export HUGGINGFACE_HUB_CACHE=/path/to/cache
```

### Embedding Generation Failed

```bash
# Check status
/memory/search list-failed

# Retry
/memory/search retry

# If persistent, rebuild
/memory/search rebuild
```

### Search Returns No Results

1. Verify index exists: `/memory/search verify`
2. Rebuild index: `/memory/search rebuild`
3. Check query is meaningful (avoid single words)
4. Lower similarity threshold in config

### Batch Indexing

```bash
cd .opencode/memory/scripts

# Auto-scan all memory files (recursive - supports nested specs)
node index-all.js --scan /path/to/project

# Or use a manifest file (one path per line)
find specs -name "*.md" -path "*/memory/*" > /tmp/manifest.txt
node index-all.js /tmp/manifest.txt
```

**Scan Coverage:**
- `specs/001-foo/memory/` ✓
- `specs/001-foo/002-bar/memory/` ✓ (nested)
- `specs/001-foo/002-bar/003-baz/memory/` ✓ (deeply nested)

### Diagnostic Commands

```bash
# System status
/memory/search verify

# Index statistics
sqlite3 .opencode/skill/system-memory/database/memory-index.sqlite \
  "SELECT embedding_status, COUNT(*) FROM memory_index GROUP BY embedding_status"

# Test embedding
node -e "
require('.opencode/memory/scripts/lib/embeddings')
  .generateEmbedding('test')
  .then(e => console.log('OK:', e.length, 'dimensions'))
  .catch(e => console.error('ERROR:', e.message))
"

# Batch reindex all memories
node .opencode/memory/scripts/index-all.js --scan .

# Check WAL mode
sqlite3 .opencode/skill/system-memory/database/memory-index.sqlite "PRAGMA journal_mode"
# Should return: wal
```

### Log Locations

| Log              | Location                                            |
| ---------------- | --------------------------------------------------- |
| Hook performance | `.opencode/memory/logs/performance.log`             |
| Trigger matching | `.opencode/memory/logs/suggest-semantic-search.log` |
| Memory           | `.opencode/memory/logs/system-memory-trigger.log`   |

---

## 15. ❓ FAQ

### General

**Q: Does this send my data to external servers?**
A: No. All processing is local. The embedding model runs on your machine.

**Q: How much disk space does it use?**
A: ~100MB for the model (first download), ~1.5KB per memory embedding.

**Q: Will this slow down my workflow?**
A: No. Embedding generation is async and doesn't block saves. Trigger matching is <50ms.

### Search

**Q: Why doesn't keyword search find exact matches?**
A: The system uses hybrid search combining FTS5 (keywords) and vector (semantic) search with RRF fusion. This gives you the best of both worlds - exact keyword matches bubble up while semantically related content is also included. If hybrid search fails, it falls back to vector-only mode.

**Q: How do I search only one spec folder?**
A: Use `--spec` flag: `/memory/search "query" --spec 049-auth-system`

### Compatibility

**Q: Do my existing memory files still work?**
A: Yes, 100% backward compatible. All anchor-based commands work identically.

**Q: What if sqlite-vec isn't available?**
A: System falls back to anchor-only mode with a warning. Core functionality preserved.

### Memory Management

**Q: How does memory decay affect my old memories?**
A: Old memories remain searchable but rank lower. The 90-day half-life means a 90-day-old memory has 50% of its original score. Memories marked `critical` or `constitutional` bypass decay.

**Q: Can I restore accidentally deleted memories?**
A: If you created a checkpoint before deletion, yes. Use `/memory/checkpoint restore "name"`.

**Q: How does confidence promotion work?**
A: After 5+ validations with 90%+ confidence score, the system suggests promoting the memory to `critical` tier.

**Q: Does updating a memory affect its searchability?**
A: When you update a memory's `title` using `memory_update`, the embedding is automatically regenerated to maintain search accuracy. The response includes `embeddingRegenerated: true` to confirm. Other metadata changes (tier, triggers) don't affect the embedding.

### Memory Dashboard

**Q: What is the Memory Dashboard?**
A: The dashboard is a compact ASCII summary injected at session start by the Memory Context Plugin. It shows memory IDs organized by tier (Constitutional, Critical, Important, Recent) for on-demand loading via `memory_load({ memoryId: # })`.

**Q: How many tokens does the dashboard use?**
A: ~500-800 tokens (compared to 2,000-5,000 tokens when full content was injected). This optimization preserves context budget for actual work.

**Q: Why don't I see full memory content at session start?**
A: The dashboard shows IDs only. Load specific memories on-demand using `memory_load({ memoryId: # })` for 93% token savings compared to loading everything upfront.

---

## The Philosophy

This memory system exists because context is the most valuable asset in AI-assisted development—and the most fragile.

### Privacy as a Feature

Privacy isn't a checkbox or a compliance requirement. It's a fundamental design principle. Every architectural decision starts with: "How do we do this without your data leaving your machine?"

- Embeddings generated locally (nomic-embed-text-v1.5)
- Vector database stored in your project
- Memory files version-controlled in your spec folders
- No external API calls—works fully offline

### Context as Living Infrastructure

Memory files aren't dead archives. They're living documents that:
- Decay over time (90-day half-life keeps relevance without manual cleanup)
- Earn their importance (confidence-based tier promotion)
- Surface proactively (<50ms trigger matching)
- Integrate deeply with your workflow (Spec Kit Gate 5 enforcement)

### Deep Spec Kit Integration

This isn't a standalone tool bolted onto your workflow. It's woven into the fabric of how you document and resume work:

- **Memory files live in spec folders** — `specs/###-feature/memory/`
- **Gate 5 enforces generate-context.js** — No orphaned context files
- **Sub-folder versioning works naturally** — Each 001/002/003 has independent memory
- **Session resume loads memories automatically** — `/spec_kit:resume` knows what you need

### Automation Over Discipline

Humans forget to document. Humans forget to save context. Humans forget to clean up old memories.

This system doesn't rely on human discipline:
- Auto-indexing catches new files on startup and via file watcher
- Memory decay handles cleanup automatically
- Confidence promotion happens through natural usage
- Checkpoints provide easy recovery from experiments

**The goal:** Make context preservation invisible infrastructure that pays dividends when you need it most.

---

## 16. 📚 RESOURCES

### File Structure

```
semantic-memory/
├── semantic-memory.js    # Main MCP server (executable)
├── file-watcher.js       # File watcher daemon for auto-indexing
├── package.json          # Dependencies manifest
├── README.md             # This file
├── node_modules/         # Dependencies
├── scripts/
│   └── index-cli.js      # CLI indexing command
└── lib/
    ├── embeddings.js     # HuggingFace embedding generation
    ├── vector-index.js   # SQLite-vec database operations
    ├── trigger-matcher.js # Fast phrase matching
    ├── trigger-extractor.js # TF-IDF phrase extraction
    ├── memory-parser.js  # Memory file parsing (shared)
    └── retry-manager.js  # Failed embedding retry logic
```

### Related Documentation

| Document        | Location                                  | Purpose                              |
| --------------- | ----------------------------------------- | ------------------------------------ |
| Install Guide   | `Install Guides/MCP - Semantic Memory.md` | Step-by-step installation            |
| Spec 011        | `specs/011-semantic-memory-upgrade/`      | Full specification                   |
| Skills SKILL.md | `.opencode/skill/system-memory/SKILL.md`  | Memory workflow                      |
| Command: save   | `.opencode/command/memory/save.md`        | Save command reference               |
| Command: search | `.opencode/command/memory/search.md`      | Search command reference             |
| Memory Plugin   | `.opencode/plugin/memory-context.js`      | Dashboard injection at session start |

### Verification Commands

```bash
# Check server version
node semantic-memory.js --version 2>&1 | head -1

# Test startup (Ctrl+C to exit)
node semantic-memory.js

# Check database
sqlite3 .opencode/skill/system-memory/database/memory-index.sqlite ".tables"

# Count indexed memories
sqlite3 .opencode/skill/system-memory/database/memory-index.sqlite "SELECT COUNT(*) FROM memory_index"
```

---

*Semantic Memory MCP Server - Context preservation with intelligent retrieval, hybrid search, memory decay, importance tiers, and checkpoint management.*
