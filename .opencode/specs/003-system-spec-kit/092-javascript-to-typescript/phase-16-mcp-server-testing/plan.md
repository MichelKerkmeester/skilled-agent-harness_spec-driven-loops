# Implementation Plan: MCP Server Comprehensive Testing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.0 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (compiled to JS), JavaScript |
| **Framework** | Custom self-contained test framework (pass/fail/skip/assert) |
| **Storage** | SQLite via better-sqlite3 (context-index.sqlite) |
| **Testing** | Custom assertion framework, no external test runner |
| **MCP Server** | v1.7.2, 22 tools, 9 handler modules |

### Overview

This plan covers the systematic execution and validation of the entire MCP server test suite following the JavaScript-to-TypeScript migration. Testing is organized into 6 phases: environment preparation, cognitive module tests, search and scoring tests, handler and integration tests, MCP protocol and command alignment tests, and final results compilation. Each phase validates a distinct functional domain of the MCP server.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] TypeScript compilation complete (phases 0-14 done)
- [x] `dist/` directory populated with compiled test files
- [x] `node_modules` present with better-sqlite3
- [x] Test suite README.md reviewed for structure understanding

### Definition of Done
- [ ] All 80+ test files executed
- [ ] Per-category pass/fail/skip counts documented
- [ ] All P0 requirements met (handlers, integration, protocol)
- [ ] Overall pass rate >= 95%
- [ ] Results recorded in implementation-summary.md

---

## 3. ARCHITECTURE

### Pattern
Test Execution Pipeline -- sequential phases with independent test files within each phase

### Key Components

- **Test Runner**: `run-tests.js` (master runner) + individual `*.test.js` / `*.test.ts` files
- **Test Framework**: Self-contained per-file (pass/fail/skip/assert functions with evidence capture)
- **Module Under Test**: `dist/lib/` (compiled TypeScript modules) and `dist/handlers/` (compiled handlers)
- **Database**: SQLite (`context-index.sqlite`) for storage and handler tests
- **Fixtures**: `tests/fixtures/` directory for test data

### Data Flow

```
TypeScript Source (.ts) ──► tsc compile ──► dist/ (JavaScript)
                                              │
Test Files ──► Import from dist/lib/ & dist/handlers/
         │
         ├──► Unit Tests: Module-level function validation
         ├──► Integration Tests: Multi-module pipeline testing
         └──► MCP Protocol Tests: Tool dispatch and envelope validation
                                              │
                                    pass/fail/skip results
                                              │
                                    Summary report with evidence
```

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Environment Preparation
- [ ] Verify TypeScript compilation is current (`npm run build`)
- [ ] Confirm `dist/tests/` contains compiled test files
- [ ] Verify `dist/lib/` and `dist/handlers/` module resolution
- [ ] Check database availability (context-index.sqlite or test DB)
- [ ] Verify Node.js version >= 18

### Phase 2: Cognitive Module Tests (12+ modules)
- [ ] FSRS Scheduler (`fsrs-scheduler.test.ts` -- 52 tests)
- [ ] Prediction Error Gate (`prediction-error-gate.test.ts` -- 65 tests)
- [ ] Tier Classifier (`tier-classifier.test.ts` -- 91 tests)
- [ ] Attention Decay (`attention-decay.test.ts` -- 137 tests)
- [ ] Co-Activation (`co-activation.test.ts` -- 38 tests)
- [ ] Working Memory (`working-memory.test.ts` -- 51 tests)
- [ ] Archival Manager (`archival-manager.test.ts` -- 41 tests)
- [ ] Summary Generator (`summary-generator.test.ts` -- 52 tests)
- [ ] Corrections (`corrections.test.ts`)
- [ ] Temporal Contiguity (`temporal-contiguity.test.ts`)
- [ ] Consolidation (via `test-cognitive-integration.ts`)
- [ ] Preflight Validation (`preflight.test.ts` -- 34 tests)

