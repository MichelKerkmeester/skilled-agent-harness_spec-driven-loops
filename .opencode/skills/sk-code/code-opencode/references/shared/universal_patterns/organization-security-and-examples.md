---
title: File Organization, Security & Copy-Paste Alignment Examples
description: Patterns applicable to ALL languages in OpenCode system code including naming principles, commenting philosophy, and reference comment patterns. — File Organization, Security & Copy-Paste Alignment Examples.
importance_tier: normal
contextType: implementation
version: 1.0.0.22
---

# File Organization, Security & Copy-Paste Alignment Examples

## 5. FILE ORGANIZATION

### Universal Section Order

All files follow a consistent section progression:

```
Preamble (unnumbered in code):
- Header (shebang for scripts, box-drawing title)
- Directives ('use strict', set -euo pipefail)

Numbered code sections:
1. Imports/Dependencies
2. Constants/Configuration
3. Type Definitions (if applicable)
4. Helper Functions (private/internal)
5. Main Logic (public API)
6. Exports (module.exports, __all__)
7. Main Entry Point (if script)
```

### Section Dividers

Use numbered section dividers to organize code:

The first numbered divider that appears in code starts at `1`. If a file omits imports or another early section, renumber the remaining sections sequentially instead of skipping to `2`.

**JavaScript**:
```javascript
/* ─────────────────────────────────────────────────────────────
   1. MODULE IMPORTS
──────────────────────────────────────────────────────────────── */

// imports here

/* ─────────────────────────────────────────────────────────────
   2. CONSTANTS
──────────────────────────────────────────────────────────────── */

// constants here
```

**Python**:
```python
# ─────────────────────────────────────────────────────────────
# 1. IMPORTS
# ─────────────────────────────────────────────────────────────

# imports here

# ─────────────────────────────────────────────────────────────
# 2. CONSTANTS
# ─────────────────────────────────────────────────────────────

# constants here
```

**Shell**:
```bash
# ─────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ─────────────────────────────────────────────────────────────

# config here

# ─────────────────────────────────────────────────────────────
# 2. FUNCTIONS
# ─────────────────────────────────────────────────────────────

# functions here
```

### File Length Guidelines

| File Type | Recommended Max | Action if Exceeded |
|-----------|-----------------|-------------------|
| Utility/helper | 200 lines | Consider splitting |
| Handler/endpoint | 300 lines | Split by domain |
| Main entry point | 400 lines | Extract modules |
| Configuration | 100 lines | Split by concern |

---

## 6. SECURITY PATTERNS

### Input Validation (All Languages)

Always validate external input:

```javascript
// JavaScript
const { validateInputLengths } = require('./utils');
if (!validateInputLengths(query, MAX_QUERY_LENGTH)) {
  throw new Error('Query exceeds maximum length');
}
```

```python
# Python
def validate_input(text: str, max_length: int = 10000) -> bool:
    """Validate input length to prevent DoS attacks (CWE-400)."""
    return len(text) <= max_length
```

### Path Traversal Prevention (CWE-22)

Never trust user-provided paths:

```javascript
// JavaScript
const safePath = fs.realpathSync(path.resolve(baseDir, userPath));
const basePath = fs.realpathSync(baseDir);
const relative = path.relative(basePath, safePath);
if (relative.startsWith('..') || path.isAbsolute(relative)) {
  throw new Error('Path traversal detected');
}
```

```python
# Python
import os
safe_path = os.path.realpath(os.path.join(base_dir, user_path))
relative = os.path.relpath(safe_path, os.path.realpath(base_dir))
if relative.startswith(".."):
    raise ValueError("Path traversal detected")
```

### Spec Folder Path Invariants (OpenCode scripts)

When code touches spec folders (`specs/` or `.opencode/specs/`), enforce these rules:

- Canonicalize both candidate path and allowed roots (`realpath`)
- Validate containment with `relative` or boundary-safe checks, never plain substring checks
- Enforce spec folder naming pattern `NNN-name` before destructive operations
- Reject restore/archive/create targets outside approved roots
- Do not emit rollback/restore instructions unless checkpoint creation actually succeeded

