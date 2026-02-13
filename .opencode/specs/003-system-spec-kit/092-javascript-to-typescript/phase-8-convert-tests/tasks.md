# Tasks: Phase 7 — Convert Test Files to TypeScript

> **Parent Spec:** 092-javascript-to-typescript/

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

---

## Workstream Organization

| Workstream | Owner | Scope | Target Files |
|------------|-------|-------|-------------|
| **W-G** | Test Agent (MCP) | Convert mcp_server/tests/ | 46 files |
| **W-H** | Test Agent (Scripts) | Convert scripts/tests/ | 13 files |

---

## Phase 7: Convert Test Files (59 files)

> **Goal:** Convert all test files to TypeScript for full type safety.
> **Workstream:** W-G (mcp tests), W-H (scripts tests)
> **Effort:** 59 files, ~55,297 lines

### Batch 7a: MCP Tests — Cognitive/Scoring (12 files)

- [ ] T210 [W-G] [P] Convert `tests/fsrs-scheduler.test.ts` (1,308 lines) [1h] {deps: Phase 5 complete}
  - Type FSRS state interface: `{ stability, difficulty, retrievability, lastReview }`
  - Type grade constants as enum: `GRADE_AGAIN | GRADE_HARD | GRADE_GOOD | GRADE_EASY`
  - Type scheduling result interface
  - Type all test fixtures with explicit interfaces

- [ ] T211 [W-G] [P] Convert `tests/attention-decay.test.ts` (1,361 lines) [1h]
  - Type decay configuration: `DecayConfig` interface
  - Type tier state transitions: `TierState` union
  - Type composite scoring inputs
  - Type 5-factor weights structure

- [ ] T212 [W-G] [P] Convert `tests/co-activation.test.ts` (456 lines) [30m]
  - Type co-activation map: `Map<string, Set<string>>`
  - Type activation strength: `number` (0-1 normalized)
  - Type memory pair interface

- [ ] T213 [W-G] [P] Convert `tests/consolidation.test.ts` (791 lines) [45m]
  - Type `ConsolidationPhase` enum: REPLAY, ABSTRACT, INTEGRATE, PRUNE
  - Type phase result interface for each phase
  - Type consolidation engine state

- [ ] T214 [W-G] [P] Convert `tests/tier-classifier.test.ts` (1,277 lines) [1h]
  - Type `TierState` union: `'HOT' | 'WARM' | 'COLD' | 'DORMANT' | 'ARCHIVED'`
  - Type classification criteria interface
  - Type state transition rules
  - Type tier statistics interface

- [ ] T215 [W-G] [P] Convert `tests/composite-scoring.test.ts` (1,620 lines) [1h]
  - Type `CompositeScore` interface with all 5 factors
  - Type `FiveFactorWeights` interface
  - Type individual factor functions
  - Type normalization config

- [ ] T216 [W-G] [P] Convert `tests/five-factor-scoring.test.ts` (1,068 lines) [1h]
  - Type temporal factor: `(ageDays: number, config: DecayConfig) => number`
  - Type usage factor: `(accessCount: number, recency: number) => number`
  - Type importance factor: `(tier: string) => number`
  - Type pattern factor: `(triggerMatches: number) => number`
  - Type citation factor: `(citationCount: number) => number`

- [ ] T217 [W-G] [P] Convert `tests/prediction-error-gate.test.ts` (973 lines) [45m]
  - Type `PE_ACTIONS` enum: CREATE, UPDATE, SUPERSEDE, REINFORCE, CREATE_LINKED
  - Type prediction error evaluation result
  - Type conflict detection result
  - Type gate decision logic types

- [ ] T218 [W-G] [P] Convert `tests/working-memory.test.ts` (545 lines) [30m]
  - Type working memory state interface
  - Type activation buffer types
  - Type attention window config

- [ ] T219 [W-G] [P] Convert `tests/archival-manager.test.ts` (908 lines) [45m]
  - Type archive criteria interface
  - Type state transition map
  - Type archival decision result

- [ ] T220 [W-G] [P] Convert `tests/summary-generator.test.ts` (594 lines) [30m]
  - Type summary configuration
  - Type summary result interface
  - Type section extraction types

- [ ] T221 [W-G] [P] Convert `tests/test-cognitive-integration.js` (1,889 lines) [1.5h]
  - Type full cognitive pipeline: input → FSRS → decay → consolidation → output
  - Type integration test fixtures
  - Type end-to-end result assertions

