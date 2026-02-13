# Tasks: Phase 12 — Post-Migration Bug Audit

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-L
> **Level:** 3
> **Created:** 2026-02-07

<!-- SPECKIT_LEVEL: 3 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

---

## Stream A: Test Infrastructure (P0)

> **Goal:** Make `npm test` actually run tests and report results.

- [ ] T400 [W-L] Fix `test:mcp` script — replace server-start with test runner [1h] {deps: none}
  - Current: `node -e "require('./dist/context-server.js')"` (hangs)
  - Replace with shell loop or node script that runs `dist/tests/*.test.js`
  - Each test file runs via `node`, capture exit code
  - Print summary: X passed, Y failed, Z skipped
  - Total `test:mcp` must complete in < 5 minutes

- [ ] T401 [W-L] [P] Fix `test:cli` script — add real assertions [30m] {deps: none}
  - Keep `--help` smoke test
  - Add: `generate-context.js` invocation with test spec folder
  - Verify exit code indicates success/failure

- [ ] T402 [W-L] [P] Audit test exit codes — ensure failures exit non-zero [1h] {deps: none}
  - Check all 25 compiled test files for proper `process.exitCode = 1` on failure
  - Some tests print "FAIL" but exit 0 — fix these
  - Pattern: `if (failures > 0) process.exitCode = 1;`

- [ ] T403 [W-L] Verify `npm test` works end-to-end [15m] {deps: T400, T401, T402}
  - `npm test` runs test:cli, test:embeddings, test:mcp sequentially
  - Returns non-zero if any suite fails
  - Does NOT hang

---

## Stream B: Runtime Logic Bugs (P0)

> **Goal:** Fix logic bugs introduced during TS migration.

### B1: tier-classifier

- [ ] T410 [W-L] Investigate classifyState callers — determine correct API [30m] {deps: none}
  - Grep all callers of `classifyState` in production code
  - Grep all callers of `classifyTier` in production code
  - Determine: should `classifyState` accept (number, number) or (memory)?
  - Document finding in scratch/

- [ ] T411 [W-L] Fix tier-classifier — align API with callers [1h] {deps: T410}
  - If classifyState should be internal: make it non-exported, fix test to use classifyTier
  - If classifyState should accept memory: revert to original signature
  - **Verify:** T201-T210 all pass (HOT/WARM/COLD/DORMANT classification correct)

### B2: FSRS scheduler

- [ ] T412 [W-L] Investigate FSRS test failures — map expected vs actual behavior [30m] {deps: none}
  - Read fsrs-scheduler.ts export surface
  - Compare against test expectations
  - Identify: are failures in the algorithm or in test expectations?

- [ ] T413 [W-L] Fix FSRS scheduler failures [1.5h] {deps: T412}
  - Fix T019 (success grade stability), T020 (failure grade stability)
  - Fix T034 (high similarity REINFORCE)
  - Fix T049 (accessed memories stability)
  - Fix grade 4 / consecutive success/failure tests
  - Export FSRS_CONSTANTS if tests need them
  - **Verify:** FAIL count drops from 7 to 0 (skips acceptable for now)

### B3: Interface contracts

- [ ] T414 [W-L] [P] Fix IVectorStore abstract interface [30m] {deps: none}
  - Check if abstract methods have enforcement (`throw new Error`)
  - If using TS abstract class: verify `abstract` keyword on methods
  - **Verify:** interfaces.test.js passes — search() throws on unimplemented

### B4: Export issues

- [ ] T415 [W-L] [P] Fix isBm25Enabled export [30m] {deps: none}
  - Locate function in bm25-index.ts or hybrid-search.ts
  - Verify exported from barrel index
  - **Verify:** bm25-index.test.js passes fully

- [ ] T416 [W-L] Verify all logic bug fixes [30m] {deps: T411, T413, T414, T415}
  - Run all compiled test files that were FAIL
  - Target: reduce from 13 FAIL to < 5 (remaining may be path issues)

---

## Stream C: Module Path Breakage (P0)

> **Goal:** Fix all "Cannot find module" errors.

- [ ] T420 [W-L] Catalog all broken require paths in test files [30m] {deps: none}
  - Run each failing test, capture exact "Cannot find module" path
  - Create mapping: old path → correct new path
  - Document in scratch/path-mapping.md

- [ ] T421 [W-L] Fix mcp_server original .js test paths [1.5h] {deps: T420}
  - Update `require('../lib/...')` → `require('../dist/lib/...')`
  - Fix: api-key-validation, api-validation, causal-edges, crash-recovery,
         memory-save-integration, memory-search-integration, modularization, schema-migration
  - **Verify:** Each file runs without "Cannot find module"

