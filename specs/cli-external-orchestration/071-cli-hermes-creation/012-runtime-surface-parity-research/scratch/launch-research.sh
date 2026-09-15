#!/bin/bash
cd "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
P="specs/cli-external-orchestration/071-cli-hermes-creation/012-runtime-surface-parity-research"
exec node .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs \
  --spec-folder "$P" \
  --loop-type research \
  --stop-policy max-iterations \
  --convergence-threshold 0.05 \
  --research-topic "Runtime surface parity across the seven runtimes: commands, skills, agents, goal and hooks. Devin carries zero of the 46 authored commands and no skills mirror; three runtimes have no skills surface and three have no goal adapter. Follow the charter at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/cli-external-orchestration/071-cli-hermes-creation/012-runtime-surface-parity-research/research/deep-research-strategy.md exactly, one angle per iteration for ten iterations, no early synthesis. Research only; write nothing outside the lineage directory." \
  --fanout-config-json '{"assignment_model":"flat_pool","concurrency":1,"maxRetries":3,"executors":[{"label":"deepseek","kind":"cli-pi","model":"deepseek-v4.1-flash","reasoningEffort":"max","count":1,"iterations":10,"timeoutSeconds":1800}]}' \
  --base-artifact-dir "$P/research"