### Batch 7b: MCP Tests — Search/Storage (10 files)

- [ ] T222 [W-G] [P] Convert `tests/bm25-index.test.ts` (960 lines) [45m] {deps: Phase 5 complete}
  - Type `BM25Document` interface: `{ id, title, content, tokens }`
  - Type index options: `{ k1, b, avgDocLength }`
  - Type search result: `{ id, score, document }`

- [ ] T223 [W-G] [P] Convert `tests/hybrid-search.test.ts` (1,008 lines) [45m]
  - Type `HybridConfig` interface: semantic weight, BM25 weight, threshold
  - Type RRF configuration
  - Type fusion result type

- [ ] T224 [W-G] [P] Convert `tests/cross-encoder.test.ts` (600 lines) [30m]
  - Type reranking input: `{ query, candidates }`
  - Type reranking result: `{ id, originalScore, rerankedScore }`

- [ ] T225 [W-G] [P] Convert `tests/fuzzy-match.test.ts` (851 lines) [45m]
  - Type fuzzy match config: threshold, algorithm type
  - Type match result: `{ text, score, indices }`

- [ ] T226 [W-G] [P] Convert `tests/rrf-fusion.test.ts` (470 lines) [30m]
  - Type `RRFConfig`: k parameter
  - Type ranked list: `Array<{ id, rank }>`
  - Type fusion output: `Array<{ id, fusedScore }>`

- [ ] T227 [W-G] [P] Convert `tests/intent-classifier.test.ts` (724 lines) [30m]
  - Type `IntentType` enum: add_feature, fix_bug, refactor, security_audit, understand
  - Type classification result: `{ intent, confidence }`

- [ ] T228 [W-G] [P] Convert `tests/causal-edges.test.ts` (1,017 lines) [45m]
  - Type `CausalEdge` interface: `{ from, to, relationType, strength }`
  - Type `RelationType` union: CAUSED_BY, SUPERSEDED_BY, RELATED_TO, IMPLEMENTS, CONFLICTS_WITH, REFERENCES
  - Type edge creation result

- [ ] T229 [W-G] [P] Convert `tests/incremental-index.test.ts` (732 lines) [30m]
  - Type index delta: `{ added, updated, deleted }`
  - Type indexing result: `{ success, errors, stats }`

- [ ] T230 [W-G] [P] Convert `tests/transaction-manager.test.ts` (841 lines) [45m]
  - Type `TransactionResult`: `{ committed, rolledBack, operations }`
  - Type atomic operation types
  - Type rollback state

- [ ] T231 [W-G] [P] Convert `tests/schema-migration.test.ts` (1,107 lines) [45m]
  - Type migration step: `{ version, sql, rollback }`
  - Type migration result: `{ success, currentVersion, appliedSteps }`

### Batch 7c: MCP Tests — Handlers/Integration (10 files)

- [ ] T232 [W-G] [P] Convert `tests/memory-context.test.ts` (802 lines) [45m] {deps: Phase 5 complete}
  - Type context result: `{ memories, summary, anchors, triggers }`
  - Type context request: `{ query, specFolder?, limit? }`

- [ ] T233 [W-G] [P] Convert `tests/memory-save-integration.test.ts` (1,500 lines) [1h]
  - Type save input: `{ content, metadata, specFolder }`
  - Type PE gate result: `{ action, confidence, reason }`
  - Type FSRS scheduling result
  - Type save result: `{ success, memoryId, action }`

- [ ] T234 [W-G] [P] Convert `tests/memory-search-integration.test.ts` (1,148 lines) [1h]
  - Type search request: `{ query, limit, threshold, anchors?, filters? }`
  - Type search pipeline result at each stage
  - Type final formatted result

- [ ] T235 [W-G] [P] Convert `tests/test-memory-handlers.js` (2,059 lines) [1.5h]
  - Type input/output interfaces for all 10 handlers:
    - memory_context, memory_search, memory_save, memory_crud (4 ops)
    - memory_index_scan, memory_triggers, causal_graph, checkpoints
    - session_learning, session_continue
  - Type handler dispatch result

- [ ] T236 [W-G] [P] Convert `tests/test-session-learning.js` (1,973 lines) [1.5h]
  - Type session state: `{ id, channel, memories, learnedPatterns }`
  - Type learning delta: `{ corrections, newPatterns, stabilityChanges }`
  - Type session result

