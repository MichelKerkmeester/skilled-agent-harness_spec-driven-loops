# Plan: Phase 12 — Post-Migration Bug Audit

> **Parent Spec:** `092-javascript-to-typescript/`
> **Created:** 2026-02-07
> **Approach:** Fix bottom-up: infrastructure → paths → logic → types

<!-- SPECKIT_LEVEL: 3 -->

---

## Execution Strategy

### Stream Ordering (Critical Path)

```
Stream A: Test Infrastructure ──────┐
                                    ├──► Stream B: Logic Bugs ──► Stream D: require→import
Stream C: Module Path Breakage ─────┘                          ↘
                                                                Stream E: Test Consolidation
                                                                          ↓
                                                                Stream F: Type Hardening
```

**Why this order:**
1. **A first** — Can't verify any fixes without working test infrastructure
2. **C alongside A** — Path fixes are independent and mechanical
3. **B after A+C** — Logic bugs need working tests to verify
4. **D after B** — Converting require→import may break things; need working tests first
5. **E after D** — Test consolidation benefits from import conversion
6. **F last** — Type hardening is polish; everything must work first

---

## Stream A: Fix Test Infrastructure

### Approach

1. **Replace `test:mcp`** script with a runner that executes all test files sequentially
   - Use `node --test` (Node 18+ built-in test runner) or a simple shell loop
   - List all `.ts` compiled test files in `dist/tests/`
   - Each file runs as standalone script, capture exit code
   - Summary: pass/fail/skip counts

2. **Replace `test:cli`** with actual script invocations
   - `generate-context.js --help` (current — keep as smoke test)
   - Add: `generate-context.js` with a test spec folder (real assertion)
   - Add: `rank-memories.js` with stdin input (real assertion)

3. **Configure individual test scripts** to return proper exit codes
   - Currently some tests print "FAIL" but exit 0
   - Add `process.exitCode = 1` on failure

### Verification

- `npm run test:mcp` completes within 5 minutes (not hanging)
- Exit code reflects actual pass/fail
- `npm test` runs all three suites sequentially

---

## Stream B: Fix Runtime Logic Bugs

### B1: tier-classifier — classifyState API mismatch

**Investigation needed:** Determine whether:
- (a) `classifyState` should accept a memory object (revert API to match callers), or
- (b) Callers should pass `(retrievability, elapsedDays)` numbers (update callers)

**Decision approach:**
1. Check production callers of `classifyState` (how is it called in handlers?)
2. Check if `classifyTier(memory)` is the intended public API
3. If `classifyState` is internal and `classifyTier` is public: make `classifyState` private, update tests to use `classifyTier`

### B2: FSRS scheduler failures

1. Read current `fsrs-scheduler.ts` API surface
2. Compare test expectations against actual function signatures
3. Fix test assertions to match current behavior OR fix calculation bugs
4. Verify FSRS constants are properly exported

### B3: IVectorStore abstract interface

1. Check if abstract methods still have `throw new Error('must be implemented')`
2. If removed during TS conversion: re-add as abstract method bodies
3. Alternatively: convert to proper `abstract` methods (TS enforces at compile time)

### B4: isBm25Enabled export

1. Locate function definition
2. Verify it's exported from the correct barrel
3. Fix export chain

---

## Stream C: Fix Module Path Breakage

### Approach

Systematic grep-and-fix for all `Cannot find module` patterns:

1. **Identify all broken paths** in original `.js` test files
   - Pattern: `require('../lib/...')` → should be `require('../dist/lib/...')`
   - Pattern: `require('../../scripts/...')` → should be `require('../../scripts/dist/...')`

2. **Fix or deprecate original .js test files**
   - If `.ts` equivalent exists: mark `.js` as deprecated, fix `.ts` version
   - If `.js`-only: update paths to `dist/`

3. **Fix scripts test paths**
   - `test-scripts-modules.js`: Update `rank-memories` path
   - `test-bug-fixes.js`: Update `vector-index` path
   - Other failing scripts tests: update paths

---

## Stream D: Convert require() → import

### Approach

Convert files in dependency order (leaf modules first):

**Tier 1: Leaf modules (no internal imports)**
- `core/config.ts`, `core/db-state.ts`
- `utils/validators.ts`, `utils/json-helpers.ts`, `utils/batch-processor.ts`
- `formatters/token-metrics.ts`, `formatters/search-results.ts`

**Tier 2: lib/ modules**
- All `lib/*/` modules that import from Tier 1

**Tier 3: Handlers**
- All 9 handlers + hooks (heaviest require() users)

**Tier 4: Entry points**
- `context-server.ts` (23 require calls — largest single file)
- `scripts/reindex-embeddings.ts`

**Per-file process:**
1. Replace `const X = require('...')` with `import X from '...'` or `import { X } from '...'`
2. Replace `module.exports = { ... }` with named `export`
3. Remove `.js` extension from import paths (TS resolves automatically)
4. Verify file compiles: `tsc --noEmit`
5. Run related test

---

## Stream E: Test File Consolidation

### Approach

1. **Audit overlap:** Map which `.js` tests have `.ts` equivalents
2. **Delete redundant .js tests** where `.ts` version exists and passes
3. **Convert JS-only tests to .ts** (4 files: api-key-validation, api-validation, schema-migration, modularization)
4. **Convert all 13 scripts tests to .ts** (none are converted yet)
5. **Update test runner** to use only compiled `dist/tests/` output

---

## Stream F: Type-Safety Hardening

### Approach (P2 — Can defer)

1. Remove `allowJs: true` from mcp_server/tsconfig.json
2. Remove `'use strict'` from `.ts` files (TypeScript strict mode handles this)
3. Audit and reduce type assertions (target: -50%)
4. Audit and reduce non-null assertions (target: -50%)
5. Add type guards where non-null assertions are currently used

---

## Session Planning

| Session | Streams | Estimated Effort |
|---------|---------|-----------------|
| Session 1 | A + C (infrastructure + paths) | 3–4 hours |
| Session 2 | B (logic bugs) | 3–4 hours |
| Session 3 | D (require→import, first half) | 4–5 hours |
| Session 4 | D (require→import, second half) + E (test consolidation) | 4–5 hours |
| Session 5 | F (type hardening) + verification | 2–3 hours |
