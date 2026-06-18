---
title: "Shared Library Modules"
description: "Consolidated TypeScript modules shared between CLI scripts and MCP server for embeddings, retrieval algorithms, contracts, config, and utility logic."
trigger_phrases:
  - "shared library modules"
  - "embeddings trigger extractor shared"
  - "shared TypeScript modules"
---

# Shared Library Modules

> Consolidated TypeScript modules shared between CLI scripts and MCP server for embeddings, scoring, normalization, and utility logic. Source files are `.ts`. `shared/` builds as ESM (`package.json` sets `"type": "module"` and `tsconfig.json` uses NodeNext), with generated output in `shared/dist/`.

---

## 1. OVERVIEW

### What is the shared/ Directory?

The `shared/` directory is the **canonical source** for shared modules used by both:
- **CLI scripts** (`scripts/`) - `generate-context.ts` and other utilities
- **MCP server** (`mcp_server/`) - `context-server.ts` and memory tools

This consolidation eliminates code duplication and ensures consistent behavior across all entry points.
These modules support packet-doc-first continuity: `/speckit:resume`, implemented by `.opencode/commands/speckit/resume.md`, rebuilds active context from `handover.md -> _memory.continuity -> spec docs`, while generated continuity support artifacts remain supporting search material.

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
│    │scripts/lib  │                 │mcp_server/  │               │
│    │(RE-EXPORTS) │                 │lib/         │               │
│    ├─────────────┤                 │(RE-EXPORTS) │               │
│    │embeddings.ts│                 ├─────────────┤               │
│    │ export *    │                 │embeddings.ts│               │
│    │ from '@spec-│                 │ explicit    │               │
│    │ kit/shared/ │                 │ named re-   │               │
│    │ embeddings' │                 │ exports     │               │
│    └─────────────┘                 │ from shared │               │
│                                    └─────────────┘               │
│                                                                  │
│  Note: Source is TypeScript (.ts) and output is ESM (.js)         │
│  in shared/dist via `tsc -b` with NodeNext module resolution.    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Key Statistics

| Category                 | Count         | Details                                          |
| ------------------------ | ------------- | ------------------------------------------------ |
| Top-Level TS Modules     | 14            | index, embeddings, chunking, trigger extractor, types, normalization, config, paths, budget allocator, compact merger, context types, code graph contracts, gate 3 classifier, unicode normalization |
| Top-Level Subdirectories | 12            | algorithms, contracts, dist, embeddings, ipc, lib, mcp_server, parsing, predicates, ranking, scoring, utils |
| Provider Implementations | 5             | Voyage, OpenAI, ollama, HF Local, auto |
| Embedding Dimensions     | 768/1024/1536 | 768 default (ollama and HF Local); 1024 (Voyage); 1536 (OpenAI) |

### Key Features

| Feature                         | Description                                                    |
| ------------------------------- | -------------------------------------------------------------- |
| **Multi-Provider Embeddings**   | Supports ollama, HuggingFace local, OpenAI, and Voyage with local-first auto-cascade selection |
| **Dynamic Dimension Detection** | 768 (ollama and HF Local), 1024 (Voyage), 1536/3072 (OpenAI) |
| **Task-Specific Functions**     | Document, query and clustering embeddings                      |
| **TF-IDF + Semantic Triggers**  | Advanced trigger phrase extraction (v11)                       |
| **Adaptive Fusion Support**     | Intent-aware weighting used by the runtime 5-channel retrieval pipeline (Vector, FTS5, BM25, Graph, Degree) |
| **7 Intent Profiles**           | Task-specific weight profiles: add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision |

### Requirements

| Requirement          | Minimum | Recommended |
| -------------------- | ------- | ----------- |
| Node.js              | >=20.11.0 | >=20.11.0  |
| @huggingface/transformers | 2.0+    | Latest      |

---

## 1B. BOUNDARY AND IMPORT POLICY

`shared/` is the canonical source for modules consumed by **both** `scripts/` and `mcp_server/`.

