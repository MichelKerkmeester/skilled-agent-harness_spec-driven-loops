#!/usr/bin/env bash
# R5.3: GIT_* environment overrides change what hooks/scripts think the repo is.
set -u
B="/Users/michelkerkmeester/worktrees/public/048-crawlable-commit-history/.opencode/specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures/research/lineages/deepseek/scratch/it5-detach/repo"
export GIT_CONFIG_GLOBAL="/Users/michelkerkmeester/worktrees/public/048-crawlable-commit-history/.opencode/specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures/research/lineages/deepseek/scratch/it5-detach/gitconfig"
export GIT_CONFIG_NOSYSTEM=1
rm -rf "$B"
mkdir -p "$B"
cd "$B" || exit 9
git init -q -b main
printf 'x\n' > f.txt
git add f.txt
git -c user.email=a@b -c user.name=t commit -qm "chore(repro): seed"
echo "normal toplevel:            $(git rev-parse --show-toplevel)"
echo "GIT_DIR=main-clone override: $(GIT_DIR='/Users/michelkerkmeester/worktrees/public/048-crawlable-commit-history/.git' git rev-parse --show-toplevel 2>&1)"
echo "GIT_INDEX_FILE=trap override: $(GIT_INDEX_FILE='/tmp/does-not-exist' git diff --cached --name-only 2>&1)"
