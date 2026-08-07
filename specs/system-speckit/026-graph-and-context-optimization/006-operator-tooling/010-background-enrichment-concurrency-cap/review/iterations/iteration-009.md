# Deep-Review Iteration 9 (gpt-5.5 xhigh) — observability / operability

## Verdict: No P0/P1. 3 NEW P2 (observability) — all reinforce F-006 (hung-run).

- **F-009 (P2, NEW): Scheduler state invisible.** `activeBackgroundEnrichments`/`backgroundEnrichmentQueue` are module-local; `memory_health` exposes vector backlog but NOT scheduler state or the `post_insert_enrichment_status` distribution. A hung-run cap-deadlock (F-006) would be silent/undiagnosable. Fix: expose `active`/`queued`/`max`/`oldestQueuedAgeMs`/failure counters + DB counts by enrichment status with a degraded hint. (`memory-save.ts:2920`; `memory-crud-health.ts`.)
- **F-010 (P2, NEW): Failures log-only, unaggregated.** One `console.warn` per thrown enrichment (`:2965`); no counter, last-error, rate-limit, or persisted failed-marker for the throw-before-record path. Fix: structured counters + rate-limited summaries + best-effort mark failed.
- **F-011 (P2, NEW): Recovery not discoverable.** Backfill exists but no health remediation hint. Fix: health hint "restart if slots stale, then `memory_index_scan({force:true})`".

## Convergence impact: P2 observability cluster; sharpens the operability side of the F-006 P1.
