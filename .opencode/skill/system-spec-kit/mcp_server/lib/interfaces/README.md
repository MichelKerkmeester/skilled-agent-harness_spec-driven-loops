---
title: "Interfaces"
description: "Protocol abstractions for embedding/vector backends, with shared-package migration notes."
trigger_phrases:
  - "interfaces"
  - "embedding provider interface"
  - "vector store interface"
importance_tier: "normal"
---

# Interfaces

> Protocol abstractions for embedding/vector backends, with shared-package migration notes.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. FEATURES](#3--features)
- [4. USAGE EXAMPLES](#4--usage-examples)
- [5. RELATED RESOURCES](#5--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

The interfaces module documents contracts for embedding providers and vector stores. Most interfaces now live in `@spec-kit/shared`; this local module remains the compatibility layer and local vector-store stub.

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **Testability** | Mock implementations for fast, deterministic unit tests |
| **Flexibility** | Swap backends (local vs API embeddings) via configuration |
| **Adaptability** | Migrate to new systems (e.g., LadybugDB) without interface changes |
| **Decoupling** | Core logic depends on interfaces, not concrete implementations |
| **Spec 126 Alignment** | Retrieval pipeline preserves document metadata (`documentType`, `specLevel`) through storage boundaries |

<!-- /ANCHOR:overview -->

---

## 2. STRUCTURE
<!-- ANCHOR:structure -->

> **Note**: Most source files (`embedding-provider.ts`, `index.ts`) were relocated to `@spec-kit/shared` during the shared package migration. `vector-store.ts` remains as a local stub/re-export.

```
interfaces/
├── vector-store.ts         # Vector store interface (stub/re-export from @spec-kit/shared)
└── README.md               # This file
```

### Relocated Files

| File | Status |
|------|--------|
| `embedding-provider.ts` | Relocated to `@spec-kit/shared` |
| `vector-store.ts` | **Remains locally** (stub/re-export) |
| `index.ts` | Relocated to `@spec-kit/shared` |

<!-- /ANCHOR:structure -->

---

## 3. FEATURES
<!-- ANCHOR:features -->

### IEmbeddingProvider Interface

Defines the contract for text-to-vector embedding generation.

| Method | Purpose |
|--------|---------|
| `embed(text)` | Generate embedding for single text |
| `batchEmbed(texts, options)` | Generate embeddings for multiple texts |
| `embedQuery(query)` | Embed a search query (may differ from documents) |
| `embedDocument(document)` | Embed a document for storage |
| `getDimension()` | Return embedding vector dimension |
| `getModelName()` | Return model identifier |
| `getProfile()` | Return provider configuration profile |
| `isReady()` | Check if provider is initialized |
| `initialize()` | Perform provider initialization |
| `validateCredentials()` | Verify API credentials are valid |
| `getProviderName()` | Return provider name string |
| `close()` | Clean up resources |

### IVectorStore Interface

Defines the contract for vector similarity search and storage.

| Method | Purpose |
|--------|---------|
| `search(embedding, topK, options)` | Find similar vectors |
| `upsert(id, embedding, metadata)` | Insert or update a vector |
| `delete(id)` | Remove a vector by ID |
| `get(id)` | Retrieve a vector by ID |
| `getStats()` | Return storage statistics |
| `isAvailable()` | Check if store is ready |
| `getEmbeddingDimension()` | Return expected embedding dimension |
| `close()` | Clean up resources |

### Mock Implementations

| Class | Features |
|-------|----------|
| `MockEmbeddingProvider` | Deterministic embeddings, configurable latency/failure rate |
| `MockVectorStore` | In-memory storage, cosine similarity search |

<!-- /ANCHOR:features -->

---

## 4. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Using MockEmbeddingProvider for Tests

```typescript
import { MockEmbeddingProvider } from './interfaces';

// Create mock with custom options
const provider = new MockEmbeddingProvider({
  dimension: 1024,
  latencyMs: 0,      // No simulated delay
  failRate: 0,       // No random failures
  seed: 42           // Deterministic output
});

// Generate embedding
const embedding = await provider.embed('test query');
console.log(embedding.length); // 1024
```

### Using MockVectorStore for Tests

```typescript
import { MockVectorStore, MockEmbeddingProvider } from './interfaces';

const store = new MockVectorStore({ embeddingDim: 1024 });
const provider = new MockEmbeddingProvider({ dimension: 1024 });

// Store a vector
const embedding = await provider.embed('Hello world');
await store.upsert(1, embedding, { title: 'Test' });

// Search
const results = await store.search(embedding, 5);
console.log(results[0].similarity); // ~100 (self-similarity)
```

### Simulating Failures

```typescript
import { MockEmbeddingProvider } from './interfaces';

const provider = new MockEmbeddingProvider({ failRate: 0.5 });
provider.setLatency(100); // Add 100ms delay

// 50% of embed() calls will return null
const result = await provider.embed('test');
// result is null or Float32Array
```

<!-- /ANCHOR:usage-examples -->

---

## 5. RELATED RESOURCES
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../README.md](../README.md) | Parent lib directory overview |
| [../embeddings/](../embeddings/) | Concrete embedding implementations |
| [../search/](../search/) | Vector search implementations |

### Design Patterns

| Pattern | Application |
|---------|-------------|
| Interface Segregation | Each interface has single responsibility |
| Dependency Injection | Consumers accept interface, not concrete class |
| Strategy Pattern | Swap implementations at runtime |

<!-- /ANCHOR:related -->

---

**Version**: 1.8.0
**Last Updated**: 2026-02-16
