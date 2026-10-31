#!/bin/zsh
# usage: batch.sh <list-file>; each line: NN executor persona name target
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
P=specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move/scratch/w3-build
D=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/13974574-59f7-48b5-b4cd-aa93ca9ca737/scratchpad/w3/dispatch.sh
while read -r n ex persona name target; do
  [ -z "$n" ] && continue
  echo "===== brief $n ($ex) $target"
  git status --porcelain > $P/runs/gs-pre.txt
  python3 $P/runs/assemble.py $persona $P/briefs/$n.body.md $P/briefs/$n-$name.md || { echo "ASSEMBLE FAIL $n"; continue; }
  bash $D $ex $P/briefs/$n-$name.md $P/logs/$n
  $P/runs/verify.sh $n - x
  echo "numstat: $(git diff --numstat -- $target)"
done < $1
