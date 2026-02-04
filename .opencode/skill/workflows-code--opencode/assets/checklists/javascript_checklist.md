---
title: JavaScript Code Quality Checklist
description: Quality validation checklist for JavaScript code in the OpenCode development environment.
---

# JavaScript Code Quality Checklist

Quality validation checklist for JavaScript code in the OpenCode development environment.

---

## 1. 📖 OVERVIEW

### Purpose

Specific quality checks for JavaScript files. Use alongside the [universal_checklist.md](./universal_checklist.md) for complete validation.

### Priority Levels

| Level | Meaning | Enforcement |
|-------|---------|-------------|
| P0 | HARD BLOCKER | Must fix before commit |
| P1 | Required | Must fix or get explicit approval |
| P2 | Recommended | Can defer with justification |

---

## 2. 📌 P0 - HARD BLOCKERS

These items MUST be fixed before any commit.

### Box Header

```markdown
[ ] File has box header with component identification
```

**Required format**:
```javascript
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: [Component Name]                                               ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: [Brief description of what this file does]                       ║
// ╚══════════════════════════════════════════════════════════════════════════╝
```

### 'use strict'

```markdown
[ ] 'use strict' directive present at top of file
```

**Required** (immediately after header):
```javascript
'use strict';
```

### Function Naming

```markdown
[ ] All functions use snake_case naming
```

**Correct**:
```javascript
function validate_input(data) { }
function process_file(path) { }
const handle_error = (err) => { };
```

**Wrong**:
```javascript
function validateInput(data) { }     // camelCase
function ProcessFile(path) { }       // PascalCase
```

### No Commented-Out Code

```markdown
[ ] No commented-out code blocks
```

**Remove**:
```javascript
// function old_implementation() {
//     return "deprecated";
// }
```

### WHY Comments

```markdown
[ ] Non-obvious logic has WHY comments
```

**Required for**:
- Algorithm choices
- Performance optimizations
- Business rule implementations
- Workarounds for known issues

---

## 3. 📌 P1 - REQUIRED

These must be addressed or receive approval to defer.

### CommonJS Exports

```markdown
[ ] Uses CommonJS module.exports (not ES modules)
```

**Correct**:
```javascript
module.exports = { function_name, CONSTANT };
module.exports = function_name;
```

**Wrong** (for Node.js in this codebase):
```javascript
export { function_name };
export default function_name;
```

### Guard Clauses

```markdown
[ ] Functions use early returns for invalid states
```

**Correct**:
```javascript
function process_data(data) {
    if (!data) return null;
    if (!data.required_field) return null;

    // Main logic here
    return result;
}
```

**Wrong**:
```javascript
function process_data(data) {
    if (data) {
        if (data.required_field) {
            // Deeply nested logic
        }
    }
}
```

### Bracketed Logging

```markdown
[ ] Console output uses bracketed format
```

**Correct**:
```javascript
console.log('[COMPONENT] Processing file:', filename);
console.error('[COMPONENT] Error:', error.message);
```

**Wrong**:
```javascript
console.log('Processing file: ' + filename);
console.log(filename);  // No context
```

### Constants

```markdown
[ ] Module-level constants use UPPER_SNAKE_CASE
```

**Correct**:
```javascript
const MAX_RETRIES = 3;
const DEFAULT_TIMEOUT = 5000;
const VALID_TYPES = ['a', 'b', 'c'];
```

### Error Handling

```markdown
[ ] Try/catch blocks handle errors appropriately
[ ] Error messages include context
```

**Correct**:
```javascript
try {
    const data = JSON.parse(content);
} catch (error) {
    console.error('[PARSER] Failed to parse JSON:', error.message);
    throw new Error(`Invalid JSON in ${filename}: ${error.message}`);
}
```

---

## 4. 📌 P2 - RECOMMENDED

These improve quality but can be deferred.

### JSDoc Comments

```markdown
[ ] Public functions have JSDoc documentation
```

**Example**:
```javascript
/**
 * Validates input data against schema.
 * @param {Object} data - The data to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} Validation result with isValid and errors
 */
function validate_input(data, schema) { }
```

### Consistent String Quotes

```markdown
[ ] Strings use single quotes consistently
```

**Preferred**:
```javascript
const message = 'Hello world';
const config = { key: 'value' };
```

### Async/Await Pattern

```markdown
[ ] Async operations use async/await (not callbacks where possible)
```

**Preferred**:
```javascript
async function fetch_data() {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}
```

### Destructuring

```markdown
[ ] Object destructuring used where it improves clarity
```

**Good**:
```javascript
const { name, value } = config;
function process({ data, options = {} }) { }
```

---

## 5. 📋 CHECKLIST TEMPLATE

Copy this for code review:

```markdown
## JavaScript Code Quality Check

### P0 - HARD BLOCKERS
- [ ] Box header present
- [ ] 'use strict' directive
- [ ] Functions use snake_case
- [ ] No commented-out code
- [ ] WHY comments for complex logic

### P1 - REQUIRED
- [ ] CommonJS exports (module.exports)
- [ ] Guard clauses / early returns
- [ ] Bracketed logging format
- [ ] UPPER_SNAKE_CASE constants
- [ ] Error handling with context

### P2 - RECOMMENDED
- [ ] JSDoc for public functions
- [ ] Consistent single quotes
- [ ] async/await pattern
- [ ] Appropriate destructuring

### Universal Checklist
- [ ] [universal_checklist.md](./universal_checklist.md) passed

### Notes
[Any specific observations or deferred items]
```

---

## 6. 📌 VALIDATION COMMANDS

```bash
# Syntax check
node --check file.js

# ESLint (if configured)
npx eslint file.js

# Check for common issues
grep -n "function [a-z]*[A-Z]" file.js  # Find camelCase functions
grep -n "^export " file.js              # Find ES module exports
```

---

## 7. 🔗 RELATED RESOURCES

### Checklists
- [universal_checklist.md](./universal_checklist.md) - Language-agnostic checks

### Style Guide
- [JavaScript Style Guide](../javascript/style_guide.md)
- [JavaScript Quality Standards](../javascript/quality_standards.md)
