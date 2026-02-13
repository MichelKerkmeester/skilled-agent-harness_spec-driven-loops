# Tasks: MCP Server Comprehensive Testing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.0 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] [Priority] Description (file path) -> CHK-###`

---

## Phase 1: Environment Preparation

- [ ] T001 [P0] Verify TypeScript compilation is current (`npm run build`) -> CHK-001
- [ ] T002 [P0] Confirm `dist/tests/` contains compiled test files -> CHK-001
- [ ] T003 [P0] Verify `dist/lib/` and `dist/handlers/` module resolution -> CHK-001
- [ ] T004 [P1] Check database availability (context-index.sqlite) -> CHK-003
- [ ] T005 [P1] Verify Node.js version >= 18 -> CHK-003

**Phase Gate**: All P0 tasks complete, environment ready for test execution

---

## Phase 2: Cognitive Module Tests

- [ ] T010 [P] [P0] Execute FSRS Scheduler tests (`fsrs-scheduler.test.ts` -- 52 tests) -> CHK-020
- [ ] T011 [P] [P0] Execute Prediction Error Gate tests (`prediction-error-gate.test.ts` -- 65 tests) -> CHK-020
- [ ] T012 [P] [P0] Execute Tier Classifier tests (`tier-classifier.test.ts` -- 91 tests) -> CHK-020
- [ ] T013 [P] [P0] Execute Attention Decay tests (`attention-decay.test.ts` -- 137 tests) -> CHK-020
- [ ] T014 [P] [P0] Execute Co-Activation tests (`co-activation.test.ts` -- 38 tests) -> CHK-020
- [ ] T015 [P] [P0] Execute Working Memory tests (`working-memory.test.ts` -- 51 tests) -> CHK-020
- [ ] T016 [P] [P0] Execute Archival Manager tests (`archival-manager.test.ts` -- 41 tests) -> CHK-020
- [ ] T017 [P] [P0] Execute Summary Generator tests (`summary-generator.test.ts` -- 52 tests) -> CHK-020
- [ ] T018 [P] [P0] Execute Corrections tests (`corrections.test.ts`) -> CHK-020
- [ ] T019 [P] [P1] Execute Temporal Contiguity tests (`temporal-contiguity.test.ts`) -> CHK-020
- [ ] T020 [P] [P1] Execute Preflight Validation tests (`preflight.test.ts` -- 34 tests) -> CHK-020
- [ ] T021 [P] [P0] Execute Cognitive Integration tests (`test-cognitive-integration.ts`) -> CHK-021

**Phase Gate**: All P0 cognitive tests pass, 12+ modules validated -> CHK-020

---

## Phase 3: Search & Scoring Tests

- [ ] T030 [P] [P0] Execute BM25 Index tests (`bm25-index.test.ts` -- 73 tests) -> CHK-022
- [ ] T031 [P] [P0] Execute Hybrid Search tests (`hybrid-search.test.ts` -- 66 tests) -> CHK-022
- [ ] T032 [P] [P0] Execute RRF Fusion tests (`rrf-fusion.test.ts` -- 22 tests) -> CHK-022
- [ ] T033 [P] [P0] Execute Cross-Encoder tests (`cross-encoder.test.ts` -- 50 tests) -> CHK-022
- [ ] T034 [P] [P0] Execute Intent Classifier tests (`intent-classifier.test.ts` -- 46 tests) -> CHK-022
- [ ] T035 [P] [P0] Execute Fuzzy Match tests (`fuzzy-match.test.ts` -- 61 tests) -> CHK-022
- [ ] T036 [P] [P1] Execute Reranker tests (`reranker.test.ts`) -> CHK-022
- [ ] T037 [P] [P0] Execute Composite Scoring tests (`composite-scoring.test.ts` -- 101 tests) -> CHK-023
- [ ] T038 [P] [P0] Execute Five-Factor Scoring tests (`five-factor-scoring.test.ts` -- 109 tests) -> CHK-023
- [ ] T039 [P] [P1] Execute Importance Tiers tests (`importance-tiers.test.ts`) -> CHK-023
- [ ] T040 [P] [P1] Execute Folder Scoring tests (`folder-scoring.test.ts`) -> CHK-023
- [ ] T041 [P] [P1] Execute Scoring tests (`scoring.test.ts`) -> CHK-023
- [ ] T042 [P] [P1] Execute Confidence Tracker tests (`confidence-tracker.test.ts`) -> CHK-023

