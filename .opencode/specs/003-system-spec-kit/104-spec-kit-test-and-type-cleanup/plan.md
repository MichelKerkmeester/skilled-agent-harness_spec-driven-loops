# Implementation Plan: Spec Kit Test & Type Cleanup

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) |
| **Framework** | MCP Server (Model Context Protocol) |
| **Storage** | SQLite (context-index.sqlite via better-sqlite3) |
| **Testing** | Custom runner (run-tests.js + *.test.ts) → Vitest (*.vitest.ts) migration |
| **Build** | `npx tsc --build --force` with project references (shared/, mcp_server/, scripts/) |
| **Location** | `.opencode/skill/system-spec-kit/` |

### Overview

This spec completes three remaining cleanup workstreams inherited from Spec 103's final audit. The primary effort (W-A) migrates all 104 custom-runner test files to Vitest, leveraging the proven POC pattern from Spec 103's REC-015 (3 files, 20/20 tests, 115ms). The secondary workstream (W-B) unifies the simFactory type hierarchy with extractor types, eliminating 4 documented TECH-DEBT double-casts. A quick-win workstream (W-C) fixes 3 pre-existing tsc build errors in `scripts/memory/rank-memories.ts`. Together, these workstreams bring the test infrastructure and type system to a clean, maintainable state.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear — inherited from Spec 103 REC-012, REC-015, REC-020
- [x] Success criteria measurable — zero custom-runner tests, zero TECH-DEBT double-casts, zero tsc errors
- [x] Dependencies identified — vitest installed, vitest.config.ts exists, 3 POC files validated
- [x] Vitest POC proven — 3 files converted, 20/20 tests passing in 115ms

### Definition of Done
- [ ] All 104 .test.ts files converted to .vitest.ts and passing under `npx vitest run`
- [ ] Custom test runner infrastructure removed (run-tests.js, TestEntry/TestResults interfaces)
- [ ] All 4 simFactory TECH-DEBT blocks resolved with unified types
- [ ] `npx tsc --build --force` exits with zero errors (including rank-memories.ts)
- [ ] No regressions — total assertion count ≥ 1,589 (current baseline)
- [ ] tasks.md and checklist.md updated with evidence

---

## 3. ARCHITECTURE

### Pattern
Modular library with MCP protocol layer — Clean Architecture with domain separation across `shared/` (types, utilities), `mcp_server/` (handlers, search, scoring, cognitive), and `scripts/` (extractors, memory tools).

### Key Components
- **Test Runner (current)**: `mcp_server/run-tests.js` — custom Node.js runner that discovers `dist/tests/*.test.js`, executes each via `execSync`, aggregates pass/fail results. Each .test.ts defines its own `TestEntry`/`TestResults` interfaces and manual pass/fail tracking.
- **Test Runner (target)**: Vitest with `vitest.config.ts` — standard `describe`/`it`/`expect` API, automatic test discovery via `tests/**/*.vitest.ts` glob, built-in coverage, watch mode, and parallel execution.
- **simFactory**: `scripts/lib/simulation-factory.ts` — generates placeholder data for extractors when no real conversation data is available. Defines its own type hierarchy (DecisionData, SimPhase, DiagramData, ConversationData, SessionData) that parallels but differs from extractor-local types.
- **Extractor Type Hierarchy**: Types defined locally in each extractor file (decision-extractor.ts, diagram-extractor.ts, conversation-extractor.ts, collect-session-data.ts) that are structurally similar to simFactory types but not identical, requiring `as unknown as T` double-casts.
- **rank-memories.ts**: Script with `NormalizedMemory` interface that is structurally compatible with `FolderMemoryInput` but has `id: string | number` vs `id: string` mismatch, causing 3 tsc errors on casts.

### Data Flow
Tests currently flow: `.test.ts` → tsc compile → `dist/tests/*.test.js` → `run-tests.js` discovers and executes → manual pass/fail tracking → exit code. After migration: `.vitest.ts` → vitest discovers via glob → executes directly (no compile step) → standard reporter → exit code. The simFactory data flow is: extractor calls `simFactory.createXxxData()` → double-cast to local type → used as fallback data. After type unification: extractor calls `simFactory.createXxxData()` → returns correct type directly → no cast needed.

---

## 4. IMPLEMENTATION PHASES

### Phase A1: Pure Logic Test Migration (121 files converted — scope expanded from ~30)

