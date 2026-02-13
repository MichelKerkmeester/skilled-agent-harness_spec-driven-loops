# Decision Record: Phase 1 — Infrastructure Setup

> **Parent Spec:** `specs/003-memory-and-spec-kit/092-javascript-to-typescript/`
> **Phase:** Phase 1 (Infrastructure Setup)
> **Created:** 2026-02-07

---

## Overview

This decision record documents the three foundational architectural decisions that govern Phase 1 infrastructure setup. These decisions were made at the parent spec level and are referenced here for Phase 1 implementation context.

---

## D1: Module Output Format — CommonJS

**Status:** Decided
**Date:** 2026-02-07
**Scope:** Phase 1 (tsconfig.json configuration)

### Context

The codebase uses `__dirname` in 50+ files for path resolution. ESM requires `import.meta.url` + `fileURLToPath()` instead.

**Files affected:**
- All `path.join(__dirname, ...)` patterns across the codebase
- `opencode.json` MCP server startup command
- All `require()` calls in current code

### Decision

Use CommonJS output: `"module": "commonjs"` in all tsconfig.json files.

### Rationale

**Benefits:**
- `__dirname` works natively with CommonJS — zero changes to path logic
- `opencode.json` starts server via `node context-server.js` — works unchanged
- All `require()` calls in compiled output are functionally identical to current code
- MCP SDK supports both ESM and CJS
- Preserves all existing path resolution patterns

**Implementation in Phase 1:**
- Root `tsconfig.json`: `"module": "commonjs"`
- All workspace tsconfig files inherit this setting
- No source code changes required

### Alternatives Considered

**ESM output (`"module": "esnext"` or `"module": "node16"`):**
- **Rejected because:** Would require rewriting `__dirname` → `import.meta.url` in 50+ files
- **Pattern change:** `path.join(__dirname, '..')` → `path.dirname(fileURLToPath(import.meta.url))`
- **Risk:** High — every path reference must be manually verified
- **Benefit:** None for this codebase (no ESM-specific features needed)

### Trade-offs Accepted

- TypeScript source uses ES module syntax (`import`/`export`) but compiles to CommonJS
- Future migration to ESM would require changing tsconfig and adding file extensions to imports

### Verification

- [ ] All tsconfig files have `"module": "commonjs"`
- [ ] `__dirname` and `__filename` are available in compiled output
- [ ] `require()` calls in compiled `.js` match original patterns

---

## D2: Compilation Strategy — In-Place

**Status:** Decided
**Date:** 2026-02-07
**Scope:** Phase 1 (tsconfig.json outDir configuration)

### Context

Should compiled `.js` files live next to `.ts` source (in-place), or in a separate `dist/` directory?

**Paths affected:**
- All `require('./module')` relative imports (100+ references)
- `opencode.json` server startup path
- `package.json` `main` field references
- Documentation path examples

### Decision

In-place compilation: `"outDir": "."` in all tsconfig files.

Compiled output structure:
```
system-spec-kit/
├── module.ts       (source)
├── module.js       (compiled output, same directory)
├── module.d.ts     (type declarations)
└── module.js.map   (source map)
```

### Rationale

**Benefits:**
- All `require('./module')` paths stay valid — no path rewriting needed
- `opencode.json` startup command unchanged: `node mcp_server/context-server.js`
- `config.js` path constants (`path.join(__dirname, '...')`) all work
- Simpler mental model — compiled file is where you expect it
- No "dist/ vs src/" confusion in debugging

**Implementation in Phase 1:**
- Root `tsconfig.json`: `"outDir": ".", "rootDir": "."`
- All workspace tsconfig files inherit this setting
- `.gitignore` updated to ignore compiled artifacts (`.js.map`, `.d.ts`)

### Alternatives Considered

**Separate `dist/` folder (`"outDir": "dist"`):**
- **Rejected because:**
  - Would require updating `opencode.json` server path
  - All `path.join(__dirname, ...)` references would break (100+ occurrences)
  - `package.json` `main` fields would need updating
  - Documentation would need rewriting (path examples throughout READMEs)
- **Benefit:** Cleaner separation of source and output
- **Cost:** ~100 path references to change, higher migration risk

### Trade-offs Accepted

- Source (`.ts`) and compiled output (`.js`) coexist in same directory — slightly messier
- `.gitignore` must carefully exclude compiled artifacts but preserve custom `.d.ts` files
- Developers must distinguish `.ts` (editable) from `.js` (generated) in same directory

### Verification

