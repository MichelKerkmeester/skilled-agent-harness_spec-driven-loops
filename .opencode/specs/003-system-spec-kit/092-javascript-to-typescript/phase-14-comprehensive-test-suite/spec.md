# Spec: Phase 13 — Comprehensive Memory MCP Test Suite

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-L
> **Level:** 3+
> **Status:** Planned
> **Created:** 2026-02-07

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level3plus-govern | v2.0 -->

---

## 1. Goal

Create a comprehensive test suite covering every Memory MCP feature — all 22 tools across 7 layers, all 9 handler modules, and the 16+ core library modules currently lacking dedicated unit tests. The test suite must achieve >90% coverage of the MCP server codebase and serve as the quality gate for future development.

---

## 2. Context

### Current State (Post-Phase 12)

The Memory MCP server has **62 existing test files** (46 in mcp_server/tests/ + 16 in scripts/tests/) covering ~65% line coverage and ~40% branch coverage. However:

- **0 of 9 handler modules** have dedicated unit tests (handlers are only tested indirectly via integration tests)
- **16+ core library modules** lack any dedicated test file
- **0 end-to-end MCP protocol tests** exist (tool dispatch → handler → response)
- Critical modules like `memory-parser.ts` and `trigger-matcher.ts` (HIGH impact) have no tests

**mcp_server/tests/ breakdown:** 20 JavaScript (.js) + 26 TypeScript (.ts) = 46 files
**scripts/tests/ breakdown:** 13 JavaScript (.js) + 1 Python + 2 Shell = 16 files

### Why Now

Phase 12 completed Streams A–D (test infrastructure, logic bug fixes, module path fixes, require→import conversion). Production code is stable with ES imports. The test runner works. This is the optimal time to lock in quality with a comprehensive test suite.

### Phase 12 Completion Status

Phase 12 (Bug Audit) Streams A–D are complete. Streams E–F were deferred:

| Stream | Status | What it delivered |
|--------|--------|-------------------|
| **A: Test Infrastructure** | Complete | `run-tests.js` replaces hanging server-start; `npm run test:mcp` works |
| **B: Logic Bugs** | Complete | tier-classifier is polymorphic (accepts numbers or memory object), IVectorStore.search() throws on unimplemented, isBm25Enabled properly exported |
| **C: Module Paths** | Complete | All "Cannot find module" errors resolved |
| **D: require→import** | Complete | 1 `require()` remains in production (try-catch fallback in `lib/errors/core.ts`), 0 `module.exports` |
| **E: Test Consolidation** | **Deferred** | Still 20 .js + 26 .ts test files; scripts/tests/ still all .js |
| **F: Type Hardening** | **Deferred** | `allowJs: true` still set; type assertions not reduced |

**Impact on Phase 13:** Because Stream E was deferred, test files still use a mixed module loading pattern: ES `import` for Node built-ins + `require()` for internal modules loaded from `dist/` paths. New Phase 13 tests should follow this existing convention.

### Architecture Reference

The MCP server follows a 7-layer architecture:

