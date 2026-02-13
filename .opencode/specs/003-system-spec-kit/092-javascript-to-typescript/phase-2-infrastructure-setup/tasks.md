# Tasks: Phase 1 — Infrastructure Setup

> **Parent Spec:** `specs/003-memory-and-spec-kit/092-javascript-to-typescript/`
> **Workstream:** W-B
> **Milestone:** M2 (Infrastructure Ready)
> **SYNC Gate:** SYNC-002

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format:**
```
T### [W-X] [P?] Description (file path) [effort] {deps: T###}
```

---

## Phase 1: Infrastructure Setup

> **Goal:** Set up TypeScript compilation infrastructure without changing any source code.
> **Workstream:** W-B
> **Effort:** ~500 lines across 8 files

### Dependencies

- [ ] T010 [W-B] Install `typescript` as root dev dependency [10m]
  - **Action:** `npm install --save-dev typescript`
  - **Verification:** `npx tsc --version` succeeds
  - **Expected output:** Version 5.x.x or later

- [ ] T011 [W-B] [P] Install `@types/node` as root dev dependency [5m]
  - **Action:** `npm install --save-dev @types/node`
  - **Verification:** `node_modules/@types/node/index.d.ts` exists
  - **Coverage:** Node 18+ APIs (fs, path, crypto, etc.)

- [ ] T012 [W-B] [P] Install `@types/better-sqlite3` as root dev dependency [5m]
  - **Action:** `npm install --save-dev @types/better-sqlite3`
  - **Verification:** `node_modules/@types/better-sqlite3/index.d.ts` exists
  - **Coverage:** Database class, Statement interface

### Workspace Configuration

- [ ] T013 [W-B] Create `shared/package.json` — make shared/ a proper workspace [15m] {deps: T010}
  - **File:** `system-spec-kit/shared/package.json`
  - **Content:**
    ```json
    {
      "name": "@spec-kit/shared",
      "version": "1.7.2",
      "private": true,
      "main": "embeddings.js"
    }
    ```
  - **Verification:** File created at correct location

- [ ] T014 [W-B] Update root `package.json` — add shared to workspaces [10m] {deps: T013}
  - **File:** `system-spec-kit/package.json`
  - **Change:** Update `"workspaces"` array to include `"shared"`
    ```json
    "workspaces": ["shared", "mcp_server", "scripts"]
    ```
  - **Add build scripts:**
    ```json
    "scripts": {
      "build": "tsc --build",
      "typecheck": "tsc --noEmit",
      "build:watch": "tsc --build --watch"
    }
    ```
  - **Verification:** `npm install` succeeds, `shared/` appears in `node_modules/@spec-kit/shared`

### TypeScript Configuration

- [ ] T015 [W-B] Create root `tsconfig.json` [30m] {deps: T010}
  - **File:** `system-spec-kit/tsconfig.json`
  - **Key settings:**
    - `target: "es2022"` — Node 18+ compatibility
    - `module: "commonjs"` — preserves `__dirname` (Decision D1)
    - `strict: true` — all strict checks enabled (Decision D3)
    - `declaration: true`, `declarationMap: true`, `sourceMap: true`
    - `composite: true` — enable project references
    - `outDir: "."`, `rootDir: "."` — in-place compilation (Decision D2)
  - **Project references:** `shared`, `mcp_server`, `scripts`
  - **Verification:** File parses without errors, `tsc --showConfig` displays merged config

- [ ] T016 [W-B] Create `shared/tsconfig.json` [15m] {deps: T015}
  - **File:** `system-spec-kit/shared/tsconfig.json`
  - **Extends:** `../tsconfig.json`
  - **Settings:**
    - `composite: true`
    - `rootDir: ".", outDir: "."`
    - `include: ["**/*.ts"]`
    - `exclude: ["node_modules"]`
  - **References:** None (leaf workspace)
  - **Verification:** `tsc --build shared` runs

- [ ] T017 [W-B] Create `mcp_server/tsconfig.json` [15m] {deps: T015}
  - **File:** `system-spec-kit/mcp_server/tsconfig.json`
  - **Extends:** `../tsconfig.json`
  - **Settings:** `composite: true`, `rootDir: ".", outDir: "."`
  - **References:** `[{ "path": "../shared" }]`
  - **Verification:** `tsc --build mcp_server` runs, project reference resolves

- [ ] T018 [W-B] Create `scripts/tsconfig.json` [15m] {deps: T015}
  - **File:** `system-spec-kit/scripts/tsconfig.json`
  - **Extends:** `../tsconfig.json`
  - **Settings:** `composite: true`, `rootDir: ".", outDir: "."`
  - **References:** `[{ "path": "../shared" }, { "path": "../mcp_server" }]`
  - **Verification:** `tsc --build scripts` runs, both project references resolve

### Type Declarations

- [ ] T019 [W-B] Create `sqlite-vec.d.ts` custom type declarations [1h] {deps: T010}
  - **File:** `system-spec-kit/sqlite-vec.d.ts`
  - **Purpose:** Type the native `sqlite-vec` extension
  - **API surface to cover:**
    ```typescript
    declare module 'sqlite-vec' {
      import type { Database } from 'better-sqlite3';
      export function load(db: Database): void;
    }
    ```
  - **Coverage:** Only the API surface actually used in `vector-index.js`
  - **Verification:** `import * as sqliteVec from 'sqlite-vec'` resolves without errors

### Git Configuration

- [ ] T020 [W-B] Update `.gitignore` for TypeScript compiled artifacts [10m] {deps: T015}
  - **File:** `system-spec-kit/.gitignore`
  - **Add entries:**
    ```
    # TypeScript compiled output (in-place compilation)
    *.js.map
    *.d.ts

    # Preserve custom type declarations
    !sqlite-vec.d.ts
    ```
  - **Verification:** `git status` does not show `.js.map` or auto-generated `.d.ts` files

### Verification

- [ ] T021 [W-B] Verify full infrastructure setup [30m] {deps: T010-T020}
  - **Run:** `npm run typecheck` (equivalent to `tsc --noEmit`)
  - **Expected:** Compilation runs to completion
  - **Expected errors:** Module resolution errors (`.js` files not yet converted to `.ts`)
    ```
    error TS2307: Cannot find module './module.js' or its corresponding type declarations.
    ```
  - **NO infrastructure errors allowed:**
    - No tsconfig parse errors
    - No circular project reference errors
    - No workspace linking errors
  - **Evidence:** Terminal output shows only TS2307 errors, compilation completes

---

## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] `tsc --build` runs without infrastructure errors (module errors expected)
- [ ] All 4 tsconfig files created with correct project references
- [ ] `shared/` is a proper npm workspace
- [ ] `sqlite-vec.d.ts` covers used API surface
- [ ] `.gitignore` updated
- [ ] SYNC-002 gate criteria met

---

## SYNC-002 Gate Criteria

>>> SYNC-002: Phase 1 complete — TypeScript compiles (with expected errors from unconverted files). <<<

**Required for gate passage:**
- [ ] TypeScript infrastructure complete (all tsconfig files created)
- [ ] Project references validated (DAG: `shared` ← `mcp_server` ← `scripts`)
- [ ] Workspace structure established (`shared/` in npm workspaces)
- [ ] Build scripts operational (`npm run build`, `npm run typecheck`)
- [ ] Custom type declarations created (`sqlite-vec.d.ts`)

---

## Cross-References

- **Parent Tasks**: `../tasks.md` (T010–T019 in master file)
- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md` (CHK-030 through CHK-045)
- **Decisions**: `decision-record.md` (D1, D2, D3)
