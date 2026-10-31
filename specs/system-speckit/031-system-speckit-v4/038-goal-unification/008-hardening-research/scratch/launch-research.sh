#!/bin/bash
cd "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
P="specs/system-speckit/033-system-speckit-v4/036-goal-unification/008-hardening-research"
exec node .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs \
  --spec-folder "$P" \
  --loop-type research \
  --stop-policy max-iterations \
  --convergence-threshold 0.05 \
  --research-topic "Goal unification hardening: find what makes the shipped packet-bound goal system more robust, better integrated, easier for the operator, and smaller. Follow the charter at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-speckit/033-system-speckit-v4/036-goal-unification/008-hardening-research/research/deep-research-strategy.md exactly, one angle per iteration for five iterations. Research only; write nothing outside the lineage directory." \
  --fanout-config-json '{"assignment_model":"flat_pool","concurrency":1,"maxRetries":3,"executors":[{"label":"deepseek","kind":"cli-pi","model":"deepseek-v4.1-flash","reasoningEffort":"max","count":1,"iterations":5,"timeoutSeconds":3600}]}' \
  --base-artifact-dir "$P/research"
