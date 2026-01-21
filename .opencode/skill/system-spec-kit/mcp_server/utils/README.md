# MCP Server Utilities

> Utility modules for input validation, JSON operations, and batch processing.

---

## 1. 📖 OVERVIEW

### What are the MCP Server Utilities?

The utilities module provides essential support functions for the MCP server, including input validation (with security hardening against CWE-400 resource exhaustion), safe JSON parsing/serialization, and batch processing with automatic retry logic. These utilities ensure robustness, security, and reliability across all MCP operations.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Utility Modules | 3 | validators, json-helpers, batch-processor |
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

---

## 2. 🚀 QUICK START

### 30-Second Setup

```javascript
// 1. Import utils barrel export
const utils = require('./utils');

// 2. Use validators
utils.validate_query('search term');

// 3. Use JSON helpers
const obj = utils.safe_json_parse(jsonString);

// 4. Use batch processor
await utils.process_batches(items, processor);
```

### Verify Installation

```javascript
// Check utils are loaded
const utils = require('./utils');
console.log(Object.keys(utils));
// Expected: ['validate_query', 'safe_json_parse', 'process_batches', ...]
```

### First Use

```javascript
// Example: Validate user input
const utils = require('./utils');

try {
  const query = utils.validate_query(userInput);
  console.log('Valid query:', query);
} catch (err) {
  console.error('Validation failed:', err.message);
}
```

---

## 3. 📁 STRUCTURE

```
utils/
├── validators.js           # Input validation and security checks
├── json-helpers.js         # Safe JSON parsing and serialization
├── batch-processor.js      # Batch processing with retry logic
├── index.js                # Barrel export with dual naming
└── README.md               # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `validators.js` | Input validation, length limits, path security (CWE-400 mitigation) |
| `json-helpers.js` | Safe JSON operations with error handling and type validation |
| `batch-processor.js` | Batch processing, retry logic, rate limiting for large datasets |
| `index.js` | Barrel export providing both snake_case and camelCase naming |

---

## 4. ⚡ FEATURES

### Input Validation

**Query Validation**: Sanitize and validate search queries

| Aspect | Details |
|--------|---------|
| **Purpose** | Prevent injection attacks, resource exhaustion (CWE-400) |
| **Usage** | `validate_query(query)` |
| **Checks** | Non-null, string type, trimmed, max length (10,000 chars) |

**Input Length Validation**: Enforce limits across all user inputs

```javascript
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

```javascript
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

```javascript
// Parse with fallback
const data = safe_json_parse(jsonString, { fallback: 'default' });

// Parse with null default (explicit error handling)
const data = safe_json_parse(jsonString, null);
if (data === null) {
  console.error('Invalid JSON');
}
```

**Safe JSON Stringify**: Serialize with error handling

```javascript
// Stringify with fallback
const jsonString = safe_json_stringify(obj, '{}');

// Pretty print
const jsonString = safe_json_stringify(obj, null, 2);
```

**Typed JSON Parse**: Parse with type validation

```javascript
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

```javascript
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

```javascript
const result = await process_with_retry(
  async () => {
    // Operation that might fail
    return await apiCall();
  },
  {
    maxRetries: 3,
    baseDelayMs: 1000,  // Start with 1s delay
    maxDelayMs: 10000,  // Cap at 10s
    factor: 2           // Exponential backoff factor
  }
);
```

**Process Sequentially**: Process items one at a time

```javascript
const results = await process_sequentially(
  items,
  async (item) => {
    // Process each item
    return await processItem(item);
  },
  { retryOptions: { maxRetries: 2 } }
);
```

---

## 5. 💡 USAGE EXAMPLES

### Example 1: Validate User Input

```javascript
const { validate_query, validate_input_lengths } = require('./utils');

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

```javascript
const { safe_json_parse, safe_json_stringify } = require('./utils');

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

```javascript
const { process_batches } = require('./utils');

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

