# MCP Server Test Suite

> Comprehensive test suite for cognitive memory and MCP handlers.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. ⚡ FEATURES](#4--features)
- [5. 💡 USAGE EXAMPLES](#5--usage-examples)
- [6. 🛠️ TROUBLESHOOTING](#6--troubleshooting)
- [7. 🎯 WORKFLOWS-CODE COMPLIANCE](#7--workflows-code-compliance)
- [8. 🔍 RUNNING VERIFICATION](#8--running-verification)
- [9. 🔗 RELATED RESOURCES](#9--related-resources)

---

## 1. 📖 OVERVIEW

### What are the MCP Server Tests?

The test suite validates all critical functionality of the Spec Kit Memory MCP server. Tests cover cognitive memory features (attention decay, working memory, co-activation), tier classification, summary generation, and MCP tool handlers. Each test file is self-contained with its own test framework, assertion helpers, and detailed reporting.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Test Files | 35+ | Covering cognitive, handlers, memory, causal, and integration |
| Test Categories | 9 | A-I (Search, Decay, Session, Graph, Performance, UX, Arch, Tools, Resilience) |
| Total Tests | 1,500+ | Across all test files |
| Test Modes | 2 | Normal and Quick mode (skips embedding tests) |
| Coverage Target | 80/70/50 | Unit 80%, Integration 70%, E2E 50% |

### Key Features

| Feature | Description |
|---------|-------------|
| **Self-Contained Framework** | Each test file includes its own assertion helpers and result tracking |
| **Detailed Evidence** | Every assertion captures evidence (values, outputs, error messages) |
| **Category Organization** | Tests grouped by functional domain with category-level reporting |
| **Quick Mode** | Skip embedding-dependent tests for fast CI/local testing |
| **Comprehensive Coverage** | Unit tests, integration tests, error handling, edge cases |
| **Color-Coded Output** | Visual pass/fail indicators with detailed failure reasons |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18+ | 20+ |
| better-sqlite3 | 9+ | Latest |
| MCP Server | Running | For handler tests |

---

## 2. 🚀 QUICK START

### 30-Second Setup

```bash
# 1. Navigate to test directory
cd .opencode/skill/system-spec-kit/mcp_server/tests

# 2. Run all tests
node test-mcp-tools.js

# 3. Run specific test file
node attention-decay.test.js
```

### Verify Installation

```bash
# Check that tests can find modules
node -e "console.log(require('../lib'))"
# Expected: Object with search, scoring, cognitive, etc.

# Run quick validation
node test-mcp-tools.js --quick
# Expected: Test results with PASS/FAIL counts
```

### First Use

```bash
# Run a single feature test
node working-memory.test.js

# Output:
# Running Spec Kit Memory Tests...
#   ✅ Working memory initializes correctly
#   ✅ Add memory to working memory
#   ...
# ✅ PASS: 15 | ❌ FAIL: 0 | ⏭️ SKIP: 2
```

---

## 3. 📁 STRUCTURE

```
tests/
├── # Core Cognitive Tests
├── attention-decay.test.js         # Multi-factor attention decay (137 tests)
├── co-activation.test.js           # Related memory activation (38 tests)
├── tier-classifier.test.js         # 5-state classification (91 tests)
├── working-memory.test.js          # Session working memory (51 tests)
├── summary-generator.test.js       # Auto-summary generation (52 tests)
├── fsrs-scheduler.test.js          # FSRS algorithm unit tests (52 tests)
├── prediction-error-gate.test.js   # PE thresholds and contradiction (65 tests)
├── consolidation.test.js           # Memory consolidation pipeline (30 tests) (NEW)
│
├── # Search & Scoring Tests
├── composite-scoring.test.js       # 5-factor scoring with retrievability (101 tests)
├── five-factor-scoring.test.js     # Five-factor scoring validation (109 tests)
├── rrf-fusion.test.js              # RRF fusion with k=60 (22 tests) (NEW)
├── bm25-index.test.js              # BM25 lexical indexing (73 tests) (NEW)
├── intent-classifier.test.js       # 5 intent types (46 tests) (NEW)
├── fuzzy-match.test.js             # Query expansion (61 tests) (NEW)
├── cross-encoder.test.js           # Cross-encoder reranking (50 tests) (NEW)
├── hybrid-search.test.js           # Hybrid search (66 tests) (NEW)
│
├── # Session & Recovery Tests
├── session-manager.test.js         # Session deduplication (NEW)
├── continue-session.test.js        # Session continuation (35 tests)
├── crash-recovery.test.js          # Crash recovery (17 tests)
├── recovery-hints.test.js          # 49 error codes (NEW)
│
├── # Graph & Relations Tests
├── causal-edges.test.js            # Causal graph edges (89 tests)
├── corrections.test.js             # Learning from corrections
│
├── # Infrastructure Tests
├── schema-migration.test.js        # Schema v4-v9 migrations (58 tests)
├── modularization.test.js          # Module structure (78 tests)
├── provider-chain.test.js          # Embedding fallback chain (77 tests)
├── preflight.test.js               # Preflight validation (34 tests)
├── retry.test.js                   # Retry logic (82 tests)
├── incremental-index.test.js       # Incremental indexing
├── interfaces.test.js              # Protocol interfaces
├── layer-definitions.test.js       # 7-layer architecture (105 tests) (NEW)
├── memory-types.test.js            # 9 memory types (15 tests) (NEW)
├── tool-cache.test.js              # Tool caching
├── transaction-manager.test.js     # Transaction management (18 tests)
│
├── # Integration Tests
├── memory-save-integration.test.js # PE gate + save handler
├── memory-search-integration.test.js # Testing effect integration
├── memory-context.test.js          # Unified context entry (NEW)
├── test-cognitive-integration.js   # Cognitive system integration
├── test-mcp-tools.js               # Comprehensive MCP handler tests
├── test-memory-handlers.js         # Memory handler tests
├── test-session-learning.js        # Session learning handler tests
├── verify-cognitive-upgrade.js     # Comprehensive upgrade verification
├── archival-manager.test.js        # Archival system (41 tests) (NEW)
│
├── # Documentation
├── README.md                       # This file
├── VERIFICATION_REPORT.md          # Phase 3 verification report
└── [scratch/]                      # Temporary test artifacts (gitignored)
```

### Test Categories (A-I)

| Category | Description | Test Count |
|----------|-------------|------------|
| **A: Search & Retrieval** | Vector, hybrid, BM25, RRF, cross-encoder | ~300 |
| **B: Memory Decay & Lifecycle** | FSRS, attention, tier classification | ~250 |
| **C: Session Management** | Deduplication, continuation, crash recovery | ~100 |
| **D: Graph & Relationships** | Causal edges, corrections | ~100 |
| **E: Performance & Efficiency** | Caching, incremental indexing | ~80 |
| **F: User Experience & Recovery** | Error hints, preflight validation | ~80 |
| **G: Architecture & Organization** | Layer definitions, interfaces, modules | ~200 |
| **H: Specialized Tools** | Drift tools, context tools | ~100 |
| **I: Embedding Resilience** | Provider chain, fallback, retry | ~200 |

### Key Files

| File | Purpose | Test IDs |
|------|---------|----------|
| `test-mcp-tools.js` | Main test runner for all MCP handlers | ~100 |
| `test-session-learning.js` | Session learning handler tests | 161 |
| `test-memory-handlers.js` | Memory MCP handlers (search, triggers, CRUD) | 162 |
| `test-cognitive-integration.js` | Cognitive memory subsystem integration | T801-T840 |
| `fsrs-scheduler.test.js` | **NEW** - FSRS algorithm calculations | T016-T050 |
| `prediction-error-gate.test.js` | **NEW** - PE thresholds and contradiction | T101-T165 |
| `composite-scoring.test.js` | **NEW** - Weighted scoring system | T401-T445 |
| `schema-migration.test.js` | **NEW** - Schema v4 migration | T701-T750 |
| `memory-save-integration.test.js` | **NEW** - PE gate + save handler | T501-T550 |
| `memory-search-integration.test.js` | **NEW** - Testing effect integration | T601-T650 |
| `verify-cognitive-upgrade.js` | **NEW** - 9-category upgrade verification | 45+ |
| `attention-decay.test.js` | Time-based forgetting simulation | ~35 |
| `co-activation.test.js` | Related memory boosting | ~30 |
| `working-memory.test.js` | Session-scoped memory capacity | ~40 |
| `tier-classifier.test.js` | Six-tier importance classification | ~40 |
| `summary-generator.test.js` | Automatic content summarization | ~45 |
| `modularization.test.js` | Module structure and exports | ~30 |

---

## 4. ⚡ FEATURES

### Test Framework

**Self-Contained Assertions**: Each test file includes its own framework

| Function | Purpose |
|----------|---------|
| `pass(name, evidence, category)` | Mark test as passed with evidence |
| `fail(name, reason, category)` | Mark test as failed with reason |
| `skip(name, reason, category)` | Skip test with explanation |
| `assert(condition, name, evidence, category)` | Conditional pass/fail assertion |

```javascript
// Example test structure
function pass(name, evidence) {
  results.passed++;
  console.log(`   ✅ ${name}`);
  if (evidence) console.log(`      Evidence: ${evidence}`);
}

// Usage
assert(score > 0.5, 'Score is above threshold', `score=${score}`, 'scoring');
```

### Test Organization

**Category-Based Grouping**: Tests organized by functional domain

| Category | Coverage |
|----------|----------|
| Initialization | Module setup, database connection, configuration |
| Core Logic | Primary feature functionality |
| Edge Cases | Boundary conditions, null/undefined handling |
| Error Handling | Invalid inputs, missing data, exceptions |
| Integration | Multi-module interactions, end-to-end flows |
| Performance | Memory usage, execution time, batch operations |

### Test Modes

**Normal Mode**: Runs all tests including embedding-dependent tests

```bash
node test-mcp-tools.js
```

**Quick Mode**: Skips tests requiring embedding model for fast iteration

```bash
node test-mcp-tools.js --quick

# Or set environment variable
export MCP_TEST_QUICK=true
node test-mcp-tools.js
```

### Result Tracking

**Comprehensive Reporting**: Detailed test results with evidence

```javascript
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: [],           // Array of {name, status, evidence/reason, category}
  categories: {}       // Per-category pass/fail/skip counts
};
```

**Summary Output**:
```
Test Results Summary:
✅ PASS: 45 | ❌ FAIL: 2 | ⏭️ SKIP: 3 | Total: 50

By Category:
  attention-decay: ✅ 12 | ❌ 0 | ⏭️ 1
  working-memory: ✅ 10 | ❌ 0 | ⏭️ 0
  scoring: ✅ 8 | ❌ 2 | ⏭️ 0
```

---

## 5. 💡 USAGE EXAMPLES

### Example 1: Run All Tests

```bash
# Execute comprehensive test suite
node test-mcp-tools.js

# View detailed output with evidence
# Example output:
# Running Spec Kit Memory Tests...
#
# Category: Initialization
#   ✅ Database connection successful
#      Evidence: context-index.sqlite exists
#   ✅ All modules load without errors
#      Evidence: 7 modules loaded
#
# Category: Core Logic
#   ✅ Attention decay calculation
#      Evidence: score=0.68 (expected range 0.6-0.8)
# ...
```

### Example 2: Run Specific Feature Test

```bash
# Test attention decay module
node attention-decay.test.js

# Output shows focused results
# Running Attention Decay Tests...
#   ✅ Initialize with database
#   ✅ Calculate decay for normal tier
#      Evidence: decay_rate=0.80, score=0.68
#   ✅ No decay for constitutional tier
#      Evidence: decay_rate=1.0, score=0.85
#   ✅ Fast decay for temporary tier
#      Evidence: decay_rate=0.60, score=0.51
```

### Example 3: Quick Mode for CI

```bash
# Fast testing without embeddings
MCP_TEST_QUICK=true node test-mcp-tools.js

# Results
# ⏭️ Semantic search test (skipped: requires embedding model)
# ⏭️ Trigger matching test (skipped: requires embedding model)
# ✅ PASS: 42 | ❌ FAIL: 0 | ⏭️ SKIP: 8
```

### Example 4: Debug Failing Test

```bash
# Run test with detailed output
node tier-classifier.test.js

# If test fails, examine evidence
#   ❌ Classify content as critical
#      Reason: Expected tier 'critical' but got 'important'
#      Input: 'BREAKING CHANGE: API modified'
#      Actual tier: important
#      Expected tier: critical

# Fix the classifier logic and re-run
```

### Common Patterns

| Pattern | Command | When to Use |
|---------|---------|-------------|
| Full test suite | `node test-mcp-tools.js` | Before commits, comprehensive validation |
| Specific module | `node [module].test.js` | Focused testing during development |
| Quick validation | `node test-mcp-tools.js --quick` | Fast CI, no embedding API needed |
| Category focus | Edit test file to run specific category | Debug specific feature area |

---

## 6. 🛠️ TROUBLESHOOTING

### Common Issues

#### Module not found errors

**Symptom**: `Error: Cannot find module '../lib/cognitive/attention-decay'`

**Cause**: Test running from wrong directory or module path changed

**Solution**:
```bash
# Always run tests from tests/ directory
cd .opencode/skill/system-spec-kit/mcp_server/tests
node attention-decay.test.js

# Or use absolute paths in test files
const path = require('path');
const LIB_PATH = path.join(__dirname, '..', 'lib');
```

#### Database connection errors

**Symptom**: `Error: unable to open database file`

**Cause**: Database file missing or incorrect path

**Solution**:
```bash
# Check database exists
ls -la .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite

# Create database if missing (will be auto-created on first MCP server run)
cd ../..
node scripts/memory/generate-context.js --init
```

#### All tests skipped in quick mode

**Symptom**: `⏭️ SKIP: 50 | Total: 50` when using `--quick`

**Cause**: Too many tests depend on embedding model

**Solution**:
```bash
# Run in normal mode for full coverage
node test-mcp-tools.js

# Or set VOYAGE_API_KEY for embedding tests
export VOYAGE_API_KEY="your-key-here"
node test-mcp-tools.js
```

#### Test failures with no evidence

**Symptom**: `❌ Test failed` with no reason shown

**Cause**: Exception thrown before assertion, missing try/catch

**Solution**:
```javascript
// Wrap test logic in try/catch
try {
  const result = await someFunction();
  assert(result === expected, 'Test name', `result=${result}`, 'category');
} catch (err) {
  fail('Test name', err.message, 'category');
}
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Wrong directory | `cd tests/` before running |
| Missing database | Run MCP server once to initialize |
| Embedding API errors | Use `--quick` flag or set `VOYAGE_API_KEY` |
| Import errors | Check relative paths in test files |
| Timeout errors | Increase timeout in test config |

### Diagnostic Commands

```bash
# Verify test environment
node -e "console.log(process.cwd())"
# Should be in tests/ directory

# Check module resolution
node -e "console.log(require.resolve('../lib'))"
# Should resolve to lib/index.js

# List available tests
ls -1 *.test.js
# Shows all test files

# Check test dependencies
node -e "const lib = require('../lib'); console.log(Object.keys(lib))"
# Shows available lib modules
```

---

## 7. 🎯 WORKFLOWS-CODE COMPLIANCE

### Code Quality Gate Status

All test files comply with workflows-code P0 requirements:

| Check | Status | Description |
|-------|--------|-------------|
| File Headers | PASS | Box-drawing format: `// ───────────...` |
| Section Headers | PASS | Numbered format: `/* ─── 1. SECTION ─── */` |
| snake_case Functions | PASS | All function names (e.g., `load_modules`, `test_retrievability`) |
| UPPER_SNAKE_CASE Constants | PASS | All constants (e.g., `LIB_PATH`, `HANDLER_PATH`) |
| 'use strict' | PASS | All files begin with `'use strict';` |
| No Commented Code | PASS | Clean files without dead code blocks |

### Test Naming Conventions

**Function Names:**
```javascript
// snake_case for all functions
function load_modules() { ... }
function test_retrievability_calculation() { ... }
function setup_test_database() { ... }
```

**Constants:**
```javascript
// UPPER_SNAKE_CASE for all constants
const LIB_PATH = path.join(__dirname, '..', 'lib');
const HANDLER_PATH = path.join(__dirname, '..', 'handlers');
const DEFAULT_TIMEOUT = 5000;
```

**Test IDs:**
```javascript
// Format: T[category][number]
// T001-T052  - FSRS Core Algorithm
// T101-T165  - Prediction Error Gate
// T201-T280  - 5-State Model
// T301-T340  - Attention Decay
// T401-T445  - Composite Scoring
// T501-T550  - Memory Save Integration
// T601-T650  - Memory Search Integration
// T701-T750  - Schema Migration
// T801-T840  - Cognitive Integration
```

### File Structure Standards

**Required File Header:**
```javascript
// ───────────────────────────────────────────────────────────────
// TESTS: [MODULE NAME]
// [Description of what this test file covers]
// Covers: [Test ID Range, e.g., T101-T165]
// ───────────────────────────────────────────────────────────────

'use strict';

const path = require('path');
```

**Required Sections:**
```javascript
/* ─────────────────────────────────────────────────────────────
   1. TEST FRAMEWORK
──────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   2. MODULE LOADING
──────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   3. TEST SUITES (numbered per feature)
──────────────────────────────────────────────────────────────── */
```

**Standard Test Framework:**
```javascript
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: [],
};

function pass(name, evidence) { ... }
function fail(name, reason) { ... }
function skip(name, reason) { ... }
```

---

## 8. 🔍 RUNNING VERIFICATION

### Full Verification Run

```bash
# Navigate to tests directory
cd .opencode/skill/system-spec-kit/mcp_server/tests

# Run all test files
for f in *.test.js; do echo "=== $f ==="; node "$f"; done

# Run verification script
node verify-cognitive-upgrade.js
```

### Individual Test Suites

```bash
# FSRS Algorithm (T016-T050)
node fsrs-scheduler.test.js

# Prediction Error Gate (T101-T165)
node prediction-error-gate.test.js

# Composite Scoring (T401-T445)
node composite-scoring.test.js

# Schema Migration (T701-T750)
node schema-migration.test.js

# Integration Tests
node memory-save-integration.test.js   # T501-T550
node memory-search-integration.test.js # T601-T650
node test-cognitive-integration.js      # T801-T840
```

### Verification Report

See [VERIFICATION_REPORT.md](./VERIFICATION_REPORT.md) for the complete Phase 3 verification report including:
- Code quality gate compliance details
- Test coverage matrix
- Test result summary template
- Verification checklist

---

## 9. 🔗 RELATED RESOURCES

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [MCP Server README](../README.md) | Overview of the MCP server architecture |
| [Library README](../lib/README.md) | Documentation for modules being tested |
| [Handlers README](../handlers/README.md) | MCP handler implementation details |
| [Utils README](../utils/README.md) | Utility functions used in tests |

### Test Coverage

| Module | Test File | Coverage |
|--------|-----------|----------|
| FSRS Scheduler | `fsrs-scheduler.test.js` | **NEW** - Retrievability, stability, difficulty calculations |
| Prediction Error Gate | `prediction-error-gate.test.js` | **NEW** - Thresholds, contradiction detection, action logic |
| Composite Scoring | `composite-scoring.test.js` | **NEW** - Weight configuration, scoring calculations |
| Schema Migration | `schema-migration.test.js` | **NEW** - Column existence, defaults, conflicts table |
| Memory Save Integration | `memory-save-integration.test.js` | **NEW** - PE gate + save handler integration |
| Memory Search Integration | `memory-search-integration.test.js` | **NEW** - Testing effect, hybrid search |
| Session Learning | `test-session-learning.js` | Preflight, postflight, learning history |
| Memory Handlers | `test-memory-handlers.js` | Search, triggers, CRUD, save, index operations |
| Cognitive Integration | `test-cognitive-integration.js` | Full pipeline, session lifecycle |
| Cognitive Upgrade | `verify-cognitive-upgrade.js` | 9-category comprehensive verification |
| Attention Decay | `attention-decay.test.js` | Decay rates, FSRS integration, tier behavior |
| Co-Activation | `co-activation.test.js` | Related memory boosting, spreading activation |
| Working Memory | `working-memory.test.js` | Capacity limits, eviction, session management |
| Tier Classifier | `tier-classifier.test.js` | Six-tier classification, keyword detection |
| Summary Generator | `summary-generator.test.js` | Auto-summarization, length limits, formatting |
| MCP Tools | `test-mcp-tools.js` | All handlers, integration, error handling |
| Modularization | `modularization.test.js` | Module structure, exports, line counts |

### External Resources

| Resource | Description |
|----------|-------------|
| [Node.js Testing](https://nodejs.org/api/test.html) | Native Node.js test runner (alternative approach) |
| [better-sqlite3 Testing](https://github.com/WiseLibs/better-sqlite3/wiki/Testing) | Database testing patterns |
| [MCP Testing Guide](https://modelcontextprotocol.io/testing) | MCP protocol testing best practices |

---

*Documentation version: 1.3 | Last updated: 2026-01-28*
