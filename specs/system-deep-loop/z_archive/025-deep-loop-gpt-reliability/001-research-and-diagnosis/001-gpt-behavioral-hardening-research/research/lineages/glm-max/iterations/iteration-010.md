# Iteration 10: ai-council Migration Path & Co-dependencies (KQ3)

**Focus track:** council | **Status:** complete

## Focus
Design the safest migration path to subagent-only (if chosen) and identify the deep.md/orchestrate.md co-dependencies, then weigh convert vs keep.

## Findings
- **Migration path if converting: (a) flip ai-council.md mode all->subagent (or a new subagent-only marker); (b) update deep.md:45 to remove the "remains directly invocable" carve-out and make council a pure deep target; (c) update orchestrate.md:101 priority-3 row to keep council dispatchable via orchestrator; (d) keep /deep:ai-council as a command that routes THROUGH deep.md rather than invoking the agent directly.** [SOURCE: ai-council.md:4; deep.md:45; orchestrate.md:101]
- **Co-dependency: deep.md:45 and mode-registry.json:65-80 currently assume council dual-reachability; converting requires both to move council behind the router consistently.** [SOURCE: deep.md:45; mode-registry.json:65-80]
- **RECOMMENDATION (provisional): DO NOT convert to subagent-only now. Rationale: the reported symptoms do not involve ai-council mis-dispatch (research-prompt.md:21), conversion breaks the depth-0 parallel value (ai-council.md:55-58), and the safer KQ4/KQ5 hardening addresses the actual symptom class. Revisit only if a future smoke shows council-specific route mismatch.** [SOURCE: ai-council.md:55-58; research-prompt.md:21]
- **Cheaper alternative that preserves dual-reachability: keep mode:all but add a deep.md-style route-proof header to the council command path so GPT cannot mis-resolve council while keeping direct invocation for Claude/operators.** [SOURCE: deep.md:69-75 (Deep Route header pattern)]

## Sources Consulted
- ai-council.md:4,55-58
- deep.md:45,69-75
- orchestrate.md:101
- mode-registry.json:65-80
- research-prompt.md:21

## Assessment
- **newInfoRatio:** 0.50
- **Novelty justification:** Recommends AGAINST conversion with evidence (symptoms don't involve council) and offers a route-proof-header compromise that preserves the depth-0 value.
- **Confidence:** 0.82
- **Key questions considered:** KQ3
- **Questions closed this iteration:** (none closed this iteration)

## Reflection
**What worked:**
- Weighing convert vs keep against the actual symptom set yields a defensible provisional no.

**What failed:**
- (none this iteration)

**Ruled out:**
- (none this iteration)

## Recommended Next Focus
Adversarial: does subagent-only lose something the operator currently relies on that the symptom report would not surface?
