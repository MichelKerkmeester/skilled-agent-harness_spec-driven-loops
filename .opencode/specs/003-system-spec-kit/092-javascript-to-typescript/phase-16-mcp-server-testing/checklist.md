# Verification Checklist: MCP Server Comprehensive Testing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.0 -->

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

---

## Pre-Implementation

- [ ] CHK-001 [P0] TypeScript compilation current (`dist/` populated with compiled tests)
- [ ] CHK-002 [P0] Test suite structure understood (README.md reviewed)
- [ ] CHK-003 [P1] Dependencies available (better-sqlite3, Node.js >= 18, database file)

---

## Cognitive Module Tests (Category B: Memory Decay & Lifecycle)

- [ ] CHK-020 [P0] All 12+ cognitive modules tested and passing
  - [ ] FSRS Scheduler (52 tests) -- retrievability, stability, difficulty calculations
  - [ ] Prediction Error Gate (65 tests) -- thresholds, contradiction detection
  - [ ] Tier Classifier (91 tests) -- 6-tier importance classification
  - [ ] Attention Decay (137 tests) -- time-based forgetting, tier-specific rates
  - [ ] Co-Activation (38 tests) -- related memory boosting, spreading activation
  - [ ] Working Memory (51 tests) -- capacity limits, eviction, session management
  - [ ] Archival Manager (41 tests) -- archival system lifecycle
  - [ ] Summary Generator (52 tests) -- auto-summarization, formatting
  - [ ] Corrections -- learning from corrections
  - [ ] Temporal Contiguity -- temporal proximity effects
  - [ ] Preflight Validation (34 tests) -- preflight checks
- [ ] CHK-021 [P0] Cognitive Integration test passes (`test-cognitive-integration.ts`)

---

## Search System Tests (Category A: Search & Retrieval)

- [ ] CHK-022 [P0] All search modules tested and passing
  - [ ] BM25 Index (73 tests) -- lexical indexing, term frequency
  - [ ] Hybrid Search (66 tests) -- FTS5 + vector combination
  - [ ] RRF Fusion (22 tests) -- reciprocal rank fusion with k=60
  - [ ] Cross-Encoder (50 tests) -- reranking accuracy
  - [ ] Intent Classifier (46 tests) -- 5 intent types
  - [ ] Fuzzy Match (61 tests) -- query expansion, typo tolerance
  - [ ] Reranker -- result reordering

---

## Scoring System Tests

- [ ] CHK-023 [P0] All scoring modules tested and passing
  - [ ] Composite Scoring (101 tests) -- weighted multi-factor scoring
  - [ ] Five-Factor Scoring (109 tests) -- 5-dimension validation
  - [ ] Importance Tiers -- 6-tier system (constitutional, critical, important, normal, low, temporary)
  - [ ] Folder Scoring -- spec folder relevance scoring
  - [ ] Scoring -- general scoring module
  - [ ] Confidence Tracker -- score confidence tracking

---

## Handler Tests (All 9 Handler Modules)

- [ ] CHK-024 [P0] All 9 handler modules tested and passing
  - [ ] `handler-memory-search.test.ts` -- memory_search tool
  - [ ] `handler-memory-triggers.test.ts` -- memory_match_triggers tool
  - [ ] `handler-memory-save.test.ts` -- memory_save tool
  - [ ] `handler-memory-crud.test.ts` -- memory_delete, memory_update, memory_list, memory_stats, memory_health tools
  - [ ] `handler-memory-index.test.ts` -- memory_index_scan tool
  - [ ] `handler-memory-context.test.ts` -- memory_context tool
  - [ ] `handler-checkpoints.test.ts` -- checkpoint_create, checkpoint_list, checkpoint_restore, checkpoint_delete, memory_validate tools
  - [ ] `handler-session-learning.test.ts` -- task_preflight, task_postflight, get_learning_history tools
  - [ ] `handler-causal-graph.test.ts` -- memory_drift_why, memory_causal_link, memory_causal_stats, memory_causal_unlink tools

---

## Integration Tests (8 Pipelines)

- [ ] CHK-025 [P0] All 8 integration pipelines tested and passing
  - [ ] Save Pipeline -- end-to-end memory save workflow
  - [ ] Search Pipeline -- end-to-end search with ranking
  - [ ] Trigger Pipeline -- trigger matching through search
  - [ ] Checkpoint Lifecycle -- create/list/restore/delete cycle
  - [ ] Learning History -- preflight/postflight/history cycle
  - [ ] Causal Graph -- link/query/unlink cycle
  - [ ] Error Recovery -- failure handling and recovery
  - [ ] Session Dedup -- duplicate session detection

