# Iteration 21: Deep-Loop Family Audit for Missed Routing Seams (KQ8)

**Focus track:** propagation | **Status:** complete

## Focus
Audit the deep-loop command/agent family for additional routing seams (improvement-family modes, the mode-registry non-runtime modes) the iter-20 list may have missed.

## Findings
- **mode-registry.json lists 4 runtime-loop modes (context/research/review/ai-council) AND 4 improvement-family modes (agent-improvement, model-benchmark, skill-benchmark, ai-system-improvement). The improvement modes use backendKind=improvement-host/external-adapter, NOT the runtime-loop router.** [SOURCE: mode-registry.json:18-146]
- **deep.md explicitly scopes itself to the 4 runtime-loop modes and marks improvement-family out of scope (deep.md:47). So the iter-20 list correctly covers the runtime-loop routing seams; improvement modes route through /deep:agent-improvement etc. with their own loop-host, not deep.md.** [SOURCE: deep.md:47; mode-registry.json:81-145]
- **Missed-seam check: the improvement commands (/deep:agent-improvement, /deep:model-benchmark, /deep:skill-benchmark, /deep:ai-system-improvement) DO need a Resolved-route header at their own seams IF GPT also mis-resolves them — but the operator symptoms (research-prompt.md:21) name only the 4 runtime modes, so improvement-family hardening is lower priority and can follow the same pattern later.** [SOURCE: mode-registry.json:81-145; research-prompt.md:21]
- **No additional runtime-loop seam missed. The iter-20 list + this audit = complete propagation scope for the reported symptom class, with improvement-family flagged as same-pattern-follow-up.** [SOURCE: iter 20 + this audit]

## Sources Consulted
- mode-registry.json:18-146
- deep.md:47
- research-prompt.md:21
- commands/deep/*.md

## Assessment
- **newInfoRatio:** 0.40
- **Novelty justification:** Confirms the runtime-loop list is complete and explicitly carves out improvement-family as a deferred same-pattern follow-up, not a missed seam.
- **Confidence:** 0.82
- **Key questions considered:** KQ8
- **Questions closed this iteration:** (none closed this iteration)

## Reflection
**What worked:**
- Reading the registry's backendKind field cleanly separates runtime-loop from improvement-family routing.

**What failed:**
- (none this iteration)

**Ruled out:**
- (none this iteration)

## Recommended Next Focus
KQ8 adversarial: which family members must NOT be hardened (preserve non-broken flexibility).
