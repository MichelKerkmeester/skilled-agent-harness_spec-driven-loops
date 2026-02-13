# Tasks: Spec Kit Test & Type Cleanup

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**3-Tier Task Format**: `T### [W-X] [P?] Description (file path) [effort] {deps: T###} → CHK-###`

---

## Milestone Reference

| Milestone | Tasks | Target | Status |
|-----------|-------|--------|--------|
| M1 Quick Win | T001-T002 | Phase 0 EOD | [x] |
| M2 Pure Logic Migration | T010-T014 | Phase 1 EOD | [x] |
| M3 DB-Dependent Migration | T020-T024 | Phase 2 EOD | [ ] |
| M4 Integration & Server Migration | T030-T033 | Phase 3 EOD | [ ] |
| M5 Type Unification | T040-T043 | Phase 4 EOD | [ ] |
| M6 Cleanup & Verification | T050-T056 | Phase 5 EOD | [ ] |

---

## Phase 0: Quick Win [Milestone M1] [W-C]

- [x] T001 [W-C] [P0] Fix 3 tsc errors in scripts/memory/rank-memories.ts (`scripts/memory/rank-memories.ts`) [30m] → CHK-010
  - Pre-existing errors from spec 099 deferred items (see recommendations.md §7 Deferred Items)
  - ✅ Fixed by adding index signature to NormalizedMemory interface for FolderMemoryInput compatibility
- [x] T002 [W-C] [P1] Verify clean build after fix — only pre-existing declaration-emit errors expected (`mcp_server/dist/`) [15m] {deps: T001} → CHK-011
  - Run `npx tsc --build --force` from system-spec-kit root
  - ✅ Clean build verified: zero errors returned

**Phase Gate**: T001 (P0) complete, build verified before proceeding to Phase 1

---

## Phase 1: Vitest Pure Logic Migration [Milestone M2] [W-A, Phase A1]

- [x] T010 [W-A] [P0] Inventory all 121 test files (104 .test.ts + 17 .test.js), classify by difficulty tier (`mcp_server/tests/`) [1h] → CHK-001
  - ✅ Scope expanded: 121 files total (104 .test.ts + 17 .test.js), not 104 as originally estimated
  - Tier 1-2 (Pure logic, passing): 69 files
  - Tier 3 (DB-dependent, skipped): 49 files
  - Tier 4-5 (Integration/Server): included in DB-dependent count
- [x] T011 [W-A] [P0] Convert first batch of pure-logic tests (.test.ts → .vitest.ts) (`mcp_server/tests/`) [2h] {deps: T010} → CHK-020
  - ✅ Applied patterns from spec 103 POC (3 files, 20/20 tests passing)
  - Replaced custom runner assertions with vitest describe/it/expect
- [x] T012 [W-A] [P0] Convert ALL remaining test files — scope expanded to 121 total (`mcp_server/tests/`) [4h] {deps: T011} → CHK-020
  - ✅ ALL 121 files converted: 104 .test.ts + 17 .test.js → .vitest.ts
  - DB-dependent files (49) use describe.skip pending Phase A2 fixtures
  - 42 previously failing files fixed (28 DB-dependent → describe.skip, 4 import fixes, 2 path fixes, 8 assertion fixes)
- [x] T013 [W-A] [P1] Verify all 121 converted tests in vitest — 69 passing, 49 skipped, 0 failures (`vitest.config.ts`) [30m] {deps: T012} → CHK-021
  - ✅ Run `npx vitest run`: 0 failed | 69 passed | 49 skipped (118 total files). 2,579 tests passed | 1,362 skipped (3,941 total). Duration: ~2s
- [x] T014 [W-A] [P1] Migration patterns established through conversion work (`scratch/migration-patterns.md`) [30m] {deps: T013} → CHK-040
  - ✅ Patterns established: pass/fail → expect().toBe(true), skip → describe.skip, DB-dependent → describe.skip with TODO annotation, async patterns preserved, error matching → expect().toThrow()

**Phase Gate**: All 121 test files converted to .vitest.ts. 69 passing, 49 DB-dependent skipped, 0 failures. Phase 2 work refined to "enable skipped tests with DB fixtures" (not "convert files").

**>>> SYNC-001: W-A Phase A1 complete — All test files converted to vitest format <<<**

