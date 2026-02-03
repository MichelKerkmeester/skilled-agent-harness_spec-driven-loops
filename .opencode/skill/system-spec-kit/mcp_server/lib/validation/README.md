# Validation

> Pre-flight quality gates for memory operations: anchor validation, duplicate detection, and token budget verification.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 📁 STRUCTURE](#2--structure)
- [3. ⚡ FEATURES](#3--features)
- [4. 💡 USAGE EXAMPLES](#4--usage-examples)
- [5. 🔗 RELATED RESOURCES](#5--related-resources)

---

## 1. 📖 OVERVIEW

The validation subsystem provides pre-flight checks that run before expensive operations like embedding generation or database writes. It prevents invalid data from entering the system and provides actionable feedback for resolution.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Pre-flight Checks | 4 | Anchors, duplicates, tokens, content size |
| Error Codes | 10 | PF001-PF031 range |
| Config Options | 8 | Environment-configurable thresholds |

### Key Features

| Feature | Description |
|---------|-------------|
| **Anchor Validation** | Validates `<!-- ANCHOR: id -->` format and closure |
| **Duplicate Detection** | Exact (hash) and similar (vector) duplicate finding |
| **Token Budget** | Estimates tokens and enforces limits before API calls |
| **Unified Preflight** | Single `run_preflight()` runs all checks |

---

## 2. 📁 STRUCTURE

```
validation/
├── preflight.js  # Pre-flight validation before expensive operations (v1.2.0)
├── index.js      # Module aggregator
└── README.md     # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `preflight.js` | All validation logic: anchors, duplicates, tokens, content size |
| `index.js` | Re-exports preflight module |

---

## 3. ⚡ FEATURES

### Anchor Format Validation

Validates memory file anchor tags:

| Check | Description |
|-------|-------------|
| Format | Must match `<!-- ANCHOR: id -->` pattern |
| ID Pattern | Alphanumeric start, allows hyphens and slashes |
| Closure | Each opening tag needs `<!-- /ANCHOR: id -->` |
| Uniqueness | No duplicate anchor IDs in same file |

### Duplicate Detection

Two-tier duplicate detection:

| Type | Method | Speed |
|------|--------|-------|
| Exact | SHA-256 content hash | Fast (database lookup) |
| Similar | Vector similarity | Requires embedding |

### Token Budget Estimation

Prevents exceeding embedding API limits:

| Setting | Default | Environment Variable |
|---------|---------|---------------------|
| Chars per token | 3.5 | `MCP_CHARS_PER_TOKEN` |
| Max tokens | 8000 | `MCP_MAX_MEMORY_TOKENS` |
| Warning threshold | 80% | `MCP_TOKEN_WARNING_THRESHOLD` |

### Pre-flight Error Codes

| Code | Error | Description |
|------|-------|-------------|
| PF001 | ANCHOR_FORMAT_INVALID | Invalid anchor syntax |
| PF002 | ANCHOR_UNCLOSED | Missing closing tag |
| PF003 | ANCHOR_ID_INVALID | Invalid anchor ID format |
| PF010 | DUPLICATE_DETECTED | Generic duplicate found |
| PF011 | DUPLICATE_EXACT | Exact hash match |
| PF012 | DUPLICATE_SIMILAR | Vector similarity match |
| PF020 | TOKEN_BUDGET_EXCEEDED | Over token limit |
| PF021 | TOKEN_BUDGET_WARNING | Approaching limit |
| PF030 | CONTENT_TOO_LARGE | Exceeds max size |
| PF031 | CONTENT_TOO_SMALL | Below min size |

---

## 4. 💡 USAGE EXAMPLES

### Example 1: Run All Pre-flight Checks

```javascript
const { run_preflight } = require('./validation');

const result = run_preflight({
  content: memoryFileContent,
  file_path: '/specs/001-feature/memory/context.md',
  spec_folder: 'specs/001-feature',
  database: db,
}, {
  check_anchors: true,
  check_duplicates: true,
  check_tokens: true,
  check_size: true,
});

if (!result.pass) {
  console.log('Pre-flight failed:', result.errors);
}
```

### Example 2: Validate Anchor Format Only

```javascript
const { validate_anchor_format } = require('./validation');

const result = validate_anchor_format(content, { strict: true });
// result.valid: boolean
// result.anchors: ['summary', 'decisions', ...]
// result.errors: [{ code, message, suggestion }]
```

### Example 3: Check Token Budget

```javascript
const { check_token_budget, estimate_tokens } = require('./validation');

const tokens = estimate_tokens(content);
console.log(`Estimated: ${tokens} tokens`);

const budget = check_token_budget(content, { max_tokens: 4000 });
if (!budget.within_budget) {
  console.log(`Over budget: ${budget.estimated_tokens}/${budget.max_tokens}`);
}
```

### Example 4: Dry Run Mode

```javascript
const result = run_preflight(
  { content, file_path, spec_folder },
  { dry_run: true }
);
// result.pass is always true in dry_run
// result.dry_run_would_pass shows actual validation result
```

### Common Patterns

| Pattern | Function | When to Use |
|---------|----------|-------------|
| Full validation | `run_preflight()` | Before memory_save |
| Anchor check | `validate_anchor_format()` | Editing memory files |
| Token estimate | `estimate_tokens()` | Before embedding API |
| Hash compute | `compute_content_hash()` | Duplicate detection |

---

## 5. 🔗 RELATED RESOURCES

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../errors/](../errors/) | Error codes and recovery hints |
| [../../context-server.js](../../context-server.js) | MCP server using validation |

### Configuration

All thresholds are environment-configurable:

```bash
# Token budget
MCP_CHARS_PER_TOKEN=3.5
MCP_MAX_MEMORY_TOKENS=8000
MCP_TOKEN_WARNING_THRESHOLD=0.8

# Content limits
MCP_MIN_CONTENT_LENGTH=10
MCP_MAX_CONTENT_LENGTH=100000

# Duplicate detection
MCP_DUPLICATE_THRESHOLD=0.95

# Strict mode
MCP_ANCHOR_STRICT=true
```

### Exports Reference

```javascript
// Configuration
PREFLIGHT_CONFIG, PreflightErrorCodes

// Error class
PreflightError

// Validators (snake_case)
validate_anchor_format, check_duplicate, check_token_budget,
validate_content_size, compute_content_hash, estimate_tokens,
run_preflight

// Validators (camelCase aliases)
validateAnchorFormat, checkDuplicate, checkTokenBudget,
validateContentSize, computeContentHash, estimateTokens, runPreflight
```

---

*Module version: 1.2.0 | Pre-flight quality gates for memory operations*
