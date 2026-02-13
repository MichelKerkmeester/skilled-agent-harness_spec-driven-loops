# Plan: Phase 7 — Convert Test Files to TypeScript

> **Parent Spec:** 092-javascript-to-typescript/

---

## Overview

**Phase:** 7 of 9
**Goal:** Convert all test files to TypeScript for full type safety
**Scope:** 59 test files, ~55,297 lines (56% of total codebase)
**Dependencies:** Phase 5 (MCP server complete), Phase 6 (scripts complete)
**Workstreams:** W-G (MCP tests), W-H (scripts tests)
**Session:** 4 (parallel with Phase 8 documentation updates)

---

## Strategy

### Why Last

Tests can run as `.js` against compiled TypeScript output — no functionality risk during migration. Deferring test conversion reduces complexity during source conversion phases (Phases 3-6). All 5 test batches can be parallelized once source code is complete.

### No Inter-Test Dependencies

Test files have no cross-file dependencies — each test suite is self-contained. This enables maximum parallelization: all 59 tests can be converted simultaneously by separate agents.

### Test Framework

- **Framework:** `node:test` (Node.js built-in, already used)
- **Assertions:** `node:assert` (Node.js built-in, already used)
- **Type Safety:** Both have TypeScript types via `@types/node` (installed in Phase 1)

No external test framework dependencies. No test infrastructure changes needed.

---

## Conversion Batches

Tests grouped by target area for logical parallel conversion.

### Batch 7a: Cognitive & Scoring Tests (12 files)

**Target:** `mcp_server/tests/` — cognitive and scoring subsystems
**Lines:** ~12,000
**Agent:** Agent 1 (Session 4)

| File | Lines | Key Typing Needs |
|------|------:|-----------------|
| `fsrs-scheduler.test.ts` | 1,308 | FSRS state types, grade constants |
| `attention-decay.test.ts` | 1,361 | Decay config, tier states |
| `co-activation.test.ts` | 456 | Activation map types |
| `consolidation.test.ts` | 791 | ConsolidationPhase enum, phase results |
| `tier-classifier.test.ts` | 1,277 | TierState union, classification results |
| `composite-scoring.test.ts` | 1,620 | CompositeScore, FiveFactorWeights |
| `five-factor-scoring.test.ts` | 1,068 | Individual factor score types |
| `prediction-error-gate.test.ts` | 973 | PE_ACTIONS enum, gate decisions |
| `working-memory.test.ts` | 545 | Working memory state types |
| `archival-manager.test.ts` | 908 | Archive criteria, state transitions |
| `summary-generator.test.ts` | 594 | Summary config types |
| `test-cognitive-integration.js` | 1,889 | Full cognitive pipeline types |

### Batch 7b: Search & Storage Tests (10 files)

**Target:** `mcp_server/tests/` — search and storage subsystems
**Lines:** ~9,000
**Agent:** Agent 2 (Session 4)

| File | Lines | Key Typing Needs |
|------|------:|-----------------|
| `bm25-index.test.ts` | 960 | BM25Document, index options |
| `hybrid-search.test.ts` | 1,008 | HybridConfig, RRF parameters |
| `cross-encoder.test.ts` | 600 | Reranking result types |
| `fuzzy-match.test.ts` | 851 | Fuzzy match config, threshold types |
| `rrf-fusion.test.ts` | 470 | RRFConfig, rank fusion results |
| `intent-classifier.test.ts` | 724 | IntentType enum, classification results |
| `causal-edges.test.ts` | 1,017 | CausalEdge interface, RelationType |
| `incremental-index.test.ts` | 732 | Index delta types |
| `transaction-manager.test.ts` | 841 | TransactionResult, atomic operation types |
| `schema-migration.test.ts` | 1,107 | Migration step types |

### Batch 7c: Handlers & Integration Tests (10 files)

**Target:** `mcp_server/tests/` — handlers and integration flows
**Lines:** ~10,000
**Agent:** Agent 3 (Session 4)

| File | Lines | Key Typing Needs |
|------|------:|-----------------|
| `memory-context.test.ts` | 802 | Context result types |
| `memory-save-integration.test.ts` | 1,500 | Save pipeline types, PE gate results |
| `memory-search-integration.test.ts` | 1,148 | Search pipeline types, result formatting |
| `test-memory-handlers.js` | 2,059 | Handler input/output types for all 10 handlers |
| `test-session-learning.js` | 1,973 | Session state, learning delta types |
| `session-manager.test.ts` | 649 | Session state, dedup results |
| `crash-recovery.test.ts` | 789 | Recovery state types |
| `continue-session.test.ts` | 694 | Continuation data types |
| `corrections.test.ts` | 787 | CorrectionType enum, correction results |
| `test-mcp-tools.js` | 1,419 | MCP tool input/output types |

### Batch 7d: Remaining MCP Tests (14 files)

**Target:** `mcp_server/tests/` — all other MCP modules
**Lines:** ~11,000
**Agent:** Agent 4 (Session 4)

