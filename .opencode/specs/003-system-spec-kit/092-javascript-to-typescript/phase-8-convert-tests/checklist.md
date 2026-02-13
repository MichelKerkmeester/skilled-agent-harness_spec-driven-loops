# Verification Checklist: Phase 7 — Convert Test Files to TypeScript

> **Parent Spec:** 092-javascript-to-typescript/

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval to defer |
| **[P2]** | Optional | Can defer with documented reason |

**Evidence format:** When marking `[x]`, provide evidence on the next line:
```
- [x] CHK-NNN [Px] Description
  - **Evidence**: [compilation output / test result / file existence]
```

---

## Phase 7: Test Conversion Verification

### Batch Conversion

- [ ] CHK-140 [P0] Batch 7a: 12 cognitive/scoring tests converted and passing
  - **Evidence**:
  - All 12 files compile: `tsc --build mcp_server/tests` — 0 errors
  - All 12 tests pass: `npm run test:mcp` — cognitive suite 100% success
  - Key files:
    - `fsrs-scheduler.test.ts`: FSRS state typed, grade enum defined
    - `attention-decay.test.ts`: Decay config typed, tier states typed
    - `consolidation.test.ts`: ConsolidationPhase enum, phase results typed
    - `tier-classifier.test.ts`: TierState union defined
    - `composite-scoring.test.ts`: CompositeScore, FiveFactorWeights typed
    - `prediction-error-gate.test.ts`: PE_ACTIONS enum defined

- [ ] CHK-141 [P0] Batch 7b: 10 search/storage tests converted and passing
  - **Evidence**:
  - All 10 files compile: `tsc --build mcp_server/tests` — 0 errors
  - All 10 tests pass: `npm run test:mcp` — search/storage suite 100% success
  - Key files:
    - `bm25-index.test.ts`: BM25Document interface defined
    - `hybrid-search.test.ts`: HybridConfig, RRF parameters typed
    - `causal-edges.test.ts`: CausalEdge interface, RelationType union defined
    - `transaction-manager.test.ts`: TransactionResult typed
    - `schema-migration.test.ts`: Migration step types defined

- [ ] CHK-142 [P0] Batch 7c: 10 handler/integration tests converted and passing
  - **Evidence**:
  - All 10 files compile: `tsc --build mcp_server/tests` — 0 errors
  - All 10 tests pass: `npm run test:mcp` — handler/integration suite 100% success
  - Key files:
    - `memory-save-integration.test.ts`: Save pipeline typed, PE gate results typed
    - `memory-search-integration.test.ts`: Search pipeline typed end-to-end
    - `test-memory-handlers.js`: All 10 handler input/output interfaces defined
    - `test-session-learning.js`: Session state, learning delta typed
    - `corrections.test.ts`: CorrectionType enum defined

- [ ] CHK-143 [P0] Batch 7d: 14 remaining MCP tests converted and passing
  - **Evidence**:
  - All 14 files compile: `tsc --build mcp_server/tests` — 0 errors
  - All 14 tests pass: `npm run test:mcp` — remaining suite 100% success
  - Key files:
    - `preflight.test.ts`: PreflightResult, PreflightConfig typed
    - `provider-chain.test.ts`: ProviderTier, FallbackReason typed
    - `retry.test.ts`: RetryConfig, BackoffSequence typed
    - `envelope.test.ts`: MCPResponse<T> generic working
    - `tool-cache.test.ts`: CacheEntry<T> generic working

- [ ] CHK-144 [P0] Batch 7e: 13 scripts tests converted and passing
  - **Evidence**:
  - All 13 files compile: `tsc --build scripts/tests` — 0 errors
  - All 13 tests pass: `npm run test:cli` — 100% success
  - Key files:
    - `test-scripts-modules.js`: All 42 module export contracts typed
    - `test-validation-system.js`: Validation result types defined
    - `test-extractors-loaders.js`: Extractor result interfaces typed
    - `test-integration.js`: 12-step pipeline stages typed
    - `test-five-checks.js`: Five-check result interface defined

### Phase 7 Quality Gate

