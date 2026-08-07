# Iteration 21: Route-Proof Validator Adequacy

## Focus
Can benchmark rely on validator outputs?

## Findings
- Required route-proof fields are `mode`, `target_agent`, `agent_definition_loaded`, and `resolved_route` [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:626].
- Validator fails closed on missing or mismatched fields [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:628-663].
- Remaining risk is not validation logic; it is whether each mode emits consistent route-proof values.

## Sources Consulted
Post-dispatch validator.

## Assessment
newInfoRatio: 0.22. Confirms route-proof validator is acceptable for phase 008.

## Reflection
Focus repairs on emission consistency.

## Recommended Next Focus
Pin council naming fix.
