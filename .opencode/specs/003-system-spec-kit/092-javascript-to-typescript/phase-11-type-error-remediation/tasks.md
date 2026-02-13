# Tasks: Phase 10 — Type Error Remediation

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-K
> **Level:** 3+
> **Created:** 2026-02-07

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3plus-govern | v2.0 -->

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
T### [W-K] [P?] Description (file path) [effort] {deps: T###}
```

---

## Stream 10a: Barrel Export Conflicts (8 errors, 3 files)

- [ ] T330 [W-K] Fix `lib/storage/index.ts` — resolve 5 ambiguous `init` re-exports [30m] {deps: none}
  - 5 modules export `init`: history, causal-edges, checkpoints, incremental-index, index-refresh
  - **Fix:** Replace `export *` with explicit named exports using prefixed names
  - Example: `export { init as historyInit } from './history'`
  - Alternatively: remove `init` from barrel, require direct imports for init functions
  - **Verify:** `grep TS2308 <tsc output>` returns 0 matches for storage/index

- [ ] T331 [W-K] [P] Fix `lib/search/index.ts` — resolve 3 ambiguous re-exports [20m] {deps: none}
  - Duplicated exports: `RerankResult`, `isRerankerAvailable`, `rerankResults`
  - **Fix:** Explicit named exports excluding duplicates from one of the source modules
  - **Verify:** `grep TS2308 <tsc output>` returns 0 matches for search/index

- [ ] T332 [W-K] [P] Fix `formatters/index.ts` — resolve 1 ambiguous re-export [10m] {deps: none}
  - Identify conflicting export name
  - **Fix:** Explicit named exports
  - **Verify:** No TS2308 errors

---

## Stream 10b: Production Type Fixes (14 errors, 9 files)

- [ ] T333 [W-K] Fix `lib/scoring/composite-scoring.ts` — 3 type errors [30m] {deps: T330}
  - TS2339: Property does not exist on type
  - TS2551: Property name mismatch (likely camelCase vs snake_case)
  - **Fix:** Align property names with the upstream interface definitions
  - Read actual interface from `shared/types.ts` or `lib/scoring/` to determine correct names

- [ ] T334 [W-K] [P] Fix `formatters/search-results.ts` — 3 type errors [30m] {deps: T332}
  - TS2739: `MCPResponse` missing properties (`summary`, `data`, `hints`, `meta`)
  - **Fix:** Update `MCPResponse` interface to include all required properties OR adjust return types

- [ ] T335 [W-K] [P] Fix `handlers/memory-triggers.ts` — 2 type errors [15m] {deps: T330}
  - TS2322: Type not assignable
  - TS18048: Possibly undefined
  - **Fix:** Add type narrowing / null checks

- [ ] T336 [W-K] [P] Fix `lib/search/hybrid-search.ts` — 1 type error [10m] {deps: T331}
  - TS2339: Property does not exist
  - **Fix:** Read the actual type definition and use correct property name

- [ ] T337 [W-K] [P] Fix `lib/search/fuzzy-match.ts` — 1 type error [10m] {deps: T331}
  - TS2339: Property does not exist
  - **Fix:** Read the actual type definition and use correct property name

- [ ] T338 [W-K] [P] Fix `lib/parsing/trigger-matcher.ts` — 1 type error [10m] {deps: none}
  - TS2459: Module declares locally but not exported
  - **Fix:** Export the missing declaration

- [ ] T339 [W-K] [P] Fix `lib/parsing/memory-parser.ts` — 1 type error [10m] {deps: none}
  - TS1192: Module has no default export
  - **Fix:** Add `export default` or change importing module to use named import

- [ ] T340 [W-K] Verify production files compile cleanly [15m] {deps: T333-T339}
  - Run `tsc --noEmit -p mcp_server/tsconfig.json` excluding test files
  - Target: 0 errors in non-test files
  - **Evidence:** Terminal output showing error count

---

## Stream 10c: Test File Remediation (254 errors, 2 files)

- [ ] T341 [W-K] Read current `lib/embeddings/provider-chain.ts` API surface [15m] {deps: none}
  - Document: constructor signature, all public methods, all public properties
  - Document: `ProviderTier` enum values
  - Document: `FallbackReason` type values
  - Document: `ChainStatus` interface shape
  - This is research only — no file modifications

- [ ] T342 [W-K] Map old API → new API for provider-chain.test.ts [30m] {deps: T341}
  - Create mapping table: old method/property → new equivalent
  - Identify tests that are no longer valid (test removed features)
  - Identify tests that need new assertion patterns
  - This is research only — no file modifications

- [ ] T343 [W-K] Fix `provider-chain.test.ts` — constructor/initialization tests [45m] {deps: T342}
  - Update `new EmbeddingProviderChain(...)` calls to match current constructor
  - Update `initialize()` calls if method was renamed/removed
  - Update `isReady` / `initialized` property checks
  - **Verify:** Initialization-related errors resolved

- [ ] T344 [W-K] Fix `provider-chain.test.ts` — embedding method tests [45m] {deps: T343}
  - Update `embed()` → current method name
  - Update `embedQuery()` → `embed_query()` (or current name)
  - Update `embedDocument()` → `embed_document()` (or current name)
  - Update `batchEmbed()` → current method name
  - Update `getDimension()` → current method name
  - **Verify:** Embedding method errors resolved

- [ ] T345 [W-K] Fix `provider-chain.test.ts` — fallback/tier tests [45m] {deps: T344}
  - Update `ProviderTier.TERTIARY` references (removed)
  - Update `FallbackReason` enum values to current set
  - Update `activeTier` / `activeProvider` property access
  - Update `getFallbackLog()` → current method
  - **Verify:** Fallback/tier errors resolved

- [ ] T346 [W-K] Fix `provider-chain.test.ts` — status/health tests [30m] {deps: T345}
  - Update `ChainStatus` interface assertions
  - Update `getStatus()` return type expectations
  - Update health check property names
  - **Verify:** Status/health errors resolved

- [ ] T347 [W-K] Fix `provider-chain.test.ts` — MockProvider types [30m] {deps: T346}
  - Update `MockProvider` interface to include `getActivationInfo`, `activate`
  - Align mock with current `IEmbeddingProvider` interface from `shared/types.ts`
  - **Verify:** Mock-related errors resolved

- [ ] T348 [W-K] Fix `provider-chain.test.ts` — remaining errors [30m] {deps: T347}
  - Address any remaining errors not covered by T343-T347
  - Run `tsc --noEmit` and fix iteratively until 0 errors in this file
  - **Verify:** 0 errors in provider-chain.test.ts

- [ ] T349 [W-K] Fix `session-manager.test.ts` — 1 type error [10m] {deps: T340}
  - Identify and fix the single type error
  - **Verify:** 0 errors in session-manager.test.ts

---

## Stream 10d: Runtime Bug Fix

- [ ] T350 [W-K] [P] Diagnose `vector-index.js` self-require infinite recursion [30m] {deps: none}
  - Read `lib/search/vector-index.js` initialization code
  - Identify the circular require pattern
  - Document the fix approach
  - **This is research only**

- [ ] T351 [W-K] Fix `vector-index.js` self-require bug [30m] {deps: T350}
  - Implement the fix (restructure module initialization)
  - Also fix in `vector-index.ts` if the TS file has the same issue
  - **Verify:** `node -e "require('./mcp_server/lib/search/vector-index')"` completes without stack overflow

---

## Phase 10 Verification

- [ ] T352 [W-K] Full build verification: `tsc --build` — 0 errors [15m] {deps: T340, T348, T349}
  - Run from project root
  - All 3 workspaces compile: shared/ (0), mcp_server/ (0), scripts/ (0)
  - **Evidence:** Terminal output showing "Found 0 errors"

- [ ] T353 [W-K] Test suite verification: `npm test` — all pass [15m] {deps: T352, T351}
  - `test:cli` — PASS
  - `test:embeddings` — PASS
  - `test:mcp` — PASS
  - **Evidence:** Test summary output

- [ ] T354 [W-K] MCP server startup verification [10m] {deps: T352, T351}
  - `node mcp_server/context-server.js` starts without errors
  - All 20+ tools registered
  - **Evidence:** Server initialization log

- [ ] T355 [W-K] Regression check: shared/ and scripts/ still compile [5m] {deps: T352}
  - Verify no regressions from mcp_server/ fixes
  - **Evidence:** `tsc --noEmit -p shared/tsconfig.json && tsc --noEmit -p scripts/tsconfig.json` both exit 0

- [ ] T356 [W-K] Update parent tasks.md and checklist.md with completion status [15m] {deps: T352-T355}
  - Mark Phase 10 tasks complete in parent `tasks.md`
  - Update parent `checklist.md` with evidence
  - SYNC-010 gate: Migration Verified

---

## Completion Criteria

- [ ] All 27 tasks (T330-T356) marked `[x]`
- [ ] No `[B]` blocked tasks
- [ ] `tsc --build` — 0 errors (all 3 workspaces)
- [ ] All tests pass (test:cli, test:embeddings, test:mcp)
- [ ] MCP server starts and registers all tools
- [ ] No regressions in shared/ or scripts/

---

## Task Dependencies Summary

```
T330-T332 (barrel fixes)       [Independent, no deps]
    ↓
T333-T339 (production fixes)   [Depends on barrel fixes]
    ↓
T340 (production verify)       [Depends on all production fixes]
    ↓
T341-T342 (API research)       [Independent research]
    ↓
T343-T348 (provider-chain)     [Sequential: each builds on previous]
    ↓
T349 (session-manager)         [After production verify]

T350-T351 (vector-index)       [Independent, parallel with everything]

T352-T356 (verification)       [Depends on ALL above]
```

---

## Cross-References

- **Spec:** See `spec.md`
- **Plan:** See `plan.md`
- **Checklist:** See `checklist.md`
- **Decision Record:** See `decision-record.md`
- **Parent Tasks:** `092-javascript-to-typescript/tasks.md`
