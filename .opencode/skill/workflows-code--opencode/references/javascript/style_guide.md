---
title: JavaScript Style Guide
description: Formatting standards and naming conventions for JavaScript files in the OpenCode development environment.
---

# JavaScript Style Guide

Formatting standards and naming conventions for JavaScript files in the OpenCode development environment.

---

## 1. 📄 FILE HEADER FORMAT

All JavaScript files MUST begin with a boxed header identifying the module.

### Template

```javascript
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ [Module Name]                                                             ║
// ╚══════════════════════════════════════════════════════════════════════════╝
```

### Requirements

- Box width: 78 characters total
- Module name: Centered or left-aligned within box
- Immediately followed by `'use strict';` directive

**Evidence**: `scripts/utils/logger.js:1-3`, `mcp_server/lib/errors/core.js:1-3`

---

## 2. ⚙️ USE STRICT DIRECTIVE

Every JavaScript file MUST include the strict mode directive.

```javascript
'use strict';
```

**Placement**: Immediately after file header, before any other code.

**Evidence**: `scripts/core/config.js:5`, `mcp_server/context-server.js:5`

---

## 3. 📁 SECTION ORGANIZATION

Large files are organized using numbered section dividers.

### Section Divider Template

```javascript
// ─────────────────────────────────────────────────────────────────────────────
// 1. [SECTION NAME]
// ─────────────────────────────────────────────────────────────────────────────
```

### Standard Section Order

| Order | Section Name     | Purpose                           |
|-------|------------------|-----------------------------------|
| 1     | IMPORTS/REQUIRES | Module dependencies               |
| 2     | CONSTANTS        | Configuration values, magic numbers |
| 3     | HELPERS          | Internal utility functions        |
| 4     | CORE LOGIC       | Main implementation               |
| 5     | EXPORTS          | Module public interface           |

**Evidence**: `scripts/core/config.js:6-8,16-18,75-77,139-141,167-169`

---

## 4. 🏷️ NAMING CONVENTIONS

### Function Names

**Style**: `snake_case`

```javascript
// CORRECT
function load_config(path) { }
function memory_search(query, options) { }
function validate_input(data) { }

// INCORRECT
function loadConfig(path) { }      // camelCase
function LoadConfig(path) { }      // PascalCase
function load-config(path) { }     // kebab-case (invalid syntax)
```

**Evidence**: `scripts/core/config.js:78-106`, `mcp_server/handlers/memory-search.js:363-400`

### Constant Names

**Style**: `UPPER_SNAKE_CASE`

```javascript
// CORRECT
const MAX_RETRIES = 3;
const DEFAULT_TIMEOUT = 5000;
const SQLITE_BUSY_TIMEOUT = 30000;

// INCORRECT
const maxRetries = 3;       // camelCase
const max_retries = 3;      // snake_case (reserved for variables)
```

**Evidence**: `mcp_server/lib/database/connection.js:7-10`

### Class Names

**Style**: `PascalCase`

```javascript
// CORRECT
class MemoryError extends Error { }
class ConfigLoader { }
class VectorIndex { }

// INCORRECT
class memoryError { }       // camelCase
class memory_error { }      // snake_case
```

**Evidence**: `mcp_server/lib/errors/core.js:52-63`

### Variable Names

| Scope        | Style        | Example                    |
|--------------|--------------|----------------------------|
| Local        | `camelCase`  | `const searchResults = []` |
| Module-level | `snake_case` | `const db_path = '...'`    |
| Parameters   | `snake_case` | `function search(query, max_results)` |

**Evidence**: `mcp_server/handlers/memory-search.js:55-69`

### Naming Summary Table

| Element          | Convention         | Example                |
|------------------|--------------------|------------------------|
| Functions        | `snake_case`       | `load_config`          |
| Constants        | `UPPER_SNAKE_CASE` | `MAX_RETRIES`          |
| Classes          | `PascalCase`       | `MemoryError`          |
| Local variables  | `camelCase`        | `searchResults`        |
| Module variables | `snake_case`       | `db_connection`        |
| Parameters       | `snake_case`       | `query_text`           |

---

## 5. 📐 FORMATTING RULES

### Indentation

- **Size**: 2 spaces
- **Tabs**: Never use tabs

