# Phase 12: Post-Migration Bug Audit

> **Parent Spec:** `092-javascript-to-typescript/`
> **Workstream:** W-L
> **Tasks:** T400–T465
> **Milestone:** M12 (Clean Runtime)
> **Depends On:** Phases 0–11 (all prior migration + outDir work complete)
> **Session:** 6+

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level3-govern | v2.0 -->

---

## 1. Problem Statement

The JavaScript-to-TypeScript migration (Phases 0–11) achieved **0 compilation errors** but introduced significant runtime bugs, broken test infrastructure, and type-safety gaps that undermine the migration's goals. The codebase compiles but does not function correctly.

### Audit Summary (2026-02-07)

| Dimension | Severity | Finding |
|-----------|----------|---------|
| **Test infrastructure** | CRITICAL | `test:mcp` hangs (starts server instead of running tests), `test:cli` runs `--help` only |
| **Compiled test failures** | CRITICAL | 13/25 compiled `.ts` test files FAIL at runtime |
| **Original JS test failures** | HIGH | 8/16 original `.js` test files FAIL (path breakage from outDir) |
| **Scripts test failures** | HIGH | 6/13 scripts test files FAIL |
| **Logic bugs** | CRITICAL | tier-classifier classifies everything as DORMANT (API signature mismatch) |
| **`require()` in .ts files** | HIGH | 185 occurrences across 50 files — all imports typed as `any` |
| **Type assertions** | MEDIUM | 180+ type assertions, 70+ non-null assertions |
| **Dual test files** | MEDIUM | 20 `.js` + 26 `.ts` test files coexist — unclear which is authoritative |

---

## 2. Scope

### In Scope

| Stream | Description | Files | Priority |
|--------|-------------|------:|----------|
| **A: Test Infrastructure** | Fix `test:mcp`, `test:cli` scripts; establish working test runner | 3 | P0 |
| **B: Runtime Logic Bugs** | Fix classifyState API mismatch, FSRS failures, interface contracts | ~8 | P0 |
| **C: Module Path Breakage** | Fix `Cannot find module` errors from outDir migration | ~15 | P0 |
| **D: require() → import** | Convert remaining 185 `require()` calls to ES module `import` | ~50 | P1 |
| **E: Test File Consolidation** | Resolve dual .js/.ts test file situation, convert scripts tests | ~33 | P1 |
| **F: Type-Safety Hardening** | Reduce type assertions, remove `allowJs`, add proper types | ~20 | P2 |

### Out of Scope

- New feature development
- Performance optimization
- Documentation updates (deferred to after bugs are fixed)
- Converting `shared/` require() calls (only 2, lazy-loaded — acceptable)

---

## 3. Detailed Findings

### Stream A: Test Infrastructure (CRITICAL)

**Finding A1: `test:mcp` hangs indefinitely**

```json
// mcp_server/package.json
"test": "node -e \"require('./dist/context-server.js')\""
```

This starts the MCP server (which listens for stdio connections) instead of running test files. The server blocks forever waiting for MCP client input.

**Finding A2: `test:cli` has no assertions**

```json
// root package.json
"test:cli": "node scripts/dist/memory/generate-context.js --help"
```

Running `--help` is a smoke test for module loading only — it verifies the file can be required but doesn't test any logic.

**Finding A3: No test runner configured**

The project has no jest, vitest, or node:test runner. All 59 test files are standalone scripts that must be run individually with `node`.

---

### Stream B: Runtime Logic Bugs (CRITICAL)

**Bug B1: tier-classifier — All memories classify as DORMANT**

| Detail | Value |
|--------|-------|
| File | `mcp_server/lib/cognitive/tier-classifier.ts:230` |
| Root Cause | `classifyState(retrievability: number, elapsedDays: number)` takes two numbers, but callers (including tests) pass a memory object |
| Impact | Memory tier classification broken → search result ordering, attention decay, consolidation all degraded |
| Evidence | Test T201: R=0.95 → Expected HOT, got DORMANT |

The function signature was changed during TS migration from accepting a memory object to accepting raw numbers, but callers were not updated.

**Bug B2: FSRS scheduler — Stability calculations incorrect**

