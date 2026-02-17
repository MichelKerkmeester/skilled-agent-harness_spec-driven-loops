---
name: workflows-code--opencode
description: Multi-language code standards for OpenCode system code (JavaScript, TypeScript, Python, Shell, JSON/JSONC) with language detection routing, universal patterns, and quality checklists.
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.0.5.0
---

<!-- Keywords: opencode style, script standards, mcp code quality, node code style, typescript style, ts standards, python style, py standards, bash style, shell script, json format, jsonc config, code standards opencode -->

# Code Standards - OpenCode System Code

Multi-language code standards for OpenCode system code across JavaScript, TypeScript, Python, Shell, and JSON/JSONC.

**Core Principle**: Consistency within language + Clarity across languages = maintainable system code.

---

## 1. WHEN TO USE

### Activation Triggers

**Use this skill when:**
- Writing or modifying OpenCode system code (.opencode/, MCP servers, scripts)
- Creating new JavaScript modules for MCP servers or utilities
- Writing Python scripts (validators, advisors, test utilities)
- Creating Shell scripts (automation, validation, deployment)
- Configuring JSON/JSONC files (manifests, schemas, configs)
- Reviewing code for standards compliance before commit
- Need naming, formatting, or structure guidance

**Keyword triggers:**

| Language   | Keywords                                                                          |
| ---------- | --------------------------------------------------------------------------------- |
| JavaScript | `opencode`, `mcp`, `commonjs`, `require`, `module.exports`, `strict`              |
| TypeScript | `typescript`, `ts`, `tsx`, `interface`, `type`, `tsconfig`, `tsc`, `strict`       |
| Python     | `python`, `pytest`, `argparse`, `docstring`, `snake_case`                         |
| Shell      | `bash`, `shell`, `shebang`, `set -e`, `pipefail`                                  |
| Config     | `json`, `jsonc`, `config`, `schema`, `manifest`                                   |

### When NOT to Use

**Do NOT use this skill for:**
- Web/frontend development (use `workflows-code` instead)
- Browser-specific patterns (DOM, observers, animations)
- CSS styling or responsive design
- CDN deployment or minification workflows
- Full development lifecycle (research/debug/verify phases)

### Skill Overview

| Aspect        | This Skill (opencode)        | workflows-code        |
| ------------- | ---------------------------- | --------------------- |
| **Target**    | System/backend code          | Web/frontend code     |
| **Languages** | JS, TS, Python, Shell, JSON  | HTML, CSS, JavaScript |
| **Phases**    | Standards only               | 4 phases (0-3)        |
| **Browser**   | Not applicable               | Required verification |
| **Focus**     | Internal tooling             | User-facing features  |

**The Standard**: Evidence-based patterns extracted from actual OpenCode codebase files with file:line citations.

---

## 2. SMART ROUTING

### Resource Loading Levels

| Level       | When to Load               | Resources                    |
| ----------- | -------------------------- | ---------------------------- |
| ALWAYS      | Every skill invocation     | Shared patterns + SKILL.md   |
| CONDITIONAL | If language keywords match | Language-specific references |
| ON_DEMAND   | Only on explicit request   | Deep-dive quality standards  |

### Language Detection Algorithm

```python
LANGUAGE_KEYWORDS = {
    "JAVASCRIPT": ["node", "npm", "commonjs", "require", "module.exports", "mcp", "opencode"],
    "TYPESCRIPT": ["typescript", "ts", "tsx", "interface", "type", "tsconfig", "tsc", "strict"],
    "PYTHON": ["python", "pip", "pytest", "argparse", "docstring", "typing"],
    "SHELL": ["bash", "shell", "shebang", "set -e", "pipefail", "script"],
    "CONFIG": ["json", "jsonc", "config", "schema", "manifest", "package.json"]
}

FILE_EXTENSIONS = {
    ".js": "JAVASCRIPT", ".mjs": "JAVASCRIPT", ".cjs": "JAVASCRIPT",
    ".ts": "TYPESCRIPT", ".tsx": "TYPESCRIPT", ".mts": "TYPESCRIPT", ".d.ts": "TYPESCRIPT",
    ".py": "PYTHON",
    ".sh": "SHELL", ".bash": "SHELL",
    ".json": "CONFIG", ".jsonc": "CONFIG"
}
```