### Phase 3: Search & Scoring Tests
- [ ] BM25 Index (`bm25-index.test.ts` -- 73 tests)
- [ ] Hybrid Search (`hybrid-search.test.ts` -- 66 tests)
- [ ] RRF Fusion (`rrf-fusion.test.ts` -- 22 tests)
- [ ] Cross-Encoder (`cross-encoder.test.ts` -- 50 tests)
- [ ] Intent Classifier (`intent-classifier.test.ts` -- 46 tests)
- [ ] Fuzzy Match (`fuzzy-match.test.ts` -- 61 tests)
- [ ] Reranker (`reranker.test.ts`)
- [ ] Composite Scoring (`composite-scoring.test.ts` -- 101 tests)
- [ ] Five-Factor Scoring (`five-factor-scoring.test.ts` -- 109 tests)
- [ ] Importance Tiers (`importance-tiers.test.ts`)
- [ ] Folder Scoring (`folder-scoring.test.ts`)
- [ ] Scoring (`scoring.test.ts`)
- [ ] Confidence Tracker (`confidence-tracker.test.ts`)

### Phase 4: Handler & Integration Tests
- [ ] Handler: Memory Search (`handler-memory-search.test.ts`)
- [ ] Handler: Memory Triggers (`handler-memory-triggers.test.ts`)
- [ ] Handler: Memory Save (`handler-memory-save.test.ts`)
- [ ] Handler: Memory CRUD (`handler-memory-crud.test.ts`)
- [ ] Handler: Memory Index (`handler-memory-index.test.ts`)
- [ ] Handler: Memory Context (`handler-memory-context.test.ts`)
- [ ] Handler: Checkpoints (`handler-checkpoints.test.ts`)
- [ ] Handler: Session Learning (`handler-session-learning.test.ts`)
- [ ] Handler: Causal Graph (`handler-causal-graph.test.ts`)
- [ ] Integration: Save Pipeline (`integration-save-pipeline.test.ts`)
- [ ] Integration: Search Pipeline (`integration-search-pipeline.test.ts`)
- [ ] Integration: Trigger Pipeline (`integration-trigger-pipeline.test.ts`)
- [ ] Integration: Checkpoint Lifecycle (`integration-checkpoint-lifecycle.test.ts`)
- [ ] Integration: Learning History (`integration-learning-history.test.ts`)
- [ ] Integration: Causal Graph (`integration-causal-graph.test.ts`)
- [ ] Integration: Error Recovery (`integration-error-recovery.test.ts`)
- [ ] Integration: Session Dedup (`integration-session-dedup.test.ts`)

### Phase 5: MCP Protocol, Storage & Infrastructure Tests
- [ ] MCP Tool Dispatch (`mcp-tool-dispatch.test.ts`)
- [ ] MCP Input Validation (`mcp-input-validation.test.ts`)
- [ ] MCP Response Envelope (`mcp-response-envelope.test.ts`)
- [ ] MCP Error Format (`mcp-error-format.test.ts`)
- [ ] Storage: Access Tracker (`access-tracker.test.ts`)
- [ ] Storage: Checkpoints Storage (`checkpoints-storage.test.ts`)
- [ ] Storage: History (`history.test.ts`)
- [ ] Storage: Index Refresh (`index-refresh.test.ts`)
- [ ] Storage: Transaction Manager (`transaction-manager.test.ts`)
- [ ] Infrastructure: Memory Parser (`memory-parser.test.ts`)
- [ ] Infrastructure: Trigger Matcher (`trigger-matcher.test.ts`)
- [ ] Infrastructure: Trigger Extractor (`trigger-extractor.test.ts`)
- [ ] Infrastructure: Entity Scope (`entity-scope.test.ts`)
- [ ] Infrastructure: Embeddings (`embeddings.test.ts`)
- [ ] Infrastructure: Channel (`channel.test.ts`)
- [ ] Infrastructure: Memory Types (`memory-types.test.ts`)
- [ ] Infrastructure: Memory Context (`memory-context.test.ts`)
- [ ] Infrastructure: Session Manager (`session-manager.test.ts`)
- [ ] Infrastructure: Tool Cache (`tool-cache.test.ts`)

