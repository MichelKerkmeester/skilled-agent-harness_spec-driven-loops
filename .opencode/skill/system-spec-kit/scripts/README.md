# System-Spec-Kit Scripts

> Shell scripts for spec folder creation, validation, and lifecycle management with modular rule-based validation.

---

## Script Registry

All scripts are catalogued in [`scripts-registry.json`](./scripts-registry.json) for dynamic discovery. Use the registry loader to query scripts:

```bash
# List all scripts
./registry-loader.sh --list

# Get info about a specific script
./registry-loader.sh validate-spec

# Find scripts by trigger phrase
./registry-loader.sh --by-trigger "save context"

# List essential scripts only
./registry-loader.sh --essential

# List validation rules
./registry-loader.sh --rules
```

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. ⚡ FEATURES](#4--features)
- [5. ⚙️ CONFIGURATION](#5--configuration)
- [6. 💡 USAGE EXAMPLES](#6--usage-examples)
- [7. 🛠️ TROUBLESHOOTING](#7--troubleshooting)
- [8. 📚 RELATED DOCUMENTS](#8--related-documents)

---

## 1. 📖 OVERVIEW

### What is the scripts/ Directory?

The `scripts/` directory contains shell scripts for spec folder management and validation. These scripts handle creation, validation, archiving, and lifecycle management of spec folders with support for three documentation levels.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Shell Scripts | 10 | Core management and validation |
| JavaScript Entry Points | 2 | generate-context.js, cleanup-orphaned-vectors.js |
| Test Scripts | 3 | tests/test-bug-fixes.js, tests/test-embeddings-factory.js, tests/test-validation.sh |
| generate-context Modules | 30 | Modular architecture across 6 directories (core/, extractors/, utils/, renderers/, spec-folder/, loaders/) |
| Validation Rules | 9 | Modular rule scripts in `rules/` |
| Library Files | 13 | Shell (3) + JavaScript (10) in `lib/` |
| Documentation Levels | 3 | L1, L2, L3 with progressive requirements |

### Key Features

| Feature | Description |
|---------|-------------|
| **Modular Validation** | Rule-based validation with pass/warn/fail/skip states |
| **Level-Aware** | Adapts requirements based on documentation level (L1/L2/L3) |
| **JSON Output** | Machine-readable output for CI/CD integration |
| **Template-Based** | Creates spec folders from standardized templates |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Bash | 3.2+ | 5.0+ |
| bc | Any | Latest |
| git | 2.0+ | Latest |

---

## 2. 🚀 QUICK START

### 30-Second Setup

```bash
# Navigate to project root
cd /path/to/project

# Validate an existing spec folder
.opencode/skill/system-spec-kit/scripts/validate-spec.sh specs/007-feature/

# Create a new spec folder
.opencode/skill/system-spec-kit/scripts/create-spec-folder.sh "Add user authentication" --level 2
```

### Verify Installation

```bash
# Check scripts are executable
ls -la .opencode/skill/system-spec-kit/scripts/*.sh

# Expected: 10 .sh files with execute permissions
# -rwxr-xr-x validate-spec.sh
# -rwxr-xr-x create-spec-folder.sh
# -rwxr-xr-x setup.sh
# -rwxr-xr-x check-completion.sh
# ...
```

### First Use

```bash
# Basic validation with verbose output
.opencode/skill/system-spec-kit/scripts/validate-spec.sh specs/my-feature/ --verbose

# Expected output:
# ✓ FILE_EXISTS: All required files present for Level 2
# ✓ PRIORITY_TAGS: All checklist items have priority context
# ✓ PLACEHOLDER_FILLED: No unfilled placeholders found
```

---

## 3. 📁 STRUCTURE

```
scripts/
├── Shell Scripts (10)
│   ├── validate-spec.sh          # Validate spec folder contents
│   ├── create-spec-folder.sh     # Create new spec folders
│   ├── check-prerequisites.sh    # Check required files exist
│   ├── check-completion.sh       # Verify checklist completion (Gate 6)
│   ├── calculate-completeness.sh # Calculate checklist completion %
│   ├── recommend-level.sh        # Recommend documentation level
│   ├── archive-spec.sh           # Archive completed specs
│   ├── setup.sh                  # Initial setup script
│   └── common.sh                 # Repository & branch utilities
│
├── generate-context.js           # CLI entry point (142 lines) - routes to modular architecture
├── cleanup-orphaned-vectors.js   # Database cleanup utility
│
├── tests/                        # Test scripts (3 files)
│   ├── test-bug-fixes.js         # Bug fix regression tests
│   ├── test-embeddings-factory.js # Test embedding providers
│   └── test-validation.sh        # Test suite for validation
│
├── core/                         # Workflow orchestration (3 files)
│   ├── index.js                  # Module exports
│   ├── config.js                 # Configuration constants
│   └── workflow.js               # Main orchestration logic
│
├── extractors/                   # Data extraction modules (9 files)
│   ├── index.js                  # Module exports
│   ├── file-extractor.js         # File artifact extraction
│   ├── diagram-extractor.js      # ASCII diagram generation
│   ├── decision-tree-generator.js # Decision tree rendering
│   ├── conversation-extractor.js # Conversation summarization
│   ├── decision-extractor.js     # Decision/rationale extraction
│   ├── session-extractor.js      # Session metadata extraction
│   ├── collect-session-data.js   # Session data aggregation
│   └── implementation-guide-extractor.js # Implementation guidance
│
├── utils/                        # Utility functions (10 files)
│   ├── index.js                  # Module exports
│   ├── logger.js                 # Structured logging
│   ├── path-utils.js             # Path resolution
│   ├── data-validator.js         # Data validation
│   ├── input-normalizer.js       # Input normalization
│   ├── prompt-utils.js           # Prompt building
│   ├── file-helpers.js           # File operations
│   ├── tool-detection.js         # Tool usage detection
│   ├── message-utils.js          # Message processing
│   └── validation-utils.js       # Validation helpers
│
├── renderers/                    # Template rendering (2 files)
│   ├── index.js                  # Module exports
│   └── template-renderer.js      # Mustache template rendering
│
├── spec-folder/                  # Spec folder handling (4 files)
│   ├── index.js                  # Module exports
│   ├── folder-detector.js        # Spec folder detection
│   ├── alignment-validator.js    # Content alignment validation
│   └── directory-setup.js        # Directory creation
│
├── loaders/                      # Data loading (2 files)
│   ├── index.js                  # Module exports
│   └── data-loader.js            # JSON/fallback data loading
│
├── rules/                        # Modular validation rules (9)
│   ├── check-files.sh            # FILE_EXISTS rule
│   ├── check-folder-naming.sh    # FOLDER_NAMING rule (###-short-name)
│   ├── check-frontmatter.sh      # FRONTMATTER_VALID rule (YAML)
│   ├── check-priority-tags.sh    # PRIORITY_TAGS rule
│   ├── check-evidence.sh         # EVIDENCE_CITED rule
│   ├── check-placeholders.sh     # PLACEHOLDER_FILLED rule
│   ├── check-anchors.sh          # ANCHORS_VALID rule
│   ├── check-sections.sh         # SECTIONS_PRESENT rule
│   ├── check-level.sh            # LEVEL_DECLARED rule
│   └── README.md                 # Rules documentation
│
├── lib/                          # Shared libraries (13 files)
│   ├── Shell (3)
│   │   ├── common.sh             # Validation utilities
│   │   ├── config.sh             # Configuration loading
│   │   └── output.sh             # Formatted output helpers
│   ├── JavaScript (10)
│   │   ├── embeddings.js         # Re-exports from ../../shared/embeddings
│   │   ├── trigger-extractor.js  # Re-exports from ../../shared/trigger-extractor
│   │   ├── semantic-summarizer.js # Message classification
│   │   ├── opencode-capture.js   # OpenCode session capture
│   │   ├── content-filter.js     # Three-stage content filtering
│   │   ├── anchor-generator.js   # ANCHOR ID generation
│   │   ├── flowchart-generator.js # ASCII flowcharts
│   │   ├── ascii-boxes.js        # ASCII box drawing
│   │   ├── simulation-factory.js # Fallback data generation
│   │   └── retry-manager.js      # Embedding retry logic
│   └── README.md                 # Library documentation
│
├── test-fixtures/                # Validation test cases (10 dirs)
│   ├── valid-level1/             # L1 spec structure tests
│   ├── valid-level2/             # L2 spec structure tests
│   ├── valid-level3/             # L3 spec structure tests
│   ├── valid-anchors/            # Valid ANCHOR format tests
│   ├── invalid-anchors/          # Invalid ANCHOR detection
│   ├── valid-evidence/           # Evidence citation tests
│   ├── valid-priority-tags/      # Priority tag tests
│   ├── unfilled-placeholders/    # Placeholder detection tests
│   ├── missing-required-files/   # Missing file detection
│   └── empty-folder/             # Empty directory handling
│
└── README.md                     # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `validate-spec.sh` | Main validation orchestrator - invokes all 9 rules |
| `create-spec-folder.sh` | Create new spec folders with templates |
| `generate-context.js` | Memory file generation with ANCHOR format |
| `check-completion.sh` | Gate 6 enforcement - verify checklist completion |
| `setup.sh` | One-command setup for memory system dependencies |
| `rules/` | Modular validation rules (9 scripts) |
| `lib/` | Shared libraries (3 shell + 10 JavaScript) |
| `test-fixtures/` | Validation test cases (10 directories, 36 files) |

---

## 4. ⚡ FEATURES

### validate-spec.sh

**Purpose**: Validate spec folder contents against documentation level requirements

| Aspect | Details |
|--------|---------|
| **Input** | Spec folder path |
| **Output** | Pass/warn/fail status with details |
| **Rules** | 9 modular validation rules |
| **Modes** | Normal, strict, verbose, JSON |

**Arguments**:

| Argument | Required | Description |
|----------|----------|-------------|
| `[path]` | Yes | Path to spec folder |
| `--json` | No | Output in JSON format |
| `--strict` | No | Treat warnings as errors |
| `--verbose` | No | Enable verbose output |
| `--help` | No | Show help message |

**Exit Codes**:

| Code | Meaning |
|------|---------|
| 0 | Validation passed |
| 1 | Passed with warnings |
| 2 | Validation failed (errors found) |

---

### create-spec-folder.sh

**Purpose**: Create new spec folders with appropriate templates

| Aspect | Details |
|--------|---------|
| **Input** | Feature description |
| **Output** | New spec folder with templates |
| **Levels** | L1, L2, L3 with different file sets |
| **Naming** | Auto-generates numbered folder name |

**Arguments**:

| Argument | Required | Description |
|----------|----------|-------------|
| `<description>` | Yes | Feature description |
| `--short-name` | No | Custom short name (2-4 words) |
| `--level` | No | Documentation level (1, 2, 3). Default: 1 |
| `--number` | No | Custom number prefix |
| `--skip-branch` | No | Don't create git branch |
| `--sharded` | No | Create sharded sections (L3 only) |

---

### check-prerequisites.sh

**Purpose**: Validate spec folder has required files for its level

**Required Files by Level**:

| Level | Required Files |
|-------|----------------|
| L1 | `spec.md`, `plan.md`, `tasks.md` |
| L2 | L1 + `checklist.md` |
| L3 | L2 + `decision-record.md` |

---

### check-completion.sh

**Purpose**: Gate 6 enforcement - verify checklist items are complete before claiming done

| Aspect | Details |
|--------|---------|
| **Input** | Spec folder path |
| **Output** | Pass/fail with incomplete items listed |
| **Gate** | Blocks completion claims until checklist verified |

---

### setup.sh

**Purpose**: One-command setup for semantic memory system

| Aspect | Details |
|--------|---------|
| **Input** | None |
| **Output** | Installed dependencies, initialized database |
| **Actions** | npm install, sqlite-vec setup, database creation |

---

### calculate-completeness.sh

**Purpose**: Calculate checklist completion percentage

**Output Format**:
```
Completeness: 75% (15/20 items)
P0: 100% (5/5)
P1: 80% (4/5)
P2: 60% (6/10)
```

---

### recommend-level.sh

**Purpose**: Recommend documentation level based on project metrics

**Recommendation Logic**:

| Level | Criteria |
|-------|----------|
| L1 | <100 LOC, low risk |
| L2 | 100-499 LOC, or medium risk |
| L3 | ≥500 LOC, or high risk, or architectural changes |

---

### common.sh (Repository Utilities)

**Purpose**: Repository and branch utilities for scripts

**Key Functions**:

| Function | Description |
|----------|-------------|
| `get_repo_root()` | Find repository root directory |
| `get_current_branch()` | Detect current feature branch |
| `has_git()` | Check if in a git repository |
| `check_feature_branch()` | Validate branch naming convention |
| `get_feature_dir()` | Build feature directory path |

---

### JavaScript Scripts

#### generate-context.js (Modular Architecture)

**Purpose**: Generate memory files from conversation data with ANCHOR format for Spec Kit Memory indexing

| Aspect | Details |
|--------|---------|
| **Input** | JSON data file OR spec folder path |
| **Output** | Memory file in `specs/###-feature/memory/` |
| **Format** | ANCHOR-tagged sections (implemented v1.7.2, 58-90% token savings) |
| **Architecture** | 142-line CLI entry point + 30 modules across 6 directories |

**Modular Structure** (refactored from 4,837-line monolith):

| Directory | Purpose | Modules |
|-----------|---------|---------|
| `core/` | Configuration and workflow orchestration | config.js, workflow.js |
| `extractors/` | Data extraction (files, decisions, sessions) | 9 modules |
| `utils/` | Utility functions (logging, paths, validation) | 10 modules |
| `renderers/` | Template rendering (Mustache) | template-renderer.js |
| `spec-folder/` | Spec folder detection and validation | 4 modules |
| `loaders/` | Data loading with fallback logic | data-loader.js |

**Usage Modes**:
```bash
# Mode 1: JSON data file
node generate-context.js /tmp/context-data.json specs/007-feature/

# Mode 2: Direct spec folder (auto-captures from OpenCode)
node generate-context.js specs/007-feature/

# Help
node generate-context.js --help
```

**Extension Points**:
- Add new extractors: Create module in `extractors/`, export via `extractors/index.js`
- Add new utilities: Create module in `utils/`, export via `utils/index.js`
- Modify workflow: Edit `core/workflow.js` (main orchestration)

#### tests/test-embeddings-factory.js

**Purpose**: Test and verify embedding provider configuration

| Aspect | Details |
|--------|---------|
| **Input** | None |
| **Output** | Provider status and configuration |
| **Tests** | Module imports, provider creation, API verification |

#### tests/test-bug-fixes.js

**Purpose**: Regression tests for bug fixes in generate-context.js modular architecture

| Aspect | Details |
|--------|---------|
| **Input** | None |
| **Output** | Pass/fail results for 27 test cases |
| **Tests** | Memory validation, embedding, transactions, error handling |

#### tests/test-validation.sh

**Purpose**: Test suite for validate-spec.sh against fixture spec folders

| Aspect | Details |
|--------|---------|
| **Input** | Options: -v (verbose), -t NAME (single test), -c CATEGORY, -l (list) |
| **Output** | Test pass/fail results, coverage report |
| **Tests** | Validates all test fixtures against expected outcomes |

#### cleanup-orphaned-vectors.js

**Purpose**: Remove orphaned vector entries from the SQLite database

| Aspect | Details |
|--------|---------|
| **Input** | None (uses default database path) |
| **Output** | Cleanup report with deleted count |
| **Action** | Batch deletion of orphaned vectors |

---

## 5. ⚙️ CONFIGURATION

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SPECKIT_VALIDATION` | `true` | Set to `false` to skip validation |
| `SPECKIT_STRICT` | `false` | Set to `true` for strict mode |
| `SPECKIT_JSON` | `false` | Set to `true` for JSON output |
| `SPECKIT_VERBOSE` | `false` | Set to `true` for verbose output |
| `SPECKIT_TEMPLATES_DIR` | Auto-detected | Override templates directory |

### Validation Modes

```bash
# Normal mode (default)
./validate-spec.sh specs/007-feature/

# Strict mode (warnings become errors)
./validate-spec.sh specs/007-feature/ --strict
# Or via environment:
SPECKIT_STRICT=true ./validate-spec.sh specs/007-feature/

# JSON output for CI/tooling
./validate-spec.sh specs/007-feature/ --json

# Disable validation entirely
SPECKIT_VALIDATION=false ./validate-spec.sh specs/007-feature/
```

---

## 6. 💡 USAGE EXAMPLES

### Example 1: Basic Validation

```bash
# Validate a spec folder
./validate-spec.sh specs/007-feature/

# Output:
# ✓ FILE_EXISTS: All required files present for Level 2
# ✓ PRIORITY_TAGS: All checklist items have priority context
# ⚠ EVIDENCE_CITED: Found 3 completed item(s) without evidence
# ✓ PLACEHOLDER_FILLED: No unfilled placeholders found
#
# Result: PASSED with 1 warning(s)
```

---

### Example 2: Create Level 2 Spec Folder

```bash
# Create with auto-generated name
./create-spec-folder.sh "Add user authentication system" --level 2

# Output:
# Created: specs/008-add-user-authentication/
# Files: spec.md, plan.md, tasks.md, checklist.md
# Branch: feature/008-add-user-authentication
```

---

### Example 3: JSON Output for CI

```bash
# Get machine-readable output
./validate-spec.sh specs/007-feature/ --json

# Output:
# {
#   "status": "pass",
#   "level": 2,
#   "rules": [
#     {"name": "FILE_EXISTS", "status": "pass", "message": "..."},
#     ...
#   ]
# }
```

---

### Example 4: Calculate Completion

```bash
# Check checklist progress
./calculate-completeness.sh specs/007-feature/

# Output:
# Completeness: 75% (15/20 items)
# P0: 100% (5/5)
# P1: 80% (4/5)
# P2: 60% (6/10)
```

---

### Common Patterns

| Pattern | Command | When to Use |
|---------|---------|-------------|
| Quick validation | `validate-spec.sh <folder>` | Before committing |
| Strict validation | `validate-spec.sh <folder> --strict` | CI pipelines |
| Create L2 spec | `create-spec-folder.sh "desc" --level 2` | Medium features |
| Check progress | `calculate-completeness.sh <folder>` | During development |

---

## 7. 🛠️ TROUBLESHOOTING

### Common Issues

#### "bc command not found"

**Symptom**: `calculate-completeness.sh: bc: command not found`

**Cause**: bc calculator not installed

**Solution**:
```bash
# macOS
brew install bc

# Linux (Debian/Ubuntu)
apt install bc
```

---

#### "Templates directory not found"

**Symptom**: `Error: Templates directory not found`

**Cause**: Running from wrong directory or templates missing

**Solution**:
```bash
# Run from project root
cd /path/to/project

# Or set templates directory explicitly
SPECKIT_TEMPLATES_DIR=.opencode/skill/system-spec-kit/templates ./create-spec-folder.sh "..."
```

---

#### "Permission denied"

**Symptom**: `bash: ./validate-spec.sh: Permission denied`

**Cause**: Scripts not executable

**Solution**:
```bash
chmod +x .opencode/skill/system-spec-kit/scripts/*.sh
chmod +x .opencode/skill/system-spec-kit/scripts/rules/*.sh
```

---

#### Bash Version Issues

**Symptom**: `lib/config.sh: line X: declare: -A: invalid option`

**Cause**: Bash 3.x doesn't support associative arrays

**Solution**:
```bash
# macOS: Install newer Bash
brew install bash

# Use the new Bash explicitly
/opt/homebrew/bin/bash ./validate-spec.sh specs/007-feature/
```

---

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Missing bc | `brew install bc` or `apt install bc` |
| Permission denied | `chmod +x scripts/*.sh scripts/rules/*.sh` |
| Templates not found | Run from project root |
| Bash version | `brew install bash` (macOS) |

---

### Diagnostic Commands

```bash
# Check Bash version
bash --version

# Check bc is installed
which bc

# Verify scripts are executable
ls -la .opencode/skill/system-spec-kit/scripts/*.sh

# Test validation syntax
bash -n .opencode/skill/system-spec-kit/scripts/validate-spec.sh && echo "Syntax OK"
```

---

## 8. 📚 RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [SKILL.md](../SKILL.md) | Parent skill documentation |
| [rules/README.md](./rules/README.md) | Validation rules documentation |
| [lib/README.md](./lib/README.md) | Library modules documentation |
| [templates/](../templates/) | Spec folder templates |

### External Resources

| Resource | Description |
|----------|-------------|
| [Bash Reference](https://www.gnu.org/software/bash/manual/) | Bash scripting documentation |
| [ShellCheck](https://www.shellcheck.net/) | Shell script linting tool |

---

*Documentation version: 2.0 | Last updated: 2025-12-31*
