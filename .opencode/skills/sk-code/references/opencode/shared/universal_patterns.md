---
title: Universal Patterns - Cross-Language Code Standards
description: Patterns applicable to ALL languages in OpenCode system code including naming principles, commenting philosophy, and reference comment patterns.
trigger_phrases:
  - "opencode universal patterns"
  - "cross language naming principles"
  - "commenting philosophy why"
  - "reference comment patterns"
importance_tier: normal
contextType: implementation
version: 3.5.0.17
---

# Universal Patterns - Cross-Language Code Standards

Patterns applicable to ALL languages in OpenCode system code.

---

## 1. OVERVIEW

### Purpose

This reference defines patterns that apply universally across JavaScript, TypeScript, Python, Shell, and JSON/JSONC in the OpenCode codebase. These principles ensure consistency regardless of language choice.

### Core Principle

> **Clarity over cleverness.** Code is read far more often than written. Optimize for the reader, not the writer.

### When to Use

- Before writing any new OpenCode system code
- When reviewing code for consistency
- When onboarding to OpenCode development patterns
- As the foundation before applying language-specific rules

### Key Sources (Evidence)

| Pattern | Source File | Line Reference |
|---------|-------------|----------------|
| Reference comments | `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Near file top and import blocks |
| Section organization | `.opencode/skills/system-spec-kit/scripts/core/config.ts` | Numbered divider blocks |
| Naming conventions | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Throughout |
| Python docstrings | `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Module and function docstrings |

---

## 2. NAMING PRINCIPLES

### Descriptive Names

Names should describe what something IS or DOES without requiring context:

**Good** (JS/TS use camelCase, Python/Shell use snake_case):
```javascript
// JavaScript
calculateMemoryScore()
validateInputLengths()
handleMemorySearch()
```
```typescript
// TypeScript (same as JS for functions; PascalCase for types)
calculateMemoryScore()
validateInputLengths()
interface SearchResult { }
type MemoryState = 'active' | 'archived';
```
```python
# Python
calculate_memory_score()
validate_input_lengths()
handle_memory_search()
```

**Bad**:
```
calcScore()
validateLengths()
handle()
```

### Avoid Abbreviations

Spell out words unless industry-standard:

| Use | Don't Use | Exception |
|-----|-----------|-----------|
| `configuration` | `cfg` | - |
| `database` | `db` | OK for `DB` in constants |
| `message` | `msg` | - |
| `request` | `req` | OK in route handlers |
| `response` | `res` | OK in route handlers |
| `HTTP` | `http` | OK - industry standard |
| `URL` | `url` | OK - industry standard |
| `ID` | `id` | OK - industry standard |

### Consistency Rule

Same concept = same name across the entire codebase:

```javascript
// GOOD: Consistent naming (JS/TS)
memorySearch()          // in handlers
handleMemorySearch()    // wrapper
MemorySearchResult      // type/interface (PascalCase)

// BAD: Inconsistent naming
memorySearch()          // in handlers
handle_search()         // wrapper - wrong convention!
SearchMemoryResult      // type - different word order!
```

### Boolean Naming

Booleans should read as questions:

```javascript
// JavaScript / TypeScript (camelCase)
isValid
hasResults
canProceed
shouldRetry
enableDedup
```

```typescript
// TypeScript — with type annotation
const isValid: boolean = true;
const hasResults: boolean = items.length > 0;
```

```python
# Python / Shell (snake_case)
is_valid
has_results
can_proceed
should_retry
enable_dedup
```

```
// BAD (any language)
valid      // is it valid? or make it valid?
results    // what about results?
proceed    // noun or verb?
```

### Plural Naming for Collections

Arrays and collections use plural names:

```
// GOOD
const memories = [];
const results = searchResults.items;
for (const entry of entries) { ... }

// BAD
const memory = [];        // misleading - it's an array
const result = results.items;  // confusing
for (const entry of entry) { ... }  // very confusing
```

---

## 3. COMMENTING PHILOSOPHY

### Core Principles

1. **Quantity limit:** Maximum 3 comments per 10 lines of code
2. **Focus on purposeful semantics:** Explain WHY something is done, not WHAT it does
3. **No commented-out code:** Delete unused code (git preserves history)
4. **Function purpose comments:** Single line above function describing intent
5. **Capitalization:** Every inline comment sentence MUST start with a capital letter
   - `// Process items in reverse order` (correct)
   - `// process items in reverse order` (wrong)
   - Exception: `eslint-disable`, `@ts-` directives, and technical identifiers (e.g., `// e.g. ...`)

