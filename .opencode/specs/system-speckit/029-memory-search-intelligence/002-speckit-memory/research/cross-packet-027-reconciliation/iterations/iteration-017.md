# Iteration 17 (Round L): Q6 + Q7 kill-or-keep → BOTH KILL

## Focus
Skeptical decision on the two thin/speculative "extends" from mapping (Q6 trigger class-gate, Q7 reliability-prior owner-election). Read-only.

## Findings (newInfoRatio 0.4)
**Q6 — KILL.** The semantic trigger stage is shadow-only and OFF by default — `computeSemanticTriggerShadow` returns stats and "without modifying lexical results" (`semantic-trigger-matcher.ts:442,90,103-105`). Gating a no-op by retrieval-class is pointless; triggers are already lexical-primary + conservative (cosine 0.84 + tie-margin returns `[]`, `:91,435-437`); and C2-A's classifier doesn't exist yet (BUILD-new, `roadmap.md:70`).
**Q7 — KILL.** Owner election is a correctness-critical mutex decided by liveness + ppid-reparent + heartbeat-TTL then resolved via exclusive O_EXCL CAS (`mk-code-index-launcher.cjs:427-443,470`). A reliability prior can't safely override liveness in EITHER direction (a dead owner MUST be reclaimed; a live one MUST be kept), and ephemeral launcher PIDs are not stable entities to accumulate a Beta posterior over. 028's D2 posterior is for finding/source RANKING (`roadmap.md:103,170`), not lock election. LEVERAGE —, both KILLED.

## Most-likely-wrong
Q6's "too simple to ever benefit" — IF semantic triggers are later promoted shadow→LIVE, a class-gate suppressing false-positive semantic matches on Quote/Entity queries could have marginal precision value. Contingent-future, not now.

## Next Focus
Q6 + Q7 removed from the candidate set (deflation). Reconciliation ledger marks both no-transfer/killed.
