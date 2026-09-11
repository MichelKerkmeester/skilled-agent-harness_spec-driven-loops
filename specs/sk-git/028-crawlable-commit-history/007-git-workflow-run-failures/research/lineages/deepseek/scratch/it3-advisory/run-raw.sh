#!/usr/bin/env bash
# R3.1: raw git behavior for `add --dry-run` in a linked worktree.
set -u
R="/Users/michelkerkmeester/worktrees/public/048-crawlable-commit-history"
B="$R/.opencode/specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures/research/lineages/deepseek/scratch/it3-advisory"
export GIT_CONFIG_GLOBAL="$B/gitconfig" GIT_CONFIG_NOSYSTEM=1
rm -rf "$B/main" "$B/wt1"
mkdir -p "$B"
git init -q -b main "$B/main"
cd "$B/main" || exit 9
printf 'seed\n' > seed.txt
git add -A
git commit -qm "chore(repro): seed"
git worktree add -q -b wt1 "$B/wt1"
cd "$B/wt1" || exit 9
printf 'w1\n' > w1.txt
printf 'w2\n' > w2.txt
printf 'w3\n' > w3.txt
echo "=== raw: git add --dry-run -- w1.txt w2.txt w3.txt (linked worktree, files exist) ==="
set +e
git add --dry-run -- w1.txt w2.txt w3.txt
echo "dry_run_rc=$?"
echo "=== raw: same from the MAIN checkout (files do not exist there) ==="
cd "$B/main" || exit 9
git add --dry-run -- w1.txt w2.txt w3.txt
echo "dry_run_main_rc=$?"
echo "=== raw: real add from the worktree stages exactly what it named ==="
cd "$B/wt1" || exit 9
git add w1.txt w2.txt w3.txt
git diff --cached --name-only
