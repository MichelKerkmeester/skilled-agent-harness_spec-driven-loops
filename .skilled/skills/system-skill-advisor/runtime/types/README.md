---
title: "Skill Advisor Runtime Types: Ambient Module Declarations"
description: "Ambient TypeScript declarations for the third-party module the advisor runtime consumes without shipping its own types."
trigger_phrases:
  - "skill advisor runtime types"
  - "better-sqlite3 ambient types"
---

# Skill Advisor Runtime Types: Ambient Module Declarations

---

## 1. OVERVIEW

`types/` holds ambient `.d.ts` declarations for third-party modules the advisor runtime consumes but does not install types for. The folder is flat. One file, `better-sqlite3.d.ts`, declares the subset of the `better-sqlite3` API this package actually calls.

Current state:

- `better-sqlite3.d.ts` declares module `better-sqlite3` with the `Database` namespace (`RunResult`, `Options`, `PragmaOptions`, `ColumnDefinition`, `Statement`, `Transaction`, `Database`, `DatabaseConstructor`), the `SqliteError` class and the exported `Database` constructor.
- The `better-sqlite3` entry in the `paths` map of `../tsconfig.json` points at this file, so an import such as `import Database from 'better-sqlite3'` type-checks without the upstream types package.
- The declaration is ambient and emits nothing. Runtime resolution still comes from the installed package.

---

## 2. FILE INVENTORY

| File | Responsibility |
|---|---|
| `better-sqlite3.d.ts` | Ambient module declaration for `better-sqlite3`, reached by imports in the SQLite graph layer, for example `../lib/skill-graph/skill-graph-db.ts`. |

---

## 3. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | The file declares a module and imports nothing. |
| Exports | Ambient types only, used through ordinary `better-sqlite3` imports. |
| Ownership | Types for third-party packages the runtime calls belong here. Types for the runtime's own modules stay beside those modules. |

Type resolution:

```text
better-sqlite3 import in lib/skill-graph/skill-graph-db.ts
                  │
                  ▼
paths["better-sqlite3"] in ../tsconfig.json
                  │
                  ▼
types/better-sqlite3.d.ts (ambient declaration)
                  │
                  ▼
tsc resolves the import without an upstream @types package
```

---

## 4. VALIDATION

Run from the repository root.

```bash
python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/system-skill-advisor/runtime/types/README.md
```

Expected result: exit code `0`.

---

## 5. RELATED

- [`../README.md`](../README.md)
- [`../lib/skill-graph/README.md`](../lib/skill-graph/README.md)
