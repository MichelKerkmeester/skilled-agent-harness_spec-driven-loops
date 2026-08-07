# Iteration 13: Round F Verify — Deep Loop Reliability KEYSTONE (D2 wholly absent)

## Focus
Round F verify of the original-roadmap Deep Loop reliability-learning candidates — the D-spine keystone, which broadening had NOT re-verified (Round A only verified D3 + folding). Read-only.

## Assessments (newInfoRatio 0.70)
| Candidate | Real | Feasibility | Note |
|---|---|---|---|
| D2-reliability (KEYSTONE) | **REFUTED** | NEEDS-BENCHMARK | wholly ABSENT — `reliability`/`computeWeightedScore`/Σr return ZERO matches across all .ts/.cjs in lib+scripts; signals read verification_status/quality_class/confirmations/relevance, never reliability; upsert.cjs writes 0/269 lines of reliability. Metadata-parse + weightSum scaffolding make it buildable, but it must OUT-EARN existing confirmations/relevance signals — benchmark before committing the shared dep |
| Q2-quarantine | **REFUTED** | NO-GO | "lower-trust side" is undefined (trust=reliability, and D2 doesn't exist); current CONTRADICTS logic excludes BOTH sides symmetrically as a stability penalty — not trust-keyed; blocked until the keystone lands |
| Q3-fanout-recovery | PARTIAL | CAUTION | best-anchored — classification primitives (exitCode/timedOut/signal + classifyExitCode) + a failure obj carrying {label,exitCode,timedOut,salvage} exist, but NO transient/fatal split, NO retry; re-dispatch is net-new pool logic that must not double-count summary.failed nor mask retry-success |
| DL-cross-lineage-contradiction-record | PARTIAL | NEEDS-BENCHMARK | the CONTRADICTS write primitive IS real, but the same-id-merge conflict-detection site was NOT found in upsert.cjs — the keep-both anchor is unlocated; confirm whether upsert dedupes by id/content_hash (overwrite would clobber, defeating keep-both) |

## Key correction (major)
**The Deep Loop reliability KEYSTONE (D2) is wholly absent on BOTH read and write sides** — so the entire reliability-weighted-learning spine (D1/D3/Q2/Q7 all consume D2) rests on building D2 FIRST, and D2 must demonstrate it out-earns the existing confirmations/relevance signals before it's worth the shared-dep commitment. This substantially tempers the roadmap's "Deep Loop owns the keystone reliability spine" framing: it's **all net-new build gated on a benefit benchmark**, not a promote. Q2-quarantine is NO-GO until D2 exists; Q3-fanout-recovery is the best-anchored Deep Loop reliability candidate (classification primitives present).

## Next Focus
Deep Loop reliability spine = net-new build gated on D2 first proving its worth vs existing signals. Q3-fanout-recovery is the best-anchored standalone. Feeds synthesis (temper the "Deep Loop owns the reliability spine" claim).
