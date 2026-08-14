# Iteration 11: P5 Three-Layer Evaluator Architecture

## Focus
Assign distinct owners and consequences to evaluation stages.

## Actions Taken
Compared paper return/end-to-end evaluation, blog gate doctrine, live convergence, and study-3 authority.

## Findings
1. **[OBSERVED-IN-PAPER][CONFIRM studies; REFINE runtime]** NOOA validates returns locally but evaluates interface use and end-to-end tasks separately, confirming that admissible shape and effective behavior are different claims. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:205-207] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:239-307]
2. **[INFERENCE][CONFIRM studies; EXTEND runtime]** Layer A, return admission: deterministic schema, route, artifact existence, digest, and append-discipline checks. Output is `ReturnAdmissionV1`; failure routes to bounded shape repair. [SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/validation/post-dispatch-validate.md:19-48]
3. **[INFERENCE][CONFIRM studies; EXTEND runtime]** Layer B, evidence/trajectory acceptance: citations resolve, claims match sources, question coverage is honest, actions respect scope/budget, negative knowledge is preserved, and evaluator independence is recorded. Output is `IterationEvidenceVerdictV1`; failure routes to targeted research or recovery. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:32-88]
4. **[CONFIRM runtime; REFINE terminology]** Mode-level convergence consumes accepted iterations only and applies rolling novelty, MAD, question coverage, quality, and graph blockers. Its output is `StopDecision`, not an iteration-quality verdict. [SOURCE: .opencode/skills/system-deep-loop/deep-research/references/convergence/convergence.md:105-141]
5. **[CONFIRM studies; CONFIRM 036]** Layer C, transition authorization: 036 evaluates the exact request against current authority facts and returns a durable decision/receipt. It never trusts Layer A or B as bearer authorization. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:16-20]
6. **[TEXT-CLAIMED][CONFIRM runtime]** A judge verdict must cause a routing consequence; otherwise evaluation is decorative. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:50-60]

## Questions Answered
- P5 gate ordering, owners, outputs, and failure routes.

## Questions Remaining
- Negative controls proving evaluator independence.

## Ruled Out
- One aggregate score and one component owning all verdicts.

## Edge Cases
- Deterministic checks can be wrong; their version/digest and negative mutants are part of evidence.

## Sources Consulted
- Paper, eval blog, validator, convergence, study 3.

## Assessment
- New information ratio: 0.46.
- Status: complete.

## Reflection
Layer separation prevents a green formatting check from acquiring semantic or operational meaning.

## Recommended Next Focus
Build mutants that defeat one layer at a time.
