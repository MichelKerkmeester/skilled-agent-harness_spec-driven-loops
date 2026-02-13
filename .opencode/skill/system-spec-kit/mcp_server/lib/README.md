---
title: "MCP Server Library"
description: "Core library modules for search, scoring, cognitive memory, and storage."
trigger_phrases:
  - "mcp library"
  - "lib modules"
  - "cognitive memory"
importance_tier: "normal"
---

# MCP Server Library

> Core library modules for search, scoring, cognitive memory, and storage.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. STRUCTURE](#3--structure)
- [4. FEATURES](#4--features)
- [5. USAGE EXAMPLES](#5--usage-examples)
- [6. TROUBLESHOOTING](#6--troubleshooting)
- [7. RELATED DOCUMENTS](#7--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

## 1. 📖 OVERVIEW
<!-- ANCHOR:overview -->

### What is the MCP Server Library?

The MCP Server Library provides the core functionality for the Spec Kit Memory MCP server. It implements cognitive memory features including semantic search, attention decay, importance scoring, and intelligent context retrieval. These modules work together to provide AI assistants with human-like memory recall and context awareness.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Module Categories | 15+ | search, scoring, cognitive, storage, parsing, providers, utils, session, errors, learning, architecture, embeddings, response, cache, config, validation, interfaces |
| Cognitive Features | 10+ | FSRS scheduler, attention decay, PE gating, working memory, tier classification, co-activation, temporal contiguity, archival manager, causal graph, corrections |
| Search Methods | 7 | Vector similarity, hybrid search, RRF fusion, reranking, BM25 index, cross-encoder, intent classification |
| Total Modules | 50+ | Organized into domain-specific folders |

### Key Features

| Feature | Description |
|---------|-------------|
| **Semantic Search** | Vector-based similarity search with SQLite vector index and hybrid keyword matching |
| **Cognitive Memory** | Human-like memory features including attention decay, working memory, and co-activation |
| **Importance Scoring** | Six-tier importance classification (constitutional, critical, important, normal, temporary, deprecated) |
| **Folder Ranking** | Composite scoring for spec folders based on recency, relevance, and importance |
| **Content Parsing** | Memory file parsing, trigger matching, and entity scope detection |
| **Batch Processing** | Utilities for batch operations, retry logic, and rate limiting |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18+ | 20+ |
| better-sqlite3 | 9+ | Latest |
| Voyage AI API | Required | For embeddings |

<!-- /ANCHOR:overview -->

---

## 2. 🚀 QUICK START
<!-- ANCHOR:quick-start -->

### 30-Second Setup

```typescript
// 1. Import barrel exports from compiled output
import { search, scoring, cognitive } from '@spec-kit/mcp-server/dist/lib';

// 2. Or import specific modules
import { VectorIndex } from '@spec-kit/mcp-server/dist/lib/search/vector-index';
import { calculate_attention_score } from '@spec-kit/mcp-server/dist/lib/cognitive/attention-decay';

// 3. Initialize modules with database
import Database from 'better-sqlite3';
const db = new Database('context-index.sqlite');
cognitive.attentionDecay.init(db);
```

### Verify Installation

```typescript
// Check that modules are loaded
import * as lib from '@spec-kit/mcp-server/dist/lib';
console.log(Object.keys(lib));
// Expected: ['search', 'scoring', 'cognitive', 'storage', 'parsing', 'providers', 'utils', 'errors', 'channel']
```

### First Use

```typescript
// Example: Perform semantic search
import { search } from '@spec-kit/mcp-server/dist/lib';
const results = await search.vectorIndex.search_memories('authentication', { limit: 5 });
console.log(`Found ${results.length} relevant memories`);
```

<!-- /ANCHOR:quick-start -->

---

## 3. 📁 STRUCTURE
<!-- ANCHOR:structure -->

```
lib/                            # TypeScript source files
├── search/                     # Search and retrieval (8 modules)
│   ├── vector-index.ts         # Vector similarity search with SQLite
│   ├── vector-index-impl.ts    # Core vector index implementation
│   ├── hybrid-search.ts        # Combined semantic + keyword search
│   ├── rrf-fusion.ts           # Reciprocal Rank Fusion scoring
│   ├── reranker.ts             # Result reranking
│   ├── bm25-index.ts           # BM25 lexical indexing
│   ├── cross-encoder.ts        # Cross-encoder reranking
│   ├── intent-classifier.ts    # 5 intent types classification
│   └── README.md               # Module documentation
│
├── scoring/                    # Ranking and scoring (4 modules)
│   ├── composite-scoring.ts    # Multi-factor composite scores (5-factor)
│   ├── folder-scoring.ts       # Spec folder ranking
│   ├── importance-tiers.ts     # Tier-based importance weights
│   ├── confidence-tracker.ts   # Confidence tracking
│   └── README.md               # Module documentation
│
├── cognitive/                  # Cognitive memory features (8 modules)
│   ├── attention-decay.ts      # Multi-factor decay with type-specific half-lives
│   ├── fsrs-scheduler.ts       # FSRS algorithm
│   ├── prediction-error-gate.ts # PE gating for duplicates
│   ├── working-memory.ts       # Session working memory
│   ├── tier-classifier.ts      # 5-state memory classification
│   ├── co-activation.ts        # Related memory activation
│   ├── temporal-contiguity.ts  # Temporal memory linking
│   ├── archival-manager.ts     # 5-state archival model
│   └── README.md               # Module documentation
│
├── storage/                    # Data persistence (7 modules)
│   ├── access-tracker.ts       # Memory access tracking
│   ├── checkpoints.ts          # State checkpointing
│   ├── history.ts              # History management
│   ├── index-refresh.ts        # Index refresh utilities
│   ├── causal-edges.ts         # Causal graph storage
│   ├── incremental-index.ts    # Incremental indexing
│   ├── transaction-manager.ts  # Transaction management
│   └── README.md               # Module documentation
│
├── parsing/                    # Content parsing (3 modules)
│   ├── memory-parser.ts        # Memory file parser
│   ├── trigger-matcher.ts      # Trigger phrase matching
│   ├── entity-scope.ts         # Entity scope detection
│   └── README.md               # Module documentation
│
├── providers/                  # External services (2 modules)
│   ├── embeddings.ts           # Embedding provider (Voyage AI)
│   ├── retry-manager.ts        # API retry logic
│   └── README.md               # Module documentation
│
├── session/                    # Session management (1 module)
│   ├── session-manager.ts      # Session deduplication (~1050 lines)
│   └── README.md               # Module documentation
│
├── errors/                     # Error handling (2 modules + barrel)
│   ├── recovery-hints.ts       # 49 error codes with recovery hints
│   ├── core.ts                 # Core error classes
│   └── index.ts                # Barrel export
│
├── learning/                   # Learning system (1 module + barrel)
│   ├── corrections.ts          # Learning from corrections
│   └── index.ts                # Barrel export
│
├── architecture/               # Architecture definitions (1 module)
│   ├── layer-definitions.ts    # 7-layer MCP architecture
│   └── README.md               # Module documentation
│
├── embeddings/                 # Embedding providers (relocated)
│   └── README.md               # Module documentation (provider-chain relocated)
│
├── response/                   # Response formatting (1 module)
│   ├── envelope.ts             # Standardized response envelope
│   └── README.md               # Module documentation
│
├── cache/                      # Caching layer (1 module)
│   ├── tool-cache.ts           # Tool result caching
│   └── README.md               # Module documentation
│
├── config/                     # Configuration (2 modules)
│   ├── memory-types.ts         # Memory type definitions
│   ├── type-inference.ts       # Type inference utilities
│   └── README.md               # Module documentation
│
├── interfaces/                 # TypeScript interfaces (1 module)
│   ├── vector-store.ts         # Vector store interface
│   └── README.md               # Module documentation
│
├── utils/                      # Utilities (4 modules)
│   ├── format-helpers.ts       # Format utilities
│   ├── logger.ts               # Logging utilities
│   ├── path-security.ts        # Path validation and security
│   ├── retry.ts                # Retry utilities
│   └── README.md               # Module documentation
│
├── validation/                 # Input validation (1 module)
│   ├── preflight.ts            # Preflight checks
│   └── README.md               # Module documentation
│
├── errors.ts                   # Custom error classes (legacy)
└── README.md                   # This file

Compiled output location:
dist/lib/                       # Compiled JavaScript + type definitions
├── [same structure as lib/]
├── *.js                        # Compiled JavaScript
├── *.d.ts                      # TypeScript declarations
└── *.js.map                    # Source maps
```

### Key Files

| File | Purpose |
|------|---------|
| `errors.ts` | Custom error classes for error handling (legacy) |
| `search/vector-index.ts` | Core vector similarity search with RRF fusion |
| `search/vector-index-impl.ts` | Core vector index implementation |
| `search/reranker.ts` | Result reranking |
| `search/bm25-index.ts` | BM25 lexical search indexing |
| `search/cross-encoder.ts` | Cross-encoder semantic reranking |
| `search/intent-classifier.ts` | 5 intent types classification |
| `cognitive/attention-decay.ts` | Multi-factor decay with type-specific half-lives |
| `cognitive/fsrs-scheduler.ts` | FSRS power-law forgetting curve algorithm |
| `cognitive/prediction-error-gate.ts` | Four-tier similarity gating to prevent duplicates |
| `cognitive/archival-manager.ts` | 5-state archival model |
| `cognitive/temporal-contiguity.ts` | Temporal memory linking |
| `session/session-manager.ts` | Session deduplication (~1050 lines) |
| `errors/recovery-hints.ts` | 49 error codes with recovery hints |
| `storage/causal-edges.ts` | Causal graph storage (6 relationships) |
| `storage/history.ts` | History management |
| `storage/index-refresh.ts` | Index refresh utilities |
| `learning/corrections.ts` | Learning from corrections |
| `scoring/importance-tiers.ts` | Six-tier importance classification system |
| `parsing/entity-scope.ts` | Entity scope detection |
| `utils/retry.ts` | Retry utilities |
| `utils/logger.ts` | Logging utilities |
| `validation/preflight.ts` | Input validation and security checks |

<!-- /ANCHOR:structure -->

---

## 4. ⚡ FEATURES
<!-- ANCHOR:features -->

### Search & Retrieval

**Vector Index**: Semantic similarity search using Voyage AI embeddings

| Aspect | Details |
|--------|---------|
| **Purpose** | Find memories by semantic meaning, not just keywords |
| **Usage** | `search.vectorIndex.search_memories(query, options)` |
| **Options** | `limit`, `threshold`, `specFolder`, `anchors` |

**Hybrid Search**: Combines semantic and keyword search for better recall

| Aspect | Details |
|--------|---------|
| **Purpose** | Leverage both semantic understanding and exact keyword matches |
| **Usage** | `search.hybridSearch.search(query, options)` |
| **Fusion** | Uses Reciprocal Rank Fusion (RRF) to merge results |

### Cognitive Features

**FSRS Power-Law Decay**: Research-backed forgetting curve using formula R(t,S) = (1 + (19/81) x t/S)^(-0.5) where 19/81 ~ 0.2346

```typescript
// Calculate retrievability using FSRS algorithm
import { cognitive } from '@spec-kit/mcp-server/dist/lib';

const retrievability = cognitive.fsrsScheduler.calculate_retrievability(
  lastAccessTimestamp, // When memory was last accessed
  stability            // Memory stability (days) - higher = slower decay
);

// Memory states based on retrievability:
// HOT (R >= 0.80)      - Active working memory, full content
// WARM (0.25 <= R < 0.80) - Accessible background, summary only
// COLD (0.05 <= R < 0.25) - Inactive but retrievable
// DORMANT (0.02 <= R < 0.05) - Very weak, needs revival
// ARCHIVED (R < 0.02)  - Effectively forgotten, time-based archival
```

**Retrievability Calculation Priority** (tier-classifier.ts):

The tier classifier uses this priority order when calculating retrievability:

1. **Pre-computed `retrievability`** - If memory has a numeric `retrievability` field, use it directly (highest priority)
2. **FSRS calculation** - If timestamps exist (`last_review`, `lastReview`, `updated_at`, or `created_at`), calculate using FSRS formula
3. **Stability fallback** - If only `stability` exists but no timestamps, use `min(1, stability / 10)`
4. **Attention score fallback** - If `attentionScore` exists, use it directly
5. **Default** - Returns 0 if no data available

**Prediction Error Gating**: Prevents duplicate memories using three-tier similarity thresholds

```typescript
// Check if new memory is too similar to existing memories
const isDuplicate = await cognitive.predictionErrorGate.is_duplicate(
  newContent,         // New memory content
  existingMemories,   // Array of existing memories in same folder
  {
    tier1Threshold: 0.95,  // Near-identical threshold (BLOCK)
    tier2Threshold: 0.90,  // High similarity (WARN)
    tier3Threshold: 0.70,  // Medium similarity (LINK)
    tier4Threshold: 0.50   // Low similarity (NOTE)
  }
);
```

**Testing Effect**: Accessing memories strengthens them (desirable difficulty)

```typescript
// Update stability when memory is accessed
const newStability = cognitive.fsrsScheduler.update_stability(
  currentStability,   // Current memory stability
  grade              // Performance grade (1-4): 1=forgot, 4=easy recall
);
```

**Working Memory**: Manages session-scoped memory activation

| Aspect | Details |
|--------|---------|
| **Purpose** | Track recently accessed memories within a session |
| **Capacity** | Configurable limit (default: 7 items, inspired by Miller's Law) |
| **Decay** | Automatic cleanup of old items based on session boundaries |

**Co-Activation**: Activates related memories together

| Aspect | Details |
|--------|---------|
| **Purpose** | When one memory is retrieved, boost related memories |
| **Mechanism** | Shared spec folders, temporal proximity, entity relationships |
| **Impact** | Improves context coherence across multiple retrievals |

### Scoring & Ranking

**Importance Tiers**: Six-level classification system

| Tier | Decay | Boost | Description |
|------|-------|-------|-------------|
| Constitutional | No | 3.0x | Permanent rules and core principles |
| Critical | No | 2.0x | Essential information, breaking changes |
| Important | No | 1.5x | Significant context, architectural decisions |
| Normal | Yes | 1.0x | Standard information |
| Temporary | Yes (fast) | 0.5x | Session-specific, ephemeral |
| Deprecated | No | 0.0x | Obsolete but preserved |

**Composite Scoring**: Multi-factor ranking for spec folders

```typescript
// Combines recency, relevance, importance, and access patterns
const score = scoring.folderScoring.calculate_folder_score({
  specFolder: 'specs/007-authentication',
  queryRelevance: 0.85,
  lastAccessed: new Date('2025-01-20'),
  importanceTier: 'critical',
  accessCount: 12
});
```

### Storage & Persistence

**Access Tracking**: Records memory access patterns

| Feature | Description |
|---------|-------------|
| Track reads | Records when memories are retrieved |
| Access frequency | Counts how often memories are accessed |
| Recency boost | Recent access increases importance |

**Checkpoints**: Save and restore memory state

```typescript
// Save current state
await storage.checkpoints.save_checkpoint('before-refactor');

// Restore previous state
await storage.checkpoints.restore_checkpoint('before-refactor');
```

### Parsing & Validation

**Memory Parser**: Extracts structured data from markdown memory files

| Feature | Description |
|---------|-------------|
| ANCHOR sections | Parses `<!-- ANCHOR: name -->` blocks |
| Frontmatter | Extracts YAML metadata |
| Entity extraction | Identifies files, functions, concepts |

**Trigger Matcher**: Matches user prompts to memory trigger phrases

```typescript
// Find memories with matching trigger phrases
const matches = await parsing.triggerMatcher.match_triggers({
  prompt: 'How does authentication work?',
  threshold: 0.7
});
```

<!-- /ANCHOR:features -->

---

## 5. 💡 USAGE EXAMPLES
<!-- ANCHOR:examples -->

### Example 1: Semantic Memory Search

```typescript
// Search for memories related to a query
import { search } from '@spec-kit/mcp-server/dist/lib';

const results = await search.vectorIndex.search_memories('authentication flow', {
  limit: 5,
  threshold: 0.7,
  specFolder: 'specs/007-authentication' // Optional: filter by folder
});

console.log(`Found ${results.length} relevant memories`);
results.forEach(r => {
  console.log(`- ${r.title} (score: ${r.score.toFixed(2)})`);
});
```

**Result**: Returns top 5 memories ranked by semantic similarity and importance

### Example 2: FSRS-Based Memory State Calculation

```typescript
// Calculate memory state using FSRS retrievability
import { cognitive } from '@spec-kit/mcp-server/dist/lib';

const lastAccessed = new Date('2025-01-15').getTime();
const stability = 7.0; // Memory stability in days
const now = Date.now();

// Calculate retrievability using FSRS power-law formula
const retrievability = cognitive.fsrsScheduler.calculate_retrievability(
  lastAccessed,
  stability,
  now
);

// Determine memory state (matches 5-state model)
let state: string;
if (retrievability >= 0.80) state = 'HOT';
else if (retrievability >= 0.25) state = 'WARM';
else if (retrievability >= 0.05) state = 'COLD';
else if (retrievability >= 0.02) state = 'DORMANT';
else state = 'ARCHIVED';

console.log(`Retrievability: ${retrievability.toFixed(2)}, State: ${state}`);
// Output: Retrievability: 0.76, State: WARM
```

### Example 3: Hybrid Search with Fusion

```typescript
// Combine semantic and keyword search
import { search } from '@spec-kit/mcp-server/dist/lib';

const results = await search.hybridSearch.search('TODO authentication', {
  limit: 10,
  semanticWeight: 0.6,  // 60% semantic, 40% keyword
  keywordWeight: 0.4
});

// Results are merged using Reciprocal Rank Fusion
results.forEach(r => {
  console.log(`${r.title}: semantic=${r.semanticRank}, keyword=${r.keywordRank}`);
});
```

### Example 4: Batch Processing with Retry

```typescript
// Process items in batches with automatic retry
import { utils } from '@spec-kit/mcp-server/dist/lib';

const items = [/* ... large array ... */];

const results = await utils.process_batches(
  items,
  async (batch) => {
    // Process each batch
    return await processItems(batch);
  },
  {
    batchSize: 50,
    delayMs: 100,
    retryOptions: { maxRetries: 3 }
  }
);
```

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| Barrel imports | `import { search, cognitive } from '@spec-kit/mcp-server/dist/lib';` | Cleaner syntax, multiple modules |
| Direct imports | `import { VectorIndex } from '@spec-kit/mcp-server/dist/lib/search/vector-index';` | Single module, tree-shaking |
| Init modules | `cognitive.attentionDecay.init(db);` | Modules requiring database |
| Error handling | `try { ... } catch (err) { if (err instanceof errors.ValidationError) ... }` | Specific error types |

<!-- /ANCHOR:examples -->

---

## 6. 🛠️ TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

### Common Issues

#### Module not found

**Symptom**: `Error: Cannot find module '@spec-kit/mcp-server/dist/lib/search'`

**Cause**: TypeScript not compiled or incorrect import path

**Solution**:
```typescript
// First, ensure TypeScript is compiled:
// npm run build
// or
// tsc --project tsconfig.json

// Then use correct import from dist/
import { search } from '@spec-kit/mcp-server/dist/lib';

// Or use workspace alias (if configured)
import { search } from '@spec-kit/mcp-server/dist/lib';
```

#### Database not initialized

**Symptom**: `Error: [attention-decay] Database reference is required`

**Cause**: Cognitive modules require database initialization before use

**Solution**:
```typescript
import Database from 'better-sqlite3';
const db = new Database('context-index.sqlite');

// Initialize modules that need database
import { cognitive } from '@spec-kit/mcp-server/dist/lib';
cognitive.attentionDecay.init(db);
cognitive.workingMemory.init(db);
cognitive.coActivation.init(db);
```

#### Embedding API errors

**Symptom**: `Error: Voyage AI API request failed`

**Cause**: Missing API key or rate limit exceeded

**Solution**:
```bash
# Set environment variable
export VOYAGE_API_KEY="your-api-key-here"

# Or check rate limits in retry-manager
import { providers } from '@spec-kit/mcp-server/dist/lib';
// Adjust retry settings if needed
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Import errors | Ensure TypeScript compiled, use: `import from '@spec-kit/mcp-server/dist/lib'` |
| Database errors | Initialize modules: `module.init(db)` |
| API rate limits | Check `VOYAGE_API_KEY` environment variable |
| Validation errors | Check input against `INPUT_LIMITS` in validation/preflight |

### Diagnostic Commands

```typescript
// Check module structure
import * as lib from '@spec-kit/mcp-server/dist/lib';
console.log('Available modules:', Object.keys(lib));

// Verify database connection
import Database from 'better-sqlite3';
const db = new Database('context-index.sqlite');
console.log('Tables:', db.prepare('SELECT name FROM sqlite_master WHERE type="table"').all());

// Test embedding provider
import { providers } from '@spec-kit/mcp-server/dist/lib';
const embedding = await providers.embeddings.get_embedding('test query');
console.log('Embedding dimensions:', embedding.length);
```

<!-- /ANCHOR:troubleshooting -->

---

## 7. 📚 RELATED DOCUMENTS
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [MCP Server README](../README.md) | Overview of the entire MCP server |
| [Handlers Documentation](../handlers/README.md) | MCP tool handlers using lib modules |
| [Tests README](../tests/README.md) | Test suite for lib modules |
| [Utils README](../utils/README.md) | Utility functions documentation |

### Module Documentation

| Module | Purpose |
|--------|---------|
| [Search Modules](./search/) | Vector index, hybrid search, fusion algorithms |
| [Scoring Modules](./scoring/) | Importance tiers, composite scoring, folder ranking |
| [Cognitive Modules](./cognitive/) | Attention decay, working memory, co-activation |
| [Storage Modules](./storage/) | Access tracking, checkpoints, history |
| [Parsing Modules](./parsing/) | Memory parser, trigger matching, entity extraction |

### External Resources

| Resource | Description |
|----------|-------------|
| [Voyage AI Docs](https://docs.voyageai.com/) | Embedding API documentation |
| [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) | SQLite Node.js library |
| [MCP Protocol](https://modelcontextprotocol.io/) | Model Context Protocol specification |

<!-- /ANCHOR:related -->

---

*Documentation version: 1.4 | Last updated: 2026-02-11*
