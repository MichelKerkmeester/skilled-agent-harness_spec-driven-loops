# Errors

> Error handling subsystem with custom error classes, 49 error codes, and actionable recovery hints.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 📁 STRUCTURE](#2--structure)
- [3. ⚡ FEATURES](#3--features)
- [4. 💡 USAGE EXAMPLES](#4--usage-examples)
- [5. 🔗 RELATED RESOURCES](#5--related-resources)

---

## 1. 📖 OVERVIEW

The errors subsystem provides standardized error handling for the Spec Kit Memory MCP server. Every error includes a code, message, and actionable recovery guidance to help agents self-diagnose and resolve issues.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Error Codes | 49 | Organized by category (E001-E503) |
| Tool-Specific Hints | 5 tools | memory_search, checkpoint_restore, memory_save, memory_index_scan, memory_drift_why |
| Severity Levels | 4 | low, medium, high, critical |

### Key Features

| Feature | Description |
|---------|-------------|
| **Recovery Hints** | Every error code maps to actionable recovery guidance |
| **Tool Context** | Tool-specific hints provide contextual guidance |
| **User-Friendly Messages** | Internal errors translated to clear messages |
| **Transient Detection** | Automatic classification of retryable vs permanent errors |

---

## 2. 📁 STRUCTURE

```
errors/
├── core.js           # MemoryError class, timeout wrapper, error utilities
├── recovery-hints.js # 49 error codes with recovery guidance (v1.2.0)
├── index.js          # Module aggregator
└── README.md         # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `core.js` | Custom error classes, timeout wrapper, error response builder |
| `recovery-hints.js` | Error code catalog with severity levels and recovery actions |
| `index.js` | Unified export of all error functionality |

---

## 3. ⚡ FEATURES

### Error Classification

**Error Code Categories**:

| Range | Category | Examples |
|-------|----------|----------|
| E001-E009 | Embedding | API failures, dimension mismatch, timeout |
| E010-E019 | File | Not found, access denied, encoding error |
| E020-E029 | Database | Connection, query, transaction failures |
| E030-E039 | Parameter | Invalid, missing, out of range |
| E040-E049 | Search | Query errors, vector unavailable |
| E050-E059 | API/Auth | Key invalid, rate limited |
| E060-E069 | Checkpoint | Not found, restore/create failed |
| E070-E079 | Session | Expired, invalid, recovery failed |
| E080-E089 | Memory Operations | Not found, save/delete/update failed |
| E090-E099 | Validation | Anchor format, token budget exceeded |
| E100-E109 | Causal Graph | Edge not found, cycle detected |
| E429, E503 | Rate Limiting | Rate limited, service unavailable |

### Recovery Hints System

Every error code includes:
- **hint**: Primary recovery suggestion
- **actions**: Specific actionable steps (array)
- **severity**: low, medium, high, or critical
- **toolTip**: Quick tool recommendation (optional)

### Transient Error Detection

Automatic classification for retry logic:

| Detection | Patterns |
|-----------|----------|
| Transient (retry) | SQLITE_BUSY, ECONNRESET, ETIMEDOUT, rate limit |
| Permanent (fail-fast) | unauthorized, authentication failed, invalid api key |

---

## 4. 💡 USAGE EXAMPLES

### Example 1: Build Error Response

```javascript
const { build_error_response } = require('./errors');

try {
  // ... operation that may fail
} catch (error) {
  return build_error_response('memory_search', error, { query });
  // Returns: { summary, data, hints, meta }
}
```

### Example 2: Get Recovery Hint

```javascript
const { getRecoveryHint, ERROR_CODES } = require('./errors');

const hint = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
// Returns tool-specific hint for embedding failure in search context

console.log(hint.actions);
// ['BM25 text search will still return relevant results', ...]
```

### Example 3: Create Error with Hint

```javascript
const { create_error_with_hint, ErrorCodes } = require('./errors');

const error = create_error_with_hint(
  ErrorCodes.FILE_NOT_FOUND,
  'Memory file not found',
  { path: '/specs/memory/context.md' },
  'memory_save'
);
// Error has .recoveryHint attached
```

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| Check transient | `is_transient_error(err)` | Before retry logic |
| Check permanent | `is_permanent_error(err)` | For fail-fast paths |
| User-friendly | `user_friendly_error(err)` | For external messages |
| With timeout | `with_timeout(promise, ms, 'op')` | For async operations |

---

## 5. 🔗 RELATED RESOURCES

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../validation/](../validation/) | Pre-flight quality gates |
| [../../context-server.js](../../context-server.js) | MCP server using error system |

### Exports Reference

```javascript
// From core.js
ErrorCodes, MemoryError, with_timeout, user_friendly_error,
is_transient_error, is_permanent_error, build_error_response,
create_error_with_hint

// From recovery-hints.js
ERROR_CODES, RECOVERY_HINTS, TOOL_SPECIFIC_HINTS, DEFAULT_HINT,
getRecoveryHint, hasSpecificHint, getAvailableHints, getErrorCodes
```

---

*Module version: 1.2.0 | Added recovery-hints.js with 49 error codes*
