# Iteration 19: Sandbox Write Boundary

## Focus

Inspect detached CLI write isolation.

## Findings

- `fanout-run.cjs` states lineage write isolation is enforced by the prompt rather than a narrower sandbox, because the CLIs need to write into `lineageDir`. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1304] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1308] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1309]
- The command-building path for native lineages uses `--dangerously-skip-permissions`; `cli-opencode` uses `--pure` and `--dir`, but the isolation note still says prompt is the boundary. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1076] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1080] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1100]

## Novelty

newInfoRatio: 0.57. Security risk remains if a detached lineage ignores instructions.