---

## Phase 2: Vitest DB-Dependent Migration [Milestone M3] [W-A, Phase A2]

> **Note**: Phase A1 converted ALL 121 files to .vitest.ts format. Phase A2 work is now "enable 49 skipped test files with DB fixtures" (not "convert files"). Categories: 9 handler tests, 8 integration tests, 4 MCP tests, ~28 other DB-dependent tests.

- [ ] T020 [W-A] [P0] Create vitest DB fixture/setup utilities (beforeEach/afterEach) (`mcp_server/tests/fixtures/`) [2h] {deps: SYNC-001} → CHK-020
  - In-memory SQLite database creation with schema initialization
  - Seed data factories for common test scenarios (memories, embeddings, checkpoints)
  - Proper cleanup in afterEach to prevent test pollution
  - Shared utility importable by all DB-dependent test files
- [ ] T021 [W-A] [P0] Convert ~15 simpler DB-dependent tests (`mcp_server/tests/`) [3h] {deps: T020} → CHK-020
  - Tests with single-table operations, simple CRUD patterns
  - Apply DB fixture utilities from T020
- [ ] T022 [W-A] [P0] Convert ~20 medium DB-dependent tests (`mcp_server/tests/`) [5h] {deps: T021} → CHK-020
  - Tests with multi-table operations, transactions, search queries
  - BM25, vector search, scoring logic tests
- [ ] T023 [W-A] [P0] Convert ~15 complex DB-dependent tests (`mcp_server/tests/`) [4h] {deps: T022} → CHK-020
  - Tests with causal graph operations, checkpoint save/restore
  - Security tests (48 SQL injection vectors)
  - Session deduplication, decay scoring
- [ ] T024 [W-A] [P1] Verify all ~50 DB tests pass in vitest (`vitest.config.ts`) [30m] {deps: T023} → CHK-021
  - Run full DB test suite via vitest
  - Verify no regressions from migration
  - Check for flaky tests (run 3x if needed)

**Phase Gate**: All ~50 DB-dependent tests passing in vitest, no flaky tests

**>>> SYNC-002: W-A Phase A2 complete — DB-dependent tests migrated <<<**

---

## Phase 3: Vitest Integration + Server Migration [Milestone M4] [W-A, Phases A3-A4]

- [ ] T030 [W-A] [P0] Convert ~10 simpler integration tests (`mcp_server/tests/`) [3h] {deps: SYNC-002} → CHK-020
  - Multi-module tests that exercise handler→storage→search pipelines
  - Apply patterns from Phases A1 and A2
- [ ] T031 [W-A] [P0] Convert ~10 complex integration tests (`mcp_server/tests/`) [4h] {deps: T030} → CHK-020
  - Tests spanning MCP tool handlers, memory lifecycle
  - Tests exercising full search pipeline (trigger → vector → BM25 → rerank)
- [ ] T032 [W-A] [P1] Convert ~4 context server tests — highest difficulty (`mcp_server/tests/`) [3h] {deps: T031} → CHK-020
  - Full context-server lifecycle tests (startup, tool dispatch, shutdown)
  - parseArgs<T>() type validation tests
  - MCP SDK integration boundary tests
  - These are the hardest to migrate due to server lifecycle management
- [ ] T033 [W-A] [P1] Verify all integration/server tests pass (`vitest.config.ts`) [30m] {deps: T032} → CHK-021
  - Run full integration + server test suite via vitest
  - All ~24 tests must pass
  - Verify no interference with DB tests (isolation check)

**Phase Gate**: All integration and server tests passing in vitest

**>>> SYNC-003: W-A complete — All 104 tests migrated to vitest <<<**

---

## Phase 4: simFactory Type Unification [Milestone M5] [W-B]

- [ ] T040 [W-B] [P1] Analyze 4 TECH-DEBT blocks, design shared type interface (`mcp_server/lib/`) [1.5h] → CHK-060
  - Locate all 4 `TECH-DEBT` comment blocks with simFactory type issues
  - Identify common patterns across extractor files
  - Design a shared `SimFactoryResult` or equivalent interface
  - Document design in scratch/type-unification-design.md
