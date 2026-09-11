#!/usr/bin/env bash
# R4.1 prep: throwaway repo with a packet, a lineage dir, and orchestrator-owned paths.
set -u
R="/Users/michelkerkmeester/worktrees/public/048-crawlable-commit-history"
B="$R/.opencode/specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures/research/lineages/deepseek/scratch/it4-containment"
export GIT_CONFIG_GLOBAL="$B/gitconfig" GIT_CONFIG_NOSYSTEM=1
rm -rf "$B/repo"
mkdir -p "$B/repo/specs/x/001-p/research/lineages/deepseek/iterations"
cd "$B/repo" || exit 9
git init -q -b main
printf 'plan v1\n' > specs/x/001-p/plan.md
printf 'spec v1\n' > specs/x/001-p/spec.md
git add -A
git commit -qm "chore(repro): seed packet"
echo "repo ready: $B/repo"
