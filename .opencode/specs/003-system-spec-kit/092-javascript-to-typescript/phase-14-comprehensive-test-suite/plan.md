# Plan: Phase 13 — Comprehensive Memory MCP Test Suite

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-L
> **Status:** Planned
> **Created:** 2026-02-07

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level3plus-govern | v2.0 -->

---

## 1. Overview

**Goal:** Create a comprehensive test suite covering all 22 MCP tools, 9 handler modules, 16+ missing core module tests, and 8 integration scenarios.

**Prerequisite:** Phase 12 (Bug Audit) Streams A–D complete. Phase 12 delivered working test infrastructure (run-tests.js), fixed module paths, logic bug fixes (tier-classifier polymorphic, IVectorStore throws, isBm25Enabled exported), and require→import conversion in production .ts files. Streams E (test consolidation) and F (type hardening) were deferred — test files still use hybrid import/require pattern.

**Scope:**
- 4 parallel streams (A: handler tests, B: core module tests, C: integration tests, D: MCP protocol tests)
- ~37 new test files across handler, module, integration, and protocol categories
- Estimated: ~310 new test cases across all streams
- Target: >90% line coverage, >70% branch coverage

**Strategy:** Bottom-up — test core modules first (Stream B), then handlers (Stream A), then integration scenarios (Stream C), then protocol conformance (Stream D).

---

## 2. Execution Strategy

### Stream A: Handler Unit Tests (9 handler modules)

**Priority:** P0 — handlers are the untested layer between MCP dispatch and library modules.

Each handler test file follows a consistent pattern:
1. **Input validation tests** — Missing/invalid required parameters
2. **Error handling tests** — Database errors, file not found, permission denied
3. **Success path tests** — Correct output for valid inputs
4. **Edge cases** — Empty results, large inputs, concurrent calls
5. **MCP response format** — Correct `{ content: [{ type: 'text', text: JSON }] }` structure

| Handler File | Test File | Functions | Est. Tests |
|-------------|-----------|-----------|-----------|
| `memory-search.ts` | `handler-memory-search.test.ts` | 1 | 8 |
| `memory-triggers.ts` | `handler-memory-triggers.test.ts` | 1 | 8 |
| `memory-save.ts` | `handler-memory-save.test.ts` | 3 | 12 |
| `memory-crud.ts` | `handler-memory-crud.test.ts` | 5 | 20 |
| `memory-index.ts` | `handler-memory-index.test.ts` | 3 | 10 |
| `checkpoints.ts` | `handler-checkpoints.test.ts` | 5 | 15 |
| `session-learning.ts` | `handler-session-learning.test.ts` | 3 | 10 |
| `causal-graph.ts` | `handler-causal-graph.test.ts` | 3+ | 12 |
| `memory-context.ts` | Extend `memory-context.test.ts` | 1 | 8 |
| **Total** | **9 files** | **25+** | **~103** |

### Stream B: Missing Core Module Tests (16 modules)

**Priority:** Mixed — P0 for parser/matcher, P1 for scoring/storage, P2 for utilities.

| Module | Test File | Est. Tests | Priority |
|--------|-----------|-----------|----------|
| `memory-parser.ts` | `memory-parser.test.ts` | 15 | P0 |
| `trigger-matcher.ts` | `trigger-matcher.test.ts` | 12 | P0 |
| `temporal-contiguity.ts` | `temporal-contiguity.test.ts` | 8 | P1 |
| `checkpoints.ts` (storage) | `checkpoints-storage.test.ts` | 10 | P1 |
| `importance-tiers.ts` | `importance-tiers.test.ts` | 8 | P1 |
| `scoring.ts` | `scoring.test.ts` | 8 | P1 |
| `folder-scoring.ts` | `folder-scoring.test.ts` | 6 | P1 |
| `access-tracker.ts` | `access-tracker.test.ts` | 6 | P2 |
| `history.ts` | `history.test.ts` | 6 | P2 |
| `index-refresh.ts` | `index-refresh.test.ts` | 6 | P2 |
| `confidence-tracker.ts` | `confidence-tracker.test.ts` | 5 | P2 |
| `channel.ts` | `channel.test.ts` | 5 | P2 |
| `reranker.ts` | `reranker.test.ts` | 5 | P2 |
| `embeddings.ts` | `embeddings.test.ts` | 8 | P2 |
| `entity-scope.ts` | `entity-scope.test.ts` | 5 | P2 |
| `trigger-extractor.ts` | `trigger-extractor.test.ts` | 6 | P2 |
| **Total** | **16 files** | **~119** | |

### Stream C: Integration Tests (8 scenarios)

**Priority:** P0–P2 — validates cross-module interactions.

| Scenario | Test File | Est. Tests | Priority |
|----------|-----------|-----------|----------|
| Search pipeline | `integration-search-pipeline.test.ts` | 10 | P0 |
| Save pipeline | `integration-save-pipeline.test.ts` | 10 | P0 |
| Trigger matching pipeline | `integration-trigger-pipeline.test.ts` | 8 | P1 |
| Causal graph traversal | `integration-causal-graph.test.ts` | 8 | P1 |
| Checkpoint lifecycle | `integration-checkpoint-lifecycle.test.ts` | 8 | P1 |
| Learning history | `integration-learning-history.test.ts` | 6 | P2 |
| Session deduplication | `integration-session-dedup.test.ts` | 6 | P2 |
| Error recovery | `integration-error-recovery.test.ts` | 8 | P2 |
| **Total** | **8 files** | **~64** | |

