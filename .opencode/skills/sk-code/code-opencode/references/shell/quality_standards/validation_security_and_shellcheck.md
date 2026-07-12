---
title: Validation, Errors, Output, Security, Review & ShellCheck
description: Code quality requirements, validation rules, and best practices for Bash scripts in the OpenCode development environment. — Validation, Errors, Output, Security, Review & ShellCheck.
trigger_phrases:
  - "shell validation patterns"
  - "bash error handling"
  - "shell security considerations"
  - "shellcheck integration"
importance_tier: normal
contextType: implementation
version: 1.0.0.15
---

# Validation, Errors, Output, Security, Review & ShellCheck

Validation, error handling, output, security, review, and ShellCheck guidance for Bash scripts.

---

## 1. OVERVIEW

### Purpose

Defines operational validation, error, output, security, review, and static-analysis patterns for shell scripts.

### When to Use

- Validating Bash script inputs and file operations
- Implementing shell error handling, output, or security controls
- Preparing shell code for review or ShellCheck

---

## 2. VALIDATION PATTERNS

### Input Validation Pattern

```bash
validate_args() {
    # Check argument count
    if [[ $# -lt 1 ]]; then
        echo "Error: Missing required argument" >&2
        echo "Usage: $0 <input_file> [output_dir]" >&2
        return 1
    fi

    local input_file="$1"

    # Check file exists
    if [[ ! -f "$input_file" ]]; then
        echo "Error: File not found: $input_file" >&2
        return 1
    fi

    # Check file is readable
    if [[ ! -r "$input_file" ]]; then
        echo "Error: Cannot read: $input_file" >&2
        return 1
    fi

    return 0
}
```

### Safe File Operations

```bash
# Check before operating
if [[ -f "$file" ]]; then
    rm "$file"
fi

# Or use conditional
[[ -f "$file" ]] && rm "$file"

# Safe directory creation
mkdir -p "$output_dir"

# Safe temporary files
TEMP_FILE=$(mktemp)
trap 'rm -f "$TEMP_FILE"' EXIT
```

### Process Exit Pattern

```bash
main() {
    # Validation
    validate_args "$@" || exit 1

    # Processing
    if ! process_files; then
        log_error "PROCESS" "Processing failed"
        exit 2
    fi

    # Success
    log_pass "DONE" "Completed successfully"
    exit 0
}

main "$@"
```

---

## 3. ERROR HANDLING

### Exit Code Standards

| Code | Meaning | Usage |
|------|---------|-------|
| 0 | Success | Normal completion |
| 1 | General error | Invalid args, validation failure |
| 2 | Misuse | Command syntax error |
| 126 | Not executable | Permission issues |
| 127 | Not found | Command not found |

### Error Recovery Pattern

```bash
# Try operation with fallback
if ! primary_command; then
    log_warn "PRIMARY" "Failed, trying fallback"
    fallback_command || {
        log_error "FALLBACK" "Both methods failed"
        exit 1
    }
fi
```

### Cleanup on Exit

```bash
TEMP_FILES=()

cleanup() {
    for f in "${TEMP_FILES[@]}"; do
        [[ -f "$f" ]] && rm -f "$f"
    done
}

trap cleanup EXIT

# Usage
TEMP_FILE=$(mktemp)
TEMP_FILES+=("$TEMP_FILE")
```

---

## 4. OUTPUT STANDARDS

### Message Format

Use consistent formatting for different message types:

```bash
# Status messages
log_pass "RULE" "Description of success"
log_warn "RULE" "Description of warning"
log_error "RULE" "Description of error"
log_info "RULE" "Informational message"
```

**Evidence**: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:325-343`

### JSON Mode Support

For scripts used by other tools, support JSON output:

```bash
JSON_MODE=false

# Parse --json flag
[[ "${1:-}" == "--json" ]] && JSON_MODE=true

# Output based on mode
if [[ "$JSON_MODE" == true ]]; then
    printf '{"status":"success","files":%d}\n' "$count"
else
    printf "Processed %d files\n" "$count"
fi
```

### Progress Indicators

For long-running operations:

```bash
# Simple progress
echo "Processing file $i of $total..."

# With percentage
printf "\rProgress: %d%%" "$((i * 100 / total))"
```

---

## 5. SECURITY CONSIDERATIONS

### Avoid eval

Never use eval with user input:

```bash
# DANGEROUS
eval "$user_input"

# Safe alternative - use case statements
case "$action" in
    start) start_service ;;
    stop) stop_service ;;
    *) echo "Unknown action" >&2; exit 1 ;;
esac
```

### Quote All Paths

Especially important for paths with spaces:

```bash
# Always quote paths
cd "$directory"
cat "$file_path"
rm "$temp_file"
```

### Validate External Input

```bash
# Validate before use
if [[ ! "$input" =~ ^[a-zA-Z0-9_-]+$ ]]; then
    echo "Error: Invalid characters in input" >&2
    exit 1
fi
```

---

## 6. REVIEW HANDOFF (SK-CODE CODE-REVIEW MODE BASELINE)

Use `sk-code`'s code-review mode for formal findings-first review output and severity handling. Keep this file focused on shell technical standards.

For review runs:

1. Use `sk-code/code-review/references/quick_reference.md` for severity model and output contract.
2. Use `sk-code/code-review/assets/code_quality_checklist.md`, `security_checklist.md`, and `test_quality_checklist.md` for baseline risk checks.
3. Cite this shell standards file as the overlay source for shell-specific findings.

---

## 7. SHELLCHECK INTEGRATION

### Running ShellCheck

```bash
# Check single file
shellcheck script.sh

# Check all scripts
find . -name "*.sh" -exec shellcheck {} \;

# Ignore specific rules
shellcheck -e SC2034 script.sh  # Ignore unused variable warning
```

### Common ShellCheck Warnings

| Code | Issue | Fix |
|------|-------|-----|
| SC2086 | Unquoted variable | Quote: `"$var"` |
| SC2034 | Unused variable | Remove or use |
| SC2155 | Declare and assign separately | Split declaration |
| SC2164 | Use `cd ... \|\| exit` | Add error handling |

### Inline Directives

```bash
# Disable for single line
# shellcheck disable=SC2034
UNUSED_VAR="value"

# Disable for block
# shellcheck disable=SC2034,SC2086
problematic_function() {
    ...
}
```

---

## 8. RELATED RESOURCES

### Internal References
- [style_guide.md](../style_guide/overview_structure_and_naming.md) - Formatting and conventions
- [quick_reference.md](../quick_reference/template_variables_and_loops.md) - Quick lookup

### External Tools
- [ShellCheck](https://www.shellcheck.net/) - Static analysis
- [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
