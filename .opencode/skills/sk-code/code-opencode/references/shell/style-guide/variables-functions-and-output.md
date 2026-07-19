---
title: Variables, Conditionals, Args, Functions, Errors & Output
description: Coding conventions and formatting standards for Bash scripts in the OpenCode development environment. — Variables, Conditionals, Args, Functions, Errors & Output.
trigger_phrases:
  - "bash variable handling"
  - "shell conditional expressions"
  - "bash function conventions"
  - "shell output formatting"
importance_tier: normal
contextType: implementation
version: 1.0.0.14
---

# Variables, Conditionals, Args, Functions, Errors & Output

Variable, conditional, argument, function, error, and output conventions for Bash scripts.

---

## 1. OVERVIEW

### Purpose

Defines detailed Bash conventions for data handling, control flow, functions, errors, and output.

### When to Use

- Implementing Bash variables, conditions, or argument parsing
- Writing reusable shell functions and error handling
- Standardizing command-line and JSON output

---

## 2. VARIABLE HANDLING

### Always Quote Variables

**ALWAYS** double-quote variable expansions:

```bash
# Correct
file_path="$1"
echo "$file_path"
if [[ -f "$file_path" ]]; then

# WRONG - unquoted variables
file_path=$1
echo $file_path
if [[ -f $file_path ]]; then
```

### Local Variables

**ALWAYS** declare local variables in functions:

```bash
process_file() {
    local file_path="$1"
    local output_dir="$2"
    local result=""

    # Use locals within function
    result=$(do_something "$file_path")
    echo "$result"
}
```

### Default Values

Use parameter expansion for defaults:

```bash
# Default value if not set
output_dir="${2:-./output}"

# Default value if empty or not set
timeout="${TIMEOUT:-30}"

# Error if not set
required_var="${REQUIRED_VAR:?Error: REQUIRED_VAR must be set}"
```

This example is illustrative; no current system-spec-kit script uses this exact pattern.

---

## 3. CONDITIONAL EXPRESSIONS

### Use [[ ]] for Tests

**ALWAYS** use `[[ ]]` over `[ ]`:

```bash
# Correct - modern bash test
if [[ -f "$file" ]]; then
if [[ "$string" == "value" ]]; then
if [[ "$number" -gt 10 ]]; then

# WRONG - POSIX test (less safe)
if [ -f "$file" ]; then
if [ "$string" = "value" ]; then
```

### String Comparisons

```bash
# Equality
if [[ "$var" == "value" ]]; then

# Pattern matching
if [[ "$var" == *.md ]]; then

# Regex matching
if [[ "$var" =~ ^[0-9]+$ ]]; then

# Empty/non-empty
if [[ -z "$var" ]]; then    # Empty
if [[ -n "$var" ]]; then    # Non-empty
```

### File Tests

```bash
if [[ -f "$path" ]]; then   # Is regular file
if [[ -d "$path" ]]; then   # Is directory
if [[ -e "$path" ]]; then   # Exists
if [[ -r "$path" ]]; then   # Is readable
if [[ -w "$path" ]]; then   # Is writable
if [[ -x "$path" ]]; then   # Is executable
```

---

## 4. ARGUMENT PARSING

### Simple Arguments

```bash
#!/usr/bin/env bash
set -euo pipefail

# Positional arguments
if [[ $# -lt 1 ]]; then
    echo "Usage: $0 <input_file>" >&2
    exit 1
fi

input_file="$1"
output_dir="${2:-./output}"
```

### Flag Parsing Pattern

```bash
# Initialize defaults
JSON_MODE=false
VERBOSE=false
OUTPUT_DIR=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        --json)
            JSON_MODE=true
            shift
            ;;
        --verbose|-v)
            VERBOSE=true
            shift
            ;;
        --output|-o)
            if [[ $# -lt 2 ]]; then
                echo "Error: --output requires a value" >&2
                exit 1
            fi
            OUTPUT_DIR="$2"
            shift 2
            ;;
        --help|-h)
            show_help
            exit 0
            ;;
        -*)
            echo "Unknown option: $1" >&2
            exit 1
            ;;
        *)
            # Positional argument
            ARGS+=("$1")
            shift
            ;;
    esac
done
```

**Evidence**: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:121-133`

---

## 5. FUNCTIONS

### Function Definition

```bash
# Function with documentation
validate_file() {
    # Validate that a file exists and is readable
    # Args:
    #   $1 - File path to validate
    # Returns:
    #   0 if valid, 1 if invalid

    local file_path="$1"

    if [[ ! -f "$file_path" ]]; then
        log_error "FILE" "Not found: $file_path"
        return 1
    fi

    if [[ ! -r "$file_path" ]]; then
        log_error "FILE" "Not readable: $file_path"
        return 1
    fi

    return 0
}
```

### Return Values

Use return codes for success/failure:

```bash
# Return 0 for success
do_something || return 1

# Return specific codes for different errors
validate() {
    [[ -f "$1" ]] || return 1  # File not found
    [[ -r "$1" ]] || return 2  # Not readable
    return 0                    # Success
}
```

---

## 6. ERROR HANDLING

### Exit on Error

```bash
# Exit immediately on error (from strict mode)
set -e

# Or check explicitly
command || {
    echo "Error: command failed" >&2
    exit 1
}
```

### Trap for Cleanup

```bash
cleanup() {
    # Remove temp files
    [[ -n "${TEMP_FILE:-}" ]] && rm -f "$TEMP_FILE"
}

trap cleanup EXIT
```

### Error Messages to stderr

```bash
# Always send errors to stderr
echo "Error: something went wrong" >&2
printf "${RED}ERROR:${NC} %s\n" "$message" >&2
```

---

## 7. OUTPUT FORMATTING

### Printf vs Echo

Prefer `printf` for formatted output:

```bash
# Printf - more portable, better formatting
printf "Processing: %s\n" "$filename"
printf "Found %d files\n" "$count"
printf "${GREEN}SUCCESS${NC}\n"

# Echo - simple messages only
echo "Starting process..."
```

### JSON Output

```bash
# JSON output mode
if [[ "$JSON_MODE" == true ]]; then
    printf '{"status":"success","count":%d}\n' "$count"
else
    printf "Found %d items\n" "$count"
fi
```

---

## 8. RELATED RESOURCES

### Internal References
- [quality-standards.md](../quality-standards/overview-and-priority-blockers.md) - Quality requirements
- [quick-reference.md](../quick-reference/template-variables-and-loops.md) - Quick lookup

### External Standards
- [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
- [ShellCheck](https://www.shellcheck.net/) - Static analysis tool
