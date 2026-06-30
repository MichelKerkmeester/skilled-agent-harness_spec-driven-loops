#!/bin/bash
R="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/anobel.com/005-glm-visual-refinement/reviews"
runone(){ IFS='|' read -r folder mkey slug variant <<<"$1"; out="$R/$folder/review-$mkey.md"
  [ -s "$out" ] && [ "$(wc -c <"$out")" -gt 200 ] && ! grep -q 'NO TEXT' "$out" && { echo "skip $folder/$mkey"; return; }
  node "$R/review-iter.mjs" "$slug" "$variant" "$R/prompts/$folder.txt" "$out"; }
export -f runone; export R
cat "$R/jobs.txt" | xargs -P 6 -I{} bash -c 'runone "$@"' _ {}
echo "REVIEWS_DONE $(date '+%H:%M:%S')"
