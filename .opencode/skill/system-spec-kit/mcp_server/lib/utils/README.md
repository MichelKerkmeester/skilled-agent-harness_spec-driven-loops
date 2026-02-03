# Utils

> Utility functions for token management, retry logic, output formatting, and path security.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 📁 STRUCTURE](#2--structure)
- [3. ⚡ FEATURES](#3--features)
- [4. 💡 USAGE EXAMPLES](#4--usage-examples)
- [5. 🔗 RELATED RESOURCES](#5--related-resources)

---

## 1. 📖 OVERVIEW

The utils module provides foundational utilities used throughout the MCP server. These include token budget management for LLM context limits, intelligent retry with exponential backoff, date formatting, and path traversal security.

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **Token safety** | Prevent context overflow with budget management |
| **Resilient I/O** | Automatic retry for transient failures |
| **Security** | Path traversal protection (CWE-22 mitigation) |
| **Consistency** | Shared formatting across the codebase |

### Module Statistics

| Metric | Value |
|--------|-------|
| Utility modules | 4 |
| Exported functions | 18 |
| Error patterns | 11 transient, 10 permanent |

---

## 2. 📁 STRUCTURE

```
utils/
├── token-budget.js     # Token estimation and budget management
├── retry.js            # Exponential backoff with jitter
├── format-helpers.js   # Output formatting utilities
├── path-security.js    # Path validation and sanitization
└── index.js            # Module aggregator
```

### Key Files

| File | Purpose |
|------|---------|
| `token-budget.js` | Estimate tokens, truncate results to fit LLM context |
| `retry.js` | Smart retry with error classification |
| `format-helpers.js` | Human-readable date formatting |
| `path-security.js` | Prevent path traversal attacks |
| `index.js` | Re-exports all utilities |

---

## 3. ⚡ FEATURES

### Token Budget Management

| Function | Purpose |
|----------|---------|
| `estimate_tokens(content)` | Estimate token count (~3.5 chars/token) |
| `truncate_to_token_limit(results)` | Truncate array to fit budget |
| `fits_within_budget(content)` | Check if content fits |
| `get_remaining_budget(used)` | Calculate remaining tokens |
| `format_truncation_message(result)` | Generate truncation notice |

**Configuration (via environment):**

| Variable | Default | Description |
|----------|---------|-------------|
| `MCP_MAX_TOKENS` | 25000 | Maximum token budget |
| `MCP_TOKEN_SAFETY_BUFFER` | 0.8 | Safety margin (80% of max) |
| `MCP_CHARS_PER_TOKEN` | 3.5 | Character-to-token ratio |
| `MCP_MIN_ITEMS` | 1 | Minimum results to return |

### Retry with Exponential Backoff

| Function | Purpose |
|----------|---------|
| `retryWithBackoff(fn, options)` | Execute with automatic retry |
| `withRetry(fn, options)` | Wrap function for retry |
| `classifyError(error)` | Determine if error is transient/permanent |
| `isTransientError(error)` | Check if retry makes sense |
| `isPermanentError(error)` | Check if retry is pointless |
| `calculateBackoff(attempt)` | Get delay for attempt N |

**Transient errors (will retry):** 429, 500, 502, 503, 504, ETIMEDOUT, ECONNRESET, rate limits

**Permanent errors (fail fast):** 400, 401, 403, 404, invalid API key, unauthorized

### Format Helpers

| Function | Purpose |
|----------|---------|
| `format_age_string(date)` | Convert date to "2 days ago" format |

### Path Security

| Function | Purpose |
|----------|---------|
| `validate_file_path(path, allowed)` | Validate path is within allowed directories |
| `escape_regex(str)` | Escape special regex characters |

---

## 4. 💡 USAGE EXAMPLES

### Token Budget Management

```javascript
const { estimate_tokens, truncate_to_token_limit } = require('./utils');

// Estimate tokens for content
const tokens = estimate_tokens('Hello world'); // ~3

// Truncate results to fit budget
const results = [{ content: '...' }, { content: '...' }, ...];
const { results: truncated, truncated: wasTruncated } = truncate_to_token_limit(results);

if (wasTruncated) {
  console.log('Results were truncated to fit token budget');
}
```

### Retry with Backoff

```javascript
const { retryWithBackoff, withRetry } = require('./utils');

// Direct usage
const result = await retryWithBackoff(
  () => fetch('https://api.example.com/data'),
  {
    operationName: 'API fetch',
    maxRetries: 3,
    baseDelayMs: 1000,
    onRetry: (attempt, error, delay) => {
      console.log(`Retry ${attempt + 1} in ${delay}ms`);
    }
  }
);

// Wrap a function for automatic retry
const fetchWithRetry = withRetry(fetch, { maxRetries: 3 });
const response = await fetchWithRetry('https://api.example.com');
```

### Error Classification

```javascript
const { classifyError, isTransientError } = require('./utils');

try {
  await someOperation();
} catch (error) {
  const { type, reason, shouldRetry } = classifyError(error);

  if (type === 'permanent') {
    console.log('Fatal error, not retrying:', reason);
    throw error;
  }

  if (isTransientError(error)) {
    // Will retry automatically if using retryWithBackoff
  }
}
```

### Path Security

```javascript
const { validate_file_path } = require('./utils');

const allowed = ['/home/user/project', '/tmp'];
const userPath = '../../../etc/passwd';

const safe = validate_file_path(userPath, allowed);
// Returns null - path traversal blocked

const goodPath = '/home/user/project/file.txt';
const resolved = validate_file_path(goodPath, allowed);
// Returns resolved absolute path
```

### Format Helpers

```javascript
const { format_age_string } = require('./utils');

format_age_string('2024-01-15T10:00:00Z'); // "2 weeks ago"
format_age_string(null);                    // "never"
```

---

## 5. 🔗 RELATED RESOURCES

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../README.md](../README.md) | Parent lib directory overview |
| [../providers/](../providers/) | Uses retry for API calls |
| [../search/](../search/) | Uses token budget for results |

### Security References

| Topic | Reference |
|-------|-----------|
| Path Traversal | CWE-22: Improper Limitation of Pathname |
| Retry Safety | Exponential backoff prevents thundering herd |

### Configuration Summary

| Module | Key Config | Default |
|--------|------------|---------|
| token-budget | `MCP_MAX_TOKENS` | 25000 |
| retry | `maxRetries` | 3 |
| retry | `baseDelayMs` | 1000ms |
| retry | `maxDelayMs` | 4000ms |
