#!/usr/bin/env bash
# Sweeps a non-holdout corpus (arg 1) and prints, by row id only, each row where the
# first passing recommendation is not row 0, with that head's command under the
# top-only request and under the every-row request. Prompts are never printed.
set -uo pipefail
cd /Users/michelkerkmeester/worktrees/public/352-command-surfacing-research || exit 2
call() {
  env -u AI_SESSION_CHILD node .skilled/bin/skill-advisor.cjs advisor_recommend \
    --json "$(jq -nc --arg p "$1" --argjson t "$2" '{prompt:$p,options:{topK:3,includeCompiledRoute:true,compiledRouteTopOnly:$t}}')" --format json 2>/dev/null
}
n=0; lead=0; lost=0
while IFS=$'\t' read -r id prompt; do
  n=$((n+1))
  a=$(call "$prompt" true | jq -c '.data.recommendations | to_entries | map(select(.value.confidence >= 0.8 and .value.uncertainty <= 0.35)) | first | {i: .key, s: .value.skillId, c: (.value.command // null)}')
  idx=$(jq -r '.i' <<<"$a")
  if [ "$idx" != "0" ] && [ "$idx" != "null" ]; then
    lead=$((lead+1))
    b=$(call "$prompt" false | jq -c '.data.recommendations | to_entries | map(select(.value.confidence >= 0.8 and .value.uncertainty <= 0.35)) | first | {i: .key, s: .value.skillId, c: (.value.command // null)}')
    [ "$(jq -r .c <<<"$a")" != "$(jq -r .c <<<"$b")" ] && lost=$((lost+1))
    echo "$id topOnly=$a every=$b"
  fi
done < <(jq -r '[.id, .prompt] | @tsv' "$1")
echo "rows=$n headNotRow0=$lead commandDiffers=$lost"
