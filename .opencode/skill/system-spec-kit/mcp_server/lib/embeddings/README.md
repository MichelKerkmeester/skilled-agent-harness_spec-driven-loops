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

```
embeddings/
├── provider-chain.js    # Three-tier fallback chain implementation
└── index.js             # Barrel export for provider chain
```

### Key Files

| File | Purpose |
|------|---------|
| `provider-chain.js` | `EmbeddingProviderChain` class with fallback logic |
| `index.js` | Re-exports provider-chain for easy imports |

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

```javascript
const { createProviderChain } = require('./embeddings');

const chain = await createProviderChain({
  enableLocalFallback: true,
  fallbackTimeoutMs: 100
});

const embedding = await chain.embed('authentication flow');
console.log(`Provider: ${chain.getProviderName()}, Tier: ${chain.getActiveTier()}`);
```

### BM25-Only Provider

**Purpose**: Fallback mode when all embedding providers fail

| Aspect | Details |
|--------|---------|
| **Behavior** | Returns `null` for all embedding requests |
| **Search Impact** | System falls back to FTS5 text search |
| **Diagnostics** | Tracks activation reason and timestamp |
| **Credentials** | No API keys required |

```javascript
const { BM25OnlyProvider } = require('./embeddings');

const bm25 = new BM25OnlyProvider();
bm25.activate('API rate limit exceeded');

const embedding = await bm25.embed('test');
// Returns: null (signals BM25-only mode)
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

```javascript
const { createProviderChain } = require('./embeddings');

// Create chain with fallback enabled
const chain = await createProviderChain({
  enableLocalFallback: true
});

// Generate embedding (automatically uses best available provider)
const embedding = await chain.embed('authentication workflow');

// Check which provider is active
const status = chain.getStatus();
console.log(`Active: ${status.activeProvider}, Tier: ${status.activeTier}`);
// Logs: Active: voyage, Tier: primary
```

### Example 2: Handle Graceful Degradation

```javascript
const { createProviderChain } = require('./embeddings');

const chain = await createProviderChain();

// Check if running in degraded mode
if (chain.isBM25Only()) {
  console.warn('Running in BM25-only mode - semantic search unavailable');
}

// Embedding returns null in BM25-only mode
const embedding = await chain.embed('test query');
if (embedding === null) {
  // Fall back to keyword search
  console.log('Using keyword search fallback');
}
```

### Example 3: Diagnostics and Monitoring

```javascript
const { EmbeddingProviderChain } = require('./embeddings');

const chain = new EmbeddingProviderChain({
  primaryProvider: voyageProvider,
  localProvider: hfProvider
});

await chain.initialize();

// Get full status
const status = chain.getStatus();
console.log(JSON.stringify(status, null, 2));
// {
//   initialized: true,
//   activeTier: 'primary',
//   activeProvider: 'voyage',
//   isBM25Only: false,
//   fallbackCount: 0,
//   providers: { primary: {...}, local: {...}, bm25: {...} }
// }

// Get fallback history
const log = chain.getFallbackLog();
log.forEach(event => {
  console.log(`${event.timestamp}: ${event.provider} -> ${event.reason}`);
});
```

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| Create chain | `createProviderChain()` | Server startup |
| Single embed | `chain.embed(text)` | Query embedding |
| Batch embed | `chain.batchEmbed(texts)` | Index multiple docs |
| Check mode | `chain.isBM25Only()` | Detect degraded state |
| Get status | `chain.getStatus()` | Monitoring/debugging |
| Cleanup | `chain.close()` | Server shutdown |

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

*Documentation version: 1.0 | Last updated: 2026-02-02*
