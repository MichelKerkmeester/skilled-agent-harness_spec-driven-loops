# Embeddings Modules

> Embedding provider fallback chain with graceful degradation for the Spec Kit Memory system.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 📁 STRUCTURE](#2--structure)
- [3. ⚡ FEATURES](#3--features)
- [4. 💡 USAGE EXAMPLES](#4--usage-examples)
- [5. 🔗 RELATED RESOURCES](#5--related-resources)

---

## 1. 📖 OVERVIEW

The embeddings module implements a three-tier provider fallback chain ensuring reliable embedding generation with graceful degradation. When the primary API provider fails, it automatically falls back to local models, and ultimately to BM25-only text search mode.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Modules | 2 | provider-chain, index |
| Provider Tiers | 3 | Primary API, Local model, BM25-only |
| Fallback Timeout | 100ms | Max time for fallback attempts |

### Key Features

| Feature | Description |
|---------|-------------|
| **Three-Tier Fallback** | Primary API -> Local model -> BM25-only |
| **Graceful Degradation** | Search continues even when all embedding providers fail |
| **Diagnostic Logging** | Detailed fallback logs with reasons and timestamps |
| **Environment Control** | `ENABLE_LOCAL_FALLBACK` env var controls local model usage |

### Fallback Chain (v1.2.0)

```
Primary API (Voyage/OpenAI)
    ↓ (failure: rate limit, timeout, auth error)
Local Model (HuggingFace)
    ↓ (failure: model unavailable, initialization error)
BM25-Only Mode
    ↓ (always succeeds)
Text-based search only
```

---

## 2. 📁 STRUCTURE

> **Note**: Source files (`provider-chain.ts`, `index.ts`) were relocated to `@spec-kit/shared/embeddings` during the shared package migration. This directory retains the README for architectural reference. The `lib/providers/embeddings.ts` module re-exports from the shared package.

```
embeddings/
└── README.md             # Architectural reference (this file)
```

### Relocated Files

| Original File | Relocated To |
|------|---------|
| `provider-chain.ts` | `@spec-kit/shared/embeddings` |
| `index.ts` | `@spec-kit/shared/embeddings` |

---

## 3. ⚡ FEATURES

### Provider Chain

**Purpose**: Manage embedding providers with automatic fallback on failure

| Aspect | Details |
|--------|---------|
| **Primary Tier** | Voyage AI or OpenAI API |
| **Secondary Tier** | HuggingFace local model |
| **Tertiary Tier** | BM25-only (no embeddings, text search only) |
| **Timeout** | 100ms fallback timeout to prevent slow degradation |

```typescript
import { createProviderChain } from './embeddings';

const chain = await createProviderChain({
  primaryProvider: 'voyage',
  warmup: true
});

const embedding = await chain.generateEmbedding('authentication flow');
console.log(`Provider: ${chain.getProviderName()}, Tier: ${chain.getActiveTier()}`);
```

### BM25-Only Provider

**Purpose**: Fallback mode when all embedding providers fail

| Aspect | Details |
|--------|---------|
| **Behavior** | Returns `null` for all embedding requests |
| **Search Impact** | System falls back to FTS5 text search |
| **Diagnostics** | Automatically added as fallback tier in provider chain |
| **Credentials** | No API keys required |

```typescript
import { BM25OnlyProvider } from './embeddings';

const bm25 = new BM25OnlyProvider();

const embedding = await bm25.generateEmbedding('test');
// Returns: null (signals BM25-only mode)

const metadata = bm25.get_metadata();
// Returns: { provider: 'bm25-only', model: 'none', dim: 0, healthy: true, ... }
```

### Fallback Reasons

| Reason | Trigger |
|--------|---------|
| `API_KEY_INVALID` | 401/403 status or "unauthorized" message |
| `API_UNAVAILABLE` | 5xx server errors |
| `API_TIMEOUT` | ETIMEDOUT, TIMEOUT error codes |
| `API_RATE_LIMITED` | 429 status code |
| `LOCAL_UNAVAILABLE` | Local model not found or initialization failed |
| `NETWORK_ERROR` | ECONNREFUSED, ENOTFOUND, ENETUNREACH |

---

## 4. 💡 USAGE EXAMPLES

### Example 1: Create and Use Provider Chain

```typescript
import { createProviderChain } from './embeddings';

// Create chain with primary and secondary providers
const chain = await createProviderChain({
  primaryProvider: 'voyage',
  secondaryProvider: 'openai',
  warmup: true
});

// Generate embedding (automatically uses best available provider)
const embedding = await chain.generateEmbedding('authentication workflow');

// Check which provider is active
const status = chain.getStatus();
console.log(`Active: ${status.activeProvider}, Tier: ${status.activeTier}`);
// Logs: Active: voyage, Tier: primary
```

### Example 2: Handle Graceful Degradation

```typescript
import { createProviderChain } from './embeddings';

const chain = await createProviderChain({
  primaryProvider: 'voyage'
});

// Embedding returns null in BM25-only fallback mode
const embedding = await chain.generateEmbedding('test query');
if (embedding === null) {
  console.warn('Falling back to BM25-only text search');
}
```

### Example 3: Diagnostics and Monitoring

```typescript
import { EmbeddingProviderChain, PROVIDER_TIER } from './embeddings';
import { createEmbeddingsProvider } from '@spec-kit/shared/embeddings/factory';

// Create custom chain with manual provider setup
const chain = new EmbeddingProviderChain();

const primaryProvider = await createEmbeddingsProvider({
  provider: 'voyage',
  warmup: true
});
chain.addProvider(primaryProvider, PROVIDER_TIER.PRIMARY);

// Get full status
const status = chain.getStatus();
console.log(JSON.stringify(status, null, 2));
// {
//   activeProvider: 'voyage',
//   activeTier: 'primary',
//   providers: [ { name: 'voyage', tier: 'primary', enabled: true, ... } ],
//   fallbackHistory: [],
//   totalFallbacks: 0
// }
```

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| Create chain | `createProviderChain()` | Server startup |
| Generate embedding | `chain.generateEmbedding(text)` | Single embedding |
| Document embed | `chain.embed_document(text)` | Index document |
| Query embed | `chain.embed_query(text)` | Search query |
| Warmup | `chain.warmup()` | Pre-load models |
| Get status | `chain.getStatus()` | Monitoring/debugging |
| Get metadata | `chain.get_metadata()` | Provider info |

---

## 5. 🔗 RELATED RESOURCES

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [lib/README.md](../README.md) | Parent library overview |
| [providers/README.md](../providers/README.md) | Retry manager for failed embeddings |
| [search/README.md](../search/README.md) | Vector search using embeddings |
| [errors/README.md](../errors/README.md) | Recovery hints for embedding errors |

### External Resources

| Resource | Description |
|----------|-------------|
| [Voyage AI Docs](https://docs.voyageai.com/) | Primary API provider |
| [HuggingFace Transformers](https://huggingface.co/docs/transformers) | Local model support |

---

**Version**: 1.7.2
**Last Updated**: 2026-02-08
