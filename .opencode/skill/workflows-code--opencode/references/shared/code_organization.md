---
title: Code Organization - File Structure and Module Principles
description: File structure principles, module organization concepts, and import ordering standards for OpenCode system code.
---

# Code Organization - File Structure and Module Principles

File structure and module organization principles for OpenCode system code.

---

## 1. 📖 OVERVIEW

### Purpose

This reference defines how to organize files, structure modules, and order imports across all languages in the OpenCode codebase. Consistent organization enables faster navigation and reduces cognitive load.

### Core Principle

> **Predictable structure enables fast navigation.** Every file type has a known structure. Developers should find what they expect where they expect it.

### When to Use

- Creating new files or modules
- Reorganizing existing code
- Deciding import order
- Reviewing code structure

### Key Sources (Evidence)

| Pattern | Source File | Line Reference |
|---------|-------------|----------------|
| JS module structure | `mcp_server/context-server.js` | Lines 1-70 |
| JS exports with aliases | `scripts/core/config.js` | Lines 167-183 |
| Python imports | `scripts/skill_advisor.py` | Lines 17-24 |
| Shell structure | `lib/common.sh` | Lines 1-40 |

---

## 2. 📁 FILE STRUCTURE PRINCIPLES

### Header-First Convention

Every file starts with a header block identifying its purpose:

**JavaScript** (3-line box):
```javascript
// ───────────────────────────────────────────────────────────────
// SERVER: CONTEXT SERVER
// ───────────────────────────────────────────────────────────────
```

**Python** (shebang + 3-line box):
```python
#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# ADVISOR: SKILL ADVISOR
# ───────────────────────────────────────────────────────────────
```

**Shell** (shebang + header):
```bash
#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# LIBRARY: COMMON UTILITIES
# ───────────────────────────────────────────────────────────────
```

### Module Type Labels

Use consistent labels in headers:

| Label | Use For |
|-------|---------|
| `SERVER` | MCP servers, HTTP servers |
| `HANDLER` | Request/event handlers |
| `LIBRARY`/`LIB` | Reusable utility modules |
| `SCRIPT` | Standalone executable scripts |
| `ADVISOR` | AI advisory/analysis tools |
| `VALIDATOR` | Validation/checking tools |
| `CONFIG` | Configuration files |
| `TEST` | Test files |

### Standard File Sections

Every significant file should have numbered sections:

```javascript
/* ─────────────────────────────────────────────────────────────
   1. MODULE IMPORTS
──────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   2. CONSTANTS
──────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   3. HELPER FUNCTIONS
──────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   4. MAIN LOGIC
──────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   5. EXPORTS
──────────────────────────────────────────────────────────────── */
```

---

## 3. 📦 MODULE ORGANIZATION

### Single Responsibility

Each module should have ONE primary purpose:

**Good** - Single responsibility:
```
mcp_server/
├── handlers/
│   ├── memory-search.js    # Handles memory search
│   ├── memory-save.js      # Handles memory save
│   └── memory-delete.js    # Handles memory delete
├── lib/
│   ├── errors.js           # Error definitions
│   ├── embeddings.js       # Embedding generation
│   └── validation.js       # Input validation
```

**Bad** - Mixed responsibilities:
```
mcp_server/
├── handlers.js             # All handlers (too large)
├── utils.js                # "Utils" grab bag (unclear)
└── helpers.js              # More "helpers" (unclear)
```

### Directory Structure Pattern

```
module/
├── index.js                # Entry point, exports public API
├── core/                   # Core logic (private)
│   ├── config.js
│   └── state.js
├── handlers/               # Request handlers
│   └── *.js
├── lib/                    # Utilities and helpers
│   ├── errors/
│   │   └── core.js
│   ├── storage/
│   │   └── *.js
│   └── utils/
│       └── *.js
└── tests/                  # Test files
    └── *.test.js
```

### Barrel Files (index.js)

Use barrel files to expose public API:

```javascript
// lib/index.js - Barrel file
module.exports = {
  // Re-export from submodules
  ...require('./errors/core.js'),
  ...require('./storage/memory.js'),
  ...require('./utils/validation.js'),
};
```

Benefits:
- Single import point: `const { MemoryError } = require('./lib');`
- Clear public API surface
- Implementation details hidden

---

## 4. 📦 📥 IMPORT ORDERING

### Universal Import Order

All languages follow this import order:

```
1. Standard library / Built-in modules
2. Third-party packages (npm, pip, etc.)
3. Local modules (project code)
```

With a blank line between each group.

### JavaScript Import Order

```javascript
// 1. Node.js built-ins
const path = require('path');
const fs = require('fs');

// 2. Third-party packages
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const winston = require('winston');

// 3. Local modules - grouped by type
// Core modules
const { LIB_DIR, DEFAULT_BASE_PATH } = require('./core');

// Handler modules
const { handle_memory_search } = require('./handlers');

// Utility modules
const { validate_input_lengths } = require('./utils');
```

### Python Import Order

```python
# 1. Standard library
import os
import sys
import json
from pathlib import Path

# 2. Third-party packages
import yaml
import requests

# 3. Local modules
from .core import config
from .handlers import memory_handler
from .utils import validation
```