---

## MCP Protocol Compliance Tests

- [ ] CHK-026 [P0] All 4 MCP protocol tests passing
  - [ ] Tool Dispatch -- correct routing of tool calls to handlers
  - [ ] Input Validation -- schema validation for all 22 tools
  - [ ] Response Envelope -- standard MCP response format
  - [ ] Error Format -- MCP-compliant error responses

---

## Storage Module Tests

- [ ] CHK-027 [P1] All storage modules tested and passing
  - [ ] Access Tracker -- memory access tracking
  - [ ] Checkpoints Storage -- checkpoint persistence
  - [ ] History -- access history tracking
  - [ ] Index Refresh -- incremental reindexing
  - [ ] Transaction Manager -- ACID transaction support

---

## Infrastructure Tests

- [ ] CHK-028 [P1] All infrastructure modules tested and passing
  - [ ] Memory Parser -- ANCHOR format parsing
  - [ ] Trigger Matcher -- trigger pattern matching
  - [ ] Trigger Extractor -- trigger extraction from prompts
  - [ ] Entity Scope -- entity scope resolution
  - [ ] Embeddings -- embedding provider chain
  - [ ] Channel -- communication channel
  - [ ] Memory Types -- 9 memory type classifications
  - [ ] Memory Context -- unified context entry
  - [ ] Session Manager -- session deduplication
  - [ ] Tool Cache -- tool result caching

---

## Standalone JavaScript Tests

- [ ] CHK-029 [P0] Core standalone JS tests passing (4 critical runners)
  - [ ] `test-mcp-tools.js` -- comprehensive MCP handler validation
  - [ ] `test-memory-handlers.js` -- memory handler validation
  - [ ] `test-session-learning.js` -- session learning validation
  - [ ] `verify-cognitive-upgrade.js` -- 9-category upgrade verification
- [ ] CHK-029b [P1] Remaining standalone JS tests passing (~16 files)
  - [ ] api-key-validation, api-validation
  - [ ] causal-edges (89 tests)
  - [ ] continue-session (35 tests), crash-recovery (17 tests)
  - [ ] envelope, incremental-index, interfaces
  - [ ] layer-definitions (105 tests), lazy-loading
  - [ ] memory-save-integration, memory-search-integration
  - [ ] modularization (78 tests)
  - [ ] recovery-hints (49 error codes), retry (82 tests)
  - [ ] schema-migration (58 tests)

---

## Memory Command Alignment

- [ ] CHK-030 [P1] All 5 memory commands traced to handlers
  - [ ] `/memory:context` -> `handleMemoryContext` (memory-context handler)
  - [ ] `/memory:continue` -> `handleTaskPreflight` (session-learning handler)
  - [ ] `/memory:learn` -> `handleTaskPostflight` (session-learning handler)
  - [ ] `/memory:manage` -> `handleMemoryList/Stats/Health` (memory-crud handler)
  - [ ] `/memory:save` -> `handleMemorySave` (memory-save handler)

---

## Documentation

- [ ] CHK-040 [P0] Test results aggregated with per-category pass/fail/skip counts
- [ ] CHK-041 [P1] Checklist updated with verification evidence
- [ ] CHK-042 [P2] Implementation-summary.md created

---

## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
- [ ] CHK-052 [P2] Key findings saved to memory/

---

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | [ ]/10 |
| P1 Items | 9 | [ ]/9 |
| P2 Items | 2 | [ ]/2 |

**Verification Date**: [YYYY-MM-DD]

---

## Test Results Summary (To be filled during execution)

### Overall Results

| Metric | Value |
|--------|-------|
| Total Test Files | |
| Total Tests Executed | |
| Total Passed | |
| Total Failed | |
| Total Skipped | |
| Overall Pass Rate | |

### Results by Category

| Category | Files | Tests | Passed | Failed | Skipped | Pass Rate |
|----------|-------|-------|--------|--------|---------|-----------|
| Cognitive Modules | 12 | | | | | |
| Search System | 7 | | | | | |
| Scoring System | 6 | | | | | |
| Handlers | 9 | | | | | |
| Integration | 8 | | | | | |
| MCP Protocol | 4 | | | | | |
| Storage | 5 | | | | | |
| Infrastructure | 10 | | | | | |
| Standalone JS | ~20 | | | | | |
| **Total** | **~81** | | | | | |

### Failures (if any)

| Test File | Test Name | Error | Root Cause | Severity |
|-----------|-----------|-------|------------|----------|
| | | | | |

---