- **Import convention**: Consumers should import via `@spec-kit/shared/*` path alias
- **Stability**: Shared modules must be stable because breaking changes require coordination with both consumers
- **New modules**: Document purpose and consumer expectations before adding
- **Ownership**: See [Architecture Boundaries](../ARCHITECTURE.md) for the full dependency matrix

---

## 2. QUICK START

### 30-Second Setup

```typescript
// From CLI scripts (scripts/*.ts)
import { generateEmbedding } from '@spec-kit/shared/embeddings'
import { extractTriggerPhrases } from '@spec-kit/shared/trigger-extractor'

// From MCP server (mcp_server/*.ts)
import { generateEmbedding } from '@spec-kit/shared/embeddings'
import { extractTriggerPhrases } from '@spec-kit/shared/trigger-extractor'
```

### Verify Installation

```bash
# Check that all modules exist
ls .opencode/skills/system-spec-kit/shared/

# Expected source files:
# index.ts, types.ts, normalization.ts, config.ts, paths.ts
# embeddings.ts, chunking.ts, trigger-extractor.ts
# budget-allocator.ts, compact-merger.ts, code-graph-contracts.ts
# context-types.ts, gate-3-classifier.ts, unicode-normalization.ts
# algorithms/, contracts/, embeddings/, ipc/, lib/, parsing/, predicates/
# ranking/, scoring/, utils/
# Compiled output is written to shared/dist/
```

### First Use

```typescript
import { generateDocumentEmbedding, getProviderMetadata } from '@spec-kit/shared/embeddings'

// Check active provider
const meta: { provider: string, model: string, dim: number, healthy: boolean } = getProviderMetadata()
console.log(`Provider: ${meta.provider}, Dimensions: ${meta.dim}`)
// Example: "Provider: ollama, Dimensions: 768"

// Generate an embedding
const embedding: Float32Array = await generateDocumentEmbedding('How does authentication work?')
console.log(`Embedding dimensions: ${embedding.length}`)
```

---

## 3. STRUCTURE

```
shared/
├── index.ts                    # Barrel exports for all shared modules
├── budget-allocator.ts         # Prompt/token budget allocation helpers
├── types.ts                    # Shared type definitions
├── context-types.ts            # Shared context envelope type helpers
├── normalization.ts            # DB row <-> app object normalization
├── unicode-normalization.ts    # Unicode normalization helpers
├── config.ts                   # Shared DB directory resolution and update markers
├── paths.ts                    # Shared DB path resolution
├── embeddings.ts               # Multi-provider embedding generation
├── chunking.ts                 # Semantic chunking utilities
├── compact-merger.ts           # Compacted context merge helpers
├── code-graph-contracts.ts     # Code graph readiness and contract types
├── gate-3-classifier.ts        # File-modification Gate 3 classifier
├── trigger-extractor.ts        # Trigger phrase extraction
├── package.json                # @spec-kit/shared package manifest
├── tsconfig.json               # TypeScript project configuration
├── algorithms/                 # Shared retrieval fusion and reranking algorithms
│   ├── adaptive-fusion.ts      # Intent-aware weighted RRF profiles
│   ├── mmr-reranker.ts         # Diversity-aware reranking helpers
│   ├── rrf-fusion.ts           # Reciprocal rank fusion primitives
│   └── index.ts                # Algorithms barrel
├── contracts/
│   └── retrieval-trace.ts      # Typed trace/envelope contracts for retrieval responses
├── embeddings/                 # Provider implementations and profile helpers
│   ├── factory.ts              # Provider selection and auto-cascade
│   ├── profile.ts              # Embedding profiles and DB path generation
│   ├── README.md               # Embeddings factory documentation
│   └── providers/
│       ├── ollama.ts           # ollama local provider
│       ├── hf-local.ts         # HuggingFace ONNX (fallback local provider)
│       ├── openai.ts           # OpenAI embeddings API
│       ├── voyage.ts           # Voyage AI (cloud opt-in)
│       └── README.md           # Provider comparison and interface docs
├── lib/
│   └── structure-aware-chunker.ts # Markdown-aware chunking helpers
├── ipc/
│   └── socket-server.ts        # Shared IPC socket server helper
├── mcp_server/
	│   └── database/
	│       ├── .db-updated         # Update marker for the shared database directory
	│       ├── README.md           # Database directory notes and handling guidance
	│       └── context-index__*.sqlite # Active profile-keyed SQLite database files
├── parsing/
│   ├── memory-sufficiency.ts          # Memory sufficiency checks
│   ├── memory-template-contract.ts    # Template contract validation for continuity support artifacts
│   ├── quality-extractors.ts          # Quality score/flags extraction
│   ├── quality-extractors.test.ts     # Parsing coverage for quality extraction
│   ├── spec-doc-health.ts             # Spec document health checks
│   └── spec-doc-health.test.ts        # Tests for spec document health checks
├── predicates/
│   ├── boolean-expr.ts         # Boolean expression predicate helpers
│   └── boolean-expr.test.ts    # Predicate parser tests
├── ranking/
│   ├── learned-combiner.ts     # ML-based score combiner for retrieval ranking
│   └── matrix-math.ts          # Matrix operations for ranking computations
├── scoring/
│   ├── folder-scoring.ts       # Composite folder ranking logic
│   └── README.md
├── utils/
│   ├── path-security.ts        # Path validation and containment checks
│   ├── retry.ts                # Retry/backoff classification logic
│   ├── jsonc-strip.ts          # JSONC comment stripping helper
│   ├── token-estimate.ts       # Shared token count estimation
│   └── README.md
├── dist/                       # Compiled JS output
└── README.md
```

