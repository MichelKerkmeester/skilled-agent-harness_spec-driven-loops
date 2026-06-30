#!/bin/bash
SPEC="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/anobel.com/004-bento-visuals"
cd "$SPEC/.." 2>/dev/null
printf '%s\n' 1 2 3 4 5 6 7 | xargs -P 3 -I{} node "$SPEC/research/research-iter.mjs" "$SPEC/research/prompts/round1-A{}.txt" "$SPEC/research/iterations/iter-r1-A{}.md"
echo "ROUND1_DONE $(date '+%H:%M:%S')"
