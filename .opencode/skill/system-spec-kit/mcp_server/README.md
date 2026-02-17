---
title: "Spec Kit Memory MCP Server"
description: "Cognitive memory system for AI assistants featuring hybrid search, FSRS-powered decay, causal graphs and session deduplication."
trigger_phrases:
  - "MCP server"
  - "spec kit memory"
  - "cognitive memory"
importance_tier: "normal"
---

# Spec Kit Memory MCP Server

> AI memory that persists without poisoning your context window.

A cognitive memory system for AI assistants featuring hybrid search, FSRS-powered decay, causal graphs and session deduplication. Context works across sessions, models, projects and tools, without re-explaining everything every conversation.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. MCP TOOLS](#2--mcp-tools)
- [3. COGNITIVE MEMORY](#3--cognitive-memory)
- [4. SEARCH SYSTEM](#4--search-system)
- [5. IMPORTANCE TIERS](#5--importance-tiers)
- [6. STRUCTURE](#6--structure)
- [7. QUICK START](#7--quick-start)
- [8. CONFIGURATION](#8--configuration)
- [9. USAGE EXAMPLES](#9--usage-examples)
- [10. TROUBLESHOOTING](#10--troubleshooting)
- [11. RELATED RESOURCES](#11--related-resources)

---

<!-- /ANCHOR:table-of-contents -->

## 1. OVERVIEW
<!-- ANCHOR:overview -->

### The Problem

Your AI assistant has amnesia. Every conversation starts fresh. You explain your architecture Monday, by Wednesday it's a blank slate. Context disappears. Decisions vanish. That auth system you documented? Gone.

You've tried:
- **Chat logs**: Ctrl+F through thousands of messages
- **Plain RAG**: Everything indexed, nothing prioritized
- **Manual notes**: "I'll document it later" (you won't)

None of it works because none of it understands *what matters*.

### The Solution

This MCP server gives your AI assistant persistent memory with intelligence built in:

- **Hybrid search** finds what you mean, not what you typed
- **Cognitive decay** keeps relevant memories fresh, lets stale ones fade
- **Causal graphs** trace decision lineage ("Why did we choose JWT?")
- **Session awareness** prevents duplicate context, saves tokens
- **Recovery system** never loses work, even on crashes

---

### What Makes This Different

| Capability | Basic RAG | This MCP Server |
|------------|-----------|-----------------|
| **"Why" queries** | Impossible | Causal graph traversal (6 relationship types) |
| **Recovery** | Hope | Crash recovery with zero data loss |
| **Sessions** | None | Deduplication with -50% tokens on follow-up |
| **Context** | Full documents | ANCHOR-based section retrieval (~473 anchors, 93% token savings) |
| **Search** | Vector only | Hybrid FTS5 + vector + BM25 with RRF fusion |
| **State** | Stateless | 5-state cognitive model (HOT/WARM/COLD/DORMANT/ARCHIVED) |
| **Tiers** | None | 6-tier importance with configurable boosts |
| **Decay** | None or exponential | FSRS power-law (validated on 100M+ users) |
| **Duplicates** | Index everything | Prediction Error Gating (4-tier thresholds) |
| **Learning** | None | Corrections tracking with confidence adjustment |

---

### Key Innovations

| Innovation | Impact | Description |
|------------|--------|-------------|
| **Causal Memory Graph** | Answer "why" | 6 relationship types (caused, supersedes, etc.) |
| **Session Deduplication** | -50% tokens | Hash-based tracking prevents re-sending same content |
| **ANCHOR Retrieval** | 93% token savings | ~473 anchors across 74 READMEs for section-level extraction |
| **RRF Search Fusion** | +40-50% relevance | Combines vector + BM25 + graph with k=60, 10% convergence bonus |
| **Type-Specific Half-Lives** | Smarter decay | 9 memory types decay at different rates |
| **Incremental Indexing** | 10-100x faster | Content hash + mtime diff updates |
| **5-Source Pipeline** | Broader knowledge | Indexes spec files, constitutional, skill READMEs, project READMEs and spec documents |
| **Document-Type Scoring** | Precision ranking | 11 document types with scoring multipliers (spec: 1.4x, plan: 1.3x, constitutional: 2.0x, scratch: 0.6x) |
| **Recovery Hints** | Self-service errors | 49 error codes with actionable guidance |
| **Lazy Model Loading** | <500ms startup | Defer embedding init until first use |

### Spec 126 Post-Implementation Hardening

- Fixed import-path regressions in `context-server.ts` and `lib/cognitive/attention-decay.ts` to prevent runtime module resolution failures after compile.
- Hardened `memory-index` specFolder boundary filtering and incremental chain coverage so scoped indexing stays folder-safe while preserving spec document chain links.
- Hardened `memory-save` update/reinforce paths to preserve `document_type` and `spec_level` metadata.
- Added vector-index metadata update plumbing so metadata changes propagate to vector-layer records.
- Updated causal edge conflict handling to conflict-update semantics that keep edge IDs stable across link updates.

---

### By The Numbers

| Category | Count |
|----------|-------|
| **MCP Tools** | 22 |
| **Library Modules** | 50 |
| **Handler Modules** | 11 |
| **Embedding Providers** | 3 |
| **Cognitive Features** | 12+ |
| **Test Coverage** | 3,800+ tests across 114 test files (incl. 58/58 MCP integration tests at 100%) |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18.0.0 | 20+ |
| npm | 9+ | 10+ |

---

<!-- /ANCHOR:overview -->

## 2. MCP TOOLS
<!-- ANCHOR:mcp-tools -->

### Tool Categories

| Category | Tools | Purpose |
|----------|-------|---------|
| **Search & Retrieval** | 4 | Find and match memories |
| **CRUD Operations** | 5 | Create, update, delete, validate |
| **Checkpoints** | 4 | State snapshots for recovery |
| **Session Learning** | 3 | Knowledge tracking across tasks |
| **Causal & Drift** | 5 | Causal graph and intent-aware search |
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
| `memory_index_scan` | Bulk scan and index workspace (5-source pipeline, incremental) | varies |
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
| `task_preflight` | Capture epistemic baseline before task | <50ms |
| `task_postflight` | Capture state after task, calculate learning delta | <50ms |
| `memory_get_learning_history` | Get learning history with trends | <50ms |

### Causal & Drift Tools

| Tool | Purpose | Latency |
|------|---------|---------|
| `memory_drift_why` | Trace causal chain for decision lineage | varies |
| `memory_causal_link` | Create causal relationships between memories | <50ms |
| `memory_causal_stats` | Graph statistics and coverage metrics | <50ms |
| `memory_causal_unlink` | Remove causal relationships | <50ms |
| `memory_context` | Unified entry with intent awareness | ~500ms |

### System Tools

| Tool | Purpose | Latency |
|------|---------|---------|
| `memory_health` | Check health status of the memory system | <10ms |

---

### Causal Relationship Types

The causal graph supports 6 relationship types for decision archaeology:

| Relation | Meaning |
|----------|---------|
| `caused` | A directly led to B |
| `enabled` | A made B possible without directly causing it |
| `supersedes` | A replaces B as the current truth |
| `contradicts` | A and B are mutually incompatible |
| `derived_from` | A was built upon or derived from B |
| `supports` | A provides evidence or support for B |

**Example:**
```typescript
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

---

### Token Budget Observability

All handler responses include a `tokenBudget` field in the `meta` object showing the configured token limit for the response. When a response exceeds its budget, a warning is logged via `console.error` and an advisory hint is injected into the response's `hints` array.

---

### Key Tool Parameters

#### memory_search

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | string | - | Natural language search query |
| `concepts` | string[] | - | Multi-concept AND search (2-5 concepts, results must match ALL) |
| `specFolder` | string | - | Limit search to specific spec folder |
| `limit` | number | 10 | Maximum number of results to return |
| `sessionId` | string | - | Session identifier for working memory and session deduplication (~50% token savings on follow-up queries) |
| `enableDedup` | boolean | true | Enable session deduplication (requires `sessionId`) |
| `tier` | string | - | Filter by importance tier (constitutional, critical, important, normal, temporary, deprecated) |
| `contextType` | string | - | Filter by context type (decision, implementation, research, etc.) |
| `useDecay` | boolean | true | Apply temporal decay scoring to results |
| `includeContiguity` | boolean | false | Include adjacent/contiguous memories in results |
| `includeConstitutional` | boolean | **true** | Include constitutional tier memories at top of results |
| `includeContent` | boolean | false | Include full file content in results (embeds load logic directly in search) |
| `anchors` | string[] | - | Specific anchor IDs to extract from content (requires `includeContent: true`) |
| `bypassCache` | boolean | false | Skip tool cache and force a fresh search |
| `rerank` | boolean | false | Enable cross-encoder reranking of results (improves relevance, adds computation) |
| `applyLengthPenalty` | boolean | true | Apply length-based penalty during reranking (only effective when `rerank` is true) |
| `applyStateLimits` | boolean | false | Apply per-tier quantity limits to balance result diversity |
| `minState` | string | "WARM" | Minimum memory state filter (HOT > WARM > COLD > DORMANT > ARCHIVED) |
| `intent` | enum | - | Task intent for weight adjustments (add_feature, fix_bug, refactor, security_audit, understand) |
| `autoDetectIntent` | boolean | true | Auto-detect intent from query if not explicitly specified |

#### memory_context

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `input` | string | **Required** | The query, prompt, or context description |
| `mode` | string | "auto" | auto, quick, deep, focused, resume |
| `intent` | string | - | Task intent (auto-detected if not provided) |
| `specFolder` | string | - | Limit to specific spec folder |
| `limit` | number | 10 | Maximum results |
| `sessionId` | string | - | Session ID for deduplication |
| `enableDedup` | boolean | true | Enable session deduplication |
| `includeContent` | boolean | false | Include full file content in results |
| `anchors` | string[] | - | Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode) |

#### memory_index_scan

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `specFolder` | string | - | Limit scan to specific spec folder |
| `force` | boolean | false | Force re-index all files (ignore content hash) |
| `incremental` | boolean | true | Skip unchanged files (mtime + hash check) |
| `includeConstitutional` | boolean | true | Scan `.opencode/skill/*/constitutional/` directories |
| `includeReadmes` | boolean | **true** | Include README.md and README.txt files from skill and project directories |
| `includeSpecDocs` | boolean | **true** | Include spec folder documents (specs, plans, tasks, etc.) from `.opencode/specs/` |

**5-Source Pipeline:** When `memory_index_scan` runs, it categorizes discovered files into five sources:

| Source | Path Pattern | Importance Weight | Description |
|--------|-------------|-------------------|-------------|
| `constitutionalFiles` | `.opencode/skill/*/constitutional/*.md` | Per-file metadata | Constitutional tier files (never decay, always surface) |
| `specDocuments` | `.opencode/specs/**/*.md` | Per-type multiplier | Spec folder documents (specs, plans, decisions) with document-type scoring |
| `specFiles` | `specs/**/memory/*.{md,txt}` | 0.5 | Memory files from spec folders |
| `projectReadmes` | `**/README.{md,txt}` (excl. node_modules, .git, etc.) | 0.4 | Project documentation providing codebase context |
| `skillReadmes` | `.opencode/skill/*/README.{md,txt}` | 0.3 | Skill documentation (lower weight to never outrank user work) |

README sources are indexed with reduced importance weights so they provide useful background context during search without outranking user-authored memories. README.md and README.txt documents follow consistent formatting and anchor conventions (specs 111/113), which improves embedding quality and anchor-based retrieval accuracy. Set `includeReadmes: false` for backward-compatible behavior that excludes README sources. Spec documents are controlled by `includeSpecDocs` (default: `true`) or the `SPECKIT_INDEX_SPEC_DOCS` environment variable, and use document-type scoring multipliers (11 types).

---

<!-- /ANCHOR:mcp-tools -->

## 3. COGNITIVE MEMORY
<!-- ANCHOR:cognitive-memory -->

This is not basic memory storage. The system implements biologically-inspired cognitive features that mirror how human memory works.

### FSRS Power-Law Decay

Memory strength follows the Free Spaced Repetition Scheduler formula, validated on 100M+ Anki users:

```
R(t, S) = (1 + (19/81) × t/S)^(-0.5)    where 19/81 ≈ 0.2346; R(S,S) = 0.9
```

Where:
- `R(t, S)` = Retrievability (probability of recall) at time t with stability S
- `t` = Time elapsed since last access (in days)
- `S` = Stability (memory strength in days). Higher values mean slower decay

**Why FSRS beats exponential decay:** Exponential decay forgets too aggressively. FSRS matches how human memory works: rapid initial forgetting that slows over time.

---

### 5-State Memory Model

Memories transition between states based on their retrievability score:

| State | Retrievability | Content Returned | Max Items | Behavior |
|-------|----------------|------------------|-----------|----------|
| **HOT** | R >= 0.80 | Full content | 5 | Active working memory, top priority |
| **WARM** | 0.25 <= R < 0.80 | Summary only | 10 | Accessible background context |
| **COLD** | 0.05 <= R < 0.25 | None | - | Inactive but retrievable on demand |
| **DORMANT** | 0.02 <= R < 0.05 | None | - | Very weak, needs explicit revival |
| **ARCHIVED** | R < 0.02 or 90d+ | None | - | Time-based archival, effectively forgotten |

---

### Type-Specific Half-Lives

Different memory types decay at different rates. Procedural knowledge lasts longer than episodic memories:

| Memory Type | Half-Life | Example |
|-------------|-----------|---------|
| **constitutional** | Never | "Never edit without reading first" |
| **procedural** | 90+ days | "How to deploy to production" |
| **semantic** | 60 days | "RRF stands for Reciprocal Rank Fusion" |
| **contextual** | 30 days | "Auth module uses JWT" |
| **episodic** | 14 days | "Fixed bug XYZ on Tuesday" |
| **working** | 1 day | "Currently debugging auth flow" |
| **temporary** | 4 hours | "Testing this config" |
| **debug** | 1 hour | "Stack trace from crash" |
| **scratch** | Session | "Rough notes" |

**Auto-detection:** Memory type is inferred from file path and frontmatter.

---

### Multi-Factor Decay

Decay score is computed from 5 factors, not time elapsed alone:

| Factor | Weight | Description |
|--------|--------|-------------|
| **Temporal** | Base | FSRS formula based on stability |
| **Usage** | Up to 1.5x | Access count boost (capped) |
| **Importance** | 1.0-3.0x | Tier-based anchor |
| **Pattern** | +20% | Alignment with current task |
| **Citation** | +10% | Recently cited boost |

**Formula:** `composite_score = temporal x usage x importance x pattern x citation`

---

### Prediction Error Gating

Prevents duplicate memories from polluting the index:

| Similarity | Category | Action |
|------------|----------|--------|
| >= 0.95 | **DUPLICATE** | Block save, reinforce existing |
| 0.90-0.94 | **HIGH_MATCH** | Check for contradiction. UPDATE or SUPERSEDE |
| 0.70-0.89 | **MEDIUM_MATCH** | Create with link to related memory |
| 0.50-0.69 | **LOW_MATCH** | Create new, note similarity |
| < 0.50 | **UNIQUE** | Create new memory normally |

---

### Testing Effect

Accessing memories strengthens them. The harder the recall, the greater the benefit:

| Retrievability at Access | Stability Boost |
|--------------------------|-----------------|
| R >= 0.90 (easy recall) | +5% |
| R = 0.70 (moderate) | +10% |
| R = 0.50 (challenging) | +15% |
| R < 0.30 (hard recall) | +20% |

---

### Co-Activation

When one memory is retrieved, related memories get a boost:

| Relationship | Boost |
|--------------|-------|
| Same spec folder | +0.2 |
| Temporal proximity | +0.15 |
| Shared entities | +0.1 |
| Semantic similarity | +0.05 |
| **Causal link** | **+0.25** |

**Working Memory Capacity:** Limited to ~7 active items (Miller's Law) + 10 WARM items.

---

### Session Learning

Track knowledge improvement across task execution:

```typescript
// 1. Before starting - capture baseline
task_preflight({
  specFolder: "specs/077-upgrade",
  taskId: "T1",
  knowledgeScore: 40,
  uncertaintyScore: 70,
  contextScore: 50,
  knowledgeGaps: ["database schema", "API endpoints"]
})

// 2. Do the work

// 3. After completing - measure delta
task_postflight({
  specFolder: "specs/077-upgrade",
  taskId: "T1",
  knowledgeScore: 85,
  uncertaintyScore: 20,
  contextScore: 90,
  gapsClosed: ["database schema", "API endpoints"]
})
```

**Learning Index Formula:**
```
LI = (KnowledgeDelta * 0.4) + (UncertaintyReduction * 0.35) + (ContextImprovement * 0.25)
```

**Interpretation:**
- LI > 30: Strong learning session
- LI 10-30: Moderate learning
- LI < 10: Minimal learning or rework

---

### Memory Consolidation Pipeline

5-phase process to distill episodic memories into semantic knowledge:

1. **REPLAY**: Select episodic memories older than 7 days
2. **ABSTRACT**: Find facts appearing 2+ times across episodes
3. **INTEGRATE**: Create/update semantic memories from patterns
4. **PRUNE**: Archive episodes whose facts are now semantic
5. **STRENGTHEN**: Boost frequently-accessed memories

---

<!-- /ANCHOR:cognitive-memory -->

## 4. SEARCH SYSTEM
<!-- ANCHOR:search-system -->

### Hybrid Search Architecture

The default search combines three engines using Reciprocal Rank Fusion (RRF):

```
Query
   |
   v
+------------------+     +------------------+     +------------------+
|   VECTOR         |     |    BM25          |     |    GRAPH         |
|   1024d          |     |   Lexical        |     |   Causal         |
|   (1.0x)         |     |   (1.0x)         |     |   (1.5x)         |
+--------+---------+     +--------+---------+     +--------+---------+
         |                        |                        |
         +------------------------+------------------------+
                                  |
                                  v
                    +-------------+-------------+
                    |   RRF FUSION (k=60)       |
                    |   +10% convergence bonus  |
                    +-------------+-------------+
                                  |
                                  v
                    +-------------+-------------+
                    |  CROSS-ENCODER RERANK     |
                    |   (optional, top 20)      |
                    +-------------+-------------+
                                  |
                                  v
                         Final Ranked Results
```

---

### Why Hybrid Beats Single-Engine

| Query Type | Vector | BM25 | Graph | Winner |
|------------|--------|------|-------|--------|
| "how does auth work" | Best match | - | - | Vector |
| "TODO BUG-123" | Poor | **Exact match** | - | BM25 |
| "why JWT not cookies" | Good | Good | **Traces decision** | Graph |
| "authentication security" | Good | Good | - | **Hybrid** |

---

### RRF Fusion

```typescript
RRF_score = sum(weight / (k + rank_i)) * convergence_bonus
```

| Parameter | Value | Description |
|-----------|-------|-------------|
| **k** | 60 | Fusion constant (industry standard) |
| **Vector weight** | 1.0x | Semantic similarity |
| **BM25 weight** | 1.0x | Keyword matching |
| **Graph weight** | 1.5x | Causal relationships get boost |
| **Convergence bonus** | +10% | Results found by multiple engines |

---

### Intent-Aware Retrieval

The system detects query intent and applies task-specific search weights:

| Intent | Weight Adjustments | Example Query |
|--------|-------------------|---------------|
| **add_feature** | +procedural, +architectural | "implement user auth" |
| **fix_bug** | +error logs, +debug, +recent | "fix login crash" |
| **refactor** | +patterns, +structure | "improve auth module" |
| **security_audit** | +security, +vulnerabilities | "check auth security" |
| **understand** | +semantic, +explanatory | "how does auth work" |
| **find_spec** | +spec documents, +plans, +decision records | "find the spec for auth" |
| **find_decision** | +decision records, +architectural context | "why did we choose JWT" |

---

### ANCHOR Format (93% Token Savings)

Memory files use ANCHOR markers for section-level retrieval:

```markdown
<!-- ANCHOR: decisions -->
## Authentication Decision
We chose JWT with refresh tokens because:
1. Stateless authentication scales better
2. Refresh tokens allow session extension
<!-- /ANCHOR: decisions -->
```

**Common Anchors:** `summary`, `decisions`, `context`, `state`, `artifacts`, `blockers`, `next-steps`, `metadata`

**Coverage:** ~473 anchor tags deployed across 74 READMEs (specs 111/113), providing fine-grained section-level retrieval targets for the `anchors` parameter on `memory_search` and `memory_context`.

**Token Savings:**
- Full document: ~3000 tokens
- Summary anchor only: ~200 tokens
- **Savings: 93%**

---

### Compression Tiers

| Level | ~Tokens | Fields Included | Use Case |
|-------|---------|-----------------|----------|
| **minimal** | ~100 | id, title, tier | Quick context check |
| **compact** | ~200 | + summary | Resume prior work |
| **standard** | ~400 | + anchors | Active development |
| **full** | Complete | All | Deep investigation |

---

### Constitutional Tier

The **constitutional** tier is special. These memories ALWAYS appear at the top of search results:

| Behavior | Description |
|----------|-------------|
| **Always surfaces** | Included at top of every search by default |
| **Fixed similarity** | Returns `similarity: 100` regardless of query match |
| **Token budget** | ~2000 tokens max for constitutional memories |
| **Use cases** | Project rules, coding standards, critical context |
| **Control** | Set `includeConstitutional: false` to disable |

---

<!-- /ANCHOR:search-system -->

## 5. IMPORTANCE TIERS
<!-- ANCHOR:importance-tiers -->

### The Six-Tier System

| Tier | Boost | Decay Rate | Auto-Clean | Use Case |
|------|-------|------------|------------|----------|
| **constitutional** | 3.0x | Never | Never | Project rules, always-surface |
| **critical** | 2.0x | Never | Never | Architecture decisions |
| **important** | 1.5x | Never | Never | Key implementations |
| **normal** | 1.0x | 0.80/turn | 90 days | Standard context (default) |
| **temporary** | 0.5x | 0.60/turn | 7 days | Debug sessions |
| **deprecated** | 0.0x | Never | Manual | Outdated info |

### Tier Selection Guide

| Content Type | Recommended Tier |
|--------------|------------------|
| Coding standards, project rules | `constitutional` |
| Breaking changes, migration docs | `critical` |
| Feature specs, architecture ADRs | `important` |
| Implementation notes | `normal` (default) |
| Debug logs, experiments | `temporary` |
| Replaced/outdated docs | `deprecated` |

### Source-Type Importance Weighting

The indexing pipeline also assigns importance weights based on file source. This ensures auto-indexed content (like READMEs) never outranks user-authored memories:

| Source Type | Weight | Rationale |
|-------------|--------|-----------|
| User memory files | Per-file metadata | Full importance from frontmatter |
| Constitutional files | Per-file metadata | Highest priority (tier boost 3.0x) |
| Skill READMEs | 0.3 | Background reference, not user work |
| Project READMEs | 0.4 | Codebase context, slightly higher than skill docs |

---

<!-- /ANCHOR:importance-tiers -->

## 6. STRUCTURE
<!-- ANCHOR:structure -->

```
mcp_server/
├── context-server.ts       # Main MCP server entry point (22 tools) [source]
├── package.json            # @spec-kit/mcp-server v1.7.2
├── tsconfig.json           # TypeScript config (outDir: ./dist)
├── README.md               # This file
│
├── core/                   # Core initialization [TypeScript sources]
│   ├── index.ts            # Core exports
│   ├── config.ts           # Path configuration (SERVER_DIR, LIB_DIR, etc.)
│   └── db-state.ts         # Database connection state
│
├── handlers/               # MCP tool handlers (9 functional + 2 infra) [TypeScript sources]
│   ├── index.ts            # Handler aggregator
│   ├── types.ts            # Shared handler types
│   ├── memory-search.ts    # memory_search + Testing Effect
│   ├── memory-triggers.ts  # memory_match_triggers + cognitive
│   ├── memory-save.ts      # memory_save + PE gating
│   ├── memory-crud.ts      # update/delete/list/stats/health/validate
│   ├── memory-index.ts     # memory_index_scan + 5-source pipeline + README/spec doc indexing
│   ├── checkpoints.ts      # checkpoint_create/list/restore/delete
│   ├── session-learning.ts # preflight/postflight/learning history
│   ├── memory-context.ts   # memory_context + unified entry
│   └── causal-graph.ts     # causal_link/unlink/stats + drift_why
│
├── lib/                    # Library modules (50) [TypeScript sources]
│   ├── errors.ts           # Standalone error utilities
│   │
│   ├── architecture/       # Layer definitions (1 module)
│   │   └── layer-definitions.ts    # MCP layer architecture
│   │
│   ├── cache/              # Caching (1 module)
│   │   └── tool-cache.ts           # Tool result caching
│   │
│   ├── cognitive/          # Cognitive memory (8 modules)
│   │   ├── fsrs-scheduler.ts       # FSRS power-law algorithm
│   │   ├── prediction-error-gate.ts # Duplicate detection
│   │   ├── tier-classifier.ts      # 5-state classification
│   │   ├── attention-decay.ts      # Multi-factor decay
│   │   ├── co-activation.ts        # Related memory boosting
│   │   ├── working-memory.ts       # Session-scoped activation
│   │   ├── temporal-contiguity.ts  # Temporal adjacency tracking
│   │   └── archival-manager.ts     # 5-state archival model
│   │
│   ├── config/             # Configuration (2 modules)
│   │   ├── memory-types.ts         # Memory type definitions
│   │   └── type-inference.ts       # Type auto-detection
│   │
│   ├── errors/             # Error handling (3 modules)
│   │   ├── core.ts                 # Core error types
│   │   ├── index.ts                # Error exports
│   │   └── recovery-hints.ts       # 49 error codes
│   │
│   ├── interfaces/         # Interfaces (1 module)
│   │   └── vector-store.ts         # Vector store interface
│   │
│   ├── learning/           # Learning system (2 modules)
│   │   ├── index.ts                # Learning exports
│   │   └── corrections.ts          # Learning from corrections
│   │
│   ├── parsing/            # Content parsing (3 modules)
│   │   ├── memory-parser.ts        # Memory file parser
│   │   ├── trigger-matcher.ts      # Trigger phrase matching
│   │   └── entity-scope.ts         # Entity scope extraction
│   │
│   ├── providers/          # Embedding providers (2 modules)
│   │   ├── embeddings.ts           # Provider abstraction
│   │   └── retry-manager.ts        # API retry logic
│   │
│   ├── response/           # Response formatting (1 module)
│   │   └── envelope.ts             # Response envelope
│   │
│   ├── scoring/            # Scoring algorithms (4 modules)
│   │   ├── composite-scoring.ts    # 5-factor scoring
│   │   ├── confidence-tracker.ts   # Confidence tracking
│   │   ├── importance-tiers.ts     # Tier boost values
│   │   └── folder-scoring.ts       # Spec folder ranking
│   │
│   ├── search/             # Search engines (8 modules)
│   │   ├── vector-index.ts         # sqlite-vec vector search (facade)
│   │   ├── vector-index-impl.ts    # Vector index implementation
│   │   ├── hybrid-search.ts        # FTS5 + vector fusion with RRF
│   │   ├── rrf-fusion.ts           # RRF fusion algorithm
│   │   ├── bm25-index.ts          # BM25 lexical search
│   │   ├── cross-encoder.ts        # Cross-encoder reranking
│   │   ├── reranker.ts             # Reranking utilities
│   │   └── intent-classifier.ts    # 7 intent types
│   │
│   ├── session/            # Session management (1 module)
│   │   └── session-manager.ts      # Session deduplication
│   │
│   ├── storage/            # Persistence (7 modules)
│   │   ├── access-tracker.ts       # Access history
│   │   ├── checkpoints.ts          # State snapshots
│   │   ├── causal-edges.ts         # Causal graph storage
│   │   ├── incremental-index.ts    # Incremental indexing
│   │   ├── transaction-manager.ts  # Transaction management
│   │   ├── history.ts              # History tracking
│   │   └── index-refresh.ts        # Index refresh utilities
│   │
│   ├── utils/              # Utilities (4 modules)
│   │   ├── format-helpers.ts       # Format utilities
│   │   ├── path-security.ts        # Path validation
│   │   ├── retry.ts                # Retry utilities
│   │   └── logger.ts               # Logging utilities
│   │
│   └── validation/         # Validation (1 module)
│       └── preflight.ts            # Pre-flight validation
│
├── tools/                  # Tool registration [TypeScript sources]
│   ├── index.ts            # Tool aggregator
│   ├── types.ts            # Tool type definitions
│   ├── memory-tools.ts     # Memory tool registrations
│   ├── context-tools.ts    # Context tool registrations
│   ├── lifecycle-tools.ts  # Lifecycle tool registrations
│   ├── checkpoint-tools.ts # Checkpoint tool registrations
│   └── causal-tools.ts     # Causal tool registrations
│
├── hooks/                  # Lifecycle hooks [TypeScript sources]
├── utils/                  # Utility modules [TypeScript sources]
├── formatters/             # Output formatting [TypeScript sources]
│   ├── search-results.ts   # Format search results
│   └── token-metrics.ts    # Token estimation
│
├── scripts/                # CLI utilities [TypeScript sources]
│
├── dist/                   # Compiled JavaScript output (generated)
│   ├── context-server.js   # Entry point (from context-server.ts)
│   ├── core/
│   ├── handlers/
│   ├── lib/
│   ├── tools/
│   ├── formatters/
│   ├── hooks/
│   ├── utils/
│   └── scripts/
│
├── startup-checks.ts       # Startup validation
├── tool-schemas.ts         # Tool schema definitions
├── vitest.config.ts        # Vitest test configuration
│
├── tests/                  # Test suite (3,800+ tests across 114 files; 58/58 MCP integration tests pass)
│
├── database/               # SQLite database storage
│   └── context-index.sqlite
│
├── configs/                # Configuration files
│   └── search-weights.json
│
└── node_modules/           # Dependencies
```

> **Note:** All source files are TypeScript (`.ts`) in the source directories (root, core, handlers, lib, tools, formatters, hooks, utils, scripts). The TypeScript compiler (`tsc`) compiles them to JavaScript in the `dist/` directory via `outDir: "./dist"` in tsconfig.json. At runtime, `node` executes `dist/context-server.js` (specified in package.json as the entry point). The `__dirname` variable resolves to `dist/core/` at runtime, so path resolution in config.ts uses `SERVER_DIR = path.join(__dirname, '..')` to reach `dist/` and `LIB_DIR = path.join(__dirname, '..', 'lib')` to reach `dist/lib/`. `SHARED_DIR = path.join(SERVER_DIR, '..', 'shared')` resolves to the workspace-shared directory.

---

<!-- /ANCHOR:structure -->

## 7. QUICK START
<!-- ANCHOR:quick-start -->

### 30-Second Setup

The server is typically started via MCP configuration, not manually.

```bash
# 1. Navigate to mcp_server directory
cd .opencode/skill/system-spec-kit/mcp_server

# 2. Install dependencies
npm install

# 3. Compile TypeScript to JavaScript
tsc
# Outputs compiled .js files to dist/

# 4. Start server (for testing)
npm start
# Runs: node dist/context-server.js
```

### Verify Installation

```bash
# Check Node.js version
node --version
# Expected: v18.0.0 or higher

# Check dependencies installed
ls node_modules/@modelcontextprotocol/sdk

# Verify TypeScript compilation
ls dist/context-server.js
# Expected: File exists after running tsc

# Run test suite
npm test
# Expected: 3,800+ tests passing
```

### MCP Configuration

Add to your MCP client configuration (e.g., `opencode.json`):

```json
{
  "mcpServers": {
    "spec_kit_memory": {
      "command": "node",
      "args": [".opencode/skill/system-spec-kit/mcp_server/dist/context-server.js"],
      "cwd": "${workspaceFolder}",
      "_note": "Executes compiled JS from dist/; source is context-server.ts"
    }
  }
}
```

---

<!-- /ANCHOR:quick-start -->

## 8. CONFIGURATION
<!-- ANCHOR:configuration -->

### Environment Variables

#### Core Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `MEMORY_DB_PATH` | `./dist/database/context-index.sqlite` | Database location |
| `MEMORY_BASE_PATH` | CWD | Workspace root for memory files |
| `DEBUG_TRIGGER_MATCHER` | `false` | Enable verbose trigger logs |

In this repository, `database/context-index.sqlite` is maintained as a compatibility symlink to the canonical runtime path `dist/database/context-index.sqlite`.

#### Embedding Providers

| Variable | Required | Description |
|----------|----------|-------------|
| `EMBEDDINGS_PROVIDER` | No | Force: `voyage`, `openai` or `hf-local` |
| `VOYAGE_API_KEY` | For Voyage | Voyage AI API key |
| `OPENAI_API_KEY` | For OpenAI | OpenAI API key |

---

### Embedding Provider Options

| Provider | Dimensions | Speed | Quality | Privacy | Best For |
|----------|------------|-------|---------|---------|----------|
| **Voyage AI** | 1024 | Fast | Excellent | Cloud | Production (recommended) |
| **OpenAI** | 1536/3072 | Fast | Very Good | Cloud | Alternative cloud option |
| **HF Local** | 768 | Slow* | Good | **Local** | Privacy, offline |

*First run downloads model (~400MB), subsequent runs faster

**Auto-Detection Priority:**
1. Explicit `EMBEDDINGS_PROVIDER` environment variable
2. `VOYAGE_API_KEY` detected -> Voyage (1024d)
3. `OPENAI_API_KEY` detected -> OpenAI (1536d)
4. Default -> HuggingFace Local (768d)

---

### Feature Flags

| Flag | Default | Description |
|------|---------|-------------|
| `SPECKIT_RRF` | `true` | Enable RRF search fusion |
| `SPECKIT_BM25` | `true` | Enable BM25 lexical search |
| `SPECKIT_SESSION_DEDUP` | `true` | Enable session deduplication |
| `SPECKIT_LAZY_LOAD` | `true` | Defer embedding model init |
| `SPECKIT_TYPE_DECAY` | `true` | Enable type-specific half-lives |
| `SPECKIT_RELATIONS` | `true` | Enable causal memory graph |
| `SPECKIT_CROSS_ENCODER` | `false` | Enable cross-encoder reranking |
| `SPECKIT_INCREMENTAL` | `true` | Enable incremental indexing |
| `SPECKIT_INDEX_SPEC_DOCS` | `false` | Enable spec folder document indexing (5th source) |

---

### Cognitive Memory Thresholds

| Variable | Default | Description |
|----------|---------|-------------|
| `HOT_THRESHOLD` | 0.80 | Retrievability threshold for HOT |
| `WARM_THRESHOLD` | 0.25 | Retrievability threshold for WARM |
| `COLD_THRESHOLD` | 0.05 | Retrievability threshold for COLD |
| `DORMANT_THRESHOLD` | 0.02 | Retrievability threshold for DORMANT |
| `MAX_HOT_MEMORIES` | 5 | Maximum HOT tier memories |
| `MAX_WARM_MEMORIES` | 10 | Maximum WARM tier memories |

---

### Database Schema

| Table | Purpose |
|-------|---------|
| `memory_index` | Memory metadata (title, tier, triggers, document_type, spec_level per schema v13) |
| `vec_memories` | Vector embeddings (sqlite-vec) |
| `memory_fts` | Full-text search index (FTS5) |
| `checkpoints` | State snapshots |
| `memory_history` | Access and modification history |
| `learning_records` | Session learning preflight/postflight |
| `working_memory` | Session-scoped attention scores |
| `memory_conflicts` | PE gating decisions (audit trail) |
| `causal_edges` | Causal relationships (6 types) |
| `memory_corrections` | Learning from corrections |
| `session_state` | Crash recovery state |

---

### 7-Layer MCP Architecture

| Layer | Name | Budget | Tools |
|-------|------|--------|-------|
| L1 | Orchestration | 2000 | `memory_context` |
| L2 | Core | 1500 | `memory_search`, `memory_match_triggers`, `memory_save` |
| L3 | Discovery | 800 | `memory_list`, `memory_stats`, `memory_health` |
| L4 | Mutation | 500 | `memory_delete`, `memory_update`, `memory_validate` |
| L5 | Lifecycle | 600 | `checkpoint_create`, `checkpoint_list`, `checkpoint_restore`, `checkpoint_delete` |
| L6 | Analysis | 1200 | `task_preflight`, `task_postflight`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink` |
| L7 | Maintenance | 1000 | `memory_index_scan`, `memory_get_learning_history` |

---

### Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| `@modelcontextprotocol/sdk` | ^1.24.3 | MCP protocol |
| `@huggingface/transformers` | ^3.8.1 | Local embeddings |
| `better-sqlite3` | ^12.6.2 | SQLite database |
| `sqlite-vec` | ^0.1.7-alpha.2 | Vector similarity search |

---

<!-- /ANCHOR:configuration -->

## 9. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Basic Memory Search

```typescript
// Simple semantic search
memory_search({
  query: "how does authentication work",
  limit: 5
})
// Returns: constitutional memories at top + semantic matches
```

### ANCHOR-Based Retrieval (Token Efficient)

```typescript
// Only retrieve specific sections (93% token savings)
memory_search({
  query: "auth decisions",
  anchors: ['decisions', 'context'],
  includeContent: true
})
```

### Intent-Aware Context

```typescript
// Get context optimized for debugging
memory_context({
  input: "debugging auth issues",
  mode: "focused",
  intent: 'fix_bug'
})
// Returns: Error logs, recent changes, debug history weighted high
```

### Trace Decision Lineage

```typescript
// Why was this decision made?
memory_drift_why({
  memoryId: 'jwt-auth-decision-123',
  maxDepth: 3
})
// Returns causal chain with causedBy, enabledBy, supersedes
```

### Create Causal Link

```typescript
// Document that decision A supersedes decision B
memory_causal_link({
  sourceId: 'new-auth-approach-456',
  targetId: 'old-auth-approach-123',
  relation: 'supersedes',
  evidence: 'JWT better for microservices scale'
})
```

### Session Learning Workflow

```typescript
// 1. Before starting - capture baseline
task_preflight({
  specFolder: "specs/077-upgrade",
  taskId: "T1",
  knowledgeScore: 40,
  uncertaintyScore: 70,
  contextScore: 50
})

// 2. Do the work...

// 3. After completing - measure improvement
task_postflight({
  specFolder: "specs/077-upgrade",
  taskId: "T1",
  knowledgeScore: 85,
  uncertaintyScore: 20,
  contextScore: 90
})
// Result: Learning Index = 45.5
```

### Checkpoint Recovery

```typescript
// Before risky operation
checkpoint_create({
  name: "pre-cleanup",
  metadata: { reason: "Safety before bulk delete" }
})

// Do risky operation...
memory_delete({ specFolder: "specs/old-project", confirm: true })

// If something went wrong
checkpoint_restore({ name: "pre-cleanup" })
```

---

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

---

<!-- /ANCHOR:usage-examples -->

## 10. TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

### Common Issues

#### Model Download Failures

**Symptom:** `Error: Failed to download embedding model` or `Failed to parse ONNX model`

**Solution:**
```bash
# Clear the in-project HuggingFace model cache (most common)
rm -rf node_modules/@huggingface/transformers/.cache

# Also clear global HuggingFace cache if needed
rm -rf ~/.cache/huggingface/

# Server re-downloads on next start
```

#### Database Corruption

**Symptom:** `SQLITE_CORRUPT` or search returns no results

**Solution:**
```bash
# Delete database
rm .opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite

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
rm .opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite

# Re-index with new provider
memory_index_scan({ force: true })
```

#### Empty Search Results

**Causes & Solutions:**
1. **Database empty:** Run `memory_index_scan({ force: true })`
2. **Embedding model not ready:** Check `memory_health({})` for `embeddingModelReady: true`
3. **Query too specific:** Try broader search terms
4. **Wrong specFolder:** Check `memory_list({})` for available folders

---

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Empty search results | `memory_index_scan({ force: true })` |
| Slow embeddings | Set `VOYAGE_API_KEY` for faster API embeddings |
| Missing constitutional | Check files in `constitutional/` directory |
| Learning not tracked | Ensure `specFolder` and `taskId` match exactly |
| Duplicate detection | Check `memory_conflicts` table for decisions |
| Causal graph empty | Use `memory_causal_link` to create relationships |
| Session not deduplicating | Ensure `session_id` is consistent |

---

### Recovery Hints

Every error includes actionable recovery guidance:

| Error Code | Recovery Hint |
|------------|---------------|
| `E041` | Run `memory_index_scan` to rebuild vector index |
| `E001` | Check embedding API key or set `SPECKIT_LOCAL_EMBEDDINGS=true` |
| `E040` | Query too long, reduce to < 10000 characters |
| `timeout` | Increase `SPECKIT_SEARCH_TIMEOUT` or simplify query |
| `corrupted` | Delete checkpoint and recreate |
| `not_found` | List available checkpoints with `checkpoint_list()` |
| `duplicate` | Memory exists. Use `memory_update()` for modifications |

---

### Diagnostic Commands

```bash
# Check database status
sqlite3 database/context-index.sqlite "SELECT COUNT(*) FROM memory_index;"

# Check schema version
sqlite3 database/context-index.sqlite "PRAGMA user_version;"

# Check memory states
sqlite3 database/context-index.sqlite "SELECT importance_tier, COUNT(*) FROM memory_index GROUP BY importance_tier;"

# Check causal graph stats
sqlite3 database/context-index.sqlite "SELECT relation, COUNT(*) FROM causal_edges GROUP BY relation;"

# Check memory types
sqlite3 database/context-index.sqlite "SELECT memory_type, COUNT(*) FROM memory_index GROUP BY memory_type;"
```

---

### Run Tests

```bash
# Run full test suite
cd .opencode/skill/system-spec-kit/mcp_server
npm test

# Run specific test file (from dist/)
node dist/tests/fsrs-scheduler.test.js
node dist/tests/rrf-fusion.test.js
node dist/tests/causal-edges.test.js
```

---

<!-- /ANCHOR:troubleshooting -->

## 11. RELATED RESOURCES
<!-- ANCHOR:related -->

### Parent Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| Skill README | `../README.md` | Complete skill documentation |
| SKILL.md | `../SKILL.md` | Workflow instructions for AI agents |
| Install Guide | `INSTALL_GUIDE.md` | Detailed installation |

### Key Module Files (TypeScript Sources)

| Module | Purpose |
|--------|---------|
| `lib/cognitive/fsrs-scheduler.ts` | FSRS power-law decay algorithm |
| `lib/cognitive/tier-classifier.ts` | 5-state memory classification |
| `lib/cognitive/prediction-error-gate.ts` | Duplicate detection |
| `lib/scoring/composite-scoring.ts` | Multi-factor ranking |
| `lib/search/hybrid-search.ts` | FTS5 + vector fusion with RRF |
| `lib/search/bm25-index.ts` | BM25 lexical search |
| `lib/search/intent-classifier.ts` | 7 intent types |
| `lib/storage/causal-edges.ts` | Causal graph storage |
| `lib/session/session-manager.ts` | Session deduplication |
| `lib/errors/recovery-hints.ts` | 49 error codes |
| `lib/providers/retry-manager.ts` | Embedding provider retry logic |
| `handlers/causal-graph.ts` | Causal link/unlink/stats/why |

### External Resources

| Resource | URL |
|----------|-----|
| MCP Protocol Spec | https://modelcontextprotocol.io/ |
| FSRS Algorithm | https://github.com/open-spaced-repetition/fsrs4anki/wiki |
| sqlite-vec | https://github.com/asg017/sqlite-vec |
| Voyage AI | https://www.voyageai.com/ |
| FTS5 Docs | https://www.sqlite.org/fts5.html |
| RRF Paper | https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf |

<!-- /ANCHOR:related -->
