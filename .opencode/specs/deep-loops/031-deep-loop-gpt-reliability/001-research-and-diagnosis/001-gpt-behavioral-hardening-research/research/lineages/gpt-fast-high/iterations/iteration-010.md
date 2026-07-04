# Iteration 10: FIX-5 Decision Criterion

## Focus
KQ9 unpark decision.

## Findings
- Current phase 006 trigger requires route-mismatched artifacts or failure signals while native/Claude baseline passes [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/006-host-hard-identity-fix5/decision-record.md:20-34].
- Phase 005 did not satisfy this because it failed before real leaf dispatch and lacks external clean-pass evidence [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/005-gpt-verification-smoke/implementation-summary.md:112-115].
- Decision: do not unpark immediately; run external smoke and benchmark first. Unpark if route-proof mismatches, missing artifacts, or repeated stuck/latency failures persist after route-unification.

## Sources Consulted
Phase 006 decision and phase 005 summary.

## Assessment
newInfoRatio: 0.58. The criterion is stronger than restating the old blocked trigger because it includes the external-shell precondition and post-route-unification benchmark.

## Reflection
Ruled out both immediate FIX-5 and permanent parking.

## Recommended Next Focus
Adversarially re-check council conversion.
