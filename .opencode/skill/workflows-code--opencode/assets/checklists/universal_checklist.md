---
title: Universal Code Quality Checklist
description: Language-agnostic quality checks that apply to all code files in the OpenCode development environment.
---

# Universal Code Quality Checklist

Language-agnostic quality checks that apply to all code files in the OpenCode development environment.

---

## 1. OVERVIEW

### Purpose

Provides baseline quality requirements that apply across all languages (JavaScript, TypeScript, Python, Shell, Config). Use this checklist alongside language-specific checklists.

### Priority Levels

| Level | Meaning | Enforcement |
|-------|---------|-------------|
| P0 | HARD BLOCKER | Must fix before commit |
| P1 | Required | Must fix or get explicit approval |
| P2 | Recommended | Can defer with justification |

---

## 2. P0 - HARD BLOCKERS

These items MUST be fixed before any commit.

### File Header

```markdown
[ ] File has appropriate header comment identifying the component
    - JavaScript: Box header with 'use strict'
    - TypeScript: Box header (no 'use strict'; tsconfig handles it)
    - Python: Shebang + COMPONENT comment block
    - Shell: Shebang + COMPONENT comment block
    - Config: JSONC comment header
```

**Evidence**: All style guides require headers

### No Commented-Out Code

```markdown
[ ] No commented-out code blocks present
    - Use version control for code history
    - Explanatory comments are OK
    - TODO comments with context are OK
```

**What to remove**:
```javascript
// REMOVE - commented code
// function oldImplementation() {
//     return "deprecated";
// }

// KEEP - explanatory comment
// Note: Using setTimeout because requestAnimationFrame not available in Node
```

### WHY Comments

```markdown
[ ] Complex or non-obvious logic has WHY comments
    - Explain reasoning, not what code does
    - Business rules and edge cases documented
    - Algorithm choices explained
```

**Bad (WHAT)**:
```python
# Set x to 5
x = 5
```

**Good (WHY)**:
```python
# Use 5 retries per SLA requirement for transient network failures
max_retries = 5
```

---

## 3. P1 - REQUIRED

These must be addressed or receive approval to defer.

### Consistent Naming

```markdown
[ ] Naming follows language conventions
    - JavaScript: camelCase functions, UPPER_SNAKE constants
    - TypeScript: camelCase functions, PascalCase interfaces/types/enums, UPPER_SNAKE constants
    - Python: snake_case functions, UPPER_SNAKE constants
    - Shell: snake_case functions, UPPER_SNAKE constants
    - Config: camelCase keys
```

### TODO Format

```markdown
[ ] All TODOs include context (owner or ticket number)
```

**Bad**:
```javascript
// TODO: fix this later
```

**Good**:
```javascript
// TODO(username): Add input validation
// TODO(TICKET-123): Handle edge case for empty arrays
```

### Error Messages

```markdown
[ ] Error messages include context
    - What failed
    - Why it failed (if known)
    - How to fix (if applicable)
```

**Bad**:
```python
return False, "Invalid input"
```

**Good**:
```python
return False, f"Name '{name}' must be hyphen-case (lowercase letters, digits, and hyphens only)"
```

### No Magic Numbers/Strings

```markdown
[ ] Magic values are extracted to named constants
```

**Bad**:
```javascript
if (items.length > 100) {  // What is 100?
```

**Good**:
```javascript
const MAX_ITEMS = 100;  // API rate limit per request
if (items.length > MAX_ITEMS) {
```

---

## 4. P2 - RECOMMENDED

These improve quality but can be deferred.

### Comment Density

```markdown
[ ] Appropriate level of documentation
    - Public APIs have documentation
    - Complex algorithms explained
    - Not over-commented (obvious code)
```

### Code Organization

```markdown
[ ] Code is organized into logical sections
    - Related functionality grouped
    - Clear separation of concerns
    - Consistent ordering (constants, functions, exports)
```

### Line Length

```markdown
[ ] Reasonable line lengths maintained
    - Target: 80-100 characters
    - Maximum: 120 characters
    - Long lines broken at logical points
```

---

## 5. VALIDATION WORKFLOW

### Before Committing

```markdown
1. Run language-specific linter/type checker
   - JavaScript: ESLint or built-in checks
   - TypeScript: tsc --noEmit (type check without emitting)
   - Python: Black/flake8/mypy
   - Shell: ShellCheck

2. Check this universal checklist
   - All P0 items must pass
   - P1 items addressed or approved

3. Run language-specific checklist
   - javascript_checklist.md
   - typescript_checklist.md
   - python_checklist.md
   - shell_checklist.md
   - config_checklist.md

4. Self-review
   - Would a colleague understand this?
   - Is anything overly clever?
   - Are edge cases handled?
```

### Quick Validation Commands

```bash
# JavaScript (ESLint if available)
npx eslint src/

# TypeScript (type check without emitting)
tsc --noEmit

# Python
python -m flake8 scripts/
python -m mypy scripts/

# Shell
shellcheck *.sh

# Config (JSON validation)
python -m json.tool config.json
```

---

## 6. CHECKLIST TEMPLATE

Copy this for code review:

```markdown
## Universal Code Quality Check

### P0 - HARD BLOCKERS
- [ ] File header present
- [ ] No commented-out code
- [ ] WHY comments for complex logic

### P1 - REQUIRED
- [ ] Consistent naming conventions
- [ ] TODOs have context
- [ ] Error messages include context
- [ ] No magic numbers/strings

### P2 - RECOMMENDED
- [ ] Appropriate comment density
- [ ] Code logically organized
- [ ] Line lengths reasonable

### Notes
[Any specific observations or deferred items]
```

---

## 7. RELATED RESOURCES

### Language-Specific Checklists
- [javascript_checklist.md](./javascript_checklist.md)
- [typescript_checklist.md](./typescript_checklist.md)
- [python_checklist.md](./python_checklist.md)
- [shell_checklist.md](./shell_checklist.md)
- [config_checklist.md](./config_checklist.md)

### Style Guides
- [JavaScript Style Guide](../../references/javascript/style_guide.md)
- [TypeScript Style Guide](../../references/typescript/style_guide.md)
- [Python Style Guide](../../references/python/style_guide.md)
- [Shell Style Guide](../../references/shell/style_guide.md)
- [Config Style Guide](../../references/config/style_guide.md)
