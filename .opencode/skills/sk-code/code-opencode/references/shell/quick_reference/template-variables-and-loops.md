---
title: Shell Quick Reference
description: Fast lookup for Bash scripting patterns, syntax, and common structures in OpenCode.
trigger_phrases:
  - "opencode shell quick reference"
  - "bash file template"
  - "bash array patterns"
  - "shell conditionals reference"
importance_tier: normal
contextType: implementation
version: 1.0.0.10
---

# Shell Quick Reference

Fast lookup for Bash scripting patterns, syntax, and common structures in OpenCode.

---

## 1. OVERVIEW

### Purpose

Quick-access reference card for Bash patterns. For detailed explanations, see:
- [style_guide.md](./style_guide.md) - Full style documentation
- [quality_standards.md](./quality_standards.md) - Quality requirements

---

## 2. FILE TEMPLATE

```bash
#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: [COMPONENT NAME]
# ───────────────────────────────────────────────────────────────
# Brief description of what this script does.
#
# Usage: script.sh [options] <arguments>
#
# Exit Codes:
#   0 - Success
#   1 - Invalid arguments
#   2 - Processing error

set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly SCRIPT_NAME="$(basename "$0")"

# ───────────────────────────────────────────────────────────────
# 2. COLOR DEFINITIONS
# ───────────────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

if [[ ! -t 1 ]]; then
    RED='' GREEN='' YELLOW='' BLUE='' BOLD='' NC=''
fi

# ───────────────────────────────────────────────────────────────
# 3. UTILITY FUNCTIONS
# ───────────────────────────────────────────────────────────────

log_info() { printf "${BLUE}INFO:${NC} %s\n" "$1"; }
log_pass() { printf "${GREEN}PASS:${NC} %s\n" "$1"; }
log_warn() { printf "${YELLOW}WARN:${NC} %s\n" "$1" >&2; }
log_error() { printf "${RED}ERROR:${NC} %s\n" "$1" >&2; }

show_help() {
    cat << EOF
Usage: $SCRIPT_NAME [options] <input>

Options:
    -h, --help      Show this help
    -v, --verbose   Verbose output
    -o, --output    Output directory

Examples:
    $SCRIPT_NAME file.txt
    $SCRIPT_NAME -o ./out file.txt
EOF
}

# ───────────────────────────────────────────────────────────────
# 4. MAIN LOGIC
# ───────────────────────────────────────────────────────────────

main() {
    # Validate arguments
    if [[ $# -lt 1 ]]; then
        log_error "Missing required argument"
        show_help
        exit 1
    fi

    local input="$1"

    # Process
    log_info "Processing: $input"

    # Success
    log_pass "Complete"
}

main "$@"
```

---

## 3. NAMING CONVENTIONS

| Element | Convention | Example |
|---------|------------|---------|
| Functions | snake_case | `validate_input()` |
| Local vars | snake_case | `local file_path="$1"` |
| Constants | UPPER_SNAKE | `readonly MAX_SIZE=100` |
| Private funcs | _prefix | `_internal_helper()` |
| Script files | kebab-case | `process-files.sh` |

---

## 4. VARIABLE HANDLING

### Declaration

```bash
# Local variables (in functions)
local file_path="$1"
local -r readonly_var="value"    # Local readonly
local -i count=0                  # Integer
local -a array=()                 # Array

# Global constants
readonly MAX_RETRIES=3
readonly -a VALID_TYPES=("a" "b" "c")

# Default values
output="${2:-./output}"           # Default if unset
timeout="${TIMEOUT:-30}"          # From env or default
required="${REQUIRED:?Must set}"  # Error if unset
```

### Arrays

```bash
# Declaration
files=()
files=("one.txt" "two.txt" "three.txt")

# Append
files+=("four.txt")

# Access
echo "${files[0]}"        # First element
echo "${files[@]}"        # All elements
echo "${#files[@]}"       # Count
echo "${files[-1]}"       # Last element

# Iteration
for f in "${files[@]}"; do
    echo "$f"
done
```

---

## 5. CONDITIONALS

### String Tests

```bash
[[ -z "$var" ]]           # Empty
[[ -n "$var" ]]           # Not empty
[[ "$a" == "$b" ]]        # Equal
[[ "$a" != "$b" ]]        # Not equal
[[ "$a" == *.txt ]]       # Glob match
[[ "$a" =~ ^[0-9]+$ ]]    # Regex match
[[ "$a" < "$b" ]]         # Alphabetically less
```

### Numeric Tests

```bash
[[ "$a" -eq "$b" ]]       # Equal
[[ "$a" -ne "$b" ]]       # Not equal
[[ "$a" -lt "$b" ]]       # Less than
[[ "$a" -le "$b" ]]       # Less or equal
[[ "$a" -gt "$b" ]]       # Greater than
[[ "$a" -ge "$b" ]]       # Greater or equal

# Arithmetic context
(( a == b ))
(( a > 10 ))
(( count++ ))
```

### File Tests

```bash
[[ -e "$path" ]]          # Exists
[[ -f "$path" ]]          # Regular file
[[ -d "$path" ]]          # Directory
[[ -r "$path" ]]          # Readable
[[ -w "$path" ]]          # Writable
[[ -x "$path" ]]          # Executable
[[ -s "$path" ]]          # Non-empty file
[[ -L "$path" ]]          # Symlink
[[ "$a" -nt "$b" ]]       # a newer than b
[[ "$a" -ot "$b" ]]       # a older than b
```

### Compound Tests

```bash
[[ cond1 && cond2 ]]      # AND
[[ cond1 || cond2 ]]      # OR
[[ ! condition ]]         # NOT
```

---

## 6. LOOPS

### For Loops

```bash
# Over list
for item in a b c; do
    echo "$item"
done

# Over array
for f in "${files[@]}"; do
    echo "$f"
done

# Over glob
for f in *.txt; do
    [[ -f "$f" ]] || continue
    echo "$f"
done

# C-style
for ((i=0; i<10; i++)); do
    echo "$i"
done

# Range
for i in {1..10}; do
    echo "$i"
done
```

### While Loops

```bash
# Standard while
while [[ condition ]]; do
    # ...
done

# Read lines from file
while IFS= read -r line; do
    echo "$line"
done < file.txt

# Read lines from command
while IFS= read -r line; do
    echo "$line"
done < <(some_command)

# Infinite with break
while true; do
    [[ condition ]] && break
done
```

---