### Resource Router

```python
def route_opencode_resources(task):
    # ──────────────────────────────────────────────────────────────────
    # ALWAYS: Shared patterns (load first for every invocation)
    # ──────────────────────────────────────────────────────────────────
    load("references/shared/universal_patterns.md")   # ALWAYS: naming, commenting
    load("references/shared/code_organization.md")    # ALWAYS: file structure

    language = detect_language(task.context)

    # ──────────────────────────────────────────────────────────────────
    # JAVASCRIPT (~65 files in OpenCode — decreasing as TS migration continues)
    # Key patterns: camelCase functions, box headers, 'use strict'
    # ──────────────────────────────────────────────────────────────────
    if language == "JAVASCRIPT":
        load("references/javascript/style_guide.md")       # CONDITIONAL
        load("references/javascript/quality_standards.md") # CONDITIONAL
        if task.needs_checklist:
            load("assets/checklists/javascript_checklist.md")  # ON_DEMAND
        return load("references/javascript/quick_reference.md")

    # ──────────────────────────────────────────────────────────────────
    # TYPESCRIPT (~341 files in OpenCode — primary language post-migration)
    # Key patterns: PascalCase interfaces/types/enums, import type, strict
    # ──────────────────────────────────────────────────────────────────
    if language == "TYPESCRIPT":
        load("references/typescript/style_guide.md")       # CONDITIONAL
        load("references/typescript/quality_standards.md") # CONDITIONAL
        if task.needs_checklist:
            load("assets/checklists/typescript_checklist.md")  # ON_DEMAND
        return load("references/typescript/quick_reference.md")

    # ──────────────────────────────────────────────────────────────────
    # PYTHON (10 files in OpenCode)
    # Key patterns: Google docstrings, early return tuples, type hints
    # ──────────────────────────────────────────────────────────────────
    if language == "PYTHON":
        load("references/python/style_guide.md")       # CONDITIONAL
        load("references/python/quality_standards.md") # CONDITIONAL
        if task.needs_checklist:
            load("assets/checklists/python_checklist.md")  # ON_DEMAND
        return load("references/python/quick_reference.md")

    # ──────────────────────────────────────────────────────────────────
    # SHELL (60+ files in OpenCode)
    # Key patterns: set -euo pipefail, ANSI colors, log_* functions
    # ──────────────────────────────────────────────────────────────────
    if language == "SHELL":
        load("references/shell/style_guide.md")       # CONDITIONAL
        load("references/shell/quality_standards.md") # CONDITIONAL
        if task.needs_checklist:
            load("assets/checklists/shell_checklist.md")  # ON_DEMAND
        return load("references/shell/quick_reference.md")

    # ──────────────────────────────────────────────────────────────────
    # CONFIG (JSON/JSONC)
    # Key patterns: JSONC section comments, camelCase keys, $schema
    # ──────────────────────────────────────────────────────────────────
    if language == "CONFIG":
        load("references/config/style_guide.md")  # CONDITIONAL
        if task.needs_checklist:
            load("assets/checklists/config_checklist.md")  # ON_DEMAND
        return load("references/config/quick_reference.md")

    return prompt_user("Which language? (js/py/sh/json)")
```

### Specific Use Case Router

**JavaScript**

| Use Case                              | Route To                            | Level       |
| ------------------------------------- | ----------------------------------- | ----------- |
| File headers, box-drawing format      | `javascript/style_guide.md#2`       | CONDITIONAL |
| Function naming, camelCase            | `javascript/style_guide.md#5`       | CONDITIONAL |
| CommonJS exports, module organization | `javascript/quality_standards.md#2` | CONDITIONAL |
| Error handling, try-catch patterns    | `javascript/quality_standards.md#3` | CONDITIONAL |
| JSDoc documentation format            | `javascript/quality_standards.md#5` | ON_DEMAND   |

