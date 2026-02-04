---
title: JavaScript Quality Standards
description: Module organization, error handling, documentation, and security patterns for JavaScript files.
---

# JavaScript Quality Standards

Module organization, error handling, documentation, and security patterns for JavaScript files.

---

## 1. 📦 MODULE ORGANIZATION

### CommonJS Pattern

All modules use CommonJS format with `'use strict'` directive.

```javascript
'use strict';

// ... imports and implementation ...

module.exports = {
  // Exports here
};
```

**Evidence**: `scripts/core/config.js:1-183`

### Export Pattern

Export functions using `snake_case` names with optional `camelCase` aliases for backward compatibility.

```javascript
// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  // Primary exports (snake_case - preferred)
  load_config,
  memory_search,
  validate_input,

  // Aliases for backward compatibility (camelCase)
  loadConfig: load_config,
  memorySearch: memory_search,
  validateInput: validate_input
};
```

**Evidence**: `scripts/core/config.js:167-183`

### Barrel Exports

Index files re-export from multiple modules.

```javascript
// index.js
'use strict';

module.exports = {
  ...require('./config'),
  ...require('./database'),
  ...require('./search')
};
```

---

## 2. 🚨 ERROR HANDLING

### Guard Clause Pattern

Validate inputs at function start. Return early on failure.

```javascript
function process_data(input, options) {
  // Guard clauses first
  if (!input || typeof input !== 'string') {
    return { success: false, error: 'Invalid input: expected string' };
  }

  if (!options || typeof options !== 'object') {
    return { success: false, error: 'Invalid options: expected object' };
  }

  // Main logic after guards pass
  const result = transform(input, options);
  return { success: true, data: result };
}
```

**Evidence**: `mcp_server/handlers/memory-search.js:55-69`

### Try-Catch Pattern

Wrap async operations with specific error handling.

```javascript
async function fetch_data(query) {
  try {
    const result = await database.query(query);
    return { success: true, data: result };
  } catch (error) {
    logger.error(`[fetch_data] Query failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}
```

**Evidence**: `mcp_server/handlers/memory-search.js:363-400`

### Custom Error Classes

Extend Error for domain-specific errors.

```javascript
/**
 * Custom error for memory operations.
 */
