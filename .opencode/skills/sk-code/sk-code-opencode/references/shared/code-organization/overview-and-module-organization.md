---
title: Code Organization - File Structure and Module Principles
description: File structure principles, module organization concepts, and import ordering standards for OpenCode system code.
trigger_phrases:
  - "opencode code organization"
  - "file structure principles"
  - "module organization standards"
  - "import ordering rules"
importance_tier: normal
contextType: implementation
version: 1.0.0.17
---

# Code Organization - File Structure and Module Principles

File structure and module organization principles for OpenCode system code.

---

## 1. OVERVIEW

### Purpose

This reference defines how to organize files, structure modules, and order imports across all languages in the OpenCode codebase. Consistent organization enables faster navigation and reduces cognitive load.

### Core Principle

> **Predictable structure enables fast navigation.** Every file type has a known structure. Developers should find what they expect where they expect it.

### When to Use

- Creating new files or modules
- Reorganizing existing code
- Deciding import order
- Reviewing code structure

### Key Sources (Evidence)

| Pattern | Source File | Line Reference |
|---------|-------------|----------------|
| TypeScript module structure | `.opencode/skills/system-spec-kit/mcp-server/context-server.ts` | Lines 1-70 |
| TypeScript exports | `.opencode/skills/system-spec-kit/scripts/core/config.ts` | Export block near file end |
| Python imports | `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py` | Import block near file top |
| Shell structure | `lib/common.sh` | Lines 1-40 |

---

## 2. FILE STRUCTURE PRINCIPLES

### Header-First Convention

Every file starts with a header block identifying its purpose:

**TypeScript / current ESM packages** (3-line module header):
```javascript
// ───────────────────────────────────────────────────────────────
// MODULE: Context Server
// ───────────────────────────────────────────────────────────────
```

**JavaScript `.js/.cjs` utilities** (boxed header plus strict mode):
```javascript
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Example Utility                                              ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';
```

**Python** (shebang + 3-line box):
```python
#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# ADVISOR: SKILL ADVISOR
# ───────────────────────────────────────────────────────────────
```

**Shell** (shebang + header):
```bash
#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# LIBRARY: COMMON UTILITIES
# ───────────────────────────────────────────────────────────────
```

### Module Type Labels

Use consistent labels in headers:

| Label | Use For |
|-------|---------|
| `SERVER` | MCP servers, HTTP servers |
| `HANDLER` | Request/event handlers |
| `LIBRARY`/`LIB` | Reusable utility modules |
| `SCRIPT` | Standalone executable scripts |
| `ADVISOR` | AI advisory/analysis tools |
| `VALIDATOR` | Validation/checking tools |
| `CONFIG` | Configuration files |
| `TEST` | Test files |

### Standard File Sections

Every significant file should have numbered sections:

- Keep section titles uppercase and numbered (non-regression): `## 1. IMPORTS`, `## 2. CONSTANTS`.
- Do not count file headers, shebangs, module banners, docstrings, or strict-mode directives as numbered sections.
- Start at `1` for the first numbered code section that actually appears, then increment sequentially from the sections present in that file.
- Do not convert these headers to sentence case or unnumbered variants.

```javascript
/* ─────────────────────────────────────────────────────────────
   1. MODULE IMPORTS
──────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   2. CONSTANTS
──────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   3. HELPER FUNCTIONS
──────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   4. MAIN LOGIC
──────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   5. EXPORTS
──────────────────────────────────────────────────────────────── */
```

---

## 3. MODULE ORGANIZATION

### Single Responsibility

Each module should have ONE primary purpose:

**Good** - Single responsibility:
```
mcp-server/
├── handlers/
│   ├── memory-search.ts    # Handles memory search
│   ├── memory-save.ts      # Handles memory save
│   └── memory-crud.ts      # Handles memory CRUD
├── lib/
│   ├── errors.ts           # Error definitions
│   ├── providers/
│   │   └── embeddings.ts   # Embedding generation
│   └── validation/
│       └── preflight.ts    # Input validation
```

**Bad** - Mixed responsibilities:
```
mcp-server/
├── handlers.js             # All handlers (too large)
├── utils.js                # "Utils" grab bag (unclear)
└── helpers.js              # More "helpers" (unclear)
```

### KISS/DRY/SOLID Structural Checks

Apply these checks during module organization:

1. **KISS**: keep modules small and behavior-focused; avoid speculative abstraction layers.
2. **DRY**: shared rules/constants live in one file and are imported by dependents.
3. **SRP**: each module has one change reason.
4. **OCP**: add variants through extension points before editing stable cores.
5. **LSP/ISP/DIP**: avoid subtype surprises, oversized interfaces, and direct policy-to-infra coupling.

### Directory Structure Pattern

```
module/
├── index.ts                # Entry point, exports public API
├── core/                   # Core logic (private)
│   ├── config.ts
│   └── db-state.ts
├── handlers/               # Request handlers
│   └── *.ts
├── lib/                    # Utilities and helpers
│   ├── errors/
│   │   └── core.ts
│   ├── storage/
│   │   └── *.ts
│   └── utils/
│       └── *.ts
└── tests/                  # Test files
    └── *.test.ts
```

### Barrel Files (index.ts)

Use barrel files to expose public API:

```typescript
// lib/errors/index.ts - Barrel file
export { MemoryError, ErrorCodes, buildErrorResponse } from './core';
export { getRecoveryHint, ERROR_CODES } from './recovery-hints';
export type { ErrorResponse, ErrorResponseData } from './core';
```

Benefits:
- Single import point: `import { MemoryError } from './lib/errors';`
- Clear public API surface
- Implementation details hidden

---