> **Scope Expansion Note**: The original estimate was ~30 pure logic files for Phase A1. In practice, ALL 121 test files (104 `.test.ts` + 17 `.test.js`) were converted to `.vitest.ts` format in this phase. DB-dependent tests (49 files) use `describe.skip` to defer execution until Phase A2 provides proper DB fixtures. This front-loads the migration work and simplifies Phase A2 from "convert + enable" to just "enable skipped tests with DB fixtures."

- [x] Identify all test files with no DB/external dependencies (pure function tests)
- [x] Convert pass/fail tracking to `describe`/`it`/`expect` pattern
- [x] Replace `TestEntry`/`TestResults` boilerplate with vitest imports
- [x] Rename each file from `.test.ts` to `.vitest.ts`
- [x] Run `npx vitest run` after each batch to verify
- [x] Target files include: unit-rrf-fusion, unit-normalization, unit-fsrs-formula, scoring, reranker, composite-scoring, five-factor-scoring, channel, corrections, and similar pure-logic tests
- [x] **EXPANDED**: Also converted all 17 .test.js files and all DB-dependent .test.ts files (using describe.skip)
- [x] **Result**: 121 .vitest.ts files total. 69 passing, 49 skipped, 0 failures. 2,579 tests passed, ~2s duration.

### Phase A2: DB-Dependent Test Migration (~50 files, Medium difficulty)
- [ ] Identify all tests that create/use in-memory or on-disk SQLite databases
- [ ] Create shared vitest fixtures for DB setup/teardown using `beforeEach`/`afterEach`
- [ ] Convert DB initialization patterns to vitest lifecycle hooks
- [ ] Handle test isolation (each test gets fresh DB state)
- [ ] Target files include: memory-save, memory-search, memory-crud, access-tracker, session-manager, archival-manager, vector-index tests, and all handler-level tests that exercise DB queries

### Phase A3: Integration Test Migration (~20 files, Medium-High difficulty)
- [ ] Identify multi-module integration tests (trigger pipeline, learning history, causal edges)
- [ ] Set up vitest fixtures for complex multi-module test scenarios
- [ ] Convert integration test assertions and setup/teardown
- [ ] Ensure test execution order independence (no shared state between tests)
- [ ] Target files include: integration-trigger-pipeline, integration-learning-history, t202-t203-causal-fixes, t205-token-budget-enforcement, t206-search-archival, and similar cross-module tests

### Phase A4: Context Server Test Migration (~4 files, High difficulty)
- [ ] Convert context-server.test.ts and related MCP protocol tests
- [ ] Implement server lifecycle management (start/stop) in vitest fixtures
- [ ] Handle MCP JSON-RPC request/response testing patterns
- [ ] Verify all MCP tool endpoints exercise correctly under vitest
- [ ] Target files: context-server.test.ts and any tests that spin up the full MCP server

### Phase A5: Custom Runner Cleanup
- [ ] Delete `mcp_server/run-tests.js`
- [ ] Remove `test` npm script pointing to custom runner (if exists)
- [ ] Add/update `test` npm script to use `vitest run`
- [ ] Verify `npx vitest run` discovers and passes all migrated tests
- [ ] Remove any remaining `.test.ts` files (should be zero)
- [ ] Update package.json scripts and CI references

### Phase B: simFactory Type Unification (~1 session)
- [ ] Audit all 4 TECH-DEBT blocks: decision-extractor.ts:86, diagram-extractor.ts:90, diagram-extractor.ts:172, conversation-extractor.ts:71, collect-session-data.ts:642
- [ ] Map type differences between simFactory types and extractor types (field names, optionality, extra fields)
- [ ] Design shared interface definitions in `scripts/lib/types/` or `scripts/extractors/shared-types.ts`
- [ ] Update simFactory to return the shared types
- [ ] Update extractors to use the shared types (remove local type definitions)
- [ ] Remove all 4 `as unknown as T` double-casts
- [ ] Remove all 5 TECH-DEBT comment blocks
- [ ] Verify `npx tsc --build --force` passes

