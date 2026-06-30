#!/bin/bash
SPEC="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/anobel.com/004-bento-visuals"
printf '%s\n' 1 3 4 5 | xargs -P 2 -I{} node "$SPEC/research/research-iter.mjs" "$SPEC/research/prompts/round3-A{}.txt" "$SPEC/research/iterations/iter-r3-A{}.md"
echo "ROUND3_DONE $(date '+%H:%M:%S')"
