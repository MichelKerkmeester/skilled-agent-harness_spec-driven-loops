# Iteration 4: Derive A Low-Blast Implementation Architecture

## Focus

This iteration synthesized the requirements and current enforcement points into a practical implementation direction.

## Findings

1. Confirmed: The orchestrator task format already carries fields that can host Fable 5 controls: success criteria, pre-mortem, scale, estimated tool calls, and output requirements. [SOURCE: .opencode/agents/orchestrate.md:196] [SOURCE: .opencode/agents/orchestrate.md:222] [SOURCE: .opencode/agents/orchestrate.md:224]
2. Confirmed: @code already has a Builder/Critic/Verifier structure and concrete anti-pattern checks for claim-without-verify, silent verify-fail retry, scope creep, partial-success returns, and wrong-abstraction patches. [SOURCE: .opencode/agents/code.md:450] [SOURCE: .opencode/agents/code.md:486] [SOURCE: .opencode/agents/code.md:492] [SOURCE: .opencode/agents/code.md:499]
3. Confirmed: @deep-research already has a citation rule and per-iteration budget discipline; this makes it a good consumer of a shared evidence contract rather than the only implementation target. [SOURCE: .opencode/agents/deep-research.md:178] [SOURCE: .opencode/agents/deep-research.md:495]
4. Confirmed: Non-native executor validation already checks executor provenance and fails when it is missing, so the post-dispatch validation layer is an appropriate place to add machine-checkable evidence fields. [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:615]
5. Inferred: The lowest-blast architecture is a shared "evidence ledger" or return-schema extension consumed by orchestrate, @code, @deep-research, and deep-loop validation. This is inferred from existing differentiated enforcement points; confirming it requires implementation planning against current test fixtures. [INFERENCE: based on .opencode/agents/orchestrate.md:196, .opencode/agents/code.md:450, and .opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:615]

## Ruled Out

- Rewriting each agent with the entire Fable 5 text is ruled out. It would duplicate doctrine across runtime mirrors and specialized agents, while a shared contract can centralize the testable behavior. [SOURCE: .opencode/agents/orchestrate.md:38]

## Dead Ends

- A single "global voice" change is not enough because the highest-value obligations are in task dispatch, child result evaluation, verification gates, and path boundaries. [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:13]

## Edge Cases

- Ambiguous input: "Implement Fable 5" could target global AGENTS, agents, commands, runtime validators, or tests. I selected a shared contract plus targeted consumers as the implementation architecture because it minimizes duplication.
- Contradictory evidence: none.
- Missing dependencies: no existing shared Fable evidence schema was found.
- Partial success: no.

## Sources Consulted

- `.opencode/agents/orchestrate.md:38`
- `.opencode/agents/orchestrate.md:196`
- `.opencode/agents/orchestrate.md:222`
- `.opencode/agents/orchestrate.md:224`
- `.opencode/agents/code.md:450`
- `.opencode/agents/code.md:486`
- `.opencode/agents/code.md:492`
- `.opencode/agents/code.md:499`
- `.opencode/agents/deep-research.md:178`
- `.opencode/agents/deep-research.md:495`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:615`

## Assessment

- New information ratio: 0.38.
- Questions addressed: What implementation path has the best leverage? What verification gates prove the behavior?
- Questions answered: What implementation path has the best leverage?
- Confidence: medium-high. The recommendation is evidence-backed, but exact file changes should be decided in a later implementation plan.

## Reflection

- What worked and why: Looking for existing enforcement seams kept the recommendation smaller than a full rewrite.
- What did not work and why: Treating all agents as equal implementation targets over-scoped the problem.
- What I would do differently: In planning, enumerate exact validators and fixtures before editing any agent docs.

## Recommended Next Focus

Converge on verification gates, acceptance criteria, and eliminated alternatives.
