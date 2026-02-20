---
description: "Core workflow steps, key pattern categories, and evidence-based pattern sources for OpenCode code standards"
---
# How It Works

Describes the standards workflow from language detection through standards application, key pattern categories, and evidence sources.

## Standards Workflow

```
STEP 1: Language Detection
        |-- Check file extension first (.js, .py, .sh, .json)
        |-- Fall back to keyword matching
        +-- Prompt user if ambiguous
        |
STEP 2: Load Shared Patterns (ALWAYS)
        |-- universal_patterns.md -> Naming, commenting principles
        +-- code_organization.md -> File structure, sections
        |
STEP 3: Load Language References (CONDITIONAL)
        |-- {language}/style_guide.md -> Headers, formatting
        |-- {language}/quality_standards.md -> Errors, logging
        +-- {language}/quick_reference.md -> Cheat sheet
        |
STEP 4: Apply Standards
        |-- Follow patterns from loaded references
        |-- Use checklist for validation (ON_DEMAND)
        +-- Cite evidence with file:line references
```

## Key Pattern Categories

| Category         | What It Covers                                             |
| ---------------- | ---------------------------------------------------------- |
| File Headers     | Box-drawing format, shebang, 'use strict', strict mode     |
| Section Dividers | Numbered sections with consistent divider style            |
| Naming           | Functions, constants, classes, interfaces, types per lang  |
| Commenting       | WHY not WHAT, reference comments (T###, REQ-###)           |
| Error Handling   | Guard clauses, try-catch, typed catch, specific exceptions |
| Documentation    | JSDoc, TSDoc, Google docstrings, inline comments           |

## Evidence-Based Patterns

| Language   | Key Evidence Files                                                                                  |
| ---------- | --------------------------------------------------------------------------------------------------- |
| JavaScript | `validation_patterns.js`, `wait_patterns.js`, `performance_patterns.js`                             |
| TypeScript | ~341 `.ts` files post-migration; patterns from `context-server.ts`, `config.ts`, `memory-search.ts` |
| Python     | `skill_advisor.py`, `validate_document.py`, `package_skill.py`                                      |
| Shell      | `lib/common.sh`, `spec/create.sh`, `validate.sh`                                                    |
| Config     | `config.jsonc`, `opencode.json`, `complexity-config.jsonc`                                          |

## Cross References
- [[smart-routing]] - Full language detection and resource routing logic
- [[language-detection]] - Quick language identification table
- [[quick-reference]] - File header templates and naming matrix