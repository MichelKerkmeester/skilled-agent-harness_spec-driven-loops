#!/usr/bin/env bash
# R3.3: false-silence direction — same command, state in the worktree, context in main.
set -u
R="/Users/michelkerkmeester/worktrees/public/048-crawlable-commit-history"
B="$R/.opencode/specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures/research/lineages/deepseek/scratch/it3-advisory"
E="$B/evaluate.mjs"
W="$B/wt1"
M="$B/main"
cd "$W" || exit 9
printf 'uncommitted worktree edit\n' >> w1.txt
node "$E" "git reset --hard" "$W" "case 6: context cwd == worktree (dirty) — warning fires"
echo ""
node "$E" "git reset --hard" "$M" "case 7: context cwd = main (clean) — warning SILENCED for the dirty worktree"
echo ""
node "$E" "git add -u" "$M" "case 8: context cwd = main (no untracked) vs worktree untracked present"
echo "worktree untracked count: $(git status --porcelain | grep -c '^??')"