| Layer | Name | Tools | Handler File |
|-------|------|-------|-------------|
| L1 | Orchestration | `memory_context` | `memory-context.ts` |
| L2 | Core | `memory_search`, `memory_match_triggers`, `memory_save` | `memory-search.ts`, `memory-triggers.ts`, `memory-save.ts` |
| L3 | Discovery | `memory_list`, `memory_stats`, `memory_health` | `memory-crud.ts` |
| L4 | Mutation | `memory_delete`, `memory_update`, `memory_validate` | `memory-crud.ts`, `checkpoints.ts` |
| L5 | Lifecycle | `checkpoint_create`, `checkpoint_list`, `checkpoint_restore`, `checkpoint_delete` | `checkpoints.ts` |
| L6 | Analysis | `task_preflight`, `task_postflight`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats` | `session-learning.ts`, `causal-graph.ts` |
| L7 | Maintenance | `memory_index_scan`, `memory_get_learning_history` | `memory-index.ts`, `session-learning.ts` |

---

## 3. Scope

### In Scope

#### Stream A: Handler Unit Tests (9 handler modules, ~18 handler functions)

| Handler File | Functions | Priority |
|-------------|-----------|----------|
| `memory-search.ts` | `handleMemorySearch` | P0 |
| `memory-triggers.ts` | `handleMemoryMatchTriggers` | P0 |
| `memory-save.ts` | `handleMemorySave`, `indexMemoryFile`, `atomicSaveMemory` | P0 |
| `memory-crud.ts` | `handleMemoryDelete`, `handleMemoryUpdate`, `handleMemoryList`, `handleMemoryStats`, `handleMemoryHealth` | P0 |
| `memory-index.ts` | `handleMemoryIndexScan`, `indexSingleFile`, `findConstitutionalFiles` | P1 |
| `checkpoints.ts` | `handleCheckpointCreate`, `handleCheckpointList`, `handleCheckpointRestore`, `handleCheckpointDelete`, `handleMemoryValidate` | P1 |
| `session-learning.ts` | `handleTaskPreflight`, `handleTaskPostflight`, `handleGetLearningHistory` | P1 |
| `causal-graph.ts` | `handleMemoryDriftWhy`, `handleMemoryCausalLink`, `handleMemoryCausalStats` | P1 |
| `memory-context.ts` | `handleMemoryContext` (extend existing) | P2 |

**Per handler: 5–8 test cases** (input validation, error handling, success path, edge cases)

#### Stream B: Missing Core Module Tests (16 modules)

| Module | Priority | Rationale |
|--------|----------|-----------|
| `memory-parser.ts` | P0 | Core parsing — frontmatter, triggers, content extraction |
| `trigger-matcher.ts` | P0 | Core feature — trigger phrase matching logic |
| `temporal-contiguity.ts` | P1 | Adjacency-based memory linking |
| `checkpoints.ts` (storage) | P1 | Snapshot creation/restoration storage layer |
| `importance-tiers.ts` | P1 | Tier classification logic (6-tier system) |
| `scoring.ts` | P1 | Base scoring functions |
| `folder-scoring.ts` | P1 | Per-folder ranking |
| `access-tracker.ts` | P2 | Access history tracking |
| `history.ts` | P2 | Edit history management |
| `index-refresh.ts` | P2 | Index refresh logic |
| `confidence-tracker.ts` | P2 | Confidence adjustment tracking |
| `channel.ts` | P2 | Session channel management |
| `reranker.ts` | P2 | Generic re-ranking interface |
| `embeddings.ts` | P2 | Embedding generation (API-dependent, mock-based) |
| `entity-scope.ts` | P2 | Entity scope resolution |
| `trigger-extractor.ts` | P2 | Automated trigger extraction |

#### Stream C: Integration Tests (8 scenarios)

| Scenario | Priority |
|----------|----------|
| Full search pipeline (query → embed → hybrid search → rerank → format) | P0 |
| Full save pipeline (file → parse → PE gate → embed → save → index) | P0 |
| Trigger matching pipeline (prompt → match → decay → co-activation) | P1 |
| Causal graph traversal (link → trace → stats) | P1 |
| Checkpoint lifecycle (create → verify → restore → delete) | P1 |
| Learning history aggregation (preflight → postflight → trends) | P2 |
| Session deduplication (token savings measurement) | P2 |
| Error recovery across handlers | P2 |

#### Stream D: MCP Protocol Conformance Tests

| Test Category | Priority |
|--------------|----------|
| All 22 tools callable via MCP dispatch | P0 |
| Input schema validation per tool | P1 |
| Error response format consistency | P1 |
| Response envelope structure | P1 |

### Out of Scope

- Performance benchmarking (separate concern)
- Load/stress testing
- UI/UX testing
- Changes to production code (test-only phase)
- CI/CD pipeline setup

---

## 4. Test Framework

### Pattern: Custom Test Runner (Existing Convention)

The codebase uses a custom test runner pattern (not Jest/Vitest), with:
- `pass(name, evidence)` / `fail(name, reason)` / `skip(name, reason)` functions
- Test IDs: `T###` numbered sequentially (Phase 13: T500-T539)
- Module loading: ES `import` for Node built-ins (path, assert, fs) + `require()` for internal modules from `dist/` paths
- `// @ts-nocheck` header on converted test files
- Graceful skip on module-load failure
- Async test support via `asyncTest()` wrapper
- Results aggregation with exit code

All new tests MUST follow this established pattern for consistency.

**Note on module loading:** While production `.ts` files use pure ES `import` (Phase 12 Stream D), test files still use a hybrid pattern — ES `import` for stdlib, `require()` for internal `dist/` modules. This is because Phase 12 Stream E (test consolidation) was deferred. New Phase 13 test files follow this existing hybrid test pattern.

### Test File Naming

- Handler tests: `handler-{name}.test.ts` (e.g., `handler-memory-search.test.ts`)
- Module tests: `{module-name}.test.ts` (e.g., `memory-parser.test.ts`)
- Integration tests: `integration-{scenario}.test.ts` (e.g., `integration-search-pipeline.test.ts`)
- MCP protocol tests: `mcp-{category}.test.ts` (e.g., `mcp-tool-dispatch.test.ts`)

### Test Database

Each test file creates an isolated SQLite database instance via temp directory to prevent cross-test contamination.

---

## 5. Exit Criteria

- [ ] Phase 12 (Bug Audit) fully complete (prerequisite)
- [ ] All 22 MCP tools have at least 3 test cases each (input validation, success, error)
- [ ] All 9 handler modules have dedicated unit tests
- [ ] All 16 missing core module tests created
- [ ] All 8 integration test scenarios passing
- [ ] MCP protocol conformance tests passing for all 22 tools
- [ ] `tsc --build` compiles all test files without errors
- [ ] Test runner produces clean pass/fail/skip output
- [ ] No existing tests broken by new test additions (regression check against Phase 12 post-state)

---

## 6. Cross-References

- **Plan:** See `plan.md`
- **Tasks:** See `tasks.md` (T500-T539)
- **Checklist:** See `checklist.md` (CHK-328-CHK-372)
- **Decision Record:** See `decision-record.md` (D13-1 through D13-7)
- **Prerequisite:** `phase-13-bug-audit/` (must be complete before Phase 13 starts)
- **Parent Spec:** `092-javascript-to-typescript/spec.md`
- **Existing Tests:** `.opencode/skill/system-spec-kit/mcp_server/tests/`