**TypeScript**

| Use Case                                    | Route To                              | Level       |
| ------------------------------------------- | ------------------------------------- | ----------- |
| File headers, dash-line format              | `typescript/style_guide.md#2`         | CONDITIONAL |
| Naming (interfaces, types, enums, generics) | `typescript/style_guide.md#5`         | CONDITIONAL |
| Interface vs type decision guide            | `typescript/quality_standards.md#2`   | CONDITIONAL |
| Type safety (unknown, strict null, generics)| `typescript/quality_standards.md#3`   | CONDITIONAL |
| Discriminated unions, state management      | `typescript/quality_standards.md#4`   | CONDITIONAL |
| TSDoc documentation format                  | `typescript/quality_standards.md#7`   | ON_DEMAND   |
| Typed error classes, async patterns         | `typescript/quality_standards.md#8`   | ON_DEMAND   |
| tsconfig.json configuration                 | `typescript/quality_standards.md#10`  | ON_DEMAND   |
| Build/rebuild dist after .ts edits          | `typescript/quality_standards.md#10`  | CONDITIONAL |

**Python**

| Use Case                            | Route To                        | Level       |
| ----------------------------------- | ------------------------------- | ----------- |
| Shebang, file header format         | `python/style_guide.md#2`       | CONDITIONAL |
| Google-style docstrings             | `python/style_guide.md#5`       | CONDITIONAL |
| Type hints, Optional/Union patterns | `python/quality_standards.md#3` | CONDITIONAL |

**Shell**

| Use Case                                | Route To                       | Level       |
| --------------------------------------- | ------------------------------ | ----------- |
| Shebang, strict mode setup              | `shell/style_guide.md#2`       | CONDITIONAL |
| Variable quoting, local declarations    | `shell/style_guide.md#6`       | CONDITIONAL |
| Color definitions, ANSI codes           | `shell/style_guide.md#4`       | CONDITIONAL |
| Logging functions (log_info, log_error) | `shell/style_guide.md#5`       | CONDITIONAL |

**Config**

| Use Case                    | Route To                  | Level       |
| --------------------------- | ------------------------- | ----------- |
| JSON structure, key naming  | `config/style_guide.md#3` | CONDITIONAL |
| JSONC section comments      | `config/style_guide.md#4` | CONDITIONAL |
| Schema references ($schema) | `config/style_guide.md#7` | ON_DEMAND   |

---

## 3. HOW IT WORKS

### Standards Workflow

```
STEP 1: Language Detection
        ├─ Check file extension first (.js, .py, .sh, .json)
        ├─ Fall back to keyword matching
        └─ Prompt user if ambiguous
        ↓
STEP 2: Load Shared Patterns (ALWAYS)
        ├─ universal_patterns.md → Naming, commenting principles
        └─ code_organization.md → File structure, sections
        ↓
STEP 3: Load Language References (CONDITIONAL)
        ├─ {language}/style_guide.md → Headers, formatting
        ├─ {language}/quality_standards.md → Errors, logging
        └─ {language}/quick_reference.md → Cheat sheet
        ↓
STEP 4: Apply Standards
        ├─ Follow patterns from loaded references
        ├─ Use checklist for validation (ON_DEMAND)
        └─ Cite evidence with file:line references
```

### Key Pattern Categories

