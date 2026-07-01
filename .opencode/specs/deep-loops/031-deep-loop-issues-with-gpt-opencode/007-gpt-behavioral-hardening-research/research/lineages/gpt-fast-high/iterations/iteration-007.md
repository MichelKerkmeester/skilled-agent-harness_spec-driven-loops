# Iteration 7: Benchmark Metric Schema

## Focus
KQ6 GPT-vs-Claude behavioral benchmark.

## Findings
- Research YAML validates iteration file existence, JSONL append, canonical type, delta file, and route-proof fields [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:940-958].
- Review YAML carries equivalent route-proof fields for review mode [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:919-929].
- The validator checks `mode`, `target_agent`, `agent_definition_loaded`, and `resolved_route` exactly [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:619-665].

## Sources Consulted
Research/review YAML and post-dispatch validator.

## Assessment
newInfoRatio: 0.68. Benchmark pass/fail can reuse route-proof outputs instead of inventing new evidence channels.

## Reflection
Ruled out content-only manual review as the primary benchmark gate.

## Recommended Next Focus
Extract the literal-instruction pattern from `deep.md`.
