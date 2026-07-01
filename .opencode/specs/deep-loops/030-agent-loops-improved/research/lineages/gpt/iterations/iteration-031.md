# Iteration 31: Backlog Deduplication

## Focus

Separate fixed, stale-active, and live-open items for final ranking.

## Findings

- Fixed: merge-schema alias handling in `fanout-merge.cjs`. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:531] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:533]
- Stale-active: GLM/Codex registries still list issues that current code or docs appear to have fixed, requiring adjudication rather than blind reimplementation. [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/glm/deep-review-findings-registry.json:18] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/codex/deep-review-findings-registry.json:11]

## Novelty

newInfoRatio: 0.18. Dedupe changed priority but not symptom count.