### Secrets Management

Never hardcode secrets:

```javascript
// GOOD: Environment variable
const apiKey = process.env.API_KEY;

// BAD: Hardcoded
const apiKey = "sk-1234567890abcdef";
```

---

## 7. CONTRIBUTOR COPY-PASTE ALIGNMENT EXAMPLES

Use these when you need the same intent across TS, JS, Python, Shell, and JSON/JSONC.

### Pattern A: Validate early, then continue

**TypeScript**
```typescript
function searchMemories(queryText: string): string[] {
  if (queryText.length === 0) {
    throw new Error('queryText must not be empty');
  }
  return [queryText];
}
```

**JavaScript**
```javascript
function searchMemories(queryText) {
  if (!queryText || typeof queryText !== 'string') {
    return { success: false, error: 'queryText must be a non-empty string' };
  }
  return { success: true, data: [queryText] };
}
```

**Python**
```python
from typing import List, Tuple

def search_memories(query_text: str) -> Tuple[bool, List[str], str]:
    if not query_text:
        return False, [], "query_text must not be empty"
    return True, [query_text], ""
```

**Shell**
```bash
search_memories() {
    local query_text="${1:-}"
    if [[ -z "$query_text" ]]; then
        printf 'ERROR: query_text must not be empty\n' >&2
        return 1
    fi
    printf '%s\n' "$query_text"
}
```

**JSON/JSONC**
```jsonc
{
  "validation": {
    "requireNonEmptyQueryText": true,
    "maxQueryLength": 10000
  }
}
```

### Pattern B: Keep naming aligned across languages

Use equivalent names with language-appropriate casing for the same concept.

| Concept | TypeScript / JavaScript | Python / Shell | JSON/JSONC |
|---------|--------------------------|----------------|------------|
| Query text | `queryText` | `query_text` | `queryText` |
| Is valid flag | `isValid` | `is_valid` | `isValid` |
| Max results | `maxResults` | `max_results` | `maxResults` |

### Pattern C: Cross-language comment consistency

Express the same durable WHY across code and config comments — never a shared task/requirement id (those rot per the canonical rule; see §4).

**TypeScript / JavaScript**
```typescript
// Keep retry budget bounded so startup recovery cannot loop forever
const MAX_RETRIES = 3;
```

**Python / Shell**
```python
# Keep retry budget bounded so startup recovery cannot loop forever
MAX_RETRIES = 3
```

```bash
# Keep retry budget bounded so startup recovery cannot loop forever
readonly MAX_RETRIES=3
```

**JSONC**
```jsonc
{
  // Keep retry budget bounded so startup recovery cannot loop forever
  "maxRetries": 3
}
```

---

## 8. RELATED RESOURCES

### Language-Specific References

- `../../javascript/style_guide.md` - JavaScript naming, formatting, headers
- `../../typescript/style_guide/overview_strict_and_naming.md` - TypeScript naming, types, interfaces, imports
- `../../python/style_guide.md` - Python naming, docstrings, imports
- `../../shell/style_guide/overview_structure_and_naming.md` - Shell shebang, quoting, functions
- `../rust/style_guide/` - Rust naming, boundary API, error style, module layout (split into topic parts)
- `../../config/style_guide.md` - JSON/JSONC structure, comments

### Cross-Language Determinism Contracts

Rust here is a napi-rs/WASM/sidecar compatibility layer over the TypeScript
backend, so its outputs are bound by language-neutral contracts the shared tier
owns (the mechanics live in each language's trio, not here):

- Six-decimal numeric behavior — identical rounding/quantization across languages.
- Stable ordering and comparator tie-breaks — no reliance on unspecified sort order.
- Deterministic IDs — same inputs produce the same identifiers everywhere.
- Deterministic hash/iteration order — canonical map iteration, never hash-seeded.
- Byte-for-byte differential fixtures — the same input yields identical bytes from the Rust and TypeScript paths.

### Related Documents

- `code_organization.md` - Module organization, file structure
- `../../../assets/checklists/universal_checklist.md` - Cross-language validation items