- [ ] T237 [W-G] [P] Convert `tests/session-manager.test.ts` (649 lines) [30m]
  - Type session state management types
  - Type deduplication result: `{ deduplicated, kept, removed }`

- [ ] T238 [W-G] [P] Convert `tests/crash-recovery.test.ts` (789 lines) [45m]
  - Type recovery state: `{ lastSavedState, pendingOperations, rollbackLog }`
  - Type recovery result: `{ recovered, lost, errors }`

- [ ] T239 [W-G] [P] Convert `tests/continue-session.test.ts` (694 lines) [30m]
  - Type continuation data: `{ sessionId, lastMessage, context }`
  - Type continuation result

- [ ] T240 [W-G] [P] Convert `tests/corrections.test.ts` (787 lines) [45m]
  - Type `CorrectionType` enum: SUPERSEDED, DEPRECATED, REFINED, MERGED
  - Type correction record: `{ type, oldMemoryId, newMemoryId, reason }`
  - Type correction application result

- [ ] T241 [W-G] [P] Convert `tests/test-mcp-tools.js` (1,419 lines) [1h]
  - Type MCP tool definitions (20+ tools)
  - Type tool input schemas
  - Type tool output responses

### Batch 7d: MCP Tests — Remaining (14 files)

- [ ] T242 [W-G] [P] Convert `tests/preflight.test.ts` (914 lines) [45m] {deps: Phase 5 complete}
  - Type `PreflightResult`: `{ passed, errors, warnings }`
  - Type `PreflightConfig`: `{ strict, checkPaths, checkContent }`
  - Type `PreflightError` class

- [ ] T243 [W-G] [P] Convert `tests/provider-chain.test.ts` (1,562 lines) [1h]
  - Type `ProviderTier` enum: PRIMARY, SECONDARY, FALLBACK, BM25_ONLY
  - Type `FallbackReason`: API_ERROR, TIMEOUT, QUOTA_EXCEEDED, UNAVAILABLE
  - Type provider chain state

- [ ] T244 [W-G] [P] Convert `tests/recovery-hints.test.ts` (1,207 lines) [1h]
  - Type `ErrorCode` enum or string union
  - Type `RecoveryHint` interface: `{ code, message, actions, links }`

- [ ] T245 [W-G] [P] Convert `tests/retry.test.ts` (1,160 lines) [1h]
  - Type `RetryConfig`: `{ maxRetries, backoffMs[], timeoutMs }`
  - Type `BackoffSequence`: `number[]`
  - Type retry result: `{ success, attempts, totalTime }`

- [ ] T246 [W-G] [P] Convert `tests/envelope.test.ts` (477 lines) [30m]
  - Type `MCPResponse<T>` generic: `{ success, data?, error?, meta }`
  - Type success envelope factory
  - Type error envelope factory

- [ ] T247 [W-G] [P] Convert `tests/tool-cache.test.ts` (851 lines) [45m]
  - Type `CacheEntry<T>` generic: `{ key, value, timestamp, ttl }`
  - Type LRU eviction result
  - Type cache stats: `{ hits, misses, size, evictions }`

- [ ] T248 [W-G] [P] Convert `tests/layer-definitions.test.ts` (1,155 lines) [45m]
  - Type `Layer` interface: `{ id, name, tokenBudget, description }`
  - Type `TOOL_LAYER_MAP`: `Record<string, string>`
  - Type layer validation result

- [ ] T249 [W-G] [P] Convert `tests/interfaces.test.ts` (308 lines) [15m]
  - Type interface compliance tests
  - Verify `IEmbeddingProvider` and `IVectorStore` implementations

- [ ] T250 [W-G] [P] Convert `tests/memory-types.test.ts` (410 lines) [30m]
  - Type `MemoryType` interface: `{ name, halfLifeDays, pathPatterns, keywords }`
  - Type `MemoryTypeName` string union
  - Type inference result

- [ ] T251 [W-G] [P] Convert `tests/modularization.test.ts` (430 lines) [30m]
  - Type module export structure verification
  - Type barrel export compliance

- [ ] T252 [W-G] [P] Convert `tests/api-key-validation.test.ts` (256 lines) [15m]
  - Type validation result: `{ valid, provider, error? }`

- [ ] T253 [W-G] [P] Convert `tests/api-validation.test.ts` (436 lines) [30m]
  - Type API response validation
  - Type schema compliance result

