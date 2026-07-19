---
title: Shell Quality Standards
description: Code quality requirements, validation rules, and best practices for Bash scripts in the OpenCode development environment.
trigger_phrases:
  - "opencode shell quality standards"
  - "bash strict mode gates"
  - "double quoted variables"
  - "shell quality validation"
importance_tier: normal
contextType: implementation
version: 1.0.0.15
---

# Shell Quality Standards

Code quality requirements, validation rules, and best practices for Bash scripts in the OpenCode development environment.

---

## 1. OVERVIEW

### Purpose

Establishes quality gates and validation criteria that all Bash scripts must meet before being committed or deployed.

### When to Use

- Writing or reviewing Bash scripts
- Applying shell quality gates before commit
- Classifying shell quality issues by priority

### Quality Tiers

| Tier | Requirement Level | Enforcement |
|------|-------------------|-------------|
| P0 | HARD BLOCKER | Must fix before commit |
| P1 | Required | Must fix or get approval |
| P2 | Recommended | Can defer with justification |

---

## 2. P0 - HARD BLOCKERS

These items MUST be fixed before any commit.

### Shebang Line

Every shell script must start with the portable shebang:

```bash
#!/usr/bin/env bash
```

**Evidence**: `.opencode/skills/system-spec-kit/scripts/lib/shell-common.sh:1`

### Strict Mode

Every script must enable strict mode:

```bash
set -euo pipefail
```

| Flag | Purpose | Why Required |
|------|---------|--------------|
| `-e` | Exit on error | Prevents silent failures |
| `-u` | Error on undefined vars | Catches typos, missing args |
| `-o pipefail` | Pipe failure propagation | Catches hidden pipe errors |

**Evidence**: `.opencode/skills/system-spec-kit/scripts/spec/create.sh:22`

### Double-Quoted Variables

ALL variable expansions must be double-quoted:

```bash
# Correct
echo "$variable"
file_path="$1"
[[ -f "$file" ]]

# WRONG - WILL FAIL VALIDATION
echo $variable
file_path=$1
[[ -f $file ]]
```

**Exceptions**: Only inside `[[ ]]` arithmetic contexts:
```bash
# OK without quotes in arithmetic
if (( count > 10 )); then
```

### File Header Present

Every script must have a header comment block:

```bash
#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: [COMPONENT NAME]
# ───────────────────────────────────────────────────────────────
# Brief description of script purpose
```

### No Commented-Out Code

Remove all commented-out code. Use version control for history.

```bash
# WRONG - remove this
# old_function() {
#     echo "deprecated"
# }

# OK - explanatory comment
# Note: Using -f flag because...
```

### WHY Comments for Non-Obvious Code

Complex logic must include comments explaining WHY:

```bash
# WRONG - describes what (obvious)
# Loop through files
for f in *.md; do

# CORRECT - explains why
# Process only markdown files to avoid binary file corruption
for f in *.md; do
```

---

## 3. P1 - REQUIRED

These items must be addressed or receive explicit approval to defer.

### Function Naming

All functions must use `lowercase_with_underscores`:

```bash
# Correct
validate_input() { ... }
process_file() { ... }

# WRONG
validateInput() { ... }    # camelCase
ProcessFile() { ... }      # PascalCase
```

This naming example is illustrative; no current system-spec-kit script provides a matching evidence pointer.

### Local Variables in Functions

All function variables must be declared local:

```bash
# Correct
process_file() {
    local file_path="$1"
    local result=""
    # ...
}

# WRONG - pollutes global scope
process_file() {
    file_path="$1"
    result=""
}
```

### Exit Codes Documented

Non-trivial scripts must document exit codes:

```bash
# Exit Codes:
#   0 - Success
#   1 - Invalid arguments
#   2 - File not found
#   3 - Permission denied
```

### Error Output to stderr

All errors must go to stderr:

```bash
# Correct
echo "Error: file not found" >&2
printf "${RED}ERROR:${NC} %s\n" "$msg" >&2

# WRONG - error to stdout
echo "Error: file not found"
```

### TODOs With Context

TODOs must include owner or ticket:

```bash
# Correct
# TODO(username): Add input validation
# TODO(TICKET-123): Handle edge case

# WRONG
# TODO: fix this later
```

---

## 4. P2 - RECOMMENDED

These items improve quality but can be deferred.

### POSIX Portability

When possible, avoid bash-specific features for portability:

```bash
# More portable
command -v program >/dev/null 2>&1

# Bash-specific (but OK in OpenCode context)
type -t program >/dev/null 2>&1
```

### Consistent Color Scheme

Use the standard color definitions:

```bash
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

if [[ ! -t 1 ]]; then
    RED='' GREEN='' YELLOW='' BLUE='' BOLD='' NC=''
fi
```

**Evidence**: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:74-77`

### Function Documentation

Functions should have comment blocks:

```bash
# Validate that a file exists and is readable
# Args:
#   $1 - File path to validate
# Returns:
#   0 if valid, 1 if invalid
validate_file() {
    local file_path="$1"
    # ...
}
```

### ShellCheck Compliance

Scripts should pass ShellCheck without warnings:

```bash
# Check with shellcheck
shellcheck script.sh
```

---