```javascript
const { process_with_retry } = require('./utils');

// Retry API call with exponential backoff
const embedding = await process_with_retry(
  async () => {
    return await voyageAI.embed(text);
  },
  {
    maxRetries: 5,
    baseDelayMs: 1000,   // Start with 1s
    maxDelayMs: 30000,   // Cap at 30s
    factor: 2            // Double delay each retry
  }
);

// Retry sequence: 1s → 2s → 4s → 8s → 16s (capped at 30s)
```

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| Validate before use | `const q = validate_query(input);` | All user inputs |
| Safe parse with default | `safe_json_parse(str, {})` | Untrusted JSON |
| Batch + retry | `process_batches(items, fn, { retryOptions })` | Large datasets, external APIs |
| Sequential processing | `process_sequentially(items, fn)` | Order-dependent operations |

---

## 6. 🛠️ TROUBLESHOOTING

### Common Issues

#### Validation errors rejecting valid input

**Symptom**: `Error: Query exceeds maximum length` for reasonable input

**Cause**: Input limits configured too low for use case

**Solution**:
```javascript
// Check current limits
const { INPUT_LIMITS } = require('./utils');
console.log('Query limit:', INPUT_LIMITS.query); // 10000

// If needed, increase limits in validators.js
// Or truncate input before validation
const truncated = input.slice(0, INPUT_LIMITS.query);
const valid = validate_query(truncated);
```

#### Batch processing not retrying failures

**Symptom**: Batch processing stops on first error, no retry

**Cause**: Missing or incorrect retry options

**Solution**:
```javascript
// Ensure retry options are provided
await process_batches(items, processFn, {
  batchSize: 50,
  retryOptions: {
    maxRetries: 3,          // Must be > 0 for retries
    baseDelayMs: 1000,
    factor: 2
  }
});

// Check logs for retry attempts
// Should see: "Retry 1/3 after error: ..."
```

#### JSON parse returning default too often

**Symptom**: `safe_json_parse()` always returns default value

**Cause**: Input is not valid JSON, or is JSON but malformed

**Solution**:
```javascript
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
```bash
# Check path format (use absolute paths)
pwd
# /Users/name/project

# Allowed paths must be absolute
const validator = create_file_path_validator([
  '/Users/name/project/specs',  # ✅ Correct
  'specs'                        # ❌ Wrong (relative)
]);

# Or use default allowed paths
const { get_default_allowed_paths } = require('./utils');
const allowedPaths = get_default_allowed_paths();
console.log('Allowed:', allowedPaths);
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Validation too strict | Check `INPUT_LIMITS` constants, adjust if needed |
| Batch processing fails | Add `retryOptions` with `maxRetries > 0` |
| JSON parse issues | Log input, check with `JSON.parse()` directly |
| Path validation errors | Use absolute paths, check with `get_default_allowed_paths()` |

### Diagnostic Commands

```javascript
// Check loaded utilities
const utils = require('./utils');
console.log('Available:', Object.keys(utils));

// Test validation limits
const { INPUT_LIMITS } = require('./utils');
console.log('Limits:', INPUT_LIMITS);

// Test safe JSON parse
const { safe_json_parse } = require('./utils');
console.log('Valid JSON:', safe_json_parse('{"a":1}', null));
console.log('Invalid JSON:', safe_json_parse('{invalid}', { fallback: true }));

// Test batch processing
const { process_batches } = require('./utils');
const items = [1, 2, 3, 4, 5];
process_batches(items, async (batch) => {
  console.log('Batch:', batch);
  return batch;
}).then(results => console.log('Results:', results.flat()));
```

---

## 7. 📚 RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [MCP Server README](../README.md) | Overview of the MCP server architecture |
| [Library README](../lib/README.md) | Library modules using these utilities |
| [Tests README](../tests/README.md) | Test suite validating utility functions |

### Utility Modules

| Module | Purpose |
|--------|---------|
| `validators.js` | Input validation, security checks (CWE-400 mitigation) |
| `json-helpers.js` | Safe JSON operations with error handling |
| `batch-processor.js` | Batch processing, retry logic, rate limiting |

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

*Documentation version: 1.0 | Last updated: 2025-01-21*