**Phase Gate**: All P0 search and scoring tests pass -> CHK-022, CHK-023

---

## Phase 4: Handler & Integration Tests

### Handler Tests (9 modules)
- [ ] T050 [P] [P0] Execute Handler: Memory Search (`handler-memory-search.test.ts`) -> CHK-024
- [ ] T051 [P] [P0] Execute Handler: Memory Triggers (`handler-memory-triggers.test.ts`) -> CHK-024
- [ ] T052 [P] [P0] Execute Handler: Memory Save (`handler-memory-save.test.ts`) -> CHK-024
- [ ] T053 [P] [P0] Execute Handler: Memory CRUD (`handler-memory-crud.test.ts`) -> CHK-024
- [ ] T054 [P] [P0] Execute Handler: Memory Index (`handler-memory-index.test.ts`) -> CHK-024
- [ ] T055 [P] [P0] Execute Handler: Memory Context (`handler-memory-context.test.ts`) -> CHK-024
- [ ] T056 [P] [P0] Execute Handler: Checkpoints (`handler-checkpoints.test.ts`) -> CHK-024
- [ ] T057 [P] [P0] Execute Handler: Session Learning (`handler-session-learning.test.ts`) -> CHK-024
- [ ] T058 [P] [P0] Execute Handler: Causal Graph (`handler-causal-graph.test.ts`) -> CHK-024

### Integration Tests (8 pipelines)
- [ ] T060 [P] [P0] Execute Integration: Save Pipeline (`integration-save-pipeline.test.ts`) -> CHK-025
- [ ] T061 [P] [P0] Execute Integration: Search Pipeline (`integration-search-pipeline.test.ts`) -> CHK-025
- [ ] T062 [P] [P0] Execute Integration: Trigger Pipeline (`integration-trigger-pipeline.test.ts`) -> CHK-025
- [ ] T063 [P] [P0] Execute Integration: Checkpoint Lifecycle (`integration-checkpoint-lifecycle.test.ts`) -> CHK-025
- [ ] T064 [P] [P0] Execute Integration: Learning History (`integration-learning-history.test.ts`) -> CHK-025
- [ ] T065 [P] [P0] Execute Integration: Causal Graph (`integration-causal-graph.test.ts`) -> CHK-025
- [ ] T066 [P] [P0] Execute Integration: Error Recovery (`integration-error-recovery.test.ts`) -> CHK-025
- [ ] T067 [P] [P0] Execute Integration: Session Dedup (`integration-session-dedup.test.ts`) -> CHK-025

**Phase Gate**: All 9 handlers and 8 integration pipelines pass -> CHK-024, CHK-025

---

## Phase 5: MCP Protocol, Storage & Infrastructure Tests

### MCP Protocol Tests (4 tests)
- [ ] T070 [P] [P0] Execute MCP Tool Dispatch (`mcp-tool-dispatch.test.ts`) -> CHK-026
- [ ] T071 [P] [P0] Execute MCP Input Validation (`mcp-input-validation.test.ts`) -> CHK-026
- [ ] T072 [P] [P0] Execute MCP Response Envelope (`mcp-response-envelope.test.ts`) -> CHK-026
- [ ] T073 [P] [P0] Execute MCP Error Format (`mcp-error-format.test.ts`) -> CHK-026

### Storage Tests
- [ ] T075 [P] [P1] Execute Access Tracker tests (`access-tracker.test.ts`) -> CHK-027
- [ ] T076 [P] [P1] Execute Checkpoints Storage tests (`checkpoints-storage.test.ts`) -> CHK-027
- [ ] T077 [P] [P1] Execute History tests (`history.test.ts`) -> CHK-027
- [ ] T078 [P] [P1] Execute Index Refresh tests (`index-refresh.test.ts`) -> CHK-027
- [ ] T079 [P] [P1] Execute Transaction Manager tests (`transaction-manager.test.ts`) -> CHK-027