### Shell "Import" Order

Shell uses `source` instead of imports:

```bash
# 1. Script directory resolution
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 2. Load common libraries first
source "${SCRIPT_DIR}/lib/common.sh"

# 3. Load specific libraries
source "${SCRIPT_DIR}/lib/validation.sh"
source "${SCRIPT_DIR}/lib/output.sh"
```

---

## 5. 💡 📤 EXPORT PATTERNS

### JavaScript CommonJS Exports

Use object literal at end of file:

```javascript
/* ─────────────────────────────────────────────────────────────
   5. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  // Primary exports (snake_case)
  handle_memory_search,
  handle_memory_save,
  validate_input,

  // Backward compatibility aliases (camelCase)
  // Note: Prefer snake_case for new code
  handleMemorySearch: handle_memory_search,
  handleMemorySave: handle_memory_save,
  validateInput: validate_input,
};
```

Evidence: `scripts/core/config.js:167-183`

### Re-export Wrappers

When wrapping external modules:

```javascript
// lib/errors.js - Re-export with enhancements

// Import base definitions
const { ErrorCodes, BaseError } = require('./errors/core.js');

// Add custom error class
class MemoryError extends BaseError {
  constructor(message, code, details = {}) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

// Export both original and enhanced
module.exports = {
  ErrorCodes,
  BaseError,
  MemoryError,  // Enhancement
};
```

### Python Exports

Use `__all__` to declare public API:

```python
# Define public API
__all__ = [
    'validate_document',
    'DocumentError',
    'ValidationResult',
]

# Implementation follows...
```

---

## 6. 🔧 DIRECTORY CONVENTIONS

### OpenCode Skill Structure

```
.opencode/skill/{skill-name}/
├── SKILL.md                    # Main skill definition
├── references/                 # Deep documentation
│   ├── shared/                 # Cross-language patterns
│   │   ├── universal_patterns.md
│   │   └── code_organization.md
│   ├── javascript/             # JS-specific
│   │   ├── style_guide.md
│   │   ├── quality_standards.md
│   │   └── quick_reference.md
│   ├── python/                 # Python-specific
│   └── shell/                  # Shell-specific
├── assets/                     # Templates, checklists
│   └── checklists/
│       ├── universal_checklist.md
│       └── {lang}_checklist.md
└── scripts/                    # Executable tools
    └── *.py
```

### MCP Server Structure

```
mcp_server/
├── context-server.js           # Entry point
├── core/                       # Core state and config
│   └── index.js
├── handlers/                   # Request handlers
│   ├── index.js                # Barrel exports
│   ├── memory-search.js
│   └── memory-save.js
├── lib/                        # Utilities
│   ├── errors/
│   │   └── core.js
│   ├── storage/
│   │   ├── checkpoints.js
│   │   └── transaction-manager.js
│   └── search/
│       ├── vector-index.js
│       └── hybrid-search.js
├── hooks/                      # Lifecycle hooks
│   └── index.js
├── tests/                      # Test files
│   └── *.test.js
└── database/                   # SQLite files (gitignored)
```

### Script Directory Structure

```
scripts/
├── lib/                        # Shared libraries
│   ├── common.sh               # Common functions
│   ├── colors.sh               # Color definitions
│   └── validation.sh           # Validation helpers
├── spec/                       # Spec folder scripts
│   ├── create.sh
│   └── validate.sh
├── memory/                     # Memory management
│   └── generate-context.js
├── utils/                      # Utility scripts
│   └── logger.js
└── tests/                      # Test utilities
    └── test_*.py
```

---

## 7. 🧪 TEST FILE CONVENTIONS

### Test File Naming

| Language | Pattern | Example |
|----------|---------|---------|
| JavaScript | `*.test.js` | `memory-search.test.js` |
| Python | `test_*.py` | `test_dual_threshold.py` |
| Shell | `test_*.sh` or `*.test.sh` | `test_validation.sh` |

### Test File Location

Keep tests close to source:

```
Option A: Adjacent tests/
lib/
├── search/
│   ├── vector-index.js
│   └── tests/
│       └── vector-index.test.js

Option B: Top-level tests/
lib/
├── search/
│   └── vector-index.js
tests/
└── search/
    └── vector-index.test.js
```

OpenCode uses **Option B** (top-level tests/) for most projects.

### Test File Structure

```javascript
// *.test.js structure
const assert = require('assert');
const { functionToTest } = require('../path/to/module');

describe('functionToTest', () => {
  describe('when given valid input', () => {
    it('should return expected result', () => {
      const result = functionToTest('valid');
      assert.strictEqual(result, expected);
    });
  });

  describe('when given invalid input', () => {
    it('should throw appropriate error', () => {
      assert.throws(() => functionToTest(null), /expected error/);
    });
  });
});
```

---

## 8. 🔗 RELATED RESOURCES

### Universal Patterns

- `universal_patterns.md` - Naming, commenting, reference patterns

### Language-Specific Organization

- `../javascript/style_guide.md` - JS module patterns, exports
- `../python/style_guide.md` - Python imports, `__all__`
- `../shell/style_guide.md` - Shell sourcing, functions
- `../config/style_guide.md` - JSON/JSONC structure
