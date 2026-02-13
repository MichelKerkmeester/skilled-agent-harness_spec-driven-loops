# Plan: Phase 1 — Infrastructure Setup

> **Parent Spec:** `specs/003-memory-and-spec-kit/092-javascript-to-typescript/`
> **Workstream:** W-B
> **Level:** 3
> **Status:** Planning
> **Created:** 2026-02-07

---

## 1. Phase Overview

**Goal:** Set up TypeScript compilation infrastructure without changing any source code.

**Why this phase:** TypeScript must compile before any conversion begins. This establishes the build pipeline, project references, and workspace structure that all subsequent phases depend on.

**Success criteria:** `tsc --build` runs without infrastructure errors (errors from unconverted `.js` files are expected).

---

## 2. Implementation Strategy

### Approach: Infrastructure-First

Install TypeScript tooling and configuration before touching any source code. This creates a "safe to compile" environment where each subsequent conversion can be verified immediately.

**Key architectural decisions:**
- **D1:** CommonJS output — `"module": "commonjs"` preserves `__dirname` in all 50+ files
- **D2:** In-place compilation — `outDir: "."` keeps all path references valid
- **D3:** Strict mode enabled — `"strict": true"` from the start

---

## 3. Step-by-Step Implementation

### Step 1: Install Dev Dependencies

**Goal:** Add TypeScript compiler and type declarations to the project.

**Actions:**
1. Install `typescript` as root dev dependency
2. Install `@types/node` for Node.js 18+ API types
3. Install `@types/better-sqlite3` for Database class typing

**Verification:** `npx tsc --version` succeeds

**Estimated time:** 15 minutes

---

### Step 2: Create Workspace Configuration

**Goal:** Make `shared/` a proper npm workspace alongside `mcp_server/` and `scripts/`.

**Actions:**

**2a. Create `shared/package.json`:**
```json
{
  "name": "@spec-kit/shared",
  "version": "1.7.2",
  "private": true,
  "main": "embeddings.js"
}
```

**2b. Update root `package.json` workspaces array:**
```json
{
  "workspaces": ["shared", "mcp_server", "scripts"]
}
```

**2c. Add build scripts to root `package.json`:**
```json
{
  "scripts": {
    "build": "tsc --build",
    "build:watch": "tsc --build --watch",
    "typecheck": "tsc --noEmit"
  }
}
```

**Verification:** `npm install` succeeds with updated workspace config

**Estimated time:** 20 minutes

---

### Step 3: Create TypeScript Configuration Files

**Goal:** Set up project references with strict mode enabled.

**tsconfig file structure:**
```
system-spec-kit/
├── tsconfig.json           (root, references all 3 workspaces)
├── shared/
│   └── tsconfig.json       (composite: true)
├── mcp_server/
│   └── tsconfig.json       (composite: true, references: [../shared])
└── scripts/
    └── tsconfig.json       (composite: true, references: [../shared, ../mcp_server])
```

#### 3a. Root `tsconfig.json`

**Purpose:** Top-level configuration with project references.

**Key settings:**
- `target: "es2022"` — Node 18+ compatibility
- `module: "commonjs"` — preserves `__dirname` (Decision D1)
- `moduleResolution: "node"` — standard Node.js module resolution
- `strict: true` — all strict checks enabled (Decision D3)
- `declaration: true` — generate `.d.ts` files
- `declarationMap: true` — source maps for type definitions
- `sourceMap: true` — debugging support
- `composite: true` — enable project references
- `outDir: "."` — in-place compilation (Decision D2)
- `rootDir: "."` — source root is workspace root

**Project references:**
```json
{
  "references": [
    { "path": "./shared" },
    { "path": "./mcp_server" },
    { "path": "./scripts" }
  ]
}
```

**Full configuration:**
```jsonc
{
  "compilerOptions": {
    "target": "es2022",
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": ".",
    "rootDir": ".",
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

#### 3b. `shared/tsconfig.json`

**Purpose:** Shared utilities workspace configuration.

**Key differences from root:**
- Extends root config
- No additional references (shared is the leaf workspace)

```jsonc
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "rootDir": ".",
    "outDir": "."
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### 3c. `mcp_server/tsconfig.json`

**Purpose:** MCP server workspace configuration.

**Key differences:**
- References `../shared` (dependency on shared workspace)

```jsonc
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "rootDir": ".",
    "outDir": "."
  },
  "references": [
    { "path": "../shared" }
  ],
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### 3d. `scripts/tsconfig.json`

**Purpose:** CLI scripts workspace configuration.

**Key differences:**
- References both `../shared` and `../mcp_server`

```jsonc
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "rootDir": ".",
    "outDir": "."
  },
  "references": [
    { "path": "../shared" },
    { "path": "../mcp_server" }
  ],
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Verification:** All 4 tsconfig files created with correct project reference DAG

**Estimated time:** 45 minutes

---

### Step 4: Custom Type Declarations for `sqlite-vec`

**Goal:** Provide type definitions for the native `sqlite-vec` extension.

**Context:** `sqlite-vec` is a native C module with no official type declarations. We only need to type the API surface actually used in `vector-index.js`.

