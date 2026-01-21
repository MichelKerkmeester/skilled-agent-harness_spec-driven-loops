# System Spec Kit Utilities

> Shared utility modules providing core functionality for data validation, path sanitization, file operations, logging, and input normalization across all system-spec-kit scripts.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. 🛠️ TROUBLESHOOTING](#4--troubleshooting)
- [5. 📚 RELATED DOCUMENTS](#5--related-documents)

---

## 1. 📖 OVERVIEW

### What are System Spec Kit Utilities?

The utilities folder contains reusable JavaScript modules that provide essential functionality for all system-spec-kit scripts. These modules handle data validation, path security, file I/O, structured logging, message formatting, prompt generation, and tool detection. They enforce security standards (CWE-22 path traversal prevention), normalize diverse input formats, and provide consistent error handling across the entire script ecosystem.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Utility Modules | 11 | Core functionality for all scripts |
| Primary Functions | 40+ | Validation, sanitization, normalization, logging |
| Security Standards | CWE-22, Path Traversal | Enforced in path-utils.js |

### Key Features

| Feature | Description |
|---------|-------------|
| **Data Validation** | Transforms and validates spec folder data structures with flag mappings |
| **Path Security** | Sanitizes file paths, prevents directory traversal (CWE-22) |
| **Input Normalization** | Transforms varied input formats (strings, objects, arrays) into consistent structures |
| **File Operations** | Safe file reading/writing with UTF-8 encoding and error handling |
| **Structured Logging** | Consistent logging with severity levels and structured context |
| **Message Utilities** | Formats user-facing messages and error reporting |
| **Tool Detection** | Identifies available MCP tools and capabilities |
| **Validation Utilities** | Path-scoped rule validation and checklist verification |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18+ | 20+ |
| Environment | System-spec-kit scripts | Used across all script types |

---

## 2. 🚀 QUICK START

### 30-Second Setup

```bash
# 1. Navigate to utils directory
cd /Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/.opencode/skill/system-spec-kit/scripts/utils

# 2. No installation needed - utilities are required by scripts

# 3. Use in your script
node -e "const { sanitizePath } = require('./path-utils'); console.log(sanitizePath('/specs/001-test'));"
```

### Verify Utilities

```bash
# Check all utilities exist
ls -la *.js
# Expected: 11 JavaScript files

# Test path sanitization
node -e "const { sanitizePath } = require('./path-utils'); console.log(sanitizePath('./specs/test'));"
# Expected: Absolute path to specs/test
```

### First Use

```javascript
// Import utilities in your script
const { sanitizePath } = require('./utils/path-utils');
const { readJsonFile } = require('./utils/file-helpers');
const { structuredLog } = require('./utils/logger');
const { validateInputData } = require('./utils/data-validator');
const { normalizeInput } = require('./utils/input-normalizer');

// Use path sanitization (prevents CWE-22 attacks)
const safePath = sanitizePath('/specs/001-feature');

// Read JSON safely
const data = readJsonFile('/path/to/data.json');

// Log with structure
structuredLog('info', 'Processing spec folder', { path: safePath });
```

---

## 3. 📁 STRUCTURE

```
utils/
├── data-validator.js          # Data structure validation and flag mappings
├── file-helpers.js            # Safe file read/write operations
├── index.js                   # Module exports aggregator
├── input-normalizer.js        # Input format normalization and transformation
├── logger.js                  # Structured logging utilities
├── message-utils.js           # User-facing message formatting
├── path-utils.js              # Path sanitization and security (CWE-22)
├── prompt-utils.js            # Prompt generation and formatting
├── tool-detection.js          # MCP tool capability detection
├── validation-utils.js        # Path-scoped validation and checklist verification
└── README.md                  # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `data-validator.js` | Validates and transforms spec folder data structures; applies flag mappings for arrays and presence checks |
| `file-helpers.js` | Provides safe file I/O operations with UTF-8 encoding, existence checks, and error handling |
| `index.js` | Aggregates exports from all utility modules for convenient importing |
| `input-normalizer.js` | Normalizes diverse input formats (strings, objects, arrays) into consistent structures; transforms key decisions |
| `logger.js` | Structured logging with severity levels (info, warn, error) and contextual data |
| `message-utils.js` | Formats user-facing messages, error reports, and validation feedback |
| `path-utils.js` | Sanitizes file paths to prevent directory traversal (CWE-22); validates against allowed base directories |
| `prompt-utils.js` | Generates prompts for CLI interactions and user input collection |
| `tool-detection.js` | Detects available MCP tools and their capabilities for dynamic feature enablement |
| `validation-utils.js` | Validates spec folders against path-scoped rules; verifies checklist completeness |

---

## 4. 🛠️ TROUBLESHOOTING

### Common Issues

#### Path sanitization blocks valid paths

**Symptom**: `Error: Path outside allowed directories: /some/path`

**Cause**: `sanitizePath()` enforces allowed base directories (cwd, specs, .opencode)

**Solution**:
```javascript
// Option 1: Add to allowed bases
const safePath = sanitizePath(inputPath, [
  process.cwd(),
  '/custom/allowed/path'
]);

// Option 2: Use relative path from allowed base
const safePath = sanitizePath('./specs/001-test');
```

#### File read returns undefined

**Symptom**: `readJsonFile()` returns undefined instead of throwing error

**Cause**: File doesn't exist but error handling suppresses exception

**Solution**:
```javascript
const { readJsonFile } = require('./file-helpers');
const data = readJsonFile('/path/to/file.json');

if (!data) {
  console.error('File not found or invalid JSON');
  process.exit(1);
}
```

#### Input normalization doesn't match expected format

**Symptom**: `normalizeInput()` returns unexpected structure

**Cause**: Input format doesn't match expected patterns

**Solution**:
```javascript
const { normalizeInput } = require('./input-normalizer');

// Ensure input matches expected shape
const normalized = normalizeInput({
  specFolder: '/specs/001-test',
  summary: 'Test summary',
  keyDecisions: ['Decision 1', 'Decision 2'] // Array of strings or objects
});

console.log(normalized);
```

#### Structured logs not appearing

**Symptom**: `structuredLog()` calls produce no output

**Cause**: Log level filtering or incorrect severity

**Solution**:
```javascript
const { structuredLog } = require('./logger');

// Use correct severity levels
structuredLog('info', 'Information message', { context: 'data' });
structuredLog('warn', 'Warning message', { context: 'data' });
structuredLog('error', 'Error message', { context: 'data' });

// Check environment variables
console.log(process.env.LOG_LEVEL); // Should be 'info', 'warn', or 'error'
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Path outside allowed dirs | Use relative paths from cwd/specs/.opencode |
| File not found | Check file existence with `fs.existsSync()` before calling helpers |
| Invalid JSON | Validate JSON syntax before passing to `readJsonFile()` |
| Module not found | Ensure you're requiring from correct relative path (`./utils/module`) |

### Diagnostic Commands

```bash
# Check all utilities exist
ls -la /Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/.opencode/skill/system-spec-kit/scripts/utils/*.js

# Test path sanitization
node -e "const { sanitizePath } = require('./path-utils'); console.log(sanitizePath('./specs/test'));"

# Verify module exports
node -e "const utils = require('./index'); console.log(Object.keys(utils));"

# Test data validator
node -e "const { validateInputData } = require('./data-validator'); console.log(validateInputData({ summary: 'test' }));"
```

---

## 5. 📚 RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [Scripts README](../README.md) | Overview of all system-spec-kit scripts that use these utilities |
| [Validation Rules](../../references/validation/validation_rules.md) | Rules enforced by validation-utils.js |
| [Path-Scoped Rules](../../references/validation/path_scoped_rules.md) | Path validation logic used by validation-utils.js |
| [Memory System](../../references/memory/memory_system.md) | Uses input-normalizer for memory save data |

### External Resources

| Resource | Description |
|----------|-------------|
| [CWE-22: Path Traversal](https://cwe.mitre.org/data/definitions/22.html) | Security standard enforced by path-utils.js |
| [Node.js File System](https://nodejs.org/api/fs.html) | API used by file-helpers.js |
| [Node.js Path Module](https://nodejs.org/api/path.html) | API used by path-utils.js |

---

*Documentation for system-spec-kit utilities v2.0*