| Detail | Value |
|--------|-------|
| File | `mcp_server/lib/cognitive/fsrs-scheduler.ts` |
| Failures | T019 (success grade), T020 (failure grade), T034 (high similarity), T049 (accessed memories), plus 2 more |
| Skips | 13 tests skipped due to missing exports (FSRS_CONSTANTS not exported) |
| Impact | Spaced repetition scheduling broken → memories don't properly strengthen on access or decay on neglect |

**Bug B3: IVectorStore abstract interface — search() no longer throws**

| Detail | Value |
|--------|-------|
| File | `mcp_server/lib/interfaces/vector-store.ts` |
| Root Cause | Abstract class was converted to TS but `search()` lost its `throw new Error('must be implemented')` enforcement |
| Impact | Polymorphism contract broken — subclasses that don't implement `search()` silently return undefined |

**Bug B4: isBm25Enabled — not a function**

| Detail | Value |
|--------|-------|
| File | `mcp_server/lib/search/bm25-index.ts` (or hybrid-search.ts) |
| Root Cause | Function not properly exported during migration |
| Impact | BM25 hybrid search tests crash |

---

### Stream C: Module Path Breakage (CRITICAL)

After the Phase 11 outDir migration, compiled output moved from in-place to `dist/` directories. Many test files and some production code still reference old paths.

**Broken paths identified:**

| Error | Files Affected | Root Cause |
|-------|---------------|------------|
| `Cannot find module 'mcp_server/lib/search/vector-index.js'` | test-bug-fixes.js (3 tests), others | Path moved to `dist/lib/search/vector-index.js` |
| `Cannot find module 'scripts/memory/rank-memories'` | test-scripts-modules.js | Path moved to `scripts/dist/memory/rank-memories.js` |
| Various `Cannot find module` | 8+ original JS test files | Tests reference pre-outDir paths |

**Pattern:** All 20 original `.js` test files in `mcp_server/tests/` use `require('../lib/...')` paths that should now point to `../dist/lib/...` or use the compiled `.ts` test equivalents.

---

### Stream D: require() → import (HIGH)

**Distribution of `require()` calls in .ts files:**

| Workspace | Files | require() calls | Severity |
|-----------|------:|----------------:|----------|
| mcp_server/ (production) | ~35 | ~130 | HIGH |
| mcp_server/ (tests) | ~15 | ~55 | MEDIUM |
| scripts/ | 4 | 4 | LOW |
| shared/ | 2 | 2 | LOW (lazy-loaded, acceptable) |
| **Total** | **~56** | **~191** | |

**Why this matters:** Every `require()` call in a `.ts` file resolves to type `any`. This means:
- No compile-time type checking at module boundaries
- No IDE autocompletion for imported APIs
- No refactoring safety — renaming an export won't flag broken imports
- The entire handler layer (9 files, ~5,000 LOC) has untyped dependencies

**Pattern example (memory-save.ts):**

```typescript
import path from 'path';  // ← typed import (1 of 1)

const vectorIndex = require(path.join(LIB_DIR, 'search', 'vector-index.js'));  // ← untyped
const embeddings = require(path.join(LIB_DIR, 'providers', 'embeddings.js'));   // ← untyped
const memoryParser = require(path.join(LIB_DIR, 'parsing', 'memory-parser.js')); // ← untyped
// ... 14 more require() calls, all untyped
```

**Additional concern:** Many `require()` calls use dynamic `path.join(LIB_DIR, ...)` patterns. These are inherently unresolvable by TypeScript and prevent tree-shaking.

**Also present:** 12 files still using `module.exports` instead of ES module `export`.

---

### Stream E: Test File Consolidation (HIGH)

**Current state in mcp_server/tests/:**

| Category | Count | Description |
|----------|------:|-------------|
| `.ts` test files (compiled to dist/) | 26 | Converted during Phase 7, compiled output in `dist/tests/` |
| `.js` test files (original, in-place) | 20 | Never converted, reference pre-outDir paths |
| **Overlap** | ~16 | Same test exists as both `.js` and `.ts` |
| **JS-only** (no .ts equivalent) | ~4 | api-key-validation, api-validation, schema-migration, modularization |

**In scripts/tests/:**

| Category | Count | Description |
|----------|------:|-------------|
| `.js` test files | 13 | None converted to TypeScript |
| `.ts` test files | 0 | — |

**Problem:** It's unclear which test set is authoritative. The `.js` tests reference old paths. The `.ts` tests have different API expectations. Some tests exist in both forms with divergent assertions.

---

### Stream F: Type-Safety Hardening (MEDIUM)

