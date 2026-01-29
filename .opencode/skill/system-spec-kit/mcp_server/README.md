# Spec Kit Memory MCP Server

> AI memory that actually persists without poisoning your context window.
> Semantic search, FSRS-powered decay, and cognitive features that make context work across sessions, models, and projects.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🔧 MCP TOOLS (17)](#2--mcp-tools-17)
- [3. 🧠 COGNITIVE MEMORY](#3--cognitive-memory)
- [4. 🔍 SEARCH SYSTEM](#4--search-system)
- [5. 📊 IMPORTANCE TIERS](#5--importance-tiers)
- [6. 📁 STRUCTURE](#6--structure)
- [7. 🚀 QUICK START](#7--quick-start)
- [8. ⚙️ CONFIGURATION](#8--configuration)
- [9. 💡 USAGE EXAMPLES](#9--usage-examples)
- [10. 🛠️ TROUBLESHOOTING](#10--troubleshooting)
- [11. 📚 RELATED RESOURCES](#11--related-resources)

---

## 1. 📖 OVERVIEW

### Why This Memory System?

AI assistants suffer from session amnesia. Every conversation starts fresh. You explain your architecture, make decisions, build context—and it's all gone next session.

This MCP server fixes that with persistent semantic memory, intelligent decay, and cognitive features that prioritize what matters.

**Without This**

- **Search**: Ctrl+F through conversation history
- **Prioritization**: Everything has equal weight
- **Decay**: Either keep forever or delete
- **Duplicates**: Same context indexed multiple times
- **Recovery**: Hope your chat logs aren't corrupted

**With This Memory System**

- **Search**: Hybrid semantic + keyword with RRF fusion
- **Prioritization**: 6-tier importance (constitutional to deprecated)
- **Decay**: FSRS power-law (validated on 100M+ users)
- **Duplicates**: Prediction Error Gating blocks duplicates
- **Recovery**: Checkpoints with full embedding backup

### What Makes This Different

| Capability     | Basic RAG           | This MCP Server                                          |
| -------------- | ------------------- | -------------------------------------------------------- |
| **Search**     | Vector only         | Hybrid FTS5 + vector with RRF fusion                     |
| **Decay**      | None or exponential | FSRS power-law (scientifically validated)                |
| **Duplicates** | Index everything    | Prediction Error Gating (0.95/0.90/0.70/0.50 thresholds) |
| **Tiers**      | None                | 6-tier importance with configurable boosts               |
| **Context**    | Full documents      | ANCHOR-based section retrieval (93% token savings)       |
| **Learning**   | None                | Epistemic tracking with preflight/postflight             |
| **State**      | Stateless           | 5-state cognitive model (HOT/WARM/COLD/DORMANT/ARCHIVED) |

### Key Statistics

| Category                | Count | Details                                       |
| ----------------------- | ----- | --------------------------------------------- |
| **MCP Tools**           | 17    | Search, CRUD, checkpoints, session learning   |
| **Library Modules**     | 32+   | Parsing, scoring, cognitive, storage, search  |
| **Handler Modules**     | 7     | Organized by function domain                  |
| **Embedding Providers** | 3     | HF Local, Voyage AI, OpenAI                   |
| **Cognitive Features**  | 8     | FSRS, PE gating, 5-state, co-activation, etc. |
| **Test Coverage**       | 1,292 | Tests across 17 test files                    |

### Requirements

| Requirement | Minimum | Recommended |
| ----------- | ------- | ----------- |
| Node.js     | 18.0.0  | 20+         |
| npm         | 9+      | 10+         |

---

## 2. 🔧 MCP TOOLS (17)

### Tool Categories Overview

| Category               | Tools | Purpose                          |
| ---------------------- | ----- | -------------------------------- |
| **Search & Retrieval** | 4     | Find and match memories          |
| **CRUD Operations**    | 5     | Create, update, delete, validate |
| **Checkpoints**        | 4     | State snapshots for recovery     |
| **Session Learning**   | 3     | Knowledge tracking across tasks  |
| **System**             | 1     | Health monitoring                |

### Search & Retrieval Tools

| Tool                    | Purpose                                              | Latency |
| ----------------------- | ---------------------------------------------------- | ------- |
| `memory_search`         | Semantic vector search with hybrid FTS5 fusion       | ~500ms  |
| `memory_match_triggers` | Fast trigger phrase matching with cognitive features | <50ms   |
| `memory_list`           | Browse memories with pagination                      | <50ms   |
| `memory_stats`          | System statistics and folder rankings                | <10ms   |

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

### Session Learning Tools

| Tool                          | Purpose                                            | Latency |
| ----------------------------- | -------------------------------------------------- | ------- |
| `task_preflight`              | Capture epistemic baseline before task execution   | <50ms   |
| `task_postflight`             | Capture state after task, calculate learning delta | <50ms   |
| `memory_get_learning_history` | Get learning history with trends for a spec folder | <50ms   |

### System Tools

| Tool            | Purpose                                  | Latency |
| --------------- | ---------------------------------------- | ------- |
| `memory_health` | Check health status of the memory system | <10ms   |

### Key Tool Parameters

#### memory_search

| Parameter               | Type     | Default  | Description                             |
| ----------------------- | -------- | -------- | --------------------------------------- |
| `query`                 | string   | -        | Natural language search query           |
| `concepts`              | string[] | -        | Multi-concept AND search (2-5 concepts) |
| `specFolder`            | string   | -        | Limit search to specific spec folder    |
| `limit`                 | number   | 10       | Maximum results (1-20)                  |
| `includeConstitutional` | boolean  | **true** | Include constitutional tier at top      |
| `includeContent`        | boolean  | false    | Embed file content in results           |
| `anchors`               | string[] | -        | Specific anchor IDs to extract          |
| `searchType`            | string   | "hybrid" | "vector", "hybrid", or "multi-concept"  |

#### memory_match_triggers

| Parameter           | Type    | Default      | Description                    |
| ------------------- | ------- | ------------ | ------------------------------ |
| `prompt`            | string  | **Required** | User prompt to match           |
| `limit`             | number  | 3            | Maximum matches                |
| `session_id`        | string  | -            | Session for cognitive features |
| `turn_number`       | number  | -            | Turn for decay calculation     |
| `include_cognitive` | boolean | true         | Enable cognitive features      |

#### memory_update

| Parameter            | Type     | Default | Description                                 |
| -------------------- | -------- | ------- | ------------------------------------------- |
| `id`                 | number   | **Req** | Memory ID to update                         |
| `title`              | string   | -       | New title (triggers embedding regeneration) |
| `importanceTier`     | string   | -       | New tier (constitutional to deprecated)     |
| `importanceWeight`   | number   | -       | Custom weight (0-1)                         |
| `triggerPhrases`     | string[] | -       | Trigger phrases for fast matching           |
| `allowPartialUpdate` | boolean  | false   | Continue if embedding regeneration fails    |

---

## 3. 🧠 COGNITIVE MEMORY

### FSRS Power-Law Decay

Memory strength follows the Free Spaced Repetition Scheduler formula, validated on 100M+ Anki users:

```
R(t, S) = (1 + 0.235 × t/S)^(-0.5)
```

Where:
- `R(t, S)` = Retrievability (probability of recall) at time t with stability S
- `t` = Time elapsed since last access (in days)
- `S` = Stability (memory strength in days)—higher = slower decay
- `0.235` and `-0.5` are empirically validated constants

**Why FSRS?**
- Exponential decay (e^-kt) underestimates long-term retention
- Power-law decay matches human memory research
- Validated on 100M+ real-world users via Anki spaced repetition

### 5-State Memory Model

Memories transition between states based on their retrievability score:

| State        | Retrievability   | Content Returned | Max Items | Behavior                                   |
| ------------ | ---------------- | ---------------- | --------- | ------------------------------------------ |
| **HOT**      | R >= 0.80        | Full content     | 5         | Active working memory, top priority        |
| **WARM**     | 0.25 <= R < 0.80 | Summary only     | 10        | Accessible background context              |
| **COLD**     | 0.05 <= R < 0.25 | None             | -         | Inactive but retrievable on demand         |
| **DORMANT**  | 0.02 <= R < 0.05 | None             | -         | Very weak, needs explicit revival          |
| **ARCHIVED** | R < 0.02 or 90d+ | None             | -         | Time-based archival, effectively forgotten |

**State Transitions:**
```
HOT (fresh) → WARM (days) → COLD (weeks) → DORMANT (months) → ARCHIVED
     ↑__________________|__________________|__________________|
              Accessing a memory "revives" it (Testing Effect)
```

### Retrievability Calculation Priority

The tier classifier uses this priority order when calculating retrievability:

1. **Pre-computed `retrievability`** - If memory has a numeric `retrievability` field, use it directly (highest priority)
2. **FSRS calculation** - If timestamps exist (`last_review`, `lastReview`, `updated_at`, or `created_at`), calculate using FSRS formula
3. **Stability fallback** - If only `stability` exists but no timestamps, use `min(1, stability / 10)`
4. **Attention score fallback** - If `attentionScore` exists (from working memory), use it directly
5. **Default** - Returns 0 if no data available

### Prediction Error Gating

Prevents duplicate memories from polluting the index using a four-tier similarity threshold system:

| Similarity | Category         | Action                                                |
| ---------- | ---------------- | ----------------------------------------------------- |
| >= 0.95    | **DUPLICATE**    | Block save, reinforce existing memory instead         |
| 0.90-0.94  | **HIGH_MATCH**   | Check for contradiction; UPDATE or SUPERSEDE existing |
| 0.70-0.89  | **MEDIUM_MATCH** | Create with link to related memory                    |
| 0.50-0.69  | **LOW_MATCH**    | Create new, note similarity in metadata               |
| < 0.50     | **UNIQUE**       | Create new memory normally                            |

**Contradiction Detection:**
- Boolean contradictions: "always" vs "never", "true" vs "false"
- Numeric contradictions: Different values for same metric
- Temporal contradictions: Different timestamps for same event

**Audit Trail:**
All PE decisions are logged to `memory_conflicts` table for debugging and analysis.

### Testing Effect (Desirable Difficulty)

Accessing memories strengthens them—the harder the recall, the greater the benefit:

| Retrievability at Access | Stability Boost | Why                                                |
| ------------------------ | --------------- | -------------------------------------------------- |
| R >= 0.90 (easy recall)  | +5%             | Memory was strong, minimal benefit                 |
| R = 0.70 (moderate)      | +10%            | Standard reinforcement                             |
| R = 0.50 (challenging)   | +15%            | "Desirable difficulty"—greater retention           |
| R < 0.30 (hard recall)   | +20%            | Successfully retrieving weak memory = strong boost |

**Auto-applied:** Testing Effect runs automatically when memories are accessed via `memory_search`.

### Co-Activation

When one memory is retrieved, related memories get a boost:

| Relationship        | Boost | Description                               |
| ------------------- | ----- | ----------------------------------------- |
| Same spec folder    | +0.2  | Memories in same project context          |
| Temporal proximity  | +0.15 | Created/accessed within same time window  |
| Shared entities     | +0.1  | Reference same files, functions, concepts |
| Semantic similarity | +0.05 | High vector similarity (>0.8)             |

**Working Memory Capacity:** Limited to ~7 active items (Miller's Law) + 10 WARM items.

### Session Learning (Epistemic Tracking)

Track knowledge improvement across task execution with the preflight/postflight pattern:

```javascript
// 1. BEFORE starting work - capture baseline
task_preflight({
  specFolder: "specs/077-upgrade",
  taskId: "T1",
  knowledgeScore: 40,      // 0-100: How well do you understand?
  uncertaintyScore: 70,    // 0-100: How uncertain about approach?
  contextScore: 50,        // 0-100: How complete is your context?
  knowledgeGaps: ["database schema", "API endpoints"]
})

// 2. DO THE WORK

// 3. AFTER completing work - measure delta
task_postflight({
  specFolder: "specs/077-upgrade",
  taskId: "T1",
  knowledgeScore: 85,      // Improved!
  uncertaintyScore: 20,    // Reduced!
  contextScore: 90,        // Better!
  gapsClosed: ["database schema", "API endpoints"],
  newGapsDiscovered: ["edge case handling"]
})
```

**Learning Index Formula:**
```
LI = (KnowledgeDelta × 0.4) + (UncertaintyReduction × 0.35) + (ContextImprovement × 0.25)
```

Example: `LI = (45 × 0.4) + (50 × 0.35) + (40 × 0.25) = 45.5`

**Interpretation:**
- LI > 30: Strong learning session
- LI 10-30: Moderate learning
- LI < 10: Minimal learning or rework

---

## 4. 🔍 SEARCH SYSTEM

### Hybrid Search (FTS5 + Vector)

The default search combines full-text search (FTS5) with vector similarity using Reciprocal Rank Fusion (RRF):

```
RRF_score = Σ 1 / (k + rank_i)
```

Where `k=60` (standard RRF constant) and `rank_i` is the rank from each search method.

**Why Hybrid?**
- FTS5 catches exact keyword matches ("TODO", "BUG-123")
- Vector catches semantic matches ("authentication" finds "login", "OAuth", "session")
- RRF combines both without manual weight tuning

### Search Types

| Type              | Best For                    | Example Query                  |
| ----------------- | --------------------------- | ------------------------------ |
| **hybrid**        | General queries (default)   | "how does auth work"           |
| **vector**        | Pure semantic similarity    | "security concerns"            |
| **multi-concept** | Multiple independent topics | concepts: ["auth", "database"] |

### ANCHOR Format (93% Token Savings)

Memory files use ANCHOR markers for section-level retrieval instead of loading entire documents:

```markdown
<!-- ANCHOR: decisions -->
## Authentication Decision
We chose JWT with refresh tokens because:
1. Stateless authentication scales better
2. Refresh tokens allow session extension without re-login
<!-- ANCHOR_END: decisions -->

<!-- ANCHOR: context -->
## Implementation Context
The auth system uses Express middleware...
<!-- ANCHOR_END: context -->
```

**Retrieval:**
```javascript
memory_search({
  query: "auth decisions",
  anchors: ['decisions', 'context']  // Only return these sections
})
```

**Common Anchors:**
| Anchor       | Purpose                         |
| ------------ | ------------------------------- |
| `summary`    | Executive summary of the memory |
| `decisions`  | Key decisions and rationale     |
| `context`    | Background context              |
| `state`      | Current state/progress          |
| `artifacts`  | Code snippets, file references  |
| `blockers`   | Known issues, blockers          |
| `next-steps` | Planned work, continuations     |
| `metadata`   | Technical metadata              |

**Token Savings:**
- Full document: ~3000 tokens
- Summary anchor only: ~200 tokens
- Savings: **93%**

### Constitutional Tier (Always Surfaces)

The **constitutional** tier is special—these memories ALWAYS appear at the top of search results:

| Behavior             | Description                                         |
| -------------------- | --------------------------------------------------- |
| **Always surfaces**  | Included at top of every `memory_search` by default |
| **Fixed similarity** | Returns `similarity: 100` regardless of query match |
| **Token budget**     | ~2000 tokens max for constitutional memories        |
| **Use cases**        | Project rules, coding standards, critical context   |
| **Control**          | Set `includeConstitutional: false` to disable       |

---

## 5. 📊 IMPORTANCE TIERS

### The Six-Tier System

| Tier               | Boost | Decay Rate | Auto-Clean | Use Case                                         |
| ------------------ | ----- | ---------- | ---------- | ------------------------------------------------ |
| **constitutional** | 10.0x | Never      | Never      | Project rules, always-surface (~2000 tokens max) |
| **critical**       | 5.0x  | Never      | Never      | Architecture decisions, breaking changes         |
| **important**      | 2.0x  | Never      | Never      | Key implementations, major features              |
| **normal**         | 1.0x  | 0.80/turn  | 90 days    | Standard development context (default)           |
| **temporary**      | 0.5x  | 0.60/turn  | 7 days     | Debug sessions, experiments                      |
| **deprecated**     | 0.1x  | Never      | Manual     | Outdated info (preserved but rarely surfaces)    |

### Tier Selection Guide

| Content Type                     | Recommended Tier   |
| -------------------------------- | ------------------ |
| Coding standards, project rules  | `constitutional`   |
| Breaking changes, migration docs | `critical`         |
| Feature specs, architecture ADRs | `important`        |
| Implementation notes             | `normal` (default) |
| Debug logs, experiments          | `temporary`        |
| Replaced/outdated docs           | `deprecated`       |

### Tier Behaviors

**Protected Tiers** (constitutional, critical, important):
- Never automatically decay
- Never auto-cleaned
- Always considered in search ranking

**Decaying Tiers** (normal, temporary):
- Decay rate applied each turn (0.80 for normal, 0.60 for temporary)
- Auto-cleaned after inactivity period
- Can transition to COLD/DORMANT/ARCHIVED states

---

## 6. 📁 STRUCTURE

```
mcp_server/
├── context-server.js       # Main MCP server entry point (17 tools)
├── package.json            # Dependencies and scripts
├── README.md               # This file
│
├── core/                   # Core initialization
│   ├── index.js            # Core exports
│   ├── config.js           # Configuration management
│   └── db-state.js         # Database connection state
│
├── handlers/               # MCP tool handlers (7 modules)
│   ├── index.js            # Handler aggregator
│   ├── memory-search.js    # memory_search + Testing Effect
│   ├── memory-triggers.js  # memory_match_triggers + cognitive
│   ├── memory-save.js      # memory_save + PE gating
│   ├── memory-crud.js      # update/delete/list/stats/health/validate
│   ├── memory-index.js     # memory_index_scan + constitutional discovery
│   ├── checkpoints.js      # checkpoint_create/list/restore/delete
│   └── session-learning.js # preflight/postflight/learning history
│
├── lib/                    # Library modules (32+ total)
│   ├── cognitive/          # Cognitive memory (8 modules)
│   │   ├── fsrs-scheduler.js       # FSRS power-law algorithm
│   │   ├── prediction-error-gate.js # Duplicate detection
│   │   ├── tier-classifier.js      # 5-state classification
│   │   ├── attention-decay.js      # Turn-based decay
│   │   ├── co-activation.js        # Related memory boosting
│   │   ├── working-memory.js       # Session-scoped activation
│   │   ├── temporal-contiguity.js  # Time-based linking
│   │   ├── summary-generator.js    # Auto-summary generation
│   │   └── index.js                # Module aggregator
│   │
│   ├── scoring/            # Scoring algorithms (5 modules)
│   │   ├── composite-scoring.js    # Multi-factor scoring (R weight 0.15)
│   │   ├── importance-tiers.js     # Tier boost values
│   │   ├── folder-scoring.js       # Spec folder ranking
│   │   ├── confidence-tracker.js   # Confidence scoring
│   │   └── index.js
│   │
│   ├── search/             # Search engines (4 modules)
│   │   ├── vector-index.js         # sqlite-vec vector search
│   │   ├── hybrid-search.js        # FTS5 + vector fusion
│   │   ├── rrf-fusion.js           # Reciprocal Rank Fusion
│   │   ├── reranker.js             # Result reranking
│   │   └── index.js
│   │
│   ├── parsing/            # File parsing (4 modules)
│   │   ├── memory-parser.js        # Memory file parsing
│   │   ├── trigger-matcher.js      # Trigger phrase matching
│   │   ├── trigger-extractor.js    # Extract triggers from content
│   │   ├── entity-scope.js         # Entity scope detection
│   │   └── index.js
│   │
│   ├── providers/          # Embedding providers (2 modules)
│   │   ├── embeddings.js           # Provider abstraction
│   │   ├── retry-manager.js        # API retry logic
│   │   └── index.js
│   │
│   ├── storage/            # Persistence (4 modules)
│   │   ├── access-tracker.js       # Access history
│   │   ├── checkpoints.js          # State snapshots
│   │   ├── history.js              # Modification history
│   │   ├── index-refresh.js        # Index maintenance
│   │   └── index.js
│   │
│   ├── utils/              # Utilities (4 modules)
│   │   ├── validators.js           # Input validation
│   │   ├── json-helpers.js         # Safe JSON operations
│   │   ├── batch-processor.js      # Batch operations
│   │   └── index.js
│   │
│   ├── errors.js           # Custom error classes
│   ├── channel.js          # MCP communication
│   └── index.js            # Root barrel export
│
├── formatters/             # Output formatting (2 modules)
│   ├── search-results.js   # Format search results + token metrics
│   └── token-metrics.js    # Token estimation
│
├── tests/                  # Test suite (1,292 tests across 17 files)
│   ├── fsrs-scheduler.test.js
│   ├── prediction-error-gate.test.js
│   ├── tier-classifier.test.js
│   ├── attention-decay.test.js
│   ├── composite-scoring.test.js
│   ├── co-activation.test.js
│   ├── working-memory.test.js
│   ├── summary-generator.test.js
│   ├── memory-save-integration.test.js
│   ├── memory-search-integration.test.js
│   ├── schema-migration.test.js
│   ├── modularization.test.js
│   ├── test-cognitive-integration.js
│   ├── test-memory-handlers.js
│   ├── test-mcp-tools.js
│   ├── test-session-learning.js
│   └── verify-cognitive-upgrade.js
│
├── database/               # SQLite database storage
│   └── context-index.sqlite
│
└── configs/                # Configuration files
    └── search-weights.json
```

---

## 7. 🚀 QUICK START

### 30-Second Setup

The server is typically started via MCP configuration, not manually.

```bash
# 1. Navigate to mcp_server directory
cd .opencode/skill/system-spec-kit/mcp_server

# 2. Install dependencies
npm install

# 3. Start server (for testing)
npm start
```

### Verify Installation

```bash
# Check Node.js version
node --version
# Expected: v18.0.0 or higher

# Check dependencies installed
ls node_modules/@modelcontextprotocol/sdk

# Run test suite
npm test
# Expected: 1,292 tests passing
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

## 8. ⚙️ CONFIGURATION

### Environment Variables

#### Core Configuration

| Variable                | Default                           | Description                     |
| ----------------------- | --------------------------------- | ------------------------------- |
| `MEMORY_DB_PATH`        | `./database/context-index.sqlite` | Database location               |
| `MEMORY_BASE_PATH`      | CWD                               | Workspace root for memory files |
| `DEBUG_TRIGGER_MATCHER` | `false`                           | Enable verbose trigger logs     |

#### Embedding Provider Configuration

| Variable              | Required   | Description                              |
| --------------------- | ---------- | ---------------------------------------- |
| `EMBEDDINGS_PROVIDER` | No         | Force: `voyage`, `openai`, or `hf-local` |
| `VOYAGE_API_KEY`      | For Voyage | Voyage AI API key                        |
| `OPENAI_API_KEY`      | For OpenAI | OpenAI API key                           |

### Embedding Providers

| Provider              | Dimensions | Speed | Quality   | Privacy   | Best For                     |
| --------------------- | ---------- | ----- | --------- | --------- | ---------------------------- |
| **Voyage AI**         | 1024       | Fast  | Excellent | Cloud     | Production (recommended)     |
| **OpenAI**            | 1536/3072  | Fast  | Very Good | Cloud     | Alternative cloud option     |
| **HuggingFace Local** | 768        | Slow* | Good      | **Local** | Privacy, offline, air-gapped |

*First run downloads model (~400MB), subsequent runs faster

**Auto-Detection Priority:**
1. Explicit `EMBEDDINGS_PROVIDER` environment variable
2. `VOYAGE_API_KEY` detected → Voyage (1024d)
3. `OPENAI_API_KEY` detected → OpenAI (1536d)
4. Default → HuggingFace Local (768d)

#### Cognitive Memory Thresholds

| Variable            | Default | Description                          |
| ------------------- | ------- | ------------------------------------ |
| `HOT_THRESHOLD`     | 0.80    | Retrievability threshold for HOT     |
| `WARM_THRESHOLD`    | 0.25    | Retrievability threshold for WARM    |
| `COLD_THRESHOLD`    | 0.05    | Retrievability threshold for COLD    |
| `DORMANT_THRESHOLD` | 0.02    | Retrievability threshold for DORMANT |
| `MAX_HOT_MEMORIES`  | 5       | Maximum HOT tier memories            |
| `MAX_WARM_MEMORIES` | 10      | Maximum WARM tier memories           |

### Database Schema

| Table              | Purpose                                 |
| ------------------ | --------------------------------------- |
| `memory_index`     | Memory metadata (title, tier, triggers) |
| `vec_memories`     | Vector embeddings (sqlite-vec)          |
| `memory_fts`       | Full-text search index (FTS5)           |
| `checkpoints`      | State snapshots                         |
| `memory_history`   | Access and modification history         |
| `learning_records` | Session learning preflight/postflight   |
| `working_memory`   | Session-scoped attention scores         |
| `memory_conflicts` | PE gating decisions (audit trail)       |

### Composite Scoring Weights

Search results are ranked using multi-factor composite scoring:

| Factor             | Weight | Description                       |
| ------------------ | ------ | --------------------------------- |
| **Similarity**     | 0.30   | Vector similarity to query        |
| **Importance**     | 0.25   | Tier boost (constitutional = 10x) |
| **Retrievability** | 0.15   | FSRS-calculated memory strength   |
| **Recency**        | 0.15   | Time since last access            |
| **Popularity**     | 0.10   | Access frequency                  |
| **Tier Boost**     | 0.05   | Additional tier-based adjustment  |

### Dependencies

| Dependency                  | Version        | Purpose                  |
| --------------------------- | -------------- | ------------------------ |
| `@modelcontextprotocol/sdk` | ^1.24.3        | MCP protocol             |
| `@huggingface/transformers` | ^3.8.1         | Local embeddings         |
| `better-sqlite3`            | ^12.5.0        | SQLite database          |
| `sqlite-vec`                | ^0.1.7-alpha.2 | Vector similarity search |

---

## 9. 💡 USAGE EXAMPLES

### Example 1: Basic Memory Search

```javascript
// Simple semantic search
memory_search({
  query: "how does authentication work",
  limit: 5
})
// Returns: constitutional memories at top + semantic matches
```

### Example 2: ANCHOR-Based Retrieval (Token Efficient)

```javascript
// Only retrieve specific sections
memory_search({
  query: "auth decisions",
  anchors: ['decisions', 'context'],
  includeContent: true
})
// Returns: Only decision and context sections (~93% token savings)
```

### Example 3: Multi-Concept Search

```javascript
// Find memories about BOTH auth AND database
memory_search({
  concepts: ["authentication", "database migration"],
  limit: 10
})
// Returns: Memories that match both concepts
```

### Example 4: Session Learning Workflow

```javascript
// 1. Before starting implementation - capture baseline
task_preflight({
  specFolder: "specs/077-upgrade",
  taskId: "T1",
  knowledgeScore: 40,
  uncertaintyScore: 70,
  contextScore: 50,
  knowledgeGaps: ["database schema", "API endpoints"]
})

// 2. Do the implementation work...

// 3. After completing - measure improvement
task_postflight({
  specFolder: "specs/077-upgrade",
  taskId: "T1",
  knowledgeScore: 85,
  uncertaintyScore: 20,
  contextScore: 90,
  gapsClosed: ["database schema", "API endpoints"],
  newGapsDiscovered: ["edge case handling"]
})
// Result: Learning Index = 45.5 (strong learning session)
```

### Example 5: Cognitive Memory with Session Tracking

```javascript
// Fast trigger matching with cognitive features
memory_match_triggers({
  prompt: "implement authentication feature",
  session_id: "session-abc",
  turn_number: 5,
  include_cognitive: true
})
// Returns: memories with attention scores, HOT/WARM tiers, co-activated related memories
```

### Example 6: Checkpoint Recovery

```javascript
// Before risky operation
checkpoint_create({
  name: "pre-cleanup",
  metadata: { reason: "Safety before bulk delete" }
})

// Do risky operation...
memory_delete({ specFolder: "specs/old-project", confirm: true })

// If something went wrong
checkpoint_restore({ name: "pre-cleanup" })
// Database restored to pre-delete state
```

### Example 7: Update Memory Tier

```javascript
// Promote a memory to critical tier
memory_update({
  id: 123,
  importanceTier: "critical",
  triggerPhrases: ["breaking change", "migration required"]
})
```

### Common Patterns

| Pattern                   | Tool Call                                   | When to Use                   |
| ------------------------- | ------------------------------------------- | ----------------------------- |
| Find related context      | `memory_search({ query: "..." })`           | Before starting work          |
| Token-efficient retrieval | `memory_search({ anchors: ['summary'] })`   | Large context, limited budget |
| Track learning            | `task_preflight` → work → `task_postflight` | Implementation tasks          |
| Check system health       | `memory_health({})`                         | Debugging issues              |
| Recover from error        | `checkpoint_restore({ name: "..." })`       | After mistakes                |
| Fast phrase matching      | `memory_match_triggers({ prompt: "..." })`  | Real-time suggestions         |

---

## 10. 🛠️ TROUBLESHOOTING

### Common Issues

#### Model Download Failures

**Symptom:** `Error: Failed to download embedding model`

**Solution:**
```bash
# Clear HuggingFace cache
rm -rf ~/.cache/huggingface/
# Server re-downloads on next start
```

#### Database Corruption

**Symptom:** `SQLITE_CORRUPT` or search returns no results

**Solution:**
```bash
# Delete database
rm .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite

# Restart MCP server (recreates database)
# Then re-index
memory_index_scan({ force: true })
```

#### Embedding Dimension Mismatch

**Symptom:** `Error: Vector dimension mismatch`

**Cause:** Switched embedding providers mid-project

**Solution:**
```bash
# Delete database (clears old embeddings)
rm .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite

# Re-index with new provider
memory_index_scan({ force: true })
```

#### Empty Search Results

**Symptom:** `memory_search` returns no results

**Causes & Solutions:**
1. **Database empty:** Run `memory_index_scan({ force: true })`
2. **Embedding model not ready:** Check `memory_health({})` for `embeddingModelReady: true`
3. **Query too specific:** Try broader search terms
4. **Wrong specFolder:** Check `memory_list({})` for available folders

#### Preflight Record Not Found

**Symptom:** `task_postflight` fails with "No preflight record found"

**Cause:** Calling `task_postflight` without prior `task_preflight`, or mismatched `specFolder`/`taskId`

**Solution:** Ensure `task_preflight` is called first with matching `specFolder` and `taskId`.

### Quick Fixes

| Problem                | Quick Fix                                      |
| ---------------------- | ---------------------------------------------- |
| Empty search results   | `memory_index_scan({ force: true })`           |
| Slow embeddings        | Set `VOYAGE_API_KEY` for faster API embeddings |
| Missing constitutional | Check files in `constitutional/` directory     |
| Learning not tracked   | Ensure `specFolder` and `taskId` match exactly |
| Duplicate detection    | Check `memory_conflicts` table for decisions   |
| Tier not updating      | Verify valid tier name (6 options)             |

### Diagnostic Commands

```bash
# Check database status
sqlite3 database/context-index.sqlite "SELECT COUNT(*) FROM memory_index;"

# Check schema version
sqlite3 database/context-index.sqlite "PRAGMA user_version;"

# Check recent PE gating decisions
sqlite3 database/context-index.sqlite "SELECT * FROM memory_conflicts ORDER BY created_at DESC LIMIT 5;"

# Check memory states
sqlite3 database/context-index.sqlite "SELECT importance_tier, COUNT(*) FROM memory_index GROUP BY importance_tier;"

# Check learning records
sqlite3 database/context-index.sqlite "SELECT spec_folder, COUNT(*) FROM learning_records GROUP BY spec_folder;"
```

### Run Tests

```bash
# Run full test suite
cd .opencode/skill/system-spec-kit/mcp_server
npm test

# Run specific test file
node tests/fsrs-scheduler.test.js
node tests/tier-classifier.test.js
```

---

## 11. 📚 RELATED RESOURCES

### Parent Documentation

| Document      | Location                                           | Purpose                             |
| ------------- | -------------------------------------------------- | ----------------------------------- |
| Skill README  | `../README.md`                                     | Complete skill documentation        |
| SKILL.md      | `../SKILL.md`                                      | Workflow instructions for AI agents |
| Install Guide | `../../../install_guides/MCP - Spec Kit Memory.md` | Detailed installation               |

### Sub-Folder Documentation

| Folder        | README                 | Purpose                              |
| ------------- | ---------------------- | ------------------------------------ |
| `handlers/`   | `handlers/README.md`   | MCP tool handler implementations     |
| `lib/`        | `lib/README.md`        | Library modules (cognitive, scoring) |
| `formatters/` | `formatters/README.md` | Output formatting and token metrics  |

### Key Module Files

| Module                                   | Purpose                                 |
| ---------------------------------------- | --------------------------------------- |
| `lib/cognitive/fsrs-scheduler.js`        | FSRS power-law decay algorithm          |
| `lib/cognitive/tier-classifier.js`       | 5-state memory classification           |
| `lib/cognitive/prediction-error-gate.js` | Duplicate detection and PE gating       |
| `lib/scoring/composite-scoring.js`       | Multi-factor ranking with R weight      |
| `lib/search/hybrid-search.js`            | FTS5 + vector fusion with RRF           |
| `handlers/memory-save.js`                | Save handler with PE gating integration |
| `handlers/session-learning.js`           | Epistemic tracking implementation       |

### External Resources

| Resource          | URL                                                      |
| ----------------- | -------------------------------------------------------- |
| MCP Protocol Spec | https://modelcontextprotocol.io/                         |
| FSRS Algorithm    | https://github.com/open-spaced-repetition/fsrs4anki/wiki |
| sqlite-vec        | https://github.com/asg017/sqlite-vec                     |
| Voyage AI         | https://www.voyageai.com/                                |
| FTS5 Docs         | https://www.sqlite.org/fts5.html                         |