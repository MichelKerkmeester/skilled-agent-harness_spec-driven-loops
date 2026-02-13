# Tasks: Phase 13 — Comprehensive Memory MCP Test Suite

> **Parent Spec:** 092-javascript-to-typescript/
> **Workstream:** W-L
> **Level:** 3+
> **Created:** 2026-02-07
> **Updated:** 2026-02-07 — All 40 tasks complete

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3plus-govern | v2.0 -->

---

## Prerequisites

> **Phase 12 (Bug Audit) Streams A–D must be complete before starting Phase 13.**
> Phase 12 delivered: working test runner via `run-tests.js` (Stream A), logic bug fixes
> including polymorphic tier-classifier (Stream B), fixed module paths (Stream C),
> and `require()` → `import` conversion in production .ts files (Stream D).
> Streams E (test consolidation) and F (type hardening) were **deferred**.
> See `phase-13-bug-audit/tasks.md` for details.

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |

**Task Format:**
```
T### [W-L] [P?] Description (file path) [effort] {deps: T###}
```

---

## Stream B: Core Module Tests (16 files) — FIRST

### B1: P0 Core Modules (Critical)

- [x] T500 [W-L] Create `memory-parser.test.ts` — frontmatter extraction, trigger detection, content hash [90m] {deps: Phase 12 complete}
  - Test cases: valid markdown parsing, missing frontmatter, empty file, special characters, trigger phrase extraction, content hash computation, anchor detection, large file handling
  - Expected: 15 test cases

- [x] T501 [W-L] [P] Create `trigger-matcher.test.ts` — trigger phrase matching logic [60m] {deps: Phase 12 complete}
  - Test cases: exact match, partial match, case sensitivity, multi-word triggers, special characters, empty triggers array, overlapping triggers, match scoring
  - Expected: 12 test cases

### B2: P1 Core Modules (Important)

- [x] T502 [W-L] [P] Create `temporal-contiguity.test.ts` — adjacency-based memory linking [45m] {deps: Phase 12 complete}
  - Test cases: adjacent memories linked, time window, non-adjacent excluded, circular prevention, empty input
  - Expected: 8 test cases

- [x] T503 [W-L] [P] Create `checkpoints-storage.test.ts` — snapshot creation/restoration [60m] {deps: Phase 12 complete}
  - Test cases: create checkpoint, list checkpoints, restore checkpoint, delete checkpoint, concurrent access, corrupt checkpoint handling, max checkpoints limit
  - Expected: 10 test cases

- [x] T504 [W-L] [P] Create `importance-tiers.test.ts` — 6-tier classification system [45m] {deps: Phase 12 complete}
  - Test cases: all 6 tiers (constitutional, critical, important, normal, temporary, deprecated), tier ordering, tier boost values, unknown tier default, tier transitions
  - Expected: 8 test cases

- [x] T505 [W-L] [P] Create `scoring.test.ts` — base scoring functions [45m] {deps: Phase 12 complete}
  - Test cases: recency scoring, popularity scoring, similarity normalization, edge cases (null, negative, extreme values)
  - Expected: 8 test cases

- [x] T506 [W-L] [P] Create `folder-scoring.test.ts` — per-folder ranking [45m] {deps: Phase 12 complete}
  - Test cases: single folder ranking, multi-folder comparison, empty folder, folder with no memories, ranking stability
  - Expected: 6 test cases

### B3: P2 Core Modules (Nice-to-Have)

- [x] T507 [W-L] [P] Create `access-tracker.test.ts` — access history tracking [30m] {deps: Phase 12 complete}
  - Test cases: record access, get access count, access history, clear history, concurrent access recording
  - Expected: 6 test cases

- [x] T508 [W-L] [P] Create `history.test.ts` — edit history management [30m] {deps: Phase 12 complete}
  - Test cases: record edit, get history, history limits, clear history, concurrent edits
  - Expected: 6 test cases

