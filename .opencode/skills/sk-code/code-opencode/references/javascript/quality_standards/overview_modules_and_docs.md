---
title: JavaScript Quality Standards
description: Module organization, error handling, documentation, and security patterns for JavaScript files.
trigger_phrases:
  - "opencode javascript quality standards"
  - "javascript module organization"
  - "commonjs export pattern"
  - "javascript error handling standards"
importance_tier: normal
contextType: implementation
version: 1.0.0.15
---

# JavaScript Quality Standards

Module organization, error handling, documentation, and security patterns for JavaScript files.

---

## 1. OVERVIEW

### Purpose

Establishes module organization, error handling, documentation, and security patterns that all JavaScript code must follow.

### When to Use

- Writing new JavaScript modules
- Reviewing code for quality compliance
- Setting up error handling and security patterns

---

## 2. MODULE ORGANIZATION

### Module-System Boundary

Use the module format required by the file's package boundary and loader
contract. Do not force one JavaScript module style across all paths.

| Surface | Module Pattern | Notes |
|---------|----------------|-------|
| `.js/.cjs` Node utilities outside plugin loader paths | CommonJS with `'use strict'` | Default for legacy runtime helpers and standalone scripts |
| `.mjs` files | ESM | The verifier skips `'use strict'` enforcement for `.mjs` |
| `.opencode/plugins/*.{js,mjs,ts}` | ESM default export | Required by the OpenCode plugin loader |
| `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/*.{js,mjs,ts}` | ESM default export | Bridge helpers follow the plugin-loader contract |

### CommonJS Pattern

Non-plugin `.js/.cjs` modules use CommonJS format with `'use strict'`
directive.

```javascript
'use strict';

// ... imports and implementation ...

module.exports = {
  // Exports here
};
```

**Evidence**: Current TypeScript packages are ESM/NodeNext; this CommonJS
pattern applies to legacy `.js/.cjs` utility surfaces and test runners that use
`require`.

### Export Pattern

Export functions using `camelCase` names. For MCP handlers, include
`snake_case` aliases for backward compatibility. Do not apply this export shape
to OpenCode plugin paths; those use `export default`.

```javascript
// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  // Primary exports (camelCase)
  loadConfig,
  memorySearch,
  validateInput,

  // Backward-compatible aliases (snake_case) — MCP handlers only
  load_config: loadConfig,
  memory_search: memorySearch,
  validate_input: validateInput
};
```

**Evidence**: Legacy CommonJS export examples are historical; current
system-spec-kit TypeScript source uses ESM `export` statements and compiles per
workspace package settings.

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

## 3. ERROR HANDLING

### Guard Clause Pattern

Validate inputs at function start. Return early on failure.

```javascript
function processData(input, options) {
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

**Evidence**: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`

### Try-Catch Pattern

Wrap async operations with specific error handling.

```javascript
async function fetchData(query) {
  try {
    const result = await database.query(query);
    return { success: true, data: result };
  } catch (error) {
    logger.error(`[fetchData] Query failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}
```

**Evidence**: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`

### Custom Error Classes

Extend Error for domain-specific errors.

```javascript
/**
 * Custom error for memory operations.
 */
class MemoryError extends Error {
  /**
   * Create a MemoryError.
   * @param {string} code - Error code (e.g., 'DB_CONNECTION_FAILED')
   * @param {string} message - Error description
   * @param {Object} [details] - Additional details
   */
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'MemoryError';
    this.code = code;
    this.details = details;
    this.recoveryHint = undefined;
    Object.setPrototypeOf(this, MemoryError.prototype);
  }
}

module.exports = { MemoryError };
```

**Evidence**: `.opencode/skills/system-spec-kit/mcp_server/lib/errors/core.ts`

### Error Response Pattern

Consistent error response structure.

```javascript
// Success response
{ success: true, data: result }

// Error response
{ success: false, error: 'Error message', code: 'ERROR_CODE' }
```

---

## 4. CONSOLE LOGGING

### Bracketed Module Prefix

All console output uses bracketed module identifier.

```javascript
// Format: [module-name] Message
console.log(`[context-server] Server started on port ${port}`);
console.error(`[memory-search] Search failed: ${error.message}`);
console.warn(`[config] Using default value for missing key: ${key}`);
```

**Evidence**: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts`

### Log Levels

| Level   | Usage                            | Example                                    |
|---------|----------------------------------|--------------------------------------------|
| `log`   | General information              | `[server] Request received`                |
| `error` | Errors requiring attention       | `[db] Connection failed: timeout`          |
| `warn`  | Potential issues, fallbacks      | `[config] Missing value, using default`    |
| `debug` | Development-only verbose output  | `[search] Query plan: ${JSON.stringify()}` |

---

## 5. JSDOC DOCUMENTATION

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
 * const results = await memorySearch('authentication', {
 *   limit: 5,
 *   specFolder: 'specs/007-auth'
 * });
 */
async function memorySearch(query, options = {}) {
  // implementation
}
```

**Evidence**: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`

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

