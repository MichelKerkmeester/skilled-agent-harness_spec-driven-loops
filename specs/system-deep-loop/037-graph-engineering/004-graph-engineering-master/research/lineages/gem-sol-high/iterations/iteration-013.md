# Iteration 13: P4 Data, Retrieval, and Runtime Gates

## Focus
Prevent knowledge-quality evidence from being mistaken for behavioral parity.

## Actions Taken
Compared GEM evaluation with studies 2–3 parity and promotion doctrine.

## Findings
1. **[TEXT-CLAIMED][ADOPT] Data-quality gate.** Measure entity/relation/triple precision and recall, leakage, confidence intervals, source-family drift, and fusion error. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/WORKFLOWS.md:148-162]
2. **[TEXT-CLAIMED][ADOPT] Retrieval-quality gate.** Predeclare question families and answer keys, compare graph/hybrid routes with vector-only baseline, and measure citation fidelity, answer quality, latency, and cost. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/WORKFLOWS.md:165-179]
3. **[TEXT-CLAIMED][CONFIRM] Runtime-parity gate.** Study 3 requires causal observations, complete case/mutant manifests, authority/effect suppression, and stage-specific promotion; terminal equality or a certificate alone is insufficient. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:131-143]
4. **[INFERENCE: the three gate families compose but do not substitute]** A perfect KG can run through an unsafe scheduler; a perfectly parity-matched runtime can retrieve poisoned evidence; high answer scores can conceal unauthorized effects.

## Questions Answered
- P4 has three separately owned evidence families with a conjunctive release decision.

## Questions Remaining
- Map these onto live coverage-graph and contradiction/supersession runtime.

## Ruled Out
- One “graph quality” score; using KG precision as causal-prefix parity.

## Edge Cases
- A route classifier can improve aggregate quality while harming a high-risk question family.

## Sources Consulted
- GEM workflows; study 3 parity synthesis.

## Assessment
- New information ratio: 0.35
- Status: complete

## Reflection
The production plane adds evidence inputs to promotion, not a new authority owner.

## Recommended Next Focus
P4 live runtime mapping.
