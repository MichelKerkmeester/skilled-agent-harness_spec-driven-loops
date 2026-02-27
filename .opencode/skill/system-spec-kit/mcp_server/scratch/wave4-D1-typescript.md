# Wave 4 D1: TypeScript Strict Mode Verification

**Date:** 2026-02-27
**Scope:** `mcp_server/` — strict type checking via `npx tsc --noEmit`

---

## Pre-Fix: 9 Errors Found

### Error Category 1: TS6307 — Composite Project File Resolution (1 error, 3 test files)

**Root cause:** `lib/cognitive/` is an exact duplicate of `lib/cache/cognitive/`. Production code imports from `lib/cache/cognitive/co-activation.ts`, but sprint test files imported from `lib/cognitive/co-activation.ts`. TypeScript's composite mode (`"composite": true`) raised TS6307 for the non-canonical path despite the file being correctly included via `"include": ["**/*.ts"]`.

**Files:** `t010b-rrf-degree-channel.vitest.ts`, `t040-sprint1-feature-eval.vitest.ts`, `t043-cross-sprint-integration.vitest.ts`, `pipeline-integration.vitest.ts`

**Fix:** Updated import paths from `../lib/cognitive/co-activation` to `../lib/cache/cognitive/co-activation` (the canonical path used by production code).

### Error Category 2: TS2352 — Unsafe Type Assertion (2 errors)

**File:** `t017-g2-intent.vitest.ts:104-105`
**Root cause:** `FusionWeights` and `IntentWeights` interfaces lack index signatures, so direct casting to `Record<string, unknown>` is rejected by strict mode.

**Fix:** Double-cast via `unknown`: `as unknown as Record<string, unknown>`.

### Error Category 3: TS2503 — Missing Namespace Import (2 errors)

**File:** `t020-folder-relevance.vitest.ts:389,404`
**Root cause:** Used `Database.Database` type annotation without importing `Database` from `better-sqlite3`.

**Fix:** Added `import type Database from 'better-sqlite3'`.

### Error Category 4: TS2339 — Missing Properties on Generic Type (4 errors)

**File:** `t020-folder-relevance.vitest.ts:430-434`
**Root cause:** `makeResult()` returns `{ id, score, ...extra }` where `extra: Record<string, unknown>`. TypeScript infers the return type as `{ id: number; score: number }` (spread of `Record` not tracked). Properties `title` and `source` from the spread are invisible to the type system after `enrichResultsWithFolderScores` generics.

**Fix:** Cast enriched results to `Record<string, unknown>` when accessing spread properties.

---

## Post-Fix: 0 TypeScript Errors

```
npx tsc --noEmit  →  0 lines output (clean)
npx vitest run    →  195/196 test files pass, 5795/5816 tests pass
```

**Pre-existing failure (not sprint-related):** `modularization.vitest.ts` — `handlers/memory-save.js` is 1798 lines, exceeding the 1400-line guardrail. This is a module size issue unrelated to type checking.

---

## Files Modified

| File | Change |
|------|--------|
| `tests/t010b-rrf-degree-channel.vitest.ts` | Import path: `lib/cognitive/` → `lib/cache/cognitive/` |
| `tests/t017-g2-intent.vitest.ts` | Double-cast: `as unknown as Record<string, unknown>` |
| `tests/t020-folder-relevance.vitest.ts` | Added `import type Database`; cast spread properties |
| `tests/t040-sprint1-feature-eval.vitest.ts` | Import path: `lib/cognitive/` → `lib/cache/cognitive/` |
| `tests/t043-cross-sprint-integration.vitest.ts` | Import path: `lib/cognitive/` → `lib/cache/cognitive/` |
| `tests/pipeline-integration.vitest.ts` | Import path: `lib/cognitive/` → `lib/cache/cognitive/` |
