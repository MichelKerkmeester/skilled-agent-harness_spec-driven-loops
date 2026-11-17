#!/bin/bash
# Confirming round of review pass four over the fix commit, two lineages, DeepSeek v4.1 flash max on OpenCode Go.
W=/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research
SF=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build
R=$SF/review
cd $W || exit 2
node .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs \
  --spec-folder $SF --loop-type review \
  --review-target $SF --review-target-type spec-folder \
  --review-focus "$(cat $SF/scratch/launch/review-topic4b.txt)" \
  --fanout-config-json "$(cat $R/deep-review-fanout-config-pass-4b.json)" \
  --base-artifact-dir $R \
  --convergence-threshold 0.10 --stop-policy convergence --convergence-mode default
echo "fanout exit=$?"