| Issue | Count | Severity |
|-------|------:|----------|
| Type assertions (`as X`) | 180+ | MEDIUM |
| Non-null assertions (`!.`, `!;`) | 70+ | MEDIUM |
| `any` in test files | 14 | LOW |
| `any` in production files | 1 (comment only) | LOW |
| `allowJs: true` in mcp_server/tsconfig | 1 | MEDIUM |
| `eslint-disable` comments | ~4 | LOW |
| `'use strict'` in .ts files (unnecessary) | ~20 | LOW |

**Positive findings:**
- 0 `@ts-ignore` / `@ts-expect-error` directives
- 0 TODO/FIXME/HACK markers
- Root tsconfig has `strict: true`
- Well-defined local interfaces in production files (Database, MCPResponse, etc.)

---

## 4. Root Cause Analysis

The bugs fall into three root cause categories:

### RC1: Mechanical Conversion Without Semantic Verification

Files were renamed `.js` → `.ts` and minimally annotated, but function signatures and module APIs were changed without updating all callers. The tier-classifier bug is the clearest example: the function API changed from `(memory) → state` to `(retrievability, elapsedDays) → state` but tests still pass memory objects.

### RC2: outDir Migration Path Breakage

Phase 11 moved compiled output from in-place to `dist/` directories. Test files (especially the 20 original `.js` files) were not systematically updated to reflect the new paths. The test runner scripts in `package.json` were also not properly configured.

### RC3: Hybrid CJS/ESM Module System

The codebase is in a hybrid state: `.ts` source files use `import` for Node built-ins but `require()` for internal modules. This creates a two-tier type system where imports from Node/npm packages are typed but all internal cross-module boundaries are `any`.

---

## 5. Constraints

### Hard Constraints

1. **No API changes** — Fix tests to match current API, or fix API to match intended behavior (not both)
2. **Compiled output must remain functional** — MCP server startup and CLI tools must work after each fix
3. **Backward compatibility** — snake_case export aliases must be preserved
4. **No new runtime dependencies** — Fixes are code-only

### Soft Constraints

- Prefer fixing tests to match production API (production code is running in prod)
- Prefer `import` over `require()` for new/modified imports
- Keep `module: "commonjs"` in tsconfig (Decision D1 from parent spec)

---

## 6. Exit Criteria

### P0 (HARD BLOCKERS)

- [ ] Test infrastructure works: `npm test` runs all tests without hanging
- [ ] 0 "Cannot find module" errors across all test files
- [ ] tier-classifier correctly classifies HOT/WARM/COLD/DORMANT based on retrievability thresholds
- [ ] MCP server starts and all 20+ tools register

### P1 (Required)

- [ ] All compiled `.ts` test files pass (25/25)
- [ ] All scripts test files pass (13/13)
- [ ] `require()` in production `.ts` files converted to `import` (mcp_server/)
- [ ] `module.exports` replaced with `export` in production `.ts` files
- [ ] Dual test file situation resolved (single authoritative set)

### P2 (Can defer)

- [ ] `allowJs: false` in mcp_server/tsconfig.json
- [ ] Type assertion count reduced by 50%
- [ ] Non-null assertion count reduced by 50%
- [ ] `'use strict'` removed from `.ts` files

---

## 7. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Fixing require→import breaks runtime | Medium | High | Convert one file at a time, run tests after each |
| Test fixes mask production bugs | Medium | High | Verify production behavior before updating test expectations |
| tier-classifier fix cascades | Low | Medium | Determine if callers are the bug or the function signature |
| outDir path fixes inconsistent | Medium | Low | Systematic grep+replace, not file-by-file |

---

## 8. Dependencies

- **Phase 11** (outDir + setup hardening): Must be complete (it is)
- **Phase 10** (type error remediation): Must be complete (it is)
- **No forward dependencies** — This phase unblocks nothing but is critical for migration quality

---

## Cross-References

- **Parent Spec:** `092-javascript-to-typescript/spec.md`
- **Phase 10:** `phase-11-type-error-remediation/spec.md` (prior type fixes)
- **Phase 11:** `phase-12-outdir-and-setup-hardening/spec.md` (outDir source of path issues)
- **tier-classifier source:** `mcp_server/lib/cognitive/tier-classifier.ts:230`
- **FSRS scheduler source:** `mcp_server/lib/cognitive/fsrs-scheduler.ts`