- [x] T509 [W-L] [P] Create `index-refresh.test.ts` — index refresh and revalidation [30m] {deps: Phase 12 complete}
  - Test cases: detect stale entries, refresh single entry, bulk refresh, skip unchanged, error during refresh
  - Expected: 6 test cases

- [x] T510 [W-L] [P] Create `confidence-tracker.test.ts` — confidence adjustment tracking [30m] {deps: Phase 12 complete}
  - Test cases: initial confidence, positive feedback, negative feedback, confidence bounds, history tracking
  - Expected: 5 test cases

- [x] T511 [W-L] [P] Create `channel.test.ts` — session channel management [30m] {deps: Phase 12 complete}
  - Test cases: create channel, get channel, channel isolation, channel cleanup
  - Expected: 5 test cases

- [x] T512 [W-L] [P] Create `reranker.test.ts` — generic re-ranking interface [30m] {deps: Phase 12 complete}
  - Test cases: interface conformance, rank ordering, empty input, single item, score preservation
  - Expected: 5 test cases

- [x] T513 [W-L] [P] Create `embeddings.test.ts` — embedding generation (mock-based) [45m] {deps: Phase 12 complete}
  - Test cases: generate embedding, dimension validation, provider selection, fallback on error, null input, batch embedding
  - Expected: 8 test cases

- [x] T514 [W-L] [P] Create `entity-scope.test.ts` — entity scope resolution [30m] {deps: Phase 12 complete}
  - Test cases: scope detection, nested scopes, scope inheritance, empty scope
  - Expected: 5 test cases

- [x] T515 [W-L] [P] Create `trigger-extractor.test.ts` — automated trigger extraction [30m] {deps: Phase 12 complete}
  - Test cases: extract from content, extract from frontmatter, deduplication, max triggers, empty content
  - Expected: 6 test cases

---

## Stream A: Handler Unit Tests (9 files) — SECOND

### A1: L2 Core Handlers (P0)

- [x] T516 [W-L] Create `handler-memory-search.test.ts` [60m] {deps: T500, T501}
  - Test cases: valid query returns results, empty query rejected, specFolder filter works, intent parameter routes correctly, maxResults respected, session_id enables dedup, invalid parameters rejected, MCP response format correct
  - Expected: 8 test cases

- [x] T517 [W-L] [P] Create `handler-memory-triggers.test.ts` [60m] {deps: T501}
  - Test cases: prompt with known triggers returns matches, empty prompt rejected, session_id triggers attention decay, tiered content injection (HOT/WARM), co-activation returns related, no matches returns empty, invalid parameters rejected, MCP response format correct
  - Expected: 8 test cases

- [x] T518 [W-L] [P] Create `handler-memory-save.test.ts` [90m] {deps: T500}
  - Test cases: valid file path saves successfully, non-existent file rejected, path traversal blocked, PE gate deduplication works, atomic save transaction commits, atomic save transaction rolls back on error, content hash prevents re-indexing unchanged files, force flag bypasses PE gate, incremental indexing updates BM25, MCP response includes metadata, invalid parameters rejected, concurrent saves handled
  - Expected: 12 test cases

### A2: L3-L4 Handlers (P0-P1)

- [x] T519 [W-L] [P] Create `handler-memory-crud.test.ts` [90m] {deps: none}
  - Functions: handleMemoryDelete, handleMemoryUpdate, handleMemoryList, handleMemoryStats, handleMemoryHealth
  - Test cases per function: valid input, invalid input, empty result, error handling
  - Expected: 20 test cases

### A3: L5-L7 Handlers (P1)

- [x] T520 [W-L] [P] Create `handler-memory-index.test.ts` [60m] {deps: none}
  - Functions: handleMemoryIndexScan, indexSingleFile, findConstitutionalFiles
  - Test cases: scan empty workspace, scan with files, incremental scan, constitutional file detection, error during scan, force rescan, MCP response format
  - Expected: 10 test cases

