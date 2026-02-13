<!-- SPECKIT_LEVEL: 3 -->
# Feature Specification: Phase 18 -- Comprehensive Post-Migration Testing

<!-- SPECKIT_TEMPLATE_SOURCE: spec | v2.0 -->

---

## EXECUTIVE SUMMARY

Phase 18 validates the JavaScript-to-TypeScript migration of the `system-spec-kit` skill by executing all 13+ existing test suites across scripts/, shared/, and templates/ directories and performing coverage gap analysis. The migration spans 54 TypeScript source files (~14,280 LOC) across 3 workspaces, and this phase ensures correctness, identifies failing tests that need path updates, and documents untested modules. This is a testing-only phase with no source code changes -- all findings feed into future remediation phases.

**Key Decisions**: Test against compiled dist/ output (not raw .ts sources) to validate actual runtime behavior (ADR-001); Classify test failures into 3 categories: path-resolution, behavioral regression, missing coverage (ADR-002)

**Critical Dependencies**: Compiled dist/ directories must be current (validated by Agent 7 -- all 55 dist files up to date as of 2026-02-07)

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete (Session 2 regressions documented) |
| **Created** | 2026-02-07 |
| **Branch** | `092-javascript-to-typescript` |
| **Estimated LOC** | 0 (testing only -- no source modifications) |
| **Parent Spec** | `092-javascript-to-typescript` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
The system-spec-kit skill has been migrated from JavaScript to TypeScript across three directories (scripts/, shared/, templates/). While TypeScript compilation passes cleanly (`tsc --noEmit` exit code 0 for both scripts/ and shared/), the existing test suites -- written in JavaScript, Python, and Bash -- have not been systematically executed against the migrated codebase. Many test files use `require()` to load modules from pre-migration paths (e.g., `scripts/extractors/collect-session-data` instead of `scripts/dist/extractors/collect-session-data`), causing wholesale module-not-found failures. Without a comprehensive test execution and gap analysis, there is no confidence that the migration preserved behavioral correctness.

### Purpose
Execute every existing test suite, categorize all failures by root cause, identify untested modules, and produce an actionable gap analysis that informs future remediation work -- resulting in a clear map of what passes, what fails (and why), and what has no test coverage at all.

---

## 3. SCOPE

### In Scope
- Full execution of all 13+ test files in `scripts/tests/`
- TypeScript compilation verification (`tsc --noEmit`) for scripts/ and shared/
- Dist freshness validation (compiled output newer than source)
- Python test execution (`test_dual_threshold.py`)
- Shell validation test execution (`test-validation.sh`, `test-validation-extended.sh`)
- Source code audit of scripts/ (42 .ts files, ~10,443 LOC)
- Source code audit of shared/ (12 .ts files, ~3,837 LOC)
- Source code audit of templates/ (67 files, ~11,658 lines)
- Test result classification: path-resolution vs behavioral vs missing-coverage
- Coverage gap analysis: identifying modules with no test coverage
- Export contract verification across all barrel files

### Out of Scope
- Fixing failing tests -- deferred to Phase 19+
- Writing new tests for uncovered modules -- deferred to Phase 19+
- Modifying TypeScript source code -- this is read-only analysis
- MCP server (mcp_server/) testing -- separate workspace, separate phase
- Performance benchmarking -- not in scope for correctness testing
- Updating test file require paths from .js to dist/ -- remediation phase

