---
title: SKILLED House Code Quality Checklist
description: SKILLED's house quality checks for the hub's own code, loaded only when SKILLED resolves for the target. Every other surface uses the universal floor.
trigger_phrases:
  - "skilled house code quality checklist"
  - "skilled house checks"
  - "file header checklist"
  - "numbered all caps sections"
importance_tier: normal
contextType: implementation
version: 1.1.1.0
---

# SKILLED House Code Quality Checklist

SKILLED's house quality checks, loaded only when [stack-detection.md](../../../shared/references/stack-detection.md) resolves SKILLED for the target. Every other surface, UNKNOWN included, uses the universal floor in [code-quality-standards.md](../../../shared/references/universal/code-quality-standards.md) instead.

---

## 1. OVERVIEW

### Purpose

Provides SKILLED's baseline quality requirements across its languages (JavaScript, TypeScript, Python, Shell, Config). Use this checklist alongside language-specific checklists.

### Usage

Run this checklist for every SKILLED code change before applying the relevant language-specific checklist and validation commands.

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
    - JavaScript: Module header block `// ─── MODULE: NAME ───`, then 'use strict' in `.js`/`.cjs`
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
    - Structural path/globs the code needs (e.g. specs/ or .skilled/specs/) and stable standards (CWE-###) are OK
    - See sk-code-quality/references/code-style-guide.md §4 "No ephemeral-artifact pointers"
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
    - Allowed roots: `specs/` and `.skilled/specs/` only
    - Archive/restore/create targets validated before execution
    - Do not emit restore instructions unless checkpoint creation succeeded
```

---

## 3. P1 - REQUIRED

These must be addressed or receive approval to defer.

### Consistent Naming

```markdown
[ ] Naming follows the SKILLED language conventions (the scheme the universal floor's `floor.naming` leaves to the surface)
    - JavaScript: camelCase functions, UPPER_SNAKE constants
    - TypeScript: camelCase functions, PascalCase interfaces/types/enums, UPPER_SNAKE constants
    - Python: snake_case functions, UPPER_SNAKE constants
    - Shell: snake_case functions, UPPER_SNAKE constants
    - Config: camelCase keys
```

### Documentation Completeness

```markdown
[ ] Public APIs, exported types and complex algorithms carry docstrings or doc comments that explain WHY
    - JavaScript: JSDoc on exported functions
    - TypeScript: TSDoc on exported functions, classes and interfaces
    - Python: docstrings on public functions and the module
```

The universal floor keeps only `floor.documentation` at P2 and leaves the doc-comment form to the surface. This is the SKILLED form, at P1.

### Type Safety

```markdown
[ ] Types are enforced in the language's own terms
    - TypeScript: strict mode, no `any`
    - Python: public functions carry type hints, no `Any`
```

P1 when the type check fails, P2 otherwise. The universal floor rule `floor.type-safety` asks only that the repository's type check passes, so this strictness is the SKILLED house rule.

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
[ ] All TODOs name an owner and say what is left, with no ticket id
```

**Bad**:
```javascript
// TODO: fix this later
```

**Good**:
```javascript
// TODO(username): Add input validation
// TODO(username): Handle the empty-array edge case
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

### Internal Helper Documentation

```markdown
[ ] Private and internal helpers are explained too, where the name alone does not carry the intent
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
   - .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh <file>
   - Zero violations required
   - Escape: add `// hygiene-ok` to suppress a specific line

3. Check this SKILLED house checklist
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

- [ ] SKILLED house standards validated in `universal-checklist.md`
- [ ] Language checklist validated for changed files
- [ ] Findings severity/order produced with `sk-code/sk-code-review/references/quick-reference.md`
- [ ] Baseline risk checks sourced from `sk-code`'s code-review mode references
- [ ] Surface-specific deviations documented with file:line evidence
```

---

## 7. RULE OVERRIDES

The SKILLED surface changes one rule of the review default lens. The rows below follow the shared [rule overrides contract](../../../shared/references/universal/rule-overrides.md), and the review reads them at the SKILLED fallback level for every file this checklist covers, the hub's own `.skilled/**` files. A repository checklist or a specific surface outranks them.

| Rule | Action | Reason |
| --- | --- | --- |
| `review.todo-tracking` | replace: A TODO, FIXME or HACK names its owner, as `TODO(owner)`, and says what is left to do | The SKILLED owner-first TODO format. A ticket id stays out of comments here under `floor.ephemeral-pointers` |

---

## 8. RELATED RESOURCES

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
