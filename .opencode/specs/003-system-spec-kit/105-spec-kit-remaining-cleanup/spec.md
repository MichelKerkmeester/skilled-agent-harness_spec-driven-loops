# Feature Specification: Spec Kit Remaining Cleanup — JS→TS Conversion, Unimplemented Modules & Test Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-11 |
| **Branch** | `105-spec-kit-remaining-cleanup` |
| **Parent Spec** | `003-memory-and-spec-kit/104-spec-kit-test-and-type-cleanup` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
Spec 104 completed the major vitest migration and type unification, but discovered additional work items that were out of scope: 9 remaining JavaScript source files need TypeScript conversion, 6 modules have test files but no implementation, 3 test files have quick-fix issues, and 3 test files depend on an external `shared` package.

### Purpose
Complete the remaining cleanup work identified during Spec 104: convert remaining JavaScript source files to TypeScript, implement missing modules that have test files waiting, fix quick test issues, and document external dependency blockers — reducing the skipped test count from 278 toward zero.

---

## 3. SCOPE

### In Scope
- JS→TS conversion of remaining source files (vector-index-impl.js, corrections.js, index.js)
- Removal of 5 CJS shim files after vector-index-impl.js conversion
- Implementation of 6 missing modules (retry, entity-scope, history, index-refresh, temporal-contiguity, reranker)
- Fix quick test issues (duplicate declarations, export mismatches, API rewrites)
- Fix 14 dist/ import paths causing TS5055 warnings

### Out of Scope
- External `shared` package dependencies (api-key-validation, api-validation, lazy-loading) — documented only
- New feature development
- Architectural changes to existing modules

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/vector-index-impl.js` | Modify→Convert | Convert 3,376-line JS to TypeScript |
| `mcp_server/lib/learning/corrections.js` | Modify→Convert | Convert 702-line JS to TypeScript |
| `mcp_server/lib/learning/index.js` | Modify→Convert | Convert 14-line barrel export to TS |
| `mcp_server/lib/utils/retry.ts` | Create | Implement retry utilities (74 tests waiting) |
| `mcp_server/lib/parsing/entity-scope.ts` | Create | Implement context type detection (19 tests) |
| `mcp_server/lib/storage/history.ts` | Create | Implement memory audit trail (12 tests) |
| `mcp_server/lib/storage/index-refresh.ts` | Create | Implement incremental re-indexing (14 tests) |
| `mcp_server/lib/cognitive/temporal-contiguity.ts` | Create | Implement time-based association (10 tests) |
| `mcp_server/lib/search/reranker.ts` | Create | Implement cross-encoder reranking (5 tests) |
| `mcp_server/lib/search/format-helpers.js` | Delete | CJS shim — remove after vector-index-impl.js conversion |
| `mcp_server/lib/search/path-security.js` | Delete | CJS shim — remove after conversion |
| `mcp_server/lib/search/logger.js` | Delete | CJS shim — remove after conversion |
| `mcp_server/lib/search/config.js` | Delete | CJS shim — remove after conversion |
| `mcp_server/lib/search/embeddings.js` | Delete | CJS shim — remove after conversion |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All existing vitest tests continue passing | `vitest run` shows 0 failures |
| REQ-002 | TypeScript build remains clean | `tsc --noEmit` shows 0 errors |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | vector-index-impl.js converted to TypeScript | `.js` file removed, `.ts` file passes all existing tests |
| REQ-004 | corrections.js converted to TypeScript | `.js` file removed, `.ts` file passes all existing tests |
| REQ-005 | CJS shim files removed | 5 shim files deleted, no import breakage |

### P2 - Desired

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | All 6 missing modules implemented | Each module passes its existing test file |
| REQ-007 | Quick-fix test files enabled | 3 test files unskipped and passing |
| REQ-008 | TS5055 warnings eliminated | No dist/ imports in test files |

---

## 5. SUCCESS CRITERIA

- **SC-001**: Skipped test count reduced from 278 to < 100
- **SC-002**: All remaining `.js` source files converted to TypeScript (excluding external dependency blockers)
- **SC-003**: All 6 unimplemented modules have working implementations passing their test suites

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | vector-index-impl.js is 3,376 lines — core search engine | High — regression could break all search | Incremental conversion; extract pure functions first; extensive test coverage already exists |
| Risk | Missing modules may need API adjustments vs test expectations | Medium — tests may need updating too | Review test expectations before implementing |
| Dependency | `shared` package for 3 blocked test files | Low — documented as out of scope | Skip and document; enable when package available |
| Dependency | Companion `.d.ts` file for vector-index-impl | Low — already exists (9.5 KB) | Use as type reference during conversion |

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No performance regression in vector search operations after JS→TS conversion
- **NFR-P02**: New module implementations should match test performance expectations

### Reliability
- **NFR-R01**: 0 test failures after each phase completion
- **NFR-R02**: Incremental conversion approach — working state maintained at each step

---

## L2: EDGE CASES

### Conversion Risks
- CJS `require()` calls in vector-index-impl.js: Must be converted to ESM imports
- Dynamic requires: May need special handling for native modules
- Circular dependencies: Check for circular imports between shim files

### Module Implementation
- retry.ts: Circuit breaker edge cases (half-open state, concurrent requests)
- temporal-contiguity.ts: Time boundary conditions (memories at exact same timestamp)
- reranker.ts: Empty result set handling

---

## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | 14+ files changed, 4,000+ LOC converted, 6 new modules |
| Risk | 15/25 | Core search engine conversion is high-risk |
| Research | 5/20 | Most work is well-defined; test files serve as specs |
| **Total** | **40/70** | **Level 2** |

---

## 7. OPEN QUESTIONS

- Should vector-index-impl.js conversion be its own sub-spec given its size and risk?
- Are the test expectations in the 6 unimplemented module test files accurate and up-to-date?
- Should CJS shim removal happen in a separate commit from the vector-index-impl conversion?

---
