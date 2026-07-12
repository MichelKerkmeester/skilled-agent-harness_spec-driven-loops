---
title: Shell Style Guide
description: Coding conventions and formatting standards for Bash scripts in the OpenCode development environment.
trigger_phrases:
  - "opencode shell style guide"
  - "bash formatting standards"
  - "shell shebang header"
  - "bash naming conventions"
importance_tier: normal
contextType: implementation
version: 1.0.0.14
---

# Shell Style Guide

Coding conventions and formatting standards for Bash scripts in the OpenCode development environment.

---

## 1. OVERVIEW

### Purpose

Defines consistent styling rules for Bash scripts to ensure reliability, readability, and maintainability across all OpenCode shell scripts.

### When to Use

- Writing or formatting Bash scripts
- Applying shell structure and naming conventions
- Reviewing shell comments, logging, and file organization

### Scope

Applies to all shell files in:
- `.opencode/skills/*/scripts/` - Skill automation scripts
- `.opencode/agents/scripts/` - Agent provider scripts
- `scripts/` - Build and deployment scripts

### Key Sources

| File | Evidence |
|------|----------|
| `.opencode/skills/system-spec-kit/scripts/lib/shell-common.sh` | JSON escaping, repo-root + phase-parent detection utilities |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Color definitions, TTY detection, logging functions, exit-code counters |
| `.opencode/skills/system-spec-kit/scripts/spec/create.sh` | Strict mode, argument parsing, control flow |

---

## 2. FILE STRUCTURE

### Shebang Line

**ALWAYS** use the portable bash shebang:

```bash
#!/usr/bin/env bash
```

**Evidence**: `.opencode/skills/system-spec-kit/scripts/lib/shell-common.sh:1`

### File Header

Use the standard header format for identification:

```bash
#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: [COMPONENT NAME]
# ───────────────────────────────────────────────────────────────
# Brief description of what this script does.
#
# Usage: script.sh [options] <arguments>
```

**Alternative** (detailed header for major scripts):

```bash
#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# SPECKIT: CREATE SPEC FOLDER
# ───────────────────────────────────────────────────────────────
# Creates spec folder with templates based on documentation level.
#
# TEMPLATE ARCHITECTURE (v2.0 - CORE + ADDENDUM):
#   templates/
#   ├── level_1/        # Core only (~270 LOC total)
#   ├── level_2/        # Core + Verification (~390 LOC)
#   └── level_3/        # Core + Verification + Architecture (~540 LOC)
```

**Evidence**: `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1-20`

### Strict Mode

**ALWAYS** enable strict mode immediately after the shebang/header:

```bash
set -euo pipefail
```

| Flag | Purpose |
|------|---------|
| `-e` | Exit on error (non-zero return) |
| `-u` | Error on undefined variables |
| `-o pipefail` | Pipe fails if any command fails |

**Evidence**: `.opencode/skills/system-spec-kit/scripts/spec/create.sh:22`

### Section Organization

Organize code into numbered sections:

```bash
# ───────────────────────────────────────────────────────────────
# 1. COLOR DEFINITIONS
# ───────────────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# ───────────────────────────────────────────────────────────────
# 2. UTILITY FUNCTIONS
# ───────────────────────────────────────────────────────────────

log_info() {
    printf "${BLUE}INFO:${NC} %s\n" "$1"
}
```

**Evidence**: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:74-77`, `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:340-343`

---

## 3. NAMING CONVENTIONS

### Functions

**Use**: `lowercase_with_underscores`

```bash
# Public functions
validate_input() {
    local input="$1"
    # ...
}

