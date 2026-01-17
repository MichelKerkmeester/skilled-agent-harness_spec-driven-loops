# MCP Server Library

Organized library modules for the Spec Kit Memory MCP server.

## Folder Structure

```
lib/
├── search/                  # Search and retrieval
│   ├── vector-index.js      # Vector similarity search with SQLite
│   ├── hybrid-search.js     # Combined semantic + keyword search
│   ├── rrf-fusion.js        # Reciprocal Rank Fusion scoring
│   ├── reranker.js          # Result reranking
│   └── index.js             # Barrel export
│
├── scoring/                 # Ranking and scoring
│   ├── scoring.js           # Base scoring utilities
│   ├── composite-scoring.js # Multi-factor composite scores
│   ├── folder-scoring.js    # Spec folder ranking
│   ├── importance-tiers.js  # Tier-based importance weights
│   ├── confidence-tracker.js # Confidence tracking
│   └── index.js             # Barrel export
│
├── cognitive/               # Cognitive memory features
│   ├── attention-decay.js   # Time-based attention decay
│   ├── working-memory.js    # Session working memory
│   ├── tier-classifier.js   # Content tier classification
│   ├── co-activation.js     # Related memory activation
│   ├── temporal-contiguity.js # Temporal memory linking
│   ├── summary-generator.js # Auto-summary generation
│   └── index.js             # Barrel export
│
├── storage/                 # Data persistence
│   ├── access-tracker.js    # Memory access tracking
│   ├── checkpoints.js       # State checkpointing
│   ├── history.js           # History management
│   ├── index-refresh.js     # Index refresh utilities
│   └── index.js             # Barrel export
│
├── parsing/                 # Content parsing
│   ├── memory-parser.js     # Memory file parser
│   ├── trigger-matcher.js   # Trigger phrase matching
│   ├── trigger-extractor.js # Extract triggers from content
│   ├── entity-scope.js      # Entity scope detection
│   └── index.js             # Barrel export
│
├── providers/               # External services
│   ├── embeddings.js        # Embedding provider (Voyage AI)
│   ├── retry-manager.js     # API retry logic
│   └── index.js             # Barrel export
│
├── utils/                   # Utilities
│   ├── format-helpers.js    # Formatting utilities
│   ├── token-budget.js      # Token budget management
│   └── index.js             # Barrel export
│
├── errors.js                # Custom error classes
├── channel.js               # Communication channel
└── README.md                # This file
```

## Usage

Import from subfolders or use barrel exports:

```javascript
// Direct import
const { VectorIndex } = require('./lib/search/vector-index');

// Barrel import (when available)
const { VectorIndex } = require('./lib/search');
```

## Module Categories

| Category | Purpose | Key Modules |
|----------|---------|-------------|
| search | Find relevant memories | vector-index, hybrid-search |
| scoring | Rank and prioritize | folder-scoring, composite-scoring |
| cognitive | Memory intelligence | attention-decay, co-activation |
| storage | Persist state | checkpoints, access-tracker |
| parsing | Parse content | memory-parser, trigger-matcher |
| providers | External APIs | embeddings, retry-manager |
| utils | Helpers | format-helpers, token-budget |
