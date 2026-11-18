#!/usr/bin/env bash
# For each prompt, compares the first passing row (0.8/0.35) with and without
# compiledRouteTopOnly, the option every hook and the OpenCode plugin send.
set -uo pipefail
cd /Users/michelkerkmeester/worktrees/public/352-command-surfacing-research || exit 2
head() {
  env -u AI_SESSION_CHILD node .skilled/bin/skill-advisor.cjs advisor_recommend \
    --json "$(jq -nc --arg p "$1" --argjson t "$2" '{prompt:$p,options:{topK:3,includeCompiledRoute:true,compiledRouteTopOnly:$t}}')" --format json 2>/dev/null \
    | jq -c '.data.recommendations as $r | ($r | to_entries | map(select(.value.confidence >= 0.8 and .value.uncertainty <= 0.35)) | first) as $h
      | {row0pass: (($r[0].confidence // 0) >= 0.8 and ($r[0].uncertainty // 1) <= 0.35), headIndex: $h.key, head: $h.value.skillId, cmd: ($h.value.command // null)}'
}
for p in "$@"; do
  printf '%s\n  topOnly=%s\n  every  =%s\n' "$p" "$(head "$p" true)" "$(head "$p" false)"
done
