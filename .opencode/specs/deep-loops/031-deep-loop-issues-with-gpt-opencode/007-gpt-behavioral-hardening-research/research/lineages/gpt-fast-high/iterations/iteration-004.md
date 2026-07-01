# Iteration 4: ai-council Mode Conversion Risk

## Focus
KQ3 whether `ai-council` should convert to subagent-only.

## Findings
- `ai-council` is currently `mode: all`, not subagent-only [SOURCE: .opencode/agents/ai-council.md:1-5].
- The council intentionally dispatches seats at Depth 0 and switches to inline sequential thinking at Depth 1 [SOURCE: .opencode/agents/ai-council.md:53-58].
- Prior research explicitly preserved council dual reachability, with `deep.md` referencing council without converting it [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/research.md:55-58].

## Sources Consulted
Council agent and predecessor research.

## Assessment
newInfoRatio: 0.76. Conversion risk is concrete: direct multi-seat council would break or lose its intended shape.

## Reflection
Ruled out immediate subagent-only conversion.

## Recommended Next Focus
Find the smallest orchestrate hardening that avoids duplicate routing judgment.
