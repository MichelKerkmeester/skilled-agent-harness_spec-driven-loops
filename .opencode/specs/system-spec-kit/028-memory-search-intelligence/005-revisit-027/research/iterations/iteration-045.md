# Iteration 45 (Round O adversarial): C4-A flip-safety → flip + deferred-wiring

## Focus
Perspective-diverse verify of the lead Wave-0 candidate: is C4-A a clean reversible flip. Read-only.

## Findings (newInfoRatio 0.6)
**VERDICT: FLIP-PLUS-DEFERRED-WIRING** (not a clean one-liner).
- The canonical/planner save path is DELIBERATELY receipt-excluded: `if (!shouldPlanCanonicalSave && isMemoryIdempotencyEnabled())` (`memory-save.ts:3547`, `shouldPlanCanonicalSave` at `:3166`); the deferred/async path has ZERO idempotency call sites (`atomicSaveMemory` at `:3655` has no receipt wrap). This IS the roadmap's own "wire replay/conflict into deferred-save" clause — so the flag flip alone is a PARTIAL promote.
- No new status leaks to callers: `replay` returns the prior response (stale-guarded), `conflict` is unreachable from save (force is in key material → a flip is a MISS) (`:3554,3580-3632`).
- Store IS bounded (prune at startup, TTL 30d, `idempotency-receipts.ts:258-276`) — caveat: prune fires only at startup, accumulates between restarts.
- **HIDDEN COUPLING:** `SPECKIT_MEMORY_IDEMPOTENCY` is OVERLOADED — it also gates near-duplicate advisory hints (`near-duplicate.ts:95`) + a receipt path in `memory-index.ts:697`. Default-ON ALSO turns on `nearDuplicate` hint emission (a second caller-visible additive change). Reversible with inert residue (table persists, TTL-pruned). LEVERAGE H, EFFORT S(flip)/M(complete).

## Most-likely-wrong
Whether the deferred/canonical path being receipt-unprotected matters — `atomicSaveMemory` may carry its own content-hash dedup / crash-safe idempotency at the storage layer (not opened), making the missing receipt-wiring nice-to-have rather than a correctness gap.

## Next Focus
Ledger: C4-A = the one literal off-state flip BUT S-flip/M-to-complete (deferred-save wiring) + overloaded-flag note (also enables near-dup hints). Corroborates 028's own "0-of-4 clean flips."
