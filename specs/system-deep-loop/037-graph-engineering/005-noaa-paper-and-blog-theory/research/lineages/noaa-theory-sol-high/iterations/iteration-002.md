# Iteration 2: P1 IterationResult Envelope

## Focus
Translate typed method returns into a repository-native iteration boundary.

## Actions Taken
Compared NOOA return validation, study-1 typed exits, the prompt-pack schema, and mechanical post-dispatch validation.

## Findings
1. **[OBSERVED-IN-PAPER][CONFIRM studies; REFINE runtime]** NOOA validates a candidate against the Python return annotation and returns field-specific failure to the model before the method can finish. The live runtime currently validates durable outputs after dispatch, so a pre-acceptance local repair stage would refine rather than replace it. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:116-130] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:205-207]
2. **[INFERENCE][CONFIRM studies; EXTEND runtime]** `IterationResultV1` should contain `iteration`, `mode`, `status`, `focus`, typed artifact handles, evidence handles, answered/open question ids, negative-knowledge records, proposed graph events, next-focus proposal, novelty evidence, and an optional terminal candidate. This is the smallest envelope covering today's three artifacts without collapsing them into an object. [SOURCE: .opencode/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:53-81] [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/research/research.md:61-67]
3. **[INFERENCE][CONFIRM studies; REFINE runtime]** The envelope is a commit proposal: validation succeeds only after referenced narrative and delta digests resolve, the state append is prospective, and route proof matches. Durable files remain replay authority; the envelope never replaces them. [SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/validation/post-dispatch-validate.md:19-48] [SOURCE: specs/system-deep-loop/037-graph-engineering/005-noaa-paper-and-blog-theory/orientation.md:73-73]
4. **[INFERENCE][EXTEND studies; EXTEND runtime]** Validation errors need a closed code/path/expected/observed structure plus repair-attempt number, so the next turn fixes one local defect rather than receiving opaque redispatch prose. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/research-paper/NVIDIA-labs-OO-Agents.md:205-207]
5. **[INFERENCE][CONFIRM 036; ORTHOGONAL runtime execution]** `terminalCandidate` is advisory. Neither a type-valid envelope nor resolved artifact digests authorize a protected transition; 036 still evaluates the exact consequence. [SOURCE: specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/research.md:16-20]

## Questions Answered
- P1 exact envelope fields and replay role.

## Questions Remaining
- Repair budget and failure routing.

## Ruled Out
- Replacing narrative/state/delta with an in-process result object.
- Prose-only terminal returns.

## Edge Cases
- A valid envelope may reference stale or semantically weak evidence; later gates must catch that.

## Sources Consulted
- Paper return validation, study 1, prompt pack, validator, cited above.

## Assessment
- New information ratio: 0.88.
- Status: complete.

## Reflection
Typing is most valuable before durable acceptance, while replay remains file- and digest-based.

## Recommended Next Focus
Bound local repair and escalation.
