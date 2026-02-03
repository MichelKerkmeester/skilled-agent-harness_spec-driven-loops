# Cache Module

> Tool output caching with 60s TTL, LRU eviction, and write-through invalidation.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 📁 STRUCTURE](#2--structure)
- [3. ⚡ FEATURES](#3--features)
- [4. 💡 USAGE](#4--usage)
- [5. 🔗 RELATED RESOURCES](#5--related-resources)

---

## 1. 📖 OVERVIEW

The cache module provides in-memory caching for MCP tool outputs to reduce redundant operations and improve response times. It uses SHA-256 hashed keys for deterministic cache lookups and supports automatic TTL-based expiration.

### Key Characteristics

| Aspect | Value |
|--------|-------|
| **Default TTL** | 60 seconds |
| **Max Entries** | 1000 |
| **Eviction Strategy** | LRU (Least Recently Used) |
| **Cleanup Interval** | 30 seconds |
| **Key Generation** | SHA-256 hash of tool + canonicalized args |

### Configuration (Environment Variables)

| Variable | Default | Description |
|----------|---------|-------------|
| `ENABLE_TOOL_CACHE` | `true` | Enable/disable caching |
| `TOOL_CACHE_TTL_MS` | `60000` | TTL in milliseconds |
| `TOOL_CACHE_MAX_ENTRIES` | `1000` | Maximum cache entries |
| `TOOL_CACHE_CLEANUP_INTERVAL_MS` | `30000` | Cleanup interval in ms |

---

## 2. 📁 STRUCTURE

```
cache/
├── index.js        # Module aggregator with spread exports
└── tool-cache.js   # Core caching implementation
```

### Key Files

| File | Purpose |
|------|---------|
| `tool-cache.js` | Cache implementation with TTL, LRU eviction, invalidation |
| `index.js` | Re-exports tool-cache with direct module access |

---

## 3. ⚡ FEATURES

### Core Operations

| Function | Purpose |
|----------|---------|
| `get(key)` | Retrieve cached value (returns null if expired) |
| `set(key, value, options)` | Store value with TTL and tool tracking |
| `has(key)` | Check if key exists and is valid |
| `del(key)` | Delete specific cache entry |

### Cache Invalidation

| Function | Purpose |
|----------|---------|
| `invalidateByTool(toolName)` | Clear all entries for a specific tool |
| `invalidateByPattern(pattern)` | Clear entries matching regex pattern |
| `invalidateOnWrite(operation, context)` | Auto-invalidate after write operations |
| `clear()` | Clear entire cache |

### High-Level Wrapper

```javascript
// Execute with caching - returns cached result or executes function
await withCache(toolName, args, asyncFn, options);
```

### Statistics

| Metric | Description |
|--------|-------------|
| `hits` | Cache hit count |
| `misses` | Cache miss count |
| `evictions` | Entries removed (TTL or LRU) |
| `invalidations` | Entries explicitly invalidated |
| `hitRate` | Percentage of hits vs total requests |

---

## 4. 💡 USAGE

### Basic Import

```javascript
const { get, set, withCache, getStats } = require('./lib/cache');
```

### Simple Cache Operations

```javascript
const key = generateCacheKey('memory_search', { query: 'test' });

// Store value
set(key, searchResults, { toolName: 'memory_search', ttlMs: 30000 });

// Retrieve value
const cached = get(key);
```

### Execute with Caching

```javascript
const result = await withCache(
  'memory_search',
  { query: 'test' },
  async () => await performSearch({ query: 'test' }),
  { ttlMs: 60000 }
);
```

### Invalidate on Write

```javascript
// After memory_save operation
invalidateOnWrite('save', { specFolder: 'specs/001-feature' });
// Automatically clears memory_search, memory_match_triggers, etc.
```

### Monitor Cache Performance

```javascript
const stats = getStats();
// { hits: 42, misses: 8, hitRate: '84.00%', currentSize: 15, ... }
```

---

## 5. 🔗 RELATED RESOURCES

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../README.md](../README.md) | Parent lib directory overview |
| [../architecture/](../architecture/) | Layer definitions and token budgets |
| [../response/](../response/) | Response envelope formatting |

### Related Modules

| Module | Relationship |
|--------|--------------|
| `context-server.js` | Integrates caching for tool operations |
| `lib/search/` | Search operations benefit from caching |
