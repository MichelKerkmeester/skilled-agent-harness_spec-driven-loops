# Iteration 20: Lag-Ceiling Observability

## Focus

Reconcile GLM active finding against current code.

## Findings

- GLM still reports lag-ceiling observability as active. [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/glm/deep-review-findings-registry.json:83] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/glm/deep-review-findings-registry.json:88]
- Current `statusForLedgerEvent` maps `lag_ceiling_exceeded` to `warning` or `failed` and `lag_ceiling_abort` to `failed`, so the code appears fixed but the registry was not adjudicated. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:254] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:256] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:257]

## Novelty

newInfoRatio: 0.32. Another stale-active registry case.