### Stream D: MCP Protocol Conformance Tests

**Priority:** P0–P1 — validates the MCP contract.

| Category | Test File | Est. Tests | Priority |
|----------|-----------|-----------|----------|
| Tool dispatch (all 22 tools) | `mcp-tool-dispatch.test.ts` | 22 | P0 |
| Input schema validation | `mcp-input-validation.test.ts` | 22 | P1 |
| Error response format | `mcp-error-format.test.ts` | 10 | P1 |
| Response envelope structure | `mcp-response-envelope.test.ts` | 10 | P1 |
| **Total** | **4 files** | **~64** | |

---

## 3. Execution Order

```
Stream B: Core Module Tests (16 files)          ← FIRST (foundation — handlers depend on these)
    ├─ B1: P0 modules (parser, matcher)          ← Parallel
    ├─ B2: P1 modules (storage, scoring, tiers)  ← Parallel
    └─ B3: P2 modules (utilities)                ← Parallel
    ↓
Stream A: Handler Unit Tests (9 files)           ← SECOND (depends on module tests for mocking patterns)
    ├─ A1: L2 Core handlers (search, triggers, save)  ← P0, parallel
    ├─ A2: L3-L4 handlers (CRUD, index)                ← P0-P1, parallel
    └─ A3: L5-L6 handlers (checkpoints, learning, causal) ← P1, parallel
    ↓
Stream C: Integration Tests (8 files)            ← THIRD (validates cross-module interactions)
    ├─ C1: P0 pipelines (search, save)           ← Parallel
    ├─ C2: P1 pipelines (triggers, causal, checkpoint) ← Parallel
    └─ C3: P2 scenarios (learning, dedup, recovery)    ← Parallel
    ↓
Stream D: MCP Protocol Tests (4 files)           ← FOURTH (end-to-end validation)
    ↓
VERIFY: All tests pass, coverage report generated
```

---

## 4. Test Infrastructure Requirements

### Database Isolation

```typescript
// Pattern for each test file
const TEST_DB_DIR = path.join(os.tmpdir(), `mcp-test-${Date.now()}`);
fs.mkdirSync(TEST_DB_DIR, { recursive: true });
// ... tests ...
// Cleanup
fs.rmSync(TEST_DB_DIR, { recursive: true, force: true });
```

### Mock Patterns

| Dependency | Mock Strategy |
|-----------|--------------|
| Embedding providers | Return fixed Float32Array vectors |
| File system reads | Use temp files with known content |
| SQLite database | Isolated temp database per test file |
| External APIs | Never called — mock at provider level |

### Test Runner Script

Phase 12 (Stream A) establishes a working test runner for `test:mcp`. Phase 13 extends this with additional runner scripts for the new test categories.

Add to `package.json` (alongside Phase 12's established scripts):
```json
{
  "scripts": {
    "test:handlers": "node dist/tests/run-handler-tests.js",
    "test:modules": "node dist/tests/run-module-tests.js",
    "test:integration": "node dist/tests/run-integration-tests.js",
    "test:protocol": "node dist/tests/run-mcp-tests.js",
    "test:all": "npm run test:mcp && npm run test:handlers && npm run test:modules && npm run test:integration && npm run test:protocol"
  }
}
```

**Note:** `test:mcp` is Phase 12's existing runner for the original test suite. Phase 13 adds `test:handlers`, `test:modules`, `test:integration`, and `test:protocol`. `test:all` runs everything.

---

## 5. Verification Strategy

### Per-Stream Verification

| Stream | Verification |
|--------|-------------|
| A | All handler tests pass; each handler has ≥5 test cases |
| B | All core module tests pass; P0 modules have ≥10 test cases |
| C | All integration scenarios complete end-to-end |
| D | All 22 MCP tools respond correctly to valid/invalid input |

### Final Verification

1. `tsc --build` compiles all new test files
2. All test files produce clean pass/fail/skip output
3. No existing tests broken by new additions (regression check against 62 existing test files)
4. Total new test count ≥310
5. All P0 tests passing, all P1 tests passing or with documented reason
6. Coverage report shows >90% line coverage for handlers

---

## 6. Risk Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Handler functions not easily testable (tight coupling) | Medium | High | Create factory functions for dependency injection in tests |
| Database setup/teardown overhead slows tests | Medium | Medium | Use in-memory SQLite for unit tests, file-based only for integration |
| Embedding provider mocks don't match real behavior | Low | Medium | Use recorded real embeddings as fixtures |
| Test file naming conflicts with existing tests | Low | Low | Prefix new handler tests with `handler-` |
| TypeScript compilation adds test overhead | Low | Low | Tests use `dist/` paths (already compiled) |

---

## Cross-References

- **Spec:** See `spec.md`
- **Tasks:** See `tasks.md` (T500-T539)
- **Checklist:** See `checklist.md` (CHK-328-CHK-372)
- **Decision Record:** See `decision-record.md` (D13-1 through D13-7)
- **Prerequisite:** `phase-13-bug-audit/plan.md` (must complete before Phase 13)
- **Parent Plan:** `092-javascript-to-typescript/plan.md`