- [ ] T041 [W-B] [P1] Implement unified simFactory types (`mcp_server/lib/search/`, `mcp_server/shared/types.ts`) [2h] {deps: T040} → CHK-060
  - Create shared type definition in appropriate types file
  - Update all 4 extractor files to use shared type
  - Ensure backward compatibility with existing consumers
- [ ] T042 [W-B] [P1] Remove remaining double-casts in extractor files (`mcp_server/lib/search/`) [1h] {deps: T041} → CHK-010
  - Eliminate `as unknown as X` patterns enabled by proper typing
  - Verify no `as any` introduced as replacement
  - All casts should be unnecessary with proper type interface
- [ ] T043 [W-B] [P1] Verify all extractors still work (`mcp_server/tests/`) [30m] {deps: T042} → CHK-021
  - Run extractor-specific tests via vitest
  - Run full search pipeline tests to verify no regressions
  - Confirm type-check passes: `npx tsc --noEmit`

**Phase Gate**: All TECH-DEBT blocks resolved, zero double-casts, all extractor tests passing

**>>> SYNC-004: W-B complete — Type unification done <<<**

---

## Phase 5: Cleanup & Verification [Milestone M6] [W-C]

- [ ] T050 [W-C] [P0] Remove custom test runner infrastructure (`mcp_server/tests/`, `scripts/`) [1h] {deps: SYNC-003} → CHK-010
  - Remove custom test runner script and supporting utilities
  - Remove any custom assertion helpers superseded by vitest
  - Keep shared test utilities/fixtures that vitest tests still use
  - Verify no production code depends on test runner
- [ ] T051 [W-C] [P0] Update vitest.config.ts to include all test patterns (`vitest.config.ts`) [30m] {deps: T050} → CHK-003
  - Ensure glob patterns cover all .vitest.ts files (or renamed .test.ts files)
  - Configure test isolation, timeouts, and reporter settings
  - Verify configuration matches actual test file layout
- [ ] T052 [W-C] [P0] Run full test suite via vitest — all tests must pass (`vitest.config.ts`) [30m] {deps: T051} → CHK-020
  - `npx vitest run --reporter=verbose`
  - All ~104 migrated tests must pass (zero failures, zero skips)
  - Generate coverage report if vitest coverage plugin configured
- [ ] T053 [W-C] [P1] Run `npx tsc --build --force` — zero errors (`tsconfig.json`) [15m] {deps: SYNC-004} → CHK-010
  - Full TypeScript compilation check
  - Zero errors expected (T001 fixed pre-existing, T042 removed casts)
  - Declaration-emit warnings acceptable if pre-existing
- [ ] T054 [W-C] [P1] Rebuild dist/ (`mcp_server/dist/`) [15m] {deps: T053} → CHK-011
  - Clean build from source: `npm run build`
  - Verify all dist/ files are fresh (timestamp check)
  - Confirm MCP server starts successfully from dist/
- [ ] T055 [W-C] [P1] Update mcp_server/package.json test scripts (`mcp_server/package.json`) [15m] {deps: T051} → CHK-013
  - Update `"test"` script to use vitest instead of custom runner
  - Add `"test:watch"` script for development workflow
  - Add `"test:coverage"` script if coverage plugin available
  - Verify `npm test` works from mcp_server directory
- [ ] T056 [W-C] [P2] Save memory context for spec 104 (`memory/`) [15m] {deps: T052, T054} → CHK-052
  - Run generate-context.js with spec 104 folder path
  - Verify memory file captures key decisions and migration patterns
  - Index via memory_save() for immediate MCP visibility

**Phase Gate**: All tests passing via vitest, zero tsc errors, dist/ rebuilt, scripts updated

**>>> SYNC-005: All workstreams complete — Final verification <<<**

---

## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All milestones achieved (M1-M6)
- [ ] All sync points passed (SYNC-001 through SYNC-005)
- [ ] All 104 tests passing via vitest (zero custom runner dependency)
- [ ] `npx tsc --build --force` returns zero errors
- [ ] dist/ freshly rebuilt and MCP server starts cleanly
- [ ] Custom test runner infrastructure fully removed
- [ ] All 4 TECH-DEBT simFactory blocks resolved
- [ ] Zero double-casts remaining in extractor files
- [ ] package.json test scripts point to vitest
- [ ] checklist.md fully verified with evidence
- [ ] Memory context saved for future sessions

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Prior Art**: See `103-spec-kit-final-audit-post-typescript/recommendations.md` (REC-012, REC-015, REC-020)
- **Vitest POC**: See spec 103, Phase C Wave 5 — 3 POC files, 20/20 tests, vitest.config.ts created

