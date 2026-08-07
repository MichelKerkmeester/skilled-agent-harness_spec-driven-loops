# Iteration 3: Real-World Symptom Classification

## Focus
KQ2 real-world mis-route mechanism.

## Findings
- Operator symptoms include slow orchestrate, wrong sub-agent invocation, stuck predefined flows, and overthinking [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/spec.md:58-60].
- Phase 005 direct route probes preserved route text but did not load real deep leaf definitions (`agent_definition_loaded:false`) [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/005-gpt-verification-smoke/implementation-summary.md:95-98].
- Command-owned attempts failed before comparable leaf execution, so the current symptom class is still mixed: self-invocation/setup failure plus probable soft-identity misrouting [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/005-gpt-verification-smoke/implementation-summary.md:99-104].

## Sources Consulted
Parent spec and phase 005 summary.

## Assessment
newInfoRatio: 0.82. The symptom taxonomy was refined without overclaiming.

## Reflection
Ruled out calling the evidence a new root cause.

## Recommended Next Focus
Evaluate ai-council's `mode: all` status.
