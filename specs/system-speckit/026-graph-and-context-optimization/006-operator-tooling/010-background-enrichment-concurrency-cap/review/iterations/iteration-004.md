# Deep-Review Iteration 4 (opus-4.8) — slot-exhaustion + boundary

## Verdict: 1 NEW P1, 2 boundary lenses SOUND.

- **F-006 (P1, NEW): Hung-run slot exhaustion / liveness deadlock.** `run`'s `finally` (decrement + re-arm) is only reached when `await runPostInsertEnrichment(...)` settles. The summary-embedding path reaches an **un-timed** `provider.embedQuery` (`lib/providers/embeddings.ts:739`). If that await never settles (hung embed HTTP / deadlock), the slot is never released. After ≤4 hung runs, `active === MAX` permanently → every future enrichment queues and never drains → **silent permanent enrichment outage**, all *without breaching the proven `0 ≤ active ≤ MAX` bound*. The safety proof (iters 1-3) does not imply liveness (slots returning to 0) — which is why safety-only convergence missed it. **Fix:** bound the run at the owner level — wrap the `await` in a timeout/AbortController so a hung run eventually rejects → `finally` runs → slot released. Confidence: HIGH (mechanism) / the un-timed embed call is the reachable trigger.
- Scan-yield modulo boundary: SOUND (sum increments 1/iter; deterministic yield).
- Exact-MAX shift/start cycle: SOUND (`--` then `++` in one synchronous block; `active` never observably 5).

## Convergence impact: **RESET** — new P1 (liveness) breaks the iters 1-3 "no P0/P1" streak.
