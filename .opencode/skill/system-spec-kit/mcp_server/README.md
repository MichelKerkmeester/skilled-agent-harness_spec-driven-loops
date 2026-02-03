# Spec Kit Memory MCP Server

> AI memory that actually persists without poisoning your context window.
> Hybrid search, FSRS-powered decay, causal graphs, and cognitive features that make context work across sessions, models, and projects.

---

## 📑 TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🔧 MCP TOOLS (22)](#2--mcp-tools-22)
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

### The Problem

Your AI assistant has amnesia. Every conversation starts fresh. You explain your architecture Monday, by Wednesday it's a blank slate. Context disappears. Decisions vanish. That auth system you documented? Gone.

You've tried:
- **Chat logs**: Ctrl+F through thousands of messages
- **Plain RAG**: Everything indexed, nothing prioritized
- **Manual notes**: "I'll document it later" (you won't)

None of it works because none of it understands *what matters*.

### The Solution

This MCP server gives your AI assistant persistent memory with intelligence built in:

- **Hybrid search** finds what you mean, not just what you typed
- **Cognitive decay** keeps relevant memories fresh, lets stale ones fade
- **Causal graphs** trace decision lineage ("Why did we choose JWT?")
- **Session awareness** prevents duplicate context, saves tokens
- **Recovery system** never loses work, even on crashes

### What Makes This Different

| Capability | Basic RAG | This MCP Server |
|------------|-----------|-----------------|
| **Search** | Vector only | Hybrid FTS5 + vector + BM25 with RRF fusion **** |
| **Decay** | None or exponential | FSRS power-law (validated on 100M+ users) |
| **Duplicates** | Index everything | Prediction Error Gating (4-tier thresholds) |
| **Tiers** | None | 6-tier importance with configurable boosts |
| **Context** | Full documents | ANCHOR-based section retrieval (93% token savings) |
| **Learning** | None | Corrections tracking with confidence adjustment **** |
| **State** | Stateless | 5-state cognitive model (HOT/WARM/COLD/DORMANT/ARCHIVED) |
| **Sessions** | None | Deduplication with -50% tokens on follow-up **** |
| **Recovery** | Hope | Crash recovery with zero data loss **** |
| **"Why" queries** | Impossible | Causal graph traversal (6 relationship types) **** |

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| **MCP Tools** | 22 | Search, CRUD, checkpoints, causal, drift, learning |
| **Library Modules** | 70+ | Parsing, scoring, cognitive, storage, search, etc. |
| **Handler Modules** | 9 | Organized by function domain |
| **Embedding Providers** | 3 | HF Local, Voyage AI, OpenAI |
| **Cognitive Features** | 12+ | FSRS, PE gating, 5-state, causal graph, etc. |
| **Test Coverage** | 1,500+ | Tests across 35+ test files |

### Innovation Highlights

| Innovation | What It Does | Impact |
|------------|--------------|--------|
| **RRF Search Fusion** | Combines vector + BM25 + graph with k=60, 10% convergence bonus | +40-50% relevance |
| **Type-Specific Half-Lives** | 9 memory types decay at different rates | Procedural knowledge lasts, episodic fades |
| **Session Deduplication** | Hash-based tracking prevents re-sending same content | -50% tokens on follow-ups |
| **Causal Memory Graph** | 6 relationship types (caused, supersedes, etc.) | Answer "why" questions |
| **Lazy Model Loading** | Defer embedding init until first use | <500ms startup (was 2-3s) |
| **Incremental Indexing** | Content hash + mtime diff updates | 10-100x faster re-indexing |
| **Recovery Hints** | 49 error codes with actionable guidance | Self-service recovery |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18.0.0 | 20+ |
| npm | 9+ | 10+ |

---

## 2. 🔧 MCP TOOLS (22)

### Tool Categories Overview

| Category | Tools | Purpose |
|----------|-------|---------|
| **Search & Retrieval** | 4 | Find and match memories |
| **CRUD Operations** | 5 | Create, update, delete, validate |
| **Checkpoints** | 4 | State snapshots for recovery |
| **Session Learning** | 3 | Knowledge tracking across tasks |
| **Causal & Drift** | 5 | Causal graph and intent-aware search **** |
| **System** | 1 | Health monitoring |

### Search & Retrieval Tools

| Tool | Purpose | Latency |
|------|---------|---------|
| `memory_search` | Semantic vector search with hybrid FTS5 + BM25 + RRF fusion | ~500ms |
| `memory_match_triggers` | Fast trigger phrase matching with cognitive features | <50ms |
| `memory_list` | Browse memories with pagination | <50ms |
| `memory_stats` | System statistics and folder rankings | <10ms |

### CRUD Tools

| Tool | Purpose | Latency |
|------|---------|---------|
| `memory_save` | Index a single memory file | ~1s |
| `memory_index_scan` | Bulk scan and index workspace (incremental!) | varies |
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

### Session Learning Tools

| Tool | Purpose | Latency |
|------|---------|---------|
| `task_preflight` | Capture epistemic baseline before task execution | <50ms |
| `task_postflight` | Capture state after task, calculate learning delta | <50ms |
| `memory_get_learning_history` | Get learning history with trends for a spec folder | <50ms |

### System Tools

| Tool | Purpose | Latency |
|------|---------|---------|
| `memory_health` | Check health status of the memory system | <10ms |

### Causal & Drift Tools 

These 5 tools enable decision archaeology and intent-aware retrieval:

| Tool | Purpose | Latency | What It Solves |
|------|---------|---------|----------------|
| `memory_drift_why` | Trace causal chain for decision lineage | varies | "Why did we make this decision?" |
| `memory_causal_link` | Create causal relationships between memories | <50ms | Build decision graphs |
| `memory_causal_stats` | Graph statistics and coverage metrics | <50ms | Measure causal graph health |
| `memory_causal_unlink` | Remove causal relationships | <50ms | Fix incorrect links |
| `memory_context` | L1 Orchestration - unified entry with intent awareness | ~500ms | Get relevant context for current task |

### Causal Relationship Types

The causal graph supports 6 relationship types:

```
┌─────────────────────────────────────────────────────────────────┐
│                    CAUSAL RELATIONSHIP TYPES                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Memory A ──caused──► Memory B                                 │
│   "Decision A directly led to outcome B"                        │
│                                                                 │
│   Memory A ──enabled──► Memory B                                │
│   "A made B possible without directly causing it"               │
│                                                                 │
│   Memory A ──supersedes──► Memory B                             │
│   "A replaces B as the current truth"                           │
│                                                                 │
│   Memory A ──contradicts──► Memory B                            │
│   "A and B are mutually incompatible"                           │
│                                                                 │
│   Memory A ──derived_from──► Memory B                           │
│   "A was built upon or derived from B"                          │
│                                                                 │
│   Memory A ──supports──► Memory B                               │
│   "A provides evidence or support for B"                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Example Usage:**

```javascript
// Why was JWT chosen for authentication?
memory_drift_why({ memoryId: 'auth-decision-123', maxDepth: 3 })
// Returns:
// {
//   memory: { title: "JWT Authentication Decision", ... },
//   causedBy: [{ title: "Scalability Requirements", relation: "caused" }],
//   enabledBy: [{ title: "Stateless API Goal", relation: "enabled" }],
//   supersedes: [{ title: "Session Cookie Approach", relation: "supersedes" }]
// }
```

### Key Tool Parameters

#### memory_search

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | string | - | Natural language search query |
| `concepts` | string[] | - | Multi-concept AND search (2-5 concepts) |
| `specFolder` | string | - | Limit search to specific spec folder |
| `limit` | number | 10 | Maximum results (1-20) |
| `includeConstitutional` | boolean | **true** | Include constitutional tier at top |
| `includeContent` | boolean | false | Embed file content in results |
| `anchors` | string[] | - | Specific anchor IDs to extract |
| `searchType` | string | "hybrid" | "vector", "hybrid", or "multi-concept" |
| `intent` | string | - | **** Task intent for weighted retrieval |
| `includeGraph` | boolean | false | **** Include causal graph results (1.5x weight) |
| `compression` | string | "standard" | **** "minimal", "compact", "standard", "full" |

#### memory_match_triggers

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `prompt` | string | **Required** | User prompt to match |
| `limit` | number | 3 | Maximum matches |
| `session_id` | string | - | Session for cognitive features |
| `turn_number` | number | - | Turn for decay calculation |
| `include_cognitive` | boolean | true | Enable cognitive features |

#### memory_context

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `input` | string | **Required** | The query, prompt, or context description |
| `mode` | string (enum) | "auto" | auto, quick, deep, focused, resume |
| `intent` | string | - | Task intent (auto-detected if not provided) |
| `specFolder` | string | - | Limit to specific spec folder |
| `limit` | number | 10 | Maximum results |
| `sessionId` | string | - | Session ID for deduplication |
| `enableDedup` | boolean | true | Enable session deduplication |
| `includeContent` | boolean | false | Include file content in results |
| `anchors` | string[] | - | Specific anchor IDs to extract |

---

## 3. 🧠 COGNITIVE MEMORY

This isn't basic memory storage. The system implements biologically-inspired cognitive features that mirror how human memory actually works.

### FSRS Power-Law Decay

Memory strength follows the Free Spaced Repetition Scheduler formula, validated on 100M+ Anki users:

```
R(t, S) = (1 + 0.235 * t/S)^(-0.5)
```

Where:
- `R(t, S)` = Retrievability (probability of recall) at time t with stability S
- `t` = Time elapsed since last access (in days)
- `S` = Stability (memory strength in days)--higher = slower decay
- `0.235` and `-0.5` are empirically validated constants

**Why FSRS beats exponential decay:**

```
                    MEMORY DECAY COMPARISON

    1.0 ┤
        │ ╲
        │  ╲ ← Exponential (too fast)
    0.8 ┤   ╲
        │    ╲
        │     ╲    ╱── FSRS (matches human memory)
    0.6 ┤      ╲  ╱
        │       ╲╱
        │       ╱╲
    0.4 ┤      ╱  ╲
        │     ╱    ╲
        │    ╱      ╲
    0.2 ┤   ╱        ╲
        │  ╱          ╲ ← Exponential forgets too much
        │ ╱            ╲
    0.0 ┼───────────────────────────────► Days
        0    7    14    21    28    35
```

### 5-State Memory Model

Memories transition between states based on their retrievability score:

```
                        5-STATE MEMORY LIFECYCLE

    ┌─────────────────────────────────────────────────────────────┐
    │                                                             │
    │  HOT ←──────────────────────────────────────────────────┐   │
    │   │                                                     │   │
    │   │ R drops below 0.80                    Access boosts │   │
    │   ▼                                       retrievability│   │
    │  WARM ←─────────────────────────────────────────────────┤   │
    │   │                                                     │   │
    │   │ R drops below 0.25                                  │   │
    │   ▼                                                     │   │
    │  COLD ←─────────────────────────────────────────────────┤   │
    │   │                                                     │   │
    │   │ R drops below 0.05                                  │   │
    │   ▼                                                     │   │
    │  DORMANT ←──────────────────────────────────────────────┘   │
    │   │                                                         │
    │   │ R drops below 0.02 OR 90+ days inactive                 │
    │   ▼                                                         │
    │  ARCHIVED                                                   │
    │                                                             │
    └─────────────────────────────────────────────────────────────┘
```

| State | Retrievability | Content Returned | Max Items | Behavior |
|-------|----------------|------------------|-----------|----------|
| **HOT** | R >= 0.80 | Full content | 5 | Active working memory, top priority |
| **WARM** | 0.25 <= R < 0.80 | Summary only | 10 | Accessible background context |
| **COLD** | 0.05 <= R < 0.25 | None | - | Inactive but retrievable on demand |
| **DORMANT** | 0.02 <= R < 0.05 | None | - | Very weak, needs explicit revival |
| **ARCHIVED** | R < 0.02 or 90d+ | None | - | Time-based archival, effectively forgotten |

### Type-Specific Half-Lives 

Different memory types decay at different rates. Procedural knowledge (how-to) lasts longer than episodic memories (what happened).

| Memory Type | Half-Life | Example | Decay Behavior |
|-------------|-----------|---------|----------------|
| **constitutional** | Never | "Never edit without reading first" | Protected, never decays |
| **procedural** | 90+ days | "How to deploy to production" | Very slow decay |
| **semantic** | 60 days | "RRF stands for Reciprocal Rank Fusion" | Slow decay |
| **contextual** | 30 days | "Auth module uses JWT" | Normal decay |
| **episodic** | 14 days | "Fixed bug XYZ on Tuesday" | Fast decay |
| **working** | 1 day | "Currently debugging auth flow" | Very fast decay |
| **temporary** | 4 hours | "Testing this config" | Ephemeral |
| **debug** | 1 hour | "Stack trace from crash" | Near-instant decay |
| **scratch** | Session | "Rough notes" | Session-scoped only |

**Auto-detection:** Memory type is inferred from file path and frontmatter. Files in `references/` default to procedural, files in `scratch/` default to scratch.

### Multi-Factor Decay Composite 

Decay score is computed from 5 factors multiplied together, not just time elapsed:

```
Composite Score = temporal * usage * importance * pattern * citation
```

| Factor | Weight | Description | Boost |
|--------|--------|-------------|-------|
| **Temporal** | - | FSRS formula based on stability | R(t, S) |
| **Usage** | 0.05/access | Access count boost (capped) | Up to 1.5x |
| **Importance** | - | Tier anchor | critical=1.5x, high=1.2x |
| **Pattern** | +20% | Alignment with current task | 1.2x if matching |
| **Citation** | +10% | Recently cited boost | 1.1x if recent |

**Example:**
A procedural memory accessed 10 times, marked critical, matching current task, and recently cited:
```
Score = 0.85 * 1.5 * 1.5 * 1.2 * 1.1 = 2.52 → capped at 1.0
```

### Prediction Error Gating

Prevents duplicate memories from polluting the index using a four-tier similarity threshold system:

| Similarity | Category | Action |
|------------|----------|--------|
| >= 0.95 | **DUPLICATE** | Block save, reinforce existing memory instead |
| 0.90-0.94 | **HIGH_MATCH** | Check for contradiction; UPDATE or SUPERSEDE existing |
| 0.70-0.89 | **MEDIUM_MATCH** | Create with link to related memory |
| 0.50-0.69 | **LOW_MATCH** | Create new, note similarity in metadata |
| < 0.50 | **UNIQUE** | Create new memory normally |

**Contradiction Detection:**
- Boolean contradictions: "always" vs "never", "true" vs "false"
- Numeric contradictions: Different values for same metric
- Temporal contradictions: Different timestamps for same event

**Audit Trail:**
All PE decisions are logged to `memory_conflicts` table for debugging and analysis.

### Testing Effect (Desirable Difficulty)

Accessing memories strengthens them--the harder the recall, the greater the benefit:

| Retrievability at Access | Stability Boost | Why |
|--------------------------|-----------------|-----|
| R >= 0.90 (easy recall) | +5% | Memory was strong, minimal benefit |
| R = 0.70 (moderate) | +10% | Standard reinforcement |
| R = 0.50 (challenging) | +15% | "Desirable difficulty"--greater retention |
| R < 0.30 (hard recall) | +20% | Successfully retrieving weak memory = strong boost |

**Auto-applied:** Testing Effect runs automatically when memories are accessed via `memory_search`.

### Co-Activation

When one memory is retrieved, related memories get a boost:

| Relationship | Boost | Description |
|--------------|-------|-------------|
| Same spec folder | +0.2 | Memories in same project context |
| Temporal proximity | +0.15 | Created/accessed within same time window |
| Shared entities | +0.1 | Reference same files, functions, concepts |
| Semantic similarity | +0.05 | High vector similarity (>0.8) |
| **Causal link** | **+0.25** | **** Connected via causal graph |

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
LI = (KnowledgeDelta * 0.4) + (UncertaintyReduction * 0.35) + (ContextImprovement * 0.25)
```

Example: `LI = (45 * 0.4) + (50 * 0.35) + (40 * 0.25) = 45.5`

**Interpretation:**
- LI > 30: Strong learning session
- LI 10-30: Moderate learning
- LI < 10: Minimal learning or rework

### Memory Consolidation Pipeline 

5-phase process to distill episodic memories into semantic knowledge:

```
                    CONSOLIDATION PIPELINE

    ┌─────────────────────────────────────────────────────────┐
    │                                                         │
    │  PHASE 1: REPLAY                                        │
    │  Select episodic memories older than 7 days             │
    │                        │                                │
    │                        ▼                                │
    │  PHASE 2: ABSTRACT                                      │
    │  Find facts appearing 2+ times across episodes          │
    │                        │                                │
    │                        ▼                                │
    │  PHASE 3: INTEGRATE                                     │
    │  Create/update semantic memories from patterns          │
    │                        │                                │
    │                        ▼                                │
    │  PHASE 4: PRUNE                                         │
    │  Archive episodes whose facts are now semantic          │
    │                        │                                │
    │                        ▼                                │
    │  PHASE 5: STRENGTHEN                                    │
    │  Boost frequently-accessed memories                     │
    │                                                         │
    └─────────────────────────────────────────────────────────┘
```

### Learning from Corrections 

When memories are corrected (superseded, deprecated, refined, merged), the system learns:

| Outcome | Confidence Adjustment | Description |
|---------|----------------------|-------------|
| **Accepted** | +5% | Memory was correct |
| **Modified** | -5% | Memory needed refinement |
| **Rejected** | -20% | Memory was wrong |

Additionally, corrected memories receive a 0.5x stability penalty, causing them to fade faster.

---

## 4. 🔍 SEARCH SYSTEM

### Hybrid Search (FTS5 + Vector + BM25)

The default search combines three engines using Reciprocal Rank Fusion (RRF):

```
                    HYBRID SEARCH ARCHITECTURE

    ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
    │   VECTOR    │   │    BM25     │   │    GRAPH    │
    │   1024d     │   │   Lexical   │   │   Causal    │
    │   (1.0x)    │   │   (1.0x)    │   │   (1.5x)    │
    └──────┬──────┘   └──────┬──────┘   └──────┬──────┘
           │                 │                 │
           └────────┬────────┴────────┬────────┘
                    │                 │
                    ▼                 ▼
           ┌────────────────────────────────┐
           │        RRF FUSION (k=60)       │
           │                                │
           │  score = weight / (k + rank)   │
           │  +10% convergence bonus        │
           │  for multi-source results      │
           └────────────────┬───────────────┘
                            │
                            ▼
           ┌────────────────────────────────┐
           │     CROSS-ENCODER RERANK       │
           │     (optional, top 20)         │
           │     + length penalty           │
           └────────────────┬───────────────┘
                            │
                            ▼
           ┌────────────────────────────────┐
           │        FINAL RESULTS           │
           └────────────────────────────────┘
```

**Why Hybrid beats single-engine:**

| Query Type | Vector | BM25 | Graph | Winner |
|------------|--------|------|-------|--------|
| "how does auth work" | Best semantic match | - | - | Vector |
| "TODO BUG-123" | Poor | **Exact match** | - | BM25 |
| "why JWT not cookies" | Good | Good | **Traces decision** | Graph |
| "authentication security" | Good | Good | - | **Hybrid** (both find different angles) |

### RRF Search Fusion 

Combines results from multiple search engines into a unified ranked list:

```javascript
RRF_score = sum(weight / (k + rank_i)) * convergence_bonus
```

| Parameter | Value | Description |
|-----------|-------|-------------|
| **k** | 60 | Fusion constant (industry standard) |
| **Vector weight** | 1.0x | Semantic similarity |
| **BM25 weight** | 1.0x | Keyword matching |
| **Graph weight** | 1.5x | Causal relationships get boost |
| **Convergence bonus** | +10% | Results found by multiple engines |

**Example:**
```
Query: "authentication decision"

Vector results:    [A(rank 1), B(rank 3), C(rank 5)]
BM25 results:      [B(rank 1), D(rank 2), A(rank 4)]
Graph results:     [C(rank 1), A(rank 2)]

A appears in all 3: score = (1.0/61 + 1.0/64 + 1.5/62) * 1.10 = 0.0526
B appears in 2:     score = (1.0/63 + 1.0/61) * 1.10 = 0.0361
C appears in 2:     score = (1.0/65 + 1.5/61) * 1.10 = 0.0444
D appears in 1:     score = (1.0/62) * 1.00 = 0.0161

Final ranking: A, C, B, D
```

### BM25 Hybrid Search 

Pure JavaScript BM25 implementation for keyword scoring alongside vector search:

| Parameter | Default | Description |
|-----------|---------|-------------|
| **k1** | 1.5 | Term frequency saturation |
| **b** | 0.75 | Length normalization |

**Why BM25 matters:**
- Vector search finds "authentication" for "login"
- BM25 finds exact matches: "FSRS", "RRF", "TODO", "BUG-123"
- Technical identifiers and acronyms need exact matching

### Cross-Encoder Reranking 

After initial retrieval, sends top-20 candidates to a cross-encoder model for precision reranking:

| Provider | Model | Quality | Latency |
|----------|-------|---------|---------|
| **Voyage** | rerank-2 | Best for code/technical | ~200ms |
| **Cohere** | rerank-english-v3.0 | Good general purpose | ~150ms |
| **Local** | BAAI/bge-reranker-base | Privacy, slower | ~500ms |

**Length Penalty:** Short content (<100 chars) gets 0.8-1.0x penalty to prevent low-information snippets from ranking artificially high.

### Query Expansion with Fuzzy Matching 

Automatically expands queries with synonyms and catches typos:

| Input | Expanded To | Why |
|-------|-------------|-----|
| "FFRS" | "FSRS", "spaced repetition" | Levenshtein distance <= 2 |
| "RFF fusion" | "RRF", "reciprocal rank fusion" | Acronym map + fuzzy |
| "auth" | "authentication", "login", "session" | Synonym expansion |

**Acronym Map (30+ entries):**
```javascript
ACRONYM_MAP = {
  'RRF': ['reciprocal rank fusion', 'search fusion'],
  'FSRS': ['spaced repetition', 'memory scheduling'],
  'MCP': ['model context protocol', 'mcp server'],
  'PE': ['prediction error', 'duplicate gating'],
  'DQI': ['document quality index'],
  'ANCHOR': ['anchor format', 'section markers'],
  // ... 24 more
}
```

### Intent-Aware Retrieval 

Classifies query intent and applies task-specific search weights:

| Intent | Weight Adjustments | Example Query |
|--------|-------------------|---------------|
| **add_feature** | +procedural, +architectural | "implement user auth" |
| **fix_bug** | +error logs, +debug, +recent | "fix login crash" |
| **refactor** | +patterns, +structure | "improve auth module" |
| **security_audit** | +security, +vulnerabilities | "check auth security" |
| **understand** | +semantic, +explanatory | "how does auth work" |

**Usage:**
```javascript
memory_context({
  input: "debugging auth.js issues",
  mode: "focused",
  intent: 'fix_bug'
})
// Returns memories weighted for debugging auth.js
```

### Search Types

| Type | Best For | Example Query |
|------|----------|---------------|
| **hybrid** | General queries (default) | "how does auth work" |
| **vector** | Pure semantic similarity | "security concerns" |
| **multi-concept** | Multiple independent topics | concepts: ["auth", "database"] |

### ANCHOR Format (93% Token Savings)

Memory files use ANCHOR markers for section-level retrieval instead of loading entire documents:

```markdown
<!-- ANCHOR: decisions -->
## Authentication Decision
We chose JWT with refresh tokens because:
1. Stateless authentication scales better
2. Refresh tokens allow session extension without re-login
<!-- /ANCHOR: decisions -->

<!-- ANCHOR: context -->
## Implementation Context
The auth system uses Express middleware...
<!-- /ANCHOR: context -->
```

**Retrieval:**
```javascript
memory_search({
  query: "auth decisions",
  anchors: ['decisions', 'context']  // Only return these sections
})
```

**Common Anchors:**
| Anchor | Purpose |
|--------|---------|
| `summary` | Executive summary of the memory |
| `decisions` | Key decisions and rationale |
| `context` | Background context |
| `state` | Current state/progress |
| `artifacts` | Code snippets, file references |
| `blockers` | Known issues, blockers |
| `next-steps` | Planned work, continuations |
| `metadata` | Technical metadata |

**Token Savings:**
- Full document: ~3000 tokens
- Summary anchor only: ~200 tokens
- Savings: **93%**

### Compression Tiers 

4 compression levels for search results:

| Level | ~Tokens | Fields Included | Use Case |
|-------|---------|-----------------|----------|
| **minimal** | ~100 | id, title, tier | Quick context check |
| **compact** | ~200 | + summary | Resume prior work |
| **standard** | ~400 | + anchors | Active development |
| **full** | Complete | All | Deep investigation |

**Usage:**
```javascript
memory_search({
  query: "auth",
  compression: "minimal"  // Just IDs and titles
})
```

### Constitutional Tier (Always Surfaces)

The **constitutional** tier is special--these memories ALWAYS appear at the top of search results:

| Behavior | Description |
|----------|-------------|
| **Always surfaces** | Included at top of every `memory_search` by default |
| **Fixed similarity** | Returns `similarity: 100` regardless of query match |
| **Token budget** | ~2000 tokens max for constitutional memories |
| **Use cases** | Project rules, coding standards, critical context |
| **Control** | Set `includeConstitutional: false` to disable |

---

## 5. 📊 IMPORTANCE TIERS

### The Six-Tier System

| Tier | Boost | Decay Rate | Auto-Clean | Use Case |
|------|-------|------------|------------|----------|
| **constitutional** | 10.0x | Never | Never | Project rules, always-surface (~2000 tokens max) |
| **critical** | 5.0x | Never | Never | Architecture decisions, breaking changes |
| **important** | 2.0x | Never | Never | Key implementations, major features |
| **normal** | 1.0x | 0.80/turn | 90 days | Standard development context (default) |
| **temporary** | 0.5x | 0.60/turn | 7 days | Debug sessions, experiments |
| **deprecated** | 0.1x | Never | Manual | Outdated info (preserved but rarely surfaces) |

### Tier Selection Guide

| Content Type | Recommended Tier |
|--------------|------------------|
| Coding standards, project rules | `constitutional` |
| Breaking changes, migration docs | `critical` |
| Feature specs, architecture ADRs | `important` |
| Implementation notes | `normal` (default) |
| Debug logs, experiments | `temporary` |
| Replaced/outdated docs | `deprecated` |

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
├── context-server.js       # Main MCP server entry point (22 tools)
├── package.json            # Dependencies and scripts
├── README.md               # This file
│
├── core/                   # Core initialization
│   ├── index.js            # Core exports
│   ├── config.js           # Configuration management
│   └── db-state.js         # Database connection state
│
├── handlers/               # MCP tool handlers (9 modules)
│   ├── index.js            # Handler aggregator
│   ├── memory-search.js    # memory_search + Testing Effect
│   ├── memory-triggers.js  # memory_match_triggers + cognitive
│   ├── memory-save.js      # memory_save + PE gating
│   ├── memory-crud.js      # update/delete/list/stats/health/validate
│   ├── memory-index.js     # memory_index_scan + constitutional discovery
│   ├── checkpoints.js      # checkpoint_create/list/restore/delete
│   ├── session-learning.js # preflight/postflight/learning history
│   ├── memory-context.js   # memory_context + unified entry 
│   └── causal-graph.js     # causal_link/unlink/stats + drift_why 
│
├── lib/                    # Library modules (70+ total)
│   ├── cognitive/          # Cognitive memory (12 modules)
│   │   ├── fsrs-scheduler.js       # FSRS power-law algorithm
│   │   ├── prediction-error-gate.js # Duplicate detection
│   │   ├── tier-classifier.js      # 5-state classification
│   │   ├── attention-decay.js      # Multi-factor decay + type-specific half-lives
│   │   ├── co-activation.js        # Related memory boosting
│   │   ├── working-memory.js       # Session-scoped activation
│   │   ├── temporal-contiguity.js  # Time-based linking
│   │   ├── summary-generator.js    # Auto-summary generation
│   │   ├── archival-manager.js     # 5-state archival model 
│   │   ├── consolidation.js        # Memory consolidation pipeline 
│   │   └── index.js                # Module aggregator
│   │
│   ├── scoring/            # Scoring algorithms (5 modules)
│   │   ├── composite-scoring.js    # Multi-factor scoring (5-factor composite)
│   │   ├── importance-tiers.js     # Tier boost values
│   │   ├── folder-scoring.js       # Spec folder ranking
│   │   ├── confidence-tracker.js   # Confidence scoring
│   │   └── index.js
│   │
│   ├── search/             # Search engines (8 modules)
│   │   ├── vector-index.js         # sqlite-vec vector search
│   │   ├── hybrid-search.js        # FTS5 + vector fusion
│   │   ├── rrf-fusion.js           # Reciprocal Rank Fusion (k=60) 
│   │   ├── bm25-index.js           # BM25 lexical search 
│   │   ├── cross-encoder.js        # Cross-encoder reranking 
│   │   ├── intent-classifier.js    # 5 intent types 
│   │   ├── fuzzy-match.js          # Query expansion + Levenshtein 
│   │   ├── reranker.js             # Result reranking
│   │   └── index.js
│   │
│   ├── session/            # Session management 
│   │   ├── session-manager.js      # Session deduplication (~1050 lines)
│   │   ├── session-state.js        # Crash recovery state 
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
│   │   ├── embeddings.js           # Provider abstraction (lazy loading) 
│   │   ├── retry-manager.js        # API retry logic
│   │   └── index.js
│   │
│   ├── storage/            # Persistence (7 modules)
│   │   ├── access-tracker.js       # Access history + usage tracking 
│   │   ├── checkpoints.js          # State snapshots
│   │   ├── history.js              # Modification history
│   │   ├── index-refresh.js        # Index maintenance
│   │   ├── causal-edges.js         # Causal graph storage 
│   │   ├── incremental-index.js    # Incremental indexing (hash+mtime) 
│   │   ├── transaction-manager.js  # Transaction management 
│   │   └── index.js
│   │
│   ├── learning/           # Learning system 
│   │   ├── corrections.js          # Learning from corrections
│   │   └── index.js
│   │
│   ├── errors/             # Error handling 
│   │   ├── recovery-hints.js       # 49 error codes with recovery hints
│   │   └── index.js
│   │
│   ├── architecture/       # Architecture definitions 
│   │   ├── layer-definitions.js    # 7-layer MCP architecture
│   │   └── index.js
│   │
│   ├── response/           # Response formatting 
│   │   ├── envelope.js             # Standardized response envelope
│   │   └── index.js
│   │
│   ├── utils/              # Utilities (4 modules)
│   │   ├── validators.js           # Input validation and sanitization
│   │   ├── json-helpers.js         # Safe JSON operations
│   │   ├── batch-processor.js      # Batch operations
│   │   ├── format-helpers.js       # Format utilities
│   │   ├── token-budget.js         # Token budget management
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
├── tests/                  # Test suite (1,500+ tests across 35+ files)
│   ├── # Cognitive tests
│   ├── fsrs-scheduler.test.js
│   ├── prediction-error-gate.test.js
│   ├── tier-classifier.test.js
│   ├── attention-decay.test.js
│   ├── co-activation.test.js
│   ├── working-memory.test.js
│   ├── summary-generator.test.js
│   ├── consolidation.test.js           # 
│   ├── archival-manager.test.js        # 
│   ├── # Search tests
│   ├── composite-scoring.test.js
│   ├── five-factor-scoring.test.js
│   ├── rrf-fusion.test.js              # 
│   ├── bm25-index.test.js              # 
│   ├── cross-encoder.test.js           # 
│   ├── intent-classifier.test.js       # 
│   ├── fuzzy-match.test.js             # 
│   ├── hybrid-search.test.js           # 
│   ├── # Graph tests
│   ├── causal-edges.test.js            # 
│   ├── corrections.test.js             # 
│   ├── # Session tests
│   ├── session-deduplication.test.js   # 
│   ├── crash-recovery.test.js          # 
│   ├── # Infrastructure tests
│   ├── schema-migration.test.js
│   ├── modularization.test.js
│   ├── provider-chain.test.js          # 
│   ├── layer-definitions.test.js       # 
│   ├── # Integration tests
│   ├── memory-save-integration.test.js
│   ├── memory-search-integration.test.js
│   ├── memory-context.test.js          # 
│   └── test-*.js                       # Various handler tests
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
# Expected: 1,500+ tests passing
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

| Variable | Default | Description |
|----------|---------|-------------|
| `MEMORY_DB_PATH` | `./database/context-index.sqlite` | Database location |
| `MEMORY_BASE_PATH` | CWD | Workspace root for memory files |
| `DEBUG_TRIGGER_MATCHER` | `false` | Enable verbose trigger logs |

#### Embedding Provider Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `EMBEDDINGS_PROVIDER` | No | Force: `voyage`, `openai`, or `hf-local` |
| `VOYAGE_API_KEY` | For Voyage | Voyage AI API key |
| `OPENAI_API_KEY` | For OpenAI | OpenAI API key |

### Embedding Providers

| Provider | Dimensions | Speed | Quality | Privacy | Best For |
|----------|------------|-------|---------|---------|----------|
| **Voyage AI** | 1024 | Fast | Excellent | Cloud | Production (recommended) |
| **OpenAI** | 1536/3072 | Fast | Very Good | Cloud | Alternative cloud option |
| **HuggingFace Local** | 768 | Slow* | Good | **Local** | Privacy, offline, air-gapped |

*First run downloads model (~400MB), subsequent runs faster

**Auto-Detection Priority:**
1. Explicit `EMBEDDINGS_PROVIDER` environment variable
2. `VOYAGE_API_KEY` detected -> Voyage (1024d)
3. `OPENAI_API_KEY` detected -> OpenAI (1536d)
4. Default -> HuggingFace Local (768d)

### Feature Flags 

Control new features with environment variables:

| Flag | Default | Description | Impact |
|------|---------|-------------|--------|
| `SPECKIT_RRF` | `true` | Enable RRF search fusion with k=60 | +40% relevance |
| `SPECKIT_BM25` | `true` | Enable BM25 lexical search | Better keyword matching |
| `SPECKIT_SESSION_DEDUP` | `true` | Enable session deduplication | -50% tokens on follow-up |
| `SPECKIT_LAZY_LOAD` | `true` | Defer embedding model initialization | <500ms startup |
| `SPECKIT_USAGE` | `true` | Enable usage boost in decay calculation | +15% relevance |
| `SPECKIT_TYPE_DECAY` | `true` | Enable type-specific half-lives (9 types) | Smarter decay |
| `SPECKIT_RELATIONS` | `true` | Enable causal memory graph | "Why" queries |
| `SPECKIT_CROSS_ENCODER` | `false` | Enable cross-encoder reranking | Precision boost |
| `SPECKIT_INCREMENTAL` | `true` | Enable incremental indexing | 10-100x faster reindex |
| `SPECKIT_NO_LEGACY` | `false` | Disable legacy single-engine fallback | Cleaner codebase |

#### Cognitive Memory Thresholds

| Variable | Default | Description |
|----------|---------|-------------|
| `HOT_THRESHOLD` | 0.80 | Retrievability threshold for HOT |
| `WARM_THRESHOLD` | 0.25 | Retrievability threshold for WARM |
| `COLD_THRESHOLD` | 0.05 | Retrievability threshold for COLD |
| `DORMANT_THRESHOLD` | 0.02 | Retrievability threshold for DORMANT |
| `MAX_HOT_MEMORIES` | 5 | Maximum HOT tier memories |
| `MAX_WARM_MEMORIES` | 10 | Maximum WARM tier memories |

### Database Schema (v11)

| Table | Purpose | Added |
|-------|---------|-------|
| `memory_index` | Memory metadata (title, tier, triggers) | v1 |
| `vec_memories` | Vector embeddings (sqlite-vec) | v1 |
| `memory_fts` | Full-text search index (FTS5) | v1 |
| `checkpoints` | State snapshots | v1 |
| `memory_history` | Access and modification history | v1 |
| `learning_records` | Session learning preflight/postflight | v3 |
| `working_memory` | Session-scoped attention scores | v3 |
| `memory_conflicts` | PE gating decisions (audit trail) | v4 |
| `causal_edges` | Causal relationships (6 types) | **v8 ** |
| `memory_corrections` | Learning from corrections | **v9 ** |
| `session_state` | Crash recovery state | **v10 ** |

**Schema Migration History:**

| Version | Changes |
|---------|---------|
| v4.1 | Added `access_count`, `last_accessed_at` columns |
| v5 | Added `memory_type` column (9 types) |
| v6 | Added `file_mtime_ms`, `content_hash` for incremental indexing |
| v8 | Added `causal_edges` table (6 relationship types, strength, evidence) |
| v9 | Added `memory_corrections` table (stability tracking, pattern extraction) |
| v10 | Added `session_state` table (crash recovery, dirty flag) |
| v11 | Added `is_archived`, `archived_at` columns |

### 7-Layer MCP Architecture 

Tools are organized into 7 layers with token budgets:

| Layer | Name | Budget | Tools | Purpose |
|-------|------|--------|-------|---------|
| L1 | Orchestration | 2000-4000 | `memory_context` | Unified entry point |
| L2 | Recovery | 500-1000 | `checkpoint_restore` | Crash handling |
| L3 | Discovery | 200-500 | `memory_match_triggers`, `memory_stats` | Quick status checks |
| L4 | Exploration | 500-1500 | `memory_search`, `memory_list` | Browse and search |
| L5 | Surgical | 200-800 | `memory_update`, `memory_delete` | Targeted edits |
| L6 | Persistence | 1000-2000 | `memory_save`, `memory_index_scan` | Write operations |
| L7 | Analysis | 2500-5000 | `task_preflight`, `task_postflight` | Learning |

### Composite Scoring Weights

Search results are ranked using multi-factor composite scoring:

| Factor | Weight | Description |
|--------|--------|-------------|
| **Similarity** | 0.30 | Vector similarity to query |
| **Importance** | 0.25 | Tier boost (constitutional = 10x) |
| **Retrievability** | 0.15 | FSRS-calculated memory strength |
| **Recency** | 0.15 | Time since last access |
| **Popularity** | 0.10 | Access frequency |
| **Tier Boost** | 0.05 | Additional tier-based adjustment |

### Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `@modelcontextprotocol/sdk` | ^1.24.3 | MCP protocol |
| `@huggingface/transformers` | ^3.8.1 | Local embeddings |
| `better-sqlite3` | ^12.5.0 | SQLite database |
| `sqlite-vec` | ^0.1.7-alpha.2 | Vector similarity search |

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
// Only retrieve specific sections (93% token savings)
memory_search({
  query: "auth decisions",
  anchors: ['decisions', 'context'],
  includeContent: true
})
// Returns: Only decision and context sections
```

### Example 3: Intent-Aware Context 

```javascript
// Get context optimized for debugging
memory_context({
  input: "debugging auth issues",
  mode: "focused",
  intent: 'fix_bug'
})
// Returns: Error logs, recent changes, debug history weighted high
```

### Example 4: Trace Decision Lineage 

```javascript
// Why was this decision made?
memory_drift_why({
  memoryId: 'jwt-auth-decision-123',
  maxDepth: 3
})
// Returns:
// {
//   memory: { title: "JWT Authentication Decision", ... },
//   causedBy: [{ title: "Scalability Requirements" }],
//   enabledBy: [{ title: "Stateless API Goal" }],
//   supersedes: [{ title: "Session Cookie Approach" }]
// }
```

### Example 5: Create Causal Link 

```javascript
// Document that decision A supersedes decision B
memory_causal_link({
  sourceId: 'new-auth-approach-456',
  targetId: 'old-auth-approach-123',
  relation: 'supersedes',
  evidence: 'JWT better for microservices scale'
})
```

### Example 6: Session Learning Workflow

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

### Example 7: Cognitive Memory with Session Tracking

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

### Example 8: Checkpoint Recovery

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

### Example 9: Compression for Token Efficiency 

```javascript
// Quick context check - minimal tokens
memory_search({
  query: "auth",
  compression: "minimal",  // ~100 tokens per result
  limit: 10
})

// Deep investigation - full content
memory_search({
  query: "auth architecture",
  compression: "full"  // Complete content
})
```

### Common Patterns

| Pattern | Tool Call | When to Use |
|---------|-----------|-------------|
| Find related context | `memory_search({ query: "..." })` | Before starting work |
| Token-efficient retrieval | `memory_search({ anchors: ['summary'] })` | Large context, limited budget |
| Intent-aware context | `memory_context({ input: "...", intent: "fix_bug" })` | Task-specific context |
| Decision archaeology | `memory_drift_why({ memoryId: "..." })` | Understanding past decisions |
| Track learning | `task_preflight` -> work -> `task_postflight` | Implementation tasks |
| Check system health | `memory_health({})` | Debugging issues |
| Recover from error | `checkpoint_restore({ name: "..." })` | After mistakes |
| Fast phrase matching | `memory_match_triggers({ prompt: "..." })` | Real-time suggestions |

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

### Recovery Hints 

Every error now includes actionable recovery guidance. Example errors and their hints:

| Error Code | Tool | Recovery Hint |
|------------|------|---------------|
| `E041` | memory_search | Run `memory_index_scan` to rebuild vector index |
| `E001` | memory_search | Check embedding API key or set `SPECKIT_LOCAL_EMBEDDINGS=true` |
| `E040` | memory_search | Query too long - reduce to < 10000 characters |
| `timeout` | memory_search | Increase `SPECKIT_SEARCH_TIMEOUT` or simplify query |
| `corrupted` | checkpoint_restore | Delete checkpoint and recreate |
| `not_found` | checkpoint_restore | List available checkpoints with `checkpoint_list()` |
| `duplicate` | memory_save | Memory already exists. Use `memory_update()` for modifications |
| `validation` | memory_save | Check ANCHOR format requirements with `memory_validate()` |

**Default hint:** `Run memory_health() for diagnostics`

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Empty search results | `memory_index_scan({ force: true })` |
| Slow embeddings | Set `VOYAGE_API_KEY` for faster API embeddings |
| Missing constitutional | Check files in `constitutional/` directory |
| Learning not tracked | Ensure `specFolder` and `taskId` match exactly |
| Duplicate detection | Check `memory_conflicts` table for decisions |
| Tier not updating | Verify valid tier name (6 options) |
| Causal graph empty | Use `memory_causal_link` to create relationships |
| Session not deduplicating | Ensure `session_id` is consistent |

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

# Check causal graph stats 
sqlite3 database/context-index.sqlite "SELECT relation, COUNT(*) FROM causal_edges GROUP BY relation;"

# Check session states 
sqlite3 database/context-index.sqlite "SELECT status, COUNT(*) FROM session_state GROUP BY status;"

# Check memory types 
sqlite3 database/context-index.sqlite "SELECT memory_type, COUNT(*) FROM memory_index GROUP BY memory_type;"
```

### Run Tests

```bash
# Run full test suite
cd .opencode/skill/system-spec-kit/mcp_server
npm test

# Run specific test file
node tests/fsrs-scheduler.test.js
node tests/tier-classifier.test.js
node tests/rrf-fusion.test.js  # NEW
node tests/causal-edges.test.js  # NEW
```

---

## 11. 📚 RELATED RESOURCES

### Parent Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| Skill README | `../README.md` | Complete skill documentation |
| SKILL.md | `../SKILL.md` | Workflow instructions for AI agents |
| Install Guide | `INSTALL_GUIDE.md` | Detailed installation |

### Sub-Folder Documentation

| Folder | README | Purpose |
|--------|--------|---------|
| `handlers/` | `handlers/README.md` | MCP tool handler implementations |
| `lib/` | `lib/README.md` | Library modules (cognitive, scoring) |
| `formatters/` | `formatters/README.md` | Output formatting and token metrics |

### Key Module Files

| Module | Purpose |
|--------|---------|
| `lib/cognitive/fsrs-scheduler.js` | FSRS power-law decay algorithm |
| `lib/cognitive/tier-classifier.js` | 5-state memory classification |
| `lib/cognitive/prediction-error-gate.js` | Duplicate detection and PE gating |
| `lib/cognitive/consolidation.js` | Memory consolidation pipeline **** |
| `lib/scoring/composite-scoring.js` | Multi-factor ranking (5-factor) |
| `lib/search/hybrid-search.js` | FTS5 + vector fusion with RRF |
| `lib/search/rrf-fusion.js` | RRF algorithm (k=60, convergence) **** |
| `lib/search/bm25-index.js` | BM25 lexical search **** |
| `lib/search/intent-classifier.js` | 5 intent types **** |
| `lib/storage/causal-edges.js` | Causal graph storage **** |
| `lib/session/session-manager.js` | Session deduplication **** |
| `lib/errors/recovery-hints.js` | 49 error codes with hints **** |
| `handlers/memory-save.js` | Save handler with PE gating integration |
| `handlers/session-learning.js` | Epistemic tracking implementation |
| `handlers/causal-graph.js` | Causal link/unlink/stats/why **** |

### External Resources

| Resource | URL |
|----------|-----|
| MCP Protocol Spec | https://modelcontextprotocol.io/ |
| FSRS Algorithm | https://github.com/open-spaced-repetition/fsrs4anki/wiki |
| sqlite-vec | https://github.com/asg017/sqlite-vec |
| Voyage AI | https://www.voyageai.com/ |
| FTS5 Docs | https://www.sqlite.org/fts5.html |
| RRF Paper | https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf |
