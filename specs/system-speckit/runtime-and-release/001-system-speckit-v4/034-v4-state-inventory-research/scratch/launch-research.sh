#!/bin/zsh
# Two-lane deep research: inventory the repository's current state and measure the old v4 changelog draft against it.
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
P=specs/system-speckit/033-system-speckit-v4/034-v4-state-inventory-research
TOPIC="$(cat $P/scratch/topic.txt)"
exec node .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs \
  --spec-folder "$P" \
  --loop-type research \
  --research-topic "$TOPIC" \
  --fanout-config-json '{"executors":[{"label":"luna","kind":"cli-codex","model":"gpt-5.6-luna","reasoningEffort":"xhigh","serviceTier":"fast","timeoutSeconds":3600,"iterations":10},{"label":"deepseek","kind":"cli-devin","model":"deepseek-v4-flash-max","timeoutSeconds":3600,"iterations":10}],"concurrency":2}' \
  --base-artifact-dir "$P/research" \
  --convergence-threshold 3 --stop-policy max-iterations
