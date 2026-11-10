#!/usr/bin/env bash
# R3.2: run the real rule engine with correct vs mismatched context cwd.
set -u
R="/Users/michelkerkmeester/worktrees/public/048-crawlable-commit-history"
B="$R/.opencode/specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures/research/lineages/deepseek/scratch/it3-advisory"
E="$B/evaluate.mjs"
W="$B/wt1"
M="$B/main"
node "$E" "git add w1.txt w2.txt w3.txt" "$W" "case 1: context cwd == command cwd (worktree)"
echo ""
node "$E" "git add w1.txt w2.txt w3.txt" "$M" "case 2: context cwd = main checkout, paths exist only in the worktree"
echo ""
node "$E" "git -C $W add w1.txt w2.txt w3.txt" "$M" "case 3: -C target exists, but the parser drops -C and reads state from ctx.cwd"
echo ""
node "$E" "cd $W && git add w1.txt w2.txt w3.txt" "$M" "case 4: inner cd ignored, state read from ctx.cwd"
echo ""
node "$E" "git -C $W add w1.txt w2.txt w3.txt" "$W" "case 5: -C happens to point at ctx.cwd (no fire)"