- [ ] CHK-145 [P0] `npm test` — 100% pass rate across ALL 59 test files
  - **Evidence**:
  - Command output: "59 tests passed, 0 failed"
  - No compilation errors in any test file
  - Test execution time: _____ seconds (baseline: _____ seconds)
  - All batches verified:
    - Batch 7a: 12/12 passed
    - Batch 7b: 10/10 passed
    - Batch 7c: 10/10 passed
    - Batch 7d: 14/14 passed
    - Batch 7e: 13/13 passed

- [ ] CHK-146 [P1] Test files use typed assertions where applicable
  - **Evidence**:
  - No `any` in test function return types
  - Test data fixtures use explicit typed interfaces
  - Assertion parameters properly typed (no implicit `any`)
  - Example verification:
    ```typescript
    const result: SearchResult = await memorySearch({ query: 'test' });
    assert.strictEqual(result.memories.length, 5);
    ```

- [ ] CHK-147 [P1] Mock implementations match interface definitions from `shared/types.ts`
  - **Evidence**:
  - Mock providers typed as `as unknown as IEmbeddingProvider`
  - Mock vector stores typed as `as unknown as IVectorStore`
  - Mock implementations provide required interface methods
  - Example verification:
    ```typescript
    const mockProvider = {
      embed: async (text: string) => [0.1, 0.2, 0.3],
      getDimension: () => 3,
      // ... other methods
    } as unknown as IEmbeddingProvider;
    ```

---

## Structural Verification

- [ ] CHK-148 [P0] No `.js` test source files remain (only compiled output)
  - **Evidence**:
  - `find mcp_server/tests -name '*.js' -type f` returns 59 compiled files
  - `find mcp_server/tests -name '*.ts' -type f` returns 46 source files
  - `find scripts/tests -name '*.js' -type f` returns 13 compiled files
  - `find scripts/tests -name '*.ts' -type f` returns 13 source files

- [ ] CHK-149 [P1] Test compilation integrated into build pipeline
  - **Evidence**:
  - `npm run build` compiles all source + test files
  - `tsconfig.json` includes test directories
  - Build time: _____ seconds (acceptable if < 60s)

- [ ] CHK-150 [P2] Test coverage maintained from JS baseline
  - **Evidence**:
  - Same number of test cases: before = _____, after = _____
  - Same assertions count (within 5%)
  - No test cases removed during conversion

---

## Performance Verification

- [ ] CHK-151 [P1] Test execution time not degraded
  - **Evidence**:
  - JS baseline: _____ seconds
  - TS compiled: _____ seconds
  - Delta: _____ seconds (acceptable if < 10% increase)

- [ ] CHK-152 [P2] Test compilation time acceptable
  - **Evidence**:
  - `tsc --build mcp_server/tests`: _____ seconds
  - `tsc --build scripts/tests`: _____ seconds
  - Total test compilation: _____ seconds (acceptable if < 30s)

---

## Documentation

- [ ] CHK-153 [P1] Test running instructions updated in READMEs
  - **Evidence**:
  - `mcp_server/README.md` mentions `.ts` test files
  - `scripts/README.md` mentions `.ts` test files
  - Test commands verified: `npm test`, `npm run test:mcp`, `npm run test:cli`

---

## Verification Summary

| Category | Total | Verified | Priority Breakdown |
|----------|------:|--------:|-------------------|
| Batch Conversion | 5 | /5 | 5 P0 |
| Phase 7 Quality Gate | 3 | /3 | 1 P0, 2 P1 |
| Structural | 3 | /3 | 1 P0, 1 P1, 1 P2 |
| Performance | 2 | /2 | 1 P1, 1 P2 |
| Documentation | 1 | /1 | 1 P1 |
| **TOTAL** | **14** | **/14** | |

| Priority | Count |
|----------|------:|
| **P0** | 7 |
| **P1** | 5 |
| **P2** | 2 |
| **Grand Total** | **14** |

**Verification Date**: ________________

---

## Cross-References

- **Phase Plan:** See `plan.md`
- **Tasks:** See `tasks.md` (tasks T210-T271)
- **Master Checklist:** See `../checklist.md` (CHK-140 through CHK-147)
- **Decision Record:** See `decision-record.md` (D8: Test Conversion Last)
