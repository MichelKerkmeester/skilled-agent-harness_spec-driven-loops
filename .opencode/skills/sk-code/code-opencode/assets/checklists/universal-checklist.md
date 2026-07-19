---
title: Universal Code Quality Checklist
description: Language-agnostic quality checks that apply to all code files in the OpenCode development environment.
trigger_phrases:
  - "universal code quality checklist"
  - "language agnostic checks"
  - "file header checklist"
  - "numbered all caps sections"
importance_tier: normal
contextType: implementation
version: 1.0.0.28
---

# Universal Code Quality Checklist

Language-agnostic quality checks that apply to all code files in the OpenCode development environment.

---

## 1. OVERVIEW

### Purpose

Provides baseline quality requirements that apply across all languages (JavaScript, TypeScript, Python, Shell, Config). Use this checklist alongside language-specific checklists.

### Usage

Run this checklist for every code change before applying the relevant language-specific checklist and validation commands.

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
    - TypeScript: Module header block `// ─── MODULE: NAME ───` (no 'use strict'; tsconfig handles it)
    - Python: Shebang + COMPONENT comment block
    - Shell: Shebang + COMPONENT comment block
    - Config: JSONC comment header
```

**Evidence**: All style guides require headers

**Verifier boundary**: `verify_alignment_drift.py` checks marker-level headers
for supported code/config files. Exact visual style remains a manual checklist
gate.

### No Commented-Out Code

```markdown
[ ] No commented-out code blocks present
    - Use version control for code history
    - Explanatory comments are OK
    - TODO comments with context are OK
```

**Verifier boundary**: Commented-out code and WHY-vs-WHAT comment quality are
manual review gates; the alignment verifier does not parse intent from comments.

**What to remove**:
```javascript
// REMOVE - commented code
// function oldImplementation() {
//     return "deprecated";
// }

// KEEP - explanatory comment
// Note: Using setTimeout because requestAnimationFrame not available in Node
```

### No Ephemeral-Artifact Pointers in Comments

```markdown
[ ] No spec/packet/phase numbers, T###/REQ-###/CHK-###, feature-catalog, ADR, or ticket ids in comments
    - Keep the durable WHY; drop the perishable label
    - Structural path/globs the code needs (e.g. .opencode/specs/) and stable standards (CWE-###) are OK
    - See references/universal/code-style-guide.md §4 "No ephemeral-artifact pointers"
```

### Numbered ALL-CAPS Section Invariant

```markdown
[ ] Numbered ALL-CAPS section headers are preserved
    - Use `## N. SECTION NAME` in standards/examples
    - Do not switch to sentence-case section names
```

### Filesystem Mutation Safety

```markdown
[ ] File and folder mutations are guarded by canonical path checks
    - Use realpath/canonical path resolution for candidate and allowed roots
    - Use relative/boundary-safe containment checks (not substring-only checks)
    - Reject traversal/symlink escape attempts before create/move/delete
```

### Spec Folder Invariants (when touching specs)

```markdown
[ ] Spec folder operations enforce `NNN-name` and approved roots
    - Allowed roots: `specs/` and `.opencode/specs/` only
    - Archive/restore/create targets validated before execution
    - Do not emit restore instructions unless checkpoint creation succeeded
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

### WHY Comments (Manual Review)

```markdown
[ ] Purposeful WHY comments only (P1, manual checklist gate)
    - Comments explain WHY, not WHAT
    - Maximum 3 comments per 10 LOC
    - No narrative comments describing obvious mechanics
```

**Bad (WHAT)**:
```python
# Set x to 5
x = 5
```

**Good (WHY)**:
```python
# use 5 retries per SLA requirement for transient network failures
max_retries = 5
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

### KISS / DRY / SOLID Gate

```markdown
[ ] KISS/DRY/SOLID checks applied before merge
    - KISS: no speculative abstraction layers
    - DRY: repeated rules/constants consolidated
    - SOLID: SRP/OCP/LSP/ISP/DIP violations reviewed and resolved or documented
```

---

## 4. P2 - RECOMMENDED

These improve quality but can be deferred.

### Comment Density

```markdown
[ ] Appropriate level of documentation
    - Public APIs have documentation
    - Complex algorithms explained
    - Not over-commented (target <= 3 comments per 10 LOC)
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

2. Run comment-hygiene checker on each modified file
   - .opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh <file>
   - Zero violations required
   - Escape: add `// hygiene-ok` to suppress a specific line

3. Check this universal checklist
   - All P0 items must pass
   - P1 items addressed or approved

4. Run language-specific checklist
   - javascript-checklist.md
   - typescript-checklist.md
   - python-checklist.md
   - shell-checklist.md
   - config-checklist.md

5. Self-review
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

For formal findings-first review output, use `sk-code`'s code-review mode as the baseline and treat this file as cross-language surface evidence.

```markdown
## Cross-Language Standards Surface Evidence

- [ ] Universal standards validated in `universal-checklist.md`
- [ ] Language checklist validated for changed files
- [ ] Findings severity/order produced with `sk-code/code-review/references/quick-reference.md`
- [ ] Baseline risk checks sourced from `sk-code`'s code-review mode references
- [ ] Surface-specific deviations documented with file:line evidence
```

---

## 7. RELATED RESOURCES

### Language-Specific Checklists
- [javascript-checklist.md](./javascript-checklist.md)
- [typescript-checklist.md](./typescript-checklist.md)
- [python-checklist.md](./python-checklist.md)
- [shell-checklist.md](./shell-checklist.md)
- [config-checklist.md](./config-checklist.md)

### Style Guides
- [JavaScript Style Guide](../../references/javascript/style-guide.md)
- [TypeScript Style Guide](../../references/typescript/style-guide/overview-strict-and-naming.md)
- [Python Style Guide](../../references/python/style-guide.md)
- [Shell Style Guide](../../references/shell/style-guide/overview-structure-and-naming.md)
- [Config Style Guide](../../references/config/style-guide.md)
