#!/bin/bash
cd "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
P="specs/system-speckit/033-system-speckit-v4/036-goal-unification/007-retirement-docs-and-verification"
exec node .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs \
  --spec-folder "$P" \
  --loop-type review \
  --stop-policy max-iterations \
  --convergence-threshold 0.05 \
  --fanout-config-json '{"assignment_model":"flat_pool","concurrency":1,"maxRetries":3,"executors":[{"label":"deepseek-review","kind":"cli-pi","model":"deepseek-v4.1-flash","reasoningEffort":"max","count":1,"iterations":3,"timeoutSeconds":3600}]}' \
  --base-artifact-dir "$P/review"
