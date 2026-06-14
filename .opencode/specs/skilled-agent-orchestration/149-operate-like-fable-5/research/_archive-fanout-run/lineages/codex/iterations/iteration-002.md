# Iteration 2: Map Existing Agent Surfaces

## Focus

This iteration checked whether current agent definitions already encode Fable 5 style evidence, verification, and accountability behaviors.

## Findings

1. Confirmed: The deep-research agent already requires evidence-bound output before completion, including iteration file existence, JSONL append verification, and cited findings. [SOURCE: .opencode/agents/deep-research.md:40] [SOURCE: .opencode/agents/deep-research.md:495]
2. Confirmed: The deep-research agent already has a freshness rule that prefers exact anchors before broad rereads and requires narrow rereads when a blocker or contradiction needs verification. [SOURCE: .opencode/agents/deep-research.md:42]
3. Confirmed: The @code agent has the strongest implementation-side gate: it must invoke sk-code, implement within packet scope, run the returned verification command, and return structured evidence. [SOURCE: .opencode/agents/code.md:59] [SOURCE: .opencode/agents/code.md:61]
4. Confirmed: The @code agent explicitly blocks completion claims without fresh verification evidence and requires final-file, command, test, or runtime evidence for Builder/Critic/Verifier concerns. [SOURCE: .opencode/agents/code.md:398] [SOURCE: .opencode/agents/code.md:478]
5. Confirmed: The orchestrator owns quality evaluation and is the single point of accountability for child outputs, but its output review is less explicit than Fable 5 about confirmed vs inferred labels. [SOURCE: .opencode/agents/orchestrate.md:24] [SOURCE: .opencode/agents/orchestrate.md:28] [SOURCE: .opencode/agents/orchestrate.md:512]
6. Confirmed: The orchestrator preserves strongest active blockers and avoids softening unresolved contradictions, which aligns with Fable 5's warning that findings remain hypotheses until checked. [SOURCE: .opencode/agents/orchestrate.md:547] [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:15]

## Ruled Out

- A deep-research-only implementation is ruled out. @code and orchestrate own essential completion and evaluation gates, so changes limited to deep-research would leave implementation handoffs under-specified. [SOURCE: .opencode/agents/code.md:398] [SOURCE: .opencode/agents/orchestrate.md:547]

## Dead Ends

- Searching for a single existing "Fable 5" implementation found only this target packet. The doctrine is present as an external input, not as an existing framework primitive. [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:1]

## Edge Cases

- Ambiguous input: The runtime has OpenCode and Codex mirrors. I treated `.opencode/agents/*.md` as canonical for OpenCode and `.codex/agents/*.toml` as active Codex mirrors because the agent docs state runtime path conventions. [SOURCE: .opencode/agents/orchestrate.md:34] [SOURCE: .codex/agents/orchestrate.toml:28]
- Contradictory evidence: none.
- Missing dependencies: code graph unavailable, so exact `rg` and file reads were used.
- Partial success: no.

## Sources Consulted

- `.opencode/agents/deep-research.md:40`
- `.opencode/agents/deep-research.md:42`
- `.opencode/agents/deep-research.md:495`
- `.opencode/agents/code.md:59`
- `.opencode/agents/code.md:61`
- `.opencode/agents/code.md:398`
- `.opencode/agents/code.md:478`
- `.opencode/agents/orchestrate.md:24`
- `.opencode/agents/orchestrate.md:28`
- `.opencode/agents/orchestrate.md:512`
- `.opencode/agents/orchestrate.md:547`

## Assessment

- New information ratio: 0.72.
- Questions addressed: Which current surfaces already implement parts of it? Where are the gaps?
- Questions answered: Which current surfaces already implement parts of it?
- Confidence: high for the surface map; medium for gap ranking because implementation tests were not run.

## Reflection

- What worked and why: Agent docs exposed concrete enforcement points with line-level anchors.
- What did not work and why: Searching by "Fable" alone was too narrow because current contracts express the same ideas without that label.
- What I would do differently: During implementation planning, search for test fixtures that assert these contracts.

## Recommended Next Focus

Inspect workflow and fan-out mechanics for enforcement points and boundary risks.
