#!/bin/zsh
# Two-lane deep research producing per-runtime symlink and stale-path maps.
# Lane swe2: cli-devin swe-2-max, up to 10 iterations.
# Lane deepseek-pi: cli-pi deepseek-v4.1-flash through the LLM Gateway, thinking pinned to max, up to 10 iterations.
# Convergence is allowed, so no stop policy is forced. The convergence threshold is left
# at the research default because under a convergence policy it is a newInfoRatio, and a
# value above 1 would end a lane at its first legal check.
cd /Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration
P=specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/002-per-runtime-reference-map
TOPIC="$(cat $P/scratch/topic.txt)"
exec node .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs \
  --spec-folder "$P" \
  --loop-type research \
  --research-topic "$TOPIC" \
  --fanout-config-json '{"executors":[{"label":"swe2","kind":"cli-devin","model":"swe-2-max","timeoutSeconds":3600,"iterations":10},{"label":"deepseek-pi","kind":"cli-pi","model":"deepseek-v4.1-flash","reasoningEffort":"max","timeoutSeconds":3600,"iterations":10}],"concurrency":2}' \
  --base-artifact-dir "$P/research"
