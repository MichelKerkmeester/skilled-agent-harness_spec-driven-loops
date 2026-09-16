#!/bin/zsh
# Two-lane deep research on what a .opencode -> .skilled source-root move would touch.
# Lane luna: cli-codex gpt-5.6-luna, xhigh reasoning, fast tier, 10 iterations.
# Lane deepseek: cli-devin deepseek-v4-1-flash-max, 5 iterations.
# Different model families, so agreement between the lanes is corroboration rather
# than the same opinion twice. Early convergence is off: the operator asked for
# these exact iteration counts.
cd /Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration
P=specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/001-deep-research
TOPIC="$(cat $P/scratch/topic.txt)"
exec node .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs \
  --spec-folder "$P" \
  --loop-type research \
  --research-topic "$TOPIC" \
  --fanout-config-json '{"executors":[{"label":"luna","kind":"cli-codex","model":"gpt-5.6-luna","reasoningEffort":"xhigh","serviceTier":"fast","timeoutSeconds":3600,"iterations":10},{"label":"deepseek","kind":"cli-devin","model":"deepseek-v4-1-flash-max","timeoutSeconds":3600,"iterations":5}],"concurrency":2}' \
  --base-artifact-dir "$P/research" \
  --convergence-threshold 3 --stop-policy max-iterations
