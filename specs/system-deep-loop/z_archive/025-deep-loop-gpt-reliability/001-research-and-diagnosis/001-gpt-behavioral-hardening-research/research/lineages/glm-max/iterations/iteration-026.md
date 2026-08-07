# Iteration 26: Cross-KQ Adversarial Re-check #2: KQ3 + KQ9

**Focus track:** adversarial | **Status:** insight

## Focus
Red-team the two hold/recommendations most likely to be wrong: keeping ai-council dual-reachable (KQ3) and waiting on FIX-5 (KQ9).

## Findings
- **KQ3 red-team: keeping ai-council mode:all means a GPT mis-route TO council can still self-dispatch (mode B). Counter: the route-proof header (iter 10/11) makes the resolved route explicit, and the KQ5 plugin asserts it at dispatch — so the mis-route is caught even without conversion. The no-conversion holds because the mitigation (header + plugin) covers the residual risk.** [SOURCE: iter 9-11,14; ai-council.md:4]
- **KQ9 red-team: waiting on FIX-5 means if the cheaper layers are insufficient AND the smoke is slow to run, GPT mis-dispatch persists in production. Counter: the KQ1 external smoke is an 8-run harness (iter 16) — small and fast; the wait is not open-ended. And the KQ5 plugin deploys a detection layer immediately, reducing in-production mis-dispatch risk during the wait.** [SOURCE: iter 5,14,16,23,24]
- **Stress: what if the operator symptoms are actually ALL latency (not routing)? Then KQ4/KQ5 do not help and FIX-5 wait is wrong. Counter: the "wrong sub-agent" symptom (research-prompt.md:21) is a correctness symptom, not latency — it cannot be explained by latency alone. So at least one symptom is routing; the wait + measure approach handles the latency/routing split correctly via KQ6.** [SOURCE: research-prompt.md:21; iter 6,8]
- **Both holds survive red-team with the plugin/smoke mitigations as load-bearing safety nets. Key dependency: the KQ5 plugin must actually deploy for the holds to be safe.** [SOURCE: this iteration]

## Sources Consulted
- iter 9-11,14,16,23,24
- ai-council.md:4
- research-prompt.md:21

## Assessment
- **newInfoRatio:** 0.33
- **Novelty justification:** Validates both holds by showing their mitigations (plugin, smoke, benchmark) cover the red-team attack vectors; flags the plugin as a key dependency.
- **Confidence:** 0.80
- **Key questions considered:** KQ3, KQ9
- **Questions closed this iteration:** (none closed this iteration)

## Reflection
**What worked:**
- Attacking the holds via their mitigations exposes whether the safety nets are load-bearing.

**What failed:**
- (none this iteration)

**Ruled out:**
- (none this iteration)

## Recommended Next Focus
Broaden angle: dependency/ordering analysis of the full recommendation set.
