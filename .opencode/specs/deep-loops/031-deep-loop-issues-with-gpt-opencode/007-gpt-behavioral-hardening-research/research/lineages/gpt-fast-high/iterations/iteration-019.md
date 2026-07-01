# Iteration 19: Failure Taxonomy Refinement

## Focus
KQ2/KQ6 pass/fail outcomes.

## Findings
- Wrong-agent failure: route-proof fields mismatch expected mode/target [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:636-663].
- No-leaf failure: phase 005 reached self-invocation/general-agent blocks before leaf artifacts [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/005-gpt-verification-smoke/implementation-summary.md:99-104].
- Latency/stuck failure: command eventually produces correct route artifacts but exceeds threshold or repeatedly stalls in setup/iteration.

## Sources Consulted
Validator and phase 005 summary.

## Assessment
newInfoRatio: 0.26. Benchmark can classify outcomes without subjective interpretation.

## Reflection
Wrong-route and slow-route are different failures but both matter to operator symptoms.

## Recommended Next Focus
Draft phase breakdown.
