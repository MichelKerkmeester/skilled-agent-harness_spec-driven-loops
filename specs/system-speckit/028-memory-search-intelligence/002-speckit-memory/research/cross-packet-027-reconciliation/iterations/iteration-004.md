# Iteration 4 (Round K): Q4 Learning Feedback Reducers × bounded Beta posterior

## Focus
Reconcile 027's memory learning feedback reducers against 028's bounded anti-flood Beta posterior (D2/C4) and the 028 finding that the live estimator is raw-frequency. Read-only.

## Findings (newInfoRatio 0.6)
**VERDICT: NO-TRANSFER (as scoped)** — a deliberate deflation of the Q4 hypothesis.
- 028's bounded Beta posterior is **explicitly scoped to Advisor-C4 + Deep-Loop-D2 only** ("build once, wire twice", `roadmap.md:248`); the math primitive lands in Deep-Loop `bayesian-scorer.ts` (D1). 028 **never proposes** converting Memory's reducer.
- 027's memory retention reducer IS raw-count/threshold (`feedback-retention-reducer.ts:111-113` `weightedHitCount/sessionCount/queryCount >= min`; decision branches `:154-164`) — but it **shares no code** with the advisor calibrator (imports only scope-governance + batch-learning, `:6-8`), so it is not the shared module 028 wants.
- 027's reducer already ships shadow-first, default-off (three-gate), governed conservatively (`before-vs-after.md:139`). LEVERAGE L, EFFORT M.

## Most-likely-wrong (genuine open → could flip to EXTENDS)
That the reducer's raw-count thresholds are "correct-by-design." Retention *protection* is itself a reliability estimate that volume can wrongly push to "protect" — making it a legitimate (if 028-unscoped) candidate for the same bounded Beta posterior. Carry to Round L/N as the one live open on Q4.

## Next Focus
Round L: test the most-likely-wrong — is the memory reducer flood-vulnerable in the protect direction? If yes, Q4 reclasses extends and joins the shared-Beta-infra plan.
