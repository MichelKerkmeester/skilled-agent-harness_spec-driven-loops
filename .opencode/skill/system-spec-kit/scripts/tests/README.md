# System Spec Kit Test Suite

> Comprehensive test suite for validating system-spec-kit scripts, modules, templates, and end-to-end workflows.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. 🛠️ TROUBLESHOOTING](#4--troubleshooting)
- [5. 📚 RELATED DOCUMENTS](#5--related-documents)

---

## 1. 📖 OVERVIEW

### What is the System Spec Kit Test Suite?

The test suite provides comprehensive validation for all system-spec-kit functionality including script modules, integration workflows, template systems, cognitive memory features, and validation rules. Tests ensure reliability across spec folder creation, memory save/restore, checkpoint management, and all utility functions.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Test Files | 8 | JavaScript and Bash tests |
| Test Types | 4 | Module, integration, template, validation |
| Coverage Areas | 10+ | Scripts, loaders, validators, templates, memory system |

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
| Bash | 3.2+ | 5.0+ (macOS compatible with default) |

---

## 2. 🚀 QUICK START

### 30-Second Setup

```bash
# 1. Navigate to tests directory
cd /Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/.opencode/skill/system-spec-kit/scripts/tests

# 2. No installation needed - tests use existing project dependencies

# 3. Run all tests
node test-scripts-modules.js && \
node test-integration.js && \
node test-template-system.js && \
./test-validation.sh
```

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
# Run module tests (fastest)
node test-scripts-modules.js

# Run integration tests (comprehensive)
node test-integration.js

# Run validation tests (fixture-based)
./test-validation.sh
```

---

## 3. 📁 STRUCTURE

```
tests/
├── test-bug-fixes.js              # Regression tests for fixed bugs
├── test-embeddings-factory.js     # Cognitive memory embedding tests
├── test-fixtures/                 # Symlink to test fixture spec folders
├── test-integration.js            # End-to-end workflow tests
├── test-scripts-modules.js        # Module-level unit tests
├── test-template-system.js        # Template validation tests
├── test-validation-extended.sh    # Extended validation test suite
├── test-validation.sh             # Core validation tests (bash)
└── README.md                      # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `test-scripts-modules.js` | Tests individual script modules (loaders, validators, utils) in isolation |
| `test-integration.js` | End-to-end tests for memory save, validation, checkpoints, spec creation |
| `test-template-system.js` | Validates template system, level detection, folder structure |
| `test-validation.sh` | Bash-based validation against fixture spec folders |
| `test-validation-extended.sh` | Extended validation suite with additional edge cases |
| `test-bug-fixes.js` | Regression tests ensuring previously fixed bugs stay fixed |
| `test-embeddings-factory.js` | Tests embedding generation and cognitive memory features |
| `test-fixtures/` | Symlink to `../test-fixtures` containing sample spec folders |

---

## 4. 🛠️ TROUBLESHOOTING

### Common Issues

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
| Permission denied on bash scripts | `chmod +x test-validation.sh test-validation-extended.sh` |
| Test workspace pollution | `rm -rf .test-workspace && mkdir -p .test-workspace/specs` |
| Failed test run | `node test-scripts-modules.js 2>&1 | tee test-output.log` |
| Stale test database | `rm -f .test-workspace/test-*.sqlite` |

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

## 5. 📚 RELATED DOCUMENTS

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

*Documentation for system-spec-kit test suite v2.0*
