<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: Spec Kit Test & Type Cleanup

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## EXECUTIVE SUMMARY

Spec 104 addresses the three categories of future work identified at the conclusion of Spec 103 (Final Audit): full Vitest migration of 104 test files from the custom test runner, simFactory type unification across extractor scripts, and build error cleanup in rank-memories.ts. These are the last remaining technical debt items in the system-spec-kit codebase after the comprehensive audit-to-remediation cycle of Spec 103.

**Key Decisions**: Vitest was validated as viable in Spec 103 (REC-015 POC: 3 files converted, 20/20 tests, 115ms). The simFactory type debt was intentionally documented as TECH-DEBT rather than fixed in Spec 103 (REC-020 Cluster B) because the cross-cutting refactor was out of scope for an audit spec.

**Critical Dependencies**: Vitest infrastructure already in place (vitest.config.ts, .vitest.ts naming convention, both runners coexist). No external dependencies.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-02-11 |
| **Branch** | `104-spec-kit-test-and-type-cleanup` |
| **Parent Spec** | 003-memory-and-spec-kit |
| **Predecessor** | 103-spec-kit-final-audit-post-typescript |
| **Workstreams** | 3 (A: Vitest Migration, B: simFactory Types, C: Build Errors) |

---

## 2. PROBLEM & PURPOSE

### Problem Statement

The system-spec-kit test suite uses a custom test runner (pass/fail/skip pattern) across 104 test files (~60,000 LOC). This custom runner lacks standard tooling: no coverage reports, no watch mode, no CI integration, no describe/it/expect structure. Additionally, 4 TECH-DEBT items in extractor scripts have simFactory types that should be unified with shared extractor types, and 3 pre-existing tsc errors in rank-memories.ts produce build warnings on every compilation.

### Purpose

Modernize the test infrastructure to Vitest (industry-standard, TS-native, fast), eliminate accepted tech debt in extractor types, and achieve a clean zero-error `tsc --build` across all project references — leaving the system-spec-kit codebase in a fully maintainable state.

---

## 3. SCOPE

### In Scope

- **[W:TEST]** Migrate all 104 test files from custom runner (.test.ts) to Vitest (.vitest.ts → .test.ts after migration)
- **[W:TEST]** Remove the custom test runner infrastructure after full migration
- **[W:TEST]** Verify all tests pass under Vitest with equivalent coverage
- **[W:TYPE]** Unify simFactory types with shared extractor types (4 TECH-DEBT items from REC-020 Cluster B)
- **[W:BUILD]** Fix 3 pre-existing tsc errors in `scripts/memory/rank-memories.ts` (NormalizedMemory to FolderMemoryInput cast)

### Out of Scope

- New test creation beyond what's needed for migration — existing test logic is preserved, not expanded
- Coverage target enforcement — coverage reporting becomes available after Vitest migration but specific targets are a future concern
- CI/CD pipeline setup — the migration enables CI integration but pipeline configuration is a separate spec
- Performance benchmarking of Vitest vs custom runner — the POC already validated performance (115ms for 20 tests)
- Any functional changes to the MCP server or CLI scripts — this is purely test infrastructure and type cleanup

### Files to Change