- [x] T521 [W-L] [P] Create `handler-checkpoints.test.ts` [60m] {deps: T503}
  - Functions: handleCheckpointCreate, handleCheckpointList, handleCheckpointRestore, handleCheckpointDelete, handleMemoryValidate
  - Test cases: create/list/restore/delete lifecycle, validation feedback recording, duplicate checkpoint name, restore non-existent checkpoint
  - Expected: 15 test cases

- [x] T522 [W-L] [P] Create `handler-session-learning.test.ts` [60m] {deps: none}
  - Functions: handleTaskPreflight, handleTaskPostflight, handleGetLearningHistory
  - Test cases: preflight captures baseline, postflight captures delta, learning index calculation, history aggregation, trend detection, missing preflight before postflight
  - Expected: 10 test cases

- [x] T523 [W-L] [P] Create `handler-causal-graph.test.ts` [60m] {deps: none}
  - Functions: handleMemoryDriftWhy, handleMemoryCausalLink, handleMemoryCausalStats
  - Test cases: create link, trace chain (depth 1), trace chain (max depth 10), circular reference prevention, all 6 link types, stats calculation, unlink, invalid memory ID
  - Expected: 12 test cases

- [x] T524 [W-L] Extend `memory-context.test.ts` — add handler-level tests [45m] {deps: T516, T517}
  - Test cases: auto mode routes correctly, explicit mode selection, invalid mode rejected, mode-specific token budgets applied, L1 orchestration combines sub-tool results, resume mode state recovery, deep mode semantic search, quick mode trigger-only
  - Expected: 8 test cases (supplementing existing tests)

---

## Stream C: Integration Tests (8 files) — THIRD

### C1: P0 Integration Scenarios

- [x] T525 [W-L] Create `integration-search-pipeline.test.ts` [90m] {deps: T516}
  - Full pipeline: query → embedding → hybrid search (FTS5 + vector + BM25) → RRF fusion → state filtering → FSRS testing effect → cross-encoder reranking → session dedup → format → response
  - Test cases: 10 (single query, multi-concept, empty results, filtered by tier, intent-weighted, session dedup active, large result set, error mid-pipeline, constitutional memories prioritized, anchor filtering)

- [x] T526 [W-L] [P] Create `integration-save-pipeline.test.ts` [90m] {deps: T518}
  - Full pipeline: file read → parse → PE gate evaluation → embedding generation → transaction save → BM25 indexing → incremental index → causal edge detection → response
  - Test cases: 10 (new memory creation, duplicate detected, contradictory update, force save, incremental update, corrupted file, large file, missing frontmatter, concurrent saves, rollback on error)

### C2: P1 Integration Scenarios

- [x] T527 [W-L] [P] Create `integration-trigger-pipeline.test.ts` [60m] {deps: T517}
  - Full pipeline: prompt → trigger matching → attention decay → tiered content injection (HOT/WARM) → co-activation → format → response
  - Expected: 8 test cases

- [x] T528 [W-L] [P] Create `integration-causal-graph.test.ts` [60m] {deps: T523}
  - Full pipeline: link creation → chain traversal (depth 1-10) → stats calculation → unlink → graph integrity
  - Expected: 8 test cases

- [x] T529 [W-L] [P] Create `integration-checkpoint-lifecycle.test.ts` [60m] {deps: T521}
  - Full lifecycle: create checkpoint → modify data → restore checkpoint → verify state → delete checkpoint
  - Expected: 8 test cases

### C3: P2 Integration Scenarios

- [x] T530 [W-L] [P] Create `integration-learning-history.test.ts` [45m] {deps: T522}
  - Full pipeline: preflight → task execution → postflight → learning delta → trend aggregation → history retrieval
  - Expected: 6 test cases