| Category         | What It Covers                                              |
| ---------------- | ----------------------------------------------------------- |
| File Headers     | Box-drawing format, shebang, 'use strict', strict mode      |
| Section Dividers | Numbered sections with consistent divider style             |
| Naming           | Functions, constants, classes, interfaces, types per lang   |
| Commenting       | WHY not WHAT, reference comments (T###, REQ-###)            |
| Error Handling   | Guard clauses, try-catch, typed catch, specific exceptions  |
| Documentation    | JSDoc, TSDoc, Google docstrings, inline comments            |

### Evidence-Based Patterns

| Language   | Key Evidence Files                                             |
| ---------- | -------------------------------------------------------------- |
| JavaScript | `validation_patterns.js`, `wait_patterns.js`, `performance_patterns.js` |
| TypeScript | ~341 `.ts` files post-migration; patterns from `context-server.ts`, `config.ts`, `memory-search.ts` |
| Python     | `skill_advisor.py`, `validate_document.py`, `package_skill.py` |
| Shell      | `lib/common.sh`, `spec/create.sh`, `validate.sh`               |
| Config     | `config.jsonc`, `opencode.json`, `complexity-config.jsonc`     |

---

## 4. RULES

### ✅ ALWAYS

1. **Follow file header format for the language**
   - JavaScript: Box-drawing `// ─── MODULE_TYPE: NAME ───` + `'use strict'`
   - TypeScript: Box-drawing `// --- MODULE: NAME ---` (no `'use strict'`; tsconfig handles it)
   - Python: Shebang `#!/usr/bin/env python3` + box-drawing header
   - Shell: Shebang `#!/usr/bin/env bash` + header + `set -euo pipefail`
   - JSONC: Box comment header (JSON cannot have comments)

2. **Use consistent naming conventions**
   - JavaScript: `camelCase` functions, `UPPER_SNAKE` constants, `PascalCase` classes
   - TypeScript: Same as JS + `PascalCase` interfaces/types/enums, `T`-prefix generics
   - Python: `snake_case` functions/variables, `UPPER_SNAKE` constants, `PascalCase` classes
   - Shell: `lowercase_underscore` functions, `UPPERCASE` globals
   - Config: `camelCase` keys, `$schema` for validation

3. **Add WHY comments, not WHAT comments**
   - Maximum 5 comments per 10 lines of code
   - Bad: `// Loop through items`
   - Good: `// Process in reverse order for dependency resolution`

4. **Include reference comments for traceability**
   - Task: `// T001: Description`
   - Bug: `// BUG-042: Description`
   - Requirement: `// REQ-003: Description`
   - Security: `// SEC-001: Description (CWE-XXX)`

5. **Validate inputs and handle errors**
   - JavaScript: Guard clauses + try-catch
   - Python: try-except with specific exceptions + early return tuples
   - Shell: `set -euo pipefail` + explicit exit codes

### ❌ NEVER

1. **Leave commented-out code** - Delete it (git preserves history)
2. **Skip the file header** - Every file needs identification (P0)
3. **Use generic variable names** - No `data`, `temp`, `x`, `foo`, `bar`
4. **Hardcode secrets** - Use `process.env.VAR`, `os.environ['VAR']`
5. **Mix naming conventions** - Be consistent within language

### ⚠️ ESCALATE IF

1. **Pattern conflicts with existing code** - Prefer consistency
2. **Language detection is ambiguous** - Ask user to clarify
3. **Evidence files not found** - Use general pattern, note the gap
4. **Security-sensitive code** - Require explicit review

---

## 5. SUCCESS CRITERIA

### Quality Gates

| Gate               | Criteria                                 | Priority |
| ------------------ | ---------------------------------------- | -------- |
| File Header        | Matches language-specific format         | P0       |
| Naming Convention  | Consistent throughout file               | P0       |
| No Commented Code  | Zero commented-out code blocks           | P0       |
| Error Handling     | All error paths handled                  | P1       |
| WHY Comments       | Comments explain reasoning               | P1       |
| Documentation      | Public functions have doc comments       | P1       |
| Reference Comments | Task/bug/req references where applicable | P2       |

### Priority Levels

| Level | Handling                  | Examples                          |
| ----- | ------------------------- | --------------------------------- |
| P0    | HARD BLOCKER - must fix   | File header, no commented code    |
| P1    | Required OR approved skip | Consistent naming, error handling |
| P2    | Can defer                 | Reference comments, import order  |

### Completion Checklist

```
P0 Items (MUST pass):
□ File header present and correct format
□ No commented-out code
□ Consistent naming convention

P1 Items (Required):
□ WHY comments, not WHAT
□ Error handling implemented
□ Public functions documented

P2 Items (Can defer):
□ Reference comments (T###, BUG-###)
□ Import order optimized
```

---

## 6. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in AGENTS.md.

- **Gate 2**: Skill routing via `skill_advisor.py`
- **Memory**: Context preserved via Spec Kit Memory MCP

### Skill Differentiation

| Task Type                 | This Skill | workflows-code |
| ------------------------- | ---------- | -------------- |
| MCP server JavaScript     | ✅          | ❌              |
| MCP server TypeScript     | ✅          | ❌              |
| Python validation scripts | ✅          | ❌              |
| Shell automation scripts  | ✅          | ❌              |
| JSON/JSONC configs        | ✅          | ❌              |
| Frontend JavaScript (DOM) | ❌          | ✅              |
| CSS styling               | ❌          | ✅              |
| Browser verification      | ❌          | ✅              |

---

## 7. EXTERNAL RESOURCES

| Resource          | URL                              | Use For                     |
| ----------------- | -------------------------------- | --------------------------- |
| MDN Web Docs      | developer.mozilla.org            | JavaScript, Node.js APIs    |
| TypeScript Docs   | typescriptlang.org/docs          | TypeScript language, config |
| TSDoc Reference   | tsdoc.org                        | TSDoc comment format        |
| Python Docs       | docs.python.org                  | Python standard library     |
| Bash Manual       | gnu.org/software/bash/manual     | Shell scripting             |
| JSON Schema       | json-schema.org                  | JSON/JSONC validation       |
| ShellCheck        | shellcheck.net                   | Shell script validation     |

---

## 8. RELATED RESOURCES

### Reference Files

| Language   | Files                                                          |
| ---------- | -------------------------------------------------------------- |
| Shared     | `universal_patterns.md`, `code_organization.md`                |
| JavaScript | `style_guide.md`, `quality_standards.md`, `quick_reference.md` |
| TypeScript | `style_guide.md`, `quality_standards.md`, `quick_reference.md` |
| Python     | `style_guide.md`, `quality_standards.md`, `quick_reference.md` |
| Shell      | `style_guide.md`, `quality_standards.md`, `quick_reference.md` |
| Config     | `style_guide.md`, `quick_reference.md`                         |

### Checklists

- `assets/checklists/universal_checklist.md` - Cross-language P0 items
- `assets/checklists/javascript_checklist.md` - JS-specific validation
- `assets/checklists/typescript_checklist.md` - TS-specific validation
- `assets/checklists/python_checklist.md` - Python-specific validation
- `assets/checklists/shell_checklist.md` - Shell-specific validation
- `assets/checklists/config_checklist.md` - JSON/JSONC validation

### Related Skills

| Skill                       | Use For                                    |
| --------------------------- | ------------------------------------------ |
| **workflows-code**          | Web/frontend development, browser testing  |
| **workflows-documentation** | Markdown documentation, skill creation     |
| **system-spec-kit**         | Spec folders, memory, context preservation |
| **workflows-git**           | Git workflows, commits, PR creation        |

---

## 9. WHERE AM I? (Language Detection)

| Language   | You're here if...                                   | Load these resources          |
| ---------- | --------------------------------------------------- | ----------------------------- |
| JavaScript | File is `.js/.mjs/.cjs`, or MCP/Node code           | `javascript/*` + quality      |
| TypeScript | File is `.ts/.tsx/.mts/.d.ts`, or interface/type/tsc | `typescript/*` + quality      |
| Python     | File is `.py`, or pytest/argparse keywords           | `python/*` + quality          |
| Shell      | File is `.sh/.bash`, or shebang keywords             | `shell/*` + quality           |
| Config     | File is `.json/.jsonc`, or schema keywords           | `config/*`                    |
| Unknown    | No extension, no keywords match                      | Ask user, use shared patterns |

---

## 10. QUICK REFERENCE

### File Header Templates

**JavaScript**
```javascript
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ [Module Name]                                                             ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
const fs = require('fs');
```

**Python**
```python
#!/usr/bin/env python3
# ╔══════════════════════════════════════════════════════════════════════════╗
# ║ [Script Name]                                                             ║
# ╚══════════════════════════════════════════════════════════════════════════╝
"""Brief description."""

# ─────────────────────────────────────────────────────────────────────────────
# 1. IMPORTS
# ─────────────────────────────────────────────────────────────────────────────
import sys
```

**Shell**
```bash
#!/usr/bin/env bash
# ╔══════════════════════════════════════════════════════════════════════════╗
# ║ [Script Name]                                                             ║
# ╚══════════════════════════════════════════════════════════════════════════╝
# Brief description.

set -euo pipefail

# ─────────────────────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ─────────────────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
```

**TypeScript**
```typescript
// ---------------------------------------------------------------
// MODULE: [Module Name]
// ---------------------------------------------------------------

// ---------------------------------------------------------------------------
// 1. IMPORTS
// ---------------------------------------------------------------------------

import path from 'path';
import type { SearchOptions } from '../types';
```

**JSONC**
```jsonc
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ [Config Name]                                                             ║
// ╚══════════════════════════════════════════════════════════════════════════╝
{
  "$schema": "https://...",
  // Section comment
  "key": "value"
}
```

### Naming Matrix

| Element    | JavaScript    | TypeScript    | Python        | Shell         | Config      |
| ---------- | ------------- | ------------- | ------------- | ------------- | ----------- |
| Functions  | `camelCase`   | `camelCase`   | `snake_case`  | `snake_case`  | N/A         |
| Constants  | `UPPER_SNAKE` | `UPPER_SNAKE` | `UPPER_SNAKE` | `UPPER_SNAKE` | N/A         |
| Classes    | `PascalCase`  | `PascalCase`  | `PascalCase`  | N/A           | N/A         |
| Interfaces | N/A           | `PascalCase`  | N/A           | N/A           | N/A         |
| Types      | N/A           | `PascalCase`  | N/A           | N/A           | N/A         |
| Enums      | N/A           | `PascalCase`  | N/A           | N/A           | N/A         |
| Generics   | N/A           | `T`-prefix    | N/A           | N/A           | N/A         |
| Variables  | `camelCase`   | `camelCase`   | `snake_case`  | `lower_snake` | `camelCase` |
| Params     | `camelCase`   | `camelCase`   | `snake_case`  | `snake_case`  | N/A         |
| Booleans   | `is`/`has`    | `is`/`has`    | `is_`/`has_`  | `is_`/`has_`  | N/A         |
| Private    | `_prefix`     | `_prefix`     | `_prefix`     | `_prefix`     | N/A         |

### Error Handling Patterns

**JavaScript**
```javascript
function processData(data) {
  if (!data) throw new Error('Data required');
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('[Module] Failed:', error.message);
    return null;
  }
}
```

**Python**
```python
def validate_input(data: str) -> Tuple[bool, str]:
    if not data:
        return False, "Data required"
    try:
        return True, json.loads(data)
    except json.JSONDecodeError as e:
        return False, f"Parse error: {e}"
```

**Shell**
```bash
validate_file() {
    local file="$1"
    if [[ ! -f "$file" ]]; then
        log_error "Not found: $file"
        return 1
    fi
    return 0
}
```

### Comment Patterns

```javascript
// GOOD - WHY comments
// Guard: Skip if initialized to prevent double-binding
// Sort by recency so newest memories surface first
// REQ-033: Transaction manager for pending file recovery

// BAD - WHAT comments (avoid)
// Set value to 42
// Loop through items
```