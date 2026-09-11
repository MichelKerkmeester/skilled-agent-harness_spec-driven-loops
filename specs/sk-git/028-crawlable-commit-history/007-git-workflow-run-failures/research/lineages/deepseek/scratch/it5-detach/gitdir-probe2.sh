#!/usr/bin/env bash
# R5.3b: GIT_DIR override with a normal .git directory.
set -u
B="/Users/michelkerkmeester/worktrees/public/048-crawlable-commit-history/.opencode/specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures/research/lineages/deepseek/scratch/it5-detach"
export GIT_CONFIG_GLOBAL="$B/gitconfig"
export GIT_CONFIG_NOSYSTEM=1
for name in repoA repoB; do
  rm -rf "$B/$name"
  mkdir -p "$B/$name"
  git -C "$B/$name" init -q -b main
done
echo "normal toplevel from repoB:      $(git -C "$B/repoB" rev-parse --show-toplevel)"
echo "with GIT_DIR=repoA/.git from B:  $(GIT_DIR="$B/repoA/.git" git -C "$B/repoB" rev-parse --show-toplevel)"
echo "with GIT_DIR=repoA/.git no -C:   $(cd "$B/repoB" && GIT_DIR="$B/repoA/.git" git rev-parse --show-toplevel)"