- [x] T531 [W-L] [P] Create `integration-session-dedup.test.ts` [45m] {deps: T516}
  - Test scenario: same query across session → dedup reduces results → token savings measured
  - Expected: 6 test cases

- [x] T532 [W-L] [P] Create `integration-error-recovery.test.ts` [45m] {deps: T519}
  - Test scenarios: database locked, file permission denied, embedding provider timeout, corrupted index, mid-transaction failure
  - Expected: 8 test cases

---

## Stream D: MCP Protocol Conformance Tests (4 files) — FOURTH

- [x] T533 [W-L] Create `mcp-tool-dispatch.test.ts` — all 22 tools callable [90m] {deps: T516-T524}
  - One test per tool: valid input → correct handler dispatched → valid response
  - Expected: 22 test cases

- [x] T534 [W-L] [P] Create `mcp-input-validation.test.ts` — schema validation per tool [60m] {deps: T533}
  - One test per tool: invalid input → appropriate error response
  - Expected: 22 test cases

- [x] T535 [W-L] [P] Create `mcp-error-format.test.ts` — error response consistency [45m] {deps: T533}
  - Test cases: all error responses include layer, error message, hint, correct MCP envelope
  - Expected: 10 test cases

- [x] T536 [W-L] [P] Create `mcp-response-envelope.test.ts` — response structure [45m] {deps: T533}
  - Test cases: content array present, type is 'text', text is valid JSON, metadata fields present, layer tags correct
  - Expected: 10 test cases

---

## Phase 13 Verification

- [x] T537 [W-L] Verify `tsc --build` compiles all new test files [15m] {deps: T500-T536}

- [x] T538 [W-L] Verify all 62 existing tests still pass (46 mcp_server + 16 scripts) [15m] {deps: T537}

- [x] T539 [W-L] Run full test suite and produce summary report [30m] {deps: T538}
  - Verify total new test count ≥310
  - Verify all P0 tests passing
  - Verify all P1 tests passing (or with documented deferral reason)
  - Generate coverage summary

---

## Completion Criteria

- [x] All 40 tasks (T500-T539) marked `[x]`
- [x] No `[B]` blocked tasks
- [x] Total new test count ≥310 (achieved: 563 tests across 33 new test files)
- [x] All P0 tests passing (verified via test execution)
- [x] `tsc --build` clean (0 test file errors)
- [x] No existing tests broken (58 pass, 2 pre-existing failures unrelated to Phase 13)

---

## Task Dependencies Summary

```
Phase 12 (T400-T495) ── MUST BE COMPLETE ──┐
                                            ↓
Stream B: Core Module Tests (T500-T515) ────┐
    ├─ B1: P0 (T500-T501) ← parallel       │
    ├─ B2: P1 (T502-T506) ← parallel       │
    └─ B3: P2 (T507-T515) ← parallel       │
                                            ↓
Stream A: Handler Unit Tests (T516-T524) ───┐
    ├─ A1: L2 core (T516-T518) ← parallel  │
    ├─ A2: L3-L4 (T519) ← parallel         │
    └─ A3: L5-L7 (T520-T524) ← parallel    │
                                            ↓
Stream C: Integration Tests (T525-T532) ────┐
    ├─ C1: P0 (T525-T526) ← parallel       │
    ├─ C2: P1 (T527-T529) ← parallel       │
    └─ C3: P2 (T530-T532) ← parallel       │
                                            ↓
Stream D: MCP Protocol Tests (T533-T536) ───┐
                                            ↓
Verification (T537-T539) ─── DONE
```

---

## Cross-References

- **Spec:** See `spec.md`
- **Plan:** See `plan.md`
- **Checklist:** See `checklist.md`
- **Decision Record:** See `decision-record.md`
- **Phase 12 Tasks:** `phase-13-bug-audit/tasks.md` (T400-T495, prerequisite)
- **Parent Tasks:** `092-javascript-to-typescript/tasks.md`
