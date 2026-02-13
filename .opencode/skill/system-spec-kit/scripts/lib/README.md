---
title: "Scripts Library"
description: "TypeScript and shell script libraries for CLI utilities including content processing, summarization, and validation."
trigger_phrases:
  - "scripts library"
  - "embeddings library"
  - "anchor generator"
  - "semantic summarizer"
importance_tier: "normal"
---

# Scripts Library

> TypeScript and shell script libraries for CLI utilities including content processing, summarization, and validation.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. ⚡ FEATURES](#4--features)
- [5. 💡 USAGE EXAMPLES](#5--usage-examples)
- [6. 🛠️ TROUBLESHOOTING](#6--troubleshooting)
- [7. 📚 RELATED DOCUMENTS](#7--related-documents)

---

<!-- /ANCHOR:table-of-contents -->
## 1. 📖 OVERVIEW
<!-- ANCHOR:overview -->

### What is the lib/ Directory?

The `lib/` directory contains TypeScript source files and shell script libraries used by `generate-context.ts` and other spec-kit CLI utilities. These modules handle content processing, semantic summarization, and validation output formatting. Source files are compiled to `../dist/lib/` for execution.

### Shared Library Architecture

The following modules are **re-exports** from the shared package:

| Module                 | Canonical Source                     | This Location     |
| ---------------------- | ------------------------------------ | ----------------- |
| `embeddings.ts`        | `@spec-kit/shared/embeddings`        | Re-export wrapper |
| `trigger-extractor.ts` | `@spec-kit/shared/trigger-extractor` | Re-export wrapper |

This consolidation ensures consistent behavior between CLI scripts and MCP server.

```
┌─────────────────────────────────────────────────────────────────┐
│                     SHARED LIB/ ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│    scripts/lib/                       @spec-kit/shared          │
│    ┌─────────────┐                   ┌─────────────┐            │
│    │embeddings.ts│ ──re-export────► │embeddings   │             │
│    │trigger-     │                   │trigger-     │            │
│    │extractor.ts │ ──re-export────► │extractor    │             │
│    └─────────────┘                   │embeddings/  │            │
│        ↓ compile                     └─────────────┘            │
│    dist/lib/*.js                                                │
│                                                                 │
│    Local modules:                                               │
│    anchor-generator.ts, semantic-summarizer.ts, etc.            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Key Statistics

| Category                | Count          | Details                                           |
| ----------------------- | -------------- | ------------------------------------------------- |
| TypeScript Source Files | 10             | Content processing, summarization, formatting     |
| Re-exported Modules     | 2              | embeddings.ts, trigger-extractor.ts               |
| Shell Libraries         | 0              | (none — shell libs are in scripts root and rules/) |
| Embedding Providers     | 3              | Voyage, OpenAI, HF Local (multi-provider support) |
| Compiled Output         | `../dist/lib/` | JavaScript files for execution                    |

### Key Features

| Feature                       | Description                                            |
| ----------------------------- | ------------------------------------------------------ |
| **Multi-Provider Embeddings** | Voyage, OpenAI, HF local with 768/1024/1536 dimensions |
| **Semantic Summarization**    | Extract key points and decisions from conversations    |
| **Anchor Generation**         | Create semantic ANCHOR tags for memory files           |
| **ASCII Formatting**          | Generate boxes, tables, and flowcharts                 |
| **TF-IDF Triggers**           | Advanced trigger phrase extraction (v11)               |

### Requirements

| Requirement          | Minimum | Recommended |
| -------------------- | ------- | ----------- |
| Node.js              | 18+     | 20+         |
| Bash                 | 3.2+    | 5.0+        |
| @xenova/transformers | 2.0+    | Latest      |

---

<!-- /ANCHOR:overview -->
## 2. 🚀 QUICK START
<!-- ANCHOR:quick-start -->

### 30-Second Setup

```typescript
// Import libraries from compiled dist/ output
import { generateEmbedding, getProviderMetadata } from '../dist/lib/embeddings.js';
import { extractTriggerPhrases } from '../dist/lib/trigger-extractor.js';
import { generateAnchor } from '../dist/lib/anchor-generator.js';
import { summarize } from '../dist/lib/semantic-summarizer.js';
```

### Verify Installation

```bash
# Check that TypeScript source files exist
ls .opencode/skill/system-spec-kit/scripts/lib/

# Expected: .ts files
# anchor-generator.ts, embeddings.ts, trigger-extractor.ts, ...

# Check compiled output exists
ls .opencode/skill/system-spec-kit/scripts/dist/lib/

# Expected: Compiled .js files
# anchor-generator.js, embeddings.js, trigger-extractor.js, ...
```

### First Use

```typescript
// Check embedding provider
const meta = getProviderMetadata();
console.log(`Provider: ${meta.provider}, Dimensions: ${meta.dim}`);
// Example: "Provider: voyage, Dimensions: 1024"

// Generate an embedding
const embedding = await generateEmbedding('How does authentication work?');
console.log(`Embedding dimensions: ${embedding.length}`);
// Dimensions depend on provider: 768 (HF), 1024 (Voyage), 1536 (OpenAI)
```

---

<!-- /ANCHOR:quick-start -->
## 3. 📁 STRUCTURE
<!-- ANCHOR:structure -->

```
lib/
├── Re-exported Modules (from @spec-kit/shared)
│   ├── embeddings.ts           # → @spec-kit/shared/embeddings (multi-provider)
│   └── trigger-extractor.ts    # → @spec-kit/shared/trigger-extractor (v11)
│
├── Local TypeScript Modules
│   ├── anchor-generator.ts       # Semantic ANCHOR tag generation
│   ├── content-filter.ts         # Content filtering and cleaning
│   ├── semantic-summarizer.ts    # Conversation summarization
│   ├── retry-manager.ts          # Retry logic for operations
│   ├── ascii-boxes.ts            # ASCII box diagram generation
│   ├── flowchart-generator.ts    # ASCII flowchart generation
│   ├── decision-tree-generator.ts # Decision tree diagram generation
│   └── simulation-factory.ts     # Test data generation
│
├── README.md                     # This file
│
└── Compiled Output: ../dist/lib/
    └── *.js                      # JavaScript files compiled from .ts sources
```

### Key Files

| File                     | Purpose                                                     | Source                            |
| ------------------------ | ----------------------------------------------------------- | --------------------------------- |
| `embeddings.ts`          | Multi-provider embedding generation                         | Re-export from `@spec-kit/shared` |
| `trigger-extractor.ts`   | TF-IDF trigger phrase extraction                            | Re-export from `@spec-kit/shared` |
| `anchor-generator.ts`    | Generate semantic anchors for memory file sections          | Local                             |
| `semantic-summarizer.ts` | Summarize conversations for memory storage                  | Local                             |

---

<!-- /ANCHOR:structure -->
## 4. ⚡ FEATURES
<!-- ANCHOR:features -->

### Re-exported Modules

These modules are re-exports from the shared `../shared/` directory:

#### embeddings.ts (Re-export)

| Feature            | Details                                            |
| ------------------ | -------------------------------------------------- |
| **Providers**      | Voyage AI (recommended), OpenAI, HuggingFace local |
| **Dimensions**     | 768 (HF), 1024 (Voyage), 1536/3072 (OpenAI)        |
| **Auto-Detection** | Selects provider based on API keys                 |
| **Task-Specific**  | Document, query, clustering embeddings             |
| **Source**         | Re-exported from `@spec-kit/shared/embeddings`     |

See [../../shared/README.md](../../shared/README.md) for full documentation.

#### trigger-extractor.ts (Re-export)

| Feature                 | Details                                                    |
| ----------------------- | ---------------------------------------------------------- |
| **Algorithm**           | TF-IDF + N-gram hybrid                                     |
| **Version**             | v11.0.0                                                    |
| **Priority Extraction** | Problem terms (3x), technical terms (2.5x), decisions (2x) |
| **Performance**         | <100ms for typical content (<10KB)                         |
| **Source**              | Re-exported from `@spec-kit/shared/trigger-extractor`      |

See [../../shared/README.md](../../shared/README.md) for full documentation.

---

### Local TypeScript Libraries

#### Core Processing

| File                     | Purpose                       | Key Exports                                  |
| ------------------------ | ----------------------------- | -------------------------------------------- |
| `anchor-generator.ts`    | Generate semantic ANCHOR tags | `generateAnchor()`, `validateAnchorFormat()` |
| `content-filter.ts`      | Filter and clean content      | `filterContent()`, `removeBoilerplate()`     |
| `semantic-summarizer.ts` | Generate semantic summaries   | `summarize()`, `extractKeyPoints()`          |

#### Output & Formatting

| File                         | Purpose                         | Key Exports                                       |
| ---------------------------- | ------------------------------- | ------------------------------------------------- |
| `ascii-boxes.ts`             | Generate ASCII box diagrams     | `createBox()`, `createTable()`                    |
| `flowchart-generator.ts`     | Generate ASCII flowcharts       | `generateFlowchart()`, `parseFlowDefinition()`    |
| `decision-tree-generator.ts` | Generate decision tree diagrams | `generateDecisionTree()`, `parseTreeDefinition()` |

#### Integration

| File                    | Purpose            | Key Exports                                |
| ----------------------- | ------------------ | ------------------------------------------ |
| `simulation-factory.ts` | Generate test data | `createSimulation()`, `mockConversation()` |
| `retry-manager.ts`      | Manage retry logic | `RetryManager`, `processWithRetry()`       |

---

<!-- /ANCHOR:features -->
## 5. 💡 USAGE EXAMPLES
<!-- ANCHOR:examples -->

### Example 1: Generate Embedding (Multi-Provider)

```typescript
import {
  generateDocumentEmbedding,
  generateQueryEmbedding,
  getProviderMetadata
} from '../dist/lib/embeddings.js';

// Check active provider
const meta = getProviderMetadata();
console.log(`Using ${meta.provider} (${meta.dim} dimensions)`);

// For indexing documents
const docEmbedding = await generateDocumentEmbedding('Authentication flow details...');

// For search queries
const queryEmbedding = await generateQueryEmbedding('How does auth work?');
```

**Result**: Float32Array with provider-specific dimensions (768/1024/1536)

---

### Example 2: Extract Trigger Phrases

```typescript
import { extractTriggerPhrases, extractTriggerPhrasesWithStats } from '../dist/lib/trigger-extractor.js';

// Simple extraction
const triggers = extractTriggerPhrases(memoryContent);
console.log(triggers);
// ['memory search', 'trigger extraction', 'problem detection', ...]

// With stats for debugging
const result = extractTriggerPhrasesWithStats(memoryContent);
console.log(result.stats.extractionTimeMs);  // <100ms target
console.log(result.breakdown.problemTerms);   // Count by type
```

**Result**: 8-25 normalized trigger phrases

---

### Example 3: Generate Anchor

```typescript
import { generateAnchor } from '../dist/lib/anchor-generator.js';

const anchor = generateAnchor({
  type: 'implementation',     // decision, research, implementation, etc.
  content: 'OAuth callback handling...',
  specFolder: 'specs/007-auth'
});

// Returns: "implementation-oauth-callback-a3f8b2c1"
```

---

### Example 4: Summarize Conversation

```typescript
import { summarize } from '../dist/lib/semantic-summarizer.js';

const summary = summarize({
  messages: conversationMessages,
  maxLength: 500,
  focusOn: ['decisions', 'implementations']
});
```

---

### Common Patterns

| Pattern            | Code                                      | When to Use          |
| ------------------ | ----------------------------------------- | -------------------- |
| Document embedding | `generateDocumentEmbedding(text)`         | Indexing content     |
| Query embedding    | `generateQueryEmbedding(text)`            | Search queries       |
| Check provider     | `getProviderMetadata()`                   | Debugging, logging   |
| Extract triggers   | `extractTriggerPhrases(text)`             | Memory indexing      |
| Anchor generation  | `generateAnchor({ type, content })`       | Memory file sections |

**Note**: All TypeScript imports must use the compiled output from `../dist/lib/` directory.

---

<!-- /ANCHOR:examples -->
## 6. 🛠️ TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

### Common Issues

#### Provider Not Loading

**Symptom**: `Error: Provider not initialized`

**Cause**: Provider failed to initialize or API key invalid

**Solution**:
```typescript
// Pre-warm the model on startup
import { preWarmModel, getProviderMetadata } from '../dist/lib/embeddings.js';
await preWarmModel();
console.log(getProviderMetadata());  // Check which provider loaded
```

---

#### Dimension Mismatch

**Symptom**: `Error: dimension mismatch (expected 768, got 1024)`

**Cause**: Changed providers without updating database

**Solution**: Per-profile databases should prevent this. Delete old database if needed:
```bash
rm .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite
```

---

#### Slow First Embedding

**Symptom**: First embedding call takes 30+ seconds

**Cause**: HF local downloads ~274MB model on first use

**Solution**:
```typescript
// Pre-warm the model on startup
import { preWarmModel } from '../dist/lib/embeddings.js';
await preWarmModel();  // Call once at startup
```

---

### Diagnostic Commands

```bash
# Check Node.js version
node --version
# Expected: v18.0.0 or higher

# Check environment
echo "VOYAGE_API_KEY: ${VOYAGE_API_KEY:0:10}..."
echo "OPENAI_API_KEY: ${OPENAI_API_KEY:0:10}..."
echo "EMBEDDINGS_PROVIDER: $EMBEDDINGS_PROVIDER"

# Test embedding generation (using compiled output)
node -e "import('../dist/lib/embeddings.js').then(m => m.generateDocumentEmbedding('test')).then(e => console.log('Dims:', e.length))"

# Test trigger extraction (using compiled output)
node -e "import('../dist/lib/trigger-extractor.js').then(m => console.log(m.extractTriggerPhrases('memory search trigger extraction')))"
```

---

<!-- /ANCHOR:troubleshooting -->
## 7. 📚 RELATED DOCUMENTS
<!-- ANCHOR:related -->

### Internal Documentation

| Document                                                               | Purpose                                                                      |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [../../shared/README.md](../../shared/README.md)                       | **Shared package documentation** (canonical source for embeddings, triggers) |
| [../../shared/embeddings/README.md](../../shared/embeddings/README.md) | Embeddings factory detailed docs                                             |
| [generate-context.ts](../memory/generate-context.ts)                   | Main script using these libraries                                            |
| [../../SKILL.md](../../SKILL.md)                                       | Parent skill documentation                                                   |
| [../../mcp_server/lib/](../../mcp_server/lib/)                         | MCP server library modules                                                   |

### External Resources

| Resource                                                                  | Description                        |
| ------------------------------------------------------------------------- | ---------------------------------- |
| [@xenova/transformers](https://github.com/xenova/transformers.js)         | JavaScript ML library for HF local |
| [nomic-embed-text](https://huggingface.co/nomic-ai/nomic-embed-text-v1.5) | Default HF embedding model         |
| [Voyage AI](https://www.voyageai.com/)                                    | Recommended embedding provider     |
| [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)   | OpenAI embedding API docs          |
<!-- /ANCHOR:related -->