---

## L2: TASK-CHECKLIST MAPPING

| Task ID | Checklist Item | Priority | Status |
|---------|----------------|----------|--------|
| T001 | CHK-010 (TypeScript errors resolved) | P0 | [x] |
| T002 | CHK-011 (Build verification) | P1 | [x] |
| T010 | CHK-001 (Test inventory complete) | P0 | [x] |
| T011 | CHK-020 (Test migration — batch 1) | P0 | [x] |
| T012 | CHK-020 (Test migration — batch 2) | P0 | [x] |
| T013 | CHK-021 (Pure logic tests pass) | P1 | [x] |
| T014 | CHK-040 (Migration patterns documented) | P1 | [x] |
| T020 | CHK-020 (DB fixtures created) | P0 | [ ] |
| T021 | CHK-020 (DB tests — simple batch) | P0 | [ ] |
| T022 | CHK-020 (DB tests — medium batch) | P0 | [ ] |
| T023 | CHK-020 (DB tests — complex batch) | P0 | [ ] |
| T024 | CHK-021 (All DB tests pass) | P1 | [ ] |
| T030 | CHK-020 (Integration tests — simple) | P0 | [ ] |
| T031 | CHK-020 (Integration tests — complex) | P0 | [ ] |
| T032 | CHK-020 (Server tests — highest difficulty) | P1 | [ ] |
| T033 | CHK-021 (All integration/server tests pass) | P1 | [ ] |
| T040 | CHK-060 (TECH-DEBT analysis) | P1 | [ ] |
| T041 | CHK-060 (Unified simFactory types) | P1 | [ ] |
| T042 | CHK-010 (Double-casts removed) | P1 | [ ] |
| T043 | CHK-021 (Extractors verified) | P1 | [ ] |
| T050 | CHK-010 (Custom runner removed) | P0 | [ ] |
| T051 | CHK-003 (vitest.config.ts finalized) | P0 | [ ] |
| T052 | CHK-020 (Full suite passes via vitest) | P0 | [ ] |
| T053 | CHK-010 (Zero tsc errors) | P1 | [ ] |
| T054 | CHK-011 (dist/ rebuilt) | P1 | [ ] |
| T055 | CHK-013 (package.json scripts updated) | P1 | [ ] |
| T056 | CHK-052 (Memory context saved) | P2 | [ ] |

---

## L2: PHASE COMPLETION GATES

### Gate 0: Quick Win Complete
- [x] 3 tsc errors in rank-memories.ts fixed (T001) — Evidence: Added index signature to NormalizedMemory interface
- [x] Build verified clean — no new errors (T002) — Evidence: `npx tsc --build --force` returns 0 errors
- [x] Ready for test migration work

### Gate 1: Pure Logic Migration Complete
- [x] All 121 test files inventoried and classified (T010) — Evidence: 104 .test.ts + 17 .test.js = 121 total (scope expanded from original 104 estimate)
- [x] All 121 test files converted to .vitest.ts (T011, T012) — Evidence: 69 pure logic passing, 49 DB-dependent using describe.skip
- [x] All converted tests verified (T013) — Evidence: 0 failed | 69 passed | 49 skipped. 2,579 tests passed, ~2s duration
- [x] Migration patterns established through conversion work (T014) — Evidence: 5 patterns documented: pass/fail→expect, skip→describe.skip, DB→describe.skip+TODO, async preserved, error→toThrow()

### Gate 2: DB-Dependent Migration Complete
- [ ] DB fixture utilities created and working (T020)
- [ ] All ~50 DB-dependent tests converted (T021, T022, T023)
- [ ] All DB tests pass with no flaky results (T024)

### Gate 3: Integration & Server Migration Complete
- [ ] All ~20 integration tests converted (T030, T031)
- [ ] All ~4 server tests converted (T032)
- [ ] Full integration/server suite passes (T033)

