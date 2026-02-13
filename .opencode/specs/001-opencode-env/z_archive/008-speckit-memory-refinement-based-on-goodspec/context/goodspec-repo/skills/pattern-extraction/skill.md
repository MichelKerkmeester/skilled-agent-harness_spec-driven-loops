---
name: pattern-extraction
description: Identify recurring patterns and abstractions in a codebase for documentation and reuse.
category: code
triggers:
  - patterns
  - abstraction
  - reuse
  - refactor
version: 0.1.0
---

# Pattern Extraction Skill

## Purpose
Identify recurring patterns and abstractions in a codebase for documentation and reuse.

## Pattern Categories

### 1. Structural Patterns
- Module organization
- Layer architecture
- Feature-based structure
- Shared utilities location

### 2. Code Patterns
- Error handling approach
- Validation patterns
- Data transformation patterns
- API client patterns

### 3. Testing Patterns
- Test file organization
- Mock/stub conventions
- Fixture patterns
- Integration test setup

### 4. Component Patterns
- Component composition
- Prop patterns
- State management
- Event handling

## Extraction Process

1. **Sample Selection** - Choose representative files
2. **Pattern Identification** - Note recurring structures
3. **Validation** - Verify pattern is consistent across codebase
4. **Documentation** - Write pattern description with examples
5. **Counter-Examples** - Note exceptions and why they differ

## Pattern Documentation Template

```markdown
## Pattern: [Name]

### Intent
What problem does this pattern solve?

### Structure
How is it organized?

### Example
```code
// Representative example
```

### When to Use
Guidelines for when to apply this pattern.

### Variations
Acceptable variations seen in codebase.
```