### WHY Not WHAT

Comments explain **reasoning**, not **mechanics**:

**Bad - describes WHAT**:
```javascript
// Loop through items
for (const item of items) { ... }

// Increment counter
counter++;

// Check if valid
if (isValid) { ... }
```

**Good - explains WHY**:
```javascript
// Process in reverse order for dependency resolution
for (const item of items.reverse()) { ... }

// Track retry count for exponential backoff control
retryCount++;

// Skip invalid entries to avoid downstream embedding errors
if (!isValid) return null;
```

### When to Comment

| Situation | Comment? | Example |
|-----------|----------|---------|
| Non-obvious logic | YES | `// Sort timestamp DESC so newest appears first` |
| Business rule | YES | `// Constitutional tier must always surface regardless of score` |
| Workaround | YES | `// Works around an SDK hang on empty payloads` |
| Security concern | YES | `// SEC: sanitize input to prevent stored XSS (CWE-79)` |
| Self-explanatory code | NO | `const sum = a + b;` needs no comment |
| Obvious loops | NO | `for (let i = 0; i < 10; i++)` needs no comment |

### Comment Placement

Place comments on the line BEFORE the code they describe:

```javascript
// GOOD: Comment before
// Calculate weighted score using decay function
const score = calculateDecay(baseScore, age);

// BAD: Comment after
const score = calculateDecay(baseScore, age); // weighted decay
```

---

## 4. REFERENCE COMMENT PATTERNS

> **Governed by the canonical rule.** Comments must never embed an ephemeral-artifact pointer — a spec folder/number, a packet/phase/task/checklist/requirement id, a feature-catalog entry, an ADR id, or a ticket id. See [`../../universal/code_style_guide.md`](../../universal/code_style_guide.md) §4 "No ephemeral-artifact pointers" for the allowed-vs-forbidden contract. Only a **durable** external standard may be cited in a comment.

### Allowed Reference Comments

| Prefix | Purpose | Allowed because | Example |
|--------|---------|-----------------|---------|
| `SEC:` | Security note tied to a stable standard | CWE/CVE/RFC ids are externally versioned and durable | `// SEC: sanitize user input to prevent stored XSS (CWE-79)` |
| `PERF:` | Performance constraint | Names a durable behavioral requirement, no artifact id | `// PERF: debounce to one reflow per frame` |
| `BUG` | Workaround for a durable external bug | Names the symptom + a durable tracker, not a spec-folder bug list | `// Works around an upstream SDK hang on empty payloads` |

### Removed prefixes — DO NOT USE

`T###`, `REQ-###`, and `CHK-###` are **removed**. They point into `tasks.md` / `spec.md` / `checklist.md` inside a spec folder that is renamed or archived independently of the code — exactly the dangling pointer the canonical rule forbids. Replace the id with the durable WHY:

```typescript
// BAD — points into an archived spec folder
// T043-T047: Causal Memory Graph handlers

// GOOD — names the behavior, which never gets archived
// Causal Memory Graph handlers: drift-why, causal-link, causal-stats, causal-unlink
handleMemoryDriftWhy, handleMemoryCausalLink, handleMemoryCausalStats, handleMemoryCausalUnlink,
```

### When to Use Reference Comments

1. **Security-sensitive code**: cite the durable standard (CWE/CVE/RFC) and the mitigation.
2. **Documented workaround**: name the durable external tracker plus the symptom.
3. **Never** to point at a spec folder, task, requirement, checklist, packet, phase, or ADR — capture the WHY instead.

### Design Principles Gate (KISS/DRY/SOLID)

Apply this gate before finalizing implementation:

1. **KISS**: remove speculative layers that do not serve current behavior.
2. **DRY**: centralize repeated literals/rules into a single source.
3. **SOLID**: flag SRP/OCP/LSP/ISP/DIP violations and simplify before merge.

Carry-over from 139: keep rule constants centralized and test imports referencing those constants (avoid duplicate local literals).

---

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

- `../javascript/style_guide.md` - JavaScript naming, formatting, headers
- `../typescript/style_guide.md` - TypeScript naming, types, interfaces, imports
- `../python/style_guide.md` - Python naming, docstrings, imports
- `../shell/style_guide.md` - Shell shebang, quoting, functions
- `../config/style_guide.md` - JSON/JSONC structure, comments

### Related Documents

- `code_organization.md` - Module organization, file structure
- `../../../assets/opencode/checklists/universal_checklist.md` - Cross-language validation items
