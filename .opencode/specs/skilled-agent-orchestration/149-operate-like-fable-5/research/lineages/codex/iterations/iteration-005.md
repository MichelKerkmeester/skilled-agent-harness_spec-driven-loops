# Iteration 5: Verification Gates And Convergence

## Focus

This iteration consolidated acceptance criteria and stopped the loop once all key questions had evidence-backed answers.

## Findings

1. Confirmed: Fable 5 requires rerunning the whole gate after each step and reporting the delta, not merely checking a narrowed subset. [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:13]
2. Confirmed: @code already has a pre-return verification checklist requiring edited files to be reread, verification commands to run, file citations to match final contents, and truthful escalation when evidence requires it. [SOURCE: .opencode/agents/code.md:398] [SOURCE: .opencode/agents/code.md:402] [SOURCE: .opencode/agents/code.md:408]
3. Confirmed: Orchestrate already has a mandatory post-execution output review checklist, but a Fable 5 implementation should make confirmed/inferred claim classification explicit in that checklist. [SOURCE: .opencode/agents/orchestrate.md:512] [SOURCE: .opencode/agents/orchestrate.md:576]
4. Confirmed: Deep-loop post-dispatch validation is the right enforcement layer for iteration artifacts because it already checks files, JSONL fields, deltas, and executor provenance. [SOURCE: .opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:753] [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:615]

## Ruled Out

- Claiming compliance through prompt changes only is ruled out. Fable 5 requires real gates, baseline deltas, and verification evidence. [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:9] [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:13]
- Continuing to 10 iterations is ruled out. All five key questions are answered and iteration 5 added only low novelty consolidation; the deep-research stop contract nominates STOP when all key questions have evidence-backed answers. [SOURCE: .opencode/skills/deep-research/references/convergence/convergence.md:91]

## Dead Ends

- A "confidence score only" acceptance gate was eliminated. The source requires named evidence and explicit uncertainty, not only numeric confidence. [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:7]

## Edge Cases

- Ambiguous input: none remaining.
- Contradictory evidence: none.
- Missing dependencies: live code graph was unavailable, so structural claims were limited to files inspected with `rg` and direct reads.
- Partial success: no.

## Sources Consulted

- `.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:7`
- `.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:9`
- `.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:13`
- `.opencode/agents/code.md:398`
- `.opencode/agents/code.md:402`
- `.opencode/agents/code.md:408`
- `.opencode/agents/orchestrate.md:512`
- `.opencode/agents/orchestrate.md:576`
- `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:753`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:615`
- `.opencode/skills/deep-research/references/convergence/convergence.md:91`

## Assessment

- New information ratio: 0.08.
- Questions addressed: What verification gates prove the behavior?
- Questions answered: What verification gates prove the behavior?
- Confidence: high for convergence because all five key questions now have cited answers.

## Reflection

- What worked and why: Consolidating proof obligations made the implementation plan testable.
- What did not work and why: More source gathering had diminishing returns because the local contracts already named the relevant enforcement points.
- What I would do differently: A future planning pass should turn the acceptance gates into concrete test names and expected failure modes.

## Recommended Next Focus

Move to implementation planning with the shared evidence contract as the center of gravity.
