# Iteration 12: Council Route-Proof Naming Mismatch

## Focus
Council route-proof details.

## Findings
- Council prompt and executor context use `mode=ai-council; target_agent=@ai-council` [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-session.cjs:24-27].
- The YAML post-dispatch validator expects `mode: council`, `target_agent: deep-ai-council`, and `Resolved route: mode=council target_agent=deep-ai-council` [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:128-137].
- `orchestrate-topic.cjs` appends the same `council/deep-ai-council` route-proof record [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs:305-314].

## Sources Consulted
Council YAML and scripts.

## Assessment
newInfoRatio: 0.40. This is a concrete pre-smoke repair item.

## Reflection
Ruled out running decisive council smoke before naming alignment.

## Recommended Next Focus
Pin external shell preflight conditions.
