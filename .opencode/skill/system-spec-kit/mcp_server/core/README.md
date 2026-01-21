# MCP Server Core Modules

> Central configuration, state management, and module coordination for the Spec Kit Memory MCP server.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. ⚡ FEATURES](#4--features)
- [5. 💡 USAGE EXAMPLES](#5--usage-examples)
- [6. 🛠️ TROUBLESHOOTING](#6--troubleshooting)
- [7. 📚 RELATED DOCUMENTS](#7--related-documents)

---

## 1. 📖 OVERVIEW

### What is this folder?

The `core/` folder contains essential infrastructure modules that provide configuration management, database state tracking, and shared utilities for the Spec Kit Memory MCP server. These modules are imported by all other server components.

### Key Features

| Feature | Description |
|---------|-------------|
| **Centralized Configuration** | Single source of truth for paths, limits, and system constants |
| **Database State Management** | External update detection, connection lifecycle, constitutional cache |
| **Mutex Protection** | HIGH-002 fix: Race condition prevention for concurrent requests |
| **Persistent Rate Limiting** | BUG-005 fix: Rate limit state survives server restarts |
| **Embedding Readiness** | Prevents search before model warmup completes |

### Requirements

| Requirement | Minimum | Purpose |
|-------------|---------|---------|
| Node.js | 18+ | Runtime environment |
| better-sqlite3 | 9.0.0+ | Database operations |

---

## 2. 🚀 QUICK START

### Using Core Modules in Your Code

```javascript
// Import all core exports (config + db-state)
const core = require('./core');

// Or import specific modules
const { config, dbState } = require('./core');
const { DATABASE_PATH, BATCH_SIZE } = require('./core/config');
const { check_database_updated } = require('./core/db-state');
```

### Initializing Database State

```javascript
const { dbState } = require('./core');

// Initialize with dependencies before use
dbState.init({
  vectorIndex,    // Vector index module
  checkpoints,    // Checkpoints module
  accessTracker,  // Access tracker module
  hybridSearch    // Hybrid search module
});

// Now safe to use db-state functions
await dbState.check_database_updated();
```

### Common Operations

```javascript
// Check for external database updates (BUG-001 fix)
const wasUpdated = await core.check_database_updated();
if (wasUpdated) {
  console.log('Database reinitialized after external update');
}

// Get persistent rate limit timestamp (BUG-005 fix)
const lastScan = await core.get_last_scan_time();
const now = Date.now();
if (now - lastScan < core.INDEX_SCAN_COOLDOWN) {
  throw new Error('Index scan on cooldown');
}

// Wait for embedding model before search
const ready = await core.wait_for_embedding_model(30000);
if (!ready) {
  throw new Error('Embedding model warmup timeout');
}
```

---

## 3. 📁 STRUCTURE

```
core/
├── index.js       # Module aggregator (re-exports config + db-state)
├── config.js      # Configuration constants and path management
└── db-state.js    # Database state management and lifecycle
```

### Key Files

| File | Purpose | Exports |
|------|---------|---------|
| `index.js` | Aggregates all core modules for convenient import | All config + db-state exports |
| `config.js` | Defines paths, limits, and system constants | 8 categories of constants |
| `db-state.js` | Manages database connection state and external updates | 12 state management functions |

---

## 4. ⚡ FEATURES

### config.js Features

**Path Constants**

| Constant | Description | Example Value |
|----------|-------------|---------------|
| `SERVER_DIR` | MCP server root directory | `/path/to/mcp_server` |
| `DATABASE_DIR` | Database storage location | `/path/to/database` |
| `DATABASE_PATH` | Main SQLite file | `context-index.sqlite` |
| `DB_UPDATED_FILE` | External update signal | `.db-updated` |
| `SHARED_DIR` | Shared utilities path | `/path/to/shared` |

**Batch Processing**

| Constant | Default | Environment Override | Description |
|----------|---------|---------------------|-------------|
| `BATCH_SIZE` | 5 | `SPEC_KIT_BATCH_SIZE` | Files processed concurrently |
| `BATCH_DELAY_MS` | 100 | `SPEC_KIT_BATCH_DELAY_MS` | Delay between batches |

**Rate Limiting**

| Constant | Value | Purpose |
|----------|-------|---------|
| `INDEX_SCAN_COOLDOWN` | 60000ms (1 min) | Prevents rapid repeated scans (L15) |

**Query Validation (SEC-003)**

| Constant | Value | Purpose |
|----------|-------|---------|
| `MAX_QUERY_LENGTH` | 10000 | Prevents resource exhaustion (BUG-007) |
| `INPUT_LIMITS.query` | 10000 | Search query max length |
| `INPUT_LIMITS.title` | 500 | Memory title max length |
| `INPUT_LIMITS.specFolder` | 200 | Spec folder path max length |

**Path Security**

| Constant | Description |
|----------|-------------|
| `DEFAULT_BASE_PATH` | Default workspace root (env or CWD) |
| `ALLOWED_BASE_PATHS` | Whitelist for file operations (prevents path traversal) |

### db-state.js Features

**External Update Detection (BUG-001 Fix)**

Detects when `generate-context.js` writes new memory files and reinitializes the database connection.

| Function | Purpose | Returns |
|----------|---------|---------|
| `check_database_updated()` | Check `.db-updated` file and reinit if needed | `Promise<boolean>` |
| `reinitialize_database()` | Close and reopen DB connection | `Promise<void>` |

**Mutex Protection (HIGH-002 Fix)**

Prevents race conditions when multiple concurrent requests trigger database reinitialization.

```javascript
// BEFORE (race condition):
// Request A: Calls reinitialize_database()
// Request B: Calls reinitialize_database() concurrently
// RESULT: Database corruption

// AFTER (mutex):
// Request A: Acquires mutex, reinitializes
// Request B: Waits for mutex release, skips reinit
// RESULT: Safe concurrent access
```

**Persistent Rate Limiting (BUG-005 Fix)**

Rate limit state persists across server restarts via database `config` table.

| Function | Purpose | Returns |
|----------|---------|---------|
| `get_last_scan_time()` | Retrieve last scan timestamp from DB | `Promise<number>` |
| `set_last_scan_time(time)` | Store scan timestamp in DB | `Promise<void>` |

**Embedding Model Readiness**

Prevents race conditions where search starts before model warmup completes.

| Function | Purpose | Returns |
|----------|---------|---------|
| `is_embedding_model_ready()` | Check if model ready | `boolean` |
| `set_embedding_model_ready(ready)` | Update readiness state | `void` |
| `wait_for_embedding_model(timeout_ms)` | Wait with timeout | `Promise<boolean>` |

**Constitutional Cache**

Caches constitutional memories for 60 seconds to reduce database load.

| Function | Purpose |
|----------|---------|
| `get_constitutional_cache()` | Retrieve cached constitutional memories |
| `set_constitutional_cache(cache)` | Update cache with timestamp |
| `get_constitutional_cache_time()` | Get cache creation timestamp |
| `clear_constitutional_cache()` | Invalidate cache |

---

## 5. 💡 USAGE EXAMPLES

### Example 1: External Update Detection

```javascript
const { check_database_updated } = require('./core');

// Check for external updates before each search
async function performSearch(query) {
  // BUG-001 fix: Detect external updates from generate-context.js
  await check_database_updated();

  // Safe to search - DB connection is current
  return vectorIndex.search(query);
}
```

**Result**: Searches always use latest indexed data, even after external updates.

### Example 2: Rate Limit with Persistence

```javascript
const { get_last_scan_time, set_last_scan_time, INDEX_SCAN_COOLDOWN } = require('./core');

async function indexScan() {
  const lastScan = await get_last_scan_time();
  const elapsed = Date.now() - lastScan;

  if (elapsed < INDEX_SCAN_COOLDOWN) {
    const wait = Math.ceil((INDEX_SCAN_COOLDOWN - elapsed) / 1000);
    throw new Error(`Index scan on cooldown. Wait ${wait} seconds.`);
  }

  // Perform scan...
  await performIndexing();

  // Update timestamp in database (BUG-005 fix)
  await set_last_scan_time(Date.now());
}
```

**Result**: Rate limits persist across server restarts - prevents abuse.

### Example 3: Safe Concurrent Initialization

```javascript
const { reinitialize_database } = require('./core');

// Multiple concurrent requests safely handled
await Promise.all([
  reinitialize_database(),  // HIGH-002 fix: Acquires mutex
  reinitialize_database(),  // Waits for first to complete
  reinitialize_database()   // Waits for first to complete
]);
// Result: Only one reinitialization, others wait
```

### Example 4: Embedding Model Warmup

```javascript
const { wait_for_embedding_model, set_embedding_model_ready } = require('./core');

// Server startup
async function startServer() {
  console.log('Warming up embedding model...');
  await warmupModel();
  set_embedding_model_ready(true);

  console.log('Server ready');
}

// Search handler
async function handleSearch(query) {
  const ready = await wait_for_embedding_model(30000);
  if (!ready) {
    throw new Error('Embedding model not ready');
  }

  return performSearch(query);
}
```

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| Check updates | `await check_database_updated()` | Before every search operation |
| Validate input | `if (query.length > MAX_QUERY_LENGTH)` | User-provided strings |
| Rate limit check | `await get_last_scan_time()` | Resource-intensive operations |
| Wait for model | `await wait_for_embedding_model()` | Startup or first search |

---

## 6. 🛠️ TROUBLESHOOTING

### Common Issues

#### Database Not Reloading After External Update

**Symptom**: New memory files indexed by `generate-context.js` don't appear in search results

**Cause**: `.db-updated` file not being created or read correctly

**Solution**:
```bash
# Verify update file exists
ls -la .opencode/skill/system-spec-kit/mcp_server/database/.db-updated

# Check timestamp is recent
cat .opencode/skill/system-spec-kit/mcp_server/database/.db-updated

# Force check in MCP server
# (Runs automatically before each memory_search call)
```

#### Race Condition Errors

**Symptom**: `SQLITE_BUSY` or database lock errors with concurrent requests

**Cause**: Multiple threads trying to reinitialize database simultaneously

**Solution**: HIGH-002 fix is already implemented - verify you're using `reinitialize_database()` from core module, not a custom implementation.

#### Rate Limit Not Persisting

**Symptom**: Rate limits reset after server restart

**Cause**: Not using `get_last_scan_time()` / `set_last_scan_time()` from core

**Solution**:
```javascript
// Use core functions, not local state
const { get_last_scan_time, set_last_scan_time } = require('./core');

// Store in database, not memory
await set_last_scan_time(Date.now());
```

#### Initialization Errors

**Symptom**: `db-state not initialized: vector_index is null`

**Cause**: `dbState.init()` not called before using db-state functions

**Solution**:
```javascript
const { dbState } = require('./core');

// Initialize before use
dbState.init({
  vectorIndex: yourVectorIndex,
  checkpoints: yourCheckpoints,
  accessTracker: yourAccessTracker,
  hybridSearch: yourHybridSearch
});
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| DB not updating | Check `.db-updated` file exists and timestamp is recent |
| Race conditions | Verify using core module `reinitialize_database()` |
| Rate limit resets | Use `get/set_last_scan_time()` from core, not local state |
| Init errors | Call `dbState.init()` with all dependencies |

### Diagnostic Commands

```bash
# Check database update signal
cat .opencode/skill/system-spec-kit/mcp_server/database/.db-updated

# Verify rate limit persistence
sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite \
  "SELECT * FROM config WHERE key='last_index_scan';"

# Check database connection
sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite \
  "SELECT COUNT(*) FROM memory_index;"
```

---

## 7. 📚 RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [MCP Server README](../README.md) | Complete server documentation with all 14 MCP tools |
| [Vector Index Module](../lib/search/vector-index.js) | Database operations using these config constants |
| [Context Server](../context-server.js) | Main server entry point that imports core modules |

### Configuration References

| Document | Purpose |
|----------|---------|
| [Search Weights Config](../configs/search-weights.json) | Search ranking configuration |
| [Environment Variables](../../references/config/environment_variables.md) | Environment variable reference |

### Bug Fix Documentation

| Fix | Description | File |
|-----|-------------|------|
| BUG-001 | External update detection | `db-state.js` lines 74-96 |
| HIGH-002 | Mutex for concurrent reinit | `db-state.js` lines 103-143 |
| BUG-005 | Persistent rate limiting | `db-state.js` lines 154-199 |
| BUG-007 | Query length validation | `config.js` lines 89-108 |
| SEC-003 | Input length limits | `config.js` lines 96-108 |

### External Resources

| Resource | Description |
|----------|-------------|
| [Spec Kit Memory Skill](../../SKILL.md) | Parent skill documentation |
| [Database Schema](../../references/memory/memory_system.md) | Memory database structure |

---

*Core modules version: 1.7.2 | Last updated: 2026-01-21*
