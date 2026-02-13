# 099: Spec Kit Memory Cleanup — Tasks

## Phase 1: Database Consolidation ✅

- [x] [P1-01] Run `memory_index_scan()` incremental on all spec folders
- [x] [P1-02] Run `memory_index_scan()` on constitutional directories
- [x] [P1-03] Verify post-scan memory count via `memory_stats()`
- [x] [P1-04] Run `memory_health()` to confirm system stability
- [x] [P1-05] Document before/after counts

## Phase 2: Unsafe Cast Removal ✅ (42 → 2 remaining, both justified)

### 2a: MCP Protocol Boundary (context-server.ts)
- [x] [P2-01] Add index signatures to handler arg types OR create typed dispatch helper
- [x] [P2-02] Remove 14 `as unknown as` casts from context-server.ts handler dispatch
- [x] [P2-03] Fix `as any` callback cast at line 480

### 2b: JS→TS Bridge
- [x] [P2-04] Create .d.ts declarations for vector-index-impl.js
- [x] [P2-05] Remove 4 `as any` casts from vector-index.ts
- [x] [P2-06] Remove 3 `as unknown as` casts from memory-search.ts (JS return types)
- [x] [P2-07] Remove 1 `as unknown as` from vector-index.ts

### 2c: DB Type Mismatch
- [x] [P2-08] Create unified Database type or interface for better-sqlite3 wrapper
- [x] [P2-09] Remove DB type casts from memory-save.ts (line 430)
- [x] [P2-10] Remove DB type casts from memory-crud.ts (lines 117, 148)
- [x] [P2-11] Remove DB type cast from checkpoints.ts (line 212)
- [x] [P2-12] Remove DB type cast from access-tracker.ts (line 210)

### 2d: Missing Index Signatures
- [x] [P2-13] Add index signatures to types: ReviewResult, FiveFactorWeights, TokenMetrics
- [x] [P2-14] Remove casts from attention-decay.ts (lines 207, 322)
- [x] [P2-15] Remove casts from memory-save.ts (line 1091)
- [x] [P2-16] Remove casts from memory-crud.ts (line 432)
- [x] [P2-17] Remove cast from checkpoints.ts (line 108)

### 2e: Shape Mismatch (EnrichedTriggerMatch vs MemoryRow)
- [x] [P2-18] Extract common interface for tier-classifier compatibility
- [x] [P2-19] Remove 5 double-casts from memory-triggers.ts (lines 235, 265, 266)

### 2f: Remaining Business Logic
- [x] [P2-20] Fix memory-save.ts casts (lines 552, 573, 602, 757) — type narrowing
- [x] [P2-21] Fix memory-crud.ts updateParams cast (line 250)

## Phase 3: Type System Unification ✅

- [x] [P3-01] Update tier-classifier.ts: MemoryRow → Memory (or generic)
- [x] [P3-02] Update composite-scoring.ts: MemoryRow → Memory + update re-export
- [x] [P3-03] Update retry-manager.ts: RetryMemoryRow extends MemoryRow → extends MemoryDbRow
- [x] [P3-04] Update memory-triggers.ts: remove MemoryRow import, use proper types
- [x] [P3-05] Update folder-scoring.ts: MemoryRecord → Memory
- [x] [P3-06] Update rank-memories.ts: MemoryRecord cast → proper type
- [~] [P3-07] Replace MemorySearchRow in memory-search.ts with normalized type — **kept as-is**: self-contained local type, documented as Phase 6B target
- [x] [P3-08] ~~Remove~~ Mark deprecated MemoryRow in shared/types.ts — marked `@deprecated`, re-exports maintained for backward compatibility
- [x] [P3-09] ~~Remove~~ Mark deprecated MemoryRecord in shared/types.ts — marked `@deprecated`, re-exports maintained for backward compatibility
- [x] [P3-10] Update IVectorStore interface to use Memory/MemoryDbRow
- [x] [P3-11] Update all re-exports in shared/index.ts and handlers/types.ts

## Phase 4: Score Field Documentation ✅

- [x] [P4-01] Add JSDoc to SearchResult.score explaining context-dependent semantics
- [x] [P4-02] Add JSDoc to FolderScore component scores
- [x] [P4-03] Document score taxonomy (vector similarity vs BM25 vs composite vs RRF)
- [x] [P4-04] Add JSDoc to scoringMethod field explaining disambiguation role

## Phase 5: Test Coverage (from 096 P7 deferred) — PARTIAL (5/48 modules, 75 tests)

- [x] [P5-01] tier-classifier.ts — unit tests added
- [x] [P5-02] composite-scoring.ts — unit tests added
- [x] [P5-03] attention-decay.ts — unit tests added
- [x] [P5-04] retry-manager.ts — unit tests added
- [x] [P5-05] memory-triggers.ts — unit tests added
- [ ] [P5-06] through [P5-48] — Remaining 43 untested modules (deferred to future spec)

## Phase 6: Verification ✅

- [x] [P6-01] Run `npx vitest run` — 62/62 tests pass
- [x] [P6-02] Run `npx tsc --noEmit` — passes (3 pre-existing errors, 0 new)
- [x] [P6-03] Verify build output in dist/ — functional (9 pre-existing type-declaration errors)
- [x] [P6-04] Run `memory_health()` — system healthy
- [x] [P6-05] Create implementation-summary.md
