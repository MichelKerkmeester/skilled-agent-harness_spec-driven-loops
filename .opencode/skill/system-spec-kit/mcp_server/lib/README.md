# MCP Server Library

> Core library modules for search, scoring, cognitive memory, and storage.

---

## 1. 📖 OVERVIEW

### What is the MCP Server Library?

The MCP Server Library provides the core functionality for the Spec Kit Memory MCP server. It implements cognitive memory features including semantic search, attention decay, importance scoring, and intelligent context retrieval. These modules work together to provide AI assistants with human-like memory recall and context awareness.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Module Categories | 7 | search, scoring, cognitive, storage, parsing, providers, utils |
| Cognitive Features | 6 | Attention decay, working memory, tier classification, co-activation, temporal contiguity, summary generation |
| Search Methods | 4 | Vector similarity, hybrid search, RRF fusion, reranking |
| Total Modules | 30+ | Organized into domain-specific folders |

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

---

## 2. 🚀 QUICK START

### 30-Second Setup

```javascript
// 1. Import barrel exports
const { search, scoring, cognitive } = require('./lib');

// 2. Or import specific modules
const { VectorIndex } = require('./lib/search/vector-index');
const { calculate_attention_score } = require('./lib/cognitive/attention-decay');

// 3. Initialize modules with database
const db = require('better-sqlite3')('context-index.sqlite');
cognitive.attentionDecay.init(db);
```

### Verify Installation

```javascript
// Check that modules are loaded
const lib = require('./lib');
console.log(Object.keys(lib));
// Expected: ['search', 'scoring', 'cognitive', 'storage', 'parsing', 'providers', 'utils', 'errors', 'channel']
```

### First Use

```javascript
// Example: Perform semantic search
const { search } = require('./lib');
const results = await search.vectorIndex.search_memories('authentication', { limit: 5 });
console.log(`Found ${results.length} relevant memories`);
```

---

## 3. 📁 STRUCTURE

