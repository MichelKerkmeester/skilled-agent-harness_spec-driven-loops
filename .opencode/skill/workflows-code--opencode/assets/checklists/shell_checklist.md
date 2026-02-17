---
title: Shell Code Quality Checklist
description: Quality validation checklist for Bash scripts in the OpenCode development environment.
---

# Shell Code Quality Checklist

Quality validation checklist for Bash scripts in the OpenCode development environment.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Specific quality checks for Bash shell scripts. Use alongside the [universal_checklist.md](./universal_checklist.md) for complete validation.

### Priority Levels

| Level | Meaning | Enforcement |
|-------|---------|-------------|
| P0 | HARD BLOCKER | Must fix before commit |
| P1 | Required | Must fix or get explicit approval |
| P2 | Recommended | Can defer with justification |

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:p0-hard-blockers -->
## 2. P0 - HARD BLOCKERS

These items MUST be fixed before any commit.

### Shebang Line

```markdown
[ ] File starts with portable bash shebang
```

**Required**:
```bash
#!/usr/bin/env bash
```

### Strict Mode

```markdown
[ ] Strict mode enabled immediately after header
```

**Required**:
```bash
set -euo pipefail
```

| Flag | Purpose |
|------|---------|
| `-e` | Exit on error |
| `-u` | Error on undefined variables |
| `-o pipefail` | Pipe failure propagation |

### Double-Quoted Variables

```markdown
[ ] ALL variable expansions are double-quoted
```

**Correct**:
```bash
echo "$variable"
file_path="$1"
[[ -f "$file" ]]
```

**Wrong**:
```bash
echo $variable
file_path=$1
[[ -f $file ]]
```

### File Header

```markdown
[ ] COMPONENT comment block present
```

**Required format**:
```bash
#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: [COMPONENT NAME]
# ───────────────────────────────────────────────────────────────
# Brief description
```

### No Commented-Out Code

```markdown
[ ] No commented-out code blocks
```

### WHY Comments

```markdown
[ ] Non-obvious logic has WHY comments
```

---

<!-- /ANCHOR:p0-hard-blockers -->
<!-- ANCHOR:p1-required -->
## 3. P1 - REQUIRED

These must be addressed or receive approval to defer.

### Function Naming

```markdown
[ ] All functions use lowercase_with_underscores
```

**Correct**:
```bash
validate_input() {
    local data="$1"
}

process_file() {
    local path="$1"
}
```

**Wrong**:
```bash
validateInput() { }    # camelCase
ProcessFile() { }      # PascalCase
```

### Local Variables

```markdown
[ ] Function variables declared with local
```

**Required**:
```bash
process_file() {
    local file_path="$1"
    local output_dir="$2"
    local result=""
}
```

**Wrong**:
```bash
process_file() {
    file_path="$1"     # Pollutes global scope
    output_dir="$2"
}
```

### Exit Codes Documented

```markdown
[ ] Non-trivial scripts document exit codes
```

**Required in header**:
```bash
# Exit Codes:
#   0 - Success
#   1 - Invalid arguments
#   2 - File not found
#   3 - Permission denied
```

### Error Output to stderr

```markdown
[ ] Error messages go to stderr
```

**Correct**:
```bash
echo "Error: file not found" >&2
printf "${RED}ERROR:${NC} %s\n" "$msg" >&2
```

**Wrong**:
```bash
echo "Error: file not found"  # Goes to stdout
```

### TODO Format

```markdown
[ ] TODOs include owner or ticket number
```

---

<!-- /ANCHOR:p1-required -->
<!-- ANCHOR:p2-recommended -->
## 4. P2 - RECOMMENDED

These improve quality but can be deferred.

### POSIX Portability

```markdown
[ ] Bash-specific features noted or avoided where possible
```

**More portable**:
```bash
command -v program >/dev/null 2>&1
```

### Standard Color Definitions

```markdown
[ ] Uses consistent color scheme
```

**Standard**:
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

### Function Documentation

```markdown
[ ] Functions have comment headers
```

**Recommended**:
```bash
# Validate that a file exists and is readable
# Args:
#   $1 - File path to validate
# Returns:
#   0 if valid, 1 if invalid
validate_file() {
    local file_path="$1"
}
```

### ShellCheck Clean

```markdown
[ ] Script passes ShellCheck without warnings
```

---

<!-- /ANCHOR:p2-recommended -->
<!-- ANCHOR:checklist-template -->
## 5. CHECKLIST TEMPLATE

Copy this for code review:

```markdown
<!-- /ANCHOR:checklist-template -->
<!-- ANCHOR:shell-code-quality-check -->
## Shell Code Quality Check

### P0 - HARD BLOCKERS
- [ ] Shebang: #!/usr/bin/env bash
- [ ] Strict mode: set -euo pipefail
- [ ] All variables double-quoted
- [ ] COMPONENT header present
- [ ] No commented-out code
- [ ] WHY comments for complex logic

### P1 - REQUIRED
- [ ] Functions use snake_case
- [ ] Local variables in functions
- [ ] Exit codes documented
- [ ] Errors to stderr
- [ ] TODOs have context

### P2 - RECOMMENDED
- [ ] POSIX portability considered
- [ ] Standard color definitions
- [ ] Function documentation
- [ ] ShellCheck clean

### Universal Checklist
- [ ] [universal_checklist.md](./universal_checklist.md) passed

### Notes
[Any specific observations or deferred items]
```

---

<!-- /ANCHOR:shell-code-quality-check -->
<!-- ANCHOR:validation-commands -->
## 6. VALIDATION COMMANDS

```bash
# ShellCheck (comprehensive)
shellcheck script.sh

# Syntax check only
bash -n script.sh

# Check all shell files
find . -name "*.sh" -exec shellcheck {} \;

# Common pattern checks
grep -n 'echo \$[^"]' script.sh     # Unquoted variable
grep -n '^[^#]*\[ ' script.sh        # Old-style test
```

### Common ShellCheck Codes

| Code | Issue | Fix |
|------|-------|-----|
| SC2086 | Unquoted variable | Add quotes: `"$var"` |
| SC2034 | Unused variable | Remove or use it |
| SC2155 | Declare and assign | Split: `local x; x=$(cmd)` |
| SC2164 | cd without error check | `cd dir \|\| exit 1` |
| SC2006 | Legacy backticks | Use `$(command)` |

---

<!-- /ANCHOR:validation-commands -->
<!-- ANCHOR:related-resources -->
## 7. RELATED RESOURCES

### Checklists
- [universal_checklist.md](./universal_checklist.md) - Language-agnostic checks

### Style Guide
- [Shell Style Guide](../shell/style_guide.md)
- [Shell Quality Standards](../shell/quality_standards.md)

### External Tools
- [ShellCheck](https://www.shellcheck.net/) - Static analysis
<!-- /ANCHOR:related-resources -->
