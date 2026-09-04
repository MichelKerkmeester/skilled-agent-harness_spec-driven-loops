#!/bin/zsh
cd /Users/michelkerkmeester/worktrees/public/044-zvec-grep-integration
exec node .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs \
  --spec-folder .opencode/specs/system-speckit/053-spec-kit-runtime-rename \
  --loop-type review \
  --fanout-config-json '{"executors":[{"label":"luna-max-pass3","kind":"cli-codex","model":"gpt-5.6-luna","reasoningEffort":"max","serviceTier":"fast","timeoutSeconds":1800,"iterations":10}],"concurrency":1}' \
  --base-artifact-dir .opencode/specs/system-speckit/053-spec-kit-runtime-rename/review \
  --convergence-threshold 3 --stop-policy max-iterations
