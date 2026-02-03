# Providers Modules

> Embedding provider abstraction and retry management for the Spec Kit Memory system.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 📁 STRUCTURE](#2--structure)
- [3. ⚡ FEATURES](#3--features)
- [4. 💡 USAGE EXAMPLES](#4--usage-examples)
- [5. 🔗 RELATED RESOURCES](#5--related-resources)

---

## 1. 📖 OVERVIEW

The providers module handles embedding generation and retry logic for the Spec Kit Memory MCP server. It provides a unified abstraction layer for multiple embedding providers (Voyage AI, OpenAI) with exponential backoff retry management to ensure reliable embedding generation.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Modules | 3 | embeddings, retry-manager, index |
| Backoff Delays | 3 | 1min, 5min, 15min exponential |
| Max Retries | 3 | Before marking as permanently failed |

### Key Features

| Feature | Description |
|---------|-------------|
| **Provider Abstraction** | Unified interface for Voyage AI, OpenAI, and local models |
| **Exponential Backoff** | Retry with 1s, 2s, 4s delays plus jitter |
| **Background Retry Job** | Automatic processing of pending embeddings every 5 minutes |
| **Graceful Degradation** | Falls back to BM25-only mode when all providers fail |

---

## 2. 📁 STRUCTURE

```
providers/
├── embeddings.js        # Re-export from shared/ (multi-provider support)
├── retry-manager.js     # Exponential backoff with background job
└── index.js             # Barrel export aggregating all modules
```

### Key Files

| File | Purpose |
|------|---------|
| `embeddings.js` | Provider abstraction layer (re-exports from shared/) |
| `retry-manager.js` | Retry queue, backoff timing, background job processing |
| `index.js` | Aggregates and re-exports all provider modules |

---

## 3. ⚡ FEATURES

### Embeddings Provider

**Purpose**: Unified interface for generating embeddings from multiple providers

| Aspect | Details |
|--------|---------|
| **Providers** | Voyage AI (primary), OpenAI, HuggingFace local |
| **Task Types** | Query embeddings, document embeddings, batch processing |
| **Dimensions** | Dynamic based on provider/model selection |
| **Source** | Re-exported from `shared/embeddings.js` |

```javascript
const { generate_embedding } = require('./providers');

const embedding = await generate_embedding('authentication flow');
// Returns: Float32Array of embedding dimensions
```

### Retry Manager

**Purpose**: Handle failed embedding generations with exponential backoff

| Aspect | Details |
|--------|---------|
| **Backoff Delays** | 1 minute, 5 minutes, 15 minutes |
| **Max Retries** | 3 attempts before permanent failure |
| **Background Job** | Processes up to 5 pending items every 5 minutes |
| **Status Tracking** | pending, retry, success, failed states |

```javascript
const { get_retry_stats, process_retry_queue } = require('./providers');

// Check retry queue status
const stats = get_retry_stats();
// Returns: { pending: 2, retry: 1, failed: 0, success: 150, queue_size: 3 }

// Process pending retries
const result = await process_retry_queue(3);
// Returns: { processed: 3, succeeded: 2, failed: 1 }
```

### Background Retry Job

**Purpose**: Automatic background processing of failed embeddings

| Aspect | Details |
|--------|---------|
| **Interval** | Every 5 minutes (configurable) |
| **Batch Size** | 5 items per run (configurable) |
| **Concurrency** | Single job at a time (prevents overlapping) |
| **Control** | Start, stop, and status check functions |

```javascript
const {
  start_background_job,
  stop_background_job,
  is_background_job_running
} = require('./providers');

// Start background processing
start_background_job({ intervalMs: 300000, batchSize: 5 });

// Check status
console.log(is_background_job_running()); // true

// Stop when needed
stop_background_job();
```

---

## 4. 💡 USAGE EXAMPLES

### Example 1: Generate Embedding

```javascript
const { generate_embedding } = require('./providers');

const text = 'How does the authentication flow work?';
const embedding = await generate_embedding(text);

console.log(`Embedding dimensions: ${embedding.length}`);
// Logs: Embedding dimensions: 1024 (varies by provider)
```

### Example 2: Monitor Retry Queue

```javascript
const { get_retry_stats, get_retry_queue, get_failed_embeddings } = require('./providers');

// Get overall statistics
const stats = get_retry_stats();
console.log(`Queue size: ${stats.queue_size}, Failed: ${stats.failed}`);

// Get items eligible for retry
const queue = get_retry_queue(10);
queue.forEach(item => {
  console.log(`${item.id}: ${item.retry_count} retries`);
});

// Get permanently failed items
const failed = get_failed_embeddings();
failed.forEach(item => {
  console.log(`${item.id}: ${item.failure_reason}`);
});
```

### Example 3: Manual Retry with Content Loader

```javascript
const { process_retry_queue } = require('./providers');
const fs = require('fs/promises');

// Custom content loader for retries
const contentLoader = async (memory) => {
  return await fs.readFile(memory.file_path, 'utf-8');
};

const result = await process_retry_queue(5, contentLoader);
console.log(`Processed: ${result.processed}, Succeeded: ${result.succeeded}`);
```

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| Generate embedding | `generate_embedding(text)` | Index new content |
| Check queue stats | `get_retry_stats()` | Monitor health |
| Process retries | `process_retry_queue(limit)` | Manual retry trigger |
| Reset failed | `reset_for_retry(id)` | Re-attempt specific item |
| Start background | `start_background_job()` | Server startup |

---

## 5. 🔗 RELATED RESOURCES

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [lib/README.md](../README.md) | Parent library overview |
| [embeddings/README.md](../embeddings/README.md) | Provider chain and fallback |
| [search/README.md](../search/README.md) | Vector search using embeddings |

### External Resources

| Resource | Description |
|----------|-------------|
| [Voyage AI Docs](https://docs.voyageai.com/) | Primary embedding provider |
| [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings) | Alternative provider |

---

*Documentation version: 1.0 | Last updated: 2026-02-02*