### Key Files

| File                    | Purpose                                             |
| ----------------------- | --------------------------------------------------- |
| `embeddings.ts` | Unified API for multi-provider embedding generation |
| `trigger-extractor.ts` | Trigger phrase extraction for memory indexing |
| `normalization.ts` | Canonical DB row <-> app object conversion |
| `config.ts` | Shared DB directory resolution and update marker paths |
| `paths.ts` | Provider-keyed database path resolution (encodes provider, model, dim and dtype in the filename) |
| `budget-allocator.ts` | Prompt/token budget allocation helpers |
| `compact-merger.ts` | Compacted context merge helpers |
| `code-graph-contracts.ts` | Code graph readiness and contract types |
| `algorithms/` | Shared adaptive fusion, RRF fusion, and MMR reranking helpers |
| `contracts/retrieval-trace.ts` | Typed retrieval trace and context envelope contracts |
| `scoring/folder-scoring.ts` | Composite folder scoring and ranking |
| `utils/token-estimate.ts` | Shared token count estimation (chars/4 heuristic) |
| `parsing/quality-extractors.ts` | Quality score and flags extraction from frontmatter |

---

## 4. FEATURES

### Multi-Provider Embeddings (embeddings.ts)

**Purpose**: Unified embedding generation across multiple providers

| Aspect             | Details                                 |
| ------------------ | --------------------------------------- |
| **Providers**      | ollama (local-first), HuggingFace local, OpenAI, Voyage AI |
| **Auto-Detection** | Tries explicit `EMBEDDINGS_PROVIDER` first, then the local-first cascade |
| **Fallback**       | Graceful degradation through ollama, HF local, OpenAI, then Voyage |
| **Task Types**     | Document, query and clustering embeddings  |

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

### Consumer Shims

Two re-export shims exist for path convenience:
- `scripts/lib/embeddings.ts` → `export * from '@spec-kit/shared/embeddings'`
- `mcp_server/lib/providers/embeddings.ts` → explicit named re-exports from `@spec-kit/shared/embeddings`

The canonical source is the `shared/` package. `shared/embeddings.ts` is the public shared entry point for embeddings, while `shared/embeddings/` contains provider-specific implementation details. These shims stay implementation-free: the scripts shim uses a barrel re-export, while the MCP server shim uses explicit named re-exports for auditability.

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
| Decision Terms  | 2.0x  | "chose ollama", "selected openai"  |
| Action Terms    | 1.5x  | "fix bug", "add feature"              |
| Compound Nouns  | 1.3x  | "trigger extraction", "memory system" |

**Key Functions**:

| Function                               | Purpose         | Returns  |
| -------------------------------------- | --------------- | -------- |
| `extractTriggerPhrases(text)`          | Extract phrases | string[] |
| `extractTriggerPhrasesWithStats(text)` | With metadata   | Object   |

