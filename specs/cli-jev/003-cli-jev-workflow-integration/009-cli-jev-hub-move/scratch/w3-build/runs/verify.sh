#!/bin/zsh
# usage: verify.sh <NN> <attach-name-or-> <target> [source]
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
P=specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move/scratch/w3-build
echo "--- handback $1"; sed -n '/^STATUS/,$p' $P/logs/$1.last.txt | head -20
grep -i -E "error|unauthor|quota|question|which option" $P/logs/$1.last.txt | head -3
git status --porcelain > $P/runs/gs-post.txt
echo "--- tree delta"; diff $P/runs/gs-pre.txt $P/runs/gs-post.txt
if [ "$2" != "-" ]; then cmp $P/attach/$2 $3 && echo "CMP-OK $3"; fi
if [ -n "$4" ]; then test ! -e $4 && echo "SRC-GONE $4"; fi
cp $P/runs/gs-post.txt $P/runs/gs-pre.txt
