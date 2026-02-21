---
title: "Spec Kit Memory — MCP Server"
description: "Model Context Protocol server providing semantic memory, hybrid search and graph intelligence for AI-assisted development."
trigger_phrases:
  - "MCP server"
  - "spec kit memory"
  - "hybrid search"
  - "cognitive memory"
importance_tier: "normal"
---

# Spec Kit Memory — MCP Server

> AI memory that persists without poisoning your context window.

Model Context Protocol server providing semantic memory, hybrid search and graph intelligence for AI-assisted development. Context works across sessions, models, projects and tools without re-explaining everything every conversation.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. ARCHITECTURE](#3--architecture)
- [4. MCP TOOLS](#4--mcp-tools)
- [5. SEARCH SYSTEM](#5--search-system)
- [6. COGNITIVE MEMORY](#6--cognitive-memory)
- [7. STRUCTURE](#7--structure)
- [8. CONFIGURATION](#8--configuration)
- [9. USAGE EXAMPLES](#9--usage-examples)
- [10. TROUBLESHOOTING](#10--troubleshooting)
- [11. FAQ](#11--faq)
- [12. RELATED RESOURCES](#12--related-resources)

---

<!-- /ANCHOR:table-of-contents -->

## 1. OVERVIEW
<!-- ANCHOR:overview -->

### What This Is

`@spec-kit/mcp-server` v1.7.2 is a Model Context Protocol server that gives AI assistants persistent, intelligent memory. It implements a cognitive memory system with biologically-inspired attention dynamics, replacing naive context-window stuffing with structured retrieval.

### The Problem

Your AI assistant has amnesia. Every conversation starts fresh. You explain your architecture Monday, by Wednesday it is a blank slate. Context disappears. Decisions vanish. That auth system you documented? Gone.

You have tried:
- **Chat logs**: Ctrl+F through thousands of messages
- **Plain RAG**: Everything indexed, nothing prioritized
- **Manual notes**: "I'll document it later" (you won't)
- **Copy-pasting context**: Bloated prompts, wasted tokens, wrong priorities

None of it works because none of it understands what matters.

### The Solution

This MCP server gives your AI assistant persistent memory with intelligence built in:

- **4-channel hybrid search** (Vector, FTS5, BM25, Skill Graph) finds what you mean, not what you typed
- **Post-fusion enhancements** — RRF, Adaptive Fusion, MMR, Co-activation and Recency Boost are applied after retrieval, not separate search channels
- **Cognitive decay** keeps relevant memories fresh and lets stale ones fade
- **Causal graph** traces decision lineage ("Why did we choose JWT?")
- **Session awareness** prevents duplicate context and saves tokens
- **Evidence gap detection** flags missing context before retrieval

---

### What Makes This Different

| Capability | Basic RAG | This MCP Server |
| --- | --- | --- |
| **"Why" queries** | Impossible | Causal graph traversal (6 relationship types) |
| **Recovery** | Hope | Crash recovery with zero data loss |
| **Sessions** | None | Deduplication with ~50% tokens saved on follow-up |
| **Context** | Full documents | ANCHOR-based section retrieval (93% token savings) |
| **Search** | Vector only | 4-channel (Vector, FTS5, BM25, Skill Graph) with adaptive RRF fusion |
| **State** | Stateless | 5-state cognitive model (HOT/WARM/COLD/DORMANT/ARCHIVED) |
| **Tiers** | None | 6-tier importance with configurable boosts |
| **Decay** | None or exponential | FSRS power-law (validated on 100M+ users) |
| **Duplicates** | Index everything | Prediction Error Gating (4-tier thresholds) |
| **Ranking** | Score order | MMR diversity reranking with lambda-intent mapping |

---

### By The Numbers

| Category | Count |
| --- | --- |
| **MCP Tools** | 25 |
| **Library Modules** | 76 |
| **Handler Modules** | 19 |
| **Embedding Providers** | 3 |
| **Feature Flags** | 16 (all default enabled; explicit `FLAG=false` disables) |
| **Test Coverage** | 164 test files |
| **Last Verified** | 2026-02-21 |

### Requirements

| Requirement | Minimum | Recommended |
| --- | --- | --- |
| Node.js | 18.0.0 | 20+ |
| npm | 9+ | 10+ |

---

<!-- /ANCHOR:overview -->

## 2. QUICK START
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
# Expected: file exists after running tsc

# Run full test suite
npx vitest run
# Expected: tests passing across 164 files
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

## 3. ARCHITECTURE
<!-- ANCHOR:architecture -->

### Entry Point to Handler Flow

```
context-server.ts          (server init, startup, shutdown, main orchestration)
        |
        v
tool-schemas.ts            (TOOL_DEFINITIONS — all 25 tool schemas)
        |
        v
tools/index.ts             (dispatchTool — routes call to correct handler)
        |
        +-------+-------+-------+-------+-------+-------+-------+-------+
        |       |       |       |       |       |       |       |       |
  memory-  memory-  memory-  memory- memory-  check-  session- memory-  causal-
  search   triggers  save   context   index   points  learning  crud    graph
        |
        v
lib/                       (76 library modules — search, cognitive, storage, etc.)
        |
        v
dist/context-server.js     (compiled output — executed at runtime by node)
```

### Key Entry Points

| File | Purpose |
| --- | --- |
| `context-server.ts` | Server init, stdio transport, startup/shutdown lifecycle |
| `tool-schemas.ts` | All 25 tool schema definitions (decomposed from server in T303) |
| `cli.ts` | CLI entry point for maintenance commands (stats, bulk-delete, reindex, schema-downgrade) |
| `tools/index.ts` | `dispatchTool()` — routes MCP call to handler module |
| `core/config.ts` | Path resolution (`SERVER_DIR`, `LIB_DIR`, `SHARED_DIR`) |
| `core/db-state.ts` | Database connection state shared across handlers |

### Directory Map

| Directory | Purpose |
| --- | --- |
| `handlers/` | 19 handler modules (functional + infrastructure) |
| `lib/` | 76 library modules (cognitive, search, scoring, storage, etc.) |
| `tools/` | Tool registration wrappers per category |
| `core/` | Initialization, config, database state |
| `formatters/` | Search result and token-metric formatting |
| `scripts/` | CLI utilities |
| `tests/` | 164 test files |
| `dist/` | Compiled JavaScript output (runtime target) |

---

<!-- /ANCHOR:architecture -->

## 4. MCP TOOLS
<!-- ANCHOR:mcp-tools -->

### Tool Categories

| Category | Tools | Purpose |
| --- | --- | --- |
| **Orchestration** | 1 | Unified entry point with intent-aware routing |
| **Search and Retrieval** | 4 | Find and match memories |
| **CRUD Operations** | 6 | Create, update, delete, validate, and bulk-delete |
| **Checkpoints** | 4 | State snapshots for recovery |
| **Session Learning** | 3 | Knowledge tracking across tasks |
| **Causal and Drift** | 6 | Causal graph, skill-graph traversal, and cache management |
| **System** | 1 | Health monitoring |

### Orchestration Tools

| Tool | Purpose | Latency |
| --- | --- | --- |
| `memory_context` | Unified entry with intent-aware routing (L1 Orchestration). START HERE for most retrieval tasks | ~500ms |

### Search and Retrieval Tools

| Tool | Purpose | Latency |
| --- | --- | --- |
| `memory_search` | Semantic vector search with 4-channel hybrid pipeline and adaptive RRF fusion | ~500ms |
| `memory_match_triggers` | Fast trigger phrase matching with cognitive features | <50ms |
| `memory_list` | Browse memories with pagination | <50ms |
| `memory_stats` | System statistics and folder rankings | <10ms |

### CRUD Tools

| Tool | Purpose | Latency |
| --- | --- | --- |
| `memory_save` | Index a single memory file | ~1s |
| `memory_index_scan` | Bulk scan and index workspace (5-source pipeline, incremental) | varies |
| `memory_update` | Update metadata, tier, triggers | <50ms* |
| `memory_delete` | Delete by ID or spec folder | <50ms |
| `memory_bulk_delete` | Bulk delete by tier with checkpoint safety gates. Supports `skipCheckpoint` for non-critical tiers | <100ms + checkpoint |
| `memory_validate` | Record validation feedback | <50ms |

*+~400ms if title changed (triggers embedding regeneration)

### Checkpoint Tools

| Tool | Purpose | Latency |
| --- | --- | --- |
| `checkpoint_create` | Create named state snapshot | <100ms |
| `checkpoint_list` | List available checkpoints | <50ms |
| `checkpoint_restore` | Restore from checkpoint | varies |
| `checkpoint_delete` | Delete a checkpoint | <50ms |

### Session Learning Tools

| Tool | Purpose | Latency |
| --- | --- | --- |
| `task_preflight` | Capture epistemic baseline before task | <50ms |
| `task_postflight` | Capture state after task, calculate learning delta | <50ms |
| `memory_get_learning_history` | Get learning history with trends | <50ms |

### Causal and Drift Tools

| Tool | Purpose | Latency |
| --- | --- | --- |
| `memory_drift_why` | Trace causal chain for decision lineage | varies |
| `memory_causal_link` | Create causal relationships between memories | <50ms |
| `memory_causal_stats` | Graph statistics and coverage metrics | <50ms |
| `memory_causal_unlink` | Remove causal relationships | <50ms |
| `memory_skill_graph_query` | Query skill dependency graph with tiered traversal | <100ms |
| `memory_skill_graph_invalidate` | Force-clear cached skill graph for immediate consistency | <10ms |

### System Tools

| Tool | Purpose | Latency |
| --- | --- | --- |
| `memory_health` | Check health status of the memory system | <10ms |

---

### Causal Relationship Types

The causal graph supports 6 relationship types for tracing decision history:

| Relation | Meaning |
| --- | --- |
| `caused` | A directly led to B |
| `enabled` | A made B possible without directly causing it |
| `supersedes` | A replaces B as the current truth |
| `contradicts` | A and B are mutually incompatible |
| `derived_from` | A was built upon or derived from B |
| `supports` | A provides evidence or support for B |

---

### 7-Layer MCP Architecture

| Layer | Name | Token Budget | Tools |
| --- | --- | --- | --- |
| L1 | Orchestration | 2000 | `memory_context` |
| L2 | Core | 1500 | `memory_search`, `memory_match_triggers`, `memory_save` |
| L3 | Discovery | 800 | `memory_list`, `memory_stats`, `memory_health` |
| L4 | Mutation | 500 | `memory_delete`, `memory_bulk_delete`, `memory_update`, `memory_validate` |
| L5 | Lifecycle | 600 | `checkpoint_create`, `checkpoint_list`, `checkpoint_restore`, `checkpoint_delete` |
| L6 | Analysis | 1200 | `task_preflight`, `task_postflight`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`, `memory_skill_graph_query`, `memory_skill_graph_invalidate` |
| L7 | Maintenance | 1000 | `memory_index_scan`, `memory_get_learning_history` |

---

<!-- /ANCHOR:mcp-tools -->

## 5. SEARCH SYSTEM
<!-- ANCHOR:search-system -->

### 4-Channel Hybrid Search Pipeline

Specs 137, 138 (hybrid-rag-fusion) and 139 expanded the pipeline from 3 to 4 primary retrieval channels with a scatter-gather architecture. Post-fusion enhancements (RRF, Adaptive Fusion, MMR, Co-activation, Recency Boost) are applied after retrieval and are not counted as separate channels:

```
Query
   |
   v
+------------------+
|  INTENT DETECT   |  (auto-detects: add_feature, fix_bug, refactor,
|  + ARTIFACT      |   security_audit, understand, find_spec, find_decision)
|  ROUTING         |  (9 artifact classes with per-type strategies)
+--------+---------+
         |
         v
+----------+----------+----------+----------+
| VECTOR   | FTS5     | BM25     | SKILL    |
| 1024d    | Full-    | Keyword  | GRAPH    |
| (1.0x)   | text     | ranking  | (1.5x)  |
+----+-----+----+-----+----+-----+----+-----+
     |          |          |          |
     +----------+----------+----------+
                     |
                     v
       +-------------+-------------+
       |  ADAPTIVE RRF FUSION      |
       |  k=60, +10% convergence   |
       |  intent-weighted profiles  |
       +-------------+-------------+
                                |
                                v
       +-------------+-------------+
       |  POST-FUSION ENHANCEMENTS  |
       |  Co-activation (+0.25)     |
       |  Session/Recency Boost     |
       |  Causal 2-hop boost        |
       +-------------+-------------+
                     |
                     v
       +-------------+-------------+
       |  MMR DIVERSITY RERANKING  |
       |  lambda mapped to intent  |
       +-------------+-------------+
                     |
                     v
       +-------------+-------------+
       |  EVIDENCE GAP DETECTION   |
       |  TRM with Z-score confidence|
       +-------------+-------------+
                     |
                     v
              Final Ranked Results
```

### Channel Descriptions

| Channel | Source | Weight | Purpose |
| --- | --- | --- | --- |
| Vector | `sqlite-vec` 1024d embeddings | 1.0x | Semantic similarity |
| FTS5 | SQLite full-text search | 1.0x | Full-text lexical matching |
| BM25 | SQLite FTS5 BM25 ranking | 1.0x | Keyword relevance scoring |
| Skill Graph | Graph traversal (causal + skill) | 1.5x | Decision lineage and "why" queries |

### Post-Fusion Enhancements

These processing stages are applied after the 4 primary channels are fused via RRF. They boost or rerank results but are not independent search channels:

| Enhancement | Source | Effect | Purpose |
| --- | --- | --- | --- |
| Co-activation | Working memory patterns | +0.25 boost | Related memory surfacing |
| Recency Boost | `working_memory` table | Hard cap 0.20 | Session context recency |
| Causal 2-hop | Causal edge traversal | Injected | Transitively related memories |

### Adaptive RRF Fusion

When `SPECKIT_ADAPTIVE_FUSION=true` (default enabled), standard fixed-weight RRF is replaced with intent-aware weighted RRF. Fusion weights shift dynamically based on detected query intent:

| Intent | Vector Weight | BM25 Weight | Graph Weight |
| --- | --- | --- | --- |
| `add_feature` | 1.2x | 0.8x | 1.0x |
| `fix_bug` | 0.8x | 1.4x | 1.2x |
| `understand` | 1.4x | 0.7x | 1.0x |
| `find_decision` | 0.8x | 0.9x | 1.8x |
| `security_audit` | 1.1x | 1.1x | 1.3x |

### Multi-Query RAG Fusion

The `memory_context` tool expands queries using domain vocabulary before scatter-gather. Multiple query variants are fused using RRF, improving recall for domain-specific terminology.

### MMR Diversity Reranking

Maximum Marginal Relevance reranking balances relevance with diversity in the result set. The lambda parameter maps to the detected intent:

- Exploratory intents (`understand`, `find_spec`): lower lambda (more diversity)
- Targeted intents (`fix_bug`, `find_decision`): higher lambda (more relevance)

### Evidence Gap Detection

The Token Relevance Monitor (TRM) applies Z-score confidence scoring to detect when retrieved memories do not adequately cover the query context. Gaps surface as advisory hints in the response.

### ANCHOR Format (93% Token Savings)

Memory files use ANCHOR markers for section-level retrieval:

```markdown
<!-- ANCHOR: decisions -->
## Authentication Decision
We chose JWT with refresh tokens because stateless auth scales better.
<!-- /ANCHOR: decisions -->
```

**Coverage**: 533 anchor tags across 78 skill READMEs.

**Token comparison**:
- Full document: ~3000 tokens
- Summary anchor only: ~200 tokens
- Savings: 93%

### Large-File Anchor Chunking

Files exceeding 50,000 characters are automatically split into smaller chunks for embedding. The chunker (`lib/chunking/anchor-chunker.ts`) uses ANCHOR tags as natural boundaries when present, falling back to structure-aware markdown splitting otherwise.

| Parameter | Value |
| --- | --- |
| Chunking threshold | 50,000 characters |
| Target chunk size | ~4,000 characters (~1,000 tokens) |
| Max chunk size | 12,000 characters (hard cap) |

Each chunk is indexed as a child record linked to a parent via `parent_id`. Search results from chunked files include metadata: `isChunk`, `parentId`, `chunkIndex`, `chunkLabel` and `chunkCount`. When `includeContent: true` is set, child chunks are reassembled into full content automatically.

---

<!-- /ANCHOR:search-system -->

## 6. COGNITIVE MEMORY
<!-- ANCHOR:cognitive-memory -->

This is not basic memory storage. The system implements biologically-inspired cognitive features that go well beyond simple retrieval.

### FSRS Power-Law Decay with Tier-Based Modulation

Memory strength follows the Free Spaced Repetition Scheduler formula, validated on 100M+ Anki users. Specs 137-139 added tier-based decay modulation so importance tier also gates how fast memories fade:

```
R(t, S) = (1 + (19/81) * t/S)^(-0.5)    where R(S,S) = 0.9
```

Where `R(t, S)` = retrievability at time t with stability S. Higher importance tiers receive a stability multiplier, slowing their decay independent of access patterns.

### 5-State Memory Model

| State | Retrievability | Content Returned | Max Items | Behavior |
| --- | --- | --- | --- | --- |
| **HOT** | R >= 0.80 | Full content | 5 | Active working memory, top priority |
| **WARM** | 0.25 <= R < 0.80 | Summary only | 10 | Accessible background context |
| **COLD** | 0.05 <= R < 0.25 | None | — | Inactive but retrievable on demand |
| **DORMANT** | 0.02 <= R < 0.05 | None | — | Very weak, needs explicit revival |
| **ARCHIVED** | R < 0.02 or 90d+ | None | — | Time-based archival, effectively forgotten |

### Type-Specific Half-Lives

| Memory Type | Half-Life | Example |
| --- | --- | --- |
| **constitutional** | Never | "Never edit without reading first" |
| **procedural** | 90+ days | "How to deploy to production" |
| **semantic** | 60 days | "RRF stands for Reciprocal Rank Fusion" |
| **contextual** | 30 days | "Auth module uses JWT" |
| **episodic** | 14 days | "Fixed bug XYZ on Tuesday" |
| **working** | 1 day | "Currently debugging auth flow" |
| **temporary** | 4 hours | "Testing this config" |
| **debug** | 1 hour | "Stack trace from crash" |
| **scratch** | Session | "Rough notes" |

### Prediction Error Gating

Prevents duplicate memories from polluting the index:

| Similarity | Category | Action |
| --- | --- | --- |
| >= 0.95 | DUPLICATE | Block save, reinforce existing |
| 0.90-0.94 | HIGH_MATCH | Check for contradiction. UPDATE or SUPERSEDE |
| 0.70-0.89 | MEDIUM_MATCH | Create with link to related memory |
| 0.50-0.69 | LOW_MATCH | Create new, note similarity |
| < 0.50 | UNIQUE | Create new memory normally |

### 5-Source Indexing Pipeline

`memory_index_scan` categorizes discovered files into five sources:

| Source | Path Pattern | Weight |
| --- | --- | --- |
| Constitutional rules | `.opencode/skill/*/constitutional/*.md` | Per-file metadata |
| Spec documents | `.opencode/specs/**/*.md` | Per-type multiplier |
| Spec memories | `specs/**/memory/*.{md,txt}` | 0.5 |
| Project READMEs | `**/README.{md,txt}` (excl. node_modules) | 0.4 |
| Skill READMEs | `.opencode/skill/*/README.{md,txt}` | 0.3 |

---

<!-- /ANCHOR:cognitive-memory -->

## 7. STRUCTURE
<!-- ANCHOR:structure -->

```
mcp_server/
├── context-server.ts       # Main MCP server entry point (25 tools) [source]
├── tool-schemas.ts         # All 25 tool schema definitions
├── cli.ts                  # CLI entry point (stats, bulk-delete, reindex, schema-downgrade)
├── package.json            # @spec-kit/mcp-server v1.7.2
├── tsconfig.json           # TypeScript config (outDir: ./dist)
├── vitest.config.ts        # Vitest test configuration
├── startup-checks.ts       # Startup validation
├── README.md               # This file
│
├── core/                   # Core initialization
│   ├── index.ts            # Core exports
│   ├── config.ts           # Path resolution (SERVER_DIR, LIB_DIR, SHARED_DIR)
│   └── db-state.ts         # Database connection state
│
├── handlers/               # MCP tool handlers (19 modules)
│   ├── index.ts            # Handler aggregator
│   ├── types.ts            # Shared handler types
│   ├── memory-search.ts    # memory_search + Testing Effect
│   ├── memory-triggers.ts  # memory_match_triggers + cognitive
│   ├── memory-save.ts      # memory_save + PE gating
│   ├── memory-crud.ts      # stable CRUD facade + compatibility aliases
│   ├── memory-crud-delete.ts # memory_delete
│   ├── memory-crud-update.ts # memory_update
│   ├── memory-crud-list.ts   # memory_list
│   ├── memory-crud-stats.ts  # memory_stats
│   ├── memory-crud-health.ts # memory_health
│   ├── memory-crud-utils.ts  # CRUD shared helper utilities
│   ├── memory-crud-types.ts  # CRUD argument and helper types
│   ├── memory-bulk-delete.ts # memory_bulk_delete + skipCheckpoint
│   ├── memory-index.ts     # memory_index_scan + 5-source pipeline
│   ├── checkpoints.ts      # checkpoint_create/list/restore/delete + memory_validate
│   ├── session-learning.ts # preflight/postflight/learning history
│   ├── memory-context.ts   # memory_context + unified entry
│   ├── causal-graph.ts     # causal_link/unlink/stats/drift_why
│   └── sgqs-query.ts       # memory_skill_graph_query + memory_skill_graph_invalidate
│
├── hooks/                  # MCP lifecycle hooks
│   ├── index.ts            # Hook exports
│   └── memory-surface.ts   # Memory surfacing hook
│
├── lib/                    # Library modules (76 total)
│   ├── architecture/       # Layer definitions, tool-to-layer mapping (1)
│   ├── cache/              # Tool result caching + nested cognitive/ and scoring/ (2)
│   ├── chunking/           # Anchor-aware large-file chunker (50K threshold) (1)
│   ├── cognitive/          # FSRS, PE gating, 5-state model, co-activation, rollout policy (10)
│   ├── config/             # Memory types, type inference, skill-ref config (3)
│   ├── contracts/          # ContextEnvelope, RetrievalTrace, DegradedModeContract (1)
│   ├── errors/             # Core errors, recovery hints (49 codes) (3)
│   ├── extraction/         # Extraction adapter, redaction gate (2)
│   ├── interfaces/         # Vector store interface (1)
│   ├── learning/           # Corrections tracking (2)
│   ├── manage/             # PageRank scoring (1)
│   ├── parsing/            # Memory parser, trigger matcher, entity scope (3)
│   ├── providers/          # Embedding providers, retry manager (2)
│   ├── response/           # MCP response envelope helpers (1)
│   ├── scoring/            # Composite scoring, importance tiers, folder scoring (4)
│   ├── search/             # Vector, BM25, RRF, adaptive fusion, MMR, causal boost, graph search (22)
│   ├── session/            # Session deduplication (1)
│   ├── storage/            # SQLite, causal edges, mutation ledger, incremental index, schema downgrade (9)
│   ├── telemetry/          # 4-dimension retrieval telemetry (1)
│   ├── utils/              # Format helpers, path security, retry, logger (4)
│   └── validation/         # Pre-flight validation (1)
│
├── tools/                  # Tool registration wrappers
│   ├── index.ts            # dispatchTool() aggregator
│   ├── memory-tools.ts     # Memory tool registrations
│   ├── context-tools.ts    # Context tool registrations
│   ├── lifecycle-tools.ts  # Lifecycle tool registrations
│   ├── checkpoint-tools.ts # Checkpoint tool registrations
│   └── causal-tools.ts     # Causal tool registrations
│
├── formatters/             # Output formatting
│   ├── search-results.ts   # Format search results
│   └── token-metrics.ts    # Token estimation
│
├── tests/                  # Test suite (164 test files)
├── dist/                   # Compiled JavaScript output (generated via tsc)
│   └── context-server.js   # Runtime entry point
├── database/               # SQLite database storage
│   └── context-index.sqlite
└── configs/                # Configuration files
    └── search-weights.json
```

> **Note:** All source files are TypeScript (`.ts`). The compiler outputs to `dist/` via `outDir: "./dist"` in `tsconfig.json`. At runtime, `node` executes `dist/context-server.js`. The `__dirname` in `config.ts` resolves to `dist/core/`, so `SERVER_DIR = path.join(__dirname, '..')` reaches `dist/` and `LIB_DIR = path.join(__dirname, '..', 'lib')` reaches `dist/lib/`.

---

<!-- /ANCHOR:structure -->

## 8. CONFIGURATION
<!-- ANCHOR:configuration -->

### Environment Variables

| Variable | Default | Description |
| --- | --- | --- |
| `MEMORY_DB_PATH` | `./dist/database/context-index.sqlite` | Database location |
| `MEMORY_BASE_PATH` | CWD | Workspace root for memory files |
| `DEBUG_TRIGGER_MATCHER` | `false` | Enable verbose trigger logs |

### Embedding Providers

| Variable | Required | Description |
| --- | --- | --- |
| `EMBEDDINGS_PROVIDER` | No | Force: `voyage`, `openai` or `hf-local` |
| `VOYAGE_API_KEY` | For Voyage | Voyage AI API key (1024d, recommended) |
| `OPENAI_API_KEY` | For OpenAI | OpenAI API key (1536d/3072d) |

**Auto-detection priority:** `EMBEDDINGS_PROVIDER` env > `VOYAGE_API_KEY` detected > `OPENAI_API_KEY` detected > HuggingFace local (768d, default fallback)

### Feature Flags

All flags are evaluated via `isFeatureEnabled()`. After specs 137-139, the flags below default to enabled:

| Flag | Default | Description |
| --- | --- | --- |
| `SPECKIT_RRF` | `true` | Enable RRF search fusion |
| `SPECKIT_MMR` | `true` | Enable MMR diversity reranking |
| `SPECKIT_TRM` | `true` | Enable Transparent Reasoning Module (evidence-gap detection) |
| `SPECKIT_MULTI_QUERY` | `true` | Enable multi-query expansion for deep-mode retrieval |
| `SPECKIT_CROSS_ENCODER` | `true` | Enable cross-encoder reranking when a provider is configured (set `false` to disable) |
| `SPECKIT_RELATIONS` | `true` | Enable causal memory graph |
| `SPECKIT_INDEX_SPEC_DOCS` | `true` | Enable spec folder document indexing |
| `SPECKIT_INDEX_SKILL_REFS` | `true` | Enable skill reference/assets directory indexing |
| `SPECKIT_EXTENDED_TELEMETRY` | `true` | Enable 4-dimension retrieval telemetry |
| `SPECKIT_CAUSAL_BOOST` | `true` | Enable 2-hop causal-neighbor score boost |
| `SPECKIT_SESSION_BOOST` | `true` | Enable session-attention score boost |
| `SPECKIT_ADAPTIVE_FUSION` | `true` | Enable intent-aware weighted RRF fusion |
| `SPECKIT_GRAPH_UNIFIED` | `true` | Unified graph search bridging causal + skill graph |
| `SPECKIT_GRAPH_MMR` | `true` | MMR diversity reranking for graph results |
| `SPECKIT_GRAPH_AUTHORITY` | `true` | Authority scoring in graph traversal |
| `SPECKIT_PRESSURE_POLICY` | `true` | Enable token-pressure mode override in `memory_context` (set `false` to disable) |

### Database Schema

| Table | Purpose |
| --- | --- |
| `memory_index` | Memory metadata (title, tier, triggers, document_type, spec_level) |
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
| `schema_version` | Database schema version tracking |

**v16 chunking columns** (added to `memory_index`):

| Column | Purpose |
| --- | --- |
| `parent_id` | Links chunk to parent record |
| `chunk_index` | Ordering within parent |
| `chunk_label` | Human-readable chunk description |

### Dependencies

| Dependency | Version | Purpose |
| --- | --- | --- |
| `@modelcontextprotocol/sdk` | ^1.24.3 | MCP protocol |
| `@huggingface/transformers` | ^3.8.1 | Local embeddings |
| `better-sqlite3` | ^12.6.2 | SQLite database |
| `sqlite-vec` | ^0.1.7-alpha.2 | Vector similarity search |
| `zod` | ^4.1.12 | Schema validation |

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

When chunked files are indexed, `includeContent: true` now reassembles child chunks into full content from indexed `content_text` values. Each result can include:
- `isChunk`
- `parentId`
- `chunkIndex`
- `chunkLabel`
- `chunkCount`
- `contentSource` (`reassembled_chunks` or `file_read_fallback`)

```typescript
memory_search({
  query: "large file summary",
  includeContent: true
})
// Chunked hits return reassembled content + chunk metadata.
// includeContent: false keeps metadata-only behavior.
```

### Intent-Aware Context

```typescript
// Get context optimized for debugging
memory_context({
  input: "debugging auth issues",
  mode: "focused",
  intent: 'fix_bug'
})
// Returns: error logs, recent changes, debug history weighted high
```

### Trace Decision Lineage

```typescript
// Why was this decision made?
memory_drift_why({
  memoryId: 'jwt-auth-decision-123',
  maxDepth: 3
})
// Returns causal chain: causedBy, enabledBy, supersedes
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
// 1. Before starting — capture baseline
task_preflight({
  specFolder: "specs/077-upgrade",
  taskId: "T1",
  knowledgeScore: 40,
  uncertaintyScore: 70,
  contextScore: 50
})

// 2. Do the work

// 3. After completing — measure improvement
task_postflight({
  specFolder: "specs/077-upgrade",
  taskId: "T1",
  knowledgeScore: 85,
  uncertaintyScore: 20,
  contextScore: 90
})
// Result: Learning Index = (45 * 0.4) + (50 * 0.35) + (40 * 0.25) = 45.5
```

### Checkpoint Recovery

```typescript
// Before risky operation
checkpoint_create({
  name: "pre-cleanup",
  metadata: { reason: "Safety before bulk delete" }
})

// Do risky operation
memory_delete({ specFolder: "specs/old-project", confirm: true })

// If something went wrong
checkpoint_restore({ name: "pre-cleanup" })
```

### Common Patterns

| Pattern | Tool Call | When to Use |
| --- | --- | --- |
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

```bash
# Clear the in-project HuggingFace model cache (most common)
rm -rf node_modules/@huggingface/transformers/.cache

# Also clear global HuggingFace cache if needed
rm -rf ~/.cache/huggingface/

# Server re-downloads on next start
```

#### Database Corruption

**Symptom:** `SQLITE_CORRUPT` or search returns no results

```bash
# Delete database
rm .opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite

# Restart MCP server (recreates database), then re-index
memory_index_scan({ force: true })
```

#### Embedding Dimension Mismatch

**Symptom:** `Error: Vector dimension mismatch`

**Cause:** Switched embedding providers mid-project.

```bash
# Delete database (clears old embeddings), then re-index
rm .opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite
memory_index_scan({ force: true })
```

#### Empty Search Results

1. Database empty: run `memory_index_scan({ force: true })`
2. Embedding model not ready: check `memory_health({})` for `embeddingModelReady: true`
3. Query too specific: try broader search terms
4. Wrong specFolder: check `memory_list({})` for available folders

### Quick Fixes

| Problem | Quick Fix |
| --- | --- |
| Empty search results | `memory_index_scan({ force: true })` |
| Slow embeddings | Set `VOYAGE_API_KEY` for faster API embeddings |
| Missing constitutional | Check files in `constitutional/` directory |
| Duplicate detection | Check `memory_conflicts` table for decisions |
| Causal graph empty | Use `memory_causal_link` to create relationships |
| Session not deduplicating | Ensure `session_id` is consistent |

### Feature Flag Rollback

Use this procedure when rollout metrics regress (rank instability, elevated context errors or extraction quality drop):

```bash
# 1. Disable automation flags
SPECKIT_SESSION_BOOST=false
SPECKIT_PRESSURE_POLICY=false
SPECKIT_CAUSAL_BOOST=false
SPECKIT_ADAPTIVE_FUSION=false

# 2. Restart MCP server and run smoke checks
npx vitest run tests/handler-memory-context.vitest.ts

# 3. Re-enable flags one at a time after metrics recover
```

### Diagnostic Commands

```bash
# Check database status
sqlite3 database/context-index.sqlite "SELECT COUNT(*) FROM memory_index;"

# Check schema version
sqlite3 database/context-index.sqlite "PRAGMA user_version;"

# Check memory states (use <> not != in zsh to avoid glob negation)
sqlite3 database/context-index.sqlite "SELECT importance_tier, COUNT(*) FROM memory_index GROUP BY importance_tier;"

# Check causal graph stats
sqlite3 database/context-index.sqlite "SELECT relation, COUNT(*) FROM causal_edges GROUP BY relation;"
```

### CLI Operations (`spec-kit-cli`)

```bash
# Show database stats
node dist/cli.js stats

# Bulk delete with optional checkpoint bypass (non-critical tiers only)
node dist/cli.js bulk-delete --tier temporary --older-than 30 --skip-checkpoint
# --skip-checkpoint is blocked for constitutional/critical tiers

# Reindex with optional eager warmup (lazy warmup is default)
node dist/cli.js reindex --eager-warmup

# Targeted schema downgrade (v16 -> v15 only)
node dist/cli.js schema-downgrade --to 15 --confirm
```

### Run Tests

```bash
# Run full test suite (from mcp_server directory)
npx vitest run
# Expected: tests passing across 164 files

# Run specific test file
npx vitest run tests/fsrs-scheduler.vitest.ts
npx vitest run tests/rrf-fusion.vitest.ts
npx vitest run tests/causal-edges.vitest.ts
```

---

<!-- /ANCHOR:troubleshooting -->

## 11. FAQ
<!-- ANCHOR:faq -->

**Q: Which tool should I call first for most retrieval tasks?**

A: Start with `memory_context`. It routes by intent, applies multi-query RAG fusion and picks the best retrieval path for the query.

**Q: When should I use `memory_search` instead of `memory_context`?**

A: Use `memory_search` when you need direct control over search parameters or want to inspect raw ranked results. Use `memory_context` for all standard retrieval tasks.

**Q: When should I use `memory_match_triggers` instead of `memory_search`?**

A: Use `memory_match_triggers` for fast phrase matching when you already know likely trigger terms. It runs at <50ms and is suitable for Gate 1 context surfacing.

**Q: How do I reduce token usage in responses?**

A: Request focused anchors like `state` and `next-steps`, keep `includeContent` off unless needed and use session deduplication with a stable `sessionId`.

**Q: Do I need a cloud embedding API key?**

A: No. The server falls back to local HuggingFace embeddings when cloud keys are not configured. Voyage AI is recommended for production quality.

**Q: Are all feature flags enabled by default after specs 137-139?**

A: Yes. Flags are default-on and only explicit `FLAG=false` disables them. `SPECKIT_CROSS_ENCODER` is default-on but still requires a configured reranker provider to be active.

---

<!-- /ANCHOR:faq -->

## 12. RELATED RESOURCES
<!-- ANCHOR:related -->

### Parent Documentation

| Document | Location | Purpose |
| --- | --- | --- |
| Skill README | `../README.md` | Complete skill documentation |
| SKILL.md | `../SKILL.md` | Workflow instructions for AI agents |
| Install Guide | `INSTALL_GUIDE.md` | Detailed installation |
| Rollback Runbook | `../references/workflows/rollback-runbook.md` | Feature-flag rollback procedure |

### Related Specs

| Spec | Path | Purpose |
| --- | --- | --- |
| 137 | `specs/003-system-spec-kit/137-*` | Pre-hybrid-RAG search improvements |
| 138 | `specs/003-system-spec-kit/138-hybrid-rag-fusion/` | Hybrid RAG fusion (4-channel pipeline, adaptive RRF, MMR) |
| 139 | `specs/003-system-spec-kit/139-*` | Post-fusion enhancements and phase system |

### Key Library Modules

| Module | Purpose |
| --- | --- |
| `lib/search/hybrid-search.ts` | 4-channel scatter-gather pipeline |
| `lib/search/adaptive-fusion.ts` | Intent-aware weighted RRF fusion |
| `lib/search/rrf-fusion.ts` | RRF algorithm implementation |
| `lib/search/causal-boost.ts` | 2-hop causal-neighbor score boost |
| `lib/search/session-boost.ts` | Session-attention score boost |
| `lib/cognitive/fsrs-scheduler.ts` | FSRS power-law decay algorithm |
| `lib/cognitive/tier-classifier.ts` | 5-state memory classification |
| `lib/cognitive/prediction-error-gate.ts` | Duplicate detection |
| `lib/scoring/composite-scoring.ts` | Multi-factor ranking |
| `lib/storage/causal-edges.ts` | Causal graph storage |
| `lib/storage/mutation-ledger.ts` | Append-only tamper-proof audit trail |
| `lib/telemetry/retrieval-telemetry.ts` | 4-dimension retrieval telemetry |
| `lib/errors/recovery-hints.ts` | 49 error codes with recovery guidance |
| `lib/chunking/anchor-chunker.ts` | Large-file anchor-aware chunking (50K threshold) |
| `lib/architecture/layer-definitions.ts` | 7-layer tool architecture and token budgets |

### External Resources

| Resource | URL |
| --- | --- |
| MCP Protocol Spec | https://modelcontextprotocol.io/ |
| FSRS Algorithm | https://github.com/open-spaced-repetition/fsrs4anki/wiki |
| sqlite-vec | https://github.com/asg017/sqlite-vec |
| Voyage AI | https://www.voyageai.com/ |
| FTS5 Docs | https://www.sqlite.org/fts5.html |
| RRF Paper | https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf |

<!-- /ANCHOR:related -->
