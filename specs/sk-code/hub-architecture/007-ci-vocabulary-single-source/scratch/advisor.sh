#!/usr/bin/env bash
# Prints the advisor's top two skills for fixed prompts, in-domain and out-of-domain.
# Usage: advisor.sh > out.txt, from the repository root. Run before and after the signal write, then diff.
set -uo pipefail
while IFS= read -r prompt; do
  [ -n "$prompt" ] || continue
  printf '%s => ' "$prompt"
  node .skilled/bin/skill-advisor.cjs advisor_recommend --json "$(node -e 'console.log(JSON.stringify({prompt:process.argv[1]}))' "$prompt")" --format json 2>/dev/null \
    | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);const r=(j.recommendations||j.data&&j.data.recommendations||j.results||[]).slice(0,2).map(x=>(x.skill||x.skillId||x.id)+":"+Number(x.confidence).toFixed(2));console.log(r.join(" ")||"none")}catch(e){console.log("unparsed "+s.slice(0,120))}})'
done <<'P'
rebuild the trigger index
run a trigger-index rebuild after editing the spec docs
build a strategy matrix for the product pricing review
set fail-fast: false on the strategy matrix in the workflow
explain the ruleset context for our branch protection
choose an actions cache key for bun install in ci
add permissions: contents: read to the workflow
add an actions concurrency group so pushes cancel older runs
write a research summary of caching strategies
fix a typescript bug in the opencode plugin
P