**File location:** `system-spec-kit/sqlite-vec.d.ts` (root level)

**API surface to cover:**
1. `load(db: Database): void` — load extension into database
2. Vector search functions (if called directly)

**Minimal type declaration:**
```typescript
// sqlite-vec.d.ts — Type declarations for sqlite-vec native extension
declare module 'sqlite-vec' {
  import type { Database } from 'better-sqlite3';

  /**
   * Load the sqlite-vec extension into a Database instance
   * @param db - better-sqlite3 Database instance
   */
  export function load(db: Database): void;
}
```

**Note:** If vector search functions are called directly (not via SQL), add those signatures. Current usage primarily calls via SQL, so `load()` is sufficient.

**Verification:** `import * as sqliteVec from 'sqlite-vec'` resolves without errors in TypeScript

**Estimated time:** 1 hour

---

### Step 5: Update `.gitignore`

**Goal:** Ignore compiled artifacts but preserve custom type declarations.

**Entries to add:**
```
# TypeScript compiled output (in-place compilation)
*.js.map
*.d.ts

# Preserve custom type declarations
!sqlite-vec.d.ts
```

**Rationale:** Source and compiled output coexist in the same directory. `.js.map` and auto-generated `.d.ts` files should not be committed. The custom `sqlite-vec.d.ts` must be committed.

**Verification:** `git status` does not show `.js.map` or auto-generated `.d.ts` files

**Estimated time:** 10 minutes

---

### Step 6: Dependency Installation

**Goal:** Install all new dependencies and verify workspace linking.

**Actions:**
1. Run `npm install` from root
2. Verify `shared/` appears in `node_modules/` as `@spec-kit/shared` symlink
3. Verify TypeScript is available: `npx tsc --version`

**Verification:** `npm list typescript @types/node @types/better-sqlite3` shows all installed

**Estimated time:** 10 minutes

---

### Step 7: Build System Verification

**Goal:** Verify TypeScript can compile (errors from unconverted files are expected).

**Actions:**
1. Run `npm run typecheck` (equivalent to `tsc --noEmit`)
2. Verify errors are all "Cannot find module '.js'" (expected — files not yet converted)
3. Verify NO infrastructure errors (tsconfig parse errors, project reference cycles, etc.)

**Expected output pattern:**
```
error TS2307: Cannot find module './module.js' or its corresponding type declarations.
```

**Success criteria:** Compilation runs to completion, only module resolution errors

**Estimated time:** 15 minutes

---

## 4. Project Reference Dependency Graph

After Step 3, the TypeScript project reference graph will be:

```
shared (leaf workspace)
  ↑
  |
mcp_server (depends on shared)
  ↑
  |
scripts (depends on shared + mcp_server)
```

**Key property:** This is a Directed Acyclic Graph (DAG) — no circular dependencies between workspaces.

**Why this matters:** TypeScript's `--build` mode uses the DAG to compile workspaces in the correct order. Incremental builds only recompile changed workspaces and their dependents.

---

## 5. Build Pipeline Overview

After Phase 1 completes, the build pipeline will be:

```
Source Code (.ts files)
    ↓
tsc --build (respects project references)
    ↓
Compiled Output (.js + .d.ts + .js.map in same directory)
    ↓
node <entry-point>.js (runs compiled output)
```

**Key characteristics:**
- **Incremental:** `tsc --build` only recompiles changed files
- **In-place:** Compiled `.js` lives next to source `.ts`
- **CommonJS:** Runtime uses `require()` and `__dirname` (unchanged behavior)
- **Type-safe:** `.d.ts` files enable cross-workspace type checking

---

## 6. Risk Mitigations

| Risk | Mitigation |
|------|-----------|
| TypeScript version incompatibility | Pin exact version in `package.json`: `"typescript": "5.x.x"` |
| Workspace symlink issues on Windows | Document `npm install` as root requirement |
| `sqlite-vec.d.ts` insufficient | Add missing signatures incrementally as compiler identifies usage |
| Build script conflicts with existing scripts | Use `build:` prefix to avoid collisions |

---

## 7. Success Metrics

| Metric | Target |
|--------|--------|
| `tsc --build` exits | 0 (completes, even with module errors) |
| Infrastructure errors | 0 (tsconfig valid, project references resolve) |
| Workspaces linked | 3 (`shared`, `mcp_server`, `scripts` all in `node_modules/`) |
| Custom type declarations | 1 (`sqlite-vec.d.ts` created and importable) |

---

## 8. Next Phase Dependencies

**Phase 2 (Break Circular Dependencies) requires:**
- [ ] All tsconfig files created
- [ ] Project references validated
- [ ] Workspace structure established
- [ ] Build scripts operational

**SYNC-002 gate criteria:**
- TypeScript infrastructure complete
- `tsc --build` runs (with expected errors from unconverted files)
- All 4 tsconfig files have correct project references
- `shared/` is a proper npm workspace

---

## Cross-References

- **Parent Plan**: `../plan.md`
- **Tasks**: See `tasks.md` (T010–T019)
- **Checklist**: See `checklist.md` (CHK-030 through CHK-045)
- **Decisions**: See `decision-record.md` (D1, D2, D3)