### Phase C: Build Error Cleanup (<1 session, Quick win) — ✅ COMPLETE
- [x] Fix `NormalizedMemory` → `FolderMemoryInput` cast in rank-memories.ts
- [x] Option 3 selected (ADR-003): Added index signature to NormalizedMemory to make it compatible with FolderMemoryInput
- [x] Verify `npx tsc --build --force` exits with zero errors
- [x] Run affected tests to confirm no regression

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Success Criteria |
|-----------|-------|-------|------------------|
| Unit (Vitest) | All pure logic modules | Vitest with `describe`/`it`/`expect` | ≥1,589 assertions passing |
| DB Integration (Vitest) | DB handlers, search, scoring | Vitest + beforeEach/afterEach fixtures | All DB tests isolated, no shared state |
| MCP Integration (Vitest) | Context server, tool handlers | Vitest + server lifecycle fixtures | MCP request/response validated |
| Build Verification | Full TypeScript compilation | `npx tsc --build --force` | Zero errors, zero warnings |
| Regression Gate | Compare old vs new assertion counts | Manual comparison at SYNC-002 | New count ≥ old count |

### Migration Verification Pattern
For each batch of converted files:
1. Run `npx vitest run --reporter=verbose` on the new `.vitest.ts` files
2. Verify test count matches or exceeds the original `.test.ts` file
3. Delete the original `.test.ts` file only after the `.vitest.ts` passes
4. Run `npx tsc --build --force` to confirm no compile regressions

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| vitest (npm package) | External | Green — already installed (Spec 103 REC-015) | Blocks all of W-A |
| vitest.config.ts | Internal | Green — exists in mcp_server/ | Blocks all of W-A |
| better-sqlite3 | External | Green — already in production | Blocks W-A Phase A2 |
| Spec 103 POC files (3 .vitest.ts) | Internal | Green — proven pattern, 20/20 passing | Pattern reference for W-A |
| simFactory source (scripts/lib/) | Internal | Green — stable, no concurrent changes | Required for W-B type analysis |
| FolderMemoryInput type (mcp_server/) | Internal | Green — stable interface | Required for W-C fix |
| TypeScript compiler (tsc) | External | Green — installed and configured | Blocks build verification |

---

## 7. ROLLBACK PLAN

- **Trigger**: If vitest migration introduces flaky tests, test count regression, or unexpected import resolution failures that cannot be resolved within a session.
- **Procedure**: Each phase is self-contained. Vitest files coexist with custom runner files during migration. Rollback = delete the `.vitest.ts` file and retain the original `.test.ts` file. The custom runner continues to work for unconverted files.
- **Safe Coexistence**: The vitest.config.ts only matches `tests/**/*.vitest.ts` — it never touches `.test.ts` files. The custom runner only matches `dist/tests/*.test.js` — it never touches `.vitest.ts` files. Both can run simultaneously.

---

## L2: PHASE DEPENDENCIES

```
W-C (Build Fix) ──────────────────────────────────────────────────┐
                                                                   │
W-A Phase A1 (Pure Logic) ──► W-A Phase A2 (DB Tests) ──►        │
                                W-A Phase A3 (Integration) ──►    ├──► SYNC-003
                                  W-A Phase A4 (Server) ──►      │    (Final)
                                    W-A Phase A5 (Cleanup) ──────┤
                                                                   │
W-B (simFactory Types) ────────────────────────────────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| W-C (Build Fix) | None | SYNC-001 |
| W-A Phase A1 | None (can start in parallel with W-C) | A2, SYNC-002 |
| W-A Phase A2 | A1 pattern established | A3 |
| W-A Phase A3 | A2 DB fixtures established | A4 |
| W-A Phase A4 | A3 integration patterns established | A5 |
| W-A Phase A5 | A1-A4 all complete | SYNC-003 |
| W-B (simFactory) | None (independent workstream) | SYNC-003 |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| W-C: Build Error Cleanup | Low | <1 session (30 min) |
| W-A Phase A1: Pure Logic Tests | Low | 1 session |
| W-A Phase A2: DB-Dependent Tests | Medium | 1-2 sessions |
| W-A Phase A3: Integration Tests | Medium-High | 1 session |
| W-A Phase A4: Context Server Tests | High | 0.5-1 session |
| W-A Phase A5: Runner Cleanup | Low | 0.5 session |
| W-B: simFactory Type Unification | Medium | 1 session |
| **Total** | | **5-7 sessions** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No backup needed — coexistence model means no data destruction
- [ ] Feature flag not applicable — this is internal tooling
- [ ] No monitoring alerts needed — development-time tooling only

### Rollback Procedure
1. **Immediate**: Stop the migration at the current phase boundary. Both runners coexist.
2. **Revert code**: Delete any `.vitest.ts` files that were just created. Retain all `.test.ts` files. `git checkout -- mcp_server/tests/` if needed.
3. **Verify rollback**: Run `node run-tests.js` — all original tests should pass unchanged.
4. **For W-B**: Revert type changes with `git checkout -- scripts/extractors/ scripts/lib/`. TECH-DEBT blocks remain.
5. **For W-C**: Revert rank-memories.ts with `git checkout -- scripts/memory/rank-memories.ts`. 3 tsc errors remain.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — no database schema changes, no persistent state modifications

---

## L3: DEPENDENCY GRAPH

```
┌─────────────────┐
│   W-C: Build    │ ─────────────────────────────────────────────────────┐
│   Error Fix     │                                                       │
│   (<1 session)  │                                                       │
└────────┬────────┘                                                       │
         │                                                                 │
         ▼                                                                 │
    SYNC-001                                                               │
    (Build clean)                                                          │
                                                                           │
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐      │
│  W-A Phase A1   │────►│  W-A Phase A2   │────►│  W-A Phase A3   │      │
│  Pure Logic     │     │  DB Tests       │     │  Integration    │      │
│  (~30 files)    │     │  (~50 files)    │     │  (~20 files)    │      │
└────────┬────────┘     └─────────────────┘     └────────┬────────┘      │
         │                                                │                │
         ▼                                                ▼                │
    SYNC-002                                  ┌─────────────────┐         │
    (Pattern proven)                          │  W-A Phase A4   │         │
                                              │  Server Tests   │         │
                                              │  (~4 files)     │         │
                                              └────────┬────────┘         │
                                                       │                   │
                                                       ▼                   │
                                              ┌─────────────────┐         │
                                              │  W-A Phase A5   │         │
                                              │  Runner Cleanup │─────────┤
                                              └─────────────────┘         │
                                                                           │
