---
title: "System-Spec-Kit Scripts"
description: "Shell scripts for spec folder creation, validation, and lifecycle management with modular rule-based validation."
trigger_phrases:
  - "spec kit scripts"
  - "validation scripts"
  - "spec folder management"
  - "create spec folder"
importance_tier: "normal"
---

# System-Spec-Kit Scripts

> Shell scripts for spec folder creation, validation, and lifecycle management with modular rule-based validation.

---

### Script Registry

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
<!-- ANCHOR:table-of-contents -->

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. ⚡ FEATURES](#4--features)
- [5. ⚙️ CONFIGURATION](#5--configuration)
- [6. 💡 USAGE EXAMPLES](#6--usage-examples)
- [7. 🛠️ TROUBLESHOOTING](#7--troubleshooting)
- [8. 📚 RELATED DOCUMENTS](#8--related-documents)
- [9. 📊 TYPESCRIPT MIGRATION NOTES](#9--typescript-migration-notes)

<!-- /ANCHOR:table-of-contents -->

---

## 1. 📖 OVERVIEW
<!-- ANCHOR:overview -->

### What is the scripts/ Directory?

The `scripts/` directory contains shell scripts for spec folder management and validation. These scripts handle creation, validation, archiving, and lifecycle management of spec folders with support for three documentation levels.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Shell Scripts | 10 | Core management and validation |
| TypeScript Entry Points | 3 | generate-context.ts, cleanup-orphaned-vectors.ts, rank-memories.ts |
| Test Scripts | 17+ | JavaScript (.js), shell (.sh), and Python (.py) test files in tests/ |
| TypeScript Modules | 40+ | Modular architecture across 6 directories (core/, extractors/, utils/, renderers/, spec-folder/, loaders/) |
| Validation Rules | 13 | Modular rule scripts in `rules/` |
| Library Files | 10 | TypeScript (10) in `lib/` |
| Documentation Levels | 3 | L1, L2, L3 with progressive requirements |
| Output Directory | dist/ | Compiled JavaScript from TypeScript sources |

### Key Features

| Feature | Description |
|---------|-------------|
| **Modular Validation** | Rule-based validation with pass/warn/fail/skip states |
| **Level-Aware** | Adapts requirements based on documentation level (L1/L2/L3) |
| **JSON Output** | Machine-readable output for CI/CD integration |
| **Template-Based** | Creates spec folders from standardized templates |

---

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Bash | 3.2+ | 5.0+ |
| bc | Any | Latest |
| git | 2.0+ | Latest |

<!-- /ANCHOR:overview -->
---

## 2. 🚀 QUICK START
<!-- ANCHOR:quick-start -->

### 30-Second Setup

```bash
# Navigate to project root
cd /path/to/project

# Validate an existing spec folder
.opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/007-feature/

# Create a new spec folder
.opencode/skill/system-spec-kit/scripts/spec/create.sh "Add user authentication" --level 2
```

### Verify Installation

```bash
# Check scripts are executable
ls -la .opencode/skill/system-spec-kit/scripts/*.sh

# Expected: .sh files with execute permissions
# -rwxr-xr-x spec/validate.sh
# -rwxr-xr-x spec/create.sh
# -rwxr-xr-x spec/check-completion.sh
# ...
```

### First Use

```bash
# Basic validation with verbose output
.opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/my-feature/ --verbose

# Expected output:
# ✓ FILE_EXISTS: All required files present for Level 2
# ✓ PRIORITY_TAGS: All checklist items have priority context
# ✓ PLACEHOLDER_FILLED: No unfilled placeholders found
```

<!-- /ANCHOR:quick-start -->
---

## 3. 📁 STRUCTURE
<!-- ANCHOR:structure -->

```
scripts/
├── Root Files
│   ├── common.sh                 # Repository & branch utilities
│   ├── package.json              # Node.js dependencies
│   └── tsconfig.json             # TypeScript project configuration
│
├── spec/                         # Spec folder operations (6 shell scripts)
│   ├── create.sh                 # Create new spec folders
│   ├── validate.sh               # Validate spec folder contents
│   ├── check-completion.sh       # Verify checklist completion (Completion Verification Rule)
│   ├── calculate-completeness.sh # Calculate checklist completion %
│   ├── recommend-level.sh        # Recommend documentation level
│   └── archive.sh                # Archive completed specs
│
├── memory/                       # Memory/context operations (3 TypeScript entry points)
│   ├── generate-context.ts       # CLI entry point - memory file generation
│   ├── rank-memories.ts          # Memory ranking utility
│   └── cleanup-orphaned-vectors.ts # Database cleanup utility
│
├── setup/                        # Setup & prerequisites (3 scripts)
│   ├── check-prerequisites.sh    # Check required files exist
│   ├── check-native-modules.sh   # Check native module compatibility
│   └── rebuild-native-modules.sh # Rebuild native modules
│
├── tests/                        # Test scripts (17+ files)
│   ├── test-bug-fixes.js         # Bug fix regression tests
│   ├── test-embeddings-factory.js # Test embedding providers
│   ├── test-validation.sh        # Test suite for validation
│   └── ...                       # Additional .js, .sh, .py test files
│
├── core/                         # Workflow orchestration (3 TypeScript modules)
│   ├── index.ts                  # Module exports
│   ├── config.ts                 # Configuration constants
│   └── workflow.ts               # Main orchestration logic
│
├── extractors/                   # Data extraction modules (10 TypeScript modules)
│   ├── index.ts                  # Module exports
│   ├── file-extractor.ts         # File artifact extraction
│   ├── diagram-extractor.ts      # ASCII diagram generation
│   ├── conversation-extractor.ts # Conversation summarization
│   ├── decision-extractor.ts     # Decision/rationale extraction
│   ├── session-extractor.ts      # Session metadata extraction
│   ├── collect-session-data.ts   # Session data aggregation
│   ├── implementation-guide-extractor.ts # Implementation guidance
│   └── opencode-capture.ts       # OpenCode session capture logic
│
├── utils/                        # Utility functions (11 TypeScript modules)
│   ├── index.ts                  # Module exports
│   ├── logger.ts                 # Structured logging
│   ├── path-utils.ts             # Path resolution
│   ├── data-validator.ts         # Data validation
│   ├── input-normalizer.ts       # Input normalization
│   ├── prompt-utils.ts           # Prompt building
│   ├── file-helpers.ts           # File operations
│   ├── tool-detection.ts         # Tool usage detection
│   ├── message-utils.ts          # Message processing
│   └── validation-utils.ts       # Validation helpers
│
├── renderers/                    # Template rendering (2 TypeScript modules)
│   ├── index.ts                  # Module exports
│   └── template-renderer.ts      # Mustache template rendering
│
├── spec-folder/                  # Spec folder handling (4 TypeScript modules)
│   ├── index.ts                  # Module exports
│   ├── folder-detector.ts        # Spec folder detection
│   ├── alignment-validator.ts    # Content alignment validation
│   └── directory-setup.ts        # Directory creation
│
├── loaders/                      # Data loading (2 TypeScript modules)
│   ├── index.ts                  # Module exports
│   └── data-loader.ts            # JSON/fallback data loading
│
├── rules/                        # Modular validation rules (13 shell scripts)
│   ├── check-files.sh            # FILE_EXISTS rule
│   ├── check-folder-naming.sh    # FOLDER_NAMING rule (###-short-name)
│   ├── check-frontmatter.sh      # FRONTMATTER_VALID rule (YAML)
│   ├── check-priority-tags.sh    # PRIORITY_TAGS rule
│   ├── check-evidence.sh         # EVIDENCE_CITED rule
│   ├── check-placeholders.sh     # PLACEHOLDER_FILLED rule
│   ├── check-anchors.sh          # ANCHORS_VALID rule
│   ├── check-sections.sh         # SECTIONS_PRESENT rule
│   ├── check-level.sh            # LEVEL_DECLARED rule
│   ├── check-complexity.sh       # COMPLEXITY_SCORE rule
│   ├── check-section-counts.sh   # SECTION_COUNTS rule
│   ├── check-ai-protocols.sh     # AI_PROTOCOLS rule
│   ├── check-level-match.sh      # LEVEL_MATCH rule
│   └── README.md                 # Rules documentation
│
├── lib/                          # Shared libraries (10 TypeScript files)
│   │   ├── embeddings.ts         # Re-exports from @spec-kit/shared
│   │   ├── trigger-extractor.ts  # Re-exports from @spec-kit/shared
│   │   ├── semantic-summarizer.ts # Message classification
│   │   ├── content-filter.ts     # Three-stage content filtering
│   │   ├── anchor-generator.ts   # ANCHOR ID generation
│   │   ├── flowchart-generator.ts # ASCII flowcharts
│   │   ├── ascii-boxes.ts        # ASCII box drawing
│   │   ├── simulation-factory.ts # Fallback data generation
│   │   ├── retry-manager.ts      # Embedding retry logic
│   │   └── decision-tree-generator.ts # Decision tree visualization
│   └── README.md                 # Library documentation
│
├── dist/                         # Compiled JavaScript output (auto-generated)
│   ├── core/                     # Compiled core modules
│   ├── extractors/               # Compiled extractors
│   ├── utils/                    # Compiled utilities
│   ├── renderers/                # Compiled renderers
│   ├── spec-folder/              # Compiled spec-folder modules
│   ├── loaders/                  # Compiled loaders
│   ├── lib/                      # Compiled TypeScript libraries
│   └── memory/                   # Compiled memory entry points
│
├── test-fixtures/                # Validation test cases (54 dirs)
│   ├── 003-valid-level2/         # L2 spec structure tests
│   ├── 004-valid-level3/         # L3 spec structure tests
│   ├── 006-missing-required-files/ # Missing file detection
│   ├── 007-valid-anchors/        # Valid ANCHOR format tests
│   └── ...                       # 50+ fixture folders
│
└── README.md                     # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `spec/validate.sh` | Main validation orchestrator - invokes all 13 rules |
| `spec/create.sh` | Create new spec folders with templates |
| `memory/generate-context.ts` | Memory file generation with ANCHOR format (TypeScript source) |
| `dist/memory/generate-context.js` | Compiled entry point for memory generation |
| `spec/check-completion.sh` | Completion Verification Rule enforcement - verify checklist completion |
| `rules/` | Modular validation rules (13 shell scripts) |
| `lib/` | Shared TypeScript libraries (10 modules) |
| `dist/` | Compiled JavaScript output from TypeScript sources |
| `test-fixtures/` | Validation test cases (54 directories) |

<!-- /ANCHOR:structure -->
---

## 4. ⚡ FEATURES
<!-- ANCHOR:features -->

### spec/validate.sh

**Purpose**: Validate spec folder contents against documentation level requirements

| Aspect | Details |
|--------|---------|
| **Input** | Spec folder path |
| **Output** | Pass/warn/fail status with details |
| **Rules** | 13 modular validation rules |
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

### spec/create.sh

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

**Purpose**: Completion Verification Rule enforcement - verify checklist items are complete before claiming done

| Aspect | Details |
|--------|---------|
| **Input** | Spec folder path |
| **Output** | Pass/fail with incomplete items listed |
| **Gate** | Blocks completion claims until checklist verified |

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

### TypeScript Modules

#### memory/generate-context.ts (Modular Architecture)

**Purpose**: Generate memory files from conversation data with ANCHOR format for Spec Kit Memory indexing

| Aspect | Details |
|--------|---------|
| **Source** | TypeScript entry point at `memory/generate-context.ts` |
| **Compiled Output** | `dist/memory/generate-context.js` (CommonJS) |
| **Input** | JSON data file OR spec folder path |
| **Output** | Memory file in `specs/###-feature/memory/` |
| **Format** | ANCHOR-tagged sections (implemented v1.7.2, 58-90% token savings) |
| **Architecture** | 142-line CLI entry point + 40+ modules across 6 directories |

**Modular Structure** (refactored from 4,837-line monolith):

| Directory | TypeScript Source | Compiled Output | Module Count |
|-----------|-------------------|-----------------|--------------|
| `core/` | Configuration and workflow orchestration | `dist/core/` | 3 modules (config.ts, workflow.ts, index.ts) |
| `extractors/` | Data extraction (files, decisions, sessions) | `dist/extractors/` | 10 modules |
| `utils/` | Utility functions (logging, paths, validation) | `dist/utils/` | 11 modules |
| `renderers/` | Template rendering (Mustache) | `dist/renderers/` | 2 modules |
| `spec-folder/` | Spec folder detection and validation | `dist/spec-folder/` | 4 modules |
| `loaders/` | Data loading with fallback logic | `dist/loaders/` | 2 modules |

**Usage Modes** (executes compiled JavaScript from dist/):
```bash
# Mode 1: JSON data file
node dist/memory/generate-context.js /tmp/context-data.json specs/007-feature/

# Mode 2: Direct spec folder (auto-captures from OpenCode)
node dist/memory/generate-context.js specs/007-feature/

# Help
node dist/memory/generate-context.js --help

# Compile after making changes
npm run build
```

**Development Workflow**:
1. Edit TypeScript sources in `core/`, `extractors/`, `utils/`, etc.
2. Run `npm run build` to compile to `dist/`
3. Execute compiled output via Node.js

**Extension Points**:
- Add new extractors: Create module in `extractors/`, export via `extractors/index.ts`, rebuild
- Add new utilities: Create module in `utils/`, export via `utils/index.ts`, rebuild
- Modify workflow: Edit `core/workflow.ts` (main orchestration), rebuild
- Cross-workspace imports: Use `@spec-kit/shared/*` or `@spec-kit/mcp-server/*` paths

#### tests/test-embeddings-factory.js

**Purpose**: Test and verify embedding provider configuration

| Aspect | Details |
|--------|---------|
| **Source** | `tests/test-embeddings-factory.js` (JavaScript) |
| **Compiled** | N/A (runs directly) |
| **Input** | None |
| **Output** | Provider status and configuration |
| **Tests** | Module imports, provider creation, API verification |

#### tests/test-bug-fixes.js

**Purpose**: Regression tests for bug fixes in generate-context.ts modular architecture

| Aspect | Details |
|--------|---------|
| **Source** | `tests/test-bug-fixes.js` (JavaScript) |
| **Compiled** | N/A (runs directly) |
| **Input** | None |
| **Output** | Pass/fail results for 27 test cases |
| **Tests** | Memory validation, embedding, transactions, error handling |

#### tests/test-validation.sh

**Purpose**: Test suite for validate-spec.sh against fixture spec folders

| Aspect | Details |
|--------|---------|
| **Type** | Shell script (no compilation) |
| **Input** | Options: -v (verbose), -t NAME (single test), -c CATEGORY, -l (list) |
| **Output** | Test pass/fail results, coverage report |
| **Tests** | Validates all test fixtures against expected outcomes |

#### memory/cleanup-orphaned-vectors.ts

**Purpose**: Remove orphaned vector entries from the SQLite database

| Aspect | Details |
|--------|---------|
| **Source** | `memory/cleanup-orphaned-vectors.ts` (TypeScript) |
| **Compiled** | `dist/memory/cleanup-orphaned-vectors.js` |
| **Input** | None (uses default database path) |
| **Output** | Cleanup report with deleted count |
| **Action** | Batch deletion of orphaned vectors |

#### memory/rank-memories.ts

**Purpose**: Memory ranking and scoring utility

| Aspect | Details |
|--------|---------|
| **Source** | `memory/rank-memories.ts` (TypeScript) |
| **Compiled** | `dist/memory/rank-memories.js` |
| **Input** | Memory files from spec folders |
| **Output** | Ranked memory list with scores |
| **Action** | Score and rank memories by relevance |

<!-- /ANCHOR:features -->
---

## 5. ⚙️ CONFIGURATION
<!-- ANCHOR:configuration -->

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
./spec/validate.sh specs/007-feature/

# Strict mode (warnings become errors)
./spec/validate.sh specs/007-feature/ --strict
# Or via environment:
SPECKIT_STRICT=true ./spec/validate.sh specs/007-feature/

# JSON output for CI/tooling
./spec/validate.sh specs/007-feature/ --json

# Disable validation entirely
SPECKIT_VALIDATION=false ./spec/validate.sh specs/007-feature/
```

<!-- /ANCHOR:configuration -->
---

## 6. 💡 USAGE EXAMPLES
<!-- ANCHOR:examples -->

### Example 1: Basic Validation

```bash
# Validate a spec folder
./spec/validate.sh specs/007-feature/

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
./spec/create.sh "Add user authentication system" --level 2

# Output:
# Created: specs/008-add-user-authentication/
# Files: spec.md, plan.md, tasks.md, checklist.md
# Branch: feature/008-add-user-authentication
```

---

### Example 3: JSON Output for CI

```bash
# Get machine-readable output
./spec/validate.sh specs/007-feature/ --json

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
./spec/calculate-completeness.sh specs/007-feature/

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
| Quick validation | `spec/validate.sh <folder>` | Before committing |
| Strict validation | `spec/validate.sh <folder> --strict` | CI pipelines |
| Create L2 spec | `spec/create.sh "desc" --level 2` | Medium features |
| Check progress | `spec/calculate-completeness.sh <folder>` | During development |
| Generate memory | `node dist/memory/generate-context.js <folder>` | Save session context |

<!-- /ANCHOR:examples -->
---

## 7. 🛠️ TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

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
SPECKIT_TEMPLATES_DIR=.opencode/skill/system-spec-kit/templates ./spec/create.sh "..."
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
/opt/homebrew/bin/bash ./spec/validate.sh specs/007-feature/
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
bash -n .opencode/skill/system-spec-kit/scripts/spec/validate.sh && echo "Syntax OK"
```

<!-- /ANCHOR:troubleshooting -->
---

## 8. 📚 RELATED DOCUMENTS
<!-- ANCHOR:related -->

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

<!-- /ANCHOR:related -->
---

## 9. 📊 TYPESCRIPT MIGRATION NOTES
<!-- ANCHOR:typescript-migration-notes -->

**Migration Completed**: 2026-02-07

All JavaScript source files have been migrated to TypeScript with the following changes:

1. **Source Files**: TypeScript sources (`.ts`) are now in their original directories (core/, extractors/, utils/, lib/, etc.)
2. **Compiled Output**: JavaScript output (`.js`) is generated in `dist/` subdirectories via `npm run build`
3. **Import Paths**: Cross-workspace imports use `@spec-kit/shared/*` and `@spec-kit/mcp-server/*` instead of relative paths
4. **Entry Points**: Runtime execution uses compiled JavaScript from `dist/` (e.g., `node dist/memory/generate-context.js`)
5. **Development Workflow**: Edit `.ts` files → Run `npm run build` → Execute compiled `.js` from `dist/`

**Key Points**:
- All runtime imports must use compiled output from `dist/` directories
- TypeScript configuration in `tsconfig.json` uses project references for workspace dependencies
- Type definitions (`.d.ts`) are auto-generated alongside compiled JavaScript
- Shell scripts (`.sh`) remain unchanged and do not require compilation

<!-- /ANCHOR:typescript-migration-notes -->
---

*Documentation version: 3.1 | Last updated: 2026-02-07 | TypeScript migration complete*
