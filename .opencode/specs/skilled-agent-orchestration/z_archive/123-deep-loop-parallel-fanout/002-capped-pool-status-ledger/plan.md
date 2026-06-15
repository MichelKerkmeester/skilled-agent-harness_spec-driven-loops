<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Plan — Phase 002: Capped worker pool + status ledger

## Approach
Add the concurrency-capped fan-out primitive as a new standalone runtime script, generalizing the council
parallel dispatcher (`lib/council/multi-seat-dispatch.cjs`) — which already does never-throws `Promise`
settlement with ordered results but has NO concurrency cap. Keep the worker INJECTED so the primitive is
pure and unit-testable; the real per-lineage spawn worker is Phase 003. No existing file imports the new
module, so there is zero regression surface.

## Steps
1. Author `scripts/fanout-pool.cjs` with `runCappedPool({ items, concurrency, worker, now?, onEvent? })`:
   ≤concurrency in flight (clamp ≥1), per-item try/catch (one failure never sinks the pool), ordered
   results, `{ results, summary:{ total, succeeded, failed, all_failed } }`.
2. Add `settleItem`, `buildPoolSummary`, and ledger helpers `appendStatusLedger` (JSONL lifecycle events)
   + `writeOrchestrationSummary` (pretty-JSON run summary), generalizing packet-122's `orchestration-status.log`.
3. Author `tests/unit/fanout-pool.vitest.ts` covering cap enforcement, order preservation, failure
   isolation, all-failed, empty pool, concurrency<1 clamp, ledger events, invalid-args, and the ledger
   file helpers (via tmpdir).

## Verification
`npx vitest run ../../deep-loop-runtime/tests/unit/fanout-pool.vitest.ts` green; full unit suite green
(ignore the known `loop-lock` cross-process flake). `node -e require(...)` lists all 5 exports.
