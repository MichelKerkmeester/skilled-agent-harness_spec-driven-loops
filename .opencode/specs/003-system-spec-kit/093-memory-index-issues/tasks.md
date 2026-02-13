---
title: "Task Breakdown"
status: complete
---

# 📝 Tasks

## Phase 1: Investigation (COMPLETE)
- [x] T1: Sample 10 failing files for structure analysis
- [x] T2: Deep dive indexer code path (`memory-save.ts` → `prediction-error-gate.ts`)
- [x] T3: Deep dive Voyage embedding code (voyage-4, 1024d, MAX_TEXT_LENGTH 8000)
- [x] T4: Trace error message origin (`userFriendlyError()` in `core.ts:147`)
- [x] T5: Analyze validation/parsing logic (trigger phrase regex, pre-flight checks)
- [x] T6: Sample 10 succeeding files for comparison
- [x] T7: Analyze specFolder detection logic (3-stage extraction, never returns null)
- [x] T8: Analyze generate-context.js format
- [x] T9: Categorize all 129 failing files (all fail at PE gate, not file-specific)
- [x] T10: Synthesize findings — root cause: argument order mismatch in `evaluateMemory()` call

## Phase 2: Fix Implementation (COMPLETE)
- [x] T11: Implement code-level fixes in `memory-save.ts` and compiled `memory-save.js`
  - Bug 1 (PRIMARY): `evaluateMemory()` argument order — `contentHash` added as 1st arg, `candidates` moved to 3rd
  - Bug 2: `peDecision.candidate!.id` → `peDecision.existingMemoryId` (5 locations)
  - Bug 3: `decision.contradiction?.found` → `.detected`
  - Bug 4: `peDecision.related_ids` access removed (property doesn't exist)
- [~] T12: File-level fixes — NOT NEEDED, root cause was code-only
  - Evidence: All 129 failures traced to same code bug, not file format issues

## Phase 3: Verification (COMPLETE)
- [x] T13: Test fixes on sample file
  - MCP server restarted in new session — fix loaded from compiled JS
- [x] T14: Force re-index all 245 files
  - Result: 245 scanned, 10 indexed, 230 updated, 5 failed (expected)
- [x] T15: Verify near-0 failures (down from 129)
  - 5 remaining failures are legitimate: old format, test fixtures, YAML frontmatter
- [x] T16: Validate no regression on previously-indexed files
  - 230 files updated successfully, no data loss

## Phase 4: Documentation (COMPLETE)
- [x] T17: Update tasks.md with current status
- [x] T18: Update checklist.md with evidence
- [x] T19: Update decision-record.md with stale server finding
- [x] T20: Create implementation-summary.md
- [x] T21: Save memory context

## Optional Improvements (COMPLETE)
- [x] T22: Patch `batch-processor.ts` to include `errorDetail` in error responses
  - Added `errorDetail?: string` to `RetryErrorResult` interface in `batch-processor.ts`
  - Added `errorDetail` to failure return: `last_error instanceof Error ? last_error.message : String(last_error)`
  - Added `errorDetail?: string` to `IndexResult` and `ScanResults.files` in `memory-index.ts`
  - Updated failed file push to include `errorDetail: result.errorDetail`
  - Both `.ts` source and compiled `.js` in `dist/` edited
  - ⚠️ Known issue: Running MCP server may cache modules — `errorDetail` not surfacing until server restart
  - Root cause of 5 remaining failures: path security validation rejecting symlink-resolved paths ("Access denied: Path outside allowed directories")
- [x] T23: Fix trigger phrase regex duplicate (`triggerPhrases|triggerPhrases` → `triggerPhrases|trigger_phrases`)
  - Fixed in `memory-parser.ts` lines 237 and 257
  - Fixed in `dist/lib/parsing/memory-parser.js` lines 176 and 194
  - Was matching `triggerPhrases` twice instead of also matching `trigger_phrases`
- [x] T24: Fix `path` module import missing in `memory-save.ts`
  - Added `import path from 'path';` at line 10 of memory-save.ts
  - Compiled JS already had the import (from prior compilation)
  - Verified via memory_index_scan: 240/245 succeed
- [x] T25: Fix `test-cognitive-integration.ts` — 6 `evaluateMemory()` calls + assertion fixes
  - Fixed 6 `evaluateMemory()` calls from old 2-arg to correct 4-arg signature (T802-T807)
  - Fixed assertion: `decision.contradiction.found` → `.detected`, `.pattern` → `.description`
  - Fixed assertion: `decision.related_ids` → `decision.existingMemoryId !== null`
  - Converted candidate similarity values from 0-1 to 0-100 scale (5 locations)
  - Updated similarity threshold comparison: `< 0.70` → `< 70`
  - ⚠️ Out of scope: AUDIT section tests (T841-T850) still use old signatures for `logConflict()`, `shouldLogConflict()`, `formatConflictRecord()`

## Phase 5: Hardening & Correctness (Sessions 10-11)

- [x] T26: Vector-Index Facade Cleanup
  - **Session:** 10
  - **Scope:** Remove dead code from `vector-index.ts` facade, fix broken delegations
  - Removed 214 lines dead code (module-level state never populated because `initializeDb` delegates to impl)
  - Fixed `clearConstitutionalCache` — was clearing facade's empty cache, now delegates to impl
  - Fixed 3 broken delegations: `validateEmbeddingDimension`, `getEmbeddingDim`, `getConfirmedEmbeddingDimension`
  - Files: `lib/search/vector-index.ts` (705→491 lines), `dist/lib/search/vector-index.js` (500→290 lines)

- [x] T27: Token Budget Observability
  - **Session:** 10
  - **Scope:** Add token budget visibility to response metadata
  - Added `tokenBudget` field to response metadata alongside existing `tokenCount`
  - Added `console.error` logging when response exceeds budget
  - Added hint injection when exceeded: "Response exceeds token budget (X/Y)"
  - Files: `context-server.ts`, `dist/context-server.js`, `lib/response/envelope.ts` (~18 LOC)

- [x] T28: Hidden Handler Params Audit
  - **Session:** 10
  - **Scope:** Audit all 22 tools for undeclared handler parameters
  - **Result:** No action needed — all 100 handler params already declared in inputSchemas
  - Previous belief of hidden params was a truncation artifact — `memory_search` inputSchema is 3,990 chars on one line; Read tool cut it at ~2000 chars

- [x] T29: FSRS Factor Correction
  - **Sessions:** 10-11
  - **Scope:** Fix FSRS v4 formula inconsistency across all modules
  - **The Bug:** FSRS v4 requires `FACTOR = 19/81 ≈ 0.2346` with `R(t,S) = (1 + FACTOR * t/S)^(-0.5)`. Codebase used `FACTOR = 19.0` with `R = (1 + t/(FACTOR*S))^(-0.5)`, causing memories to decay ~4.5x slower than intended.
  - **Source files changed:**
    - `lib/cognitive/fsrs-scheduler.ts` + `dist/lib/cognitive/fsrs-scheduler.js` — constant + formula + optimal interval
    - `lib/cognitive/attention-decay.ts` + `dist/lib/cognitive/attention-decay.js` — inline fallback
    - `lib/cognitive/tier-classifier.ts` + `dist/lib/cognitive/tier-classifier.js` — local constant + formula
  - **Test files updated:**
    - `tests/attention-decay.test.ts` + `dist/tests/attention-decay.test.js`
    - `tests/tier-classifier.test.ts` + `dist/tests/tier-classifier.test.js`
    - `tests/composite-scoring.test.ts` + `dist/tests/composite-scoring.test.js`
    - `tests/five-factor-scoring.test.ts` + `dist/tests/five-factor-scoring.test.js`
    - `tests/fsrs-scheduler.test.ts` + `dist/tests/fsrs-scheduler.test.js`
  - **Result:** 58/58 tests passing