### Infrastructure Tests
- [ ] T080 [P] [P1] Execute Memory Parser tests (`memory-parser.test.ts`) -> CHK-028
- [ ] T081 [P] [P1] Execute Trigger Matcher tests (`trigger-matcher.test.ts`) -> CHK-028
- [ ] T082 [P] [P1] Execute Trigger Extractor tests (`trigger-extractor.test.ts`) -> CHK-028
- [ ] T083 [P] [P1] Execute Entity Scope tests (`entity-scope.test.ts`) -> CHK-028
- [ ] T084 [P] [P1] Execute Embeddings tests (`embeddings.test.ts`) -> CHK-028
- [ ] T085 [P] [P1] Execute Channel tests (`channel.test.ts`) -> CHK-028
- [ ] T086 [P] [P1] Execute Memory Types tests (`memory-types.test.ts`) -> CHK-028
- [ ] T087 [P] [P1] Execute Memory Context unit tests (`memory-context.test.ts`) -> CHK-028
- [ ] T088 [P] [P1] Execute Session Manager tests (`session-manager.test.ts`) -> CHK-028
- [ ] T089 [P] [P1] Execute Tool Cache tests (`tool-cache.test.ts`) -> CHK-028

**Phase Gate**: All MCP protocol tests pass, storage and infrastructure green -> CHK-026, CHK-027, CHK-028

---

## Phase 6: Standalone JavaScript Tests & Command Alignment

### Standalone JS Tests (~20 files)
- [ ] T090 [P] [P0] Execute `test-mcp-tools.js` (comprehensive MCP handlers) -> CHK-029
- [ ] T091 [P] [P0] Execute `test-memory-handlers.js` (memory handler tests) -> CHK-029
- [ ] T092 [P] [P0] Execute `test-session-learning.js` (session learning tests) -> CHK-029
- [ ] T093 [P] [P0] Execute `verify-cognitive-upgrade.js` (9-category verification) -> CHK-029
- [ ] T094 [P] [P1] Execute `api-key-validation.test.js` -> CHK-029
- [ ] T095 [P] [P1] Execute `api-validation.test.js` -> CHK-029
- [ ] T096 [P] [P1] Execute `causal-edges.test.js` (89 tests) -> CHK-029
- [ ] T097 [P] [P1] Execute `continue-session.test.js` (35 tests) -> CHK-029
- [ ] T098 [P] [P1] Execute `crash-recovery.test.js` (17 tests) -> CHK-029
- [ ] T099 [P] [P1] Execute `envelope.test.js` -> CHK-029
- [ ] T100 [P] [P1] Execute `incremental-index.test.js` -> CHK-029
- [ ] T101 [P] [P1] Execute `interfaces.test.js` -> CHK-029
- [ ] T102 [P] [P1] Execute `layer-definitions.test.js` (105 tests) -> CHK-029
- [ ] T103 [P] [P1] Execute `lazy-loading.test.js` -> CHK-029
- [ ] T104 [P] [P1] Execute `memory-save-integration.test.js` -> CHK-029
- [ ] T105 [P] [P1] Execute `memory-search-integration.test.js` -> CHK-029
- [ ] T106 [P] [P1] Execute `modularization.test.js` (78 tests) -> CHK-029
- [ ] T107 [P] [P1] Execute `recovery-hints.test.js` (49 error codes) -> CHK-029
- [ ] T108 [P] [P1] Execute `retry.test.js` (82 tests) -> CHK-029
- [ ] T109 [P] [P1] Execute `schema-migration.test.js` (58 tests) -> CHK-029

