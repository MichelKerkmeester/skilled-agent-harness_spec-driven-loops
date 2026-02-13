# Phase 1: Infrastructure Setup

> **Parent Spec:** `092-javascript-to-typescript/`
> **Workstream:** W-B
> **Tasks:** T010–T019
> **Milestone:** M2 (Infrastructure Ready)
> **SYNC Gate:** SYNC-002
> **Depends On:** Phase 0 (SYNC-001)
> **Session:** 1

---

## Goal

Set up TypeScript compilation infrastructure without changing any source code. After this phase, `tsc` can run (with expected errors from unconverted `.js` files).

## Scope

**Target:** `system-spec-kit/` root + workspace `package.json` files

### Tasks

1. **Install dev dependencies** (root `package.json`): `typescript`, `@types/node`, `@types/better-sqlite3`
2. **Create `shared/package.json`** — make it a proper npm workspace (`@spec-kit/shared`)
3. **Update root `package.json`** — add `shared` to workspaces array
4. **Create 4 `tsconfig.json` files** — root + shared + mcp_server + scripts (project references)
5. **Create `sqlite-vec.d.ts`** — custom type declarations for the native module
6. **Add build scripts** — `build`, `build:watch`, `typecheck` in root `package.json`
7. **Add `.gitignore` entries** — `*.js.map`, `*.d.ts` (exclude `sqlite-vec.d.ts`)
8. **Verify** — `npm run typecheck` completes (errors expected from unconverted files)

### Key Decisions

- **D1:** CommonJS output (`"module": "commonjs"`) — preserves `__dirname`
- **D2:** In-place compilation (`outDir: "."`) — no `dist/` folder
- **D3:** `strict: true` from start

## Exit Criteria

- [ ] `tsc --build` runs without infrastructure errors
- [ ] All 4 tsconfig files created with correct project references
- [ ] `shared/` is a proper npm workspace
- [ ] `sqlite-vec.d.ts` covers used API surface
- [ ] SYNC-002 gate passed
