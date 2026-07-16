# Iteration 46 (Round O): Q7 lease-telemetry + Q4 sliding-TTL ceiling

## Focus
Feasibility of the two small items the adversarial round surfaced. Read-only.

## Findings (newInfoRatio 0.6)
**A — Q7 lease-telemetry: SKIP / low-priority.** No metrics sink exists — the launcher's only output is `log()`→`process.stderr.write` (`mk-code-index-launcher.cjs:132-134`); the classification is emitted only as the `ownerLeaseReclaimed:<class>` stderr line on reclaim (`:455`). "Rates" need cross-launch aggregation = a new persistent counter the ephemeral per-spawn launcher lacks (Medium, wrong layer). Cheapest = scrape the existing stderr lines (zero launcher code). → marginal observability, not a candidate.
**B — Q4 sliding-TTL: REAL, needs ceiling.** `buildExtendedDeleteAfter` returns `max(runAt,lastSeen)+30d` with NO cap (`feedback-retention-reducer.ts:96-99`); an `important`-tier row that re-qualifies each window never expires. Fix = clamp `min(extended, createdAt+MAX_LIFETIME)` — but `RetentionCandidateRow` (`:22-36`) has NO creation timestamp, so `created_at` must be plumbed onto the row + its query (small multi-file). **027-internal hardening, NOT a 028 transfer.** EFFORT S-M.

## Most-likely-wrong
(B) "unbounded" — gated by tier=important + 3 thresholds + the sweep re-running each window, so a reviewer may downgrade to "real-but-rare" rather than "needs-ceiling-now."

## Next Focus
Q7 telemetry = low-priority observability footnote; Q4 ceiling = a 027-internal hardening note in the ledger (not a cross-packet transfer).