┌─────────────────┐                                                        │
│  W-B: simFactory│────────────────────────────────────────────────────────┤
│  Type Unify     │                                                        │
│  (~1 session)   │                                                        │
└─────────────────┘                                                        │
                                                                           ▼
                                                                      SYNC-003
                                                                      (Final)
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| W-C: Build Fix | None | Clean tsc build (zero errors) | SYNC-001 |
| W-A A1: Pure Logic | None | 30 .vitest.ts files, migration pattern proven | A2, SYNC-002 |
| W-A A2: DB Tests | A1 (pattern) | 50 .vitest.ts files, DB fixture library | A3 |
| W-A A3: Integration | A2 (DB fixtures) | 20 .vitest.ts files, integration fixture patterns | A4 |
| W-A A4: Server Tests | A3 (integration patterns) | 4 .vitest.ts files, MCP lifecycle fixtures | A5 |
| W-A A5: Cleanup | A1-A4 all complete | run-tests.js deleted, package.json updated | SYNC-003 |
| W-B: simFactory | None | Unified type interfaces, zero double-casts | SYNC-003 |
| SYNC-003 | W-A A5, W-B, W-C | Final verified state — all workstreams complete | None |

---

## L3: CRITICAL PATH

1. **W-A Phase A1** — 1 session — CRITICAL (establishes migration pattern for all subsequent phases)
2. **W-A Phase A2** — 1-2 sessions — CRITICAL (largest batch, defines DB fixture approach)
3. **W-A Phase A3** — 1 session — CRITICAL (integration test complexity)
4. **W-A Phase A4** — 0.5-1 session — CRITICAL (highest difficulty per-file)
5. **W-A Phase A5** — 0.5 session — CRITICAL (cleanup gate before SYNC-003)

**Total Critical Path**: 4-5.5 sessions (W-A is the critical path)

**Parallel Opportunities**:
- W-C (Build Fix) can run simultaneously with W-A Phase A1 (no dependency)
- W-B (simFactory Types) can run at any time, fully parallel to all W-A phases
- W-A A1 and W-C can complete in the same session (both are quick)

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1: SYNC-001 | Build fully clean | `npx tsc --build --force` = 0 errors | Session 1 |
| M2: SYNC-002 | Pattern proven at scale | ≥30 .vitest.ts files passing, migration recipe documented | Session 1-2 |
| M3: DB Fixtures Ready | DB test infrastructure complete | beforeEach/afterEach fixtures working, ≥50 DB tests converted | Session 3-4 |
| M4: All Tests Migrated | 104+ .vitest.ts files, 0 .test.ts files | `npx vitest run` passes all tests, count ≥ 1,589 | Session 4-5 |
| M5: SYNC-003 (Final) | All workstreams complete | Zero tsc errors, zero TECH-DEBT blocks, zero custom runner files, all vitest tests pass | Session 5-7 |

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Gradual Vitest Migration via .vitest.ts Naming Convention

