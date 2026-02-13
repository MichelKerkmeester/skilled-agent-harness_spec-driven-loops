# Tasks: Spec Kit Remaining Cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `W-ID [Priority] Description (file path) → CHK-###`

---

## Phase 1: Quick Wins (P3 — LOW priority, ~89 tests unblocked)

- [x] W-I [P] [P3] Fix memory-save-extended.vitest.ts — removed duplicate const declarations, removed @ts-nocheck, unskipped (30 passed, 12 skipped within file) → CHK-P1a
- [x] W-J [P] [P3] Fix trigger-matcher.vitest.ts — added vi.mock for vector-index DB dependency, proper static imports, unskipped (19/19 passed) → CHK-P1b
- [x] W-K [P3] Rewrite scoring.vitest.ts — 21 real tests targeting composite-scoring.ts API (21/21 passed) → CHK-P1c
- [x] W-L [P] [P3] Fix 14 dist/ imports across 6 test files — all passing → CHK-P1d
- [x] W-M [P3] Convert learning/index.js to index.ts — uses `import = require` + `export =` because corrections.js is CJS → CHK-P1e

> **Note (CJS shims):** 5 CJS shim files (`format-helpers.js`, `path-security.js`, `logger.js`, `config.js`, `embeddings.js`) were accidentally deleted during Phase 1 work and recreated. These shims are still needed until W-A (vector-index-impl.js conversion) in Phase 3.

**Phase Gate**: ✅ PASSED — All quick-fix tests passing, TS5055 warnings resolved
**Final metrics**: 108 files passed, 10 skipped, 0 failed (118 total) · 3,733 tests passed, 210 skipped, 0 failed (3,943 total) · TypeScript build: 0 errors, 0 TS5055 warnings

---

## Phase 2: Unimplemented Modules (P2 — MEDIUM priority, ~134 tests)

- [x] W-C [P] [P2] Create `lib/utils/retry.ts` — tests: `retry.vitest.ts` (74 tests, 627 lines); functionality: exponential backoff, error classification, retry config, circuit breaker integration; largest unimplemented module → CHK-P2a
- [x] W-D [P] [P2] Create `lib/parsing/entity-scope.ts` — tests: `entity-scope.vitest.ts` (19 tests); functionality: context type detection — classify content as research/implementation/decision/discovery → CHK-P2b
- [x] W-E [P] [P2] Create `lib/storage/history.ts` — tests: `history.vitest.ts` (12 tests); functionality: memory audit trail — track ADD/UPDATE/DELETE events with timestamps → CHK-P2c
- [x] W-F [P] [P2] Create `lib/storage/index-refresh.ts` — tests: `index-refresh.vitest.ts` (14 tests); functionality: incremental re-indexing; note: `incremental-index.ts` exists but has different API → CHK-P2d
- [x] W-G [P] [P2] Create `lib/cognitive/temporal-contiguity.ts` — tests: `temporal-contiguity.vitest.ts` (10 tests); functionality: time-based memory association — link memories accessed close in time → CHK-P2e
- [x] W-H [P] [P2] Create `lib/search/reranker.ts` — tests: `reranker.vitest.ts` (5 tests, currently stub assertions); functionality: cross-encoder reranking of search results → CHK-P2f

**Phase Gate**: ✅ PASSED — All 6 modules implemented, their test files unskipped and passing

---

## Phase 3: JS→TS Conversion (P1 — HIGH priority, large effort)

- [x] W-A [P1] Convert `vector-index-impl.js` to TypeScript (`mcp_server/lib/search/vector-index-impl.ts`, 3,376 lines) — approach: incremental — extract pure-logic functions first (scoring, query builders), convert those, leave DB/native-module parts for last; companion `.d.ts` file existed (9.5 KB) and was deleted after conversion; `vector-index.ts` facade (16 KB) wraps it; **RISK: HIGH** — this is the core search engine, needs thorough testing → CHK-P3a
- [x] W-A.1 [P1] Remove CJS shim files after vector-index-impl.js conversion — `embeddings.js` deleted; other shims (`format-helpers.js`, `path-security.js`, `logger.js`, `config.js`) retained as still needed → CHK-P3b
- [x] W-B [P1] Convert `learning/corrections.js` to TypeScript (`mcp_server/lib/learning/corrections.ts`, 702 lines) — second-largest unconverted JS file; no companion `.d.ts` existed → CHK-P3c
- [x] W-B.1 [P1] Convert `lib/search/vector-store.js` to TypeScript — third JS source file discovered during Phase 3 → CHK-P3d

