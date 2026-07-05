# Iteration 17: Stop Policy Operator Surface

## Focus

Determine whether forced-depth is first-class and documented.

## Findings

- `/deep:research` argument routing lists many flags but does not list `--stop-policy`, even though this run requires `stopPolicy=max-iterations`. [SOURCE: .opencode/commands/deep/research.md:111] [SOURCE: .opencode/commands/deep/research.md:112]
- `fanout-run.cjs` can include `config.stopPolicy` in the prompt and changes the stop clause when policy is `max-iterations`. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:782] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:783] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:794]

## Novelty

newInfoRatio: 0.52. Stop policy exists internally but is not fully operator-facing for research.
