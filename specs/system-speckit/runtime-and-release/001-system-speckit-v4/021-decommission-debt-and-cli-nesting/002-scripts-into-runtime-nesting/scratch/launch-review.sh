#!/bin/zsh
cd /Users/michelkerkmeester/worktrees/public/044-zvec-grep-integration
exec node .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs \
  --spec-folder .opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting \
  --loop-type review \
  --fanout-config-json '{"executors":[{"label":"luna-max-review","kind":"cli-codex","model":"gpt-5.6-luna","reasoningEffort":"max","serviceTier":"fast","timeoutSeconds":3600,"iterations":10}],"concurrency":1}' \
  --base-artifact-dir .opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting/review \
  --convergence-threshold 3 --stop-policy max-iterations