**Phase Gate**: ✅ PASSED — All JS source files converted, `embeddings.js` CJS bridge deleted, `vector-index-impl.d.ts` deleted, 0 test failures, `tsc --noEmit` clean

---

## Phase 4: Type Hardening (P1 — HIGH priority, emerged during Phase 3)

- [x] W-Q [P1] Remove `@ts-nocheck` from `vector-index-impl.ts` and fix all type errors — 281 type errors fixed across the 3,376-line file; added proper interfaces, type guards, and explicit typing throughout → CHK-P4a

**Phase Gate**: ✅ PASSED — 0 `@ts-nocheck` in source files, 0 tsc errors, 0 test failures

---

## Phase 5: External Dependencies (P3 — OUT OF SCOPE, documented only)

- [B] W-N [P3] `api-key-validation.vitest.ts` (6 tests) — blocked: imports from `../../shared/dist/embeddings/factory`; needs shared package; action: document dependency, enable when shared package is available
- [B] W-O [P3] `api-validation.vitest.ts` (12 tests) — blocked: same shared package dependency; action: document dependency
- [B] W-P [P3] `lazy-loading.vitest.ts` (6 tests) — blocked: imports from `../../shared/dist/embeddings`; action: document dependency
- [B] W-R [P3] `embedding-integration.vitest.ts` — blocked: same shared package dependency; action: document dependency

**Phase Gate**: Blockers documented, skip reasons annotated in test files

---

## Completion Criteria

- [x] All tasks marked `[x]` (except Phase 5 blocked items)
- [x] No `[B]` blocked tasks remaining (except documented external dependencies)
- [x] Full vitest suite: 0 failures — 3,872 tests passing across 114 test files
- [x] TypeScript build: 0 errors — `tsc --noEmit` clean
- [x] 0 JS source files remaining in `mcp_server/lib/`
- [x] 0 `@ts-nocheck` in source files (86 remain in test files — out of scope)
- [x] All P0 checklist items verified

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Parent Spec**: `003-memory-and-spec-kit/104-spec-kit-test-and-type-cleanup`

---

## L2: TASK-CHECKLIST MAPPING

| Task ID | Checklist Item | Priority | Status |
|---------|----------------|----------|--------|
| W-I | CHK-P1a | P3 | [x] |
| W-J | CHK-P1b | P3 | [x] |
| W-K | CHK-P1c | P3 | [x] |
| W-L | CHK-P1d | P3 | [x] |
| W-M | CHK-P1e | P3 | [x] |
| W-C | CHK-P2a | P2 | [x] |
| W-D | CHK-P2b | P2 | [x] |
| W-E | CHK-P2c | P2 | [x] |
| W-F | CHK-P2d | P2 | [x] |
| W-G | CHK-P2e | P2 | [x] |
| W-H | CHK-P2f | P2 | [x] |
| W-A | CHK-P3a | P1 | [x] |
| W-A.1 | CHK-P3b | P1 | [x] |
| W-B | CHK-P3c | P1 | [x] |
| W-B.1 | CHK-P3d | P1 | [x] |
| W-Q | CHK-P4a | P1 | [x] |

---

## L2: PHASE COMPLETION GATES

### Gate 1: Quick Wins Complete
- [x] All 3 test file fixes applied and tests passing
- [x] TS5055 dist/ import warnings resolved
- [x] learning/index.js converted to .ts

### Gate 2: Modules Complete
- [x] All 6 modules implemented
- [x] Each module's test file unskipped and passing
- [x] No regressions in existing tests

### Gate 3: JS→TS Conversion Complete
- [x] vector-index-impl.js fully converted to TypeScript
- [x] `embeddings.js` CJS bridge removed; `vector-index-impl.d.ts` deleted
- [x] corrections.js fully converted to TypeScript
- [x] vector-store.js fully converted to TypeScript
- [x] `tsc --noEmit` clean
- [x] Full vitest suite: 0 failures

### Gate 4: Type Hardening Complete
- [x] `@ts-nocheck` removed from vector-index-impl.ts
- [x] 281 type errors fixed
- [x] 0 tsc errors, 3,872 tests passing

---

## L2: BLOCKED TASK TRACKING

| Task ID | Blocker | Impact | Resolution |
|---------|---------|--------|------------|
| W-N | shared package not available | Low — 6 tests remain skipped | Enable when shared package is built |
| W-O | shared package not available | Low — 12 tests remain skipped | Enable when shared package is built |
| W-P | shared package not available | Low — 6 tests remain skipped | Enable when shared package is built |
| W-R | shared package not available | Low — tests remain skipped | Enable when shared package is built |

---
