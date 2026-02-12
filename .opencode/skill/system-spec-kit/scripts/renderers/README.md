# Template Renderers

> Lightweight template engine for populating spec folder templates with dynamic data.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 🚀 QUICK START](#2--quick-start)
- [3. 📁 STRUCTURE](#3--structure)
- [4. 🛠️ TROUBLESHOOTING](#4--troubleshooting)
- [5. 📚 RELATED DOCUMENTS](#5--related-documents)

---

## 1. 📖 OVERVIEW

### What are Template Renderers?

Template renderers provide a Mustache-like templating system for populating spec folder templates (spec.md, plan.md, tasks.md, checklist.md) with dynamic conversation data. They support conditionals, loops, and automatic cleanup.

### Key Features

| Feature | Description |
|---------|-------------|
| **Variable Substitution** | Replace `{{VAR}}` with data values |
| **Conditional Blocks** | `{{#CONDITION}}...{{/CONDITION}}` for if/then logic |
| **Inverted Sections** | `{{^CONDITION}}...{{/CONDITION}}` for if-not logic |
| **Array Loops** | `{{#ARRAY}}...{{/ARRAY}}` to iterate over collections |
| **Comment Stripping** | Remove template configuration comments from output |
| **Newline Cleanup** | Collapse excessive whitespace (3+ newlines → 2) |

### Requirements

| Requirement | Minimum | Notes |
|-------------|---------|-------|
| Node.js | 18+ | For script execution |
| TypeScript | 5.0+ | Source files are TypeScript (.ts) |
| fs/promises | Built-in | File system access |

---

## 2. 🚀 QUICK START

### Basic Usage

```typescript
import { populateTemplate } from '../renderers';

// Render template with data (name only - '_template.md' is appended internally)
const result = await populateTemplate('template', {
  PROJECT_NAME: 'MyProject',
  DESCRIPTION: 'A great project',
  features: ['Fast', 'Simple', 'Reliable']
});

console.log(result);
```

### Template Syntax

```markdown
# {{PROJECT_NAME}}

{{DESCRIPTION}}

## Features
{{#features}}
- {{.}}
{{/features}}

{{#hasTests}}
## Testing
Tests are available.
{{/hasTests}}

{{^hasTests}}
## Testing
No tests yet.
{{/hasTests}}
```

### Render Output

```typescript
const data = {
  PROJECT_NAME: 'MyTool',
  DESCRIPTION: 'Fast automation',
  features: ['Speed', 'Ease'],
  hasTests: false
};

// Result:
// # MyTool
//
// Fast automation
//
// ## Features
// - Speed
// - Ease
//
// ## Testing
// No tests yet.
```

---

## 3. 📁 STRUCTURE

```
renderers/
├── template-renderer.ts    # Core template engine (TypeScript source)
├── index.ts                # Public API exports (TypeScript source)
└── (compiled output in ../dist/renderers/)
```

### Key Files

| File | Purpose |
|------|---------|
| `template-renderer.ts` | Core rendering engine with conditionals, loops, and cleanup |
| `index.ts` | Module entry point, exports all renderer functions |
| `../dist/renderers/` | Compiled JavaScript output (generated from TypeScript) |

---

## 4. 🛠️ TROUBLESHOOTING

### Common Issues

#### Missing Template Variable

**Symptom**: `⚠️ Missing template data for: {{VAR}}`

**Cause**: Template references a variable not present in data object

**Solution**:
```typescript
// Ensure all template variables are in data
const data = {
  PROJECT_NAME: 'MyProject',
  DESCRIPTION: 'Description here',  // Don't forget this!
  features: []
};

await populateTemplate('template', data);
```

#### Array Not Rendering

**Symptom**: Loop section appears empty despite data

**Cause**: Data value is not an array or is empty

**Solution**:
```typescript
// Check array structure
const data = {
  features: ['Item 1', 'Item 2']  // Must be array with items
};

// For objects in array
const data = {
  items: [
    { name: 'Item 1' },
    { name: 'Item 2' }
  ]
};
```

#### Inverted Section Not Working

**Symptom**: `{{^VAR}}` section doesn't display when expected

**Cause**: Falsy value detection not matching expectation

**Solution**:
```typescript
// Falsy values: undefined, null, false, 0, '', 'false', []
const data = {
  hasTests: false,     // ✅ Inverted section will show
  hasDocs: undefined,  // ✅ Inverted section will show
  items: []            // ✅ Inverted section will show
};
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Missing variable | Add all template variables to data object |
| Empty loop | Check array has items and is not undefined |
| Extra newlines | Renderer auto-cleans 3+ newlines to 2 |
| Template comments | Use `stripTemplateConfigComments()` to remove |

### Diagnostic Commands

```typescript
// Test template rendering
import { renderTemplate } from '../renderers';

const template = '{{#test}}Success{{/test}}';
const data = { test: true };
console.log(renderTemplate(template, data));

// Check for missing variables
const result = renderTemplate('{{MISSING}}', {});
// Logs: ⚠️ Missing template data for: {{MISSING}}
```

---

## 5. 📚 RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [Template Guide](../../references/templates/template_guide.md) | Complete template structure and usage |
| [Template Style Guide](../../references/templates/template_style_guide.md) | Formatting conventions and patterns |
| [Template Mapping](../../assets/template_mapping.md) | Which template to use for each document type |
| [Level Specifications](../../references/templates/level_specifications.md) | Spec folder level requirements |

### External Resources

| Resource | Description |
|----------|-------------|
| [Mustache Documentation](https://mustache.github.io/) | Similar template syntax (reference) |
| [Handlebars Guide](https://handlebarsjs.com/guide/) | Extended template patterns (reference) |
