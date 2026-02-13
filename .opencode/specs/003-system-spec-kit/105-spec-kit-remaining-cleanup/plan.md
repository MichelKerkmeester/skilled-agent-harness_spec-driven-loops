# Implementation Plan: Spec Kit Remaining Cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (converting from JavaScript) |
| **Framework** | Spec Kit Memory MCP Server |
| **Storage** | SQLite (better-sqlite3) |
| **Testing** | Vitest (118 test files, 3,663 passing) |

### Overview
Complete remaining cleanup from Spec 104's vitest migration. This involves four phases: quick-fix test issues, implementing 6 missing modules whose test files already exist, converting the 2 largest remaining JS files to TypeScript (including the 3,376-line core search engine), and documenting external dependency blockers. The work is structured from lowest-risk/highest-value to highest-risk to minimize disruption.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable (skipped test reduction, JS file elimination)
- [x] Dependencies identified (shared package = out of scope)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 through REQ-008)
- [ ] Tests passing — 0 failures, skipped count < 100
- [ ] Docs updated (spec/plan/tasks/implementation-summary)

---

## 3. ARCHITECTURE

### Pattern
Modular library architecture — each module is an independent unit with its own test file.

### Key Components
- **vector-index-impl**: Core search engine (JS→TS conversion target)
- **learning/corrections**: Learning subsystem (JS→TS conversion target)
- **6 new modules**: retry, entity-scope, history, index-refresh, temporal-contiguity, reranker

### Data Flow
No architectural changes — all modules fit into existing import/export patterns. New modules implement interfaces already defined by their test files.

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Quick Wins (P3 — LOW priority, ~89 tests unblocked)
- [ ] Fix memory-save-extended.vitest.ts duplicate `const` declarations (51 tests)
- [ ] Fix trigger-matcher.vitest.ts export mismatch (19 tests)
- [ ] Rewrite scoring.vitest.ts for composite-scoring.ts API (19 tests)
- [ ] Fix 14 dist/ imports causing TS5055 warnings
- [ ] Convert learning/index.js barrel export (14 lines)

**Phase Gate**: All quick-fix tests passing, TS5055 warnings resolved

### Phase 2: Unimplemented Modules (P2 — MEDIUM priority, ~134 tests)
- [ ] Create lib/utils/retry.ts (74 tests waiting)
- [ ] Create lib/parsing/entity-scope.ts (19 tests)
- [ ] Create lib/storage/history.ts (12 tests)
- [ ] Create lib/storage/index-refresh.ts (14 tests)
- [ ] Create lib/cognitive/temporal-contiguity.ts (10 tests)
- [ ] Create lib/search/reranker.ts (5 tests)

**Phase Gate**: All 6 modules implemented, their test files unskipped and passing

### Phase 3: JS→TS Conversion (P1 — HIGH priority, large effort)
- [ ] Convert vector-index-impl.js to TypeScript (3,376 lines) — incremental approach
  - Extract pure-logic functions (scoring, query builders) and convert first
  - Convert DB/native-module interaction code second
  - Use existing `.d.ts` companion file as type reference
- [ ] Remove 5 CJS shim files (format-helpers.js, path-security.js, logger.js, config.js, embeddings.js)
- [ ] Convert learning/corrections.js to TypeScript (702 lines)

**Phase Gate**: All JS source files converted, CJS shims removed, 0 test failures

### Phase 4: External Dependencies (P3 — OUT OF SCOPE, documented only)
- [ ] Document api-key-validation.vitest.ts dependency on shared package
- [ ] Document api-validation.vitest.ts dependency on shared package
- [ ] Document lazy-loading.vitest.ts dependency on shared package

**Phase Gate**: Blockers documented with clear enablement criteria

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | All existing vitest test files | Vitest |
| Regression | Full test suite after each phase | `npx vitest run` |
| Type Check | TypeScript compilation | `npx tsc --noEmit` |
| Integration | Search functionality after vector-index-impl conversion | Existing integration tests |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| shared package (embeddings) | External | Red | 3 test files remain skipped (24 tests) |
| vector-index-impl.d.ts | Internal | Green | Type surface already defined |
| vector-index.ts facade | Internal | Green | Wraps impl, provides stable API |

---

## 7. ROLLBACK PLAN

- **Trigger**: Test failures after conversion, search regression
- **Procedure**: Git revert to pre-conversion commit; JS files are version-controlled

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Quick Wins) ────────────────────────────────────────────┐
                                                                  │
Phase 2 (Unimplemented Modules) ─── independent ────────────────├──► Phase Gate: Full Suite
                                                                  │
Phase 3 (JS→TS Conversion) ─────── independent of 1 & 2 ───────┘
                                                                  
Phase 4 (External) ──── independent, documentation only
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (Quick Wins) | None | None (independent) |
| Phase 2 (Modules) | None | None (independent) |
| Phase 3 (JS→TS) | None | CJS shim removal |
| Phase 4 (External) | None | None (out of scope) |

Note: Phases 1-3 are independent and can be worked in any order. Phase ordering reflects risk/value optimization (quickest wins first).

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Quick Wins | Low | 1-2 hours |
| Phase 2: Unimplemented Modules | Medium | 4-8 hours |
| Phase 3: JS→TS Conversion | High | 8-16 hours |
| Phase 4: Documentation | Low | 0.5 hours |
| **Total** | | **13.5-26.5 hours** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Git commit before each phase begins
- [ ] Full test suite run before and after each phase
- [ ] TypeScript compilation verified at each step

### Rollback Procedure
1. Identify which phase introduced the regression
2. `git revert` to the last known-good commit
3. Run full test suite to confirm clean state
4. Re-attempt with more granular changes

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — pure code changes only

---
