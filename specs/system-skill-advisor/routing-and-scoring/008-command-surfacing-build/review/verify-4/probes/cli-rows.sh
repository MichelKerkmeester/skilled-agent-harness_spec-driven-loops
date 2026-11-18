#!/usr/bin/env bash
# Prints the first three public rows (skill, command, policy) the advisor CLI returns per prompt.
set -uo pipefail
cd /Users/michelkerkmeester/worktrees/public/352-command-surfacing-research || exit 2
for p in "$@"; do
  printf '%s => ' "$p"
  env -u AI_SESSION_CHILD node .skilled/bin/skill-advisor.cjs advisor_recommend \
    --json "$(jq -nc --arg p "$p" '{prompt:$p}')" --format json 2>/dev/null \
    | jq -c '[.data.recommendations[0:3][] | [.skillId, (.command // "-"), (.policy // "-")]]'
done
