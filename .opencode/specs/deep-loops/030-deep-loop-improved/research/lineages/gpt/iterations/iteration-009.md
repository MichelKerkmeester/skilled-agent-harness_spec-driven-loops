# Iteration 9: Review Registry Reconciliation

## Focus

Check whether review registries were updated after fixes.

## Findings

- GLM registry still marks multiple findings `active`, including prompt binding, salvage, sandbox, metadata, and merge-readiness issues. [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/glm/deep-review-findings-registry.json:18] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/glm/deep-review-findings-registry.json:28] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/glm/deep-review-findings-registry.json:98]
- Codex registry also remains `in-progress` with active P1 findings after 50 iterations. [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/codex/deep-review-findings-registry.json:5] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/codex/deep-review-findings-registry.json:11] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/codex/deep-review-findings-registry.json:42]

## Novelty

newInfoRatio: 0.76. Registry contents now exist but are stale, not empty.
