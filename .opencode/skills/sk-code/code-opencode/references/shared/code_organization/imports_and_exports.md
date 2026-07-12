---
title: Import Ordering & Export Patterns
description: File structure principles, module organization concepts, and import ordering standards for OpenCode system code. — Import Ordering & Export Patterns.
trigger_phrases:
  - "cross language import ordering"
  - "opencode export patterns"
  - "typescript type imports"
  - "python public api exports"
importance_tier: normal
contextType: implementation
version: 1.0.0.17
---

# Import Ordering & Export Patterns

Import ordering and export patterns for JavaScript, TypeScript, Python, and Shell code in OpenCode system packages.

---

## 1. OVERVIEW

### Purpose

Define consistent dependency ordering and public export patterns across supported implementation languages.

### When to Use

- Adding or reorganizing imports in system code
- Defining a module's public API
- Choosing between CommonJS and ES module exports
- Creating TypeScript barrel files or Python `__all__` declarations

---

## 2. IMPORT ORDERING

### Universal Import Order

All languages follow this import order:

```
1. Standard library / Built-in modules
2. Third-party packages (npm, pip, etc.)
3. Local modules (project code)
4. Type-only imports (TypeScript only — separate line, always last)
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
const { handleMemorySearch } = require('./handlers');

// Utility modules
const { validateInputLengths } = require('./utils');
```

### TypeScript Import Order

TypeScript follows a four-group ordering. Type-only imports are always last.

```typescript
// 1. Node.js built-in modules
import path from 'path';
import fs from 'fs';

// 2. Third-party packages
import Database from 'better-sqlite3';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

// 3. Local modules (project code)
import { loadConfig } from './core/config';
import { MemoryError, ErrorCode } from './errors/core';

// 4. Type-only imports (separate line, always last)
import type { SearchOptions, SearchResult } from '../types';
import type { DatabaseConfig } from './core/config';
```

**Key rule**: Use `import type` for imports used only in type positions (annotations, generics, return types). This ensures they are erased at compile time.

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

## 3. EXPORT PATTERNS

### JavaScript CommonJS Exports

Use object literal at end of file for non-plugin `.js/.cjs` utilities:

```javascript
/* ─────────────────────────────────────────────────────────────
   5. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  // Primary exports (camelCase)
  handleMemorySearch,
  handleMemorySave,
  validateInput,

  // Backward-compatible aliases (snake_case) — MCP handlers only
  handle_memory_search: handleMemorySearch,
  handle_memory_save: handleMemorySave,
  validate_input: validateInput,
};
```

Do not use this pattern for `.mjs`, `.opencode/plugins/`, or
`.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/`; those are ESM
surfaces.

### TypeScript ES Module Exports

TypeScript source uses ES module syntax. The compiler output follows the owning
workspace package settings: NodeNext ESM for `shared/` and `mcp_server/`,
ES2022 ESM for `scripts/`, and CommonJS only for workspaces that inherit the
root fallback.

```typescript
// Named exports (preferred)
export function search(query: string): SearchResult[] { }
export class VectorIndex { }
export const MAX_RESULTS = 100;

// Type-only exports (erased at compile time)
export type { SearchResult, SearchOptions };

// Barrel file (index.ts) — re-exports from submodules
export { MemoryError, ErrorCode } from './errors/core';
export { VectorIndex } from './search/vector-index';
export type { SearchResult } from '../types';

// Default export (use sparingly — named exports preferred)
export default class ContextServer { }

// Re-export everything
export * from './module';
export type * from './types';
```

### Re-export Wrappers

When wrapping external modules:

```typescript
// lib/errors.ts - Re-export with enhancements

// Import base definitions
import { ErrorCodes } from './errors/core';
import { getRecoveryHint, ERROR_CODES } from './errors/recovery-hints';

// Re-export everything consumers need
export { ErrorCodes, getRecoveryHint, ERROR_CODES };
export { MemoryError, buildErrorResponse } from './errors/core';
export type { ErrorResponse } from './errors/core';
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
