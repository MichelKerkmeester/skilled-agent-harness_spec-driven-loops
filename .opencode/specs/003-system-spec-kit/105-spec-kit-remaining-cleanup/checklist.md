# Verification Checklist: Spec Kit Remaining Cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
| **[P3]** | Low | Can defer freely |

---

## Phase 1 — Quick Wins

- [x] CHK-P1a [P3] W-I — Fix memory-save-extended.vitest.ts — removed duplicate const declarations, removed @ts-nocheck, unskipped (30 passed, 12 skipped within file)
- [x] CHK-P1b [P3] W-J — Fix trigger-matcher.vitest.ts — added vi.mock for vector-index DB dependency, proper static imports (19/19 passed)
- [x] CHK-P1c [P3] W-K — Rewrite scoring.vitest.ts — 21 real tests targeting composite-scoring.ts API (21/21 passed)
- [x] CHK-P1d [P3] W-L — Fix 14 dist/ imports across 6 test files (all passing, 0 TS5055 warnings)
- [x] CHK-P1e [P3] W-M — Convert learning/index.js to index.ts (`import = require` + `export =` for CJS compat)

---

## Phase 2 — Unimplemented Modules

- [ ] CHK-P2a [P2] W-C — Create lib/utils/retry.ts (74 tests passing)
- [ ] CHK-P2b [P2] W-D — Create lib/parsing/entity-scope.ts (19 tests passing)
- [ ] CHK-P2c [P2] W-E — Create lib/storage/history.ts (12 tests passing)
- [ ] CHK-P2d [P2] W-F — Create lib/storage/index-refresh.ts (14 tests passing)
- [ ] CHK-P2e [P2] W-G — Create lib/cognitive/temporal-contiguity.ts (10 tests passing)
- [ ] CHK-P2f [P2] W-H — Create lib/search/reranker.ts (5 tests passing)

---

## Phase 3 — JS→TS Conversion

- [ ] CHK-P3a [P1] W-A — Convert vector-index-impl.js to TypeScript (3,376 lines)
- [ ] CHK-P3b [P1] W-A.1 — Remove 5 CJS shim files after vector-index-impl.js conversion
- [ ] CHK-P3c [P1] W-B — Convert learning/corrections.js to TypeScript (702 lines)

---

## Phase 4 — External Dependencies (Out of Scope)

- [ ] CHK-P4a [P3] W-N — api-key-validation.vitest.ts — blocked on shared package (6 tests)
- [ ] CHK-P4b [P3] W-O — api-validation.vitest.ts — blocked on shared package (12 tests)
- [ ] CHK-P4c [P3] W-P — lazy-loading.vitest.ts — blocked on shared package (6 tests)

---

## Global Verification

- [ ] CHK-V01 [P0] All vitest tests pass (0 failures) — `npx vitest run`
- [ ] CHK-V02 [P0] TypeScript build clean (0 errors) — `npx tsc --noEmit`
- [ ] CHK-V03 [P1] Skipped test count reduced from 278 to < 100
- [ ] CHK-V04 [P1] No remaining `.js` source files (except blocked external deps)
- [ ] CHK-V05 [P1] implementation-summary.md created with final metrics

---

## Documentation

- [ ] CHK-D01 [P1] spec/plan/tasks synchronized with final state
- [ ] CHK-D02 [P2] Memory context saved for future sessions

---

## File Organization

- [ ] CHK-F01 [P1] Temp files in scratch/ only
- [ ] CHK-F02 [P1] scratch/ cleaned before completion
- [ ] CHK-F03 [P2] Findings saved to memory/

---

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 2 | 0/2 |
| P1 Items | 7 | 0/7 |
| P2 Items | 8 | 0/8 |
| P3 Items | 8 | 5/8 |

**Verification Date**: _pending_

---