```javascript
// CORRECT (2 spaces)
function example() {
  if (condition) {
    return value;
  }
}

// INCORRECT (4 spaces or tabs)
function example() {
    if (condition) {
        return value;
    }
}
```

### Braces

**Style**: K&R (opening brace on same line)

```javascript
// CORRECT (K&R style)
if (condition) {
  // code
} else {
  // code
}

function example() {
  // code
}

// INCORRECT (Allman style)
if (condition)
{
  // code
}
```

### Semicolons

**Rule**: Always use semicolons

```javascript
// CORRECT
const value = 42;
return result;

// INCORRECT (ASI-dependent)
const value = 42
return result
```

### Quotes

**Rule**: Single quotes for strings

```javascript
// CORRECT
const message = 'Hello world';
const template = `Value: ${value}`;  // Template literals OK

// INCORRECT
const message = "Hello world";  // Double quotes
```

### Line Length

- **Maximum**: 100 characters
- **Preferred**: 80 characters
- **Exception**: URLs and long strings

---

## 6. 💬 COMMENTING RULES

### Principles

1. **Quantity limit:** Maximum 5 comments per 10 lines of code
2. **Focus on WHY, not WHAT:** Explain intent, constraints, reasoning
3. **No commented-out code:** Delete unused code (git preserves history)

### Reference Comments

Use bracketed module prefix for inline comments:

```javascript
// [module-name] Description of what this does
```

Use task/requirement prefixes for traceability:

```javascript
// T043-T047: Causal Memory Graph handlers
// REQ-033: Transaction manager for recovery
// SEC-001: Sanitize input (CWE-79)
// BUG-107: Pending file recovery on startup
```

**Evidence**: `mcp_server/context-server.js:35,42,61,67,204`

### Function Purpose Comments

Single line above function describing intent:

```javascript
// Load configuration from YAML file, merging with defaults
// Returns validated config object or throws on invalid schema
function load_config(config_path) { }

// Calculate weighted memory score using decay function
// Higher scores indicate more recent and relevant memories
function calculate_memory_score(memory, current_time) { }
```

### Inline Comments (WHY, Not WHAT)

**Good examples (explain reasoning):**

```javascript
// Guard: Skip if already initialized to prevent double-binding
if (window[INIT_FLAG]) return;

// Sort by recency so newest memories surface first
results.sort((a, b) => b.timestamp - a.timestamp);

// Add timeout to prevent infinite hang on unresponsive database
const timeout = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Timeout')), 30000)
);

// Use try-finally to ensure connection cleanup even on error
try {
  await process_batch(items);
} finally {
  db.close();
}
```

**Bad examples (narrate implementation):**

```javascript
// Set the value to 42
const value = 42;

// Loop through items
for (const item of items) { }

// Check if result exists
if (result) { }

// Add item to array
items.push(item);
```

### Debug Logging Pattern

```javascript
// Conditional logging for debug mode
const DEBUG = false;
const LOG_PREFIX = '[ModuleName]';

function log(...args) {
  if (DEBUG) {
    console.log(LOG_PREFIX, ...args);
  }
}

// Usage
log('Initialized with config:', config);
log('Processing batch:', batch.length, 'items');
```

### JSDoc Comments

Required for all exported functions. See `quality_standards.md` for full JSDoc format.

```javascript
/**
 * Brief description of function purpose.
 *
 * @param {string} query - Search query text
 * @param {Object} options - Search options
 * @param {number} options.limit - Maximum results to return
 * @returns {Array} Array of search results
 */
function search(query, options = {}) {
  // implementation
}
```

### TODO Comments

Format for tracking incomplete work.

```javascript
// TODO: [description of work needed]
// FIXME: [description of bug to fix]
```

---

## 7. 📦 IMPORT ORDER

Organize imports in three groups with blank lines between.

```javascript
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

// Node.js built-ins
const fs = require('fs');
const path = require('path');

// Third-party modules
const yaml = require('js-yaml');
const sqlite = require('better-sqlite3');

// Local modules
const { load_config } = require('./config');
const logger = require('../utils/logger');
```

**Evidence**: `mcp_server/context-server.js:7-15`

---

## 8. 🔗 RELATED RESOURCES

- [quality_standards.md](./quality_standards.md) - Error handling, JSDoc, security patterns
- [quick_reference.md](./quick_reference.md) - Copy-paste templates and cheat sheets
