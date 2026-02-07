---
title: Universal Patterns - Cross-Language Code Standards
description: Patterns applicable to ALL languages in OpenCode system code including naming principles, commenting philosophy, and reference comment patterns.
---

# Universal Patterns - Cross-Language Code Standards

Patterns applicable to ALL languages in OpenCode system code.

---

## 1. 📖 OVERVIEW

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
| Reference comments | `mcp_server/context-server.ts` | Lines 34, 42, 62, 65 |
| Section organization | `scripts/core/config.ts` | Lines 9-11, 24-26 |
| Naming conventions | `mcp_server/handlers/memory-search.ts` | Throughout |
| Python docstrings | `scripts/skill_advisor.py` | Lines 6-16, 439-486 |

---

## 2. 🏷️ NAMING PRINCIPLES

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

## 3. 💬 COMMENTING PHILOSOPHY

### Core Principles

1. **Quantity limit:** Maximum 5 comments per 10 lines of code
2. **Focus on WHY, not WHAT:** Explain intent, constraints, reasoning
3. **No commented-out code:** Delete unused code (git preserves history)
4. **Function purpose comments:** Single line above function describing intent

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
// Process items in reverse order for dependency resolution
for (const item of items.reverse()) { ... }

// Track retry count for exponential backoff
retryCount++;

// Early return: skip processing for invalid entries to avoid
// downstream errors in the embedding pipeline
if (!isValid) return null;
```

### When to Comment

| Situation | Comment? | Example |
|-----------|----------|---------|
| Non-obvious logic | YES | `// Sort by timestamp DESC so newest appears first` |
| Business rule | YES | `// Constitutional tier always surfaces (REQ-005)` |
| Workaround | YES | `// Workaround for SDK bug #123` |
| Security concern | YES | `// SEC-001: Sanitize input (CWE-79)` |
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

## 4. 📌 REFERENCE COMMENT PATTERNS

Reference comments create traceability between code and requirements/issues. OpenCode uses these prefixes:

### Pattern Reference Table

| Prefix | Purpose | Format | Example |
|--------|---------|--------|---------|
| `T###` | Task reference | `// T001: Description` | `// T043-T047: Causal Memory Graph handlers` |
| `BUG-###` | Bug fix tracking | `// BUG-042: Fix race condition` | `// BUG-107: Pending file recovery on startup` |
| `REQ-###` | Requirement tracing | `// REQ-003: Must support UTF-8` | `// REQ-033: Transaction manager for recovery` |
| `SEC-###` | Security note | `// SEC-001: Description (CWE-XXX)` | `// SEC-001: Sanitize user input (CWE-79)` |
| `CHK-###` | Checklist item | `// CHK-160: Token budget estimation` | `// CHK-160: Pre-flight validation` |

### Evidence from Codebase

```typescript
// From context-server.ts:34,62,65
// T043-T047: Causal Memory Graph handlers
handleMemoryDriftWhy, handleMemoryCausalLink, handleMemoryCausalStats, handleMemoryCausalUnlink,

// T001-T004: Session deduplication
import * as sessionManager from './lib/session/session-manager';

// T107: Transaction manager for pending file recovery on startup (REQ-033)
import * as transactionManager from './lib/storage/transaction-manager';
```

### When to Use Reference Comments

1. **Implementing a specific task**: Link to task ID
2. **Fixing a reported bug**: Link to bug tracker ID
3. **Implementing a requirement**: Link to requirement spec
4. **Security-sensitive code**: Link to CWE and document mitigation
5. **Checklist validation**: Link to specific checklist item

### Grouping Related Tasks

For related tasks, use range notation:

```javascript
// GOOD: Range for related tasks
// T043-T047: Causal Memory Graph handlers

// ALSO GOOD: List for non-sequential
// T001, T004, T015: Session management handlers

// BAD: Individual comments for each
// T043: drift_why handler
// T044: causal_link handler
// T045: causal_stats handler
// T046: (etc - too verbose)
```

---

## 5. 📁 FILE ORGANIZATION

### Universal Section Order

All files follow a consistent section progression:

```
1. Header (shebang for scripts, box-drawing title)
2. Directives ('use strict', set -euo pipefail)
3. Imports/Dependencies
4. Constants/Configuration
5. Type Definitions (if applicable)
6. Helper Functions (private/internal)
7. Main Logic (public API)
8. Exports (module.exports, __all__)
9. Main Entry Point (if script)
```

### Section Dividers

Use numbered section dividers to organize code:

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

## 6. 🔒 SECURITY PATTERNS

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
const safePath = path.resolve(baseDir, userPath);
if (!safePath.startsWith(baseDir)) {
  throw new Error('Path traversal detected');
}
```

```python
# Python
import os
safe_path = os.path.realpath(os.path.join(base_dir, user_path))
if not safe_path.startswith(os.path.realpath(base_dir)):
    raise ValueError("Path traversal detected")
```

### Secrets Management

Never hardcode secrets:

```javascript
// GOOD: Environment variable
const apiKey = process.env.API_KEY;

// BAD: Hardcoded
const apiKey = "sk-1234567890abcdef";
```

---

## 7. 🔗 RELATED RESOURCES

### Language-Specific References

- `../javascript/style_guide.md` - JavaScript naming, formatting, headers
- `../typescript/style_guide.md` - TypeScript naming, types, interfaces, imports
- `../python/style_guide.md` - Python naming, docstrings, imports
- `../shell/style_guide.md` - Shell shebang, quoting, functions
- `../config/style_guide.md` - JSON/JSONC structure, comments

### Related Documents

- `code_organization.md` - Module organization, file structure
- `../../assets/checklists/universal_checklist.md` - Cross-language validation items