- [ ] All tsconfig files have `"outDir": "."`
- [ ] Compiled `.js` files appear next to `.ts` source files
- [ ] `require('./module')` resolves to `.js` file in same directory
- [ ] `.gitignore` excludes `.js.map` and auto-generated `.d.ts` but preserves `sqlite-vec.d.ts`

---

## D3: Strict Mode — Enabled from Start

**Status:** Decided
**Date:** 2026-02-07
**Scope:** Phase 1 (tsconfig.json strict configuration)

### Context

TypeScript's `"strict": true` flag enables 7 compiler checks:
1. `strictNullChecks` — catch null/undefined errors
2. `strictFunctionTypes` — contravariance for function parameters
3. `strictBindCallApply` — type-check bind/call/apply
4. `strictPropertyInitialization` — require class property initialization
5. `noImplicitAny` — disallow implicit `any` type
6. `noImplicitThis` — disallow implicit `this` type
7. `alwaysStrict` — emit "use strict" in output

Should we enable strict mode immediately, or incrementally?

### Decision

Enable `"strict": true` from Phase 1.

### Rationale

**Benefits:**
- Catches `null`/`undefined` errors at compile time (most common runtime bugs)
- Prevents accumulating type-unsafe code that's harder to fix later
- The codebase already uses disciplined patterns:
  - Guard clauses for null checks
  - Explicit type annotations in many places
  - JSDoc with `@param {Type}` descriptions
- Easier to convert code correctly once than to revisit and fix later

**Implementation in Phase 1:**
- Root `tsconfig.json`: `"strict": true`
- All workspace tsconfig files inherit this setting
- Every file conversion in Phases 3–6 must satisfy strict mode

### Alternatives Considered

**Incremental strictness (start with `"strict": false`, enable flags gradually):**
- **Rejected because:**
  - Historical evidence: projects rarely reach full strict if they don't start there
  - Incremental approach creates technical debt (type-unsafe code accumulates)
  - Requires multiple passes over the same code (fix compilation, then fix strictness)
  - Higher total effort than doing it correctly once
- **Benefit:** Lower initial conversion effort per file
- **Cost:** Higher total migration cost, never reaching full type safety

### Trade-offs Accepted

- File conversion takes longer (must add explicit null checks, type annotations)
- Some JavaScript patterns become verbose in strict TypeScript
- Phases 3–6 will surface null safety issues that were silent in JavaScript

### Verification

- [ ] Root `tsconfig.json` has `"strict": true`
- [ ] All workspace tsconfig files inherit strict setting
- [ ] `tsc --showConfig` shows all 7 strict flags enabled
- [ ] No `@ts-ignore` or `@ts-expect-error` comments used to bypass strict checks (exceptions require justification)

---

## Implementation Impact on Phase 1

### tsconfig.json Template

All three decisions combine in the root `tsconfig.json`:

```jsonc
{
  "compilerOptions": {
    // D1: CommonJS output
    "module": "commonjs",
    "target": "es2022",

    // D2: In-place compilation
    "outDir": ".",
    "rootDir": ".",

    // D3: Strict mode enabled
    "strict": true,

    // Supporting settings
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
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

### Workspace Configuration Impact

Each workspace inherits these three decisions:

**shared/tsconfig.json:**
```jsonc
{
  "extends": "../tsconfig.json",  // Inherits D1, D2, D3
  "compilerOptions": {
    "composite": true,
    "rootDir": ".",
    "outDir": "."
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}
```

**mcp_server/tsconfig.json and scripts/tsconfig.json:** Same pattern, with project references.

---

## Downstream Phase Dependencies

### Phase 2 (Break Circular Dependencies)

- Relies on D1 (CommonJS) to preserve re-export stub behavior
- Relies on D2 (in-place) so moved files compile to expected locations

### Phase 3+ (File Conversion)

- Every converted file must satisfy D3 (strict mode)
- All `require()` → `import` conversions output CommonJS (D1)
- Compiled output stays next to source (D2)

---

## Reversal Conditions

**When would these decisions be reconsidered?**

- **D1 reversal:** If MCP SDK requires ESM (currently supports both)
- **D2 reversal:** If deployment requires separate source/output trees (currently: git repo is deployed)
- **D3 reversal:** If strict mode blocks migration progress (not anticipated — modern best practice)

**Likelihood:** Low. These are foundational decisions stable for the project lifecycle.

---

## Cross-References

- **Parent Decision Record:** `../decision-record.md` (full context for D1, D2, D3)
- **Specification:** `spec.md`
- **Plan:** `plan.md`
- **Tasks:** `tasks.md`
- **Checklist:** `checklist.md`