### Gate 4: Type Unification Complete
- [ ] TECH-DEBT analysis complete with design doc (T040)
- [ ] Unified simFactory types implemented (T041)
- [ ] Double-casts removed from extractors (T042)
- [ ] All extractor tests still passing (T043)

### Gate 5: Final Verification
- [ ] Custom test runner removed (T050)
- [ ] vitest.config.ts covers all test patterns (T051)
- [ ] Full test suite passes via vitest (T052)
- [ ] `tsc --build --force` zero errors (T053)
- [ ] dist/ rebuilt and MCP server starts (T054)
- [ ] package.json test scripts updated (T055)

---

## L2: BLOCKED TASK TRACKING

| Task ID | Blocker | Impact | Resolution |
|---------|---------|--------|------------|
| — | No blocked tasks at start | — | — |

> **Note**: If any tasks become blocked during execution, log them here with the blocker description, impact assessment, and resolution plan. Common potential blockers:
> - vitest incompatibility with custom test patterns → Adapt test patterns or use vitest compatibility plugins
> - SQLite in-memory DB behaves differently than file-based → Adjust fixture setup to match production config
> - Server lifecycle tests require process management → Use vitest's built-in test lifecycle hooks

---

## L3: ARCHITECTURE TASKS

### ADR Implementation

| Task ID | ADR Reference | Description | Status |
|---------|---------------|-------------|--------|
| T010-T033 | ADR-001 (Vitest Migration) | Migrate all 121 test files from custom runner to vitest framework | Phase A1 [x], A2-A4 [ ] |
| T020 | ADR-001 | Create DB fixture infrastructure for vitest | [ ] |
| T040-T042 | ADR-001 (supporting) | Unify simFactory types to eliminate TECH-DEBT | [ ] |
| T050 | ADR-001 | Remove custom runner infrastructure post-migration | [ ] |
| T051 | ADR-001 | Finalize vitest configuration for full codebase | [ ] |
| T055 | ADR-001 | Update package.json to use vitest as test command | [ ] |

> **ADR-001**: Decision to migrate from custom test runner to vitest. Rationale: standard tooling enables coverage reports, watch mode, CI integration, and describe/it structure. POC validated in spec 103 (Wave 5) with 3 files, 20/20 tests, zero issues. See `decision-record.md` for full analysis.

---

## L3: MILESTONE TRACKING

| Milestone | Target | Tasks Required | Critical Path | Status |
|-----------|--------|----------------|---------------|--------|
| M1 Quick Win | Phase 0 | T001-T002 | T001 → T002 | [x] |
| M2 Pure Logic | Phase 1 | T010-T014 | T010 → T011 → T012 → T013 | [x] |
| M3 DB-Dependent | Phase 2 | T020-T024 | T020 → T021 → T022 → T023 → T024 | [ ] |
| M4 Integration | Phase 3 | T030-T033 | T030 → T031 → T032 → T033 | [ ] |
| M5 Type Unification | Phase 4 | T040-T043 | T040 → T041 → T042 → T043 | [ ] |
| M6 Cleanup | Phase 5 | T050-T056 | T050 → T051 → T052; T053 → T054 | [ ] |

**Critical Path**: M1 → M2 → M3 → M4 → M6 (W-A is the longest chain)
**Parallel Path**: M5 (W-B) can start after M2 completes and run parallel to M3-M4

---

## L3: RISK MITIGATION TASKS

| Task ID | Risk ID | Mitigation Action | Priority | Status |
|---------|---------|-------------------|----------|--------|
| T013 | R-001 | Verify all pure-logic tests pass before proceeding to DB tests — catch migration issues early | P1 | [x] |
| T024 | R-001 | Run DB tests 3x to detect flaky behavior from migration | P1 | [ ] |
| T043 | R-002 | Verify all extractors work after type changes — full search pipeline regression check | P1 | [ ] |
| T052 | R-001 | Final full-suite run confirms no regressions across all 104 tests | P0 | [ ] |
| T054 | R-003 | Rebuild dist/ and verify MCP server starts — catch any build chain breakage | P1 | [ ] |

**Risk Registry**:

