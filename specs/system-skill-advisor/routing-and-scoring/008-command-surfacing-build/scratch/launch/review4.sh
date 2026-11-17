#!/bin/bash
# Review pass four of the command-surfacing packet: the code changed since pass three (0cdc9fa3ef),
# phases 019 to 024 and the merge, scoped in review/review-scope-4.txt. Four lineages, one per
# code area, the same shape as pass three, executor DeepSeek v4.1 flash max on OpenCode Go.
# The coordinator checklist in review1.sh (merge, synthesis, convergence record) applies after the runner exits.
W=/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research
SF=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build
R=$SF/review
cd $W || exit 2
CFG='{"executors":[{"kind":"cli-opencode","model":"opencode-go/deepseek-v4.1-flash","reasoningEffort":"max","iterations":4,"label":"scorer-attach-4","count":1},{"kind":"cli-opencode","model":"opencode-go/deepseek-v4.1-flash","reasoningEffort":"max","iterations":4,"label":"render-hooks-plugin-4","count":1},{"kind":"cli-opencode","model":"opencode-go/deepseek-v4.1-flash","reasoningEffort":"max","iterations":4,"label":"accuracy-runner-4","count":1},{"kind":"cli-opencode","model":"opencode-go/deepseek-v4.1-flash","reasoningEffort":"max","iterations":3,"label":"doctor-docs-4","count":1}],"concurrency":4}'
printf '%s\n' "$CFG" > $R/deep-review-fanout-config-pass-4.json
node .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs \
  --spec-folder $SF --loop-type review \
  --review-target $SF --review-target-type spec-folder \
  --review-focus "$(cat $SF/scratch/launch/review-topic4.txt)" \
  --fanout-config-json "$CFG" \
  --base-artifact-dir $R \
  --convergence-threshold 0.10 --stop-policy convergence --convergence-mode default
echo "fanout exit=$?"
