---
title: "MCP Server Utilities"
description: "Utility modules for input validation, JSON operations, and batch processing."
trigger_phrases:
  - "MCP utilities"
  - "input validation"
  - "batch processing"
importance_tier: "normal"
---

# MCP Server Utilities

> Utility modules for input validation, JSON operations, and batch processing.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. ⚡ FEATURES](#4--features)
- [5. 💡 USAGE EXAMPLES](#5--usage-examples)
- [6. 🛠️ TROUBLESHOOTING](#6--troubleshooting)
- [7. 📚 RELATED DOCUMENTS](#7--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

## 1. 📖 OVERVIEW
<!-- ANCHOR:overview -->

The utilities module provides essential support functions for the MCP server, including input validation (with security hardening against CWE-400 resource exhaustion), safe JSON parsing/serialization, and batch processing with automatic retry logic. These utilities ensure robustness, security, and reliability across all MCP operations.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Utility Modules | 4 | validators, json-helpers, batch-processor, db-helpers |
| Validation Functions | 4 | Query, input lengths, file paths, default paths |
| JSON Helpers | 3 | Safe parse, stringify, typed parse |
| Batch Functions | 3 | With retry, batches, sequential |

### Key Features

| Feature | Description |
|---------|-------------|
| **Input Validation** | Length limits, type checking, sanitization (CWE-400 mitigation) |
| **Safe JSON Operations** | Parse/stringify with error handling, type validation |
| **Batch Processing** | Process large datasets in chunks with rate limiting |
| **Retry Logic** | Automatic retry with exponential backoff for transient failures |
| **Path Validation** | Security checks for file paths to prevent directory traversal |
| **Dual Naming** | Both snake_case and camelCase exports for compatibility |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18+ | 20+ |

<!-- /ANCHOR:overview -->

---

## 2. 🚀 QUICK START
<!-- ANCHOR:quick-start -->

### 30-Second Setup

```typescript
// 1. Import utils barrel export
import * as utils from './utils';

// 2. Use validators
utils.validate_query('search term');

// 3. Use JSON helpers
const obj = utils.safe_json_parse(jsonString);

// 4. Use batch processor
await utils.process_batches(items, processor);
```

### Verify Installation

```typescript
// Check utils are loaded
import * as utils from './utils';
console.log(Object.keys(utils));
// Expected: ['validate_query', 'safe_json_parse', 'process_batches', ...]
```

### First Use

```typescript
// Example: Validate user input
import * as utils from './utils';

try {
  const query = utils.validate_query(userInput);
  console.log('Valid query:', query);
} catch (err) {
  console.error('Validation failed:', err.message);
}
```

<!-- /ANCHOR:quick-start -->

---

## 3. 📁 STRUCTURE
<!-- ANCHOR:structure -->

```
utils/
├── validators.ts           # Input validation and security checks
├── json-helpers.ts         # Safe JSON parsing and serialization
├── batch-processor.ts      # Batch processing with retry logic
├── db-helpers.ts           # Database utility functions
├── index.ts                # Barrel export with dual naming
└── README.md               # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `validators.ts` | Input validation, length limits, path security (CWE-400 mitigation) |
| `json-helpers.ts` | Safe JSON operations with error handling and type validation |
| `batch-processor.ts` | Batch processing, retry logic, rate limiting for large datasets |
| `db-helpers.ts` | Database utility functions for common database operations |
| `index.ts` | Barrel export providing both snake_case and camelCase naming |

<!-- /ANCHOR:structure -->

---

## 4. ⚡ FEATURES
<!-- ANCHOR:features -->

### Input Validation

**Query Validation**: Sanitize and validate search queries

| Aspect | Details |
|--------|---------|
| **Purpose** | Prevent injection attacks, resource exhaustion (CWE-400) |
| **Usage** | `validate_query(query)` |
| **Checks** | Non-null, string type, trimmed, max length (10,000 chars) |

**Input Length Validation**: Enforce limits across all user inputs

```typescript
const INPUT_LIMITS = {
  query: 10000,       // Search queries
  title: 500,         // Memory titles
  specFolder: 200,    // Spec folder paths
  contextType: 100,   // Context type values
  name: 200,          // Checkpoint names
  prompt: 10000,      // Trigger match prompts
  filePath: 500       // File paths
};

// Validate multiple inputs at once
validate_input_lengths({ query: userQuery, title: memoryTitle });
```

**File Path Validation**: Prevent directory traversal attacks

| Aspect | Details |
|--------|---------|
| **Purpose** | Ensure file paths are within allowed directories |
| **Usage** | `create_file_path_validator(allowedPaths)` |
| **Security** | Blocks `..`, absolute paths outside allowed directories |

```typescript
// Create validator for specific allowed paths
const validatePath = create_file_path_validator([
  '/allowed/path1',
  '/allowed/path2'
]);

// Validate path
const safePath = validatePath('/allowed/path1/file.md');
// Throws error if path is outside allowed directories
```

### JSON Helpers

**Safe JSON Parse**: Parse with error handling

| Aspect | Details |
|--------|---------|
| **Purpose** | Prevent crashes from malformed JSON |
| **Usage** | `safe_json_parse(jsonString, defaultValue)` |
| **Returns** | Parsed object or default value on error |

```typescript
// Parse with fallback
const data = safe_json_parse(jsonString, { fallback: 'default' });

// Parse with null default (explicit error handling)
const data = safe_json_parse(jsonString, null);
if (data === null) {
  console.error('Invalid JSON');
}
```

**Safe JSON Stringify**: Serialize with error handling

```typescript
// Stringify with fallback
const jsonString = safe_json_stringify(obj, '{}');

// Pretty print
const jsonString = safe_json_stringify(obj, null, 2);
```

**Typed JSON Parse**: Parse with type validation

```typescript
// Ensure result is an array
const items = safe_json_parse_typed(jsonString, 'array', []);

// Ensure result is an object
const config = safe_json_parse_typed(jsonString, 'object', {});
```

### Batch Processing

**Process Batches**: Handle large datasets efficiently

| Aspect | Details |
|--------|---------|
| **Purpose** | Prevent memory exhaustion, rate limiting |
| **Usage** | `process_batches(items, processor, options)` |
| **Options** | `batchSize` (default: 50), `delayMs` (default: 100), `retryOptions` |

```typescript
const results = await process_batches(
  largeArray,
  async (batch) => {
    // Process each batch
    return await processItems(batch);
  },
  {
    batchSize: 100,
    delayMs: 200,
    retryOptions: { maxRetries: 3, baseDelayMs: 1000 }
  }
);
```

**Process with Retry**: Automatic retry for transient failures

```typescript
const result = await process_with_retry(
  item,                    // Item to process
  async (item) => {        // Processor function
    // Operation that might fail
    return await apiCall(item);
  },
  {
    max_retries: 2,        // Maximum retry attempts (default: 2)
    retry_delay: 1000      // Base delay between retries in ms (default: 1000)
  }
);
// Uses exponential backoff: delay = retry_delay * (attempt + 1)
```

**Process Sequentially**: Process items one at a time

```typescript
const results = await process_sequentially(
  items,
  async (item) => {
    // Process each item
    return await processItem(item);
  },
  { max_retries: 2, retry_delay: 1000 }
);
```

<!-- /ANCHOR:features -->

---

## 5. 💡 USAGE EXAMPLES
<!-- ANCHOR:examples -->

### Example 1: Validate User Input

```typescript
import { validate_query, validate_input_lengths } from './utils';

try {
  // Validate search query
  const query = validate_query(req.query.search);

  // Validate multiple inputs
  validate_input_lengths({
    query: req.query.search,
    title: req.body.title,
    specFolder: req.body.folder
  });

  // Proceed with validated inputs
  const results = await searchMemories(query);
  res.json(results);

} catch (err) {
  res.status(400).json({ error: err.message });
}
```

**Result**: Rejects invalid inputs before processing, preventing security issues

### Example 2: Safe JSON Operations

```typescript
import { safe_json_parse, safe_json_stringify } from './utils';

// Parse untrusted JSON
const config = safe_json_parse(userProvidedJSON, {
  // Default config if parse fails
  theme: 'light',
  limit: 10
});

// Serialize with error handling
const response = safe_json_stringify({
  results: data,
  count: data.length
}, '{"error": "serialization failed"}');

res.send(response);
```

### Example 3: Batch Process Large Dataset

```typescript
import { process_batches } from './utils';

// Process 10,000 memories in batches of 50
const allMemories = await getAllMemories(); // 10,000 items

const results = await process_batches(
  allMemories,
  async (batch) => {
    // Process each batch of 50
    const embeddings = await getEmbeddings(batch.map(m => m.content));

    // Save embeddings
    return await saveEmbeddings(batch, embeddings);
  },
  {
    batchSize: 50,
    delayMs: 100,  // 100ms between batches (rate limiting)
    retryOptions: { maxRetries: 3 }
  }
);

console.log(`Processed ${results.flat().length} memories`);
```

**Result**: Processes large dataset without overwhelming API or memory

### Example 4: Retry Failed Operations

```typescript
import { process_with_retry } from './utils';

// Retry API call with exponential backoff
const embedding = await process_with_retry(
  text,                           // Item to process
  async (text) => {               // Processor function
    return await voyageAI.embed(text);
  },
  {
    max_retries: 3,               // Maximum retry attempts
    retry_delay: 1000             // Base delay (1s)
  }
);

// Retry sequence with exponential backoff:
// Attempt 1: immediate
// Attempt 2: 1s delay (retry_delay * 1)
// Attempt 3: 2s delay (retry_delay * 2)
// Attempt 4: 3s delay (retry_delay * 3)
```

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| Validate before use | `const q = validate_query(input);` | All user inputs |
| Safe parse with default | `safe_json_parse(str, {})` | Untrusted JSON |
| Batch + retry | `process_batches(items, fn, 50, 100, { max_retries: 2 })` | Large datasets, external APIs |
| Sequential processing | `process_sequentially(items, fn)` | Order-dependent operations |

<!-- /ANCHOR:examples -->

---

## 6. 🛠️ TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

### Common Issues

#### Validation errors rejecting valid input

**Symptom**: `Error: Query exceeds maximum length` for reasonable input

**Cause**: Input limits configured too low for use case

**Solution**:
```typescript
import { INPUT_LIMITS, validate_query } from './utils';

// Check current limits
console.log('Query limit:', INPUT_LIMITS.query); // 10000

// If needed, increase limits in validators.ts
// Or truncate input before validation
const truncated = input.slice(0, INPUT_LIMITS.query);
const valid = validate_query(truncated);
```

#### Batch processing not retrying failures

**Symptom**: Batch processing stops on first error, no retry

**Cause**: Missing or incorrect retry options

**Solution**:
```typescript
import { process_batches } from './utils';

// Ensure retry options are provided (positional arguments)
await process_batches(
  items,
  processFn,
  50,                        // batch_size
  100,                       // delay_ms between batches
  {
    max_retries: 3,          // Must be > 0 for retries
    retry_delay: 1000        // Base delay in ms
  }
);

// Check logs for retry attempts
// Should see: "[batch-retry] Attempt 1/4 failed, retrying in 1000ms: ..."
```

#### JSON parse returning default too often

**Symptom**: `safe_json_parse()` always returns default value

**Cause**: Input is not valid JSON, or is JSON but malformed

**Solution**:
```typescript
import { safe_json_parse } from './utils';

// Add logging to diagnose
const result = safe_json_parse(jsonString, null);
if (result === null) {
  console.error('Failed to parse JSON:', jsonString);
  // Inspect the actual string
  console.log('Type:', typeof jsonString);
  console.log('Length:', jsonString?.length);
}

// Use JSON.parse directly to see actual error
try {
  JSON.parse(jsonString);
} catch (err) {
  console.error('Parse error:', err.message);
}
```

#### File path validation blocking valid paths

**Symptom**: `Error: File path is not within allowed directories`

**Cause**: Allowed paths not configured correctly or path format mismatch

**Solution**:
```typescript
import { create_file_path_validator, get_default_allowed_paths } from './utils';

// Allowed paths must be absolute
const validator = create_file_path_validator([
  '/Users/name/project/specs',  // ✅ Correct
  'specs'                        // ❌ Wrong (relative)
]);

// Or use default allowed paths
const allowedPaths = get_default_allowed_paths();
console.log('Allowed:', allowedPaths);
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Validation too strict | Check `INPUT_LIMITS` constants, adjust if needed |
| Batch processing fails | Add retry options with `max_retries > 0` |
| JSON parse issues | Log input, check with `JSON.parse()` directly |
| Path validation errors | Use absolute paths, check with `get_default_allowed_paths()` |

### Diagnostic Commands

```typescript
import * as utils from './utils';
import { INPUT_LIMITS, safe_json_parse, process_batches } from './utils';

// Check loaded utilities
console.log('Available:', Object.keys(utils));

// Test validation limits
console.log('Limits:', INPUT_LIMITS);

// Test safe JSON parse
console.log('Valid JSON:', safe_json_parse('{"a":1}', null));
console.log('Invalid JSON:', safe_json_parse('{invalid}', { fallback: true }));

// Test batch processing
const items = [1, 2, 3, 4, 5];
process_batches(items, async (batch) => {
  console.log('Batch:', batch);
  return batch;
}).then(results => console.log('Results:', results.flat()));
```

<!-- /ANCHOR:troubleshooting -->

---

## 7. 📚 RELATED DOCUMENTS
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [MCP Server README](../README.md) | Overview of the MCP server architecture |
| [Library README](../lib/README.md) | Library modules using these utilities |
| [Tests README](../tests/README.md) | Test suite validating utility functions |

### Utility Modules

| Module | Purpose |
|--------|---------|
| `validators.ts` | Input validation, security checks (CWE-400 mitigation) |
| `json-helpers.ts` | Safe JSON operations with error handling |
| `batch-processor.ts` | Batch processing, retry logic, rate limiting |

### Security References

| Reference | Description |
|----------|-------------|
| [CWE-400](https://cwe.mitre.org/data/definitions/400.html) | Uncontrolled Resource Consumption mitigation |
| [Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) | OWASP input validation best practices |
| [Path Traversal](https://owasp.org/www-community/attacks/Path_Traversal) | Directory traversal attack prevention |

### External Resources

| Resource | Description |
|----------|-------------|
| [Node.js Path](https://nodejs.org/api/path.html) | Path manipulation utilities |
| [Exponential Backoff](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/) | Retry strategy best practices |
| [JSON.parse MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) | Native JSON parsing reference |

---

*Documentation version: 1.2 | Last updated: 2026-02-11*

<!-- /ANCHOR:related -->
