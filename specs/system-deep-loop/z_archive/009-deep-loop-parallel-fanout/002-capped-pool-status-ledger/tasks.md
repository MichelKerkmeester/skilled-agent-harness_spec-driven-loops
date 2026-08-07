<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks — Phase 002: Capped worker pool + status ledger

- [x] T1: Author `scripts/fanout-pool.cjs` `runCappedPool` (capped, never-throws, ordered results).
- [x] T2: Add `settleItem` + `buildPoolSummary` (per-item settlement + summary envelope).
- [x] T3: Add `appendStatusLedger` + `writeOrchestrationSummary` (JSONL ledger + summary JSON).
- [x] T4: Author `tests/unit/fanout-pool.vitest.ts` (10 cases: cap, order, isolation, all-failed, empty, clamp, ledger events, invalid-args, file helpers).
- [x] T5: Fix the cap-not-exceeded test (macrotask flush + entered/in-flight tracking; pool code was correct).
- [x] T6: Run fanout-pool suite (10/10) + full unit suite (171/171) — green, no regressions.
