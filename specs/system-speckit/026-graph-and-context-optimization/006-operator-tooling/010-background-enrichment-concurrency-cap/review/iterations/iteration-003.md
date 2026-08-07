# Deep-Review Iteration 3 (completeness + convergence confirmation)

- **Worker**: cli-claude-code · claude-opus-4-8 · account2 · `review` agent · high effort
- **Lens**: independent re-derivation of the cap invariant + concurrent-producer / re-entrancy / TOCTOU + completeness critic

## Verdict: CONVERGED-CORRECT. No new P0 / No new P1.

### Confirmed (independent re-derivation)
- **Slot invariant `0 ≤ active ≤ MAX`** — re-derived by induction over the only two writes (`++` in `start` `:2943`, `--` in `finally` `:2967`): base 0; top-level `start` only when `active < MAX`; re-arm is `-- then ++` (net-zero); every `run` born of one `start` and one `finally` (bijection). No leak, no underflow. Confirms iter 1.
- **Check-then-act atomicity** — fully synchronous from the gate read (`:2973`) through the `++` (`:2943`); no `await`/microtask/setImmediate between them. On Node's single thread two callers cannot both pass the gate. No TOCTOU.
- **Concurrent producers** (live save + scan, shared module globals) — each `scheduleBackgroundEnrichment` call completes its gate-and-act synchronously → atomic; interleaving impossible.
- **Re-entrancy** (NEW) — `runPostInsertEnrichment` (`post-insert.ts:539-569`) references no save/scheduler/index entry; no recursive slot acquisition; even hypothetically, re-entry is setImmediate-deferred (no stack growth).
- **Completeness (NEW)** — integer range `[0,4]` (no over/underflow); `void`-discarded IIFE fully try/catch/finally-wrapped (no unhandledRejection); gate edge `< 4` queues at exactly 4 (no off-by-one); **`dist/handlers/memory-save.js:2198-2258` byte-faithfully mirrors the source** (fix is in the running artifact, not stranded).

### Adversarial self-check (Hunter/Skeptic/Referee)
All P0/P1 candidates raised then DROPPED with evidence: TOCTOU (synchronous gate), re-arm overflow (`--` precedes `start`), re-entrancy (no callback), stale dist (mirrors source), void-rejection (try/finally). Unbounded-queue downgraded to the existing iter-2 P2.

### Standing items (all prior P2, none lifted to P0/P1)
- Queue/`parsed` retention duration (iter 2 F1).
- Idle-monitor blind to enrichment (iter 2 F3).
- Stale db-handle mid-`await` (iter 2 F2) — already mitigated for the common case by `requireDb()` re-resolution at `:2951`; residual is fail-safe via backfill.

## Convergence tracker
- New P0: 0 · New P1: 0 · New P2: 0 (all confirm-prior)
- Consecutive iterations with no new P0/P1: **3 → EARLY-STOP CONVERGED**
- AGENT_IO_RESULT: status=pass, confidence 0.90, failure_type p2