### Phase 6: Standalone JS Tests & Command Alignment
- [ ] Standalone: `test-mcp-tools.js` (comprehensive MCP handler tests)
- [ ] Standalone: `test-memory-handlers.js` (memory handler tests)
- [ ] Standalone: `test-session-learning.js` (session learning tests)
- [ ] Standalone: `verify-cognitive-upgrade.js` (9-category verification)
- [ ] Standalone: `api-key-validation.test.js`
- [ ] Standalone: `api-validation.test.js`
- [ ] Standalone: `causal-edges.test.js`
- [ ] Standalone: `continue-session.test.js`
- [ ] Standalone: `crash-recovery.test.js`
- [ ] Standalone: `envelope.test.js`
- [ ] Standalone: `incremental-index.test.js`
- [ ] Standalone: `interfaces.test.js`
- [ ] Standalone: `layer-definitions.test.js`
- [ ] Standalone: `lazy-loading.test.js`
- [ ] Standalone: `memory-save-integration.test.js`
- [ ] Standalone: `memory-search-integration.test.js`
- [ ] Standalone: `modularization.test.js`
- [ ] Standalone: `recovery-hints.test.js`
- [ ] Standalone: `retry.test.js`
- [ ] Standalone: `schema-migration.test.js`
- [ ] Memory command analysis: `/memory:context` -> `memory-context` handler
- [ ] Memory command analysis: `/memory:continue` -> `session-learning` handler
- [ ] Memory command analysis: `/memory:learn` -> `session-learning` handler
- [ ] Memory command analysis: `/memory:manage` -> `memory-crud` handler
- [ ] Memory command analysis: `/memory:save` -> `memory-save` handler

### Phase 7: Results Compilation
- [ ] Aggregate all pass/fail/skip counts by category
- [ ] Calculate overall pass rate
- [ ] Document any failures with evidence
- [ ] Update checklist.md with verification evidence
- [ ] Create implementation-summary.md

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Individual cognitive, search, scoring modules | Compiled TS tests via `node dist/tests/*.test.js` |
| Handler | All 9 handler modules | Handler test files (`handler-*.test.ts`) |
| Integration | 8 cross-module pipelines | Integration test files (`integration-*.test.ts`) |
| Protocol | MCP tool dispatch, validation, envelopes | MCP test files (`mcp-*.test.ts`) |
| Standalone | Legacy JS tests, comprehensive runners | Direct JS execution (`node tests/*.test.js`) |
| E2E | Full cognitive system lifecycle | `test-cognitive-integration.ts`, `verify-cognitive-upgrade.js` |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| TypeScript compilation (dist/) | Internal | Green | Cannot run compiled tests |
| better-sqlite3 | External | Green | Database tests fail |
| Voyage API key | External | Yellow | Embedding tests skip (use --quick) |
| Node.js >= 18 | External | Green | Runtime compatibility |
| Test fixtures | Internal | Green | Test data for seeded scenarios |

---

## 7. ROLLBACK PLAN

- **Trigger**: N/A - this is a read-only testing phase (no code modifications)
- **Procedure**: If tests reveal critical regressions, document failures and escalate to a separate bug-fix spec folder

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Environment) ──► Phase 2 (Cognitive) ──┐
                     ──► Phase 3 (Search)    ──┤
                                               ├──► Phase 4 (Handlers/Integration)
                                               │
                                               ├──► Phase 5 (MCP Protocol/Storage)
                                               │
                                               ├──► Phase 6 (Standalone JS/Commands)
                                               │
                                               └──► Phase 7 (Results)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: Environment | None | All other phases |
| Phase 2: Cognitive | Phase 1 | Phase 7 |
| Phase 3: Search | Phase 1 | Phase 7 |
| Phase 4: Handlers/Integration | Phase 1 | Phase 7 |
| Phase 5: MCP Protocol/Storage | Phase 1 | Phase 7 |
| Phase 6: Standalone JS/Commands | Phase 1 | Phase 7 |
| Phase 7: Results | Phases 2-6 | None |

**Note**: Phases 2-6 can execute in parallel after Phase 1 completes.

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Environment Preparation | Low | 15-30 minutes |
| Phase 2: Cognitive Module Tests | Medium | 1-2 hours |
| Phase 3: Search & Scoring Tests | Medium | 1-2 hours |
| Phase 4: Handler & Integration Tests | Medium | 1-2 hours |
| Phase 5: MCP Protocol & Storage Tests | Medium | 1-2 hours |
| Phase 6: Standalone JS & Commands | Medium | 1-2 hours |
| Phase 7: Results Compilation | Low | 30-60 minutes |
| **Total** | | **5-10 hours** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Test database backed up (if using production DB)
- [ ] Compilation verified current

### Rollback Procedure
1. N/A - testing phase is non-destructive
2. If test database becomes corrupted, restore from backup or reinitialize
3. If compilation is stale, run `npm run build` and re-execute

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A

---

## Cross-References

- **Specification**: See [spec.md](spec.md) for requirements
- **Tasks**: See [tasks.md](tasks.md) for task breakdown
- **Checklist**: See [checklist.md](checklist.md) for verification checklist
- **Test README**: See `mcp_server/tests/README.md` for test suite documentation
