# Iteration 1: Translate Fable 5 Into Enforceable Requirements

## Focus

This iteration treated `external/Fable5.md` as the source of truth and translated it into workflow requirements for skilled-agent orchestration.

## Findings

1. Confirmed: Fable 5 requires every load-bearing claim to be marked as confirmed or inferred, with confirmed claims naming the evidence and inferred claims naming what would verify them. [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:7]
2. Confirmed: Completion language requires more than a compile or build; the agent must run or observe the real path before claiming it works. [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:9]
3. Confirmed: "No regressions" requires a recorded baseline with starting pass/fail counts and failing test names. [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:11]
4. Confirmed: Agent and reviewer outputs are hypotheses until their cited evidence is re-opened or their gates are rerun. [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:15]
5. Confirmed: Scope and rollback discipline are explicit parts of the doctrine: stay in scope, stage only touched files, and name rollback before irreversible actions. [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:19] [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:21]

## Ruled Out

- Treating Fable 5 as tone-only guidance is ruled out. The source contains operational constraints about baselines, rerunning gates, rollback, scope, and verifying subagent claims. [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:7]

## Dead Ends

- Searching for a hidden conventional spec packet was not productive; the target folder currently exposes only the external doctrine and fan-out logs. [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/research/_fanout-run.log:1]

## Edge Cases

- Ambiguous input: "Operate like Fable 5" could mean voice only or workflow behavior. I selected workflow behavior because the document begins with "how to think, decide, build, and communicate" and then lists verification and safety obligations. [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:1]
- Contradictory evidence: none.
- Missing dependencies: no `resource-map.md` or conventional spec docs were present.
- Partial success: none.

## Sources Consulted

- `.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:1`
- `.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:7`
- `.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:9`
- `.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:11`
- `.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:15`
- `.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:19`
- `.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:21`

## Assessment

- New information ratio: 0.95.
- Questions addressed: What does Fable 5 require in operational terms?
- Questions answered: What does Fable 5 require in operational terms?
- Confidence: high for the requirements extraction because it is directly grounded in the external file.

## Reflection

- What worked and why: Starting with the external doctrine worked because the document is compact and imperative.
- What did not work and why: Looking for a larger packet context did not work because only external source and fan-out logs exist.
- What I would do differently: In a full implementation packet, create `spec.md` first so the research can map requirements into acceptance criteria.

## Recommended Next Focus

Map current agent and workflow surfaces that already encode these requirements.