- [ ] T422 [W-L] [P] Fix scripts test paths [1h] {deps: T420}
  - test-scripts-modules.js: fix rank-memories path
  - test-bug-fixes.js: fix vector-index path (3 occurrences)
  - test-integration.js, test-naming-migration.js, test-template-*.js: fix paths
  - **Verify:** Each file runs without "Cannot find module"

- [ ] T423 [W-L] Fix compiled .ts test paths if needed [30m] {deps: T420}
  - Check if any `dist/tests/*.test.js` files have broken paths
  - These should reference `../lib/...` (relative within dist/)
  - Fix any found

- [ ] T424 [W-L] Full test pass after path fixes [30m] {deps: T421, T422, T423}
  - Run all test files
  - 0 "Cannot find module" errors remaining
  - Document remaining failures (logic bugs, not path issues)

---

## Stream D: Convert require() → import (P1)

> **Goal:** Replace untyped `require()` with typed `import` in production .ts files.

### Tier 1: Core + Utils (fewest dependencies)

- [ ] T430 [W-L] Convert `core/config.ts` — require→import [30m] {deps: T416}
- [ ] T431 [W-L] [P] Convert `core/db-state.ts` — require→import [30m] {deps: T416}
- [ ] T432 [W-L] [P] Convert `utils/validators.ts` — require→import [15m] {deps: T416}
- [ ] T433 [W-L] [P] Convert `utils/json-helpers.ts` — require→import [15m] {deps: T416}
- [ ] T434 [W-L] [P] Convert `utils/batch-processor.ts` — require→import [15m] {deps: T416}
- [ ] T435 [W-L] [P] Convert `formatters/token-metrics.ts` — require→import [15m] {deps: T416}
- [ ] T436 [W-L] [P] Convert `formatters/search-results.ts` — require→import [15m] {deps: T416}

### Tier 2: lib/ modules

- [ ] T437 [W-L] Convert `lib/errors/core.ts` — require→import [15m] {deps: T430}
- [ ] T438 [W-L] [P] Convert `lib/scoring/composite-scoring.ts` — require→import [15m] {deps: T430}
- [ ] T439 [W-L] [P] Convert `lib/search/vector-index.ts` — require→import [30m] {deps: T430}
- [ ] T440 [W-L] [P] Convert `lib/search/hybrid-search.ts` — require→import [15m] {deps: T430}
- [ ] T441 [W-L] [P] Convert `lib/cognitive/*.ts` (8 files) — require→import [1.5h] {deps: T430}
- [ ] T442 [W-L] [P] Convert `lib/storage/*.ts` (7 files) — require→import [1h] {deps: T430}
- [ ] T443 [W-L] [P] Convert `lib/session/session-manager.ts` — require→import [15m] {deps: T430}
- [ ] T444 [W-L] [P] Convert `lib/cache/tool-cache.ts` — require→import [15m] {deps: T430}
- [ ] T445 [W-L] [P] Convert `lib/learning/corrections.ts` — require→import [15m] {deps: T430}
- [ ] T446 [W-L] [P] Convert `lib/providers/retry-manager.ts` — require→import [15m] {deps: T430}
- [ ] T447 [W-L] [P] Convert `lib/embeddings/provider-chain.ts` — require→import [15m] {deps: T430}
- [ ] T448 [W-L] Convert remaining lib/ modules — require→import [30m] {deps: T437-T447}

### Tier 3: Handlers + Hooks

- [ ] T449 [W-L] Convert `handlers/memory-save.ts` — require→import (17 calls) [45m] {deps: T448}
- [ ] T450 [W-L] [P] Convert `handlers/memory-search.ts` — require→import (12 calls) [30m] {deps: T448}
- [ ] T451 [W-L] [P] Convert `handlers/memory-crud.ts` — require→import (10 calls) [30m] {deps: T448}
- [ ] T452 [W-L] [P] Convert `handlers/memory-index.ts` — require→import (10 calls) [30m] {deps: T448}
- [ ] T453 [W-L] [P] Convert `handlers/memory-triggers.ts` — require→import (8 calls) [20m] {deps: T448}
- [ ] T454 [W-L] [P] Convert `handlers/causal-graph.ts` — require→import (5 calls) [15m] {deps: T448}
- [ ] T455 [W-L] [P] Convert `handlers/checkpoints.ts` — require→import (4 calls) [15m] {deps: T448}
- [ ] T456 [W-L] [P] Convert `handlers/session-learning.ts` — require→import (3 calls) [10m] {deps: T448}
- [ ] T457 [W-L] [P] Convert `handlers/memory-context.ts` — require→import (4 calls) [15m] {deps: T448}
- [ ] T458 [W-L] [P] Convert `hooks/memory-surface.ts` — require→import (2 calls) [10m] {deps: T448}

