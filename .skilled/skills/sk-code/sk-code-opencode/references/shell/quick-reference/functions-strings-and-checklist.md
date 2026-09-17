---
title: Functions, Args, Strings, Common Patterns & Checklist
description: Fast lookup for Bash scripting patterns, syntax, and common structures in OpenCode. — Functions, Args, Strings, Common Patterns & Checklist.
trigger_phrases:
  - "bash function patterns"
  - "shell argument parsing"
  - "bash string operations"
  - "shell quality checklist"
importance_tier: normal
contextType: implementation
version: 1.0.0.10
---

# Functions, Args, Strings, Common Patterns & Checklist

Function, argument, string, and checklist patterns for Bash scripting in OpenCode.

---

## 1. OVERVIEW

### Purpose

Provides quick-reference patterns for Bash functions, arguments, strings, common operations, and quality checks.

### When to Use

- Implementing Bash functions or argument parsing
- Looking up shell string and process-substitution syntax
- Running a concise shell quality check

---

## 2. FUNCTIONS

### Definition

```bash
# Basic function
my_function() {
    local arg1="$1"
    local arg2="${2:-default}"

    # Do something
    echo "$arg1 $arg2"
    return 0
}

# Call
my_function "value1" "value2"
result=$(my_function "value1")
```

### Return Values

```bash
# Return status (0-255)
validate() {
    [[ -f "$1" ]] || return 1
    [[ -r "$1" ]] || return 2
    return 0
}

# Check return
if validate "$file"; then
    echo "Valid"
fi

# Return string via stdout
get_value() {
    echo "result"
}
value=$(get_value)
```

---

## 3. ARGUMENT PARSING

### Simple Positional

```bash
if [[ $# -lt 1 ]]; then
    echo "Usage: $0 <input>" >&2
    exit 1
fi

input="$1"
output="${2:-./output}"
```

### Flags with While

```bash
VERBOSE=false
OUTPUT=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -o|--output)
            OUTPUT="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        --)
            shift
            break
            ;;
        -*)
            echo "Unknown: $1" >&2
            exit 1
            ;;
        *)
            ARGS+=("$1")
            shift
            ;;
    esac
done
```

---

## 4. STRING OPERATIONS

### Substitution

```bash
${var:-default}           # Default if unset
${var:=default}           # Assign default if unset
${var:+alt}               # alt if var is set
${var:?error}             # Error if unset

${#var}                   # Length
${var#pattern}            # Remove shortest prefix
${var##pattern}           # Remove longest prefix
${var%pattern}            # Remove shortest suffix
${var%%pattern}           # Remove longest suffix
${var/old/new}            # Replace first
${var//old/new}           # Replace all
${var^}                   # Uppercase first
${var^^}                  # Uppercase all
${var,}                   # Lowercase first
${var,,}                  # Lowercase all
```

### Examples

```bash
file="/path/to/file.txt"
echo "${file##*/}"        # file.txt (basename)
echo "${file%/*}"         # /path/to (dirname)
echo "${file%.txt}"       # /path/to/file
echo "${file##*.}"        # txt (extension)
```

---

## 5. COMMON PATTERNS

### Safe Temp Files

```bash
TEMP_FILE=$(mktemp)
trap 'rm -f "$TEMP_FILE"' EXIT
```

### Find Script Directory

```bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
```

### Check Command Exists

```bash
if command -v jq >/dev/null 2>&1; then
    echo "jq available"
fi
```

### Process Substitution

```bash
# Read from command output
while read -r line; do
    echo "$line"
done < <(find . -name "*.txt")

# Compare outputs
diff <(sort file1) <(sort file2)
```

### Here Documents

```bash
cat << 'EOF'
Literal content
No $variable expansion
EOF

cat << EOF
Content with $variable expansion
EOF
```

---

## 6. QUALITY CHECKLIST

```markdown
P0 - Must Fix:
[ ] #!/usr/bin/env bash
[ ] set -euo pipefail
[ ] All vars quoted: "$var"
[ ] File header present
[ ] No commented code
[ ] WHY-focused comments only (max 3/10 lines)

P1 - Required:
[ ] snake_case functions
[ ] local variables
[ ] Exit codes documented
[ ] Errors to stderr
[ ] TODOs with context

P2 - Recommended:
[ ] Standard colors
[ ] Function docs
[ ] ShellCheck clean
```

---

## 7. RELATED RESOURCES

- [style-guide.md](../style-guide/overview-structure-and-naming.md) - Detailed style documentation
- [quality-standards.md](../quality-standards/overview-and-priority-blockers.md) - Quality requirements
- [ShellCheck](https://www.shellcheck.net/) - Static analysis