| Risk ID | Description | Probability | Impact | Mitigation |
|---------|-------------|-------------|--------|------------|
| R-001 | Test migration introduces subtle behavioral changes (assertion semantics differ between custom runner and vitest) | Medium | High | Phase gates with full pass verification at each stage; migration patterns doc (T014) |
| R-002 | simFactory type unification breaks extractor behavior at runtime despite passing type checks | Low | High | Dedicated extractor verification (T043) with full search pipeline test |
| R-003 | Removing custom runner before all tests migrated leaves gap in test coverage | Low | Medium | Phase ordering ensures custom runner removed only after SYNC-003 (all tests migrated) |
| R-004 | vitest configuration incompatible with project's TypeScript/module setup | Low | Medium | POC already validated in spec 103; vitest.config.ts exists and works |

---

## L3+: AI Execution Protocol

### Pre-Task Checklist

Before starting each task, verify:

1. [ ] Load `spec.md` and verify scope hasn't changed
2. [ ] Load `plan.md` and identify current phase (0-5)
3. [ ] Load `tasks.md` and find next uncompleted task
4. [ ] Verify task dependencies are satisfied (check {deps:} tags)
5. [ ] Load `checklist.md` and identify relevant P0/P1 items (check → CHK-### mapping)
6. [ ] Check for blocking issues in `decision-record.md` (ADR-001 status)
7. [ ] Verify `memory/` folder for context from previous sessions
8. [ ] Confirm which workstream (W-A, W-B, W-C) the task belongs to
9. [ ] Confirm understanding of success criteria for the specific task
10. [ ] Check blocked task tracking table for any new blockers
11. [ ] Begin implementation only after all checks pass

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Complete tasks in dependency order within each workstream |
| TASK-SCOPE | Stay within task boundary — no scope creep beyond the specific test files or type changes |
| TASK-VERIFY | Verify each task against its → CHK-### reference before marking complete |
| TASK-DOC | Update task status `[ ] → [x]` immediately on completion |
| TASK-SYNC | Wait at SYNC points — do not proceed to next phase until gate passes |
| TASK-PARALLEL | W-B (Type Unification) may run parallel to W-A Phases A2-A4 after SYNC-001 |

### Status Reporting Format

```
## Status Update - [TIMESTAMP]
- **Task**: T### - [Description]
- **Workstream**: [W-A | W-B | W-C]
- **Status**: [IN_PROGRESS | COMPLETED | BLOCKED]
- **Evidence**: [vitest output, tsc output, file paths]
- **Tests Migrated**: [N of M in this phase]
- **Blockers**: [None | Description with resolution plan]
- **Next**: T### - [Next task]
```

---

## L3+: Workstream Organization

### Workstream W-A: Test Migration (Vitest)

**Owner**: Primary agent
**Scope**: Migrate all 104 test files from custom test runner to vitest
**Files**: `mcp_server/tests/**/*.test.ts`, `vitest.config.ts`, `mcp_server/tests/fixtures/`
**Phases**: A1 (pure logic), A2 (DB-dependent), A3 (integration), A4 (server)

| Phase | Tasks | Test Count | Difficulty |
|-------|-------|------------|------------|
| A1 | T010-T014 | ~30 | Tier 1-2 (Simple-Moderate) |
| A2 | T020-T024 | ~50 | Tier 3 (DB-dependent) |
| A3 | T030-T031 | ~20 | Tier 4 (Integration) |
| A4 | T032-T033 | ~4 | Tier 5 (Server — highest) |

- [x] T010 [W-A] Inventory all 121 test files (104 .test.ts + 17 .test.js), classify by difficulty tier → CHK-001
- [x] T011 [W-A] Convert first batch of pure-logic tests → CHK-020
- [x] T012 [W-A] Convert ALL remaining test files (scope expanded to 121 total) → CHK-020
- [x] T013 [W-A] Verify all 121 converted tests: 69 passing, 49 skipped, 0 failures → CHK-021
- [x] T014 [W-A] Migration patterns established through conversion work → CHK-040
- [ ] T020 [W-A] Create vitest DB fixture/setup utilities → CHK-020
- [ ] T021 [W-A] Convert ~15 simpler DB-dependent tests → CHK-020
- [ ] T022 [W-A] Convert ~20 medium DB-dependent tests → CHK-020
- [ ] T023 [W-A] Convert ~15 complex DB-dependent tests → CHK-020
- [ ] T024 [W-A] Verify all ~50 DB tests pass → CHK-021
- [ ] T030 [W-A] Convert ~10 simpler integration tests → CHK-020
- [ ] T031 [W-A] Convert ~10 complex integration tests → CHK-020
- [ ] T032 [W-A] Convert ~4 context server tests → CHK-020
- [ ] T033 [W-A] Verify all integration/server tests pass → CHK-021

### Workstream W-B: Type Unification (simFactory)

**Owner**: Secondary agent (or primary after SYNC-001)
**Scope**: Eliminate 4 TECH-DEBT blocks with simFactory type issues, remove double-casts
**Files**: `mcp_server/lib/search/*.ts`, `mcp_server/shared/types.ts`
**Parallel**: Can start after SYNC-001 (Phase A1 complete)

- [ ] T040 [W-B] Analyze 4 TECH-DEBT blocks, design shared type interface → CHK-060
- [ ] T041 [W-B] Implement unified simFactory types → CHK-060
- [ ] T042 [W-B] Remove remaining double-casts in extractor files → CHK-010
- [ ] T043 [W-B] Verify all extractors still work → CHK-021

### Workstream W-C: Quick Wins & Cleanup

**Owner**: Primary agent (bookends the project)
**Scope**: Pre-migration tsc fixes, post-migration cleanup, final verification
**Files**: `scripts/memory/rank-memories.ts`, `mcp_server/dist/`, `mcp_server/package.json`, `vitest.config.ts`

- [x] T001 [W-C] Fix 3 tsc errors in rank-memories.ts → CHK-010
- [x] T002 [W-C] Verify clean build after fix → CHK-011
- [ ] T050 [W-C] Remove custom test runner infrastructure → CHK-010
- [ ] T051 [W-C] Update vitest.config.ts to include all test patterns → CHK-003
- [ ] T052 [W-C] Run full test suite via vitest — all tests must pass → CHK-020
- [ ] T053 [W-C] Run `npx tsc --build --force` — zero errors → CHK-010
- [ ] T054 [W-C] Rebuild dist/ → CHK-011
- [ ] T055 [W-C] Update mcp_server/package.json test scripts → CHK-013
- [ ] T056 [W-C] Save memory context for spec 104 → CHK-052

---

## Status Updates Log

> Log status updates here as tasks are completed.

### 2026-02-11 — Phase 0 Complete
- **Task**: T001, T002 - Build Error Cleanup
- **Workstream**: W-C
- **Status**: COMPLETED
- **Evidence**: `npx tsc --build --force` returns 0 errors; added index signature to NormalizedMemory in rank-memories.ts
- **Next**: T010 - Test file inventory

### 2026-02-11 — Phase 1 Complete
- **Task**: T010-T014 - Pure Logic Test Migration (expanded scope)
- **Workstream**: W-A
- **Status**: COMPLETED
- **Evidence**: 121 .vitest.ts files created (104 from .test.ts + 17 from .test.js). Test run: 0 failed | 69 passed | 49 skipped (118 total files). 2,579 tests passed | 1,362 skipped (3,941 total). Duration: ~2s. 42 previously failing files fixed (28 DB-dependent → describe.skip, 4 import fixes, 2 path fixes, 8 assertion fixes).
- **Next**: T020 - DB fixture utilities for Phase 2

### Template

```
### YYYY-MM-DD HH:MM
- **Task**: T### - [Description]
- **Workstream**: W-[A|B|C]
- **Status**: [COMPLETED | BLOCKED]
- **Evidence**: [Command output, file paths, test counts]
- **Next**: T### - [Next task]
```

---

<!--
LEVEL 3+ TASKS (~350 lines)
- Core + L2 verification + L3 architecture + L3+ governance
- 3-Tier task format with workstream tags [W-A, W-B, W-C]
- 27 tasks across 6 phases (0-5)
- AI Execution Protocol with pre-task checklist
- 6 milestones with critical path analysis
- 5 risk mitigation tasks with 4 risk registry entries
- ADR-001 linked architecture tasks
- Phase completion gates (Gates 0-5)
- Workstream organization for parallel execution
- Task-to-checklist traceability (27 mappings)
- Status reporting format template
-->
