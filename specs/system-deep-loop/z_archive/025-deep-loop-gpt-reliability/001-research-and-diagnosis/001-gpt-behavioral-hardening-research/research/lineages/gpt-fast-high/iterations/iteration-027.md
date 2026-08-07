# Iteration 27: Implementation Ordering Stress-Test

## Focus
Ordering of smoke, route-unification, plugin, FIX-5.

## Findings
- External smoke before route-unification preserves current-state measurement.
- Route-unification before FIX-5 gives the lower-blast agent-layer fix a fair trial.
- Plugin guardrail should follow route-unification so it enforces the final route contract, not transitional variants.

## Sources Consulted
Phase 006 parked rationale [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/006-host-hard-identity-fix5/decision-record.md:26-34].

## Assessment
newInfoRatio: 0.10. Ordering became explicit.

## Reflection
Do not skip measurement because symptoms are plausible.

## Recommended Next Focus
Audit KQ coverage.
