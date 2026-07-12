---
title: tsconfig Baseline & Module Organization
description: Type system patterns, error handling, documentation, async patterns, and tsconfig baseline for TypeScript files in the OpenCode development environment. — tsconfig Baseline & Module Organization.
trigger_phrases:
  - "typescript tsconfig baseline"
  - "typescript module organization"
  - "package aware typescript build"
  - "typescript workspace configuration"
importance_tier: normal
contextType: implementation
version: 1.0.0.11
---

# tsconfig Baseline & Module Organization

Package-aware tsconfig, build, and module-organization guidance for TypeScript workspaces.

---

## 1. OVERVIEW

### Purpose

Defines TypeScript compiler baselines, workspace build rules, and module organization across package boundaries.

### When to Use

- Configuring TypeScript packages or workspace overrides
- Rebuilding TypeScript distribution output
- Organizing ESM source, exports, and barrel files

---

## 2. TSCONFIG BASELINE

### Current system-spec-kit package baseline

Current system-spec-kit TypeScript is package-aware, not a single global
CommonJS project:

- Root `.opencode/skills/system-spec-kit/tsconfig.json`: shared defaults,
  `module: "commonjs"`, `moduleResolution: "node"`, `strict: true`, project
  references.
- `shared/`: package `"type": "module"` with `module: "nodenext"` and
  `moduleResolution: "nodenext"`.
- `mcp_server/`: package `"type": "module"` with `module: "nodenext"`,
  `moduleResolution: "nodenext"`, `verbatimModuleSyntax: true`, and `allowJs:
  true`.
- `scripts/`: package `"type": "module"` with `module: "es2022"` and
  `moduleResolution: "node"`.

Use NodeNext ESM guidance for `shared/` and `mcp_server/` source. Use the
`scripts/` ESM settings for CLI/memory tooling. Treat the root CommonJS setting
as a fallback default for workspaces that do not override it, not as the current
MCP server package rule.

### Root tsconfig.json for OpenCode Projects

```jsonc
{
  "compilerOptions": {
    // Language and Output
    "target": "es2022",
    "module": "commonjs",
    "moduleResolution": "node",

    // Strict Type Checking (replaces 'use strict')
    "strict": true,

    // Interop
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,

    // Declarations and Source Maps
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,

    // Output
    "outDir": "./dist",
    "rootDir": ".",

    // Project References
    "composite": true
  },
  "references": [
    { "path": "./shared" },
    { "path": "./mcp_server" },
    { "path": "./scripts" }
  ],
  "exclude": ["node_modules"]
}
```

### Build & Rebuild Workflow

After editing TypeScript source files, the compiled `dist/` output must be rebuilt. The MCP server and CLI scripts run from `dist/`, not from `.ts` source directly.

**Build command** (from skill root, e.g. `.opencode/skills/system-spec-kit/`):

```bash
# Standard build (type checks + emit)
npm run build          # runs: tsc --build

# Satellite package build overlay (type checks + emits dist/)
npm run build          # runs: tsc -p tsconfig.build.json

# Satellite package typecheck overlay (no emit)
npm run typecheck      # often adds: --noEmit --composite false

# Smoke test after build
npm run test:cli       # verifies dist/ output runs correctly
```

**Package-aware build rule**: Use the package script for the package you changed. The spec-kit root uses `tsc --build`; satellite packages with their own package boundary, such as `system-skill-advisor/mcp_server`, use `tsc -p tsconfig.build.json`. A satellite typecheck script may add `--noEmit --composite false` over that same overlay.

**Workspace build order**: `tsc --build` respects project references and builds in dependency order:
1. `shared/` (no dependencies)
2. `mcp_server/` (depends on `shared/`)
3. `scripts/` (depends on `shared/`)

**Post-build verification**:

| Check | Command | Pass Criteria |
|-------|---------|---------------|
| CLI smoke test | `npm run test:cli` | Exit 0 + "CLI smoke test passed" |
| MCP server start | `npm run start` | Server starts without crash |
| Embedding test | `npm run test:embeddings` | Embeddings factory loads |

**Common TS4094 error**: If exporting a class with private/protected members from a `.js` file re-exported through `.ts`, TypeScript cannot emit declarations. Fix by adding a type assertion at the re-export site:

