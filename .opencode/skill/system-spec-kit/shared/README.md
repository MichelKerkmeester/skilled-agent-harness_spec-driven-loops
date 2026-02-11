# Shared Library Modules

> Consolidated TypeScript modules shared between CLI scripts and MCP server for embedding generation and trigger extraction. Source files are `.ts`; compiled CommonJS `.js` output is produced in-place.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. ⚡ FEATURES](#4--features)
- [5. ⚙️ CONFIGURATION](#5--configuration)
- [6. 💡 USAGE EXAMPLES](#6--usage-examples)
- [7. 🛠️ TROUBLESHOOTING](#7--troubleshooting)
- [8. 📚 RELATED DOCUMENTS](#8--related-documents)

---

## 1. 📖 OVERVIEW

### What is the shared/ Directory?

The `shared/` directory is the **canonical source** for shared modules used by both:
- **CLI scripts** (`scripts/`) - `generate-context.ts` and other utilities
- **MCP server** (`mcp_server/`) - `context-server.ts` and memory tools

This consolidation eliminates code duplication and ensures consistent behavior across all entry points.

### Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                     SHARED LIB ARCHITECTURE                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│              ┌────────────────────┐                              │
│              │  shared/           │ ◄── CANONICAL SOURCE (.ts)   │
│              │  ├── embeddings.ts │                              │
│              │  ├── chunking.ts   │                              │
│              │  ├── trigger-      │                              │
│              │  │   extractor.ts  │                              │
│              │  └── embeddings/   │ ◄── Provider implementations │
│              └────────────────────┘                              │
│                       ▲                                          │
│           ┌───────────┴───────────────────┐                      │
│           │                               │                      │
│    ┌──────┴──────┐                 ┌──────┴──────┐               │
│    │scripts/lib/ │                 │mcp_server/  │               │
│    │(RE-EXPORTS) │                 │lib/         │               │
│    ├─────────────┤                 │(RE-EXPORTS) │               │
│    │embeddings.ts│                 ├─────────────┤               │
│    │  → import   │                 │embeddings.ts│               │
│    │  from '../../│                │  → import   │               │
│    │   shared/'  │                 │  from '../../│              │
│    └─────────────┘                 │   shared/'  │               │
│                                    └─────────────┘               │
│                                                                  │
│  Note: Source is TypeScript (.ts); compiled output is            │
│  CommonJS (.js) produced in-place via `npm run build`.          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Key Statistics

| Category                 | Count         | Details                                          |
| ------------------------ | ------------- | ------------------------------------------------ |
| Core Modules             | 3             | embeddings.ts, trigger-extractor.ts, chunking.ts |
| Provider Implementations | 3             | OpenAI, HF Local, Voyage                         |
| Embedding Dimensions     | 768/1024/1536 | Provider-dependent                               |

### Key Features

| Feature                         | Description                                                    |
| ------------------------------- | -------------------------------------------------------------- |
| **Multi-Provider Embeddings**   | Supports Voyage, OpenAI, HuggingFace local with auto-detection |
| **Dynamic Dimension Detection** | 768 (HF), 1024 (Voyage), 1536/3072 (OpenAI)                    |
| **Task-Specific Functions**     | Document, query, and clustering embeddings                     |
| **TF-IDF + Semantic Triggers**  | Advanced trigger phrase extraction (v11)                       |

### Requirements

| Requirement          | Minimum | Recommended |
| -------------------- | ------- | ----------- |
| Node.js              | 18+     | 20+         |
| @xenova/transformers | 2.0+    | Latest      |

---

## 2. 🚀 QUICK START

### 30-Second Setup

```typescript
// From CLI scripts (scripts/*.ts)
import { generateEmbedding } from '../shared/embeddings';
import { extractTriggerPhrases } from '../shared/trigger-extractor';

// From MCP server (mcp_server/*.ts)
import { generateEmbedding } from '../shared/embeddings';
import { extractTriggerPhrases } from '../shared/trigger-extractor';
```

### Verify Installation

```bash
# Check that all modules exist
ls .opencode/skill/system-spec-kit/shared/

# Expected source files:
# embeddings.ts, chunking.ts, trigger-extractor.ts
# embeddings/ (subfolder with providers)
# Compiled .js files are also present alongside .ts sources
```

### First Use

```typescript
import { generateDocumentEmbedding, getProviderMetadata } from './shared/embeddings';

// Check active provider
const meta: { provider: string; model: string; dim: number; healthy: boolean } = getProviderMetadata();
console.log(`Provider: ${meta.provider}, Dimensions: ${meta.dim}`);
// Example: "Provider: voyage, Dimensions: 1024"

// Generate an embedding
const embedding: Float32Array = await generateDocumentEmbedding('How does authentication work?');
console.log(`Embedding dimensions: ${embedding.length}`);
```

---

## 3. 📁 STRUCTURE

```
shared/
├── Core Modules
│   ├── embeddings.ts           # Multi-provider embedding generation
│   ├── chunking.ts             # Semantic chunking utilities
│   └── trigger-extractor.ts    # Trigger phrase extraction (v11)
│
├── embeddings/                 # Provider Implementations
│   ├── factory.ts              # Provider selection and auto-detection
│   ├── profile.ts              # Embedding profiles and DB path generation
│   ├── README.md               # Embeddings factory documentation
│   └── providers/
│       ├── hf-local.ts         # HuggingFace local (fallback)
│       ├── openai.ts           # OpenAI embeddings API
│       └── voyage.ts           # Voyage AI (recommended)
│
└── README.md                   # This file
```

### Key Files

| File                    | Purpose                                             |
| ----------------------- | --------------------------------------------------- |
| `embeddings.ts`         | Unified API for multi-provider embedding generation |
| `trigger-extractor.ts`  | TF-IDF + semantic trigger phrase extraction         |
| `embeddings/factory.ts` | Provider selection with fallback logic              |
| `embeddings/profile.ts` | Per-profile database path generation                |

---

## 4. ⚡ FEATURES

### Multi-Provider Embeddings (embeddings.ts)

**Purpose**: Unified embedding generation across multiple providers

| Aspect             | Details                                 |
| ------------------ | --------------------------------------- |
| **Providers**      | Voyage AI, OpenAI, HuggingFace local    |
| **Auto-Detection** | Selects best provider based on API keys |
| **Fallback**       | Graceful degradation to HF local        |
| **Task Types**     | Document, query, clustering embeddings  |

**Key Functions**:

| Function                          | Purpose            | Returns          |
| --------------------------------- | ------------------ | ---------------- |
| `generateEmbedding(text)`         | Generic embedding  | Float32Array     |
| `generateDocumentEmbedding(text)` | For indexing       | Float32Array     |
| `generateQueryEmbedding(text)`    | For search         | Float32Array     |
| `generateBatchEmbeddings(texts)`  | Batch processing   | Float32Array[]   |
| `getEmbeddingDimension()`         | Current dimensions | number           |
| `getProviderMetadata()`           | Provider info      | Object           |
| `preWarmModel()`                  | Pre-load model     | Promise<boolean> |

---

### Trigger Phrase Extraction (trigger-extractor.ts)

**Purpose**: Extract trigger phrases for proactive memory surfacing

| Aspect          | Details                                         |
| --------------- | ----------------------------------------------- |
| **Algorithm**   | TF-IDF + N-gram hybrid with priority extraction |
| **Version**     | v11.0.0                                         |
| **Performance** | <100ms for typical content (<10KB)              |
| **Output**      | 8-25 normalized trigger phrases                 |

**Priority Extraction Types**:

| Type            | Bonus | Example                               |
| --------------- | ----- | ------------------------------------- |
| Problem Terms   | 3.0x  | "short output", "missing data"        |
| Technical Terms | 2.5x  | "generateContext", "memory_search"    |
| Decision Terms  | 2.0x  | "chose openai", "selected voyage"     |
| Action Terms    | 1.5x  | "fix bug", "add feature"              |
| Compound Nouns  | 1.3x  | "trigger extraction", "memory system" |

**Key Functions**:

| Function                               | Purpose         | Returns  |
| -------------------------------------- | --------------- | -------- |
| `extractTriggerPhrases(text)`          | Extract phrases | string[] |
| `extractTriggerPhrasesWithStats(text)` | With metadata   | Object   |

---

### Provider Comparison

| Feature    | Voyage     | HF Local | OpenAI    |
| ---------- | ---------- | -------- | --------- |
| Cost       | ~$0.06/1M  | Free     | ~$0.02/1M |
| Quality    | Best (+8%) | Good     | Good      |
| Dimensions | 1024       | 768      | 1536/3072 |
| Privacy    | Cloud      | Local    | Cloud     |
| Offline    | No         | Yes      | No        |

---

## 5. ⚙️ CONFIGURATION

### Environment Variables

| Variable                  | Required | Default                          | Description                     |
| ------------------------- | -------- | -------------------------------- | ------------------------------- |
| `VOYAGE_API_KEY`          | No       | -                                | Voyage AI API key (recommended) |
| `OPENAI_API_KEY`          | No       | -                                | OpenAI API key                  |
| `EMBEDDINGS_PROVIDER`     | No       | `auto`                           | Force specific provider         |
| `OPENAI_EMBEDDINGS_MODEL` | No       | `text-embedding-3-small`         | OpenAI model                    |
| `HF_EMBEDDINGS_MODEL`     | No       | `nomic-ai/nomic-embed-text-v1.5` | HF model                        |

### Provider Selection Precedence

1. Explicit `EMBEDDINGS_PROVIDER` (if not `auto`)
2. Auto-detection: Voyage if `VOYAGE_API_KEY` exists (recommended)
3. Auto-detection: OpenAI if `OPENAI_API_KEY` exists
4. Fallback: HF local (no API key needed)

### Per-Profile Databases

Each provider/model combination uses its own SQLite database:

```
database/
├── context-index.sqlite                                    # Legacy (hf-local + nomic + 768)
├── context-index__voyage__voyage-code-2__1024.sqlite       # Voyage
├── context-index__openai__text-embedding-3-small__1536.sqlite
└── context-index__openai__text-embedding-3-large__3072.sqlite
```

---

## 6. 💡 USAGE EXAMPLES

### Example 1: CLI Script Usage

```typescript
// In scripts/memory/generate-context.ts or similar
import { generateDocumentEmbedding, getEmbeddingDimension } from '../shared/embeddings';
import { extractTriggerPhrases } from '../shared/trigger-extractor';

// Generate embedding for memory content
const content: string = 'Decided to use Voyage API for embeddings due to quality';
const embedding: Float32Array = await generateDocumentEmbedding(content);
console.log(`Dimensions: ${embedding.length}`);

// Extract trigger phrases
const triggers: string[] = extractTriggerPhrases(content);
console.log(`Triggers: ${triggers.join(', ')}`);
// Output: "voyage api, embeddings, quality"
```

---

### Example 2: MCP Server Usage

```typescript
// In mcp_server/context-server.ts
import { generateQueryEmbedding, preWarmModel } from '../shared/embeddings';
import { extractTriggerPhrases } from '../shared/trigger-extractor';

// Pre-warm on startup
await preWarmModel();

// Search handler
async function handleSearch(query: string): Promise<void> {
  const queryEmbedding: Float32Array = await generateQueryEmbedding(query);
  // Use embedding for vector search...
}
```

---

### Example 3: Get Provider Information

```typescript
import { getProviderMetadata, getEmbeddingProfile } from './shared/embeddings';

// Check current provider
const meta = getProviderMetadata();
console.log(meta);
// { provider: 'voyage', model: 'voyage-code-2', dim: 1024, healthy: true }

// Get database path for current profile
const profile = getEmbeddingProfile();
const dbPath: string = profile.getDatabasePath('/base/path');
// '/base/path/context-index__voyage__voyage-code-2__1024.sqlite'
```

---

### Example 4: Trigger Extraction with Stats

```typescript
import { extractTriggerPhrasesWithStats } from './shared/trigger-extractor';

const result = extractTriggerPhrasesWithStats(memoryContent);
console.log(result);
// {
//   phrases: ['memory search', 'trigger extraction', ...],
//   stats: { inputLength: 5000, phraseCount: 15, extractionTimeMs: 42 },
//   breakdown: {
//     problemTerms: 2,
//     technicalTerms: 5,
//     decisionTerms: 1,
//     ...
//   }
// }
```

---

### Common Patterns

| Pattern            | Code                              | When to Use         |
| ------------------ | --------------------------------- | ------------------- |
| Document embedding | `generateDocumentEmbedding(text)` | Indexing content    |
| Query embedding    | `generateQueryEmbedding(text)`    | Search queries      |
| Batch processing   | `generateBatchEmbeddings(texts)`  | Multiple texts      |
| Check provider     | `getProviderMetadata()`           | Debugging, logging  |
| Extract triggers   | `extractTriggerPhrases(text)`     | Memory indexing     |
| Pre-warm model     | `preWarmModel()`                  | Application startup |

---

## 7. 🛠️ TROUBLESHOOTING

### Common Issues

#### Provider Not Loading

**Symptom**: `Error: Provider not initialized`

**Cause**: Provider failed to initialize or model not loaded

**Solution**:
```typescript
// Pre-warm on startup
import { preWarmModel } from './shared/embeddings';
await preWarmModel();
```

---

#### Dimension Mismatch

**Symptom**: `Error: dimension mismatch (expected 768, got 1024)`

**Cause**: Changed providers without updating database

**Solution**: Per-profile databases should prevent this. If it occurs:
```bash
# Delete old database and let system create new one
rm .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite
```

---

#### Slow First Embedding

**Symptom**: First embedding takes 30+ seconds

**Cause**: HF local downloads ~274MB model on first run

**Solution**:
```typescript
// Pre-warm at startup to download/load model
await preWarmModel();
```

---

### Quick Fixes

| Problem               | Quick Fix                                              |
| --------------------- | ------------------------------------------------------ |
| Provider not detected | Check `echo $VOYAGE_API_KEY` or `echo $OPENAI_API_KEY` |
| Wrong provider        | Set `EMBEDDINGS_PROVIDER` explicitly                   |
| Slow triggers         | Ensure content is <10KB for <100ms                     |
| Empty triggers        | Check content length (minimum 50 chars)                |

### Diagnostic Commands

```bash
# Check environment
echo "VOYAGE_API_KEY: ${VOYAGE_API_KEY:0:10}..."
echo "OPENAI_API_KEY: ${OPENAI_API_KEY:0:10}..."
echo "EMBEDDINGS_PROVIDER: $EMBEDDINGS_PROVIDER"

# Test embedding generation (runs compiled .js output)
node -e "require('./shared/embeddings').generateDocumentEmbedding('test').then(e => console.log('Dims:', e.length))"

# Test trigger extraction (runs compiled .js output)
node -e "console.log(require('./shared/trigger-extractor').extractTriggerPhrases('memory search trigger extraction'))"
```

---

## 8. 📚 RELATED DOCUMENTS

### Internal Documentation

| Document                                                | Purpose                                    |
| ------------------------------------------------------- | ------------------------------------------ |
| [scripts/lib/README.md](../scripts/lib/README.md)       | CLI scripts library (re-exports from here) |
| [mcp_server/lib/README.md](../mcp_server/lib/README.md) | MCP server library (re-exports from here)  |
| [embeddings/README.md](./embeddings/README.md)          | Embeddings factory detailed docs           |
| [SKILL.md](../SKILL.md)                                 | Parent skill documentation                 |

### External Resources

| Resource                                                                  | Description                        |
| ------------------------------------------------------------------------- | ---------------------------------- |
| [@xenova/transformers](https://github.com/xenova/transformers.js)         | JavaScript ML library for HF local |
| [nomic-embed-text](https://huggingface.co/nomic-ai/nomic-embed-text-v1.5) | Default HF embedding model         |
| [Voyage AI](https://www.voyageai.com/)                                    | Recommended embedding provider     |
| [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)   | OpenAI embedding API docs          |

---

*Documentation version: 2.0 | Last updated: 2026-02-07 | Migrated to TypeScript*
