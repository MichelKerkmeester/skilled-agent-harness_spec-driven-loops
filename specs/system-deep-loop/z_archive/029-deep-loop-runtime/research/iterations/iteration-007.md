# Iteration 7: External Mining — aionforge observability.md + operations-recovery.md → Deep Loop

## Focus
Round B external mining: two unread aionforge docs (observability, operations-recovery) for NET-NEW Deep Loop candidates beyond D1-D4/Q2/Q3/Q6. Read-only. **This is a previously-uncovered dimension** (the roadmap's Deep Loop candidates are all scoring/STOP/policy; none touch observability gauges or crash-recovery reset).

## Actions Taken
1. Read aionforge `docs/observability.md` + `docs/operations-recovery.md`.
2. Confirmed internal seams: `fanout-pool.cjs:78-115` (settleItem timestamped started/completed/failed ledger), `:205-217` (buildSummary = only total/succeeded/failed/all_failed), `fanout-run.cjs:472-491` (timedOut vs exitCode + salvage), `:495-505` (terminal summary only), `loop-lock.cjs:26,134,186-198` (TTL heartbeat only, "no long-lived heartbeat process"), `reduce-state.cjs:344,393,434` (resumed/restarted events; status defaults 'initialized').

## Findings — NET-NEW candidates (5; uncovered dimension, newInfoRatio 0.80)
| Candidate | Seam | Lev/Eff | Class | Conf |
|---|---|---|---|---|
| pool-backlog-gauges (pending + oldest-pending-lag + live failed; per-tick pending_after) | fanout-pool.cjs:78-115,205-217 | M/S | PROMOTE | CONFIRMED |
| orphan-lineage-recovery-reset (started-without-terminal lineages reset/requeue on resume) | loop-lock.cjs:186-188 + fanout-pool.cjs:82-108 (detect); reset GAP | H/M | BUILD | CONFIRMED-detect / INFERRED-reset |
| recover-vs-fresh state-open gate (resume REFUSES missing/empty state vs silent fresh-init) | reduce-state.cjs:434,795 | M/M | BUILD | INFERRED |
| progress-heartbeat + graceful-shutdown summary (periodic progress during long fan-outs + distinct shutdown summary) | loop-lock.cjs:26,134; fanout-run.cjs:495-505 | M/S | BUILD | CONFIRMED |
| bounded failure-class taxonomy in summary (timeout vs exit vs salvage-miss labels) | fanout-run.cjs:472-491; fanout-pool.cjs:210-217 | L/S | PROMOTE | CONFIRMED |

**Already covered:** Q3-fanout-recovery overlaps the *classification basis* of the failure-taxonomy candidate (but that candidate is the observability/label-emission slice, not re-dispatch). D1-D4/Q2/Q6/D-orderhelper are scoring/STOP/policy — none touch observability or crash-recovery reset (genuinely uncovered).

## Questions Answered
- Net-new Deep Loop surface in observability/recovery? HIGH (0.80) — an uncovered dimension. The timestamped fanout-pool ledger already exists so gauges are a thin PROMOTE; the orphan-lineage reset-on-resume is the highest-leverage net-new BUILD (detection primitives present, reset absent).

## Questions Remaining
- Does any workflow persist a per-lineage in-flight marker durably enough for an orphan-reset sweep to run before re-dispatch, or is the only durable in-flight signal the fanout-pool started-without-terminal ledger gap?

## Next Focus
Strong uncovered-dimension yield. pool-backlog-gauges (thin PROMOTE on the existing ledger) + orphan-lineage-recovery-reset (H/M) are the leads. Feeds Round C feasibility (resume/recovery sequencing).
