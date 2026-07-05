# Iteration 22: Mixed Salvage Retry Classification

## Focus

Check whether mixed salvage is still misclassified.

## Findings

- GLM still reports mixed salvage/missing-artifact failures as active. [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/glm/deep-review-findings-registry.json:33] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/glm/deep-review-findings-registry.json:38]
- Current `cli-guards.cjs` has an explicit branch for mixed salvage that sets `ARTIFACT_MISS` and makes it retryable. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs:177] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs:185] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs:188] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs:191]

## Novelty

newInfoRatio: 0.29. Fixed code, stale registry.