### Files in Scope

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/tests/test-scripts-modules.js` | Execute | 384 tests covering 43 module groups in scripts/dist/ |
| `scripts/tests/test-extractors-loaders.js` | Execute | 12 tests for extractor and loader module loading |
| `scripts/tests/test-integration.js` | Execute | 23 end-to-end workflow tests |
| `scripts/tests/test-template-comprehensive.js` | Execute | 154 template system tests |
| `scripts/tests/test-template-system.js` | Execute | 95 template verification tests |
| `scripts/tests/test-bug-fixes.js` | Execute | 27 bug fix verification tests |
| `scripts/tests/test-bug-regressions.js` | Execute | 3 regression tests |
| `scripts/tests/test-export-contracts.js` | Execute | 17 export contract tests |
| `scripts/tests/test-naming-migration.js` | Execute | 6 naming convention tests |
| `scripts/tests/test-embeddings-factory.js` | Execute | 7 embeddings factory tests |
| `scripts/tests/test-five-checks.js` | Execute | Five Checks validation tests |
| `scripts/tests/test-validation-system.js` | Execute | Validation system tests |
| `scripts/tests/test-validation.sh` | Execute | 55 shell validation tests |
| `scripts/tests/test-validation-extended.sh` | Execute | 129 extended validation tests |
| `scripts/tests/test_dual_threshold.py` | Execute | 71 Python dual-threshold tests |
| `scripts/core/*.ts` | Audit | 3 files, ~883 LOC |
| `scripts/extractors/*.ts` | Audit | 8 files, ~3,410 LOC |
| `scripts/lib/*.ts` | Audit | 10 files, ~2,875 LOC |
| `scripts/loaders/*.ts` | Audit | 2 files, ~187 LOC |
| `scripts/memory/*.ts` | Audit | 3 files, ~828 LOC |
| `scripts/renderers/*.ts` | Audit | 2 files, ~210 LOC |
| `scripts/spec-folder/*.ts` | Audit | 4 files, ~830 LOC |
| `scripts/utils/*.ts` | Audit | 10 files, ~1,220 LOC |
| `shared/*.ts` | Audit | 12 files, ~3,837 LOC |
| `templates/**/*.md` | Audit | 67 files, ~11,658 lines |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Execute all 13+ test suites and capture results | Every test file run; pass/fail/skip counts recorded per suite |
| REQ-002 | TypeScript compilation passes for scripts/ and shared/ | `tsc --noEmit` exits 0 for both workspaces |
| REQ-003 | Compiled dist/ output is current | All dist/*.js files have timestamps newer than corresponding .ts sources |
| REQ-004 | Classify every test failure by root cause | Each failure tagged as: path-resolution, behavioral-regression, or missing-feature |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Source code audit of scripts/ (42 .ts files) | Directory structure, LOC counts, export contracts, type quality, issues documented |
| REQ-006 | Source code audit of shared/ (12 .ts files) | Same audit criteria as REQ-005 |
| REQ-007 | Source code audit of templates/ (67 files) | Structure, CORE+ADDENDUM architecture, progressive enhancement, cross-references verified |
| REQ-008 | Coverage gap analysis | List of modules with zero test coverage identified |
| REQ-009 | Export contract verification | All barrel files (index.ts) verified; all package.json exports resolve to existing dist files |

---

## 5. SUCCESS CRITERIA

- **SC-001**: All 15 test files executed with results captured (pass/fail/skip counts per suite)
- **SC-002**: TypeScript compilation clean for scripts/ (43 files) and shared/ (12 files)
- **SC-003**: Test failure root causes classified into actionable categories with counts per category
- **SC-004**: Source code audits completed for all 3 directories with issues ranked by severity
- **SC-005**: Coverage gap matrix produced showing tested vs untested modules

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Compiled dist/ must be current | Stale dist = false test failures | Verify dist freshness before test execution |
| Dependency | Node.js v25.2.1 runtime | Tests require CommonJS module loading | Already validated in environment |
| Dependency | Python 3.9.6 + pytest 8.4.2 | Required for dual-threshold tests | Already installed and validated |
| Risk | Symlink resolution across tools | `find` without `-L` cannot discover files through `.opencode/` symlink | Use `-L` flag or resolve paths manually |
| Risk | Embedding model tests require model loading | 4 tests always skip without loaded model | Document as expected skips, not failures |
| Risk | Test count may increase as suites are discovered | Scope of gap analysis grows | Cap at known test files in scripts/tests/ |

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Full test suite execution completes within 5 minutes (measured: ~2 minutes total across all suites)
- **NFR-P02**: TypeScript compilation completes within 30 seconds per workspace

### Reliability
- **NFR-R01**: Test results are deterministic -- re-running produces identical pass/fail counts
- **NFR-R02**: Tests that require external resources (embedding model, API keys) are properly skipped, not failed

### Quality
- **NFR-Q01**: Source code audits cover all exported functions and types
- **NFR-Q02**: Zero `any` type usage confirmed across all TypeScript source files

---

## 8. EDGE CASES

### Data Boundaries
- Empty test suites: `test-utils.js` is a utility module (0 tests) -- handle as utility, not test runner
- Skipped tests: 4 embedding model tests legitimately require model loading -- classify as expected skips
- Module-not-found errors: Tests referencing pre-migration paths produce 100% failure -- classify as path-resolution, not behavioral

### Error Scenarios
- Symlink resolution failure: `.opencode/` symlink to Public repo may not resolve with all tools -- use resolved absolute paths
- Shell test timing: `test-validation.sh` takes ~25s, `test-validation-extended.sh` takes ~30s -- allow adequate timeout
- Compiled output missing: If dist/ is missing for any module, all import-based tests for that module fail -- verify dist freshness first

### Concurrent Operations
- Test suites are independent and can run in parallel by language (JS, Python, Bash)
- Shell validation tests create temporary fixtures in `.test-workspace/` -- cleanup verified

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: 54 .ts + 67 .md + 15 test files = 136 total; LOC: ~14,280 TS + ~11,658 templates; Systems: 3 directories |
| Risk | 10/25 | Auth: N, API: N (embeddings skipped), Breaking: N (read-only) |
| Research | 14/20 | Deep audit of 3 workspaces required; export contract tracing across barrel files |
| Multi-Agent | 12/15 | 10 parallel agents dispatched (Agents 1-10) across different audit domains |
| Coordination | 8/15 | Cross-references between test results and source audits; failure classification requires audit context |
| **Total** | **62/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Path-resolution failures dominate results, obscuring real behavioral regressions | H | H | Classify failures first, analyze behavioral issues separately |
| R-002 | Undiscovered test files exist outside scripts/tests/ | M | L | Glob for `*.test.*`, `test-*`, `test_*` patterns across entire skill directory |
| R-003 | Test fixtures are outdated (reference pre-migration file structure) | M | H | Document fixture staleness as finding, do not attempt to fix in this phase |
| R-004 | Source audit findings create pressure to fix issues immediately | M | M | Strict scope discipline: document only, defer all fixes to future phases |
| R-005 | Validation shell tests have SECTION_COUNTS expectation mismatches | L | H | Root cause documented (test expectation mismatch, not validator bug); 129/129 extended tests pass |

---

## 11. USER STORIES

### US-001: Execute All Test Suites (Priority: P0)

**As a** developer maintaining the system-spec-kit skill, **I want** all existing test suites executed against the migrated TypeScript codebase, **so that** I have a complete picture of what works and what is broken after the migration.

**Acceptance Criteria**:
1. Given 15 test files exist in scripts/tests/, When each is executed with the appropriate runner (node/pytest/bash), Then pass/fail/skip counts are recorded for every suite
2. Given a test fails with "Cannot find module", When the failure is analyzed, Then it is classified as "path-resolution" (not behavioral regression)
3. Given 4 embedding model tests are skipped, When results are reported, Then these are documented as "expected skips" with rationale

### US-002: Source Code Quality Audit (Priority: P1)

**As a** developer planning future migration phases, **I want** a thorough quality audit of the migrated TypeScript code, **so that** I know where type safety issues, dead code, and architectural concerns exist.

**Acceptance Criteria**:
1. Given 42 TypeScript files in scripts/, When audited, Then each file's LOC, export contract, `any` usage, `as unknown as` casts, and error handling patterns are documented
2. Given 12 TypeScript files in shared/, When audited, Then the same quality metrics are documented plus cross-workspace import verification
3. Given the codebase uses `strict: true`, When compilation is verified, Then zero `any` types are confirmed across all source files

### US-003: Coverage Gap Analysis (Priority: P1)

**As a** developer planning test remediation, **I want** a matrix showing which modules have test coverage and which do not, **so that** I can prioritize writing new tests for untested code.

**Acceptance Criteria**:
1. Given 42 modules in scripts/, When cross-referenced with test-scripts-modules.js coverage, Then each module is marked as tested/untested
2. Given 12 modules in shared/, When cross-referenced with available tests, Then coverage gaps are documented (shared/ has no dedicated test suite)
3. Given 67 template files, When cross-referenced with template test results, Then the template test coverage percentage is documented

### US-004: Failure Classification (Priority: P0)

**As a** developer planning test remediation, **I want** every test failure classified by root cause, **so that** I can batch-fix path-resolution failures separately from behavioral regressions.

**Acceptance Criteria**:
1. Given test-extractors-loaders.js has 12/12 failures, When analyzed, Then all 12 are classified as "path-resolution" (Cannot find module at pre-migration path)
2. Given test-scripts-modules.js has 3/384 failures, When analyzed, Then each is classified as "behavioral-regression" (module loads but function missing/changed) or "missing-feature" (function not yet implemented in TS)
3. Given test-export-contracts.js has 16/17 failures, When analyzed, Then all 16 are classified as "path-resolution" (tests reference planned-but-not-executed directory restructuring)

---

## 12. OPEN QUESTIONS

- **RESOLVED**: Should tests be run against .ts source or compiled dist/? **Answer: dist/ (ADR-001) -- tests use require() which loads .js files**
- **RESOLVED**: Should test-validation.sh SECTION_COUNTS failures be treated as test bugs or validator bugs? **Answer: Test expectation mismatch (extended suite 129/129 passes confirm validator is correct)**
- **RESOLVED**: Are the 141 snake_case functions in dist/ a real issue? **Answer: No -- dist/ contains compiled output that retains source naming conventions; source files use intentional snake_case for backward compatibility**
- **OPEN**: Should shared/ have its own dedicated test suite? Currently has zero dedicated tests (only tested indirectly through scripts/ consumers and embeddings factory tests)
- **OPEN**: Should test-utils.js (utility module with 0 tests) be excluded from test count reporting?

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3 SPEC (~250 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
- Phase 18 of 092-javascript-to-typescript migration
-->