| File | Lines | Key Typing Needs |
|------|------:|-----------------|
| `preflight.test.ts` | 914 | PreflightResult, PreflightConfig |
| `provider-chain.test.ts` | 1,562 | ProviderTier, FallbackReason |
| `recovery-hints.test.ts` | 1,207 | ErrorCode, RecoveryHint types |
| `retry.test.ts` | 1,160 | RetryConfig, BackoffSequence |
| `envelope.test.ts` | 477 | MCPResponse<T> generic |
| `tool-cache.test.ts` | 851 | CacheEntry<T> generic |
| `layer-definitions.test.ts` | 1,155 | Layer interface, token budgets |
| `interfaces.test.ts` | 308 | Interface compliance tests |
| `memory-types.test.ts` | 410 | MemoryType, MemoryTypeName |
| `modularization.test.ts` | 430 | Module export verification |
| `api-key-validation.test.ts` | 256 | Validation result types |
| `api-validation.test.ts` | 436 | API response types |
| `lazy-loading.test.ts` | 122 | Lazy init state types |
| `verify-cognitive-upgrade.js` | 269 | Upgrade verification types |

### Batch 7e: Scripts Tests (13 files)

**Target:** `scripts/tests/` — all CLI scripts tests
**Lines:** ~12,820
**Agent:** Agent 5 (Session 4)

| File | Lines | Key Typing Needs |
|------|------:|-----------------|
| `test-scripts-modules.js` | 3,467 | Module export contract types |
| `test-validation-system.js` | 1,774 | Validation result types, error types |
| `test-extractors-loaders.js` | 1,330 | Extractor result types, loader types |
| `test-template-comprehensive.js` | 1,233 | Template rendering types |
| `test-integration.js` | 1,043 | Pipeline integration types |
| `test-five-checks.js` | 963 | Five-check result types |
| `test-template-system.js` | 819 | Template system types |
| `test-bug-fixes.js` | 561 | Bug fix verification types |
| `test-utils.js` | 439 | Utility function types |
| `test-export-contracts.js` | 314 | Export structure types |
| `test-naming-migration.js` | 349 | Naming convention types |
| `test-bug-regressions.js` | 313 | Regression test types |
| `test-embeddings-factory.js` | 115 | Factory creation types |

---

## Typing Patterns

### Mock Typing Strategy

Tests use mocks extensively. Type them as `as unknown as MockType` to satisfy TypeScript while preserving test flexibility:

```typescript
const mockProvider = {
  embed: async (text: string) => [0.1, 0.2, 0.3],
  getDimension: () => 3,
  // ... other methods
} as unknown as IEmbeddingProvider;
```

This pattern avoids implementing full interface methods when tests only need partial behavior.

### Test Data Fixtures

Type test data structures explicitly:

```typescript
interface TestMemory {
  id: string;
  title: string;
  content: string;
  importance: number;
  tier: string;
}

const fixture: TestMemory = {
  id: 'test-001',
  title: 'Test Memory',
  content: 'Test content...',
  importance: 0.8,
  tier: 'HOT'
};
```

### Assertion Typing

Node's `assert` module is fully typed. Use typed assertions:

```typescript
import assert from 'node:assert';
import { describe, it } from 'node:test';

describe('Memory Save', () => {
  it('should return typed result', async () => {
    const result = await memorySave(input);
    assert.strictEqual(typeof result.id, 'string');
    assert.ok(result.success); // boolean assertion
  });
});
```

---

## Verification Checkpoints

After each batch conversion:

1. **Compile:** `tsc --build` with 0 errors
2. **Run tests:** Batch-specific test command passes 100%
3. **Type check:** No `any` in test assertions (except deliberate mock casts)

After all batches:

1. **Full test suite:** `npm test` — 100% pass rate (all 59 files)
2. **Type safety:** Tests benefit from source code type definitions
3. **No regressions:** Compiled test output is functionally identical

---

## Agent Allocation (Session 4)

| Agent | Batch | Files | Estimated Time |
|-------|-------|------:|---------------|
| Agent 1 | 7a | 12 | ~8 hours |
| Agent 2 | 7b | 10 | ~7 hours |
| Agent 3 | 7c | 10 | ~9 hours |
| Agent 4 | 7d | 14 | ~9 hours |
| Agent 5 | 7e | 13 | ~8 hours |

All 5 agents work in parallel. No inter-batch dependencies.

---

## Success Criteria

- [ ] All 59 test files converted to `.ts`
- [ ] `npm test` passes with 100% success rate
- [ ] No `any` in test function signatures (mocks excluded)
- [ ] All mock implementations use typed interfaces from `shared/types.ts`
- [ ] Test compilation time < 30 seconds
- [ ] Test execution time unchanged from JS baseline

---

## Cross-References

- **Specification:** See `../spec.md`
- **Master Plan:** See `../plan.md` (Phase 7, lines 310-328)
- **Tasks:** See `tasks.md` (tasks T210-T271)
- **Checklist:** See `checklist.md` (CHK-140 through CHK-147)
- **Decisions:** See `decision-record.md` (D8: Test Conversion Last)