### Tier 4: Entry points

- [ ] T459 [W-L] Convert `context-server.ts` — require→import (23 calls) [1h] {deps: T449-T458}
- [ ] T460 [W-L] [P] Convert `scripts/reindex-embeddings.ts` — require→import (8 calls) [20m] {deps: T448}
- [ ] T461 [W-L] [P] Convert `scripts/core/workflow.ts` — require→import (1 call) [10m] {deps: T416}
- [ ] T462 [W-L] [P] Convert `scripts/extractors/collect-session-data.ts` — require→import (1 call) [10m] {deps: T416}
- [ ] T463 [W-L] [P] Convert `scripts/loaders/data-loader.ts` — require→import (1 call) [10m] {deps: T416}
- [ ] T464 [W-L] [P] Convert `scripts/lib/decision-tree-generator.ts` — require→import (1 call) [10m] {deps: T416}

### Tier 5: module.exports → export

- [ ] T465 [W-L] Convert remaining `module.exports` → named exports [1h] {deps: T459}
  - 12 files still using module.exports
  - Replace with `export { ... }` or `export default`
  - Verify all consumers import correctly

### Stream D Verification

- [ ] T466 [W-L] Full build after require→import conversion [30m] {deps: T465}
  - `tsc --build` — 0 errors
  - `npm test` — all previously-passing tests still pass
  - Grep: 0 `require()` in production .ts files (except shared/ lazy-loads)

---

## Stream E: Test File Consolidation (P1)

- [ ] T470 [W-L] Audit .js/.ts test overlap — create mapping [30m] {deps: T424}
  - List all .js tests and their .ts equivalents
  - Identify .js-only tests (no .ts version)

- [ ] T471 [W-L] Delete redundant .js tests where .ts equivalent passes [30m] {deps: T470}
  - Only delete if .ts compiled version passes
  - Keep .js version if .ts version is broken

- [ ] T472 [W-L] Convert 4 JS-only mcp_server tests to .ts [2h] {deps: T470}
  - api-key-validation, api-validation, schema-migration, modularization

- [ ] T473 [W-L] Update test runner to use dist/tests/ exclusively [15m] {deps: T471}

---

## Stream F: Type-Safety Hardening (P2)

- [ ] T480 [W-L] Remove `allowJs: true` from mcp_server/tsconfig.json [30m] {deps: T466}
  - May require fixing the vector-index-impl.js inclusion
  - Verify build still passes

- [ ] T481 [W-L] [P] Remove `'use strict'` from .ts files (~20 files) [30m] {deps: T466}
  - TypeScript strict mode makes this redundant

- [ ] T482 [W-L] Audit and reduce type assertions by 50% [2h] {deps: T466}
  - Replace `as X` with type guards where possible
  - Replace `obj as any as Target` with proper generics

- [ ] T483 [W-L] [P] Audit and reduce non-null assertions by 50% [1.5h] {deps: T466}
  - Replace `x!.prop` with `if (x) { x.prop }` or optional chaining `x?.prop`

---

## Phase 12 Verification

- [ ] T490 [W-L] Final build: `tsc --build` — 0 errors [10m] {deps: all}
- [ ] T491 [W-L] Final test: `npm test` — all suites pass [15m] {deps: T490}
- [ ] T492 [W-L] MCP server starts: all 20+ tools register [10m] {deps: T490}
- [ ] T493 [W-L] CLI tools work: generate-context, rank-memories [10m] {deps: T490}
- [ ] T494 [W-L] require() audit: 0 in production .ts files [10m] {deps: T490}
- [ ] T495 [W-L] Update parent tasks.md and checklist.md [15m] {deps: T490-T494}

---

## Completion Criteria

- [ ] All P0 tasks marked `[x]` (Streams A, B, C)
- [ ] All P1 tasks marked `[x]` (Streams D, E)
- [ ] `npm test` completes without hanging and returns correct exit code
- [ ] 0 "Cannot find module" errors
- [ ] tier-classifier passes all 10 state classification tests
- [ ] FSRS scheduler passes (failures ≤ 2, skips acceptable)
- [ ] 0 `require()` in production .ts files
- [ ] MCP server starts and all tools register

---

## Task Dependencies Summary

```
T400-T402 (test infra) ──────────┐
T420 (path catalog) ─────────────┤
                                  ↓
T403 (verify test infra)         T421-T424 (path fixes)
         ↓                              ↓
T410-T415 (logic bugs) ─────► T416 (verify logic)
                                        ↓
                              T430-T465 (require→import)
                                        ↓
                              T466 (verify imports)
                                        ↓
                              T470-T473 (test consolidation)
                              T480-T483 (type hardening)
                                        ↓
                              T490-T495 (final verification)
```