```typescript
// TS4094: Property '_method' of exported anonymous class type may not be private
// Fix: widen the type to suppress declaration emit error
const ExportedClass = jsModule.SomeClass as typeof jsModule.SomeClass & { new(...args: unknown[]): unknown };
```

### Workspace override decisions

| Workspace | Package Type | Module Settings | Rationale |
|-----------|--------------|-----------------|-----------|
| `shared/` | `"type": "module"` | `module: "nodenext"`, `moduleResolution: "nodenext"` | Shared runtime library consumed as ESM |
| `mcp_server/` | `"type": "module"` | `module: "nodenext"`, `moduleResolution: "nodenext"`, `verbatimModuleSyntax: true` | Current MCP server package and API exports are ESM |
| `scripts/` | `"type": "module"` | `module: "es2022"`, `moduleResolution: "node"` | CLI/memory scripts run as ESM and compile to `dist/` |

### Root fallback configuration decisions

| Setting                           | Value       | Rationale                                                |
|-----------------------------------|-------------|----------------------------------------------------------|
| `target`                          | `es2022`    | Node.js 18+ supports ES2022 features natively            |
| `module`                          | `commonjs`  | Root fallback only; active workspaces override where needed |
| `strict`                          | `true`      | Full strict mode from the start (Decision D3)            |
| `composite`                       | `true`      | Enables project references for incremental builds        |
| `outDir`                          | `"./dist"`  | Compiled output in dist/ folder, matches all 3 workspace tsconfigs |
| `rootDir`                         | `"."`       | Source root at project level                                  |
| `esModuleInterop`                 | `true`      | Allows interop where CommonJS dependencies are consumed  |
| `declaration`                     | `true`      | Generates `.d.ts` files for cross-project type checking  |
| `skipLibCheck`                    | `true`      | Faster builds; third-party `.d.ts` issues ignored        |

### Workspace tsconfig.json Pattern

Each workspace extends the root and declares its own composite settings:

```jsonc
// shared/tsconfig.json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "rootDir": ".",
    "outDir": "./dist"
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}

// mcp_server/tsconfig.json (references shared/)
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "rootDir": ".",
    "outDir": "./dist"
  },
  "references": [
    { "path": "../shared" }
  ],
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Satellite tsconfig.build.json Pattern

Satellite packages that are not part of the spec-kit root project-reference build use a package-local build overlay:

```jsonc
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "composite": false,
    "declaration": false,
    "declarationMap": false,
    "incremental": false,
    "noEmit": false,
    "rootDir": "..",
    "outDir": "./dist"
  },
  "include": ["lib/**/*.ts", "tools/**/*.ts"],
  "exclude": ["node_modules", "dist", "tests", "**/*.test.ts"]
}
```

For typecheck-only runs, call `tsc --noEmit --composite false -p tsconfig.build.json` through the package script instead of changing the build overlay.

---

## 3. MODULE ORGANIZATION

### ES Module Source, Package-Aware Output

TypeScript source files use ES module syntax (`import`/`export`). The emitted
module format follows the workspace `tsconfig.json` and `package.json` boundary:
NodeNext ESM for `shared/` and `mcp_server/`, ES2022 ESM for `scripts/`, and
CommonJS only where a workspace inherits the root fallback.

```typescript
// SOURCE (.ts) — ES module syntax
import path from 'node:path';

import { MemoryError } from './errors/core.js';
import type { SearchResult } from '../types.js';

export function search(query: string): SearchResult[] {
  // implementation
}

export { MemoryError };
```

```javascript
// EMITTED OUTPUT (.js) — NodeNext ESM package boundary
import path from 'node:path';
import { MemoryError } from './errors/core.js';

export function search(query) {
  // implementation
}

export { MemoryError };
```

### Barrel Files (index.ts)

```typescript
// lib/index.ts — Barrel file
export { ErrorCodes, MemoryError } from './errors/core.js';
export { VectorIndex } from './search/vector-index.js';
export { validateInputLengths } from './utils/validation.js';

// Type-only re-exports
export type { SearchResult, SearchOptions } from '../types.js';
```

---

## 4. RELATED RESOURCES

- [style_guide.md](../style_guide/overview_strict_and_naming.md) - Formatting and naming conventions
- [quick_reference.md](../quick_reference/template_naming_and_types.md) - Copy-paste templates and cheat sheets
