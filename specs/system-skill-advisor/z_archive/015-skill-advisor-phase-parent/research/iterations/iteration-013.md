# Iteration 13: Round F Verify+Feasibility — Advisor Trust-Cluster Remainder

## Focus
Round F verify+feasibility for the iter-7 trust-cluster remainder (the C4-gate family's smaller candidates). Read-only.

## Assessments (newInfoRatio 0.55)
| Candidate | Real | Feasibility | Note |
|---|---|---|---|
| SA-decay-driven-un-promotion | PARTIAL | NEEDS-BENCHMARK | NO promotion path exists to un-promote; "stable id re-promote" half holds (literal lane ids) but reversibility presupposes an apply path that's absent — depends on C2/C3 + a live-write first |
| SA-asymmetric-promote-demote-deltas | REAL | **GO** | current delta is provably SYMMETRIC `(accept-correct)*Δ` (feedback-calibration.ts:176); asymmetric/up-cap=0 is a localized conservative change — scope a NEW asymmetric helper (don't mutate the shared `clamp()` at :200-201) |
| SA-content-addressed-order-independent-fold | PARTIAL | NEEDS-BENCHMARK | aggregation counts ALREADY commute (countOutcomes → Beta α/β maps cleanly), but persistence is NOT replay-safe — `slice(-50)` truncation is insertion-ordered, no content-addressing exists; Beta-reframe needs held-out validation (already a guardrail) |

## Key correction
The advisor trust remainder mostly **depends on the (absent) promotion apply-path** (un-promotion) or is **already-commutative-but-not-replay-safe** (the fold). The one clean GO is **asymmetric-deltas** (the live delta is provably symmetric; making corrections sink harder is a localized, conservative change). These all sit downstream of the C4-seam (Round C GO) being built first.

## Next Focus
asymmetric-deltas is the clean add; un-promotion + content-fold are gated on the C4-seam apply-path. Feeds synthesis (the advisor trust cluster is one sequenced build: C4-seam → two-gate → held-out → asymmetric → fold/un-promote).