- [ ] T254 [W-G] [P] Convert `tests/lazy-loading.test.ts` (122 lines) [10m]
  - Type lazy initialization state
  - Type initialization result

- [ ] T255 [W-G] [P] Convert `tests/verify-cognitive-upgrade.js` (269 lines) [15m]
  - Type upgrade verification result
  - Type compatibility check result

### Batch 7e: Scripts Tests (13 files)

- [ ] T256 [W-H] [P] Convert `tests/test-scripts-modules.js` (3,467 lines) [2h] {deps: Phase 6 complete}
  - Type module export contracts for all 42 scripts modules
  - Type function signature verification
  - Type barrel export structure

- [ ] T257 [W-H] [P] Convert `tests/test-validation-system.js` (1,774 lines) [1h]
  - Type validation rule interface
  - Type validation result: `{ passed, errors, warnings }`
  - Type validator function type

- [ ] T258 [W-H] [P] Convert `tests/test-extractors-loaders.js` (1,330 lines) [1h]
  - Type extractor result interfaces (9 extractors)
  - Type loader result: `{ data, source, priority }`

- [ ] T259 [W-H] [P] Convert `tests/test-template-comprehensive.js` (1,233 lines) [1h]
  - Type template rendering result
  - Type template variable types
  - Type template validation result

- [ ] T260 [W-H] [P] Convert `tests/test-integration.js` (1,043 lines) [45m]
  - Type 12-step pipeline stages
  - Type pipeline result: `{ success, output, errors }`

- [ ] T261 [W-H] [P] Convert `tests/test-five-checks.js` (963 lines) [45m]
  - Type five-check result interface: `{ necessary, alternatives, sufficient, fitsGoal, longTerm }`
  - Type individual check result: `{ passed, reason }`

- [ ] T262 [W-H] [P] Convert `tests/test-template-system.js` (819 lines) [30m]
  - Type template system config
  - Type template resolution result

- [ ] T263 [W-H] [P] Convert `tests/test-bug-fixes.js` (561 lines) [30m]
  - Type bug fix verification result
  - Type regression test result

- [ ] T264 [W-H] [P] Convert `tests/test-utils.js` (439 lines) [30m]
  - Type utility function test fixtures
  - Type utility result types

- [ ] T265 [W-H] [P] Convert `tests/test-export-contracts.js` (314 lines) [15m]
  - Type export structure verification
  - Type contract compliance result

- [ ] T266 [W-H] [P] Convert `tests/test-naming-migration.js` (349 lines) [15m]
  - Type naming convention check result
  - Type alias preservation verification

- [ ] T267 [W-H] [P] Convert `tests/test-bug-regressions.js` (313 lines) [15m]
  - Type regression test result
  - Type expected behavior types

- [ ] T268 [W-H] [P] Convert `tests/test-embeddings-factory.js` (115 lines) [10m]
  - Type factory creation result
  - Type provider initialization result

### Phase 7 Verification

- [ ] T269 [W-G] Verify all mcp_server tests pass as TypeScript [30m] {deps: T210-T255}
  - `npm run test:mcp` — 100% pass rate (46 files)
  - All cognitive, search, storage, handler tests passing
  - No compilation errors in test files

- [ ] T270 [W-H] Verify all scripts tests pass as TypeScript [30m] {deps: T256-T268}
  - `npm run test:cli` — 100% pass rate (13 files)
  - All module, validation, integration tests passing
  - No compilation errors in test files

- [ ] T271 [W-G] Run full `npm test` — 100% pass rate across all 59 test files [15m] {deps: T269, T270}
  - Combined test suite passes
  - No type errors in any test file
  - Test execution time unchanged from JS baseline

---

## Completion Criteria

- [ ] All 59 tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `tsc --build` compiles all test files with 0 errors
- [ ] `npm test` passes — 100% success rate
- [ ] No `any` in test function signatures (except deliberate mock casts)
- [ ] Test data fixtures use explicit typed interfaces
- [ ] Mock implementations match interfaces from `shared/types.ts`

---

## Cross-References

- **Phase Plan:** See `plan.md`
- **Checklist:** See `checklist.md` (CHK-140 through CHK-147)
- **Master Plan:** See `../plan.md` (Phase 7, lines 310-328)
- **Master Tasks:** See `../tasks.md` (tasks T210-T271)
