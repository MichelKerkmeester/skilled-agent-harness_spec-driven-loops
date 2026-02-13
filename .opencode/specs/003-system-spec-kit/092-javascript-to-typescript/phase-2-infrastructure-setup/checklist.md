# Verification Checklist: Phase 1 — Infrastructure Setup

> **Parent Spec:** `specs/003-memory-and-spec-kit/092-javascript-to-typescript/`
> **Workstream:** W-B
> **Milestone:** M2 (Infrastructure Ready)
> **SYNC Gate:** SYNC-002

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval to defer |
| **[P2]** | Optional | Can defer with documented reason |

**Evidence format:** When marking `[x]`, provide evidence on the next line:
```
- [x] CHK-NNN [Px] Description
  - **Evidence**: [compilation output / test result / file existence / screenshot]
```

---

## Phase 1: Infrastructure Verification

### Dependencies

- [ ] CHK-030 [P0] `typescript` package installed and available: `npx tsc --version` succeeds
  - **Evidence**:
  - **Expected version:** 5.x.x or later
  - **Command:** `npx tsc --version`

- [ ] CHK-031 [P0] `@types/node` installed: covers Node 18+ APIs
  - **Evidence**:
  - **Verification:** `node_modules/@types/node/index.d.ts` exists
  - **Coverage:** fs, path, crypto, util, events modules typed

- [ ] CHK-032 [P0] `@types/better-sqlite3` installed: Database class typed
  - **Evidence**:
  - **Verification:** `node_modules/@types/better-sqlite3/index.d.ts` exists
  - **Coverage:** Database, Statement, Transaction interfaces typed

### Workspace Configuration

- [ ] CHK-033 [P0] `shared/package.json` created with correct name `@spec-kit/shared`
  - **Evidence**:
  - **File path:** `system-spec-kit/shared/package.json`
  - **Required fields:** `name`, `version`, `private`, `main`
  - **Verification:** File exists and parses as valid JSON

- [ ] CHK-034 [P0] Root `package.json` workspaces updated: `["shared", "mcp_server", "scripts"]`
  - **Evidence**:
  - **File path:** `system-spec-kit/package.json`
  - **Field:** `"workspaces"` array includes all 3 workspaces
  - **Verification:** `npm install` output shows workspace linking

- [ ] CHK-035 [P0] `npm install` succeeds with updated workspace config
  - **Evidence**:
  - **Command:** `npm install` (run from root)
  - **Verification:** `node_modules/@spec-kit/shared` symlink exists
  - **Success criteria:** Exit code 0, no errors

### TypeScript Configuration

- [ ] CHK-036 [P0] Root `tsconfig.json` has `strict: true`
  - **Evidence**:
  - **File path:** `system-spec-kit/tsconfig.json`
  - **Setting:** `"compilerOptions": { "strict": true }`
  - **Decision reference:** D3 (Strict Mode Enabled)

- [ ] CHK-037 [P0] Root `tsconfig.json` has `module: "commonjs"` (Decision D1)
  - **Evidence**:
  - **Setting:** `"compilerOptions": { "module": "commonjs" }`
  - **Rationale:** Preserves `__dirname` in all 50+ files
  - **Decision reference:** D1 (Module Output Format)

- [ ] CHK-038 [P0] Root `tsconfig.json` has `target: "es2022"` (Node 18+ compatible)
  - **Evidence**:
  - **Setting:** `"compilerOptions": { "target": "es2022" }`
  - **Compatibility:** Node 18+ runtime

- [ ] CHK-039 [P0] Root `tsconfig.json` has project references for all 3 workspaces
  - **Evidence**:
  - **Setting:** `"references": [{ "path": "./shared" }, { "path": "./mcp_server" }, { "path": "./scripts" }]`
  - **Verification:** All 3 paths point to valid tsconfig files

- [ ] CHK-040 [P0] `shared/tsconfig.json` has `composite: true`
  - **Evidence**:
  - **File path:** `system-spec-kit/shared/tsconfig.json`
  - **Setting:** `"compilerOptions": { "composite": true }`
  - **Purpose:** Enable project references

- [ ] CHK-041 [P0] `mcp_server/tsconfig.json` references `../shared`
  - **Evidence**:
  - **File path:** `system-spec-kit/mcp_server/tsconfig.json`
  - **Setting:** `"references": [{ "path": "../shared" }]`
  - **Dependency:** mcp_server depends on shared

- [ ] CHK-042 [P0] `scripts/tsconfig.json` references `../shared` and `../mcp_server`
  - **Evidence**:
  - **File path:** `system-spec-kit/scripts/tsconfig.json`
  - **Setting:** `"references": [{ "path": "../shared" }, { "path": "../mcp_server" }]`
  - **Dependency:** scripts depends on both shared and mcp_server

