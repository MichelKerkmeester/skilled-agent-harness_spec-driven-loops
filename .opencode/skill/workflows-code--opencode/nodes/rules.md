---
description: "ALWAYS/NEVER/ESCALATE rules for OpenCode system code across all supported languages"
---
# Rules

Mandatory behavioral rules governing code standards enforcement. These apply across JavaScript, TypeScript, Python, Shell, and JSON/JSONC.

## ALWAYS

1. **Follow file header format for the language**
   - JavaScript: Box-drawing `// --- MODULE_TYPE: NAME ---` + `'use strict'`
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

## NEVER

1. **Leave commented-out code** - Delete it (git preserves history)
2. **Skip the file header** - Every file needs identification (P0)
3. **Use generic variable names** - No `data`, `temp`, `x`, `foo`, `bar`
4. **Hardcode secrets** - Use `process.env.VAR`, `os.environ['VAR']`
5. **Mix naming conventions** - Be consistent within language

## ESCALATE IF

1. **Pattern conflicts with existing code** - Prefer consistency
2. **Language detection is ambiguous** - Ask user to clarify
3. **Evidence files not found** - Use general pattern, note the gap
4. **Security-sensitive code** - Require explicit review

## Cross References
- [[quick-reference]] - File header templates and naming matrix
- [[success-criteria]] - Quality gates tied to these rules