```
lib/
├── search/                     # Search and retrieval
│   ├── vector-index.js         # Vector similarity search with SQLite
│   ├── hybrid-search.js        # Combined semantic + keyword search
│   ├── rrf-fusion.js           # Reciprocal Rank Fusion scoring
│   ├── reranker.js             # Result reranking
│   └── index.js                # Barrel export
│
├── scoring/                    # Ranking and scoring
│   ├── scoring.js              # Base scoring utilities
│   ├── composite-scoring.js    # Multi-factor composite scores
│   ├── folder-scoring.js       # Spec folder ranking
│   ├── importance-tiers.js     # Tier-based importance weights
│   ├── confidence-tracker.js   # Confidence tracking
│   └── index.js                # Barrel export
│
├── cognitive/                  # Cognitive memory features
│   ├── attention-decay.js      # Time-based attention decay
│   ├── working-memory.js       # Session working memory
│   ├── tier-classifier.js      # Content tier classification
│   ├── co-activation.js        # Related memory activation
│   ├── temporal-contiguity.js  # Temporal memory linking
│   ├── summary-generator.js    # Auto-summary generation
│   └── index.js                # Barrel export
│
├── storage/                    # Data persistence
│   ├── access-tracker.js       # Memory access tracking
│   ├── checkpoints.js          # State checkpointing
│   ├── history.js              # History management
│   ├── index-refresh.js        # Index refresh utilities
│   └── index.js                # Barrel export
│
├── parsing/                    # Content parsing
│   ├── memory-parser.js        # Memory file parser
│   ├── trigger-matcher.js      # Trigger phrase matching
│   ├── trigger-extractor.js    # Extract triggers from content
│   ├── entity-scope.js         # Entity scope detection
│   └── index.js                # Barrel export
│
├── providers/                  # External services
│   ├── embeddings.js           # Embedding provider (Voyage AI)
│   ├── retry-manager.js        # API retry logic
│   └── index.js                # Barrel export
│
├── utils/                      # Utilities
│   ├── validators.js           # Input validation and sanitization
│   ├── json-helpers.js         # Safe JSON operations
│   ├── batch-processor.js      # Batch processing with retry
│   └── index.js                # Barrel export
│
├── errors.js                   # Custom error classes
├── channel.js                  # Communication channel
├── index.js                    # Root barrel export
└── README.md                   # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `index.js` | Root barrel export for all lib modules |
| `errors.js` | Custom error classes for error handling |
| `channel.js` | Communication channel for MCP messages |
| `search/vector-index.js` | Core vector similarity search implementation |
| `cognitive/attention-decay.js` | Time-based attention decay calculation |
| `scoring/importance-tiers.js` | Six-tier importance classification system |
| `utils/validators.js` | Input validation and security checks |

---

## 4. ⚡ FEATURES

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

**Attention Decay**: Simulates human-like forgetting over time

```javascript
// Calculate attention score for a memory based on age and importance
const score = cognitive.attentionDecay.calculate_attention_score(
  accessedAt,     // When memory was last accessed
  importanceTier, // Tier: constitutional, critical, important, normal, temporary, deprecated
  baseScore       // Starting relevance score
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
| Constitutional | No | 10.0x | Permanent rules and core principles |
| Critical | No | 5.0x | Essential information, breaking changes |
| Important | No | 2.0x | Significant context, architectural decisions |
| Normal | Yes | 1.0x | Standard information |
| Temporary | Yes (fast) | 0.5x | Session-specific, ephemeral |
| Deprecated | No | 0.1x | Obsolete but preserved |

**Composite Scoring**: Multi-factor ranking for spec folders

```javascript
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

```javascript
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

```javascript
// Find memories with matching trigger phrases
const matches = await parsing.triggerMatcher.match_triggers({
  prompt: 'How does authentication work?',
  threshold: 0.7
});
```

---

## 5. 💡 USAGE EXAMPLES

### Example 1: Semantic Memory Search

```javascript
// Search for memories related to a query
const { search } = require('./lib');

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

### Example 2: Attention Decay Calculation

```javascript
// Calculate how attention decays over time
const { cognitive } = require('./lib');

const lastAccessed = new Date('2025-01-15');
const tier = 'normal';
const baseScore = 0.85;

const decayedScore = cognitive.attentionDecay.calculate_attention_score(
  lastAccessed,
  tier,
  baseScore
);

console.log(`Score after decay: ${decayedScore.toFixed(2)}`);
// Output: Score after decay: 0.68 (example, depends on time elapsed)
```

### Example 3: Hybrid Search with Fusion

```javascript
// Combine semantic and keyword search
const { search } = require('./lib');

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

```javascript
// Process items in batches with automatic retry
const { utils } = require('./lib');

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
| Barrel imports | `const { search, cognitive } = require('./lib');` | Cleaner syntax, multiple modules |
| Direct imports | `const { VectorIndex } = require('./lib/search/vector-index');` | Single module, tree-shaking |
| Init modules | `cognitive.attentionDecay.init(db);` | Modules requiring database |
| Error handling | `try { ... } catch (err) { if (err instanceof errors.ValidationError) ... }` | Specific error types |

---

## 6. 🛠️ TROUBLESHOOTING

### Common Issues

#### Module not found

**Symptom**: `Error: Cannot find module './lib/search'`

**Cause**: Incorrect import path or missing barrel export

**Solution**:
```javascript
// Use correct path relative to your file
const { search } = require('../lib'); // If in parent directory

// Or use absolute path
const path = require('path');
const lib = require(path.join(__dirname, '..', 'lib'));
```

#### Database not initialized

**Symptom**: `Error: [attention-decay] Database reference is required`

**Cause**: Cognitive modules require database initialization before use

**Solution**:
```javascript
const db = require('better-sqlite3')('context-index.sqlite');

// Initialize modules that need database
const { cognitive } = require('./lib');
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
const { providers } = require('./lib');
// Adjust retry settings if needed
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Import errors | Use barrel exports: `require('./lib')` |
| Database errors | Initialize modules: `module.init(db)` |
| API rate limits | Check `VOYAGE_API_KEY` environment variable |
| Validation errors | Check input against `INPUT_LIMITS` in validators |

### Diagnostic Commands

```javascript
// Check module structure
const lib = require('./lib');
console.log('Available modules:', Object.keys(lib));

// Verify database connection
const db = require('better-sqlite3')('context-index.sqlite');
console.log('Tables:', db.prepare('SELECT name FROM sqlite_master WHERE type="table"').all());

// Test embedding provider
const { providers } = require('./lib');
const embedding = await providers.embeddings.get_embedding('test query');
console.log('Embedding dimensions:', embedding.length);
```

---

## 7. 📚 RELATED DOCUMENTS

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

---

*Documentation version: 1.0 | Last updated: 2025-01-21*