### Type Declarations

- [ ] CHK-043 [P1] `sqlite-vec.d.ts` declares `load(db: Database): void`
  - **Evidence**:
  - **File path:** `system-spec-kit/sqlite-vec.d.ts`
  - **Content:** Module declaration with `load()` function typed
  - **Verification:** `import * as sqliteVec from 'sqlite-vec'` resolves without errors

- [ ] CHK-044 [P1] Build scripts (`build`, `typecheck`) work: `npm run typecheck` executes
  - **Evidence**:
  - **Scripts added to root package.json:**
    - `"build": "tsc --build"`
    - `"typecheck": "tsc --noEmit"`
    - `"build:watch": "tsc --build --watch"`
  - **Verification:** `npm run typecheck` runs to completion (errors expected from unconverted files)

- [ ] CHK-045 [P2] `.gitignore` updated for `.js.map`, `.d.ts` compiled artifacts
  - **Evidence**:
  - **File path:** `system-spec-kit/.gitignore`
  - **Entries added:**
    ```
    # TypeScript compiled output
    *.js.map
    *.d.ts
    !sqlite-vec.d.ts
    ```
  - **Verification:** `git status` does not show auto-generated artifacts

### Build Verification

- [ ] CHK-046 [P0] `tsc --build` runs without infrastructure errors
  - **Evidence**:
  - **Command:** `npm run build` or `tsc --build`
  - **Expected:** Compilation completes (module resolution errors expected)
  - **NO infrastructure errors:** No tsconfig parse errors, no circular reference errors
  - **Success criteria:** Exit code 0 or 2 (errors from unconverted files OK)

- [ ] CHK-047 [P0] Project reference dependency graph is a DAG
  - **Evidence**:
  - **Graph:** `shared` (leaf) ← `mcp_server` ← `scripts`
  - **Verification:** `tsc --build` resolves all project references without circular errors
  - **Command output:** No "Project references may not form a circular graph" error

- [ ] CHK-048 [P1] Expected module resolution errors appear (unconverted files)
  - **Evidence**:
  - **Error pattern:** `error TS2307: Cannot find module './module.js'`
  - **Expected count:** 200+ errors (all unconverted `.js` files)
  - **Verification:** Errors are TS2307 only, no TS5xxx (config errors)

### Integration Verification

- [ ] CHK-049 [P0] Workspace symlinks operational
  - **Evidence**:
  - **Verification:** `ls -la node_modules/@spec-kit/`
  - **Expected:** `shared` symlink points to `../../shared`
  - **Test:** `node -e "require('@spec-kit/shared')"` (should fail with module error, not "cannot find package")

- [ ] CHK-050 [P1] `tsc --showConfig` displays merged configuration correctly
  - **Evidence**:
  - **Command:** `cd shared && npx tsc --showConfig`
  - **Verification:** Shows extended settings from root tsconfig
  - **Key settings visible:** `strict: true`, `module: commonjs`, `target: es2022`

---

## SYNC-002 Gate Criteria

>>> SYNC-002: Phase 1 complete — TypeScript compiles (with expected errors from unconverted files). <<<

**All P0 items must pass:**
- [ ] CHK-030, CHK-031, CHK-032 (Dependencies)
- [ ] CHK-033, CHK-034, CHK-035 (Workspaces)
- [ ] CHK-036, CHK-037, CHK-038, CHK-039, CHK-040, CHK-041, CHK-042 (TypeScript config)
- [ ] CHK-046, CHK-047 (Build verification)
- [ ] CHK-049 (Workspace integration)

**Minimum P1 items required:**
- [ ] CHK-043 (sqlite-vec types)
- [ ] CHK-044 (Build scripts)

**Gate passage confirmation:**
- [ ] TypeScript infrastructure complete
- [ ] Project references validated (DAG confirmed)
- [ ] Workspace structure established
- [ ] Build scripts operational
- [ ] Custom type declarations created

---

## Verification Summary

| Category | Total | Verified | Priority Breakdown |
|----------|------:|--------:|-------------------|
| Dependencies | 3 | /3 | 3 P0 |
| Workspaces | 3 | /3 | 3 P0 |
| TypeScript Config | 7 | /7 | 7 P0 |
| Type Declarations | 2 | /2 | 0 P0, 1 P1, 1 P2 |
| Build Verification | 3 | /3 | 2 P0, 1 P1 |
| Integration | 2 | /2 | 1 P0, 1 P1 |
| **TOTAL** | **20** | **/20** | **16 P0, 3 P1, 1 P2** |

**Verification Date**: ________________

---

## Cross-References

- **Parent Checklist**: `../checklist.md` (CHK-030 through CHK-045 in master file)
- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Decisions**: `decision-record.md` (D1, D2, D3)
