---
title: "System Spec Kit Test Suite"
description: "Comprehensive test suite for validating system-spec-kit scripts, modules, templates, and end-to-end workflows."
trigger_phrases:
  - "spec kit tests"
  - "test suite"
  - "validation tests"
importance_tier: "normal"
---

# System Spec Kit Test Suite

> Comprehensive test suite for validating system-spec-kit scripts, modules, templates, and end-to-end workflows.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. 🛠️ TROUBLESHOOTING](#4--troubleshooting)
- [5. 📚 RELATED DOCUMENTS](#5--related-documents)
- [6. 🧠 COGNITIVE MEMORY TEST SUITE](#6--cognitive-memory-test-suite)

---

<!-- /ANCHOR:table-of-contents -->
## 1. 📖 OVERVIEW
<!-- ANCHOR:overview -->

### What is the System Spec Kit Test Suite?

The test suite provides comprehensive validation for all system-spec-kit functionality including script modules, integration workflows, template systems, cognitive memory features, and validation rules. Tests ensure reliability across spec folder creation, memory save/restore, checkpoint management, and all utility functions.

**TypeScript Migration Status**: Source code has been migrated to TypeScript (`.ts` files) with compiled output in `dist/` subdirectories. Test files (.js) currently require updates to import from compiled output (`../dist/lib/`, `../dist/utils/`) instead of source directories.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Test Files | 20 | JavaScript, Python, and Bash tests |
| Test Types | 6 | Module, integration, template, validation, framework, extractors |
| Coverage Areas | 15+ | Scripts, loaders, validators, templates, memory system, dual-threshold, Five Checks |
| Total Tests | 800+ | Across all test files |

### Key Features

| Feature | Description |
|---------|-------------|
| **Module Tests** | Validates all script modules in isolation (loaders, validators, utils) |
| **Integration Tests** | End-to-end workflows including memory save, validation, checkpoints |
| **Template Tests** | Validates template system, level detection, and spec folder structure |
| **Validation Tests** | Bash-based validation of fixture spec folders against rules |
| **Bug Regression Tests** | Ensures previously fixed bugs remain fixed |
| **Embeddings Tests** | Validates embedding factory and cognitive memory features |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18+ | 20+ |
| Python | 3.9+ | 3.11+ |
| pytest | 7+ | Latest |
| Bash | 3.2+ | 5.0+ (macOS compatible with default) |

---

<!-- /ANCHOR:overview -->
## 2. 🚀 QUICK START
<!-- ANCHOR:quick-start -->

### 30-Second Setup

```bash
# 1. Navigate to scripts directory and build TypeScript
cd .opencode/skill/system-spec-kit/scripts
npm run build  # or: tsc -b

# 2. Navigate to tests directory
cd tests

# 3. Run all tests (requires compiled dist/ output)
node test-bug-fixes.js && \
node test-embeddings-factory.js && \
node test-extractors-loaders.js && \
node test-five-checks.js && \
node test-integration.js && \
node test-scripts-modules.js && \
node test-template-comprehensive.js && \
node test-template-system.js && \
node test-validation-system.js && \
pytest test_dual_threshold.py -v && \
./test-validation.sh
```

**IMPORTANT**: After the TypeScript migration, test files must be updated to import from `../dist/` instead of directly from source directories (e.g., `../dist/utils/path-utils` instead of `../utils/path-utils`).

### Verify Test Environment

```bash
# Check Node.js version
node --version
# Expected: v18.0.0 or higher

# Check test fixtures exist
ls -la test-fixtures
# Expected: Directory with fixture spec folders
```

### First Use

```bash
# Ensure TypeScript is compiled first
cd .. && npm run build && cd tests

# Run module tests (fastest)
node test-scripts-modules.js

# Run integration tests (comprehensive)
node test-integration.js

# Run validation tests (fixture-based)
./test-validation.sh
```

---

<!-- /ANCHOR:quick-start -->
## 3. 📁 STRUCTURE
<!-- ANCHOR:structure -->

```
tests/
├── test-bug-fixes.js              # Regression tests for fixed bugs
├── test-bug-regressions.js        # Extended bug regression tests
├── test-cleanup-orphaned-vectors.js # Orphaned vector cleanup tests
├── test-embeddings-behavioral.js  # Embeddings behavioral tests
├── test-embeddings-factory.js     # Cognitive memory embedding tests
├── test-export-contracts.js       # Module export contract tests
├── test-extractors-loaders.js     # Extractor and loader module tests
├── test-five-checks.js            # Five Checks Framework validation
├── test-fixtures/                 # Symlink to test fixture spec folders
├── test-folder-detector-functional.js # Folder detector functional tests
├── test-integration.js            # End-to-end workflow tests
├── test-naming-migration.js       # Naming migration tests
├── test-retry-manager-behavioral.js # Retry manager behavioral tests
├── test-scripts-modules.js        # Module-level unit tests
├── test-template-comprehensive.js # Comprehensive template tests
├── test-template-system.js        # Template validation tests
├── test-utils.js                  # Shared test utilities
├── test-validation-extended.sh    # Extended validation test suite
├── test-validation-system.js      # JavaScript validation tests
├── test-validation.sh             # Core validation tests (bash)
├── test_dual_threshold.py         # Python dual-threshold tests
└── README.md                      # This file
```

### Key Files

| File | Purpose | Tests |
|------|---------|-------|
| `test-scripts-modules.js` | Tests individual script modules (loaders, validators, utils) in isolation | ~450 |
| `test-integration.js` | End-to-end tests for memory save, validation, checkpoints, spec creation | ~40 |
| `test-template-system.js` | Validates template system, level detection, folder structure | ~50 |
| `test-template-comprehensive.js` | Extended template tests with rendering, addendum, compose.sh | 154 |
| `test-validation.sh` | Bash-based validation against fixture spec folders | ~55 |
| `test-validation-extended.sh` | Extended validation suite with additional edge cases | ~65 |
| `test-validation-system.js` | JavaScript validation tests for all 13 rules | 99 |
| `test-bug-fixes.js` | Regression tests ensuring previously fixed bugs stay fixed | ~35 |
| `test-bug-regressions.js` | Extended bug regression test suite | - |
| `test-embeddings-factory.js` | Tests embedding generation and cognitive memory features | ~12 |
| `test-embeddings-behavioral.js` | Behavioral tests for embeddings system | - |
| `test-extractors-loaders.js` | Tests all extractor and loader modules | 279 |
| `test-five-checks.js` | Five Checks Framework documentation and validation | 65 |
| `test-folder-detector-functional.js` | Functional tests for spec folder detection logic | - |
| `test-retry-manager-behavioral.js` | Behavioral tests for retry manager | - |
| `test-cleanup-orphaned-vectors.js` | Tests orphaned vector cleanup functionality | - |
| `test-naming-migration.js` | Tests naming migration logic | - |
| `test-export-contracts.js` | Validates module export contracts | - |
| `test-utils.js` | Shared test utilities (assertions, fixtures, mocks) | - |
| `test_dual_threshold.py` | Python pytest for skill_advisor.py dual-threshold | 71 |
| `test-fixtures/` | Symlink to `../test-fixtures` containing sample spec folders | - |

---

<!-- /ANCHOR:structure -->
## 4. 🛠️ TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

### Common Issues

#### Module not found errors after TypeScript migration

**Symptom**: `Error: Cannot find module '../utils/path-utils'` or `Cannot find module '../lib/anchor-generator'`

**Cause**: Tests still import from TypeScript source directories instead of compiled `dist/` output

**Solution**:
```bash
# Option 1: Rebuild TypeScript to ensure dist/ is up to date
cd .. && npm run build && cd tests

# Option 2: Update test imports to use dist/ paths
# Change: require('../utils/path-utils')
# To: require('../dist/utils/path-utils')
```

#### Test failures due to missing test workspace

**Symptom**: `Error: ENOENT: no such file or directory, scandir '.test-workspace'`

**Cause**: Integration tests create a temporary test workspace that may not exist

**Solution**:
```bash
# Test will auto-create workspace, but you can pre-create it
mkdir -p .test-workspace/specs
```

#### Test fixtures symlink broken

**Symptom**: `Error: Cannot read test fixtures`

**Cause**: Symlink to `../test-fixtures` is broken or missing

**Solution**:
```bash
# Recreate symlink
ln -sf ../test-fixtures test-fixtures

# Verify
ls -la test-fixtures
```

#### Node.js version too old

**Symptom**: `SyntaxError: Unexpected token` or module import errors

**Cause**: Node.js version < 18

**Solution**:
```bash
# Check version
node --version

# Upgrade via nvm (if installed)
nvm install 20
nvm use 20
```

#### Bash tests fail on macOS

**Symptom**: Bash script errors on macOS default bash (3.2)

**Cause**: Some bash features require newer versions

**Solution**:
```bash
# Tests are compatible with bash 3.2, but if issues persist:
# Install bash 5 via Homebrew
brew install bash

# Run with explicit bash version
/usr/local/bin/bash test-validation.sh
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Module not found errors | `cd .. && npm run build && cd tests` (rebuild TypeScript) |
| Tests import from source not dist/ | Update require paths to `../dist/utils/` or `../dist/lib/` |
| Permission denied on bash scripts | `chmod +x test-validation.sh test-validation-extended.sh` |
| Test workspace pollution | `rm -rf .test-workspace && mkdir -p .test-workspace/specs` |
| Failed test run | `node test-scripts-modules.js 2>&1 | tee test-output.log` |
| Stale test database | `rm -f .test-workspace/test-*.sqlite` |
| Stale TypeScript build | `cd .. && rm -rf dist && npm run build` |

### Diagnostic Commands

```bash
# Check which tests exist
ls -la *.js *.sh

# Run tests with verbose output
NODE_ENV=test node test-integration.js

# Check test fixtures
ls -la ../test-fixtures/

# Validate test workspace
ls -la .test-workspace/specs/
```

---

<!-- /ANCHOR:troubleshooting -->
## 5. 📚 RELATED DOCUMENTS
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [Scripts README](../README.md) | Overview of all system-spec-kit scripts |
| [Validation Rules](../../references/validation/validation_rules.md) | Rules enforced by validation tests |
| [Template Guide](../../references/templates/template_guide.md) | Template system tested by template tests |
| [Memory System](../../references/memory/memory_system.md) | Memory features tested by integration tests |

### External Resources

| Resource | Description |
|----------|-------------|
| [Node.js Test Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices) | Testing patterns and principles |
| [Bash Test Framework](https://github.com/bats-core/bats-core) | Alternative bash testing approach |

---

<!-- /ANCHOR:related -->
## 6. 🧠 COGNITIVE MEMORY TEST SUITE
<!-- ANCHOR:cognitive-memory-test-suite -->

### Overview

Test utilities and fixtures for cognitive memory features. The `test-utils.js` module provides shared assertions, fixtures, and mocks used across test files. Cognitive memory test fixtures are located in the MCP server test directory.

### Test Utilities

The `test-utils.js` module provides:

```javascript
const {
  // Assertions
  assert, assertApproxEqual, assertInRange, assertArrayEqual, assertThrows,

  // Test data creation
  createTestMemory, mockDatabase, mockEmbedding,

  // Test infrastructure
  createTestRunner, loadFixture, createTempDir, cleanupTempDir,

  // Utilities
  sleep, randomString, cosineSimilarity
} = require('./test-utils');
```

### Test Fixtures

Located in `../../mcp_server/tests/fixtures/`:

| Fixture | Purpose |
|---------|---------|
| `sample-memories.json` | Sample memory objects for all 5 tiers |
| `contradiction-pairs.json` | Contradiction detection test cases |
| `similarity-test-cases.json` | Semantic similarity validation cases |

---

*Documentation for system-spec-kit test suite v2.1 | TypeScript Migration | Last updated: 2026-02-07*
<!-- /ANCHOR:cognitive-memory-test-suite -->
