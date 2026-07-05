# Iteration 21: Playbook Regression Evidence

## Focus

Inspect the fanout manual playbook claim.

## Findings

- GLM registry still marks the fan-out playbook exit-0/no-artifact coverage finding active. [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/glm/deep-review-findings-registry.json:53] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/glm/deep-review-findings-registry.json:58]
- Current playbook now requires the exact exit-0/no-artifact invariant and names the assertion that must remain present. [SOURCE: .opencode/skills/deep-loop-runtime/manual_testing_playbook/09--fanout/fanout-salvage-recovery.md:86] [SOURCE: .opencode/skills/deep-loop-runtime/manual_testing_playbook/09--fanout/fanout-salvage-recovery.md:97]

## Novelty

newInfoRatio: 0.31. The playbook appears fixed, but review registry status remains stale.