---

### Provider Comparison

| Feature    | ollama | HF Local | Voyage     | OpenAI    |
| ---------- | --------- | -------- | ---------- | --------- |
| Cost       | Free      | Free     | ~$0.06/1M  | ~$0.02/1M |
| Quality    | Good (0.968 cos parity with HF Local) | Good | Good (cloud) | Good |
| Dimensions | 768       | 768      | 1024       | 1536/3072 |
| Privacy    | Local     | Local    | Cloud      | Cloud     |
| Offline    | Yes       | Yes      | No         | No        |
| Default    | First local cascade choice when persisted or reachable | Second local cascade choice | Explicit or last-resort fallback | Explicit or last-resort fallback |

---

## 5. CONFIGURATION

### Environment Variables

| Variable                  | Required | Default                                       | Description                          |
| ------------------------- | -------- | --------------------------------------------- | ------------------------------------ |
| `EMBEDDINGS_PROVIDER`     | No       | `auto`                                        | One of: `auto`, `ollama`, `hf-local`, `voyage`, `openai` |
| `OLLAMA_EMBEDDINGS_MODEL` | No       | `nomic-embed-text-v1.5`                    | Override ollama model; Ollama tag form is `nomic-embed-text:v1.5` |
| `HF_EMBEDDINGS_MODEL`     | No       | `nomic-ai/nomic-embed-text-v1.5`           | hf-local fallback model              |
| `HF_EMBEDDINGS_DTYPE`     | No       | `q8`                                          | hf-local dtype: `q8`, `fp32`, `fp16`, `q4`, `int8`, `uint8`, `bnb4` |
| `VOYAGE_API_KEY`          | No       | -                                             | Voyage AI cloud embeddings (opt-in)  |
| `OPENAI_API_KEY`          | No       | -                                             | OpenAI cloud embeddings (opt-in)     |
| `OPENAI_EMBEDDINGS_MODEL` | No       | `text-embedding-3-small`                      | OpenAI model                         |

### Provider Selection Precedence

1. Explicit `EMBEDDINGS_PROVIDER` (if not `auto`) is tried first.
2. Auto-cascade: ollama when a persisted or reachable local embedder is available.
3. Auto-cascade: HF local when the local model server is reachable.
4. Auto-cascade: OpenAI when local providers fail and `OPENAI_API_KEY` is usable.
5. Auto-cascade: Voyage when earlier providers fail and `VOYAGE_API_KEY` is usable.

### Per-Profile Databases

The shared database directory currently contains the runtime database plus its marker/readme files:

```
database/
├── .db-updated              # Update marker for the shared database directory
├── README.md                # Database directory notes and handling guidance
└── context-index__*.sqlite  # Active profile-keyed SQLite database files
```

---

## 6. USAGE EXAMPLES

### Example 1: CLI Script Usage

```typescript
// In scripts/memory/generate-context.ts or similar
import { generateDocumentEmbedding, getEmbeddingDimension } from '@spec-kit/shared/embeddings'
import { extractTriggerPhrases } from '@spec-kit/shared/trigger-extractor'

// Generate embedding for memory content
const content: string = 'Switched to ollama embeddings for local-first retrieval'
const embedding: Float32Array = await generateDocumentEmbedding(content)
console.log(`Dimensions: ${embedding.length}`)

// Extract trigger phrases
const triggers: string[] = extractTriggerPhrases(content)
console.log(`Triggers: ${triggers.join(', ')}`)
// Output: "ollama embeddings, local-first retrieval"
```

---

### Example 2: MCP Server Usage

```typescript
// In mcp_server/context-server.ts
import { generateQueryEmbedding, preWarmModel } from '@spec-kit/shared/embeddings'
import { extractTriggerPhrases } from '@spec-kit/shared/trigger-extractor'

// Pre-warm on startup
await preWarmModel()

// Search handler
async function handleSearch(query: string): Promise<void> {
  const queryEmbedding: Float32Array = await generateQueryEmbedding(query)
  // Use embedding for vector search...
}
```