#### Workstream A — Vitest Migration

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/tests/*.test.ts` (104 files) | Modify | Convert from pass/fail/skip to describe/it/expect |
| `mcp_server/tests/*.vitest.ts` (3 POC files) | Rename | Rename back to .test.ts once old runner removed |
| `mcp_server/vitest.config.ts` | Modify | Update include patterns after full migration |
| `mcp_server/package.json` | Modify | Update test scripts, remove custom runner deps |
| Custom test runner files | Delete | Remove custom runner after all files migrated |

#### Workstream B — simFactory Type Unification

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/extractors/diagram-extractor.ts` | Modify | 2 TECH-DEBT items: unify simFactory types with shared extractor types |
| `scripts/extractors/collect-session-data.ts` | Modify | 1 TECH-DEBT item: simFactory type unification |
| `scripts/extractors/conversation-extractor.ts` | Modify | 1 TECH-DEBT item: simFactory type unification |
| `shared/types.ts` | Modify | Add or extend shared types for simFactory pattern if needed |

#### Workstream C — Build Error Cleanup

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/memory/rank-memories.ts` | Modify | Fix 3 tsc errors: NormalizedMemory to FolderMemoryInput cast |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | [W:TEST] All 104 test files converted to Vitest describe/it/expect pattern | `npx vitest run` executes all tests with zero failures |
| REQ-002 | [W:TEST] Custom test runner fully removed | No custom runner files remain; `npx vitest` is the sole test command |
| REQ-003 | [W:TEST] Test count parity maintained | Total test count after migration >= total before migration (currently 1,589 tests) |
| REQ-004 | [W:BUILD] Zero tsc errors on `npx tsc --build --force` | Build completes with exit code 0, no errors reported |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | [W:TYPE] All 4 simFactory TECH-DEBT items resolved with proper shared types | No TECH-DEBT comments remain in the 4 extractor files; types compile without casts |
| REQ-006 | [W:TEST] Vitest config updated for production use | vitest.config.ts includes patterns matching .test.ts (not .vitest.ts), coverage provider configured |
| REQ-007 | [W:TEST] Package.json test scripts updated | `npm test` runs `vitest run`, `npm run test:watch` runs `vitest --watch` |
| REQ-008 | [W:TEST] 3 POC .vitest.ts files integrated | The 3 existing .vitest.ts POC files (unit-rrf-fusion, unit-normalization, unit-fsrs-formula) renamed to .test.ts and included in main suite |

---

## 5. SUCCESS CRITERIA

- **SC-001**: `npx vitest run` from `mcp_server/` executes all tests (1,589+) and reports zero failures
- **SC-002**: `npx tsc --build --force` from project root completes with zero errors (currently 3 errors in rank-memories.ts)
- **SC-003**: No custom test runner code or infrastructure remains in the codebase
- **SC-004**: No TECH-DEBT comments related to simFactory types remain in extractor files
- **SC-005**: Coverage reporting is available via `npx vitest run --coverage` (numeric targets not enforced)

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Vitest POC infrastructure (vitest.config.ts, 3 POC files) | Already in place from Spec 103 REC-015 | Verified: vitest.config.ts exists, 3 .vitest.ts files pass |
| Dependency | @ts-nocheck removal (Spec 103 REC-012) | All 96 test files already strict-mode clean | Verified: completed in Spec 103 Phase C Wave 5 |
| Risk | Test behavior drift during migration | Medium — subtle assertion differences between custom runner and Vitest could mask regressions | Run old and new tests in parallel during migration; compare results per file before removing old version |
| Risk | DB-dependent tests may need Vitest-specific setup/teardown | Medium — ~50 tests use SQLite connections that need lifecycle management | Use Vitest beforeEach/afterEach hooks; leverage existing test DB setup patterns |
| Risk | Context server tests (4 files) are highest complexity | Low-Medium — these test the full MCP server stack and may need special Vitest configuration | Migrate these last; allocate dedicated session for investigation |
| Risk | simFactory type unification could cascade to unexpected consumers | Low — REC-020 Cluster B already investigated; 4 files are the complete scope | Types are internal to extractors; no external consumers identified |

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Vitest full suite execution time should be < 60 seconds (custom runner baseline not formally measured, but POC showed 20 tests in 115ms)
- **NFR-P02**: Individual test file execution time should not regress — no single file > 10 seconds

### Maintainability
- **NFR-M01**: All test files must follow consistent Vitest patterns (describe/it/expect) with no custom runner idioms remaining
- **NFR-M02**: Test file naming must follow .test.ts convention (no .vitest.ts files after migration)

### Reliability
- **NFR-R01**: Test suite must be deterministic — no flaky tests introduced by migration (run suite 3x to verify)
- **NFR-R02**: DB-dependent tests must properly isolate database state (no cross-test contamination)

### Developer Experience
- **NFR-D01**: `npx vitest --watch` must work for rapid development feedback
- **NFR-D02**: `npx vitest run --coverage` must produce a coverage report (HTML or text)

---

## 8. EDGE CASES

### Data Boundaries
- Empty test files: Any test file with zero assertions should be flagged during migration (not silently converted to a passing empty describe block)
- Skip markers: Tests using `skip()` in the custom runner must map to `it.skip()` in Vitest, preserving the skip intent

### Error Scenarios
- Partial migration state: The codebase must remain buildable and testable at every intermediate migration step (both runners coexist by design)
- DB connection failures in tests: Vitest setup hooks must handle SQLite open/close failures gracefully (match existing custom runner behavior)
- Import resolution differences: Vitest uses its own module resolution; verify all relative imports resolve correctly (especially cross-project-reference imports between shared/, mcp_server/, scripts/)

### Migration-Specific
- Assertion semantics: Custom runner `pass(condition, message)` maps to `expect(condition).toBe(true)` but more specific matchers (toEqual, toContain, etc.) should be preferred where the intent is clear
- Async test patterns: Custom runner may have implicit async handling; Vitest requires explicit async/await in test functions
- Test ordering: Custom runner may execute tests in file order; Vitest parallelizes by default — tests with implicit ordering dependencies must be identified and fixed

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: 110+, LOC: ~60,000 test + source, Systems: 3 (test framework, type system, build) |
| Risk | 14/25 | Auth: N, API: N, Breaking: Y (test runner replacement), Data: N |
| Research | 8/20 | POC completed in Spec 103; migration patterns established; no unknowns |
| Multi-Agent | 12/15 | Workstreams: 3, parallelizable tiers within Workstream A |
| Coordination | 10/15 | Dependencies: sequential tiers in W:A, W:B and W:C independent |
| **Total** | **66/100** | **Level 3 (elevated to 3+ due to multi-session scope and workstream coordination)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Test behavior drift during Vitest conversion causes silent regression | H | M | Run both runners in parallel per-file; compare assertion counts and outcomes |
| R-002 | DB-dependent tests (~50) fail under Vitest lifecycle hooks | M | M | Dedicate migration tier to DB tests; establish beforeEach/afterEach patterns in first file, then replicate |
| R-003 | Context server tests (4 files) require fundamentally different Vitest setup | M | L | Migrate last; investigate MCP test harness approaches; accept skip-and-revisit if needed |
| R-004 | simFactory type unification surfaces unexpected type errors in downstream code | L | L | REC-020 Cluster B already scoped the impact; changes are isolated to 4 extractor files |
| R-005 | Migration takes longer than estimated (3-5 sessions for W:A) | M | M | Tier-based approach allows incremental value; can pause after any tier with a working mixed-runner state |
| R-006 | Vitest version incompatibility with TypeScript project references | L | L | POC already validated; pin Vitest version used in POC |

---

## 11. USER STORIES

### US-001: Vitest Test Execution (Priority: P0)

**As a** developer working on system-spec-kit, **I want** all tests to run under Vitest with `npx vitest run`, **so that** I get standard tooling (coverage, watch mode, CI integration) and can use familiar describe/it/expect patterns.

**Acceptance Criteria**:
1. Given the mcp_server/ directory, When I run `npx vitest run`, Then all 1,589+ tests execute and pass
2. Given any test file, When I open it, Then it uses Vitest describe/it/expect patterns (no custom runner idioms)
3. Given the test suite, When I run `npx vitest run` 3 times consecutively, Then all runs produce identical results (deterministic)

### US-002: Clean Build (Priority: P0)

**As a** developer, **I want** `npx tsc --build --force` to complete with zero errors, **so that** build warnings don't obscure real issues introduced by future changes.

**Acceptance Criteria**:
1. Given the project root, When I run `npx tsc --build --force`, Then the exit code is 0 with no error output
2. Given rank-memories.ts, When I inspect the NormalizedMemory usage, Then it uses correct types without unsafe casts

### US-003: Coverage Reporting (Priority: P1)

**As a** developer, **I want** to generate test coverage reports via `npx vitest run --coverage`, **so that** I can identify untested code paths and make informed decisions about where to add tests.

**Acceptance Criteria**:
1. Given the migrated test suite, When I run `npx vitest run --coverage`, Then a coverage report is generated showing per-file line/branch/function coverage
2. Given the coverage report, When I review it, Then all source files in mcp_server/lib/ and mcp_server/handlers/ appear in the report

### US-004: simFactory Type Safety (Priority: P1)

**As a** developer, **I want** extractor scripts to use shared types instead of ad-hoc simFactory type workarounds, **so that** type safety is maintained without TECH-DEBT double-casts.

**Acceptance Criteria**:
1. Given the 4 extractor files, When I search for TECH-DEBT comments, Then zero results are found
2. Given the extractor files, When I run `npx tsc --noEmit`, Then no type errors are reported
3. Given the shared types, When I review them, Then simFactory output types are properly defined and reusable

---

## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | Project Owner | Pending | - |
| Migration Strategy Review | Project Owner | Pending | - |
| Per-Tier Migration Sign-off | Project Owner | Pending (per tier) | - |
| Final Completion Review | Project Owner | Pending | - |

---

## 13. COMPLIANCE CHECKPOINTS

### Code Compliance
- [ ] All test files follow Vitest conventions (describe/it/expect)
- [ ] No custom test runner code remains in codebase
- [ ] TypeScript strict mode enforced (no @ts-nocheck, no @ts-ignore without justification)
- [ ] All project references build cleanly (`npx tsc --build --force` exit 0)

### Test Compliance
- [ ] Test count parity verified (>= 1,589 tests)
- [ ] No flaky tests (3 consecutive runs produce identical results)
- [ ] DB tests properly isolated (no cross-test state contamination)
- [ ] Coverage reporting functional (`npx vitest run --coverage` produces report)

### Documentation Compliance
- [ ] All workstream completion documented in implementation-summary.md
- [ ] Decision records captured for any migration pattern deviations
- [ ] Checklist items marked with evidence

---

## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Project Owner (Michel) | Decision maker, primary developer | High — owns all system-spec-kit code | Per-session review of migration progress |
| AI Agents | Test consumers, code maintainers | Medium — run tests during development | Vitest commands documented in plan.md |
| Future Contributors | Codebase newcomers | Medium — benefit from standard test patterns | Standard Vitest conventions are self-documenting |

---

## 15. CHANGE LOG

### v1.1 (2026-02-11)
**Phase 0 + Phase 1 Complete**
- Phase 0 (W-C): Fixed 3 tsc errors in rank-memories.ts, clean build verified
- Phase 1 (W-A A1): ALL 121 test files converted to .vitest.ts (scope expanded from estimated ~30 pure logic to full 121). 69 passing, 49 DB-dependent skipped, 0 failures. 2,579 tests passing, ~2s execution time.
- Phase 2 scope refined: 49 skipped files need DB fixture enablement (not new file creation)

### v1.0 (2026-02-11)
**Initial specification**
- Defined 3 workstreams (Vitest Migration, simFactory Types, Build Errors)
- Established migration tiers for Workstream A (~30 pure logic, ~50 DB-dependent, ~20 integration, ~4 context server)
- Linked all work items to Spec 103 recommendations (REC-015, REC-020 Cluster B) and build audit findings

---

## 16. OPEN QUESTIONS

- **OQ-01**: Should the 3 existing .vitest.ts POC files be kept as-is during migration and renamed last, or renamed first as the migration seed? (Recommendation: rename first to establish the pattern)
- **OQ-02**: What Vitest coverage provider should be used — v8 (faster, default) or istanbul (more accurate for complex TypeScript)? (Recommendation: v8 as default, switch to istanbul only if accuracy issues arise)
- **OQ-03**: Should test parallelization be enabled from the start, or should tests run sequentially until all DB isolation issues are resolved? (Recommendation: sequential first via `--no-threads`, enable parallelization per-tier once isolation is verified)
- **OQ-04**: For the simFactory type unification (W:B), should the shared types live in `shared/types.ts` or in a new `shared/extractor-types.ts`? (Recommendation: extend shared/types.ts unless it creates circular dependency issues)

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Predecessor Spec**: `103-spec-kit-final-audit-post-typescript/` (audit + remediation)
- **Vitest POC Evidence**: `103-spec-kit-final-audit-post-typescript/implementation-summary.md` (Phase C, Wave 5)
- **simFactory TECH-DEBT**: `103-spec-kit-final-audit-post-typescript/recommendations.md` (REC-020 Cluster B)
- **Build Errors**: `103-spec-kit-final-audit-post-typescript/implementation-summary.md` (Build Verification, line 190)

---

## APPENDIX: MIGRATION TIER BREAKDOWN (Workstream A)

Reference for planning and task decomposition:

| Tier | Difficulty | Count | Characteristics | Estimated Sessions |
|------|-----------|-------|-----------------|-------------------|
| Tier 1 | Low | ~30 | Pure logic tests, no DB, no mocks | 0.5-1 |
| Tier 2 | Medium | ~50 | DB-dependent tests, need setup/teardown hooks | 1-2 |
| Tier 3 | Medium-High | ~20 | Integration tests, multi-module, complex mocking | 1 |
| Tier 4 | High | ~4 | Context server tests, full MCP stack | 0.5-1 |
| **Total** | | **~104** | | **3-5** |

Tier categorization will be refined during plan.md creation when each test file is inspected for DB imports and mock complexity.

---

<!--
LEVEL 3+ SPEC (~300 lines)
- Core + L2 + L3 + L3+ addendums
- Approval Workflow, Compliance, Stakeholders
- Full governance controls
- 3 workstreams with [W:TAG] prefixes
-->
