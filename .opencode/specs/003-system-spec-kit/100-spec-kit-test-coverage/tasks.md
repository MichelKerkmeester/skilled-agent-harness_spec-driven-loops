# Tasks: Spec Kit Test Coverage

## Wave 1 — HIGH Priority
- [x] T1: Write context-server.ts unit tests (zero → ≥70%) — 266 tests, `tests/context-server.test.ts`
- [x] T2: Expand session-manager.test.ts (36% → ≥70%) — 40 tests, `tests/session-manager-extended.test.ts`
- [x] T3: Expand handler-memory-save.test.ts (40% → ≥70%) — 48 tests, `tests/memory-save-extended.test.ts`
- [x] T4: Expand handler-memory-crud.test.ts (45% → ≥70%) — 56 tests, `tests/memory-crud-extended.test.ts`
- [x] T5: Expand bm25-index.test.ts — sanitizeFTS5Query SECURITY-CRITICAL (75% → ≥90%) — 65 tests (48 security), `tests/bm25-security.test.ts`

## Wave 2 — MEDIUM-HIGH Priority
- [x] T6: Write vector-index-impl tests (zero → ≥70%) — 136 tests (6 skipped API-dependent), `tests/vector-index-impl.test.ts`
- [x] T7: Rewrite incremental-index tests (API drift fix, 0% → ≥70%) — 34 tests, `tests/incremental-index-v2.test.ts`
- [x] T8: Expand cross-encoder.test.ts (65% → ≥80%) — 31 tests, `tests/cross-encoder-extended.test.ts`
- [x] T9: Expand access-tracker.test.ts (65% → ≥80%) — 20 tests, `tests/access-tracker-extended.test.ts`
- [x] T10: Expand handler-checkpoints.test.ts (60% → ≥80%) — 29 tests, `tests/checkpoints-extended.test.ts`

## Wave 3 — Scripts Gaps
- [x] T11: Write cleanup-orphaned-vectors.ts tests (0% → ≥70%) — 54 tests, `scripts/tests/test-cleanup-orphaned-vectors.js`
- [x] T12: Write embeddings behavioral tests (20% → ≥70%) — 129 tests, `scripts/tests/test-embeddings-behavioral.js`
- [x] T13: Write retry-manager behavioral tests (20% → ≥70%) — 58 tests, `scripts/tests/test-retry-manager-behavioral.js`

## Wave 4 — Fully Untested Modules
- [x] T16: layer-definitions.ts (9 exports, 0% → 100%) — 39 tests, `tests/layer-definitions.test.ts`
- [x] T17: envelope.ts (10 exports, 0% → 100%) — 45 tests, `tests/envelope.test.ts`
- [x] T18: errors/core.ts + recovery-hints.ts (19 exports, 0% → 100%) — 58 tests, `tests/errors-comprehensive.test.ts`
- [x] T19: retry-manager.ts (13+ exports, 0% → 100%) — 55 tests, `tests/retry-manager.test.ts`
- [x] T20: search-results.ts + format-helpers.ts (4 exports, 0% → 100%) — 35 tests, `tests/search-results-format.test.ts`

## Wave 5 — Partially Tested Modules
- [x] T21: causal-edges.ts (11 untested of 15, 0% → 100%) — 71 tests, `tests/causal-edges-unit.test.ts`
- [x] T22: memory-parser.ts (10 untested of 17, 0% → 100%) — 45 tests, `tests/memory-parser-extended.test.ts`
- [x] T23: trigger-matcher.ts + memory-types.ts + type-inference.ts (19 untested, 0% → 100%) — 69 tests, `tests/trigger-config-extended.test.ts`
- [x] T24: bm25-index.ts (4 gaps) + cross-encoder.ts (6 gaps) — 43 tests, `tests/search-extended.test.ts`

## Wave 6 — Small Remaining Gaps
- [x] T25: fsrs-scheduler + archival-manager + working-memory (8 gaps) — 43 tests, `tests/cognitive-gaps.test.ts`
- [x] T26: confidence-tracker + importance-tiers (8 gaps) — 40 tests, `tests/scoring-gaps.test.ts`
- [x] T27: memory-save helpers + memory-context constants (10 gaps) — 70 tests, `tests/handler-helpers.test.ts`
- [x] T28: transaction-manager deleteFileIfExists (1 gap) — 10 tests, `tests/transaction-manager-extended.test.ts`

## Fixes (Session 3)
- [x] T29: Fix trigger-config-extended.test.ts compiled path resolution — `__dirname` detection for dist/tests/ vs tests/
- [x] T30: Fix context-server.test.ts compiled path resolution — same pattern, separated SOURCE_FILE path from require() paths

## Verification
- [x] T14: Run full test suite, verify all pass — 90/90 MCP pass, all scripts pass
- [x] T15: Update implementation-summary.md with results
