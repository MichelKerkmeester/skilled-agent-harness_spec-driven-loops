# Memory System Setup Scripts

> Installation and prerequisite validation scripts for Spec Kit Memory MCP server and dependencies.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. ⚡ FEATURES](#4--features)
- [5. 💡 USAGE EXAMPLES](#5--usage-examples)
- [6. 🛠️ TROUBLESHOOTING](#6--troubleshooting)
- [7. 📚 RELATED DOCUMENTS](#7--related-documents)

---

## 1. 📖 OVERVIEW

### What are Setup Scripts?

Setup scripts automate the installation and configuration of the Spec Kit Memory system, including MCP server dependencies, Node.js packages, and database initialization. They validate prerequisites and guide users through first-time setup with clear, actionable feedback.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Scripts | 2 | Setup + prerequisite validation |
| Dependencies | 5+ | Node, npm, transformers.js, SQLite packages |
| Setup Time | <2 min | Automated installation with progress feedback |

### Key Features

| Feature | Description |
|---------|-------------|
| **Prerequisite Validation** | Checks Node.js, npm versions before installation |
| **Automated Installation** | Installs Node dependencies with progress indicators |
| **Database Initialization** | Creates SQLite database and verifies structure |
| **Path Detection** | Auto-detects project structure and validates paths |
| **Error Recovery** | Provides actionable remediation for common failures |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | v18.0.0 | v20.0.0+ |
| npm | 9.0.0 | 10.0.0+ |
| Bash | 3.2+ | 5.0+ |

---

## 2. 🚀 QUICK START

### 30-Second Setup

```bash
# 1. Navigate to setup scripts directory
cd .opencode/skill/system-spec-kit/scripts/setup

# 2. Run setup script
./setup.sh

# 3. Verify installation
./check-prerequisites.sh
```

### Verify Installation

```bash
# Check that memory system is ready
./check-prerequisites.sh

# Expected output:
# ✓ Node.js v20.x.x
# ✓ npm x.x.x
# ✓ Memory database exists
# ✓ All dependencies installed
```

### First Use

```bash
# Run setup with force reinstall (if needed)
./setup.sh --force
```

---

## 3. 📁 STRUCTURE

```
setup/
├── check-prerequisites.sh   # Validates spec folder and system requirements
├── setup.sh                 # Main installation script
└── README.md                # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `setup.sh` | Main installation orchestrator - installs dependencies, creates database, validates system |
| `check-prerequisites.sh` | Spec folder prerequisite validation - ensures required files exist before implementation |

---

## 4. ⚡ FEATURES

### Setup Script (setup.sh)

**Purpose**: Automated installation and configuration of memory system dependencies

| Phase | Actions |
|-------|---------|
| **1. Prerequisites** | Validates Node.js v18+, npm v9+ |
| **2. Dependencies** | Installs transformers.js, SQLite, vector-db packages |
| **3. Database** | Creates context-index.sqlite with proper schema |
| **4. Verification** | Tests memory search, confirms operational status |

**Options**:
```bash
./setup.sh           # Standard installation
./setup.sh --force   # Reinstall dependencies (skip cache)
```

---

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

## 5. 💡 USAGE EXAMPLES

### Example 1: First-Time Setup

```bash
# Navigate to setup directory
cd .opencode/skill/system-spec-kit/scripts/setup

# Run setup with all checks
./setup.sh

# Output:
# ───────────────────────────────────────────────────────
#   Memory System Setup
# ───────────────────────────────────────────────────────
#
# 📋 Checking Prerequisites...
#   ✓ Node.js v20.10.0
#   ✓ npm 10.2.0
#
# 📦 Installing Dependencies...
#   ✓ @xenova/transformers
#   ✓ better-sqlite3
#
# 🗄️  Initializing Database...
#   ✓ Created context-index.sqlite
#
# ✅ Setup Complete!
```

---

### Example 2: Validate Spec Folder Before Implementation

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

### Example 3: Force Reinstall After Dependency Issues

```bash
# Clear and reinstall all dependencies
./setup.sh --force

# Rebuilds node_modules from scratch
```

---

### Example 4: CI/CD Integration

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
| First install | `./setup.sh` | Initial system setup |
| Repair install | `./setup.sh --force` | After dependency corruption |
| Validate spec | `./check-prerequisites.sh` | Before starting implementation |
| CI validation | `./check-prerequisites.sh --json --validate` | Automated pipelines |

---

## 6. 🛠️ TROUBLESHOOTING

### Common Issues

#### Node.js Version Too Old

**Symptom**: `⚠ Node.js v16.x.x (v18+ recommended)`

**Cause**: Node.js version below minimum requirement

**Solution**:
```bash
# macOS (Homebrew)
brew upgrade node

# Or download from nodejs.org
# https://nodejs.org/

# Verify version
node --version
# Expected: v18.0.0 or higher
```

---

#### npm Install Fails

**Symptom**: `npm ERR! code EACCES` or permission errors

**Cause**: Insufficient permissions for global npm installs

**Solution**:
```bash
# Fix npm permissions (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Then retry
./setup.sh
```

---

#### Database Initialization Failed

**Symptom**: `✗ Failed to create database`

**Cause**: Insufficient disk space or permissions

**Solution**:
```bash
# Check disk space
df -h

# Check database directory permissions
ls -la .opencode/skill/system-spec-kit/mcp_server/database/

# Ensure directory exists
mkdir -p .opencode/skill/system-spec-kit/mcp_server/database

# Retry setup
./setup.sh
```

---

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
| Node version old | `brew upgrade node` (macOS) or download from nodejs.org |
| Permission errors | Use `./setup.sh` not `sudo ./setup.sh` |
| Database locked | Close any running OpenCode instances |
| Missing dependencies | Run `./setup.sh --force` to reinstall |

---

### Diagnostic Commands

```bash
# Check Node.js and npm versions
node --version
npm --version

# Verify setup script exists and is executable
ls -la setup.sh

# Check database exists
ls -la ../../mcp_server/database/context-index.sqlite

# Test prerequisite validation
./check-prerequisites.sh --validate-verbose
```

---

## 7. 📚 RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [SKILL.md](../../SKILL.md) | Parent skill documentation |
| [Memory System Guide](../../references/memory/memory_system.md) | Memory architecture and usage |
| [Validation Rules](../rules/README.md) | Spec folder validation rules |
| [Environment Variables](../../references/config/environment_variables.md) | Configuration reference |

### External Resources

| Resource | Description |
|----------|-------------|
| [Node.js Downloads](https://nodejs.org/) | Official Node.js installation |
| [npm Documentation](https://docs.npmjs.com/) | Package manager documentation |
| [Transformers.js](https://huggingface.co/docs/transformers.js) | Neural embedding library |

---

*Documentation version: 1.0 | Last updated: 2025-01-21*