---

### Example 3: Get Provider Information

```typescript
import { getProviderMetadata, getEmbeddingProfile } from '@spec-kit/shared/embeddings'

// Check current provider
const meta = getProviderMetadata()
console.log(meta)
// { provider: 'ollama', model: 'nomic-embed-text-v1.5', dim: 768, healthy: true }

// Get database path for current profile
const profile = getEmbeddingProfile()
const dbPath: string = profile.getDatabasePath('/base/path')
// '/base/path/context-index__ollama__nomic-embed-text-v1-5__768__q8.sqlite'
```

---

### Example 4: Trigger Extraction with Stats

```typescript
import { extractTriggerPhrasesWithStats } from '@spec-kit/shared/trigger-extractor'

const result = extractTriggerPhrasesWithStats(memoryContent)
console.log(result)
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

## 7. TROUBLESHOOTING

### Common Issues

#### Provider Not Loading

**Symptom**: `Error: Provider not initialized`

**Cause**: Provider failed to initialize or model not loaded

**Solution**:
```typescript
// Pre-warm on startup
import { preWarmModel } from './embeddings'
await preWarmModel()
```

---

#### Dimension Mismatch

**Symptom**: `Error: dimension mismatch (expected 768, got 1024)`

**Cause**: Changed providers without updating database

**Solution**: Per-profile databases should prevent this. If it occurs:
```bash
# Delete old database and let system create new one
# Database filenames encode provider, model, dim and dtype.
rm .opencode/skills/system-spec-kit/mcp_server/database/context-index__*.sqlite*
```

---

#### Slow First Embedding

**Symptom**: First embedding takes 30+ seconds

**Cause**: ollama or HF Local may download or warm the Nomic local fallback model on first run

**Solution**:
```typescript
// Pre-warm at startup to download/load model
await preWarmModel()
```

---

### Quick Fixes

| Problem               | Quick Fix                                              |
| --------------------- | ------------------------------------------------------ |
| Provider not detected | Check `echo $EMBEDDINGS_PROVIDER`, then `echo $OLLAMA_EMBEDDINGS_MODEL` or `echo $VOYAGE_API_KEY` |
| Wrong provider        | Set `EMBEDDINGS_PROVIDER` explicitly                   |
| Slow triggers         | Ensure content is <10KB for <100ms                     |
| Empty triggers        | Check content length (minimum 50 chars)                |

### Diagnostic Commands

```bash
# Check environment
echo "EMBEDDINGS_PROVIDER: $EMBEDDINGS_PROVIDER"
echo "OLLAMA_EMBEDDINGS_MODEL: $OLLAMA_EMBEDDINGS_MODEL"
echo "HF_EMBEDDINGS_DTYPE: $HF_EMBEDDINGS_DTYPE"
echo "VOYAGE_API_KEY: ${VOYAGE_API_KEY:0:10}..."
echo "OPENAI_API_KEY: ${OPENAI_API_KEY:0:10}..."

# Run from shared/ so Node resolves compiled modules in dist/
cd .opencode/skills/system-spec-kit/shared

# Test embedding generation (runs compiled ESM .js output)
node --input-type=module -e "const { generateDocumentEmbedding } = await import('./dist/embeddings.js')
const e = await generateDocumentEmbedding('test')
console.log('Dims:', e.length)"

# Test trigger extraction (runs compiled ESM .js output)
node --input-type=module -e "const { extractTriggerPhrases } = await import('./dist/trigger-extractor.js')
console.log(extractTriggerPhrases('memory search trigger extraction'))"
```

---

## 8. RELATED DOCUMENTS

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
| [@huggingface/transformers](https://github.com/huggingface/transformers.js) | JavaScript ML library for HF local |
| [nomic-embed-text v1.5](https://ollama.com/library/nomic-embed-text) | Default ollama embedding model |
| [Nomic Embed Text v1.5](https://huggingface.co/nomic-ai/nomic-embed-text-v1.5) | Fallback HF Local embedding model |
| [Voyage AI](https://www.voyageai.com/)                                    | Cloud embedding provider (opt-in)  |
| [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)   | OpenAI embedding API docs          |
