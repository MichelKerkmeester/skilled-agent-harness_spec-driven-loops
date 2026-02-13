---
title: "Setup Scripts"
description: "Prerequisite validation scripts for spec folder structure and requirements"
trigger_phrases:
  - "setup scripts"
  - "check prerequisites"
  - "spec folder setup"
importance_tier: "normal"
---

# Setup Scripts

> Prerequisite validation scripts for spec folder structure and requirements.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. ⚡ FEATURES](#4--features)
- [5. 💡 USAGE EXAMPLES](#5--usage-examples)
- [6. 🛠️ TROUBLESHOOTING](#6--troubleshooting)
- [7. 📚 RELATED DOCUMENTS](#7--related-documents)

---

<!-- /ANCHOR:table-of-contents -->
## 1. 📖 OVERVIEW
<!-- ANCHOR:overview -->

### What are Setup Scripts?

Setup scripts validate spec folder structure and prerequisites before implementation begins. They ensure required files exist, detect documentation level, and optionally run full validation to confirm the spec folder is ready for implementation work.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Scripts | 4 | Prerequisite and environment validation |
| Validation Modes | 4 | Human-readable, JSON, paths-only, strict |
| Check Time | <5 sec | Fast prerequisite checks |

### Key Features

| Feature | Description |
|---------|-------------|
| **Spec Folder Validation** | Confirms target folder is a valid spec folder |
| **File Requirement Checks** | Ensures required files exist for documentation level |
| **Level Detection** | Auto-detects documentation level (L1/L2/L3) |
| **Full Validation Integration** | Optionally runs complete validation suite |
| **Multiple Output Formats** | Human-readable, JSON, or paths-only modes |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Bash | 3.2+ | 5.0+ |
| grep | POSIX | GNU grep |
| jq | 1.6+ | Latest (for JSON output) |

---

<!-- /ANCHOR:overview -->
## 2. 🚀 QUICK START
<!-- ANCHOR:quick-start -->

### 30-Second Setup

```bash
# Navigate to spec folder you want to validate
cd specs/007-my-feature/

# Check prerequisites
../../.opencode/skill/system-spec-kit/scripts/setup/check-prerequisites.sh
```

### Verify Installation

```bash
# Check that spec folder is ready
./check-prerequisites.sh

# Expected output:
# ✓ Spec folder: specs/007-my-feature
# ✓ Level: 2
# ✓ Required files present: spec.md, plan.md, checklist.md
# ✓ Ready for implementation
```

### First Use

```bash
# Run with full validation (stricter checks)
./check-prerequisites.sh --validate-strict
```

---

<!-- /ANCHOR:quick-start -->
## 3. 📁 STRUCTURE
<!-- ANCHOR:structure -->

```
setup/
├── check-prerequisites.sh   # Validates spec folder structure and requirements
├── check-native-modules.sh  # Checks native Node.js module availability
├── rebuild-native-modules.sh # Rebuilds native modules when needed
├── record-node-version.js   # Records current Node.js version for compatibility
└── README.md                # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `check-prerequisites.sh` | Spec folder prerequisite validation - ensures required files exist before implementation |
| `check-native-modules.sh` | Checks native Node.js module availability (e.g., better-sqlite3) |
| `rebuild-native-modules.sh` | Rebuilds native modules for current Node.js version |
| `record-node-version.js` | Records Node.js version to detect version changes requiring rebuilds |

---

<!-- /ANCHOR:structure -->
## 4. ⚡ FEATURES
<!-- ANCHOR:features -->

### Prerequisite Checker (check-prerequisites.sh)

**Purpose**: Validates spec folder structure before implementation phase

| Validation | Description |
|------------|-------------|
| **Spec folder exists** | Confirms target folder is a valid spec folder |
| **Required files** | Ensures spec.md, plan.md exist (tasks.md if required) |
| **Level detection** | Determines documentation level (L1/L2/L3) |
| **Validation pass** | Optionally runs full validate-spec.sh |

**Options**:
```bash
./check-prerequisites.sh                  # Human-readable output
./check-prerequisites.sh --json           # JSON output
./check-prerequisites.sh --require-tasks  # Require tasks.md (implementation)
./check-prerequisites.sh --validate       # Run full validation
./check-prerequisites.sh --validate-strict # Warnings as errors
```

**Output Modes**:

| Mode | Flag | Use Case |
|------|------|----------|
| Human | _(default)_ | Interactive terminal use |
| JSON | `--json` | Programmatic parsing, CI/CD |
| Paths | `--paths-only` | Scripting, file discovery |

**JSON Structure**:
```json
{
  "spec_folder": "/path/to/specs/001-name",
  "level": 2,
  "available_docs": ["spec.md", "plan.md", "checklist.md"],
  "validation": {
    "exit_code": 0,
    "status": "pass",
    "errors": 0,
    "warnings": 0
  }
}
```

---

<!-- /ANCHOR:features -->
## 5. 💡 USAGE EXAMPLES
<!-- ANCHOR:examples -->

### Example 1: Validate Spec Folder Before Implementation

```bash
# Check if spec folder is ready for implementation
./check-prerequisites.sh --require-tasks

# Output:
# ✓ Spec folder: specs/042-my-feature
# ✓ Level: 2
# ✓ Required files present: spec.md, plan.md, tasks.md
# ✓ Ready for implementation
```

---

### Example 2: CI/CD Integration

```bash
# Get JSON output for automated workflows
./check-prerequisites.sh --json --validate-strict

# Parse results programmatically
if [ $? -eq 0 ]; then
  echo "Spec folder validated, proceeding with implementation"
else
  echo "Validation failed, cannot proceed"
  exit 1
fi
```

---

### Common Patterns

| Pattern | Command | When to Use |
|---------|---------|-------------|
| Quick check | `./check-prerequisites.sh` | Before starting implementation |
| Full validation | `./check-prerequisites.sh --validate` | Comprehensive spec folder check |
| CI validation | `./check-prerequisites.sh --json --validate-strict` | Automated pipelines |
| Get paths only | `./check-prerequisites.sh --paths-only` | Scripting integration |

---

<!-- /ANCHOR:examples -->
## 6. 🛠️ TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

### Common Issues

#### Prerequisite Check Fails - Missing Files

**Symptom**: `ERROR: Required file spec.md not found`

**Cause**: Not in a valid spec folder, or spec folder incomplete

**Solution**:
```bash
# Ensure you're in project root
pwd

# Check spec folder exists
ls specs/

# Create missing files from templates
cp .opencode/skill/system-spec-kit/templates/spec.md specs/my-spec/
cp .opencode/skill/system-spec-kit/templates/plan.md specs/my-spec/
```

---

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Missing files | Copy from templates: `cp ../../templates/spec.md .` |
| Wrong directory | Ensure you're in a spec folder (specs/###-name/) |
| Validation fails | Run with `--validate` to see detailed errors |
| JSON parse error | Install jq: `brew install jq` (macOS) |

---

### Diagnostic Commands

```bash
# Check script exists and is executable
ls -la check-prerequisites.sh

# Test from spec folder
cd specs/my-spec/
../../.opencode/skill/system-spec-kit/scripts/setup/check-prerequisites.sh

# Get verbose validation output
./check-prerequisites.sh --validate

# Check which files exist
ls -la spec.md plan.md checklist.md
```

---

<!-- /ANCHOR:troubleshooting -->
## 7. 📚 RELATED DOCUMENTS
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [SKILL.md](../../SKILL.md) | Parent skill documentation |
| [Validation Rules](../rules/README.md) | Spec folder validation rules |
| [validate-spec.sh](../spec/validate.sh) | Full validation orchestrator |
| [templates/](../../templates/) | Spec folder templates |

### External Resources

| Resource | Description |
|----------|-------------|
| [Bash Reference](https://www.gnu.org/software/bash/manual/) | Bash scripting documentation |
| [jq Manual](https://stedolan.github.io/jq/manual/) | JSON processing tool |

---

*Documentation version: 1.0 | Last updated: 2025-01-21*
<!-- /ANCHOR:related -->
