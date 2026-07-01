# Iteration 23: FIX-5 Unpark Decision Criterion (KQ9)

**Focus track:** fix5 | **Status:** complete

## Focus
State a clear FIX-5 unpark decision criterion distinct from — and more decisive than — phase 006's existing (already-inconclusive) trigger language.

## Findings
- **Phase 006's existing trigger (006/decision-record.md:20-22): unpark if phase-004 smoke produces a schema-valid route-mISMATCHED artifact. Weakness: it depends on the smoke actually running cleanly, which 005 proved it could NOT from inside OpenCode — so the trigger has never been exercisable, leaving 006 permanently parked on inconclusive evidence.** [SOURCE: 006/decision-record.md:20-22; 005/verification-smoke.md:120]
- **New evidence since 006: (1) real-world operator symptoms now corroborate the mis-dispatch class independently of the smoke (research-prompt.md:21); (2) the KQ1 external-smoke spec (iter 5) makes the trigger actually runnable; (3) the KQ6 benchmark (iter 16-17) makes correctness measurable GPT-vs-Claude; (4) the KQ5 plugin (iter 14-15) makes route-mismatch detectable at dispatch without host internals.** [SOURCE: iter 5,14,16; research-prompt.md:21]
- **Proposed DECISION CRITERION (decisive): unpark FIX-5/host-identity IF AND ONLY IF, after KQ4 + KQ5 land AND the KQ1 external smoke runs, the KQ6 benchmark shows GPT route-proof score < 4/4 while Claude = 4/4 on any mode (i.e., prompt-layer + detection-layer hardening insufficient). This is distinct from 006 because it (a) requires the actually-runnable external smoke, (b) is measured not inferred, and (c) sequences KQ4/KQ5 first.** [SOURCE: iter 5,12,14,16; 006/decision-record.md:20-22]
- **The criterion is a NEGATIVE gate on the cheaper layers: FIX-5 is mandatory only when the agent-layer (KQ4) + detection-layer (KQ5) are PROVEN insufficient by measured GPT-vs-Claude gap, not when they are merely unproven.** [SOURCE: synthesis of iters 5,12,14,16]

## Sources Consulted
- 006-host-hard-identity-fix5/decision-record.md:20-22
- 005-gpt-verification-smoke/verification-smoke.md:120
- research-prompt.md:21
- iter 5,12,14,16

## Assessment
- **newInfoRatio:** 0.60
- **Novelty justification:** Replaces the never-exercisable 006 trigger with a measured, sequenced, negative-gate criterion tied to the runnable KQ1 smoke + KQ6 benchmark.
- **Confidence:** 0.86
- **Key questions considered:** KQ9
- **Questions closed this iteration:** (none closed this iteration)

## Reflection
**What worked:**
- A negative gate on cheaper layers (prove insufficiency) is more decisive than a positive trigger (await mismatch).

**What failed:**
- (none this iteration)

**Ruled out:**
- (none this iteration)

## Recommended Next Focus
KQ9: render the actual decision — unpark now / wait on KQ1 / neither — weighted on operator evidence.
