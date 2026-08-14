# Iteration 4: P1/P5 Non-Substitutable Acceptance Layers

## Focus
Draw the boundary between valid return, accepted evidence, convergence, and authorization.

## Actions Taken
Compared paper validation/evaluation claims, eval doctrine, live convergence, and study-3 authority separation.

## Findings
1. **[OBSERVED-IN-PAPER][CONFIRM studies; REFINE runtime]** NOOA return validation checks conformance to a return annotation; the paper separately evaluates capabilities and end-to-end tasks. Its own structure therefore does not equate type validity with task correctness. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:205-207] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:239-249]
2. **[TEXT-CLAIMED][CONFIRM studies; CONFIRM runtime]** Eval doctrine says deterministic checks should precede model judges and a verdict must alter execution. This supports a semantic acceptance layer over cited evidence and trajectory, not another formatting check. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:32-88]
3. **[INFERENCE][CONFIRM studies; REFINE runtime]** Ordered pipeline: `return-shape admissible` → `artifact/digest integrity` → `evidence and trajectory accepted` → `mode convergence/legal stop` → `036 transition authorization`. Each layer consumes the preceding result but issues a distinct decision type. [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/orientation.md:79-91] [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:16-20]
4. **[INFERENCE][CONTRADICT collapse; CONFIRM runtime]** A perfectly typed fabricated citation passes layer one and fails evidence acceptance; a well-supported iteration can fail mode coverage; a converged research packet can remain unauthorized for any protected effect. These mutants prove non-substitution. [SOURCE: .opencode/skills/system-deep-loop/deep-research/references/convergence/convergence.md:105-141]
5. **[INFERENCE][CONFIRM 036; REFINE runtime terminology]** Rename any ambiguous `validated` flag by scope (`shapeValid`, `evidenceAccepted`, `stopAllowed`, `transitionAuthorized`) so no boolean leaks authority across layers. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:5-8]

## Questions Answered
- P1/P5 acceptance order and non-substitution.

## Questions Remaining
- Memory proposal and retention boundaries.

## Ruled Out
- Schema validity as truth.
- Semantic pass as transition authority.
- Convergence as bearer authorization.

## Edge Cases
- A layer may block without diagnosing the next repair; diagnostic completeness is separately testable.

## Sources Consulted
- Paper, eval blog, convergence references, study 3, orientation.

## Assessment
- New information ratio: 0.77.
- Status: insight.

## Reflection
The architecture becomes legible when each decision has a unique name, owner, and consequence.

## Recommended Next Focus
Inventory NOOA memory mechanisms before constraining them.