process_file() {
    local file_path="$1"
    # ...
}
```

### Private/Internal Functions

**Use**: Single underscore prefix for helpers:

```bash
# Internal helper function
_json_escape() {
    local str="$1"
    str="${str//\\/\\\\}"
    str="${str//\"/\\\"}"
    printf '%s' "$str"
}
```

**Evidence**: `.opencode/skills/system-spec-kit/scripts/lib/shell-common.sh:37-45`

### Variables

**Use**: `lowercase_with_underscores` for local variables:

```bash
local file_path="$1"
local output_dir="${2:-./output}"
local is_valid=true
```

### Constants and Global Variables

**Use**: `UPPER_SNAKE_CASE` for constants and script-level variables:

```bash
readonly MAX_RETRIES=3
readonly DEFAULT_TIMEOUT=30

# Script-level state
ERRORS=0
WARNINGS=0
JSON_MODE=false
```

**Evidence**: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:45-47`, `.opencode/skills/system-spec-kit/scripts/spec/create.sh:24-33`

---

## 4. COLOR DEFINITIONS

### Standard Color Setup

Define colors with terminal detection:

```bash
# ───────────────────────────────────────────────────────────────
# COLOR DEFINITIONS
# ───────────────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'  # No Color / Reset

# Disable colors if not terminal (for piping/logging)
if [[ ! -t 1 ]]; then
    RED='' GREEN='' YELLOW='' BLUE='' BOLD='' NC=''
fi
```

**Evidence**: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:74-77`

### Usage in Output

```bash
# Colored output
printf "${GREEN}SUCCESS:${NC} %s\n" "$message"
printf "${RED}ERROR:${NC} %s\n" "$error" >&2
printf "${YELLOW}WARNING:${NC} %s\n" "$warning"
```

---

## 5. LOGGING FUNCTIONS

### Standard Logging Pattern

```bash
log_pass() {
    local rule="$1"
    local message="$2"
    printf "${GREEN}[PASS]${NC} ${BOLD}%s${NC}: %s\n" "$rule" "$message"
}

log_warn() {
    local rule="$1"
    local message="$2"
    printf "${YELLOW}[WARN]${NC} ${BOLD}%s${NC}: %s\n" "$rule" "$message" >&2
    ((WARNINGS++))
}

log_error() {
    local rule="$1"
    local message="$2"
    printf "${RED}[ERROR]${NC} ${BOLD}%s${NC}: %s\n" "$rule" "$message" >&2
    ((ERRORS++))
}

log_info() {
    local rule="$1"
    local message="$2"
    printf "${BLUE}[INFO]${NC} ${BOLD}%s${NC}: %s\n" "$rule" "$message"
}
```

**Evidence**: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:335-343`

### Detail Logging

For sub-items or additional context:

```bash
log_detail() {
    printf "    - %s\n" "$1"
}
```

**Evidence**: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:345`

### Inline Comments

Follow the universal commenting principles (see `../../shared/universal_patterns/naming-and-commenting.md`):

1. **Quantity limit:** Maximum 3 comments per 10 lines of code
2. **Focus on purposeful semantics:** Explain WHY something is done, not WHAT it does
3. **Focus on WHY, not WHAT:** Explain intent, constraints, reasoning
4. **No commented-out code:** Delete unused code (git preserves history)

**Good - explains reasoning:**

```bash
# Skip if output directory already exists to prevent data loss
if [[ -d "$output_dir" ]]; then
    log_error "Output directory already exists"
    exit 1
fi

# Strict mode must catch pipe failures in complex commands
set -o pipefail

# Recover pending writes on startup so a crash cannot lose data
source "$SCRIPT_DIR/lib/transaction.sh"
```

**Bad - narrates implementation:**

```bash
# Set the variable to output
output_dir="./output"

# Loop through files
for file in *.sh; do
    echo "$file"
done
```

### Capitalization

All comment text MUST start with a capital letter:

```bash
# Reverse order preserves dependency chain     # correct
# reverse order preserves dependency chain     # wrong
```

**Exceptions**: Directives like `shellcheck disable`, inline code references, and technical identifiers.

### Function Purpose Comments

Brief description above function:

```bash
# Validate JSON file against schema
# Returns 0 on success, 1 on validation error
validate_json() {
    local file="$1"
    local schema="$2"
    # implementation
}
```

---
