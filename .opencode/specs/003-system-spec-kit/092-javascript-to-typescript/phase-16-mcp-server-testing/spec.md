# Feature Specification: MCP Server Comprehensive Testing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.0 -->

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-02-07 |
| **Branch** | `092-javascript-to-typescript` |
| **Parent Spec** | `092-javascript-to-typescript` |
| **MCP Server Version** | v1.7.2 |

---

## 2. PROBLEM & PURPOSE

### Problem Statement

The Spec Kit Memory MCP Server (v1.7.2) provides 22 tools across 9 handler modules, backed by a sophisticated cognitive memory system with 12+ modules covering search, scoring, session learning, causal graphs, and checkpoints. Following the JavaScript-to-TypeScript migration (phases 0-14), the entire test suite needs comprehensive execution and validation to confirm that all compiled TypeScript tests (60+) and standalone JavaScript tests (~20) pass, and that the MCP server functions correctly end-to-end. Without a structured testing phase, regressions from the migration could go undetected.

### Purpose

Validate that all 80+ test files across the MCP server test suite pass successfully, covering all 22 MCP tools, 12+ cognitive memory modules, hybrid search system, 6-tier importance classification, causal memory graph, session learning, and checkpoint system -- confirming the TypeScript migration preserved full functional correctness.

---

## 3. SCOPE

### In Scope

- Execute all 60+ compiled TypeScript test files (`dist/tests/*.test.js`)
- Execute all ~20 standalone JavaScript test files (`tests/*.test.js`, `tests/test-*.js`)
- Validate all 22 MCP tools across 6 tool categories
- Test all 9 handler modules (memory-search, memory-triggers, memory-save, memory-crud, memory-index, checkpoints, session-learning, causal-graph, memory-context)
- Test all 12+ cognitive memory modules (FSRS, prediction error gating, tier classification, attention decay, co-activation, working memory, archival manager, consolidation, summary generator, temporal contiguity, corrections)
- Validate search system (hybrid FTS5 + vector + BM25 + RRF fusion, cross-encoder, intent classifier, fuzzy match, reranker)
- Validate scoring system (composite scoring, five-factor scoring, importance tiers, folder scoring, confidence tracker)
- Run 8 integration test pipelines
- Run 4 MCP protocol compliance tests
- Validate 5 memory commands alignment (context, continue, learn, manage, save)
- Document all test results with pass/fail/skip counts

### Out of Scope

- Writing new test cases - only executing existing tests
- Fixing source code bugs discovered during testing (tracked separately)
- Performance benchmarking beyond what existing tests cover
- Embedding API load testing (rate limits apply)
- Modifying test infrastructure or framework

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/tests/*.test.ts` (compiled) | Execute | 60+ compiled TypeScript tests |
| `mcp_server/tests/*.test.js` | Execute | ~20 standalone JavaScript tests |
| `mcp_server/tests/test-*.js` | Execute | 4 standalone integration test runners |
| `mcp_server/run-tests.js` | Execute | Master test runner |
| This spec folder | Create | Testing documentation and results |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All compiled TypeScript tests execute without import/module errors | 60+ test files load and run from `dist/tests/` |
| REQ-002 | All standalone JavaScript tests execute without import/module errors | ~20 test files load and run directly |
| REQ-003 | All 9 handler test files pass (handler-*.test.ts) | 9/9 handler modules validated |
| REQ-004 | All 8 integration test files pass | 8/8 integration pipelines validated |
| REQ-005 | All 4 MCP protocol tests pass | Protocol compliance confirmed |
| REQ-006 | Cognitive module tests pass (12+ modules) | FSRS, PE gate, tier classifier, attention decay, co-activation, working memory, archival, consolidation, summary generator, corrections, temporal contiguity all green |
| REQ-007 | Search and scoring tests pass | BM25, hybrid, RRF, cross-encoder, intent classifier, fuzzy match, composite scoring, five-factor, importance tiers, folder scoring all green |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Memory command alignment verified | 5 commands (context, continue, learn, manage, save) traced to handler implementations |
| REQ-009 | Test results documented with evidence | Pass/fail/skip counts per category recorded |
| REQ-010 | Quick mode validated | `--quick` flag properly skips embedding-dependent tests |
| REQ-011 | Storage module tests pass | access-tracker, checkpoints, causal-edges, incremental-index, transaction-manager all green |

---

## 5. SUCCESS CRITERIA

- **SC-001**: All 80+ test files execute without module resolution errors
- **SC-002**: Overall pass rate >= 95% across all test categories
- **SC-003**: Zero P0 failures (all handler, integration, and MCP protocol tests pass)
- **SC-004**: All 9 test categories (A-I) have at least one passing test
- **SC-005**: Test results documented with per-category pass/fail/skip counts

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | TypeScript compilation (phases 0-14 complete) | Tests cannot run if `dist/` is stale | Run `npm run build` before testing |
| Dependency | better-sqlite3 package | Database tests fail without it | Verify `node_modules` present |
| Dependency | Voyage API key for embedding tests | Embedding-dependent tests skip | Use `--quick` mode, document skips |
| Risk | Flaky tests from timing/order dependency | Intermittent failures | Re-run failed tests individually |
| Risk | Database state from prior test runs | Stale data causes false failures | Use clean test database or fixtures |

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Individual test files complete within 30 seconds each
- **NFR-P02**: Full test suite completes within 15 minutes

### Reliability
- **NFR-R01**: Test results are deterministic (same pass/fail on re-run)
- **NFR-R02**: No test pollution between test files (isolated state)

### Compatibility
- **NFR-C01**: Tests run on Node.js 18+ (project minimum)
- **NFR-C02**: Tests work with both normal and quick mode

---

## L2: EDGE CASES

### Data Boundaries
- Empty database: Tests that require seeded data must handle empty state gracefully
- Maximum memory entries: Stress tests for working memory capacity limits
- Invalid embeddings: Tests with missing or malformed vector data

### Error Scenarios
- Missing API key: Embedding tests should skip gracefully, not crash
- Corrupted database: Schema migration tests cover recovery paths
- Module not found: Compilation errors caught before test execution

### State Transitions
- Test isolation: Each test file manages its own setup/teardown
- Database cleanup: Tests using shared database must not leak state

---

## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | 80+ test files, 9 handler modules, 12+ cognitive modules |
| Risk | 10/25 | Read-only testing (no code changes), low regression risk |
| Research | 5/20 | Test structure well-documented in README.md |
| **Total** | **35/70** | **Level 2** |

---

## 7. OPEN QUESTIONS

- Are there any known flaky tests that should be excluded from the pass rate calculation?
- Should embedding-dependent test skips count toward the 95% pass rate target?
- Is the Voyage API key available in the current environment for full test execution?

---

## Cross-References

- **Plan**: See [plan.md](plan.md) for execution approach
- **Tasks**: See [tasks.md](tasks.md) for task breakdown
- **Checklist**: See [checklist.md](checklist.md) for verification checklist
- **Test README**: See `mcp_server/tests/README.md` for test suite documentation
- **Parent Spec**: See `../spec.md` for the overall TypeScript migration specification
