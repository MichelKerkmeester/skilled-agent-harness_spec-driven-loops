# Iteration 18: Claude Flexibility Preservation

## Focus
Avoid over-constraining Claude.

## Findings
- Prior research found route headers and `Deep Route:` field preserve planning, evidence response, and advisory metadata [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/research/research.md:129-140].
- `deep.md` itself states its boundaries preserve dynamic pre-dispatch planning and leaf evidence response [SOURCE: .opencode/agents/deep.md:59].
- Keeping `ai-council` `mode: all` preserves direct council behavior for Claude and OpenCode users.

## Sources Consulted
Predecessor research and deep router.

## Assessment
newInfoRatio: 0.28. Confirms route-unification can be additive rather than restrictive.

## Reflection
Avoid using GPT hardening as an excuse to remove useful direct paths.

## Recommended Next Focus
Refine failure taxonomy.