class MemoryError extends Error {
  /**
   * Create a MemoryError.
   * @param {string} message - Error description
   * @param {string} code - Error code (e.g., 'DB_CONNECTION_FAILED')
   * @param {Object} [context] - Additional context
   */
  constructor(message, code, context = {}) {
    super(message);
    this.name = 'MemoryError';
    this.code = code;
    this.context = context;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { MemoryError };
```

**Evidence**: `mcp_server/lib/errors/core.js:52-63`

### Error Response Pattern

Consistent error response structure.

```javascript
// Success response
{ success: true, data: result }

// Error response
{ success: false, error: 'Error message', code: 'ERROR_CODE' }
```

---

## 3. 📝 CONSOLE LOGGING

### Bracketed Module Prefix

All console output uses bracketed module identifier.

```javascript
// Format: [module-name] Message
console.log(`[context-server] Server started on port ${port}`);
console.error(`[memory-search] Search failed: ${error.message}`);
console.warn(`[config] Using default value for missing key: ${key}`);
```

**Evidence**: `mcp_server/context-server.js:204`

### Log Levels

| Level   | Usage                            | Example                                    |
|---------|----------------------------------|--------------------------------------------|
| `log`   | General information              | `[server] Request received`                |
| `error` | Errors requiring attention       | `[db] Connection failed: timeout`          |
| `warn`  | Potential issues, fallbacks      | `[config] Missing value, using default`    |
| `debug` | Development-only verbose output  | `[search] Query plan: ${JSON.stringify()}` |

---

## 4. 📚 JSDOC DOCUMENTATION

### Function Documentation

Required for all exported functions.

```javascript
/**
 * Search memory database for matching entries.
 *
 * @param {string} query - Search query text
 * @param {Object} options - Search configuration
 * @param {number} [options.limit=10] - Maximum results to return
 * @param {string} [options.specFolder] - Filter by spec folder path
 * @param {string[]} [options.anchors] - Filter by anchor types
 * @returns {Promise<Array<Object>>} Array of matching memory entries
 * @throws {MemoryError} If database connection fails
 *
 * @example
 * const results = await memory_search('authentication', {
 *   limit: 5,
 *   specFolder: 'specs/007-auth'
 * });
 */
async function memory_search(query, options = {}) {
  // implementation
}
```

**Evidence**: `mcp_server/handlers/memory-search.js:333-361`

### Type Annotations

Common JSDoc type patterns.

```javascript
/**
 * @param {string} name - Required string parameter
 * @param {number} [count=10] - Optional with default
 * @param {Object} config - Object parameter
 * @param {string} config.path - Required property
 * @param {boolean} [config.verbose] - Optional property
 * @param {string|null} value - Union type
 * @param {Array<string>} items - Typed array
 * @param {Promise<Object>} result - Promise type
 * @param {Function} callback - Function type
 */
```

### Class Documentation

```javascript
/**
 * Manages vector-based semantic search index.
 *
 * @class
 * @example
 * const index = new VectorIndex(dbPath);
 * await index.initialize();
 */
class VectorIndex {
  /**
   * Create a VectorIndex instance.
   * @param {string} dbPath - Path to SQLite database
   */
  constructor(dbPath) {
    this.dbPath = dbPath;
  }
}
```

---

## 5. 🔒 SECURITY PATTERNS

### CWE-22: Path Traversal Prevention

Validate and sanitize file paths.

```javascript
const path = require('path');

/**
 * Safely resolve path within allowed directory.
 * @param {string} basePath - Allowed base directory
 * @param {string} userPath - User-provided path
 * @returns {string|null} Resolved path or null if invalid
 */
function safe_resolve_path(basePath, userPath) {
  // Normalize and resolve
  const resolvedBase = path.resolve(basePath);
  const resolvedPath = path.resolve(basePath, userPath);

  // Verify path stays within base
  if (!resolvedPath.startsWith(resolvedBase + path.sep)) {
    console.error(`[security] Path traversal attempt: ${userPath}`);
    return null;
  }

  return resolvedPath;
}
```

### CWE-400: Input Limits

Prevent resource exhaustion with input validation.

```javascript
const MAX_QUERY_LENGTH = 10000;
const MAX_RESULTS = 100;

function validate_search_input(query, options) {
  // Limit query length
  if (query && query.length > MAX_QUERY_LENGTH) {
    return { valid: false, error: `Query exceeds ${MAX_QUERY_LENGTH} characters` };
  }

  // Limit result count
  if (options.limit && options.limit > MAX_RESULTS) {
    options.limit = MAX_RESULTS;
    console.warn(`[search] Limit capped to ${MAX_RESULTS}`);
  }

  return { valid: true };
}
```

### Input Sanitization

```javascript
/**
 * Sanitize string input for safe use.
 * @param {string} input - Raw user input
 * @returns {string} Sanitized string
 */
function sanitize_string(input) {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove null bytes
  return input.replace(/\0/g, '');
}
```

---

## 6. 🧪 TESTING PATTERNS

### Using Node.js Assert

```javascript
const assert = require('assert');

// Test function
function test_load_config() {
  const config = load_config('./test-config.yaml');

  assert.ok(config, 'Config should be loaded');
  assert.strictEqual(config.version, '1.0.0', 'Version should match');
  assert.deepStrictEqual(config.features, ['a', 'b'], 'Features should match');
}

// Run tests
if (require.main === module) {
  test_load_config();
  console.log('[test] All tests passed');
}
```

### Test File Organization

```javascript
// tests/test_config.js
'use strict';

const assert = require('assert');
const { load_config, validate_config } = require('../scripts/core/config');

describe('Config Module', () => {
  describe('load_config', () => {
    it('should load valid YAML config', () => {
      const config = load_config('./fixtures/valid.yaml');
      assert.ok(config);
    });

    it('should return null for missing file', () => {
      const config = load_config('./nonexistent.yaml');
      assert.strictEqual(config, null);
    });
  });
});
```

---

## 7. 💡 ASYNC PATTERNS

### Async/Await Style

Prefer async/await over callbacks and raw promises.

```javascript
// CORRECT: async/await
async function fetch_and_process() {
  try {
    const data = await fetch_data();
    const result = await process_data(data);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// AVOID: Promise chains
function fetch_and_process() {
  return fetch_data()
    .then(data => process_data(data))
    .then(result => ({ success: true, data: result }))
    .catch(error => ({ success: false, error: error.message }));
}
```

### Parallel Operations

```javascript
// Parallel execution
const [users, posts] = await Promise.all([
  fetch_users(),
  fetch_posts()
]);

// Sequential execution (when order matters)
const user = await fetch_user(id);
const posts = await fetch_user_posts(user.id);
```

---

## 8. 🔗 RELATED RESOURCES

- [style_guide.md](./style_guide.md) - Formatting and naming conventions
- [quick_reference.md](./quick_reference.md) - Copy-paste templates and cheat sheets
