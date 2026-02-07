---
title: JavaScript Quick Reference
description: Copy-paste templates, naming cheat sheet, and common patterns for JavaScript development.
---

# JavaScript Quick Reference

Copy-paste templates, naming cheat sheet, and common patterns for JavaScript development.

---

## 1. 📖 OVERVIEW

### Purpose

Quick-access reference card for JavaScript patterns. For detailed explanations, see:
- [style_guide.md](./style_guide.md) - Full style documentation
- [quality_standards.md](./quality_standards.md) - Quality requirements

---

## 2. 📋 COMPLETE FILE TEMPLATE

```javascript
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ [Module Name]                                                             ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_TIMEOUT = 5000;
const MAX_RETRIES = 3;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function validateInput(input) {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Invalid input' };
  }
  return { valid: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Main function description.
 *
 * @param {string} input - Input description
 * @param {Object} [options] - Configuration options
 * @returns {Promise<Object>} Result object
 */
async function mainFunction(input, options = {}) {
  const validation = validateInput(input);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    const result = await process(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(`[module-name] Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  // Primary exports (camelCase)
  mainFunction,
  validateInput,

  // Backward-compatible aliases (snake_case) — MCP handlers only
  main_function: mainFunction,
  validate_input: validateInput
};
```

---

## 3. 🏷️ NAMING CHEAT SHEET

| Element          | Convention         | Example              |
|------------------|--------------------|----------------------|
| Functions        | `camelCase`        | `loadConfig`         |
| Constants        | `UPPER_SNAKE_CASE` | `MAX_RETRIES`        |
| Classes          | `PascalCase`       | `MemoryError`        |
| Local variables  | `camelCase`        | `searchResults`      |
| Module variables | `camelCase`        | `dbConnection`       |
| Parameters       | `camelCase`        | `queryText`          |
| Booleans         | `is`/`has`/`can`   | `isValid`            |
| Files            | `kebab-case`       | `memory-search.js`   |

---

## 4. 📌 SECTION ORDERING

```
1. IMPORTS          (Node built-ins, third-party, local)
2. CONSTANTS        (Configuration values)
3. HELPERS          (Internal utility functions)
4. CORE LOGIC       (Main implementation)
5. EXPORTS          (Module public interface)
```

---

## 5. 📚 JSDOC TEMPLATE

```javascript
/**
 * Brief description of function purpose.
 *
 * @param {string} query - Required parameter description
 * @param {Object} [options] - Optional parameter with defaults
 * @param {number} [options.limit=10] - Optional property with default
 * @param {string} [options.filter] - Optional property
 * @returns {Promise<Array<Object>>} Description of return value
 * @throws {MemoryError} When database connection fails
 *
 * @example
 * const results = await search('query', { limit: 5 });
 */
```

---

## 6. 📋 EXPORT PATTERN TEMPLATE

```javascript
module.exports = {
  // Primary (camelCase)
  functionOne,
  functionTwo,

  // Backward-compatible aliases (snake_case) — MCP handlers only
  function_one: functionOne,
  function_two: functionTwo,

  // Constants
  DEFAULT_VALUE,

  // Classes
  CustomError
};
```

---

## 7. 🚨 ERROR HANDLING PATTERNS

### Guard Clause

```javascript
if (!input || typeof input !== 'string') {
  return { success: false, error: 'Invalid input' };
}
```

### Try-Catch

```javascript
try {
  const result = await operation();
  return { success: true, data: result };
} catch (error) {
  console.error(`[module] Failed: ${error.message}`);
  return { success: false, error: error.message };
}
```

### Custom Error

```javascript
class CustomError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
  }
}
```

---

## 8. 📌 COMMON ONE-LINERS

```javascript
// Logging with module prefix
console.log(`[module-name] Message here`);

// Default parameter
const { limit = 10 } = options;

// Null coalescing
const value = input ?? defaultValue;

// Optional chaining
const name = user?.profile?.name;

// Array check
if (!Array.isArray(items)) { }

// Object check
if (!obj || typeof obj !== 'object') { }

// String check
if (!str || typeof str !== 'string') { }

// Path resolution (safe)
const resolved = path.resolve(basePath, relativePath);
```

---

## 9. 📦 IMPORT ORDER

```javascript
// 1. Node.js built-ins
const fs = require('fs');
const path = require('path');

// 2. Third-party modules
const yaml = require('js-yaml');

// 3. Local modules
const { loadConfig } = require('./config');
```

---

## 10. 💡 ASYNC PATTERNS

```javascript
// Async function
async function fetchData() {
  const result = await database.query();
  return result;
}

// Parallel execution
const [a, b] = await Promise.all([fetchA(), fetchB()]);

// Error handling
async function safeFetch() {
  try {
    return { success: true, data: await fetch() };
  } catch (e) {
    return { success: false, error: e.message };
  }
}
```

---

## 11. 🔗 RELATED RESOURCES

- [style_guide.md](./style_guide.md) - Detailed formatting rules
- [quality_standards.md](./quality_standards.md) - Error handling, JSDoc, security