### Memory Command Alignment Analysis
- [ ] T110 [P1] Trace `/memory:context` command to `memory-context` handler -> CHK-030
- [ ] T111 [P1] Trace `/memory:continue` command to `session-learning` handler -> CHK-030
- [ ] T112 [P1] Trace `/memory:learn` command to `session-learning` handler -> CHK-030
- [ ] T113 [P1] Trace `/memory:manage` command to `memory-crud` handler -> CHK-030
- [ ] T114 [P1] Trace `/memory:save` command to `memory-save` handler -> CHK-030

**Phase Gate**: All standalone JS tests execute, command mapping verified -> CHK-029, CHK-030

---

## Phase 7: Results Compilation

- [ ] T120 [P0] Aggregate pass/fail/skip counts by test category -> CHK-040
- [ ] T121 [P0] Calculate overall pass rate (target >= 95%) -> CHK-040
- [ ] T122 [P1] Document any failures with root cause and evidence -> CHK-040
- [ ] T123 [P1] Update checklist.md with verification evidence -> CHK-041
- [ ] T124 [P2] Create implementation-summary.md -> CHK-042

**Phase Gate**: All results documented, checklist verified -> CHK-040

---

## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All P0 checklist items verified
- [ ] Overall pass rate >= 95%
- [ ] Results documented with per-category evidence

---

## Cross-References

- **Specification**: See [spec.md](spec.md)
- **Plan**: See [plan.md](plan.md)
- **Verification**: See [checklist.md](checklist.md)

---

## L2: TASK-CHECKLIST MAPPING

| Task ID | Checklist Item | Priority | Status |
|---------|----------------|----------|--------|
| T001-T003 | CHK-001 | P0 | [ ] |
| T004-T005 | CHK-003 | P1 | [ ] |
| T010-T021 | CHK-020 | P0 | [ ] |
| T021 | CHK-021 | P0 | [ ] |
| T030-T036 | CHK-022 | P0 | [ ] |
| T037-T042 | CHK-023 | P0 | [ ] |
| T050-T058 | CHK-024 | P0 | [ ] |
| T060-T067 | CHK-025 | P0 | [ ] |
| T070-T073 | CHK-026 | P0 | [ ] |
| T075-T079 | CHK-027 | P1 | [ ] |
| T080-T089 | CHK-028 | P1 | [ ] |
| T090-T109 | CHK-029 | P0/P1 | [ ] |
| T110-T114 | CHK-030 | P1 | [ ] |
| T120-T122 | CHK-040 | P0 | [ ] |
| T123 | CHK-041 | P1 | [ ] |
| T124 | CHK-042 | P2 | [ ] |

---

## L2: PHASE COMPLETION GATES

### Gate 1: Environment Ready
- [ ] All P0 setup tasks done (T001-T003)
- [ ] Dependencies verified working
- [ ] Ready for test execution

### Gate 2: Cognitive Tests Complete
- [ ] All 12+ cognitive modules tested (T010-T021)
- [ ] FSRS, PE gate, tier classifier, attention decay pass
- [ ] Cognitive integration test passes

### Gate 3: Search & Scoring Complete
- [ ] All search modules tested (T030-T036)
- [ ] All scoring modules tested (T037-T042)
- [ ] BM25, hybrid, RRF, composite scoring pass

### Gate 4: Handlers & Integration Complete
- [ ] All 9 handlers tested (T050-T058)
- [ ] All 8 integration pipelines tested (T060-T067)

### Gate 5: Protocol & Infrastructure Complete
- [ ] MCP protocol tests pass (T070-T073)
- [ ] Storage tests pass (T075-T079)
- [ ] Infrastructure tests pass (T080-T089)

### Gate 6: Standalone & Commands Complete
- [ ] All standalone JS tests executed (T090-T109)
- [ ] Memory command alignment verified (T110-T114)

### Gate 7: Results Finalized
- [ ] All results aggregated (T120-T122)
- [ ] Checklist updated (T123)
- [ ] Overall pass rate >= 95%

---

## L2: BLOCKED TASK TRACKING

| Task ID | Blocker | Impact | Resolution |
|---------|---------|--------|------------|
| None | N/A | N/A | N/A |

---
