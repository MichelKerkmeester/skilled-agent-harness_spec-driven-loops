---
name: convention-detection
description: Identify and document coding conventions, patterns, and style guidelines used in a codebase.
category: code
triggers:
  - conventions
  - style
  - patterns
  - guidelines
version: 0.1.0
---

# Convention Detection Skill

## Purpose
Identify and document coding conventions, patterns, and style guidelines used in a codebase.

## Detection Areas

### 1. Naming Conventions
- File naming (kebab-case, camelCase, PascalCase)
- Variable/function naming
- Class/type naming
- Constant naming
- Database column naming

### 2. Code Organization
- Directory structure patterns
- Module organization
- Import ordering
- Export patterns

### 3. Style
- Indentation (tabs vs spaces, size)
- Quote style (single vs double)
- Semicolons (yes/no)
- Line length limits
- Trailing commas

### 4. Patterns
- Error handling approach
- Logging conventions
- Testing patterns
- Comment style
- Documentation format

## Detection Methods

1. **Config files** - Read ESLint, Prettier, EditorConfig
2. **Sample analysis** - Examine 5-10 representative files
3. **Frequency analysis** - Count occurrences of patterns
4. **Explicit docs** - Check CONTRIBUTING.md, STYLEGUIDE.md

## Output Format

```markdown
## Detected Conventions

### Naming
- Files: kebab-case
- Functions: camelCase
- Classes: PascalCase

### Style
- Indent: 2 spaces
- Quotes: single
- Semicolons: no
```
