# Iteration 3: P1 Bounded Local Repair

## Focus
Define the repair loop without creating an unbounded inner agent.

## Actions Taken
Compared NOOA validation retries, the YAML redispatch-once rule, and blog hard-stop guidance.

## Findings
1. **[OBSERVED-IN-PAPER][CONFIRM studies; EXTEND runtime]** Predict performs local retries and CodeAct returns validation errors as observations until a typed value appears. This establishes a useful defect-local feedback pattern. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:116-130] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:205-207]
2. **[INFERENCE][REFINE studies; REFINE runtime]** Allow at most two local repair turns for return-shape defects, charged to the same iteration budget. The first invalid candidate never appends canonical state; each failed candidate emits a packet-local `return_validation_failed` event with candidate digest and diagnostics. [SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml:1294-1312]
3. **[INFERENCE][CONFIRM studies; CONFIRM runtime]** Semantic evidence failures do not use this repair loop. They return to the workflow's evaluator/research routing because the model must gather or reinterpret evidence, not merely correct a field. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:50-88]
4. **[INFERENCE][CONFIRM studies; REFINE runtime]** After two shape failures, close the local call with `invalid_return`, preserve diagnostics, and invoke the existing one-time workflow redispatch. A second mechanical failure becomes the canonical error iteration; no accepted JSONL row is rewritten. [SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml:1294-1312] [SOURCE: .opencode/skills/system-deep-loop/deep-research/SKILL.md:247-254]
5. **[TEXT-CLAIMED][CONFIRM runtime; ORTHOGONAL authority]** The self-correcting-loop blog requires hard iteration, quality, and budget ceilings as manager logic rather than soft model instructions. That supports a bounded repair counter and contradicts open-ended self-correction. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Build a Self-Correcting AI Loop That Catches Its Own Mistakes Before You See Them.md:63-99]

## Questions Answered
- Two local shape repairs, then workflow redispatch; no in-place rewrite of accepted state.

## Questions Remaining
- Prove the three acceptance layers remain independent.

## Ruled Out
- Unbounded local repair.
- Using local repair to manufacture missing evidence.

## Edge Cases
- A transport failure before any candidate is not a validation failure and follows executor recovery.

## Sources Consulted
- Paper, YAML, skill, and self-correcting-loop blog, cited above.

## Assessment
- New information ratio: 0.82.
- Status: complete.

## Reflection
Local repair is safe only while it remains syntactic, budgeted, and pre-commit.

## Recommended Next Focus
Separate type, semantic, convergence, and authorization decisions.
