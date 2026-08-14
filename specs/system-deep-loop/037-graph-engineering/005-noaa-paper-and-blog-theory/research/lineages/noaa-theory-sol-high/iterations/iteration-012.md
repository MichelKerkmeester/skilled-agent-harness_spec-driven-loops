# Iteration 12: P5 Evaluator-Independence Mutants

## Focus
Prove no evaluator layer substitutes for another.

## Actions Taken
Mapped blog stress tests and paper hard-suite weaknesses to a negative-control matrix.

## Findings
1. **[INFERENCE][REFINE runtime]** Shape mutant: a missing `noveltyJustification` with excellent evidence must fail Layer A while Layer B would otherwise pass. [SOURCE: .opencode/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:59-69]
2. **[INFERENCE][REFINE runtime]** Evidence mutant: a perfectly typed record cites a nonexistent line or misstates a source. Layer A passes; Layer B must reject. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Build a Self-Correcting AI Loop That Catches Its Own Mistakes Before You See Them.md:112-136]
3. **[INFERENCE][CONFIRM studies]** Trajectory mutant: the final claim is correct, but the worker read forbidden scope, exceeded budget, or silently discarded contradiction. Output-only grading passes; trajectory evaluation fails. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:64-88]
4. **[INFERENCE][CONFIRM runtime]** Convergence mutant: all iterations are individually valid and supported, but an open key question or graph blocker remains. Layer B passes; STOP is blocked. [SOURCE: .opencode/skills/system-deep-loop/deep-research/references/convergence/convergence.md:105-141]
5. **[INFERENCE][CONFIRM 036]** Authority mutant: accepted and converged evidence proposes a protected write with stale authority epoch. All research gates pass; 036 refuses. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:43-53]
6. **[TEXT-CLAIMED][REFINE runtime]** Same-model-blind-spot mutant feeds a characteristic builder error to an identically framed judge; acceptance demonstrates lack of evaluator independence. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Build a Self-Correcting AI Loop That Catches Its Own Mistakes Before You See Them.md:112-136]
7. **[TEXT-CLAIMED][ORTHOGONAL acceptance]** The paper's 84.7% stress result despite stronger headline interface fluency motivates failure localization rather than one average. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:267-283]

## Questions Answered
- P5 independence mutant set.

## Questions Remaining
- Safe pass-by-reference analogue.

## Ruled Out
- Happy-path-only testing and final-output-only evaluation.

## Edge Cases
- Some mutants intentionally trigger multiple layers; the corpus must also include single-fault isolating cases.

## Sources Consulted
- Paper stress suite, eval and self-correction blogs, runtime contracts.

## Assessment
- New information ratio: 0.41.
- Status: insight.

## Reflection
The most useful corpus cases are those where one layer is wrong and every neighboring layer appears healthy.

## Recommended Next Focus
Define immutable typed handles and previews.