**Status**: Accepted (validated by Spec 103 REC-015 POC)

**Context**: The codebase has 104 test files using a custom test runner (`run-tests.js`) with manual pass/fail tracking via `TestEntry`/`TestResults` interfaces. This custom approach lacks coverage reporting, watch mode, CI integration, and standard tooling support. Spec 103 REC-015 proved Vitest is viable with a 3-file POC (20/20 tests, 115ms).

**Decision**: Migrate to Vitest gradually using `.vitest.ts` file extension during migration. Both runners coexist — vitest.config.ts matches `tests/**/*.vitest.ts`, custom runner matches `dist/tests/*.test.js`. Files are converted one-by-one or in batches, with the old `.test.ts` file deleted only after its `.vitest.ts` replacement passes. After all files are migrated, the custom runner is removed.

**Consequences**:
- Zero downtime during migration — both runners work simultaneously
- Each phase can be verified independently before proceeding
- Migration can be paused or rolled back at any phase boundary
- Small overhead of maintaining two runner configs temporarily (2-4 weeks)

**Alternatives Rejected**:
- **Big-bang migration**: Convert all 104 files at once. Rejected because: too risky (1,589 assertions), too large for a single session, no rollback path if issues found mid-migration.
- **Jest instead of Vitest**: Rejected because Vitest is TypeScript-native, faster (ESM-first), and already installed/proven by Spec 103 POC. Jest would require additional TS configuration (ts-jest or SWC).
- **Keep custom runner**: Rejected because it lacks coverage, watch mode, CI hooks, parallel execution, and standard `describe`/`it` structure. Ongoing maintenance burden.

### ADR-002: simFactory Type Unification via Shared Interface Definitions

**Status**: Proposed

**Context**: The simFactory module and 4 extractor files define parallel type hierarchies for the same data structures (DecisionData, SimPhase/PhaseEntry, DiagramData, ConversationData, SessionData). This forces `as unknown as T` double-casts at every boundary, documented as TECH-DEBT(P6-05) in 5 locations across 4 files.

**Decision**: Create shared interface definitions that both simFactory and extractors use. The shared types will be placed in `scripts/extractors/shared-types.ts` (or `scripts/lib/types/extractor-types.ts`). simFactory will be updated to return these shared types. Extractor-local type definitions will be replaced with imports from the shared module.

**Consequences**:
- Eliminates all 5 double-casts and TECH-DEBT blocks
- Single source of truth for extractor data shapes
- Any future extractor can import from the shared module
- Requires careful analysis of type differences to ensure the unified type covers all field variations

**Alternatives Rejected**:
- **Leave as TECH-DEBT**: Rejected because the double-casts obscure type safety and the unified fix is estimated at only 1 session of effort.
- **Make simFactory generic**: Rejected because the extractors all need concrete types, and generic factories add complexity without benefit here.

---

## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Quick Win — W-C Build Fix
**Files**: `scripts/memory/rank-memories.ts`, `shared/scoring/folder-scoring.ts`
**Duration**: ~15 min
**Agent**: Primary (single agent, direct fix)
**Approach**: Fix the 3 tsc errors by aligning `NormalizedMemory.id` type with `FolderMemoryInput.id`. Verify with `npx tsc --build --force`.

### Tier 2: Batch Conversion — W-A Phases A1-A4
| Agent | Focus | Files | Duration |
|-------|-------|-------|----------|
| Migration Agent(s) | Convert test files in batches of 5-10 | .test.ts → .vitest.ts | ~30 min per batch |
| Fixture Agent | Create shared DB fixtures | test-utils/db-fixture.ts | ~30 min (once, Phase A2) |
| Server Fixture Agent | Create MCP server lifecycle fixture | test-utils/mcp-fixture.ts | ~30 min (once, Phase A4) |

**Per-batch workflow**:
1. Read the original .test.ts file to understand assertions
2. Create .vitest.ts file with `describe`/`it`/`expect` structure
3. Run `npx vitest run --filter=<filename>` to verify
4. Delete original .test.ts file
5. Verify tsc still builds cleanly

