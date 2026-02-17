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

<!-- ANCHOR:when-to-use -->
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

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/shared/universal_patterns.md"

LANGUAGE_KEYWORDS = {
    "JAVASCRIPT": {"node": 1.8, "commonjs": 2.0, "require": 1.5, "module.exports": 2.1},
    "TYPESCRIPT": {"typescript": 2.4, "interface": 2.0, "tsconfig": 2.1, "tsc": 1.8},
    "PYTHON": {"python": 2.3, "pytest": 2.0, "argparse": 1.7, "docstring": 1.6},
    "SHELL": {"bash": 2.2, "shebang": 1.5, "set -e": 1.5, "pipefail": 1.7},
    "CONFIG": {"json": 2.0, "jsonc": 2.1, "schema": 1.8, "manifest": 1.5},
}

FILE_EXTENSIONS = {
    ".js": "JAVASCRIPT", ".mjs": "JAVASCRIPT", ".cjs": "JAVASCRIPT",
    ".ts": "TYPESCRIPT", ".tsx": "TYPESCRIPT", ".mts": "TYPESCRIPT", ".d.ts": "TYPESCRIPT",
    ".py": "PYTHON",
    ".sh": "SHELL", ".bash": "SHELL",
    ".json": "CONFIG", ".jsonc": "CONFIG"
}

def _task_text(task) -> str:
    return " ".join([
        str(getattr(task, "context", "")),
        str(getattr(task, "query", "")),
        str(getattr(task, "path", "")),
        " ".join(getattr(task, "keywords", []) or []),
    ]).lower()

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def detect_languages(task):
    """Weighted language intent scoring with top-2 ambiguity handling."""
    ext = Path(task.path).suffix.lower() if getattr(task, "path", "") else ""
    if ext in FILE_EXTENSIONS:
        return [FILE_EXTENSIONS[ext]], {FILE_EXTENSIONS[ext]: 100.0}

    text = _task_text(task)
    scores = {lang: 0.0 for lang in LANGUAGE_KEYWORDS}
    for language, signals in LANGUAGE_KEYWORDS.items():
        for term, weight in signals.items():
            if term in text:
                scores[language] += weight

    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    best_lang, best_score = ranked[0]
    second_lang, second_score = ranked[1]
    if best_score == 0:
        return ["UNKNOWN"], scores
    if (best_score - second_score) <= 0.8:
        return [best_lang, second_lang], scores
    return [best_lang], scores

def route_opencode_resources(task):
    inventory = discover_markdown_resources()

    selected = ["references/shared/universal_patterns.md", "references/shared/code_organization.md"]

    languages, _scores = detect_languages(task)

    # Ambiguity handling: when top-2 are close, load both quick references.
    for language in languages:
        if language == "JAVASCRIPT":
            selected.extend([
                "references/javascript/style_guide.md",
                "references/javascript/quality_standards.md",
                "references/javascript/quick_reference.md"
            ])
            if task.needs_checklist:
                selected.append("assets/checklists/javascript_checklist.md")

        elif language == "TYPESCRIPT":
            selected.extend([
                "references/typescript/style_guide.md",
                "references/typescript/quality_standards.md",
                "references/typescript/quick_reference.md"
            ])
            if task.needs_checklist:
                selected.append("assets/checklists/typescript_checklist.md")

        elif language == "PYTHON":
            selected.extend([
                "references/python/style_guide.md",
                "references/python/quality_standards.md",
                "references/python/quick_reference.md"
            ])
            if task.needs_checklist:
                selected.append("assets/checklists/python_checklist.md")

        elif language == "SHELL":
            selected.extend([
                "references/shell/style_guide.md",
                "references/shell/quality_standards.md",
                "references/shell/quick_reference.md"
            ])
            if task.needs_checklist:
                selected.append("assets/checklists/shell_checklist.md")

        elif language == "CONFIG":
            selected.extend([
                "references/config/style_guide.md",
                "references/config/quick_reference.md"
            ])
            if task.needs_checklist:
                selected.append("assets/checklists/config_checklist.md")

    if languages == ["UNKNOWN"]:
        return {"languages": languages, "resources": selected, "needs_clarification": True}

    deduped = []
    seen = set()
    for relative_path in selected:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            deduped.append(guarded)
            seen.add(guarded)
    return {"languages": languages, "resources": deduped}
```

### Resource Loading Levels

| Level       | When to Load               | Resources                    |
| ----------- | -------------------------- | ---------------------------- |
| ALWAYS      | Every skill invocation     | Shared patterns + SKILL.md   |
| CONDITIONAL | If language keywords match | Language-specific references |
| ON_DEMAND   | Only on explicit request   | Deep-dive quality standards  |

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/` and then applies intent scoring from `RESOURCE_MAP`. Keep this section domain-focused rather than static file inventories.

- `references/shared/` for universal cross-language patterns, structure conventions, and organization guidance.
- `references/javascript/` for JavaScript style, quality standards, and quick-reference guidance.
- `references/typescript/` for TypeScript style, quality standards, and quick-reference guidance.
- `references/python/` for Python style, quality standards, and quick-reference guidance.
- `references/shell/` for shell scripting style, quality standards, and quick-reference guidance.
- `references/config/` for JSON/JSONC style rules and configuration guidance.
- `assets/checklists/` for language-specific quality gates and completion checklists.

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
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

<!-- /ANCHOR:how-it-works -->
<!-- ANCHOR:rules -->
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

<!-- /ANCHOR:rules -->
<!-- ANCHOR:success-criteria -->
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

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:integration-points -->
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

<!-- /ANCHOR:integration-points -->
<!-- ANCHOR:external-resources -->
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

<!-- /ANCHOR:external-resources -->
<!-- ANCHOR:related-resources -->
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

<!-- /ANCHOR:related-resources -->
<!-- ANCHOR:where-am-i-language-detection -->
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

<!-- /ANCHOR:where-am-i-language-detection -->
<!-- ANCHOR:quick-reference -->
## 10. QUICK REFERENCE

### File Header Templates

**JavaScript**
```javascript
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ [Module Name]                                                            ║
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
# ║ [Script Name]                                                            ║
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
# ║ [Script Name]                                                            ║
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
<!-- /ANCHOR:quick-reference -->
