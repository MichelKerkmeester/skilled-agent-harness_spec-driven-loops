# Iteration 11: Adversarial Check - ai-council Direct Mode

## Focus
Stress-test KQ3 recommendation.

## Findings
- Council Depth 0 explicitly dispatches council seats via Task when available [SOURCE: .opencode/agents/ai-council.md:55-58].
- The agent is scoped-write to packet-local `ai-council/**`, which is compatible with direct planning use cases [SOURCE: .opencode/agents/ai-council.md:25-29].

## Sources Consulted
Council agent.

## Assessment
newInfoRatio: 0.42. Low-moderate novelty; strengthens the recommendation not to convert council wholesale.

## Reflection
Direct invocation is a real capability, not historical baggage.

## Recommended Next Focus
Check council route-proof naming consistency.
