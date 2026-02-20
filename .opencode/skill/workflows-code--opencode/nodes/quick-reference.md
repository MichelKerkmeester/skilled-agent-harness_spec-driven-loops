---
description: "File header templates, naming matrix, error handling patterns, and comment patterns for all supported languages"
---
# Quick Reference

Concise templates and lookup tables for file headers, naming conventions, error handling, and comment style across all supported languages.

## File Header Templates

**JavaScript**
```javascript
// +======================================================================+
// | [Module Name]                                                          |
// +======================================================================+

'use strict';

// -------------------------------------------------------------------------
// 1. IMPORTS
// -------------------------------------------------------------------------
const fs = require('fs');
```

**Python**
```python
#!/usr/bin/env python3
# +======================================================================+
# | [Script Name]                                                          |
# +======================================================================+
"""Brief description."""

# -------------------------------------------------------------------------
# 1. IMPORTS
# -------------------------------------------------------------------------
import sys
```

**Shell**
```bash
#!/usr/bin/env bash
# +======================================================================+
# | [Script Name]                                                          |
# +======================================================================+
# Brief description.

set -euo pipefail

# -------------------------------------------------------------------------
# 1. CONFIGURATION
# -------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
```

**TypeScript**
```typescript
// ---------------------------------------------------------------
// MODULE: [Module Name]
// ---------------------------------------------------------------

// ---------------------------------------------------------------------------
// 1. IMPORTS
// ---------------------------------------------------------------------------

import path from 'path';
import type { SearchOptions } from '../types';
```

**JSONC**
```jsonc
// +======================================================================+
// | [Config Name]                                                           |
// +======================================================================+
{
  "$schema": "https://...",
  // Section comment
  "key": "value"
}
```

## Naming Matrix

| Element    | JavaScript    | TypeScript    | Python        | Shell         | Config      |
| ---------- | ------------- | ------------- | ------------- | ------------- | ----------- |
| Functions  | `camelCase`   | `camelCase`   | `snake_case`  | `snake_case`  | N/A         |
| Constants  | `UPPER_SNAKE` | `UPPER_SNAKE` | `UPPER_SNAKE` | `UPPER_SNAKE` | N/A         |
| Classes    | `PascalCase`  | `PascalCase`  | `PascalCase`  | N/A           | N/A         |
| Interfaces | N/A           | `PascalCase`  | N/A           | N/A           | N/A         |
| Types      | N/A           | `PascalCase`  | N/A           | N/A           | N/A         |
| Enums      | N/A           | `PascalCase`  | N/A           | N/A           | N/A         |
| Generics   | N/A           | `T`-prefix    | N/A           | N/A           | N/A         |
| Variables  | `camelCase`   | `camelCase`   | `snake_case`  | `lower_snake` | `camelCase` |
| Params     | `camelCase`   | `camelCase`   | `snake_case`  | `snake_case`  | N/A         |
| Booleans   | `is`/`has`    | `is`/`has`    | `is_`/`has_`  | `is_`/`has_`  | N/A         |
| Private    | `_prefix`     | `_prefix`     | `_prefix`     | `_prefix`     | N/A         |

## Error Handling Patterns

**JavaScript**
```javascript
function processData(data) {
  if (!data) throw new Error('Data required');
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('[Module] Failed:', error.message);
    return null;
  }
}
```

**Python**
```python
def validate_input(data: str) -> Tuple[bool, str]:
    if not data:
        return False, "Data required"
    try:
        return True, json.loads(data)
    except json.JSONDecodeError as e:
        return False, f"Parse error: {e}"
```

**Shell**
```bash
validate_file() {
    local file="$1"
    if [[ ! -f "$file" ]]; then
        log_error "Not found: $file"
        return 1
    fi
    return 0
}
```

## Comment Patterns

```javascript
// GOOD - WHY comments
// Guard: Skip if initialized to prevent double-binding
// Sort by recency so newest memories surface first
// REQ-033: Transaction manager for pending file recovery

// BAD - WHAT comments (avoid)
// Set value to 42
// Loop through items
```

## Cross References
- [[rules]] - ALWAYS/NEVER rules these templates enforce
- [[success-criteria]] - Quality gates referencing these patterns