**Duration**: 3-5 sessions across all A1-A4 phases

### Tier 3: Type Refactor — W-B simFactory
**Agent**: Primary (careful type analysis required)
**Task**: Analyze type differences, design shared interfaces, implement, verify
**Duration**: ~1 session
**Approach**: Sequential — analyze first, design second, implement third. Cannot parallelize because type changes cascade.

### Tier 4: Integration & Verification
**Agent**: Primary
**Task**: SYNC-003 final verification — run full vitest suite, tsc build, assertion count comparison
**Duration**: ~30 min

---

## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | Vitest Full Migration | Primary Agent | `mcp_server/tests/*.test.ts` → `*.vitest.ts` (121 files — 104 .test.ts + 17 .test.js) | Phase A1 Complete — A2 Starting |
| W-B | simFactory Type Unification | Primary Agent | `scripts/extractors/{decision,diagram,conversation}-extractor.ts`, `scripts/extractors/collect-session-data.ts`, `scripts/lib/simulation-factory.ts` | Not Started |
| W-C | Build Error Cleanup | Primary Agent | `scripts/memory/rank-memories.ts` | Phase 0 Complete |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | W-C complete | Primary | `npx tsc --build --force` = zero errors. Build is fully clean. Unblocks confidence for all other workstreams. |
| SYNC-002 | W-A Phase A1 complete | Primary | ≥30 .vitest.ts files passing. Migration recipe proven at scale. Validates that the POC pattern works for all test categories. Proceed/adjust decision for A2-A4. |
| SYNC-003 | W-A Phase A5 + W-B complete | Primary | Final verification: all tests under vitest, zero tsc errors, zero TECH-DEBT double-casts, custom runner removed. Spec 104 is done. |

### File Ownership Rules
- **W-A** owns all files in `mcp_server/tests/` — no other workstream modifies test files
- **W-B** owns `scripts/extractors/*.ts` and `scripts/lib/simulation-factory.ts` — no test file changes
- **W-C** owns `scripts/memory/rank-memories.ts` only — single file, no conflicts
- Cross-workstream changes are not expected (workstreams touch disjoint file sets)
- If W-B type changes affect test imports, coordinate at SYNC-003 (unlikely — extractors have no tests currently)

---

## L3+: COMMUNICATION PLAN

### Checkpoints
- **Per Phase**: Update tasks.md with completed/remaining items and evidence
- **Per Sync Point**: Verify gate criteria met, record in checklist.md
- **End of Session**: Save context via `generate-context.js` if workstream is mid-phase

### Status Reporting
- **W-A progress**: Track as "X/104 files migrated, Y/1589 assertions converted"
- **W-B progress**: Track as "X/5 TECH-DEBT blocks resolved"
- **W-C progress**: Track as "X/3 tsc errors fixed"

### Escalation Path
1. **Vitest import resolution failures** → Check vitest.config.ts alias configuration, verify compiled dist/ outputs are accessible
2. **DB test flakiness under vitest** → Investigate test isolation (shared DB state), add explicit cleanup in afterEach
3. **MCP server lifecycle issues in vitest** → Consider globalSetup/globalTeardown instead of per-file fixtures
4. **Type unification reveals incompatible shapes** → Document the incompatibility, consider adapter functions instead of full unification (update ADR-002 status to "Amended")

### Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Vitest import resolution differs from custom runner | Medium | Medium | vitest.config.ts already has alias config; extend as needed |
| DB tests have hidden shared state | Medium | High | Enforce fresh DB per test via beforeEach; use random DB filenames |
| MCP server tests need global setup | Low | Medium | Use vitest's globalSetup config option |
| simFactory types more divergent than documented | Low | Low | Adapter functions as fallback; accept remaining double-casts |
| Test count regression during migration | Low | High | Track assertion count per file; never delete .test.ts before .vitest.ts passes |
| Session time overruns on A2 (50 files) | Medium | Low | Split A2 into sub-batches (A2a, A2b, A2c) if needed |

---

<!--
LEVEL 3+ PLAN (~330 lines)
- Core + L2 + L3 + L3+ addendums
- 3 workstreams (W-A, W-B, W-C) with sync points
- AI execution framework with tiered agent strategy
- Full dependency graph and critical path analysis
- ADR-001: Gradual Vitest migration (Accepted)
- ADR-002: simFactory type unification (Proposed)
-->
